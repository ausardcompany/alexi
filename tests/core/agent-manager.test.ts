/**
 * Tests for the project-scoped worktree behaviour on
 * `ActivityEventForwarder` (issue #1834):
 *
 *   1. Selecting a new worktree drops the OUTGOING worktree's
 *      provider cache so credentials cannot leak between projects.
 *   2. `activateWorktree` runs the bootstrap callback the first time
 *      and skips it once bootstrap succeeded — but retries on the
 *      next activation when the previous attempt failed.
 *   3. A failed bootstrap surfaces the error to the caller while
 *      still marking the worktree as "not bootstrapped".
 *   4. `setSelectedWorktree` is idempotent when the worktree does not
 *      change (no spurious cache flushes).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/providers/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/providers/index.js')>();
  return {
    ...actual,
    clearProviderCache: vi.fn(),
  };
});

import { ActivityEventForwarder } from '../../src/core/agent-manager/orchestration-api.js';
import { clearProviderCache } from '../../src/providers/index.js';

const WORKTREE_A = '/tmp/alexi-wt-a';
const WORKTREE_B = '/tmp/alexi-wt-b';

describe('ActivityEventForwarder — project-scoped provider cache (issue #1834)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('drops the outgoing worktree cache when the selection changes', () => {
    const fwd = new ActivityEventForwarder();
    fwd.setSelectedWorktree(WORKTREE_A);
    fwd.setSelectedWorktree(WORKTREE_B);

    expect(clearProviderCache).toHaveBeenCalledTimes(1);
    // First arg was the OUTGOING (A) worktree, not the incoming one.
    expect(vi.mocked(clearProviderCache).mock.calls[0][0]).toBe(WORKTREE_A);
    expect(fwd.getSelectedWorktree()).toBe(WORKTREE_B);
  });

  it('is idempotent when selecting the same worktree twice', () => {
    const fwd = new ActivityEventForwarder();
    fwd.setSelectedWorktree(WORKTREE_A);
    fwd.setSelectedWorktree(WORKTREE_A);

    expect(clearProviderCache).not.toHaveBeenCalled();
  });

  it('clears cache when selection is cleared to undefined', () => {
    const fwd = new ActivityEventForwarder();
    fwd.setSelectedWorktree(WORKTREE_A);
    fwd.setSelectedWorktree(undefined);

    expect(clearProviderCache).toHaveBeenCalledWith(WORKTREE_A);
    expect(fwd.getSelectedWorktree()).toBeUndefined();
  });

  it('activateWorktree runs bootstrap on first activation', async () => {
    const fwd = new ActivityEventForwarder();
    const bootstrap = vi.fn(async () => {});

    await fwd.activateWorktree(WORKTREE_A, bootstrap);

    expect(bootstrap).toHaveBeenCalledTimes(1);
    // Incoming worktree cache is also cleared so partially-initialised
    // providers cannot survive across a failed prior attempt.
    expect(clearProviderCache).toHaveBeenCalledWith(WORKTREE_A);
    expect(fwd.getWorktreeBootstrap(WORKTREE_A)?.bootstrapped).toBe(true);
  });

  it('activateWorktree skips bootstrap on subsequent activations when previous succeeded', async () => {
    const fwd = new ActivityEventForwarder();
    const bootstrap = vi.fn(async () => {});

    await fwd.activateWorktree(WORKTREE_A, bootstrap);
    // Switch away then back.
    fwd.setSelectedWorktree(WORKTREE_B);
    await fwd.activateWorktree(WORKTREE_A, bootstrap);

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('activateWorktree retries bootstrap when the previous attempt failed', async () => {
    const fwd = new ActivityEventForwarder();
    const bootstrap = vi
      .fn()
      .mockImplementationOnce(async () => {
        throw new Error('provider init failed');
      })
      .mockImplementationOnce(async () => {});

    await expect(fwd.activateWorktree(WORKTREE_A, bootstrap)).rejects.toThrow(
      'provider init failed'
    );
    expect(fwd.getWorktreeBootstrap(WORKTREE_A)?.bootstrapped).toBe(false);
    expect(fwd.getWorktreeBootstrap(WORKTREE_A)?.lastError).toBe('provider init failed');

    // Second activation should retry and succeed.
    await fwd.activateWorktree(WORKTREE_A, bootstrap);

    expect(bootstrap).toHaveBeenCalledTimes(2);
    expect(fwd.getWorktreeBootstrap(WORKTREE_A)?.bootstrapped).toBe(true);
  });

  it('markWorktreeBootstrap(false) forces the next activation to re-run bootstrap', async () => {
    const fwd = new ActivityEventForwarder();
    const bootstrap = vi.fn(async () => {});

    await fwd.activateWorktree(WORKTREE_A, bootstrap);
    fwd.markWorktreeBootstrap(WORKTREE_A, false, 'reset requested');
    await fwd.activateWorktree(WORKTREE_A, bootstrap);

    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it('getWorktreeBootstrap returns undefined for an unknown worktree', () => {
    const fwd = new ActivityEventForwarder();
    expect(fwd.getWorktreeBootstrap(WORKTREE_A)).toBeUndefined();
  });

  it('normalizes worktree paths so trailing separators do not create phantom entries', async () => {
    const fwd = new ActivityEventForwarder();
    const bootstrap = vi.fn(async () => {});

    await fwd.activateWorktree(WORKTREE_A, bootstrap);
    await fwd.activateWorktree(WORKTREE_A + '/', bootstrap);

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });
});
