/**
 * Tests for background_process shutdown teardown (killAllTracked).
 *
 * Skipped on Windows — SIGTERM / SIGKILL semantics and `process.kill(pid, 0)`
 * behaviour differ enough there to warrant a separate implementation.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock the tool index module to bypass permission checks (mirror write.test.ts pattern).
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: {
      name: string;
      description: string;
      execute: (...args: unknown[]) => unknown;
    }) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import {
  backgroundProcessTool,
  killAllTracked,
  listBackgroundProcesses,
} from '../../../src/tool/tools/background-process.js';
import type { ToolContext } from '../../../src/tool/index.js';

const isWindows = process.platform === 'win32';

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForDead(pid: number, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isAlive(pid)) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  return !isAlive(pid);
}

describe('killAllTracked', () => {
  it.skipIf(isWindows)('terminates every tracked child within 2s', async () => {
    const context: ToolContext = {
      workdir: process.cwd(),
      sessionId: 'test-session',
    };

    // Ensure a clean starting state — other suites may have left entries around.
    await killAllTracked();

    const result = await backgroundProcessTool.execute({ command: 'sleep 30' }, context);

    expect(result.success).toBe(true);
    const pid = result.data?.pid;
    expect(typeof pid).toBe('number');
    expect(pid).toBeGreaterThan(0);

    // Confirm the process is actually alive before we tear it down.
    expect(isAlive(pid as number)).toBe(true);
    expect(listBackgroundProcesses().length).toBe(1);

    const killResults = await killAllTracked();

    expect(listBackgroundProcesses().length).toBe(0);
    expect(killResults.length).toBe(1);
    expect(killResults[0].pid).toBe(pid);

    // sleep is trivially killable, so SIGTERM (or the SIGKILL fallback) must
    // have taken it out within the escalation window plus a small buffer.
    const dead = await waitForDead(pid as number, 2000);
    expect(dead).toBe(true);
  });

  it('is a no-op when there are no tracked processes', async () => {
    // Drain anything a prior test may have left behind first.
    await killAllTracked();
    const results = await killAllTracked();
    expect(results).toEqual([]);
    expect(listBackgroundProcesses().length).toBe(0);
  });
});
