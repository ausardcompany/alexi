/**
 * Task Tool - Launch subagent for complex tasks.
 *
 * ## Subagent nesting depth guard
 *
 * The `task` tool can be invoked from within a subagent, which means a
 * chain of `task` calls can spawn subagents of subagents indefinitely. To
 * prevent runaway recursion (a buggy prompt that delegates everything to
 * another subagent), resource exhaustion (each subagent holds its own
 * message history, tool state, and network connections), and cost blowup
 * (each subagent costs at least one provider round-trip), the `execute`
 * handler enforces a bounded nesting depth:
 *
 * - A top-level user session has `subagentDepth === 0`.
 * - Each `task` invocation would spawn a subagent one level deeper.
 * - Spawning at depth greater than `MAX_SUBAGENT_DEPTH` is rejected with
 *   `Maximum subagent nesting depth (N) exceeded. Cannot spawn subagent at
 *   depth N+1.` before any provider request is made.
 *
 * The default cap is `DEFAULT_MAX_SUBAGENT_DEPTH` (3), configurable via
 * the `MAX_SUBAGENT_DEPTH` environment variable. See
 * [`docs/TOOLS.md`](../../../docs/TOOLS.md#subagent-nesting-depth) for
 * the user-facing explanation and rationale, and OpenCode PR #37124
 * (https://github.com/sst/opencode/pull/37124) for the upstream
 * reference implementation.
 */

import { z } from 'zod';
import { defineTool, type ToolResult, type ToolContext } from '../index.js';
import { getAgentRegistry, type Agent } from '../../agent/index.js';
import { getCostTracker, type TaskUsageSummary } from '../../core/costTracker.js';

/**
 * Default maximum subagent nesting depth. A top-level user session is
 * depth 0, and each spawned subagent increments the depth by one. Depth
 * greater than this value is rejected. Overridable via the
 * `MAX_SUBAGENT_DEPTH` environment variable (must be a positive integer).
 *
 * See {@link getMaxSubagentDepth} for the runtime lookup and
 * `docs/TOOLS.md#subagent-nesting-depth` for the user-facing rationale.
 */
export const DEFAULT_MAX_SUBAGENT_DEPTH = 3;

/**
 * Read the configured subagent depth limit from `MAX_SUBAGENT_DEPTH`. Falls
 * back to `DEFAULT_MAX_SUBAGENT_DEPTH` when the env var is unset, empty, or
 * cannot be parsed as a positive integer (zero and negative values are
 * treated as invalid; there is no hard upper bound, but values above ~10
 * are strongly discouraged because latency and cost multiply per level).
 */
export function getMaxSubagentDepth(): number {
  const raw = process.env.MAX_SUBAGENT_DEPTH;
  if (raw === undefined || raw === '') {
    return DEFAULT_MAX_SUBAGENT_DEPTH;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_MAX_SUBAGENT_DEPTH;
  }
  return parsed;
}

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
  /**
   * Whether a session at `currentDepth` may spawn another subagent without
   * exceeding `maxDepth`. A top-level session is depth 0; each spawned
   * subagent is one level deeper. Returns `false` when spawning would
   * produce depth > maxDepth, and `true` otherwise.
   */
  nestedTask(currentDepth = 0, maxDepth: number = getMaxSubagentDepth()): boolean {
    return currentDepth + 1 <= maxDepth;
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
      maxDepth: options.maxDepth ?? getMaxSubagentDepth(),
    };
  },
};

export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

interface TaskResult {
  taskId: string;
  agentId: string;
  response: string;
  completed: boolean;
  status?: TaskStatus;
  background?: boolean;
  usage?: TaskUsageSummary;
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
- Use task_id to resume a previous task session, OR to inspect a failed task (the failure response includes taskId)
- Use background=true for long-running tasks (requires ALEXI_EXPERIMENTAL_BACKGROUND_TASKS)`,

  parameters: TaskParamsSchema,

  async execute(params, context): Promise<ToolResult<TaskResult>> {
    const { nanoid } = await import('nanoid');
    const registry = getAgentRegistry();

    // Check if background tasks are enabled
    const enableBackground = process.env.ALEXI_EXPERIMENTAL_BACKGROUND_TASKS === 'true';

    // Enforce bounded subagent nesting. A top-level session has depth 0;
    // each `task` invocation would spawn a subagent one level deeper. If
    // spawning would produce a subagent at depth > MAX_SUBAGENT_DEPTH,
    // reject the invocation with a clear error so a buggy or recursive
    // prompt cannot exhaust memory, file descriptors, or API rate limits,
    // and so a delegate-everything prompt cannot blow the provider budget.
    // Default cap is 3; override with `MAX_SUBAGENT_DEPTH` env var. Full
    // rationale in `docs/TOOLS.md#subagent-nesting-depth`.
    const maxDepth = getMaxSubagentDepth();
    const currentDepth = context.subagentDepth ?? 0;
    const spawnDepth = currentDepth + 1;
    if (spawnDepth > maxDepth) {
      return {
        success: false,
        // Error format is part of the tool's public contract; tests in
        // tests/tool/tools/task-depth-limit.test.ts assert on this exact
        // shape. Change here requires updating those tests and the docs.
        error: `Maximum subagent nesting depth (${maxDepth}) exceeded. Cannot spawn subagent at depth ${spawnDepth}.`,
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

    // Pre-bind a taskId so any failure path AFTER this point can surface it
    // to the parent agent. The parent can then call task_status with this id
    // to inspect what went wrong, mirroring kilocode #11621.
    const taskIdForFailure = params.task_id ?? nanoid();

    // Validate agent can be used as subagent
    try {
      TaskTool.validate(agent, agent.name);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        data: {
          taskId: taskIdForFailure,
          agentId: agent.id,
          response: '',
          completed: false,
          status: 'failed' as const,
        },
      };
    }

    // Resume or create task. taskIdForFailure already equals params.task_id
    // when provided, so reusing it for a fresh row keeps the id stable from
    // the validate-failure path through to the live execution path.
    let taskId: string = taskIdForFailure;
    let taskData = params.task_id ? taskStore.get(params.task_id) : undefined;

    if (!taskData) {
      taskData = {
        agentId: agent.id,
        messages: [],
        created: Date.now(),
        status: 'queued',
        background: params.background && enableBackground,
      };
      taskStore.set(taskId, taskData);
    } else {
      // Existing task — keep the caller-supplied id so resumption works.
      taskId = params.task_id as string;
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

      // Start per-task usage tracking for background task
      const bgCostTracker = getCostTracker();
      bgCostTracker.startTask(taskId!);

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

      // End per-task usage tracking for background task (captures initial dispatch cost)
      const bgUsage = bgCostTracker.endTask(taskId!);

      return {
        success: true,
        data: {
          taskId: taskId!,
          agentId: agent.id,
          response,
          completed: false,
          status: 'queued',
          background: true,
          usage: bgUsage,
        },
      };
    }

    // Start per-task usage tracking
    const costTracker = getCostTracker();
    costTracker.startTask(taskId!);

    // For now, return a placeholder since actual execution requires LLM integration
    // In a full implementation, this would call the LLM with the agent's system prompt
    // and pass subagentConfig.autoMode to maintain automation behavior
    taskData.status = 'completed';
    const response = `[Task ${taskId} queued for agent: ${agent.name}]\n\nPrompt: ${params.description}\n\nThis task will be executed by the ${agent.name} agent. In a full implementation, this would make an LLM call with the agent's system prompt and auto mode: ${subagentConfig.autoMode}.`;

    taskData.messages.push({
      role: 'assistant',
      content: response,
    });

    // End per-task usage tracking and capture summary
    const usage = costTracker.endTask(taskId!);

    return {
      success: true,
      data: {
        taskId: taskId!,
        agentId: agent.id,
        response,
        completed: true,
        status: 'completed',
        usage,
      },
    };
  },
});
