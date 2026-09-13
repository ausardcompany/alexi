/**
 * Tests for `boardWriteTool` recipient-state warning behaviour.
 *
 * Ports upstream kilocode `7febec58f` — when `kilo_board_write` targets a
 * specific `recipient` session that appears stopped or absent from the
 * board history, the tool STILL writes the message but surfaces a
 * `deliveryStatus: 'no-recipient'` result plus a human-readable `hint`
 * so the caller can react instead of silently dropping the message.
 *
 * The upstream fix is already implemented in `src/tool/tools/board.ts`
 * (issue #1713 is a verification / coverage task). These tests lock the
 * contract in so a regression cannot go unnoticed.
 *
 * We mock `BoardStore` at the module boundary so the tests do not need
 * the native `better-sqlite3` binding — the tool only ever calls two
 * store methods (`read` for the recent-history probe, `write` for the
 * append) and we drive both via `vi.fn()`.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Provider mocks / store mocks go BEFORE the imports of code under test
// so the vitest hoister sees them first. Even though `vi.mock` is hoisted
// automatically, keeping the order explicit avoids surprises when someone
// later adds a top-level import from the mocked module.
vi.mock('../../../src/core/database/boardStore.js', () => ({
  BoardStore: {
    read: vi.fn(),
    write: vi.fn(),
    ensure: vi.fn(),
    acknowledgeReads: vi.fn(),
    reset: vi.fn(),
    __resetForTests: vi.fn(),
  },
}));

import { boardWriteTool } from '../../../src/tool/tools/board.js';
import { BoardStore, type BoardMessage } from '../../../src/core/database/boardStore.js';
import { BoardContext } from '../../../src/core/database/boardContext.js';
import type { ToolContext } from '../../../src/tool/index.js';

const readMock = BoardStore.read as unknown as ReturnType<typeof vi.fn>;
const writeMock = BoardStore.write as unknown as ReturnType<typeof vi.fn>;

const BOARD_ID = 'board-under-test';
const SELF_SESSION = 'self-session';

function makeMessage(sessionID: string, id = 'm-' + sessionID): BoardMessage {
  return {
    id,
    boardId: BOARD_ID,
    sessionID,
    author: 'agent',
    content: 'hello',
    createdAt: new Date().toISOString(),
  };
}

function ctx(): ToolContext {
  return { workdir: process.cwd(), sessionId: SELF_SESSION };
}

describe('boardWriteTool recipient state warnings', () => {
  beforeEach(() => {
    readMock.mockReset();
    writeMock.mockReset();
    BoardContext.__resetForTests();
    BoardContext.attach(SELF_SESSION, BOARD_ID);
    // Default: writes always succeed and echo back a minimal row.
    writeMock.mockImplementation(async (_boardId: string) =>
      makeMessage('written-by-self', 'written-msg-id')
    );
  });

  it('warns when posting to a stopped recipient (recipient has no board activity)', async () => {
    // Board history contains messages from other sessions only — the
    // recipient never appears, so `recipientLooksStopped()` returns true.
    readMock.mockResolvedValueOnce([makeMessage('some-other-peer'), makeMessage('yet-another')]);

    const result = await boardWriteTool.execute(
      { content: 'ping', recipient: 'stopped-session-id' },
      ctx()
    );

    expect(result.success).toBe(true);
    expect(result.data?.deliveryStatus).toBe('no-recipient');
    expect(result.hint).toBeDefined();
    expect(result.hint).toContain('stopped-session-id');
    expect(result.hint).toContain('stopped or');
    // The message is still written — this is a warning, not a hard error.
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(result.data?.messageId).toBeDefined();
  });

  it('succeeds without warning when the recipient has recent board activity', async () => {
    readMock.mockResolvedValueOnce([
      makeMessage('some-other-peer'),
      makeMessage('active-session-id'),
    ]);

    const result = await boardWriteTool.execute(
      { content: 'ping', recipient: 'active-session-id' },
      ctx()
    );

    expect(result.success).toBe(true);
    expect(result.data?.deliveryStatus).toBe('delivered');
    expect(result.hint).toBeUndefined();
    expect(writeMock).toHaveBeenCalledTimes(1);
  });

  it('does not run the recipient probe when broadcasting (no recipient)', async () => {
    const result = await boardWriteTool.execute({ content: 'broadcast to all' }, ctx());

    expect(result.success).toBe(true);
    expect(result.data?.deliveryStatus).toBe('delivered');
    expect(result.hint).toBeUndefined();
    // No recipient => no need to inspect board history.
    expect(readMock).not.toHaveBeenCalled();
    expect(writeMock).toHaveBeenCalledTimes(1);
  });

  it('fails cleanly when no board is attached to the current session', async () => {
    BoardContext.__resetForTests();

    const result = await boardWriteTool.execute(
      { content: 'ping', recipient: 'stopped-session-id' },
      ctx()
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/no shared board/i);
    // Neither probe nor append should have been attempted.
    expect(readMock).not.toHaveBeenCalled();
    expect(writeMock).not.toHaveBeenCalled();
  });

  it('bounds the recipient probe to the most recent 100 messages', async () => {
    readMock.mockResolvedValueOnce([makeMessage('active-session-id')]);

    await boardWriteTool.execute({ content: 'ping', recipient: 'active-session-id' }, ctx());

    expect(readMock).toHaveBeenCalledTimes(1);
    // First arg is the board id, second is the options bag with `limit: 100`.
    const call = readMock.mock.calls[0];
    expect(call[0]).toBe(BOARD_ID);
    expect(call[1]).toMatchObject({ limit: 100 });
  });
});
