/**
 * Agent Manager Tool - Manage and orchestrate multiple agent sessions
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { getBlocker, answerQuestion } from '../../permission/agent-manager.js';
import { selectModel, isSelectModelError } from '../model-selection.js';

/**
 * Preprocessor that accepts either a structured object OR a JSON-encoded
 * string and hands the parsed object back to Zod. Ports upstream kilocode
 * commit `02df76976` (`fix(agent-manager): decode JSON-encoded task
 * arrays`) — some models (Anthropic in particular) emit structured
 * tool-call parameters as a JSON string rather than the native object
 * shape, which then fails schema validation. Wrapping the config object
 * (and other structural fields that models tend to over-encode) with
 * this preprocessor lets the tool tolerate both shapes without provider-
 * specific handling upstream.
 *
 * Only strings that look like JSON objects/arrays are parsed; primitive
 * strings and non-string values pass through unchanged so the wrapped
 * schema can still emit a useful validation error.
 */
function decodeJsonIfString<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) {
      return value;
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through with the original string so the wrapped schema can
      // produce a descriptive validation error instead of a JSON parse
      // exception surfacing as a tool crash.
      return value;
    }
  }, schema);
}

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
  config: decodeJsonIfString(
    z
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
      .describe('Configuration for session creation')
  ),
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
    /**
     * Resolved model id after `selectModel()` when `config.model` was
     * supplied on create. Ports upstream ab143253a: subagents that opt
     * into per-task model selection surface the resolved (providerID,
     * modelID) so the parent orchestrator can log which model actually
     * ran instead of the free-form request string.
     */
    model?: string;
    /** Resolved provider id when `config.model` was supplied on create. */
    provider?: string;
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

          // Resolve the requested (model, provider) pair through the shared
          // `selectModel()` helper — ports upstream ab143253a which
          // extracted the resolution logic out of this file into
          // `src/tool/model-selection.ts`. When no model is requested we
          // fall through to Alexi's runtime default (SAP AI Core).
          let resolvedModel: string | undefined;
          let resolvedProvider: string | undefined;
          if (config?.model?.trim()) {
            const resolution = selectModel(
              { model: config.model.trim(), variant: providerHint || undefined }
              // No `preferredProviderID` yet — thread through when the
              // orchestrator's current-turn provider becomes reachable
              // from the tool context.
            );
            if (isSelectModelError(resolution)) {
              return {
                success: false,
                error: resolution.error,
              };
            }
            resolvedModel = resolution.modelID;
            resolvedProvider = resolution.providerID;
          }

          return {
            success: true,
            data: {
              action: 'create',
              session: {
                id: newSessionId,
                status: excludeLocalState ? 'created-fresh' : 'created',
                ...(resolvedModel ? { model: resolvedModel } : {}),
                ...(resolvedProvider ? { provider: resolvedProvider } : {}),
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

          // Stop the specified session.
          //
          // Ports upstream kilocode 2026-08 sync: cancelled agent
          // sessions must stay in the `idle` state (not `stopped` /
          // `running`) so the TUI's activity indicator renders as
          // idle-neutral instead of the "still running" spinner or
          // the "terminated" error glyph. Callers that need to
          // distinguish "user pressed cancel" from "never ran" can
          // still inspect `message`.
          return {
            success: true,
            data: {
              action: 'stop',
              session: {
                id: sessionId,
                status: 'idle',
              },
              message: `Cancelled session: ${sessionId}`,
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
