/**
 * Regression tests for issue #1319: abort-family errors must not kill the
 * CLI/TUI process.
 *
 * Cancelled provider streams sometimes reject their underlying fetch
 * promise (undici / AbortSignal.throwIfAborted) after the async generator
 * that owned them has already returned. Those rejections escape to Node's
 * `unhandledRejection` channel and — on Node >= 15 — terminate the
 * process, taking any resident session daemon down with it.
 *
 * The abort guard installed by `src/cli/utils/abortGuard.ts` swallows
 * abort-family rejections (DOMException `AbortError`, Node
 * `code === 'ABORT_ERR'`) while preserving Node's default behaviour for
 * everything else. These tests exercise both branches without booting a
 * full CLI.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installAbortGuard, uninstallAbortGuard } from '../../src/cli/utils/abortGuard.js';

describe('abort guard (installAbortGuard)', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;
  let stderrChunks: string[];
  let originalQuietFlag: string | undefined;

  beforeEach(() => {
    stderrChunks = [];
    stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((
      chunk: string | Uint8Array
    ) => {
      stderrChunks.push(typeof chunk === 'string' ? chunk : chunk.toString());
      return true;
    }) as typeof process.stderr.write);
    originalQuietFlag = process.env.ALEXI_QUIET_ABORT;
    // Quiet the guard's own stderr write in most tests so vitest output
    // stays clean; individual tests opt back in when they need to assert
    // on the message content.
    process.env.ALEXI_QUIET_ABORT = '1';
    installAbortGuard();
  });

  afterEach(() => {
    uninstallAbortGuard();
    stderrSpy.mockRestore();
    if (originalQuietFlag === undefined) {
      delete process.env.ALEXI_QUIET_ABORT;
    } else {
      process.env.ALEXI_QUIET_ABORT = originalQuietFlag;
    }
  });

  it('is idempotent — installing twice attaches only one listener pair', () => {
    const before = {
      rejection: process.listenerCount('unhandledRejection'),
      exception: process.listenerCount('uncaughtException'),
    };
    installAbortGuard();
    installAbortGuard();
    const after = {
      rejection: process.listenerCount('unhandledRejection'),
      exception: process.listenerCount('uncaughtException'),
    };
    // Same count after repeated installs; guard already noticed itself.
    expect(after.rejection).toBe(before.rejection);
    expect(after.exception).toBe(before.exception);
  });

  it('swallows a DOMException AbortError rejection without crashing', async () => {
    const err =
      typeof DOMException !== 'undefined'
        ? new DOMException('signal aborted', 'AbortError')
        : Object.assign(new Error('signal aborted'), { name: 'AbortError' });

    // Simulate a rejection that escapes to Node's global handler.
    const listeners = process.listeners('unhandledRejection');
    expect(listeners.length).toBeGreaterThan(0);
    const guard = listeners[listeners.length - 1] as (
      reason: unknown,
      promise: Promise<unknown>
    ) => void;

    // Must NOT throw synchronously — abort-family swallow path.
    expect(() =>
      guard(
        err,
        Promise.reject(err).catch(() => undefined)
      )
    ).not.toThrow();
  });

  it('swallows a Node native abort (code === "ABORT_ERR") rejection', async () => {
    const err = Object.assign(new Error('The operation was aborted'), {
      code: 'ABORT_ERR',
    });
    expect(err.name).not.toBe('AbortError');

    const listeners = process.listeners('unhandledRejection');
    const guard = listeners[listeners.length - 1] as (
      reason: unknown,
      promise: Promise<unknown>
    ) => void;

    expect(() =>
      guard(
        err,
        Promise.reject(err).catch(() => undefined)
      )
    ).not.toThrow();
  });

  it('handles multiple aborts in sequence without leaking listeners or crashing', () => {
    const listeners = process.listeners('unhandledRejection');
    const guard = listeners[listeners.length - 1] as (
      reason: unknown,
      promise: Promise<unknown>
    ) => void;

    for (let i = 0; i < 10; i++) {
      const err = Object.assign(new Error(`abort #${i}`), { code: 'ABORT_ERR' });
      expect(() =>
        guard(
          err,
          Promise.reject(err).catch(() => undefined)
        )
      ).not.toThrow();
    }

    // Listener count must be stable after handling many aborts.
    expect(process.listenerCount('unhandledRejection')).toBe(listeners.length);
  });

  it('propagates non-abort rejections to Node crash path (exit 1)', () => {
    // Uninstall the beforeEach guard so we can reinstall it as the ONLY
    // listener — otherwise vitest's own unhandledRejection listener runs
    // first and this test asserts the wrong branch.
    uninstallAbortGuard();
    const preexisting = process.listeners('unhandledRejection').slice();
    for (const l of preexisting) {
      process.off('unhandledRejection', l);
    }
    installAbortGuard();

    const listeners = process.listeners('unhandledRejection');
    const guard = listeners[listeners.length - 1] as (
      reason: unknown,
      promise: Promise<unknown>
    ) => void;

    const realErr = new Error('provider blew up');

    // The guard `process.exit(1)`s for non-abort rejections when it is
    // the sole listener. We stub exit and stderr write to observe both.
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((_code?: number) => {
      throw new Error('exit-called');
    }) as (code?: number) => never);

    try {
      expect(() =>
        guard(
          realErr,
          Promise.reject(realErr).catch(() => undefined)
        )
      ).toThrow('exit-called');
      expect(exitSpy).toHaveBeenCalledWith(1);
      const combined = stderrChunks.join('');
      expect(combined).toContain('Unhandled promise rejection');
      expect(combined).toContain('provider blew up');
    } finally {
      exitSpy.mockRestore();
      // Reattach the vitest listeners we stole so the run continues clean.
      for (const l of preexisting) {
        process.on('unhandledRejection', l);
      }
    }
  });

  it('defers non-abort rejections when other listeners are registered', () => {
    // The guard yields to user-installed handlers when it is not the sole
    // listener — this is what keeps vitest/node's own error reporting
    // intact in real deployments.
    const otherHandler = vi.fn();
    process.on('unhandledRejection', otherHandler);
    try {
      const listeners = process.listeners('unhandledRejection');
      // The guard is the one we installed via installAbortGuard(); it is
      // one of the listeners. We locate it by finding a listener whose
      // module was ours (functions are anonymous — instead, we just
      // exercise every listener and confirm none of them exits).
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((_code?: number) => {
        throw new Error('should-not-exit');
      }) as (code?: number) => never);

      const err = new Error('other-handler-owns-this');
      try {
        for (const l of listeners) {
          l(
            err,
            Promise.reject(err).catch(() => undefined)
          );
        }
      } finally {
        exitSpy.mockRestore();
      }

      expect(exitSpy).not.toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', otherHandler);
    }
  });

  it('logs a "Request cancelled" line when ALEXI_QUIET_ABORT is unset', () => {
    delete process.env.ALEXI_QUIET_ABORT;

    const err = Object.assign(new Error('The operation was aborted'), {
      code: 'ABORT_ERR',
    });
    const listeners = process.listeners('unhandledRejection');
    const guard = listeners[listeners.length - 1] as (
      reason: unknown,
      promise: Promise<unknown>
    ) => void;

    guard(
      err,
      Promise.reject(err).catch(() => undefined)
    );

    const combined = stderrChunks.join('');
    expect(combined).toContain('Request cancelled');
    // Message body from the abort error must be surfaced for debugging.
    expect(combined).toContain('The operation was aborted');
  });

  it('swallows abort-family uncaughtException without crashing', () => {
    const listeners = process.listeners('uncaughtException');
    expect(listeners.length).toBeGreaterThan(0);
    const guard = listeners[listeners.length - 1] as (err: Error) => void;

    const err = Object.assign(new Error('signal aborted'), { name: 'AbortError' });
    expect(() => guard(err)).not.toThrow();
  });

  it('uninstalls cleanly so tests do not leak listeners', () => {
    const beforeInstall = {
      rejection: process.listenerCount('unhandledRejection'),
      exception: process.listenerCount('uncaughtException'),
    };
    uninstallAbortGuard();
    const afterUninstall = {
      rejection: process.listenerCount('unhandledRejection'),
      exception: process.listenerCount('uncaughtException'),
    };
    expect(afterUninstall.rejection).toBe(beforeInstall.rejection - 1);
    expect(afterUninstall.exception).toBe(beforeInstall.exception - 1);

    // Re-install for the afterEach uninstall to remain balanced.
    installAbortGuard();
  });
});
