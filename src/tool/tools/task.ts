/**
 * Task Tool - Launch subagent for complex tasks
 * Delegates work to specialized sub-agents for parallel or specialized processing
 */

import { z } from 'zod';
import { defineTool, type ToolResult, type ToolContext } from '../index.js';
import { getAgentRegistry } from '../../agent/index.js';

const TaskParamsSchema = z.object({
  prompt: z.string().describe('The task for the agent to perform'),
  description: z.string().describe('Short 3-5 word description'),
  subagent_type: z.string().optional().describe('Type of specialized agent: general, explore'),
  task_id: z.string().optional().describe('Resume a previous task by ID'),
  context: z.string().optional().describe('Additional context for the subtask'),
});

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
    parentSessionId?: string;
  }
>();

/**
 * Check if current context is a subagent session
 */
function isSubagentContext(context: ToolContext): boolean {
  // Check if this is being called from within a task/subagent session
  return !!(context as any).isSubagent;
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
- Results are returned in the agent's final message
- Primary agents cannot use task tool in subagent sessions (prevents nesting)

Best practices:
- Delegate independent subtasks that can run in parallel
- Provide clear, specific instructions for what to return
- Use context parameter to pass relevant information`,

  parameters: TaskParamsSchema,

  async execute(params, context): Promise<ToolResult<TaskResult>> {
    const { nanoid } = await import('nanoid');
    const registry = getAgentRegistry();

    // Get current agent to check if we're in a subagent context
    const currentAgent = registry.getCurrent();

    // Prevent primary agents from using task tool in subagent sessions
    if (isSubagentContext(context) && currentAgent.mode === 'primary') {
      return {
        success: false,
        error: 'Primary agents cannot use task tool in subagent sessions to prevent infinite nesting',
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

    // Resume or create task
    let taskId = params.task_id;
    let taskData = taskId ? taskStore.get(taskId) : undefined;

    if (!taskData) {
      taskId = nanoid();
      taskData = {
        agentId: agent.id,
        messages: [],
        created: Date.now(),
        parentSessionId: context.sessionId,
      };
      taskStore.set(taskId, taskData);
    }

    // Build task prompt with context if provided
    const fullPrompt = params.context
      ? `${params.prompt}\n\nContext:\n${params.context}`
      : params.prompt;

    // Add the prompt to messages
    taskData.messages.push({
      role: 'user',
      content: fullPrompt,
    });

    // TODO: When full session/permission integration is added, inherit edit, bash, and MCP
    // restrictions from the calling agent to prevent privilege escalation. Sub-agents must
    // inherit restrictions so they cannot bypass parent agent permissions.
    // See upstream commit for implementation reference.

    // For now, return a placeholder since actual execution requires LLM integration
    // In a full implementation, this would call the LLM with the agent's system prompt
    const response = `[Task ${taskId} queued for agent: ${agent.name}]

Description: ${params.description}
Agent: ${agent.name}
Prompt: ${params.prompt}

This task will be executed by the ${agent.name} agent. In a full implementation, this would make an LLM call with the agent's system prompt and return the actual results.

The subagent would inherit permission restrictions from the parent session to prevent privilege escalation.`;

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
