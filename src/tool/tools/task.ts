/**
 * Task Tool - Launch subagent for complex tasks
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { getAgentRegistry, type Agent } from '../../agent/index.js';

const TaskParamsSchema = z.object({
  prompt: z.string().describe('The task for the agent to perform'),
  description: z.string().describe('Short 3-5 word description'),
  subagent_type: z.string().optional().describe('Type of specialized agent: general, explore'),
  task_id: z.string().optional().describe('Resume a previous task by ID'),
  background: z
    .boolean()
    .optional()
    .describe(
      'Run task in background (experimental, requires ALEXI_EXPERIMENTAL_BACKGROUND_TASKS)'
    ),
});

// Task tool utility interfaces
export interface SubagentOptions {
  autoMode?: boolean;
  inheritPermissions?: boolean;
  maxDepth?: number;
}

export interface SubagentConfig {
  autoMode: boolean;
  maxDepth: number;
}

// Task tool utilities
export const TaskTool = {
  /** Alexi keeps delegation one level deep to avoid recursive subagent chains. */
  nestedTask(): false {
    return false;
  },

  validate(agent: Agent, name: string): void {
    if (agent.mode === 'primary') {
      throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`);
    }
  },

  /**
   * Build configuration for spawning a subagent.
   * Propagates relevant flags from parent context.
   */
  buildSubagentConfig(_parentCtx: ToolContext, options: SubagentOptions = {}): SubagentConfig {
    // Note: context.flags would need to be added to ToolContext type
    // For now, we prepare the structure for future integration
    return {
      autoMode: options.autoMode ?? false, // Would be: parentCtx.flags?.auto ?? false
      maxDepth: 1, // Enforce single-level nesting
    };
  },
};

interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  gitManager?: unknown;
  // Future: flags?: { auto?: boolean }
}

export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

interface TaskResult {
  taskId: string;
  agentId: string;
  response: string;
  completed: boolean;
  status?: TaskStatus;
  background?: boolean;
}

// Store for ongoing tasks
const taskStore = new Map<
  string,
  {
    agentId: string;
    messages: Array<{ role: string; content: string }>;
    created: number;
    status: TaskStatus;
    background?: boolean;
    result?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
  }
>();

/**
 * Background task queue processor (stub for future implementation)
 */
async function queueBackgroundTask(
  taskId: string,
  taskData: {
    agentId: string;
    messages: Array<{ role: string; content: string }>;
    created: number;
    status: TaskStatus;
    background?: boolean;
    result?: string;
    error?: string;
    startedAt?: Date;
    completedAt?: Date;
  },
  _agent: Agent,
  _config: SubagentConfig
): Promise<void> {
  // This is a stub - in a full implementation, this would:
  // 1. Add task to a persistent queue
  // 2. Spawn a background worker process
  // 3. Execute the LLM call with the agent's system prompt
  // 4. Update taskData with results

  // For now, simulate async completion
  await new Promise((resolve) => setTimeout(resolve, 100));
  taskData.status = 'running';

  // Simulate task completion after a delay
  setTimeout(() => {
    taskData.status = 'completed';
    taskData.result = 'Background task completed (stub implementation)';
    taskData.completedAt = new Date();
  }, 1000);
}

/**
 * Get task store for status queries
 */
export function getTaskStore() {
  return taskStore;
}

export const taskTool = defineTool<typeof TaskParamsSchema, TaskResult>({
  name: 'task',
  description: `Launch a subagent to handle complex, multistep tasks autonomously.

Available agent types:
- general: General-purpose agent for researching and multi-step tasks
- explore: Fast agent for codebase exploration

Usage:
- Provide a detailed prompt with exactly what information to return
- Use task_id to resume a previous task session
- Use background=true for long-running tasks (requires ALEXI_EXPERIMENTAL_BACKGROUND_TASKS)
- Results are returned in the agent's final message`,

  parameters: TaskParamsSchema,

  async execute(params, context): Promise<ToolResult<TaskResult>> {
    const { nanoid } = await import('nanoid');
    const registry = getAgentRegistry();

    // Check if background tasks are enabled
    const enableBackground = process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS === 'true';

    // Security: Alexi disallows subagents spawning subagents
    const canTask = TaskTool.nestedTask();
    if (!canTask && context.sessionId && context.sessionId.includes('subagent')) {
      return {
        success: false,
        error: 'Task tool is not available for subagent sessions to prevent recursive delegation',
      };
    }

    // Validate that we're not spawning a primary agent from a task
    if (params.subagent_type === 'primary') {
      return {
        success: false,
        error:
          "Cannot spawn primary agents from task tool. Use 'general' or 'explore' agent types.",
      };
    }

    // Determine which agent to use
    let agentId = 'explore'; // Default
    if (params.subagent_type === 'general') {
      agentId = 'code';
    } else if (params.subagent_type === 'explore') {
      agentId = 'explore';
    }

    const agent = registry.get(agentId);
    if (!agent) {
      return {
        success: false,
        error: `Unknown agent type: ${params.subagent_type}`,
      };
    }

    // Validate agent can be used as subagent
    try {
      TaskTool.validate(agent, agent.name);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    // Resume or create task
    let taskId = params.task_id;
    let taskData = taskId ? taskStore.get(taskId) : undefined;

    if (!taskData) {
      taskId = nanoid();
      taskData = {
        agentId: agent.id,
        messages: [],
        created: Date.now(),
        status: 'queued',
        background: params.background && enableBackground,
      };
      taskStore.set(taskId, taskData);
    }

    // Add the prompt to messages
    taskData.messages.push({
      role: 'user',
      content: params.prompt,
    });

    // TODO: When full session/permission integration is added, use deriveSubagentSessionPermission
    // to inherit edit, bash, and MCP restrictions from the calling agent to prevent privilege
    // escalation. Sub-agents must inherit restrictions so they cannot bypass parent agent permissions.
    //
    // Example integration (requires session context in ToolContext):
    // import { deriveSubagentSessionPermission } from '../../agent/subagent-permissions.js';
    // const subagentPermission = deriveSubagentSessionPermission({
    //   parentSessionPermission: context.session.permission,
    //   parentAgent: context.agent,
    //   subagent: agent,
    // });
    //
    // See src/agent/subagent-permissions.ts for implementation.

    // Build subagent configuration with auto flag propagation
    const subagentConfig = TaskTool.buildSubagentConfig(context, {
      autoMode: false, // TODO: Extract from context.flags when available
      inheritPermissions: true,
    });

    // Handle background task execution
    if (params.background && enableBackground) {
      taskData.status = 'queued';
      taskData.startedAt = new Date();

      const response = `[Task ${taskId} queued for background execution by agent: ${agent.name}]\n\nPrompt: ${params.description}\n\nThis task is running in the background. Use the task_status tool to check progress.`;

      taskData.messages.push({
        role: 'assistant',
        content: response,
      });

      // Queue task for background processing
      // In a full implementation, this would dispatch to a background worker
      queueBackgroundTask(taskId as string, taskData, agent, subagentConfig).catch((err) => {
        taskData!.status = 'failed';
        taskData!.error = err instanceof Error ? err.message : String(err);
        taskData!.completedAt = new Date();
      });

      return {
        success: true,
        data: {
          taskId: taskId!,
          agentId: agent.id,
          response,
          completed: false,
          status: 'queued',
          background: true,
        },
      };
    }

    // For now, return a placeholder since actual execution requires LLM integration
    // In a full implementation, this would call the LLM with the agent's system prompt
    // and pass subagentConfig.autoMode to maintain automation behavior
    taskData.status = 'completed';
    const response = `[Task ${taskId} queued for agent: ${agent.name}]\n\nPrompt: ${params.description}\n\nThis task will be executed by the ${agent.name} agent. In a full implementation, this would make an LLM call with the agent's system prompt and auto mode: ${subagentConfig.autoMode}.`;

    taskData.messages.push({
      role: 'assistant',
      content: response,
    });

    return {
      success: true,
      data: {
        taskId: taskId!,
        agentId: agent.id,
        response,
        completed: true,
        status: 'completed',
      },
    };
  },
});
