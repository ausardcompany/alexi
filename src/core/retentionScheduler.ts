/**
 * Session Retention Scheduler
 *
 * Fire-and-forget scheduler that triggers `SessionManager.cleanupExpiredSessions()`
 * at most once per 24 hours per user. State (last-run timestamp) is
 * persisted to `~/.alexi/last-retention-run` so short-lived CLI
 * invocations (e.g. one-shot `alexi chat -m ...`) do not each burn a
 * full sweep on every launch.
 *
 * The scheduler is intentionally non-blocking: it inspects the state
 * file synchronously (cheap), records the new timestamp, and kicks off
 * the cleanup pass without awaiting the result. Callers on the CLI
 * startup path therefore pay only the state-file cost even when a sweep
 * is due.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { logger } from '../utils/logger.js';
import { SessionManager } from './sessionManager.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Resolve the path of the state file used to throttle sweeps.
 * Extracted so tests can override it via `process.env.HOME`.
 */
function stateFilePath(): string {
  return path.join(os.homedir(), '.alexi', 'last-retention-run');
}

/**
 * Return the last-run timestamp (milliseconds since epoch) recorded in
 * the state file, or `0` when the file is missing / unreadable /
 * corrupt. Never throws.
 */
export function readLastRun(now: number = Date.now()): number {
  try {
    const raw = fs.readFileSync(stateFilePath(), 'utf-8').trim();
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > now + DAY_MS) {
      return 0;
    }
    return parsed;
  } catch {
    return 0;
  }
}

/**
 * Persist the last-run timestamp. Creates the parent directory if it
 * does not exist. Failures are logged at DEBUG level and swallowed so
 * a read-only home directory does not block CLI startup.
 */
function writeLastRun(timestamp: number): void {
  const filePath = stateFilePath();
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, String(timestamp), 'utf-8');
  } catch (err) {
    logger.debug(
      `Failed to persist retention scheduler timestamp: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Return `true` when at least 24h have elapsed since the last recorded
 * retention sweep. Also returns `true` when the state file is missing
 * (first run on this host).
 */
export function shouldRun(now: number = Date.now()): boolean {
  const last = readLastRun(now);
  return now - last >= DAY_MS;
}

/**
 * Trigger a retention pass in the background if the 24h cooldown has
 * elapsed. Returns `true` when a sweep was scheduled, `false` when the
 * cooldown is still active.
 *
 * The sweep runs on the CLI's Node event loop (fire-and-forget) rather
 * than in a separate process. The `SessionManager.cleanupExpiredSessions`
 * call is synchronous itself, but we wrap it in `setImmediate` so
 * program startup returns to the caller immediately.
 */
export function triggerRetentionSweep(now: number = Date.now()): boolean {
  if (!shouldRun(now)) {
    logger.debug('Retention scheduler skipped: last run within 24h');
    return false;
  }

  // Record the timestamp BEFORE running so an unhandled error inside
  // the sweep does not cause the next startup to re-run immediately.
  writeLastRun(now);
  logger.debug('Retention scheduler triggered');

  setImmediate(() => {
    try {
      const manager = new SessionManager();
      const summary = manager.cleanupExpiredSessions(now);
      if (summary.deleted > 0 || summary.errors.length > 0) {
        logger.info(
          `Retention sweep: deleted ${summary.deleted}, skipped ${summary.skipped}, errors ${summary.errors.length}`
        );
      }
    } catch (err) {
      logger.debug(`Retention sweep failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  return true;
}
