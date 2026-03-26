# Alexi API Documentation

This document provides comprehensive API documentation for Alexi's CLI commands, configuration options, and TypeScript interfaces.

## Table of Contents

- [CLI Commands](#cli-commands)
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

### agent

Run agentic chat with tool execution for automated workflows.

```bash
alexi agent -m <message> [options]
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `-m, --message <text>` | string | Message to send (required) |
| `--model <id>` | string | Override model selection |
| `--auto-route` | boolean | Enable automatic model routing |
| `--prefer-cheap` | boolean | Prefer cheaper models when auto-routing |
| `--session <id>` | string | Continue existing session |
| `--system <prompt>` | string | System prompt for conversation |
| `--max-iterations <n>` | number | Maximum tool execution iterations (default: 50) |
| `--workdir <path>` | string | Working directory for file operations (default: cwd) |

#### Examples

```bash
# Run agentic task with auto-routing
alexi agent -m "Refactor the authentication module" --auto-route

# Run with specific model
alexi agent -m "Fix the failing tests" --model anthropic--claude-4-sonnet

# Run with custom iteration limit
alexi agent -m "Implement the new feature" --max-iterations 100
```

### Agent Management API

Alexi provides TypeScript APIs for managing agents programmatically.

#### Agent Types

```typescript
interface AgentConfig {
  id: string;
  name: string;
  displayName?: string;        // Human-readable name for org modes
  description: string;
  mode: 'primary' | 'subagent' | 'all';
  systemPrompt: string;
  tools?: string[];            // Tool IDs this agent can use
  disabledTools?: string[];    // Explicitly disabled tools
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
  aliases?: string[];          // Aliases for @syntax switching
  options?: Record<string, unknown>; // Organization mode metadata
}

interface Agent extends AgentConfig {
  canUseTool(toolId: string): boolean;
}
```

#### Agent Registry Functions

```typescript
import { 
  getAgentRegistry, 
  getCurrentAgent, 
  switchAgent,
  removeAgent,
  parseAgentSwitch,
  parseAgentMention
} from './agent/index.js';

// Get the global agent registry
const registry = getAgentRegistry();

// Register a new agent
const agent = registry.register({
  id: 'custom-agent',
  name: 'Custom Agent',
  description: 'My custom agent',
  mode: 'all',
  systemPrompt: 'You are a helpful assistant...',
  aliases: ['custom', 'ca']
});

// Get current agent
const current = getCurrentAgent();
console.log(current.id); // 'code'

// Switch to different agent
const switched = switchAgent('debug', 'User requested debug mode');
if (switched) {
  console.log(`Switched to ${switched.name}`);
}

// Remove an agent (protected for built-in and org agents)
try {
  removeAgent('custom-agent'); // OK
  removeAgent('code');         // Error: Cannot remove built-in agent
  removeAgent('org-mode');     // Error: Cannot remove organization agent
} catch (error) {
  console.error(error.message);
}

// Parse @syntax from message
const result = parseAgentSwitch('@debug fix the bug');
// { message: 'fix the bug', switched: true, agent: {...} }

// Parse @mention without switching
const mention = parseAgentMention('@plan analyze the code');
// { agentId: 'plan', cleanMessage: 'analyze the code' }
```

#### Organization-Managed Agents

Organization-managed agents are synced from cloud configuration and protected from local removal:

```typescript
import { migrateOrgModes, isOrgManagedMode } from './config/modes-migrator.js';

// Sync organization modes
const orgModes = [
  {
    name: 'team-mode',
    displayName: 'Team Collaboration Mode',
    description: 'Optimized for team workflows',
    options: { priority: 'high' }
  }
];

await migrateOrgModes(orgModes);

// Check if agent is organization-managed
const agent = getCurrentAgent();
if (isOrgManagedMode(agent)) {
  console.log('This agent is managed by your organization');
}
```

Organization agents have:
- `options.source === 'organization'` metadata
- Protection from local removal
- Automatic displayName population from options
- Dashboard-only management

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

## Interactive Mode Commands

The interactive REPL provides slash commands for managing sessions, configuration, and AI interactions.

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
| `/model <model-id>` | Switch to a different model and save as default | `/model gpt-4o` |
| `/models` | Open interactive model picker | `/models` |
| `/autoroute` | Toggle automatic model routing | `/autoroute` |

**Note**: When you switch models with `/model`, the selection is persisted to `~/.alexi/config.json` as your default model.

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

### Memory Management

#### Instruction Files (/memory)

Manage instruction files that provide context to AI agents.

```bash
# List all instruction files
/memory

# Edit project instructions (AGENTS.md)
/memory edit project

# Edit user instructions (~/.alexi/ALEXI.md)
/memory edit user

# Create AGENTS.md from template
/memory init
```

**Instruction File Hierarchy**:
1. Project AGENTS.md (./AGENTS.md)
2. User ALEXI.md (~/.alexi/ALEXI.md)
3. Project rules (.alexi/rules/*.md)

#### Memories (/mem)

Manage short-term memories with tagging support.

```bash
# List all memories
/mem

# Search memories by text or tag
/mem search <query>

# Delete a memory by ID
/mem delete <id>

# Clear all memories
/mem clear

# Show memory statistics
/mem stats

# Export memories to JSON
/mem export
```

### Remember Command

Save information to memory with optional tags.

```bash
/remember <text> [#tag1 #tag2]

# Example
/remember The API endpoint is /v1/chat/completions #api #endpoint
```

### Configuration Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/system <prompt>` | Set system prompt | `/system You are a helpful assistant` |
| `/config show` | Show current configuration | `/config show` |
| `/config set <key> <value>` | Set configuration value | `/config set soundEnabled true` |
| `/config path` | Show configuration file paths | `/config path` |
| `/permissions` | List/reset permission rules | `/permissions` |
| `/mcp` | Manage MCP servers | `/mcp` |
| `/think` | Toggle extended thinking mode | `/think` |
| `/effort <level>` | Set effort level (low/medium/high/max) | `/effort high` |
| `/doctor` | Run environment health checks | `/doctor` |

### Git Commands

| Command | Description |
|---------|-------------|
| `/diff` | Show files changed in current session |
| `/undo` | Undo last file change |
| `/redo` | Redo last undone change |
| `/commit` | Force commit pending changes |
| `/git <command>` | Run a git command |
| `/git-log` | Show recent AI commits |

### Data Export/Import

| Command | Description | Example |
|---------|-------------|---------|
| `/export <file>` | Export data to file | `/export session.json` |
| `/import <file>` | Import data from file | `/import session.json` |

### Autocomplete Support

The interactive REPL provides Tab completion for:
- **Slash commands**: Type `/` and press Tab to see available commands
- **Model names**: After `/model `, press Tab to see available models
- **File paths**: After `/export ` or `/import `, press Tab for file completion

```bash
# Autocomplete slash commands
/mod<Tab>  → /model

# Autocomplete model names
/model gpt<Tab>  → /model gpt-4o

# Autocomplete file paths
/export session<Tab>  → /export session.json
```

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

### Core Interfaces

#### UserConfig

User configuration stored in ~/.alexi/config.json

```typescript
interface UserConfig {
  defaultModel?: string;          // Persistent default model
  soundEnabled?: boolean;         // Enable notification sounds
  autoRoute?: boolean;            // Auto-routing preference
  [key: string]: unknown;         // Extensible for custom settings
}

// User configuration API
import {
  loadFullConfig,
  saveFullConfig,
  getConfigValue,
  setConfigValue,
  getConfigDefaultModel,
  setConfigDefaultModel
} from './config/userConfig.js';

// Load entire config
const config = loadFullConfig();

// Get specific value
const defaultModel = getConfigDefaultModel();

// Set and persist value
setConfigDefaultModel('claude-4-sonnet');

// Generic key access
setConfigValue('soundEnabled', true);
const soundEnabled = getConfigValue('soundEnabled');
```

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

#### codebase_search (WarpGrep)

AI-powered semantic code search using WarpGrep.

```typescript
{
  name: 'codebase_search',
  parameters: {
    query: string; // Descriptive search query
  }
}
```

**Requirements**: Install `@morphllm/morphsdk` as optional dependency
**Configuration**: Set `MORPH_API_KEY` environment variable (optional during free period)

**Example**:
```bash
# Search for authentication logic
codebase_search("Find the authentication middleware that validates JWT tokens")

# Find error handling patterns
codebase_search("Show me how errors are handled in API routes")
```

**Result Format**:
```typescript
interface CodeSpan {
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

interface WarpGrepResult {
  spans: CodeSpan[];
  query: string;
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

### Error Backoff System

The error backoff system provides resilient API error handling with circuit breaker pattern and exponential backoff.

#### ErrorBackoff Class

```typescript
import { ErrorBackoff, extractStatusCode } from './core/error-backoff.js';

interface BackoffConfig {
  initialDelayMs: number;  // Default: 1000ms
  maxDelayMs: number;      // Default: 60000ms
  multiplier: number;      // Default: 2
  maxRetries: number;      // Default: 5
}

class ErrorBackoff {
  constructor(config?: Partial<BackoffConfig>);
  
  // Record an error occurrence
  recordError(statusCode?: number): void;
  
  // Record a successful operation (resets backoff)
  recordSuccess(): void;
  
  // Reset all state
  reset(): void;
  
  // Check if currently in backoff period
  shouldBackoff(): boolean;
  
  // Get remaining backoff time in milliseconds
  getRemainingBackoffMs(): number;
  
  // Check if error is fatal (4xx client error)
  isFatal(): boolean;
  
  // Get consecutive error count
  getConsecutiveErrors(): number;
}

// Extract status code from error messages
function extractStatusCode(errorMessage: string): number | undefined;
```

#### Usage Example

```typescript
const backoff = new ErrorBackoff({
  initialDelayMs: 1000,
  maxDelayMs: 60000,
  multiplier: 2,
  maxRetries: 5
});

async function retryableOperation() {
  while (true) {
    // Check if we should wait before retrying
    if (backoff.shouldBackoff()) {
      const delay = backoff.getRemainingBackoffMs();
      console.log(`Backing off for ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      continue;
    }
    
    // Check if we've hit a fatal error
    if (backoff.isFatal()) {
      throw new Error('Fatal error - cannot retry');
    }
    
    try {
      const result = await apiCall();
      backoff.recordSuccess(); // Reset on success
      return result;
    } catch (error) {
      const statusCode = extractStatusCode(error.message);
      backoff.recordError(statusCode);
      
      // Check if max retries exceeded
      if (backoff.getConsecutiveErrors() >= 5) {
        throw new Error('Max retries exceeded');
      }
    }
  }
}
```

#### Backoff Behavior

The backoff delay grows exponentially with each consecutive error:

| Error Count | Delay (ms) | Calculation |
|-------------|------------|-------------|
| 1 | 1000 | 1000 * 2^0 |
| 2 | 2000 | 1000 * 2^1 |
| 3 | 4000 | 1000 * 2^2 |
| 4 | 8000 | 1000 * 2^3 |
| 5 | 16000 | 1000 * 2^4 |
| 6+ | 60000 | Capped at maxDelayMs |

Fatal errors (4xx status codes) set the `isFatal()` flag and should not be retried.

### Permission Drain System

The permission drain system automatically resolves pending permissions when new rules are approved or denied.

#### Permission Drain API

```typescript
import { drainCovered } from './permission/drain.js';
import { matchesPattern, evaluatePatternRules } from './permission/next.js';

// Auto-resolve pending permissions
await drainCovered(
  pending,      // Record<string, PendingRequest>
  approved,     // Array<{ permission, pattern, action }>
  evaluate,     // Evaluation function
  events,       // Event bus configuration
  DeniedError,  // Error constructor for denials
  exclude       // Optional: request ID to exclude
);

// Pattern matching utilities
function matchesPattern(pattern: string, targetPath: string): boolean;

function evaluatePatternRules(
  rules: Array<{ pattern: string; action: 'allow' | 'deny' }>,
  targetPath: string
): 'allow' | 'deny' | undefined;
```

#### Permission Next Utilities

```typescript
import { PermissionNext } from './permission/next.js';

// Convert permission config to ruleset
const ruleset = PermissionNext.fromConfig({
  'file:write': {
    'src/**': 'allow',
    '*.test.ts': 'deny'
  },
  'bash': 'ask'
});

// Convert ruleset to config
const config = PermissionNext.toConfig(ruleset);

// Evaluate permission
const result = PermissionNext.evaluate(
  'file:write',           // Permission type
  'src/core/file.ts',     // Pattern to check
  localRuleset,           // Local rules
  approvedRules           // Approved rules (higher priority)
);
// result.action: 'allow' | 'deny' | 'ask'

// Pattern matching
matchesPattern('*.md', 'README.md');           // true
matchesPattern('src/**', 'src/core/file.ts'); // true
matchesPattern('/project/*', '/project/file'); // true

// Rule evaluation
evaluatePatternRules([
  { pattern: 'src/**', action: 'allow' },
  { pattern: '*.test.ts', action: 'deny' }
], 'src/core/file.ts'); // 'allow'
```

#### Pending Request Structure

```typescript
interface PendingRequest {
  info: {
    id: string;
    sessionID: string;
    permission: string;
    patterns: string[];
  };
  ruleset: Ruleset;
  resolve: () => void;
  reject: (error: any) => void;
}

type Ruleset = Array<{
  permission: string;
  pattern: string;
  action: 'allow' | 'deny' | 'ask';
}>;
```

#### Usage Example

```typescript
// Pending permissions map
const pending: Record<string, PendingRequest> = {
  'req-1': {
    info: {
      id: 'req-1',
      sessionID: 'session-1',
      permission: 'file:write',
      patterns: ['/project/src/*']
    },
    ruleset: [],
    resolve: () => console.log('Approved'),
    reject: (err) => console.error('Denied:', err)
  }
};

// User approves a new rule
const approved = [
  { permission: 'file:write', pattern: '/project/*', action: 'allow' }
];

// Drain covered permissions
await drainCovered(
  pending,
  approved,
  PermissionNext.evaluate,
  PermissionNext.Event,
  PermissionNext.DeniedError
);

// req-1 is automatically approved and removed from pending
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
