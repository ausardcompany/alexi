/**
 * Shared Agent Board — reset support.
 *
 * Ports upstream kilocode PR #13782: adds a `cleared_seq` column to
 * `kilo_board` so participants can reset the board view (hide all
 * messages up to a given sequence) without physically deleting rows.
 *
 * Prior to this migration a swarm member had to either delete every
 * `kilo_board_message` row to reset context (destructive, races with
 * peers still reading) or maintain the "cleared" watermark in the
 * agent's own memory (lost across process restarts). Storing the
 * watermark on the board row makes it durable and shareable.
 *
 * Alexi_change: like the parent `20260828074139_kilocode_board`
 * migration, this file exports its DDL as a constant so
 * `BoardStore.ensureSchema` can also apply it eagerly at first open —
 * `ALTER TABLE ... ADD COLUMN` is not guarded by `IF NOT EXISTS` in
 * SQLite, so the eager path has to catch the "duplicate column" error
 * and treat it as success.
 */

import type { Migration, MigrationTx } from '../migration.js';
import type { DdlMigrationTx } from './20260828074139_kilocode_board.js';

/**
 * DDL applied by this migration. Exported so `BoardStore` can eagerly
 * apply the column addition when the migration runner adapter has not
 * yet wired an `execute` hook (mirrors the parent board migration).
 */
export const BOARD_RESET_SCHEMA_STATEMENTS: readonly string[] = Object.freeze([
  `ALTER TABLE kilo_board ADD COLUMN cleared_seq INTEGER NOT NULL DEFAULT 0`,
]);

const migration: Migration = {
  id: '20260903104806_kilocode_board_reset',
  async up(tx: MigrationTx) {
    const ddlTx = tx as DdlMigrationTx;
    // Only run DDL if the adapter has wired `execute` through — the
    // eager `BoardStore.ensureSchema()` path handles the fallback.
    if (typeof ddlTx.execute !== 'function') {
      return;
    }
    for (const stmt of BOARD_RESET_SCHEMA_STATEMENTS) {
      await ddlTx.execute(stmt);
    }
  },
};

export default migration;
