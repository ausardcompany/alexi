/**
 * Shared Agent Board — reset semantics migration.
 *
 * Ports upstream kilocode `migration/20260903104806_kilocode_board_reset.ts`.
 * Adds `cleared_seq` bookkeeping to the board so a swarm can perform a
 * logical "clear" without physically deleting rows: subsequent reads
 * filter to messages whose sequence is strictly greater than
 * `cleared_seq`, preserving audit history while giving the swarm a fresh
 * conversation surface.
 *
 * Because Alexi's board schema uses `created_at` (ISO timestamp) as the
 * effective ordering key rather than an integer `seq`, the "sequence"
 * this migration tracks is the last `created_at` observed at clear-time.
 * Callers writing to a cleared board simply set `created_at` to
 * `max(now(), clearedAt)` and readers filter `created_at > cleared_seq`.
 * This preserves the upstream contract (post-clear reads see only
 * post-clear writes) without introducing a monotonically-increasing
 * `seq` column that would clash with the existing schema.
 *
 * Alexi_change: mirrors the adapter-agnostic style of the sibling
 * `20260828074139_kilocode_board.ts` migration — schema DDL is exported
 * as a constant so `BoardStore.ensureSchema()` can apply it eagerly on
 * fresh DBs, and `up()` no-ops when the adapter has not wired
 * `execute` through.
 */

import type { Migration, MigrationTx } from '../migration.js';

/**
 * Ordered DDL applied by this migration. Exported so `BoardStore` can
 * eagerly apply it on first use (`ensureSchema` fallback path).
 *
 * Uses `TEXT` for `cleared_seq` (defaulting to the epoch) so the value
 * is comparable against the existing `created_at` ISO 8601 column with a
 * simple `>` predicate. Upstream stores the sequence as an integer, but
 * Alexi's board keys off `created_at`, so we align to that shape.
 */
export const BOARD_RESET_SCHEMA_STATEMENTS: readonly string[] = Object.freeze([
  `ALTER TABLE kilo_board ADD COLUMN cleared_seq TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z'`,
]);

/**
 * Adapter-agnostic extension of `MigrationTx`. Concrete migration
 * runners (better-sqlite3, effect-sql) implement `execute` against the
 * currently open transaction; the base `MigrationTx` interface does not
 * require it, so migrations MUST check for its presence before
 * dispatching. Kept structurally identical to the sibling migration so
 * BoardStore can treat both the same way in its eager-apply path.
 */
export interface DdlMigrationTx extends MigrationTx {
  execute?: (sql: string) => Promise<void> | void;
  /**
   * Optional column-introspection hook so this ADD COLUMN migration is
   * idempotent when the adapter has already applied the change out-of-band
   * (e.g. via `BoardStore.ensureSchema()`). When absent, callers rely on
   * the underlying adapter to tolerate a duplicate-column error, or on the
   * migration journal itself to skip re-runs.
   */
  hasColumn?: (table: string, column: string) => Promise<boolean> | boolean;
}

const migration: Migration = {
  id: '20260903104806_kilocode_board_reset',
  async up(tx: DdlMigrationTx) {
    if (typeof tx.execute !== 'function') {
      return;
    }
    // Idempotency: if the column already exists (e.g. BoardStore.ensureSchema
    // applied the DDL eagerly on a fresh DB), skip the ALTER.
    if (typeof tx.hasColumn === 'function') {
      const present = await tx.hasColumn('kilo_board', 'cleared_seq');
      if (present) {
        return;
      }
    }
    for (const stmt of BOARD_RESET_SCHEMA_STATEMENTS) {
      await tx.execute(stmt);
    }
  },
};

export default migration;
