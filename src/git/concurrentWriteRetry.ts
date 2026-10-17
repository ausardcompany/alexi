/**
 * Concurrent-write retry wrapper for Git loose-object writes on Windows.
 *
 * Ports opencode PR #56190 — on Windows, two concurrent `git` commands
 * writing to the same loose-object store can collide at the filesystem
 * level (`Could not open ... object file`, `access is denied`). The
 * typical repro is Alexi running an auto-commit on a background
 * timer at the same moment the agent loop is calling `git update-index`
 * from a tool: both processes attempt to write the same hashed path
 * under `.git/objects/`, Windows denies the second open, and the
 * caller sees an opaque non-zero exit from `git`.
 *
 * On POSIX this is not a problem (atomic rename, shared read locks),
 * so the retry is explicitly skipped on non-Windows to avoid masking
 * genuine Git errors with slower feedback.
 *
 * This helper is intentionally scoped to BAS/Dev Spaces + Windows
 * engineers running Alexi locally; it is NOT a general-purpose retry.
 * The retry budget is three attempts with a 50ms linear sleep — enough
 * to clear a concurrent writer, short enough that a sustained lock
 * failure still surfaces to the operator.
 */

import { setTimeout as sleep } from 'node:timers/promises';

/**
 * Number of attempts (including the first) before giving up on a
 * concurrent-write collision.
 */
export const CONCURRENT_WRITE_MAX_ATTEMPTS = 3;

/**
 * Sleep (ms) between retry attempts. Short on purpose — Windows file-
 * lock contention clears in a few milliseconds; longer waits just delay
 * a real failure's surfacing.
 */
export const CONCURRENT_WRITE_RETRY_SLEEP_MS = 50;

/**
 * Return `true` when `err` looks like a Git exit error (non-zero exit
 * code) rather than a spawn / ENOENT failure. We only retry Git exits:
 * a spawn failure means `git` is not on PATH, which is a permanent
 * configuration error per AGENTS.md and must NOT be retried.
 */
function isGitExitError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  // execa / child_process both surface a numeric `exitCode` for a
  // non-zero exit. A spawn failure typically has `code === 'ENOENT'`
  // and no `exitCode`.
  return typeof (err as { exitCode?: unknown }).exitCode === 'number';
}

/**
 * Wrap a Git operation with a bounded retry on concurrent-write
 * collisions. No-op pass-through on non-Windows platforms.
 *
 * Usage:
 * ```ts
 * await retryConcurrentObjectWrite(() =>
 *   runGit(['update-index', '--add', '--remove', '--replace', '-z', '--stdin'],
 *          { stdin, cwd })
 * );
 * ```
 */
export async function retryConcurrentObjectWrite<T>(fn: () => Promise<T>): Promise<T> {
  if (process.platform !== 'win32') {
    return fn();
  }
  let lastErr: unknown;
  for (let attempt = 1; attempt <= CONCURRENT_WRITE_MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isGitExitError(err) || attempt === CONCURRENT_WRITE_MAX_ATTEMPTS) {
        throw err;
      }
      await sleep(CONCURRENT_WRITE_RETRY_SLEEP_MS);
    }
  }
  throw lastErr ?? new Error('retryConcurrentObjectWrite: unreachable');
}
