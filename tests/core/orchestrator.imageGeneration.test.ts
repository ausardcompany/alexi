/**
 * Orchestrator image-generation routing (issue #1549).
 *
 * When `modelHasCapability(modelId, 'image-generation')` returns true,
 * `sendChat()` dispatches the prompt through `provider.generateImage()`
 * instead of `provider.complete()` and returns a structured result with
 * `images: ImageGenerationImage[]`. Text callers see `text: ''`.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  const modelHasCapability = vi.fn();
  return {
    getProviderForModel,
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(),
    modelHasCapability,
  };
});

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import { sendChat } from '../../src/core/orchestrator.js';
import {
  getProviderForModel,
  getDefaultModel,
  modelHasCapability,
} from '../../src/providers/index.js';

describe('sendChat image-generation routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gemini-imagen-3');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('dispatches to generateImage when the model advertises image-generation', async () => {
    vi.mocked(modelHasCapability).mockReturnValue(true);

    const generateImage = vi.fn().mockResolvedValue({
      images: [{ kind: 'url', url: 'https://example.com/cat.png', mimeType: 'image/png' }],
      model: 'gemini-imagen-3',
      finishReason: 'stop',
      usage: { prompt_tokens: 4, completion_tokens: 0, total_tokens: 4 },
    });
    const complete = vi.fn();
    vi.mocked(getProviderForModel).mockReturnValue({
      generateImage,
      complete,
    } as never);

    const result = await sendChat('draw a cat', { modelOverride: 'gemini-imagen-3' });

    expect(generateImage).toHaveBeenCalledWith({
      prompt: 'draw a cat',
      signal: undefined,
    });
    expect(complete).not.toHaveBeenCalled();
    expect(result.text).toBe('');
    expect(result.images).toEqual([
      { kind: 'url', url: 'https://example.com/cat.png', mimeType: 'image/png' },
    ]);
    expect(result.modelUsed).toBe('gemini-imagen-3');
    expect(result.usage?.prompt_tokens).toBe(4);
  });

  it('passes through base64 image payloads verbatim', async () => {
    vi.mocked(modelHasCapability).mockReturnValue(true);
    const b64 = Buffer.from([1, 2, 3, 4]).toString('base64');

    const generateImage = vi.fn().mockResolvedValue({
      images: [{ kind: 'base64', base64: b64, mimeType: 'image/png' }],
      model: 'gemini-imagen-3',
    });
    vi.mocked(getProviderForModel).mockReturnValue({
      generateImage,
      complete: vi.fn(),
    } as never);

    const result = await sendChat('x', { modelOverride: 'gemini-imagen-3' });

    expect(result.text).toBe('');
    expect(result.images).toHaveLength(1);
    expect(result.images![0]).toEqual({
      kind: 'base64',
      base64: b64,
      mimeType: 'image/png',
    });
  });

  it('falls through to complete() for text-only models', async () => {
    vi.mocked(modelHasCapability).mockReturnValue(false);

    const complete = vi.fn().mockResolvedValue({
      text: 'hello world',
      usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
    });
    const generateImage = vi.fn();
    vi.mocked(getProviderForModel).mockReturnValue({
      complete,
      generateImage,
    } as never);

    const result = await sendChat('hi', { modelOverride: 'gpt-4o' });

    expect(complete).toHaveBeenCalledTimes(1);
    expect(generateImage).not.toHaveBeenCalled();
    expect(result.text).toBe('hello world');
    expect(result.images).toBeUndefined();
  });

  it('propagates AbortSignal into generateImage', async () => {
    vi.mocked(modelHasCapability).mockReturnValue(true);

    const generateImage = vi.fn().mockResolvedValue({
      images: [{ kind: 'url', url: 'https://a/1.png' }],
      model: 'gemini-imagen-3',
    });
    vi.mocked(getProviderForModel).mockReturnValue({
      generateImage,
      complete: vi.fn(),
    } as never);

    const ac = new AbortController();
    await sendChat('x', { modelOverride: 'gemini-imagen-3', signal: ac.signal });

    expect(generateImage).toHaveBeenCalledWith({
      prompt: 'x',
      signal: ac.signal,
    });
  });

  it('rethrows provider errors from generateImage after route bookkeeping', async () => {
    vi.mocked(modelHasCapability).mockReturnValue(true);

    const err = new Error('deployment_not_found');
    const generateImage = vi.fn().mockRejectedValue(err);
    vi.mocked(getProviderForModel).mockReturnValue({
      generateImage,
      complete: vi.fn(),
    } as never);

    await expect(sendChat('x', { modelOverride: 'gemini-imagen-3' })).rejects.toBe(err);
  });
});
