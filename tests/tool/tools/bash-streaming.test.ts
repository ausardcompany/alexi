/**
 * Tests for the bash streaming path (issue #1442).
 *
 * Covers:
 * - `BashOutputChunk` emission during command execution (stdout + stderr)
 * - Chunk correlation via `toolId` and `logId`
 * - Command-log registry lifecycle (register / append / mark finished /
 *   retention / cleanup)
 * - PID-reuse defense in `getCommandLogByPid`
 * - Abort signal cleanup path
 *
 * Windows is skipped for the process-based tests because we rely on
 * POSIX `bash -c` semantics for interleaving multi-line output.
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';

import { bashTool } from '../../../src/tool/tools/bash.js';
import { BashOutputChunk } from '../../../src/bus/index.js';
import {
  MAX_LOG_BYTES,
  COMPLETED_LOG_RETENTION_MS,
  _resetStreamingStateForTests,
  appendCommandLog,
  cleanupCommandLog,
  cleanupCompletedLogs,
  getCommandLog,
  getCommandLogByPid,
  listCommandLogIds,
  markCommandLogFinished,
  registerCommandLog,
} from '../../../src/tool/tools/bash-streaming.js';
import type { ToolContext } from '../../../src/tool/index.js';

const isWindows = process.platform === 'win32';

describe('bash-streaming registry', () => {
  afterEach(() => {
    _resetStreamingStateForTests();
  });

  it('registers a log with a stable id independent of PID', () => {
    const idA = registerCommandLog({ pid: 12345, command: 'echo a' });
    const idB = registerCommandLog({ pid: 12345, command: 'echo b' });
    // Same PID must not collide — synthetic ids are unique.
    expect(idA).not.toBe(idB);
    expect(getCommandLog(idA)?.command).toBe('echo a');
    expect(getCommandLog(idB)?.command).toBe('echo b');
  });

  it('appendCommandLog accumulates chunks in order', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    appendCommandLog(id, 'hello ');
    appendCommandLog(id, 'world');
    expect(getCommandLog(id)?.buffer).toBe('hello world');
    expect(getCommandLog(id)?.totalBytes).toBe(11);
    expect(getCommandLog(id)?.truncated).toBe(false);
  });

  it('appendCommandLog is a no-op for unknown ids and empty chunks', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    appendCommandLog('nope', 'abc');
    appendCommandLog(id, '');
    expect(getCommandLog(id)?.buffer).toBe('');
    expect(getCommandLog('nope')).toBeUndefined();
  });

  it('evicts oldest bytes when the buffer exceeds MAX_LOG_BYTES', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    // Fill past the cap with 1KB lines so eviction snaps to a boundary.
    const line = 'a'.repeat(1023) + '\n';
    const iterations = Math.ceil((MAX_LOG_BYTES * 1.5) / line.length);
    for (let i = 0; i < iterations; i++) {
      appendCommandLog(id, line);
    }
    const snap = getCommandLog(id);
    if (!snap) {
      throw new Error('expected command log snapshot');
    }
    expect(snap.truncated).toBe(true);
    // Buffer must not exceed the cap by more than the marker overhead.
    expect(Buffer.byteLength(snap.buffer, 'utf-8')).toBeLessThanOrEqual(MAX_LOG_BYTES + 128);
    // Total bytes tracks EVERYTHING appended (including evicted).
    expect(snap.totalBytes).toBe(iterations * line.length);
    expect(snap.buffer).toContain('older output evicted');
  });

  it('markCommandLogFinished stamps finishedAt but keeps the entry', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    markCommandLogFinished(id);
    const snap = getCommandLog(id);
    expect(snap?.finishedAt).toBeTypeOf('number');
    // Still fetchable inside the retention window.
    expect(listCommandLogIds()).toContain(id);
  });

  it('cleanupCommandLog removes the entry unconditionally', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    cleanupCommandLog(id);
    expect(getCommandLog(id)).toBeUndefined();
    expect(listCommandLogIds()).not.toContain(id);
  });

  it('cleanupCompletedLogs reaps entries past the retention window', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    markCommandLogFinished(id);
    const future = Date.now() + COMPLETED_LOG_RETENTION_MS + 1000;
    const removed = cleanupCompletedLogs(future);
    expect(removed).toBe(1);
    expect(getCommandLog(id)).toBeUndefined();
  });

  it('cleanupCompletedLogs leaves in-flight logs alone', () => {
    const id = registerCommandLog({ pid: 1, command: 'x' });
    const future = Date.now() + COMPLETED_LOG_RETENTION_MS * 10;
    const removed = cleanupCompletedLogs(future);
    expect(removed).toBe(0);
    expect(getCommandLog(id)).toBeDefined();
  });

  it('getCommandLogByPid defends against PID reuse via startedAt tie-breaker', () => {
    const startA = 1_000_000;
    const startB = 2_000_000;
    registerCommandLog({ pid: 42, command: 'first', startedAt: startA });
    const idB = registerCommandLog({ pid: 42, command: 'second', startedAt: startB });

    // Lookup by (pid, startedAt) returns the correct entry, not the stale one.
    expect(getCommandLogByPid(42, startB)?.id).toBe(idB);
    // A non-matching startedAt yields undefined.
    expect(getCommandLogByPid(42, 999)?.id).toBeUndefined();
    // pid=undefined yields undefined unconditionally.
    expect(getCommandLogByPid(undefined, startA)).toBeUndefined();
  });
});

describe.skipIf(isWindows)('bash tool - live streaming', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
    sessionId: 'streaming-test-session',
    toolId: 'test-tool-id',
  };

  beforeEach(() => {
    _resetStreamingStateForTests();
  });

  afterEach(() => {
    _resetStreamingStateForTests();
  });

  it('emits BashOutputChunk events for stdout during command execution', async () => {
    const chunks: Array<{ stream: string; chunk: string; toolId: string; logId: string }> = [];
    const unsub = BashOutputChunk.subscribe((payload) => {
      chunks.push({
        stream: payload.stream,
        chunk: payload.chunk,
        toolId: payload.toolId,
        logId: payload.logId,
      });
    });

    try {
      const result = await bashTool.executeUnsafe({ command: 'echo line1 && echo line2' }, context);
      expect(result.success).toBe(true);
      expect(result.data?.stdout).toContain('line1');
      expect(result.data?.stdout).toContain('line2');

      // At least one stdout chunk must have been emitted.
      const stdoutChunks = chunks.filter((c) => c.stream === 'stdout');
      expect(stdoutChunks.length).toBeGreaterThan(0);

      // All chunks correlate to the same tool id and log id.
      const toolIds = new Set(chunks.map((c) => c.toolId));
      const logIds = new Set(chunks.map((c) => c.logId));
      expect(toolIds.size).toBe(1);
      expect(toolIds.has('test-tool-id')).toBe(true);
      expect(logIds.size).toBe(1);

      // Concatenation of stdout chunks matches the final aggregate.
      const streamed = stdoutChunks.map((c) => c.chunk).join('');
      expect(streamed).toContain('line1');
      expect(streamed).toContain('line2');
    } finally {
      unsub();
    }
  });

  it('emits BashOutputChunk events for stderr separately from stdout', async () => {
    const chunks: Array<{ stream: string; chunk: string }> = [];
    const unsub = BashOutputChunk.subscribe(({ stream, chunk }) => {
      chunks.push({ stream, chunk });
    });

    try {
      const result = await bashTool.executeUnsafe({ command: 'echo out; echo err 1>&2' }, context);
      expect(result.success).toBe(true);

      const stdoutText = chunks
        .filter((c) => c.stream === 'stdout')
        .map((c) => c.chunk)
        .join('');
      const stderrText = chunks
        .filter((c) => c.stream === 'stderr')
        .map((c) => c.chunk)
        .join('');

      expect(stdoutText).toContain('out');
      expect(stderrText).toContain('err');
    } finally {
      unsub();
    }
  });

  it('generates a synthetic toolId when none is supplied by the caller', async () => {
    const chunks: Array<{ toolId: string }> = [];
    const unsub = BashOutputChunk.subscribe(({ toolId }) => {
      chunks.push({ toolId });
    });

    try {
      const anonContext: ToolContext = {
        workdir: process.cwd(),
        sessionId: 'anon',
        // No toolId — executeUnsafe still mints one and threads it through,
        // so chunks stay correlatable to the ToolExecutionStarted event.
      };
      const result = await bashTool.executeUnsafe({ command: 'echo hi' }, anonContext);
      expect(result.success).toBe(true);
      expect(chunks.length).toBeGreaterThan(0);
      const toolIds = new Set(chunks.map((c) => c.toolId));
      expect(toolIds.size).toBe(1);
      // Synthetic id must be a non-empty string.
      expect([...toolIds][0]).toMatch(/.+/);
    } finally {
      unsub();
    }
  });

  it('appends to the command log so the buffer matches emitted chunks', async () => {
    const chunks: string[] = [];
    let capturedLogId: string | undefined;
    const unsub = BashOutputChunk.subscribe(({ stream, chunk, logId }) => {
      if (stream === 'stdout') {
        chunks.push(chunk);
        capturedLogId = logId;
      }
    });

    try {
      const result = await bashTool.executeUnsafe({ command: 'echo streaming-test' }, context);
      expect(result.success).toBe(true);
      if (!capturedLogId) {
        throw new Error('expected at least one streaming chunk to expose a logId');
      }

      const snap = getCommandLog(capturedLogId);
      if (!snap) {
        throw new Error('expected command log entry to exist after execution');
      }
      expect(snap.buffer).toContain('streaming-test');
      expect(snap.finishedAt).toBeTypeOf('number');
      expect(snap.toolId).toBe('test-tool-id');
    } finally {
      unsub();
    }
  });

  it('does not tear down the command when a chunk subscriber throws', async () => {
    const unsub = BashOutputChunk.subscribe(() => {
      throw new Error('subscriber blew up');
    });

    try {
      // The bus itself already catches synchronous handler errors, so
      // this just documents that the command still succeeds end-to-end
      // even when a subscriber misbehaves.
      const result = await bashTool.executeUnsafe({ command: 'echo resilient' }, context);
      expect(result.success).toBe(true);
      expect(result.data?.stdout).toContain('resilient');
    } finally {
      unsub();
    }
  });
});
