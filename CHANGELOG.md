# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CI Auto-Fix workflow that automatically fixes failing CI checks on auto branches
  - Collects failed job logs and error details from GitHub Actions
  - Runs Alexi agent with targeted fix prompts and system instructions
  - Performs quick deterministic fixes (lint, format) before AI-powered fixes
  - Verifies fixes by re-running originally failing checks
  - Auto-commits and pushes fixes with skip-ci flag
  - Includes retry limits (2 per day per branch) to prevent infinite loops
  - Posts PR comments with fix results and verification status
- Instruction file management system for AI agent context
  - Project-level AGENTS.md loaded from workdir
  - User-level ALEXI.md loaded from ~/.alexi directory
  - Project-level rule files loaded from .alexi/rules directory
  - All instruction files merged into system prompt with tagged blocks
- Memory command for instruction file management in interactive REPL
  - /memory list shows all instruction files with status
  - /memory edit opens files in EDITOR for editing
  - /memory init creates AGENTS.md from template
  - Separate /mem command for JSON-based memory storage
- New tools for codebase analysis
  - bash-hierarchy tool for hierarchical bash command permission rules
  - warpgrep tool for AI-powered semantic code search via MorphSDK
- TUI slash command system improvements
  - Command registry with declarative SlashCommand interface
  - 13 registered commands including help, exit, model, agent, sessions, mcp, theme, image, memory
  - Autocomplete with keyboard navigation (Up/Down/Tab)
  - Command categories (general, session, model, git, debug, config)
- macOS clipboard image paste fallback using osascript
  - Native AppleScript-based clipboard reading when pngpaste is not installed
  - Writes clipboard image to temporary file and reads it back
  - Proper error handling for missing images
  - No external dependencies required

### Changed

- System prompt assembly now loads multiple instruction sources
  - AGENTS.md wrapped in agents-md tags
  - ALEXI.md wrapped in user-instructions tags
  - Rule files wrapped in rule tags with file attribute
  - Combined in order: project AGENTS.md, user ALEXI.md, project rules
- Upgraded dependencies
  - @inquirer/prompts from 8.3.0 to 8.3.2
  - @commitlint/config-conventional from 20.4.3 to 20.5.0
  - @typescript-eslint/parser from 8.56.1 to 8.57.0
  - @vitejs/plugin-react from 5.2.0 to 6.0.1
  - @vitest/coverage-v8 from 4.0.0 to 4.1.0
  - vitest from 4.0.0 to 4.1.0
  - @types/node from 25.3.5 to 25.5.0
  - hono from 4.12.5 to 4.12.8
  - nanoid from 5.1.6 to 5.1.7
  - puppeteer from 24.38.0 to 24.39.1
  - simple-git from 3.32.3 to 3.33.0
- Interactive REPL help command now documents both /memory and /mem commands
  - /memory for instruction file management
  - /mem for JSON-based memory operations
- Documentation workflow redesigned for improved reliability
  - Better file path handling in scope detection
  - Clearer separation of documentation scope
  - Enhanced validation and error handling

### Fixed

- BashHierarchy namespace converted to const object to fix TypeScript compatibility
- WarpGrep tool now handles optional @morphllm/morphsdk import correctly
- Clipboard tool detection now tries all available tools before failing
- InputBox component properly wires autocomplete to useCommands hook

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

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/ausardcompany/alexi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/ausardcompany/alexi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
