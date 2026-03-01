# Alexi

Intelligent LLM orchestrator for SAP AI Core with automatic model routing, multi-turn conversations, structured DDD workflow, MCP integration, and skills system.

## Features

### Core Features

- **Multi-Provider Support**
  - OpenAI-compatible models via proxy (GPT-4o, GPT-4.1, GPT-4o-mini)
  - Claude models via native Bedrock Converse API (Claude 4 Sonnet, Claude 3.5 Sonnet, Claude 3 Haiku)
  - Extensible architecture for additional providers

- **Intelligent Auto-Routing**
  - Automatic model selection based on prompt complexity and task type
  - Cost optimization with `--prefer-cheap` flag
  - Rule-based routing from JSON configuration
  - Routing explanation with confidence scores

- **Session Management**
  - Multi-turn conversations with automatic context preservation
  - Session persistence to disk
  - Export sessions to markdown format

### New Features

- **Structured DDD Workflow** - Architecture → Planning → Implementation → Documentation → DevOps → Security stages
- **MCP (Model Context Protocol) Support** - Connect to external MCP servers and expose internal tools
- **Skills System** - Reusable AI prompts/behaviors that can be activated during conversations
- **Interactive REPL Mode** - Full-featured interactive CLI with streaming responses
- **Global CLI Installation** - `alexi` and `ax` commands available system-wide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```bash
# Proxy configuration (for OpenAI-compatible models)
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
SAP_PROXY_MODEL=gpt-4o

# Native SAP AI Core (for Claude models)
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=your-resource-group-id
```

### 3. Build & Install Globally
```bash
npm run build
npm link  # Makes 'alexi' and 'ax' commands available globally
```

### 4. Run
```bash
# Interactive mode (recommended)
alexi i

# Or with full command
alexi interactive
```

## Interactive Mode

Start the interactive REPL for the best experience:

```bash
alexi i
```

### Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/clear` | Clear conversation history |
| `/session` | Show current session info |
| `/save` | Save current session |
| `/load <id>` | Load a saved session |
| `/model <name>` | Switch to a different model |
| `/stage <name>` | Set development stage |
| `/skill <name>` | Activate a skill |
| `/skill off` | Deactivate current skill |
| `/skills` | List available skills |
| `/mcp connect` | Connect to MCP servers |
| `/mcp tools` | List MCP tools |
| `/mcp call <tool>` | Call an MCP tool |
| `/workflow start` | Start development workflow |
| `/workflow status` | Show workflow status |
| `/workflow next` | Move to next stage |
| `/exit` | Exit interactive mode |

## Skills System

Skills are specialized AI prompts that modify the assistant's behavior for specific tasks.

### Built-in Skills

| Skill | Aliases | Description |
|-------|---------|-------------|
| `code-review` | `cr`, `review` | Strict code reviewer focusing on correctness, security, and performance |
| `security-audit` | `sec`, `audit` | Security-focused code analysis based on OWASP guidelines |
| `architect` | `arch`, `design` | System design and architecture review specialist |
| `refactor` | `rf`, `improve` | Code improvement without changing behavior |
| `debug` | `dbg`, `fix` | Systematic debugging and root cause analysis |
| `documentation` | `docs`, `doc` | Technical documentation and API reference specialist |
| `test-writer` | `test`, `tdd` | Unit and integration test specialist |
| `devops` | `ops`, `deploy` | CI/CD, deployment, and infrastructure specialist |

### Using Skills

```bash
# List all skills
alexi skills

# Show skill details
alexi skill-show -n code-review

# In interactive mode
/skill code-review    # Activate skill
/skill off            # Deactivate skill
```

### Custom Skills

Create custom skills as markdown files with frontmatter:

```markdown
---
id: my-custom-skill
name: My Custom Skill
description: A custom skill for specific tasks
category: custom
tags:
  - custom
  - specialized
aliases:
  - mcs
---

You are a specialized assistant that...

## Instructions
- Always follow these guidelines
- Focus on specific aspects
```

Load custom skills:
```bash
alexi skill-load -f ~/.alexi/skills/my-skill.md
alexi skill-load-dir -d ~/.alexi/skills/
```

## MCP Integration

Connect to external MCP (Model Context Protocol) servers or expose internal tools.

### Managing MCP Servers

```bash
# List configured servers
alexi mcp-servers

# Add a new server
alexi mcp-add -n myserver -t stdio -c "npx" -a "-y @modelcontextprotocol/server-filesystem /tmp"

# Enable/disable servers
alexi mcp-enable -n filesystem --enable
alexi mcp-enable -n filesystem --disable

# Connect to enabled servers
alexi mcp-connect

# List available tools
alexi mcp-tools

# Call a tool
alexi mcp-call -t read_file -a '{"path": "/tmp/test.txt"}'
```

### Exposing Tools as MCP Server

```bash
# Start as MCP server (for other MCP clients)
alexi mcp-serve
```

### In Interactive Mode

```bash
/mcp connect          # Connect to enabled MCP servers
/mcp tools            # List available tools
/mcp call read_file   # Call a tool (prompts for arguments)
```

## Development Workflow

Structured workflow based on Documentation-Driven Development (DDD):

```
Architecture → Planning → Implementation → Documentation → DevOps → Security
```

### Using Workflows

```bash
# Start a new workflow
alexi workflow-start

# Check current status
alexi workflow-status

# Move to next stage
alexi workflow-next

# Get stage-specific system prompt
alexi workflow-prompt

# Reset workflow
alexi workflow-reset
```

### Stage Definitions

| Stage | Focus | Key Artifacts |
|-------|-------|---------------|
| Architecture | System design, ADRs, invariants | Architecture docs, diagrams |
| Planning | Work breakdown, dependencies, risks | Task lists, estimates |
| Implementation | Code, tests, quality | Source code, tests, AI_NOTES.md |
| Documentation | Docs accuracy, examples | README, API docs |
| DevOps | CI/CD, deployment, monitoring | Pipelines, configs |
| Security | OWASP, vulnerabilities, compliance | Security reports |

### In Interactive Mode

```bash
/workflow start       # Start workflow
/workflow status      # Check status
/workflow next        # Move to next stage
/stage implementation # Jump to specific stage
```

## CLI Commands Reference

### Chat & Routing
```bash
alexi chat -m "message" [--model <id>] [--auto-route] [--prefer-cheap]
alexi explain -m "message"   # Explain routing decision
alexi models                 # List available models
```

### Sessions
```bash
alexi sessions               # List sessions
alexi session-export -s <id> # Export to markdown
alexi session-delete -s <id> # Delete session
```

### Project Context
```bash
alexi context                # Show project context
alexi context-init           # Initialize context
alexi context-add-invariant  # Add architecture invariant
```

### Workflow
```bash
alexi workflow-start [--stage <name>]
alexi workflow-status
alexi workflow-next [--stage <name>]
alexi workflow-reset
alexi workflow-prompt
```

### Skills
```bash
alexi skills [--category <cat>]
alexi skill-show -n <name>
alexi skill-load -f <file>
alexi skill-load-dir -d <directory>
alexi skill-categories
```

### MCP
```bash
alexi mcp-servers
alexi mcp-add -n <name> -t <transport> -c <command> [-a <args>]
alexi mcp-remove -n <name>
alexi mcp-enable -n <name> [--enable|--disable]
alexi mcp-connect
alexi mcp-tools
alexi mcp-call -t <tool> [-a <json-args>]
alexi mcp-serve
```

### DoD & Notes
```bash
alexi dod-check [--stage <name>]
alexi dod-list
alexi notes-generate
alexi stages
alexi stage-set -s <name>
```

### System & Diagnostics
```bash
alexi doctor                 # Run health checks
alexi log                    # View logs
alexi log-follow             # Follow logs in real-time
alexi log-clean              # Clean old log files
alexi profile                # List profiles
alexi profile-switch -n <name>  # Switch profile
alexi sound                  # Configure sounds
alexi self-update            # Check for updates
```

### CI/CD
```bash
alexi ci                     # List CI/CD templates
alexi ci-init                # Initialize CI/CD workflows
alexi ci-preview             # Preview a template
```

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `.env` | Project root | Environment variables |
| `routing-config.json` | Project root | Model routing rules |
| `mcp-servers.json` | `~/.alexi/` | MCP server configurations |
| `skills/` | `~/.alexi/` | Custom skill files |
| `sessions/` | `~/.alexi/` | Saved chat sessions |
| `profiles/` | `~/.alexi/` | Environment profiles |
| `commands/` | `~/.alexi/` | Custom commands |
| `plugins/` | `~/.alexi/` | Loaded plugins |
| `.workflow-state.json` | Project root | Current workflow state |
| `.project-context.json` | Project root | Project context & invariants |
| `.alexi/` | Project root | Project-specific configs |

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage

# Run in dev mode
npm run dev -- chat -m "test"

# Link globally for development
npm link
```

## Architecture

### Provider Resolution
- **GPT models** → OpenAI-compatible proxy
- **Claude models** → Native Bedrock Converse API
- **Anthropic models** → Anthropic Messages API

### Routing Logic
1. Check for forced model via `--model` flag
2. If `--auto-route` enabled:
   - Classify prompt (task type, complexity, reasoning needs)
   - Match against routing rules
   - Score models based on capabilities and cost
   - Select best model with confidence score
3. Otherwise use default model from environment

## OpenCode-Inspired Features

| Feature | Description |
|---------|-------------|
| **Undo/Redo** | Rollback and restore file changes |
| **Plan Mode** | Read-only analysis mode (no file changes) |
| **Custom Commands** | Define reusable command templates |
| **Enhanced Permissions** | Fine-grained tool access control |
| **Session Sharing** | Export/import sessions |
| **Project Auto-Init** | Automatic project analysis and setup |
| **Context Compaction** | Reduce conversation token usage |
| **Plugin System** | Extend functionality with plugins |

## Codemie-Inspired Features

| Feature | Description |
|---------|-------------|
| **Doctor** | System health checks |
| **Log Management** | View, filter, and follow logs |
| **Profile Management** | Switch between environment configurations |
| **Sound Effects** | Audio notifications for events |
| **Self-Update** | Check for and install updates |
| **CI/CD Templates** | Generate GitHub/GitLab workflows |

## License

MIT
