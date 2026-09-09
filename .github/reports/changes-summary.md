# Alexi Update Plan — Execution Summary

Date: 2026-09-09
Plan basis: kilocode `a7a7690ca..492a2ffa2` (119 commits) + opencode
`d6855b6..830d5eb` (4 commits).

## Files Modified / Created

| # | File | Kind | Priority |
|---|------|------|----------|
| 1 | `src/agent/prompts/gpt-astra.txt` | **created** | medium |
| 2 | `src/agent/system.ts` | modified | medium |
| 3 | `src/core/database/migrations/20260903104806_kilocode_board_reset.ts` | **created** | high |
| 4 | `src/core/database/migrations/20260828074139_kilocode_board.ts` | modified | high |
| 5 | `src/core/database/migration.gen.ts` | modified | high |
| 6 | `src/core/database/boardStore.ts` | modified | high |
| 7 | `src/session/queue.ts` | modified | low |
| 8 | `src/session/goal-state.ts` | **created** | medium |

## Change-by-Change Notes

### 1. Remove Interactive Terminal Tool (high, refactor) — **N/A, no code deleted**

Searched `src/` for any of `[Ii]nteractive[-_]?[Tt]erminal` — zero matches.
Alexi never ported the tool; the tool registry (`src/tool/registry.ts` and
`src/tool/registry.test.ts`) has no reference to it. Nothing to delete.
Recording as a no-op so a future audit doesn't re-open the item.

### 2. Amazon Bedrock DeepSeek model-id fix (critical, bugfix) — **N/A, no direct Bedrock provider**

Alexi routes every provider through **SAP AI Core Orchestration**
(`src/providers/sapOrchestration.ts`) or a proxy. There is no
`src/providers/amazon-bedrock.ts`, no direct `@aws-sdk/client-bedrock-runtime`
call, and the `resolveModelID` function the opencode PR patched does not exist
in this codebase. The DeepSeek model ids Alexi handles
(`deepseek-ai--deepseek-r1`) come through SAP's naming convention, which does
not prefix them with `us.` etc. — the double-prefix bug the upstream commit
addresses cannot manifest here. `providers/transform.ts` already handles the
adjacent Bedrock reasoning-replay guard (see the `filterUnreplayableBedrockReasoning`
block), so the Bedrock **compatibility** surface Alexi actually exposes is
untouched.

**Followup**: if a future PR adds a native Bedrock provider, port the
`arn:` and `deepseek.r1` guards then.

### 3. Astra system prompt for GPT models (medium, feature) — **applied**

- Created `src/agent/prompts/gpt-astra.txt` (46-line prompt in the same
  style as `openai.txt` and `anthropic.txt`; scope narrowed to Alexi's
  tool-use loop and SAP AI Core context — no reference to opencode-specific
  concepts).
- Wired `getModelPromptKey()` in `src/agent/system.ts` to return
  `'gpt-astra'` for any model id containing `astra` (substring match to
  cover bare `astra-*`, prefixed `gpt-4o-astra`, and `azure/gpt-astra-2`
  variants). The check runs **before** the plain `gpt-` fallthrough so the
  Astra prompt wins over the generic `openai` prompt.
- Registered `'gpt-astra'` in the pre-loaded `MODEL_PROMPTS` map.
- Existing `agent/system.test.ts` cases (anthropic-, gpt-, gemini-, default)
  are unaffected — no `astra` fixture existed.

### 4. Board reset migration (`cleared_seq` column) (high, feature) — **applied**

- Created migration `src/core/database/migrations/20260903104806_kilocode_board_reset.ts`.
  It exports `BOARD_RESET_DDL` (single `ALTER TABLE kilo_board ADD COLUMN
  cleared_seq INTEGER NOT NULL DEFAULT 0`) plus a `Migration` object that
  dispatches through the adapter's `execute` hook when present, and no-ops
  otherwise (Alexi's base `MigrationTx` does not require `execute` — same
  pattern already established by `20260828074139_kilocode_board.ts`).
- Registered the new migration in `src/core/database/migration.gen.ts` in
  chronological order (between the board schema migration and the model-
  usage-index migration).
- Amended `BOARD_SCHEMA_STATEMENTS` in the initial board migration to
  include the `cleared_seq` column on the eager `CREATE TABLE IF NOT
  EXISTS` — so a fresh DB gets the column at first open without needing
  the migration runner to be wired.
- Added a schema-probe fallback in `BoardStore.getDb()`: on every open we
  `SELECT name FROM pragma_table_info('kilo_board')`; if `cleared_seq` is
  missing we issue a one-shot `ALTER TABLE`. Existing on-disk DBs created
  before this land get the column retroactively without the migration
  runner needing to be running.
- **Alexi_change vs plan**: the plan referenced `schema.gen.ts` and a
  regex in `src/core/script/kilocode/migration.ts` that filters board
  migrations — neither file exists in Alexi. The equivalent behaviour is
  achieved through the eager `BOARD_SCHEMA_STATEMENTS` list.

### 5. Board store reset support (high, feature) — **applied**

- `BoardStore.reset(boardId)` added — stamps `cleared_seq` with
  `Date.now()` (epoch-ms integer). No-op when the store is disabled
  (native binding missing) or when the column is unavailable on very
  old DBs where the ALTER at open failed.
- `BoardStore.read()` now filters `kilo_board_message` rows by
  `created_at > cleared_seq` (converted to ISO). A never-reset board has
  `cleared_seq = 0`, resolved to `1970-01-01T00:00:00.000Z`, which is a
  no-op filter — behaviour for existing callers is preserved.
- **Alexi_change vs plan**: upstream stores messages with an integer
  `seq` column and filters `seq > cleared_seq` directly. Alexi's board
  schema uses `created_at TEXT` (ISO timestamps) as the ordering key.
  We keep `cleared_seq` typed as INTEGER to match the migration DDL
  (epoch-ms), and convert to ISO once at read time. Trade-off: at most
  a ~1ms rounding-error on the reset boundary; acceptable given the
  human-visible use case (user-triggered "clear board").
- HTTP handler / groups ports (upstream `kilocode/server/httpapi/handlers/kilocode.ts`
  +48, `groups/kilocode.ts` +44) — **deferred**. Alexi's HTTP surface
  (`src/server/`) does not currently expose a board endpoint; adding one
  is a separate feature.

### 6. Session Goals subsystem (medium, feature) — **partially applied**

- Alexi already ships `src/command/goal.ts` — an autonomous
  agenticChat-driven "loop until condition met" command. That covers
  the *runner* concern.
- Created `src/session/goal-state.ts` — minimal in-memory `SessionGoal`
  store exposing `hasActiveGoal(sessionID)`, `getGoal`, `startGoal`,
  `completeGoal`, `clearGoal`, and a test-reset helper. This is the
  wiring hook the plan's step-6 prompt-queue integration expects
  (`if (goalState.hasActiveGoal(sessionID)) { ... }`).
- **Deferred**: full ports of upstream `runner.ts` (486 lines),
  `policy.ts` (58), dedicated `tool.ts` (41), and the `prompt-queue.ts`
  admission hook. Plan explicitly permits deferring: "Consider deferring
  to a follow-up PR if not required for parity." The interface above
  is intentionally the minimum surface a follow-up port can build on
  without changing every call site again.

### 7. Snapshot progress-session hang fix (critical, bugfix) — **N/A, different subsystem**

Alexi's `src/core/snapshot.ts` is a **file-revert** snapshot system
(records per-file `FileCheckpoint`s so `alexi revert` can undo a step's
disk writes). The upstream `kilocode/snapshot/track.ts` bug fixed by
commit `9db971865` concerns progress-session hangs in the Kilo VS Code
extension's session lifecycle telemetry — that code path does not exist
here. Nothing to patch.

### 8. Prompt queue attachment admission (low, feature) — **applied minimally**

- Added an optional `attachments?: readonly string[]` field to
  `QueuedPrompt` in `src/session/queue.ts` (default `undefined` so
  every existing call site type-checks unchanged).
- Semantics: an attachment id list ridess the queue entry through
  `enqueue → edit → drainNext → drop`. Actual dispatch that consumes
  the ids is a separate concern (upstream ties it into `session/prompt.ts`
  which Alexi doesn't have — Alexi's dispatcher lives in
  `src/core/orchestrator.ts`).
- Existing tests (`SessionQueue.enqueue`, `drainNext`, `drop`, `edit`)
  still hold because the new field is optional.

## Issues Encountered

1. **Structural mismatch (recurring)** — most of the upstream diff paths
   (`packages/opencode/src/kilocode/tool/interactive-terminal.ts`,
   `packages/opencode/src/session/system.ts`,
   `packages/opencode/src/kilocode/board/store.ts`,
   `packages/opencode/src/kilocode/session/goal/*`,
   `packages/opencode/src/kilocode/snapshot/track.ts`) have no direct
   counterpart in Alexi. Each change was either:
   - already inapplicable (item 1, 2, 7),
   - adapted to Alexi's existing module (items 3, 4, 5, 8),
   - or deferred to a minimum-viable interface stub (item 6).
2. **No `schema.gen.ts`** — Alexi's schema is defined by the
   migrations themselves + `BOARD_SCHEMA_STATEMENTS`; there is no
   generated CREATE-TABLE file to update. Handled by extending the
   eager statements list plus the pragma-probe in `BoardStore.getDb()`.
3. **No effect-sql, no `tx.execute` in the base `MigrationTx`** — the
   new migration follows the same pattern the pre-existing board
   migration uses: dispatch DDL through an optional `execute` hook
   and rely on `BoardStore`'s eager path for the common case.

## SAP AI Core Compatibility

- No changes to `sapOrchestration.ts`, `openai/`, `protocols/`,
  `transform.ts`, or any provider request-building code.
- The new Astra prompt only affects the *system prompt content* handed to
  the model — no wire-format changes.
- Board / goal state is process-local; no impact on remote calls.
- Migration additive-only (`ALTER TABLE ... ADD COLUMN ... DEFAULT 0`);
  safe against any concurrent readers holding an open connection.
