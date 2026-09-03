/**
 * Board Context — resolve which shared board belongs to a given
 * subagent session.
 *
 * Ports the upstream kilocode `BoardContext.resolve(sessionID)` helper
 * (commit `beb84eb50`, "expose swarm agent identity and execution
 * state"). The parent `task` tool decides when to open a new board and
 * `attach()`es every child session it spawns to the same board id; child
 * sessions then read back the id via `resolve()` to find the peers they
 * share coordination messages with.
 *
 * Alexi_change: upstream stores context in an Effect-TS request-scoped
 * layer. Alexi uses a plain in-memory `Map<sessionID, boardID>` — the
 * `taskStore` already runs single-process so a module-level map is
 * good enough; when we grow multi-process swarms we can move it into
 * `board.db` next to the messages.
 */

/**
 * Association between a session id and the board it participates in.
 * Populated by the `task` tool when spawning a swarm; consumed by the
 * `kilo_board_*` tools to look up which board they should write to.
 */
const sessionBoardIndex = new Map<string, string>();

export const BoardContext = {
  /**
   * Attach a session to a board. Called by `TaskTool` when spawning a
   * subagent that participates in a shared swarm, and by the `task`
   * tool's board-init path when creating the board for the first time.
   * Idempotent: repeated calls overwrite the mapping (agents cannot
   * hop between boards mid-task under the current contract, but tests
   * exercise this by re-registering the same session/board pair).
   */
  attach(sessionID: string, boardId: string): void {
    sessionBoardIndex.set(sessionID, boardId);
  },

  /**
   * Look up the board id for a session, or `undefined` if the session
   * is not participating in a swarm. Board tools MUST treat `undefined`
   * as "no shared board for this task" (the read tool returns a
   * user-facing hint, the write tool throws).
   */
  async resolve(sessionID: string | undefined): Promise<string | undefined> {
    if (!sessionID) {
      return undefined;
    }
    return sessionBoardIndex.get(sessionID);
  },

  /**
   * Detach a session from its board (called on session close). Safe to
   * call for a session that was never attached.
   */
  detach(sessionID: string): void {
    sessionBoardIndex.delete(sessionID);
  },

  /**
   * Test helper: clear every session→board mapping. NOT part of the
   * public runtime API.
   */
  __resetForTests(): void {
    sessionBoardIndex.clear();
  },
};
