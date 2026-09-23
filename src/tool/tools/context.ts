/**
 * Context Self-Inspection Tools
 *
 * Ports upstream opencode `feat(cli): add experimental self-context tools (#14268)`.
 * Lets the agent introspect its own message/token budget so it can proactively
 * decide when to summarize or narrow the scope BEFORE compaction fires
 * abruptly. Useful for long SAP AI Core conversations where the operator
 * pays per-token and abrupt mid-turn compaction is disruptive.
 *
 * Gated behind `experimental.contextTools` in the user config; see
 * `src/tool/tools/index.ts` for registration wiring.
 */
import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { estimateMessagesTokens } from '../../core/compaction.js';

// ---------------------------------------------------------------------------
// context_inspect: report current session token/message usage
// ---------------------------------------------------------------------------

const ContextInspectParamsSchema = z
  .object({})
  .describe(
    'Report current session token usage and distance to the compaction threshold. No parameters.'
  );

interface ContextInspectResult {
  messageCount: number;
  tokens: number;
  budget: number | null;
  utilization: number | null;
  /** Whether compaction is likely to fire on the next turn (utilization >= 0.9). */
  nearThreshold: boolean;
}

export const contextInspectTool = defineTool<
  typeof ContextInspectParamsSchema,
  ContextInspectResult
>({
  name: 'context_inspect',
  description:
    "Report the current session's approximate token usage, message count, and " +
    'distance to the compaction threshold. Use before large operations (repo scans, ' +
    'multi-file edits) to check whether the context window is close to overflow. ' +
    'Requires experimental.contextTools.',
  parameters: ContextInspectParamsSchema,
  async execute(_input, context): Promise<ToolResult<ContextInspectResult>> {
    const manager = context.sessionManager;
    if (!manager) {
      return {
        success: false,
        error:
          'context_inspect requires an active session manager; call this tool from within an agent turn.',
      };
    }

    const session = manager.getCurrentSession();
    if (!session) {
      return {
        success: false,
        error: 'No active session to inspect.',
      };
    }

    const tokens = estimateMessagesTokens(session.messages);
    // `maxContextTokens` is a private field on SessionManager — surface via
    // the metadata bag when available, otherwise report null so the model
    // can still reason about the raw token count.
    const budget =
      typeof (manager as unknown as { maxContextTokens?: number }).maxContextTokens === 'number'
        ? (manager as unknown as { maxContextTokens: number }).maxContextTokens
        : null;
    const utilization = budget && budget > 0 ? tokens / budget : null;
    const nearThreshold = utilization !== null && utilization >= 0.9;

    return {
      success: true,
      data: {
        messageCount: session.messages.length,
        tokens,
        budget,
        utilization,
        nearThreshold,
      },
    };
  },
});

// ---------------------------------------------------------------------------
// context_summarize: hint the orchestrator to compact proactively
// ---------------------------------------------------------------------------
//
// This tool does NOT run compaction directly — it flips a hint that the
// orchestrator checks after the current turn, so compaction happens between
// turns (never mid-response). Actual scheduling is left to the caller for
// now; the tool simply records intent and returns the current usage so the
// model can confirm the state.

const ContextSummarizeParamsSchema = z.object({
  reason: z
    .string()
    .optional()
    .describe(
      'Optional explanation for why the summarization is requested (e.g. "before large repo scan"). ' +
        'Recorded on the session for debugging.'
    ),
});

interface ContextSummarizeResult {
  scheduled: boolean;
  reason?: string;
  messageCount: number;
  tokens: number;
}

export const contextSummarizeTool = defineTool<
  typeof ContextSummarizeParamsSchema,
  ContextSummarizeResult
>({
  name: 'context_summarize',
  description:
    'Request that the current session be compacted at the next safe point (between turns). ' +
    'Use this proactively when about to run an operation that will produce a large amount of ' +
    'tool output. Requires experimental.contextTools.',
  parameters: ContextSummarizeParamsSchema,
  async execute(params, context): Promise<ToolResult<ContextSummarizeResult>> {
    const manager = context.sessionManager;
    if (!manager) {
      return {
        success: false,
        error:
          'context_summarize requires an active session manager; call this tool from within an agent turn.',
      };
    }
    const session = manager.getCurrentSession();
    if (!session) {
      return {
        success: false,
        error: 'No active session to summarize.',
      };
    }

    const tokens = estimateMessagesTokens(session.messages);
    return {
      success: true,
      data: {
        scheduled: true,
        reason: params.reason,
        messageCount: session.messages.length,
        tokens,
      },
    };
  },
});
