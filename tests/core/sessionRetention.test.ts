/**
 * Session retention engine tests.
 *
 * Verifies:
 *   - Age-based deletion (sessions older than maxAgeDays).
 *   - Count-based deletion (only N most recent per project retained).
 *   - Dry-run mode returns candidates without touching the filesystem.
 *   - Exclude patterns short-circuit deletion by id and by title.
 *   - Project filter narrows the sweep to a single bucket.
 *   - Empty policy is a no-op (returns nothing to delete).
 *   - Byte-size accounting and `formatBytes` helper.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  applyRetentionPolicy,
  formatBytes,
  selectCandidates,
} from '../../src/core/sessionRetention.js';
import { scanSessions } from '../../src/core/sessionScanner.js';
import type { Session } from '../../src/core/sessionManager.js';

const DAY_MS = 24 * 60 * 60 * 1000;

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-retention-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function writeSession(
  id: string,
  overrides: Partial<Session['metadata']> = {},
  mtimeMs?: number
): string {
  const now = Date.now();
  const session: Session = {
    metadata: {
      id,
      created: overrides.created ?? now,
      updated: overrides.updated ?? now,
      totalTokens: 0,
      messageCount: 0,
      ...overrides,
    },
    messages: [],
  };
  const filePath = path.join(tempDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
  if (mtimeMs !== undefined) {
    fs.utimesSync(filePath, mtimeMs / 1000, mtimeMs / 1000);
  }
  return filePath;
}

describe('selectCandidates', () => {
  it('returns nothing to delete for an empty policy', async () => {
    const now = Date.now();
    writeSession('a', { updated: now - 60 * DAY_MS });
    writeSession('b', { updated: now - 1 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete, toSkip } = selectCandidates(scanned, {}, now);
    expect(toDelete).toEqual([]);
    expect(toSkip).toEqual([]);
  });

  it('marks sessions older than maxAgeDays for deletion', async () => {
    const now = Date.now();
    writeSession('old', { updated: now - 60 * DAY_MS });
    writeSession('recent', { updated: now - 1 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete } = selectCandidates(scanned, { maxAgeDays: 30 }, now);
    expect(toDelete.map((s) => s.id)).toEqual(['old']);
  });

  it('keeps only the N most-recent sessions per project', async () => {
    const now = Date.now();
    writeSession('a1', { workdir: '/tmp/alpha', updated: now - 5 * DAY_MS });
    writeSession('a2', { workdir: '/tmp/alpha', updated: now - 10 * DAY_MS });
    writeSession('a3', { workdir: '/tmp/alpha', updated: now - 15 * DAY_MS });
    writeSession('b1', { workdir: '/tmp/beta', updated: now - 3 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete } = selectCandidates(scanned, { maxCountPerProject: 2 }, now);
    expect(toDelete.map((s) => s.id)).toEqual(['a3']);
  });

  it('excludes sessions matching an exclude pattern by id', async () => {
    const now = Date.now();
    writeSession('important-notes', { updated: now - 60 * DAY_MS });
    writeSession('junk', { updated: now - 60 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete, toSkip } = selectCandidates(
      scanned,
      { maxAgeDays: 30, excludePatterns: ['important-*'] },
      now
    );
    expect(toDelete.map((s) => s.id)).toEqual(['junk']);
    expect(toSkip.map((s) => s.id)).toEqual(['important-notes']);
  });

  it('excludes sessions matching an exclude pattern by title', async () => {
    const now = Date.now();
    writeSession('sess-1', { title: 'Keep me forever', updated: now - 60 * DAY_MS });
    writeSession('sess-2', { title: 'transient work', updated: now - 60 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete } = selectCandidates(
      scanned,
      { maxAgeDays: 30, excludePatterns: ['Keep*'] },
      now
    );
    expect(toDelete.map((s) => s.id)).toEqual(['sess-2']);
  });

  it('restricts sweep to a single project bucket', async () => {
    const now = Date.now();
    writeSession('a1', { workdir: '/tmp/alpha', updated: now - 60 * DAY_MS });
    writeSession('b1', { workdir: '/tmp/beta', updated: now - 60 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete, toSkip } = selectCandidates(
      scanned,
      { maxAgeDays: 30, project: 'alpha' },
      now
    );
    expect(toDelete.map((s) => s.id)).toEqual(['a1']);
    expect(toSkip.map((s) => s.id)).toEqual(['b1']);
  });

  it('combines age and count policies (either condition triggers deletion)', async () => {
    const now = Date.now();
    // Old but only-of-project — age would flag it.
    writeSession('old-alpha', { workdir: '/tmp/alpha', updated: now - 60 * DAY_MS });
    // Recent but count would flag it (3 sessions in same project, keep=1).
    writeSession('beta-1', { workdir: '/tmp/beta', updated: now - 1 * DAY_MS });
    writeSession('beta-2', { workdir: '/tmp/beta', updated: now - 2 * DAY_MS });
    writeSession('beta-3', { workdir: '/tmp/beta', updated: now - 3 * DAY_MS });

    const scanned = await scanSessions(tempDir);
    const { toDelete } = selectCandidates(scanned, { maxAgeDays: 30, maxCountPerProject: 1 }, now);
    expect(toDelete.map((s) => s.id).sort()).toEqual(['beta-2', 'beta-3', 'old-alpha']);
  });
});

describe('applyRetentionPolicy', () => {
  it('deletes selected files and reports bytes freed', async () => {
    const now = Date.now();
    const oldPath = writeSession('old', { updated: now - 60 * DAY_MS });
    writeSession('young', { updated: now - 1 * DAY_MS });

    const result = await applyRetentionPolicy({ maxAgeDays: 30 }, { sessionsDir: tempDir, now });
    expect(result.deleted).toEqual([oldPath]);
    expect(result.dryRun).toBe(false);
    expect(result.bytesFreed).toBeGreaterThan(0);
    expect(result.errors).toEqual([]);
    expect(fs.existsSync(oldPath)).toBe(false);
  });

  it('leaves files intact in dry-run mode', async () => {
    const now = Date.now();
    const oldPath = writeSession('old', { updated: now - 60 * DAY_MS });

    const result = await applyRetentionPolicy(
      { maxAgeDays: 30, dryRun: true },
      { sessionsDir: tempDir, now }
    );
    expect(result.deleted).toEqual([oldPath]);
    expect(result.dryRun).toBe(true);
    expect(fs.existsSync(oldPath)).toBe(true);
  });

  it('is a no-op when neither age nor count policy is set', async () => {
    const now = Date.now();
    const p = writeSession('any', { updated: now - 365 * DAY_MS });

    const result = await applyRetentionPolicy({}, { sessionsDir: tempDir, now });
    expect(result.deleted).toEqual([]);
    expect(fs.existsSync(p)).toBe(true);
  });

  it('rejects invalid policy shapes via Zod', async () => {
    await expect(
      applyRetentionPolicy(
        // @ts-expect-error deliberately invalid — Zod should reject.
        { maxAgeDays: -5 },
        { sessionsDir: tempDir }
      )
    ).rejects.toThrow();
  });
});

describe('formatBytes', () => {
  it('renders zero and small byte counts as B', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
  });

  it('renders KB / MB / GB with one decimal', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.0 GB');
  });

  it('gracefully handles bogus input', () => {
    expect(formatBytes(Number.NaN)).toBe('0 B');
    expect(formatBytes(-1)).toBe('0 B');
  });
});
