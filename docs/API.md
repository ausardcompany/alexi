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
| `--yolo` | boolean | Grant every permission request without prompting (see "Headless permission handling" below) |
| `--dangerously-skip-permissions` | boolean | Alias of `--yolo`; explicit opt-in for CI / non-interactive runs |

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

#### Headless permission handling (1.21.4)

The non-interactive `agent` command subscribes to `PermissionRequested` on the event bus and publishes a `PermissionResponse` for every request — `granted: true` when `--yolo` (or `--dangerously-skip-permissions`) was passed, `granted: false` otherwise. Without this, a `PermissionRequested` event from a subagent (spawned via the `task` tool) has no listener in headless mode and the agent loop hangs waiting for a response that never arrives. The subscription is unsubscribed on `process.exit` so it does not leak into subsequent invocations under tests. Reference: opencode `08faeb3`.

A `subagentSessionIds: Set<string>` is populated (currently empty — the `task` tool does not yet spawn distinct sessions, so the wiring is reserved for a future real-subagent implementation that will gate the auto-response on sessionId membership without a second refactor).

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

#### Dynamic model catalog

Since v1.22.4, the interactive TUI and the `/model` slash command consult a **live catalog** maintained by `src/providers/modelCatalog.ts`. The catalog is refreshed at startup and every 5 minutes; live models show a `●` prefix in the picker, static-only models show `○`. The status bar shows `● N live`, `⟳` (loading), or `○ offline` depending on the catalog state. Set `AICORE_SERVICE_KEY` and `AICORE_RESOURCE_GROUP` for the catalog to succeed; without credentials it falls back silently to the static list embedded in `ORCHESTRATION_MODELS`.

Programmatic access:

```typescript
import {
  getAvailableModels,
  getLiveModels,
  getCatalogStatus,
  isAvailableModel,
} from 'alexi/providers/modelCatalog.js';

if (getCatalogStatus() === 'ready') {
  console.log('Live deployments:', getLiveModels());
}
if (!isAvailableModel(userInput)) {
  throw new Error(`Model not available: ${userInput}`);
}
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

### code-review

Run a structured correctness-bug review over the current `git diff`. The command reuses the
`code-review` skill prompt and is implemented in `src/command/codeReview.ts` (`executeCodeReview`).
By default it reviews uncommitted changes (`git diff HEAD`); pass `--base <branch>` to compare
against a base branch instead (`git diff <base>...HEAD`).

```bash
alexi code-review [options]
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--effort <level>` | `low` \| `medium` \| `high` | `medium` | Review effort. Controls prompt verbosity and model routing. |
| `--base <branch>` | string | _(uncommitted)_ | Compare against this base branch instead of `HEAD`. |
| `--model <id>` | string | _(routed by effort)_ | Override the model used for the review. Takes precedence over effort-based routing. |
| `--workdir <path>` | string | `process.cwd()` | Working directory for the `git diff` invocation. |

#### Examples

```bash
# Review uncommitted changes at medium effort
alexi code-review

# High-effort review (prefers a reasoning model)
alexi code-review --effort high

# Compare against main branch
alexi code-review --base main

# Override model and effort
alexi code-review --effort low --model anthropic--claude-4-sonnet

# Run against a different working directory
alexi code-review --workdir /path/to/repo
```

#### Output

The review is written to `stdout`. Progress messages and a final summary line
(`effort`, `diff` size in bytes, total tokens, elapsed seconds) are written to `stderr`,
making it safe to redirect the review to a file:

```bash
alexi code-review --effort high > review.md
```

If the diff is empty the command exits successfully with `No changes to review.` and does
not invoke the LLM.

#### Effort-based model routing

`pickModelForEffort` in `src/command/codeReview.ts` selects the model when `--model` is not set:

| Effort | Strategy |
|--------|----------|
| `high` | Prefer a model where `reasoning === true` AND `costTier === 'expensive'`; fall back to any `expensive` model; otherwise `getDefaultModel()`. |
| `medium` | Use `getDefaultModel()` directly. |
| `low` | Prefer a model where `costTier === 'cheap'`; otherwise `getDefaultModel()`. |

The candidate set is the enabled-model list from `loadRoutingConfig()`
(`src/config/routingConfig.ts`).

#### Programmatic API

`executeCodeReview` can also be called directly from TypeScript:

```typescript
import { executeCodeReview } from './src/command/codeReview.js';

const result = await executeCodeReview({
  effort: 'high',
  target: { base: 'main' },          // or 'uncommitted'
  workdir: process.cwd(),
  modelOverride: undefined,
  signal: abortController.signal,    // optional cancellation
  onProgress: (msg) => console.log(msg),
});

console.log(result.review);
console.log(`tokens=${result.totalTokens} elapsedMs=${result.elapsedMs}`);
```

The relevant TypeScript types:

```typescript
export type CodeReviewEffort = 'low' | 'medium' | 'high';
export type CodeReviewTarget = 'uncommitted' | { base: string };

export interface CodeReviewOptions {
  effort?: CodeReviewEffort;          // default: 'medium'
  target?: CodeReviewTarget;          // default: 'uncommitted'
  workdir?: string;                   // default: process.cwd()
  modelOverride?: string;
  signal?: AbortSignal;
  onProgress?: (msg: string) => void;
}

export interface CodeReviewResult {
  success: boolean;
  diffBytes: number;
  effort: CodeReviewEffort;
  review: string;                     // structured review or 'No changes to review.'
  modelUsed: string;                  // empty for the empty-diff path
  totalTokens: number;
  elapsedMs: number;
}
```

## Agent Mode

> **Build status (2026-07-24):** the `--agent <id>` option and the agent-registry surface it depends on are currently unbuildable because the 2026-07-24 upstream sync (commit `530351f4`) overwrote `src/agent/index.ts` with a 3-line broken import stub. The `alexi agent` command itself still exists in `src/cli/commands/agent.ts`, but the `agentId` option cannot be resolved to a system prompt or tool allowlist until autohealing reverts `src/agent/index.ts` to its pre-sync content (parent commit `9f9fad90`). See [CHANGELOG](../CHANGELOG.md) `### Removed` and [docs/ARCHITECTURE.md#agent-system](ARCHITECTURE.md#agent-system) for the full recovery specification.
>
> **Build status (2026-07-26 addendum):** the 2026-07-26 sync (commit `0985297e`, version bump `1.18.11` → `1.18.12`) did not touch `src/agent/index.ts` and did not add or remove any user-facing CLI subcommand. Four orphan stubs were added (`src/agent/instance-advertisement.ts`, `src/cli/remote.ts`, `src/context/global-sync/bootstrap.ts`, `src/context/server-session-reducer.ts`) and none of them appear on the [CLI Commands](#cli-commands) reference. In particular, `alexi remote` is **not** a real subcommand — the presence of `src/cli/remote.ts` on disk is upstream noise, not a hidden or experimental API. The complete, canonical CLI surface is the set of commands documented in this file plus the interactive slash commands in [Interactive Mode Commands](#interactive-mode-commands); nothing added by the 2026-07-26 sync is reachable from `alexi --help` because none of the stubs is registered with the Commander.js program in `src/cli/program.ts`.

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
| `/code-review` | | Review uncommitted changes for correctness bugs (see below) |

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
| `/rewind` | Rewind conversation to a specific turn or summarize up to a point |
| `/context` | Show context usage |
| `/status` | Show current status |
| `/fork [name]` | Fork current session; the fork becomes the active session (subsequent messages land in the fork, matching `git checkout -b`). Optional `name` sets the fork title (defaults to `fork-<timestamp>`). |
| `/rename` | Rename current session |
| `/clear-history` | Clear conversation history |
| `/cost` | Show cost summary |
| `/stats` | Show usage statistics |

### Conversation Rewind

| Command | Description | Example |
|---------|-------------|---------|
| `/rewind` | List all turn boundaries | `/rewind` |
| `/rewind <N>` | Discard messages after turn N | `/rewind 3` |
| `/rewind <N> --summarize` | Summarize messages before turn N | `/rewind 3 --summarize` |

The `/rewind` command operates on conversation turns, where each turn starts at a user message. Modes:

- **List mode** (no arguments): Shows all turn boundaries with previews
- **Discard mode** (turn number only): Removes all messages after the specified turn
- **Summarize mode** (`--summarize` flag): Compresses messages before the specified turn into a summary system message while keeping recent messages intact

```typescript
interface RewindResult {
  success: boolean;
  mode: 'discard' | 'summarize' | 'list';
  messages?: Message[];
  turnBoundaries?: TurnBoundary[];
  error?: string;
  discardedCount?: number;
  summarizedCount?: number;
}
```

### Code Review

| Command | Description | Example |
|---------|-------------|---------|
| `/code-review` | Review uncommitted changes at medium effort | `/code-review` |
| `/code-review <effort>` | Review uncommitted changes at the given effort level | `/code-review high` |

The slash command is wired in two places that share the same `executeCodeReview` core:

- **Legacy interactive REPL** (`src/cli/interactive.ts`): supports cancellation via Ctrl+C through a
  dedicated `AbortController`. Progress and summary lines are printed to the terminal.
- **Ink-based TUI** (`src/cli/tui/hooks/useCommands.ts`): the review and summary are surfaced as
  system messages via `addSystemMessage`.

Both surfaces only review uncommitted changes (`git diff HEAD`). Use the non-interactive
`alexi code-review --base <branch>` form to compare against a base branch.

Unknown effort values fall back to `medium` with a warning. Effort routing matches the CLI:
`high` prefers a reasoning + expensive-tier model, `low` prefers a cheap-tier model, and
`medium` uses `getDefaultModel()`.

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
- **Model names**: After `/model `, Tab completes against the **live catalog** (`src/providers/modelCatalog.ts`) when it has loaded, falling back to `ORCHESTRATION_MODELS` while the first refresh is still in flight. Autocomplete never blocks on network I/O.
- **File paths**: After `/export ` or `/import `, Tab completes paths

### File mentions (`@` references)

Since v1.22.4, `@`-file mentions in user messages, custom command templates, and any other input that flows through `parseFileMentions()` support **three forms** (`src/utils/file-mention.ts:parseFileMentions`):

| Form | Example | Notes |
|------|---------|-------|
| Bareword | `@src/foo.ts` | Terminated by whitespace; historical behaviour |
| Double-quoted | `@"My Documents/report.txt"` | Allows spaces and shell-special characters |
| Single-quoted | `@'draft (2)/notes.md'` | Same, with single quotes as the delimiter |

Escape sequences inside quoted forms: `\"`, `\'`, `\\`. Mentions preceded by another `@` (email-address heuristic — `user@host@domain`) or by a word character are NOT matched.

Custom command templates additionally support **positional file references** — `@$1`, `@$2`, ... — which resolve to the corresponding argument. If the resolved path contains whitespace or shell-special characters, the template processor now wraps it in double quotes so the subsequent mention parser treats the whole path as a single token (fixes issue #1547).

```markdown
# .kilo/command/review.md
Review the changes in @$1 and summarize.
```

```bash
# Both work, even with a path containing spaces
/review src/tool/tools/read.ts
/review "docs/user guide.md"
```

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
| `MORPH_API_KEY` | -- | WarpGrep (`@morphllm/morphsdk`) semantic search API key. Consumed by the `alexi-mcp-warpgrep` MCP server (see [`docs/mcp-servers.md`](./mcp-servers.md)); Alexi's built-in tool surface no longer reads it. |
| `ALEXI_EXPERIMENTAL_BACKGROUND_TASKS` | -- | Enable background task execution |
| `KILO_DISABLE_EXTERNAL_SKILLS` | `false` | When set to `true` or `1` (case-insensitive), disables loading of external skills. Evaluated once at module load time via `src/core/flag.ts`. |

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
  /**
   * Optional metadata that overrides how the message is presented to the
   * user in transcripts (TUI rendering, `sessions export`, and session
   * replay). Does NOT change how the message is delivered to the model —
   * providers still receive the message with its logical `role`. Set
   * `displayRole: 'system'` on hook context messages or other internal
   * instrumentation that should reach the model but be hidden from
   * user-facing transcripts. Introduced in 1.21.4 (issue #1466).
   */
  displayRole?: 'system' | 'user' | 'assistant';
}
```

#### SessionManager.addMessage

`addMessage` accepts either a raw `displayRole` string or an options object as its fourth argument. Existing three-argument call sites continue to compile.

```typescript
class SessionManager {
  addMessage(
    role: Message['role'],
    content: string,
    tokens?: Message['tokens'],
    options?: { displayRole?: Message['displayRole'] } | Message['displayRole']
  ): void;
}

// Common uses
sessionManager.addMessage('user', 'hi');
sessionManager.addMessage('assistant', 'hello', { input: 5, output: 3 });

// Persist a hook contextModification message that is hidden from the
// transcript but still logged in the session file.
sessionManager.addMessage('user', hookMessage, undefined, { displayRole: 'system' });
```

Auto-title generation skips messages carrying any `displayRole` value so internal instrumentation cannot end up as the session title.

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
  /**
   * Per-session set of realpath()ed AGENTS.md files that have already been
   * surfaced to the agent as system-reminders.
   */
  agentsMdSeen?: Set<string>;
  /**
   * Current subagent nesting depth (0 for top-level user session).
   * The `task` tool uses this to enforce MAX_SUBAGENT_DEPTH (default 3).
   */
  subagentDepth?: number;
  /**
   * The synthetic tool-execution id assigned by `executeUnsafe` and
   * carried by ToolExecutionStarted / Completed / Failed. Threaded
   * through to `execute()` so streaming-capable tools (bash / shell)
   * can correlate incremental output chunks (`BashOutputChunk`) with
   * the row the TUI is already rendering. `undefined` when a tool is
   * invoked outside the standard registry (tests, one-shot calls).
   */
  toolId?: string;
  /**
   * Free-form per-invocation options that a caller can attach to a tool call.
   * Consumed by individual tools; unknown keys are ignored by tools that do
   * not recognize them. See tool-specific docs for supported keys.
   *
   * Currently recognized keys:
   *   - `denyDirectory` (boolean, read tool): when true, the `read` tool
   *     performs a symlink-escape check after resolving the requested path
   *     and rejects the call if the second `realPath` pass yields a
   *     different target. See "Built-in Tools" below for the exact contract.
   */
  extra?: Record<string, unknown>;
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
| `read` | `filePath`, `offset?`, `limit?` | Read file/directory contents (respects `ctx.extra.denyDirectory` — see below) |
| `write` | `filePath`, `content` | Write/create files |
| `edit` | `filePath`, `oldString`, `newString`, `replaceAll?` | Exact string replacement |
| `glob` | `pattern`, `path?` | Find files by glob pattern |
| `grep` | `pattern`, `path?`, `include?` | Search file contents by regex |
| `bash` | `command`, `description?`, `timeout?`, `workdir?` | Execute shell commands with real-time streaming (`BashOutputChunk` events) |
| `shell` | `command`, `description?`, `timeout?`, `workdir?` | Cross-platform shell tool (alias for `bash`, with sandbox git-write escalation) |
| `task` | `prompt`, `description`, `subagent_type`, `task_id?`, `background?` | Launch sub-agent |
| `task_status` | `taskId` | Query background task status |
| `webfetch` | `url`, `format?`, `timeout?` | Fetch web content |
| `question` | `question`, `options?` | Ask user a question |
| `todowrite` | `todos` | Manage task list (see [TodoWrite tool contract](#todowrite-tool-contract) below) |
| `background_process` | `command`, `name?`, `workingDirectory?`, `env?` | Spawn long-running detached process (see [background_process semantics](#background_process-tool-semantics) below) |
| `agent_manager` | `action`, `sessionId?`, `agentId?`, `answer?`, `worktreeId?`, `config?` | Manage agent sessions and answer pending sub-agent questions (nullable-friendly schema — see below) |

#### `todowrite` tool contract

`src/tool/tools/todowrite.ts` maintains a session-scoped task list. The parameter shape is:

```typescript
const TodoSchema = z.object({
  content: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  priority: z.enum(['high', 'medium', 'low']),
});

const TodoWriteParamsSchema = z.object({
  todos: z.array(TodoSchema),
});
```

The tool description explicitly enforces four incremental-update rules for callers:

1. Every call sends the **full** updated list. The tool replaces state — it does not merge.
2. Exactly **one** task must be in `in_progress` at a time. The previous task must be marked `completed` in the same call that starts the next one.
3. Completed tasks must remain in the list so the user sees the trail of finished work.
4. Newly discovered follow-up tasks are added as `pending` items rather than editing the currently-running task's `content`.

`getTodos()`, `onTodosChange(callback)`, and `clearTodos()` are exported for TUI integration.

#### `background_process` tool semantics

`src/tool/tools/background-process.ts` spawns a detached, unref'd child process and returns immediately once port detection completes. Its description explicitly documents four properties models kept getting wrong:

- **Not a sleep primitive.** The tool returns as soon as the child has spawned (typically a couple of seconds while ports are being detected). Do NOT use it to `sleep`, poll, or wait for a service to become ready — spawn the service here and poll the endpoint from a separate `bash` / `shell` call.
- **Port detection is asynchronous.** The initial result may return before ports are populated. Call `listBackgroundProcesses` a moment later to observe the resolved port set.
- **Detached and unref'd.** The process survives the tool call but WILL be terminated by `killAllTracked` on CLI shutdown. Do not rely on it outliving the parent Alexi session.
- **Permission gated.** The tool declares `permission: { action: 'execute', getResource: (params) => params.command }`, so it goes through the same permission evaluator as `bash`.

Result shape:

```typescript
export interface BackgroundProcess {
  id: string;                 // "bg_<timestamp>_<nanoid>"
  name: string;
  command: string;
  pid: number;
  startedAt: Date;
  status: 'running' | 'stopped' | 'failed';
  ports: number[];            // asynchronously populated
}
```

#### `agent_manager` tool: nullable-friendly schema

`src/tool/tools/agent-manager.ts` accepts explicit `null` in addition to `undefined` for every optional field, so tool-call payloads from strict-mode providers (OpenAI structured output, SAP AI Core in strict mode) validate without provider-specific pre-processing:

```typescript
const AgentManagerParamsSchema = z.object({
  action: z.enum(['create', 'list', 'stop', 'status', 'answer']).describe('Action to perform'),
  sessionId: z.string().nullable().optional().describe('Session ID for stop/status actions'),
  agentId: z
    .string()
    .nullable()
    .optional()
    .describe('Agent ID for answer action (the sub-agent blocked on a pending question)'),
  answer: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Answer text to send to a sub-agent that is blocked on a pending question. Required when action=answer.'
    ),
  worktreeId: z.string().nullable().optional().describe('Worktree ID for session creation'),
  config: z
    .object({
      mode: z.string().nullable().optional().describe('Agent mode'),
      model: z.string().nullable().optional().describe('Model to use'),
      excludeLocalState: z
        .boolean()
        .nullable()
        .optional()
        .describe('Exclude local state on startup for fresh session initialization'),
    })
    .nullable()
    .optional()
    .describe('Configuration for session creation'),
});
```

Both `null` and `undefined` mean "use default" — the `create` handler treats `config?.excludeLocalState ?? false` symmetrically. The `answer` action is used to unblock a sub-agent that is waiting on a permission question; it consumes the `agentId` and `answer` fields. The tool declares `permission: { action: 'admin', getResource: (params) => params.action }`.

**Actions**:

- `create` — Create a new agent session with optional `config` and `worktreeId`. When `config.excludeLocalState` is truthy (either `true` or `null`/omitted defaulting to `false`), the session boots without importing local state.
- `list` — List all active agent sessions.
- `stop` — Stop a specific agent session. Requires `sessionId`.
- `status` — Get the status of a specific agent session. Requires `sessionId`.
- `answer` — **[Added in 1.22.1, ports kilocode `7baefdddf`]** Provide an answer to a sub-agent that is blocked on a pending question. Requires `agentId` and `answer`. The handler consults `getBlocker(agentId)` (fail-closed — see [Sub-agent Blocker Store](./ARCHITECTURE.md#sub-agent-blocker-store-srcpermissionagent-managerts)) and rejects when there is no pending question OR when the blocker is of `kind: 'permission'` (only `question` blockers are answerable through this action today). Success clears the blocker via `answerQuestion(agentId, answer)`.

Example invocation for the `answer` action:

```json
{
  "action": "answer",
  "agentId": "sub-agent-42",
  "answer": "Yes, proceed with the migration."
}
```

The `answer` action is the caller-side of the agent-manager blocker store (`src/permission/agent-manager.ts`). It delegates to `getBlocker(agentId)` to confirm a pending `Blocker { kind: 'question', prompt?, meta? }` exists, then calls `answerQuestion(agentId, answer)` which clears the entry from the in-memory store. When `action === 'answer'`, both `agentId` and `answer` must be non-null strings — the handler rejects the tool call otherwise so the orchestrator does not silently drop an answer meant for a waiting sub-agent. The complementary `isBlocked(agentId)` helper on the same module fails closed: a store lookup that throws is treated as "still blocked" so a caller cannot proceed on stale state (port of upstream `98559c9d6`, current strict form as of `de9d1530`, 2026-08-25: `return blocker !== null && blocker !== undefined`).

> `codebase_search` is no longer a built-in tool. It is provided by the standalone `alexi-mcp-warpgrep` MCP server (see [`docs/mcp-servers.md`](./mcp-servers.md)); once registered in `mcp-servers.json` it appears in the same tool list with the same `{ query: string }` parameter shape it had as a built-in.

#### `read` tool: `denyDirectory` symlink safeguard

The `read` tool implementation (`src/tool/read.ts`) supports an opt-in symlink-escape check. When a tool call is invoked with `ctx.extra.denyDirectory === true`, the tool re-resolves the incoming `requested` path via `fs.realPath` after the initial permission and existence checks and compares the normalized result against the pre-resolved `target`. When the two differ, the call is rejected before any file contents are streamed back to the model:

```
Directory attachments cannot be expanded: <requested>
```

Semantics:

- The check runs only when `ctx.extra.denyDirectory === true`. When the flag is `undefined`, `false`, or the `extra` bag is absent, `read` behaves exactly as before — no additional `realPath` call, no rejection.
- On Windows the second-pass path is normalized via `FSUtil.normalizePath` before comparison so drive-letter case, separator direction, and trailing-separator variance do not produce false positives. On POSIX the two `realPath` values are compared byte-for-byte.
- The failure surfaces as an `Effect.fail(new Error(...))` in the tool result — the agent loop receives it as a normal tool error, not a synchronous exception.
- The safeguard is a defence-in-depth addition on top of the rule-based permission model. Callers that expand user-supplied directory paths (`context`, `session-export`, and any programmatic consumer that walks attachments) should set `denyDirectory: true` when the underlying operation must not follow symlinks that escape the sandbox.

Programmatic example (Node/TypeScript):

```typescript
import { getTool } from './tool/index.js';

const read = getTool('read');
if (!read) {
  throw new Error('read tool not registered');
}

const result = await read.execute(
  { filePath: '/path/to/user-supplied/entry' },
  {
    workdir: process.cwd(),
    extra: { denyDirectory: true },
  }
);

if (!result.success) {
  // On symlink escape: result.error === 'Directory attachments cannot be expanded: <requested>'
  console.error(result.error);
}
```

## Event Bus API — Bash Streaming

The bash and shell tools publish incremental output chunks over the event bus so TUIs and other observers can render command output as it arrives.

```typescript
import { BashOutputChunk } from '../bus/index.js';

// Payload shape (Zod-validated on publish):
// {
//   toolId: string;                     // matches ToolExecutionStarted / Completed
//   logId: string;                      // matches command-log registry entry (PID-reuse safe)
//   stream: 'stdout' | 'stderr';
//   chunk: string;                      // UTF-8 decoded chunk (may span 'data' events)
//   timestamp: number;
// }

const unsubscribe = BashOutputChunk.subscribe(({ toolId, stream, chunk }) => {
  console.log(`[${stream}] ${chunk}`);
});
```

Invariants:

- `BashOutputChunk` fires strictly between `ToolExecutionStarted` and `ToolExecutionCompleted` for the same `toolId`.
- The final aggregated `stdout` / `stderr` are still returned in the normal `ToolExecutionCompleted` payload; consumers who don't care about live output can ignore this event entirely without changing behaviour.
- Empty chunks are filtered out at publish time.
- A failing subscriber cannot tear down the running command — publish is wrapped in a try/catch on the tool side.

## Command Log Registry API

`src/tool/tools/bash-streaming.ts` exposes the process-local store that backs bash / shell live chunks. Correlate by `logId` (PID-reuse safe) rather than OS PID.

```typescript
import {
  registerCommandLog,
  appendCommandLog,
  markCommandLogFinished,
  getCommandLog,
  getCommandLogByPid,
  cleanupCommandLog,
  cleanupCompletedLogs,
  listCommandLogIds,
  MAX_LOG_BYTES,               // 32 KB per-log append buffer
  COMPLETED_LOG_RETENTION_MS,  // 60_000ms retention after finish
} from '../tool/tools/bash-streaming.js';

// Register BEFORE any 'data' handler fires
const logId = registerCommandLog({
  pid: proc.pid,
  command: 'npm install',
  sessionId,
  toolId,
  startedAt: Date.now(),
});

// Append chunks from stdout / stderr
appendCommandLog(logId, chunk);

// Mark finished — entry enters retention window
markCommandLogFinished(logId);

// Later: fetch the tail
const snapshot = getCommandLog(logId); // Readonly snapshot with buffer

// PID-reuse-safe diagnostic lookup (requires BOTH pid AND startedAt)
const byPid = getCommandLogByPid(pid, startedAt);
```

`CommandLogSnapshot` shape:

```typescript
export type CommandLogSnapshot = Readonly<Omit<CommandLogEntry, 'buffer'>> & {
  buffer: string;
};

interface CommandLogEntry {
  id: string;                  // primary key (nanoid), PID-reuse-safe
  pid: number | undefined;
  startedAt: number;
  finishedAt?: number;
  command: string;
  sessionId?: string;
  toolId?: string;
  buffer: string;              // rolling append buffer, capped at MAX_LOG_BYTES
  totalBytes: number;          // total bytes ever appended
  truncated: boolean;          // true once buffer has been truncated at least once
}
```

Truncation marker inserted when `MAX_LOG_BYTES` is exceeded: `\n[... older output evicted from streaming buffer ...]\n`. Eviction snaps forward to the next `\n` within 1 KB so partial lines are not shown to the TUI.

## SQLite Connection Configuration

`src/core/database/database.ts` produces the canonical PRAGMA sequence for opening a shared SQLite database from multiple processes. Order matters: `busy_timeout` must be installed before `journal_mode = WAL` so the busy handler is armed before WAL recovery can race.

```typescript
import { CONNECTION_PRAGMAS, configureConnection } from '../core/database/database.js';

// Canonical ordered list (immutable):
CONNECTION_PRAGMAS === Object.freeze([
  'PRAGMA busy_timeout = 5000',
  'PRAGMA journal_mode = WAL',
  'PRAGMA synchronous = NORMAL',
  'PRAGMA cache_size = -64000',
  'PRAGMA foreign_keys = ON',
  'PRAGMA wal_checkpoint(PASSIVE)',
]);

// Adapter-agnostic — pass anything with a { run(sql) } method
export interface PragmaRunner {
  run(sql: string): Promise<unknown> | unknown;
}

// better-sqlite3 example
const db = new Database(filename);
await configureConnection({ run: (sql) => db.exec(sql) });

// Options
export interface ConfigureConnectionOptions {
  busyTimeoutMs?: number;   // default 5000
  ownsWalInit?: boolean;    // default true; false skips 'PRAGMA journal_mode = WAL'
}
```

## State Directory Resolution API

`src/core/global/paths.ts` transparently probes the preferred state directory and falls back to a secondary location when the primary is unwritable (containers, restricted user profiles, VS Code Server on Windows).

```typescript
import { resolveState, resolveStateDir } from '../core/global/paths.js';

// General form: preferred with optional fallback
const dir = await resolveState(preferred, fallback);

// Convenience wrapper: falls back to `<dataDir>/state` unless
// $XDG_STATE_HOME was explicitly set by the user
const stateDir = await resolveStateDir(dataDir, preferred);
```

Behaviour:

- Writability is probed via an exclusive-mode temp file (`wx`, mode `0o600`) so a stale probe file cannot mask a real permission problem.
- The fallback is **sticky**: once selected it is preferred on subsequent runs so the resolved state directory does not flap between locations across restarts.
- When `$XDG_STATE_HOME` was explicitly set by the user, no fallback is provided — any failure surfaces rather than silently redirecting.

## Snapshot Persistence API

`src/core/snapshot.ts` persists the "snapshots disabled" flag across CLI restarts.

```typescript
import {
  disableSnapshots,
  enableSnapshots,
  shouldSnapshot,
  SNAPSHOT_DISABLE_STATE_KEY,   // 'kilocode.snapshot.disabled'
  pruneSnapshots,
} from '../core/snapshot.js';

await disableSnapshots();                 // persist disable to ~/.alexi/state/snapshot.json
await enableSnapshots();                  // re-enable
const on = await shouldSnapshot();        // true when snapshots are on

// Prune stale snapshot / truncation files by mtime, oldest first.
// Retains the newest `keep` files (default 20). No-op when the
// snapshots directory does not exist.
const deleted = await pruneSnapshots(sessionId, 20);
```

A missing or unreadable state file is treated as "not disabled" so an unwritable state directory degrades gracefully rather than silently disabling snapshots.

## Sandbox Git-Write API

`src/kilocode/sandbox/git.ts` classifies git subcommands as write-shaped for sandbox escalation.

```typescript
import { isGitWrite, requiresSandboxEscalation } from '../kilocode/sandbox/git.js';

isGitWrite('git commit -m msg');                    // true
isGitWrite('git -C repo push origin main');         // true (walks past -C flag)
isGitWrite('git log --oneline');                    // false (read-only)

const sandboxEnabled = process.env.ALEXI_SANDBOX === '1';
if (requiresSandboxEscalation(command, sandboxEnabled)) {
  // prompt the user via getPermissionManager().check(...)
}
```

## Native Notifications API

`src/core/notifications.ts` exposes the desktop-notification surface. Every function is safe to call from any context — no path throws, and non-interactive environments (`CI`, `ALEXI_NO_NOTIFICATIONS=1`, no TTY) silently resolve `false`.

```typescript
import {
  sendNotification,
  notifyInBackground,
  getNotificationDecision,
  setNotificationDecision,
  isInteractiveEnv,
  LONG_RUNNING_THRESHOLD_MS,
  type NotificationDecision,
  type SendNotificationOptions,
  type NotifierLike,
} from '../core/notifications.js';

export type NotificationDecision = 'allow' | 'deny' | 'ask';

export interface SendNotificationOptions {
  /** Absolute path to an icon image. Ignored on platforms without icon support. */
  icon?: string;
  /** Play the OS default notification sound. */
  sound?: boolean;
  /** Block until the notification is dismissed. */
  wait?: boolean;
  /** Test-only: override the node-notifier layer. */
  __notifierOverride?: NotifierLike;
  /** Test-only: override the inquirer confirm prompt. */
  __askOverride?: (title: string, message: string) => Promise<boolean>;
}

export interface NotifierLike {
  notify(
    options: Record<string, unknown>,
    callback?: (err: Error | null, response?: string, metadata?: unknown) => void
  ): unknown;
}

/** Minimum wall-clock duration (ms) before a bash/shell command is "long-running". Currently 30_000. */
export const LONG_RUNNING_THRESHOLD_MS: number;

/** Returns false when CI, ALEXI_NO_NOTIFICATIONS=1, or either stream is not a TTY. */
export function isInteractiveEnv(): boolean;

/** Reads the persisted decision from ~/.alexi/config.json; malformed values coerce to 'ask'. */
export function getNotificationDecision(): NotificationDecision;

/** Persists the decision to ~/.alexi/config.json. */
export function setNotificationDecision(decision: NotificationDecision): void;

/**
 * Dispatch a notification. Never throws — a failed dispatch resolves to `false` after
 * logger.debug. Returns `true` iff the notification was accepted by node-notifier.
 * The decision is re-read on every call, so a `deny -> allow` config edit takes
 * effect on the next invocation without any restart.
 */
export function sendNotification(
  title: string,
  message: string,
  options?: SendNotificationOptions
): Promise<boolean>;

/** Fire-and-forget wrapper. Discards the promise safely; errors are already swallowed. */
export function notifyInBackground(
  title: string,
  message: string,
  options?: SendNotificationOptions
): void;
```

**Call-site contract.** Two internal call sites currently invoke `notifyInBackground`:

- `src/core/streamingOrchestrator.ts` — fires `notifyInBackground('Alexi', 'Task completed')` when the streaming loop exits via the `completedCleanly` branch. Aborts, provider errors, context-overflow retries, and rate-limit backoffs do NOT fire.
- `src/tool/tools/bash.ts` — fires `notifyInBackground('Command finished', description ?? command)` when either the command detached before exit, OR the foreground elapsed time reached `LONG_RUNNING_THRESHOLD_MS` (30 s).

Both sites resolve the shared `notifications` config key on every call. A single user `deny` decision silences both surfaces; a single `allow` re-enables both.

**Config key.** The decision persists as a JSON string under `notifications` in `~/.alexi/config.json`:

```jsonc
{
  "notifications": "allow"  // or "deny" | "ask" (unset defaults to "ask")
}
```

See also: [Configuration -> Native Notifications](CONFIGURATION.md#native-notifications).

## Permission System

### Permission Actions

```typescript
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
```

### Read-only mode evaluator

```typescript
import { evaluate } from '../permission/index.js';

// Under 'ask' / 'plan' modes, write-shaped tools are denied even when
// a broad wildcard rule like { '*': 'allow' } would otherwise match.
// An explicit per-tool 'allow' still wins.
evaluate({
  tool: 'write',
  mode: 'ask',
  rules: { '*': 'allow' },
}); // => 'deny'

evaluate({
  tool: 'write',
  mode: 'ask',
  rules: { '*': 'allow', write: 'allow' },
}); // => 'allow'  (explicit per-tool wins)

evaluate({
  tool: 'read',
  mode: 'ask',
  rules: { '*': 'allow' },
}); // => 'allow'  (read is not write-shaped)
```

Write-shaped tools: `write`, `edit`, `patch`, `shell`, `bash`, `kilo_edit`, `kilo_write`, `apply_patch`. Read-only modes: `ask`, `plan`.

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

## Session Replay

When resuming an interactive session, the `SessionReplay` class replays past messages so users can review context:

```typescript
import { getSessionReplay } from './cli/session-replay.js';

const replay = getSessionReplay();

const result = await replay.replay(messages, {
  maxMessages: 50,           // Maximum messages to replay
  showToolCalls: true,       // Include tool call messages
  showSystemMessages: false, // Skip system messages
  onMessage: (msg, index, total) => {
    console.log(replay.formatMessage(msg));
  },
});

// Get session summary statistics
const summary = replay.getSummary(messages);
// { totalMessages, userMessages, assistantMessages, systemMessages, toolCalls }
```

### ReplayOptions

```typescript
interface ReplayOptions {
  maxMessages?: number;               // Default: 50
  showToolCalls?: boolean;            // Default: true
  showSystemMessages?: boolean;       // Default: false
  onMessage?: (message: Message, index: number, total: number) => void;
}
```

### `displayRole: 'system'` hard-hide

Introduced in 1.21.4 (issue #1466). `SessionReplay.replay` hard-hides any message tagged with `displayRole: 'system'` regardless of `showSystemMessages`. Real `role: 'system'` messages (the actual system prompt) remain visible when `showSystemMessages: true`. These skipped messages are counted in `result.skippedMessages`.

```typescript
const messages = [
  { role: 'system', content: 'real-system-prompt', timestamp: 1 },
  { role: 'user', content: 'hidden-hook', timestamp: 2, displayRole: 'system' },
  { role: 'user', content: 'visible', timestamp: 3 },
];

const result = await replay.replay(messages, {
  showSystemMessages: true,
  onMessage: (m) => console.log(m.content),
});
// Prints: real-system-prompt, visible
// result.skippedMessages === 1
```

## MCP Apps API (experimental)

Introduced in 1.21.4 (port of kilocode `36c57c12c`, tightened by `c02134ab4` and `b7069922d`). Wraps `McpClientManager` in a thin API that presents each connected server as an "app" with `listResources` and `callTool` verbs. Gated behind `ALEXI_EXPERIMENTAL_MCP_APPS=1`; the exports are always available for feature detection.

```typescript
// src/mcp/apps.ts (re-exported via src/mcp/index.ts under prefixed names)

export const MCP_APPS_ENV_FLAG = 'ALEXI_EXPERIMENTAL_MCP_APPS';
export function isMCPAppsEnabled(): boolean;

export interface MCPResource {
  uri?: string;
  name?: string;
  mimeType?: string;
  [key: string]: unknown;
}

export function listResources(
  server: string,
  manager?: McpClientManager
): Promise<MCPResource[]>;

export function callTool(
  server: string,
  tool: string,
  args: Record<string, unknown>,
  manager?: McpClientManager
): Promise<unknown>;

export class MCPAppsError extends Error {
  readonly operation: 'listResources' | 'callTool';
  readonly server: string;
  readonly tool?: string;
  override readonly cause: unknown;
}
```

Re-exports from `src/mcp/index.ts` use prefixed names to avoid collision with the raw manager methods:

```typescript
export {
  isMCPAppsEnabled,
  listResources as mcpAppsListResources,
  callTool as mcpAppsCallTool,
  MCPAppsError,
  MCP_APPS_ENV_FLAG,
  type MCPResource,
} from './apps.js';
```

All errors are normalised to `MCPAppsError` so downstream HTTP handlers can render a stable envelope. Cross-module `instanceof` checks are avoided by matching on `name === 'MCPAppsError'`.

## Cerebras Completion-Token Cap API

Introduced in 1.21.4 (port of opencode `e49772a`). Cerebras enforces a hard cap of `32_768` on `max_completion_tokens`; higher values cause silent truncation without an error. The `CerebrasPlugin` (builtin) clamps any explicit `maxTokens` on a Cerebras-routed call to the documented ceiling.

```typescript
// src/plugin/cerebras.ts

/** Hard upper bound for max_completion_tokens on Cerebras deployments. */
export const CEREBRAS_MAX_COMPLETION_TOKENS = 32_768;

/**
 * True when the given provider/model identifier should be treated as
 * Cerebras. Both direct provider ids and prefixed model ids (e.g.
 * `cerebras/llama-3.1-70b`) are recognised.
 */
export function isCerebrasTarget(providerOrModel: string | undefined): boolean;

/**
 * Clamp a caller-supplied `maxTokens` value to the Cerebras ceiling.
 * Returns the original value unchanged for non-Cerebras targets or
 * when `maxTokens` is undefined / already within bounds.
 */
export function clampCerebrasMaxTokens(
  providerOrModel: string | undefined,
  maxTokens: number | undefined
): number | undefined;

export const CerebrasPlugin: Plugin;
```

Applicability: Alexi routes exclusively through SAP AI Core, so under normal operation there is no direct Cerebras provider. The plugin ships as a builtin because (1) SAP AI Core proxy deployments MAY expose a Cerebras-family model id (`cerebras-*`) which the guard catches, and (2) users running the fork behind a custom proxy that adds Cerebras get the cap for free. No-op for every non-Cerebras provider.

## Network Management

The `NetworkManager` provides automatic reconnection with exponential backoff:

```typescript
import { NetworkManager, NetworkError } from './core/network.js';

const manager = new NetworkManager({
  maxRetries: 5,        // Default: 5
  baseDelayMs: 1000,    // Default: 1000ms
  maxDelayMs: 30000,    // Default: 30000ms
});

manager.on('reconnect:attempt', ({ attempt, maxRetries }) => {
  console.log(`Reconnecting ${attempt}/${maxRetries}...`);
});

manager.on('reconnect:success', () => {
  console.log('Reconnected');
});

manager.on('reconnect:failed', ({ error }) => {
  console.error('Reconnection failed:', error.message);
});

// Trigger reconnection
await manager.reconnect();

// Query state
manager.isConnected();     // boolean
manager.isReconnecting();  // boolean
manager.getState();        // NetworkState
manager.cancelReconnect(); // Cancel in-progress reconnection
```

## Enhanced Tool Registry

The `EnhancedToolRegistry` supports dynamic prompt-based tool resolution:

```typescript
import { EnhancedToolRegistry } from './tool/registry.js';

const registry = new EnhancedToolRegistry();

// Register static tools
registry.register(myTool);

// Register a prompt resolver for dynamic tools
registry.registerPromptResolver('mcp', {
  resolve: async (context) => {
    // Return tools available for this session/agent context
    return await fetchMcpTools(context.sessionId);
  },
});

// Resolve all tools for a prompt context
const tools = await registry.resolveForPrompt({
  sessionId: 'session-123',
  agentId: 'code',
  permissions: ['read', 'write', 'execute'],
});
```

## Plugin Tool System

Plugin tools use a simplified interface with Promise-based `ask`:

```typescript
import { createPluginToolWrapper, type PluginToolDefinition } from './tool/plugin-tools.js';

const myPlugin: PluginToolDefinition = {
  name: 'my-plugin-tool',
  description: 'A plugin tool',
  schema: z.object({ query: z.string() }),
  execute: async (params, context) => {
    // context.ask returns a Promise (not an Effect)
    const answer = await context.ask('Confirm action?');
    return { success: true, data: { answer } };
  },
};

// Wrap for Alexi's tool system
const wrappedTool = createPluginToolWrapper(myPlugin);
```

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

## TUI Tool-Call Rendering API

Introduced in 1.20.2. See `docs/ARCHITECTURE.md#tui-tool-call-disclosure` for the full flow.

### `ToolRow` component (`src/cli/tui/components/ToolRow.tsx`)

```typescript
export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ToolRowProps {
  toolName: string;
  params: Record<string, unknown>;
  status: ToolStatus;
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  diff: DiffData | null;
  /** Duration in ms (set on completion) */
  duration?: number;
}

export function ToolRow(props: ToolRowProps): React.JSX.Element;
```

`ToolCallBlock` is retained as a thin wrapper — `type ToolCallBlockProps = ToolRowProps` and the component delegates to `ToolRow` — so existing callers do not need to change.

### `formatToolOutput` helpers (`src/cli/tui/utils/formatToolOutput.ts`)

Pure string helpers, unit-testable without an Ink render harness.

```typescript
export function formatBashCommand(command: string): string;

export interface TruncatedOutput {
  text: string;
  truncated: boolean;
  remaining: number;
}
export function truncateOutput(
  text: string,
  maxLines?: number, // default 20
  keepLines?: number // default 15
): TruncatedOutput;

export function formatParamsPreview(
  params: Record<string, unknown>,
  maxLen?: number // default 50
): string;

export function formatDuration(ms: number): string;

export function guessLanguageFromPath(filePath: string): string | undefined;
```

`guessLanguageFromPath` supports `ts`, `tsx`, `js`, `jsx`, `mjs`, `cjs`, `json`, `md`, `yml`, `yaml`, `sh`, `bash`, `py`, `rb`, `go`, `rs`, `java`, `css`, `scss`, `html`, `xml`, `toml`. Returns `undefined` for unknown extensions so callers can fall back to plain text.

## Agent Permission Expansion API

Introduced in 1.20.2. Path in agent config files may use `~` / `~/foo` shorthand; this module normalizes them against `$HOME` before they reach the permission matcher.

```typescript
// src/agent/permissions-expand.ts

export const PATH_ACTIONS = ['external_directory', 'read', 'edit'] as const;
export type PathAction = (typeof PATH_ACTIONS)[number];

export interface AgentPermissionEntry {
  action: string;
  path?: string;
  [key: string]: unknown;
}

export function normalizePermissionPath(p: string, home: string): string;

export function expandPermissions<T extends AgentPermissionEntry>(
  entries: ReadonlyArray<T>,
  home?: string // defaults to os.homedir()
): T[];
```

Entries whose `action` is not in `PATH_ACTIONS` pass through unchanged. Rules with an unrecognised action pass through unchanged.

## Session Retry API

Introduced in 1.20.2. Bounded exponential backoff with full jitter.

```typescript
// src/core/session/retry.ts

export interface RetryOptions {
  /** Maximum number of attempts (including the first). Default: 8. */
  maxAttempts?: number;
  /** Initial delay in ms before the first retry. Default: 500. */
  baseMs?: number;
  /** Upper bound on any single delay in ms. Default: 30 000. */
  maxMs?: number;
  /** When true (default), apply full jitter. */
  jitter?: boolean;
}

export function computeDelay(attempt: number, opts?: RetryOptions): number;

export function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  opts?: RetryOptions
): Promise<T>;
```

The `shouldRetry` predicate is supplied by the caller. The transient-vs-permanent classifier lives in `src/core/error-backoff.ts` and is documented in `AGENTS.md#error-classification-retry-vs-config-fix`.

## Database Migration API

Introduced in 1.20.2. Serialized migration application with primary-key-safe re-check inside the transaction.

```typescript
// src/core/database/migration.ts

export interface Migration {
  id: string;
  up: (tx: MigrationTx) => Promise<void>;
}

export interface MigrationTx {
  has(id: string): Promise<boolean>;
  record(id: string): Promise<void>;
}

export interface MigrationDb {
  transactionImmediate<T>(fn: (tx: MigrationTx) => Promise<T>): Promise<T>;
  completedIds(): Promise<Set<string>>;
}

export async function applyMigrations(
  db: MigrationDb,
  migrations: readonly Migration[]
): Promise<void>;
```

Callers implement `MigrationDb`/`MigrationTx` against their SQL adapter of choice (better-sqlite3, effect-sql, raw pg). `transactionImmediate` MUST issue the equivalent of `BEGIN IMMEDIATE` (SQLite) or set the isolation level to serialize (Postgres) so the re-check inside the transaction is meaningful.

## Filesystem Watcher API

Introduced in 1.20.2. VCS-guarded and gated behind an experimental flag. Extended in 1.21.4 with the `InstanceWatcher` class for per-session scoping.

```typescript
// src/core/filesystem/watcher.ts

export interface WatchLocation {
  directory: string;
  vcs: boolean;
}

export function isExperimentalFileWatcherEnabled(): boolean;

export function maybeStartFileWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null;

/**
 * Per-instance watcher registry (kilocode `b8984e468`). Prefer over the
 * module-level `startWatcher` shim for new code.
 */
export class InstanceWatcher {
  start(location: WatchLocation, subscribe: (dir: string) => () => void): (() => void) | null;
  stop(directory: string): boolean;
  has(directory: string): boolean;
  size(): number;
  setDebounceTimer(directory: string, timer: ReturnType<typeof setTimeout>): void;
  dispose(): void;
}

/** Backwards-compatible shim — delegates to the module-level default instance. */
export function startWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null;

/** Test-only accessor for the default instance. */
export function getDefaultWatcherInstance(): InstanceWatcher;
```

`maybeStartFileWatcher` returns a disposer or `null` when the watcher was skipped. Enable via `ALEXI_EXPERIMENTAL_FILEWATCHER=1`; callers must have already confirmed VCS metadata is present (`location.vcs = true`) before invoking.

`InstanceWatcher.start` is idempotent per directory — a second call for the same directory returns the existing disposer without invoking `subscribe` again. `stop(directory)` only tears down the requested directory and returns `true` if a watch was disposed. `dispose()` is safe to call multiple times: it clears every debounce timer first, then iterates a snapshot of `watchers.values()` and invokes each disposer.

## Error Backoff API

`src/core/error-backoff.ts` exposes error classifiers that higher-level retry drivers use to decide whether a failure is worth another attempt. Extended in 1.21.4 with `isXAICapacityError` and `isRetryableError` (port of opencode `71d08e9`).

```typescript
// src/core/error-backoff.ts

/** True for free-tier or paid-tier rate limits, or HTTP 429. */
export function isRateLimitError(err: unknown): boolean;

/**
 * True when `err.message` matches /xai.*capacity|capacity.*exceeded/i.
 * xAI (and some SAP proxies fronting xAI-family models) occasionally
 * emits a mid-stream "capacity exceeded" error that is semantically the
 * same as a 5xx transient overload — retrying with backoff clears it.
 * Detection is structural (message regex) because the upstream API does
 * not attach a stable machine-readable code.
 */
export function isXAICapacityError(err: unknown): boolean;

/**
 * Coarse "is this transient?" check. True when `isRateLimitError(err)`
 * OR `isXAICapacityError(err)` returns true. False for `null` /
 * `undefined` and for permanent auth failures. Extend cautiously — a
 * false positive means real config failures get retried and waste
 * provider budget.
 */
export function isRetryableError(err: unknown): boolean;

/** Extract a Retry-After window and convert to milliseconds. */
export function getRetryAfterMs(err: unknown): number | undefined;

/** Extract `status: NNN` from a raw error message (4xx / 5xx only). */
export function extractStatusCode(err: unknown): number | undefined;

/** True for auth failures that will NOT recover on retry. */
export function isPermanentAuthFailure(err: unknown): boolean;
```

Example — gate a retry loop on `isRetryableError`:

```typescript
import { isRetryableError, getRetryAfterMs } from './core/error-backoff.js';

async function callWithRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryableError(err) || attempt === maxAttempts) {
        throw err;
      }
      const wait = getRetryAfterMs(err) ?? Math.min(1000 * 2 ** (attempt - 1), 30_000);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}
```

## Config Instance Cache Invalidation API

Introduced in 1.20.2. Ports kilocode `19a2a3c4d`.

```typescript
// src/config/invalidation.ts

type InstanceCacheDisposer = () => void;

export function registerInstanceCache(dispose: InstanceCacheDisposer): () => void;
export function invalidateGlobalConfig(): void;
/** @internal test/debug helper */
export function _instanceCacheCount(): number;
```

`updateGlobal(updates, { dispose: true })` in `src/config/userConfig.ts` calls `invalidateGlobalConfig()` after writing the updated config to disk. Pass `dispose: false` to suppress the flush.
