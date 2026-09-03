/**
 * Shared Agent Board schema migration.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/board/store.ts`
 * (+ migration `20260828074139_kilocode_board.ts`, commit `162e30d23`).
 *
 * The Alexi migration runner (`src/core/database/migration.ts`) is
 * adapter-agnostic: it drives a `MigrationTx` whose only writer method is
 * `record(id)`. Actual DDL is issued through the caller's SQL adapter,
 * so we keep the SQL statements exported as constants (used by the
 * `run(sql)` wiring in `boardStore.ts`) and provide a thin `up()` that
 * dispatches those statements via the transaction interface. Concrete
 * migration adapters extend `MigrationTx` with an `execute(sql)` hook —
 * this file uses that hook when present, and no-ops when the adapter has
 * not yet wired it, so the schema can also be created eagerly by
 * `BoardStore.ensureSchema()` at first use.
 *
 * Alexi_change: no Effect-TS. The upstream migration is written in the
 * effect-sql style (`yield* tx.execute(...)`); Alexi's runner is plain
 * async / await, so we translate the same DDL into ordered `execute` calls.
 */

import type { Migration, MigrationTx } from '../migration.js';

/**
 * Ordered DDL applied by this migration. Exported so `BoardStore` can
 * eagerly create the schema on first use when no external migration
 * driver is wired up (e.g. tests spinning up a fresh `better-sqlite3`
 * connection).
 */
export const BOARD_SCHEMA_STATEMENTS: readonly string[] = Object.freeze([
  `CREATE TABLE IF NOT EXISTS kilo_board (
     id TEXT PRIMARY KEY,
     task_id TEXT NOT NULL,
     created_at TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS kilo_board_message (
     id TEXT PRIMARY KEY,
     board_id TEXT NOT NULL REFERENCES kilo_board(id) ON DELETE CASCADE,
     session_id TEXT NOT NULL,
     author TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TEXT NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_kilo_board_message_board
     ON kilo_board_message(board_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS kilo_board_read (
     board_id TEXT NOT NULL,
     session_id TEXT NOT NULL,
     message_id TEXT NOT NULL,
     PRIMARY KEY (board_id, session_id, message_id)
   )`,
]);

/**
 * Adapter-agnostic extension of `MigrationTx` used by migrations that need
 * to issue raw DDL. Concrete migration runners (better-sqlite3, effect-sql)
 * implement `execute` against the currently open transaction; the Alexi
 * base `MigrationTx` interface does not require it, so migrations MUST
 * check for its presence before dispatching.
 */
export interface DdlMigrationTx extends MigrationTx {
  execute?: (sql: string) => Promise<void> | void;
}

const migration: Migration = {
  id: '20260828074139_kilocode_board',
  async up(tx: DdlMigrationTx) {
    // Only run DDL if the adapter has wired `execute` through.
    // `BoardStore.ensureSchema()` handles the fallback path.
    if (typeof tx.execute !== 'function') {
      return;
    }
    for (const stmt of BOARD_SCHEMA_STATEMENTS) {
      await tx.execute(stmt);
    }
  },
};

export default migration;
