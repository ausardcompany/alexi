/**
 * Tests for reasoning-token plumbing in the SAP Orchestration provider.
 *
 * Covers issue #1844: reasoning tokens are reported by providers as a
 * subset of `completion_tokens`. `TokenUsage.reasoningTokenCount` must
 * surface the extracted count and `completion_tokens` must be reduced by
 * that amount (clamped at 0) so cumulative totals do not double-count.
 *
 * Extraction shapes covered:
 *   - OpenAI:    `usage.completion_tokens_details.reasoning_tokens`
 *   - Anthropic: `usage.thinking_tokens` OR `usage.reasoning_tokens`
 *   - AI SDK v4: `usage.outputTokens.reasoning`
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockUsage: Record<string, unknown> | undefined = {};

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
  extractReasoningTokens,
  normalizeTokenUsage,
} from '../../src/providers/sapOrchestration.js';

describe('extractReasoningTokens', () => {
  it('extracts OpenAI-style completion_tokens_details.reasoning_tokens', () => {
    expect(
      extractReasoningTokens({
        prompt_tokens: 100,
        completion_tokens: 200,
        completion_tokens_details: { reasoning_tokens: 75 },
      })
    ).toBe(75);
  });

  it('extracts Anthropic-style thinking_tokens', () => {
    expect(
      extractReasoningTokens({
        prompt_tokens: 100,
        completion_tokens: 200,
        thinking_tokens: 120,
      })
    ).toBe(120);
  });

  it('extracts Anthropic-style reasoning_tokens alias', () => {
    expect(
      extractReasoningTokens({
        prompt_tokens: 100,
        completion_tokens: 200,
        reasoning_tokens: 42,
      })
    ).toBe(42);
  });

  it('extracts AI SDK v4 outputTokens.reasoning', () => {
    expect(
      extractReasoningTokens({
        prompt_tokens: 100,
        completion_tokens: 200,
        outputTokens: { reasoning: 33 },
      })
    ).toBe(33);
  });

  it('returns undefined when no reasoning field is present', () => {
    expect(
      extractReasoningTokens({
        prompt_tokens: 100,
        completion_tokens: 200,
      })
    ).toBeUndefined();
  });

  it('preserves 0 as a meaningful value (no thinking this turn)', () => {
    expect(
      extractReasoningTokens({
        completion_tokens_details: { reasoning_tokens: 0 },
      })
    ).toBe(0);
  });

  it('prefers OpenAI shape when multiple shapes are present', () => {
    // OpenAI shape is inspected first; the Anthropic top-level fields must
    // NOT override it.
    expect(
      extractReasoningTokens({
        completion_tokens_details: { reasoning_tokens: 10 },
        thinking_tokens: 99,
        reasoning_tokens: 88,
      })
    ).toBe(10);
  });

  it('prefers thinking_tokens over reasoning_tokens when both are set', () => {
    expect(
      extractReasoningTokens({
        thinking_tokens: 50,
        reasoning_tokens: 20,
      })
    ).toBe(50);
  });

  it('handles undefined / null / non-objects without throwing', () => {
    expect(extractReasoningTokens(undefined)).toBeUndefined();
    expect(extractReasoningTokens(null)).toBeUndefined();
    expect(extractReasoningTokens('not-an-object')).toBeUndefined();
    expect(extractReasoningTokens(42)).toBeUndefined();
  });

  it('ignores non-numeric reasoning fields', () => {
    expect(
      extractReasoningTokens({
        thinking_tokens: '50',
        reasoning_tokens: null,
      })
    ).toBeUndefined();
  });
});

describe('normalizeTokenUsage', () => {
  it('subtracts reasoning tokens from completion_tokens', () => {
    const usage = normalizeTokenUsage({
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
      completion_tokens_details: { reasoning_tokens: 75 },
    });
    expect(usage).toBeDefined();
    expect(usage!.prompt_tokens).toBe(100);
    // 200 - 75 = 125
    expect(usage!.completion_tokens).toBe(125);
    expect(usage!.reasoningTokenCount).toBe(75);
    // total_tokens is passed through unchanged (billing surfaces still
    // show the full completion incl. reasoning; only the split changed).
    expect(usage!.total_tokens).toBe(300);
  });

  it('clamps completion_tokens at 0 when reasoning exceeds completion', () => {
    const usage = normalizeTokenUsage({
      prompt_tokens: 100,
      completion_tokens: 10,
      thinking_tokens: 999,
    });
    expect(usage!.completion_tokens).toBe(0);
    expect(usage!.reasoningTokenCount).toBe(999);
  });

  it('omits reasoningTokenCount when the provider does not report it', () => {
    const usage = normalizeTokenUsage({
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    });
    expect(usage!.completion_tokens).toBe(50);
    expect(usage!.reasoningTokenCount).toBeUndefined();
    expect('reasoningTokenCount' in usage!).toBe(false);
  });

  it('carries cache token fields through alongside reasoning', () => {
    const usage = normalizeTokenUsage({
      prompt_tokens: 100,
      completion_tokens: 200,
      cache_read_input_tokens: 50,
      cache_creation_input_tokens: 5,
      thinking_tokens: 30,
    });
    expect(usage!.cache_read_input_tokens).toBe(50);
    expect(usage!.cache_creation_input_tokens).toBe(5);
    expect(usage!.reasoningTokenCount).toBe(30);
    expect(usage!.completion_tokens).toBe(170);
  });

  it('returns undefined for falsy / non-object input', () => {
    expect(normalizeTokenUsage(undefined)).toBeUndefined();
    expect(normalizeTokenUsage(null)).toBeUndefined();
    expect(normalizeTokenUsage('nope')).toBeUndefined();
  });

  it('handles a zero reasoning count without changing completion_tokens', () => {
    const usage = normalizeTokenUsage({
      prompt_tokens: 100,
      completion_tokens: 200,
      completion_tokens_details: { reasoning_tokens: 0 },
    });
    expect(usage!.completion_tokens).toBe(200);
    expect(usage!.reasoningTokenCount).toBe(0);
  });
});

describe('SapOrchestrationProvider reasoning-token plumbing', () => {
  beforeEach(() => {
    mockUsage = {};
  });

  it('complete() surfaces reasoningTokenCount and subtracts from completion (OpenAI shape)', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
      completion_tokens_details: { reasoning_tokens: 75 },
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-5',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.reasoningTokenCount).toBe(75);
    expect(result.usage?.completion_tokens).toBe(125);
    expect(result.usage?.prompt_tokens).toBe(100);
  });

  it('complete() surfaces Anthropic-style thinking_tokens', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
      thinking_tokens: 120,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.reasoningTokenCount).toBe(120);
    expect(result.usage?.completion_tokens).toBe(80);
  });

  it('complete() surfaces AI SDK v4 outputTokens.reasoning', async () => {
    mockUsage = {
      prompt_tokens: 50,
      completion_tokens: 150,
      total_tokens: 200,
      outputTokens: { reasoning: 40 },
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-5',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.reasoningTokenCount).toBe(40);
    expect(result.usage?.completion_tokens).toBe(110);
  });

  it('complete() clamps completion_tokens at 0 when reasoning > completion', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 10,
      total_tokens: 110,
      thinking_tokens: 500,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const result = await provider.complete([{ role: 'user', content: 'hi' }]);
    expect(result.usage?.reasoningTokenCount).toBe(500);
    expect(result.usage?.completion_tokens).toBe(0);
  });

  it('complete() omits reasoningTokenCount when the provider does not report reasoning', async () => {
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
    expect(result.usage?.reasoningTokenCount).toBeUndefined();
    expect(result.usage?.completion_tokens).toBe(50);
  });

  it('streamComplete() final chunk carries reasoningTokenCount and reduced completion_tokens', async () => {
    mockUsage = {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300,
      thinking_tokens: 60,
    };
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const chunks: Array<{ usage?: { reasoningTokenCount?: number; completion_tokens?: number } }> =
      [];
    for await (const chunk of provider.streamComplete([{ role: 'user', content: 'hi' }])) {
      chunks.push(chunk);
    }
    const final = chunks[chunks.length - 1];
    expect(final.usage?.reasoningTokenCount).toBe(60);
    expect(final.usage?.completion_tokens).toBe(140);
  });

  it('streamComplete() emits no usage when the stream reports none', async () => {
    mockUsage = undefined;
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const chunks: Array<{ usage?: unknown }> = [];
    for await (const chunk of provider.streamComplete([{ role: 'user', content: 'hi' }])) {
      chunks.push(chunk);
    }
    const final = chunks[chunks.length - 1];
    expect(final.usage).toBeUndefined();
  });
});
