/**
 * Board Reset Migration — add `cleared_seq` gating column to `kilo_board`.
 *
 * Ports upstream kilocode migration
 * `20260903104806_kilocode_board_reset.ts` (commit `feat(board): reset`) —
 * introduces the `cleared_seq` column on `kilo_board` so board resets can
 * hide messages emitted before the reset without deleting rows. Reads
 * downstream of this migration filter `kilo_board_message.seq` (or the
 * closest surrogate; Alexi uses `created_at` today) against the board's
 * `cleared_seq` value.
 *
 * The migration also augments the eager schema statements applied by
 * `BoardStore.ensureSchema()` (see `20260828074139_kilocode_board.ts`),
 * so a fresh DB created before this migration runs still gets the column
 * on first open. That mirrors kilocode's `schema.gen.ts` pattern where the
 * generated CREATE TABLE always reflects the latest shape.
 */

import type { Migration, MigrationTx } from '../migration.js';

/**
 * DDL applied by this migration. Kept exported so `BoardStore` can also
 * apply it eagerly against a freshly-created DB (idempotent `ALTER
 * TABLE ... ADD COLUMN` guarded by a PRAGMA check at the call site).
 */
export const BOARD_RESET_DDL: readonly string[] = Object.freeze([
  // SQLite has no `ADD COLUMN IF NOT EXISTS`; callers guard with a
  // pragma_table_info() lookup. The migration runner records the id so
  // repeat calls of `applyMigrations` skip the DDL entirely.
  `ALTER TABLE kilo_board ADD COLUMN cleared_seq INTEGER NOT NULL DEFAULT 0`,
]);

interface DdlMigrationTx extends MigrationTx {
  execute?: (sql: string) => Promise<void> | void;
}

const migration: Migration = {
  id: '20260903104806_kilocode_board_reset',
  async up(tx: DdlMigrationTx) {
    if (typeof tx.execute !== 'function') {
      // Adapter does not wire raw DDL through; `BoardStore.ensureSchema`
      // handles the eager path.
      return;
    }
    for (const stmt of BOARD_RESET_DDL) {
      await tx.execute(stmt);
    }
  },
};

export default migration;
