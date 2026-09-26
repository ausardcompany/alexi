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
 * Classify a migration id as belonging to the shared agent board feature
 * family.
 *
 * Ports upstream kilocode fix — the board-detector regex was widened so
 * the new `kilocode_board_reset` migration (2026-09-03) is grouped with
 * the original `kilocode_board` migration for tooling that filters or
 * gates the board feature by migration name. Matches:
 *
 *   - `kilocode_board`
 *   - `kilocode_board_reset`
 *   - `<timestamp>_kilocode_board`
 *   - `<timestamp>_kilocode_board_reset`
 */
export function isBoardMigration(name: string): boolean {
  return /(?:^|_)kilocode_board(?:_reset)?$/.test(name);
}

/**
 * Row shape returned by `PRAGMA table_info(<table>)` on SQLite. Only the
 * `name` column is used here; the rest are ignored.
 */
export interface SqliteColumnInfo {
  name: string;
}

/**
 * Optional low-level SQLite hook used by `importLegacyDrizzleJournal` to
 * bridge older installations that used Drizzle's `__drizzle_migrations`
 * table into Alexi's own `migration` journal. Adapters that don't back
 * onto SQLite (or that never shipped a Drizzle-based schema) can leave
 * this unimplemented — `applyMigrations` still works without it.
 *
 * Ports the intent of upstream kilocode fix that hardens the legacy
 * journal import against older Drizzle schemas whose `__drizzle_migrations`
 * table lacks the `name` column (older Drizzle versions only stored
 * `created_at`). Without this guard, importing that legacy journal on an
 * older SAP AI Core deployment crashes with an obscure SQL error the
 * first time Alexi boots.
 */
export interface LegacySqliteBridge {
  /**
   * Return true if a table with the given name exists (checked against
   * `sqlite_master`).
   */
  tableExists(name: string): Promise<boolean>;
  /**
   * Return the column list for a table via `PRAGMA table_info(<table>)`.
   */
  tableColumns(name: string): Promise<readonly SqliteColumnInfo[]>;
  /**
   * Fetch legacy Drizzle journal rows. Only `created_at` is guaranteed to
   * exist across all historical schema versions; `name` may be absent on
   * older installations and is therefore optional.
   */
  fetchLegacyJournal(): Promise<
    ReadonlyArray<{ name?: string | null; created_at?: number | null }>
  >;
  /**
   * Insert a single migration id into Alexi's own `migration` journal
   * (idempotent — `INSERT OR IGNORE` semantics).
   */
  recordCompleted(id: string, timeCompletedMs: number): Promise<void>;
}

/**
 * Best-effort import of an older `__drizzle_migrations` journal into
 * Alexi's `migration` journal, so a fresh Alexi install on a database
 * that previously ran Drizzle-based migrations doesn't replay migrations
 * that were already applied.
 *
 * The upstream kilocode bug this guards against: if
 * `__drizzle_migrations` exists but predates the schema version that
 * added the `name` column, a naive `SELECT name FROM __drizzle_migrations`
 * fails hard. We now inspect `PRAGMA table_info` first and fall back to
 * matching by `created_at` timestamp against known migration id prefixes
 * (`YYYYMMDDHHMMSS_*`) when `name` is absent.
 *
 * No-op when the legacy table doesn't exist, when no known migrations
 * were listed, or when the caller's adapter didn't provide a
 * `LegacySqliteBridge`.
 *
 * alexi_change: defensive port of kilocode's legacy Drizzle journal
 * import — handle older schemas that lack a `name` column instead of
 * crashing at boot.
 */
export async function importLegacyDrizzleJournal(
  bridge: LegacySqliteBridge,
  migrations: readonly Migration[]
): Promise<void> {
  if (!(await bridge.tableExists('__drizzle_migrations'))) {
    return;
  }

  const columns = await bridge.tableColumns('__drizzle_migrations');
  const hasNameColumn = columns.some((column) => column.name === 'name');
  const entries = await bridge.fetchLegacyJournal();
  const nowMs = Date.now();

  if (hasNameColumn) {
    for (const entry of entries) {
      if (entry.name && entry.name.length > 0) {
        await bridge.recordCompleted(entry.name, nowMs);
      }
    }
    return;
  }

  // Fallback: no `name` column, match by `created_at` -> migration id prefix.
  for (const entry of entries) {
    if (entry.created_at === undefined || entry.created_at === null) {
      continue;
    }
    const prefix = formatDrizzleTimestampPrefix(entry.created_at);
    const migration = migrations.find((item) => item.id.startsWith(`${prefix}_`));
    if (!migration) {
      throw new Error(
        `Legacy migration timestamp ${entry.created_at} does not match any known migration`
      );
    }
    await bridge.recordCompleted(migration.id, nowMs);
  }
}

/**
 * Format a Drizzle `created_at` (unix millis) as a `YYYYMMDDHHMMSS`
 * prefix, matching the shape of Alexi migration ids like
 * `20260907102000_model_usage_index`.
 */
function formatDrizzleTimestampPrefix(unixMs: number): string {
  const d = new Date(unixMs);
  const pad = (n: number, width = 2): string => String(n).padStart(width, '0');
  return (
    `${d.getUTCFullYear()}` +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds())
  );
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
