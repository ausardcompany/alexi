/**
 * Failure-path tests for the task / task_status tools.
 *
 * Verifies kilocode #11621 parity: when a subagent fails BEFORE it can
 * produce visible output, the parent agent must still receive the
 * `taskId` so it can recover via `task_status`.
 *
 * Two paths exercised:
 *   1. Validate-failure return in `task.ts` (primary-mode agent rejected).
 *   2. Background `.catch` that records `status: 'failed'` + `error` on the
 *      task store, which `task_status` must surface to the parent.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ToolContext } from '../../../src/tool/index.js';

// Mock the agent registry BEFORE importing the task tool so the registry
// returned to `taskTool.execute` is deterministic. The validate-failure
// path requires `agent.mode === 'primary'` for the `explore` agent slot.
vi.mock('../../../src/agent/index.js', () => {
  const primaryExploreAgent = {
    id: 'explore',
    name: 'Explore Agent (forced primary)',
    description: 'Test stub forcing validate-failure path',
    mode: 'primary' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const codeAgent = {
    id: 'code',
    name: 'Code Agent',
    description: 'Test stub',
    mode: 'all' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const registry = {
    get(idOrAlias: string) {
      if (idOrAlias === 'explore') {
        return primaryExploreAgent;
      }
      if (idOrAlias === 'code') {
        return codeAgent;
      }
      return undefined;
    },
  };
  return {
    getAgentRegistry: () => registry,
  };
});

import { taskTool, getTaskStore } from '../../../src/tool/tools/task.js';
import { taskStatusTool } from '../../../src/tool/tools/task_status.js';

describe('task tool failure paths', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = {
      workdir: '/tmp/test',
      sessionId: 'test-session',
    };
  });

  afterEach(() => {
    getTaskStore().clear();
    delete process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
  });

  describe('validate-failure path', () => {
    it('surfaces taskId on the validate-failure return', async () => {
      // The mocked registry returns a primary-mode `explore` agent which
      // TaskTool.validate rejects.
      const result = await taskTool.execute(
        {
          prompt: 'noop',
          description: 'noop',
          subagent_type: 'explore',
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/primary agent/i);
      expect(result.data).toBeDefined();
      expect(typeof result.data?.taskId).toBe('string');
      expect(result.data?.taskId.length).toBeGreaterThan(0);
      expect(result.data?.status).toBe('failed');
      expect(result.data?.completed).toBe(false);
      expect(result.data?.agentId).toBe('explore');
    });

    it('reuses caller-supplied task_id on validate-failure', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'noop',
          description: 'noop',
          subagent_type: 'explore',
          task_id: 'caller-supplied-id',
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.data?.taskId).toBe('caller-supplied-id');
      expect(result.data?.status).toBe('failed');
    });
  });

  describe('background failure surface via task_status', () => {
    it('surfaces status=failed and error on task_status when background path rejects', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'true';

      // Start a background task against the `code` agent slot (the mocked
      // registry returns a 'all' mode agent, so validate passes).
      const taskResult = await taskTool.execute(
        {
          prompt: 'long running work',
          description: 'bg',
          subagent_type: 'general',
          background: true,
        },
        context
      );

      expect(taskResult.success).toBe(true);
      const taskId = taskResult.data?.taskId;
      expect(taskId).toBeDefined();

      // Simulate the `.catch` handler at task.ts:268-272 firing after the
      // outer return — the only effect is store mutation, which is what
      // `task_status` is contractually supposed to surface.
      const store = getTaskStore();
      const taskData = store.get(taskId!);
      expect(taskData).toBeDefined();
      taskData!.status = 'failed';
      taskData!.error = 'simulated background failure';
      taskData!.completedAt = new Date();

      const statusResult = await taskStatusTool.execute({ taskId: taskId! }, context);

      expect(statusResult.success).toBe(true);
      expect(statusResult.data?.found).toBe(true);
      expect(statusResult.data?.status).toBe('failed');
      expect(statusResult.data?.error).toBe('simulated background failure');
      expect(statusResult.data?.completedAt).toBeDefined();
    });
  });
});
