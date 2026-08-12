/**
 * Database Migration Runner
 *
 * Serialized migration application with primary-key-safe re-check inside
 * the transaction. Based on kilocode upstream fix `2c2b0a2ff`
 * (fix(core): serialize concurrent database migrations #13067).
 *
 * The problem: when two processes (e.g. the SAP AI Core worker and the
 * CLI) race to apply the same migration, the second process reads the
 * `migration` journal *before* the first process commits, sees the row
 * as missing, then tries to INSERT it — and hits a primary-key collision
 * the moment the first transaction commits.
 *
 * The fix: take an IMMEDIATE write lock (`behavior: 'immediate'` in the
 * effect-sql adapter; `BEGIN IMMEDIATE` in raw sqlite) and re-check
 * inside the transaction. If the id is already present, the migration
 * was applied by the other process while we were waiting for the lock —
 * return without replaying.
 */

/**
 * A single migration record.
 */
export interface Migration {
  id: string;
  up: (tx: MigrationTx) => Promise<void>;
}

/**
 * Minimal transaction interface required by the runner. Kept intentionally
 * narrow so this module doesn't hard-couple to a specific SQL adapter
 * (better-sqlite3, effect-sql, or raw pg).
 */
export interface MigrationTx {
  /**
   * Return true if a migration id has already been recorded inside this
   * transaction, false otherwise. Callers MUST implement this against a
   * SELECT that reads within the currently open transaction so the
   * re-check sees the state after the write lock was acquired.
   */
  has(id: string): Promise<boolean>;
  /**
   * Record a migration id in the migration journal.
   */
  record(id: string): Promise<void>;
}

/**
 * Minimal database interface: takes a callback and runs it inside an
 * IMMEDIATE transaction (acquires the write lock up front so concurrent
 * runners serialize instead of racing).
 */
export interface MigrationDb {
  /**
   * Run `fn` inside an IMMEDIATE transaction. Implementations MUST issue
   * the equivalent of `BEGIN IMMEDIATE` (SQLite) or set the isolation
   * level to serialize (Postgres) so the primary-key re-check below is
   * meaningful.
   */
  transactionImmediate<T>(fn: (tx: MigrationTx) => Promise<T>): Promise<T>;
  /**
   * Return the set of migration ids already recorded outside any
   * transaction. This produces the initial snapshot used to skip
   * already-applied migrations without paying the write-lock cost.
   */
  completedIds(): Promise<Set<string>>;
}

/**
 * Apply the given migrations against `db` in order, skipping those already
 * recorded. Safe to run concurrently in multiple processes: each
 * migration is applied inside an IMMEDIATE transaction and re-checked
 * against the journal so a competing process cannot cause a primary-key
 * collision on the journal INSERT.
 */
export async function applyMigrations(
  db: MigrationDb,
  migrations: readonly Migration[]
): Promise<void> {
  const completed = await db.completedIds();

  for (const migration of migrations) {
    if (completed.has(migration.id)) {
      continue;
    }

    // Another process may have recorded this migration since the
    // snapshot above; take the write lock and re-check inside the tx,
    // otherwise the journal insert dies on the primary key.
    await db.transactionImmediate(async (tx) => {
      if (await tx.has(migration.id)) {
        return;
      }
      await migration.up(tx);
      await tx.record(migration.id);
    });
  }
}
