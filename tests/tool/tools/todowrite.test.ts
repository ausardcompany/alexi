/**
 * Tests for the todowrite tool schema, in particular the optional
 * `schedule` field added for the durable task agenda.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock the tool index module to bypass permission checks. Mirrors the
// pattern used in tests/tool/tools/write.test.ts.
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
import type { ToolContext } from '../../../src/tool/index.js';

const context: ToolContext = { workdir: process.cwd() };

describe('todowrite tool', () => {
  it('accepts a schedule field in the todo schema', async () => {
    clearTodos();
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Run tests',
            status: 'pending',
            priority: 'high',
            schedule: 'in 5 minutes',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.todos).toHaveLength(1);
    expect(result.data?.todos[0].schedule).toBe('in 5 minutes');
  });

  it('accepts todos without a schedule field (backwards compatible)', async () => {
    clearTodos();
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Regular todo',
            status: 'pending',
            priority: 'medium',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.todos[0].schedule).toBeUndefined();
  });

  it('accepts an optional workspaceId field', async () => {
    clearTodos();
    const result = await todowriteTool.execute(
      {
        todos: [
          {
            content: 'Scoped scheduled task',
            status: 'pending',
            priority: 'low',
            schedule: 'daily at 9am',
            workspaceId: 'ws-123',
          },
        ],
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.todos[0].workspaceId).toBe('ws-123');
  });

  it('reports totals correctly', async () => {
    clearTodos();
    const result = await todowriteTool.execute(
      {
        todos: [
          { content: 'A', status: 'pending', priority: 'high' },
          { content: 'B', status: 'in_progress', priority: 'medium' },
          { content: 'C', status: 'completed', priority: 'low' },
        ],
      },
      context
    );

    expect(result.data?.totalCount).toBe(3);
    expect(result.data?.pendingCount).toBe(2);
    expect(result.data?.completedCount).toBe(1);
  });
});
