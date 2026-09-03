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

interface BoardReadResult {
  messages: BoardMessage[];
  boardId?: string;
}

export const boardReadTool = defineTool<typeof BoardReadParamsSchema, BoardReadResult>({
  name: 'kilo_board_read',
  description:
    'Read messages from the shared agent board for the current task. ' +
    'Use this to catch up on status updates from peer subagents before ' +
    'deciding what to do next. Requires experimental.sharedAgentBoard.',
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
    return {
      success: true,
      data: { messages, boardId },
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
});

interface BoardWriteResult {
  messageId: string;
  boardId: string;
}

export const boardWriteTool = defineTool<typeof BoardWriteParamsSchema, BoardWriteResult>({
  name: 'kilo_board_write',
  description:
    'Post a message to the shared agent board for coordination with peer ' +
    'subagents. Use for status updates, blockers, or hand-offs. ' +
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
      data: { messageId: message.id, boardId },
      metadata: { messageId: message.id, boardId },
    };
  },
});
