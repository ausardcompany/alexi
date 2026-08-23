/**
 * Router: image-generation capability filtering.
 *
 * A routing-config.json model that ONLY advertises the `image-generation`
 * capability must never be picked by the default text-chat router. The
 * `image_gen` tool / `alexi generate` command remain the only entry
 * points that route to such a model, resolving it via
 * `modelHasCapability` directly.
 *
 * This test guards two invariants:
 *   1. `isImageGenerationOnly` correctly identifies image-only vs mixed
 *      vs no-capability models.
 *   2. `routePrompt` and `explainRouting` both filter image-only models
 *      out of their candidate pool.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { RoutingConfig } from '../../src/config/routingConfig.js';
import type { ModelCapability } from '../../src/core/router.js';

vi.mock('../../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
  findMatchingRule: vi.fn(),
  evaluateRule: vi.fn(),
}));

import {
  routePrompt,
  explainRouting,
  reloadConfig,
  isImageGenerationOnly,
} from '../../src/core/router.js';
import { loadRoutingConfig, findMatchingRule } from '../../src/config/routingConfig.js';

const textModel: ModelCapability = {
  id: 'gpt-4o',
  type: 'openai',
  costTier: 'medium',
  strengths: ['coding', 'general-qa'],
  maxTokens: 128000,
  reasoning: false,
};

const imageOnlyModel: ModelCapability = {
  id: 'gemini-imagen-3',
  type: 'gemini',
  costTier: 'medium',
  strengths: ['image-generation'],
  maxTokens: 0,
  reasoning: false,
  capabilities: ['image-generation'],
};

const mixedCapabilityModel: ModelCapability = {
  id: 'multimodal-hypothetical',
  type: 'gemini',
  costTier: 'medium',
  strengths: ['general-qa', 'image-generation'],
  maxTokens: 100000,
  reasoning: false,
  capabilities: ['image-generation', 'tools'],
};

const mockConfig: RoutingConfig = {
  models: [textModel, imageOnlyModel, mixedCapabilityModel],
  rules: [],
  preferences: {
    preferCheapWhenPossible: false,
    defaultCostTier: 'medium',
    maxCostPerRequest: null,
    fallbackModel: 'gpt-4o',
  },
};

describe('isImageGenerationOnly', () => {
  it('returns true for a model that advertises ONLY image-generation', () => {
    expect(isImageGenerationOnly(imageOnlyModel)).toBe(true);
  });

  it('returns false when the model has no capabilities field', () => {
    expect(isImageGenerationOnly(textModel)).toBe(false);
  });

  it('returns false when the capabilities array is empty', () => {
    const model: ModelCapability = { ...textModel, capabilities: [] };
    expect(isImageGenerationOnly(model)).toBe(false);
  });

  it('returns false when image-generation is combined with other capabilities', () => {
    expect(isImageGenerationOnly(mixedCapabilityModel)).toBe(false);
  });

  it('returns false when the sole capability is not image-generation', () => {
    const toolsOnly: ModelCapability = {
      ...textModel,
      capabilities: ['tools'],
    };
    expect(isImageGenerationOnly(toolsOnly)).toBe(false);
  });
});

describe('routePrompt filters image-generation-only models', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadRoutingConfig).mockReturnValue(mockConfig);
    vi.mocked(findMatchingRule).mockReturnValue(null);
    reloadConfig();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('never picks an image-only model for a plain chat prompt', () => {
    const result = routePrompt('Write code for a REST API endpoint');
    expect(result.modelId).not.toBe('gemini-imagen-3');
  });

  it('never picks an image-only model even when its strengths would score high', () => {
    // "image-generation" is not a task classification the classifier
    // ever produces, but this test also guards against a future task
    // type that could accidentally match.
    const result = routePrompt('draw me a diagram of microservices architecture');
    expect(result.modelId).not.toBe('gemini-imagen-3');
  });

  it('still picks a mixed-capability model (image-generation + tools) for text tasks', () => {
    // The mixed model is the ONLY model whose strengths include
    // 'general-qa' after gpt-4o. Force a simple prompt that should
    // hit it or gpt-4o but never the image-only model.
    const result = routePrompt('What is the capital of France?');
    expect(['gpt-4o', 'multimodal-hypothetical']).toContain(result.modelId);
  });
});

describe('explainRouting excludes image-generation-only models from scoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadRoutingConfig).mockReturnValue(mockConfig);
    vi.mocked(findMatchingRule).mockReturnValue(null);
    reloadConfig();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('does not include an image-only model in the candidates list', async () => {
    const explanation = await explainRouting('write a haiku about the sea');
    const ids = explanation.candidates.map((c) => c.modelId);
    expect(ids).not.toContain('gemini-imagen-3');
    // But the mixed-capability model IS scored.
    expect(ids).toContain('multimodal-hypothetical');
  });
});
