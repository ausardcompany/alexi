/**
 * Tests for the shutdown deadline added in #1979. Covers kilocode PR
 * #14830's contract: a hanging `handle.stop()` must not block the SIGINT /
 * SIGTERM handler indefinitely, and the force-exit branch must log a
 * recognizable message so operators can tell a timed shutdown from a
 * normal one.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SHUTDOWN_DEADLINE_MS, shutdownWithDeadline } from '../server.js';

describe('shutdownWithDeadline', () => {
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    errSpy.mockRestore();
  });

  it('resolves cleanly when stop() finishes before the deadline', async () => {
    const handle = { stop: vi.fn(async () => {}) };

    const settled = shutdownWithDeadline(handle, 30_000);
    // Flush the pending microtasks so `Promise.allSettled` can observe
    // the already-resolved `stop()` promise before we race the timer.
    await vi.advanceTimersByTimeAsync(0);

    const result = await settled;
    expect(result).toEqual({ timedOut: false });
    expect(handle.stop).toHaveBeenCalledOnce();
    expect(errSpy).not.toHaveBeenCalled();
  });

  it('triggers force exit when stop() hangs past the deadline', async () => {
    // A `stop()` that never resolves — the shutdown path must still
    // complete via the deadline branch.
    const handle = { stop: vi.fn(() => new Promise<void>(() => {})) };

    const settled = shutdownWithDeadline(handle, 30_000);
    await vi.advanceTimersByTimeAsync(30_000);

    const result = await settled;
    expect(result).toEqual({ timedOut: true });
    expect(handle.stop).toHaveBeenCalledOnce();
    expect(errSpy).toHaveBeenCalledTimes(1);
    const message = String(errSpy.mock.calls[0]?.[0] ?? '');
    expect(message).toContain('Server shutdown exceeded 30000ms deadline, forcing exit');
  });

  it('does not time out early when stop() finishes just before the deadline', async () => {
    const handle = {
      stop: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 29_999);
          })
      ),
    };

    const settled = shutdownWithDeadline(handle, 30_000);
    await vi.advanceTimersByTimeAsync(29_999);

    const result = await settled;
    expect(result).toEqual({ timedOut: false });
    expect(errSpy).not.toHaveBeenCalled();
  });

  it('exposes the kilocode-aligned 30s default deadline', () => {
    expect(DEFAULT_SHUTDOWN_DEADLINE_MS).toBe(30_000);
  });
});
