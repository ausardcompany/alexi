# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- **Seven broken upstream-sync orphan stub files** (autohealing cleanup, commit `441b4c14`, 2026-07-04, `fix(ci): remove invalid upstream-sync stub files [autohealing]`): The CI autohealer removed seven scaffold files emitted by the daily upstream sync at commit `6944bf73` (`feat(sync): apply upstream changes (2026-07-04)`) after the follow-on auto-fix pass at commit `f65f2dc1` (`style(ci): auto-fix lint/format issues [alexi-bot]`) applied Prettier/ESLint to what it could reach. All seven files broke `npm run typecheck` (45+ TypeScript errors from undefined identifiers such as `proc`, `NodeStream`, `Stream`, `yield`, `fs`, `Database`, `SessionTable`, `eq`, `SessionID`, `Tool`, `PlanFile`, `Session`, `Effect`), broke `npm run format:check`, and were never imported by any module in `src/` or `tests/` — the only references outside their own file bodies live under `.github/reports/` documentation artefacts. This removal is a no-behavior, no-API, no-CLI-surface, no-runtime-shape change that restores a green CI pipeline; diff statistics: `7 files changed, 49 deletions(-)`. The remediation follows the exact pattern established in commit `7e4ebc1b` for the prior sync run and extends the stub-removal invariant documented in the earlier `### Removed` entries below. Individual file impact:
  - `src/core/cross-spawn-spawner.ts` (5-line stub): A fragment declaring `let stdout = proc.stdout ? NodeStream.fromReadable({ evaluate: () => tapped(proc, 'stdout') }) : Stream.empty` and the corresponding `stderr` binding, followed by `tapStdio(proc)`, with a single top-of-file `import { tap as tapStdio, tapped } from './kilocode/stdio-tap'`. The file was broken on multiple axes: (1) the `proc`, `NodeStream`, and `Stream` symbols are at file scope with no enclosing function or module wiring — hard parser / `tsc --noEmit` errors; (2) the import path `./kilocode/stdio-tap` does not resolve — `src/core/kilocode/` is not a directory in this repository; (3) `NodeStream.fromReadable` and `Stream.empty` come from Effect's Node interop, which is not in the Alexi dependency graph. The canonical child-process spawning surface used by the `bash` tool lives inside `src/tool/tools/bash.ts` and `src/tool/tools/shell.ts`, not under `src/core/`. Nothing in the source tree imported `src/core/cross-spawn-spawner.ts`.
  - `src/core/fs-util.ts` (2-line stub): Two orphan `yield*` expressions (`const start = yield* fs.resolve(location.directory)` and `const stop = yield* fs.resolve(location.project.directory)`) at file scope with no enclosing generator function, no `import` statements, and no `export`. The `yield*` at module scope is a hard SyntaxError; `fs`, `location`, and `location.project` are undeclared symbols; the `Effect`-flavoured `yield* fs.resolve(...)` pattern belongs to an Effect-based upstream that has not landed in Alexi. Canonical filesystem utilities in Alexi live under `src/utils/` (logger, formatting helpers) and are consumed directly via Node's `node:fs/promises`. Nothing imported `src/core/fs-util.ts`.
  - `src/core/session/compaction.ts` (1-line stub): A single top-level statement `compactSession(session, hoistedDependencies)` at module scope with no `import`, no `export`, and no enclosing function. Both `compactSession` and `hoistedDependencies` are undeclared. The canonical compaction surface lives at `src/compaction/index.ts` and `src/core/compaction-chunks.ts` (see `docs/ARCHITECTURE.md`'s _Context Compaction_ diagram) — there is no `src/core/session/` subtree in this repository (session state persists to `~/.alexi/sessions/` and is managed by `src/core/sessionManager.ts`, not a `session/` sibling of `core/`). Nothing imported `src/core/session/compaction.ts`.
  - `src/permission/headless.ts` (27-line stub): A `namespace KiloHeadless` block declaring `mark(id: string)`, `clear(id: string)`, `denies(id: string): boolean`, and a private `lookup(id)` helper that queries a Drizzle-flavoured `Database.use((db) => db.select({ parent: SessionTable.parent_id }).from(SessionTable).where(eq(SessionTable.id, id as SessionID)).get())`. The file was broken on multiple axes: (1) `Database`, `SessionTable`, `eq`, and `SessionID` are all undeclared — the file has no `import` statements at all; (2) Alexi does not use Drizzle ORM or a SQLite session table — sessions are JSON files under `~/.alexi/sessions/` managed by `src/core/sessionManager.ts`, and permissions are evaluated by the rule matcher in `src/permission/next.ts` (see `docs/permission-system.md`); (3) the `KiloHeadless` namespace suggests an upstream Kilo-side surface for headless permission denial that has no counterpart in Alexi's permission model. The canonical headless / auto-approval path in Alexi is the `--auto` flag on `alexi agent` (see `docs/API.md`'s _Agent Mode_ table), which routes through `src/permission/allow-everything.ts`. Nothing imported `src/permission/headless.ts`.
  - `src/tool/code-mode-integration.test.ts` (6-line stub): A skeleton `describe('Code Mode Integration', () => { it('should execute code mode tool with child calls correctly', async () => { /* Test implementation */ }); })` with an empty test body and no `import` statements — neither `describe`, `it`, nor `expect` is imported from `vitest`. The stub also references a non-existent `code-mode` tool surface: there is no `code-mode` entry in `src/tool/registry.ts` and no `src/tool/tools/code-mode.ts`. The file passed as a no-op test at runtime only because Vitest treats a `describe` at module scope as auto-registered global — a broken pattern this repository does not follow (all real tests explicitly `import { describe, it, expect } from 'vitest'`). Contributes nothing to coverage. Nothing imported it.
  - `src/tool/code-mode.ts` (5-line stub): A single `export const CodeModeTool = Tool.define({ execute: async (params) => { /* Code mode execution logic */ } })` with no `import` statements. The file was broken on multiple axes: (1) `Tool.define` is not the tool-definition API in Alexi — canonical tools use `defineTool` from `src/tool/index.ts` with a Zod schema (see the `defineTool` reference in `AGENTS.md` and `docs/ARCHITECTURE.md`'s _Tool System_ section); (2) there is no `Tool` namespace imported anywhere in the file; (3) the tool has no `name`, no `description`, no `parameters` schema, and no `permission` metadata — all four are required by the registry; (4) `CodeModeTool` is never re-exported through `src/tool/registry.ts`. Nothing imported it.
  - `src/tool/plan.ts` (3-line stub): Three orphan `const` bindings (`const resolved = params.path ? PlanFile.resolve(params.path, instance) : undefined`, `const target = resolved ?? Session.plan(info, instance)`, and `const file = yield* Effect.promise(() => PlanFile.locate(target, messages, info, instance, ctx.agent))`) at file scope with no enclosing function, no `import` statements, and no `export`. The `yield*` at module scope is a hard SyntaxError; `params`, `PlanFile`, `instance`, `Session`, `info`, `messages`, `ctx`, and `Effect` are all undeclared symbols. The canonical planning surface in Alexi lives under `src/plan/` (see `docs/ARCHITECTURE.md`'s planning system reference), and the `plan` agent's prompts live under `src/agent/prompts/`; there is no `plan` tool in `src/tool/registry.ts`. Nothing imported `src/tool/plan.ts`.
- The stub-removal invariant documented earlier in this changelog remains in force: canonical tool implementations live exclusively under `src/tool/tools/` and are registered via `src/tool/registry.ts`; sibling stubs at `src/tool/*.ts` that are not `index.ts`, `registry.ts`, or one of the explicit infrastructure modules (`bash.ts`, `encoded-io.ts`, `native.ts`, `parameters.test.ts`, `plugin-tools.ts`, `schema.ts`, `shell.test.ts`, `skill.ts`, `truncate.ts`, `warpgrep.ts`) are upstream-sync noise and must be deleted. Likewise, session persistence lives in `src/core/sessionManager.ts` (not a nested `src/core/session/` subtree), compaction in `src/compaction/` (not `src/core/session/compaction.ts`), and permission evaluation in `src/permission/next.ts` (not a `KiloHeadless`-flavoured Drizzle namespace).

### Changed

- **CI auto-fix pass following the 2026-07-04 upstream sync** (commit `f65f2dc1`, `style(ci): auto-fix lint/format issues [alexi-bot]`, 2026-07-04, following the upstream sync at commit `6944bf73` — `feat(sync): apply upstream changes (2026-07-04)`): The CI auto-fix workflow ran ESLint `--fix` and Prettier across the working tree after the daily upstream sync emitted the seven scaffold files documented in the `### Removed` entry above. The formatter could not repair the underlying breakage (undefined identifiers, `yield*` at module scope, missing `import` statements) and the follow-on autohealing pass at commit `441b4c14` deleted the seven files entirely. Pure formatting change on unrelated files with no behavioral, API, runtime, or type-shape impact; CI verifies it via the `format:check` and `lint` jobs.
- **Quote-style normalization across two upstream-sync orphan blocks** (commit `f4aa0be1`, `style(ci): auto-fix lint/format issues [alexi-bot]`, 2026-06-29, following the upstream sync at commit `1371007e` — `feat(sync): apply upstream changes (2026-06-29)`, version bump `1.17.21` -> `1.17.22`): The CI auto-fix workflow ran ESLint `--fix` and Prettier across the working tree after the daily upstream sync inserted two scaffold blocks into existing files. Both changes are pure formatting (no behavioral, API, runtime, or type-shape impact) and CI verifies them via the `format:check` and `lint` jobs. Diff statistics: `2 files changed, 3 insertions(+), 3 deletions(-)`. Individual file impact:
  - `src/agent/index.ts` — the two upstream-emitted imports at lines 37-38 (`import * as AgentRequirements from "@/kilocode/agent-requirements"` and `import { MCP } from "@/mcp"`) were rewritten to single quotes (`'@/kilocode/agent-requirements'`, `'@/mcp'`) to satisfy Prettier `singleQuote: true`. The canonical Agent System block above (lines 1-35: `AgentSchema`, `AgentMode`, the `z.object({...})` validation schema with `id`, `name`, `displayName?`, `description`, `mode`, `systemPrompt`, `deprecated?`, `tools?`, `disabledTools?`, `preferredModel?`, `temperature?`, `maxTokens?`, `aliases?`, `options?` fields) and the `AgentRegistry` class plus exported helpers (`getAgentRegistry`, `getCurrentAgent`, `switchAgent`, `removeAgent`, `parseAgentSwitch`, `parseAgentMention`, `getAskAgentBashRules`) and the five built-in agents (`code` / `debug` / `plan` / `explore` / `orchestrator`) are completely untouched. The inserted block at lines 37-52 (`import * as AgentRequirements from '@/kilocode/agent-requirements'`, `import { MCP } from '@/mcp'`, `export type RequirementBlockedError = InstanceType<typeof AgentRequirements.BlockedError>`, the `Info = Schema.Struct({...})` declaration, and the `Interface` declaration referencing `Effect.Effect<AgentRequirements.Result>`) remains broken at runtime: the `@/kilocode/agent-requirements` and `@/mcp` path aliases do not resolve (Alexi does not declare `@/` aliases in its `tsconfig.json` `paths` configuration, `src/kilocode/` is not a directory in this repository, and the canonical MCP wiring lives in `src/mcp/` — `client.ts`, `config.ts`, `index.ts`, `server.ts` — not under a `@/mcp` alias), `Schema.Struct` and `Effect.Effect` are imported from an Effect-Schema upstream surface that has not landed in Alexi, and the imports lack the `.js` suffix required by NodeNext ESM resolution at runtime. This is tracked as a stub-cleanup follow-up identical to the patterns recorded in commits `2dd6f396`, `6dc4b883`, `47005135`, `085951af`, and `dff69219`; the inserted block is a candidate for autohealing removal in a follow-up `fix(ci): remove broken orphan stub files from upstream sync [autohealing]` commit.
  - `src/core/project.test.ts` (11-line orphan test stub, blob delta `db2f3f77..2ce5b10c`): A trailing LF newline was appended after the closing `});` to satisfy the repository's Prettier configuration; the file previously had a missing-newline-at-end-of-file marker. Pure whitespace change. The file itself remains broken: it imports `expect` from `vitest` but does not import `describe` or `it` (both are referenced in the test body); the relative import `'../src/utils'` does not resolve from `src/core/project.test.ts` (the path is one `src/` segment off, and there is no `remoteID` export in `src/utils/` — the canonical utilities surface under `src/utils/` exposes `logger`, formatting helpers, and shared types, not a `remoteID(url)` function); and the path `src/core/project.test.ts` is not a canonical Alexi surface — project-context tests live alongside `src/config/projectContext.ts` and the canonical session/project model is `src/core/sessionManager.ts`, not a `project.ts` module. The file is not referenced by any production code and is excluded from coverage thresholds. This is tracked as a stub-cleanup follow-up.

### Added

- **Three new upstream-sync orphan stub files** (commit `91636a6c`, `feat(sync): apply upstream changes (2026-06-25)`, workflow run `28160209547`): The daily upstream sync emitted three scaffold files under `src/core/` into locations that do not correspond to any canonical Alexi surface. None of the three is imported by any module in the source tree; all three match the upstream-sync orphan pattern repeatedly documented in this changelog and are candidates for autohealing removal in a follow-up `fix(ci): remove broken orphan stub files from upstream sync [autohealing]` commit. Individual file impact:
  - `src/core/script/referral-backfill.ts` (0-line empty file, mode `100644`, blob `e69de29b`): A zero-byte file with no `import`, `export`, comment, or executable content. The path `src/core/script/` does not exist elsewhere in the repository — Alexi has no `script/` subtree under `src/core/`; ad-hoc scripts live at the repository root under `scripts/` and the canonical sync utilities under `src/sync/`. There is no referral / backfill domain in Alexi (the project is a CLI orchestrator for SAP AI Core, not a billing or analytics product). The file passes `tsc --noEmit` and Prettier trivially (empty input), but contributes nothing to coverage, behaviour, or the build output.
  - `src/core/services/autocomplete/notebook.ts` (16-line incomplete stub, blob `17702918`): A scaffold declaring `interface NotebookContext { contents: string; filepath: string; position: vscode.Position }`, a module-scoped `const resolutions = new WeakMap<vscode.Uri, NotebookResolution>()`, and a partial `function resolveNotebook(uri: vscode.Uri): NotebookResolution | undefined { const cached = resolutions.get(uri); /* ... logic to resolve notebook */ }`. The file is broken on three independent axes: (1) it imports `* as vscode from 'vscode'`, but the `vscode` package is not in `package.json` — Alexi is a terminal CLI (Commander.js + Ink TUI), not a VS Code extension, and adding `vscode` as a dependency would be an architectural inversion; (2) the `NotebookResolution` type is referenced twice but never declared, which is a hard `tsc --noEmit` error; (3) `resolveNotebook` falls off the end of its body without ever returning. The path `src/core/services/autocomplete/` does not exist elsewhere in the repository — Alexi has no `services/` subtree, no `autocomplete/` surface, and no notebook tooling outside the canonical notebook tool implementation at `src/tool/tools/notebook.ts` (registered via `src/tool/registry.ts` under the name `'notebook'`; see `docs/API.md`'s _Built-in Tools_ table). The file is not imported by any module.
  - `src/core/test/linux-sandbox.test.ts` (22-line incomplete stub, blob `5a051da8`): A scaffold importing `{ expect, test } from 'bun:test'` and `{ spawnSync } from 'node:child_process'`, declaring `const linux = process.platform === 'linux' ? test : test.skip`, and exporting a `profile(allow, denyNames, mode): Profile` helper that builds a `{ filesystem: { allowWrite, denyWrite: [], denyNames }, network: { mode, allowedHosts: [] }, environment: { deny: [], set: {} } }` object. The file is broken on three independent axes: (1) it imports from `'bun:test'`, the Bun runtime's test module — Alexi uses Vitest (`vitest@^4.1.9`, configured in `vitest.config.ts`), not Bun, and `bun:test` is not resolvable under Node 22.12; (2) the `Profile` type referenced in the parameter annotation `mode: Profile['network']['mode']` and the return type is never declared and never imported, which is a hard `tsc --noEmit` error; (3) the file does not contain any actual test bodies (no `test(...)` call after the `profile` helper) — the trailing `// ... further implementation` comment marks where the upstream sync truncated. The path `src/core/test/` does not exist elsewhere in the repository — Alexi places tests either alongside the source (`src/**/*.test.ts`) or under the top-level `tests/` directory (see `vitest.config.ts`'s `include` glob), never under `src/core/test/`. There is no `linux-sandbox` surface in Alexi; sandbox-related code (if any is added in the future) would live under `src/permission/` next to the existing rule evaluator at `src/permission/next.ts`, not under `src/core/test/`. The file is not imported by any module.

### Removed

- **Two additional upstream-sync orphan stub files** (code-review cleanup, 2026-06-23, fix(review): `remove orphan src/tool/bash.ts and src/tool/skill.ts stubs [alexi-bot]`): The PR `auto/sync-upstream-2026-06-23-run142` introduced two comment-only files under `src/tool/` that collided with the canonical implementations under `src/tool/tools/` and matched the same upstream-sync orphan pattern documented in the entries below.
  - `src/tool/bash.ts` (2-line comment-only stub, contents `// Updated bash tool logic` and `// Reflect changes in opencode bash tool logic for improved command handling`): no `import`, no `export`, no executable code. The canonical `bash` tool lives at `src/tool/tools/bash.ts` and is registered via `src/tool/registry.ts`. Nothing in the source tree imported `src/tool/bash.ts`. The note in the prior `### Removed` entry that listed `bash.ts` among "explicit infrastructure modules" is inaccurate for this repository — the only sibling files under `src/tool/` that are real infrastructure are `encoded-io.ts`, `index.ts`, `native.ts`, `plugin-tools.ts`, `registry.ts`, `schema.ts`, `truncate.ts`, and `warpgrep.ts`.
  - `src/tool/skill.ts` (2-line comment-only stub, contents `// Simplified logic` and `// Refactor skill tool logic for maintainability`): no `import`, no `export`, no executable code. The canonical `skill` tool lives at `src/tool/tools/skill.ts` and is registered via `src/tool/registry.ts`. Nothing in the source tree imported `src/tool/skill.ts`.
- The previous `### Removed` entry's parenthetical list of "explicit infrastructure modules" included `bash.ts`, `shell.test.ts`, and `skill.ts` as if they were legitimate residents of `src/tool/`. They are not: `bash.ts` and `skill.ts` were upstream-sync stubs (now deleted in this entry), and `shell.test.ts` does not exist at `src/tool/shell.test.ts` in this repository. The accurate invariant is unchanged: canonical tool implementations live exclusively under `src/tool/tools/` and are registered via `src/tool/registry.ts`.

- **Four broken upstream-sync orphan stub files** (autohealing cleanup, commits `63f359da` and `5399f5bf`, 2026-06-23, fix(ci): `remove broken orphan stub files from upstream sync [autohealing]` and `remove invalid src/core/package.json orphan stub [autohealing]`): The CI autohealer removed four scaffold/stub files emitted into the wrong locations by the daily upstream sync at commit `633b983a` (`feat(sync): apply upstream changes (2026-06-23)`). All four files broke `typecheck`, `lint` (parser errors), and `format:check`, were syntactically invalid, were never imported by any module in the source tree, and are not part of any canonical implementation surface. Removal is a no-behavior, no-API, no-runtime-shape change that restores a green CI pipeline. Individual file impact:
  - `src/tool/prompt.ts` (2-line stub, `index fc7b00ae..00000000`): A single `import * as Encoding from '../kilocode/encoding'` against the non-existent path `src/kilocode/encoding` — `src/kilocode/` is not a directory in this repository — followed by a `// Updated encoding logic` comment. There is no `Encoding` namespace, no consumer of `prompt.ts`, and no real prompt-encoding surface at that location; prompt construction in Alexi lives in `src/agent/prompts/` (system-prompt templates for `code` / `debug` / `plan` / `explore` agents) and in `src/core/orchestrator.ts` (message-array assembly before the SAP AI Core Orchestration call). The file was an upstream-sync scaffold that never wired into anything.
  - `src/tool/read.ts` (2-line stub, `index 48e62256..00000000`): A single orphan `const suffix = (length: number) => \`... (line truncated to ${length} chars)\`` with no surrounding module context, no `export`, and no `import`, followed by a `// Additional logic to handle Unicode slice length reporting` comment. The path collided with the canonical read-tool implementation at `src/tool/tools/read.ts` (the `readTool` registered under the name `'read'` via `src/tool/registry.ts`, with `file_path`, `offset?`, and `limit?` parameters and `permission.action: 'read'` — see `docs/API.md`'s _Built-in Tools_ table). Nothing in the source tree imported `src/tool/read.ts`; line-truncation reporting is already handled inside `src/tool/tools/read.ts` and is unaffected by this deletion.
  - `src/tool/shell.ts` (3-line stub, `index 416a8579..00000000`): A dangling `return ChildProcess.make(shell, Shell.args(shell, command, cwd), { ...` fragment with no surrounding function declaration, no closing brace, no `import`, and no `export`, sandwiched between two comment lines (`// Adjusted handling for PowerShell args` and `// Additional logic to handle encoding issues with PowerShell arguments`). The `ChildProcess` and `Shell` symbols are undeclared and the statement is at file scope, which is a hard parser error. The path collided with the canonical shell-tool implementation at `src/tool/tools/shell.ts` (the cross-platform shell-invocation tool that backs the `bash` tool surface; PowerShell argument handling lives there and in `src/tool/bash.ts`). Nothing in the source tree imported `src/tool/shell.ts`.
  - `src/core/package.json` (4-line stub, `index 04ee9b9e..00000000`): A malformed JSON document containing `{ \"version\": \"7.3.54\", // Updated to align with latest version updates }` with a JavaScript-style `//` line comment (which is not valid JSON) and a missing final newline. Alexi is a single-package npm project — the only valid `package.json` is the repository root one, currently at version `1.17.16` (line 3 of `package.json`). A nested `package.json` under `src/core/` had no purpose: there is no `src/core/` workspace, no nested build target, and Node's package-boundary resolution would have treated this as a separate module type declaration, breaking the ESM module resolution that the root `\"type\": \"module\"` provides for all `.ts` files under `src/`. The `7.3.54` version reference is also unrelated to anything in Alexi — that string matches the upstream `@kilocode/plugin` / `@kilocode/sdk` lockfile-tooling versions tracked in `.kilo/package-lock.json` and `.kilocode/package-lock.json`, not the Alexi published package.
- These deletions extend the stub-removal pattern already documented in commits `085951af` (seven files, including the prior round of `src/tool/task.ts`, `src/tool/notebook.ts`, `src/tool/read-docx.ts`, `src/tool/xlsx.ts`, `src/tool/recall.test.ts`, `src/tool/agent-manager.ts`, and an earlier `src/core/package.json`) and `dff69219` (three files: `src/core/global.ts`, `src/permission/schema.ts`, `src/tool/codesearch.ts`). The architectural invariant remains: canonical tool implementations live exclusively under `src/tool/tools/` and are registered via `src/tool/registry.ts`; sibling stubs at `src/tool/*.ts` that are not the registry, `index.ts`, or one of the explicit infrastructure modules (`bash.ts`, `encoded-io.ts`, `native.ts`, `parameters.test.ts`, `plugin-tools.ts`, `schema.ts`, `shell.test.ts`, `skill.ts`, `truncate.ts`, `warpgrep.ts`) are upstream-sync noise and must be deleted. The CI auto-fix run at commit `38fac428` (`style(ci): auto-fix lint/format issues [alexi-bot]`) preceded the deletions and applied Prettier/ESLint conformance to other files in the same working tree; it did not touch the four orphans removed here.

### Changed

- **Quote-style normalization across two orphan upstream-sync stubs** (commit `2dd6f396`, `style(ci): auto-fix lint/format issues [alexi-bot]`, 2026-06-26, following the upstream sync at commit `114cb567` — `feat(sync): apply upstream changes (2026-06-26)`): The CI auto-fix workflow ran ESLint `--fix` and Prettier across the working tree after the daily upstream sync emitted two scaffold files. Both changes are pure formatting (no behavioral, API, runtime, or type-shape impact) and CI verifies them via the `format:check` and `lint` jobs. The dominant pattern is double-quote -> single-quote rewrites per Prettier `singleQuote: true`. Individual file impact:
  - `src/core/config/mcp.ts` (4-line orphan stub, `index 4fd25b96..1bc321d7`): The `Schema.Class<Info>("ConfigV2.MCP")` literal in the class declaration was rewritten to single quotes (`'ConfigV2.MCP'`). The file is a 4-line stub declaring `class Info extends Schema.Class<Info>('ConfigV2.MCP')({ timeout: Timeout.pipe(Schema.optional), servers: Schema.Record(Schema.String, Server).pipe(Schema.optional) }) {}` with no `import` statements and no surrounding module context. It is broken on multiple axes: (1) the file has no imports, so `Schema`, `Timeout`, and `Server` are all undeclared symbols — a hard `tsc --noEmit` error; (2) the path `src/core/config/` does not match any canonical Alexi configuration surface — the real configuration modules live in `src/config/` (`routingConfig.ts`, `userConfig.ts`, `projectContext.ts`) and the canonical MCP wiring lives in `src/mcp/` (`client.ts`, `config.ts`, `index.ts`, `server.ts`); (3) the `'ConfigV2.MCP'` schema name suggests an upstream Effect-Schema migration that has not landed in Alexi. Nothing in the source tree imports `src/core/config/mcp.ts`.
  - `src/tool/notebook-host.ts` (7-line orphan stub, `index cfa23b0c..000293d9`): All five top-of-file imports were rewritten from double quotes to single quotes — `'@/kilocode/notebook/service'`, `'@/kilocode/notebook/protocol'`, `'@opencode-ai/core/schema'`, `'@/tool/tool'`, and `'effect'`. The file is a 7-line scaffold ending with the comment `// Define notebook host implementation here, similar to upstream`; it declares no exports, no functions, and no host implementation body. It is broken on multiple axes: (1) the `@/kilocode/notebook/service`, `@/kilocode/notebook/protocol`, and `@/tool/tool` path aliases do not resolve — Alexi does not use a `@/` path alias in its `tsconfig.json` `paths` configuration, and no `kilocode/notebook/` subtree exists in the repository; (2) `@opencode-ai/core/schema` is not in the dependency graph of the root `package.json`; (3) the local imports lack the `.js` suffix required by NodeNext ESM resolution at runtime. The path `src/tool/notebook-host.ts` does not collide with any canonical implementation — the canonical notebook tool lives at `src/tool/tools/notebook.ts` and is registered via `src/tool/registry.ts` under the name `'notebook'`; there is no separate "notebook host" surface in Alexi. Nothing in the source tree imports `src/tool/notebook-host.ts`. Both files match the upstream-sync orphan pattern documented repeatedly in earlier entries and are candidates for autohealing removal in a follow-up `fix(ci): remove broken orphan stub files from upstream sync [autohealing]` commit, alongside the three orphans documented in the 2026-06-25 `### Added` entry above.
- **Version bumped** from `1.17.17` to `1.17.18` in `package.json` (line 3), accompanying the 2026-06-25 upstream sync commit `91636a6c`. Single-line patch-level bump (`semver` patch, no API surface change); the `dependencies`, `devDependencies`, `optionalDependencies`, `engines.node` (`>=22.12.0`), `bin` (`alexi`, `ax`), and `scripts` blocks of `package.json` are unchanged.
- **Upstream sync metadata refreshed** in `.github/last-sync-commits.json` (workflow run `28160209547`, timestamp `2026-06-25T09:23:49Z`): all three upstream references advanced in a single sync cycle.
  - `kilocode` upstream HEAD advanced from `3063fde7` to `761b6339` (`Kilo-Org/kilocode`, fork `ausard/kilocode`).
  - `opencode` upstream HEAD advanced from `cacb7d04` to `f55d8fa3` (`anomalyco/opencode`, fork `ausard/opencode`).
  - `claude-code` upstream HEAD advanced from `2aa6ef3d` to `0bd95433` (`anthropics/claude-code`, fork `direct-clone`).
  - `metadata.workflow_run` advanced from `28089024908` to `28160209547`; `metadata.version` (`1.1.0`) and `metadata.description` (`Tracks last synced commits from upstream repositories`) are unchanged.
- **Agent-runner tooling lockfile bump** (commit `2f10d4af`, `chore(agent): factory engineering run [agent]`): The pinned versions of `@kilocode/plugin` and `@kilocode/sdk` were advanced from `7.3.50` to `7.3.53` in both workspace tooling lockfiles, `.kilo/package-lock.json` and `.kilocode/package-lock.json`. The change is two files, sixteen insertions and sixteen deletions, restricted to the `version`, `resolved`, and `integrity` fields of the two packages and the `dependencies."@kilocode/plugin"` and `"@kilocode/sdk"` entries that reference them. No `package.json` was modified, no transitive dependency was added or removed (the `dependencies` block of `@kilocode/plugin` continues to pin `@kilocode/sdk`, `effect@4.0.0-beta.66`, and `zod@4.1.8`, and `@kilocode/sdk` continues to pin `cross-spawn@7.0.6`), and no file under `src/`, `tests/`, `docs/`, or the repository-root build configuration was touched. The `.kilo/` and `.kilocode/` directories provide the local CLI runtime for the agent fleet workflows under `.github/workflows/agent*.yml` and are not part of Alexi's published package — runtime users, the `alexi` / `ax` bins, the `dist/` build output, and the public API surface are unaffected. No behavioral, API, type-shape, CLI-surface, or test-coverage impact; no `package.json` version bump.
- **Quote-style and trailing-newline normalization across nine orphan upstream-sync stubs** (commit `6dc4b883`, `style(ci): auto-fix lint/format issues [alexi-bot]`, 2026-06-22, following the upstream sync at commit `a49613e6` — `feat(sync): apply upstream changes (2026-06-22)`): The CI auto-fix workflow ran ESLint `--fix` and Prettier across the working tree after the daily upstream sync emitted nine scaffold files. All nine changes are pure formatting (no behavioral, API, runtime, or type-shape impact) and CI verifies them via the `format:check` and `lint` jobs. The dominant pattern is double-quote → single-quote rewrites per Prettier `singleQuote: true` plus a trailing LF appended to files that the sync emitted without a final newline. Individual file impact:
  - `src/agent/index.ts` — the four sync-emitted lines at the top of the file (`import { Array, Context, Effect, Layer, Schema, Scope, Types } from "effect"`, `import { ModelV2 } from "./model"`, `import { PermissionV2 } from "./permission"`, `import { ProviderV2 } from "./provider"`) and the `Schema.brand("AgentV2.ID")` literal were rewritten to single quotes. The canonical Alexi Agent System (`AgentSchema`, `AgentMode`, `AgentRegistry`, `getAgentRegistry`, `getCurrentAgent`, `switchAgent`, `parseAgentSwitch`, `parseAgentMention`, `getAskAgentBashRules`, built-in agents `code` / `debug` / `plan` / `explore` / `orchestrator`) starts at line 12 with `import { AgentSwitched } from '../bus/index.js';` and is completely untouched. The sync-emitted block above it (lines 6–11) remains broken at runtime: the imported paths `./model`, `./permission`, `./provider` and the `effect` package's `Schema.brand` API do not resolve in the current build — this is tracked as a stub-cleanup follow-up identical to the patterns recorded in commits `085951af` and `dff69219`.
  - `src/core/config.ts` — `import { Config } from "core"` rewritten to single quotes plus a trailing LF appended after the `// Advanced configuration handling` comment. The file is a 4-line orphan stub: the `'core'` package is not in the dependency graph (the actual configuration surface lives in `src/config/` — `routingConfig.ts`, `userConfig.ts`, `projectContext.ts`) and `Config.loadSchema()` / `Config.applyDefaults()` are not real APIs in Alexi.
  - `src/core/index.ts` — five string literals in the `coreDependencies` object (`"@types/semver"`, `"@ai-sdk/amazon-bedrock"`, `"4.0.107"`, `"@ai-sdk/google-vertex"`, `"4.0.128"`, `"gitlab-ai-provider"`, `"6.8.0"`) plus the two top-of-file imports (`Version` from `'core'`, `Dependency` from `'effect'`) rewritten to single quotes. The file is a 9-line orphan stub: it declares a `coreDependencies` constant that is not exported, not consumed, and references AI SDK packages (`@ai-sdk/amazon-bedrock`, `@ai-sdk/google-vertex`, `gitlab-ai-provider`) that are explicitly out of scope — Alexi is single-provider (SAP AI Core Orchestration) by architectural invariant. The canonical version source remains the root `package.json` (currently `1.17.14`); there is no `src/core/index.ts` entry point.
  - `src/event/index.ts` — Prettier reflowed the `EventBus` object literal from 4-space to 2-space indentation, removed the missing-newline-at-end-of-file marker, and reformatted the two method declarations onto consistent lines. The file is an 8-line orphan stub: it declares an `EventBus.registerEvent` / `EventBus.dispatchEvent` pair whose parameter type `EventHandler` is undeclared and whose `dispatchEvent(event)` body has no parameter type annotation. The canonical typed event bus is `src/bus/index.ts` (`defineEvent`, `BusEvent`, `waitForEvent`, eager subscription semantics — see `docs/ARCHITECTURE.md`'s _Event Bus Architecture_ section). Nothing imports `src/event/index.ts`.
  - `src/plugin/provider.ts` — `import { ProviderV2 } from "plugin"` rewritten to single quotes plus a trailing LF appended after the `// Updated provider integration logic` comment. The file is a 3-line orphan stub: the `'plugin'` package is not in the dependency graph and `ProviderV2.integrateNewAPI()` is not a real API. The canonical plugin system lives in `src/plugin/index.ts` (`PluginManager`, `PluginManifestSchema`, `loadAutoDiscovered`) and the canonical provider surface in `src/providers/sapOrchestration.ts`.
  - `src/session/index.ts` — `import { Session } from "session"` rewritten to single quotes plus a trailing LF appended after the `// Secure session switching logic` comment. The file is a 3-line orphan stub: the `'session'` package is not in the dependency graph and `Session.configureSwitchingEndpoints()` is not a real API. The canonical session model lives in `src/core/sessionManager.ts` (persistence to `~/.alexi/sessions/`).
  - `src/tool/parameters.test.ts.snap.ts` — trailing LF appended after the single-line comment `// Updated snapshot test reflecting new parameters`. The file contains no `describe`/`it`/`expect` blocks and no actual snapshot content; the `.snap.ts` filename does not match Vitest's snapshot conventions either (Vitest uses `__snapshots__/<test>.snap` next to the source test). The file currently contributes nothing to coverage.
  - `src/tool/task.ts` — Prettier reflowed the empty `TaskManager` class body from 4-space to 2-space indentation and appended a trailing LF after the closing `}`. The file remains a 3-line orphan placeholder declaring an empty `class TaskManager`. The canonical task tool implementation continues to live at `src/tool/tools/task.ts` and is registered via `src/tool/registry.ts` under the name `'task'` (with `subagent_type`, `prompt`, `description`, `task_id?`, `background?` parameters — see `docs/API.md`'s _Built-in Tools_ table). Nothing imports `src/tool/task.ts`. Note: a prior round of formatting touched a different orphan at the same path on commit `fe8b98c5` (the `inherited(input)` helper); that helper was subsequently replaced by the current empty-class scaffold during the 2026-06-22 upstream sync.
  - `src/tool/webfetch.ts` — Prettier reflowed the empty `webFetch` function body from 4-space to 2-space indentation and appended a trailing LF after the closing `}`. The file remains a 3-line orphan placeholder declaring `webFetch(url: string, options?: FetchOptions)` whose `FetchOptions` type is undeclared and whose body is a comment-only stub. The canonical webfetch tool implementation continues to live at `src/tool/tools/webfetch.ts` and is registered via `src/tool/registry.ts` under the name `'webfetch'` (with `url`, `format?`, `timeout?` parameters, `permission.action: 'network'` — see `docs/API.md`'s _Built-in Tools_ table). Nothing imports `src/tool/webfetch.ts`.
- **Quote-style, semicolon, and trailing-newline normalization in `src/tool/task.ts`** (commit `fe8b98c5`, `style(ci): auto-fix lint/format issues [alexi-bot]`): The CI auto-fix workflow ran ESLint `--fix` and Prettier on the orphan `inherited(input)` helper that the 2026-06-20 upstream sync (commit `3ef8b887`) emitted into `src/tool/task.ts`. The auto-fix produced three classes of byte-level corrections: (1) trailing semicolons added to the four field declarations in the `input` parameter object type literal (`caller: Agent.Info;`, `session: Session.Info;`, `rules: Permission.Rule[];`, `mcp?: Record<string, any>;`) and to the two top-level statements (`const prefixes = ...;`, `const isMcp = ...;`) plus the closing `);` of the `rules.filter(...)` return; (2) all six string literals (the `'_'` replacement target inside `k.replace(/[^a-zA-Z0-9_-]/g, '_')`, the `'_'` suffix concatenation, and the four permission-action / permission-name comparison strings `'deny'`, `'edit'`, `'bash'`) rewritten from double quotes to single quotes to satisfy Prettier `singleQuote: true`; (3) a trailing LF newline appended after the closing `}` (the upstream-emitted file lacked the final newline). The `filter` callback was also re-flowed onto two lines and the trailing dangling comma after the predicate removed to match Prettier's `arrowParens` and `trailingComma: 'es5'` settings. Pure formatting change with no behavioral, API, runtime, or type-shape impact; CI verifies it via the `format:check` and `lint` jobs. The file remains a 14-line orphan stub: it exports a single `inherited` function that references three undeclared namespaces (`Agent.Info`, `Session.Info`, `Permission.Rule`) and an undeclared `rules` symbol inside the body (the parameter is `input.rules`, not `rules`), and no module imports `task.ts`. The path collides with the previously-removed stub at the same location (changelog entry under `### Removed`, commit `085951af`); the canonical task tool implementation continues to live at `src/tool/tools/task.ts` and is registered via `src/tool/registry.ts`. The orphan should either be wired into a real subagent permission-inheritance surface (using the existing `src/agent/subagent-permissions.ts` module's `Agent`/`Session`/`Permission` types and fixing the `rules` reference to `input.rules`) or removed in a follow-up cleanup, similar to the stub-removal pattern recorded in earlier `### Removed` entries.
- **Quote-style normalization and trailing-newline fixes across eight orphan stubs** (commit `47005135`, `style(ci): auto-fix lint/format issues [alexi-bot]`): The CI auto-fix workflow ran ESLint `--fix` and Prettier across the working tree and emitted byte-level formatting corrections in eight files. All eight changes are pure formatting (no behavioral, API, runtime, or type-shape impact) and CI verifies them via the `format:check` and `lint` jobs. Individual file impact:
  - `src/agent/index.ts` — single import statement `import { AgentV2 } from "./agent"` rewritten to single quotes (`'./agent'`) to satisfy Prettier `singleQuote: true`. The file remains the canonical Agent System module exporting `AgentSchema`, `AgentMode`, `AgentRegistry`, `getAgentRegistry`, `getCurrentAgent`, `switchAgent`, `parseAgentSwitch`, `parseAgentMention`, `getAskAgentBashRules`, and the five built-in agents (`code`, `debug`, `plan`, `explore`, `orchestrator`). Note: the JSDoc header import is missing the `.js` suffix required by NodeNext ESM resolution at runtime — this is tracked separately as a follow-up because the file currently still resolves via the bundler's TypeScript path-rewriting and not the runtime ESM loader.
  - `src/cli/index.ts` — added the missing trailing LF newline to the single-line scaffold comment `// Add new CLI enhancements from upstream changes`. The file remains an empty placeholder; the canonical CLI entry point is `src/cli/program.ts` (Commander.js program registered as the `alexi` and `ax` bins).
  - `src/core/account.ts` — `import { ID, ServiceID, OAuthCredential, ApiKeyCredential, Credential } from "./util/schema"` rewritten to single quotes plus a trailing LF appended after the `// Implement new account structure based on upstream changes` comment. The file remains a 3-line orphan stub: the imported path `./util/schema` does not exist (no `src/core/util/` directory; the only `schema.ts` under `src/core/` lives at `src/core/integration/schema.ts`), and no module imports `account.ts`. This is a leftover scaffold from an upstream sync and should either be wired into a real account/credential surface (with a corresponding canonical `schema.ts` location) or removed in a follow-up cleanup, similar to the stub-removal pattern recorded in earlier `### Removed` entries.
  - `src/core/auth.ts` — added the missing trailing LF newline to the single-line scaffold comment `// Remove old authentication methods; integrate new security patterns`. Orphan stub; not imported by any module. The canonical SAP AI Core authentication path lives in `src/providers/sapOrchestration.ts` and the OAuth/Service-Key flow under `src/providers/auth.ts`.
  - `src/permission/evaluate.ts` — added the missing trailing LF newline to the single-line scaffold comment. Orphan stub; not imported by any module. The canonical permission evaluator is `src/permission/next.ts` (`evaluatePermission`, rule matcher, wildcard support) wired through `src/permission/index.ts`.
  - `src/router/index.ts` — added the missing trailing LF newline to the single-line scaffold comment `// Add new router enhancements based on upstream`. Orphan stub; not imported by any module. The canonical model router is `src/core/router.ts` (rule-based selection driven by `routing-config.json`).
  - `src/session/data.ts` — added the missing trailing LF newline to the single-line scaffold comment `// Integrate new session data model changes`. Orphan stub; not imported by any module. The canonical session data model lives in `src/core/sessionManager.ts` (persistence to `~/.alexi/sessions/`).
  - `src/tool/skill.test.ts` — added the missing trailing LF newline to the single-line scaffold comment `// Add new test cases from upstream`. The file is an empty placeholder Vitest test (no `describe`/`it` blocks) and currently contributes nothing to coverage. The canonical skill tool tests should live alongside `src/tool/tools/skill.ts`; the existing regression test in `tests/` covering the skill tool description guard is unaffected.
- **Quote-style normalization in `src/core/billing.ts`** (commit `b85d2f47`, `style(ci): auto-fix lint/format issues`): The two `setup_future_usage: "off_session"` string literals inside the `paymentOptions.payment_method_options.card` and `.link` blocks were rewritten from double quotes to single quotes to satisfy the repository's Prettier `singleQuote: true` setting. Pure formatting change with no behavioral, API, runtime, or type-shape impact. The file remains a 10-line orphan export (`paymentOptions`) that is not imported by any module in the current source tree; it is a leftover scaffold from an upstream sync and should either be wired into a payment/billing surface or removed in a follow-up cleanup, similar to the stub-removal pattern recorded in earlier `### Removed` entries.
- **Version bumped** from `1.17.1` to `1.17.2` in `package.json` (release reference: PR #758, commit `1b0df735` — `feat(sync): apply upstream changes (2026-06-11)`).
- **Upstream sync metadata refreshed** in `.github/last-sync-commits.json` (workflow run `27340436170`, timestamp `2026-06-11T10:27:47Z`):
  - `kilocode` upstream HEAD advanced from `c7a06d2f` to `8b2a1000` (`Kilo-Org/kilocode`).
  - `opencode` upstream HEAD advanced from `97e713e8` to `318dbe93` (`anomalyco/opencode`).
  - `claude-code` upstream HEAD advanced from `1c5f951a` to `3a7c7361` (`anthropics/claude-code`).
- **Header-comment formatting normalization** (commit `9e105b7c`, agent factory engineering run): Removed the extra blank line between the JSDoc header comment and the first `import` statement in three files to satisfy the repository's Prettier configuration. Pure formatting change with no behavioral, API, runtime, or type-shape impact:
  - `src/agent/index.ts` (Agent System — `AgentSchema`, `AgentMode`, agent registry and `@syntax` switching).
  - `src/core/catalog.ts` (Model Catalog — `ModelCapability` Zod enum and centralized model capability tracking).
  - `src/tool/registry.ts` (Enhanced Tool Registry — `EnhancedToolRegistry`, `PromptToolResolver`, `ToolResolutionContext`, `ToolResolutionError`).

### Added

- **Skill tool description guard test** (`src/tool/skill.test.ts`): A regression test asserting that the registered skill tool's description does not contain the placeholder strings `tool-skill` or `Skill for tool tests.`, both of which were used by an upstream test scaffold and must not leak into the production tool description rendered to the LLM. The canonical skill tool implementation lives in `src/tool/tools/skill.ts` and is exported as `skillTool` (registered under the name `'skill'`).

### Changed

- **Version bumped** from `0.5.12` to `0.5.13` in `package.json` and `package-lock.json`.
- **Dev-dependency patch updates** (Dependabot, PR #735): `@types/node` from `^25.9.1` to `^25.9.2` and `@types/react` from `^19.2.16` to `^19.2.17`. Type-only updates with no runtime impact; covered by the existing `npm run typecheck` and `npm run build` CI gates.
- **Upstream sync metadata refreshed** in `.github/last-sync-commits.json`: pulled commit `0050134d` from `anomalyco/opencode` (previously `e82542b8`), and refreshed the `last_synced_at` timestamps for `kilocode`, `opencode`, and `claude-code` to `2026-06-08T10:58:44Z`. Workflow run id updated to `27132986362`. The `kilocode` and `claude-code` upstream HEADs were unchanged in this sync.
- **Semicolon normalization in session prompt-queue stub** (commit `8a005f03`, CI auto-fix): Added a missing trailing semicolon after the early-return statement inside `cancel(sessionID: string)` in `src/session/prompt-queue.ts` to satisfy the repository's Prettier `semi: true` setting. Pure formatting change with no behavioral or API impact. The file itself remains a 7-line scaffold introduced by the 2026-06-09 upstream sync (commit `33fb1d5e`): the `cancel` function references an undeclared `activeTails` symbol and is not currently wired into any module. It should either be implemented (declaring `activeTails` and the rest of the cancel logic, then exposing the function from a session module) or removed in a follow-up, similar to the stub cleanup pattern documented in earlier `### Removed` entries.

### Known issues

- The new `src/tool/skill.test.ts` file imports a `tool` symbol from `./registry`, but `src/tool/registry.ts` does not currently export such a binding (it exports `EnhancedToolRegistry`, `ToolResolutionContext`, `PromptToolResolver`, `ToolResolutionError`, and re-exports `getAllToolNames`). The test therefore fails with `TypeError: Cannot read properties of undefined (reading 'description')` at runtime. Either the test must import `skillTool` from `./tools/skill.js` (and the assertions adjusted to read `skillTool.description`), or `registry.ts` must export a named `tool` binding pointing at the registered skill tool. This is tracked as an autohealing follow-up.

### Removed

- **Broken upstream-sync stub files** (autohealing cleanup, commit `085951af`): The CI autohealer removed seven scaffold/stub files that had been emitted into the wrong locations by the daily upstream sync and were breaking the build:
  - `src/tool/agent-manager.ts` (7-line stub referencing the non-existent `kilocode/tool` package; the real agent registry lives in `src/agent/`)
  - `src/tool/notebook.ts` (12-line incomplete stub; the canonical notebook tool implementation is `src/tool/tools/notebook.ts`, registered via `src/tool/registry.ts`)
  - `src/tool/read-docx.ts` (12-line stub depending on the un-installed `mammoth` package; no canonical implementation — `.docx` reading is not currently a supported tool)
  - `src/tool/xlsx.ts` (single-line placeholder; XLSX text extraction is not currently a supported tool)
  - `src/tool/task.ts` (single-line placeholder; the canonical task tool is `src/tool/tools/task.ts`)
  - `src/tool/recall.test.ts` (single-line placeholder test; the canonical recall tool tests live alongside `src/tool/tools/recall.ts`)
  - `src/core/package.json` (8-line malformed JSON fragment containing a `// list of dependencies` comment, which is not valid JSON; Alexi is a single-package npm project — the only valid `package.json` is the repository root one)
- These deletions correct an earlier, incorrect changelog entry that claimed the document reader tools at `src/tool/notebook.ts` and `src/tool/read-docx.ts` had received a quote-style normalization. Those paths were never canonical implementations; only the stubs at those paths existed, and they have now been removed.
- **Additional broken upstream-sync stub files** (autohealing cleanup, commit `dff69219`, 2026-06-02): The CI autohealer removed three more scaffold/stub files emitted by the same daily upstream sync that were breaking `typecheck`, `lint`, and `format:check`:
  - `src/core/global.ts` (16-line stub defining a `Path`-based `Interface` against an undefined `Path` global; not imported anywhere in the codebase — the canonical filesystem-path utilities live in `src/utils/` and `src/core/filesystem.ts`)
  - `src/permission/schema.ts` (7-line stub importing a non-existent `PermissionSchema` from `@opencode-ai/core`; the canonical permission types and `PermissionManager` live in `src/permission/index.ts`, the rule evaluator in `src/permission/next.ts`, and the Zod schemas in `src/permission/index.ts`)
  - `src/tool/codesearch.ts` (6-line stub importing a non-existent `CodeSearch` from `@opencode-ai/tool`; code search inside Alexi is provided by the `grep` and `glob` tools under `src/tool/tools/` and registered via `src/tool/registry.ts`)
- The `@opencode-ai/*` packages are not part of Alexi's dependency graph — these stubs were never wired into any module, registry, or build target.

### Added

- **`code-review` command** (`src/command/codeReview.ts`): Structured correctness-bug review over `git diff`. Three new surfaces wire the same `executeCodeReview` core:
  - Non-interactive CLI subcommand `alexi code-review` (`src/cli/commands/codeReview.ts`) with `--effort low|medium|high`, `--base <branch>`, `--model <id>`, and `--workdir <path>` flags
  - Slash command `/code-review [low|medium|high]` in the legacy interactive REPL (`src/cli/interactive.ts`) with cancellation via Ctrl+C through a dedicated `AbortController`
  - Slash command `/code-review` in the Ink-based TUI (`src/cli/tui/hooks/useCommands.ts`) routed through the shared command registry
- **Effort-based model routing for code review** (`pickModelForEffort` in `src/command/codeReview.ts`): `high` prefers a reasoning + `expensive` cost-tier model, `low` prefers a `cheap` cost-tier model, `medium` uses `getDefaultModel()`. Falls back to the default model when no candidate matches.
- **Empty-diff fast path**: Returns `No changes to review.` without invoking the LLM when `git diff HEAD` (or `git diff <base>...HEAD`) is empty, with `modelUsed: ''` and `totalTokens: 0` in the result.
- **Slash command autocomplete entry** for `/code-review` (`src/cli/utils/completer.ts`).
- **Tests** for the new code-review surfaces:
  - `tests/command/codeReview.test.ts` — core executor, effort routing, empty-diff path, abort signal, and base-branch target
  - `src/cli/commands/__tests__/codeReview.test.ts` — Commander wiring smoke test (subcommand registration, default uncommitted target, `--effort` and `--base` propagation)

### Changed

- Interactive REPL `/help` listing now includes `/code-review [low|medium|high]` under the general commands section (`src/cli/interactive.ts`).
- Documented `KILO_DISABLE_EXTERNAL_SKILLS` as a supported optional environment variable in `docs/API.md`.
- Normalized formatting in three orphaned scaffold files via CI auto-fix (commit `3ed5b5b1`): added a final newline at end of file in `src/core/global.ts` and `src/tool/codesearch.ts`, and added a trailing comma plus final newline in `src/permission/schema.ts`. These are pure Prettier conformance changes (no behavioral or API impact) applied to files that are not yet wired into the runtime — they remain isolated scaffolds (referencing the unresolved `Path` symbol in `src/core/global.ts` and the non-existent `@opencode-ai/core` and `@opencode-ai/tool` packages in the other two) and should be either implemented or removed in a follow-up, similar to the stub cleanup in commit `085951af`.
- Normalized quote style from double quotes to single quotes via CI auto-fix (commit `49db14b1`) across four files to satisfy the repository's Prettier `singleQuote: true` setting: `src/agent/index.ts` (the two top-of-file imports — `withStatics, type DeepMutable` from `@opencode-ai/core/schema` and the `* as KiloAgent` namespace import from `@/kilocode/agent`), `src/bus/EventBus.ts` (single import of `Event` from `@/core/event`), `src/core/flag.ts` (the `UNSTABLE_CHANNELS` set literal `['dev', 'beta', 'local']` plus a missing trailing newline), and `src/tool/apply-patch.ts` (single import of `Patch` from `@/core/patch`). Pure Prettier conformance change with no behavioral, API, or runtime impact. Three of the four files (`EventBus.ts`, `flag.ts`, `apply-patch.ts`) remain two-line orphan scaffolds that import symbols from path aliases (`@opencode-ai/*`, `@/core/event`, `@/core/patch`, `@/kilocode/agent`) which are not currently resolvable in the build — see the `### Removed` entries above for the broader pattern of these upstream-sync-emitted stubs.

### Fixed

- Restored the `truthy()` helper in the core flag module (`src/core/flag.ts`) that the `KILO_DISABLE_EXTERNAL_SKILLS` export depends on. The helper had been removed in an earlier change, leaving an unreferenced symbol that broke compilation and prevented the flag from being evaluated. The exported flag now correctly resolves to `true` when the environment variable is set to `"true"` or `"1"` (case-insensitive) and `false` otherwise.

## [1.17.31] - 2026-07-12

### Fixed

- **CI: avoid gawk reserved word in agent5 workflow, add doc-update timeout** (`cbaf7abc`): Renamed a shell variable in `.github/workflows/agent5-release.yml` that collided with a `gawk` reserved word (causing intermittent parse errors on runners where `awk` resolves to `gawk`), and added an explicit `timeout-minutes` to the documentation-update job in `.github/workflows/documentation-update.yml` so the workflow no longer hangs on the runner's default 6-hour ceiling when the model is slow to respond.

### Maintenance

- **Weekly metrics report refreshed for 2026-07-12** (`18008f2c`, `docs(ci): weekly metrics 2026-07-12 [alexi-bot]`): Regenerated `.github/reports/weekly-metrics-*.md` via the scheduled reporting workflow. Documentation-only, no source or build impact.
- **Factory consulting run committed** (`0c15a478`, `chore(ci): factory consulting run [agent]`): Routine agent-factory consulting-role dry run committed by the T-shape factory scheduler; no runtime, API, or CLI surface change.

## [0.5.2] - 2026-05-25

### Changed

- Normalized trailing whitespace in permission module (`src/permission/allow-everything.ts`), background process tool (`src/tool/tools/background-process.ts`), and shell prompt builder (`src/tool/tools/shell/prompt.ts`) via CI auto-fix
- Removed extraneous trailing spaces on lines within object returns and between function blocks for consistent code style

## [0.5.1] - 2026-05-19

### Added

- **Rewind command** (`/rewind`): Navigate conversation history by turn boundaries with discard and summarize modes (`src/command/rewind.ts`)
- **Session replay** (`src/cli/session-replay.ts`): Replay session history when resuming interactive sessions with configurable message filtering
- **Network manager** (`src/core/network.ts`): Automatic reconnection with exponential backoff to prevent session loss during network interruptions
- **Partial compaction** (`partialCompact` in `src/core/compaction.ts`): Summarize a subset of messages up to a given index while preserving recent messages
- **Enhanced tool registry** (`src/tool/registry.ts`): Dynamic prompt-based tool resolution with `PromptToolResolver` interface
- **Plugin tool wrappers** (`src/tool/plugin-tools.ts`): Compatibility layer ensuring plugin tools receive Promise-based `ask` instead of Effect
- **Reference service** (`src/reference/reference.ts`): External repository reference management with local and git source types
- **Repository cache with typed failures** (`src/reference/repository-cache.ts`): TTL-based caching with `CacheMissError`, `CacheStaleError`, and `CacheCapacityError` error classes
- **Rewind command tests** (`tests/command/rewind.test.ts`): Comprehensive test suite with 34 test cases covering all rewind modes

### Changed

- Event bus subscriptions are now acquired eagerly to prevent race conditions where events could be missed between subscribe and first listen (`src/bus/index.ts`)
- Slash command completer now includes `/rewind` with description and category (`src/cli/utils/completer.ts`)
- Repo clone tool updated for reference system integration (`src/tool/tools/repo-clone.ts`)
- Upstream sync state updated to latest commits (kilocode, opencode, claude-code) dated 2026-05-19
- Standardized whitespace formatting across event bus and reference modules via CI auto-fix

## [0.5.0] - 2026-05-18

### Added

- Implement #412 ([#421](https://github.com/niclas-simonsson/alexi/pull/421)) (e357c939)

### Maintenance

- Development roadmap 2026-05-18 (1f5f2d38)
- Research trends documentation for CI (d2b5cadd)

## [0.4.22] - 2026-05-17

### Added

- **Reactive context compaction**: Agentic chat now detects context overflow errors from LLM providers and automatically triggers compaction with overflow-seeded target sizing to fit within limits
- **Chunked compaction** (`src/core/compaction-chunks.ts`): Large contexts are split at natural boundaries (newlines, paragraphs) before compaction to stay within API chunk limits
- **Overflow token seeding** in compaction: The `overflowTokens` option in `CompactionOptions` seeds the summarization prompt with a target token count for the summary output
- **Lifecycle hooks in agentic chat**: Integration of `executeHooks`, `createHookContext`, and `getBlockCap` into the agentic execution loop for PreToolUse/PostToolUse/Stop events
- **Block cap for hooks**: Consecutive Stop hook rejections are capped to prevent infinite agent loops; when cap is reached, execution halts with `capped: true`
- **continueOnBlock hook behavior**: When `continueOnBlock: true` on a hook definition, rejections are fed back to the model as context instead of halting execution
- **File inclusion in custom agents**: Agent prompt files now support `{file:path/to/file}` syntax for recursive content inclusion (max depth 3), resolved relative to the agent file directory
- **Background task status tool** (`src/tool/tools/task_status.ts`): Query status of background tasks by ID, returning status, result, timestamps
- **Telemetry module** (`src/utils/telemetry.ts`): Usage metrics tracking service with enable/disable, track, getEvents, and clear APIs
- **Daily PR Merge workflow** (`.github/workflows/daily-merge-prs.yml`): Automated daily merging of open PRs using Kilo CLI with dry-run support
- **/export command in TUI**: Export session data to file via slash command with `addSystemMessage` callback for status feedback
- **addSystemMessage callback** in `useCommands` hook: TUI commands can now display system-level messages in the message list

### Changed

- Custom agent loading functions (`loadAgentFromFile`, `loadAgentsFromDirectory`, `loadAllCustomAgents`, `AgentRegistry.loadCustomAgents`) are now async to support file inclusion resolution
- Compaction `summarize` strategy now accepts `overflowTokens` to seed target summary length via `buildTargetInstruction` and `summarizeWithTarget` internal methods
- `useCommands` hook now accepts `UseCommandsOptions` with optional `addSystemMessage` callback
- TUI `AppLayout` component lifts message state and provides `addSystemMessage` to `useCommands`
- Upstream sync state updated to latest commits (kilocode, opencode, claude-code) dated 2026-05-17
- Version bumped from 0.4.20 to 0.4.22

### Fixed

- Context overflow during agentic chat no longer causes unrecoverable errors; the system detects overflow via pattern matching and retries with compacted context
- MCP client connection handling improved with better error recovery
- Background tasks test timeout increased to prevent CI flakiness

## [0.4.17] - 2026-05-11

### Changed

- Updated write tool logic to improve code formatting and readability in BOM handling for UTF-8 files
- Agent manager tool permission action changed from `manage-agents` to `admin` for consistency with unified permission taxonomy
- Read tool streaming now uses `encoding: undefined` instead of `encoding: null` for correct TypeScript typing
- Truncator nullish coalescing in `truncateOutput` uses explicit parentheses for operator precedence clarity
- Task tool `queueBackgroundTask` uses explicit type assertion (`taskId as string`) for TypeScript strict mode
- Task status tool message filtering reformatted to single-line chained expression

### Fixed

- Resolved ESLint naming conflicts in tool schema definitions by using private schema constants with underscore prefixes
- Fixed TypeScript type error in read tool where `encoding: null` was incompatible with `createReadStream` options
- Fixed unused variable lint error in agent manager tool by prefixing with underscore
- Resolved formatting inconsistencies flagged by Prettier across multiple modules
- Fixed TypeScript type error in task tool where `taskId` was passed without narrowing
- Removed unused `TaskStatus` type import from background tasks test
- Increased background task test timeout from 1100ms to 2000ms to prevent CI flakiness

### Dependencies

- Bump `@typescript-eslint/parser` from 8.59.1 to 8.59.2
- Bump `react` from 19.2.5 to 19.2.6
- Bump `@commitlint/cli` from 20.5.3 to 21.0.0
- Bump `lint-staged` from 16.4.0 to 17.0.4
- Bump `ink` from 7.0.1 to 7.0.2
- Bump `puppeteer` from 24.42.0 to 24.43.1
- Bump `hono` from 4.12.16 to 4.12.18
- Bump `@inquirer/prompts` from 8.4.2 to 8.4.3

## [0.3.1] - 2026-03-21

### Added

- Implementation plan, research, data model, and quickstart for TUI text display fix (005-tui-text-display)
- TUI layout requirements quality checklist (35 items)
- Task breakdown for 005-tui-text-display (26 tasks across 6 phases)

## [0.3.0] - 2026-03-21

### Added

- **Full TUI (Terminal User Interface)** -- component-based interactive mode using Ink v6 + React 19
  - Persistent full-screen layout: header, scrollable message area, input box, status bar
  - Streaming markdown rendering with syntax-highlighted code blocks (marked + marked-terminal + cli-highlight)
  - Collapsible tool call blocks with red/green diff view for file edits
  - 5 modal dialog overlays: ModelPicker, AgentSelector, PermissionDialog, SessionList, McpManager
  - Keybinding system: Tab/Shift-Tab agent cycling, Ctrl+X leader mode, Ctrl+K command palette
  - Dark/light theme support via ThemeContext with `/theme` command
  - Image attachment support: Ctrl+V clipboard paste and `/image` file attachment
  - 12 slash commands: help, exit, clear, model, agent, status, sessions, mcp, theme, image, clear-images, memory
  - Event bus integration for real-time tool execution and permission prompt display
- 29 TUI test files (1664 total tests) covering all components, contexts, hooks, and dialogs
- TUI design contracts documenting component props, context APIs, and hook APIs

### Changed

- Interactive mode (`alexi interactive`) now launches the TUI instead of the legacy readline REPL
- `src/cli/interactive.ts` marked as `@deprecated` in favor of `src/cli/tui/`

### Dependencies

- Added runtime: `marked`, `marked-terminal`, `cli-highlight`, `diff`, `terminal-link`
- Added runtime: `ink-text-input`, `ink-select-input`, `ink-spinner`
- Added dev: `ink-testing-library`, `@types/diff`

## [0.2.6] - 2026-03-19

### Added

- Unit tests for TUI slash commands (`/image` and `/clear-images`)
- Support for graceful tree-sitter parser initialization failures

### Changed

- Enhanced user configuration API with batch update support (`updateGlobal()`)
- Edit tool now preserves line endings during replacements (CRLF/LF detection)

### Fixed

- Tree-sitter parser initialization no longer fails in environments without native support
- Edit tool correctly handles multiline replacements with different line ending styles

## [0.2.5] - 2026-03-19

### Added

- Persistent default model configuration saved to user config file
- Autocomplete engine for slash commands, model names, and file paths
- Instruction file management system with multi-layer prompt assembly
- `/memory` command for managing instruction files
- `/mem` command for memory management
- CI Auto-Fix workflow for automatic CI failure resolution on auto/* branches
- New tools: bash-hierarchy, warpgrep (AI-powered semantic code search)
- Tab completion in readline REPL

### Changed

- Model switching now persists selection to `~/.alexi/config.json`
- System prompt assembly loads instruction files in layered order
- Documentation workflow improved with better file path handling

### Fixed

- Slash commands properly intercepted in TUI
- Command Palette no longer shows empty command list
- Edit tool handles multiline strings correctly

## [0.2.4] - 2026-03-18

### Added

- Upstream sync improvements with better analysis and conflict resolution

## [0.2.3] - 2026-03-16

### Added

- Enhanced sync workflow with improved upstream tracking

## [0.2.2] - 2026-03-15

### Fixed

- Ctrl+V screenshot paste on macOS now works without pngpaste (osascript fallback)

## [0.2.1] - 2026-03-15

### Fixed

- Slash commands no longer leak to LLM in TUI
- Command Palette opens with full command list

### Added

- Inline autocomplete for slash commands in TUI input box
- Keyboard navigation and acceptance for autocomplete suggestions

## [0.2.0] - 2026-03-14

### Added

- Comprehensive unit tests for file operation tools (read, write, glob, grep)
- Enhanced models command with SAP AI Core deployment listing
- Agentic file write capabilities with autonomous permission management
- Documentation for testing strategy and automation workflows

### Changed

- Enhanced tool system with context-aware path resolution
- Updated agenticChat module with permission configuration
- Updated documentation-update.yml workflow

### Fixed

- Resolved relative path handling in write/edit tools for CI permission checks
- Fixed zero-width characters in GitHub workflow expressions

### Removed

- .env file removed from version control

## [0.1.3] - 2024-01-XX

### Added

- Initial release with SAP AI Core integration
- Intelligent auto-routing based on prompt analysis
- Session management with persistence
- Rule-based configuration system
- Autonomous self-updating from upstream repositories

[0.5.2]: https://github.com/ausardcompany/alexi/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/ausardcompany/alexi/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/ausardcompany/alexi/compare/v0.4.22...v0.5.0
[0.4.22]: https://github.com/ausardcompany/alexi/compare/v0.4.17...v0.4.22
[0.4.17]: https://github.com/ausardcompany/alexi/compare/v0.3.1...v0.4.17
[0.3.1]: https://github.com/ausardcompany/alexi/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/ausardcompany/alexi/compare/v0.2.6...v0.3.0
[0.2.6]: https://github.com/ausardcompany/alexi/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/ausardcompany/alexi/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/ausardcompany/alexi/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/ausardcompany/alexi/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/ausardcompany/alexi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ausardcompany/alexi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
