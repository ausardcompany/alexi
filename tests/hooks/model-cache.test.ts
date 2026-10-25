/**
 * Step-level prompt-hook model resolution cache tests.
 *
 * Covers issue #2143 (ports SST OpenCode PR #58601, merged 2026-10-24):
 * prompt hooks that resolve model config on every invocation become
 * expensive and noisy when the same model is reused across many hook
 * calls within a single agent step. The cache in `src/hooks/index.ts`
 * memoizes resolution for the duration of one step (keyed by
 * `${stepId}:${modelName}`) and is cleared once the step completes so
 * cross-step pollution cannot mask routing changes.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getModelForHook,
  clearStepCache,
  _resetModelResolutionCache,
  _modelResolutionCacheSize,
  type ModelConfig,
} from '../../src/hooks/index.js';

describe('Prompt hook model resolution cache', () => {
  beforeEach(() => {
    _resetModelResolutionCache();
  });

  it('resolves the model config on first call and caches the result', () => {
    const resolver = vi.fn<[], ModelConfig>(() => ({
      provider: 'sap-ai-core',
      deploymentId: 'd-1',
    }));

    const config = getModelForHook('step-1', 'gpt-4o', resolver);

    expect(config).toEqual({ provider: 'sap-ai-core', deploymentId: 'd-1' });
    expect(resolver).toHaveBeenCalledTimes(1);
    expect(_modelResolutionCacheSize()).toBe(1);
  });

  it('returns the cached config on subsequent calls without invoking the resolver', () => {
    const resolver = vi.fn<[], ModelConfig>(() => ({ provider: 'sap-ai-core', version: 'v1' }));

    const first = getModelForHook('step-1', 'gpt-4o', resolver);
    const second = getModelForHook('step-1', 'gpt-4o', resolver);
    const third = getModelForHook('step-1', 'gpt-4o', resolver);

    expect(resolver).toHaveBeenCalledTimes(1);
    // All three references point at the SAME cached object (identity, not
    // equality) — the whole point of the cache.
    expect(second).toBe(first);
    expect(third).toBe(first);
    expect(_modelResolutionCacheSize()).toBe(1);
  });

  it('isolates caches between different steps for the same model name', () => {
    const resolverA = vi.fn<[], ModelConfig>(() => ({ step: 'A' }));
    const resolverB = vi.fn<[], ModelConfig>(() => ({ step: 'B' }));

    const configA = getModelForHook('step-A', 'gpt-4o', resolverA);
    const configB = getModelForHook('step-B', 'gpt-4o', resolverB);

    expect(resolverA).toHaveBeenCalledTimes(1);
    expect(resolverB).toHaveBeenCalledTimes(1);
    expect(configA).toEqual({ step: 'A' });
    expect(configB).toEqual({ step: 'B' });
    expect(configA).not.toBe(configB);
    expect(_modelResolutionCacheSize()).toBe(2);
  });

  it('caches different models within the same step independently', () => {
    const resolver4o = vi.fn<[], ModelConfig>(() => ({ name: 'gpt-4o' }));
    const resolverSonnet = vi.fn<[], ModelConfig>(() => ({ name: 'claude-3.7-sonnet' }));

    const first4o = getModelForHook('step-1', 'gpt-4o', resolver4o);
    const firstSonnet = getModelForHook('step-1', 'anthropic--claude-3.7-sonnet', resolverSonnet);
    const second4o = getModelForHook('step-1', 'gpt-4o', resolver4o);
    const secondSonnet = getModelForHook('step-1', 'anthropic--claude-3.7-sonnet', resolverSonnet);

    expect(resolver4o).toHaveBeenCalledTimes(1);
    expect(resolverSonnet).toHaveBeenCalledTimes(1);
    expect(second4o).toBe(first4o);
    expect(secondSonnet).toBe(firstSonnet);
    expect(_modelResolutionCacheSize()).toBe(2);
  });

  it('clears only entries for the specified step on clearStepCache', () => {
    const resolver = vi.fn<[], ModelConfig>(() => ({ created: Date.now() }));

    getModelForHook('step-1', 'gpt-4o', resolver);
    getModelForHook('step-1', 'claude', resolver);
    getModelForHook('step-2', 'gpt-4o', resolver);

    expect(_modelResolutionCacheSize()).toBe(3);

    clearStepCache('step-1');

    // Only step-2's entry remains.
    expect(_modelResolutionCacheSize()).toBe(1);

    // Resolving step-1 again must invoke the resolver (cache miss),
    // while step-2 still returns a cached value.
    const callsBefore = resolver.mock.calls.length;
    getModelForHook('step-2', 'gpt-4o', resolver);
    expect(resolver.mock.calls.length).toBe(callsBefore); // cache hit

    getModelForHook('step-1', 'gpt-4o', resolver);
    expect(resolver.mock.calls.length).toBe(callsBefore + 1); // cache miss
  });

  it('clearStepCache is a no-op for an unknown step id', () => {
    const resolver = vi.fn<[], ModelConfig>(() => ({ ok: true }));
    getModelForHook('step-1', 'gpt-4o', resolver);
    const sizeBefore = _modelResolutionCacheSize();

    clearStepCache('does-not-exist');

    expect(_modelResolutionCacheSize()).toBe(sizeBefore);
  });

  it('does NOT confuse a step id that is a prefix of another step id', () => {
    const resolver = vi.fn<[], ModelConfig>(() => ({ ok: true }));

    // Keys stored will be:
    //   "step-1:gpt-4o"
    //   "step-10:gpt-4o"
    // Because the implementation keys by `${stepId}:${modelName}` and
    // matches on the `${stepId}:` prefix in `clearStepCache`, clearing
    // "step-1" must NOT drop "step-10"'s entries.
    getModelForHook('step-1', 'gpt-4o', resolver);
    getModelForHook('step-10', 'gpt-4o', resolver);

    expect(_modelResolutionCacheSize()).toBe(2);
    clearStepCache('step-1');
    expect(_modelResolutionCacheSize()).toBe(1);

    // Confirm step-10 is still cached by observing resolver call count.
    const callsBefore = resolver.mock.calls.length;
    getModelForHook('step-10', 'gpt-4o', resolver);
    expect(resolver.mock.calls.length).toBe(callsBefore);
  });

  it('refreshes after a clear — a routing change mid-session is visible', () => {
    // Simulate a routing config change between steps. Step 1 sees the
    // old config, step 2 (after clearStepCache) sees the new one.
    let currentConfig: ModelConfig = { deployment: 'old' };
    const resolver = vi.fn<[], ModelConfig>(() => currentConfig);

    const step1 = getModelForHook('step-1', 'gpt-4o', resolver);
    expect(step1).toEqual({ deployment: 'old' });

    // Routing config changes between steps.
    currentConfig = { deployment: 'new' };

    // Still step 1 — must return cached value (old deployment).
    const step1Again = getModelForHook('step-1', 'gpt-4o', resolver);
    expect(step1Again).toEqual({ deployment: 'old' });

    // Step 1 completes.
    clearStepCache('step-1');

    // Step 2 — fresh resolution picks up the new config.
    const step2 = getModelForHook('step-2', 'gpt-4o', resolver);
    expect(step2).toEqual({ deployment: 'new' });
  });
});
