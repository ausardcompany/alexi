/**
 * Tests for temperature plumbing in the SAP Orchestration provider.
 *
 * Anthropic deprecated the `temperature` sampling parameter for the
 * Claude Opus 4 family (4.1+) in favour of adaptive reasoning controls
 * (Aider #5173, 2026-08-10). These tests verify that:
 *
 *  - `temperature` is omitted from `modelParams` for Opus 4.1+ ids when
 *    neither the config nor the per-call options request one.
 *  - An explicitly requested `temperature` is still forwarded for Opus
 *    4.1+ ids (caller override wins).
 *  - Other Anthropic families (haiku, sonnet, older opus) and non-
 *    Anthropic models still receive the default `temperature` of 0.7
 *    when unspecified.
 *  - Per-call `temperature` overrides `config.temperature` for
 *    non-Opus-4 families.
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

describe('SapOrchestrationProvider temperature plumbing - Opus 4.1+', () => {
  beforeEach(() => {
    capturedModuleConfigs = [];
  });

  it('omits temperature from modelParams for anthropic--claude-4.5-opus', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.5-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect('temperature' in modelParams).toBe(false);
  });

  it('omits temperature for anthropic--claude-4.6-opus', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.6-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect('temperature' in modelParams).toBe(false);
  });

  it('omits temperature for anthropic--claude-4.7-opus (pinned agent model)', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect('temperature' in modelParams).toBe(false);
  });

  it('still forwards temperature when the caller explicitly requests one on Opus 4.1+', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }], { temperature: 0.2 });

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.2);
  });

  it('still forwards config.temperature when set for Opus 4.1+', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.7-opus',
      deploymentId: 'test-deployment',
      temperature: 0.4,
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.4);
  });
});

describe('SapOrchestrationProvider temperature plumbing - non-Opus-4 families', () => {
  beforeEach(() => {
    capturedModuleConfigs = [];
  });

  it('applies the default temperature of 0.7 for gpt-4o when unspecified', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.7);
  });

  it('applies the default temperature of 0.7 for anthropic--claude-4.5-sonnet', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-4.5-sonnet',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.7);
  });

  it('applies the default temperature of 0.7 for anthropic--claude-3.7-sonnet', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'anthropic--claude-3.7-sonnet',
      deploymentId: 'test-deployment',
    });

    await provider.complete([{ role: 'user', content: 'hi' }]);

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.7);
  });

  it('honours per-call temperature override over config.temperature', async () => {
    const provider = new SapOrchestrationProvider({
      modelName: 'gpt-4o',
      deploymentId: 'test-deployment',
      temperature: 0.3,
    });

    await provider.complete([{ role: 'user', content: 'hi' }], { temperature: 0.9 });

    const modelParams = getModelParams(capturedModuleConfigs[0]);
    expect(modelParams.temperature).toBe(0.9);
  });
});
