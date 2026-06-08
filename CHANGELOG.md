# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Skill tool description guard test** (`src/tool/skill.test.ts`): A regression test asserting that the registered skill tool's description does not contain the placeholder strings `tool-skill` or `Skill for tool tests.`, both of which were used by an upstream test scaffold and must not leak into the production tool description rendered to the LLM. The canonical skill tool implementation lives in `src/tool/tools/skill.ts` and is exported as `skillTool` (registered under the name `'skill'`).

### Changed

- **Version bumped** from `0.5.12` to `0.5.13` in `package.json` and `package-lock.json`.
- **Dev-dependency patch updates** (Dependabot, PR #735): `@types/node` from `^25.9.1` to `^25.9.2` and `@types/react` from `^19.2.16` to `^19.2.17`. Type-only updates with no runtime impact; covered by the existing `npm run typecheck` and `npm run build` CI gates.
- **Upstream sync metadata refreshed** in `.github/last-sync-commits.json`: pulled commit `0050134d` from `anomalyco/opencode` (previously `e82542b8`), and refreshed the `last_synced_at` timestamps for `kilocode`, `opencode`, and `claude-code` to `2026-06-08T10:58:44Z`. Workflow run id updated to `27132986362`. The `kilocode` and `claude-code` upstream HEADs were unchanged in this sync.

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
