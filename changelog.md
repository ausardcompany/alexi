# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Simplified to single provider: SAP AI Core Orchestration SDK
- Removed direct integrations: OpenAI, Anthropic, Bedrock, Ollama (all available via SAP AI Core)
- Updated CLI name and branding to "Alexi"
- Improved release workflow with npm publishing support

### Fixed
- All ESLint errors fixed (0 errors, 333 warnings)
- Fixed `NodeJS.Timeout` type issue with `ReturnType<typeof setTimeout>`
- Fixed switch/case block scoping in interactive.ts
- Fixed `this` aliasing in plugin/index.ts using `.bind()`
- Fixed type exports in server/index.ts
- Removed unused imports across test files
- Added `vitest.config.ts` and `eslint.config.js` to ESLint tsconfig

### Removed
- Removed `dist/` from git tracking (build output)

## [0.1.0] - 2026-02-28

### Added
- Initial release as **Alexi** (renamed from sap-bot-orchestrator)
- SAP AI Core Orchestration as the LLM provider
- Intelligent auto-routing based on prompt complexity
- Session management with multi-turn conversations
- Rule-based routing configuration (JSON)
- CLI commands:
  - `chat` - Send messages to LLMs
  - `explain` - Analyze routing decisions
  - `sessions` - List saved sessions
  - `session-export` - Export session to markdown
  - `session-delete` - Delete a session
  - `models` - List available models
  - `doctor` - Health check
  - `profile` - Manage profiles
  - `init` - Initialize project configuration
- Interactive mode with real-time streaming
- MCP (Model Context Protocol) integration
- Tool system with 10+ built-in tools
- Agent system for autonomous task execution
- Event bus for plugin architecture
- Permission system for security
- Context compaction for long conversations
- Session sharing and export
- Undo/redo functionality
- Sound notifications
- Logging system with structured output
- Workflow management system
- Skill system for specialized prompts

### Security
- Secret redaction in session exports
- File permission system with deny rules
- Profile-based secret management

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.0 | 2026-02-28 | Initial release as Alexi |

[Unreleased]: https://github.com/ausard/alexi/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ausard/alexi/releases/tag/v0.1.0
