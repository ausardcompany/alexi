/**
 * Session retention tests.
 *
 * Verifies:
 *   - Expired sessions are deleted when `retention.enabled` is true.
 *   - Sessions with an active run are never deleted.
 *   - Sessions with a recent (< 1h) message write are held back.
 *   - Expired children cascade with their expired parents.
 *   - When `retention.enabled` is false, `cleanupExpiredSessions` is a
 *     no-op (nothing deleted).
 *   - The retention scheduler honours its 24h cooldown.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Mock the userConfig module so tests can toggle the retention policy
// without touching the real `~/.alexi/config.json`.
vi.mock('../../src/config/userConfig.js', () => {
  const state: { policy: { enabled: boolean; maxAgeDays: number } } = {
    policy: { enabled: false, maxAgeDays: 30 },
  };
  return {
    getConfigSessionRetention: vi.fn(() => state.policy),
    __setPolicy: (policy: { enabled: boolean; maxAgeDays: number }) => {
      state.policy = policy;
    },
  };
});

vi.mock('../../src/core/compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

vi.mock('../../src/core/sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { SessionManager, type Session } from '../../src/core/sessionManager.js';
import * as userConfigMock from '../../src/config/userConfig.js';

type PolicySetter = (policy: { enabled: boolean; maxAgeDays: number }) => void;
const setPolicy = (userConfigMock as unknown as { __setPolicy: PolicySetter }).__setPolicy;

let tempDir: string;
let originalHome: string | undefined;
let homeDir: string;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Write a session file directly to the sessions directory so its
 * `updated` field / mtime can be controlled independently of the
 * `SessionManager.saveSession` code path (which stamps `Date.now`).
 */
function writeSession(dir: string, session: Session, mtimeMs: number): string {
  const filePath = path.join(dir, `${session.metadata.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
  fs.utimesSync(filePath, mtimeMs / 1000, mtimeMs / 1000);
  return filePath;
}

function makeSession(id: string, updated: number, parentId?: string): Session {
  return {
    metadata: {
      id,
      created: updated,
      updated,
      totalTokens: 0,
      messageCount: 0,
      ...(parentId ? { parentSessionId: parentId } : {}),
    },
    messages: [],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-retention-'));
  homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'retention-home-'));
  originalHome = process.env.HOME;
  process.env.HOME = homeDir;
  setPolicy({ enabled: false, maxAgeDays: 30 });
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.rmSync(homeDir, { recursive: true, force: true });
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }
});

describe('SessionManager.cleanupExpiredSessions', () => {
  it('returns an empty summary when retention.enabled is false', () => {
    setPolicy({ enabled: false, maxAgeDays: 30 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    // Write a session that WOULD be expired if enabled were true.
    writeSession(tempDir, makeSession('old-1', now - 60 * DAY_MS), now - 60 * DAY_MS);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary).toEqual({ deleted: 0, skipped: 0, errors: [] });

    // File is still present on disk.
    expect(fs.existsSync(path.join(tempDir, 'old-1.json'))).toBe(true);
  });

  it('deletes sessions older than retention.maxAgeDays when enabled', () => {
    setPolicy({ enabled: true, maxAgeDays: 30 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    writeSession(tempDir, makeSession('old-1', now - 60 * DAY_MS), now - 60 * DAY_MS);
    writeSession(tempDir, makeSession('old-2', now - 45 * DAY_MS), now - 45 * DAY_MS);
    writeSession(tempDir, makeSession('young-1', now - 5 * DAY_MS), now - 5 * DAY_MS);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary.deleted).toBe(2);
    expect(summary.errors).toEqual([]);

    expect(fs.existsSync(path.join(tempDir, 'old-1.json'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'old-2.json'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'young-1.json'))).toBe(true);
  });

  it('never deletes sessions with an active run', () => {
    setPolicy({ enabled: true, maxAgeDays: 30 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    const runningId = 'running-1';
    writeSession(tempDir, makeSession(runningId, now - 90 * DAY_MS), now - 90 * DAY_MS);

    // Register an active run for the expired session.
    manager.beginSessionRun(runningId);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary.deleted).toBe(0);
    expect(summary.skipped).toBe(1);
    expect(fs.existsSync(path.join(tempDir, `${runningId}.json`))).toBe(true);

    manager.endSessionRun(runningId);
  });

  it('holds back sessions whose most recent message is within the 1h recent-write window', () => {
    setPolicy({ enabled: true, maxAgeDays: 30 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    // Session's `updated` field is old, but its last message timestamp
    // is fresh (was writing right up to the age boundary).
    const session: Session = {
      metadata: {
        id: 'stale-updated',
        created: now - 90 * DAY_MS,
        updated: now - 90 * DAY_MS,
        totalTokens: 0,
        messageCount: 1,
      },
      messages: [
        {
          role: 'user',
          content: 'still active',
          timestamp: now - 10 * 60 * 1000, // 10 minutes ago
        },
      ],
    };
    writeSession(tempDir, session, now - 90 * DAY_MS);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary.deleted).toBe(0);
    expect(summary.skipped).toBe(1);
    expect(fs.existsSync(path.join(tempDir, 'stale-updated.json'))).toBe(true);
  });

  it('cascades deletes to expired children of expired parents', () => {
    setPolicy({ enabled: true, maxAgeDays: 30 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    writeSession(tempDir, makeSession('parent', now - 60 * DAY_MS), now - 60 * DAY_MS);
    writeSession(tempDir, makeSession('child-old', now - 45 * DAY_MS, 'parent'), now - 45 * DAY_MS);
    // Young child of the same expired parent should survive.
    writeSession(tempDir, makeSession('child-young', now - 5 * DAY_MS, 'parent'), now - 5 * DAY_MS);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary.deleted).toBe(2);
    expect(fs.existsSync(path.join(tempDir, 'parent.json'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'child-old.json'))).toBe(false);
    expect(fs.existsSync(path.join(tempDir, 'child-young.json'))).toBe(true);
  });

  it('does not touch sessions when maxAgeDays is large', () => {
    setPolicy({ enabled: true, maxAgeDays: 365 });

    const manager = new SessionManager(tempDir);
    const now = Date.now();

    writeSession(tempDir, makeSession('a', now - 100 * DAY_MS), now - 100 * DAY_MS);
    writeSession(tempDir, makeSession('b', now - 200 * DAY_MS), now - 200 * DAY_MS);

    const summary = manager.cleanupExpiredSessions(now);
    expect(summary.deleted).toBe(0);
    expect(fs.existsSync(path.join(tempDir, 'a.json'))).toBe(true);
    expect(fs.existsSync(path.join(tempDir, 'b.json'))).toBe(true);
  });
});

describe('retention scheduler', () => {
  it('shouldRun returns true when state file is absent', async () => {
    const mod = await import('../../src/core/retentionScheduler.js');
    expect(mod.shouldRun()).toBe(true);
  });

  it('shouldRun returns false within 24h of a previous run', async () => {
    const mod = await import('../../src/core/retentionScheduler.js');
    const stateDir = path.join(homeDir, '.alexi');
    fs.mkdirSync(stateDir, { recursive: true });
    const now = Date.now();
    fs.writeFileSync(path.join(stateDir, 'last-retention-run'), String(now - 1000), 'utf-8');
    expect(mod.shouldRun(now)).toBe(false);
  });

  it('triggerRetentionSweep records timestamp and returns true on first run', async () => {
    setPolicy({ enabled: false, maxAgeDays: 30 });

    const mod = await import('../../src/core/retentionScheduler.js');
    const now = Date.now();
    const scheduled = mod.triggerRetentionSweep(now);
    expect(scheduled).toBe(true);

    const statePath = path.join(homeDir, '.alexi', 'last-retention-run');
    expect(fs.existsSync(statePath)).toBe(true);
    const stored = Number(fs.readFileSync(statePath, 'utf-8'));
    expect(stored).toBe(now);

    // A second call within the cooldown window should skip.
    const scheduledAgain = mod.triggerRetentionSweep(now + 60 * 1000);
    expect(scheduledAgain).toBe(false);
  });
});
