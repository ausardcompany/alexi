import { describe, it, expect } from 'vitest';

import {
  computeTodoProgress,
  formatTodoChipLabel,
  todoProgressState,
} from '../../src/utils/todo.js';
import type { Todo } from '../../src/tool/tools/todowrite.js';

function todo(status: Todo['status'], content = 't'): Todo {
  return { content, status, priority: 'medium' };
}

describe('computeTodoProgress', () => {
  it('returns 0/0 for an empty list', () => {
    expect(computeTodoProgress([])).toEqual({ completed: 0, total: 0 });
  });

  it('counts only entries with status "completed"', () => {
    const todos: Todo[] = [
      todo('pending'),
      todo('in_progress'),
      todo('completed'),
      todo('completed'),
      todo('cancelled'),
    ];
    expect(computeTodoProgress(todos)).toEqual({ completed: 2, total: 5 });
  });

  it('reports completed === total when every todo is done', () => {
    const todos: Todo[] = [todo('completed'), todo('completed'), todo('completed')];
    expect(computeTodoProgress(todos)).toEqual({ completed: 3, total: 3 });
  });

  it('counts cancelled todos toward the total but not toward completed', () => {
    const todos: Todo[] = [todo('cancelled'), todo('cancelled')];
    expect(computeTodoProgress(todos)).toEqual({ completed: 0, total: 2 });
  });
});

describe('todoProgressState', () => {
  it('is "empty" when there are no todos', () => {
    expect(todoProgressState({ completed: 0, total: 0 })).toBe('empty');
  });

  it('is "idle" when none are completed yet', () => {
    expect(todoProgressState({ completed: 0, total: 3 })).toBe('idle');
  });

  it('is "active" when some but not all are completed', () => {
    expect(todoProgressState({ completed: 1, total: 3 })).toBe('active');
    expect(todoProgressState({ completed: 2, total: 3 })).toBe('active');
  });

  it('is "done" when every todo is completed', () => {
    expect(todoProgressState({ completed: 3, total: 3 })).toBe('done');
  });

  it('is "done" if completed overshoots total (defensive)', () => {
    expect(todoProgressState({ completed: 5, total: 3 })).toBe('done');
  });
});

describe('formatTodoChipLabel', () => {
  it('returns an empty string when there are no todos', () => {
    expect(formatTodoChipLabel({ completed: 0, total: 0 })).toBe('');
  });

  it('formats as "N/M todos"', () => {
    expect(formatTodoChipLabel({ completed: 3, total: 5 })).toBe('3/5 todos');
    expect(formatTodoChipLabel({ completed: 0, total: 1 })).toBe('0/1 todos');
    expect(formatTodoChipLabel({ completed: 5, total: 5 })).toBe('5/5 todos');
  });
});
