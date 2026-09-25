/**
 * Session Scanner
 *
 * Reads the persisted session directory (typically `~/.alexi/sessions/`)
 * and produces a normalized list of {@link ScannedSession} records. The
 * scanner is intentionally tolerant: malformed JSON files, files with
 * missing metadata fields, and unreadable files are skipped with a
 * warning instead of aborting the sweep, so a single corrupt session
 * never blocks the retention runner from cleaning up the rest.
 *
 * Session grouping by project uses the session's recorded `workdir`
 * (see {@link SessionMetadata.workdir}) as the source of truth. When the
 * field is absent (legacy sessions created before `workdir` was
 * introduced), the session is grouped under {@link UNKNOWN_PROJECT}. This
 * matches the "opinion-less" filter behaviour used by
 * `SessionManager.listSessions({ workdir })`.
 */

import fs from 'fs';
import path from 'path';
import type { SessionMetadata } from './sessionManager.js';
import { logger } from '../utils/logger.js';

/**
 * Project bucket for sessions with no recorded `workdir`. Kept as an
 * exported constant so tests and callers can filter or exclude the
 * bucket explicitly without hard-coding a string.
 */
export const UNKNOWN_PROJECT = '__unknown__';

/**
 * A single record produced by {@link scanSessions}. `filePath` is the
 * absolute path to the on-disk session file; `size` is the file size in
 * bytes (0 when `fs.stat` failed for the file); `mtime` is the file's
 * modification time in milliseconds since epoch.
 *
 * `createdAt` prefers `metadata.created` and falls back to `mtime` when
 * the created timestamp is missing (legacy sessions), so age-based
 * checks always have a numeric value to compare.
 *
 * `updatedAt` mirrors `createdAt` but for the `metadata.updated` field.
 * Both are used by the retention engine to compute the effective "age"
 * of a session.
 */
export interface ScannedSession {
  id: string;
  filePath: string;
  size: number;
  mtime: number;
  createdAt: number;
  updatedAt: number;
  /**
   * Project bucket. Derived from `metadata.workdir` (basename) when
   * present, or {@link UNKNOWN_PROJECT} otherwise. Empty basenames
   * (e.g. a workdir of `/`) also fall back to {@link UNKNOWN_PROJECT}.
   */
  project: string;
  /**
   * Full session metadata as parsed from disk. Preserved so callers
   * that need extra fields (title, agent, parentSessionId, ...) do not
   * have to re-read the file.
   */
  metadata: SessionMetadata;
}

/**
 * Extract a project name from a session's metadata. Prefers an explicit
 * `metadata.project` string field (reserved for future use), then falls
 * back to `basename(workdir)`. Returns {@link UNKNOWN_PROJECT} when
 * neither yields a non-empty name.
 */
function deriveProject(metadata: SessionMetadata): string {
  const extra = metadata as unknown as { project?: unknown };
  if (typeof extra.project === 'string' && extra.project.trim().length > 0) {
    return extra.project.trim();
  }
  if (typeof metadata.workdir === 'string' && metadata.workdir.trim().length > 0) {
    const base = path.basename(metadata.workdir.trim());
    if (base.length > 0 && base !== '.' && base !== '..') {
      return base;
    }
  }
  return UNKNOWN_PROJECT;
}

/**
 * Scan the given sessions directory and return one {@link ScannedSession}
 * record per parseable `.json` file. Never throws for per-file issues
 * (malformed JSON, missing fields, stat errors); a failure to read the
 * directory itself is surfaced as a rejected promise so callers can
 * distinguish "no sessions" from "cannot access sessions".
 */
export async function scanSessions(sessionsDir: string): Promise<ScannedSession[]> {
  let entries: string[];
  try {
    entries = await fs.promises.readdir(sessionsDir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw err;
  }

  const out: ScannedSession[] = [];

  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }
    const filePath = path.join(sessionsDir, entry);

    let stat: fs.Stats;
    try {
      stat = await fs.promises.stat(filePath);
    } catch (err) {
      logger.debug(
        `sessionScanner: skipping ${filePath} — stat failed (${err instanceof Error ? err.message : String(err)})`
      );
      continue;
    }
    if (!stat.isFile()) {
      continue;
    }

    let raw: string;
    try {
      raw = await fs.promises.readFile(filePath, 'utf-8');
    } catch (err) {
      logger.debug(
        `sessionScanner: skipping ${filePath} — read failed (${err instanceof Error ? err.message : String(err)})`
      );
      continue;
    }

    let parsed: { metadata?: SessionMetadata } | null;
    try {
      parsed = JSON.parse(raw) as { metadata?: SessionMetadata } | null;
    } catch (err) {
      logger.warn(
        `sessionScanner: skipping ${filePath} — malformed JSON (${err instanceof Error ? err.message : String(err)})`
      );
      continue;
    }

    if (!parsed || typeof parsed !== 'object' || !parsed.metadata) {
      logger.warn(`sessionScanner: skipping ${filePath} — no metadata block`);
      continue;
    }

    const metadata = parsed.metadata;
    if (typeof metadata.id !== 'string' || metadata.id.length === 0) {
      logger.warn(`sessionScanner: skipping ${filePath} — metadata.id missing`);
      continue;
    }

    const mtime = stat.mtimeMs;
    const createdAt = typeof metadata.created === 'number' ? metadata.created : mtime;
    const updatedAt = typeof metadata.updated === 'number' ? metadata.updated : mtime;
    const project = deriveProject(metadata);

    out.push({
      id: metadata.id,
      filePath,
      size: stat.size,
      mtime,
      createdAt,
      updatedAt,
      project,
      metadata,
    });
  }

  return out;
}

/**
 * Group scanned sessions by their {@link ScannedSession.project} bucket.
 * The returned map preserves insertion order; within each bucket the
 * ordering matches the scan order (which is filesystem-dependent).
 * Sort callers separately if a stable order is required.
 */
export function groupSessionsByProject(sessions: ScannedSession[]): Map<string, ScannedSession[]> {
  const groups = new Map<string, ScannedSession[]>();
  for (const session of sessions) {
    const bucket = groups.get(session.project);
    if (bucket) {
      bucket.push(session);
    } else {
      groups.set(session.project, [session]);
    }
  }
  return groups;
}
