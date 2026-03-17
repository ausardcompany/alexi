# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.3] - 2026-03-17

### Added

- New `/memory` command for managing instruction files in interactive REPL
  - List all instruction files with `/memory` (AGENTS.md, ~/.alexi/ALEXI.md, .alexi/rules/*.md)
  - Edit instruction files with `/memory edit [project|user|filename]` using $EDITOR
  - Initialize project AGENTS.md with `/memory init` from template
- New `/mem` command for memory management (renamed from `/memory` to avoid conflict)
  - List stored memories with `/mem` or `/mem list`
  - Search memories with `/mem search <query>`
  - Delete memories with `/mem delete <id>`
  - Clear all memories with `/mem clear`
  - Show statistics with `/mem stats`
  - Export to JSON with `/mem export`
- User-level instruction file support at `~/.alexi/ALEXI.md`
  - Loaded into every session automatically
  - Separate from project-level AGENTS.md
- Project-level rule files support at `.alexi/rules/*.md`
  - Multiple scoped instruction files
  - Alphabetically sorted and loaded in order
- Inline autocomplete for slash commands in TUI input box
  - Shows filtered suggestions when typing `/`
  - Keyboard navigation with Up/Down/Tab
  - Accept suggestions with Enter or Tab
  - Dismiss with Escape
- CI Auto-Fix workflow for autonomous PR failure resolution
  - Automatically triggered when CI fails on `auto/*` branches
  - Collects failed job logs and error messages
  - Runs Alexi agent to fix lint, type, format, test, and build failures
  - Commits fixes and re-triggers CI
  - Rate-limited to 2 runs per day per branch to prevent loops
  - Manual dispatch support for targeted fixes
- Native macOS clipboard image support via `osascript`
  - Fallback when `pngpaste` is not installed
  - Uses AppleScript to read clipboard images
  - No external dependencies required on macOS

### Changed

- System prompt assembly now loads three layers of instruction files
  - Project-level AGENTS.md (workdir/AGENTS.md)
  - User-level ALEXI.md (~/.alexi/ALEXI.md)
  - Project-level rule files (workdir/.alexi/rules/*.md)
- Help text in interactive REPL updated to reflect new command structure
  - `/memory` for instruction file management
  - `/mem` for stored memory management
- TUI command system refactored with declarative `useCommands` hook
  - Slash commands now intercepted before sending to LLM
  - Extensible command registry with categories
  - Proper command context with session state
- Clipboard detection now tries multiple tools in preference order
  - macOS: pngpaste (preferred), osascript (fallback)
  - Linux: wl-paste (Wayland), xclip (X11)
  - Windows: PowerShell

### Fixed

- Slash commands in TUI were leaking to LLM instead of being handled locally
- Command Palette showing empty command list
- Missing instruction file support in system prompt assembly

## [0.2.2] - 2026-03-15

### Fixed

- `Ctrl+V` screenshot paste on macOS now works without installing `pngpaste` — added native `osascript` fallback that uses AppleScript to read clipboard images

## [0.2.1] - 2026-03-15

### Fixed

- Slash commands (`/help`, `/model`, `/exit`, etc.) were leaking directly to the LLM in the TUI instead of being intercepted by the command handler
- Command Palette (`Ctrl+K`) was opening with an empty command list

### Added

- Inline autocomplete for slash commands in the TUI input box — shows filtered suggestions when typing `/`
- Keyboard navigation (Up/Down/Tab) and acceptance (Enter/Tab) for autocomplete suggestions
- Command Palette now displays all 11 registered slash commands

## [0.2.0] - 2026-03-14

### Added

- Comprehensive unit tests for file operation tools
  - Added tests for read tool (20+ test cases covering file/directory reading, offsets, limits)
  - Added tests for write tool (18+ test cases covering file creation, overwriting, directory creation)
  - Added tests for glob tool (16+ test cases covering pattern matching, recursive search)
  - Added tests for grep tool (20+ test cases covering regex patterns, file filtering, line matching)
  - All tests use temporary directories with proper cleanup
  - Tests verify actual file system changes, not just return values
  - Mock permission system to bypass checks during testing
- Enhanced models command with SAP AI Core deployment listing functionality
  - Query deployments directly from SAP AI Core using DeploymentApi
  - Filter deployments by status (RUNNING, PENDING, STOPPED, etc.)
  - Filter deployments by scenario ID
  - Specify custom resource group with `-g, --resource-group` option
  - JSON output support with `-j, --json` flag
  - Color-coded status display with formatted table output
  - Fallback to proxy endpoint with `--proxy` flag
  - Display deployment URLs for running deployments
- New dependency: `@sap-ai-sdk/ai-api` version 2.7.0 for direct AI Core API access
- Agentic file write capabilities with autonomous permission management
  - Automatic permission rules for write operations in workdir
  - Automatic permission rules for execute operations
  - Priority-based permission system (priority 200) to override default ask prompts
  - External directory support for full agentic capability
- Documentation for testing strategy and automation workflows
  - Added docs/TESTING.md with comprehensive testing guide
  - Added docs/AUTOMATION.md with workflow documentation
  - Includes testing best practices and CI/CD pipeline details

### Changed

- Enhanced tool system with context-aware path resolution
  - Tool permission system now receives ToolContext in getResource function
  - Write and edit tools resolve relative paths using workdir context
  - Enables proper permission checks for both absolute and relative paths
  - Maintains compatibility with CI/CD workflows
- Updated documentation-update.yml workflow with improved file path handling
  - File paths in scope.md now include full relative paths (e.g., docs/ARCHITECTURE.md)
  - Clarified CHANGELOG.md location in repository root (not docs/)
  - Removed zero-width space characters from workflow expressions
  - Enhanced documentation scope comments for bot guidance
- Updated agenticChat module with permission configuration
  - Project root set to workdir for permission checks
  - External directories enabled for agentic operations
  - High-priority allow rules for write and execute actions
- Updated env.ts to export env function with proper return type handling

### Fixed

- Resolved relative path handling in write/edit tools for CI permission checks
- Fixed zero-width space characters in GitHub workflow expressions
- Corrected file path specifications in documentation workflow scope
- Removed .env file from git tracking to prevent accidental credential exposure

### Removed

- .env file removed from version control (use .env.example as template)

## [0.1.3] - 2024-01-XX

### Added

- Initial release with multi-provider support
- Intelligent auto-routing based on prompt analysis
- Session management with persistence
- Rule-based configuration system
- Autonomous self-updating from upstream repositories

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.2.3...HEAD
[0.2.3]: https://github.com/ausardcompany/alexi/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/ausardcompany/alexi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ausardcompany/alexi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
