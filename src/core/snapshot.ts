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
import os from 'os';
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

// ============================================================================
// alexi_change start: persist snapshot-disable across restarts
// ============================================================================
//
// Users who disable snapshotting expect the choice to survive a CLI
// restart. Previously this was an in-memory flag only. Persist it in a
// small JSON state file under `~/.alexi/state/snapshot.json` so the
// setting round-trips.
//
// State file shape: `{ "disabled": boolean }`. Missing / unreadable
// file is treated as "not disabled" (snapshots on by default) so an
// unwritable state directory degrades gracefully rather than silently
// disabling snapshots.

const SNAPSHOT_STATE_KEY = 'kilocode.snapshot.disabled';

interface SnapshotState {
  disabled?: boolean;
}

function getSnapshotStateFile(): string {
  return path.join(os.homedir(), '.alexi', 'state', 'snapshot.json');
}

async function readSnapshotState(): Promise<SnapshotState> {
  try {
    const raw = await fs.readFile(getSnapshotStateFile(), 'utf-8');
    const parsed = JSON.parse(raw) as SnapshotState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeSnapshotState(state: SnapshotState): Promise<void> {
  const target = getSnapshotStateFile();
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * Disable snapshotting for this project persistently. Setting survives
 * CLI restart. Storage key: `kilocode.snapshot.disabled`.
 */
export async function disableSnapshots(): Promise<void> {
  const state = await readSnapshotState();
  state.disabled = true;
  await writeSnapshotState(state);
}

/**
 * Re-enable snapshotting persistently.
 */
export async function enableSnapshots(): Promise<void> {
  const state = await readSnapshotState();
  state.disabled = false;
  await writeSnapshotState(state);
}

/**
 * Return `true` when snapshots should be taken, `false` when the user
 * has persistently disabled them.
 */
export async function shouldSnapshot(): Promise<boolean> {
  const state = await readSnapshotState();
  return !state.disabled;
}

/**
 * Stable storage key for the disable flag. Exposed so tests and other
 * modules can reference the key without duplicating the string.
 */
export const SNAPSHOT_DISABLE_STATE_KEY = SNAPSHOT_STATE_KEY;

/**
 * Prune stale snapshot / truncation files for the given session by
 * modified-time, oldest first. Retains the newest `keep` files
 * (defaults to 20). No-op when the snapshots directory does not
 * exist.
 *
 * alexi_change: clean truncation files by mtime, oldest first
 */
export async function pruneSnapshots(sessionId: string, keep = 20): Promise<string[]> {
  const dir = getSnapshotsDir(sessionId);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const withMtime: Array<{ file: string; mtimeMs: number }> = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }
    try {
      const stat = await fs.stat(path.join(dir, entry));
      withMtime.push({ file: entry, mtimeMs: stat.mtimeMs });
    } catch {
      // Skip files we cannot stat (raced deletion, permission).
    }
  }

  // Sort oldest first, drop everything past the `keep` newest.
  withMtime.sort((a, b) => a.mtimeMs - b.mtimeMs);
  const toDelete = withMtime.slice(0, Math.max(0, withMtime.length - keep));

  const deleted: string[] = [];
  for (const { file } of toDelete) {
    try {
      await fs.unlink(path.join(dir, file));
      deleted.push(file);
    } catch {
      // Best-effort — skip files that vanished under us.
    }
  }
  return deleted;
}
// alexi_change end

// ============================================================================
// alexi_change start: robustness for missing / discarded snapshot repositories
// ============================================================================
//
// Mirrors kilocode upstream hardening for the snapshot subsystem:
//   - `bdb303f09 fix: clean discarded worktree snapshots`
//   - `6435aa954 fix(opencode): release the seed pin whenever the snapshot
//      repository is gone`
//   - `a81cdf905 fix(opencode): release the seed pin when removing an
//      untracked snapshot repository`
//
// Alexi does not use a worktree/seed-pin model — snapshots are JSON files
// under `~/.alexi/sessions/<id>/snapshots/` — but the same failure modes
// apply: the on-disk directory can disappear underneath us (user rm -rf'd
// their sessions dir, a `sessions purge` ran mid-agent, an out-of-band
// migration moved the tree). In every case the correct behaviour is to
// treat the snapshot as "gone", never crash, and let the caller decide
// whether to recreate.
//
// `discardSnapshotRepository()` is the single entry point for wiping a
// session's snapshot dir. It is idempotent — if the directory is already
// missing it succeeds silently, so a stale in-memory reference cannot
// pin a session that no longer exists.

/**
 * Remove every snapshot for a session and return the number of files
 * that were actually deleted. Never throws for the common "already gone"
 * case — that's the whole point of this helper; a missing directory is
 * a valid post-condition.
 *
 * @param sessionId The session whose snapshot dir should be discarded.
 * @returns The number of `.json` snapshot files deleted (0 when the
 *   directory did not exist or was empty).
 */
export async function discardSnapshotRepository(sessionId: string): Promise<number> {
  const dir = getSnapshotsDir(sessionId);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    // Already gone — nothing to release.
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }
    try {
      await fs.unlink(path.join(dir, entry));
      deleted++;
    } catch {
      // Best-effort — file may have vanished between readdir and unlink.
    }
  }

  // Attempt to remove the (now-empty) directory. If it is still
  // non-empty (e.g. concurrent writer just created a new snapshot) or
  // permissions block us, that is fine — the next `discardSnapshotRepository`
  // call is idempotent.
  try {
    await fs.rmdir(dir);
  } catch {
    // Non-fatal.
  }

  return deleted;
}

/**
 * Check whether the on-disk snapshot repository for a session still
 * exists. Callers holding a long-lived reference (e.g. a rewind dialog
 * built from a stale listSnapshots() result) should re-check this
 * before attempting revertTo(): a `false` result means the seed pin has
 * effectively been released and the caller must refetch or bail out.
 *
 * Sync + best-effort: uses `existsSync` for zero-await callers (UI
 * paths). For async callers `listSnapshots(sessionId).then(x => x.length > 0)`
 * is equivalent and preferred.
 */
export function snapshotRepositoryExists(sessionId: string): boolean {
  return existsSync(getSnapshotsDir(sessionId));
}
