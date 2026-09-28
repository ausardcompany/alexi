/**
 * Session Retention Lifecycle Runner
 *
 * User-facing entry point for the session retention lifecycle. Wraps
 * the low-level {@link scanSessions}/{@link applyRetentionPolicy}
 * helpers into a small class that CLI commands and schedulers can
 * consume without repeating the scan/decide/apply plumbing.
 *
 * The runner is deliberately thin: it composes
 * {@link scanSessions} for the read phase and the pure
 * {@link selectCandidatesFromPolicy} helper for the decision phase, then
 * dispatches to `fs.unlink` for the delete phase. Splitting the phases
 * keeps unit tests hermetic — the decision logic can be exercised with
 * synthetic {@link ScannedSession} fixtures without any disk I/O.
 *
 * Policy is expressed with the fields described in issue #1876:
 *   - `maxAgeDays`: sessions whose `lastAccessedAt` (falling back to
 *     `updated`, then to file mtime) is older than
 *     `now - maxAgeDays * 86400000` are deletion candidates.
 *   - `maxCount`: after age filtering, only the `maxCount` most
 *     recently touched sessions are kept globally; the rest are
 *     deletion candidates.
 *   - `preserveActive`: when `true` (the default), sessions with
 *     an active in-memory run (i.e. a currently-open subagent or
 *     interactive session tracked by a {@link SessionManager} instance
 *     passed in via {@link RetentionRunnerOptions.sessionManager}) are
 *     never deleted, regardless of age.
 *   - `dryRun`: preview mode. When `true`, {@link RetentionRunner.sweep}
 *     returns the deletion set without invoking `fs.unlink`.
 *
 * Callers that want the lower-level policy DSL (per-project caps,
 * exclude patterns, etc.) should keep using
 * {@link applyRetentionPolicy} from `src/core/sessionRetention.js`.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { scanSessions, type ScannedSession } from '../core/sessionScanner.js';
import type { SessionManager } from '../core/sessionManager.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Retention policy schema. Every field is optional; a policy with no
 * fields set is a no-op that returns an empty deletion set.
 */
export const RetentionPolicySchema = z
  .object({
    maxAgeDays: z.number().int().min(1).optional(),
    maxCount: z.number().int().min(0).optional(),
    preserveActive: z.boolean().optional(),
    dryRun: z.boolean().optional(),
  })
  .strict();

export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;

/**
 * Outcome of a single {@link RetentionRunner.sweep} invocation.
 *
 * - `deleted`: file paths of sessions that were removed (or that would
 *   be removed in dry-run mode).
 * - `preserved`: file paths of sessions that were held back by the
 *   `preserveActive` guard.
 * - `errors`: human-readable per-file failure messages. A failed unlink
 *   does not abort the sweep; the remaining candidates are still
 *   processed so a single corrupted file cannot block cleanup.
 * - `scanned`: total number of parseable session files inspected.
 * - `bytesFreed`: total size (in bytes) of the files listed in
 *   `deleted`. Reported even in dry-run mode so operators can see how
 *   much space a run would reclaim before enabling it.
 * - `dryRun`: mirrors the policy flag so callers can format the summary
 *   accurately without keeping the input policy around.
 */
export interface RetentionResult {
  deleted: string[];
  preserved: string[];
  errors: string[];
  scanned: number;
  bytesFreed: number;
  dryRun: boolean;
}

/**
 * Options accepted by {@link RetentionRunner}'s constructor.
 *
 * - `sessionsDir`: overrides the default `~/.alexi/sessions/` location.
 *   Tests use this to point the runner at a `fs.mkdtemp` directory.
 * - `sessionManager`: when supplied, `preserveActive` consults its
 *   in-memory active-run tracker via `hasActiveRun(sessionId)`. Absent
 *   in headless scenarios (e.g. an offline `alexi sessions clean` from
 *   a fresh process) where there is by definition no active run.
 * - `now`: overrides the wall clock used for age calculations. Tests
 *   pass a fixed timestamp to make expectations deterministic.
 */
export interface RetentionRunnerOptions {
  sessionsDir?: string;
  sessionManager?: Pick<SessionManager, 'hasActiveRun'>;
  now?: () => number;
}

/**
 * Return the default sessions directory used when
 * {@link RetentionRunnerOptions.sessionsDir} is not provided. Extracted
 * so tests / callers can compute the same path without depending on the
 * runner class.
 */
export function defaultSessionsDir(): string {
  return path.join(os.homedir(), '.alexi', 'sessions');
}

/**
 * Return the effective "last touched" timestamp for a scanned session.
 * Prefers `metadata.lastAccessedAt`, then falls back to the session's
 * `updatedAt`, then to the file's mtime. Always returns a finite
 * numeric millisecond timestamp so callers can compare values directly.
 */
export function effectiveLastAccessed(session: ScannedSession): number {
  const meta = session.metadata as { lastAccessedAt?: unknown };
  if (typeof meta.lastAccessedAt === 'number' && Number.isFinite(meta.lastAccessedAt)) {
    return meta.lastAccessedAt;
  }
  if (Number.isFinite(session.updatedAt)) {
    return session.updatedAt;
  }
  return session.mtime;
}

/**
 * Pure decision-phase helper: given a list of scanned sessions and a
 * policy, return the sessions to delete and the sessions to preserve.
 * `preserveActive` decisions are delegated to the caller-supplied
 * `isActive` predicate — the runner wires this to
 * `SessionManager.hasActiveRun`, tests pass their own stub.
 *
 * The returned lists are disjoint. Sessions that are neither deleted
 * nor preserved (i.e. retained because they fit the age / count
 * window) do NOT appear in the output; callers can derive
 * `retained = total - deleted - preserved` when needed.
 */
export function selectCandidatesFromPolicy(
  sessions: ScannedSession[],
  policy: RetentionPolicy,
  now: number,
  isActive: (sessionId: string) => boolean
): { toDelete: ScannedSession[]; toPreserve: ScannedSession[] } {
  const parsed = RetentionPolicySchema.parse(policy);
  const preserveActive = parsed.preserveActive !== false;
  const toDelete: ScannedSession[] = [];
  const toPreserve: ScannedSession[] = [];

  // Precompute effective ages once — used by both the age and the
  // count-based checks.
  const withTimestamp = sessions.map((session) => ({
    session,
    lastAccessedAt: effectiveLastAccessed(session),
  }));

  // Age check.
  const ageExpired = new Set<string>();
  if (typeof parsed.maxAgeDays === 'number') {
    const cutoff = now - parsed.maxAgeDays * DAY_MS;
    for (const entry of withTimestamp) {
      if (entry.lastAccessedAt < cutoff) {
        ageExpired.add(entry.session.id);
      }
    }
  }

  // Count check: keep only the N most-recently-touched sessions
  // globally. Applied AFTER age filtering so a small `maxCount`
  // combined with a large `maxAgeDays` still trims oldest first.
  const countExpired = new Set<string>();
  if (typeof parsed.maxCount === 'number') {
    const sorted = [...withTimestamp].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
    const overflow = sorted.slice(parsed.maxCount);
    for (const entry of overflow) {
      countExpired.add(entry.session.id);
    }
  }

  for (const { session } of withTimestamp) {
    const expired = ageExpired.has(session.id) || countExpired.has(session.id);
    if (!expired) {
      continue;
    }
    if (preserveActive && isActive(session.id)) {
      toPreserve.push(session);
      continue;
    }
    toDelete.push(session);
  }

  return { toDelete, toPreserve };
}

/**
 * Session retention lifecycle runner.
 *
 * Typical usage:
 * ```ts
 * const runner = new RetentionRunner({ sessionsDir, sessionManager });
 * const result = await runner.sweep({
 *   maxAgeDays: 30,
 *   maxCount: 100,
 *   preserveActive: true,
 * });
 * console.log(`Deleted ${result.deleted.length} sessions`);
 * ```
 *
 * A single runner instance is safe to reuse across sweeps; each call
 * to {@link sweep} performs a fresh scan of the sessions directory.
 */
export class RetentionRunner {
  private readonly sessionsDir: string;
  private readonly sessionManager?: Pick<SessionManager, 'hasActiveRun'>;
  private readonly nowFn: () => number;

  constructor(options: RetentionRunnerOptions = {}) {
    this.sessionsDir = options.sessionsDir ?? defaultSessionsDir();
    this.sessionManager = options.sessionManager;
    this.nowFn = options.now ?? (() => Date.now());
  }

  /**
   * The sessions directory this runner will sweep. Exposed for
   * diagnostics and to let callers pass the same value to related
   * helpers (e.g. `scanSessions`) without recomputing the default.
   */
  getSessionsDir(): string {
    return this.sessionsDir;
  }

  /**
   * Run a single retention pass. Scans the sessions directory, applies
   * the policy, and (unless `dryRun`) deletes the selected sessions.
   *
   * Never throws for per-file unlink failures — they are captured in
   * `result.errors`. A failure to scan the directory itself IS thrown
   * so the caller can surface a clear "cannot access sessions
   * directory" message.
   */
  async sweep(policy: RetentionPolicy = {}): Promise<RetentionResult> {
    const parsed = RetentionPolicySchema.parse(policy);
    const now = this.nowFn();
    const dryRun = parsed.dryRun === true;

    const sessions = await scanSessions(this.sessionsDir);

    const isActive = (sessionId: string): boolean =>
      this.sessionManager ? this.sessionManager.hasActiveRun(sessionId) : false;

    const { toDelete, toPreserve } = selectCandidatesFromPolicy(sessions, parsed, now, isActive);

    const result: RetentionResult = {
      deleted: [],
      preserved: toPreserve.map((s) => s.filePath),
      errors: [],
      scanned: sessions.length,
      bytesFreed: 0,
      dryRun,
    };

    for (const session of toDelete) {
      if (dryRun) {
        result.deleted.push(session.filePath);
        result.bytesFreed += session.size;
        continue;
      }
      try {
        await fs.promises.unlink(session.filePath);
        result.deleted.push(session.filePath);
        result.bytesFreed += session.size;
        logger.debug(`RetentionRunner: deleted ${session.filePath}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.errors.push(`Failed to delete ${session.filePath}: ${message}`);
        logger.warn(`RetentionRunner: failed to delete ${session.filePath} - ${message}`);
      }
    }

    return result;
  }
}
