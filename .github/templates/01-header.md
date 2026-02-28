# Task: Generate Documentation for SAP Bot Orchestrator

## Context

You are updating documentation for **SAP Bot Orchestrator** - an intelligent LLM orchestrator for SAP AI Core with automatic model routing, multi-turn conversations, and rule-based configuration.

## Project Overview

**SAP Bot Orchestrator** is a TypeScript/Node.js application featuring:
- **Multi-Provider Support**: OpenAI-compatible proxy, Claude via Bedrock Converse API, Anthropic Messages API
- **Intelligent Auto-Routing**: Automatic model selection based on prompt complexity and task type
- **Session Management**: Multi-turn conversations with context preservation
- **Rule-Based Configuration**: JSON-based routing rules with priorities
- **Autonomous Self-Updating**: Syncs with upstream AI coding assistant repositories (kilocode, opencode, claude-code)

## Technology Stack

- **Language**: TypeScript 5.x
- **Runtime**: Node.js 22
- **AI Backend**: SAP AI Core (Claude, GPT models)
- **Build Tool**: TSC + tsx for development
- **Configuration**: JSON-based routing config, environment variables
- **CLI Framework**: Commander.js

## Project Structure

```
sap-bot-orchestrator/
├── src/
│   ├── cli/
│   │   └── program.ts          # CLI entry point (Commander.js)
│   ├── providers/              # LLM provider implementations
│   │   ├── openai/             # OpenAI-compatible proxy provider
│   │   ├── bedrock/            # AWS Bedrock Converse API provider
│   │   └── anthropic/          # Anthropic Messages API provider
│   ├── router/                 # Auto-routing system
│   │   ├── classifier.ts       # Prompt classifier
│   │   └── router.ts           # Model router
│   ├── session/                # Session management
│   │   └── manager.ts          # Session persistence
│   └── core/                   # Core orchestration
├── scripts/
│   ├── sync-upstream.sh        # Local sync script
│   └── generate-diff-report.sh # Diff report generator
├── .github/
│   ├── workflows/
│   │   ├── sync-upstream.yml   # Autonomous sync workflow
│   │   └── documentation-update.yml # Doc generation workflow
│   ├── templates/              # Kilo prompt templates
│   └── last-sync-commits.json  # Sync state
├── routing-config.json         # Routing rules configuration
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Main documentation
```

## Available CLI Commands

| Command | Description |
|---------|-------------|
| `chat` | Send messages to LLMs with optional auto-routing |
| `explain` | Analyze and explain routing decisions |
| `sessions` | List all saved sessions |
| `session-export` | Export session to markdown |
| `session-delete` | Delete a session |
| `models` | List available models |

