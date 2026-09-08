/**
 * Model-usage step-finish partial index.
 *
 * Ports upstream kilocode `66053ef65 fix(session): speed up cold session
 * loading`. Adds a SQLite partial index on `part(session_id)` filtered to
 * rows whose JSON `data.type` is `'step-finish'`. This is the query
 * pattern used by cold session loading and model-usage aggregation —
 * without the index the reader must scan every part row for a session,
 * which dominates start-up cost on projects with long transcripts.
 *
 * Alexi_change: no Effect-TS. The upstream migration is written in the
 * effect-sql style (`yield* tx.run(...)`); Alexi's runner is plain
 * async / await, so we translate the DDL into an ordered `execute` call.
 * The migration is a no-op when the underlying adapter does not expose
 * `execute()` — this keeps the module safe to load in test harnesses
 * that use the minimal `MigrationTx` contract without a SQL driver.
 */

import type { Migration, MigrationTx } from '../migration.js';

/**
 * DDL applied by this migration. Exported so callers with a raw SQL
 * connection can install it eagerly (e.g. before the migration runner
 * is wired up in a fresh test database).
 */
export const MODEL_USAGE_INDEX_STATEMENT = `CREATE INDEX IF NOT EXISTS \`part_session_step_finish_idx\` ON \`part\` (\`session_id\`) WHERE json_valid("part"."data") AND json_extract("part"."data", '$.type') = 'step-finish'`;

/**
 * Adapter-agnostic extension of `MigrationTx` used by migrations that need
 * to issue raw DDL. Concrete migration runners implement `execute` against
 * the currently open transaction; the base `MigrationTx` interface does
 * not require it, so migrations MUST check for its presence before
 * dispatching.
 */
export interface DdlMigrationTx extends MigrationTx {
  execute?: (sql: string) => Promise<void> | void;
}

const migration: Migration = {
  id: '20260907102000_model_usage_index',
  async up(tx: DdlMigrationTx) {
    if (typeof tx.execute !== 'function') {
      return;
    }
    await tx.execute(MODEL_USAGE_INDEX_STATEMENT);
  },
};

export default migration;
