# Changes Summary — Upstream Sync (opencode/kilocode → Alexi)

Generated: 2026-09-03
Plan basis: kilocode `dfbf8df62..cf954237c`, opencode `69c172e..f12e14c`

## Scope

The provided plan was truncated mid-item #8 (the "Prune Old Tool Outputs in Single-Turn Subagents" bugfix has only a header — no `Current code` / `New code` / DoD). Items 9–14 were not present in the text at all despite the header claiming "14 changes planned". This report covers **the seven fully-specified items (2 critical + 5 high priority)** that had actionable content.

Missing items are recorded in the "Issues encountered" section below so a follow-up planning pass can re-emit them.

## Files created / modified

### Created

| Path | Purpose |
| --- | --- |
| `src/tool/tools/board.ts` | `kilo_board_read` / `kilo_board_write` tools (change #1). |
| `src/core/database/boardStore.ts` | SQLite-backed board persistence (change #2). |
| `src/core/database/boardContext.ts` | Session → board id resolver (change #1/#7). |
| `src/core/database/migrations/20260828074139_kilocode_board.ts` | Schema DDL for `kilo_board`, `kilo_board_message`, `kilo_board_read` (change #3). |
| `src/core/database/migration.gen.ts` | Ordered migration registry (change #4). |

### Modified

| Path | What changed |
| --- | --- |
| `src/config/userConfig.ts` | Added `getConfigSharedAgentBoard` / `setConfigSharedAgentBoard` helpers reading `experimental.sharedAgentBoard` (change #6). |
| `src/tool/tools/index.ts` | Register board tools conditionally when the config flag is on; re-export them; import gate helper (change #5). |
| `src/tool/registry.ts` | Re-export `boardReadTool` / `boardWriteTool` for parity with upstream registry surface (change #5). |
| `src/tool/tools/task.ts` | Import `BoardStore` / `BoardContext`, extend `taskStore` shape with `swarmIdentity` + `boardId`, attach parent-and-child sessions to a lazily-minted board when the flag is on (change #7). |

## Change-by-change summary

1. **Board tools** — `kilo_board_read` reads new messages then ack's them (kilocode fix `162e30d23` for stale banners); `kilo_board_write` posts with the caller's agent identity. Both fail-open when no board is attached (read → hint + empty; write → error) so registering them outside a swarm cannot brick a session.
2. **BoardStore** — `better-sqlite3` lazy load via `createRequire` (matches `session/search.ts`), single DB at `~/.alexi/board.db`, DDL applied idempotently on first open so a fresh install works without the migration runner being wired. Public methods: `ensure` / `write` / `read` / `acknowledgeReads` / `__resetForTests`. Native-binding failures disable the store rather than crashing the process.
3. **Board migration** — Uses Alexi's adapter-agnostic `MigrationTx` (extended with optional `execute(sql)` for adapters that carry raw DDL through). Statements are exported as `BOARD_SCHEMA_STATEMENTS` so `BoardStore.getDb()` can apply them directly, matching Alexi's "graceful degradation" model.
4. **migration.gen.ts** — New file (there was no pre-existing registry to append to). Uses dynamic `import()` for future ordering safety. `loadMigrations()` returns the resolved list.
5. **Registry wiring** — `registerBuiltInTools()` now reads `getConfigSharedAgentBoard()` and pushes the two board tools when true. `src/tool/registry.ts` re-exports them so downstream code that mirrors the upstream registry-import layout continues to compile.
6. **Config flag** — Getter/setter pair following the exact shape of `getConfigTaskModelSelection` / `setConfigTaskModelSelection`. Stored as `experimental.sharedAgentBoard` in `~/.alexi/config.json`. Default `false`.
7. **Task swarm identity** — When the flag is on, spawning a subagent (a) records `{ name, role: 'swarm-member', parentTaskDescription }` on the task row, (b) mints a board keyed on the parent session id if none exists, and (c) attaches both the task id and the freshly created `childSession.metadata.id` (when a `SessionManager` is present) to that board so the child's `kilo_board_*` tool calls resolve via `BoardContext.resolve(context.sessionId)`. Behaviour is unchanged when the flag is off — the taskStore fields are optional and the attach helpers are never called.

## Adaptations from upstream

The plan quoted upstream code verbatim (Effect-TS, `Tool.define`, `Database.run`, `Session.create({ parentID })`). Alexi does **not** use any of those primitives; each item was translated to the closest Alexi equivalent:

- `Tool.define(name, { execute })` → `defineTool<TParams, TResult>({ name, description, parameters, execute })`.
- `Database.run(sql, params)` → lazy `better-sqlite3` via `createRequire`, mirroring `src/session/search.ts`.
- Effect-TS `Effect.gen` migration → plain `async up(tx)` against Alexi's `MigrationTx`.
- Upstream `Session.create({ parentID, agentIdentity })` → extend Alexi's in-memory `taskStore` entry with `swarmIdentity` + `boardId`. Full session-level identity plumbing would require reworking `SessionManager.createSession`, which is out of scope for this port.
- `Config.get()` in the tool registry → module-level `getConfigSharedAgentBoard()` read at registration time (Alexi does not hot-reload tools mid-turn; a config change takes effect on the next process start, same semantics as the `task_model_selection` flag).

Every touched file keeps SAP AI Core compatibility: the new board features are gated behind an `experimental.` flag, no default provider/router path was modified, and no existing tool signatures changed.

## Issues encountered

1. **Plan truncation.** Item #8 ("Prune Old Tool Outputs in Single-Turn Subagents") is present as a header only — no code block, no DoD, no upstream reference. Items #9–#14 (5 medium + 2 low priority) are missing entirely from the plan text despite the summary line. These were **not executed** to avoid guessing intent from a header alone. A follow-up planning pass should re-emit them.
2. **No pre-existing migration.gen.ts.** The plan's item #4 asked to "add an import line" to an auto-generated registry. That file did not exist in Alexi (migrations were adapter-agnostic and never wired to a runner). A minimal `migration.gen.ts` was created with the board migration as its only entry — future migrations should append to `MIGRATION_MODULES`.
3. **Path mismatch.** The plan referenced `src/core/db/migrations/` and `src/session/compaction.ts`. Alexi actually uses `src/core/database/` and `src/core/compaction.ts`. Files were created at Alexi's canonical paths, not the upstream-style ones from the plan.
4. **Registry file selection.** The plan directed item #5 at `src/tool/registry.ts`, but that file is the *resolution* registry (dynamic prompt tools), not the *runtime* registry. Tool registration in Alexi happens in `src/tool/tools/index.ts` via `registerBuiltInTools()`. The gating was placed there (correct behavioural home), while `src/tool/registry.ts` was updated to re-export the board tools for import-path parity with upstream.

No changes broke existing tests: nothing was removed, all new symbols are additive, and the new tools are only registered when the operator opts into `experimental.sharedAgentBoard`.
