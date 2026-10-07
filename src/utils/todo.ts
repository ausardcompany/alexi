/**
 * Utilities for summarizing the global `todowrite` tool state into a form the
 * TUI can render as a compact "N/M todos" progress chip.
 *
 * The todo list itself is owned by `src/tool/tools/todowrite.ts`. This module
 * does NOT touch that state — it only derives a count summary from a snapshot
 * so the TUI (and tests) can stay decoupled from the tool implementation.
 */

import type { Todo } from '../tool/tools/todowrite.js';

export interface TodoProgress {
  /** Number of todos whose status is `completed`. */
  completed: number;
  /** Total number of todos in the list, including cancelled ones. */
  total: number;
}

/**
 * Chip visual state based on completion ratio.
 *
 * - `empty`   — no todos at all (chip should be hidden in the TUI)
 * - `idle`    — todos exist but none are completed yet (gray)
 * - `active`  — some but not all todos are completed (yellow)
 * - `done`    — every todo is completed (green)
 */
export type TodoProgressState = 'empty' | 'idle' | 'active' | 'done';

/**
 * Compute `{ completed, total }` counts from a todo list.
 *
 * `completed` counts entries whose `status` is exactly `'completed'`.
 * Cancelled todos count toward `total` so the ratio reflects how much of the
 * declared plan has actually been shipped — matching how the `todowrite` tool
 * itself reports `totalCount`.
 */
export function computeTodoProgress(todos: readonly Todo[]): TodoProgress {
  const total = todos.length;
  let completed = 0;
  for (const t of todos) {
    if (t.status === 'completed') {
      completed += 1;
    }
  }
  return { completed, total };
}

/**
 * Classify a progress tuple into a chip state so the TUI can pick a color
 * without duplicating the comparison logic in multiple components.
 */
export function todoProgressState(progress: TodoProgress): TodoProgressState {
  if (progress.total === 0) {
    return 'empty';
  }
  if (progress.completed === 0) {
    return 'idle';
  }
  if (progress.completed >= progress.total) {
    return 'done';
  }
  return 'active';
}

/**
 * Compact `"N/M todos"` label suitable for a status-bar chip. Returns the
 * empty string when there are no todos so callers can treat it as a "render
 * nothing" sentinel without re-implementing the empty-list check.
 */
export function formatTodoChipLabel(progress: TodoProgress): string {
  if (progress.total === 0) {
    return '';
  }
  return `${progress.completed}/${progress.total} todos`;
}
