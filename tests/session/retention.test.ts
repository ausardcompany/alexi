/**
 * Tests for the RetentionRunner lifecycle (issue #1876).
 *
 * Covers:
 *   - Age-based cleanup (older than `maxAgeDays` -> deleted).
 *   - Count-based cleanup (only `maxCount` most-recent are kept).
 *   - Active-session preservation via `preserveActive` + a
 *     `SessionManager`-shaped stub with `hasActiveRun`.
 *   - `dryRun` never invokes `fs.unlink`.
 *   - Malformed session files do not block the sweep.
 *   - `effectiveLastAccessed` falls back gracefully when
 *     `lastAccessedAt` is missing on legacy sessions.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  RetentionRunner,
  effectiveLastAccessed,
  selectCandidatesFromPolicy,
  RetentionPolicySchema,
  type RetentionPolicy,
} from '../../src/session/retention.js';
import type { ScannedSession } from '../../src/core/sessionScanner.js';
import type { SessionMetadata } from '../../src/core/sessionManager.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retention-runner-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

interface WriteSessionOptions {
  id: string;
  updated: number;
  lastAccessedAt?: number;
  title?: string;
  workdir?: string;
}

function writeSession(dir: string, opts: WriteSessionOptions): string {
  const metadata: SessionMetadata = {
    id: opts.id,
    created: opts.updated,
    updated: opts.updated,
    totalTokens: 0,
    messageCount: 0,
    ...(opts.title ? { title: opts.title } : {}),
    ...(opts.workdir ? { workdir: opts.workdir } : {}),
    ...(typeof opts.lastAccessedAt === 'number' ? { lastAccessedAt: opts.lastAccessedAt } : {}),
  };
  const filePath = path.join(dir, `${opts.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ metadata, messages: [] }, null, 2), 'utf-8');
  fs.utimesSync(filePath, opts.updated / 1000, opts.updated / 1000);
  return filePath;
}

function makeScanned(
  overrides: Partial<ScannedSession> & Pick<ScannedSession, 'id'>
): ScannedSession {
  const updatedAt = overrides.updatedAt ?? NOW;
  const metadata: SessionMetadata = {
    id: overrides.id,
    created: updatedAt,
    updated: updatedAt,
    totalTokens: 0,
    messageCount: 0,
    ...(overrides.metadata ?? {}),
  };
  return {
    id: overrides.id,
    filePath: overrides.filePath ?? `/tmp/${overrides.id}.json`,
    size: overrides.size ?? 100,
    mtime: overrides.mtime ?? updatedAt,
    createdAt: overrides.createdAt ?? updatedAt,
    updatedAt,
    project: overrides.project ?? 'default',
    metadata,
  };
}

describe('RetentionPolicySchema', () => {
  it('rejects unknown fields (strict mode)', () => {
    expect(() =>
      RetentionPolicySchema.parse({ maxAgeDays: 30, weird: true } as unknown as RetentionPolicy)
    ).toThrow();
  });

  it('rejects negative maxAgeDays', () => {
    expect(() => RetentionPolicySchema.parse({ maxAgeDays: 0 })).toThrow();
    expect(() => RetentionPolicySchema.parse({ maxAgeDays: -1 })).toThrow();
  });

  it('accepts maxCount === 0 (delete everything)', () => {
    expect(() => RetentionPolicySchema.parse({ maxCount: 0 })).not.toThrow();
  });

  it('accepts empty policy (no-op)', () => {
    expect(() => RetentionPolicySchema.parse({})).not.toThrow();
  });
});

describe('effectiveLastAccessed', () => {
  it('prefers metadata.lastAccessedAt when present', () => {
    const session = makeScanned({
      id: 'a',
      updatedAt: NOW - 10 * DAY_MS,
      metadata: {
        id: 'a',
        created: NOW - 10 * DAY_MS,
        updated: NOW - 10 * DAY_MS,
        totalTokens: 0,
        messageCount: 0,
        lastAccessedAt: NOW - 1 * DAY_MS,
      },
    });
    expect(effectiveLastAccessed(session)).toBe(NOW - 1 * DAY_MS);
  });

  it('falls back to updatedAt when lastAccessedAt is absent', () => {
    const session = makeScanned({ id: 'b', updatedAt: NOW - 5 * DAY_MS });
    expect(effectiveLastAccessed(session)).toBe(NOW - 5 * DAY_MS);
  });
});

describe('selectCandidatesFromPolicy (pure decision phase)', () => {
  const noneActive = (): boolean => false;

  it('marks age-expired sessions for deletion', () => {
    const sessions = [
      makeScanned({ id: 'young', updatedAt: NOW - 1 * DAY_MS }),
      makeScanned({ id: 'old', updatedAt: NOW - 45 * DAY_MS }),
    ];
    const { toDelete, toPreserve } = selectCandidatesFromPolicy(
      sessions,
      { maxAgeDays: 30 },
      NOW,
      noneActive
    );
    expect(toDelete.map((s) => s.id)).toEqual(['old']);
    expect(toPreserve).toEqual([]);
  });

  it('marks count-overflow sessions for deletion (keeps N most recent)', () => {
    const sessions = [
      makeScanned({ id: 'a', updatedAt: NOW - 1 * DAY_MS }),
      makeScanned({ id: 'b', updatedAt: NOW - 2 * DAY_MS }),
      makeScanned({ id: 'c', updatedAt: NOW - 3 * DAY_MS }),
      makeScanned({ id: 'd', updatedAt: NOW - 4 * DAY_MS }),
    ];
    const { toDelete } = selectCandidatesFromPolicy(sessions, { maxCount: 2 }, NOW, noneActive);
    // Keeps `a` and `b`; deletes `c` and `d`.
    expect(toDelete.map((s) => s.id).sort()).toEqual(['c', 'd']);
  });

  it('preserves active sessions when preserveActive=true (the default)', () => {
    const sessions = [
      makeScanned({ id: 'old-active', updatedAt: NOW - 90 * DAY_MS }),
      makeScanned({ id: 'old-idle', updatedAt: NOW - 90 * DAY_MS }),
    ];
    const isActive = (id: string): boolean => id === 'old-active';
    const { toDelete, toPreserve } = selectCandidatesFromPolicy(
      sessions,
      { maxAgeDays: 30 },
      NOW,
      isActive
    );
    expect(toDelete.map((s) => s.id)).toEqual(['old-idle']);
    expect(toPreserve.map((s) => s.id)).toEqual(['old-active']);
  });

  it('deletes active sessions when preserveActive=false', () => {
    const sessions = [makeScanned({ id: 'old-active', updatedAt: NOW - 90 * DAY_MS })];
    const isActive = (): boolean => true;
    const { toDelete, toPreserve } = selectCandidatesFromPolicy(
      sessions,
      { maxAgeDays: 30, preserveActive: false },
      NOW,
      isActive
    );
    expect(toDelete.map((s) => s.id)).toEqual(['old-active']);
    expect(toPreserve).toEqual([]);
  });

  it('returns no deletions for an empty policy', () => {
    const sessions = [makeScanned({ id: 'ancient', updatedAt: 0 })];
    const { toDelete } = selectCandidatesFromPolicy(sessions, {}, NOW, noneActive);
    expect(toDelete).toEqual([]);
  });

  it('uses lastAccessedAt when scoring age (not updatedAt)', () => {
    const sessions = [
      makeScanned({
        id: 'touched-recently',
        updatedAt: NOW - 90 * DAY_MS,
        metadata: {
          id: 'touched-recently',
          created: NOW - 90 * DAY_MS,
          updated: NOW - 90 * DAY_MS,
          totalTokens: 0,
          messageCount: 0,
          lastAccessedAt: NOW - 1 * DAY_MS,
        },
      }),
    ];
    const { toDelete } = selectCandidatesFromPolicy(sessions, { maxAgeDays: 30 }, NOW, noneActive);
    expect(toDelete).toEqual([]);
  });
});

describe('RetentionRunner.sweep', () => {
  it('deletes age-expired session files from disk', async () => {
    const oldPath = writeSession(tempDir, { id: 'old', updated: NOW - 45 * DAY_MS });
    const newPath = writeSession(tempDir, { id: 'new', updated: NOW - 1 * DAY_MS });

    const runner = new RetentionRunner({
      sessionsDir: tempDir,
      now: () => NOW,
    });
    const result = await runner.sweep({ maxAgeDays: 30 });

    expect(result.deleted).toEqual([oldPath]);
    expect(result.scanned).toBe(2);
    expect(result.dryRun).toBe(false);
    expect(fs.existsSync(oldPath)).toBe(false);
    expect(fs.existsSync(newPath)).toBe(true);
    expect(result.bytesFreed).toBeGreaterThan(0);
  });

  it('honours dryRun and does not touch the filesystem', async () => {
    const oldPath = writeSession(tempDir, { id: 'old', updated: NOW - 45 * DAY_MS });

    const runner = new RetentionRunner({ sessionsDir: tempDir, now: () => NOW });
    const result = await runner.sweep({ maxAgeDays: 30, dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.deleted).toEqual([oldPath]);
    expect(fs.existsSync(oldPath)).toBe(true);
  });

  it('preserves sessions with an active run via the SessionManager stub', async () => {
    const oldActive = writeSession(tempDir, { id: 'old-active', updated: NOW - 90 * DAY_MS });
    const oldIdle = writeSession(tempDir, { id: 'old-idle', updated: NOW - 90 * DAY_MS });

    const active = new Set(['old-active']);
    const runner = new RetentionRunner({
      sessionsDir: tempDir,
      now: () => NOW,
      sessionManager: { hasActiveRun: (id: string) => active.has(id) },
    });
    const result = await runner.sweep({ maxAgeDays: 30, preserveActive: true });

    expect(result.deleted).toEqual([oldIdle]);
    expect(result.preserved).toEqual([oldActive]);
    expect(fs.existsSync(oldActive)).toBe(true);
    expect(fs.existsSync(oldIdle)).toBe(false);
  });

  it('applies count-based cleanup after age filtering', async () => {
    const paths = [
      writeSession(tempDir, { id: 'a', updated: NOW - 1 * DAY_MS }),
      writeSession(tempDir, { id: 'b', updated: NOW - 2 * DAY_MS }),
      writeSession(tempDir, { id: 'c', updated: NOW - 3 * DAY_MS }),
      writeSession(tempDir, { id: 'd', updated: NOW - 4 * DAY_MS }),
    ];

    const runner = new RetentionRunner({ sessionsDir: tempDir, now: () => NOW });
    const result = await runner.sweep({ maxCount: 2 });

    expect(result.deleted.sort()).toEqual([paths[2], paths[3]].sort());
    expect(fs.existsSync(paths[0])).toBe(true);
    expect(fs.existsSync(paths[1])).toBe(true);
    expect(fs.existsSync(paths[2])).toBe(false);
    expect(fs.existsSync(paths[3])).toBe(false);
  });

  it('skips malformed session files without aborting the sweep', async () => {
    const oldPath = writeSession(tempDir, { id: 'old', updated: NOW - 45 * DAY_MS });
    fs.writeFileSync(path.join(tempDir, 'garbage.json'), 'not json', 'utf-8');

    const runner = new RetentionRunner({ sessionsDir: tempDir, now: () => NOW });
    const result = await runner.sweep({ maxAgeDays: 30 });

    expect(result.deleted).toEqual([oldPath]);
    // Malformed file was skipped, not counted as scanned.
    expect(result.scanned).toBe(1);
  });

  it('returns an empty result for a policy with no fields set', async () => {
    writeSession(tempDir, { id: 'x', updated: NOW - 999 * DAY_MS });
    const runner = new RetentionRunner({ sessionsDir: tempDir, now: () => NOW });
    const result = await runner.sweep();

    expect(result.deleted).toEqual([]);
    expect(result.preserved).toEqual([]);
    expect(result.errors).toEqual([]);
    expect(result.scanned).toBe(1);
  });

  it('returns 0-scan result when sessions dir does not exist', async () => {
    const missing = path.join(tempDir, 'does-not-exist');
    const runner = new RetentionRunner({ sessionsDir: missing, now: () => NOW });
    const result = await runner.sweep({ maxAgeDays: 30 });
    expect(result.scanned).toBe(0);
    expect(result.deleted).toEqual([]);
  });

  it('exposes the configured sessions directory', () => {
    const runner = new RetentionRunner({ sessionsDir: tempDir });
    expect(runner.getSessionsDir()).toBe(tempDir);
  });
});
