/**
 * Tests for the "Proceed While Running" detach flow of the bash tool
 * (issue #1017). Ported from cline/cline#12320.
 *
 * These tests target `src/tool/tools/bash.ts` directly — NOT the aliased
 * shellTool — because the issue explicitly names bash.ts. The detach
 * helpers are also exercised via the shell tool's tests indirectly since
 * both tools import the same `bash-detach.ts` module.
 */

import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import { bashTool } from '../../../src/tool/tools/bash.js';
import {
  BashDetachAvailable,
  BashDetachedExited,
  DETACH_OUTPUT_LINE_CAP,
  _resetDetachStateForTests,
  capOutputLines,
  getDetachedProcesses,
  resolveDetachDecision,
  waitForDetachedExit,
} from '../../../src/tool/tools/bash-detach.js';
import {
  _resetDetectShellCacheForTests,
  _setFsProbeForTests,
} from '../../../src/tool/tools/shell/id.js';
import type { ToolContext } from '../../../src/tool/index.js';

const isWindows = process.platform === 'win32';

/**
 * Cline's default detach threshold is 5s; keeping tests below the real
 * threshold speeds them up. All tests that arm the timer use
 * `vi.useFakeTimers()` so the 5s never actually elapses in wall time.
 */
const REAL_DETACH_MS = 5000;

async function flushPromises(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
}

describe.skipIf(isWindows)('bash tool - shell type reporting', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
    sessionId: 'shell-type-test-session',
  };

  const originalShell = process.env.SHELL;

  afterEach(() => {
    if (originalShell === undefined) {
      delete process.env.SHELL;
    } else {
      process.env.SHELL = originalShell;
    }
    _resetDetectShellCacheForTests();
    _setFsProbeForTests(undefined);
  });

  it('reports the detected shell type in the result', async () => {
    process.env.SHELL = '/bin/bash';
    _resetDetectShellCacheForTests();
    _setFsProbeForTests((p: string) => p === '/bin/bash');
    const result = await bashTool.executeUnsafe({ command: 'echo hi' }, context);
    expect(result.success).toBe(true);
    expect(result.data?.shellType).toBe('bash');
  });

  it('detects zsh when SHELL points at zsh', async () => {
    process.env.SHELL = '/bin/zsh';
    _resetDetectShellCacheForTests();
    _setFsProbeForTests((p: string) => p === '/bin/zsh');
    const result = await bashTool.executeUnsafe({ command: 'echo hi' }, context);
    // The fake shell path won't actually spawn on CI runners; we only
    // care that the detector picked it and reported the type.
    expect(result.data?.shellType).toBe('zsh');
  });

  it('falls back to unknown for unrecognised shells', async () => {
    process.env.SHELL = '/opt/weird/mystery';
    _resetDetectShellCacheForTests();
    // Probe finds only the mystery shell; detector will accept the
    // envShell candidate and infer its type from the basename.
    _setFsProbeForTests((p: string) => p === '/opt/weird/mystery');
    const result = await bashTool.executeUnsafe({ command: 'echo hi' }, context);
    expect(result.data?.shellType).toBe('unknown');
  });
});

describe('bash-detach helpers', () => {
  afterEach(() => {
    _resetDetachStateForTests();
  });

  describe('capOutputLines', () => {
    it('returns the input unchanged when under the cap', () => {
      const short = 'line1\nline2\nline3';
      expect(capOutputLines(short, 10)).toBe(short);
    });

    it('caps output at the configured line count and appends a marker', () => {
      const lines = Array.from({ length: 500 }, (_, i) => `line-${i + 1}`).join('\n');
      const capped = capOutputLines(lines, 200);
      const cappedLines = capped.split('\n');
      // 199 kept + 1 marker = 200
      expect(cappedLines).toHaveLength(200);
      expect(cappedLines[0]).toBe('line-1');
      expect(cappedLines[198]).toBe('line-199');
      expect(cappedLines[199]).toMatch(/^\[\.\.\. \d+ lines omitted after detach \.\.\.\]$/);
    });

    it('uses DETACH_OUTPUT_LINE_CAP (200) as the default', () => {
      const lines = Array.from({ length: 300 }, () => 'x').join('\n');
      const capped = capOutputLines(lines);
      // Not > 200 lines
      expect(capped.split('\n').length).toBeLessThanOrEqual(DETACH_OUTPUT_LINE_CAP);
    });
  });

  describe('waitForDetachedExit', () => {
    it('resolves immediately when no processes are registered', async () => {
      const ok = await waitForDetachedExit('none', 1000);
      expect(ok).toBe(true);
    });
  });
});

// Detach behaviour is only meaningfully testable on POSIX because it
// relies on `process.kill(-pid, ...)` group semantics.
describe.skipIf(isWindows)('bash tool - Proceed While Running', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
    sessionId: 'detach-test-session',
  };

  beforeEach(() => {
    _resetDetachStateForTests();
    process.env.BASH_INTERACTIVE = '1';
  });

  afterEach(async () => {
    _resetDetachStateForTests();
    delete process.env.BASH_INTERACTIVE;
    vi.useRealTimers();
    // Small breather so any lingering child processes have finished
    // exiting (their SIGTERM path is asynchronous).
    await new Promise((r) => setTimeout(r, 50));
  });

  it('does NOT arm the detach timer when BASH_INTERACTIVE is unset', async () => {
    delete process.env.BASH_INTERACTIVE;

    const events: unknown[] = [];
    const unsub = BashDetachAvailable.subscribe((e) => events.push(e));
    try {
      const result = await bashTool.executeUnsafe({ command: 'echo hi' }, context);
      expect(result.success).toBe(true);
      expect(result.data?.detached).toBeFalsy();
      expect(events).toHaveLength(0);
    } finally {
      unsub();
    }
  });

  it('emits BashDetachAvailable after the detach threshold and freezes output on "proceed"', async () => {
    const seen: Array<{ id: string; command: string }> = [];
    const unsubAvail = BashDetachAvailable.subscribe(({ id, command }) => {
      seen.push({ id, command });
    });
    const exitEvents: Array<{ id: string; exitCode: number | null }> = [];
    const unsubExited = BashDetachedExited.subscribe(({ id, exitCode }) =>
      exitEvents.push({ id, exitCode })
    );

    // sleep 6s so the 5s detach threshold fires before the command exits.
    const promise = bashTool.executeUnsafe({ command: 'sleep 6' }, context);

    // Poll for the detach prompt (real timer path — the 5s is
    // hard-coded inside bash.ts so we cannot fake it without also
    // faking spawn).
    const deadline = Date.now() + REAL_DETACH_MS + 2000;
    while (seen.length === 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(seen.length).toBe(1);
    const { id } = seen[0];

    // Simulate the TUI user picking "Proceed".
    resolveDetachDecision(id, 'proceed');

    const result = await promise;

    expect(result.success).toBe(true);
    expect(result.data?.detached).toBe(true);
    expect(result.data?.detachId).toBe(id);
    expect(result.data?.exitCode).toBe(-1);
    expect(result.hint).toContain('detached');
    // Output must be capped at DETACH_OUTPUT_LINE_CAP lines.
    const outLines = (result.data?.stdout ?? '').split('\n');
    expect(outLines.length).toBeLessThanOrEqual(DETACH_OUTPUT_LINE_CAP);

    // Detached-process metadata must be present until the child exits.
    expect(getDetachedProcesses('detach-test-session').length).toBe(1);

    // Wait for the sleep to finish so the registry drains.
    const drained = await waitForDetachedExit('detach-test-session', 10000);
    expect(drained).toBe(true);
    expect(getDetachedProcesses('detach-test-session').length).toBe(0);

    expect(exitEvents.length).toBe(1);
    expect(exitEvents[0].id).toBe(id);

    unsubAvail();
    unsubExited();
  }, 30000);

  it('next bash invocation waits for a previously-detached command before spawning', async () => {
    // Command outlives the 5s detach threshold with ~2s to spare so we
    // can prove the second call blocks on it.
    const first = bashTool.executeUnsafe({ command: 'sleep 7' }, context);

    // Wait for the detach prompt.
    const detachedId = await new Promise<string>((resolve) => {
      const unsub = BashDetachAvailable.subscribe(({ id }) => {
        unsub();
        resolve(id);
      });
    });
    resolveDetachDecision(detachedId, 'proceed');
    const firstResult = await first;
    expect(firstResult.data?.detached).toBe(true);
    expect(getDetachedProcesses('detach-test-session').length).toBe(1);

    // Kick off a second bash call; its `await` must block until the
    // detached sleep exits (~2s from now).
    const secondStart = Date.now();
    const second = await bashTool.executeUnsafe({ command: 'echo second' }, context);
    const secondElapsed = Date.now() - secondStart;

    expect(second.success).toBe(true);
    expect(second.data?.stdout.trim()).toBe('second');
    // Must have waited at least 500ms for the still-running detached
    // command; if the re-attach logic were absent this would be ~0.
    expect(secondElapsed).toBeGreaterThanOrEqual(500);
    expect(getDetachedProcesses('detach-test-session').length).toBe(0);
  }, 30000);

  it('falls back to normal wait when the user chooses "wait"', async () => {
    const seen: string[] = [];
    const unsub = BashDetachAvailable.subscribe(({ id }) => seen.push(id));

    const promise = bashTool.executeUnsafe({ command: 'sleep 6' }, context);

    // Wait for prompt.
    const deadline = Date.now() + REAL_DETACH_MS + 2000;
    while (seen.length === 0 && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(seen.length).toBe(1);
    resolveDetachDecision(seen[0], 'wait');

    const result = await promise;
    unsub();

    expect(result.data?.detached).toBeFalsy();
    expect(result.data?.exitCode).toBe(0);
    expect(getDetachedProcesses('detach-test-session').length).toBe(0);
  }, 30000);

  it('cancels the detach prompt if the command finishes before the user answers', async () => {
    const seen: string[] = [];
    const unsub = BashDetachAvailable.subscribe(({ id }) => seen.push(id));

    // Command well under the 5s threshold — the detach timer should
    // fire cleanly on the internal cancel path, not on the outer
    // process exit.
    const result = await bashTool.executeUnsafe({ command: 'echo fast' }, context);
    unsub();

    expect(result.success).toBe(true);
    expect(result.data?.stdout.trim()).toBe('fast');
    expect(seen).toHaveLength(0);
    await flushPromises();
    expect(getDetachedProcesses('detach-test-session').length).toBe(0);
  }, 15000);
});
