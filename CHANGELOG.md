# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.1] - 2026-04-04

### Added

- TUI visual overhaul matching OpenCode layout and style
  - Removed redundant header component, model info moved to status bar
  - Added page routing system with PageContext for chat and logs views
  - Added sidebar system with SidebarContext for file change tracking
  - Added dedicated LogsPage with log filtering and level controls
  - Added ChatPage component with split pane layout for messages and sidebar
  - Added SplitPane component for responsive main/side content layout
  - Added Sidebar component displaying file changes with status indicators
  - Added LogViewer component for debug logs with scrolling and filtering
- Vim mode support with useVimMode hook
  - Normal, insert, visual, and command modes
  - Motion commands (h, j, k, l, w, b, 0, $)
  - Operators (x, u, Ctrl+r, y, p, dd)
  - Mode indicators in status bar
- File change tracking system integrated with tool execution events
  - Automatic tracking of write and edit tool operations
  - Status indicators for added, modified, and deleted files
  - Addition and deletion line counts
- Log collection system with useLogCollector hook
  - Collects log entries from event bus
  - Supports debug, info, warn, and error levels
  - Timestamp tracking for each entry
- Scroll position management with useScrollPosition hook
  - Viewport tracking with offset and visible lines
  - Keyboard navigation (up, down, page up, page down, home, end)
  - Mouse wheel support
  - Auto-scroll to bottom on new content
- New TUI dialogs
  - HelpDialog with categorized keybindings and search
  - FilePicker with directory navigation and file selection
  - QuitDialog with session save options
  - ThemeDialog for switching between dark and light themes
  - ArgDialog for multi-field input forms
- Enhanced bash permission rules for ask agent
  - Read-only command allowlist for safe information gathering
  - Explicit denials for write operations (git add, commit, push, etc.)
  - Allow text processing commands (grep, awk, sed, jq, etc.)
  - Allow git read-only commands (status, log, diff, show, etc.)
- Heap snapshot utilities for memory debugging
  - Automatic heap snapshots when memory exceeds 1GB threshold
  - Configurable snapshot intervals and storage location
  - Integration with Node.js v8 module
- Session header tracking for API calls
  - Track conversation turns and message counts
  - Provide context headers to SAP AI Core Orchestration API
- Skill system for specialized agent capabilities
  - Skill registration and discovery
  - Skill-based tool filtering
  - Integration with agent system
- Terminal image rendering support with terminal-image library
  - Display images in terminal for debugging and visualization
  - Support for PNG, JPEG, and other common formats

### Changed

- Updated dependencies
  - @inquirer/prompts from 8.3.0 to 8.3.2
  - @sap-ai-sdk/ai-api from 2.7.0 to 2.9.0
  - @sap-ai-sdk/orchestration from 2.7.0 to 2.9.0
  - @typescript-eslint/eslint-plugin from 8.34.1 to 8.58.0
  - @typescript-eslint/parser from 8.34.1 to 8.58.0
  - commander from 14.0.0 to 14.0.3
  - hono from 4.12.5 to 4.12.9
  - puppeteer from 24.38.0 to 24.40.0
  - simple-git from 3.32.3 to 3.33.0
  - vitest from 4.0.0 to 4.1.0
  - @vitest/coverage-v8 from 4.0.0 to 4.1.2
- Added new dependencies
  - fzf 0.5.2 for fuzzy file searching
  - terminal-image 4.2.0 for terminal image rendering
  - @testing-library/react 16.3.2 for TUI component testing
- TUI architecture refactored to match upstream patterns
  - Removed Header component, integrated into StatusBar
  - Reorganized layout with page-based routing
  - Improved component composition and separation of concerns
- Enhanced StatusBar with comprehensive information display
  - Model name and agent indicator
  - Token count and cost tracking
  - Session ID display
  - Leader mode and streaming indicators
- Improved DiffView component
  - Enhanced visual styling with better color contrast
  - Improved line number formatting
  - Better handling of large diffs with truncation
  - Added change statistics display
- Enhanced MessageBubble with better markdown rendering
  - Improved code block highlighting
  - Better handling of inline code
  - Enhanced list formatting
- Improved ToolCallBlock with collapsible sections
  - Better diff visualization
  - Improved status indicators
  - Enhanced error display
- Updated ThemeDialog and theme system
  - Improved theme switching UX
  - Better visual feedback for current theme
  - Enhanced color contrast in both themes
- Enhanced InputBox with autocomplete improvements
  - Better command suggestion filtering
  - Improved visual styling
  - Enhanced keyboard navigation
- Improved useKeyboard hook with leader mode support
  - Better key combination handling
  - Enhanced dialog state management
  - Improved focus tracking
- Enhanced useCommands hook with new commands
  - Added page navigation commands
  - Added sidebar toggle commands
  - Improved command registration
- Updated useFileChanges hook with tool event integration
  - Automatic file change detection from tool executions
  - Integration with sidebar context
  - Better change tracking and deduplication
- Agent system enhanced with deprecated flag support
  - Agents can now be marked as deprecated
  - Allows phasing out old agents while maintaining compatibility
- User configuration API enhanced
  - Improved batch update mechanism
  - Better disposal control
  - Enhanced type safety
- Permission system improvements
  - Added metadata field to permission requests
  - Better context propagation
  - Enhanced permission drain functionality
- MCP client improvements
  - Better error handling for server connections
  - Enhanced logging and diagnostics
  - Improved tool registration from MCP servers
- Context compaction improvements
  - Better handling of large conversation histories
  - Improved token estimation
  - Enhanced compaction strategies

### Fixed

- Documentation workflow now includes continue-on-error for GitHub comments
  - Prevents workflow failures when comment posting fails
  - Improves workflow reliability
- TUI component rendering issues with React 19
  - Fixed strict mode compatibility issues
  - Improved component lifecycle management
- Theme switching now properly updates all components
  - Fixed color propagation issues
  - Improved theme context updates
- Sidebar file selection now properly highlights selected items
  - Fixed selection state management
  - Improved keyboard navigation
- Log viewer scrolling now works correctly with large log sets
  - Fixed scroll position calculations
  - Improved viewport management

### Removed

- Deprecated baseUrl from tsconfig.json
  - No longer needed with current TypeScript configuration
  - Simplifies module resolution

## [0.3.1] - 2026-03-21

### Added

- Implementation plan, research, data model, and quickstart for TUI text display fix (005-tui-text-display)
- TUI layout requirements quality checklist (35 items)
- Task breakdown for 005-tui-text-display (26 tasks across 6 phases)

## [0.3.0] - 2026-03-21

### Added

- Full TUI (Terminal User Interface) — component-based interactive mode using Ink v6 + React 19
  - Persistent full-screen layout: header, scrollable message area, input box, status bar
  - Streaming markdown rendering with syntax-highlighted code blocks (marked + marked-terminal + cli-highlight)
  - Collapsible tool call blocks with red/green diff view for file edits
  - 5 modal dialog overlays: ModelPicker, AgentSelector, PermissionDialog, SessionList, McpManager
  - Keybinding system: Tab/Shift-Tab agent cycling, Ctrl+X leader mode, Ctrl+K command palette
  - Dark/light theme support via ThemeContext with /theme command
  - Image attachment support: Ctrl+V clipboard paste and /image file attachment
  - 12 slash commands: help, exit, clear, model, agent, status, sessions, mcp, theme, image, clear-images, memory
  - Event bus integration for real-time tool execution and permission prompt display
- 29 TUI test files (1664 total tests) covering all components, contexts, hooks, and dialogs
- TUI design contracts documenting component props, context APIs, and hook APIs
- UX requirements quality checklist (30 items)

### Changed

- Interactive mode (alexi interactive) now launches the TUI instead of the legacy readline REPL
- src/cli/interactive.ts marked as @deprecated in favor of src/cli/tui/

### Dependencies

- Added runtime: marked, marked-terminal, cli-highlight, diff, terminal-link
- Added runtime: ink-text-input, ink-select-input, ink-spinner
- Added dev: ink-testing-library, @types/diff
- Existing: ink (v6.8.0) and react (v19.2.4) now actively used

## [0.2.6] - 2026-03-19

### Added

- Unit tests for TUI slash commands (/image and /clear-images)
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
  - Added updateGlobal() function for atomic multi-key updates
  - Added UpdateGlobalOptions interface with disposal control
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

[Unreleased]: https://github.com/ausardcompany/alexi/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/ausardcompany/alexi/compare/v0.3.1...v0.4.1
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
