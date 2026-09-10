/**
 * BoardStore reset-semantics tests.
 *
 * Ports upstream kilocode `packages/opencode/test/kilocode/board/store.test.ts`
 * coverage for the board-reset behaviour introduced by migration
 * `20260903104806_kilocode_board_reset`: after `reset()`, subsequent
 * reads MUST skip every message posted before the reset boundary, but
 * physical rows MUST remain (`reset()` is a logical clear, not a
 * delete).
 *
 * These tests skip when `better-sqlite3` is not installed — the store
 * degrades to no-op behaviour in that case (`getDb()` returns null) and
 * the assertions below would be meaningless.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { BoardStore } from '../../src/core/database/boardStore.js';

const nodeRequire = createRequire(import.meta.url);
let nativeAvailable = true;
try {
  nodeRequire.resolve('better-sqlite3');
} catch {
  nativeAvailable = false;
}

const describeIfNative = nativeAvailable ? describe : describe.skip;

describeIfNative('BoardStore reset semantics', () => {
  let tmpHome: string;
  let originalHome: string | undefined;

  beforeEach(() => {
    // Redirect ~/.alexi to a temp dir so tests never touch the real home.
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-board-'));
    originalHome = process.env.HOME;
    process.env.HOME = tmpHome;
    // Also cover Windows where os.homedir() consults USERPROFILE.
    process.env.USERPROFILE = tmpHome;
    BoardStore.__resetForTests();
  });

  afterEach(() => {
    BoardStore.__resetForTests();
    if (originalHome !== undefined) {
      process.env.HOME = originalHome;
    } else {
      delete process.env.HOME;
    }
    try {
      fs.rmSync(tmpHome, { recursive: true, force: true });
    } catch {
      // best effort
    }
  });

  it('hides pre-reset messages from subsequent reads', async () => {
    const boardId = 'test-board-1';
    await BoardStore.ensure(boardId, 'task-1');

    await BoardStore.write(boardId, {
      sessionID: 's1',
      author: 'agent-a',
      content: 'pre-reset message 1',
    });
    await BoardStore.write(boardId, {
      sessionID: 's1',
      author: 'agent-a',
      content: 'pre-reset message 2',
    });

    const before = await BoardStore.read(boardId);
    expect(before).toHaveLength(2);

    // Ensure a strictly greater timestamp for post-reset writes so the
    // `> cleared_seq` filter unambiguously excludes pre-reset rows on
    // sub-millisecond systems.
    await new Promise((r) => setTimeout(r, 5));
    const clearedAt = await BoardStore.reset(boardId);
    expect(typeof clearedAt).toBe('string');
    expect(clearedAt).not.toBe('1970-01-01T00:00:00.000Z');
    await new Promise((r) => setTimeout(r, 5));

    // Immediately after reset, reads see nothing.
    const afterReset = await BoardStore.read(boardId);
    expect(afterReset).toHaveLength(0);

    // New writes after reset ARE visible.
    await BoardStore.write(boardId, {
      sessionID: 's1',
      author: 'agent-a',
      content: 'post-reset message',
    });
    const afterWrite = await BoardStore.read(boardId);
    expect(afterWrite).toHaveLength(1);
    expect(afterWrite[0]?.content).toBe('post-reset message');
  });

  it('preserves physical rows across resets (logical clear, not delete)', async () => {
    const boardId = 'test-board-2';
    await BoardStore.ensure(boardId, 'task-2');
    await BoardStore.write(boardId, {
      sessionID: 's1',
      author: 'agent',
      content: 'audit history',
    });
    await new Promise((r) => setTimeout(r, 5));
    await BoardStore.reset(boardId);

    // Reads hide the pre-reset row.
    expect(await BoardStore.read(boardId)).toHaveLength(0);

    // But `getClearedSeq` reflects a non-epoch value, proving the reset
    // marker is what caused the hidden read (not a physical delete).
    const seq = await BoardStore.getClearedSeq(boardId);
    expect(seq).not.toBe('1970-01-01T00:00:00.000Z');
  });

  it('getClearedSeq returns epoch for a board that has never been reset', async () => {
    const boardId = 'test-board-3';
    await BoardStore.ensure(boardId, 'task-3');
    const seq = await BoardStore.getClearedSeq(boardId);
    expect(seq).toBe('1970-01-01T00:00:00.000Z');
  });
});
