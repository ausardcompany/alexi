/**
 * Tests for top-k sampling plumbing in the SAP Orchestration provider.
 *
 * Verifies that `topK` on either OrchestrationConfig or per-call
 * CompletionOptions reaches `modelParams.top_k` in the module config that
 * is handed to the SDK's OrchestrationClient, and that per-call options
 * take precedence over config defaults. Also verifies that omitting
 * `topK` does NOT introduce `top_k` into `modelParams`.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture module configs the provider hands to OrchestrationClient
let capturedModuleConfigs: Array<Record<string, unknown>> = [];

vi.mock('@sap-ai-sdk/orchestration', () => {
  class MockOrchestrationClient {
    constructor(
      public _moduleConfig: Record<string, unknown>,
      public _deploymentConfig: unknown
    ) {
      capturedModuleConfigs.push(_moduleConfig);
    }

    async chatCompletion(_params: { messages: unknown[] }) {
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

type ModuleConfigShape = {
  promptTemplating?: {
    model?: {
      name?: string;
      version?: string;
      params?: Record<string, unknown>;
    };
  };
};

function getModelParams(mc: Record<string, unknown>): Record<string, unknown> {
  const model = (mc as ModuleConfigShape).promptTemplating?.model;
  return (model?.params ?? {}) as Record<string, unknown>;
}

describe('SapOrchestrationProvider top_k plumbing', () => {
  beforeEach(() => {
    capturedModuleConfigs = [];
  });

  it('passes per-call topK into modelParams.top_k', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }], { topK: 40 });

    expect(capturedModuleConfigs).toHaveLength(1);
    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.top_k).toBe(40);
  });

  it('falls back to config.topK when per-call topK is omitted', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
      topK: 25,
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.top_k).toBe(25);
  });

  it('lets per-call topK override config.topK', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
      topK: 25,
    });

    await provider.complete([{ role: 'user', content: 'hi' }], { topK: 80 });

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.top_k).toBe(80);
  });

  it('omits top_k from modelParams when neither config nor options set it', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect('top_k' in modelParams).toBe(false);
  });
});
