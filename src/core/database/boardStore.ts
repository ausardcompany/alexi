/**
 * Board Store — SQLite-backed persistence for the task-scoped shared
 * agent board.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/board/store.ts`
 * (+716 lines) and its accompanying migration
 * `20260828074139_kilocode_board.ts`. Multi-agent swarms use this table
 * as a lightweight coordination channel: one board per task, each peer
 * agent reads/writes messages tagged with its author.
 *
 * Alexi_change: the upstream store depends on Effect-TS and the
 * `Database.run` layer. Alexi does not use Effect-TS; we mirror the
 * existing `session/search.ts` pattern instead — lazy `better-sqlite3`
 * load via `createRequire`, graceful degradation when the native
 * binding is missing (returns empty reads, no-op writes), and a single
 * on-disk DB file at `~/.alexi/board.db` (separate from the sessions
 * FTS index so a corrupted board cannot poison session search).
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { randomUUID } from 'crypto';
import { BOARD_SCHEMA_STATEMENTS } from './migrations/20260828074139_kilocode_board.js';
import { BOARD_RESET_SCHEMA_STATEMENTS } from './migrations/20260903104806_kilocode_board_reset.js';

const nodeRequire = createRequire(import.meta.url);

type BetterSqliteDatabase = {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    run: (...args: unknown[]) => { changes: number };
    all: (...args: unknown[]) => unknown[];
    get: (...args: unknown[]) => unknown;
  };
  close: () => void;
};

export interface BoardMessage {
  id: string;
  boardId: string;
  sessionID: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface BoardWriteInput {
  sessionID: string;
  author: string;
  content: string;
}

export interface BoardReadOptions {
  /** ISO timestamp — only return messages strictly newer than this. */
  since?: string;
  /** Maximum number of messages to return. Defaults to 50. */
  limit?: number;
}

/**
 * Row shape returned by the prepared SELECT. `better-sqlite3` returns
 * `unknown[]`; the columns are aliased so consumers can cast to this.
 */
interface BoardMessageRow {
  id: string;
  boardId: string;
  sessionID: string;
  author: string;
  content: string;
  createdAt: string;
}

let dbInstance: BetterSqliteDatabase | null = null;
let disabled = false;

/**
 * Lazily open (and initialise the schema on) the board database. Returns
 * `null` when the native binding is unavailable — callers MUST treat
 * `null` as "board disabled" and degrade to no-op behaviour.
 */
function getDb(): BetterSqliteDatabase | null {
  if (disabled) {
    return null;
  }
  if (dbInstance) {
    return dbInstance;
  }
  const dir = path.join(os.homedir(), '.alexi');
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const Driver = nodeRequire('better-sqlite3') as new (p: string) => BetterSqliteDatabase;
    const db = new Driver(path.join(dir, 'board.db'));
    // Apply schema eagerly. Statements are idempotent (`CREATE ... IF NOT
    // EXISTS`) so re-running on every open is safe and lets us skip
    // integrating with the migration runner for the initial land.
    for (const stmt of BOARD_SCHEMA_STATEMENTS) {
      db.exec(stmt);
    }
    // Apply the reset-support migration eagerly too. `ALTER TABLE ADD
    // COLUMN` is not idempotent in SQLite (no `IF NOT EXISTS`), so
    // swallow "duplicate column" errors from the second open onwards.
    for (const stmt of BOARD_RESET_SCHEMA_STATEMENTS) {
      try {
        db.exec(stmt);
      } catch (err) {
        const msg = (err as Error).message ?? '';
        if (!/duplicate column name/i.test(msg)) {
          throw err;
        }
      }
    }
    dbInstance = db;
    return dbInstance;
  } catch {
    // Native binding failed to load or DB creation errored — disable
    // the store for the rest of the process lifetime. All public
    // methods below return their empty / no-op default so callers do
    // not need extra error handling.
    disabled = true;
    return null;
  }
}

export const BoardStore = {
  /**
   * Ensure a board row exists for the given `(boardId, taskId)` pair.
   * Idempotent: repeat calls with the same id are no-ops.
   */
  async ensure(boardId: string, taskId: string): Promise<void> {
    const db = getDb();
    if (!db) {
      return;
    }
    db.prepare(
      `INSERT INTO kilo_board (id, task_id, created_at)
       VALUES (?, ?, ?)
       ON CONFLICT(id) DO NOTHING`
    ).run(boardId, taskId, new Date().toISOString());
  },

  /**
   * Append a message to a board. Returns the fully-formed row (id
   * generated locally via `crypto.randomUUID`).
   */
  async write(boardId: string, input: BoardWriteInput): Promise<BoardMessage> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const message: BoardMessage = { id, boardId, ...input, createdAt };
    const db = getDb();
    if (!db) {
      // Store disabled — return the message shape anyway so callers can
      // continue their control flow without special-casing the no-op.
      return message;
    }
    db.prepare(
      `INSERT INTO kilo_board_message
         (id, board_id, session_id, author, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, boardId, input.sessionID, input.author, input.content, createdAt);
    return message;
  },

  /**
   * Read messages from a board in chronological order.
   *
   * Ports kilocode PR #13782: reads now filter out any message whose
   * `created_at` predates the board's `cleared_seq` watermark, so a
   * `reset()` call durably hides prior messages from every reader
   * without deleting rows. `cleared_seq` is stored as Unix milliseconds
   * (see `reset`).
   */
  async read(boardId: string, opts: BoardReadOptions = {}): Promise<BoardMessage[]> {
    const db = getDb();
    if (!db) {
      return [];
    }
    const limit = opts.limit ?? 50;
    // Pull the cleared watermark for this board. Rows still hidden by
    // the watermark are filtered in JS to keep the SQL simple and
    // adapter-agnostic — the row count per board is bounded by
    // `limit` upstream anyway.
    const boardRow = db
      .prepare(`SELECT cleared_seq AS clearedSeq FROM kilo_board WHERE id = ?`)
      .get(boardId) as { clearedSeq?: number } | undefined;
    const clearedSeq = boardRow?.clearedSeq ?? 0;

    const sql = opts.since
      ? `SELECT id, board_id AS boardId, session_id AS sessionID, author, content,
                created_at AS createdAt
           FROM kilo_board_message
           WHERE board_id = ? AND created_at > ?
           ORDER BY created_at ASC
           LIMIT ?`
      : `SELECT id, board_id AS boardId, session_id AS sessionID, author, content,
                created_at AS createdAt
           FROM kilo_board_message
           WHERE board_id = ?
           ORDER BY created_at ASC
           LIMIT ?`;
    const rows = opts.since
      ? (db.prepare(sql).all(boardId, opts.since, limit) as BoardMessageRow[])
      : (db.prepare(sql).all(boardId, limit) as BoardMessageRow[]);
    if (clearedSeq <= 0) {
      return rows;
    }
    return rows.filter((r) => {
      const ts = Date.parse(r.createdAt);
      return Number.isFinite(ts) ? ts > clearedSeq : true;
    });
  },

  /**
   * Reset the board view — hide every message currently on the board
   * from future `read()` calls without deleting rows. Ports kilocode
   * PR #13782 (`cleared_seq` watermark). Idempotent: repeat calls
   * simply push the watermark forward.
   */
  async reset(boardId: string): Promise<void> {
    const db = getDb();
    if (!db) {
      return;
    }
    const now = Date.now();
    db.prepare(`UPDATE kilo_board SET cleared_seq = ? WHERE id = ?`).run(now, boardId);
  },

  /**
   * Mark messages as read by a specific session. Ports kilocode fix
   * `162e30d23`: without an ack table, agents keep seeing the same
   * "new messages" banner on every turn (stale shared-board notices).
   */
  async acknowledgeReads(
    boardId: string,
    sessionID: string,
    messageIds: readonly string[]
  ): Promise<void> {
    if (messageIds.length === 0) {
      return;
    }
    const db = getDb();
    if (!db) {
      return;
    }
    const placeholders = messageIds.map(() => '(?, ?, ?)').join(',');
    const stmt = db.prepare(
      `INSERT INTO kilo_board_read (board_id, session_id, message_id)
       VALUES ${placeholders}
       ON CONFLICT DO NOTHING`
    );
    const params: string[] = [];
    for (const id of messageIds) {
      params.push(boardId, sessionID, id);
    }
    stmt.run(...params);
  },

  /**
   * Test helper: reset the in-memory singleton so a suite can rebuild
   * the store against a fresh DB. NOT part of the public runtime API.
   */
  __resetForTests(): void {
    if (dbInstance) {
      try {
        dbInstance.close();
      } catch {
        // ignore
      }
    }
    dbInstance = null;
    disabled = false;
  },
};
