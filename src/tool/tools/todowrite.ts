/**
 * TodoWrite Tool - Manage task lists
 */

import { nanoid } from 'nanoid';
import { z } from 'zod';
import { defineTool, type ToolContext, type ToolResult } from '../index.js';
import { formatError, logger } from '../../utils/logger.js';

const TodoSchema = z.object({
  content: z.string().describe('Brief description of the task'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).describe('Current status'),
  priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
  /**
   * Optional natural-language schedule (e.g. "in 5 minutes",
   * "tomorrow at 9am", "daily at 9am"). When present, the todo is
   * eligible to be promoted into a `ScheduledTask` executed by
   * {@link ../../core/task-scheduler.ts}.
   */
  schedule: z
    .string()
    .optional()
    .describe('Optional schedule: "in 5 minutes", "tomorrow at 9am", "daily at 9am"'),
  /**
   * Workspace identifier for scheduled tasks. Auto-populated by the
   * scheduler at promotion time; agents do not need to fill this.
   */
  workspaceId: z.string().optional().describe('Workspace ID for scheduled tasks (auto-populated)'),
});

const TodoWriteParamsSchema = z.object({
  todos: z.array(TodoSchema).describe('The updated todo list'),
});

export type Todo = z.infer<typeof TodoSchema>;

interface TodoWriteResult {
  todos: Todo[];
  totalCount: number;
  pendingCount: number;
  completedCount: number;
}

// Global todo state
let currentTodos: Todo[] = [];
const todoListeners: Array<(todos: Todo[]) => void> = [];

export const todowriteTool = defineTool<typeof TodoWriteParamsSchema, TodoWriteResult>({
  name: 'todowrite',
  description: `Create and manage a structured task list for tracking progress.

Format: ID, Title, Status (pending|in_progress|completed|cancelled), Priority (high|medium|low)

Use this tool when:
- Tasks require 3+ distinct steps
- User provides multiple tasks
- After completing a task (mark complete)
- When starting a task (mark in_progress)

Do NOT use for single trivial tasks.

Incremental update guidance:
- Send the FULL updated list on every call — the tool replaces state, it does not merge.
- Keep exactly ONE task in \`in_progress\` at a time. Mark the previous task
  \`completed\` in the same call you start the next one.
- Do not delete tasks that were completed earlier in the session; keep them in
  the list so the user can see the trail of finished work.
- Add newly discovered follow-up tasks as \`pending\` items rather than editing
  the currently \`in_progress\` task's content.`,

  parameters: TodoWriteParamsSchema,

  async execute(params, context): Promise<ToolResult<TodoWriteResult>> {
    // Promote any todos carrying a `schedule` field into the durable
    // task scheduler. This is best-effort: promotion failures are logged
    // but do not abort the todowrite call, so the todo list still updates
    // when the scheduler (or workspace) is unavailable.
    for (const todo of params.todos) {
      if (!todo.schedule) {
        continue;
      }
      if (!todo.workspaceId) {
        // Auto-populate workspaceId from the tool context so agents do
        // not have to thread it through every call. Falls back to the
        // literal 'default' workspace when no context identifier exists.
        todo.workspaceId = resolveWorkspaceId(context);
      }
      try {
        await promoteTodoToScheduledTask(todo);
      } catch (err) {
        logger.warn(`todowrite: failed to promote todo "${todo.content}": ${formatError(err)}`);
      }
    }

    // Update the global todo list
    currentTodos = params.todos;

    // Notify listeners
    for (const listener of todoListeners) {
      try {
        listener(currentTodos);
      } catch {
        // Ignore listener errors
      }
    }

    const pendingCount = currentTodos.filter(
      (t) => t.status === 'pending' || t.status === 'in_progress'
    ).length;
    const completedCount = currentTodos.filter((t) => t.status === 'completed').length;

    return {
      success: true,
      data: {
        todos: currentTodos,
        totalCount: currentTodos.length,
        pendingCount,
        completedCount,
      },
    };
  },
});

// Export for UI integration
export function getTodos(): Todo[] {
  return [...currentTodos];
}

export function onTodosChange(callback: (todos: Todo[]) => void): () => void {
  todoListeners.push(callback);
  return () => {
    const idx = todoListeners.indexOf(callback);
    if (idx >= 0) todoListeners.splice(idx, 1);
  };
}

/**
 * Resolve the workspaceId to assign to a scheduled todo. Prefers the
 * explicit `sessionId` on the tool context (treated here as the
 * workspace scope for scheduler isolation), then the workdir path, and
 * finally the literal `'default'` so promotion never fails on a
 * missing identifier.
 */
function resolveWorkspaceId(context: ToolContext | undefined): string {
  if (context?.sessionId) {
    return context.sessionId;
  }
  if (context?.workdir) {
    return context.workdir;
  }
  return 'default';
}

/**
 * Promote a todo with a `schedule` string into a durable `ScheduledTask`
 * on the process-wide task scheduler. The todo MUST already have both a
 * `schedule` and a `workspaceId`; callers that do not set `workspaceId`
 * should rely on {@link resolveWorkspaceId} first.
 *
 * The target workspace is registered on-demand so a todo with
 * `schedule: "in 5 minutes"` from a fresh workspace does not throw with
 * "not registered". Approval is NOT auto-granted — the task will stay
 * pending until `requestTaskApproval()` is called for the workspace,
 * which keeps the scheduler's explicit opt-in contract intact.
 */
export async function promoteTodoToScheduledTask(todo: Todo): Promise<void> {
  if (!todo.schedule) {
    throw new Error('Todo must have schedule to promote');
  }
  if (!todo.workspaceId) {
    throw new Error('Todo must have workspaceId to promote');
  }

  // Lazy import so the todowrite tool does not drag the scheduler module
  // (and its singleton) into every bundle that includes the tool.
  const { getTaskScheduler } = await import('../../core/task-scheduler.js');
  const scheduler = getTaskScheduler();
  scheduler.registerWorkspace(todo.workspaceId);

  scheduler.scheduleTask({
    id: nanoid(),
    content: todo.content,
    status: 'pending',
    priority: todo.priority,
    schedule: todo.schedule,
    workspaceId: todo.workspaceId,
    nextRun: 0,
    approved: false,
  });
}

export function clearTodos(): void {
  currentTodos = [];
  for (const listener of todoListeners) {
    try {
      listener([]);
    } catch {
      // Ignore
    }
  }
}
