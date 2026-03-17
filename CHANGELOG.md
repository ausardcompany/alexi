# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.4] - 2026-03-17

### Added

- New `/memory` command for managing instruction files in interactive REPL
  - List all instruction files: AGENTS.md (project), ALEXI.md (user), and .alexi/rules/*.md (project rules)
  - Edit instruction files with `$EDITOR` via `/memory edit [project|user|<filename>]`
  - Initialize AGENTS.md from template with `/memory init`
  - Display file paths and existence status for all instruction sources
- Enhanced system prompt assembly pipeline with multi-layer instruction file support
  - Project-level AGENTS.md loaded as `<agents-md>` block
  - User-level ~/.alexi/ALEXI.md loaded as `<user-instructions>` block
  - Project-level .alexi/rules/*.md files loaded as individual `<rule>` blocks
  - All instruction files automatically merged into system prompts for every LLM call
- Hierarchical bash command permission system
  - New `BashHierarchy` utility for generating progressive permission rules
  - Supports approval at multiple granularity levels (e.g., "npm", "npm install", "npm install lodash")
  - Wildcard pattern matching for command prefixes
- TUI slash command system refactored with declarative command registry
  - New `useCommands` hook centralizes slash command definitions
  - Commands include `/help`, `/exit`, `/clear`, `/model`, `/agent`, `/status`, `/sessions`, `/mcp`, `/theme`, `/image`, `/clear-images`, `/memory`, `/mem`
  - Extensible `SlashCommand` interface for adding new commands
  - Inline autocomplete for slash commands with keyboard navigation
- Enhanced clipboard image support with macOS osascript fallback
  - Native AppleScript-based clipboard reading when `pngpaste` is not installed
  - Temporary file-based flow for reading PNG data from clipboard
  - Automatic cleanup of temporary files
  - Works without external dependencies on macOS

### Changed

- Separated `/memory` (instruction files) from `/mem` (stored memories) in interactive REPL
  - `/memory` now exclusively manages AGENTS.md, ALEXI.md, and rule files
  - `/mem` continues to handle JSON-based memory storage (list, search, stats, export)
- Updated agent system to track native vs custom agents
  - Built-in agents marked with `native: true` flag
  - Custom agents can be removed, native agents cannot
  - Agent removal now validates against native flag
- Enhanced `readClipboardImage` function with platform-specific tool detection
  - Improved error messages for missing clipboard tools
  - Better handling of "no image in clipboard" scenarios
  - Unified error handling across all clipboard tools
- Updated dependency versions
  - vitest: 4.0.0 → 4.1.0
  - @vitest/coverage-v8: 4.0.0 → 4.1.0
  - @vitejs/plugin-react: 5.2.0 → 6.0.1
  - @types/node: 25.3.5 → 25.5.0
  - @typescript-eslint/parser: 8.56.1 → 8.57.0
  - @commitlint/config-conventional: 20.4.3 → 20.5.0
  - puppeteer: 24.38.0 → 24.39.1
  - hono: 4.12.5 → 4.12.8
  - nanoid: 5.1.6 → 5.1.7
  - @inquirer/prompts: 8.3.0 → 8.3.2
  - simple-git: 3.32.3 → 3.33.0

### Fixed

- TUI slash commands now properly intercepted before being sent to LLM
  - Commands like `/help`, `/exit`, `/model` no longer leak to the AI
  - `useCommands` hook wired into App.tsx to handle all slash commands
- Command Palette (Ctrl+K) now displays all registered slash commands
  - Fixed empty command list issue
  - Commands populated from `useCommands` hook registry

## [0.2.3] - 2026-03-16

### Changed

- Applied upstream synchronization changes from kilocode, opencode, and claude-code repositories
- Updated documentation workflow with improved diff truncation and validation

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

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/ausardcompany/alexi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ausardcompany/alexi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
