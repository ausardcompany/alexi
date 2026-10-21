/**
 * Tests for the todowrite -> task scheduler promotion hook.
 *
 * These exercise the behaviour added by issue #2100: when `todowrite`
 * receives a todo carrying an optional `schedule` string, the tool
 * promotes it into a durable `ScheduledTask` on the process-wide task
 * scheduler. Todos without a `schedule` must NOT touch the scheduler.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

// Mock the tool index module to bypass permission checks, mirroring
// the pattern used by `tests/tool/tools/todowrite.test.ts`.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: unknown) => {
      const d = def as { execute: (...args: unknown[]) => unknown; name: string };
      return {
        ...d,
        execute: d.execute,
        executeUnsafe: d.execute,
        toFunctionSchema: () => ({
          name: d.name,
          description: '',
          parameters: {},
        }),
      };
    },
  };
});

import { todowriteTool, clearTodos } from '../../../src/tool/tools/todowrite.js';
import {
  getTaskScheduler,
  resetTaskScheduler,
  parseSchedule,
} from '../../../src/core/task-scheduler.js';
import type { ToolContext } from '../../../src/tool/index.js';

let tmpDir: string;
let tasksFile: string;

const context: ToolContext = {
  workdir: process.cwd(),
  sessionId: 'test-session',
};

beforeEach(() => {
  // Each test gets a fresh scheduler pointing at a tmpdir-backed
  // tasks.json so persisted state does not leak across tests.
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-todowrite-schedule-'));
  tasksFile = path.join(tmpDir, 'tasks.json');
  resetTaskScheduler();
  getTaskScheduler({ tasksFile, checkIntervalMs: 60_000 });
});

afterEach(() => {
  resetTaskScheduler();
  fs.rmSync(tmpDir, { recursive: true, force: true });
  clearTodos();
});

describe('todowrite -> scheduler promotion', () => {
  it('promotes a todo with "in 5 minutes" schedule to a one-shot task', async () => {
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Fix bug X',
            status: 'pending',
            priority: 'high',
            schedule: 'in 5 minutes',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);

    const scheduler = getTaskScheduler();
    const tasks = scheduler.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].content).toBe('Fix bug X');
    expect(tasks[0].schedule).toBe('in 5 minutes');
    // workspaceId auto-populated from the context's sessionId.
    expect(tasks[0].workspaceId).toBe('test-session');

    // nextRun ~5 minutes from now (allow slack for test overhead).
    const expected = parseSchedule('in 5 minutes', Date.now());
    expect(tasks[0].nextRun).toBeGreaterThanOrEqual(expected - 10_000);
    expect(tasks[0].nextRun).toBeLessThanOrEqual(expected + 10_000);
  });

  it('promotes a todo with "daily at 9am" schedule to a recurring task', async () => {
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Check logs',
            status: 'pending',
            priority: 'medium',
            schedule: 'daily at 9am',
            workspaceId: 'ws-explicit',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);

    const scheduler = getTaskScheduler();
    const tasks = scheduler.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].schedule).toBe('daily at 9am');
    // Explicit workspaceId from the todo is preserved; context fallback
    // is not applied when the agent already specified one.
    expect(tasks[0].workspaceId).toBe('ws-explicit');
    expect(tasks[0].nextRun).toBeGreaterThan(Date.now());
  });

  it('does NOT promote a todo without a schedule field', async () => {
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Regular todo',
            status: 'pending',
            priority: 'low',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(getTaskScheduler().getTasks()).toHaveLength(0);
  });

  it('still updates the todo list when promotion fails for an unsupported schedule', async () => {
    // "sometime soon" is not a supported parseSchedule format; the
    // promotion must fail gracefully without aborting the todowrite call.
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Vague task',
            status: 'pending',
            priority: 'medium',
            schedule: 'sometime soon',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.totalCount).toBe(1);
    // The scheduler must NOT contain a half-promoted task from a
    // parse failure.
    expect(getTaskScheduler().getTasks()).toHaveLength(0);
  });

  it('auto-populates workspaceId from workdir when no sessionId is present', async () => {
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Workdir-scoped scheduled task',
            status: 'pending',
            priority: 'high',
            schedule: 'in 1 hour',
          },
        ],
      },
      { workdir: '/tmp/workdir-only' }
    );

    expect(result.success).toBe(true);
    const tasks = getTaskScheduler().getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].workspaceId).toBe('/tmp/workdir-only');
  });
});
