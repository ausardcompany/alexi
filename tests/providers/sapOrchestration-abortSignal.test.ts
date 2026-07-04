/**
 * Tests for AbortSignal plumbing through the non-streaming SAP Orchestration
 * `complete()` code path.
 *
 * The SAP SDK's `OrchestrationClient.chatCompletion(params, requestConfig)`
 * consults `requestConfig.signal` for cancellation (it calls
 * `signal?.throwIfAborted()` and forwards the signal to fetch). This suite
 * verifies that `provider.complete(messages, { signal })` reaches the SDK
 * with the signal in the `requestConfig` slot, that pre-existing `headers`
 * still flow through, and that `requestConfig` is `undefined` when neither
 * headers nor signal are set (no unnecessary allocation on hot paths).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture the (params, requestConfig) tuples the provider hands to the SDK.
type CapturedCall = {
  params: { messages: unknown[] };
  requestConfig: unknown;
};
let capturedCalls: CapturedCall[] = [];

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {}

    async chatCompletion(params: { messages: unknown[] }, requestConfig?: unknown) {
      capturedCalls.push({ params, requestConfig });
      return {
        getContent: () => 'ok',
        getFinishReason: () => 'stop',
        getTokenUsage: () => ({
          completion_tokens: 1,
          prompt_tokens: 1,
          total_tokens: 2,
        }),
        getToolCalls: () => [],
        getAllMessages: () => [],
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

import { SapOrchestrationProvider } from '../../src/providers/sapOrchestration.js';

describe('SapOrchestrationProvider complete() AbortSignal plumbing', () => {
  beforeEach(() => {
    capturedCalls = [];
  });

  it('forwards options.signal to the SDK inside requestConfig', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const ac = new AbortController();

    await provider.complete([{ role: 'user', content: 'hi' }], { signal: ac.signal });

    expect(capturedCalls).toHaveLength(1);
    const cfg = capturedCalls[0].requestConfig as { signal?: AbortSignal } | undefined;
    expect(cfg).toBeDefined();
    expect(cfg?.signal).toBe(ac.signal);
  });

  it('forwards both headers and signal when both are set', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const ac = new AbortController();
    const headers = { 'x-alexi-agent': 'quality' };

    await provider.complete([{ role: 'user', content: 'hi' }], {
      signal: ac.signal,
      headers,
    });

    const cfg = capturedCalls[0].requestConfig as
      { signal?: AbortSignal; headers?: Record<string, string> } | undefined;
    expect(cfg).toBeDefined();
    expect(cfg?.signal).toBe(ac.signal);
    expect(cfg?.headers).toEqual(headers);
  });

  it('keeps requestConfig undefined when neither headers nor signal are set', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    expect(capturedCalls).toHaveLength(1);
    expect(capturedCalls[0].requestConfig).toBeUndefined();
  });

  it('still forwards headers-only requestConfig when signal is absent', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });
    const headers = { 'x-alexi-agent': 'quality' };

    await provider.complete([{ role: 'user', content: 'hi' }], { headers });

    const cfg = capturedCalls[0].requestConfig as
      { signal?: AbortSignal; headers?: Record<string, string> } | undefined;
    expect(cfg).toBeDefined();
    expect(cfg?.headers).toEqual(headers);
    expect(cfg?.signal).toBeUndefined();
  });
});
