/**
 * Agent Manager Tool - Manage and orchestrate multiple agent sessions
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { getBlocker, answerQuestion } from '../../permission/agent-manager.js';

// Nullable-friendly schema: strict providers (OpenAI structured output,
// SAP AI Core in strict mode) may omit optional fields entirely OR pass
// explicit `null`. Accept both so tool-call payloads coming from any
// provider validate without provider-specific pre-processing.
const AgentManagerParamsSchema = z.object({
  action: z.enum(['create', 'list', 'stop', 'status', 'answer']).describe('Action to perform'),
  sessionId: z.string().nullable().optional().describe('Session ID for stop/status actions'),
  agentId: z
    .string()
    .nullable()
    .optional()
    .describe('Agent ID for answer action (the sub-agent blocked on a pending question)'),
  answer: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Answer text to send to a sub-agent that is blocked on a pending question. Required when action=answer.'
    ),
  worktreeId: z.string().nullable().optional().describe('Worktree ID for session creation'),
  config: z
    .object({
      mode: z.string().nullable().optional().describe('Agent mode'),
      model: z.string().nullable().optional().describe('Model to use'),
      // Ports upstream opencode `agent-manager` task `provider` field
      // (2026-08 upstream sync). Lets the orchestrator LLM constrain
      // model resolution to a specific provider ID when the same model
      // name is offered by multiple providers (e.g. `sap-ai-core`
      // deployment vs. direct `anthropic`). Requires `model` to be set.
      provider: z
        .string()
        .nullable()
        .optional()
        .describe(
          "Optional provider ID to constrain model resolution (e.g. 'anthropic', 'sap-ai-core'). Use with model to select a model from a specific provider; omit to use the current-turn provider preference. Ignored when model is not set."
        ),
      excludeLocalState: z
        .boolean()
        .nullable()
        .optional()
        .describe('Exclude local state on startup for fresh session initialization'),
    })
    .nullable()
    .optional()
    .describe('Configuration for session creation'),
});

interface AgentManagerResult {
  action: string;
  sessions?: Array<{
    id: string;
    mode?: string;
    model?: string;
    status: string;
  }>;
  session?: {
    id: string;
    status: string;
  };
  answered?: string;
  message?: string;
}

export const agentManagerTool = defineTool<typeof AgentManagerParamsSchema, AgentManagerResult>({
  name: 'agent_manager',
  description: `Manage and orchestrate multiple agent sessions and workflows.

Actions:
- create: Create a new agent session with optional configuration.
  The optional config accepts \`mode\`, \`model\`, an optional \`provider\` to
  constrain model resolution to one provider ID (requires \`model\`), and
  \`excludeLocalState\` for a fresh-state startup.
- list: List all active agent sessions
- stop: Stop a specific agent session
- status: Get the status of a specific agent session
- answer: Provide an answer to a sub-agent that is blocked on a pending question.
  Required params: agentId, answer.
  Use when a sub-agent's status shows a pending question that only you can resolve.`,

  parameters: AgentManagerParamsSchema,

  permission: {
    action: 'admin',
    getResource: (params) => params.action,
  },

  async execute(params, _context): Promise<ToolResult<AgentManagerResult>> {
    const { action, sessionId, agentId, answer, config } = params;

    try {
      switch (action) {
        case 'create': {
          // Create new agent session
          // In a real implementation, this would interact with the agent system
          const newSessionId = `session-${Date.now()}`;
          // `config` and `config.excludeLocalState` may be `null` (strict
          // providers) or `undefined` (omitted). Both mean "use default".
          const excludeLocalState = config?.excludeLocalState ?? false;

          // Mirror the upstream opencode `Task` filter:
          //   "A task provider requires a model"
          // Reject a provider constraint that has no model to bind to,
          // so the resolver cannot silently ignore the provider hint.
          const providerHint = config?.provider?.trim();
          if (providerHint && !config?.model?.trim()) {
            return {
              success: false,
              error: 'config.provider requires config.model to be set',
            };
          }

          return {
            success: true,
            data: {
              action: 'create',
              session: {
                id: newSessionId,
                status: excludeLocalState ? 'created-fresh' : 'created',
              },
              message: excludeLocalState
                ? `Created new agent session with fresh state: ${newSessionId}`
                : `Created new agent session: ${newSessionId}`,
            },
          };
        }

        case 'list': {
          // List all active sessions
          // In a real implementation, this would query the agent manager
          return {
            success: true,
            data: {
              action: 'list',
              sessions: [
                // Placeholder - would be populated from actual agent manager
              ],
              message: 'No active sessions',
            },
          };
        }

        case 'stop': {
          if (!sessionId) {
            return {
              success: false,
              error: 'sessionId is required for stop action',
            };
          }

          // Stop the specified session
          return {
            success: true,
            data: {
              action: 'stop',
              session: {
                id: sessionId,
                status: 'stopped',
              },
              message: `Stopped session: ${sessionId}`,
            },
          };
        }

        case 'status': {
          if (!sessionId) {
            return {
              success: false,
              error: 'sessionId is required for status action',
            };
          }

          // Get session status
          return {
            success: true,
            data: {
              action: 'status',
              session: {
                id: sessionId,
                status: 'unknown',
              },
              message: `Status for session: ${sessionId}`,
            },
          };
        }

        case 'answer': {
          // Ports kilocode `7baefdddf feat(agent-manager): answer pending
          // questions`. Lets the orchestrator LLM unblock a sub-agent
          // that is stuck on a permission or clarification question.
          if (!agentId || !answer) {
            return {
              success: false,
              error: 'agentId and answer are required for action=answer',
            };
          }
          // Fail-closed lookup (see `98559c9d6` / src/permission/agent-manager.ts).
          const blocker = await getBlocker(agentId);
          if (!blocker) {
            return {
              success: false,
              error: `No pending question for agent ${agentId}`,
            };
          }
          if (blocker.kind !== 'question') {
            return {
              success: false,
              error: `Agent ${agentId} is not blocked on a question`,
            };
          }
          await answerQuestion(agentId, answer);
          return {
            success: true,
            data: {
              action: 'answer',
              answered: agentId,
              message: `Answer delivered to agent ${agentId}`,
            },
          };
        }

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Agent manager operation failed: ${message}`,
      };
    }
  },
});
