# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-03-15

### Added

- Component-based Ink TUI replacing readline REPL
  - Full-screen terminal user interface with Header, MessageArea, InputBox, and StatusBar components
  - Real-time streaming message display with markdown rendering
  - Interactive dialogs for model picker, agent selector, session list, and permission requests
  - Command palette with fuzzy search for slash commands
  - Theme system with dark and light modes
  - Context providers for session, chat, keybindings, dialogs, and attachments
  - Custom hooks for stream chat, permissions, tool events, and keyboard handling
- Screenshot and image paste support with multimodal content
  - Clipboard image detection for pngpaste, xclip, wl-paste, and PowerShell
  - Image attachment preview in TUI with dimensions and file size
  - Multimodal message building with text and image content items
  - Image validation with format detection and size limits
  - Base64 encoding for image transmission to LLM providers
- Agent system with specialized prompts and switching
  - Built-in agents: code, debug, plan, explore, orchestrator
  - Agent registry with aliases and current agent tracking
  - Agent-specific system prompts loaded from prompts directory
  - Agent switching with reason tracking via bus events
  - Agent mention parsing in user messages
  - Color-coded agent badges and prompts in CLI
- System prompt assembly pipeline
  - Layered prompt composition: soul, model-specific, environment, agent role, AGENTS.md
  - Model prompt key resolution for anthropic, openai, gemini models
  - Environment detection: workdir, git repo status, platform, date
  - AGENTS.md file loading from project directory
  - Assembled system prompt building with configurable options
- Repository context mapping with tree-sitter
  - Symbol extraction from TypeScript and JavaScript files
  - File ranking by modification time and git status
  - Token budget management with configurable limits
  - Repository map generation with file summaries
  - CLI flag for map-tokens configuration
- Git integration features
  - Auto-commit manager with staged file detection
  - Commit message generation using LLM
  - File attribution tracking with git blame
  - Dirty files detection in working directory
  - Git configuration management
- Memory system with typed memories
  - Store and retrieve conversation memories
  - Search memories by query
  - Memory persistence across sessions
  - Memory tool for agent access
- Session context management
  - Session metadata with token tracking
  - Session close with summary generation
  - Session export to markdown
  - Session list with summaries
- Permission prompt system
  - Interactive permission requests with context
  - Permission rule evaluation with priority
  - External access detection
  - Doom loop prevention
- Effort level configuration
  - Predefined effort levels: quick, standard, thorough, exhaustive
  - Iteration limits and tool budgets per effort level
  - Effort level parsing from user input
- Internationalization support
  - English translations for UI strings
  - Translation function with fallback
  - Locale management
- CI/CD enhancements
  - Auto-merge workflow for approved PRs
  - Parallelized CI pipeline with caching
  - Homebrew formula auto-update on releases
  - Enhanced sync workflow with version bumping
  - Documentation update workflow improvements
- Specify integration scripts
  - Check prerequisites script
  - Common utilities script
  - Create new feature script
  - Setup plan script
  - Update agent context script
- Comprehensive test coverage
  - TUI component tests with ink-testing-library
  - Clipboard and image validation tests
  - Context and repo map tests
  - Git integration tests
  - Multimodal provider tests
  - Agent system tests

### Changed

- Interactive mode now uses Ink TUI instead of readline REPL
  - Improved visual layout with bordered components
  - Better streaming message display with markdown formatting
  - Enhanced keyboard navigation with Tab and Ctrl+X shortcuts
  - Unified keybinding system across CLI and TUI
- Agent system refactored with registry pattern
  - Centralized agent management in AgentRegistry class
  - Agent switching via bus events
  - Current agent tracking with reason
  - Agent mode filtering for primary, subagent, or all agents
- Permission system enhanced with prompt support
  - Next permission request with timeout
  - Permission prompt handler for interactive mode
  - Permission context with tool name and resource
- Tool system improvements
  - Bash tool with process group management and timeout
  - Batch tool with parallel execution support
  - Memory tool for persistent storage
  - Tool persistence across sessions
- Core orchestration updates
  - Agentic chat with effort level support
  - Session context integration
  - Streaming orchestrator with multimodal support
- Provider enhancements
  - SAP Orchestration provider with multimodal content
  - Provider-specific multimodal tests
- Updated dependencies
  - Ink 6.8.0 for TUI components
  - React 19.2.4 for component rendering
  - Tree-sitter 0.21.1 for code parsing
  - Marked 15.0.12 for markdown rendering
  - Diff 8.0.3 for file comparison
  - CLI-highlight 2.1.11 for syntax highlighting
  - SAP AI SDK orchestration 2.8.0
  - Hono 4.12.5 for server functionality

### Fixed

- Lint errors in clipboard and image validation tests
- Doc generation workflow step order and token limits
- Auto-commit manager interference with doc workflow
- TUI layout, colors, and component structure
- Bash tool process cleanup on timeout and abort
- Commander flag handling for boolean options
- Workflow expression parsing with heredocs
- ESM import compatibility in CI workflows
- Zero-width space characters in workflow files

### Removed

- Legacy readline-based interactive REPL implementation
- Deprecated interactive options in favor of TUI

## [0.1.9] - 2026-03-14

### Added

- Assembled system prompt pipeline with model-specific instructions
- Interactive model picker with grouped models
- Agent-colored prompts with Tab cycling
- Ctrl+X keybindings for leader mode

### Changed

- Wired assembled system prompt into chat flow
- Enhanced sync workflow with detailed PR descriptions

### Fixed

- API 400 errors in sync workflow
- Pre-commit hook bypass for AI-generated commits

## [0.1.8] - 2026-03-10

### Added

- Persistent memory system with typed memories
- AGENTS.md with AI agent guidelines
- Upstream-inspired improvements from sync

### Changed

- Updated dependencies to latest versions

## [0.1.7] - 2026-03-08

### Added

- Repository map with tree-sitter symbol extraction
- Comprehensive tests for repo map and aliases
- CLI map-tokens flag for budget configuration

### Changed

- Optimized CI pipeline with parallelization and caching

## [0.1.6] - 2026-03-07

### Added

- Repository map enabled by default with 2000 token budget

### Changed

- Model aliases with full coverage
- Alias command splitting on whitespace

## [0.1.5] - 2026-03-06

### Added

- Git auto-commits with attribution
- Repository map generation

### Changed

- Homebrew update schedule to daily

## [0.1.4] - 2026-03-05

### Added

- Git auto-commit functionality
- File attribution tracking
- Commit message generation

### Changed

- CI workflow to auto-update Homebrew formula

## [0.1.3] - 2026-03-04

### Added

- Initial release with multi-provider support
- Intelligent auto-routing based on prompt analysis
- Session management with persistence
- Rule-based configuration system
- Autonomous self-updating from upstream repositories

[0.2.0]: https://github.com/ausardcompany/alexi/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/ausardcompany/alexi/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/ausardcompany/alexi/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/ausardcompany/alexi/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/ausardcompany/alexi/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/ausardcompany/alexi/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/ausardcompany/alexi/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/ausardcompany/alexi/releases/tag/v0.1.3
