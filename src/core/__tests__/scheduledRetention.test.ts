/**
 * Tests for the scheduled retention runner
 * (`src/core/scheduledRetention.ts`, issue #1927).
 *
 * The scheduler drives the real `runRetentionCycle` which performs
 * actual filesystem I/O; vitest fake timers only intercept timer
 * APIs, so these tests use real timers with small intervals and a
 * promise-based `onCycle` callback to deterministically wait for the
 * first (and second) cycle to complete.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  DEFAULT_INITIAL_DELAY_MS,
  _resetSchedulerForTests,
  startRetentionScheduler,
} from '../scheduledRetention.js';
import { DISABLE_ENV } from '../retentionRunner.js';
import type { SessionMetadata } from '../sessionManager.js';

const DAY_MS = 24 * 60 * 60 * 1000;

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scheduled-retention-'));
  delete process.env[DISABLE_ENV];
  _resetSchedulerForTests();
});

afterEach(() => {
  _resetSchedulerForTests();
  fs.rmSync(tempDir, { recursive: true, force: true });
  delete process.env[DISABLE_ENV];
});

function writeAgedSession(dir: string, id: string, ageDays: number): string {
  const past = Date.now() - ageDays * DAY_MS;
  const metadata: SessionMetadata = {
    id,
    created: past,
    updated: past,
    totalTokens: 0,
    messageCount: 0,
  };
  const filePath = path.join(dir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ metadata, messages: [] }, null, 2), 'utf-8');
  fs.utimesSync(filePath, past / 1000, past / 1000);
  return filePath;
}

/**
 * Create a Deferred-like helper that resolves after `n` onCycle
 * invocations. Used to block the test until N cycles have genuinely
 * completed, including their async I/O.
 */
function createCycleWaiter(n: number): {
  onCycle: () => void;
  wait: () => Promise<void>;
  getCount: () => number;
} {
  let count = 0;
  let resolve: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return {
    onCycle: () => {
      count += 1;
      if (count >= n) {
        resolve();
      }
    },
    wait: () => promise,
    getCount: () => count,
  };
}

describe('startRetentionScheduler - gating', () => {
  it('exports a 5-minute DEFAULT_INITIAL_DELAY_MS', () => {
    expect(DEFAULT_INITIAL_DELAY_MS).toBe(5 * 60 * 1000);
  });

  it('is a no-op when retention.enabled is false', () => {
    const handle = startRetentionScheduler({
      policy: {
        enabled: false,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
    });

    expect(handle.started).toBe(false);
  });

  it('is a no-op when ALEXI_DISABLE_RETENTION=1', () => {
    process.env[DISABLE_ENV] = '1';
    const handle = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
    });
    expect(handle.started).toBe(false);
  });

  it('rejects a second start in the same process', () => {
    const first = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 60_000,
      intervalMs: 60_000,
    });
    const second = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 60_000,
      intervalMs: 60_000,
    });

    expect(first.started).toBe(true);
    expect(second.started).toBe(false);
    first.stop();
  });
});

describe('startRetentionScheduler - execution', () => {
  it('runs the first cycle after initialDelayMs and archives aged sessions', async () => {
    const oldPath = writeAgedSession(tempDir, 'old', 60);
    const waiter = createCycleWaiter(1);

    const handle = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 10,
      intervalMs: 1_000_000, // Big interval so only initial cycle fires.
      onCycle: waiter.onCycle,
    });

    expect(handle.started).toBe(true);

    await waiter.wait();

    // Aged session must have been archived.
    expect(fs.existsSync(oldPath)).toBe(false);
    expect(fs.existsSync(path.join(tempDir, '.archive', 'old.json.gz'))).toBe(true);

    handle.stop();
  });

  it('runs periodic cycles after the first run', async () => {
    writeAgedSession(tempDir, 'periodic', 60);
    const waiter = createCycleWaiter(3);

    const handle = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 10,
      intervalMs: 20,
      onCycle: waiter.onCycle,
    });

    expect(handle.started).toBe(true);
    await waiter.wait();
    expect(waiter.getCount()).toBeGreaterThanOrEqual(3);

    handle.stop();
  });

  it('stop() prevents further cycles from running', async () => {
    writeAgedSession(tempDir, 'stopme', 60);
    const waiter = createCycleWaiter(1);

    const handle = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 10,
      intervalMs: 20,
      onCycle: waiter.onCycle,
    });

    await waiter.wait();
    const countAtStop = waiter.getCount();
    handle.stop();

    // Wait several intervals of real time; count must not grow much
    // (allow +1 for a cycle already in flight when stop() was called).
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(waiter.getCount()).toBeLessThanOrEqual(countAtStop + 1);
  });

  it('swallows errors from onCycle callback without crashing the loop', async () => {
    writeAgedSession(tempDir, 'boom', 60);
    let callCount = 0;
    let resolveSecond: () => void;
    const secondCycle = new Promise<void>((r) => {
      resolveSecond = r;
    });

    const handle = startRetentionScheduler({
      policy: {
        enabled: true,
        maxAgeDays: 30,
        archiveAfterDays: 30,
        deleteAfterDays: 90,
        intervalHours: 24,
      },
      sessionsDir: tempDir,
      initialDelayMs: 10,
      intervalMs: 20,
      onCycle: () => {
        callCount += 1;
        if (callCount === 2) {
          resolveSecond();
        }
        throw new Error('callback boom');
      },
    });

    await secondCycle;
    expect(callCount).toBeGreaterThanOrEqual(2);
    handle.stop();
  });
});
