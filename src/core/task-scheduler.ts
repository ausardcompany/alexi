/**
 * Durable Task Scheduler
 *
 * Persistent, workspace-scoped task scheduling for the todowrite tool.
 * Supports natural-language schedules ("in 5 minutes", "tomorrow at 9am",
 * "daily at 9am") and executes due tasks via a periodic check loop.
 *
 * State is persisted to `~/.alexi/tasks.json` so scheduled tasks survive
 * process restarts. Cross-workspace execution is blocked via an explicit
 * workspace registration + approval flow.
 *
 * The scheduler is designed to be exercised from tests: paths, intervals,
 * and executors are all injectable via {@link SchedulerOptions}. Static
 * `getInstance()` accessors on top preserve the "one scheduler per process"
 * contract expected by CLI startup.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { homedir } from 'node:os';

import { logger } from '../utils/logger.js';
import type { Todo } from '../tool/tools/todowrite.js';

/** Default check interval: run the due-task sweep once a minute. */
export const DEFAULT_CHECK_INTERVAL_MS = 60_000;

/** Default absolute path used when the caller does not override it. */
export const DEFAULT_TASKS_FILE = path.join(homedir(), '.alexi', 'tasks.json');

/**
 * A scheduled variant of a Todo. `id`, `schedule`, `workspaceId`, and
 * `nextRun` are mandatory (they are optional on the base todo but required
 * for anything the scheduler will actually execute).
 */
export interface ScheduledTask extends Todo {
  id: string;
  schedule: string;
  workspaceId: string;
  nextRun: number;
  lastRun?: number;
  approved: boolean;
}

/** On-disk shape for `tasks.json`. */
export interface TasksState {
  tasks: ScheduledTask[];
  workspaces: Record<string, { registered: boolean; approvedAt?: number }>;
}

/** Optional per-task execution callback. Defaults to a no-op logger. */
export type TaskExecutor = (task: ScheduledTask) => Promise<void> | void;

export interface SchedulerOptions {
  /** Override the tasks.json path (used by tests). */
  tasksFile?: string;
  /** Override the periodic check interval in ms. */
  checkIntervalMs?: number;
  /** Injected executor. Defaults to a logger no-op. */
  executor?: TaskExecutor;
  /** Injected clock. Defaults to `Date.now`. */
  now?: () => number;
}

/**
 * Parse a natural-language schedule string into an absolute Unix timestamp
 * (ms). Supported formats:
 *
 * - `"in <N> minute[s]"`
 * - `"in <N> hour[s]"`
 * - `"tomorrow at <HH>[:MM] [am|pm]"`
 * - `"daily at <HH>[:MM] [am|pm]"` — returns the *next* occurrence
 *
 * Throws for anything else so callers surface a clear validation error to
 * the agent rather than silently scheduling `NaN`.
 */
export function parseSchedule(schedule: string, now: number = Date.now()): number {
  const trimmed = schedule.trim();

  const inMinutesMatch = trimmed.match(/^in\s+(\d+)\s+minutes?$/i);
  if (inMinutesMatch) {
    return now + parseInt(inMinutesMatch[1], 10) * 60_000;
  }

  const inHoursMatch = trimmed.match(/^in\s+(\d+)\s+hours?$/i);
  if (inHoursMatch) {
    return now + parseInt(inHoursMatch[1], 10) * 60 * 60_000;
  }

  const tomorrowMatch = trimmed.match(/^tomorrow at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (tomorrowMatch) {
    const target = timeToDate(tomorrowMatch, now, 1);
    return target.getTime();
  }

  const dailyMatch = trimmed.match(/^daily at (\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (dailyMatch) {
    const target = timeToDate(dailyMatch, now, 0);
    // If today's target time has already passed, roll to tomorrow.
    if (target.getTime() <= now) {
      target.setDate(target.getDate() + 1);
    }
    return target.getTime();
  }

  throw new Error(`Unsupported schedule format: "${schedule}"`);
}

/** Helper: convert a regex match to a Date at the requested day offset. */
function timeToDate(match: RegExpMatchArray, now: number, dayOffset: number): Date {
  const [, hourStr, minStr = '0', ampm] = match;
  let hour = parseInt(hourStr, 10);
  const ampmLower = ampm?.toLowerCase();
  if (ampmLower === 'pm' && hour < 12) {
    hour += 12;
  }
  if (ampmLower === 'am' && hour === 12) {
    hour = 0;
  }
  const base = new Date(now + dayOffset * 24 * 60 * 60_000);
  base.setHours(hour, parseInt(minStr, 10), 0, 0);
  return base;
}

/**
 * The scheduler itself. Prefer the module-level `getTaskScheduler()` in
 * production code; construct directly in tests so state does not leak.
 */
export class TaskScheduler {
  private state: TasksState = { tasks: [], workspaces: {} };
  private interval: NodeJS.Timeout | null = null;
  private readonly tasksFile: string;
  private readonly checkIntervalMs: number;
  private readonly executor: TaskExecutor;
  private readonly now: () => number;

  constructor(options: SchedulerOptions = {}) {
    this.tasksFile = options.tasksFile ?? DEFAULT_TASKS_FILE;
    this.checkIntervalMs = options.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
    this.executor = options.executor ?? defaultExecutor;
    this.now = options.now ?? Date.now;
  }

  /** Read state from disk, ignoring missing / corrupt files. */
  load(): void {
    try {
      if (fs.existsSync(this.tasksFile)) {
        const content = fs.readFileSync(this.tasksFile, 'utf-8');
        const parsed = JSON.parse(content) as Partial<TasksState>;
        this.state = {
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          workspaces:
            parsed.workspaces && typeof parsed.workspaces === 'object' ? parsed.workspaces : {},
        };
      }
    } catch (err) {
      logger.error('Failed to load tasks.json', err);
      this.state = { tasks: [], workspaces: {} };
    }
  }

  /** Write state to disk. Creates the parent directory on demand. */
  save(): void {
    try {
      const dir = path.dirname(this.tasksFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.tasksFile, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      logger.error('Failed to save tasks.json', err);
    }
  }

  /** Register a workspace so it can schedule tasks. Idempotent. */
  registerWorkspace(workspaceId: string): void {
    if (!this.state.workspaces[workspaceId]) {
      this.state.workspaces[workspaceId] = { registered: true };
      this.save();
    }
  }

  /**
   * Request approval for automated execution in a workspace. Returns
   * `true` if the workspace was registered (and marks it approved),
   * `false` otherwise. Integrates with the permission system in a future
   * iteration; the MVP relies on the workspace already being registered.
   */
  async requestTaskApproval(workspaceId: string): Promise<boolean> {
    const ws = this.state.workspaces[workspaceId];
    if (ws?.registered) {
      ws.approvedAt = this.now();
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Insert a new scheduled task. `nextRun` is recomputed from `schedule`
   * so callers cannot smuggle in a fabricated timestamp.
   */
  scheduleTask(task: ScheduledTask): void {
    if (!this.state.workspaces[task.workspaceId]?.registered) {
      throw new Error(`Workspace ${task.workspaceId} not registered for task execution`);
    }
    task.nextRun = parseSchedule(task.schedule, this.now());
    this.state.tasks.push(task);
    this.save();
  }

  /** Return a defensive copy of the current task list. */
  getTasks(): ScheduledTask[] {
    return this.state.tasks.map((t) => ({ ...t }));
  }

  /** Return a defensive copy of the workspace registry. */
  getWorkspaces(): Record<string, { registered: boolean; approvedAt?: number }> {
    return { ...this.state.workspaces };
  }

  /**
   * Sweep for due tasks and execute them. Public so tests can drive the
   * scheduler deterministically without wall-clock waits.
   */
  async checkDueTasks(): Promise<void> {
    const now = this.now();
    for (const task of this.state.tasks) {
      if (task.status !== 'pending' || task.nextRun > now) {
        continue;
      }
      if (!this.state.workspaces[task.workspaceId]?.approvedAt) {
        logger.warn(`Task ${task.id} pending approval in workspace ${task.workspaceId}`);
        continue;
      }
      task.status = 'in_progress';
      this.save();
      try {
        await this.executor(task);
        task.lastRun = this.now();
        if (isRecurring(task.schedule)) {
          task.nextRun = parseSchedule(task.schedule, this.now());
          task.status = 'pending';
        } else {
          task.status = 'completed';
        }
      } catch (err) {
        logger.error(`Task ${task.id} execution failed`, err);
        task.status = 'pending';
      }
      this.save();
    }
  }

  /**
   * Start the periodic sweep. Loads state on first start and runs an
   * immediate check so tasks that fell due while the process was offline
   * do not have to wait a full interval.
   */
  start(): void {
    if (this.interval) {
      return;
    }
    this.load();
    // Kick off an immediate sweep; do not await so start() stays sync.
    void this.checkDueTasks();
    this.interval = setInterval(() => {
      void this.checkDueTasks();
    }, this.checkIntervalMs);
    // Do not hold the event loop open just for the scheduler.
    if (typeof this.interval.unref === 'function') {
      this.interval.unref();
    }
  }

  /** Stop the periodic sweep. Safe to call multiple times. */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /** Test helper: reset in-memory state without touching disk. */
  _resetForTests(): void {
    this.state = { tasks: [], workspaces: {} };
  }
}

function isRecurring(schedule: string): boolean {
  return /^daily\b/i.test(schedule.trim());
}

async function defaultExecutor(task: ScheduledTask): Promise<void> {
  logger.info(`Executing scheduled task: ${task.content}`);
}

// ---------------------------------------------------------------------------
// Module-level singleton for CLI startup / shutdown. Tests should construct
// their own `TaskScheduler` instance rather than rely on this shared one.
// ---------------------------------------------------------------------------

let singleton: TaskScheduler | null = null;

/** Return the process-wide scheduler, constructing it lazily. */
export function getTaskScheduler(options?: SchedulerOptions): TaskScheduler {
  if (!singleton) {
    singleton = new TaskScheduler(options);
  }
  return singleton;
}

/** Reset the singleton. Intended for tests. */
export function resetTaskScheduler(): void {
  if (singleton) {
    singleton.stop();
  }
  singleton = null;
}

/** Convenience: start the singleton scheduler. */
export function startScheduler(options?: SchedulerOptions): void {
  getTaskScheduler(options).start();
}

/** Convenience: stop the singleton scheduler. */
export function stopScheduler(): void {
  if (singleton) {
    singleton.stop();
  }
}
