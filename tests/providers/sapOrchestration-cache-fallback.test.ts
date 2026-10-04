/**
 * Integration tests for prompt-cache error recovery wiring in
 * SapOrchestrationProvider (issue #1930).
 *
 * Covers:
 *   - `complete()` retries once without cache markers when the first call
 *     throws a cache-shaped error.
 *   - `streamComplete()` retries once on cache errors (initial `stream()`
 *     call failure path).
 *   - Non-cache errors are NOT retried.
 *   - `cache_control` markers are stripped from the retry request.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

type ChatCall = {
  messages: Array<Record<string, unknown>>;
};

const chatCalls: ChatCall[] = [];
let chatCompletionBehaviour: 'ok' | 'cache-then-ok' | 'cache-then-fail' | 'auth-err' = 'ok';

const streamCalls: ChatCall[] = [];
let streamBehaviour: 'ok' | 'cache-then-ok' | 'auth-err' = 'ok';

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion(params: { messages: Array<Record<string, unknown>> }) {
      chatCalls.push({ messages: params.messages });
      if (chatCompletionBehaviour === 'cache-then-ok') {
        if (chatCalls.length === 1) {
          const err = new Error('prompt_cache: invalid breakpoint');
          Object.assign(err, { status: 422 });
          throw err;
        }
        return successResponse('fallback-ok');
      }
      if (chatCompletionBehaviour === 'cache-then-fail') {
        if (chatCalls.length === 1) {
          throw new Error('cache_control invalid shape');
        }
        throw new Error('network down');
      }
      if (chatCompletionBehaviour === 'auth-err') {
        throw Object.assign(new Error('HTTP 401 Unauthorized'), { status: 401 });
      }
      return successResponse('ok');
    }

    async stream(
      params: { messages: Array<Record<string, unknown>> },
      _signal?: unknown,
      _opts?: unknown,
      _requestConfig?: unknown
    ) {
      streamCalls.push({ messages: params.messages });
      if (streamBehaviour === 'cache-then-ok') {
        if (streamCalls.length === 1) {
          throw new Error('prompt cache evicted');
        }
        return streamResponse();
      }
      if (streamBehaviour === 'auth-err') {
        throw Object.assign(new Error('HTTP 401 Unauthorized'), { status: 401 });
      }
      return streamResponse();
    }
  }

  function successResponse(content: string) {
    return {
      getContent: () => content,
      getFinishReason: () => 'stop',
      getTokenUsage: () => ({ prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }),
      getToolCalls: () => [],
      getAllMessages: () => [],
    };
  }

  function streamResponse() {
    async function* gen() {
      yield {
        getDeltaContent: () => 'ok',
        getDeltaToolCalls: () => [],
      };
    }
    return {
      stream: gen(),
      getFinishReason: () => 'stop',
      getTokenUsage: () => ({ prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }),
    };
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

import { SapOrchestrationProvider } from '../../src/providers/sapOrchestration.js';

describe('SapOrchestrationProvider cache-error fallback (complete)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    chatCalls.length = 0;
    chatCompletionBehaviour = 'ok';
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('retries without cache_control on cache error and returns the fallback result', async () => {
    chatCompletionBehaviour = 'cache-then-ok';
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    const result = await provider.complete([
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'static prefix',
            cache_control: { type: 'ephemeral' },
          },
          { type: 'text', text: 'dynamic suffix' },
        ] as unknown[],
      },
    ]);

    expect(result.text).toBe('fallback-ok');
    expect(chatCalls).toHaveLength(2);
    // Second request MUST NOT carry cache_control on its content block.
    const retryBlocks = chatCalls[1].messages[0].content as Array<Record<string, unknown>>;
    expect(retryBlocks[0].cache_control).toBeUndefined();
    expect(retryBlocks[0].text).toBe('static prefix');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0][0])).toContain('Prompt cache error');
    warnSpy.mockRestore();
  });

  it('does NOT retry on a non-cache (auth) error', async () => {
    chatCompletionBehaviour = 'auth-err';
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await expect(provider.complete([{ role: 'user', content: 'hi' }])).rejects.toThrow(/401/);
    expect(chatCalls).toHaveLength(1);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('rethrows when the fallback itself fails', async () => {
    chatCompletionBehaviour = 'cache-then-fail';
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await expect(provider.complete([{ role: 'user', content: 'hi' }])).rejects.toThrow();
    expect(chatCalls).toHaveLength(2);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});

describe('SapOrchestrationProvider cache-error fallback (stream)', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    streamCalls.length = 0;
    streamBehaviour = 'ok';
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('retries stream() without cache markers on cache error', async () => {
    streamBehaviour = 'cache-then-ok';
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    const chunks: Array<{ text?: string }> = [];
    for await (const chunk of provider.streamComplete([
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'cached prefix',
            cache_control: { type: 'ephemeral' },
          },
        ] as unknown[],
      },
    ])) {
      chunks.push(chunk as { text?: string });
    }

    expect(streamCalls).toHaveLength(2);
    const retryBlocks = streamCalls[1].messages[0].content as Array<Record<string, unknown>>;
    expect(retryBlocks[0].cache_control).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0][0])).toContain('Prompt cache error');
    // We should still have received the model output ('ok').
    const textChunks = chunks.filter((c) => c.text === 'ok');
    expect(textChunks.length).toBeGreaterThanOrEqual(1);
    warnSpy.mockRestore();
  });

  it('does NOT retry stream() on a non-cache (auth) error', async () => {
    streamBehaviour = 'auth-err';
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    const iterate = async () => {
      for await (const _chunk of provider.streamComplete([{ role: 'user', content: 'hi' }])) {
        // consume
      }
    };
    await expect(iterate()).rejects.toThrow(/401/);
    expect(streamCalls).toHaveLength(1);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
