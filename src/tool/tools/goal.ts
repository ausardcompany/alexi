/**
 * Goal Tool - Arm a persistent multi-turn goal on the current session.
 *
 * Sets `session.metadata.goal = { description, target?, armed: true,
 * createdAt }` on the active session so the agentic chat loop can inject
 * a continuation reminder after the model returns text with no tool calls.
 *
 * Requires the `goal` permission (mapped to the `admin` permission action
 * so it flows through the standard permission manager). Does NOT terminate
 * the current turn — the tool returns a success result so the model can
 * keep working; the continuation loop lives in `agenticChat.ts`.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { SessionGoalUpdated } from '../../bus/index.js';

const GoalParamsSchema = z.object({
  description: z
    .string()
    .min(1)
    .describe('High-level goal the agent should keep working toward across multiple turns.'),
  target: z
    .string()
    .optional()
    .describe(
      'Optional concrete completion target (e.g. a file path, PR number, or acceptance criterion).'
    ),
});

export interface GoalToolResult {
  armed: boolean;
  description: string;
  target?: string;
  createdAt: number;
}

/**
 * Message shown when the tool executes without an attached SessionManager
 * (unit tests, ad-hoc one-shot calls). We still return `success: true` so
 * the model gets a stable contract, but the goal is not persisted.
 */
const NO_SESSION_HINT =
  'Goal recorded transiently: no active session was attached, so the goal will not survive the current turn.';

export const goalTool = defineTool<typeof GoalParamsSchema, GoalToolResult>({
  name: 'goal',
  description: `Arm a persistent multi-turn goal for the current session.

Use this to declare a high-level objective the agent should keep working
toward across multiple assistant turns. After each turn that ends with a
text response (no tool calls), the orchestrator injects a continuation
system reminder referencing the goal description so the model self-drives
until the goal is cleared (via the \`alexi goal clear\` CLI command or by
setting a new goal that supersedes it).

- \`description\` (required): the goal in plain language, e.g. "implement
  agent goal tool with tests and open a PR".
- \`target\` (optional): a concrete completion target such as a file path,
  PR number, or acceptance criterion.

Setting a goal does NOT stop the current turn — the tool returns
immediately so the model can continue executing the plan. The goal
persists on session metadata until explicitly cleared.`,

  parameters: GoalParamsSchema,

  permission: {
    action: 'goal',
    getResource: () => 'session.metadata.goal',
  },

  async execute(params, context): Promise<ToolResult<GoalToolResult>> {
    const createdAt = Date.now();

    const description = params.description.trim();
    if (!description) {
      return {
        success: false,
        error: 'Goal description must not be empty.',
      };
    }

    const target = params.target?.trim() ? params.target.trim() : undefined;

    const sessionManager = context.sessionManager;
    if (!sessionManager) {
      // Fallback: no session store attached. Return a success-shaped
      // result with a hint so tests / one-shot callers can still verify
      // the tool contract without a full runtime.
      return {
        success: true,
        data: {
          armed: true,
          description,
          target,
          createdAt,
        },
        hint: NO_SESSION_HINT,
      };
    }

    const session = sessionManager.getCurrentSession();
    if (!session) {
      return {
        success: false,
        error: 'No active session — cannot arm a goal without a current conversation.',
      };
    }

    session.metadata.goal = {
      description,
      target,
      armed: true,
      createdAt,
    };

    try {
      sessionManager.persistActiveSession();
    } catch {
      // Non-fatal: the in-memory metadata is still updated and the next
      // addMessage() call will persist. We deliberately swallow rather
      // than fail the tool call because a persistence hiccup should not
      // block the model's next step.
    }

    try {
      SessionGoalUpdated.publish({
        sessionId: session.metadata.id,
        description,
        target: target ?? null,
        armed: true,
        timestamp: createdAt,
      });
    } catch {
      // Bus publish failure is non-fatal — TUI surfaces will simply
      // miss the update until the next natural re-render.
    }

    return {
      success: true,
      data: {
        armed: true,
        description,
        target,
        createdAt,
      },
    };
  },
});
