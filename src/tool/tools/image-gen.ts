/**
 * Image Generation Tool - Generate images via SAP AI Core image-capable models
 *
 * Uses the existing infrastructure in `src/providers/transform.ts`
 * (`extractImageChunks` + `NormalizedImageChunk`) and the
 * `ModelCapability = 'image-generation'` tag from
 * `src/providers/sapOrchestration.ts` to route a text prompt through an
 * image-capable SAP AI Core deployment and surface the returned image(s)
 * as either hosted URLs or on-disk base64 blobs.
 *
 * The tool ALWAYS validates that the target model advertises
 * `image-generation` before making a call. Unknown / non-image models are
 * rejected up-front instead of paying for a round-trip that would fail
 * server-side.
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import {
  getProviderForModel,
  modelHasCapability,
  type NormalizedImageChunk,
} from '../../providers/index.js';
import { defineTool, type ToolResult } from '../index.js';

const ImageGenParamsSchema = z.object({
  prompt: z.string().min(1).describe('Text prompt describing the image to generate'),
  model: z
    .string()
    .optional()
    .describe(
      'Model id (must advertise the image-generation capability). Defaults to $ALEXI_IMAGE_MODEL or the first known image-gen model.'
    ),
  size: z
    .string()
    .optional()
    .describe('Optional size hint forwarded to the model, e.g. "1024x1024"'),
  outputPath: z
    .string()
    .optional()
    .describe(
      'Optional directory to write decoded base64 images to. Defaults to $TMPDIR/alexi-images.'
    ),
});

/**
 * Result surfaced to the caller for one image generation request.
 *
 * `images` is the ordered list of image payloads returned by the model.
 * Each entry preserves the discriminator from
 * {@link NormalizedImageChunk}:
 *  - `kind: 'url'`  — a hosted URL the caller can render or open.
 *  - `kind: 'base64'` — the raw base64 blob AND an on-disk `path` where
 *    the decoded bytes were written for downstream tooling.
 */
export interface ImageGenResultEntry {
  kind: 'url' | 'base64';
  /** URL when `kind === 'url'`. */
  url?: string;
  /** MIME type (`image/png`, `image/jpeg`, ...) when the model reported one. */
  mimeType?: string;
  /** Absolute path to the decoded blob when `kind === 'base64'`. */
  path?: string;
  /** Byte length of the decoded blob when `kind === 'base64'`. */
  sizeBytes?: number;
}

export interface ImageGenResult {
  model: string;
  prompt: string;
  images: ImageGenResultEntry[];
}

/**
 * Extension for a base64 payload, driven by the reported MIME type. Falls
 * back to `.bin` when the MIME type is missing or unrecognised so callers
 * can still open the raw bytes with an appropriate viewer.
 */
function extensionForMimeType(mimeType: string | undefined): string {
  if (!mimeType) {
    return 'bin';
  }
  const normalised = mimeType.toLowerCase();
  if (normalised.includes('png')) {
    return 'png';
  }
  if (normalised.includes('jpeg') || normalised.includes('jpg')) {
    return 'jpg';
  }
  if (normalised.includes('gif')) {
    return 'gif';
  }
  if (normalised.includes('webp')) {
    return 'webp';
  }
  if (normalised.includes('svg')) {
    return 'svg';
  }
  return 'bin';
}

/**
 * Decode one {@link NormalizedImageChunk} into an {@link ImageGenResultEntry}.
 * For URL chunks this is a straight pass-through; for base64 chunks the
 * bytes are decoded and persisted to `outputDir` under a nanoid-suffixed
 * filename so parallel calls do not collide.
 *
 * Exported for tests so the decode / persist path can be exercised without
 * spinning up a real provider.
 */
export async function persistImageChunk(
  chunk: NormalizedImageChunk,
  outputDir: string
): Promise<ImageGenResultEntry> {
  if (chunk.kind === 'url') {
    const entry: ImageGenResultEntry = { kind: 'url', url: chunk.url };
    if (chunk.mimeType) {
      entry.mimeType = chunk.mimeType;
    }
    return entry;
  }

  await fs.mkdir(outputDir, { recursive: true });
  const ext = extensionForMimeType(chunk.mimeType);
  const filename = `image-${nanoid(8)}.${ext}`;
  const filePath = path.join(outputDir, filename);
  const buffer = Buffer.from(chunk.data, 'base64');
  await fs.writeFile(filePath, buffer);

  const entry: ImageGenResultEntry = {
    kind: 'base64',
    path: filePath,
    sizeBytes: buffer.byteLength,
  };
  if (chunk.mimeType) {
    entry.mimeType = chunk.mimeType;
  }
  return entry;
}

/**
 * Resolve the model id to use for a call:
 *   1. Explicit `params.model` (fails validation if it does not advertise
 *      the image-generation capability).
 *   2. `$ALEXI_IMAGE_MODEL` environment variable.
 *   3. Undefined — the caller is responsible for providing one.
 */
function resolveModel(explicit: string | undefined): string | undefined {
  if (explicit && explicit.trim().length > 0) {
    return explicit.trim();
  }
  const fromEnv = process.env.ALEXI_IMAGE_MODEL;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  return undefined;
}

/**
 * Default output directory for decoded base64 images. Kept under `os.tmpdir`
 * so ephemeral CI runners clean up automatically and the tool never writes
 * into the current workdir without an explicit opt-in.
 */
export function defaultImageOutputDir(): string {
  return path.join(os.tmpdir(), 'alexi-images');
}

export const imageGenTool = defineTool<typeof ImageGenParamsSchema, ImageGenResult>({
  name: 'image_gen',
  description: `Generate one or more images from a text prompt using an SAP AI Core image-capable model.

Usage:
- Pass a natural-language \`prompt\` describing the desired image.
- Optionally pin a specific \`model\` id; otherwise \`$ALEXI_IMAGE_MODEL\` is used.
- The model MUST advertise the \`image-generation\` capability; unknown models are rejected.
- Base64 payloads are decoded and saved under \`$TMPDIR/alexi-images\` (or \`outputPath\`).
- URL payloads are returned verbatim for the caller to fetch or display.`,

  parameters: ImageGenParamsSchema,

  permission: {
    // Writing decoded images to disk requires the same permission bucket as
    // other file-producing tools; hosted URLs still go through the network
    // permission via the caller's follow-up fetch.
    action: 'write',
    getResource: (params) => params.outputPath ?? defaultImageOutputDir(),
  },

  async execute(params, context): Promise<ToolResult<ImageGenResult>> {
    if (context.signal?.aborted) {
      return { success: false, error: 'Operation aborted' };
    }

    const model = resolveModel(params.model);
    if (!model) {
      return {
        success: false,
        error: 'No model specified for image generation. Pass `model` or set $ALEXI_IMAGE_MODEL.',
      };
    }

    if (!modelHasCapability(model, 'image-generation')) {
      return {
        success: false,
        error: `Model "${model}" does not advertise the image-generation capability. Choose a model that does, or add capability metadata for it.`,
      };
    }

    const outputDir = params.outputPath ?? defaultImageOutputDir();

    // Build a user message. Size hint (if any) is appended to the prompt so
    // the underlying model receives it via the natural-language channel;
    // the SAP orchestration surface does not currently expose a typed
    // "size" parameter on the request itself.
    const promptWithHint = params.size
      ? `${params.prompt}\n\n[size: ${params.size}]`
      : params.prompt;

    let provider;
    try {
      provider = getProviderForModel(model);
    } catch (err) {
      return {
        success: false,
        error: `Failed to initialise provider for model "${model}": ${
          err instanceof Error ? err.message : String(err)
        }`,
      };
    }

    const collected: NormalizedImageChunk[] = [];
    try {
      for await (const chunk of provider.streamComplete(
        [{ role: 'user', content: promptWithHint }],
        { signal: context.signal }
      )) {
        if (context.signal?.aborted) {
          return { success: false, error: 'Operation aborted' };
        }
        if (chunk.images && chunk.images.length > 0) {
          collected.push(...chunk.images);
        }
      }
    } catch (err) {
      return {
        success: false,
        error: `Image generation failed: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    if (collected.length === 0) {
      return {
        success: false,
        error: `Model "${model}" returned no image payloads for the prompt.`,
      };
    }

    const persisted: ImageGenResultEntry[] = [];
    for (const chunk of collected) {
      try {
        persisted.push(await persistImageChunk(chunk, outputDir));
      } catch (err) {
        return {
          success: false,
          error: `Failed to persist image chunk: ${
            err instanceof Error ? err.message : String(err)
          }`,
        };
      }
    }

    return {
      success: true,
      data: {
        model,
        prompt: params.prompt,
        images: persisted,
      },
    };
  },
});
