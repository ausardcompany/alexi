/**
 * Integration test for the `schedule_wakeup` tool stamping
 * `SessionMetadata.scheduledWakeTime` (issue #1901).
 *
 * The wakeup module (`src/kilocode/wakeup/index.ts`) resolves
 * `~/.alexi/wakeups` from `os.homedir()` at import time, so we point
 * `os.homedir()` at a per-test tempdir and `vi.resetModules()` so the
 * dynamic import picks up the override — mirroring the pattern used by
 * `src/kilocode/wakeup/__tests__/instance-cancel.test.ts`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import fsp from 'fs/promises';
import os from 'os';
import path from 'path';

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

let sessionsDir: string;
let wakeupHome: string;

beforeEach(async () => {
  vi.clearAllMocks();
  sessionsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wake-tool-sessions-'));
  wakeupHome = await fsp.mkdtemp(path.join(os.tmpdir(), 'wake-tool-home-'));
  vi.spyOn(os, 'homedir').mockReturnValue(wakeupHome);
  vi.resetModules();
});

afterEach(async () => {
  vi.restoreAllMocks();
  fs.rmSync(sessionsDir, { recursive: true, force: true });
  await fsp.rm(wakeupHome, { recursive: true, force: true });
});

describe('schedule_wakeup tool populates scheduledWakeTime (issue #1901)', () => {
  it('stamps SessionMetadata.scheduledWakeTime after a successful schedule', async () => {
    const { SessionManager } = await import('../../src/core/sessionManager.js');
    const { scheduleWakeupTool } = await import('../../src/tool/tools/schedule-wakeup.js');
    type SessionShape = import('../../src/core/sessionManager.js').Session;

    const mgr = new SessionManager(sessionsDir);
    const session = mgr.createSession();

    const result = await scheduleWakeupTool.execute(
      { when: '1h', reason: 'test wake' },
      {
        workdir: process.cwd(),
        sessionId: session.metadata.id,
        sessionManager: mgr,
      }
    );

    expect(result.success).toBe(true);
    const wakeAt = Date.parse(result.data!.at);
    expect(Number.isFinite(wakeAt)).toBe(true);

    const sessionPath = path.join(sessionsDir, `${session.metadata.id}.json`);
    const onDisk = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as SessionShape;
    expect(onDisk.metadata.scheduledWakeTime).toBe(Math.floor(wakeAt));
  });

  it('does not fail when no sessionManager is provided (degrades gracefully)', async () => {
    const { scheduleWakeupTool } = await import('../../src/tool/tools/schedule-wakeup.js');
    const result = await scheduleWakeupTool.execute(
      { when: '2m', reason: 'standalone' },
      {
        workdir: process.cwd(),
        sessionId: 'standalone-session',
      }
    );

    expect(result.success).toBe(true);
    expect(result.data?.wakeupID).toBeDefined();
  });
});
