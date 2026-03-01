/**
 * TodoWrite Tool - Manage task lists
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const TodoSchema = z.object({
  content: z.string().describe('Brief description of the task'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).describe('Current status'),
  priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
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

Use this tool when:
- Tasks require 3+ distinct steps
- User provides multiple tasks
- After completing a task (mark complete)
- When starting a task (mark in_progress)

Do NOT use for single trivial tasks.`,

  parameters: TodoWriteParamsSchema,

  async execute(params, _context): Promise<ToolResult<TodoWriteResult>> {
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
