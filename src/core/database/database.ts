/**
 * Database Configuration Helpers
 *
 * Provides the canonical PRAGMA sequence for opening a shared SQLite
 * database from multiple processes (e.g. the Alexi CLI and daemon
 * running concurrently). This module is intentionally adapter-agnostic:
 * it produces the ordered list of PRAGMA statements a caller should
 * execute against whichever SQLite binding is in use (better-sqlite3,
 * effect-sql, node:sqlite, etc.).
 *
 * Why order matters
 * -----------------
 * When two processes open the same database and one is racing to recover
 * an abandoned WAL/SHM segment, the busy handler must already be
 * installed before `journal_mode = WAL` runs — otherwise the recovering
 * process can crash with `SQLITE_BUSY` before any retry logic kicks in.
 *
 * Correct sequence:
 *   1. PRAGMA busy_timeout = 5000    -- install the busy handler FIRST
 *   2. PRAGMA journal_mode = WAL     -- may trigger WAL recovery
 *   3. PRAGMA synchronous = NORMAL
 *   4. PRAGMA cache_size = -64000
 *   5. PRAGMA foreign_keys = ON
 *   6. PRAGMA wal_checkpoint(PASSIVE)
 *
 * SAP AI Core deployments frequently run the daemon and CLI in parallel
 * against the same session store, so this ordering is a required
 * stability guarantee.
 *
 * See kilocode upstream stability fix for the underlying rationale.
 */

/**
 * Canonical ordered list of PRAGMA statements to run on a freshly
 * opened SQLite connection. `busy_timeout` is intentionally first
 * so the busy handler is armed before WAL recovery can race.
 *
 * alexi_change: install SQLite's busy handler before concurrent
 * processes can race to recover the WAL.
 */
export const CONNECTION_PRAGMAS: readonly string[] = Object.freeze([
  'PRAGMA busy_timeout = 5000',
  'PRAGMA journal_mode = WAL',
  'PRAGMA synchronous = NORMAL',
  'PRAGMA cache_size = -64000',
  'PRAGMA foreign_keys = ON',
  'PRAGMA wal_checkpoint(PASSIVE)',
]);

/**
 * Options for `configureConnection`.
 */
export interface ConfigureConnectionOptions {
  /**
   * Millisecond value for `busy_timeout`. Defaults to 5000ms which is
   * the same value the SQLite adapter uses in the kilocode upstream fix.
   */
  busyTimeoutMs?: number;
  /**
   * When true (default), the caller is telling us its adapter's built-in
   * WAL init has been disabled, so this helper is the sole owner of the
   * PRAGMA sequence. When false, `journal_mode = WAL` is skipped on the
   * assumption the adapter already ran it — you almost certainly want
   * `true`.
   */
  ownsWalInit?: boolean;
}

/**
 * Minimal DB shape used by `configureConnection`. Concrete adapters
 * (better-sqlite3, effect-sql, node:sqlite) all expose an equivalent
 * synchronous or asynchronous `run` (aka `exec`) method.
 */
export interface PragmaRunner {
  run(sql: string): Promise<unknown> | unknown;
}

/**
 * Apply the canonical PRAGMA sequence to an open SQLite connection.
 *
 * Adapters that own their own WAL init MUST have that init disabled
 * before calling this helper so PRAGMAs run in the order defined by
 * `CONNECTION_PRAGMAS`.
 *
 * Example (better-sqlite3):
 *
 *   const db = new Database(filename);
 *   await configureConnection({ run: (sql) => db.exec(sql) });
 *
 * Example (effect-sql layered adapter — pass `disableWAL: true` when
 * building the sqlite layer, then call this helper):
 *
 *   const layer = Layer.effect(
 *     Database,
 *     Effect.gen(function* () {
 *       const db = yield* makeDatabase;
 *       yield* Effect.promise(() =>
 *         configureConnection({ run: (sql) => db.run(sql) })
 *       );
 *     }),
 *   );
 *
 *   export function layerFromPath(filename: string) {
 *     // alexi_change: Database configures WAL after busy_timeout
 *     return layer.pipe(Layer.provide(sqliteLayer({ filename, disableWAL: true })));
 *   }
 */
export async function configureConnection(
  db: PragmaRunner,
  options: ConfigureConnectionOptions = {}
): Promise<void> {
  const { busyTimeoutMs = 5000, ownsWalInit = true } = options;

  // alexi_change start - install SQLite's busy handler before concurrent
  // processes can race to recover the WAL.
  await db.run(`PRAGMA busy_timeout = ${busyTimeoutMs}`);
  if (ownsWalInit) {
    await db.run('PRAGMA journal_mode = WAL');
  }
  // alexi_change end
  await db.run('PRAGMA synchronous = NORMAL');
  await db.run('PRAGMA cache_size = -64000');
  await db.run('PRAGMA foreign_keys = ON');
  await db.run('PRAGMA wal_checkpoint(PASSIVE)');
}
