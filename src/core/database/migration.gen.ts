/**
 * Auto-generated migration registry.
 *
 * Ports the upstream opencode/kilocode `migration.gen.ts` pattern — a
 * single flat list of dynamic-import promises resolving to the ordered
 * migrations that the runner should apply. Alexi keeps migrations
 * adapter-agnostic (see `./migration.ts`), so entries here export a
 * `Migration` object (id + `up(tx)`) rather than an effect-sql layer.
 *
 * When adding a new migration:
 *   1. Drop the file in `./migrations/<timestamp>_<slug>.ts` following the
 *      existing naming convention.
 *   2. Append its dynamic import to `MIGRATION_MODULES` in chronological
 *      order (older → newer). Order matters: `applyMigrations` runs the
 *      list sequentially, skipping ids already in the journal.
 */

import type { Migration } from './migration.js';

/**
 * Ordered dynamic imports of migration modules. Each module MUST export
 * its `Migration` object as the `default` export.
 */
export const MIGRATION_MODULES: ReadonlyArray<Promise<{ default: Migration }>> = [
  // 2026-08-28: task-scoped shared agent board (kilocode 162e30d23).
  import('./migrations/20260828074139_kilocode_board.js'),
];

/**
 * Resolve every registered migration in declaration order. Callers of
 * `applyMigrations` should pass the returned array verbatim.
 */
export async function loadMigrations(): Promise<Migration[]> {
  const modules = await Promise.all(MIGRATION_MODULES);
  return modules.map((m) => m.default);
}
