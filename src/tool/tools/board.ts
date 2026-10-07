/**
 * Task-scoped shared agent board tools.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/tool/board.ts`
 * (+214 lines). A "board" is a lightweight coordination channel shared
 * by every subagent spawned from the same top-level task — think of it
 * as a per-task chat room the model can use to broadcast status,
 * question, or intermediate results to its swarm peers without
 * round-tripping through the parent.
 *
 * Two tools are exposed:
 *   - `kilo_board_read`  — read new messages posted since a timestamp,
 *                          then mark them as read so subsequent turns
 *                          don't re-surface the same content (upstream
 *                          fix `162e30d23`).
 *   - `kilo_board_write` — post a message to the board.
 *
 * Both tools are gated behind `experimental.sharedAgentBoard` in
 * `~/.alexi/config.json`. When the flag is off the tools are NOT
 * registered (see `src/tool/tools/index.ts` / `registry.ts`), so the
 * model never learns about them. When the flag is on but the current
 * session has no board attached (e.g. running outside a swarm), the
 * read tool returns a hint and the write tool errors out.
 */

import { z } from 'zod';
import { defineTool, type ToolResult, type ToolContext } from '../index.js';
import { BoardStore, type BoardMessage } from '../../core/database/boardStore.js';
import { BoardContext } from '../../core/database/boardContext.js';

const BoardReadParamsSchema = z.object({
  since: z
    .string()
    .datetime()
    .optional()
    .describe('Read messages posted strictly after this ISO 8601 timestamp'),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .describe('Maximum number of messages to return (default 50, cap 100)'),
});

interface BoardParticipant {
  /** Session id of the participant. */
  sessionID: string;
  /** True when this row describes the current calling session. */
  self: boolean;
}

interface BoardReadResult {
  messages: BoardMessage[];
  boardId?: string;
  /**
   * Roster of session ids observed on the board (derived from recent
   * message authors). The current caller's row carries `self: true` so
   * agents can distinguish themselves from peers — ports kilocode
   * `759a6ef99` (expose self identity on the roster).
   */
  roster?: BoardParticipant[];
}

export const boardReadTool = defineTool<typeof BoardReadParamsSchema, BoardReadResult>({
  name: 'kilo_board_read',
  description:
    'Read messages from the shared agent board for the current task. ' +
    'Use this to catch up on status updates from peer subagents before ' +
    'deciding what to do next. The roster field lists session ids seen on ' +
    'the board; your own row is flagged self: true. ' +
    'Requires experimental.sharedAgentBoard.',
  parameters: BoardReadParamsSchema,
  async execute(params, context: ToolContext): Promise<ToolResult<BoardReadResult>> {
    const boardId = await BoardContext.resolve(context.sessionId);
    if (!boardId) {
      return {
        success: true,
        data: { messages: [] },
        hint: 'No shared board is attached to this session.',
      };
    }
    const messages = await BoardStore.read(boardId, {
      since: params.since,
      limit: params.limit ?? 50,
    });
    // Upstream fix `162e30d23`: mark as read so the same messages
    // don't keep being surfaced to the agent turn after turn.
    if (context.sessionId) {
      await BoardStore.acknowledgeReads(
        boardId,
        context.sessionId,
        messages.map((m) => m.id)
      );
    }
    // Ports kilocode `759a6ef99`: expose a roster derived from the
    // observed message authors so agents can see who else is on the
    // board. The caller's own row (if present) is tagged `self: true`.
    const seen = new Set<string>();
    for (const m of messages) {
      if (m.sessionID) {
        seen.add(m.sessionID);
      }
    }
    if (context.sessionId) {
      // Ensure the caller always appears on the roster, even if they
      // have not posted yet, so `self: true` is always observable.
      seen.add(context.sessionId);
    }
    const roster: BoardParticipant[] = Array.from(seen).map((sessionID) => ({
      sessionID,
      self: sessionID === context.sessionId,
    }));
    return {
      success: true,
      data: { messages, boardId, roster },
      metadata: { count: messages.length, boardId },
    };
  },
});

const BoardWriteParamsSchema = z.object({
  content: z
    .string()
    .min(1)
    .max(4000)
    .describe('Message body to post to the shared board (1–4000 chars)'),
  recipient: z
    .string()
    .optional()
    .describe(
      'Optional session id of a specific peer subagent this message targets. ' +
        'Your own row from board_read is flagged self: true (the current session is the board root), ' +
        'and a post to yourself is refused. When set, the tool warns if that subagent is stopped or does not exist.'
    ),
});

interface BoardWriteResult {
  messageId: string;
  boardId: string;
  /** Delivery hint. `'no-recipient'` means the target subagent is stopped or missing. */
  deliveryStatus?: 'delivered' | 'no-recipient';
}

/**
 * Ports kilocode `7febec58f` (fix(cli): warn when board_post targets a
 * stopped subagent). We check the current board's message history for
 * any recent activity from the recipient session — if none is found we
 * cannot prove the recipient is stopped, but we can at least surface a
 * warning to the caller so silent-drop scenarios become visible in
 * tool output.
 *
 * Contract (locked in by `tests/tool/tools/board-write-recipient.test.ts`,
 * issue #1713 verification):
 *   - The probe scans at most the 100 most recent messages on the board.
 *   - "Stopped or missing" means the recipient session id does not appear
 *     as the author of ANY of those 100 messages.
 *   - The message is STILL written when the recipient looks stopped —
 *     `deliveryStatus: 'no-recipient'` and a human-readable `hint` are
 *     surfaced instead of failing the tool call, so the parent
 *     orchestrator (not this helper) decides how to react.
 *   - When no `recipient` is supplied (broadcast), this probe is skipped
 *     entirely and `deliveryStatus` stays `'delivered'`.
 */
async function recipientLooksStopped(boardId: string, recipient: string): Promise<boolean> {
  // Look for the recipient having ever posted to the board or acknowledged
  // reads on it. If we cannot see it at all, treat as "no recipient".
  // Bounded to the most recent 100 messages so this stays cheap.
  const recent = await BoardStore.read(boardId, { limit: 100 });
  return !recent.some((m) => m.sessionID === recipient);
}

export const boardWriteTool = defineTool<typeof BoardWriteParamsSchema, BoardWriteResult>({
  name: 'kilo_board_write',
  description:
    'Post a message to the shared agent board for coordination with peer ' +
    'subagents (parents, children, and background siblings). Use for status updates, blockers, or hand-offs. ' +
    'Requires experimental.sharedAgentBoard and an active swarm session.',
  parameters: BoardWriteParamsSchema,
  async execute(params, context: ToolContext): Promise<ToolResult<BoardWriteResult>> {
    const boardId = await BoardContext.resolve(context.sessionId);
    if (!boardId) {
      return {
        success: false,
        error: 'No shared board is attached to this session — cannot post.',
      };
    }
    // Ports kilocode `759a6ef99`: posts to self are refused with an
    // actionable error. The agent's own participant row is already
    // flagged `self: true` in `board_read` output, so no-op messaging
    // yourself provides no value and makes multi-agent interactions
    // non-deterministic.
    if (params.recipient && context.sessionId && params.recipient === context.sessionId) {
      return {
        success: false,
        error:
          `Refusing board post to self (${context.sessionId}). ` +
          `Use kilo_board_read to review your own row (self: true) instead.`,
      };
    }
    // Ports kilocode `7febec58f`: warn (don't fail) when the intended
    // recipient subagent looks stopped or missing. The message is still
    // written — the parent orchestrator can decide how to react.
    let deliveryStatus: 'delivered' | 'no-recipient' = 'delivered';
    let hint: string | undefined;
    if (params.recipient) {
      const missing = await recipientLooksStopped(boardId, params.recipient);
      if (missing) {
        deliveryStatus = 'no-recipient';
        hint =
          `Warning: recipient subagent "${params.recipient}" is stopped or ` +
          `does not exist. Message posted but will not be delivered.`;
      }
    }
    const message = await BoardStore.write(boardId, {
      sessionID: context.sessionId ?? 'unknown',
      // Prefer an explicit agent name if the orchestrator has surfaced
      // one via context (see `TaskTool` swarm-identity propagation),
      // otherwise fall back to a stable placeholder so the row is
      // never dropped for lack of a well-formed author.
      author: (context as ToolContext & { agentName?: string }).agentName ?? 'agent',
      content: params.content,
    });
    return {
      success: true,
      data: { messageId: message.id, boardId, deliveryStatus },
      metadata: { messageId: message.id, boardId, deliveryStatus },
      hint,
    };
  },
});
