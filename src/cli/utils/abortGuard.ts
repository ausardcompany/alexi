/**
 * Process-level guard for abort-family unhandled rejections (issue #1319).
 *
 * Cancelled provider streams occasionally reject the underlying `fetch`
 * (undici) promise with a DOMException `AbortError` or a Node native
 * `code === 'ABORT_ERR'` AFTER the async generator that owned them has
 * already returned. When that happens the rejection has no `.catch()` in
 * the call stack: it escapes to Node's global `unhandledRejection` handler
 * which, on Node >= 15, kills the process (and any resident session
 * daemon) with a non-zero exit code.
 *
 * The CLI/TUI already classify abort-family errors that reach a `try/catch`
 * as `"Request cancelled"` (see `handleStreamingError` in `interactive.ts`
 * and `useStreamChat.ts`). This module widens the same policy to the
 * process-wide rejection channel: swallow abort-family rejections (log
 * once at info level), and re-emit everything else so Node's default
 * crash-on-unhandled-rejection behaviour is preserved for real bugs.
 *
 * Public API is `installAbortGuard()` / `uninstallAbortGuard()` so tests
 * can attach and detach the guard deterministically without leaking
 * listeners into unrelated tests.
 */

import { isAbortError } from '../../core/streamingOrchestrator.js';

type UnhandledRejectionHandler = (reason: unknown, promise: Promise<unknown>) => void;
type UncaughtExceptionHandler = (err: Error) => void;

let installedRejectionHandler: UnhandledRejectionHandler | null = null;
let installedExceptionHandler: UncaughtExceptionHandler | null = null;

/**
 * Log an abort-family swallow to stderr. Kept as a single function so the
 * output can be silenced under `ALEXI_QUIET_ABORT=1` (used by tests that
 * assert on stderr shape, and by CI logs that would otherwise be noisy
 * when the user mashes Ctrl+C).
 */
function logSwallowedAbort(reason: unknown): void {
  if (process.env.ALEXI_QUIET_ABORT === '1') {
    return;
  }
  const message = reason instanceof Error ? reason.message : String(reason);
  // Write directly to stderr — `logger` is not a hard dependency here and
  // we want this signal to always land even when stdout is captured.
  process.stderr.write(`Request cancelled (background abort): ${message}\n`);
}

/**
 * Install the abort-family guard. Idempotent: repeat calls are no-ops so
 * the CLI entry point can call it unconditionally.
 */
export function installAbortGuard(): void {
  if (installedRejectionHandler) {
    return;
  }

  installedRejectionHandler = (reason: unknown) => {
    if (isAbortError(reason)) {
      logSwallowedAbort(reason);
      return;
    }
    // Not an abort — replicate Node's default unhandled-rejection
    // behaviour manually. We can't just re-throw here: that would loop
    // through our own `uncaughtException` handler. We print the standard
    // banner to stderr, then exit with code 1 the way Node would if no
    // listener were installed at all. Skipped when other listeners are
    // present so user-installed handlers still get their turn.
    const listeners = process.listeners('unhandledRejection');
    if (listeners.length > 1) {
      // Another handler is registered; let it decide.
      return;
    }
    const message = reason instanceof Error ? reason.stack || reason.message : String(reason);
    process.stderr.write(`Unhandled promise rejection: ${message}\n`);
    process.exit(1);
  };

  installedExceptionHandler = (err: Error) => {
    if (isAbortError(err)) {
      logSwallowedAbort(err);
      return;
    }
    // Not an abort — replicate Node's default crash behaviour without
    // re-throwing (which would re-enter this handler).
    const listeners = process.listeners('uncaughtException');
    if (listeners.length > 1) {
      return;
    }
    const message = err instanceof Error ? err.stack || err.message : String(err);
    process.stderr.write(`Uncaught exception: ${message}\n`);
    process.exit(1);
  };

  process.on('unhandledRejection', installedRejectionHandler);
  process.on('uncaughtException', installedExceptionHandler);
}

/**
 * Remove the abort-family guard. Used exclusively by tests; production
 * code should leave the guard installed for the entire process lifetime.
 */
export function uninstallAbortGuard(): void {
  if (installedRejectionHandler) {
    process.off('unhandledRejection', installedRejectionHandler);
    installedRejectionHandler = null;
  }
  if (installedExceptionHandler) {
    process.off('uncaughtException', installedExceptionHandler);
    installedExceptionHandler = null;
  }
}
