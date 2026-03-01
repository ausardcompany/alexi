# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint and Prettier configuration for code quality
- Pre-commit hooks with Husky and lint-staged
- VS Code configuration for debugging and formatting
- CI/CD pipeline with GitHub Actions
- CONTRIBUTING.md with contribution guidelines
- ARCHITECTURE.md with system design documentation
- Test coverage reporting with thresholds

### Changed
- Updated vitest configuration with coverage thresholds

## [0.1.0] - 2026-02-28

### Added
- Initial release as **Alexi** (renamed from sap-bot-orchestrator)
- Multi-provider support:
  - OpenAI-compatible proxy
  - AWS Bedrock Converse API
  - Anthropic Messages API
  - SAP AI Core integration
  - Ollama local models
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
