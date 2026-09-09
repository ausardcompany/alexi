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
  // 2026-09-03: `cleared_seq` gating column on `kilo_board` so board
  // resets can hide older messages without deleting rows
  // (kilocode `feat(board): reset`).
  import('./migrations/20260903104806_kilocode_board_reset.js'),
  // 2026-09-07: partial index on `part(session_id)` filtered to
  // `step-finish` rows to speed up cold session loading and model-usage
  // aggregation (kilocode 66053ef65).
  import('./migrations/20260907102000_model_usage_index.js'),
];

/**
 * Resolve every registered migration in declaration order. Callers of
 * `applyMigrations` should pass the returned array verbatim.
 */
export async function loadMigrations(): Promise<Migration[]> {
  const modules = await Promise.all(MIGRATION_MODULES);
  return modules.map((m) => m.default);
}
