/**
 * Tests for the `/cost today` slash command's new `By Model:` block.
 *
 * Issue #868: when auto-routing is on, today's usage should surface the
 * per-routed-model breakdown (not only the aggregate totals), so users can
 * see WHICH route is burning their budget.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import { handleCommand, type ReplState } from '../../src/cli/interactive.js';
import { SessionManager } from '../../src/core/sessionManager.js';
import { resetCostTracker } from '../../src/core/costTracker.js';

// We override `getCostTracker()` so the REPL's `/cost today` handler reads
// from a CostTracker instance pointed at a per-test temp directory. This
// keeps the test hermetic — no writes to the real `~/.alexi/cost-data.json`.
vi.mock('../../src/core/costTracker.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/core/costTracker.js')>(
    '../../src/core/costTracker.js'
  );
  const nodeOs = await import('os');
  const nodePath = await import('path');
  let testTracker: InstanceType<typeof actual.CostTracker> | null = null;
  return {
    ...actual,
    getCostTracker: (): InstanceType<typeof actual.CostTracker> => {
      if (testTracker === null) {
        testTracker = new actual.CostTracker({
          dataDir: nodePath.join(nodeOs.tmpdir(), `alexi-cost-${Date.now()}-${Math.random()}`),
        });
      }
      return testTracker;
    },
    __resetTestTracker: (): void => {
      testTracker = null;
    },
  };
});

async function loadResetTestTracker(): Promise<void> {
  const mod = (await import('../../src/core/costTracker.js')) as unknown as {
    __resetTestTracker?: () => void;
  };
  mod.__resetTestTracker?.();
}

function buildReplState(sessionsDir: string): ReplState {
  const sessionManager = new SessionManager({ sessionsDir });
  sessionManager.createSession('gpt-4o');
  return {
    sessionManager,
    currentModel: 'gpt-4o',
    autoRoute: true,
    preferCheap: false,
    isStreaming: false,
  };
}

describe('/cost today renders per-routed-model breakdown', () => {
  let tmpDir: string;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let logs: string[];

  beforeEach(async () => {
    resetCostTracker();
    await loadResetTestTracker();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-itest-'));
    logs = [];
    logSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
      logs.push(args.map((a) => String(a)).join(' '));
    });
  });

  afterEach(async () => {
    logSpy.mockRestore();
    resetCostTracker();
    await loadResetTestTracker();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('prints a By Model: block with each routed model after the totals', async () => {
    // Record two calls under different routed model ids.
    const { getCostTracker } = await import('../../src/core/costTracker.js');
    const tracker = getCostTracker();
    tracker.recordUsage('gpt-4o', 1000, 500, 'session-a');
    tracker.recordUsage('anthropic--claude-4.5-sonnet', 2000, 800, 'session-a');

    const state = buildReplState(tmpDir);
    const handled = await handleCommand('/cost today', state);

    expect(handled).toBe(true);
    const out = logs.join('\n');
    expect(out).toContain("Today's API Costs");
    expect(out).toContain('By Model:');
    expect(out).toContain('gpt-4o');
    expect(out).toContain('anthropic--claude-4.5-sonnet');
  });

  it('omits the By Model: block when no calls have been recorded today', async () => {
    const state = buildReplState(tmpDir);
    const handled = await handleCommand('/cost today', state);

    expect(handled).toBe(true);
    const out = logs.join('\n');
    expect(out).toContain("Today's API Costs");
    expect(out).toContain('No API calls recorded today');
    expect(out).not.toContain('By Model:');
  });
});
