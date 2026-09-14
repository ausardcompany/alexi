/**
 * Tests for the snapshot-repository lifecycle helpers introduced to mirror
 * kilocode's `bdb303f09 fix: clean discarded worktree snapshots` +
 * `6435aa954 release the seed pin whenever the snapshot repository is gone`
 * hardening. Alexi keeps snapshots on disk (not as a git worktree pin), so
 * "release the seed pin" translates to "remove the on-disk snapshots for
 * a session without exploding if the directory is already gone."
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import {
  recordSnapshot,
  discardSnapshotRepository,
  snapshotRepositoryExists,
  listSnapshots,
} from '../../src/core/snapshot.js';
import type { FileCheckpoint } from '../../src/core/checkpoints.js';

describe('snapshot repository lifecycle', () => {
  let tmpHome: string;
  let originalHome: string | undefined;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-snapshot-lifecycle-'));
    originalHome = process.env.HOME;
    process.env.HOME = tmpHome;
  });

  afterEach(async () => {
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
    await fs.rm(tmpHome, { recursive: true, force: true });
  });

  function fakeCheckpoint(filePath: string): FileCheckpoint {
    return {
      filePath,
      originalContent: 'orig',
      newContent: 'new',
      timestamp: Date.now(),
    } as FileCheckpoint;
  }

  it('discardSnapshotRepository removes every snapshot for a session', async () => {
    const sessionId = 'sess-a';
    await recordSnapshot(sessionId, 'step-1', [fakeCheckpoint('/tmp/a.txt')], ['edit']);
    await recordSnapshot(sessionId, 'step-2', [fakeCheckpoint('/tmp/b.txt')], ['edit']);

    expect(snapshotRepositoryExists(sessionId)).toBe(true);
    expect((await listSnapshots(sessionId)).length).toBe(2);

    const deleted = await discardSnapshotRepository(sessionId);
    expect(deleted).toBe(2);
    expect(snapshotRepositoryExists(sessionId)).toBe(false);
    expect(await listSnapshots(sessionId)).toEqual([]);
  });

  it('discardSnapshotRepository is idempotent when the directory is already gone', async () => {
    const sessionId = 'sess-missing';
    // Never created — mirrors the "seed pin held after repo removed" case.
    const deleted = await discardSnapshotRepository(sessionId);
    expect(deleted).toBe(0);
    expect(snapshotRepositoryExists(sessionId)).toBe(false);
  });

  it('snapshotRepositoryExists reflects on-disk state', async () => {
    const sessionId = 'sess-c';
    expect(snapshotRepositoryExists(sessionId)).toBe(false);
    await recordSnapshot(sessionId, 'step-1', [fakeCheckpoint('/tmp/a.txt')], ['edit']);
    expect(snapshotRepositoryExists(sessionId)).toBe(true);
    await discardSnapshotRepository(sessionId);
    expect(snapshotRepositoryExists(sessionId)).toBe(false);
  });
});
