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
import { imageGenTool, persistImageChunk, defaultImageOutputDir } from '../image-gen.js';

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
      // Verify the file was written with the correct bytes
      const bytes = await fs.readFile(entry!.path!);
      expect(Array.from(bytes)).toEqual([0, 1, 2, 3]);
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

    it('surfaces provider errors', async () => {
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

    it('exposes a JSON schema with prompt and model fields', () => {
      const schema = imageGenTool.toFunctionSchema();
      expect(schema.name).toBe('image_gen');
      const params = schema.parameters as {
        properties?: Record<string, unknown>;
        required?: string[];
      };
      expect(params.properties).toHaveProperty('prompt');
      expect(params.properties).toHaveProperty('model');
      expect(params.properties).toHaveProperty('size');
      expect(params.required).toContain('prompt');
    });
  });
});
