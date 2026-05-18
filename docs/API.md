# Alexi API Documentation

This document provides comprehensive API documentation for Alexi's CLI commands, configuration options, and TypeScript interfaces.

## Table of Contents

- [CLI Commands](#cli-commands)
- [Agent Mode](#agent-mode)
- [Interactive Mode Commands](#interactive-mode-commands)
- [Environment Variables](#environment-variables)
- [TypeScript Interfaces](#typescript-interfaces)
- [Tool System](#tool-system)
- [Permission System](#permission-system)

## CLI Commands

### chat

Send messages to LLMs with optional auto-routing and session management.

```bash
alexi chat -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to send (required) |
| `--model <id>` | string | Override model selection (e.g., gpt-4o, anthropic--claude-4-sonnet) |
| `--auto-route` | boolean | Enable automatic model routing |
| `--prefer-cheap` | boolean | Prefer cheaper models when auto-routing |
| `--session <id>` | string | Continue existing session |
| `--system <prompt>` | string | System prompt for conversation |

#### Examples

```bash
# Use specific model
alexi chat -m "Hello" --model gpt-4o-mini

# Auto-route with cost optimization
alexi chat -m "What is AI?" --auto-route --prefer-cheap

# Continue conversation in session
alexi chat -m "Tell me more" --session abc-123 --auto-route
```

### agent

Run agentic chat with autonomous tool execution for automated workflows.

```bash
alexi agent -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Task message (required) |
| `--model <id>` | string | Override model selection |
| `--auto-route` | boolean | Enable automatic model routing |
| `--system <file>` | string | System prompt file path |
| `--max-iterations <n>` | number | Maximum tool execution iterations (default: 50) |
| `--workdir <dir>` | string | Working directory (default: cwd) |
| `--tools <list>` | string | Comma-separated list of enabled tools |
| `--effort <level>` | string | Effort level: low, medium, high, max |
| `--agent <id>` | string | Agent to use (code, debug, plan, explore) |
| `--auto` | boolean | Run in fully autonomous mode (no permission prompts) |

#### Examples

```bash
# Basic agentic task
alexi agent -m "Fix all TypeScript type errors in src/"

# With specific model and effort
alexi agent -m "Refactor the auth module" --model anthropic--claude-4-sonnet --effort high

# With limited tools
alexi agent -m "Analyze the codebase" --tools read,glob,grep

# Fully autonomous mode
alexi agent -m "Update all test files" --auto --max-iterations 30

# Using a specific agent
alexi agent -m "Debug the failing test" --agent debug
```

#### Behavior

In agent mode, Alexi:
1. Configures high-priority permission rules (priority 200) for write and execute
2. Enables external directory access
3. Loops: sends messages to LLM, executes tool calls, feeds results back
4. Detects context overflow and triggers reactive compaction
5. Executes lifecycle hooks (PreToolUse, PostToolUse, Stop)
6. Returns final response with iteration count and tool call summary

### interactive / i

Start interactive REPL with streaming responses (launches the Ink-based TUI).

```bash
alexi interactive
alexi i
```

### models

List available models/deployments from SAP AI Core.

```bash
alexi models [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-j, --json` | boolean | Output as JSON |
| `-s, --status <status>` | string | Filter by status (RUNNING, PENDING, STOPPED) |
| `--scenario <scenario>` | string | Filter by scenario ID |
| `-g, --resource-group <group>` | string | AI Core resource group |
| `--proxy` | boolean | Use proxy endpoint instead of direct API |

#### Examples

```bash
# List all deployments
alexi models

# Running models only, as JSON
alexi models --status RUNNING --json

# Specific resource group
alexi models --resource-group production
```

### explain

Analyze and explain routing decisions without executing the request.

```bash
alexi explain -m <message>
```

#### Example Output

```
=== Prompt Analysis ===
Type: deep-reasoning
Complexity: complex
Requires Reasoning: true
Estimated Tokens: 19

=== Matched Rules ===
 reasoning-for-math (priority: 80): Use reasoning models for math problems

=== Model Candidates (by score) ===
 gpt-4.1              Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
  claude-4-sonnet      Score: 120 - expensive tier, strong at deep-reasoning, has reasoning

=== Selected Model ===
Model: gpt-4.1
Reason: Task type: deep-reasoning, Complexity: complex, requires reasoning
Confidence: 100%
Rule Applied: reasoning-for-math
```

### sessions

List all saved sessions.

```bash
alexi sessions
```

### session-export

Export a session to markdown format.

```bash
alexi session-export -s <session-id> [-o output.md]
```

| Option | Type | Description |
|--------|------|-------------|
| `-s, --session <id>` | string | Session ID to export (required) |
| `-o, --output <file>` | string | Output file path (default: stdout) |

### session-delete

Delete a session.

```bash
alexi session-delete -s <session-id>
```

### context

Show current project context information.

```bash
alexi context
```

### context-init

Initialize project context configuration.

```bash
alexi context-init
```

### context-add-invariant

Add an architecture invariant to the project context.

```bash
alexi context-add-invariant "All LLM calls must go through SAP AI Core"
```

### stages

List available conversation stages.

```bash
alexi stages
```

### stage-set

Set the current development stage.

```bash
alexi stage-set <stage-name>
```

### notes-generate

Generate AI_NOTES.md for the current development stage.

```bash
alexi notes-generate
```

### dod-check

Run Definition of Done checks for the current project.

```bash
alexi dod-check
```

### dod-list

List all available Definition of Done checks.

```bash
alexi dod-list
```

## Agent Mode

The `alexi agent` command provides fully autonomous task execution with tool access.

### Architecture

```typescript
interface AgenticChatOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  maxIterations?: number;          // Default: 50
  workdir?: string;                // Default: process.cwd()
  enabledTools?: string[];         // Default: all registered tools
  onProgress?: (event: AgenticProgressEvent) => void;
  signal?: AbortSignal;
  gitManager?: AutoCommitManager;
  repoMapManager?: RepoMapManager;
  effort?: EffortLevel;            // low | medium | high | max
  agentId?: string;                // Agent to use
}
```

### Progress Events

The agent emits progress events during execution:

```typescript
interface AgenticProgressEvent {
  type: 'llm_call' | 'tool_start' | 'tool_end' | 'iteration' | 'complete';
  iteration?: number;
  toolName?: string;
  toolId?: string;
  result?: ToolResult;
  message?: string;
}
```

### Result

```typescript
interface AgenticChatResult {
  text: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  modelUsed: string;
  routingReason?: string;
  iterations: number;
  toolCallsExecuted: number;
  toolCallSummary: Array<{
    name: string;
    success: boolean;
    error?: string;
  }>;
}
```

### Effort Levels

| Level | Max Tokens | Behavior |
|-------|-----------|----------|
| `low` | Reduced | Quick responses, fewer iterations |
| `medium` | Standard | Balanced quality/speed |
| `high` | Increased | More thorough, more iterations |
| `max` | Maximum | Best quality, full iteration budget |

## Interactive Mode Commands

The Ink-based TUI provides slash commands for managing sessions, configuration, and interactions.

### General Commands

| Command | Aliases | Description |
|---------|---------|-------------|
| `/help` | `/h` | Show help message with all available commands |
| `/exit` | `/quit`, `/q` | Exit the interactive REPL |
| `/clear` | | Clear the terminal screen |
| `/agent` | | Switch to a different agent (code, debug, plan, explore) |
| `/stage` | | Switch development stage |
| `/dod` | | Run Definition of Done checks |
| `/map` | | Show repository map |
| `/map-refresh` | | Rebuild repository map from scratch |
| `/map-tokens` | | Set token budget for repository map |

### Model Management

| Command | Description | Example |
|---------|-------------|---------|
| `/model <model-id>` | Switch model and save as default | `/model gpt-4o` |
| `/models` | Open interactive model picker | `/models` |
| `/autoroute` | Toggle automatic model routing | `/autoroute` |

### Session Commands

| Command | Description |
|---------|-------------|
| `/session` | Show current session information |
| `/sessions` | List all saved sessions |
| `/history` | Show conversation history |
| `/tokens` | Show token usage statistics |
| `/compact` | Trigger manual context compaction |
| `/context` | Show context usage |
| `/status` | Show current status |
| `/fork` | Fork current session |
| `/rename` | Rename current session |
| `/clear-history` | Clear conversation history |
| `/cost` | Show cost summary |
| `/stats` | Show usage statistics |

### Data Export/Import

| Command | Description | Example |
|---------|-------------|---------|
| `/export [file]` | Export session data to file | `/export ~/backup.json` |
| `/import <file>` | Import data from file | `/import session.json` |

The `/export` command uses the `DataExporter` service to serialize session data to JSON. If no path is provided, it defaults to `~/.alexi/export-<timestamp>.json`.

### Memory Management

| Command | Description |
|---------|-------------|
| `/memory` | List all instruction files |
| `/memory edit project` | Edit project AGENTS.md |
| `/memory edit user` | Edit user ~/.alexi/ALEXI.md |
| `/memory init` | Create AGENTS.md from template |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `/config show` | Show current configuration |
| `/config set <key> <value>` | Set configuration value |
| `/config path` | Show configuration file paths |
| `/permissions` | List/reset permission rules |
| `/mcp` | Manage MCP servers |
| `/think` | Toggle extended thinking mode |
| `/effort <level>` | Set effort level (low/medium/high/max) |
| `/doctor` | Run environment health checks |
| `/theme` | Switch dark/light theme |

### Git Commands

| Command | Description |
|---------|-------------|
| `/diff` | Show files changed in current session |
| `/undo` | Undo last file change |
| `/redo` | Redo last undone change |
| `/commit` | Force commit pending changes |
| `/git <command>` | Run a git command |
| `/git-log` | Show recent AI commits |

### Autocomplete Support

The TUI provides Tab completion for:
- **Slash commands**: Type `/` and press Tab to see suggestions
- **Model names**: After `/model `, Tab completes available models
- **File paths**: After `/export ` or `/import `, Tab completes paths

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `AICORE_SERVICE_KEY` | SAP AI Core service key (JSON format) |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `AICORE_RESOURCE_GROUP` | `"default"` | SAP AI Core resource group |
| `AICORE_MODEL` | `"gpt-4o"` | Default model when none specified |
| `ALEXI_MAX_IMAGE_SIZE_MB` | `20` | Maximum image attachment size (MB) |
| `SAP_PROXY_BASE_URL` | -- | OpenAI-compatible proxy endpoint URL |
| `SAP_PROXY_API_KEY` | -- | Proxy endpoint API key |
| `MORPH_API_KEY` | -- | WarpGrep semantic search API key |
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | -- | Enable background task execution |

### AICORE_SERVICE_KEY Format

```json
{
  "clientid": "your-client-id",
  "clientsecret": "your-client-secret",
  "url": "https://your-auth-url",
  "serviceurls": {
    "AI_API_URL": "https://your-ai-api-url"
  }
}
```

## TypeScript Interfaces

### Core Interfaces

#### CompletionResult

```typescript
interface CompletionResult {
  text: string;
  usage?: TokenUsage;
  toolCalls?: ToolCall[];
  finishReason?: string;
}
```

#### TokenUsage

```typescript
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

#### ToolCall

```typescript
interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;  // JSON-encoded
  };
}
```

#### RoutingDecision

```typescript
interface RoutingDecision {
  modelId: string;
  reason: string;
  confidence: number;   // 0-100
  ruleApplied?: string;
}
```

#### Session

```typescript
interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  totalTokens: number;
  messageCount: number;
  messages: Message[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  tokens?: { input: number; output: number };
}
```

### Compaction Interfaces

```typescript
type CompactionStrategy = 'truncate' | 'summarize' | 'sliding' | 'smart';

interface CompactionOptions {
  strategy: CompactionStrategy;
  preserveRecent?: number;          // Messages to always keep
  preserveSystemPrompt?: boolean;
  customSummaryPrompt?: string;
  overflowTokens?: number;          // Tokens that triggered overflow
}

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

### Hook Interfaces

```typescript
type HookEvent =
  | 'SessionStart' | 'SessionEnd'
  | 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure'
  | 'PermissionRequest' | 'Stop' | 'Error';

interface HookDefinition {
  event: HookEvent;
  type: 'command' | 'http' | 'script';
  command?: string;
  url?: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  script?: string;
  timeout?: number;           // Default: 30000ms
  enabled?: boolean;          // Default: true
  description?: string;
  continueOnBlock?: boolean;  // Feed rejection to model instead of halting
}

interface HookResult {
  success: boolean;
  output?: string;
  error?: string;
  duration: number;
  capped?: boolean;           // Block cap exceeded
  continueOnBlock?: boolean;
}
```

## Tool System

### Tool Definition

Tools are defined using `defineTool` with Zod schema validation:

```typescript
import { defineTool } from '../tool/index.js';
import { z } from 'zod';

const myTool = defineTool({
  name: 'my-tool',
  description: 'Description of what the tool does',
  parameters: z.object({
    param1: z.string().describe('Parameter description'),
    param2: z.number().optional(),
  }),
  permission: {
    action: 'write',
    getResource: (params, context) => {
      return path.join(context?.workdir || process.cwd(), params.filePath);
    },
  },
  async execute(params, context) {
    return {
      success: true,
      data: { /* result */ },
    };
  },
});
```

### ToolContext

```typescript
interface ToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  gitManager?: AutoCommitManager;
}
```

### ToolResult

```typescript
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
  metadata?: Record<string, unknown>;
}
```

### Tool Registry API

```typescript
import {
  registerTool,
  registerDynamicTool,
  unregisterDynamicTool,
  getTool,
  getAllToolSchemas,
  getToolRegistry,
} from './tool/index.js';

// Register a custom tool
registerTool(myTool);

// Register/unregister dynamic tools (e.g., from MCP)
registerDynamicTool(mcpTool);
unregisterDynamicTool('mcp-tool-name');

// Get a tool by name
const tool = getTool('read');

// Get all tool schemas for LLM function calling
const schemas = getAllToolSchemas();
```

### Output Truncation

Large tool outputs are automatically truncated:

```typescript
// Constants
const MAX_LINES = 2000;
const MAX_BYTES = 51200;

// Functions
truncateOutput(output: string): { content: string; truncated: boolean }
persistLargeOutput(output: string, toolName: string): string  // saves to temp file
cleanupToolOutputs(): void
```

### Built-in Tools

| Tool | Parameters | Description |
|------|-----------|-------------|
| `read` | `filePath`, `offset?`, `limit?` | Read file/directory contents |
| `write` | `filePath`, `content` | Write/create files |
| `edit` | `filePath`, `oldString`, `newString`, `replaceAll?` | Exact string replacement |
| `glob` | `pattern`, `path?` | Find files by glob pattern |
| `grep` | `pattern`, `path?`, `include?` | Search file contents by regex |
| `bash` | `command`, `description?`, `timeout?`, `workdir?` | Execute shell commands |
| `task` | `prompt`, `description`, `subagent_type`, `task_id?`, `background?` | Launch sub-agent |
| `task_status` | `taskId` | Query background task status |
| `webfetch` | `url`, `format?`, `timeout?` | Fetch web content |
| `question` | `question`, `options?` | Ask user a question |
| `todowrite` | `todos` | Manage task list |
| `codebase_search` | `query` | AI-powered semantic code search (WarpGrep) |

## Permission System

### Permission Actions

```typescript
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
```

### Permission Rule

```typescript
interface PermissionRule {
  id?: string;
  name?: string;
  description?: string;
  tools?: string[];              // Tool name patterns
  actions?: PermissionAction[];
  paths?: string[];              // File path patterns (glob)
  commands?: string[];           // Command patterns
  hosts?: string[];              // Network host patterns
  decision: PermissionDecision;  // 'allow' | 'deny' | 'ask'
  priority: number;              // Higher = evaluated later (last-match-wins)
  externalPaths?: boolean;
  homeExpansion?: boolean;
}
```

### Agentic Permission Configuration

In agent mode, high-priority rules are automatically added:

```typescript
// Allow writes in workdir (priority 200)
{
  id: 'agentic-allow-write',
  actions: ['write'],
  paths: [`${workdir}/**`, workdir],
  decision: 'allow',
  priority: 200,
}

// Allow execute operations (priority 200)
{
  id: 'agentic-allow-execute',
  actions: ['execute'],
  decision: 'allow',
  priority: 200,
}
```

These override the default `ask-write` rule (priority 10) and `deny-secrets` rule (priority 100).

## Usage Examples

### Programmatic Agentic Chat

```typescript
import { agenticChat } from './core/agenticChat.js';

const result = await agenticChat('Write unit tests for the auth module', {
  autoRoute: true,
  maxIterations: 20,
  workdir: '/path/to/project',
  effort: 'high',
  onProgress: (event) => {
    if (event.type === 'tool_end') {
      console.log(`Tool ${event.toolName}: ${event.result?.success}`);
    }
  },
});

console.log(`Model: ${result.modelUsed}`);
console.log(`Iterations: ${result.iterations}`);
console.log(`Tool calls: ${result.toolCallsExecuted}`);
console.log(result.text);
```

### Custom Tool Registration

```typescript
import { registerTool, defineTool } from './tool/index.js';
import { z } from 'zod';

const customTool = defineTool({
  name: 'deploy',
  description: 'Deploy the application to a target environment',
  parameters: z.object({
    environment: z.enum(['staging', 'production']).describe('Target environment'),
    version: z.string().optional().describe('Version tag to deploy'),
  }),
  permission: {
    action: 'execute',
    getResource: (params) => `deploy:${params.environment}`,
  },
  async execute(params, context) {
    // Implementation
    return { success: true, data: { deployed: true, env: params.environment } };
  },
});

registerTool(customTool);
```

## CLI Utilities

### Clipboard (`src/cli/utils/clipboard.ts`)

Cross-platform clipboard text copying with fallback support for environments where the Clipboard API is unavailable.

```typescript
import { copyToClipboard } from './cli/utils/clipboard.js';

const success = await copyToClipboard('text to copy');
// Returns true if copy succeeded, false otherwise
```

The utility first attempts the modern `navigator.clipboard.writeText()` API, then falls back to `document.execCommand('copy')` with a hidden textarea element. This module uses browser globals (`navigator`, `document`) guarded by `typeof` checks and includes ESLint `no-undef` suppression after the module-level JSDoc comment.

## Error Handling

All CLI commands handle errors gracefully:

- Exit code `0`: Success
- Exit code `1`: Error (with error message)

TypeScript APIs use the `ToolResult` pattern:

```typescript
try {
  const result = await agenticChat(message, options);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
}
```

## Logging

```typescript
import { logger } from './utils/index.js';

logger.setLevel('debug');
logger.debug('Debug message', { context: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
logger.print('Raw output');  // Always outputs, for CLI display
```

| Level | Priority | Output |
|-------|----------|--------|
| `debug` | 0 | `[DEBUG] message` |
| `info` | 1 | `message` (no prefix) |
| `warn` | 2 | `[WARN] message` |
| `error` | 3 | `[ERROR] message` |
