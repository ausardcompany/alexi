# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Slash command autocomplete in TUI InputBox component
  - Inline autocomplete suggestions when typing slash commands
  - Tab key navigation and selection of command suggestions
  - Up/Down arrow keys for navigating suggestions
  - Enter key to accept selected suggestion
  - Escape key to dismiss autocomplete
  - Shows command aliases and descriptions in suggestion list
  - Maximum of 6 suggestions displayed at once
  - Filters commands based on partial name or alias match
- Command palette integration with slash commands
  - Ctrl+K opens command palette with all available slash commands
  - Command palette displays command categories and descriptions
  - Commands passed from useCommands hook to useKeyboard hook
  - Consistent command list across autocomplete and command palette
- Comprehensive TUI slash command system
  - Declarative SlashCommand interface with name, aliases, description, and category
  - useCommands hook providing handleCommand function and commands list
  - 10 built-in commands: help, exit/quit/q, clear, model, agent, status, sessions, mcp, theme, image/img, clear-images/cli
  - Command interception in App.tsx before sending to LLM
  - Support for command arguments and context (exit, sessionId, model, agent)
- Unit tests for InputBox autocomplete functionality
  - Tests verify autocomplete rendering without crashing
  - Tests verify empty input does not show suggestions
  - Tests verify commands prop handling with empty array and undefined
  - Tests verify placeholder text with commands enabled
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

- Enhanced TUI InputBox component with slash command autocomplete
  - Added commands prop to InputBoxProps interface
  - Added selectedSuggestion state for tracking active autocomplete selection
  - Added suggestions useMemo hook for filtering commands based on input
  - Modified useInput hook to handle Tab, Escape, and arrow keys for autocomplete
  - Modified handleSubmit to accept selected suggestion on Enter
  - Added autocomplete suggestion list rendering above input prompt
  - Autocomplete only shows when input starts with '/' and has no spaces
  - Shows all commands when just '/' is typed
  - Filters by command name or aliases when partial command entered
- Enhanced useKeyboard hook with command palette support
  - Added commands parameter to UseKeyboardOptions interface
  - Ctrl+K now passes commands to command palette as CommandEntry array
  - Command palette receives command name, description, and category
- Updated App.tsx to wire slash command system
  - Added useCommands hook import and invocation
  - Passed commands to useKeyboard hook options
  - Passed commands to InputBox component
  - Modified handleSubmit to intercept slash commands before sending to LLM
  - Slash commands are handled by handleCommand and NOT sent to LLM
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
  - Changed last documentation commit detection to search for [alexi-bot] marker
  - Improved file filtering to exclude only docs/ and CHANGELOG.md from change detection
  - Enhanced diff preview with 500-line limit and truncation warnings
  - Added validation step using markdownlint-cli2 for generated documentation
  - Modified commit message to include [alexi-bot] marker for tracking
  - Updated PR comment generation to include validation warnings
  - Simplified system prompt to role-only, detailed instructions in template
  - Added --effort high flag to agent command for better quality
- Updated agenticChat module with permission configuration
  - Project root set to workdir for permission checks
  - External directories enabled for agentic operations
  - High-priority allow rules for write and execute actions
- Updated env.ts to export env function with proper return type handling

### Fixed

- Slash commands no longer sent to LLM when entered in TUI
  - Commands starting with '/' are intercepted by handleCommand
  - Only non-command messages are passed to sendMessage
  - Prevents LLM from receiving and responding to internal commands
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

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
