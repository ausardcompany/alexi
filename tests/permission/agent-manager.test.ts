/**
 * Tests for `src/permission/agent-manager.ts`.
 *
 * Verifies:
 *  - `isBlocked` returns `true` when a blocker is set.
 *  - `isBlocked` returns `false` when no blocker exists.
 *  - `isBlocked` FAILS CLOSED (returns `true`) when the store throws,
 *    per opencode fix `98559c9d6` — this is the key invariant that
 *    prevents accidental permission bypass on stale/broken state.
 *  - `answerQuestion` clears the pending blocker.
 */

import { afterEach, describe, expect, it } from 'vitest';

import {
  _resetBlockerStoreForTests,
  answerQuestion,
  getBlocker,
  isBlocked,
  setBlocker,
  setBlockerStore,
  type Blocker,
  type BlockerStore,
} from '../../src/permission/agent-manager.js';

afterEach(() => {
  _resetBlockerStoreForTests();
});

describe('permission/agent-manager', () => {
  it('returns true when a question blocker is set', async () => {
    await setBlocker('agent-1', { kind: 'question', prompt: 'proceed?' });
    expect(await isBlocked('agent-1')).toBe(true);
  });

  it('returns false when no blocker is recorded', async () => {
    expect(await isBlocked('nobody')).toBe(false);
  });

  it('answerQuestion clears the pending blocker', async () => {
    await setBlocker('agent-2', { kind: 'question' });
    await answerQuestion('agent-2', 'yes');
    expect(await isBlocked('agent-2')).toBe(false);
    expect(await getBlocker('agent-2')).toBeUndefined();
  });

  it('fails closed (returns true) when the store throws', async () => {
    const throwing: BlockerStore = {
      async get(): Promise<Blocker | undefined> {
        throw new Error('backing store unavailable');
      },
      async set(): Promise<void> {
        throw new Error('backing store unavailable');
      },
      async clear(): Promise<void> {
        throw new Error('backing store unavailable');
      },
    };
    setBlockerStore(throwing);
    // The invariant that upstream 98559c9d6 pinned down: a lookup error
    // must NOT be treated as "not blocked". Doing so would let a caller
    // silently bypass a real blocker on transient IO failure.
    expect(await isBlocked('any-agent')).toBe(true);
  });
});
