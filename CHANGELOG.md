# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-03-21

### Added

- **TUI Static Rendering Architecture** — completed messages now scroll into terminal scrollback
  - Messages rendered once with Ink Static component for performance optimization
  - Dynamic viewport at bottom displays only active streaming content and tool calls
  - Eliminates re-rendering of historical messages during streaming
  - Full padding chain calculation for MarkdownRenderer (6 chars + 2 safety = 8 total)
  - Separation of concerns: Static for history, Box for active content
- **Permission System Null Sentinel Handling** — config patches can now delete rules
  - Null values in PermissionConfig act as delete sentinels
  - PermissionNext.fromConfig filters out null entries during parsing
  - PermissionNext.toConfig converts rulesets back to config format
  - Comprehensive test coverage for null handling edge cases
- **CI Auto-Fix Workflow Improvements**
  - Deterministic quick fixes run first (lint:fix, format) before AI agent
  - Quick fixes committed independently with immediate push
  - Re-verification after quick fixes to skip AI agent if all checks pass
  - Preservation of ci-failures.md across checkout operations
  - Prompt files fetched from master branch if missing on PR branch
  - Retry logic with 30-second delay for transient network errors
  - Improved comment condition to handle both failure outcomes and errors
- **Alexi Presentation Generator** — automated PowerPoint generation script
  - SAP corporate branding with Georgia/Calibri font pairing
  - 17 slides covering architecture, features, capabilities, and roadmap
  - Automated JPEG export for all slides
  - Professional design with shadows, gradients, and consistent spacing

### Changed

- **TUI Message Display Architecture** — refactored for performance and scrollback
  - App.tsx now uses Static component for completed messages
  - MessageArea.tsx simplified to only handle streaming content
  - MessageBubble.tsx improved text wrapping with paddingLeft(2) for user messages
  - MarkdownRenderer.tsx accepts maxWidth prop for precise width control
  - Completed tool calls moved to Static rendering with message history
  - ChatContext.tsx added clearCompletedToolCalls action
- **CI Auto-Fix Workflow Execution Order**
  - Quick fixes (lint:fix, format) now run before agent step
  - Agent step skipped if quick fixes resolve all failures
  - Deterministic fixes separated from AI-powered fixes
  - Better handling of ci-failures.md file lifecycle
- **Documentation Update Workflow Reliability**
  - Added retry logic for transient network failures (socket hang up, ECONNRESET)
  - Maximum 2 retry attempts with 30-second delay between retries
  - Fixed comment posting condition to handle both failure and error outcomes

### Fixed

- TUI message area no longer re-renders completed messages during streaming
- MarkdownRenderer width calculation now accounts for full padding chain
- Permission config parsing correctly handles null delete sentinels
- CI Auto-Fix workflow preserves ci-failures.md across branch checkout
- Documentation workflow handles transient network errors gracefully

### Dependencies

- Added runtime: pptxgenjs (v4.0.1) for presentation generation

## [0.2.6] - 2026-03-19

### Added

- Unit tests for TUI slash commands (`/image` and `/clear-images`)
  - Tests command registration with correct names and aliases
  - Tests clipboard paste functionality when no arguments provided
  - Tests file path handling for image attachments
  - Uses ink-testing-library with React context mocking
  - Comprehensive coverage of command dispatch logic
- Support for graceful tree-sitter parser initialization failures
  - Parser functions now return null instead of throwing when Parser is unavailable
  - Enables operation in environments without native bindings

### Changed

- Enhanced user configuration API with batch update support
  - Added `updateGlobal()` function for atomic multi-key updates
  - Added `UpdateGlobalOptions` interface with disposal control
  - Maintains backward compatibility with default dispose behavior
- Edit tool now preserves line endings during replacements
  - Automatically detects CRLF vs LF line endings in target files
  - Normalizes oldString and newString parameters to match file format
  - Ensures consistent line ending style throughout edited files

### Fixed

- Tree-sitter parser initialization no longer fails in environments without native support
- Edit tool correctly handles multiline replacements with different line ending styles

## [0.2.5] - 2026-03-19

### Added

- Persistent default model configuration saved to user config file
- Autocomplete engine for slash commands, model names, and file paths in interactive mode
- Instruction file management system with multi-layer prompt assembly
  - Project-level AGENTS.md support
  - User-level ~/.alexi/ALEXI.md for global instructions
  - Project-level .alexi/rules/*.md for scoped rules
- /memory command for managing instruction files (list, edit, init)
- /mem command for memory management (list, search, delete, clear, stats, export)
- CI Auto-Fix workflow that automatically fixes failing CI checks on auto/* branches
  - Collects failed job logs and error messages
  - Uses Alexi agent mode to apply targeted fixes
  - Verifies fixes and commits changes automatically
  - Rate-limited to prevent infinite loops (max 2 runs per branch per day)
- New tools:
  - bash-hierarchy: Hierarchical permission rules for bash commands
  - warpgrep: AI-powered semantic code search using WarpGrep/Morph SDK
- Tab completion in readline REPL for commands, models, and file paths

### Changed

- Model switching now persists selection to ~/.alexi/config.json as default
- System prompt assembly now loads instruction files in layered order
- Autocomplete system unified between readline REPL and Ink TUI
- Documentation workflow improved with better file path handling
- Enhanced clipboard utilities with osascript fallback for macOS
- Updated dependencies:
  - @inquirer/prompts from 8.3.0 to 8.3.2
  - @commitlint/config-conventional from 20.4.3 to 20.5.0
  - @typescript-eslint/parser from 8.34.1 to 8.57.0
  - @vitejs/plugin-react from 5.2.0 to 6.0.1
  - @vitest/coverage-v8 from 4.0.0 to 4.1.0
  - hono from 4.12.5 to 4.12.8
  - nanoid from 5.1.6 to 5.1.7
  - puppeteer from 24.38.0 to 24.39.1
  - simple-git from 3.32.3 to 3.33.0
  - vitest from 4.0.0 to 4.1.0

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

- Ctrl+V screenshot paste on macOS now works without installing pngpaste — added native osascript fallback that uses AppleScript to read clipboard images

## [0.2.1] - 2026-03-15

### Fixed

- Slash commands (/help, /model, /exit, etc.) were leaking directly to the LLM in the TUI instead of being intercepted by the command handler
- Command Palette (Ctrl+K) was opening with an empty command list

### Added

- Inline autocomplete for slash commands in the TUI input box — shows filtered suggestions when typing /
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
  - Specify custom resource group with -g, --resource-group option
  - JSON output support with -j, --json flag
  - Color-coded status display with formatted table output
  - Fallback to proxy endpoint with --proxy flag
  - Display deployment URLs for running deployments
- New dependency: @sap-ai-sdk/ai-api version 2.7.0 for direct AI Core API access
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

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/ausardcompany/alexi/compare/v0.2.6...v0.3.0
[0.2.6]: https://github.com/ausardcompany/alexi/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/ausardcompany/alexi/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/ausardcompany/alexi/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/ausardcompany/alexi/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/ausardcompany/alexi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ausardcompany/alexi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
