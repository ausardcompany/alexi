# Alexi API Documentation

This document provides comprehensive API documentation for Alexi's CLI commands, configuration options, and TypeScript interfaces.

## Table of Contents

- [CLI Commands](#cli-commands)
- [Environment Variables](#environment-variables)
- [TypeScript Interfaces](#typescript-interfaces)
- [Tool System](#tool-system)
- [Agent System](#agent-system)
- [Hooks System](#hooks-system)

## CLI Commands

### chat

Send messages to LLMs with optional auto-routing and session management.

```bash
alexi chat -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to send (required unless -f used) |
| `-f, --message-file <path>` | string | Read message from file |
| `--model <id>` | string | Override model selection (e.g., gpt-4o, anthropic--claude-4.5-sonnet) |
| `--auto-route` | boolean | Enable automatic model routing |
| `--prefer-cheap` | boolean | Prefer cheaper models when auto-routing |
| `--session <id>` | string | Continue existing session |
| `--system <prompt>` | string | System prompt for conversation |

#### Examples

```bash
# Simple message with specific model
alexi chat -m "Explain TypeScript generics" --model gpt-4o

# Auto-route with cost optimization
alexi chat -m "What is AI?" --auto-route --prefer-cheap

# Continue conversation in session
alexi chat -m "Tell me more" --session abc-123

# Read message from file
alexi chat -f prompt.txt --auto-route
```

### agent

Run agentic chat with tool execution for automated workflows.

```bash
alexi agent -m <message> [options]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `-m, --message <text>` | string | - | Message to send (required unless -f used) |
| `-f, --message-file <path>` | string | - | Read message from file |
| `--model <id>` | string | auto | Model ID override |
| `--auto-route` | boolean | false | Enable automatic model routing |
| `--prefer-cheap` | boolean | false | Prefer cheaper models |
| `--session <id>` | string | - | Continue existing session |
| `--system <prompt>` | string | - | System prompt |
| `--max-iterations <n>` | number | 50 | Maximum tool execution iterations |
| `--workdir <path>` | string | cwd | Working directory for tools |
| `--tools <list>` | string | all | Comma-separated tool names |
| `-v, --verbose` | boolean | false | Show progress updates |
| `-q, --quiet` | boolean | false | Only output final response |
| `--no-auto-commits` | boolean | - | Disable git auto-commits |
| `--no-dirty-commits` | boolean | - | Skip committing dirty files |
| `--git-commit-verify` | boolean | false | Run pre-commit hooks |
| `--attribute-co-authored-by` | boolean | true | Add Co-authored-by trailer |
| `--attribute-author` | boolean | false | Override git author |
| `--map-tokens <n>` | string | 2000 | Repo map token budget (0 to disable) |
| `--effort <level>` | string | medium | Effort level: low, medium, high |

#### Effort Levels

| Level | Max Iterations | Max Tokens | Behavior |
|-------|---------------|------------|----------|
| `low` | 15 | 2,048 | Fast and cheap, prefer cheap models |
| `medium` | 50 | 16,384 | Balanced (default) |
| `high` | 100 | 32,768 | Thorough, extended thinking budget |

#### Examples

```bash
# Basic agent task
alexi agent -m "Add error handling to the login function"

# With specific model and verbose output
alexi agent -m "Refactor the auth module" --model anthropic--claude-4.5-sonnet -v

# High effort for complex tasks
alexi agent -m "Implement a caching layer" --effort high

# Restrict available tools
alexi agent -m "Find all TODO comments" --tools read,glob,grep

# Read task from file with git attribution
alexi agent -f task.md --attribute-co-authored-by

# Disable auto-commits for dry-run
alexi agent -m "Update tests" --no-auto-commits
```

### interactive / i

Start interactive REPL with streaming responses and TUI.

```bash
alexi interactive [options]
alexi i [options]
```

Launches the Ink-based TUI with:
- Streaming markdown rendering
- Slash commands (`/help`, `/model`, `/agent`, `/theme`, etc.)
- Tab/Shift-Tab agent cycling
- Ctrl+K command palette
- Collapsible tool call blocks

### models

List available models/deployments from SAP AI Core.

```bash
alexi models [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--status <status>` | string | Filter by status (RUNNING, PENDING, STOPPED) |
| `--scenario <id>` | string | Filter by scenario ID |
| `-g, --resource-group <name>` | string | SAP AI Core resource group |
| `-j, --json` | boolean | JSON output |
| `--proxy` | boolean | Use proxy endpoint |

### explain

Explain the routing decision for a prompt without sending it.

```bash
alexi explain -m <message> [options]
```

Shows which model would be selected and why, including:
- Prompt classification (type, complexity)
- Matching rules
- Selected model with confidence score

### sessions

List all saved conversation sessions.

```bash
alexi sessions [options]
```

### session-export

Export a session to markdown format.

```bash
alexi session-export <session-id> [options]
```

### session-delete

Delete a saved session.

```bash
alexi session-delete <session-id>
```

### context

Show current project context information.

```bash
alexi context
```

### context-init

Initialize project context for the current directory.

```bash
alexi context-init
```

### context-add-invariant

Add an architecture invariant to project context.

```bash
alexi context-add-invariant <invariant>
```

### stages

List available conversation stages.

```bash
alexi stages
```

### stage-set

Set the current development stage.

```bash
alexi stage-set <stage>
```

### notes-generate

Generate AI_NOTES.md for the current development stage.

```bash
alexi notes-generate
```

### dod-check

Run Definition of Done checks.

```bash
alexi dod-check [options]
```

### dod-list

List available DoD checks.

```bash
alexi dod-list
```

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `AICORE_SERVICE_KEY` | JSON service key for SAP AI Core authentication |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `AICORE_RESOURCE_GROUP` | undefined | SAP AI Core resource group |
| `AICORE_DEPLOYMENT_ID` | undefined | Specific deployment ID |
| `AICORE_MODEL` | `gpt-5` | Default model to use |
| `SAP_PROXY_BASE_URL` | undefined | OpenAI-compatible proxy base URL |
| `SAP_PROXY_API_KEY` | undefined | Proxy API key |
| `SAP_PROXY_MODEL` | undefined | Model for proxy endpoint |
| `ALEXI_MAX_IMAGE_SIZE_MB` | `20` | Maximum image attachment size in MB |
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | undefined | Enable background task execution |
| `ALEXI_STOP_HOOK_BLOCK_CAP` | `8` | Max consecutive Stop hook blocks |

## TypeScript Interfaces

### Core Types

```typescript
// Tool execution context
interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  gitManager?: AutoCommitManager;
}

// Tool result
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
  metadata?: Record<string, unknown>;
}

// Routing decision
interface RoutingDecision {
  modelId: string;
  reason: string;
  confidence: number;
  ruleApplied?: string;
}

// Model capability
interface ModelCapability {
  id: string;
  type: 'openai' | 'claude' | 'gemini';
  costTier: 'cheap' | 'medium' | 'expensive';
  strengths: string[];
  maxTokens: number;
  reasoning: boolean;
}
```

### Agentic Chat Types

```typescript
// Options for agentic chat
interface AgenticChatOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  maxIterations?: number;
  workdir?: string;
  enabledTools?: string[];
  onProgress?: (event: AgenticProgressEvent) => void;
  signal?: AbortSignal;
  gitManager?: AutoCommitManager;
  repoMapManager?: RepoMapManager;
  effort?: EffortLevel;
  agentId?: string;
}

// Progress events during agentic execution
interface AgenticProgressEvent {
  type: 'llm_call' | 'tool_start' | 'tool_end' | 'iteration' | 'complete';
  iteration?: number;
  toolName?: string;
  toolId?: string;
  result?: ToolResult;
  message?: string;
}

// Agentic chat result
interface AgenticChatResult {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  modelUsed?: string;
  iterations: number;
  toolCallSummary: Array<{
    name: string;
    id: string;
    success: boolean;
  }>;
}
```

### Session Types

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: { input?: number; output?: number };
}

interface SessionMetadata {
  id: string;
  created: number;
  updated: number;
  modelId?: string;
  totalTokens: number;
  messageCount: number;
  title?: string;
}

interface Session {
  metadata: SessionMetadata;
  messages: Message[];
}
```

### Compaction Types

```typescript
// Compaction options
interface CompactionOptions {
  strategy: CompactionStrategy;
  preserveRecent?: number;
  preserveSystemPrompt?: boolean;
  customSummaryPrompt?: string;
  overflowTokens?: number; // Tokens that triggered overflow
}

type CompactionStrategy =
  | 'truncate'   // Remove oldest messages
  | 'summarize'  // AI summarization with target sizing
  | 'sliding'    // Sliding window, keep N most recent
  | 'smart';     // Importance-based selection

interface CompactionResult {
  success: boolean;
  originalMessageCount: number;
  compactedMessageCount: number;
  originalTokens: number;
  compactedTokens: number;
  summary?: string;
  removedMessages?: number;
  error?: string;
}
```

### Hook Types

```typescript
type HookEvent =
  | 'SessionStart'
  | 'SessionEnd'
  | 'PreToolUse'
  | 'PostToolUse'
  | 'PostToolUseFailure'
  | 'PermissionRequest'
  | 'Stop'
  | 'Error';

type HookType = 'command' | 'http' | 'script';

interface HookDefinition {
  event: HookEvent;
  type: HookType;
  command?: string;       // For 'command' type
  url?: string;           // For 'http' type
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  script?: string;        // For 'script' type
  timeout?: number;       // Max execution time in ms (default: 30000)
  enabled?: boolean;      // Default true
  description?: string;
  continueOnBlock?: boolean; // Feed rejection back to model
}

interface HookResult {
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
  capped?: boolean;         // Stop hook exceeded block cap
  continueOnBlock?: boolean;
}
```

### Agent Types

```typescript
type AgentMode = 'primary' | 'subagent' | 'all';

interface AgentConfig {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  mode: AgentMode;
  systemPrompt: string;
  deprecated?: boolean;
  tools?: string[];
  disabledTools?: string[];
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
  aliases?: string[];
  options?: Record<string, unknown>;
}

interface Agent extends AgentConfig {
  canUseTool(toolId: string): boolean;
}
```

## Tool System

### Defining a Tool

Tools are defined using the `defineTool` function with Zod schema validation:

```typescript
import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const MyParamsSchema = z.object({
  path: z.string().describe('File path'),
  content: z.string().describe('File content'),
});

export const myTool = defineTool<typeof MyParamsSchema, { written: boolean }>({
  name: 'my_tool',
  description: 'Description for the LLM',
  parameters: MyParamsSchema,

  permission: {
    action: 'write',
    getResource: (params, context) => {
      if (path.isAbsolute(params.path)) return params.path;
      return path.join(context?.workdir ?? process.cwd(), params.path);
    },
  },

  async execute(params, context): Promise<ToolResult<{ written: boolean }>> {
    // Implementation
    return { success: true, data: { written: true } };
  },
});
```

### Available Tools

| Tool | Name | Permission | Description |
|------|------|-----------|-------------|
| Bash | `bash` | execute | Execute shell commands |
| Read | `read` | read | Read files/directories with offset and limit |
| Write | `write` | write | Write files with BOM handling |
| Edit | `edit` | write | Exact string replacement in files |
| Glob | `glob` | read | Pattern-based file search |
| Grep | `grep` | read | Content search with regex |
| WarpGrep | `warpgrep` | read | AI-powered semantic code search |
| Task | `task` | - | Launch sub-agent tasks |
| Task Status | `task_status` | - | Query background task status |
| WebFetch | `webfetch` | network | Fetch web content |
| TodoWrite | `todowrite` | - | Manage structured task lists |
| Question | `question` | - | Ask user questions |
| Suggest | `suggest` | - | Suggest code review actions |
| Recall | `recall` | read | Search past conversations |
| Delete | `delete` | write | Delete files |
| Multi-Edit | `multiedit` | write | Edit multiple files |
| Batch | `batch` | - | Execute multiple tool calls |

### Task Tool (Sub-agents)

The Task tool launches specialized sub-agents for complex work:

```typescript
// Parameters
interface TaskParams {
  prompt: string;         // Task description
  description: string;    // Short 3-5 word summary
  subagent_type?: string; // 'general' or 'explore'
  task_id?: string;       // Resume previous task
  background?: boolean;   // Run in background (experimental)
}
```

Sub-agents are restricted to single-level nesting (no recursive spawning).

### Background Tasks

When `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS=true`, tasks can run asynchronously:

```typescript
// Launch background task
const result = await taskTool.execute({
  prompt: 'Analyze all test files',
  description: 'Analyze tests',
  subagent_type: 'explore',
  background: true,
});
// result.data.taskId -> use with task_status

// Query status
const status = await taskStatusTool.execute({ taskId: 'task-123' });
// status.data.status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
```

## Agent System

### Switching Agents

In the TUI, agents can be switched using:
- `@agent-name` syntax in messages
- Tab/Shift-Tab cycling
- `/agent` slash command

### Custom Agents

Create custom agents as markdown files:

```markdown
---
name: "Security Reviewer"
slug: security
aliases: [sec, audit]
mode: all
tools: [read, glob, grep]
temperature: 0.2
---

You are a security-focused code reviewer. Analyze code for:
- SQL injection vulnerabilities
- XSS attack vectors
- Authentication bypass risks

{file:security-checklist.md}
```

File inclusions (`{file:path}`) are resolved relative to the agent file and support recursive nesting up to depth 3.

## Hooks System

### Configuration

Hooks are configured in `.alexi/hooks.json` or `alexi.config.json`:

```json
{
  "hooks": [
    {
      "event": "PreToolUse",
      "type": "command",
      "command": "echo 'Tool: {{toolName}}'",
      "description": "Log tool usage",
      "enabled": true
    },
    {
      "event": "PostToolUse",
      "type": "http",
      "url": "https://webhook.example.com/tool-audit",
      "method": "POST",
      "timeout": 5000
    },
    {
      "event": "PreToolUse",
      "type": "script",
      "script": ".alexi/hooks/validate-write.ts",
      "continueOnBlock": true
    }
  ]
}
```

### Template Variables

Hook commands and URLs support template substitution:

| Variable | Description |
|----------|-------------|
| `{{event}}` | Hook event name |
| `{{toolName}}` | Current tool name |
| `{{sessionId}}` | Session identifier |
| `{{timestamp}}` | Unix timestamp |
| `{{error}}` | Error message (if applicable) |

### Hook Environment Variables

Command hooks receive additional environment variables:

| Variable | Description |
|----------|-------------|
| `ALEXI_HOOK_EVENT` | Event name |
| `ALEXI_HOOK_TOOL` | Tool name |
| `ALEXI_HOOK_SESSION` | Session ID |
| `ALEXI_HOOK_TIMESTAMP` | Timestamp |

### Programmatic Registration

```typescript
import { registerHook, executeHooks, createHookContext } from './hooks/index.js';

// Register a hook
registerHook({
  event: 'PreToolUse',
  type: 'command',
  command: 'validate-tool {{toolName}}',
  continueOnBlock: true,
});

// Execute hooks for an event
const context = createHookContext('PreToolUse', {
  toolName: 'write',
  toolParams: { path: '/tmp/file.txt' },
});
const results = await executeHooks('PreToolUse', context);
```
