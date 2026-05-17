# Configuration Guide

This document covers all configuration options for Alexi, including environment variables, routing rules, session storage, hooks, and custom agents.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Routing Configuration](#routing-configuration)
- [Session Configuration](#session-configuration)
- [Hooks Configuration](#hooks-configuration)
- [Custom Agents](#custom-agents)
- [MCP Server Configuration](#mcp-server-configuration)
- [Compaction Configuration](#compaction-configuration)
- [Example Configurations](#example-configurations)

## Environment Variables

### SAP AI Core (Native)

| Variable | Required | Description |
|----------|----------|-------------|
| `AICORE_SERVICE_KEY` | Yes | JSON service key for SAP AI Core. Contains `serviceurls`, `clientid`, `clientsecret`, and authentication URL |
| `AICORE_RESOURCE_GROUP` | No | Resource group identifier (default: undefined) |
| `AICORE_DEPLOYMENT_ID` | No | Specific deployment ID to use |
| `AICORE_MODEL` | No | Default model name (default: `gpt-5`) |

### OpenAI-Compatible Proxy

For development or alternative access methods:

| Variable | Required | Description |
|----------|----------|-------------|
| `SAP_PROXY_BASE_URL` | No | Base URL of OpenAI-compatible proxy (e.g., `http://127.0.0.1:3001/v1`) |
| `SAP_PROXY_API_KEY` | No | API key for proxy authentication |
| `SAP_PROXY_MODEL` | No | Model to request through proxy |

### Application Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `ALEXI_MAX_IMAGE_SIZE_MB` | `20` | Maximum image attachment size in MB |
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | undefined | Set to `true` to enable background task execution |
| `ALEXI_STOP_HOOK_BLOCK_CAP` | `8` | Maximum consecutive blocks before Stop hook is capped |

### Example `.env` File

```bash
# SAP AI Core (native SDK authentication)
AICORE_SERVICE_KEY='{"serviceurls":{"AI_API_URL":"https://api.ai.example.com"},"clientid":"client-id","clientsecret":"secret","url":"https://auth.example.com","identityzone":"zone","identityzoneid":"zone-id"}'
AICORE_DEPLOYMENT_ID=d1234567
AICORE_RESOURCE_GROUP=default
AICORE_MODEL=gpt-5

# OpenAI-compatible proxy (alternative)
SAP_PROXY_BASE_URL=http://127.0.0.1:3001/v1
SAP_PROXY_API_KEY=your_secret_key
SAP_PROXY_MODEL=gpt-5

# Experimental Features
# ALEXI_EXPERIMENTAL_BACKGROUND_TASKS=true
```

## Routing Configuration

Routing rules determine which model handles each prompt. Configuration is loaded from the first found location:

1. `./routing-config.json` (project root)
2. `./config/routing.json`
3. `~/.alexi/routing-config.json` (user global)

### Configuration Format

```json
{
  "models": [
    {
      "id": "gpt-4o-mini",
      "type": "openai",
      "costTier": "cheap",
      "strengths": ["simple-qa", "classification", "extraction", "summarization"],
      "maxTokens": 16000,
      "reasoning": false
    },
    {
      "id": "gpt-4o",
      "type": "openai",
      "costTier": "medium",
      "strengths": ["coding", "analysis", "creative-writing", "complex-qa", "vision"],
      "maxTokens": 128000,
      "reasoning": false
    },
    {
      "id": "anthropic--claude-4.5-sonnet",
      "type": "claude",
      "costTier": "medium",
      "strengths": ["coding", "analysis", "long-context", "technical-writing"],
      "maxTokens": 200000,
      "reasoning": false
    },
    {
      "id": "anthropic--claude-4.5-haiku",
      "type": "claude",
      "costTier": "cheap",
      "strengths": ["simple-qa", "classification", "extraction", "summarization"],
      "maxTokens": 200000,
      "reasoning": false
    },
    {
      "id": "gpt-4.1",
      "type": "openai",
      "costTier": "expensive",
      "strengths": ["deep-reasoning", "complex-math", "research", "advanced-coding"],
      "maxTokens": 128000,
      "reasoning": true
    },
    {
      "id": "anthropic--claude-4.5-opus",
      "type": "claude",
      "costTier": "expensive",
      "strengths": ["deep-reasoning", "complex-analysis", "long-context", "research"],
      "maxTokens": 200000,
      "reasoning": true
    }
  ],
  "rules": [
    {
      "name": "simple-questions",
      "description": "Route simple questions to cheap models",
      "priority": 50,
      "condition": {
        "maxLength": 100,
        "maxComplexity": "simple"
      },
      "modelId": "gpt-4o-mini"
    },
    {
      "name": "coding-tasks",
      "description": "Route coding tasks to Claude",
      "priority": 100,
      "condition": {
        "taskTypes": ["coding"],
        "keywords": ["implement", "refactor", "debug"]
      },
      "modelId": "anthropic--claude-4.5-sonnet"
    }
  ],
  "preferences": {
    "defaultCostTier": "medium",
    "preferCheapWhenPossible": false,
    "maxCostPerRequest": null,
    "fallbackModel": "gpt-4o"
  }
}
```

### Routing Rule Schema

```typescript
interface RoutingRule {
  name: string;           // Rule identifier
  description: string;    // Human-readable description
  priority: number;       // Higher = evaluated first (descending sort)
  condition: {
    minLength?: number;          // Minimum prompt length
    maxLength?: number;          // Maximum prompt length
    taskTypes?: string[];        // Matching task types
    maxComplexity?: 'simple' | 'medium' | 'complex';
    keywords?: string[];         // Keywords that trigger this rule
  };
  modelId?: string;              // Model to route to
  requiresReasoning?: boolean;   // Must have reasoning capability
}
```

### Prompt Classification

The router classifies prompts into:

| Type | Patterns |
|------|----------|
| `simple-qa` | "what is", "define", "translate" |
| `coding` | "implement", "debug", "refactor", code blocks |
| `deep-reasoning` | "analyze", "step by step", "prove" |
| `creative-writing` | "write story", "brainstorm" |
| `general-qa` | Default classification |

Complexity is determined by prompt length:
- **simple**: < 200 characters
- **medium**: 200-1000 characters
- **complex**: > 1000 characters or contains reasoning patterns

## Session Configuration

### Storage Location

Sessions are stored in `~/.alexi/sessions/` as JSON files, one per session.

### Session Manager Options

```typescript
interface SessionManagerOptions {
  sessionsDir?: string;        // Default: ~/.alexi/sessions/
  maxContextTokens?: number;   // Default: 128000
  autoCompact?: boolean;       // Default: true
}
```

### Auto-Compaction

When `autoCompact` is enabled, the session manager automatically compacts conversation history when approaching the token limit. The compaction threshold is controlled by the effort level:

| Effort Level | Compaction Threshold |
|-------------|---------------------|
| Low | 50% of max tokens |
| Medium | 75% of max tokens |
| High | 90% of max tokens |

## Hooks Configuration

### Config File Locations

Hooks are loaded from the first found file:
1. `.alexi/hooks.json` (project-level)
2. `alexi.config.json` (project-level, hooks key)
3. `~/.alexi/.alexi/hooks.json` (user-level)

### Hook Definition Format

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "type": "command",
      "command": "validate-tool {​{toolName}} {​{sessionId}}",
      "timeout": 5000,
      "enabled": true,
      "description": "Validate tool usage before execution",
      "continueOnBlock": true
    },
    {
      "event": "PostToolUse",
      "type": "http",
      "url": "https://audit.example.com/hooks",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer token",
        "X-Session": "{​{sessionId}}"
      },
      "timeout": 10000
    },
    {
      "event": "Stop",
      "type": "script",
      "script": ".alexi/hooks/loop-guard.ts",
      "description": "Prevent infinite tool loops"
    }
  ]
}
```

### Event-Type Compatibility

Not all event types support all hook types:

| Event | Command | HTTP | Script |
|-------|---------|------|--------|
| SessionStart | Yes | No | No |
| SessionEnd | Yes | No | No |
| PreToolUse | Yes | Yes | Yes |
| PostToolUse | Yes | Yes | Yes |
| PostToolUseFailure | Yes | Yes | Yes |
| PermissionRequest | Yes | Yes | Yes |
| Stop | Yes | Yes | Yes |
| Error | Yes | No | No |

`SessionStart`, `SessionEnd`, and `Error` events only support command-type hooks because HTTP/script hooks may have long timeouts or rely on session state not yet available.

### Script Hooks

Script hooks must export a function as `default` or named `hook`:

```typescript
// .alexi/hooks/validate-write.ts
import type { HookContext } from '../../src/hooks/index.js';

export default async function(context: HookContext) {
  if (context.toolName === 'write') {
    const params = context.toolParams;
    if (params?.path?.includes('/protected/')) {
      throw new Error('Cannot write to protected directory');
    }
  }
  return { allowed: true };
}
```

## Custom Agents

### Agent File Format

Custom agents are markdown files with YAML frontmatter stored in:
- `~/.alexi/agents/*.md` (user-global, lower precedence)
- `.alexi/agents/*.md` (project-local, higher precedence)

```markdown
---
name: "Agent Display Name"
slug: agent-id
aliases: [short, alt]
mode: all                    # primary | subagent | all
model: gpt-4o               # Preferred model
tools: [read, write, edit, glob, grep, bash]
disabledTools: []
temperature: 0.3
maxTokens: 16384
---

System prompt content goes here.

Supports {file:relative/path/to/include.md} for file inclusions.
```

### Frontmatter Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | filename | Display name |
| `slug` / `id` | string | filename (no ext) | Unique identifier |
| `aliases` | string[] | [] | Alternative names for switching |
| `mode` | enum | `all` | `primary`, `subagent`, or `all` |
| `model` | string | - | Preferred SAP AI Core model |
| `tools` | string[] | all | Allowed tool IDs |
| `disabledTools` | string[] | [] | Explicitly disabled tools |
| `temperature` | number | - | LLM temperature (0-2) |
| `maxTokens` | number | - | Max response tokens |

### File Inclusions

Agent prompts support `{file:path}` syntax:

```markdown
---
name: "Code Reviewer"
slug: reviewer
---

You are a code reviewer.

{file:review-guidelines.md}
{file:../shared/coding-standards.md}
```

- Paths are resolved relative to the agent file's directory
- Recursive inclusions supported up to depth 3
- Missing files are replaced with `<!-- {file:path} not found -->`
- Depth-exceeded inclusions show `<!-- {file:path} max inclusion depth reached -->`

## MCP Server Configuration

MCP servers are configured in `.alexi/mcp.json` or `alexi.config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "database": {
      "command": "python",
      "args": ["-m", "mcp_server_sqlite", "--db-path", "${SQLITE_DB_PATH}"]
    }
  }
}
```

Environment variables in configs are resolved using `${VAR_NAME}` syntax.

## Compaction Configuration

### Global Settings

```typescript
import { setCompactionConfig } from './compaction/index.js';

setCompactionConfig({
  maxTokens: 100000,        // Default: 100000
  warningThreshold: 0.8,    // Trigger at 80% (0-1)
  strategy: 'summarize',    // Default: 'sliding'
  preserveRecent: 4,        // Always keep 4 most recent messages
});
```

### Reactive Overflow Seeding

When a context overflow error is detected during an LLM call, the system uses reactive seeding to calculate an optimal summary target:

```
targetSummaryTokens = totalOldTokens - (overflowTokens * 1.5)
```

This ensures the compacted context fits within the model's limits with safety margin.

### Chunked Compaction

For very large contexts (> 100,000 tokens), content is split at natural boundaries (newlines, paragraphs) and compacted in parallel chunks before being merged.

## Example Configurations

### Cost Optimization

Minimize LLM costs while maintaining acceptable quality:

```json
{
  "models": [
    {
      "id": "gpt-4o-mini",
      "type": "openai",
      "costTier": "cheap",
      "strengths": ["simple-qa", "classification", "extraction", "summarization", "coding"],
      "maxTokens": 16000,
      "reasoning": false
    }
  ],
  "rules": [
    {
      "name": "everything-cheap",
      "description": "Route all tasks to cheapest model",
      "priority": 1000,
      "condition": {},
      "modelId": "gpt-4o-mini"
    }
  ],
  "preferences": {
    "defaultCostTier": "cheap",
    "preferCheapWhenPossible": true,
    "maxCostPerRequest": null,
    "fallbackModel": "gpt-4o-mini"
  }
}
```

CLI usage:
```bash
alexi agent -m "Fix the bug" --prefer-cheap --effort low
```

### Quality Optimization

Maximize output quality for complex tasks:

```json
{
  "models": [
    {
      "id": "anthropic--claude-4.5-opus",
      "type": "claude",
      "costTier": "expensive",
      "strengths": ["deep-reasoning", "complex-analysis", "coding", "research"],
      "maxTokens": 200000,
      "reasoning": true
    }
  ],
  "rules": [
    {
      "name": "always-best",
      "description": "Always use the most capable model",
      "priority": 1000,
      "condition": {},
      "modelId": "anthropic--claude-4.5-opus"
    }
  ],
  "preferences": {
    "defaultCostTier": "expensive",
    "preferCheapWhenPossible": false,
    "maxCostPerRequest": null,
    "fallbackModel": "anthropic--claude-4.5-opus"
  }
}
```

CLI usage:
```bash
alexi agent -m "Architect the new module" --effort high
```

### Specific Model Preferences

Route different task types to specialized models:

```json
{
  "rules": [
    {
      "name": "coding-to-claude",
      "description": "Claude excels at coding tasks",
      "priority": 100,
      "condition": {
        "taskTypes": ["coding"],
        "keywords": ["implement", "refactor", "debug", "fix", "test"]
      },
      "modelId": "anthropic--claude-4.5-sonnet"
    },
    {
      "name": "reasoning-to-opus",
      "description": "Complex reasoning needs Opus",
      "priority": 200,
      "condition": {
        "taskTypes": ["deep-reasoning"],
        "keywords": ["analyze", "architecture", "design"]
      },
      "modelId": "anthropic--claude-4.5-opus",
      "requiresReasoning": true
    },
    {
      "name": "simple-to-mini",
      "description": "Simple questions use cheap model",
      "priority": 50,
      "condition": {
        "maxLength": 200,
        "maxComplexity": "simple"
      },
      "modelId": "gpt-4o-mini"
    }
  ],
  "preferences": {
    "defaultCostTier": "medium",
    "preferCheapWhenPossible": false,
    "maxCostPerRequest": null,
    "fallbackModel": "gpt-4o"
  }
}
```

### Hooks for Audit Trail

Track all tool executions for compliance:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "type": "command",
      "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) PRE {​{toolName}} session={​{sessionId}}\" >> ~/.alexi/audit.log",
      "description": "Log tool usage before execution"
    },
    {
      "event": "PostToolUse",
      "type": "command",
      "command": "echo \"$(date -u +%Y-%m-%dT%H:%M:%SZ) POST {​{toolName}} session={​{sessionId}}\" >> ~/.alexi/audit.log",
      "description": "Log tool completion"
    },
    {
      "event": "Stop",
      "type": "script",
      "script": ".alexi/hooks/loop-guard.ts",
      "description": "Prevent runaway agentic loops"
    }
  ]
}
```
