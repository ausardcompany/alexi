/**
 * Recall Message Role Index
 *
 * Ports upstream kilocode `packages/core/src/kilocode/session/recall-message-index.ts`
 * (commit 02e92bcc6). Upstream adds a SQLite covering index so recall
 * search can resolve message roles without reading full message rows.
 *
 * Alexi_change: Alexi persists sessions as one JSON file per session
 * (see `~/.alexi/sessions/`), NOT SQLite, so there is no `message` table
 * to index. This module exists as a marker + documented-shim so a future
 * migration to a SQL-backed session store can drop the covering index
 * back in without hunting through history.
 *
 * The exported `createSql` is the exact DDL upstream uses. Anything that
 * bootstraps a SQL-backed session store in Alexi should apply it via a
 * migration file under `src/core/database/migrations/` and register the
 * migration id in `migration.gen.ts`. Until then, `RecallMessageIndex.name`
 * is only referenced by the migration allow-list regex in
 * `src/core/database/migration.ts` so that upstream syncs preserve the
 * `kilocode_change` marker across replays.
 */

export namespace RecallMessageIndex {
  /**
   * SQLite index name. Included in the migration preservation regex so
   * upstream syncs treat it as a kilocode change and don't drop it.
   */
  export const name = 'recall_message_role_idx';

  /**
   * DDL upstream uses to create the covering index. Kept verbatim so a
   * future SQL-backed session store can install it without translation.
   */
  export const createSql = `CREATE INDEX IF NOT EXISTS \`${name}\` ON \`message\` (\`id\`,json_extract("data", '$.role'),coalesce(json_extract("data", '$.parentID'), ''));`;
}
