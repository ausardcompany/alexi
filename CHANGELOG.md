# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.3] - 2026-03-16

### Added

- Instruction file management system for AI agent customization
  - User-level instruction file support via `~/.alexi/ALEXI.md`
  - Project-level rule files in `.alexi/rules/*.md` directory
  - New `/memory` command to list and edit instruction files
  - New `/memory edit [target]` command to open instruction files in $EDITOR
  - New `/memory init` command to create AGENTS.md from template
  - System prompt assembly now loads three instruction file sources in order: AGENTS.md, ALEXI.md, and rule files
- Slash command system for TUI with autocomplete
  - New `useCommands` hook provides declarative command registry
  - Autocomplete suggestions when typing `/` in TUI input box
  - Keyboard navigation with Up/Down/Tab/Shift+Tab
  - Command categories: general, session, model, git, debug, config
  - 11 registered commands including `/help`, `/exit`, `/model`, `/agent`, `/status`, `/sessions`, `/mcp`, `/theme`, `/image`, `/clear-images`, `/memory`, `/mem`

### Changed

- System prompt assembly pipeline now loads instruction files from three sources
  - Project-level `AGENTS.md` wrapped in `<agents-md>` tags
  - User-level `~/.alexi/ALEXI.md` wrapped in `<user-instructions>` tags
  - Project-level `.alexi/rules/*.md` files wrapped in `<rule file="...">` tags
- Memory command renamed from `/memory` to `/mem` for stored key-value memories
  - `/mem` now handles memory list, search, delete, clear, stats, export operations
  - `/memory` command repurposed for instruction file management
- Clipboard image paste on macOS improved with osascript fallback
  - Primary clipboard tool: `pngpaste` (requires installation)
  - Fallback tool: `osascript` (pre-installed on macOS)
  - AppleScript-based clipboard reading writes to temporary file and cleans up automatically
- Documentation workflow enhanced with better diff handling
  - Increased diff preview limit from 100 to 500 lines per file type
  - Added truncation indicators when diffs exceed preview limits
  - Improved documentation commit identification using `[alexi-bot]` tag
  - Documentation files now excluded from changed file analysis using refined regex patterns

### Fixed

- Clipboard image reading on macOS now works without requiring pngpaste installation
- Documentation workflow correctly identifies last documentation commit by searching for `[alexi-bot]` tag instead of generic commit message
- Documentation scope analysis no longer includes documentation files themselves in changed file list

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
