import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import fsSync from 'fs';
import os from 'os';
import path from 'path';
import {
  recordSnapshot,
  listSnapshots,
  loadSnapshot,
  previewRevert,
  revertTo,
  type Snapshot,
} from '../../src/core/snapshot.js';
import type { FileCheckpoint } from '../../src/core/checkpoints.js';

describe('snapshot / revert', () => {
  let tmpHome: string;
  let workdir: string;
  let originalHome: string | undefined;

  beforeEach(async () => {
    tmpHome = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-snapshot-'));
    workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-snapshot-work-'));
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
    await fs.rm(workdir, { recursive: true, force: true });
  });

  function makeCheckpoint(
    filePath: string,
    originalContent: string,
    newContent: string
  ): FileCheckpoint {
    return {
      id: `cp-${path.basename(filePath)}`,
      filePath,
      originalContent,
      newContent,
      timestamp: Date.now(),
      toolName: 'edit',
    };
  }

  describe('recordSnapshot', () => {
    it('writes the expected file with the expected shape', async () => {
      const filePath = path.join(workdir, 'a.txt');
      await fs.writeFile(filePath, 'new', 'utf-8');
      const cp = makeCheckpoint(filePath, 'orig', 'new');

      await recordSnapshot('sess-1', 'step-7', [cp], ['edit']);

      const snapshotPath = path.join(
        tmpHome,
        '.alexi',
        'sessions',
        'sess-1',
        'snapshots',
        'step-7.json'
      );
      expect(fsSync.existsSync(snapshotPath)).toBe(true);
      const raw = await fs.readFile(snapshotPath, 'utf-8');
      const parsed = JSON.parse(raw) as Snapshot;
      expect(parsed.stepId).toBe('step-7');
      expect(parsed.sessionId).toBe('sess-1');
      expect(parsed.files).toHaveLength(1);
      expect(parsed.files[0].filePath).toBe(filePath);
      expect(parsed.files[0].originalContent).toBe('orig');
      expect(parsed.files[0].newContent).toBe('new');
      expect(parsed.toolCalls).toEqual(['edit']);
      expect(typeof parsed.timestamp).toBe('number');
    });

    it('is a no-op when no checkpoints are provided', async () => {
      await recordSnapshot('sess-empty', 'step-0', [], []);
      const dir = path.join(tmpHome, '.alexi', 'sessions', 'sess-empty', 'snapshots');
      expect(fsSync.existsSync(dir)).toBe(false);
    });
  });

  describe('listSnapshots and loadSnapshot', () => {
    it('lists snapshots sorted newest-first', async () => {
      const filePath = path.join(workdir, 'b.txt');
      await fs.writeFile(filePath, 'new', 'utf-8');
      const cp = makeCheckpoint(filePath, 'orig', 'new');

      await recordSnapshot('sess-list', 'first', [cp], ['edit']);
      // Ensure differing timestamps
      await new Promise((r) => setTimeout(r, 10));
      await recordSnapshot('sess-list', 'second', [cp], ['edit']);

      const snapshots = await listSnapshots('sess-list');
      expect(snapshots).toHaveLength(2);
      expect(snapshots[0].stepId).toBe('second');
      expect(snapshots[1].stepId).toBe('first');
    });

    it('loadSnapshot returns null for missing snapshot', async () => {
      const snap = await loadSnapshot('missing-session', 'no-such-step');
      expect(snap).toBeNull();
    });

    it('listSnapshots returns [] when the snapshots directory is missing', async () => {
      const snaps = await listSnapshots('never-created');
      expect(snaps).toEqual([]);
    });
  });

  describe('revertTo', () => {
    it('restores originalContent when the current file matches newContent', async () => {
      const filePath = path.join(workdir, 'c.txt');
      await fs.writeFile(filePath, 'new', 'utf-8');
      const cp = makeCheckpoint(filePath, 'orig', 'new');
      await recordSnapshot('sess-r', 'step-1', [cp], ['edit']);
      const snap = await loadSnapshot('sess-r', 'step-1');
      expect(snap).not.toBeNull();

      const result = await revertTo(snap!);
      expect(result.restored).toEqual([filePath]);
      expect(result.skipped).toEqual([]);
      const contents = await fs.readFile(filePath, 'utf-8');
      expect(contents).toBe('orig');
    });

    it('skips files whose current bytes match neither originalContent nor newContent', async () => {
      const filePath = path.join(workdir, 'd.txt');
      await fs.writeFile(filePath, 'human-edit', 'utf-8');
      const cp = makeCheckpoint(filePath, 'orig', 'new');
      await recordSnapshot('sess-h', 'step-1', [cp], ['edit']);
      const snap = await loadSnapshot('sess-h', 'step-1');

      const result = await revertTo(snap!);
      expect(result.restored).toEqual([]);
      expect(result.skipped).toEqual([{ filePath, reason: 'modified-outside-agent' }]);
      // File must be untouched.
      const contents = await fs.readFile(filePath, 'utf-8');
      expect(contents).toBe('human-edit');
    });

    it('restores idempotently when the file already matches originalContent', async () => {
      const filePath = path.join(workdir, 'e.txt');
      await fs.writeFile(filePath, 'orig', 'utf-8');
      const cp = makeCheckpoint(filePath, 'orig', 'new');
      await recordSnapshot('sess-idem', 'step-1', [cp], ['edit']);
      const snap = await loadSnapshot('sess-idem', 'step-1');

      const result = await revertTo(snap!);
      expect(result.restored).toEqual([filePath]);
      expect(result.skipped).toEqual([]);
    });
  });

  describe('previewRevert', () => {
    it('counts restorable bytes and flags deleted files', async () => {
      const existing = path.join(workdir, 'f.txt');
      const deleted = path.join(workdir, 'gone.txt');
      await fs.writeFile(existing, 'new', 'utf-8');
      const cps: FileCheckpoint[] = [
        makeCheckpoint(existing, 'orig-1234', 'new'),
        makeCheckpoint(deleted, 'x', 'y'),
      ];
      const snap: Snapshot = {
        stepId: 'p',
        timestamp: Date.now(),
        sessionId: 's',
        files: cps,
        toolCalls: [],
      };
      const rows = previewRevert(snap);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        filePath: existing,
        currentExists: true,
        willRestoreBytes: Buffer.byteLength('orig-1234', 'utf-8'),
      });
      expect(rows[1]).toEqual({
        filePath: deleted,
        currentExists: false,
        willRestoreBytes: 1,
      });
    });
  });
});
