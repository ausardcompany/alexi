/**
 * Tests for provider-specific sampling parameter plumbing (xAI `min_p`,
 * Anthropic `speed`, OpenAI Responses `reasoning` mode).
 *
 * Issue #2150 — ports SST OpenCode PRs #58868, #58870, #58872 which added
 * provider-specific sampling parameters that improve output quality or
 * enable faster tiers. Alexi forwards them through SAP AI Core
 * orchestration, but ONLY to the model family that documents each field:
 *
 *  - `min_p`                : xAI (Grok) only.
 *  - `speed`                : Anthropic only.
 *  - `reasoning: { mode }`  : OpenAI only.
 *
 * The guard logic lives in `SapOrchestrationProvider#buildModuleConfig`
 * (see `src/providers/sapOrchestration.ts`). These tests pin that
 * contract by capturing the OrchestrationClient module config and
 * asserting both the positive case (correct family -> field present)
 * and the negative case (wrong family -> field absent).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Capture every module config the provider hands to OrchestrationClient
// so individual tests can inspect the modelParams the SDK would send.
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

describe('SapOrchestrationProvider provider-specific sampling params (issue #2150)', () => {
  beforeEach(() => {
    capturedModuleConfigs = [];
  });

  describe('xAI min_p', () => {
    it('forwards per-call minP to modelParams.min_p for xAI (grok) models', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { minP: 0.05 });

      expect(capturedModuleConfigs).toHaveLength(1);
      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.min_p).toBe(0.05);
    });

    it('falls back to config.minP when per-call minP is omitted', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
        minP: 0.1,
      });

      await provider.complete([{ role: 'user', content: 'hi' }]);

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.min_p).toBe(0.1);
    });

    it('lets per-call minP override config.minP', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
        minP: 0.1,
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { minP: 0.2 });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.min_p).toBe(0.2);
    });

    it('does NOT forward min_p to Anthropic models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'anthropic--claude-4.7-opus',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { minP: 0.05 });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('min_p' in modelParams).toBe(false);
    });

    it('does NOT forward min_p to OpenAI models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'gpt-4o',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { minP: 0.05 });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('min_p' in modelParams).toBe(false);
    });

    it('omits min_p entirely when neither config nor options set it', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }]);

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('min_p' in modelParams).toBe(false);
    });
  });

  describe('Anthropic speed', () => {
    it('forwards per-call speed to modelParams.speed for Claude models', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'anthropic--claude-4.7-opus',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { speed: 'fast' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.speed).toBe('fast');
    });

    it('falls back to config.speed when per-call speed is omitted', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'anthropic--claude-4.7-opus',
        deploymentId: 'test-deployment',
        speed: 'fast',
      });

      await provider.complete([{ role: 'user', content: 'hi' }]);

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.speed).toBe('fast');
    });

    it('does NOT forward speed to xAI models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { speed: 'fast' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('speed' in modelParams).toBe(false);
    });

    it('does NOT forward speed to OpenAI models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'gpt-4o',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { speed: 'fast' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('speed' in modelParams).toBe(false);
    });

    it('omits speed entirely when neither config nor options set it', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'anthropic--claude-4.7-opus',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }]);

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('speed' in modelParams).toBe(false);
    });
  });

  describe('OpenAI reasoning (Responses extended-thinking)', () => {
    it('forwards reasoningMode: "extended" as modelParams.reasoning for OpenAI models', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'gpt-4o',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { reasoningMode: 'extended' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.reasoning).toEqual({ mode: 'extended' });
    });

    it('falls back to config.reasoningMode when per-call reasoningMode is omitted', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'gpt-4o',
        deploymentId: 'test-deployment',
        reasoningMode: 'extended',
      });

      await provider.complete([{ role: 'user', content: 'hi' }]);

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.reasoning).toEqual({ mode: 'extended' });
    });

    it('does NOT emit reasoning for reasoningMode: "default" (opt-in only)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'gpt-4o',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { reasoningMode: 'default' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('reasoning' in modelParams).toBe(false);
    });

    it('does NOT forward reasoning mode to Anthropic models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'anthropic--claude-4.7-opus',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { reasoningMode: 'extended' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('reasoning' in modelParams).toBe(false);
    });

    it('does NOT forward reasoning mode to xAI models (capability guard)', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { reasoningMode: 'extended' });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect('reasoning' in modelParams).toBe(false);
    });
  });

  describe('top_k on xAI models (shared with Anthropic)', () => {
    it('forwards top_k to xAI models', async () => {
      const provider = new SapOrchestrationProvider({
        modelName: 'xai--grok-2',
        deploymentId: 'test-deployment',
      });

      await provider.complete([{ role: 'user', content: 'hi' }], { topK: 40 });

      const modelParams = getModelParams(capturedModuleConfigs[0]);
      expect(modelParams.top_k).toBe(40);
    });
  });
});
