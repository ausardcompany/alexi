/**
 * Scheduled wake-time tests for issue #1901.
 *
 * Verifies:
 *   1. `SessionManager.setScheduledWakeTime` persists the value across
 *      saves and loads (survives a fresh SessionManager instance over
 *      the same on-disk directory).
 *   2. `setScheduledWakeTime(null)` clears the field.
 *   3. Setting the wake time on a non-active session reads the file
 *      from disk, mutates metadata, and writes it back.
 *   4. The `formatWakeTime` helper produces the expected relative /
 *      absolute strings for the full set of cases documented in the
 *      helper (null, imminent, upcoming, horizon-crossing, overdue).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock the heavy session-adjacent modules so the test does not pull in
// compaction / plugin init side effects for a pure metadata assertion.
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
import { formatWakeTime, formatDuration, formatAbsoluteUtc } from '../../src/utils/wakeTime.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-wake-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('SessionManager.setScheduledWakeTime (issue #1901)', () => {
  it('persists scheduledWakeTime through save + reload on the active session', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    const target = Date.now() + 60 * 60 * 1000;

    const ok = mgr.setScheduledWakeTime(session.metadata.id, target);
    expect(ok).toBe(true);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBe(Math.floor(target));

    const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
    const onDisk = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as Session;
    expect(onDisk.metadata.scheduledWakeTime).toBe(Math.floor(target));

    // A fresh manager loading the same session MUST see the field —
    // this is the durability contract the TUI / CLI depend on.
    const mgr2 = new SessionManager(tempDir);
    const loaded = mgr2.loadSession(session.metadata.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.metadata.scheduledWakeTime).toBe(Math.floor(target));
  });

  it('persists the field even when the session is not active in-memory', () => {
    // Write session via one manager, then stamp via a fresh manager
    // that has no active session so the branch which reads from disk
    // is exercised.
    const mgrA = new SessionManager(tempDir);
    const session = mgrA.createSession();

    const mgrB = new SessionManager(tempDir);
    const target = Date.now() + 10 * 60 * 1000;
    const ok = mgrB.setScheduledWakeTime(session.metadata.id, target);
    expect(ok).toBe(true);

    const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
    const onDisk = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as Session;
    expect(onDisk.metadata.scheduledWakeTime).toBe(Math.floor(target));
  });

  it('clears scheduledWakeTime when passed null', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    mgr.setScheduledWakeTime(session.metadata.id, Date.now() + 60_000);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBeDefined();

    const ok = mgr.setScheduledWakeTime(session.metadata.id, null);
    expect(ok).toBe(true);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBeUndefined();

    const onDisk = JSON.parse(
      fs.readFileSync(path.join(tempDir, `${session.metadata.id}.json`), 'utf-8')
    ) as Session;
    expect(onDisk.metadata.scheduledWakeTime).toBeUndefined();
  });

  it('returns false for an unknown session id and does not create a file', () => {
    const mgr = new SessionManager(tempDir);
    const ok = mgr.setScheduledWakeTime('does-not-exist', Date.now() + 1000);
    expect(ok).toBe(false);
    expect(fs.readdirSync(tempDir)).toEqual([]);
  });

  it('rejects non-finite / non-positive timestamps by clearing the field', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    mgr.setScheduledWakeTime(session.metadata.id, Date.now() + 60_000);

    // NaN / negative / zero should be treated as "clear" rather than
    // persisted — defensive, because an invalid wake time is worse
    // than no wake time for the TUI/CLI banner.
    mgr.setScheduledWakeTime(session.metadata.id, Number.NaN);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBeUndefined();

    mgr.setScheduledWakeTime(session.metadata.id, 1_000_000);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBe(1_000_000);

    mgr.setScheduledWakeTime(session.metadata.id, 0);
    expect(mgr.getCurrentSession()!.metadata.scheduledWakeTime).toBeUndefined();
  });
});

describe('formatWakeTime (issue #1901)', () => {
  const base = Date.UTC(2026, 9, 1, 12, 0, 0); // 2026-10-01T12:00:00Z

  it('returns null for missing or invalid input', () => {
    expect(formatWakeTime(null)).toBeNull();
    expect(formatWakeTime(undefined)).toBeNull();
    expect(formatWakeTime(Number.NaN)).toBeNull();
  });

  it('renders a near-future wake as a relative "resumes in" label', () => {
    const future = base + 2 * 60 * 60 * 1000 + 15 * 60 * 1000; // +2h 15m
    const label = formatWakeTime(future, { now: base });
    expect(label).toBe('resumes in 2h 15m');
  });

  it('renders minutes-only when under an hour', () => {
    const future = base + 7 * 60 * 1000;
    expect(formatWakeTime(future, { now: base })).toBe('resumes in 7m');
  });

  it('collapses the imminent window to "<1m"', () => {
    expect(formatWakeTime(base + 10_000, { now: base })).toBe('resumes in <1m');
    expect(formatWakeTime(base - 10_000, { now: base })).toBe('resumes in <1m');
  });

  it('switches to the absolute UTC stamp beyond the 24h horizon', () => {
    const future = base + 48 * 60 * 60 * 1000; // +2d
    const label = formatWakeTime(future, { now: base });
    expect(label).toBe('wakes at 2026-10-03 12:00 UTC');
  });

  it('labels a past wake time as overdue', () => {
    const past = base - 10 * 60 * 1000; // -10m
    const label = formatWakeTime(past, { now: base });
    expect(label).toBe('wake overdue since 2026-10-01 11:50 UTC');
  });

  it('accepts a Date instance', () => {
    const future = new Date(base + 30 * 60 * 1000);
    expect(formatWakeTime(future, { now: new Date(base) })).toBe('resumes in 30m');
  });

  it('respects custom prefix options', () => {
    const future = base + 5 * 60 * 1000;
    const label = formatWakeTime(future, {
      now: base,
      upcomingPrefix: 'wakes in',
    });
    expect(label).toBe('wakes in 5m');
  });
});

describe('formatDuration + formatAbsoluteUtc helpers', () => {
  it('formats sub-minute, minute, hour, and day magnitudes', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(45_000)).toBe('45s');
    expect(formatDuration(90_000)).toBe('1m');
    expect(formatDuration(3_600_000)).toBe('1h');
    expect(formatDuration(5_400_000)).toBe('1h 30m');
    expect(formatDuration(86_400_000)).toBe('1d');
    expect(formatDuration(90_000_000)).toBe('1d 1h');
  });

  it('clamps negative or non-finite durations to 0s', () => {
    expect(formatDuration(-1)).toBe('0s');
    expect(formatDuration(Number.NaN)).toBe('0s');
  });

  it('renders UTC stamps with zero-padded fields', () => {
    const stamp = formatAbsoluteUtc(Date.UTC(2026, 0, 5, 3, 7, 0));
    expect(stamp).toBe('2026-01-05 03:07 UTC');
  });
});
