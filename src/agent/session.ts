/**
 * Agent session steering state.
 *
 * Ports upstream kilocode #14702 — "subagent steering". The parent TUI
 * can inject a mid-execution prompt into a running subagent without
 * stopping and restarting it. The steering flow is:
 *
 *   1. The user triggers Ctrl+S in the TUI while a subagent is active.
 *   2. {@link steerSubagent} is invoked with the subagent's session id
 *      (which is also its board recipient id in the Alexi swarm model)
 *      and the additional prompt text.
 *   3. The helper writes the prompt to the shared agent board via
 *      {@link BoardStore.write}, tagged `author: 'steering'`. The
 *      subagent's next turn reads the board (either via the
 *      `kilo_board_read` tool it already polls, or via the implicit
 *      read described in `src/tool/tools/board.ts`) and incorporates
 *      the message into its context.
 *   4. The helper records the latest steering prompt against the
 *      session id so the TUI can display it in the subagent view.
 *
 * Visual treatment lives in `src/cli/tui/components/SubagentView.tsx`;
 * this module only owns the data layer so the agent runtime stays
 * independent of the React/Ink layer.
 */
import { BoardStore } from '../core/database/boardStore.js';
import { BoardContext } from '../core/database/boardContext.js';

/**
 * In-memory map of subagent session id → latest steering prompt. Used
 * by the TUI to decorate the subagent view with the pending steering
 * context. Replaced on each new steering message (the latest wins);
 * callers that need an audit trail should read the board directly.
 */
const steeringState = new Map<string, string>();

/**
 * Shape of a successful steering operation. The caller (TUI) uses
 * `messageId` to correlate the posted board row with the visual state
 * it displays.
 */
export interface SteeringResult {
  messageId: string;
  boardId: string;
  prompt: string;
  deliveredAt: string;
}

/**
 * Post a steering prompt to a subagent via the shared agent board.
 *
 * ## Contract
 *
 * - When the target subagent has no attached board (e.g. the swarm
 *   feature is disabled, or the id does not resolve), returns `null`
 *   so the caller can surface a friendly "no active subagent" message
 *   instead of silently dropping the prompt.
 * - When the board layer is disabled (missing `better-sqlite3` binding),
 *   `BoardStore.write` degrades to a no-op but still returns a
 *   well-formed message; the caller sees the same success path, which
 *   matches the broader "board writes never throw" contract documented
 *   in `src/core/database/boardStore.ts`.
 * - The posted message's author is `steering` so the subagent's board
 *   polling loop can distinguish operator steering from peer chatter.
 *
 * The {@link SteeringResult.messageId} returned here is the row id in
 * `kilo_board_message`; callers can pass it to `BoardStore.read` to
 * verify delivery.
 */
export async function steerSubagent(
  subagentSessionId: string,
  prompt: string
): Promise<SteeringResult | null> {
  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return null;
  }
  const boardId = await BoardContext.resolve(subagentSessionId);
  if (!boardId) {
    return null;
  }
  const message = await BoardStore.write(boardId, {
    sessionID: subagentSessionId,
    author: 'steering',
    content: trimmed,
  });
  steeringState.set(subagentSessionId, trimmed);
  return {
    messageId: message.id,
    boardId,
    prompt: trimmed,
    deliveredAt: message.createdAt,
  };
}

/**
 * Return the most recent steering prompt posted to `subagentSessionId`,
 * or `undefined` when none has been recorded. Reads from the in-memory
 * cache populated by {@link steerSubagent}; survives for the lifetime
 * of the parent process only.
 */
export function getSteeringPrompt(subagentSessionId: string): string | undefined {
  return steeringState.get(subagentSessionId);
}

/**
 * Clear any recorded steering prompt for `subagentSessionId`. Called by
 * the TUI when the subagent view unmounts, and by tests to isolate
 * state between runs.
 */
export function clearSteeringPrompt(subagentSessionId: string): void {
  steeringState.delete(subagentSessionId);
}

/**
 * Test helper: drop every recorded steering prompt. Not part of the
 * public runtime API.
 */
export function __resetSteeringStateForTests(): void {
  steeringState.clear();
}
