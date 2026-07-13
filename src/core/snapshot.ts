/**
 * Session-wide snapshot + revert on top of the per-file `FileCheckpoint` system.
 *
 * A `Snapshot` records the set of `FileCheckpoint`s created during a single
 * agent step (one iteration of the tool-execution loop). It is persisted to
 * `~/.alexi/sessions/<sessionId>/snapshots/<stepId>.json` so that a single
 * `alexi revert` command can undo every file edit made during that step —
 * without needing a Git backend, because `FileCheckpoint.originalContent`
 * already carries the pre-change bytes.
 *
 * Files only: the message log is not touched. Session-level message rewind
 * is a separate concern.
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { FileCheckpoint } from './checkpoints.js';

/**
 * A session-level snapshot representing every file changed by tools in
 * one agent step.
 */
export interface Snapshot {
  stepId: string;
  timestamp: number;
  sessionId: string;
  files: FileCheckpoint[];
  toolCalls: string[];
}

/**
 * Per-file preview row for a revert operation.
 */
export interface RevertPreviewEntry {
  filePath: string;
  currentExists: boolean;
  willRestoreBytes: number;
}

/**
 * Result of applying a revert.
 */
export interface RevertResult {
  restored: string[];
  skipped: Array<{ filePath: string; reason: string }>;
}

/**
 * Resolve the base sessions directory. Mirrors `SessionManager`'s pattern
 * (`process.env.HOME || '~'`) so no new config knob is introduced.
 */
function getSessionsDir(): string {
  return path.join(process.env.HOME || '~', '.alexi', 'sessions');
}

/**
 * Resolve the snapshots directory for a given session id.
 */
function getSnapshotsDir(sessionId: string): string {
  return path.join(getSessionsDir(), sessionId, 'snapshots');
}

/**
 * Record a snapshot for a single agent step. Writes
 * `~/.alexi/sessions/<sessionId>/snapshots/<stepId>.json`, creating the
 * directory as needed. No-op when `checkpoints` is empty — there is no
 * point writing empty snapshots.
 */
export async function recordSnapshot(
  sessionId: string,
  stepId: string,
  checkpoints: FileCheckpoint[],
  toolCalls: string[]
): Promise<void> {
  if (!checkpoints || checkpoints.length === 0) {
    return;
  }

  const snapshot: Snapshot = {
    stepId,
    timestamp: Date.now(),
    sessionId,
    files: checkpoints,
    toolCalls,
  };

  const dir = getSnapshotsDir(sessionId);
  await fs.mkdir(dir, { recursive: true });
  const target = path.join(dir, `${stepId}.json`);
  await fs.writeFile(target, JSON.stringify(snapshot, null, 2), 'utf-8');
}

/**
 * List all snapshots for a session, sorted by `timestamp` descending
 * (newest first). Returns an empty array if the snapshots directory
 * does not exist.
 */
export async function listSnapshots(sessionId: string): Promise<Snapshot[]> {
  const dir = getSnapshotsDir(sessionId);

  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const snapshots: Snapshot[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }
    try {
      const raw = await fs.readFile(path.join(dir, entry), 'utf-8');
      const parsed = JSON.parse(raw) as Snapshot;
      snapshots.push(parsed);
    } catch {
      // Skip corrupt snapshot files.
    }
  }

  snapshots.sort((a, b) => b.timestamp - a.timestamp);
  return snapshots;
}

/**
 * Load a single snapshot by step id. Returns `null` if the file does not
 * exist or cannot be parsed.
 */
export async function loadSnapshot(sessionId: string, stepId: string): Promise<Snapshot | null> {
  const target = path.join(getSnapshotsDir(sessionId), `${stepId}.json`);
  try {
    const raw = await fs.readFile(target, 'utf-8');
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

/**
 * Produce a per-file preview of what a revert would do. Pure aside from
 * `stat`-ing each file to determine existence and current byte length.
 */
export function previewRevert(
  snapshot: Snapshot
): Array<{ filePath: string; currentExists: boolean; willRestoreBytes: number }> {
  return snapshot.files.map((cp) => ({
    filePath: cp.filePath,
    currentExists: existsSync(cp.filePath),
    willRestoreBytes: Buffer.byteLength(cp.originalContent, 'utf-8'),
  }));
}

/**
 * Apply a revert. For each `FileCheckpoint`:
 * - If the current on-disk content is identical to `newContent`, restore
 *   `originalContent` unconditionally.
 * - If the current content differs from BOTH `originalContent` and
 *   `newContent`, skip with reason `'modified-outside-agent'` (do not
 *   clobber human edits).
 * - If the current content already matches `originalContent`, restore is
 *   a no-op write but still counts as `restored` (idempotent).
 */
export async function revertTo(snapshot: Snapshot): Promise<RevertResult> {
  const restored: string[] = [];
  const skipped: Array<{ filePath: string; reason: string }> = [];

  for (const cp of snapshot.files) {
    let current: string | null;
    try {
      current = await fs.readFile(cp.filePath, 'utf-8');
    } catch {
      // File no longer exists — treat as deleted-outside-agent unless
      // originalContent was empty (i.e. tool created a file that was then
      // deleted, which is a valid restore path).
      current = null;
    }

    if (current === null) {
      // Missing file: only restore if the original was non-empty (creation
      // was reverted). If original was empty and file is gone, nothing to
      // do — leave as-is but count as restored (state matches original).
      try {
        await fs.writeFile(cp.filePath, cp.originalContent, 'utf-8');
        restored.push(cp.filePath);
      } catch (err) {
        skipped.push({
          filePath: cp.filePath,
          reason: `write-failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
      continue;
    }

    if (current === cp.newContent || current === cp.originalContent) {
      try {
        await fs.writeFile(cp.filePath, cp.originalContent, 'utf-8');
        restored.push(cp.filePath);
      } catch (err) {
        skipped.push({
          filePath: cp.filePath,
          reason: `write-failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    } else {
      skipped.push({ filePath: cp.filePath, reason: 'modified-outside-agent' });
    }
  }

  return { restored, skipped };
}
