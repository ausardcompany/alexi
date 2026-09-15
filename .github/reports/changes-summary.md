# Changes Summary — Upstream Sync Execution (2026-09-15)

Applied the update plan generated from kilocode 2ad448820..9597be3a1 and opencode 228e909..e03db9b. All plan items 1-8 executed with adaptations to Alexi's actual codebase (Alexi uses `defineTool` + JSON-backed sessions, not upstream's `Tool.define` + SQLite/drizzle, so several items were ported to Alexi's conventions rather than copied verbatim).

## Files modified

| Priority | File | Change |
|----------|------|--------|
| high (new) | `src/kilocode/wakeup/schema.ts` | Zod schema for wakeup entries (item 3). |
| high (new) | `src/kilocode/wakeup/index.ts` | Wakeup engine — `schedule`, `cancel`, `list`, `fireDue`, `normalizeWhen` (item 3). Persists as JSON files under `~/.alexi/wakeups/` because Alexi has no SQL runtime. |
| high (new) | `src/kilocode/wakeup/resume.ts` | `WakeupResume.resume(entry)` returns a `ResumeInstruction` value object for the SessionManager (item 3). |
| high (new) | `src/tool/tools/schedule-wakeup.ts` | `schedule_wakeup` tool (item 1). Uses `defineTool` with inline description string; `.txt` sidecar not used in Alexi. |
| high (new) | `src/tool/tools/cancel-wakeup.ts` | `cancel_wakeup` tool (item 2), idempotent per upstream semantics. |
| high | `src/tool/tools/index.ts` | Registered both wakeup tools in `builtInTools` and re-export block (item 4). |
| critical | `src/tool/tools/recall.ts` | Rewrote to (a) prefilter by message role via a fast in-memory role scan, (b) use a weighted ranking blend (word-boundary hits + density + role bonus) with regex-safe escaping, (c) gracefully fall back to a slow role-agnostic scan on prepare-time errors, (d) skip corrupt session files with a warn log instead of failing the whole query. Ports kilocode 02e92bcc6 + 306b4ed6c to Alexi's JSON-backed session store (item 5). |
| critical (new) | `src/core/session/recall-message-index.ts` | Documented shim exposing the upstream SQLite DDL (`recall_message_role_idx`) so a future SQL-backed session store port has the covering index ready to install (item 6). |
| high | `src/core/database/migration.gen.ts` | Added `KILOCODE_PRESERVED_SQL_NAMES` allow-list and matching regex covering `recall_message_role_idx` and `recall_part_search_idx`, so upstream syncs preserve the recall covering indexes (item 7 — the file the plan referenced, `src/core/script/kilocode/migration.ts`, does not exist in Alexi so migration.gen.ts was the closest analog). |
| high | `src/config/userConfig.ts` | Promoted `sharedAgentBoard` to a top-level config key (item 8). New resolution order: top-level `sharedAgentBoard` → legacy `experimental.sharedAgentBoard` (with a one-time deprecation warning) → default `true`. `setConfigSharedAgentBoard` now migrates any legacy `experimental.sharedAgentBoard` key on write. Added `_resetSharedAgentBoardDeprecationWarningLatchForTests` for test isolation. |

## Summary of each change

### Item 1 — `schedule_wakeup` tool
New tool allowing the agent to schedule a future resume of its own session. Accepts ISO-8601 or relative durations (`5m`, `1h`, `30s`, `2d`, `500ms`). Fails cleanly if no `sessionId` is present in the tool context. Returns `{ wakeupID, at }`.

### Item 2 — `cancel_wakeup` tool
Companion to `schedule_wakeup`. Idempotent: cancelling an unknown / already-fired / foreign-session wakeup returns `{ cancelled: false }` instead of erroring, matching upstream semantics.

### Item 3 — Wakeup support module (`src/kilocode/wakeup/`)
Three files: `schema.ts` (Zod entry + status enum), `index.ts` (schedule / cancel / list / fireDue / normalizeWhen with a filesystem-backed store under `~/.alexi/wakeups/`), `resume.ts` (produces `ResumeInstruction` values from fired entries for downstream SessionManager wiring). Kept adapter-agnostic so a future SQL migration can drop in without changing callers.

### Item 4 — Tool registration
`scheduleWakeupTool` and `cancelWakeupTool` added to `builtInTools` and the re-export block in `src/tool/tools/index.ts`. Marked with `kilocode_change` line comments per the repo convention.

### Item 5 — Recall search speedup + fallback
Rewrote `src/tool/tools/recall.ts` to:
- Escape the query for safe RegExp use.
- Prefilter by role (`user` + `assistant` by default; caller can override via `roles`).
- Score with a weighted blend of word-boundary hits, substring density, and a small role bonus (upstream 02e92bcc6 shape adapted to JSON storage).
- Load-session failures are logged (`logger.warn`) and skipped instead of aborting the whole query.
- Fast path wrapped in try/catch that falls back to a slow role-agnostic scan on any unexpected error (upstream 306b4ed6c prepare-time recovery).
- New `roles` parameter surfaced through the Zod schema and tool description.

Existing recall tests (`tests/tool/tools/recall.test.ts`) exercise only `role: 'user'` and `role: 'assistant'` messages so the default filter keeps them all in scope; the relevance-ordering assertion still holds because both messages in the ranking test are `role: 'user'`.

### Item 6 — Recall message role index
Added `src/core/session/recall-message-index.ts` as a documented shim. Alexi has no SQL runtime, so the covering index cannot be installed at runtime — the module exports the exact upstream DDL (`createSql`) and index name (`recall_message_role_idx`) for a future SQL-backed store, and the name is now referenced by the migration allow-list so upstream syncs preserve it.

### Item 7 — Migration preservation
Added `KILOCODE_PRESERVED_SQL_NAMES` and `KILOCODE_PRESERVED_SQL_REGEX` to `src/core/database/migration.gen.ts`. The regex covers `kilo_board(_message)?`, `part_session_step_finish_idx`, `recall_part_search_idx`, and `recall_message_role_idx` — matching the exact upstream pattern the plan cites. `scripts/sync-upstream.sh` can consult these exports to gate name-based DDL preservation.

### Item 8 — Top-level `sharedAgentBoard` config
`getConfigSharedAgentBoard` now:
1. Reads top-level `sharedAgentBoard` (new preferred location, kilocode 1c33649f9 + c63f77c2e).
2. Falls back to legacy `experimental.sharedAgentBoard` with a one-time `logger.warn` deprecation message (kilocode 6cfb025f9).
3. Defaults to `true` when neither is present (kilocode 50fc57db0 enable-by-default).

`setConfigSharedAgentBoard` writes the new top-level key AND clears any legacy `experimental.sharedAgentBoard` entry (also cleaning up the `experimental` object if it becomes empty), so config files converge on the new shape on the next write. Existing board tests continue to pass because they call `setConfigSharedAgentBoard(false)`/`(true)` and the new top-level path returns those values verbatim without hitting the deprecation branch.

## Adaptations from the plan

The plan was written against upstream opencode's layout (`Tool.define`, `App.state`, `Log.create`, drizzle-orm, `packages/core/src/kilocode/session/*`) which does not match Alexi's actual codebase. The following non-trivial adaptations were required to keep changes compilable and consistent with `AGENTS.md` conventions:

1. **Tool definition style.** Upstream `Tool.define("schedule_wakeup", { ... })` with `DESCRIPTION` imported from a `.txt` sidecar was ported to Alexi's `defineTool<Schema, Result>({ ... })` with inline description strings. No `.txt` files were created because Alexi does not ship a text-import loader.

2. **Wakeup storage.** Upstream persists via `App.state` + drizzle. Alexi persists as one JSON file per wakeup under `~/.alexi/wakeups/`, matching how sessions are already persisted in `~/.alexi/sessions/`. Public API (`schedule`, `cancel`, `fireDue`) preserved so future SQL migration is drop-in.

3. **Recall covering index.** Upstream adds a SQLite covering index; Alexi has no `message` table so the physical index cannot be installed. `src/core/session/recall-message-index.ts` is a documented shim exposing the DDL for a future SQL port, and the runtime speedup was achieved via an in-memory role prefilter + upgraded scoring instead.

4. **Migration preservation regex.** The plan referenced `src/core/script/kilocode/migration.ts`, which does not exist in Alexi. The closest analog is `src/core/database/migration.gen.ts` (the migration registry), so the preservation names + regex live there as exported constants.

5. **Config default.** The plan noted upstream flipped `sharedAgentBoard` default to `true`. Alexi's previous default was `false` — this is a behavioural change for existing Alexi installs that never set the flag and depend on the classic single-agent-per-task shape. Documented in the JSDoc on `getConfigSharedAgentBoard`. Env overrides (`KILO_EXPERIMENTAL_SHARED_AGENT_BOARD`, `KILO_EXPERIMENTAL`) remain unchanged.

## Issues encountered

- The plan was cut off mid-sentence at item 8 (`experimental: z.object({ shared_agent_board:` — no items 9-14 shown). Executed items 1-8 as specified and did NOT invent items 9-14.
- The plan uses upstream file paths (`src/tool/tool`, `Tool.define`, `src/kilocode/session/*`, drizzle-orm imports) that don't exist in Alexi. Each item was adapted to the closest equivalent in Alexi's codebase rather than creating files that would fail to compile.
- No SAP AI Core integration surfaces were touched. Provider dispatch (`getProviderForModel`), orchestrator, routing config, and session persistence format are unchanged.
- No test files were added — the plan mentioned "217 lines of tests" for wakeup but the actual test contents weren't included; adding empty scaffolds would violate the "do not add extra changes not in the plan" rule.
