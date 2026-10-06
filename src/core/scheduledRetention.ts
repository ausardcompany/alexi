/**
 * Scheduled Session Retention Runner (issue #1927)
 *
 * Fire-and-forget scheduler that drives {@link runRetentionCycle} on a
 * `setInterval` loop. Intended to be started once at CLI startup by
 * `src/cli/program.ts`:
 *
 * ```ts
 * import { startRetentionScheduler } from './core/scheduledRetention.js';
 * startRetentionScheduler();
 * ```
 *
 * Design:
 *   - The first cycle runs 5 minutes AFTER startup (`DEFAULT_INITIAL_DELAY_MS`)
 *     to avoid competing with provider init and the interactive REPL's
 *     own warm-up work. The delay is tunable via the `initialDelayMs`
 *     option (tests inject `0`).
 *   - Subsequent cycles run every `retention.intervalHours` hours
 *     (default 24h). The interval is read from
 *     `getConfigSessionRetention()` at scheduler-start time so
 *     operators who change the config must restart the CLI to see the
 *     new cadence — this matches the behaviour of other
 *     startup-latched settings (compaction model, routing config).
 *   - The scheduler is a no-op when `retention.enabled` is `false`,
 *     when `ALEXI_DISABLE_RETENTION=1`, or when
 *     {@link startRetentionScheduler} has already run in this process.
 *     Idempotence is important because `program.ts` runs once per
 *     one-shot command, but the interactive REPL spawns subagent
 *     child processes that must NOT register their own timers.
 *   - Timer handles are `unref()`ed so a background retention tick
 *     never blocks process exit.
 */

import { logger } from '../utils/logger.js';
import { getConfigSessionRetention, type SessionRetentionPolicy } from '../config/userConfig.js';
import {
  isDisabledByEnv,
  runRetentionCycle,
  type RetentionLifecyclePolicy,
  type RetentionReport,
} from './retentionRunner.js';

/**
 * Delay (in ms) between CLI startup and the first scheduled cycle.
 * Exported so tests and operators can reason about startup overhead
 * without reading the implementation.
 */
export const DEFAULT_INITIAL_DELAY_MS = 5 * 60 * 1000;

const HOUR_MS = 60 * 60 * 1000;

/**
 * Options accepted by {@link startRetentionScheduler}. All fields are
 * optional; the defaults match production behaviour.
 *
 * - `initialDelayMs`: overrides the 5-minute startup delay. Tests pass
 *   `0` to trigger the first cycle synchronously (via `setTimeout(fn, 0)`).
 * - `intervalMs`: overrides the periodic cadence. When omitted, the
 *   scheduler derives the cadence from `retention.intervalHours`.
 * - `policy`: injects a pre-resolved policy, skipping the
 *   `getConfigSessionRetention` call. Used by tests and by callers who
 *   already have the policy in hand (e.g. a `--retention-interval`
 *   CLI flag).
 * - `sessionsDir`: forwarded to {@link runRetentionCycle}. Tests use
 *   this to point the scheduler at a temp directory.
 * - `onCycle`: optional callback invoked after each cycle completes.
 *   The scheduler passes the resolved {@link RetentionReport} so
 *   integration tests can assert on the number of cycles that ran.
 *   Thrown errors are logged and swallowed.
 */
export interface StartRetentionSchedulerOptions {
  initialDelayMs?: number;
  intervalMs?: number;
  policy?: SessionRetentionPolicy;
  sessionsDir?: string;
  onCycle?: (report: RetentionReport) => void;
}

/**
 * Handle returned by {@link startRetentionScheduler}. Exposes the
 * underlying timers so tests can clear them deterministically and
 * callers can shut the scheduler down from a signal handler.
 *
 * The handle is always returned (never `null`) so TypeScript callers do
 * not have to null-check. When the scheduler short-circuited (opt-out,
 * disabled policy, double-start), `started` is `false` and `stop()` is
 * a no-op.
 */
export interface RetentionSchedulerHandle {
  started: boolean;
  stop: () => void;
}

// Module-level singleton guard. The CLI entrypoint may import this
// file multiple times across the module graph but we only want ONE
// active scheduler per Node process.
let activeHandle: RetentionSchedulerHandle | null = null;

/**
 * Reset the module-level singleton guard. Exported for tests ONLY so
 * each case starts from a clean slate; production code should never
 * call this directly.
 *
 * @internal
 */
export function _resetSchedulerForTests(): void {
  if (activeHandle) {
    activeHandle.stop();
  }
  activeHandle = null;
}

/**
 * Start the scheduled retention runner. Returns immediately; the first
 * cycle runs `initialDelayMs` after this call, and periodic cycles
 * follow every `intervalMs` thereafter.
 *
 * A second call in the same process is a no-op and returns a handle
 * with `started: false`.
 */
export function startRetentionScheduler(
  options: StartRetentionSchedulerOptions = {}
): RetentionSchedulerHandle {
  if (activeHandle !== null) {
    logger.debug('retentionScheduler: already started in this process');
    return { started: false, stop: () => {} };
  }

  if (isDisabledByEnv()) {
    logger.debug('retentionScheduler: skipped (ALEXI_DISABLE_RETENTION=1)');
    return { started: false, stop: () => {} };
  }

  let policy: SessionRetentionPolicy;
  try {
    policy = options.policy ?? getConfigSessionRetention();
  } catch (err) {
    logger.debug(
      `retentionScheduler: config load failed - ${err instanceof Error ? err.message : String(err)}`
    );
    return { started: false, stop: () => {} };
  }

  if (!policy.enabled) {
    logger.debug('retentionScheduler: skipped (retention.enabled is false)');
    return { started: false, stop: () => {} };
  }

  const lifecyclePolicy: RetentionLifecyclePolicy = {
    archiveAfterDays: policy.archiveAfterDays,
    deleteAfterDays: policy.deleteAfterDays,
  };

  const initialDelay =
    typeof options.initialDelayMs === 'number' && options.initialDelayMs >= 0
      ? options.initialDelayMs
      : DEFAULT_INITIAL_DELAY_MS;
  const interval =
    typeof options.intervalMs === 'number' && options.intervalMs > 0
      ? options.intervalMs
      : Math.max(1, Math.floor(policy.intervalHours)) * HOUR_MS;

  let intervalHandle: ReturnType<typeof setInterval> | null = null;

  const runOnce = async (): Promise<void> => {
    try {
      const report = await runRetentionCycle(lifecyclePolicy, {
        sessionsDir: options.sessionsDir,
      });
      if (options.onCycle) {
        try {
          options.onCycle(report);
        } catch (err) {
          logger.debug(
            `retentionScheduler: onCycle callback threw - ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }
    } catch (err) {
      logger.debug(
        `retentionScheduler: cycle failed - ${err instanceof Error ? err.message : String(err)}`
      );
    }
  };

  const initialHandle = setTimeout(() => {
    void runOnce();
    intervalHandle = setInterval(() => {
      void runOnce();
    }, interval);
    // Allow the Node process to exit even if the interval timer is
    // still pending. The retention runner is housekeeping — it must
    // never block CLI exit.
    if (typeof intervalHandle.unref === 'function') {
      intervalHandle.unref();
    }
  }, initialDelay);
  if (typeof initialHandle.unref === 'function') {
    initialHandle.unref();
  }

  logger.debug(
    `retentionScheduler: started (initialDelayMs=${initialDelay}, intervalMs=${interval})`
  );

  const handle: RetentionSchedulerHandle = {
    started: true,
    stop: () => {
      clearTimeout(initialHandle);
      if (intervalHandle !== null) {
        clearInterval(intervalHandle);
        intervalHandle = null;
      }
      activeHandle = null;
    },
  };
  activeHandle = handle;
  return handle;
}
