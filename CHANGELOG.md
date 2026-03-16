# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Inline autocomplete for slash commands in TUI input box with keyboard navigation
  - Shows filtered command suggestions when typing `/` prefix
  - Supports Up/Down arrow keys and Tab/Shift+Tab for navigation
  - Enter or Tab accepts the selected suggestion
  - Escape dismisses autocomplete without clearing input
  - Displays up to 6 suggestions with command name, aliases, and description
- Native osascript fallback for clipboard image reading on macOS
  - Uses AppleScript to read clipboard images without external dependencies
  - Automatically falls back to osascript when pngpaste is not installed
  - Writes clipboard image to temporary file, reads it, and cleans up
  - Supports standard PNG format detection and validation
- Comprehensive test coverage for clipboard functionality
  - Tests for detectClipboard with pngpaste and osascript detection
  - Tests for readImageFile with PNG validation and error handling
  - Tests for platform-specific tool availability and fallback behavior
- Comprehensive test coverage for TUI InputBox component
  - Tests for autocomplete rendering and suggestion filtering
  - Tests for keyboard navigation and command acceptance
  - Tests for disabled state and placeholder text behavior

### Changed

- Enhanced TUI command system with declarative slash command registry
  - Migrated from monolithic switch statement to extensible SlashCommand array
  - Commands now include name, aliases, description, category, and execute function
  - Supports 11 registered commands: help, exit, clear, model, agent, status, sessions, mcp, theme, image, clear-images
  - Command execution integrated with useCommands hook for better separation of concerns
- Improved TUI InputBox component with autocomplete integration
  - Added commands prop to receive available slash commands
  - Integrated autocomplete suggestion list above input line
  - Enhanced keyboard input handling to support autocomplete navigation
  - Added selectedSuggestion state for tracking current selection
- Updated useKeyboard hook to pass commands to command palette
  - Command palette now displays all registered slash commands when opened via Ctrl+K
  - Commands converted to CommandEntry format for palette display
- Enhanced clipboard utility with improved error handling
  - Added support for osascript as ClipboardTool type
  - Improved error messages for clipboard reading failures
  - Better detection of empty clipboard or missing image data
- Updated documentation workflow with improved validation and commit handling
  - Added markdownlint validation step for generated documentation
  - Enhanced commit message format with [alexi-bot] tag for tracking
  - Improved file path handling to stage only intended documentation files
  - Extended diff preview limits from 100 to 500 lines per section
  - Added validation warnings to PR comments when linting issues are detected
- Dependency updates
  - @inquirer/prompts: 8.3.0 to 8.3.2
  - @commitlint/config-conventional: 20.4.3 to 20.5.0
  - @typescript-eslint/parser: 8.56.1 to 8.57.0
  - @vitejs/plugin-react: 5.2.0 to 6.0.1
  - @vitest/coverage-v8: 4.0.0 to 4.1.0
  - @types/node: 25.3.5 to 25.5.0
  - hono: 4.12.5 to 4.12.8
  - nanoid: 5.1.6 to 5.1.7
  - puppeteer: 24.38.0 to 24.39.1
  - simple-git: 3.32.3 to 3.33.0
  - vitest: 4.0.0 to 4.1.0

### Fixed

- Slash commands now properly intercepted in TUI before being sent to LLM
  - Commands starting with `/` are handled by useCommands hook
  - Only non-command messages are sent to the streaming chat system
  - Fixes issue where commands like /help, /model, /exit were leaking to LLM

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
