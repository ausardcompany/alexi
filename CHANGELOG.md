# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.22] - 2026-05-17

### Added

- **Lifecycle Hooks System**: Pre/PostToolUse hooks with command, HTTP, and script execution types. Hooks can block tool execution or feed rejection reasons back to the model via `continueOnBlock` mode.
- **Stop Hook Block Cap**: Configurable loop guard (default: 8 consecutive blocks, env `ALEXI_STOP_HOOK_BLOCK_CAP`) prevents infinite agentic loops when Stop hooks repeatedly block.
- **Reactive Context Compaction**: Automatic context overflow detection during LLM calls with overflow-seeded compaction. Detects overflow from error message patterns and calculates target summary token budgets.
- **Chunked Compaction**: New `compaction-chunks.ts` module splits large contexts at natural boundaries and compacts in parallel chunks before merging.
- **File Inclusions in Agent Prompts**: `{file:path/to/file}` syntax in custom agent markdown files for composing prompts from external files. Supports recursive inclusion up to depth 3.
- **Background Task Support (Experimental)**: Task tool supports `background: true` for async execution when `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS=true`. New `task_status` tool to query background task progress.
- **Task Status Tool**: Query the status of background tasks (`queued`, `running`, `completed`, `failed`, `cancelled`).
- **Daily PR Merge Workflow**: Automated daily merging of passing PRs at 18:00 UTC using Kilo CLI with dry-run support.
- **Telemetry Module**: Basic event tracking service (`src/utils/telemetry.ts`) for tool usage metrics.
- **Event-Type Compatibility Validation**: Hooks system validates that `SessionStart`, `SessionEnd`, and `Error` events only accept command-type hooks.
- **Comprehensive Test Suites**: Tests for hooks (preToolUse, blockCap, continueOnBlock), reactive seeding, chunked compaction, file inclusions, background tasks, and MCP client management.

### Changed

- **Agent Loading is Now Async**: `loadAgentFromFile`, `loadAgentsFromDirectory`, `loadAllCustomAgents`, and `AgentRegistry.loadCustomAgents` are now async functions to support file inclusion resolution.
- **Agentic Chat Loop**: Now executes PreToolUse and PostToolUse hooks around each tool call, with feedback loop for `continueOnBlock` rejections. Stop hooks run after tool batches for loop guard protection.
- **Compaction System**: Added `overflowTokens` option to `CompactionOptions` for reactive seeding. New `buildTargetInstruction` and `summarizeWithTarget` private methods calculate token budgets for summaries.
- **MCP Client**: Updated connection handling with `ALEXI_PROJECT_DIR` environment variable passed to child processes.
- **Tool Registrations**: Glob, grep, and warpgrep tools updated with refined descriptions and parameter handling.
- **Version bumped**: 0.4.17 to 0.4.22.

### Fixed

- Bash tool test adjusted for updated command timeout behavior.
- Background tasks test timeout increased to prevent CI flakiness.
- MCP client tests refactored for improved reliability with mocked transports.

## [0.4.17] - 2026-05-11

### Dependencies
- Bump `@typescript-eslint/parser` from 8.59.1 to 8.59.2 (#305)
- Bump `react` from 19.2.5 to 19.2.6 (#303)
- Bump `@commitlint/cli` from 20.5.3 to 21.0.0 (#308)
- Bump `lint-staged` from 16.4.0 to 17.0.4 (#306)
- Bump `ink` from 7.0.1 to 7.0.2 (#309)
- Bump `puppeteer` from 24.42.0 to 24.43.1 (#307)
- Bump `hono` from 4.12.16 to 4.12.18 (#304)
- Bump `@inquirer/prompts` from 8.4.2 to 8.4.3 (#302)
- Bump `@types/node` in the dev-dependencies group (#301)

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
- UX requirements quality checklist (30 items)

### Changed

- Interactive mode (`alexi interactive`) now launches the TUI instead of the legacy readline REPL
- `src/cli/interactive.ts` marked as `@deprecated` in favor of `src/cli/tui/`

### Dependencies

- Added runtime: `marked`, `marked-terminal`, `cli-highlight`, `diff`, `terminal-link`
- Added runtime: `ink-text-input`, `ink-select-input`, `ink-spinner`
- Added dev: `ink-testing-library`, `@types/diff`
- Existing: `ink` (v6.8.0) and `react` (v19.2.4) now actively used

## [0.2.6] - 2026-03-19

### Added

- Unit tests for TUI slash commands (`/image` and `/clear-images`)
- Support for graceful tree-sitter parser initialization failures

### Changed

- Enhanced user configuration API with batch update support
- Edit tool now preserves line endings during replacements

### Fixed

- Tree-sitter parser initialization no longer fails in environments without native support
- Edit tool correctly handles multiline replacements with different line ending styles

## [0.2.5] - 2026-03-19

### Added

- Persistent default model configuration saved to user config file
- Autocomplete engine for slash commands, model names, and file paths in interactive mode
- Instruction file management system with multi-layer prompt assembly
- /memory command for managing instruction files (list, edit, init)
- /mem command for memory management (list, search, delete, clear, stats, export)
- CI Auto-Fix workflow that automatically fixes failing CI checks on auto/* branches
- New tools: bash-hierarchy, warpgrep (AI-powered semantic code search)
- Tab completion in readline REPL for commands, models, and file paths

### Changed

- Model switching now persists selection to ~/.alexi/config.json as default
- System prompt assembly now loads instruction files in layered order
- Autocomplete system unified between readline REPL and Ink TUI

### Fixed

- Slash commands now properly intercepted in TUI instead of leaking to LLM
- Command Palette no longer shows empty command list
- Edit tool now handles multiline strings correctly in exact replacements

## [0.2.4] - 2026-03-18

### Added

- Upstream sync improvements with better analysis and conflict resolution

## [0.2.3] - 2026-03-16

### Added

- Enhanced sync workflow with improved upstream tracking

## [0.2.2] - 2026-03-15

### Fixed

- Ctrl+V screenshot paste on macOS now works without installing pngpaste

## [0.2.1] - 2026-03-15

### Fixed

- Slash commands were leaking directly to the LLM in the TUI
- Command Palette was opening with an empty command list

### Added

- Inline autocomplete for slash commands in the TUI input box
- Keyboard navigation and acceptance for autocomplete suggestions
- Command Palette now displays all 11 registered slash commands

## [0.2.0] - 2026-03-14

### Added

- Comprehensive unit tests for file operation tools (read, write, glob, grep)
- Enhanced models command with SAP AI Core deployment listing
- Agentic file write capabilities with autonomous permission management
- Documentation for testing strategy and automation workflows

### Changed

- Enhanced tool system with context-aware path resolution
- Updated agenticChat module with permission configuration
- Updated env.ts to export env function with proper return type handling

### Fixed

- Resolved relative path handling in write/edit tools for CI permission checks
- Fixed zero-width characters in GitHub workflow expressions

### Removed

- .env file removed from version control

## [0.1.3] - 2024-01-XX

### Added

- Initial release with multi-provider support
- Intelligent auto-routing based on prompt analysis
- Session management with persistence
- Rule-based configuration system
- Autonomous self-updating from upstream repositories

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
