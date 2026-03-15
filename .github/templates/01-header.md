# Task: Generate Documentation for Alexi

## Context

You are updating documentation for **Alexi** — an intelligent LLM orchestrator for SAP AI Core with automatic model routing, multi-turn conversations, agentic tool execution, and rule-based configuration.

## Project Overview

**Alexi** is a TypeScript/Node.js CLI application featuring:
- **SAP AI Core Integration**: All LLM calls route through SAP AI Core Orchestration API
- **Intelligent Auto-Routing**: Automatic model selection based on prompt complexity and task type
- **Agentic Tool Execution**: Agent mode with read/write/edit/glob/grep tools for autonomous tasks
- **Session Management**: Multi-turn conversations with context preservation and checkpoints
- **Rule-Based Configuration**: JSON-based routing rules with priorities
- **Ink-based TUI**: Interactive terminal UI built with React/Ink components

## Technology Stack

- **Language**: TypeScript 5.x (strict mode, ES2022 target, NodeNext modules)
- **Runtime**: Node.js >= 22.12.0 (ES Modules)
- **AI Backend**: SAP AI Core Orchestration API exclusively
- **Build Tool**: TSC (build) + tsx (development)
- **CLI Framework**: Commander.js
- **TUI Framework**: Ink 6 + React 19
- **Testing**: Vitest
- **Configuration**: JSON-based routing config, environment variables

## Project Structure

```text
alexi/
├── src/
│   ├── agent/          # Agent system (prompts, specialisation)
│   ├── bus/            # Event bus for tool execution observability
│   ├── ci/             # CI integration helpers
│   ├── cli/            # CLI entry point (Commander.js program, interactive REPL)
│   ├── command/        # Slash command system
│   ├── compaction/     # Context compaction
│   ├── config/         # Environment, routing config, project context
│   ├── context/        # Repo map, symbol ranking, tree-sitter
│   ├── core/           # Orchestrator, router, session management, agentic chat
│   ├── doctor/         # System health checks
│   ├── git/            # Git operations (auto-commit, attribution, dirty files)
│   ├── hooks/          # Lifecycle hooks
│   ├── i18n/           # Internationalization
│   ├── init/           # Project initialization
│   ├── log/            # Log viewer
│   ├── mcp/            # Model Context Protocol (client, server, config)
│   ├── permission/     # Permission management and prompts
│   ├── plan/           # Planning system
│   ├── plugin/         # Plugin system
│   ├── profile/        # Profile management
│   ├── providers/      # SAP AI Core Orchestration provider (sole provider)
│   ├── server/         # HTTP server mode
│   ├── share/          # Session sharing
│   ├── skill/          # Skill system
│   ├── sound/          # Sound notifications
│   ├── sync/           # Upstream sync utilities
│   ├── tool/           # Tool implementations (read, write, edit, glob, grep, bash, etc.)
│   ├── tui/            # Ink-based TUI components
│   ├── undo/           # Undo system
│   ├── update/         # Self-update mechanism
│   └── utils/          # Shared utilities and logger
├── tests/              # Test suites (Vitest)
├── docs/               # Generated documentation (managed by this workflow)
├── .github/
│   ├── workflows/      # GitHub Actions (sync, docs, release, etc.)
│   └── templates/      # Documentation generation prompt templates
├── CHANGELOG.md        # Keep a Changelog format
├── AGENTS.md           # AI agent coding guidelines
├── package.json
└── tsconfig.json
```

## Available CLI Commands

| Command | Description |
|---------|-------------|
| `chat` | Send messages to LLMs with optional auto-routing |
| `agent` | Run agentic chat with tool execution (for automated workflows) |
| `interactive` / `i` | Start interactive REPL with streaming responses |
| `models` | List available models/deployments from SAP AI Core |
| `explain` | Explain routing decision for a prompt |
| `sessions` | List all saved sessions |
| `session-export` | Export session to markdown |
| `session-delete` | Delete a session |
| `context` | Show current project context |
| `context-init` | Initialize project context |
| `context-add-invariant` | Add architecture invariant |
| `stages` | List available conversation stages |
| `stage-set` | Set current development stage |
| `notes-generate` | Generate AI_NOTES.md for current stage |
| `dod-check` | Run Definition of Done checks |
| `dod-list` | List available DoD checks |

## IMPORTANT: Read Source Code Before Writing

Do NOT rely solely on the diff preview below. Use the `read`, `glob`, and `grep` tools to examine actual source files before writing documentation. The diff is a starting point — always verify against the real code.
