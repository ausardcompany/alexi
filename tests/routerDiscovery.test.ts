/**
 * Tests for routePromptWithDiscovery - the async router that integrates
 * dynamic model discovery with routing decisions.
 *
 * Covers:
 * - Integration of discovered models with routing
 * - Forced model bypass of discovery
 * - Fallback behavior when discovery fails
 * - Constraint of routing decisions to available models
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { RoutingConfig } from '../src/config/routingConfig.js';
import type { ModelCapability } from '../src/core/router.js';

// Mock the config module
vi.mock('../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
  findMatchingRule: vi.fn(),
  evaluateRule: vi.fn(),
}));

// Mock the model discovery module
vi.mock('../src/providers/modelDiscovery.js', () => ({
  getAvailableModelIds: vi.fn(),
}));

import { routePromptWithDiscovery, reloadConfig } from '../src/core/router.js';
import { loadRoutingConfig, findMatchingRule } from '../src/config/routingConfig.js';
import { getAvailableModelIds } from '../src/providers/modelDiscovery.js';

describe('routePromptWithDiscovery', () => {
  const mockModels: ModelCapability[] = [
    {
      id: 'gpt-4o-mini',
      type: 'openai',
      costTier: 'cheap',
      strengths: ['simple-qa', 'general-qa'],
      maxTokens: 4096,
      reasoning: false,
    },
    {
      id: 'gpt-4o',
      type: 'openai',
      costTier: 'medium',
      strengths: ['coding', 'general-qa'],
      maxTokens: 8192,
      reasoning: true,
    },
    {
      id: 'anthropic--claude-4-opus',
      type: 'claude',
      costTier: 'expensive',
      strengths: ['deep-reasoning', 'coding', 'creative-writing'],
      maxTokens: 16384,
      reasoning: true,
    },
  ];

  const mockConfig: RoutingConfig = {
    models: mockModels,
    rules: [],
    preferences: {
      preferCheapWhenPossible: false,
      defaultCostTier: 'medium',
      maxCostPerRequest: null,
      fallbackModel: 'gpt-4o',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadRoutingConfig).mockReturnValue(mockConfig);
    vi.mocked(findMatchingRule).mockReturnValue(null);
    reloadConfig();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should use discovered models to constrain routing decisions', async () => {
    // Only gpt-4o is available from discovery
    vi.mocked(getAvailableModelIds).mockResolvedValue(['gpt-4o']);

    const result = await routePromptWithDiscovery('What is 2+2?');

    // Even though gpt-4o-mini would normally win for simple tasks,
    // only gpt-4o is available
    expect(result.modelId).toBe('gpt-4o');
    expect(getAvailableModelIds).toHaveBeenCalledTimes(1);
  });

  it('should pass all discovered models to the router', async () => {
    vi.mocked(getAvailableModelIds).mockResolvedValue([
      'gpt-4o-mini',
      'gpt-4o',
      'anthropic--claude-4-opus',
    ]);

    const result = await routePromptWithDiscovery('What is 2+2?');

    // With all models available, normal routing applies
    expect(result.modelId).toBe('gpt-4o-mini');
  });

  it('should bypass discovery when model is forced', async () => {
    const result = await routePromptWithDiscovery('Any prompt', {
      forceModel: 'custom-model',
    });

    expect(result.modelId).toBe('custom-model');
    expect(result.reason).toBe('User specified model');
    expect(result.confidence).toBe(1.0);
    // Should not call discovery for forced models
    expect(getAvailableModelIds).not.toHaveBeenCalled();
  });

  it('should respect preferCheap option', async () => {
    vi.mocked(getAvailableModelIds).mockResolvedValue([
      'gpt-4o-mini',
      'gpt-4o',
      'anthropic--claude-4-opus',
    ]);

    const result = await routePromptWithDiscovery('Hello', {
      preferCheap: true,
    });

    expect(result.reason).toContain('cost optimized');
  });

  it('should handle discovery returning static fallback models', async () => {
    // Simulate discovery failing and returning static list
    vi.mocked(getAvailableModelIds).mockResolvedValue([
      'gpt-4o',
      'gpt-4o-mini',
      'anthropic--claude-4-opus',
      'gemini-2.5-flash',
    ]);

    const result = await routePromptWithDiscovery('Explain why step by step');

    // Should still route correctly with fallback models
    expect(result.modelId).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should constrain complex task routing to available models', async () => {
    // Only cheap model available
    vi.mocked(getAvailableModelIds).mockResolvedValue(['gpt-4o-mini']);

    const result = await routePromptWithDiscovery(
      'Explain the philosophical implications of quantum mechanics step by step'
    );

    // Even for complex reasoning, must use what's available
    expect(result.modelId).toBe('gpt-4o-mini');
  });

  it('should still return routing reason from discovery-aware routing', async () => {
    vi.mocked(getAvailableModelIds).mockResolvedValue(['gpt-4o', 'gpt-4o-mini']);

    const result = await routePromptWithDiscovery('Write code for a REST API');

    expect(result.reason).toContain('coding');
  });

  it('should work when discovery returns models not in the routing config', async () => {
    // Discovery returns a model that's not in the routing config
    vi.mocked(getAvailableModelIds).mockResolvedValue(['gpt-4o', 'new-model-not-in-config']);

    const result = await routePromptWithDiscovery('Hello');

    // Should filter to only models that exist in routing config
    expect(result.modelId).toBe('gpt-4o');
  });

  it('should be an async function that returns a Promise', async () => {
    vi.mocked(getAvailableModelIds).mockResolvedValue(['gpt-4o']);

    const promise = routePromptWithDiscovery('Test');
    expect(promise).toBeInstanceOf(Promise);

    const result = await promise;
    expect(result).toHaveProperty('modelId');
    expect(result).toHaveProperty('reason');
    expect(result).toHaveProperty('confidence');
  });
});
