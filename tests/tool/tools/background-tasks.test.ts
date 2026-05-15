/**
 * Tests for task and task_status tools with background support
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { taskTool, getTaskStore, type TaskStatus } from '../../../src/tool/tools/task.js';
import { taskStatusTool } from '../../../src/tool/tools/task_status.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Background Tasks', () => {
  let context: ToolContext;
  let originalEnv: string | undefined;

  beforeEach(() => {
    context = {
      workdir: '/tmp/test',
      sessionId: 'test-session',
    };
    originalEnv = process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
  });

  afterEach(() => {
    // Restore environment
    if (originalEnv === undefined) {
      delete process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS;
    } else {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = originalEnv;
    }
    // Clear task store
    getTaskStore().clear();
  });

  describe('task tool', () => {
    it('should create foreground task when background flag is not set', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
          subagent_type: 'explore',
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
      expect(result.data?.status).toBe('completed');
      expect(result.data?.background).toBeUndefined();
    });

    it('should create foreground task when background=false', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'true';

      const result = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
          subagent_type: 'explore',
          background: false,
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
      expect(result.data?.status).toBe('completed');
    });

    it('should create background task when background=true and feature enabled', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'true';

      const result = await taskTool.execute(
        {
          prompt: 'Test background task',
          description: 'Background test',
          subagent_type: 'explore',
          background: true,
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(false);
      expect(result.data?.status).toBe('queued');
      expect(result.data?.background).toBe(true);
      expect(result.data?.taskId).toBeDefined();
    });

    it('should ignore background flag when feature is disabled', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'false';

      const result = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
          subagent_type: 'explore',
          background: true,
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
      expect(result.data?.status).toBe('completed');
    });

    it('should reject subagent spawning subagents', async () => {
      const subagentContext = {
        ...context,
        sessionId: 'subagent-session',
      };

      const result = await taskTool.execute(
        {
          prompt: 'Nested task',
          description: 'Nested',
        },
        subagentContext
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('recursive delegation');
    });

    it('should reject primary agent type', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
          subagent_type: 'primary',
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot spawn primary agents');
    });
  });

  describe('task_status tool', () => {
    it('should return not found for non-existent task', async () => {
      const result = await taskStatusTool.execute(
        {
          taskId: 'non-existent',
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.found).toBe(false);
      expect(result.data?.message).toContain('not found');
    });

    it('should return task status for existing task', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'true';

      // Create a background task
      const taskResult = await taskTool.execute(
        {
          prompt: 'Test background task',
          description: 'Background test',
          subagent_type: 'explore',
          background: true,
        },
        context
      );

      expect(taskResult.success).toBe(true);
      const taskId = taskResult.data?.taskId;
      expect(taskId).toBeDefined();

      // Query task status
      const statusResult = await taskStatusTool.execute(
        {
          taskId: taskId!,
        },
        context
      );

      expect(statusResult.success).toBe(true);
      expect(statusResult.data?.found).toBe(true);
      expect(statusResult.data?.taskId).toBe(taskId);
      expect(statusResult.data?.status).toBe('queued');
      expect(statusResult.data?.description).toContain('Test background task');
    });

    it('should track task completion', async () => {
      process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS = 'true';

      // Create a background task
      const taskResult = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
          background: true,
        },
        context
      );

      const taskId = taskResult.data?.taskId!;

      // Wait for background task to complete (stub completes after 1s)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Query task status
      const statusResult = await taskStatusTool.execute(
        {
          taskId,
        },
        context
      );

      expect(statusResult.success).toBe(true);
      expect(statusResult.data?.found).toBe(true);
      expect(statusResult.data?.status).toBe('completed');
      expect(statusResult.data?.result).toBeDefined();
      expect(statusResult.data?.completedAt).toBeDefined();
    });
  });

  describe('task store', () => {
    it('should store task data', async () => {
      const result = await taskTool.execute(
        {
          prompt: 'Test task',
          description: 'Test',
        },
        context
      );

      const taskId = result.data?.taskId;
      const store = getTaskStore();
      const taskData = store.get(taskId!);

      expect(taskData).toBeDefined();
      expect(taskData?.agentId).toBe('explore');
      expect(taskData?.messages.length).toBeGreaterThan(0);
      expect(taskData?.status).toBe('completed');
    });

    it('should allow task resumption', async () => {
      // Create initial task
      const result1 = await taskTool.execute(
        {
          prompt: 'First message',
          description: 'Test',
        },
        context
      );

      const taskId = result1.data?.taskId;

      // Resume task
      const result2 = await taskTool.execute(
        {
          prompt: 'Second message',
          description: 'Test continued',
          task_id: taskId,
        },
        context
      );

      expect(result2.success).toBe(true);
      expect(result2.data?.taskId).toBe(taskId);

      const store = getTaskStore();
      const taskData = store.get(taskId!);
      expect(taskData?.messages.length).toBeGreaterThan(2); // At least 2 user messages + responses
    });
  });
});
