/**
 * Session Retention Engine
 *
 * Applies age-based and count-based retention policies to the sessions
 * scanned from `~/.alexi/sessions/`. This is the user-facing manual
 * cleanup path (`alexi sessions clean`), complementing the automatic
 * age-only sweep in {@link SessionManager.cleanupExpiredSessions}.
 *
 * The engine is intentionally decoupled from disk I/O for the *decision*
 * phase: {@link selectCandidates} takes a pre-scanned list and returns
 * the set of sessions that should be deleted. The apply phase
 * ({@link applyRetentionPolicy}) then performs the actual `fs.unlink`
 * calls, unless `dryRun: true` is set. This split makes the retention
 * logic straightforward to unit test with in-memory fixtures.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { z } from 'zod';
import { minimatch } from 'minimatch';
import { logger } from '../utils/logger.js';
import { scanSessions, type ScannedSession } from './sessionScanner.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Retention policy schema. Every field is optional; a policy with no
 * fields set is a no-op that returns an empty deletion set.
 *
 * - `maxAgeDays`: sessions whose `updatedAt` is older than
 *   `now - maxAgeDays * 86400000` are candidates for deletion. Must be
 *   `>= 1` when provided.
 * - `maxCountPerProject`: after age filtering, sessions are grouped by
 *   project (see {@link ScannedSession.project}); within each group,
 *   only the `maxCountPerProject` most-recently-updated sessions are
 *   retained. Must be `>= 0` when provided (0 means "delete everything
 *   in the group").
 * - `excludePatterns`: minimatch glob patterns matched against both the
 *   session `id` and the session `title` (when present). A match
 *   short-circuits deletion for that session.
 * - `project`: when set, restricts the sweep to sessions whose project
 *   bucket equals this value. Useful for scoped cleanup runs.
 * - `dryRun`: preview mode. When `true`, `applyRetentionPolicy` returns
 *   the deletion set without invoking `fs.unlink`.
 */
export const RetentionPolicySchema = z
  .object({
    maxAgeDays: z.number().int().min(1).optional(),
    maxCountPerProject: z.number().int().min(0).optional(),
    excludePatterns: z.array(z.string()).optional(),
    project: z.string().min(1).optional(),
    dryRun: z.boolean().optional(),
  })
  .strict();

export type RetentionPolicy = z.infer<typeof RetentionPolicySchema>;

/**
 * Outcome of a retention run.
 *
 * - `deleted`: file paths of sessions that were removed (or would have
 *   been removed in dry-run mode).
 * - `skipped`: file paths of sessions that were held back by an exclude
 *   pattern OR by the project filter. Excluded so callers can surface
 *   "N kept" in the summary.
 * - `errors`: human-readable per-file failure messages. A failed unlink
 *   does not abort the sweep; the remaining candidates are still
 *   processed.
 * - `bytesFreed`: total size (in bytes) of the files listed in
 *   `deleted`. Reported even in dry-run mode so operators can see how
 *   much space a run would reclaim.
 * - `dryRun`: mirrors the policy flag so callers can format the summary
 *   accurately without keeping the input around.
 */
export interface RetentionResult {
  deleted: string[];
  skipped: string[];
  errors: string[];
  bytesFreed: number;
  dryRun: boolean;
}

/**
 * Default sessions directory. Extracted so tests / callers can override
 * it via {@link applyRetentionPolicy}'s optional `sessionsDir` argument
 * without touching `process.env.HOME`.
 */
export function defaultSessionsDir(): string {
  return path.join(os.homedir(), '.alexi', 'sessions');
}

/**
 * Return `true` when `session` matches any pattern in `patterns`. Both
 * the session `id` and its `metadata.title` (when present) are checked;
 * a match on either short-circuits deletion. Patterns follow the
 * standard `minimatch` glob dialect (e.g. `important-*`, `*.lock`,
 * `**\/{foo,bar}`).
 */
function isExcluded(session: ScannedSession, patterns: string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) {
    return false;
  }
  const title = typeof session.metadata.title === 'string' ? session.metadata.title : '';
  for (const pattern of patterns) {
    if (pattern.length === 0) {
      continue;
    }
    if (minimatch(session.id, pattern)) {
      return true;
    }
    if (title.length > 0 && minimatch(title, pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Pure decision-phase helper: given a list of scanned sessions, apply
 * the policy and return the sessions to delete AND the sessions to skip
 * (matched an exclude pattern OR filtered by project).
 *
 * The returned lists are disjoint. Sessions that are neither deleted
 * nor skipped (i.e. retained because they are within the age /
 * count-per-project windows) do NOT appear in the output — the caller
 * can compute "retained = total - deleted - skipped" if needed.
 */
export function selectCandidates(
  sessions: ScannedSession[],
  policy: RetentionPolicy,
  now: number = Date.now()
): { toDelete: ScannedSession[]; toSkip: ScannedSession[] } {
  const parsed = RetentionPolicySchema.parse(policy);
  const toDelete: ScannedSession[] = [];
  const toSkip: ScannedSession[] = [];

  // Project filter narrows the working set before age / count logic.
  const filtered = parsed.project
    ? sessions.filter((s) => {
        if (s.project === parsed.project) {
          return true;
        }
        toSkip.push(s);
        return false;
      })
    : sessions;

  // Age check: identify sessions older than the cutoff.
  const ageExpired = new Set<string>();
  if (typeof parsed.maxAgeDays === 'number') {
    const cutoff = now - parsed.maxAgeDays * DAY_MS;
    for (const session of filtered) {
      if (session.updatedAt < cutoff) {
        ageExpired.add(session.id);
      }
    }
  }

  // Count check: within each project group, keep only the N most-recent
  // sessions (by updatedAt DESC); mark the rest as count-expired.
  const countExpired = new Set<string>();
  if (typeof parsed.maxCountPerProject === 'number') {
    const groups = new Map<string, ScannedSession[]>();
    for (const session of filtered) {
      const bucket = groups.get(session.project);
      if (bucket) {
        bucket.push(session);
      } else {
        groups.set(session.project, [session]);
      }
    }
    for (const bucket of groups.values()) {
      const sorted = [...bucket].sort((a, b) => b.updatedAt - a.updatedAt);
      const overflow = sorted.slice(parsed.maxCountPerProject);
      for (const session of overflow) {
        countExpired.add(session.id);
      }
    }
  }

  // Combine: a session is a deletion candidate if it fails EITHER the
  // age check OR the count check. Exclude patterns win in either case.
  for (const session of filtered) {
    const expired = ageExpired.has(session.id) || countExpired.has(session.id);
    if (!expired) {
      continue;
    }
    if (isExcluded(session, parsed.excludePatterns)) {
      toSkip.push(session);
      continue;
    }
    toDelete.push(session);
  }

  return { toDelete, toSkip };
}

/**
 * Scan the sessions directory, evaluate the policy, and (unless
 * `dryRun`) delete the selected sessions. Never throws for per-file
 * unlink failures — they are captured in `result.errors`. A failure to
 * scan the directory itself does throw so the caller can surface a
 * clear "cannot access sessions directory" message.
 */
export async function applyRetentionPolicy(
  policy: RetentionPolicy,
  options?: { sessionsDir?: string; now?: number }
): Promise<RetentionResult> {
  const parsed = RetentionPolicySchema.parse(policy);
  const sessionsDir = options?.sessionsDir ?? defaultSessionsDir();
  const now = options?.now ?? Date.now();
  const dryRun = parsed.dryRun === true;

  const sessions = await scanSessions(sessionsDir);
  const { toDelete, toSkip } = selectCandidates(sessions, parsed, now);

  const result: RetentionResult = {
    deleted: [],
    skipped: toSkip.map((s) => s.filePath),
    errors: [],
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
      logger.debug(`sessionRetention: deleted ${session.filePath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push(`Failed to delete ${session.filePath}: ${message}`);
      logger.warn(`sessionRetention: failed to delete ${session.filePath} — ${message}`);
    }
  }

  return result;
}

/**
 * Format a byte count into a compact human-readable string. Used by
 * the CLI to render `sessions clean` summaries; exported so tests can
 * assert on the exact shape.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}
