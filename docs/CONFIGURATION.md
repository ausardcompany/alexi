# Configuration

This document describes all configuration options available in Alexi, including environment variables, instruction files, routing configuration, and session management.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Instruction Files](#instruction-files)
- [Routing Configuration](#routing-configuration)
- [Session Storage](#session-storage)
- [Permission Configuration](#permission-configuration)
- [Configuration File Locations](#configuration-file-locations)

## Environment Variables

### Required Variables

#### AICORE_SERVICE_KEY

SAP AI Core service key in JSON format. Contains authentication credentials for SAP AI Core.

```bash
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
```

The service key JSON should contain:
- `clientid`: OAuth client ID
- `clientsecret`: OAuth client secret
- `url`: SAP AI Core base URL
- `serviceurls.AI_API_URL`: AI API endpoint URL

### Optional Variables

#### AICORE_RESOURCE_GROUP

SAP AI Core resource group identifier. Defaults to "default" if not specified.

```bash
AICORE_RESOURCE_GROUP=production
```

#### AICORE_MODEL

Default model to use when no model is specified.

```bash
AICORE_MODEL=gpt-4o
```

#### SAP_PROXY_BASE_URL

Base URL for OpenAI-compatible proxy endpoint (for proxy mode).

```bash
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
```

#### SAP_PROXY_API_KEY

API key for proxy endpoint authentication.

```bash
SAP_PROXY_API_KEY=your_secret_key
```

#### LOG_LEVEL

Set logging verbosity. Options: `debug`, `info`, `warn`, `error`. Defaults to `info`.

```bash
LOG_LEVEL=debug
```

## Instruction Files

Instruction files provide persistent customization for AI agents. They are loaded into the system prompt in a specific order, allowing different levels of customization.

### File Loading Order

1. **Project-level AGENTS.md** (`workdir/AGENTS.md`)
2. **User-level ALEXI.md** (`~/.alexi/ALEXI.md`)
3. **Project-level rule files** (`workdir/.alexi/rules/*.md`)

### Project-Level AGENTS.md

Location: `<project-root>/AGENTS.md`

Project-specific instructions for AI agents working in the codebase.

**Typical Contents**:
- Project overview and architecture
- Build and test commands
- Code style guidelines
- Important conventions
- Technology stack notes

**Example**:

```markdown
# AGENTS.md

## Project Overview

This is a TypeScript/Node.js CLI application using ES Modules.

## Build & Test Commands

```bash
npm run build
npm test
npm run lint
```

## Code Style

- Use 2 spaces for indentation
- Always use explicit types
- Prefer async/await over promises
- Use .js extensions for local imports (ES Modules requirement)

## Important Notes

- All LLM calls route through SAP AI Core Orchestration API
- Session data is stored in ~/.alexi/sessions/
```

**Creating AGENTS.md**:

```bash
# In interactive mode
/memory init

# Or create manually
touch AGENTS.md
```

### User-Level ALEXI.md

Location: `~/.alexi/ALEXI.md`

User-wide instructions loaded into every session across all projects.

**Typical Contents**:
- Personal coding preferences
- Preferred tools and libraries
- Communication style preferences
- Global conventions

**Example**:

```markdown
# ALEXI.md

User-level instructions loaded into every session.

## Preferences

- Prefer functional programming style
- Use descriptive variable names
- Always include error handling
- Write tests for new features

## Communication

- Be concise but thorough
- Explain reasoning for architectural decisions
- Suggest alternatives when appropriate
```

**Creating ALEXI.md**:

```bash
# In interactive mode
/memory edit user

# Or create manually
mkdir -p ~/.alexi
touch ~/.alexi/ALEXI.md
```

### Project-Level Rule Files

Location: `<project-root>/.alexi/rules/*.md`

Scoped instruction files for specific domains or concerns.

**Example Structure**:

```
project/
├── .alexi/
│   └── rules/
│       ├── security.md
│       ├── testing.md
│       └── api-design.md
```

**Example Rule File** (`security.md`):

```markdown
# Security Rules

- Never log sensitive data (passwords, tokens, keys)
- Use environment variables for credentials
- Validate all user input
- Use parameterized queries for database access
- Keep dependencies up to date
```

**Creating Rule Files**:

```bash
mkdir -p .alexi/rules
touch .alexi/rules/security.md
```

### System Prompt Assembly

Instruction files are assembled into the system prompt with XML-like tags:

```xml
<agents-md>
[Contents of AGENTS.md]
</agents-md>

<user-instructions>
[Contents of ALEXI.md]
</user-instructions>

<rule file="security.md">
[Contents of security.md]
</rule>

<rule file="testing.md">
[Contents of testing.md]
</rule>
```

This structure allows the LLM to understand the scope and priority of each instruction source.

## Routing Configuration

Routing rules determine which model to use based on prompt characteristics.

### Configuration File

Location: `routing-config.json` or `~/.alexi/routing-config.json`

```json
{
  "rules": [
    {
      "name": "reasoning-for-math",
      "priority": 80,
      "condition": {
        "contains": ["math", "calculate", "equation"]
      },
      "model": "gpt-4.1",
      "description": "Use reasoning models for math problems"
    },
    {
      "name": "code-tasks",
      "priority": 70,
      "condition": {
        "contains": ["code", "implement", "fix", "debug"]
      },
      "model": "anthropic--claude-4.5-sonnet"
    }
  ],
  "default": {
    "model": "anthropic--claude-4.5-sonnet"
  }
}
```

### Rule Structure

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Rule identifier |
| `priority` | number | Higher priority rules evaluated first |
| `condition` | object | Matching criteria (contains, regex, etc.) |
| `model` | string | Model to use when rule matches |
| `description` | string | Human-readable explanation |

### Condition Types

**Contains**:
```json
{
  "contains": ["keyword1", "keyword2"]
}
```

**Regex**:
```json
{
  "regex": "pattern.*here"
}
```

**Complexity**:
```json
{
  "minComplexity": "complex"
}
```

**Task Type**:
```json
{
  "taskType": "deep-reasoning"
}
```

## Session Storage

### Session Directory

Location: `~/.alexi/sessions/`

Each session is stored as a JSON file with the session ID as the filename.

### Session File Structure

```json
{
  "id": "abc-123-def",
  "metadata": {
    "id": "abc-123-def",
    "title": "Implement user authentication",
    "createdAt": "2026-03-16T10:30:00.000Z",
    "updatedAt": "2026-03-16T11:45:00.000Z",
    "model": "anthropic--claude-4.5-sonnet",
    "messageCount": 12
  },
  "messages": [
    {
      "role": "user",
      "content": "How do I implement JWT authentication?"
    },
    {
      "role": "assistant",
      "content": "Here's how to implement JWT authentication..."
    }
  ],
  "toolCalls": [
    {
      "id": "call_1",
      "tool": "write",
      "params": {
        "filePath": "src/auth.ts",
        "content": "..."
      },
      "result": {
        "success": true
      }
    }
  ]
}
```

### Session Management Commands

```bash
# List all sessions
alexi sessions

# Export session to markdown
alexi session-export -s <session-id> -o output.md

# Delete session
alexi session-delete -s <session-id>
```

## Permission Configuration

### Permission Rules

Permission rules control tool access to files, commands, and network resources.

#### Rule Structure

```typescript
interface PermissionRule {
  id?: string;
  name?: string;
  description?: string;
  tools?: string[];          // Tool name patterns
  actions?: PermissionAction[]; // 'read' | 'write' | 'execute' | 'network' | 'admin'
  paths?: string[];          // File path patterns
  commands?: string[];       // Command patterns
  hosts?: string[];          // Network host patterns
  decision: 'allow' | 'deny' | 'ask';
  priority: number;          // Higher = evaluated later (last match wins)
  externalPaths?: boolean;   // Apply to external paths
  homeExpansion?: boolean;   // Expand ~/ in paths
}
```

#### Default Rules

**Allow Read** (priority: 0):
```json
{
  "id": "allow-read",
  "actions": ["read"],
  "decision": "allow",
  "priority": 0
}
```

**Ask for Write** (priority: 10):
```json
{
  "id": "ask-write",
  "actions": ["write"],
  "decision": "ask",
  "priority": 10
}
```

**Deny Secrets** (priority: 100):
```json
{
  "id": "deny-secrets",
  "paths": ["**/.env", "**/.env.*", "**/secrets.json"],
  "decision": "deny",
  "priority": 100
}
```

#### Agentic Mode Rules

In agentic mode, high-priority allow rules (priority 200) are automatically added:

```typescript
// Allow writes in workdir
{
  id: 'agentic-allow-write',
  actions: ['write'],
  paths: [`${workdir}/**`, workdir],
  decision: 'allow',
  priority: 200,
}

// Allow execute operations
{
  id: 'agentic-allow-execute',
  actions: ['execute'],
  decision: 'allow',
  priority: 200,
}
```

### Permission Commands

```bash
# List permission rules
/permissions

# Reset session permission grants
/permissions reset
```

## Configuration File Locations

### User Configuration Directory

Location: `~/.alexi/`

```
~/.alexi/
├── ALEXI.md                  # User-level instructions
├── routing-config.json       # Routing rules
├── sessions/                 # Session storage
├── memories.json             # Stored memories
├── cost-history.json         # Cost tracking data
└── config.json               # User preferences
```

### Project Configuration

Location: `<project-root>/`

```
project/
├── AGENTS.md                 # Project-level instructions
├── .alexi/
│   ├── rules/                # Rule files
│   │   ├── security.md
│   │   └── testing.md
│   └── routing-config.json   # Project-specific routing
└── .env                      # Environment variables (never commit)
```

### Environment File Template

Create `.env` from `.env.example`:

```bash
cp .env.example .env
# Edit .env with your credentials
```

Example `.env`:

```bash
# SAP AI Core Configuration
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
AICORE_RESOURCE_GROUP=default

# Optional: Proxy Configuration
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key

# Optional: Logging
LOG_LEVEL=info
```

## Configuration Priority

When multiple configuration sources exist, they are merged with the following priority (highest to lowest):

1. Command-line flags (e.g., `--model`, `--auto-route`)
2. Environment variables
3. Project-level configuration files (`.alexi/routing-config.json`)
4. User-level configuration files (`~/.alexi/routing-config.json`)
5. Built-in defaults

## Configuration Best Practices

### Security

- Never commit `.env` files to version control
- Use `.env.example` as a template for required variables
- Store sensitive credentials in environment variables or secure vaults
- Review permission rules before enabling agentic mode

### Organization

- Keep project-specific instructions in `AGENTS.md`
- Keep personal preferences in `~/.alexi/ALEXI.md`
- Use `.alexi/rules/` for domain-specific instructions
- Name rule files descriptively (e.g., `security.md`, `testing.md`)

### Maintenance

- Update `AGENTS.md` when project structure changes
- Review and prune old sessions periodically
- Keep routing rules up to date with available models
- Test permission rules before deploying in production

## Viewing Current Configuration

Use the `/config` command in interactive mode to view current configuration:

```bash
# Show all configuration
/config

# Show configuration file paths
/config path

# Set a configuration value
/config set <key> <value>
```
