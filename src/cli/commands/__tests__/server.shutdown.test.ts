/**
 * Tests for the shutdown deadline added in #1979. Covers kilocode PR
 * #14830's contract: a hanging `handle.stop()` must not block the SIGINT /
 * SIGTERM handler indefinitely, and the force-exit branch must log a
 * recognizable message so operators can tell a timed shutdown from a
 * normal one.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_SHUTDOWN_DEADLINE_MS,
  createShutdownHandler,
  shutdownWithDeadline,
} from '../server.js';

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

describe('createShutdownHandler', () => {
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    errSpy.mockRestore();
  });

  it('exits with code 0 on clean shutdown', async () => {
    const handle = { stop: vi.fn(async () => {}) };
    const exit = vi.fn<(code: number) => never>(() => undefined as never);
    const log = vi.fn();

    const shutdown = createShutdownHandler(handle, { timeoutMs: 30_000, exit, log });
    const pending = shutdown('SIGINT');
    await vi.advanceTimersByTimeAsync(0);
    await pending;

    expect(log).toHaveBeenCalledWith('Received SIGINT, shutting down...');
    expect(handle.stop).toHaveBeenCalledOnce();
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(errSpy).not.toHaveBeenCalled();
  });

  it('exits with code 1 when the deadline forces a shutdown', async () => {
    const handle = { stop: vi.fn(() => new Promise<void>(() => {})) };
    const exit = vi.fn<(code: number) => never>(() => undefined as never);
    const log = vi.fn();

    const shutdown = createShutdownHandler(handle, { timeoutMs: 30_000, exit, log });
    const pending = shutdown('SIGTERM');
    await vi.advanceTimersByTimeAsync(30_000);
    await pending;

    expect(log).toHaveBeenCalledWith('Received SIGTERM, shutting down...');
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(errSpy).toHaveBeenCalledTimes(1);
    const message = String(errSpy.mock.calls[0]?.[0] ?? '');
    expect(message).toContain('Server shutdown exceeded 30000ms deadline, forcing exit');
  });

  it('is idempotent: a second signal during shutdown is a no-op', async () => {
    // `stop()` resolves inside the deadline but after an awaitable tick,
    // giving us a window to fire a second signal before the first run
    // settles.
    const handle = {
      stop: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 5_000);
          })
      ),
    };
    const exit = vi.fn<(code: number) => never>(() => undefined as never);
    const log = vi.fn();

    const shutdown = createShutdownHandler(handle, { timeoutMs: 30_000, exit, log });
    const first = shutdown('SIGINT');
    const second = shutdown('SIGINT');
    await vi.advanceTimersByTimeAsync(5_000);
    await Promise.all([first, second]);

    // Only the first run logged + called exit; the guard swallowed the
    // repeat signal entirely.
    expect(log).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(handle.stop).toHaveBeenCalledOnce();
  });

  it('defaults to DEFAULT_SHUTDOWN_DEADLINE_MS when timeoutMs is omitted', async () => {
    const handle = { stop: vi.fn(() => new Promise<void>(() => {})) };
    const exit = vi.fn<(code: number) => never>(() => undefined as never);

    const shutdown = createShutdownHandler(handle, { exit, log: () => {} });
    const pending = shutdown('SIGTERM');
    await vi.advanceTimersByTimeAsync(DEFAULT_SHUTDOWN_DEADLINE_MS);
    await pending;

    expect(exit).toHaveBeenCalledWith(1);
  });
});
