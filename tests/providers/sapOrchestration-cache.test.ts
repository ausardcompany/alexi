/**
 * Tests for prompt-cache token plumbing in the SAP Orchestration provider.
 *
 * Covers issue #851: provider responses that include
 * `cache_read_input_tokens` / `cache_creation_input_tokens` (Anthropic
 * shape) or `prompt_tokens_details.cached_tokens` (OpenAI shape) must
 * surface those values on the `TokenUsage` returned by `complete()` and
 * `streamComplete()`. Records without cache fields must NOT introduce
 * `cache_read_input_tokens: 0` (the absence is a meaningful signal).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockUsage: Record<string, unknown> = {};

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion(_params: { messages: unknown[] }) {
      return {
        getContent: () => 'ok',
        getFinishReason: () => 'stop',
        getTokenUsage: () => mockUsage,
        getToolCalls: () => [],
        getAllMessages: () => [],
      };
    }

    async stream(_params: { messages: unknown[] }) {
      const usage = mockUsage;
      async function* gen() {
        yield {
          getDeltaContent: () => 'ok',
          getDeltaToolCalls: () => [],
        };
      }
      return {
        stream: gen(),
        getFinishReason: () => 'stop',
        getTokenUsage: () => usage,
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

import {
  SapOrchestrationProvider,
  extractCacheTokens,
} from '../../src/providers/sapOrchestration.js';

describe('extractCacheTokens', () => {
  it('maps Anthropic-style top-level cache fields', () => {
    const result = extractCacheTokens({
      prompt_tokens: 100,
      completion_tokens: 50,
      cache_read_input_tokens: 1234,
      cache_creation_input_tokens: 56,
    });
    expect(result.cache_read_input_tokens).toBe(1234);
    expect(result.cache_creation_input_tokens).toBe(56);
  });

  it('maps OpenAI-style prompt_tokens_details.cached_tokens', () => {
    const result = extractCacheTokens({
      prompt_tokens: 100,
      completion_tokens: 50,
      prompt_tokens_details: {
        cached_tokens: 789,
      },
    });
    expect(result.cache_read_input_tokens).toBe(789);
    expect(result.cache_creation_input_tokens).toBeUndefined();
  });

  it('maps prompt_tokens_details.cache_creation_tokens (SAP/Anthropic via Orchestration)', () => {
    const result = extractCacheTokens({
      prompt_tokens_details: {
        cached_tokens: 200,
        cache_creation_tokens: 25,
      },
    });
    expect(result.cache_read_input_tokens).toBe(200);
    expect(result.cache_creation_input_tokens).toBe(25);
  });

  it('returns empty object when no cache fields present (no zero coercion)', () => {
    const result = extractCacheTokens({
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    });
    expect(result).toEqual({});
    expect('cache_read_input_tokens' in result).toBe(false);
    expect('cache_creation_input_tokens' in result).toBe(false);
  });

  it('prefers Anthropic top-level fields when both shapes are present', () => {
    const result = extractCacheTokens({
      cache_read_input_tokens: 1000,
      prompt_tokens_details: { cached_tokens: 999 },
    });
    expect(result.cache_read_input_tokens).toBe(1000);
  });

  it('handles undefined / null / non-objects without throwing', () => {
    expect(extractCacheTokens(undefined)).toEqual({});
    expect(extractCacheTokens(null)).toEqual({});
    expect(extractCacheTokens('not-an-object')).toEqual({});
    expect(extractCacheTokens(42)).toEqual({});
  });
});

describe('SapOrchestrationProvider cache token plumbing', () => {
  beforeEach(() => {
    mockUsage = {};
  });

  it('complete() surfaces Anthropic-style cache_read_input_tokens', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
      cache_read_input_tokens: 1234,
      cache_creation_input_tokens: 56,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.cache_read_input_tokens).toBe(1234);
    expect(result.usage?.cache_creation_input_tokens).toBe(56);
    expect(result.usage?.prompt_tokens).toBe(100);
  });

  it('complete() surfaces OpenAI-style prompt_tokens_details.cached_tokens', async () => {
    mockUsage = {
      prompt_tokens: 200,
      completion_tokens: 30,
      total_tokens: 230,
      prompt_tokens_details: { cached_tokens: 150 },
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.cache_read_input_tokens).toBe(150);
    expect(result.usage?.cache_creation_input_tokens).toBeUndefined();
  });

  it('complete() omits cache fields when provider does not report them', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.cache_read_input_tokens).toBeUndefined();
    expect(result.usage?.cache_creation_input_tokens).toBeUndefined();
  });

  it('streamComplete() final chunk carries cache_read_input_tokens', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
      cache_read_input_tokens: 777,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const chunks: Array<{ usage?: Record<string, unknown> }> = [];
    for await (const chunk of provider.streamComplete([{ role: 'user', content: 'hi' }])) {
      chunks.push(chunk as { usage?: Record<string, unknown> });
    }
    const final = chunks[chunks.length - 1];
    expect(final.usage?.cache_read_input_tokens).toBe(777);
  });
});
