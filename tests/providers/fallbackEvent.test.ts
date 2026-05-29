/**
 * Integration test for the ProviderModelFellBack bus event published by
 * getProviderForModelWithFallback when the primary model id is not recognized.
 *
 * Counterpart to src/providers/index.test.ts (which is the unit test). This
 * file exercises the publish/subscribe contract from the consumer's perspective:
 * a subscriber registered before the call should fire exactly once per
 * (bad-model-id) per process lifetime.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/providers/sapOrchestration.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/providers/sapOrchestration.js')>();
  class MockProvider {
    modelName: string;
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

vi.mock('../../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
}));

vi.mock('../../src/config/env.js', () => ({
  env: vi.fn(() => undefined),
}));

vi.mock('../../src/config/userConfig.js', () => ({
  getConfigDefaultModel: vi.fn(() => undefined),
}));

import { isOrchestrationModel } from '../../src/providers/sapOrchestration.js';
import { loadRoutingConfig } from '../../src/config/routingConfig.js';
import { ProviderModelFellBack } from '../../src/bus/index.js';
import {
  getProviderForModelWithFallback,
  _resetFallbackWarningCache,
} from '../../src/providers/index.js';

describe('ProviderModelFellBack event', () => {
  let unsubscribe: () => void;

  beforeEach(() => {
    _resetFallbackWarningCache();
    vi.mocked(isOrchestrationModel).mockImplementation((id: string) => id === 'gpt-4o');
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
  });

  afterEach(() => {
    unsubscribe?.();
    vi.clearAllMocks();
  });

  it('fires the subscriber when fallback engages, with the requested + effective model ids', () => {
    const handler = vi.fn();
    unsubscribe = ProviderModelFellBack.subscribe(handler);

    getProviderForModelWithFallback('totally-fake-model');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        requestedModel: 'totally-fake-model',
        effectiveModel: 'gpt-4o',
      })
    );
  });

  it('does not fire the subscriber twice for the same bad id (dedup)', () => {
    const handler = vi.fn();
    unsubscribe = ProviderModelFellBack.subscribe(handler);

    getProviderForModelWithFallback('totally-fake-model');
    getProviderForModelWithFallback('totally-fake-model');
    getProviderForModelWithFallback('totally-fake-model');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire the subscriber when the primary model is recognized', () => {
    const handler = vi.fn();
    unsubscribe = ProviderModelFellBack.subscribe(handler);

    getProviderForModelWithFallback('gpt-4o');

    expect(handler).not.toHaveBeenCalled();
  });
});
