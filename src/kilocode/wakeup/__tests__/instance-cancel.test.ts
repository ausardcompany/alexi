/**
 * Wakeup instance-cancel tests.
 *
 * Ports the intent of upstream kilocode `16831a04e` (tag wakeup cancel
 * events with the session instance) and `a0bd23321` (move session-delete
 * wakeup cancel into KiloSession). Verifies:
 *
 *   1. `schedule()` persists the `instanceID` alongside the entry.
 *   2. `cancel({ instanceID })` on a matching instance succeeds.
 *   3. `cancel({ instanceID })` from a MISMATCHING instance is a no-op —
 *      the wakeup owned by a different session instance stays pending.
 *   4. `cancel({ sessionID })` without a `wakeupID` sweeps every pending
 *      wakeup for that session (the session-delete cleanup path).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Redirect os.homedir() to a per-test tempdir so parallel test runs and
// pre-existing user wakeups do not interfere. The wakeup module reads
// homedir at import time, so we vi.resetModules() and re-import inside
// each `it` block.
let WAKEUP_TMP: string;

beforeEach(async () => {
  WAKEUP_TMP = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-wakeup-test-'));
  vi.spyOn(os, 'homedir').mockReturnValue(WAKEUP_TMP);
  vi.resetModules();
});

afterEach(async () => {
  vi.restoreAllMocks();
  await fs.rm(WAKEUP_TMP, { recursive: true, force: true });
});

describe('Wakeup instance-cancel semantics', () => {
  it('persists instanceID on schedule and honors it on cancel', async () => {
    const { Wakeup } = await import('../index.js');
    const entry = await Wakeup.schedule({
      sessionID: 'sess-A',
      instanceID: 'inst-1',
      when: '1h',
      reason: 'test',
    });
    expect(entry.instanceID).toBe('inst-1');

    // Matching instance → cancel succeeds.
    const ok = await Wakeup.cancel({
      sessionID: 'sess-A',
      instanceID: 'inst-1',
      wakeupID: entry.id,
    });
    expect(ok.cancelled).toBe(true);
  });

  it('rejects cancel from a mismatching instance', async () => {
    const { Wakeup } = await import('../index.js');
    const entry = await Wakeup.schedule({
      sessionID: 'sess-A',
      instanceID: 'inst-1',
      when: '1h',
      reason: 'test',
    });

    // Stale-instance cancel: same session id but different instance.
    const stale = await Wakeup.cancel({
      sessionID: 'sess-A',
      instanceID: 'inst-2', // different instance
      wakeupID: entry.id,
    });
    expect(stale.cancelled).toBe(false);

    // The original entry must still be pending on disk.
    const still = await Wakeup.read(entry.id);
    expect(still?.status).toBe('pending');
  });

  it('bulk-cancels every pending wakeup for a session when wakeupID is omitted', async () => {
    const { Wakeup } = await import('../index.js');
    await Wakeup.schedule({ sessionID: 'sess-X', when: '1h', reason: 'one' });
    await Wakeup.schedule({ sessionID: 'sess-X', when: '2h', reason: 'two' });
    await Wakeup.schedule({ sessionID: 'sess-Y', when: '1h', reason: 'other' });

    const result = await Wakeup.cancel({
      sessionID: 'sess-X',
      reason: 'session-delete',
    });
    expect(result.cancelled).toBe(true);
    expect(result.cancelledCount).toBe(2);

    // The unrelated session's wakeup is untouched.
    const yEntries = await Wakeup.list('sess-Y');
    expect(yEntries.every((e) => e.status === 'pending')).toBe(true);
  });
});
