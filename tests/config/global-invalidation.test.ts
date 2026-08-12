/**
 * Tests for the global config invalidation registry.
 *
 * Ported from kilocode `19a2a3c4d`. Verifies that:
 *  - Registered disposers fire on `invalidateGlobalConfig`.
 *  - Unregistered disposers do NOT fire.
 *  - A throwing disposer does not prevent the rest from running.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  registerInstanceCache,
  invalidateGlobalConfig,
  _instanceCacheCount,
} from '../../src/config/invalidation.js';

describe('invalidateGlobalConfig', () => {
  beforeEach(() => {
    // Registry is module-scoped; leftover disposers from other tests
    // would confound the counts. Nothing to reset here yet — the
    // registry itself has no public reset, but every test cleans up its
    // own disposers via the returned dispose fn.
  });

  it('calls every registered disposer', () => {
    const a = vi.fn();
    const b = vi.fn();
    const disposeA = registerInstanceCache(a);
    const disposeB = registerInstanceCache(b);

    invalidateGlobalConfig();

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);

    disposeA();
    disposeB();
  });

  it('does not call disposers that have been unregistered', () => {
    const a = vi.fn();
    const disposeA = registerInstanceCache(a);
    disposeA();

    invalidateGlobalConfig();

    expect(a).not.toHaveBeenCalled();
  });

  it('continues invoking remaining disposers even when one throws', () => {
    const a = vi.fn(() => {
      throw new Error('boom');
    });
    const b = vi.fn();
    const disposeA = registerInstanceCache(a);
    const disposeB = registerInstanceCache(b);

    // Silence the console.warn emitted by the swallowed error.
    // eslint-disable-next-line no-console
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => invalidateGlobalConfig()).not.toThrow();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
    disposeA();
    disposeB();
  });

  it('tracks the registered cache count', () => {
    const before = _instanceCacheCount();
    const dispose = registerInstanceCache(() => {});
    expect(_instanceCacheCount()).toBe(before + 1);
    dispose();
    expect(_instanceCacheCount()).toBe(before);
  });
});
