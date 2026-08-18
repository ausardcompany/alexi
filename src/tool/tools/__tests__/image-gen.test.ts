import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import type { ToolContext } from '../../index.js';

// Mock the provider layer BEFORE importing the tool so vi.mock hoisting
// lands on the same module instance the tool imports at runtime.
vi.mock('../../../providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  modelHasCapability: vi.fn(),
}));

import { getProviderForModel, modelHasCapability } from '../../../providers/index.js';
import { ImageGenerationChunk } from '../../../bus/index.js';
import {
  imageGenTool,
  persistImageChunk,
  defaultImageOutputDir,
  classifyImageGenError,
} from '../image-gen.js';

const mockedGetProviderForModel = vi.mocked(getProviderForModel);
const mockedModelHasCapability = vi.mocked(modelHasCapability);

interface FakeChunk {
  text: string;
  images?: Array<{ kind: 'url' | 'base64'; url?: string; data?: string; mimeType?: string }>;
}

function makeProviderStub(chunks: FakeChunk[]) {
  return {
    streamComplete: async function* () {
      for (const c of chunks) {
        yield c;
      }
    },
  } as unknown as ReturnType<typeof getProviderForModel>;
}

/**
 * Provider stub that yields the given chunks and then throws. Used to
 * exercise the partial-success path where some images have already been
 * emitted before the upstream stream fails.
 */
function makeThrowingProviderStub(chunks: FakeChunk[], err: Error) {
  return {
    streamComplete: async function* () {
      for (const c of chunks) {
        yield c;
      }
      throw err;
    },
  } as unknown as ReturnType<typeof getProviderForModel>;
}

describe('image-gen tool', () => {
  let context: ToolContext;
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'image-gen-test-'));
    context = { workdir: tmpDir };
    vi.clearAllMocks();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('validation', () => {
    it('rejects when no model is provided and $ALEXI_IMAGE_MODEL is unset', async () => {
      const previous = process.env.ALEXI_IMAGE_MODEL;
      delete process.env.ALEXI_IMAGE_MODEL;
      try {
        const result = await imageGenTool.executeUnsafe({ prompt: 'draw a cat' }, context);
        expect(result.success).toBe(false);
        expect(result.error).toContain('No model specified');
      } finally {
        if (previous !== undefined) {
          process.env.ALEXI_IMAGE_MODEL = previous;
        }
      }
    });

    it('rejects a model that does not advertise image-generation', async () => {
      mockedModelHasCapability.mockReturnValue(false);
      const result = await imageGenTool.executeUnsafe(
        { prompt: 'draw a cat', model: 'gpt-4o', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/does not advertise the image-generation capability/);
      expect(result.hint).toMatch(/not currently available/);
      expect(mockedModelHasCapability).toHaveBeenCalledWith('gpt-4o', 'image-generation');
    });

    it('rejects an empty prompt via zod validation', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      const result = await imageGenTool.execute(
        { prompt: '', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      // execute() runs zod validation via executeUnsafe -> parameters.parse
      expect(result.success).toBe(false);
    });

    it('returns aborted when context.signal is pre-aborted', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      const abort = new AbortController();
      abort.abort();
      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        { ...context, signal: abort.signal }
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/aborted/i);
    });
  });

  describe('successful generation', () => {
    it('returns URL image entries verbatim', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([
          {
            text: '',
            images: [{ kind: 'url', url: 'https://example.com/cat.png', mimeType: 'image/png' }],
          },
        ])
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'draw a cat', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(true);
      expect(result.data?.model).toBe('imagen-3');
      expect(result.data?.images).toHaveLength(1);
      const entry = result.data?.images[0];
      expect(entry?.kind).toBe('url');
      expect(entry?.url).toBe('https://example.com/cat.png');
      expect(entry?.mimeType).toBe('image/png');
    });

    it('decodes base64 chunks to disk and returns path + size', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      // Base64 of 4 bytes: 0x00 0x01 0x02 0x03
      const b64 = Buffer.from([0x00, 0x01, 0x02, 0x03]).toString('base64');
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([
          { text: '', images: [{ kind: 'base64', data: b64, mimeType: 'image/png' }] },
        ])
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'draw a cat', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(true);
      const entry = result.data?.images[0];
      expect(entry?.kind).toBe('base64');
      expect(entry?.mimeType).toBe('image/png');
      expect(entry?.sizeBytes).toBe(4);
      expect(entry?.path).toBeDefined();
      expect(entry!.path!.startsWith(tmpDir)).toBe(true);
      expect(entry?.data).toBeUndefined();
      // Verify the file was written with the correct bytes
      const bytes = await fs.readFile(entry!.path!);
      expect(Array.from(bytes)).toEqual([0, 1, 2, 3]);
    });

    it('returns inline base64 payload when returnBase64 is true', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      const b64 = Buffer.from('hello world').toString('base64');
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([
          { text: '', images: [{ kind: 'base64', data: b64, mimeType: 'image/png' }] },
        ])
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir, returnBase64: true },
        context
      );
      expect(result.success).toBe(true);
      const entry = result.data?.images[0];
      expect(entry?.kind).toBe('base64');
      expect(entry?.data).toBe(b64);
      expect(entry?.path).toBeUndefined();
      expect(entry?.sizeBytes).toBe('hello world'.length);
      // The tool must NOT have written anything to disk in inline mode.
      const files = await fs.readdir(tmpDir);
      expect(files).toEqual([]);
    });

    it('URL entries are unaffected by returnBase64', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([
          { text: '', images: [{ kind: 'url', url: 'https://a/1.png', mimeType: 'image/png' }] },
        ])
      );
      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir, returnBase64: true },
        context
      );
      expect(result.success).toBe(true);
      const entry = result.data?.images[0];
      expect(entry?.kind).toBe('url');
      expect(entry?.url).toBe('https://a/1.png');
      expect(entry?.data).toBeUndefined();
    });

    it('fails cleanly when the model streams no image payloads', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([{ text: 'sorry no image today' }])
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'draw a cat', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('no image payloads');
    });

    it('resolves model from $ALEXI_IMAGE_MODEL when omitted', async () => {
      const previous = process.env.ALEXI_IMAGE_MODEL;
      process.env.ALEXI_IMAGE_MODEL = 'imagen-env';
      try {
        mockedModelHasCapability.mockReturnValue(true);
        mockedGetProviderForModel.mockReturnValue(
          makeProviderStub([
            { text: '', images: [{ kind: 'url', url: 'https://example.com/1.png' }] },
          ])
        );

        const result = await imageGenTool.executeUnsafe(
          { prompt: 'x', outputPath: tmpDir },
          context
        );
        expect(result.success).toBe(true);
        expect(result.data?.model).toBe('imagen-env');
        expect(mockedModelHasCapability).toHaveBeenCalledWith('imagen-env', 'image-generation');
      } finally {
        if (previous === undefined) {
          delete process.env.ALEXI_IMAGE_MODEL;
        } else {
          process.env.ALEXI_IMAGE_MODEL = previous;
        }
      }
    });

    it('appends the size hint to the prompt when provided', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      let capturedMessages: Array<{ role: string; content: string | unknown[] }> | undefined;
      mockedGetProviderForModel.mockReturnValue({
        streamComplete: async function* (
          messages: Array<{ role: string; content: string | unknown[] }>
        ) {
          capturedMessages = messages;
          yield { text: '', images: [{ kind: 'url', url: 'https://a/1.png' }] };
        },
      } as unknown as ReturnType<typeof getProviderForModel>);

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'cat', model: 'imagen-3', size: '512x512', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(true);
      expect(capturedMessages).toBeDefined();
      expect(String(capturedMessages![0].content)).toContain('cat');
      expect(String(capturedMessages![0].content)).toContain('512x512');
    });

    it('surfaces provider errors with a classified hint', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue({
        streamComplete: async function* () {
          yield { text: '' };
          throw new Error('upstream boom');
        },
      } as unknown as ReturnType<typeof getProviderForModel>);

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('Image generation failed');
      expect(result.error).toContain('upstream boom');
      expect(result.hint).toBeDefined();
    });
  });

  describe('streaming behaviour', () => {
    it('publishes an ImageGenerationChunk bus event per delivered image', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      const b64 = Buffer.from([1, 2, 3]).toString('base64');
      mockedGetProviderForModel.mockReturnValue(
        makeProviderStub([
          { text: '', images: [{ kind: 'url', url: 'https://a/1.png', mimeType: 'image/png' }] },
          { text: '', images: [{ kind: 'base64', data: b64, mimeType: 'image/png' }] },
        ])
      );

      const events: Array<{ index: number; kind: string; sizeBytes?: number }> = [];
      const unsub = ImageGenerationChunk.subscribe((payload) => {
        events.push({ index: payload.index, kind: payload.kind, sizeBytes: payload.sizeBytes });
      });

      try {
        const result = await imageGenTool.executeUnsafe(
          { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
          context
        );
        expect(result.success).toBe(true);
        expect(events).toHaveLength(2);
        expect(events[0]).toMatchObject({ index: 0, kind: 'url' });
        expect(events[1]).toMatchObject({ index: 1, kind: 'base64', sizeBytes: 3 });
      } finally {
        unsub();
      }
    });

    it('returns a partial success when the stream fails after some images arrive', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeThrowingProviderStub(
          [{ text: '', images: [{ kind: 'url', url: 'https://a/1.png' }] }],
          new Error('rate limit exceeded')
        )
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(true);
      expect(result.data?.images).toHaveLength(1);
      expect(result.truncated).toBe(true);
      expect(result.hint).toMatch(/rate limit/i);
      expect(result.hint).toMatch(/Partial result: 1 image/);
    });

    it('surfaces rate-limit errors with a rate-limit hint when nothing was delivered', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeThrowingProviderStub([], new Error('HTTP 429 Too Many Requests'))
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.hint).toMatch(/rate limit/i);
    });

    it('classifies quota errors', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeThrowingProviderStub([], new Error('insufficient_quota: monthly limit reached'))
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.hint).toMatch(/quota/i);
    });

    it('classifies model-unavailable errors', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      mockedGetProviderForModel.mockReturnValue(
        makeThrowingProviderStub([], new Error('deployment_not_found for id abc'))
      );

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        context
      );
      expect(result.success).toBe(false);
      expect(result.hint).toMatch(/not currently available/);
    });

    it('handles abort mid-stream and returns aborted with any partial data', async () => {
      mockedModelHasCapability.mockReturnValue(true);
      const abort = new AbortController();
      mockedGetProviderForModel.mockReturnValue({
        streamComplete: async function* () {
          yield { text: '', images: [{ kind: 'url', url: 'https://a/1.png' }] };
          abort.abort();
          yield { text: '', images: [{ kind: 'url', url: 'https://a/2.png' }] };
        },
      } as unknown as ReturnType<typeof getProviderForModel>);

      const result = await imageGenTool.executeUnsafe(
        { prompt: 'x', model: 'imagen-3', outputPath: tmpDir },
        { ...context, signal: abort.signal }
      );
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/aborted/i);
      expect(result.data?.images).toHaveLength(1);
    });
  });

  describe('classifyImageGenError', () => {
    it.each([
      ['rate limit exceeded', 'rate-limit'],
      ['HTTP 429 Too Many Requests', 'rate-limit'],
      ['too many requests, back off', 'rate-limit'],
      ['insufficient_quota', 'quota'],
      ['billing issue: payment required', 'quota'],
      ['402 payment required', 'quota'],
      ['model_not_found', 'model-unavailable'],
      ['deployment_not_found', 'model-unavailable'],
      ['unknown model foo', 'model-unavailable'],
      ['HTTP 404 not found', 'model-unavailable'],
      ['random weird thing', 'other'],
    ] as const)('classifies %s -> %s', (message, expected) => {
      expect(classifyImageGenError(message)).toBe(expected);
    });
  });

  describe('persistImageChunk helper', () => {
    it('passes URL chunks through unchanged', async () => {
      const entry = await persistImageChunk(
        { kind: 'url', url: 'https://a/1.png', mimeType: 'image/png' },
        tmpDir
      );
      expect(entry).toEqual({
        kind: 'url',
        url: 'https://a/1.png',
        mimeType: 'image/png',
      });
    });

    it('writes base64 chunks to disk with a mime-derived extension', async () => {
      const b64 = Buffer.from('hello').toString('base64');
      const entry = await persistImageChunk(
        { kind: 'base64', data: b64, mimeType: 'image/jpeg' },
        tmpDir
      );
      expect(entry.kind).toBe('base64');
      expect(entry.path).toBeDefined();
      expect(entry.path!.endsWith('.jpg')).toBe(true);
      expect(entry.sizeBytes).toBe(5);
      const written = await fs.readFile(entry.path!, 'utf-8');
      expect(written).toBe('hello');
    });

    it('falls back to .bin when the mime type is unknown', async () => {
      const b64 = Buffer.from('x').toString('base64');
      const entry = await persistImageChunk({ kind: 'base64', data: b64 }, tmpDir);
      expect(entry.path!.endsWith('.bin')).toBe(true);
    });

    it('returns inline data when inlineBase64 is true and does not touch disk', async () => {
      const b64 = Buffer.from('abc').toString('base64');
      const entry = await persistImageChunk(
        { kind: 'base64', data: b64, mimeType: 'image/webp' },
        tmpDir,
        true
      );
      expect(entry.kind).toBe('base64');
      expect(entry.data).toBe(b64);
      expect(entry.path).toBeUndefined();
      expect(entry.sizeBytes).toBe(3);
      expect(entry.mimeType).toBe('image/webp');
      const files = await fs.readdir(tmpDir);
      expect(files).toEqual([]);
    });

    it('exercises every mime-type branch (png, jpg, gif, webp, svg, bin)', async () => {
      const b64 = Buffer.from('x').toString('base64');
      const cases: Array<[string | undefined, string]> = [
        ['image/png', '.png'],
        ['image/jpg', '.jpg'],
        ['image/gif', '.gif'],
        ['image/webp', '.webp'],
        ['image/svg+xml', '.svg'],
        [undefined, '.bin'],
        ['application/x-weird', '.bin'],
      ];
      for (const [mime, ext] of cases) {
        const chunk: Parameters<typeof persistImageChunk>[0] = mime
          ? { kind: 'base64', data: b64, mimeType: mime }
          : { kind: 'base64', data: b64 };
        const entry = await persistImageChunk(chunk, tmpDir);
        expect(entry.path!.endsWith(ext)).toBe(true);
      }
    });
  });

  describe('defaultImageOutputDir', () => {
    it('is under os.tmpdir()', () => {
      const dir = defaultImageOutputDir();
      expect(dir.startsWith(os.tmpdir())).toBe(true);
      expect(dir).toContain('alexi-images');
    });
  });

  describe('tool metadata', () => {
    it('advertises the image_gen name', () => {
      expect(imageGenTool.name).toBe('image_gen');
    });

    it('exposes a JSON schema with prompt, model, size, and returnBase64', () => {
      const schema = imageGenTool.toFunctionSchema();
      expect(schema.name).toBe('image_gen');
      const params = schema.parameters as {
        properties?: Record<string, unknown>;
        required?: string[];
      };
      expect(params.properties).toHaveProperty('prompt');
      expect(params.properties).toHaveProperty('model');
      expect(params.properties).toHaveProperty('size');
      expect(params.properties).toHaveProperty('returnBase64');
      expect(params.required).toContain('prompt');
    });
  });
});
