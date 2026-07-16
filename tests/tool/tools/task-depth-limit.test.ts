/**
 * Depth-limit tests for the task tool.
 *
 * Verifies OpenCode PR #37124 parity: the `task` tool rejects subagent
 * spawns that would exceed `MAX_SUBAGENT_DEPTH` (default 3). A recursive
 * or buggy chain that keeps calling `task` from inside a subagent
 * therefore stops at the configured depth with a clear error rather than
 * exhausting memory, file descriptors, or API rate limits.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../../src/tool/index.js';

// Mock the agent registry BEFORE importing the task tool. The `code` and
// `explore` agents both need `mode !== 'primary'` so validation passes
// and the depth check is what determines the outcome.
vi.mock('../../../src/agent/index.js', () => {
  const codeAgent = {
    id: 'code',
    name: 'Code Agent',
    description: 'Test stub',
    mode: 'all' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const exploreAgent = {
    id: 'explore',
    name: 'Explore Agent',
    description: 'Test stub',
    mode: 'subagent' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const registry = {
    get(idOrAlias: string) {
      if (idOrAlias === 'code') {
        return codeAgent;
      }
      if (idOrAlias === 'explore') {
        return exploreAgent;
      }
      return undefined;
    },
  };
  return {
    getAgentRegistry: () => registry,
  };
});

import {
  taskTool,
  getTaskStore,
  getMaxSubagentDepth,
  DEFAULT_MAX_SUBAGENT_DEPTH,
  TaskTool,
} from '../../../src/tool/tools/task.js';

describe('task tool depth limit', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = {
      workdir: '/tmp/test',
      sessionId: 'test-session',
    };
    delete process.env.MAX_SUBAGENT_DEPTH;
  });

  afterEach(() => {
    getTaskStore().clear();
    delete process.env.MAX_SUBAGENT_DEPTH;
  });

  describe('getMaxSubagentDepth', () => {
    it('returns the default when MAX_SUBAGENT_DEPTH is unset', () => {
      expect(getMaxSubagentDepth()).toBe(DEFAULT_MAX_SUBAGENT_DEPTH);
      expect(DEFAULT_MAX_SUBAGENT_DEPTH).toBe(3);
    });

    it('parses a positive integer from MAX_SUBAGENT_DEPTH', () => {
      process.env.MAX_SUBAGENT_DEPTH = '5';
      expect(getMaxSubagentDepth()).toBe(5);
    });

    it('falls back to the default when MAX_SUBAGENT_DEPTH is invalid', () => {
      process.env.MAX_SUBAGENT_DEPTH = 'not-a-number';
      expect(getMaxSubagentDepth()).toBe(DEFAULT_MAX_SUBAGENT_DEPTH);

      process.env.MAX_SUBAGENT_DEPTH = '0';
      expect(getMaxSubagentDepth()).toBe(DEFAULT_MAX_SUBAGENT_DEPTH);

      process.env.MAX_SUBAGENT_DEPTH = '-1';
      expect(getMaxSubagentDepth()).toBe(DEFAULT_MAX_SUBAGENT_DEPTH);

      process.env.MAX_SUBAGENT_DEPTH = '';
      expect(getMaxSubagentDepth()).toBe(DEFAULT_MAX_SUBAGENT_DEPTH);
    });
  });

  describe('TaskTool.nestedTask', () => {
    it('permits spawning while currentDepth + 1 <= maxDepth', () => {
      expect(TaskTool.nestedTask(0, 3)).toBe(true);
      expect(TaskTool.nestedTask(1, 3)).toBe(true);
      expect(TaskTool.nestedTask(2, 3)).toBe(true);
    });

    it('rejects spawning once currentDepth + 1 > maxDepth', () => {
      expect(TaskTool.nestedTask(3, 3)).toBe(false);
      expect(TaskTool.nestedTask(4, 3)).toBe(false);
    });

    it('honours a custom maxDepth', () => {
      expect(TaskTool.nestedTask(4, 5)).toBe(true);
      expect(TaskTool.nestedTask(5, 5)).toBe(false);
    });
  });

  describe('task execution', () => {
    it('allows spawning from a top-level session (depth 0)', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'do the thing',
          description: 'do thing',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 0 }
      );

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
    });

    it('allows spawning from depth 2 with the default limit (produces depth 3)', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'still under the limit',
          description: 'depth 3',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 2 }
      );

      expect(result.success).toBe(true);
    });

    it('rejects spawning from depth 3 with the default limit (would produce depth 4)', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'recursive spawn',
          description: 'too deep',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 3 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Maximum subagent nesting depth (3) exceeded. Cannot spawn subagent at depth 4.'
      );
    });

    it('includes the configured limit in the error message', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'recursive spawn',
          description: 'too deep',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 10 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('(3)');
      expect(result.error).toContain('depth 11');
    });

    it('honours a MAX_SUBAGENT_DEPTH override — allows deeper spawning up to the override', async () => {
      process.env.MAX_SUBAGENT_DEPTH = '5';

      const allowed = await taskTool.execute(
        {
          prompt: 'within override',
          description: 'depth 5',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 4 }
      );
      expect(allowed.success).toBe(true);

      const rejected = await taskTool.execute(
        {
          prompt: 'past override',
          description: 'depth 6',
          subagent_type: 'general',
        },
        { ...context, subagentDepth: 5 }
      );
      expect(rejected.success).toBe(false);
      expect(rejected.error).toBe(
        'Maximum subagent nesting depth (5) exceeded. Cannot spawn subagent at depth 6.'
      );
    });

    it('treats a missing subagentDepth as depth 0', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'top level implicit',
          description: 'implicit depth 0',
          subagent_type: 'general',
        },
        context
      );

      expect(result.success).toBe(true);
    });

    it('simulates recursive spawning stopping at the configured depth', async () => {
      // Simulate an agent that keeps invoking `task` from inside every
      // spawned subagent. We walk depth 0 -> 1 -> 2 -> 3 successfully
      // and then depth 4 must be rejected.
      const outcomes: Array<{ depth: number; success: boolean; error?: string }> = [];
      for (let depth = 0; depth <= 4; depth++) {
        const result = await taskTool.execute(
          {
            prompt: 'recursive self',
            description: `depth ${depth}`,
            subagent_type: 'general',
          },
          { ...context, subagentDepth: depth }
        );
        outcomes.push({ depth, success: result.success, error: result.error });
      }

      expect(outcomes.slice(0, 3).every((o) => o.success)).toBe(true);
      expect(outcomes[3]!.success).toBe(false);
      expect(outcomes[3]!.error).toContain('Maximum subagent nesting depth (3) exceeded');
      expect(outcomes[4]!.success).toBe(false);
      expect(outcomes[4]!.error).toContain('Cannot spawn subagent at depth 5');
    });
  });
});
