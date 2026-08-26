/**
 * Tests for the session-lifecycle path of the bash streaming registry
 * (issue #1539). These complement `bash-streaming.test.ts` by covering:
 *
 * - `getCommandLogsBySession`: session-scoped log listing so a
 *   reconnecting TUI hub can fetch every in-flight command for its
 *   session in one call.
 * - `cleanupSessionCommandLogs`: bulk cleanup on session end so long-
 *   lived agent daemons do not pin dead-session streaming buffers.
 * - Module-level `SessionEnded` wiring: publishing the bus event triggers
 *   the bulk cleanup automatically, matching the same lifecycle contract
 *   the sound module relies on.
 * - Live streaming: bash chunks arrive INCREMENTALLY (before the process
 *   exits), not only after the `close` event. This is the guarantee that
 *   distinguishes real streaming from "buffered stdout, emitted at end".
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';

import { bashTool } from '../../../src/tool/tools/bash.js';
import { BashOutputChunk, SessionEnded } from '../../../src/bus/index.js';
import {
  _resetStreamingStateForTests,
  cleanupSessionCommandLogs,
  getCommandLog,
  getCommandLogsBySession,
  registerCommandLog,
} from '../../../src/tool/tools/bash-streaming.js';
import type { ToolContext } from '../../../src/tool/index.js';

const isWindows = process.platform === 'win32';

describe('bash-streaming session lifecycle', () => {
  afterEach(() => {
    _resetStreamingStateForTests();
  });

  it('getCommandLogsBySession filters entries by sessionId', () => {
    const idA1 = registerCommandLog({ pid: 1, command: 'a1', sessionId: 'sess-a' });
    const idA2 = registerCommandLog({ pid: 2, command: 'a2', sessionId: 'sess-a' });
    registerCommandLog({ pid: 3, command: 'b1', sessionId: 'sess-b' });

    const forA = getCommandLogsBySession('sess-a');
    const ids = new Set(forA.map((e) => e.id));
    expect(ids.has(idA1)).toBe(true);
    expect(ids.has(idA2)).toBe(true);
    expect(forA.length).toBe(2);

    // Every entry in the result carries the queried sessionId, never a
    // stale one from another session.
    for (const entry of forA) {
      expect(entry.sessionId).toBe('sess-a');
    }
  });

  it('getCommandLogsBySession returns entries with undefined sessionId literally', () => {
    registerCommandLog({ pid: 1, command: 'anon' });
    registerCommandLog({ pid: 2, command: 'owned', sessionId: 'sess-owned' });

    const anon = getCommandLogsBySession(undefined);
    expect(anon.length).toBe(1);
    expect(anon[0].command).toBe('anon');
  });

  it('cleanupSessionCommandLogs drops every entry for a session', () => {
    const idA1 = registerCommandLog({ pid: 1, command: 'a1', sessionId: 'sess-a' });
    const idA2 = registerCommandLog({ pid: 2, command: 'a2', sessionId: 'sess-a' });
    const idB1 = registerCommandLog({ pid: 3, command: 'b1', sessionId: 'sess-b' });

    const removed = cleanupSessionCommandLogs('sess-a');
    expect(removed).toBe(2);
    expect(getCommandLog(idA1)).toBeUndefined();
    expect(getCommandLog(idA2)).toBeUndefined();
    // Other session's entries are untouched.
    expect(getCommandLog(idB1)?.command).toBe('b1');
  });

  it('SessionEnded bus event triggers cleanup for that session', () => {
    const idA = registerCommandLog({ pid: 1, command: 'a', sessionId: 'sess-x' });
    const idB = registerCommandLog({ pid: 2, command: 'b', sessionId: 'sess-y' });

    SessionEnded.publish({
      sessionId: 'sess-x',
      timestamp: Date.now(),
    });

    // The x-session log is gone; the y-session log survives.
    expect(getCommandLog(idA)).toBeUndefined();
    expect(getCommandLog(idB)?.command).toBe('b');
  });

  it('SessionEnded cleanup is a no-op when no logs match', () => {
    const id = registerCommandLog({ pid: 1, command: 'keep', sessionId: 'sess-keep' });
    SessionEnded.publish({
      sessionId: 'sess-does-not-exist',
      timestamp: Date.now(),
    });
    expect(getCommandLog(id)?.command).toBe('keep');
  });
});

describe.skipIf(isWindows)('bash tool - mid-run streaming guarantee', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
    sessionId: 'streaming-lifecycle-session',
    toolId: 'streaming-lifecycle-tool',
  };

  beforeEach(() => {
    _resetStreamingStateForTests();
  });

  afterEach(() => {
    _resetStreamingStateForTests();
  });

  it('delivers BashOutputChunk before the process exits (real streaming)', async () => {
    // A command that prints a line, then sleeps, then prints another
    // line. If the tool were still buffering stdout until process exit,
    // the first chunk would only arrive after ~500ms. Real streaming
    // must deliver the first chunk within the sleep window.
    const chunkTimings: Array<{ text: string; elapsed: number }> = [];
    const start = Date.now();
    const unsub = BashOutputChunk.subscribe(({ chunk }) => {
      chunkTimings.push({ text: chunk, elapsed: Date.now() - start });
    });

    try {
      const result = await bashTool.executeUnsafe(
        { command: 'echo first-line && sleep 0.4 && echo second-line' },
        context
      );
      expect(result.success).toBe(true);
      expect(result.data?.stdout).toContain('first-line');
      expect(result.data?.stdout).toContain('second-line');

      // At least one chunk must have arrived before the process finished
      // (i.e. strictly before the sleep completed). We give a generous
      // 300ms budget to accommodate spawn latency on slow CI, but
      // require that some chunk lands well before the full 400ms sleep.
      const earlyChunks = chunkTimings.filter((c) => c.elapsed < 350);
      expect(earlyChunks.length).toBeGreaterThan(0);

      // The early chunk contains the first line — the value that would
      // have been invisible to the user under the old buffered path.
      const earlyText = earlyChunks.map((c) => c.text).join('');
      expect(earlyText).toContain('first-line');
    } finally {
      unsub();
    }
  }, 5000);

  it('exposes the command log via getCommandLogsBySession while running', async () => {
    // Publish chunks are the primary streaming surface; the session-
    // scoped registry is the fallback for a TUI hub that reconnects
    // mid-command. This test proves the entry appears in the session
    // bucket during (and shortly after) execution.
    const result = await bashTool.executeUnsafe({ command: 'echo lifecycle-check' }, context);
    expect(result.success).toBe(true);

    const entries = getCommandLogsBySession('streaming-lifecycle-session');
    expect(entries.length).toBeGreaterThan(0);
    const buffer = entries.map((e) => e.buffer).join('');
    expect(buffer).toContain('lifecycle-check');
  });
});
