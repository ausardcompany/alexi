/**
 * Task Status Tool - Query status of background tasks
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { getTaskStore, type TaskStatus } from './task.js';

const TaskStatusParamsSchema = z.object({
  taskId: z.string().describe('The ID of the task to query'),
});

export interface TaskInfo {
  found: boolean;
  taskId?: string;
  status?: TaskStatus;
  description?: string;
  result?: string;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  message?: string;
}

export const taskStatusTool = defineTool<typeof TaskStatusParamsSchema, TaskInfo>({
  name: 'task_status',
  description: `Query the status of a background task.

Use this tool to check on the progress of tasks that were started in the background.
Returns the current status, any results if completed, or error information if failed.

Available status values:
- queued: Task is waiting to start
- running: Task is currently executing
- completed: Task finished successfully
- failed: Task encountered an error
- cancelled: Task was cancelled`,

  parameters: TaskStatusParamsSchema,

  async execute(params): Promise<ToolResult<TaskInfo>> {
    const taskStore = getTaskStore();
    const task = taskStore.get(params.taskId);

    if (!task) {
      return {
        success: true,
        data: {
          found: false,
          message: `Task ${params.taskId} not found`,
        },
      };
    }

    // Extract the last user message as description if available
    const lastUserMessage = task.messages.filter((m) => m.role === 'user').pop();

    return {
      success: true,
      data: {
        found: true,
        taskId: params.taskId,
        status: task.status,
        description: lastUserMessage?.content,
        result: task.result,
        error: task.error,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
      },
    };
  },
});
