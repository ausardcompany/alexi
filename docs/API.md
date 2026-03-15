# Alexi API Documentation

This document provides comprehensive API documentation for Alexi's CLI commands, configuration options, and TypeScript interfaces.

## Table of Contents

- [CLI Commands](#cli-commands)
- [Environment Variables](#environment-variables)
- [TypeScript Interfaces](#typescript-interfaces)
- [Tool System](#tool-system)
- [Permission System](#permission-system)

## CLI Commands

### interactive

Launch the terminal user interface for interactive chat sessions.

```bash
alexi interactive [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--model <id>` | string | Model to use (e.g., gpt-4o, claude-4.5-sonnet) |
| `--auto-route` | boolean | Enable automatic model routing |
| `--prefer-cheap` | boolean | Prefer cheaper models when auto-routing |
| `--session <id>` | string | Resume existing session |
| `--system <prompt>` | string | Custom system prompt |

#### Features

The TUI provides:
- Full-screen terminal interface with Header, MessageArea, InputBox, and StatusBar
- Real-time streaming message display with markdown rendering
- Interactive dialogs for model picker, agent selector, and session list
- Command palette with fuzzy search (Ctrl+P)
- Image attachment support via clipboard paste
- Keyboard shortcuts:
  - Tab: Cycle through agents
  - Ctrl+X: Enter leader mode
  - Ctrl+P: Open command palette
  - Ctrl+M: Open model picker
  - Ctrl+A: Open agent selector
  - Ctrl+S: Open session list
  - Ctrl+C: Cancel streaming response
  - Ctrl+D: Exit application

#### TUI Layout

```
┌─────────────────────────────────────────────────────────┐
│ Model: gpt-4o | Agent: code | Session: abc123          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ User: Write a function to reverse a string      │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Assistant (code): Here's a function...          │   │
│ │ ```typescript                                    │   │
│ │ function reverse(s: string): string {           │   │
│ │   return s.split('').reverse().join('');        │   │
│ │ }                                                │   │
│ │ ```                                              │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ > Type your message...                                  │
├─────────────────────────────────────────────────────────┤
│ Tab: agent · Ctrl+X: leader · /help | Cost: $0.05      │
└─────────────────────────────────────────────────────────┘
```

#### Examples

```bash
# Launch TUI with default settings
alexi interactive

# Launch with specific model
alexi interactive --model gpt-4o

# Launch with auto-routing
alexi interactive --auto-route --prefer-cheap

# Resume previous session
alexi interactive --session abc-123-def
```

### agent

Switch or list agents in the current session.

```bash
alexi agent [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--list` | boolean | List all available agents |
| `--switch <name>` | string | Switch to specified agent |
| `--current` | boolean | Show current agent |

#### Built-in Agents

| Agent | Alias | Description |
|-------|-------|-------------|
| code | c | Coding specialist - writes and refactors code |
| debug | d | Debugging expert - analyzes and fixes bugs |
| plan | p | Planning strategist - creates task plans |
| explore | e | Codebase explorer - navigates and explains code |
| orchestrator | o | Task coordinator - manages complex workflows |

#### Examples

```bash
# List all agents
alexi agent --list

# Switch to debug agent
alexi agent --switch debug

# Show current agent
alexi agent --current
```

### chat

Send messages to LLMs with optional auto-routing and session management.

```bash
alexi chat -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to send (required) |
| `--model <id>` | string | Override model selection (e.g., gpt-4o, claude-4-sonnet) |
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

### models

List available models/deployments from SAP AI Core.

```bash
alexi models [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-j, --json` | boolean | Output as JSON |
| `-s, --status <status>` | string | Filter by status (RUNNING, PENDING, STOPPED, etc.) |
| `--scenario <scenario>` | string | Filter by scenario ID |
| `-g, --resource-group <group>` | string | AI Core resource group (default: "default") |
| `--proxy` | boolean | Use proxy endpoint instead of direct AI Core API |

#### Examples

```bash
# List all deployments
alexi models

# Filter by status
alexi models --status RUNNING

# Filter by scenario
alexi models --scenario foundation-models

# Output as JSON
alexi models --json

# Use specific resource group
alexi models --resource-group production

# Use proxy endpoint
alexi models --proxy
```

#### Output Format

The models command displays a formatted table with the following columns:

- **ID**: Deployment ID (UUID)
- **Configuration**: Configuration name
- **Scenario**: Scenario ID
- **Status**: Current status (color-coded)
  - Green: RUNNING
  - Yellow: PENDING, STARTING
  - Red: STOPPED, DEAD, UNKNOWN
- **Created**: Creation timestamp

For RUNNING deployments, the deployment URL is displayed below the row.

#### TypeScript Interface

```typescript
interface DeploymentInfo {
  id: string;
  configurationId: string;
  configurationName: string;
  scenarioId: string | undefined;
  status: string;
  targetStatus: string;
  statusMessage?: string;
  deploymentUrl?: string;
  createdAt: string;
  modifiedAt: string;
}
```

### explain

Analyze and explain routing decisions without executing the request.

```bash
alexi explain -m <message>
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to analyze (required) |

#### Example Output

```
=== Prompt Analysis ===
Type: deep-reasoning
Complexity: complex
Requires Reasoning: true
Estimated Tokens: 19

=== Matched Rules ===
• reasoning-for-math (priority: 80): Use reasoning models for math problems

=== Model Candidates (by score) ===
✓ gpt-4.1              Score: 120 - expensive tier, strong at deep-reasoning, has reasoning
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

Displays a table of all sessions with:
- Session ID
- Title (auto-generated from first message)
- Message count
- Model used
- Creation date

### session-export

Export a session to markdown format.

```bash
alexi session-export -s <session-id> [-o output.md]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-s, --session <id>` | string | Session ID to export (required) |
| `-o, --output <file>` | string | Output file path (default: stdout) |

### session-delete

Delete a session.

```bash
alexi session-delete -s <session-id>
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-s, --session <id>` | string | Session ID to delete (required) |

## Environment Variables

### Required Variables

#### AICORE_SERVICE_KEY

SAP AI Core service key in JSON format. Contains authentication credentials for SAP AI Core.

```bash
AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
```

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

## TypeScript Interfaces

### TUI Components

#### AppProps

Root TUI component props.

```typescript
interface AppProps {
  model: string;
  autoRoute: boolean;
  sessionId?: string;
  preferCheap?: boolean;
  systemPrompt?: string;
  gitManager?: AutoCommitManager;
  repoMapManager?: RepoMapManager;
}
```

#### MessageDisplay

Message display structure for TUI.

```typescript
interface MessageDisplay {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  agent?: string;
  toolCalls?: ToolCallDisplay[];
  attachments?: ImageAttachmentPreview[];
}

interface ToolCallDisplay {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
  error?: string;
}
```

### Multimodal Support

#### ImageAttachment

Image attachment structure.

```typescript
interface ImageAttachment {
  id: string;
  data: string; // Base64 encoded
  mediaType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp';
  size: number; // Bytes
  width?: number;
  height?: number;
  filename?: string;
}

interface ImageAttachmentPreview {
  id: string;
  mediaType: string;
  size: number;
  dimensions?: { width: number; height: number };
  thumbnail?: string; // Base64 preview
}
```

#### MultimodalContent

Multimodal message content.

```typescript
interface TextContentItem {
  type: 'text';
  text: string;
}

interface ImageContentItem {
  type: 'image';
  source: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

type MultimodalContentItem = TextContentItem | ImageContentItem;

interface MultimodalUserMessage {
  role: 'user';
  content: MultimodalContentItem[];
}
```

#### ClipboardImageReader

Clipboard image detection interface.

```typescript
type ClipboardTool = 'pngpaste' | 'xclip' | 'wl-paste' | 'powershell';

interface ClipboardCapability {
  tool: ClipboardTool;
  available: boolean;
  platform: 'darwin' | 'linux' | 'win32';
}

type ClipboardImageResult =
  | { success: true; data: Buffer; format: ImageFormat }
  | { success: false; error: string };

interface ClipboardImageReader {
  detect(): Promise<ClipboardCapability[]>;
  read(): Promise<ClipboardImageResult>;
}
```

### Agent System

#### AgentConfig

Agent configuration and metadata.

```typescript
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  aliases?: string[];
  mode: 'primary' | 'subagent' | 'all';
  prompt?: string;
}

interface Agent extends AgentConfig {
  switchTo(reason?: string): void;
}
```

#### AssembleOptions

System prompt assembly options.

```typescript
interface AssembleOptions {
  modelId?: string;
  agentId?: string;
  workdir?: string;
  customRules?: string;
}
```

### Repository Context

#### RepoMapOptions

Repository map generation options.

```typescript
interface RepoMapOptions {
  workdir: string;
  tokenBudget?: number; // Default: 2000
  includePatterns?: string[];
  excludePatterns?: string[];
}

interface FileSymbol {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'export';
  line: number;
  signature?: string;
}

interface FileEntry {
  path: string;
  relativePath: string;
  rank: number;
  symbols: FileSymbol[];
  summary: string;
}
```

### Core Interfaces

#### CompletionResult

Result from LLM completion request.

```typescript
interface CompletionResult {
  text: string;
  usage?: TokenUsage;
  toolCalls?: ToolCall[];
  finishReason?: string;
}
```

#### TokenUsage

Token usage statistics for a request.

```typescript
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

#### ToolCall

Tool call request from LLM.

```typescript
interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}
```

### Agentic Chat Interfaces

#### AgenticChatOptions

Configuration options for agentic chat execution.

```typescript
interface AgenticChatOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  maxIterations?: number; // Default: 50
  workdir?: string; // Default: process.cwd()
  enabledTools?: string[]; // Default: all registered tools
  onProgress?: (event: AgenticProgressEvent) => void;
  signal?: AbortSignal;
}
```

#### AgenticChatResult

Result from agentic chat execution.

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

#### AgenticProgressEvent

Progress event emitted during agentic execution.

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

## Tool System

### Tool Definition

Tools are defined using the `defineTool` function with Zod schema validation.

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
      // Resolve resource path with context
      return path.join(context?.workdir || process.cwd(), params.filePath);
    },
  },
  async execute(params, context) {
    // Tool implementation
    return {
      success: true,
      data: { /* result data */ },
    };
  },
});
```

### ToolContext

Context provided to tool execution.

```typescript
interface ToolContext {
  workdir: string; // Working directory
  signal?: AbortSignal; // Cancellation signal
  sessionId?: string; // Current session ID
}
```

### ToolDefinition

Tool definition with permission support and context-aware resource resolution.

```typescript
interface ToolDefinition<TParams extends z.ZodType, TResult> {
  name: string;
  description: string;
  parameters: TParams;
  // Permission requirements
  permission?: {
    action: PermissionAction;
    // getResource can optionally receive context to resolve relative paths
    getResource: (params: z.infer<TParams>, context?: ToolContext) => string;
  };
  // Execution function
  execute: (params: z.infer<TParams>, context: ToolContext) => Promise<ToolResult<TResult>>;
}
```

### ToolResult

Result returned from tool execution.

```typescript
interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  truncated?: boolean;
  hint?: string;
}
```

### Built-in Tools

#### read

Read files and directories.

```typescript
{
  name: 'read',
  parameters: {
    filePath: string; // Path to read
    limit?: number;   // Max lines to return (default: 2000)
    offset?: number;  // Line offset to start from
  }
}
```

#### write

Write or create files.

```typescript
{
  name: 'write',
  parameters: {
    filePath: string; // Path to write
    content: string;  // Content to write
  }
}
```

#### edit

Perform exact string replacements in files.

```typescript
{
  name: 'edit',
  parameters: {
    filePath: string;    // Path to file
    oldString: string;   // Text to replace
    newString: string;   // Replacement text
    replaceAll?: boolean; // Replace all occurrences (default: false)
  }
}
```

#### glob

Find files matching a pattern.

```typescript
{
  name: 'glob',
  parameters: {
    pattern: string; // Glob pattern (e.g., "**/*.ts")
    path?: string;   // Base path to search from
  }
}
```

#### grep

Search file contents using regex.

```typescript
{
  name: 'grep',
  parameters: {
    pattern: string;  // Regular expression pattern
    path?: string;    // Base path to search from
    include?: string; // File pattern filter (e.g., "*.js")
  }
}
```

#### bash

Execute shell commands.

```typescript
{
  name: 'bash',
  parameters: {
    command: string; // Shell command to execute
  }
}
```

## Permission System

### Permission Actions

```typescript
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
```

### Permission Decisions

```typescript
type PermissionDecision = 'allow' | 'deny' | 'ask';
```

### Permission Rule

```typescript
interface PermissionRule {
  id?: string;
  name?: string;
  description?: string;
  // Matching criteria
  tools?: string[];    // Tool name patterns
  actions?: PermissionAction[];
  paths?: string[];    // File path patterns
  commands?: string[]; // Command patterns
  hosts?: string[];    // Network host patterns
  // Decision
  decision: PermissionDecision;
  // Priority (higher = evaluated later in last-match-wins)
  priority: number; // Default: 0
  // Enhanced options
  externalPaths?: boolean; // Whether rule applies to external paths
  homeExpansion?: boolean; // Expand ~/ to home directory in paths
}
```

### Permission Context

```typescript
interface PermissionContext {
  toolName: string;
  action: PermissionAction;
  resource: string; // Path, command, URL, etc.
  description?: string;
}
```

### Agentic Permission Configuration

In agentic mode, the permission system is automatically configured with high-priority allow rules:

```typescript
// Allow writes in workdir (priority 200)
{
  id: 'agentic-allow-write',
  name: 'Agentic Write Allow',
  description: 'Allow writing files in workdir for agentic mode',
  actions: ['write'],
  paths: [`${workdir}/**`, workdir],
  decision: 'allow',
  priority: 200,
}

// Allow execute operations (priority 200)
{
  id: 'agentic-allow-execute',
  name: 'Agentic Execute Allow',
  description: 'Allow executing commands for agentic mode',
  actions: ['execute'],
  decision: 'allow',
  priority: 200,
}
```

These rules override the default `ask-write` rule (priority 10) and `deny-secrets` rule (priority 100).

## Usage Examples

### Basic Chat with Auto-Routing

```typescript
import { agenticChat } from './core/agenticChat.js';

const result = await agenticChat('Write a function to sort an array', {
  autoRoute: true,
  preferCheap: true,
  maxIterations: 10,
  workdir: '/path/to/project',
});

console.log(result.text);
console.log(`Model: ${result.modelUsed}`);
console.log(`Iterations: ${result.iterations}`);
console.log(`Tool calls: ${result.toolCallsExecuted}`);
```

### List Deployments Programmatically

```typescript
import { DeploymentApi } from '@sap-ai-sdk/ai-api';

const response = await DeploymentApi.deploymentQuery(
  {},
  { 'AI-Resource-Group': 'default' }
).execute();

const deployments = response.resources || [];
const running = deployments.filter(d => d.status === 'RUNNING');

console.log(`Found ${running.length} running deployments`);
```

### Custom Tool Registration

```typescript
import { registerTool, defineTool } from './tool/index.js';
import { z } from 'zod';

const customTool = defineTool({
  name: 'custom-tool',
  description: 'My custom tool',
  parameters: z.object({
    input: z.string(),
  }),
  async execute(params, context) {
    // Implementation
    return { success: true, data: 'result' };
  },
});

registerTool(customTool);
```

## Error Handling

All CLI commands handle errors gracefully and exit with appropriate exit codes:

- `0`: Success
- `1`: Error (with error message displayed)

TypeScript APIs throw errors that should be caught and handled by the caller:

```typescript
try {
  const result = await agenticChat(message, options);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  }
  // Handle error
}
```

## Streaming Support

Alexi supports streaming responses for real-time output. See the streaming orchestrator documentation for details on implementing streaming in custom integrations.

## Logging Utility

Alexi provides a centralized logging utility for consistent logging across the application.

### Logger Interface

```typescript
interface Logger {
  setLevel(level: LogLevel): void;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  print(message: string): void;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
```

### Usage

```typescript
import { logger } from './utils/index.js';

// Set log level
logger.setLevel('debug');

// Log messages
logger.debug('Debugging information', { context: 'value' });
logger.info('Operation completed successfully');
logger.warn('Potential issue detected');
logger.error('Operation failed', error);

// Print raw output (for CLI)
logger.print('Output without formatting');
```

### Log Level Behavior

The logger filters messages based on the configured level:

| Current Level | Messages Shown |
|---------------|----------------|
| `debug` | debug, info, warn, error |
| `info` (default) | info, warn, error |
| `warn` | warn, error |
| `error` | error only |

The `print` method always outputs regardless of log level and is intended for CLI output that should not be filtered.
