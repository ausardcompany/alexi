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
  // 2026-09-03: add `cleared_seq` column to `kilo_board` for the shared
  // agent board reset feature (kilocode PR #13782).
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

/**
 * Index / table names created by kilocode-flavoured migrations. Upstream
 * sync scripts (see `scripts/sync-upstream.sh`) must preserve any DDL
 * that references one of these identifiers — dropping them silently on
 * a sync would break board coordination, model-usage aggregation, or
 * recall search performance.
 *
 * Any new SQL name introduced by a `kilocode_change` migration MUST be
 * appended here. The matching regex is:
 *
 *   /kilo_board(?:_message)?|part_session_step_finish_idx|recall_(?:part_search|message_role)_idx/
 *
 * kilocode 02e92bcc6 added the recall_message_role_idx covering index —
 * see `src/core/session/recall-message-index.ts` for the DDL and the
 * documented shim that guards a future SQL-backed session store port.
 */
export const KILOCODE_PRESERVED_SQL_NAMES: readonly string[] = [
  'kilo_board',
  'kilo_board_message',
  'part_session_step_finish_idx',
  'recall_part_search_idx',
  'recall_message_role_idx',
];

/**
 * Regex form of {@link KILOCODE_PRESERVED_SQL_NAMES}, ready to drop into
 * a sync script that inspects raw DDL strings.
 */
export const KILOCODE_PRESERVED_SQL_REGEX =
  /kilo_board(?:_message)?|part_session_step_finish_idx|recall_(?:part_search|message_role)_idx/;
