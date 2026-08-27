/**
 * Provider-level image generation tests (issue #1549).
 *
 * Covers the first-class typed `SapOrchestrationProvider.generateImage()`
 * entry point added for image-capable SAP AI Core deployments:
 *   - URL-form image payloads pass through with their MIME type.
 *   - Base64-form image payloads carry the raw base64 verbatim (the
 *     provider layer does NOT decode; that responsibility belongs to
 *     the `image_gen` tool / CLI).
 *   - Non-image models throw `ImageGenerationNotSupportedError` up-front
 *     without touching the network.
 *   - Optional `size` and `n` hints are appended to the outgoing prompt
 *     so the model can interpret them best-effort.
 *   - `AbortSignal` is forwarded to the SDK identical to `streamComplete`.
 *
 * The SDK is mocked at `@sap-ai-sdk/orchestration` boundary so the tests
 * exercise the wire contract without requiring live SAP credentials.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Chunks the mock SDK stream will yield, in order. Configured per-test
// via `nextChunks` so we can vary the payload shape without redefining
// the mock.
let nextChunks: unknown[] = [];
let capturedRequest: { messages: Array<{ role: string; content: unknown }> } | undefined;
let capturedSignal: AbortSignal | undefined;

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion() {
      throw new Error('not used in this suite');
    }

    async stream(
      request: { messages: Array<{ role: string; content: unknown }> },
      signal?: AbortSignal,
      _options?: unknown,
      _requestConfig?: unknown
    ) {
      capturedRequest = request;
      capturedSignal = signal;
      const chunks = nextChunks;
      async function* iter() {
        for (const raw of chunks) {
          const rec = raw as {
            deltaContent?: unknown;
            deltaToolCalls?: unknown[];
          };
          yield {
            getDeltaContent: () => rec.deltaContent,
            getDeltaToolCalls: () => rec.deltaToolCalls ?? [],
          };
        }
      }
      return {
        stream: iter(),
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          prompt_tokens: 10,
          completion_tokens: 5,
          total_tokens: 15,
        }),
      };
    }
  }

  return {
    OrchestrationClient: MockOrchestrationClient,
    OrchestrationEmbeddingClient: vi.fn(),
    buildAzureContentSafetyFilter: vi.fn().mockReturnValue({}),
    buildLlamaGuard38BFilter: vi.fn().mockReturnValue({}),
    buildDpiMaskingProvider: vi.fn().mockReturnValue({}),
    buildDocumentGroundingConfig: vi.fn().mockReturnValue({}),
    buildTranslationConfig: vi.fn().mockReturnValue({}),
  };
});

vi.mock('../../src/config/env.js', () => ({
  env: vi.fn((key: string) => {
    if (key === 'AICORE_RESOURCE_GROUP') {
      return 'default';
    }
    return undefined;
  }),
}));

vi.mock('../../src/providers/connectivity.js', () => ({
  checkConnectivity: vi.fn().mockResolvedValue({ reachable: true }),
}));

import {
  SapOrchestrationProvider,
  ImageGenerationNotSupportedError,
} from '../../src/providers/sapOrchestration.js';

describe('SapOrchestrationProvider.generateImage()', () => {
  beforeEach(() => {
    nextChunks = [];
    capturedRequest = undefined;
    capturedSignal = undefined;
  });

  it('rejects models that do not advertise image-generation with ImageGenerationNotSupportedError', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await expect(provider.generateImage({ prompt: 'draw a cat' })).rejects.toBeInstanceOf(
      ImageGenerationNotSupportedError
    );
    // The SDK must NOT be called for a capability rejection — this is
    // a permanent config error, retrying the request would waste budget.
    expect(capturedRequest).toBeUndefined();
  });

  it('returns URL-form images verbatim with their MIME type', async () => {
    nextChunks = [
      {
        deltaContent: [
          {
            type: 'image_url',
            image_url: { url: 'https://example.com/cat.png', mime_type: 'image/png' },
          },
        ],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    const result = await provider.generateImage({ prompt: 'draw a cat' });

    expect(result.model).toBe('gemini-imagen-3');
    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toEqual({
      kind: 'url',
      url: 'https://example.com/cat.png',
      mimeType: 'image/png',
    });
    expect(result.finishReason).toBe('stop');
    expect(result.usage).toEqual({
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
    });
  });

  it('returns base64-form images verbatim without decoding', async () => {
    const rawB64 = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64');
    nextChunks = [
      {
        deltaContent: [
          {
            type: 'image',
            image: { b64_json: rawB64, mime_type: 'image/png' },
          },
        ],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    const result = await provider.generateImage({ prompt: 'x' });

    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toEqual({
      kind: 'base64',
      base64: rawB64,
      mimeType: 'image/png',
    });
  });

  it('aggregates multiple image chunks across the stream in order', async () => {
    nextChunks = [
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/1.png' } }],
      },
      { deltaContent: 'ignored text between chunks' },
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/2.png' } }],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    const result = await provider.generateImage({ prompt: 'x' });

    expect(result.images).toHaveLength(2);
    expect(result.images.map((img) => (img.kind === 'url' ? img.url : ''))).toEqual([
      'https://a/1.png',
      'https://a/2.png',
    ]);
  });

  it('appends size and count hints to the outgoing prompt when provided', async () => {
    nextChunks = [
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/1.png' } }],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    await provider.generateImage({ prompt: 'cat', size: '1024x1024', n: 2 });

    expect(capturedRequest).toBeDefined();
    const content = capturedRequest!.messages[0].content;
    expect(typeof content).toBe('string');
    expect(String(content)).toContain('cat');
    expect(String(content)).toContain('[size: 1024x1024]');
    expect(String(content)).toContain('[count: 2]');
  });

  it('omits hint markers when neither size nor n are provided', async () => {
    nextChunks = [
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/1.png' } }],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    await provider.generateImage({ prompt: 'plain prompt' });

    expect(capturedRequest).toBeDefined();
    const content = String(capturedRequest!.messages[0].content);
    expect(content).toBe('plain prompt');
    expect(content).not.toContain('[size:');
    expect(content).not.toContain('[count:');
  });

  it('rejects zero or negative n values (treated as no hint)', async () => {
    nextChunks = [
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/1.png' } }],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    await provider.generateImage({ prompt: 'x', n: 0 });
    expect(String(capturedRequest!.messages[0].content)).not.toContain('[count:');

    capturedRequest = undefined;
    await provider.generateImage({ prompt: 'x', n: -3 });
    expect(String(capturedRequest!.messages[0].content)).not.toContain('[count:');
  });

  it('returns an empty images array when the model emits no image payloads', async () => {
    nextChunks = [{ deltaContent: 'only text, no image' }];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    const result = await provider.generateImage({ prompt: 'x' });
    expect(result.images).toEqual([]);
    expect(result.model).toBe('gemini-imagen-3');
  });

  it('forwards the provided AbortSignal to the SDK stream() call', async () => {
    nextChunks = [
      {
        deltaContent: [{ type: 'image_url', image_url: { url: 'https://a/1.png' } }],
      },
    ];

    const provider = new SapOrchestrationProvider({
      modelName: 'gemini-imagen-3',
      deploymentId: 'test-deployment',
    });

    const ac = new AbortController();
    await provider.generateImage({ prompt: 'x', signal: ac.signal });

    expect(capturedSignal).toBe(ac.signal);
  });

  it('ImageGenerationNotSupportedError carries the modelName it was thrown for', () => {
    const err = new ImageGenerationNotSupportedError('gpt-4o');
    expect(err.modelName).toBe('gpt-4o');
    expect(err.name).toBe('ImageGenerationNotSupportedError');
    expect(err.message).toContain('gpt-4o');
    expect(err.message).toContain('image-generation');
  });
});
