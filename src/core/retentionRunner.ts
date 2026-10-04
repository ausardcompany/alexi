/**
 * Automated Session Retention Lifecycle Runner (issue #1927)
 *
 * Enforces the two-phase retention lifecycle (archive -> delete) over
 * `~/.alexi/sessions/` without manual intervention. The runner is the
 * destructive counterpart to the user-facing `RetentionRunner` in
 * `src/session/retention.ts`:
 *
 *   - Sessions whose effective last-touched timestamp is older than
 *     `retention.archiveAfterDays` are MOVED to
 *     `<sessionsDir>/.archive/` and gzip-compressed in place. Already
 *     archived sessions are not re-archived.
 *   - Sessions in the archive directory whose compressed-file mtime is
 *     older than `retention.deleteAfterDays` are permanently removed.
 *   - A dry-run mode previews the actions without touching the disk.
 *
 * The runner is intentionally decoupled from config loading at
 * invocation time: callers pass the policy explicitly so the scheduler
 * can snapshot it once per cycle and tests can inject deterministic
 * values. The config reader (`getConfigSessionRetention`) is wired by
 * the scheduler (`src/core/scheduledRetention.ts`).
 *
 * Error-handling policy mirrors the existing retention helpers: per-file
 * failures (archive move, unlink, stat) are captured in
 * `result.errors` so one broken session does not block cleanup of the
 * rest. Only directory-scan failures throw.
 *
 * The runner respects the `ALEXI_DISABLE_RETENTION=1` opt-out env var:
 * when the flag is set, {@link runRetentionCycle} returns an empty
 * report without scanning the sessions directory.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';
import { logger } from '../utils/logger.js';
import { scanSessions, type ScannedSession } from './sessionScanner.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Name of the on-disk archive subdirectory. Lives directly under
 * `<sessionsDir>/.archive/`. Starts with a dot so a casual `ls` on the
 * sessions directory does not surface it as a visible session file.
 */
export const ARCHIVE_DIRNAME = '.archive';

/**
 * Suffix appended to archived session files. The archive layout is a
 * sibling copy with the same session id plus `.json.gz`, so an operator
 * can inspect `~/.alexi/sessions/.archive/<id>.json.gz` directly with
 * `gunzip -c`.
 */
const ARCHIVE_SUFFIX = '.json.gz';

/**
 * Env var name read by {@link runRetentionCycle} and the scheduler to
 * disable the whole automation at runtime without touching the config
 * file. Set to `1` to opt out.
 */
export const DISABLE_ENV = 'ALEXI_DISABLE_RETENTION';

/**
 * Minimal policy shape consumed by the runner. Mirrors the shape
 * returned by `getConfigSessionRetention` but kept structural so tests
 * can pass synthetic values without having to mock the whole config
 * module.
 */
export interface RetentionLifecyclePolicy {
  /**
   * Days after which an active session is eligible for archival. Must
   * be a positive integer. Sessions younger than this threshold are
   * left in place.
   */
  archiveAfterDays: number;
  /**
   * Days after which an ARCHIVED session is eligible for permanent
   * deletion. Measured against the archive file's mtime, NOT the
   * session's metadata timestamp — once a session has been archived we
   * no longer parse its JSON, so the archive file mtime is the only
   * cheap signal we have. Must be strictly greater than
   * {@link archiveAfterDays}; the config reader enforces this.
   */
  deleteAfterDays: number;
}

/**
 * Report returned by {@link runRetentionCycle}. All counts are 0 and
 * arrays empty when the runner was skipped (opt-out or disabled policy).
 *
 * - `archivedCount`: sessions moved from `<sessionsDir>` to
 *   `<sessionsDir>/.archive/<id>.json.gz` during this cycle.
 * - `deletedCount`: archive files permanently removed during this
 *   cycle.
 * - `freedBytes`: total bytes reclaimed by deletions. Does NOT include
 *   bytes saved by compression during archival — that is a separate
 *   observability concern.
 * - `errors`: human-readable per-file failure messages. Non-empty
 *   `errors` does not imply the overall cycle failed; the runner
 *   always surfaces best-effort progress.
 * - `scanned`: number of session files inspected (archive files are
 *   stat'd but not counted here).
 * - `dryRun`: mirrors the `dryRun` flag so callers can label the
 *   log summary accurately.
 * - `skipped`: `true` when the runner short-circuited (opt-out env var
 *   or disabled policy) and performed no I/O at all.
 */
export interface RetentionReport {
  archivedCount: number;
  deletedCount: number;
  freedBytes: number;
  errors: string[];
  scanned: number;
  dryRun: boolean;
  skipped: boolean;
}

/**
 * Options accepted by {@link runRetentionCycle}. Every field is
 * optional so callers can take sensible defaults for one-shot runs.
 *
 * - `sessionsDir`: overrides the default `~/.alexi/sessions/`.
 *   Tests inject a `fs.mkdtemp` directory here.
 * - `now`: fixes the wall clock used for age calculations. Defaults
 *   to `Date.now()`.
 * - `dryRun`: preview mode. When `true`, no files are moved, compressed,
 *   or unlinked; the report still describes which actions WOULD run.
 */
export interface RunRetentionOptions {
  sessionsDir?: string;
  now?: number;
  dryRun?: boolean;
}

/**
 * Return the default sessions directory used when
 * {@link RunRetentionOptions.sessionsDir} is omitted. Exported so the
 * scheduler and tests can compute the same path without duplicating
 * the `os.homedir()` lookup.
 */
export function defaultSessionsDir(): string {
  return path.join(os.homedir(), '.alexi', 'sessions');
}

/**
 * Return `true` when the opt-out env var is set to `1`. Exported so
 * the scheduler can short-circuit even earlier (avoiding a
 * `setInterval` registration when the user has disabled retention
 * entirely for this shell).
 */
export function isDisabledByEnv(): boolean {
  return process.env[DISABLE_ENV] === '1';
}

/**
 * Return the effective "last touched" timestamp for a scanned session.
 * Prefers `metadata.lastAccessedAt`, falls back to `updatedAt`, then
 * to the file's mtime. Mirrors the heuristic used by the user-facing
 * `RetentionRunner` (see `src/session/retention.ts`) so operators see
 * consistent age reporting across both code paths.
 */
function effectiveLastAccessed(session: ScannedSession): number {
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
 * Ensure the archive directory exists under `sessionsDir`. Returns the
 * absolute path to it. Idempotent; swallows `EEXIST`.
 */
async function ensureArchiveDir(sessionsDir: string): Promise<string> {
  const archiveDir = path.join(sessionsDir, ARCHIVE_DIRNAME);
  await fs.promises.mkdir(archiveDir, { recursive: true });
  return archiveDir;
}

/**
 * Compress a session JSON file into `<archiveDir>/<id>.json.gz` and
 * remove the original. The compression is streamed so very large
 * sessions do not materialise their full contents in memory.
 */
async function archiveSession(session: ScannedSession, archiveDir: string): Promise<void> {
  const destPath = path.join(archiveDir, `${session.id}${ARCHIVE_SUFFIX}`);
  const source = fs.createReadStream(session.filePath);
  const sink = fs.createWriteStream(destPath);
  const gzip = zlib.createGzip();
  await pipeline(source, gzip, sink);
  await fs.promises.unlink(session.filePath);
}

/**
 * List `.json.gz` entries under the archive directory, returning
 * `{ filePath, mtimeMs, size }` tuples. Missing directory is treated
 * as "no archive yet".
 */
async function listArchive(
  archiveDir: string
): Promise<Array<{ filePath: string; mtimeMs: number; size: number }>> {
  let entries: string[];
  try {
    entries = await fs.promises.readdir(archiveDir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
  const out: Array<{ filePath: string; mtimeMs: number; size: number }> = [];
  for (const entry of entries) {
    if (!entry.endsWith(ARCHIVE_SUFFIX)) {
      continue;
    }
    const filePath = path.join(archiveDir, entry);
    try {
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        out.push({ filePath, mtimeMs: stat.mtimeMs, size: stat.size });
      }
    } catch (err) {
      logger.debug(
        `retentionRunner: skipping ${filePath} - stat failed (${err instanceof Error ? err.message : String(err)})`
      );
    }
  }
  return out;
}

/**
 * Run a single retention lifecycle cycle: archive aged sessions, then
 * delete archived sessions past the expiry window.
 *
 * Never throws for per-file I/O failures (archive move, unlink); they
 * accumulate in the returned `errors` array. The runner DOES throw
 * when it cannot scan the sessions directory itself and the error is
 * NOT `ENOENT` — that case is treated as "nothing to do" and returns
 * an empty report with `scanned: 0`.
 *
 * The caller is responsible for log formatting; the runner only emits
 * `logger.debug` / `logger.warn` for per-file progress to keep the
 * interactive CLI quiet.
 */
export async function runRetentionCycle(
  policy: RetentionLifecyclePolicy,
  options: RunRetentionOptions = {}
): Promise<RetentionReport> {
  const dryRun = options.dryRun === true;
  const report: RetentionReport = {
    archivedCount: 0,
    deletedCount: 0,
    freedBytes: 0,
    errors: [],
    scanned: 0,
    dryRun,
    skipped: false,
  };

  if (isDisabledByEnv()) {
    report.skipped = true;
    logger.debug(`retentionRunner: skipped (${DISABLE_ENV}=1)`);
    return report;
  }

  if (!Number.isFinite(policy.archiveAfterDays) || policy.archiveAfterDays < 1) {
    report.skipped = true;
    logger.debug('retentionRunner: skipped (invalid archiveAfterDays)');
    return report;
  }
  if (!Number.isFinite(policy.deleteAfterDays) || policy.deleteAfterDays < 1) {
    report.skipped = true;
    logger.debug('retentionRunner: skipped (invalid deleteAfterDays)');
    return report;
  }

  const sessionsDir = options.sessionsDir ?? defaultSessionsDir();
  const now = options.now ?? Date.now();
  const archiveCutoff = now - policy.archiveAfterDays * DAY_MS;
  const deleteCutoff = now - policy.deleteAfterDays * DAY_MS;

  // Archive phase: scan live sessions and move the aged ones.
  let sessions: ScannedSession[];
  try {
    sessions = await scanSessions(sessionsDir);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    report.errors.push(`Failed to scan sessions directory: ${message}`);
    logger.warn(`retentionRunner: scan failed - ${message}`);
    return report;
  }
  report.scanned = sessions.length;

  const toArchive = sessions.filter((s) => effectiveLastAccessed(s) < archiveCutoff);

  let archiveDir: string | null = null;
  if (toArchive.length > 0 && !dryRun) {
    try {
      archiveDir = await ensureArchiveDir(sessionsDir);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      report.errors.push(`Failed to create archive directory: ${message}`);
      logger.warn(`retentionRunner: cannot create archive dir - ${message}`);
      // Fall through to delete phase; we still want to prune old
      // archive entries even if we cannot archive new ones right now.
    }
  }

  for (const session of toArchive) {
    if (dryRun) {
      report.archivedCount += 1;
      logger.debug(`retentionRunner: would archive ${session.filePath}`);
      continue;
    }
    if (archiveDir === null) {
      continue;
    }
    try {
      await archiveSession(session, archiveDir);
      report.archivedCount += 1;
      logger.debug(`retentionRunner: archived ${session.filePath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      report.errors.push(`Failed to archive ${session.filePath}: ${message}`);
      logger.warn(`retentionRunner: archive failed for ${session.filePath} - ${message}`);
    }
  }

  // Delete phase: prune archive entries older than the delete cutoff.
  const archivePath = path.join(sessionsDir, ARCHIVE_DIRNAME);
  let archiveEntries: Array<{ filePath: string; mtimeMs: number; size: number }>;
  try {
    archiveEntries = await listArchive(archivePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    report.errors.push(`Failed to list archive directory: ${message}`);
    logger.warn(`retentionRunner: list archive failed - ${message}`);
    return report;
  }

  for (const entry of archiveEntries) {
    if (entry.mtimeMs >= deleteCutoff) {
      continue;
    }
    if (dryRun) {
      report.deletedCount += 1;
      report.freedBytes += entry.size;
      logger.debug(`retentionRunner: would delete ${entry.filePath}`);
      continue;
    }
    try {
      await fs.promises.unlink(entry.filePath);
      report.deletedCount += 1;
      report.freedBytes += entry.size;
      logger.debug(`retentionRunner: deleted ${entry.filePath}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      report.errors.push(`Failed to delete ${entry.filePath}: ${message}`);
      logger.warn(`retentionRunner: delete failed for ${entry.filePath} - ${message}`);
    }
  }

  if (report.archivedCount > 0 || report.deletedCount > 0 || report.errors.length > 0) {
    logger.info(
      `retentionRunner: cycle complete - archived ${report.archivedCount}, deleted ${report.deletedCount}, freed ${report.freedBytes} bytes, errors ${report.errors.length}${dryRun ? ' (dry-run)' : ''}`
    );
  }

  return report;
}
