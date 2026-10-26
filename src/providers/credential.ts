/**
 * Cross-process credential-refresh coordination.
 *
 * Ports opencode `9435378` — concurrent Alexi processes (interactive TUI,
 * background `agent` run, CI invocation) refreshing the same credential
 * at the same time cause OAuth token thrashing: whichever refresh lands
 * last invalidates the tokens held by the other callers, and both have
 * to retry. For SAP AI Core XSUAA this is a frequent source of 401s in
 * parallel pipelines.
 *
 * This module exposes {@link refreshCredentialWithLock}, a small helper
 * that serialises refreshes behind a filesystem lock keyed on the
 * credential path. The implementation is deliberately lightweight (no
 * external `proper-lockfile` dependency) so it stays usable in the
 * zero-dependency bootstrap path:
 *
 *   - The lock is a `<credentialPath>.lock` file created with
 *     `wx` (exclusive) flag. Contending callers get `EEXIST` and poll
 *     with capped exponential backoff.
 *   - A stored timestamp inside the lock file lets later arrivals
 *     reclaim a stale lock whose owner crashed. Default stale window
 *     is 10 seconds — longer than any realistic token-endpoint RTT.
 *   - After acquiring the lock, the caller re-reads the cached
 *     credential in case a peer process just refreshed it; this is the
 *     double-check that makes concurrent refreshes safe.
 *
 * The helper is pure wrt. the actual OAuth flow — it takes a `refresh`
 * callback and a `readCached` callback so `sapOrchestration.ts` (XSUAA
 * client-credentials) and `auth.ts` (OAuth2 authorization-code refresh)
 * can both use it without the lock module knowing about either grant
 * type.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Options accepted by {@link refreshCredentialWithLock}.
 */
export interface RefreshWithLockOptions<T> {
  /** Absolute path identifying the credential being refreshed. */
  credentialPath: string;
  /** Perform the actual refresh (OAuth token endpoint, XSUAA, ...). */
  refresh: () => Promise<T>;
  /**
   * Return a cached credential if one is already on disk and still
   * valid. Called twice: once before taking the lock (fast path) and
   * once after taking the lock (double-check). Returning `undefined`
   * signals "no valid cached credential, call refresh".
   */
  readCached?: () => Promise<T | undefined>;
  /**
   * Milliseconds after which an orphaned lock (owner crashed) is
   * considered stale and may be reclaimed. Default: 10_000.
   */
  staleMs?: number;
  /**
   * Max attempts to acquire the lock before giving up. Default: 50.
   */
  maxAttempts?: number;
  /**
   * Base poll delay in ms. Grows exponentially with jitter up to
   * `maxDelayMs`. Default: 50.
   */
  minDelayMs?: number;
  /** Upper bound on the poll delay. Default: 500. */
  maxDelayMs?: number;
}

/** Sleep helper — isolated so tests can override via module mocking. */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Try to acquire the lock file exclusively. Returns true on success.
 * Returns false when the lock already exists AND is still fresh.
 * Reclaims (removes + recreates) a stale lock whose age exceeds
 * `staleMs`.
 */
async function tryAcquireLock(lockPath: string, staleMs: number): Promise<boolean> {
  const now = Date.now();
  try {
    const handle = await fs.open(lockPath, 'wx');
    try {
      await handle.writeFile(String(now), 'utf8');
    } finally {
      await handle.close();
    }
    return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== 'EEXIST') {
      throw err;
    }
    // Lock file exists — check if it's stale.
    try {
      const raw = await fs.readFile(lockPath, 'utf8');
      const ts = Number.parseInt(raw.trim(), 10);
      if (!Number.isFinite(ts) || now - ts > staleMs) {
        // Stale — reclaim atomically. If another contender wins the
        // race we'll see EEXIST again on the next loop iteration.
        await fs.rm(lockPath, { force: true });
      }
    } catch {
      // Couldn't read the lock contents (concurrent remove, etc.) —
      // let the caller retry.
    }
    return false;
  }
}

/**
 * Serialise a credential refresh across concurrent processes behind a
 * filesystem lock, with a double-check on the cached credential after
 * acquiring the lock.
 *
 * Guarantees:
 *   1. At most one process executes `refresh` at a time per
 *      `credentialPath`.
 *   2. Peers waiting on the lock re-read the cached credential after
 *      acquiring the lock and skip calling `refresh` if a prior holder
 *      already produced a fresh one.
 *   3. The lock is always released — including on `refresh` throw.
 *
 * The helper does NOT itself retry a transient OAuth error from
 * `refresh`; that is the caller's concern (`ErrorBackoff`).
 */
export async function refreshCredentialWithLock<T>(
  options: RefreshWithLockOptions<T>
): Promise<T> {
  const {
    credentialPath,
    refresh,
    readCached,
    staleMs = 10_000,
    maxAttempts = 50,
    minDelayMs = 50,
    maxDelayMs = 500,
  } = options;

  const lockPath = `${credentialPath}.lock`;
  // Ensure the parent directory exists so the lock file can be created.
  await fs.mkdir(path.dirname(lockPath), { recursive: true });

  // Fast path: a peer may have already refreshed; skip the lock entirely
  // if the cached credential is still valid.
  if (readCached) {
    const cached = await readCached();
    if (cached !== undefined) {
      return cached;
    }
  }

  let attempt = 0;
  while (attempt < maxAttempts) {
    if (await tryAcquireLock(lockPath, staleMs)) {
      try {
        // Double-check after acquiring: a peer may have refreshed while
        // we were waiting.
        if (readCached) {
          const cached = await readCached();
          if (cached !== undefined) {
            return cached;
          }
        }
        return await refresh();
      } finally {
        await fs.rm(lockPath, { force: true }).catch(() => {
          // Non-fatal: if the lock is already gone (stale reclaim, test
          // teardown), there is nothing to release.
        });
      }
    }

    attempt += 1;
    // Exponential backoff with ±25% jitter, capped at maxDelayMs.
    const base = Math.min(minDelayMs * 2 ** Math.min(attempt, 10), maxDelayMs);
    const jitter = base * (0.75 + Math.random() * 0.5);
    await sleep(jitter);
  }

  throw new Error(
    `Timed out waiting for credential refresh lock after ${maxAttempts} attempts: ${credentialPath}`
  );
}
