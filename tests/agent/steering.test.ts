/**
 * Tests for subagent steering (issue #1924 / kilocode #14702).
 *
 * Steering lets the user inject a mid-execution prompt into a running
 * subagent without stopping and restarting it. The data layer lives in
 * `src/agent/session.ts`; it posts to the shared agent board (where the
 * subagent polls board messages) and caches the latest prompt locally
 * for the TUI to render.
 *
 * These tests exercise the data-layer contract — the TUI integration
 * (keyboard shortcut + visual treatment) is covered by the smoke tests
 * under `tests/tui/`.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import {
  __resetSteeringStateForTests,
  clearSteeringPrompt,
  getSteeringPrompt,
  steerSubagent,
} from '../../src/agent/session.js';
import { BoardStore } from '../../src/core/database/boardStore.js';
import { BoardContext } from '../../src/core/database/boardContext.js';

let counter = 0;
function nextIds(): { subagentId: string; boardId: string } {
  counter += 1;
  return {
    subagentId: `session-sub-steering-${Date.now()}-${counter}`,
    boardId: `board-sub-steering-${Date.now()}-${counter}`,
  };
}

describe('steerSubagent', () => {
  beforeEach(() => {
    __resetSteeringStateForTests();
    BoardContext.__resetForTests();
    BoardStore.__resetForTests();
  });

  it('returns null when the subagent has no attached board', async () => {
    const result = await steerSubagent('session-with-no-board', 'focus on auth');
    expect(result).toBeNull();
    // No local state was recorded either.
    expect(getSteeringPrompt('session-with-no-board')).toBeUndefined();
  });

  it('returns null when the prompt is empty / whitespace-only', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    expect(await steerSubagent(subagentId, '')).toBeNull();
    expect(await steerSubagent(subagentId, '    ')).toBeNull();
    expect(getSteeringPrompt(subagentId)).toBeUndefined();
  });

  it('posts to the shared board and caches the latest prompt', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    await BoardStore.ensure(boardId, 'task-steering');

    const result = await steerSubagent(subagentId, 'focus on edge cases');
    expect(result).not.toBeNull();
    expect(result?.boardId).toBe(boardId);
    expect(result?.prompt).toBe('focus on edge cases');
    expect(result?.messageId).toBeTypeOf('string');
    expect(result?.deliveredAt).toBeTypeOf('string');

    // Local cache mirrors the posted prompt so the TUI can render it.
    expect(getSteeringPrompt(subagentId)).toBe('focus on edge cases');
  });

  it('posts the message with author "steering" so the subagent can distinguish it from peer chatter', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    await BoardStore.ensure(boardId, 'task-steering');

    await steerSubagent(subagentId, 'use the staging database');
    const messages = await BoardStore.read(boardId);
    // The board module gracefully no-ops when the native sqlite binding
    // is missing (CI without better-sqlite3). In that mode `read()`
    // returns an empty array; otherwise we assert on the author tag.
    if (messages.length === 0) {
      return;
    }
    const steeringMsg = messages.find((m) => m.content === 'use the staging database');
    expect(steeringMsg).toBeDefined();
    expect(steeringMsg?.author).toBe('steering');
    expect(steeringMsg?.sessionID).toBe(subagentId);
  });

  it('replaces the previous steering prompt when a new one is posted (latest wins)', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    await BoardStore.ensure(boardId, 'task-steering');

    await steerSubagent(subagentId, 'first guidance');
    await steerSubagent(subagentId, 'second guidance');

    expect(getSteeringPrompt(subagentId)).toBe('second guidance');
  });

  it('trims whitespace from the prompt before posting', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    await BoardStore.ensure(boardId, 'task-steering');

    const result = await steerSubagent(subagentId, '   actually use the staging db   ');
    expect(result?.prompt).toBe('actually use the staging db');
    expect(getSteeringPrompt(subagentId)).toBe('actually use the staging db');
  });

  it('clearSteeringPrompt drops the cached prompt', async () => {
    const { subagentId, boardId } = nextIds();
    BoardContext.attach(subagentId, boardId);
    await BoardStore.ensure(boardId, 'task-steering');

    await steerSubagent(subagentId, 'focus on tests');
    expect(getSteeringPrompt(subagentId)).toBe('focus on tests');

    clearSteeringPrompt(subagentId);
    expect(getSteeringPrompt(subagentId)).toBeUndefined();
  });
});
