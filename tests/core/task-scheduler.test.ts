/**
 * Tests for the durable task scheduler (`src/core/task-scheduler.ts`).
 *
 * The scheduler is exercised by constructing a fresh `TaskScheduler`
 * instance per test, pointed at a tmpdir-backed tasks.json so state does
 * not leak. Fake timers drive the periodic sweep deterministically.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

import { TaskScheduler, parseSchedule, type ScheduledTask } from '../../src/core/task-scheduler.js';

const WORKSPACE = 'test-workspace';

function makeTask(overrides: Partial<ScheduledTask> = {}): ScheduledTask {
  return {
    id: overrides.id ?? 'task-1',
    content: overrides.content ?? 'Run tests',
    status: overrides.status ?? 'pending',
    priority: overrides.priority ?? 'high',
    schedule: overrides.schedule ?? 'in 5 minutes',
    workspaceId: overrides.workspaceId ?? WORKSPACE,
    nextRun: overrides.nextRun ?? 0,
    approved: overrides.approved ?? true,
    ...overrides,
  };
}

describe('parseSchedule', () => {
  const now = new Date('2026-01-15T12:00:00Z').getTime();

  it('parses "in N minutes"', () => {
    expect(parseSchedule('in 5 minutes', now)).toBe(now + 5 * 60_000);
    expect(parseSchedule('in 1 minute', now)).toBe(now + 60_000);
  });

  it('parses "in N hours"', () => {
    expect(parseSchedule('in 2 hours', now)).toBe(now + 2 * 60 * 60_000);
    expect(parseSchedule('in 1 hour', now)).toBe(now + 60 * 60_000);
  });

  it('parses "tomorrow at HH[:MM] [am|pm]"', () => {
    const result = parseSchedule('tomorrow at 9am', now);
    expect(result).toBeGreaterThan(now);
    // Should be within ~48 hours of now
    expect(result).toBeLessThan(now + 48 * 60 * 60_000);
  });

  it('parses "daily at HH[:MM] [am|pm]" as next occurrence', () => {
    const result = parseSchedule('daily at 9am', now);
    expect(result).toBeGreaterThan(now);
    // Should be within 24 hours
    expect(result).toBeLessThanOrEqual(now + 24 * 60 * 60_000);
  });

  it('rolls "daily" past today to tomorrow if time already elapsed', () => {
    // now = noon UTC; asking for "daily at 8am" should land tomorrow.
    const result = parseSchedule('daily at 8am', now);
    expect(result).toBeGreaterThan(now);
  });

  it('throws for unsupported formats', () => {
    expect(() => parseSchedule('sometime soon', now)).toThrow('Unsupported schedule format');
  });
});

describe('TaskScheduler', () => {
  let tmpDir: string;
  let tasksFile: string;
  let scheduler: TaskScheduler;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-scheduler-test-'));
    tasksFile = path.join(tmpDir, 'tasks.json');
    scheduler = new TaskScheduler({ tasksFile, checkIntervalMs: 60_000 });
  });

  afterEach(() => {
    scheduler.stop();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.useRealTimers();
  });

  it('schedules a task "in 5 minutes"', () => {
    scheduler.registerWorkspace(WORKSPACE);
    const before = Date.now();

    scheduler.scheduleTask(makeTask({ schedule: 'in 5 minutes' }));

    const tasks = scheduler.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].nextRun).toBeGreaterThanOrEqual(before + 5 * 60_000 - 100);
    expect(tasks[0].nextRun).toBeLessThanOrEqual(before + 5 * 60_000 + 5_000);
  });

  it('prevents cross-workspace execution', () => {
    expect(() =>
      scheduler.scheduleTask(makeTask({ workspaceId: 'unregistered-workspace' }))
    ).toThrow(/not registered/);
  });

  it('persists tasks to tasks.json and reloads them', () => {
    scheduler.registerWorkspace(WORKSPACE);
    scheduler.scheduleTask(makeTask({ id: 'persist-1' }));

    expect(fs.existsSync(tasksFile)).toBe(true);

    const reloaded = new TaskScheduler({ tasksFile });
    reloaded.load();
    const tasks = reloaded.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe('persist-1');
  });

  it('executes a due task after approval', async () => {
    const executor = vi.fn().mockResolvedValue(undefined);
    let clock = Date.now();
    scheduler = new TaskScheduler({
      tasksFile,
      checkIntervalMs: 60_000,
      executor,
      now: () => clock,
    });
    scheduler.registerWorkspace(WORKSPACE);
    await scheduler.requestTaskApproval(WORKSPACE);

    scheduler.scheduleTask(makeTask({ id: 'due-1', schedule: 'in 1 minute' }));

    // Fast-forward the injected clock past the due time.
    clock += 2 * 60_000;
    await scheduler.checkDueTasks();

    expect(executor).toHaveBeenCalledTimes(1);
    const [taskArg] = executor.mock.calls[0];
    expect(taskArg.id).toBe('due-1');

    const tasks = scheduler.getTasks();
    expect(tasks[0].status).toBe('completed');
    expect(tasks[0].lastRun).toBeDefined();
  });

  it('blocks execution when the workspace has not been approved', async () => {
    const executor = vi.fn();
    let clock = Date.now();
    scheduler = new TaskScheduler({
      tasksFile,
      checkIntervalMs: 60_000,
      executor,
      now: () => clock,
    });
    scheduler.registerWorkspace(WORKSPACE);
    // NOTE: no requestTaskApproval() call — the task should stay pending.

    scheduler.scheduleTask(makeTask({ id: 'no-approval', schedule: 'in 1 minute' }));

    clock += 2 * 60_000;
    await scheduler.checkDueTasks();

    expect(executor).not.toHaveBeenCalled();
    const tasks = scheduler.getTasks();
    expect(tasks[0].status).toBe('pending');
  });

  it('reschedules recurring "daily" tasks for the next occurrence', async () => {
    const executor = vi.fn().mockResolvedValue(undefined);
    let clock = new Date('2026-01-15T12:00:00Z').getTime();
    scheduler = new TaskScheduler({
      tasksFile,
      checkIntervalMs: 60_000,
      executor,
      now: () => clock,
    });
    scheduler.registerWorkspace(WORKSPACE);
    await scheduler.requestTaskApproval(WORKSPACE);

    scheduler.scheduleTask(makeTask({ id: 'daily-1', schedule: 'daily at 8am' }));

    // The initial nextRun is already scheduled for tomorrow 8am. Advance
    // beyond it so the sweep fires, then verify it re-armed instead of
    // completing.
    const firstNextRun = scheduler.getTasks()[0].nextRun;
    clock = firstNextRun + 60_000;
    await scheduler.checkDueTasks();

    expect(executor).toHaveBeenCalledTimes(1);
    const tasks = scheduler.getTasks();
    expect(tasks[0].status).toBe('pending');
    expect(tasks[0].nextRun).toBeGreaterThan(firstNextRun);
    expect(tasks[0].lastRun).toBeDefined();
  });

  it('resets a task to pending when the executor throws', async () => {
    const executor = vi.fn().mockRejectedValue(new Error('boom'));
    let clock = Date.now();
    scheduler = new TaskScheduler({
      tasksFile,
      checkIntervalMs: 60_000,
      executor,
      now: () => clock,
    });
    scheduler.registerWorkspace(WORKSPACE);
    await scheduler.requestTaskApproval(WORKSPACE);

    scheduler.scheduleTask(makeTask({ id: 'fail-1', schedule: 'in 1 minute' }));

    clock += 2 * 60_000;
    await scheduler.checkDueTasks();

    expect(executor).toHaveBeenCalledTimes(1);
    const tasks = scheduler.getTasks();
    expect(tasks[0].status).toBe('pending');
    expect(tasks[0].lastRun).toBeUndefined();
  });

  it('start() is idempotent and stop() clears the interval', () => {
    vi.useFakeTimers();
    scheduler.start();
    scheduler.start(); // second call is a no-op
    scheduler.stop();
    scheduler.stop(); // safe to call twice
    // No assertion needed: absence of throw / hang is the contract.
  });

  it('requestTaskApproval returns false for unregistered workspace', async () => {
    const result = await scheduler.requestTaskApproval('never-registered');
    expect(result).toBe(false);
  });
});
