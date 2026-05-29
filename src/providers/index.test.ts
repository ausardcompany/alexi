import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoisted mocks: vi.mock is hoisted above imports, but we declare the spies
// up-front so they can be shared between the factory and assertions.
vi.mock('./sapOrchestration.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./sapOrchestration.js')>();
  class MockProvider {
    modelName: string;
    __mockProvider = true;
    constructor(cfg: { modelName: string }) {
      this.modelName = cfg.modelName;
    }
  }
  return {
    ...actual,
    isOrchestrationModel: vi.fn(),
    SapOrchestrationProvider: MockProvider,
  };
});

vi.mock('../config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
}));

vi.mock('../config/env.js', () => ({
  env: vi.fn(() => undefined),
}));

vi.mock('../config/userConfig.js', () => ({
  getConfigDefaultModel: vi.fn(() => undefined),
}));

import { isOrchestrationModel } from './sapOrchestration.js';
import { loadRoutingConfig } from '../config/routingConfig.js';
import { getProviderForModelWithFallback, _resetFallbackWarningCache } from './index.js';

describe('getProviderForModelWithFallback', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    _resetFallbackWarningCache();
    vi.mocked(isOrchestrationModel).mockImplementation(
      (id: string) => id === 'gpt-4o' || id === 'gemini-2.5-pro'
    );
    vi.mocked(loadRoutingConfig).mockReturnValue({
      models: [],
      rules: [],
      preferences: {
        defaultCostTier: 'medium',
        preferCheapWhenPossible: false,
        maxCostPerRequest: null,
        fallbackModel: 'gpt-4o',
      },
    });
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('fallback path', () => {
    it('returns the fallback model and warns once when primary is unknown', () => {
      const result = getProviderForModelWithFallback('gpt-typo');

      expect(result.effectiveModelId).toBe('gpt-4o');
      expect(result.usedFallback).toBe(true);
      expect(result.provider).toBeDefined();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Primary model 'gpt-typo' not recognized, falling back to 'gpt-4o' for this session"
        )
      );
    });

    it('deduplicates the warning across repeated calls with the same bad id', () => {
      const first = getProviderForModelWithFallback('gpt-typo');
      const second = getProviderForModelWithFallback('gpt-typo');

      expect(first).toEqual(
        expect.objectContaining({ effectiveModelId: 'gpt-4o', usedFallback: true })
      );
      expect(second).toEqual(
        expect.objectContaining({ effectiveModelId: 'gpt-4o', usedFallback: true })
      );
      // Only one warn for the same bad id, even after two calls
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('warns separately for distinct bad model ids', () => {
      getProviderForModelWithFallback('gpt-typo');
      getProviderForModelWithFallback('another-bad-id');

      expect(warnSpy).toHaveBeenCalledTimes(2);
    });

    it('honors an explicit fallbackModel argument over routing config', () => {
      const result = getProviderForModelWithFallback('gpt-typo', 'gemini-2.5-pro');

      expect(result.effectiveModelId).toBe('gemini-2.5-pro');
      expect(result.usedFallback).toBe(true);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("falling back to 'gemini-2.5-pro'")
      );
    });

    it("falls back to hardcoded 'gpt-4o' if routing config load throws", () => {
      vi.mocked(loadRoutingConfig).mockImplementation(() => {
        throw new Error('config corrupted');
      });

      const result = getProviderForModelWithFallback('gpt-typo');

      expect(result.effectiveModelId).toBe('gpt-4o');
      expect(result.usedFallback).toBe(true);
    });
  });

  describe('no-fallback path (regression)', () => {
    it("returns the primary model and never warns when 'gpt-4o' is valid", () => {
      const result = getProviderForModelWithFallback('gpt-4o');

      expect(result.effectiveModelId).toBe('gpt-4o');
      expect(result.usedFallback).toBe(false);
      expect(result.provider).toBeDefined();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not warn for any number of valid-id calls', () => {
      getProviderForModelWithFallback('gpt-4o');
      getProviderForModelWithFallback('gemini-2.5-pro');
      getProviderForModelWithFallback('gpt-4o');

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
