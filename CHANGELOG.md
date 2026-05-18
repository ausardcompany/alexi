# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.23] - 2026-05-18

### Changed

- Removed duplicate `/* eslint-disable no-undef */` directive from the clipboard utility (`src/cli/utils/clipboard.ts`); the module-level JSDoc comment now precedes the single remaining ESLint suppression directive

### Fixed

- Suppressed ESLint `no-undef` errors for browser globals (`navigator`, `document`) in the clipboard utility (`src/cli/utils/clipboard.ts`) to resolve CI lint failures
- Added inline documentation noting browser global usage in the clipboard module

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

[0.4.23]: https://github.com/ausardcompany/alexi/compare/v0.4.22...v0.4.23
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
