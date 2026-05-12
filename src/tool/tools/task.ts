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
});

// Namespace for task tool utilities
export namespace TaskTool {
  /** Alexi keeps delegation one level deep to avoid recursive subagent chains. */
  export function nestedTask(): false {
    return false;
  }

  export function validate(agent: Agent, name: string): void {
    if (agent.mode === 'primary') {
      throw new Error(`Agent "${name}" is a primary agent and cannot be used as a subagent`);
    }
  }

  export interface SubagentOptions {
    autoMode?: boolean;
    inheritPermissions?: boolean;
    maxDepth?: number;
  }

  export interface SubagentConfig {
    autoMode: boolean;
    maxDepth: number;
  }

  /**
   * Build configuration for spawning a subagent.
   * Propagates relevant flags from parent context.
   */
  export function buildSubagentConfig(
    parentCtx: ToolContext,
    options: SubagentOptions = {}
  ): SubagentConfig {
    // Note: context.flags would need to be added to ToolContext type
    // For now, we prepare the structure for future integration
    return {
      autoMode: options.autoMode ?? false, // Would be: parentCtx.flags?.auto ?? false
      maxDepth: 1, // Enforce single-level nesting
    };
  }
}

interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  gitManager?: unknown;
  // Future: flags?: { auto?: boolean }
}

interface TaskResult {
  taskId: string;
  agentId: string;
  response: string;
  completed: boolean;
}

// Store for ongoing tasks
const taskStore = new Map<
  string,
  {
    agentId: string;
    messages: Array<{ role: string; content: string }>;
    created: number;
  }
>();

export const taskTool = defineTool<typeof TaskParamsSchema, TaskResult>({
  name: 'task',
  description: `Launch a subagent to handle complex, multistep tasks autonomously.

Available agent types:
- general: General-purpose agent for researching and multi-step tasks
- explore: Fast agent for codebase exploration

Usage:
- Provide a detailed prompt with exactly what information to return
- Use task_id to resume a previous task session
- Results are returned in the agent's final message`,

  parameters: TaskParamsSchema,

  async execute(params, context): Promise<ToolResult<TaskResult>> {
    const { nanoid } = await import('nanoid');
    const registry = getAgentRegistry();

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

    // For now, return a placeholder since actual execution requires LLM integration
    // In a full implementation, this would call the LLM with the agent's system prompt
    // and pass subagentConfig.autoMode to maintain automation behavior
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
      },
    };
  },
});
