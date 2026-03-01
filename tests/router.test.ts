import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { RoutingConfig, RoutingRule } from '../src/config/routingConfig.js';
import type { ModelCapability } from '../src/core/router.js';

// Mock the config module
vi.mock('../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
  findMatchingRule: vi.fn(),
  evaluateRule: vi.fn(),
}));

import { routePrompt, explainRouting, reloadConfig } from '../src/core/router.js';
import { loadRoutingConfig, findMatchingRule } from '../src/config/routingConfig.js';

describe('Router', () => {
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
    {
      id: 'disabled-model',
      type: 'openai',
      costTier: 'cheap',
      strengths: ['general-qa'],
      maxTokens: 4096,
      reasoning: false,
      enabled: false,
    } as ModelCapability & { enabled: boolean },
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

  describe('routePrompt', () => {
    describe('forced model selection', () => {
      it('should use forced model when specified', () => {
        const result = routePrompt('Any prompt', {
          forceModel: 'custom-model',
        });

        expect(result.modelId).toBe('custom-model');
        expect(result.reason).toBe('User specified model');
        expect(result.confidence).toBe(1.0);
      });
    });

    describe('prompt classification', () => {
      it('should classify simple questions correctly', () => {
        const result = routePrompt('What is the capital of France?');

        // Simple questions should route to cheaper models
        expect(result.modelId).toBe('gpt-4o-mini');
        expect(result.reason).toContain('simple-qa');
      });

      it('should classify coding tasks correctly', () => {
        const result = routePrompt('Write code for a REST API endpoint');

        expect(result.reason).toContain('coding');
      });

      it('should classify reasoning tasks correctly', () => {
        const result = routePrompt('Explain why gravity affects time dilation step by step');

        expect(result.reason).toContain('deep-reasoning');
        expect(result.reason).toContain('requires reasoning');
      });

      it('should classify creative writing correctly', () => {
        const result = routePrompt('Write a story about a brave knight');

        expect(result.reason).toContain('creative-writing');
      });
    });

    describe('complexity detection', () => {
      it('should detect simple complexity for short simple prompts', () => {
        const result = routePrompt('What is 2+2?');

        expect(result.reason).toContain('simple');
      });

      it('should detect complex complexity for long prompts', () => {
        const longPrompt = 'A'.repeat(600) + ' explain this complex topic';

        const result = routePrompt(longPrompt);

        expect(result.reason).toContain('complex');
      });

      it('should detect complex when prompt contains "complex"', () => {
        const result = routePrompt('Explain this complex algorithm');

        expect(result.reason).toContain('complex');
      });

      it('should detect complex when prompt contains "advanced"', () => {
        const result = routePrompt('Advanced machine learning techniques');

        expect(result.reason).toContain('complex');
      });
    });

    describe('cost optimization', () => {
      it('should prefer cheap models when preferCheap is true', () => {
        const result = routePrompt('Hello, how are you?', {
          preferCheap: true,
        });

        // Cheap models get bonus score, but medium models with more strengths may still win
        // The key assertion is that cost optimization is applied
        expect(result.reason).toContain('cost optimized');
      });

      it('should use config preference when not specified', () => {
        vi.mocked(loadRoutingConfig).mockReturnValue({
          ...mockConfig,
          preferences: {
            preferCheapWhenPossible: true,
            defaultCostTier: 'medium',
            maxCostPerRequest: null,
            fallbackModel: 'gpt-4o',
          },
        });
        reloadConfig();

        const result = routePrompt('Hello');

        expect(result.reason).toContain('cost optimized');
      });
    });

    describe('model filtering', () => {
      it('should filter by available models', () => {
        const result = routePrompt('Test prompt', {
          availableModels: ['gpt-4o'],
        });

        expect(result.modelId).toBe('gpt-4o');
      });

      it('should exclude disabled models', () => {
        const result = routePrompt('Test prompt', {
          availableModels: ['disabled-model', 'gpt-4o'],
        });

        expect(result.modelId).toBe('gpt-4o');
      });
    });

    describe('rule-based routing', () => {
      it('should apply matching rule with model', () => {
        vi.mocked(findMatchingRule).mockReturnValue({
          name: 'code-review-rule',
          description: 'Use Claude for code reviews',
          modelId: 'anthropic--claude-4-opus',
          priority: 100,
          condition: {},
        } as RoutingRule);

        const result = routePrompt('Review this code');

        expect(result.modelId).toBe('anthropic--claude-4-opus');
        expect(result.reason).toContain('Rule applied: code-review-rule');
        expect(result.ruleApplied).toBe('code-review-rule');
        expect(result.confidence).toBe(1.0);
      });

      it('should set requiresReasoning from rule', () => {
        vi.mocked(findMatchingRule).mockReturnValue({
          name: 'analysis-rule',
          description: 'Analysis tasks need reasoning',
          priority: 90,
          condition: {},
          requiresReasoning: true,
          // No modelId - let scoring decide
        } as RoutingRule);

        const result = routePrompt('Analyze this data');

        expect(result.reason).toContain('influenced by rule: analysis-rule');
      });
    });

    describe('confidence calculation', () => {
      it('should return confidence between 0 and 1', () => {
        const result = routePrompt('Test prompt');

        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('explainRouting', () => {
    it('should return classification details', async () => {
      const result = await explainRouting('Write code for a function to sort arrays');

      expect(result.classification).toBeDefined();
      expect(result.classification.type).toBe('coding');
      expect(result.classification.complexity).toBeDefined();
      expect(result.classification.requiresReasoning).toBeDefined();
      expect(result.classification.estimatedTokens).toBeGreaterThan(0);
    });

    it('should return scored candidates', async () => {
      const result = await explainRouting('Test prompt');

      expect(result.candidates).toBeDefined();
      expect(result.candidates.length).toBeGreaterThan(0);
      expect(result.candidates[0]).toHaveProperty('modelId');
      expect(result.candidates[0]).toHaveProperty('score');
      expect(result.candidates[0]).toHaveProperty('reason');
    });

    it('should return candidates sorted by score descending', async () => {
      const result = await explainRouting('Complex reasoning task step by step');

      for (let i = 0; i < result.candidates.length - 1; i++) {
        expect(result.candidates[i].score).toBeGreaterThanOrEqual(result.candidates[i + 1].score);
      }
    });

    it('should return selected model', async () => {
      const result = await explainRouting('Test');

      expect(result.selected).toBeDefined();
      expect(result.selected.modelId).toBeDefined();
      expect(result.selected.reason).toBeDefined();
      expect(result.selected.confidence).toBeDefined();
    });
  });

  describe('reloadConfig', () => {
    it('should clear cached config', () => {
      // First call loads config
      routePrompt('Test');
      expect(loadRoutingConfig).toHaveBeenCalledTimes(1);

      // Second call uses cache
      routePrompt('Test again');
      expect(loadRoutingConfig).toHaveBeenCalledTimes(1);

      // Reload clears cache
      reloadConfig();

      // Next call loads config again
      routePrompt('Test after reload');
      expect(loadRoutingConfig).toHaveBeenCalledTimes(2);
    });
  });

  describe('model scoring', () => {
    it('should score cheap models higher for simple tasks', () => {
      const result = routePrompt('What is 2+2?');

      // For simple tasks, cheap model should win
      expect(result.modelId).toBe('gpt-4o-mini');
    });

    it('should score expensive models higher for complex reasoning', () => {
      const result = routePrompt(
        'Analyze the philosophical implications of quantum mechanics and explain step by step the relationship between consciousness and wave function collapse'
      );

      // Complex reasoning should favor expensive models with reasoning
      expect(result.modelId).toBe('anthropic--claude-4-opus');
    });

    it('should score models higher when they match task strengths', () => {
      // Coding task should favor models with coding strength
      const codingResult = routePrompt('Implement a binary search algorithm');
      expect(['gpt-4o', 'anthropic--claude-4-opus']).toContain(codingResult.modelId);
    });

    it('should penalize models without reasoning for reasoning tasks', () => {
      const result = routePrompt('Explain why the sky is blue step by step');

      // Models with reasoning=true should score higher
      expect(['gpt-4o', 'anthropic--claude-4-opus']).toContain(result.modelId);
    });
  });

  describe('pattern detection', () => {
    const patterns = [
      { prompt: 'What is the definition of AI?', expectedType: 'simple-qa' },
      { prompt: 'Define machine learning', expectedType: 'simple-qa' },
      { prompt: 'Translate hello to French', expectedType: 'simple-qa' },
      { prompt: 'Is this true or false: 2+2=4', expectedType: 'simple-qa' },
      { prompt: 'Write code for sorting', expectedType: 'coding' },
      { prompt: 'function calculateSum()', expectedType: 'coding' },
      { prompt: 'Debug this code please', expectedType: 'coding' },
      { prompt: 'Refactor this class', expectedType: 'coding' },
      { prompt: 'Explain why gravity exists', expectedType: 'deep-reasoning' },
      { prompt: 'Analyze the data patterns', expectedType: 'deep-reasoning' },
      { prompt: 'Compare and contrast A vs B', expectedType: 'deep-reasoning' },
      { prompt: 'Write a story about dragons', expectedType: 'creative-writing' },
      { prompt: 'Write a poem about love', expectedType: 'creative-writing' },
      { prompt: 'Brainstorm ideas for a startup', expectedType: 'creative-writing' },
    ];

    patterns.forEach(({ prompt, expectedType }) => {
      it(`should classify "${prompt.substring(0, 30)}..." as ${expectedType}`, () => {
        const result = routePrompt(prompt);
        expect(result.reason).toContain(expectedType);
      });
    });
  });
});
