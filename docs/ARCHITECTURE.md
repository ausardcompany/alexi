# Alexi Architecture

This document describes the high-level architecture of Alexi, an intelligent LLM orchestrator for SAP AI Core.

## Overview

Alexi is a TypeScript/Node.js CLI application that orchestrates LLM calls exclusively through SAP AI Core, featuring intelligent routing, multi-turn session management, agentic tool execution, lifecycle hooks, context compaction, and an extensible tool system with 30+ built-in tools.

## System Architecture

```mermaid
graph TB
    subgraph CLI["CLI Layer"]
        Program[program.ts]
        Interactive[interactive.ts]
        TUI[Ink TUI]
    end

    subgraph Core["Core Layer"]
        Orchestrator[orchestrator.ts]
        AgenticChat[agenticChat.ts]
        Router[router.ts]
        SessionManager[sessionManager.ts]
        StreamingOrch[streamingOrchestrator.ts]
        Compaction[compaction/index.ts]
        CompactionChunks[compaction-chunks.ts]
        NetworkMgr[network.ts]
    end

    subgraph Provider["Provider Layer (SAP AI Core)"]
        SAPOrch[sapOrchestration.ts]
        Auth[auth.ts]
        Transform[transform.ts]
    end

    subgraph Tools["Tool System"]
        ToolIndex[tool/index.ts]
        Bash[bash.ts]
        Read[read.ts]
        Write[write.ts]
        Edit[edit.ts]
        Glob[glob.ts]
        Grep[grep.ts]
        Task[task.ts]
        WebFetch[webfetch.ts]
        TaskStatus[task_status.ts]
    end

    subgraph Support["Support Systems"]
        Bus[bus/index.ts]
        Permission[permission/index.ts]
        Agent[agent/index.ts]
        MCP[mcp/index.ts]
        Hooks[hooks/index.ts]
        Skill[skill/index.ts]
        Reference[reference/index.ts]
    end

    subgraph Commands["Command System"]
        Rewind[command/rewind.ts]
        SessionReplay[cli/session-replay.ts]
    end

    Program --> Interactive
    Program --> TUI
    Interactive --> Orchestrator
    TUI --> Orchestrator
    Orchestrator --> Router
    Orchestrator --> SessionManager
    Orchestrator --> StreamingOrch
    AgenticChat --> Router
    AgenticChat --> Compaction
    AgenticChat --> Hooks
    Compaction --> CompactionChunks
    Router --> SAPOrch
    SAPOrch --> Auth
    SAPOrch --> Transform
    AgenticChat --> ToolIndex
    ToolIndex --> Bash
    ToolIndex --> Read
    ToolIndex --> Write
    ToolIndex --> Edit
    ToolIndex --> Glob
    ToolIndex --> Grep
    ToolIndex --> Task
    ToolIndex --> WebFetch
    ToolIndex --> TaskStatus
    Orchestrator --> Bus
    Orchestrator --> Permission
    Orchestrator --> Agent
    Orchestrator --> MCP
    Orchestrator --> Skill
    Orchestrator --> NetworkMgr
    Interactive --> Rewind
    Rewind --> Compaction
    Interactive --> SessionReplay
    Orchestrator --> Reference
```

## Module Descriptions

### CLI Layer

| Module | File | Description |
|--------|------|-------------|
| Program | `src/cli/program.ts` | CLI entry point using Commander.js, registers 10 command groups |
| Interactive | `src/cli/interactive.ts` | Legacy interactive mode (deprecated in favor of TUI) |
| TUI | `src/cli/tui/` | Full-screen Ink/React TUI with streaming, dialogs, and slash commands |

> **Not part of the CLI surface (2026-07-26 sync noise):** the 2026-07-26 upstream sync (commit `0985297e`) emitted a 5-line orphan file `src/cli/remote.ts` containing a non-exported `executeRemoteCommand(command: string): void` function that references an undeclared `isValidCommand` free identifier. It is **not** wired into `src/cli/program.ts`, does not correspond to any `alexi <subcommand>` on the [CLI Commands](API.md#cli-commands) reference, and fails `npm run typecheck` with `TS2304: Cannot find name 'isValidCommand'`. There is no `alexi remote` subcommand; remote LLM invocation goes through the SAP AI Core Orchestration provider (`src/providers/sapOrchestration.ts`), and remote MCP tool surfaces live under `src/mcp/`. The stub is pending autohealing deletion; see the CHANGELOG `### Added` entry for 2026-07-26.

### Core Layer

| Module | File | Description |
|--------|------|-------------|
| Orchestrator | `src/core/orchestrator.ts` | Single-turn `sendChat()` with routing and session |
| Agentic Chat | `src/core/agenticChat.ts` | Multi-turn autonomous agent with tool loop, compaction, and hooks |
| Router | `src/core/router.ts` | Model selection based on prompt classification and routing rules |
| Session Manager | `src/core/sessionManager.ts` | File-based session persistence to `~/.alexi/sessions/` |
| Streaming Orchestrator | `src/core/streamingOrchestrator.ts` | Real-time streaming support |
| Compaction | `src/compaction/index.ts` | Context compression with multiple strategies |
| Compaction Chunks | `src/core/compaction-chunks.ts` | Splits large contexts into manageable chunks for API limits |
| Network Manager | `src/core/network.ts` | Auto-reconnection with exponential backoff |
| Core Flags | `src/core/flag.ts` | Minimal feature-flag module exposing environment-driven boolean flags consumed by `alexi` (e.g. `KILO_DISABLE_EXTERNAL_SKILLS`). Evaluated once at module load via a private `truthy()` helper that matches `"true"` or `"1"` (case-insensitive). |
| PowerShell Resolver | `src/core/powershell.ts` | Filesystem-only `pwsh.exe` (PowerShell 7) locator used by the Windows shell resolver. Prefers PS 7 over legacy PS 5.1 to avoid UTF-8 / redirected-pipe bugs. See [PowerShell 7 Resolver](#powershell-7-resolver-srccorepowershellts). |
| PTY Process Tree | `src/core/pty/termination.ts` | `/proc`-preferred process tree walker for PTY descendant signalling. Falls back to `ps` on non-Linux or when `/proc` is unavailable. Tolerates `/proc` vanish races (kilocode `aadded4a3`). See [Process Tree Walker](#process-tree-walker-srccorepty-terminationts). |
| Session Overflow | `src/core/session/overflow.ts` | `usableOutputBudget(max, used)` excludes encrypted reasoning tokens from the deduction so reasoning-heavy models do not trigger premature overflow (opencode `17611729e`). |
| Session Processor | `src/core/session/processor.ts` | `evaluateCompleteness(input)` classifies reasoning-only stream endings as `{ status: 'retry', reason: 'reasoning-only' }` when the finish reason is not `stop` (opencode `58eea7381`). |

### Provider Layer

Alexi uses a **single provider architecture** -- all LLM calls route exclusively through SAP AI Core Orchestration API.

| Module | File | Description |
|--------|------|-------------|
| SAP Orchestration | `src/providers/sapOrchestration.ts` | Sole provider via `@sap-ai-sdk/orchestration` |
| Auth | `src/providers/auth.ts` | OAuth token management for SAP AI Core |
| Transform | `src/providers/transform.ts` | Message-format transforms (image chunks, reasoning replay, schema lowering) |
| Model Catalog | `src/providers/modelCatalog.ts` | Live deployment discovery from SAP AI Core (5-minute TTL) |
| Model Match | `src/providers/model-match.ts` | Model ID resolution for deployments |
| Session Headers | `src/providers/sessionHeaders.ts` | HTTP header management for sessions |

Provider resolution:

```typescript
// src/providers/index.ts
function getDefaultModel(): string {
  // 1. AICORE_MODEL env variable
  // 2. ~/.alexi/config.json defaultModel
  // 3. Fallback: 'gpt-4o'
}

function getProviderForModel(modelId: string): SapOrchestrationProvider {
  // Single provider handles all models via SAP AI Core
}
```

The provider index module also kicks off a fire-and-forget refresh of the dynamic model catalog when `AICORE_SERVICE_KEY` is set:

```mermaid
sequenceDiagram
    participant Import as import providers
    participant Index as providers/index.ts
    participant Catalog as modelCatalog.ts
    participant AICore as SAP AI Core DeploymentApi
    participant TUI as StatusBar / ModelPicker

    Import->>Index: module load
    Index->>Index: installHarvestedCAs()
    Index->>Catalog: refreshModelCatalog(resourceGroup)
    Note over Catalog: state = 'loading'
    Catalog->>TUI: notify subscribers
    Catalog->>AICore: deploymentQuery({status:'RUNNING'})
    AICore-->>Catalog: deployment list
    Catalog->>Catalog: merge static + live entries
    Note over Catalog: state = 'ready'
    Catalog->>TUI: notify subscribers
    Catalog->>Catalog: schedule next refresh (5 min)
    Note over Import: getProviderForModel(id) safe from any state
```

Non-live callers (`getProviderForModel`, `isOrchestrationModel`) never block on the catalog — they read from the merged snapshot maintained by `modelCatalog.ts` or fall back to the hardcoded `ORCHESTRATION_MODELS` list when the catalog has not yet loaded. Full details in [`docs/PROVIDERS.md#dynamic-model-catalog`](./PROVIDERS.md#dynamic-model-catalog).

### Tool System

Alexi registers **29 built-in tools** via `registerBuiltInTools()` (the former `warpgrep` / `codebase_search` tool has been extracted to the `alexi-mcp-warpgrep` MCP server — see [`docs/mcp-servers.md`](./mcp-servers.md)):

| Tool | File | Permission | Description |
|------|------|-----------|-------------|
| `bash` | `bash.ts` | execute | Execute shell commands with timeout |
| `read` | `read.ts` | read | Read files and directories (auto-extracts text from `.docx` via mammoth and `.xlsx`/`.xlsm` via xlsx; symlink-escape safeguard when caller sets `ctx.extra.denyDirectory === true` — see [Read tool: `denyDirectory` symlink safeguard](#read-tool-denydirectory-symlink-safeguard)) |
| `write` | `write.ts` | write | Write/create files |
| `edit` | `edit.ts` | write | Exact string replacement in files |
| `glob` | `glob.ts` | read | Find files by pattern |
| `grep` | `grep.ts` | read | Search file contents by regex (appends an "install `@morphllm/morphsdk` for semantic search" hint to its description when `isWarpgrepAvailable()` returns `false`) |
| `task` | `task.ts` | -- | Launch sub-agent tasks (foreground/background) |
| `task_status` | `task_status.ts` | -- | Query background task status |
| `webfetch` | `webfetch.ts` | network | Fetch web content |
| `websearch` | `websearch.ts` | network | Web search |
| `question` | `question.ts` | -- | Ask user questions |
| `todowrite` | `todowrite.ts` | -- | Manage task lists |
| `suggest` | `suggest.ts` | -- | Suggest next actions |
| `delete` | `delete.ts` | write | Delete files |
| `multiedit` | `multiedit.ts` | write | Multiple edits in one call |
| `ls` | `ls.ts` | read | List directory contents |
| `skill` | `skill.ts` | -- | Load specialized skills |
| `definitions` | `definitions.ts` | read | Get code definitions (TS `.ts`/`.tsx`/`.mts`/`.cts`/`.d.ts`, JS `.js`/`.jsx`/`.mjs`/`.cjs`, `.py`, `.sh`/`.bash`) |
| `browser` | `browser.ts` | network | Browser automation |
| `diagnostics` | `diagnostics.ts` | read | Code diagnostics |
| `batch` | `batch.ts` | -- | Batch tool execution |
| `memory` | `memory.ts` | -- | Store/retrieve memories |
| `recall` | `recall.ts` | -- | Recall past sessions |
| `agent-manager` | `agent-manager.ts` | admin | Manage agent instances |
| `apply-patch` | `apply-patch.ts` | write | Apply code patches |
| `repo-clone` | `repo-clone.ts` | execute | Clone repositories |

#### Shell detection and PowerShell fail-fast bootstrap

The `bash` and `shell` tools do NOT rely on `spawn(..., { shell: true })`. They resolve the shell binary themselves via `detectShell()` (`src/tool/tools/shell/id.ts`), then compose a `spawn(file, [...prefixArgs, userCommand, ...suffixArgs], { shell: false })` invocation using `shellSpawnArgs(info)`. This gives the tools three properties `shell: true` could not:

1. **The tool description knows which shell it is talking to.** `shellType` is emitted on `BashResult` so debuggers, tests, and the TUI can display "ran in `pwsh`" vs "ran in `bash`".
2. **Byte-identical passthrough.** The user's command string is passed as its own `spawn` argument. Nothing rewrites it; nothing quotes it. Multibyte characters, embedded quotes, and `param(...)` blocks survive intact.
3. **Per-shell semantics.** `shellSpawnArgs` returns a different prelude for each shell.

The `shellSpawnArgs(info)` contract (`src/tool/tools/shell/id.ts:275`):

```typescript
export function shellSpawnArgs(info: ShellInfo): {
  file: string;
  prefixArgs: string[];
  suffixArgs?: string[];
};
```

- **POSIX shells** (`bash`, `zsh`, `fish`, `sh`, unknown): returns `{ file, prefixArgs: ['-c'] }`. Command is `spawn(file, ['-c', userCommand], ...)`.
- **cmd.exe**: returns `{ file, prefixArgs: ['/d', '/s', '/c'] }`. Command is `spawn(file, ['/d', '/s', '/c', userCommand], ...)`.
- **PowerShell** (`pwsh`, `powershell.exe`): returns `{ file, prefixArgs: ['-NoProfile', '-Command', "$ErrorActionPreference='Stop'; & {"], suffixArgs: ['}'] }`. Command is `spawn(file, ['-NoProfile', '-Command', "$ErrorActionPreference='Stop'; & {", userCommand, '}'], ...)`.

The PowerShell branch is the interesting one. It wraps every user command in a scriptblock `& { <user command> }` that runs under `$ErrorActionPreference='Stop'`. This is the Cline PR #13358 pattern for cline/cline#13285 (mirrored in alexi issue #1456) and it gives PowerShell commands **fail-fast semantics**: the first non-terminating error terminates with a non-zero exit and a single error record, matching what a naive user expects when they run a broken pipeline.

Three properties are preserved deliberately:

- **The user command is byte-identical.** It is passed as its own `spawn` argument that PowerShell joins between the opening `& {` and closing `}`. Alexi never mutates the string.
- **`param(...)` scripts still work.** Because `param` occupies the first-statement position INSIDE the scriptblock braces, scripts starting with `param($x = 5)` still parse. A naive top-level prepend would displace `param` and fail with `CommandNotFoundException`.
- **Per-cmdlet opt-out is intact.** Users who need partial results from an intentionally noisy command can add `-ErrorAction Continue` / `-ErrorAction SilentlyContinue` to the specific cmdlet, or reassign `$ErrorActionPreference` inside their script to restore the old non-fail-fast behaviour.

**Tradeoffs** (documented so the tradeoff is chosen, not accidental):

- `Stop` promotes every non-terminating error, not just per-item pipeline floods. `Get-ChildItem -Recurse` crossing an access-denied junction ("Application Data", "System Volume Information") now aborts at the first denial with truncated output and exit 1, where it previously completed with warnings. Users who need partial results add `-ErrorAction Continue` to the specific cmdlet.
- On Windows PowerShell 5.1, in-script stderr redirection (`2>&1`, `2>file`) of a succeeding native command wraps each stderr line in a `NativeCommandError`; under `Stop` the first one terminates the script. PowerShell 7.2+ exempts native stderr from the preference (PowerShell/PowerShell#3996, #14273). This matches GitHub Actions behaviour on 5.1 today.

**Precedent.** GitHub Actions prepends `$ErrorActionPreference = 'stop'` to every `powershell` / `pwsh` step ([workflow-syntax docs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell)), so model-authored PowerShell commands already run under these semantics in CI. Aligning the bash / shell tools matches that contract, so the same PowerShell script produces the same behaviour whether Alexi runs it locally or via a CI workflow step.

**Regression tests.** `tests/tool/tools/shell/powershell-fail-fast.test.ts` end-to-end-drives `pwsh` (skipped when no `pwsh` / `powershell.exe` is on PATH) and asserts on all four behaviours: fail-fast exit-code, single-error-record bounded stderr, successful commands still succeed (no false-positive Stop), `-ErrorAction Continue` opt-out, and `param(...)` compatibility.

#### Indexing config: custom file extensions

`glob`, `grep`, and `codesearch` extend their default extension whitelist
with a user-configurable list, so modern stacks (`.mdx`, `.astro`,
`.svelte`, `.vue`, `.proto`, `.graphql`, `.tf`, ...) are indexed without
the caller having to spell them out in every `include` pattern.

Extensions are collected from three sources and merged additively (later
sources add to earlier ones; duplicates are de-duped case-insensitively):

1. **Global user config** – `~/.alexi/config.json`
2. **Project config** – `<repo>/.alexi/config.json`
3. **Project extensions file** – `<repo>/.alexi/extensions`

Both config files use the same `indexing` section and accept two fields:

```jsonc
{
  "indexing": {
    // Canonical form: leading dot required, strictly validated.
    "additionalExtensions": [".proto", ".graphql"],
    // Alias: accepts bare names (mdx) OR dotted names (.mdx).
    "extensions": ["mdx", "astro", "svelte", "vue"]
  }
}
```

The `.alexi/extensions` file is a flat text file with one extension per
line. Blank lines and lines starting with `#` are ignored; inline
comments after `#` are stripped. Names may be written with or without a
leading dot.

```text
# Custom extensions for indexing
mdx
astro
svelte    # Svelte components
.vue
```

**Semantics.** Additional extensions are always ADDITIVE — they extend
the set of files a tool considers, they never restrict a caller-provided
`include`. When a caller passes `--include '*.ts'` and the config
declares `mdx`, the effective pattern becomes `*.{ts,mdx}`. When no
`include` is passed, extensions do not narrow the search (`grep` still
searches all files, matching historical behavior).

**Validation.** `additionalExtensions` requires the strict dotted form
(`.proto`); invalid entries throw when written via
`setConfigAdditionalExtensions` and are silently dropped when read
(so a corrupt config never crashes tools). The `extensions` alias is
more permissive (accepts `mdx`, `.mdx`, `MDX`) and normalizes to lower
case dotted form. See `src/config/userConfig.ts` for details.

### Support Systems

| Module | File | Description |
|--------|------|-------------|
| Event Bus | `src/bus/index.ts` | Typed pub/sub event system with Zod validation |
| Permission | `src/permission/index.ts` | Last-match-wins rule evaluation with doom loop detection |
| Sub-agent Blockers | `src/permission/agent-manager.ts` | Fail-closed blocker store (`isBlocked`, `getBlocker`, `answerQuestion`, `setBlocker`) for orchestrator-to-sub-agent unblock flow. Wired into the `agent_manager` tool's `answer` action. See [Sub-agent Blocker Store](#sub-agent-blocker-store-srcpermissionagent-managerts). |
| Agent | `src/agent/index.ts` | Agent registry with built-in + custom agents (**pending autohealing revert as of 2026-07-24 — see [Agent System](#agent-system)**) |
| Hooks | `src/hooks/index.ts` | Lifecycle hooks (command, HTTP, script) with block cap |
| MCP | `src/mcp/index.ts` | Model Context Protocol client/server integration (qualified `${escapedServer}::${tool}` keys — see [MCP tool key composition](#mcp-tool-key-composition)) |
| Skill | `src/skill/index.ts` | Specialized prompt injection for domain tasks |
| Compaction | `src/compaction/index.ts` | Context window management with 4 strategies |
| Telemetry | `src/utils/telemetry.ts` | Usage metrics tracking |
| Reference | `src/reference/index.ts` | External repository references with typed cache |
| Plugin Tools | `src/tool/plugin-tools.ts` | Plugin tool compatibility wrappers |
| Tool Registry | `src/tool/registry.ts` | Enhanced registry with prompt-based tool resolution |

#### Read tool: `denyDirectory` symlink safeguard

The `read` tool (`src/tool/read.ts`) supports an opt-in symlink-escape check driven by the tool-call context. When a caller sets `ctx.extra.denyDirectory === true`, the tool performs a second `realPath` resolution on the incoming `requested` path *after* the initial permission and existence checks and compares the normalized result against the pre-resolved `target`. When the two differ, the call is rejected with `Directory attachments cannot be expanded: <requested>` before any file contents are streamed back to the model.

```mermaid
flowchart TB
    Call([read tool invocation]) --> P{ctx.extra.denyDirectory === true?}
    P -- no --> Normal[Proceed with normal read]
    P -- yes --> R1[resolved = fs.realPath requested]
    R1 --> N{platform === win32?}
    N -- yes --> Norm[FSUtil.normalizePath resolved]
    N -- no --> AsIs[use resolved as-is]
    Norm --> Cmp{target2 === target?}
    AsIs --> Cmp
    Cmp -- yes --> Normal
    Cmp -- no --> Fail[Effect.fail: Directory attachments cannot be expanded]

    Normal --> Read[Stream file contents]
    Fail --> Reject([Tool call rejected])
```

Semantics and scope:

- The safeguard is a defence-in-depth addition on top of the existing rule-based permission model (`src/permission/`, see [Permission System](#permission-system)) and the sandbox root enforced by the tool registry. It does not replace either.
- The check fires **only** when the caller explicitly opts in via `ctx.extra.denyDirectory`. When the flag is unset or `false`, `read` behaves exactly as before (no extra `realPath` call, no comparison, no rejection).
- The compared `target` and `target2` are both `realPath`-resolved values. On POSIX, they are compared byte-for-byte; on Windows, both sides are normalized via `FSUtil.normalizePath` first, so drive-letter case, backslash-vs-forward-slash, and trailing-separator variance do not produce false positives.
- The rejection is an `Effect.fail(new Error(...))` — it flows through the standard tool-call error path, is surfaced to the agent loop as a tool error, and does not throw synchronously.
- The intended threat model is a symlink that lives under an otherwise-permitted parent directory but whose `realPath` target escapes the sandbox. Callers that expand directory attachments (`context`, `session-export`, and any consumer that recursively walks user-supplied paths) should set `denyDirectory: true` when the underlying operation must not follow such symlinks.

The permission-system entry point (`src/permission/next.ts`) is not modified by this change — callers set `ctx.extra.denyDirectory` themselves at the invocation site.

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Orchestrator
    participant Router
    participant Provider as SAP AI Core
    participant Tools
    participant Session

    User->>CLI: Input message
    CLI->>Orchestrator: Process request
    Orchestrator->>Session: Load session history
    Orchestrator->>Router: Classify prompt + select model
    Router-->>Orchestrator: RoutingDecision (modelId, reason, confidence)
    Orchestrator->>Provider: Send messages to LLM
    Provider-->>Orchestrator: CompletionResult (text or tool calls)
    
    alt Tool calls in response
        Orchestrator->>Tools: Execute tool (with permission check)
        Tools-->>Orchestrator: ToolResult
        Orchestrator->>Provider: Continue with tool results
        Provider-->>Orchestrator: Final response
    end
    
    Orchestrator->>Session: Save messages + usage
    Orchestrator-->>CLI: Response text
    CLI-->>User: Display output
```

## Agentic Chat Flow

The agentic chat system (`src/core/agenticChat.ts`) implements an autonomous multi-turn execution loop with context overflow recovery, lifecycle hooks, and compaction:

```mermaid
flowchart TB
    Start([Start Agentic Chat]) --> Init[Initialize Permissions + Tools]
    Init --> SetRoot[Set Project Root + Enable External Dirs]
    SetRoot --> AddRules[Add High-Priority Allow Rules<br/>priority: 200]
    AddRules --> DetermineModel[Route: Classify Prompt + Select Model]
    
    DetermineModel --> BuildMessages[Build Message History]
    BuildMessages --> LoopStart{Iteration < Max?}
    
    LoopStart -->|Yes| CallLLM[Call LLM with Tool Schemas]
    CallLLM --> CheckOverflow{Context Overflow?}
    
    CheckOverflow -->|Yes| Compact[Reactive Compaction<br/>with overflowTokens seed]
    Compact --> CallLLM
    
    CheckOverflow -->|No| CheckTools{Tool Calls?}
    
    CheckTools -->|Yes| ExecTools[Execute Tool Calls in Parallel]
    ExecTools --> CheckPerm[Check Permissions<br/>last-match-wins rules]
    CheckPerm -->|Allowed| RunTool[Run Tool]
    CheckPerm -->|Denied| ReturnError[Return Permission Error]
    
    RunTool --> Hooks[Execute PostToolUse Hooks]
    ReturnError --> Hooks
    Hooks --> CheckBlock{Hook Blocked?}
    CheckBlock -->|Yes + continueOnBlock| FeedBack[Feed Rejection to Model]
    CheckBlock -->|Yes + capped| End
    CheckBlock -->|No| AddToolResult[Add Tool Result to Messages]
    FeedBack --> AddToolResult
    AddToolResult --> LoopStart
    
    CheckTools -->|No| RecordCost[Record Token Usage]
    RecordCost --> SaveSession[Save to Session]
    SaveSession --> End([Return AgenticChatResult])
    
    LoopStart -->|No| MaxReached[Max Iterations Reached]
    MaxReached --> End
```

### Context Overflow Recovery

When the LLM returns a context-length error, the agentic chat detects it via pattern matching and triggers reactive compaction:

```typescript
// Error patterns detected:
const CONTEXT_OVERFLOW_PATTERNS = [
  /context.length/i,
  /context.*exceeded/i,
  /token.*limit.*exceeded/i,
  /max_tokens_exceeded/i,
  // ...
];

// Compaction with overflow seeding:
const { messages: compactedMessages } = await checkAndCompact(
  messages, { strategy: 'summarize', overflowTokens }
);
```

The `overflowTokens` parameter seeds the target summary length so the compacted context fits within limits.

## Routing Decision Flow

```mermaid
flowchart TB
    Input[User Prompt] --> Classify[Classify Prompt]
    
    Classify --> TaskType[Determine Task Type<br/>simple-qa, coding,<br/>deep-reasoning, creative-writing]
    Classify --> Complexity[Assess Complexity<br/>simple, medium, complex]
    
    TaskType --> CheckRules{Custom Routing Rules?}
    Complexity --> CheckRules
    
    CheckRules -->|Matched| ApplyRule[Apply Matched Rule<br/>highest priority wins]
    CheckRules -->|No Match| ScoreModels[Score All Models]
    
    ScoreModels --> Factors[Scoring Factors:<br/>- Cost tier match<br/>- Task type strength<br/>- Reasoning capability<br/>- Cost preference]
    Factors --> SelectBest[Select Highest Score]
    
    ApplyRule --> Decision[RoutingDecision]
    SelectBest --> Decision
    
    Decision --> Return[Return modelId + reason + confidence]
```

### Model Capability Registry

```typescript
interface ModelCapability {
  id: string;
  type: 'openai' | 'claude' | 'gemini';
  costTier: 'cheap' | 'medium' | 'expensive';
  strengths: string[];   // e.g., ['coding', 'deep-reasoning']
  maxTokens: number;
  reasoning: boolean;
}
```

## Event Bus Architecture

The event bus (`src/bus/index.ts`) provides typed pub/sub with Zod schema validation:

```mermaid
graph LR
    subgraph Publishers
        AgenticChat[Agentic Chat]
        ToolSystem[Tool System]
        PermSystem[Permission System]
        SessionMgr[Session Manager]
    end

    subgraph EventBus["Event Bus (defineEvent + BusEvent)"]
        ToolStart[ToolExecutionStarted]
        ToolEnd[ToolExecutionCompleted]
        ToolFail[ToolExecutionFailed]
        PermReq[PermissionRequested]
        PermResp[PermissionResponse]
        AgentSwitch[AgentSwitched]
        MsgRecv[MessageReceived]
        SessCreate[SessionCreated]
        ProviderFB[ProviderModelFellBack]
        CompStart[CompactionStarted]
        CompDone[CompactionComplete]
        ErrOccur[ErrorOccurred]
    end

    subgraph Subscribers
        TUI[TUI Components]
        Telemetry[Telemetry Service]
        Logger[Logger]
        Plugins[Plugins]
    end

    AgenticChat --> ToolStart
    AgenticChat --> ToolEnd
    ToolSystem --> ToolFail
    PermSystem --> PermReq
    PermSystem --> PermResp
    SessionMgr --> SessCreate

    ToolStart --> TUI
    ToolEnd --> TUI
    PermReq --> TUI
    ToolFail --> Logger
    ToolStart --> Telemetry
    ToolEnd --> Telemetry
    AgentSwitch --> Plugins
```

### Event API

```typescript
import { defineEvent, BusEvent } from '../bus/index.js';
import { z } from 'zod';

// Define a typed event
const MyEvent = defineEvent('MyEvent', z.object({
  toolName: z.string(),
  duration: z.number(),
}));

// Subscribe (handler added eagerly to prevent race conditions)
const unsub = MyEvent.subscribe((payload) => {
  console.log(payload.toolName, payload.duration);
});

// Publish
MyEvent.publish({ toolName: 'read', duration: 42 });

// Async publish (waits for all handlers)
await MyEvent.publishAsync({ toolName: 'write', duration: 100 });

// One-time listener
MyEvent.once((payload) => { /* ... */ });

// Wait for event with predicate
const result = await waitForEvent(MyEvent, (p) => p.toolName === 'bash', 5000);
```

### Eager Subscription

Subscriptions are acquired eagerly to prevent race conditions where events could be missed between the `subscribe()` call and the first `listen`. The handler is immediately added to the event handler set before the unsubscribe function is returned.

### Bash / Shell Output Streaming

The bash and shell tools (`src/tool/tools/bash.ts`, `src/tool/tools/shell.ts`) emit incremental `stdout` / `stderr` chunks on the event bus as they arrive from the underlying child process. The final aggregated `stdout` / `stderr` are still returned in the normal `ToolExecutionCompleted` payload; the streaming path is purely additive for TUI rendering of progress bars, `npm install` output, and long test runs (issue #1442).

```mermaid
sequenceDiagram
    participant Agent as Agentic Chat
    participant Tool as Bash Tool
    participant Reg as CommandLogRegistry<br/>(bash-streaming.ts)
    participant Bus as Event Bus
    participant TUI as TUI (useToolEvents)

    Agent->>Tool: execute({ command })
    Tool->>Bus: ToolExecutionStarted { toolId }
    Bus->>TUI: ToolExecutionStarted -> addToolCall(row)
    Tool->>Reg: registerCommandLog { pid, toolId, startedAt } -> logId
    Note over Tool,Reg: registered BEFORE any 'data' handler fires

    loop for every stdout / stderr 'data' event
        Tool->>Reg: appendCommandLog(logId, chunk)
        Tool->>Bus: BashOutputChunk { toolId, logId, stream, chunk }
        Bus->>TUI: appendToolCallOutput(toolId, chunk)
        Note over TUI: reducer APPEND_TOOL_CALL_OUTPUT<br/>live-appends to row.output
    end

    Tool->>Reg: markCommandLogFinished(logId)
    Note over Reg: enters COMPLETED_LOG_RETENTION_MS<br/>window (60s) for reconnect replay
    Tool->>Bus: ToolExecutionCompleted { toolId, result }
    Bus->>TUI: updateToolCall(row, { status: 'completed', output: aggregated })
    Note over TUI: final output replaces streamed chunks<br/>(may be truncated / normalised)
```

The `BashOutputChunk` payload is defined in `src/bus/index.ts:325`:

```typescript
export const BashOutputChunk = defineEvent(
  'bash.output.chunk',
  z.object({
    toolId: z.string(),  // matches ToolExecutionStarted / Completed
    logId: z.string(),   // matches command-log registry entry
    stream: z.enum(['stdout', 'stderr']),
    chunk: z.string(),
    timestamp: z.number(),
  })
);
```

Design invariants of the command-log registry (`src/tool/tools/bash-streaming.ts`):

1. **PID-reuse defence**: logs are keyed by a synthetic `logId` (nanoid) rather than the OS PID. `getCommandLogByPid(pid, startedAt)` cross-references the recorded PID plus `startedAt` timestamp, so a subsequent process that happens to reuse the same PID cannot collide with the earlier entry. Callers requiring a stable identifier must match on `logId`.
2. **Probe-outage retention**: completed logs are retained for `COMPLETED_LOG_RETENTION_MS` (60 seconds) after `markCommandLogFinished`, so a TUI hub that briefly drops its subscription (probe outage, hot reload) can still fetch the tail on reconnect. Entries are dropped by `cleanupCompletedLogs`, which is auto-triggered on each new `registerCommandLog`.
3. **Bounded memory**: each log has an in-memory append buffer capped at `MAX_LOG_BYTES` (32 KB). When the cap is exceeded, the oldest bytes are dropped (snapping forward to the next newline within 1 KB) and a `[... older output evicted from streaming buffer ...]` truncation marker is inserted. The authoritative full output still lives in the process's own `stdout` accumulator (bash.ts) or on disk (`persistLargeOutput`).
4. **Telemetry-safe publish**: `BashOutputChunk.publish` is wrapped in `try { … } catch { /* never let telemetry take down a running command */ }` so a failing bus subscriber cannot tear down the running child process.
5. **Abort cleanup**: `cleanupCommandLog(logId)` reaps a log unconditionally. The bash tool calls it on `close`, on `error`, and from the abort-signal handler, so a cancelled command does not leak into the registry.

The TUI consumes the stream via `useToolEvents` (`src/cli/tui/hooks/useToolEvents.ts`), which subscribes to `BashOutputChunk` alongside `ToolExecutionStarted` / `Completed` / `Failed`. Chunks are dispatched into the `ChatContext` reducer as `APPEND_TOOL_CALL_OUTPUT`, which live-appends to the active row's `output` without moving the entry between the `activeToolCalls` and `completedToolCalls` buckets. On completion, the `ToolExecutionCompleted` handler replaces `output` with the final aggregated payload from the tool result — this may be truncated or normalised differently (carriage returns, head-and-tail elision) than the raw streamed chunks.

## Native OS Notifications

Alexi surfaces desktop notifications when a streaming chat completes cleanly or when a long-running bash command finishes. The implementation lives in `src/core/notifications.ts` and is wired into `src/core/streamingOrchestrator.ts` and `src/tool/tools/bash.ts`.

### Design goals

The module has three responsibilities that are worth stating explicitly because they inform every branch of the code:

1. **Never crash the CLI.** A missing native binary (`terminal-notifier`, `notify-send`, `snoretoast`), a broken `node-notifier` load, a platform-specific dispatch error, or an unwritable config file all resolve `false` after `logger.debug`. There is no code path in which a failed notification can throw.
2. **Never surprise CI or agents.** Non-interactive contexts (no TTY, `CI=1`, `ALEXI_NO_NOTIFICATIONS=1`, or an `ask` decision with no attached terminal) short-circuit before any prompt or dispatch. Agent workflows and GitHub Actions runs never trigger a desktop alert.
3. **Ask once, remember forever.** The first interactive call with an unset `notifications` key prompts via `@inquirer/prompts` `confirm`; the answer is persisted to `~/.alexi/config.json` under the `notifications` key as `allow` or `deny`. Subsequent calls resolve the decision on every invocation so a user who edits the config from `deny` to `allow` mid-session sees the change on the next completion event.

### Decision flow

```mermaid
flowchart TD
    Call([sendNotification/<br/>notifyInBackground])
    ReadCfg[Read ~/.alexi/config.json<br/>notifications key]
    Decision{decision?}
    Ask{isInteractiveEnv?}
    Skip[Return false<br/>silently skip]
    Prompt[inquirer confirm<br/>Allow desktop notifications?]
    Persist[Persist decision<br/>best-effort]
    LoadNotifier[Cached dynamic import<br/>node-notifier]
    NotifierOk{notifier<br/>available?}
    Dispatch[notifier.notify payload<br/>title/message/icon/sound/wait]
    Success[Return true]
    Error[logger.debug<br/>Return false]

    Call --> ReadCfg
    ReadCfg --> Decision
    Decision -->|deny| Skip
    Decision -->|ask| Ask
    Ask -->|no TTY / CI| Skip
    Ask -->|TTY| Prompt
    Prompt -->|allow| Persist
    Prompt -->|deny| Persist
    Persist --> Decision
    Decision -->|allow| LoadNotifier
    LoadNotifier --> NotifierOk
    NotifierOk -->|no| Error
    NotifierOk -->|yes| Dispatch
    Dispatch -->|err| Error
    Dispatch -->|ok| Success
```

### Public surface

```typescript
// src/core/notifications.ts
export type NotificationDecision = 'allow' | 'deny' | 'ask';

export interface SendNotificationOptions {
  icon?: string;
  sound?: boolean;
  wait?: boolean;
  __notifierOverride?: NotifierLike; // tests only
  __askOverride?: (title: string, message: string) => Promise<boolean>; // tests only
}

export const LONG_RUNNING_THRESHOLD_MS = 30_000;

export function isInteractiveEnv(): boolean;
export function getNotificationDecision(): NotificationDecision;
export function setNotificationDecision(decision: NotificationDecision): void;
export function sendNotification(
  title: string,
  message: string,
  options?: SendNotificationOptions
): Promise<boolean>;
export function notifyInBackground(
  title: string,
  message: string,
  options?: SendNotificationOptions
): void;
```

`isInteractiveEnv()` returns `false` when `ALEXI_NO_NOTIFICATIONS=1`, when `CI` is set to any value other than `0` / `false`, or when either `process.stdin` or `process.stdout` is not a TTY. `getNotificationDecision()` coerces malformed persisted values back to `'ask'` so callers never see arbitrary strings. `notifyInBackground` is the fire-and-forget wrapper — it discards the promise safely and inherits `sendNotification`'s no-throw guarantee.

### Call sites

Two call sites currently invoke `notifyInBackground`:

- **`src/core/streamingOrchestrator.ts:344`** — fires `notifyInBackground('Alexi', 'Task completed')` only when the streaming loop exits via the `completedCleanly` branch. Aborts (`AbortSignal`), provider errors, context-overflow retries, and rate-limit backoffs do NOT fire a completion alert, so "task completed" is a truthful signal.
- **`src/tool/tools/bash.ts`** — fires `notifyInBackground('Command finished', description ?? command)` in two cases: (a) a detached command's final exit event (by definition long-running because the user picked "Proceed" only after `DETACH_PROMPT_MS`), and (b) a foreground command whose wall-clock elapsed time is `>= LONG_RUNNING_THRESHOLD_MS` (30 seconds). Short-running foreground commands (`ls`, `git status`) never fire — the notification is only useful when the user has switched context.

Both sites gate on the shared `notifications` config key, so a single `deny` decision silences both surfaces without any per-caller wiring.

### Dependency loading

`node-notifier` is loaded via a cached dynamic import in `loadNotifier()`. The cache is a three-state variable (`undefined` = not attempted, `null` = attempted and failed, `NotifierLike` = ready) so users who deny notifications never pay the native-binary probe cost — the module is only imported on the first `allow` call. `_resetNotifierCacheForTests()` clears the cache for unit tests. The `NotifierLike` interface is deliberately reduced to the single `notify(options, callback?)` method Alexi uses so `@types/node-notifier` is a devDependency rather than a hard runtime type import and tests can pass inline mocks.

## Agent System

> **Build status (2026-07-24):** the 2026-07-24 upstream sync (commit `530351f4`) destructively replaced `src/agent/index.ts` with a 3-line broken import stub (`import { newAgentPatterns } from 'packages/opencode/src/agent/agent';`). The agent-registry surface documented in this section — `AgentRegistry`, the five built-in agents, `stripInternalOptions`, `INTERNAL_OPTION_KEYS`, `getAgentRegistry` / `switchAgent` / `parseAgentMention`, and the `AgentSwitched` bus event — is currently unresolvable and breaks the build. Seven downstream modules import from `src/agent/index.js` and are all failing to type-check: `src/core/agenticChat.ts`, `src/core/streamingOrchestrator.ts`, `src/cli/commands/chat.ts`, `src/config/modes-migrator.ts`, `src/server/index.ts`, `src/tool/tools/task.ts`, and the tests in `src/agent/index.test.ts` / `src/core/__tests__/agenticChat.test.ts`. Autohealing must revert the file to its pre-sync content (parent commit `9f9fad90`); see the corresponding CHANGELOG `### Removed` entry for the full recovery specification. The rest of this section describes the intended runtime shape once the file is restored.

> **Build status (2026-07-26 addendum):** the 2026-07-26 upstream sync (commit `0985297e`, version bump `1.18.11` → `1.18.12`) did **not** touch `src/agent/index.ts` — the file remains in the broken state described in the 2026-07-24 note above. The 2026-07-26 sync did, however, add a new 5-line orphan file `src/agent/instance-advertisement.ts` under this same `src/agent/` directory, exporting a stray `advertiseInstance(instanceId: string): void` function that only calls `console.log` and has no consumer anywhere in the source tree. It is **not** part of the intended agent surface documented in this section — Alexi does not have an "instance advertisement" primitive; multi-agent coordination is owned by the `AgentRegistry` in `src/agent/index.ts` (once restored) and per-invocation dispatch by `src/core/agenticChat.ts` / `src/core/streamingOrchestrator.ts`. The file violates the project-wide `no-console` ESLint rule (only `src/utils/logger.ts` may use `console`) and is pending autohealing deletion; see the CHANGELOG `### Added` entry for 2026-07-26 for the disposition. Two further 2026-07-26 orphan stubs were also added outside this section — `src/cli/remote.ts` (a broken `executeRemoteCommand` scaffold; see [CLI Layer](#cli-layer)) and `src/context/global-sync/bootstrap.ts` + `src/context/server-session-reducer.ts` (broken context-module scaffolds).

```mermaid
classDiagram
    class AgentRegistry {
        -agents: Map~string, Agent~
        +register(config: AgentConfig): void
        +get(id: string): Agent
        +list(mode?: AgentMode): Agent[]
        +loadCustomAgents(workdir?: string): Promise~number~
    }

    class Agent {
        +id: string
        +name: string
        +mode: AgentMode
        +systemPrompt: string
        +tools?: string[]
        +disabledTools?: string[]
        +canUseTool(toolId: string): boolean
    }

    class CustomAgentConfig {
        +sourcePath?: string
        +source: AgentSource
    }

    AgentRegistry --> Agent
    Agent <|-- CustomAgentConfig

    note for AgentRegistry "Singleton via getAgentRegistry()"
    note for Agent "Built-in: code, debug, plan, explore"
```

### Built-in Agents

| ID | Name | Mode | Purpose |
|----|------|------|---------|
| `code` | Code Agent | all | General-purpose coding (default) |
| `debug` | Debug Agent | all | Debugging and fixing issues |
| `plan` | Plan Agent | all | Architecture and planning (read-only tools) |
| `explore` | Explore Agent | subagent | Fast codebase exploration |

### Custom Agent Loading

Custom agents are loaded from markdown files with YAML frontmatter:

```markdown
---
slug: my-agent
name: My Custom Agent
mode: primary
tools: [read, write, edit, bash]
---

You are a specialized agent for...
```

Agents support `{file:path/to/file}` inclusions (recursive, max depth 3) resolved relative to the agent file's directory.

Loading order (lowest precedence first, duplicates overwrite):
1. `~/.alexi/agents/*.md` (user-global)
2. `.alexi/agents/*.md` (project-local)

## Hooks System

The hooks system (`src/hooks/index.ts`) provides lifecycle callbacks for tool execution and session events:

```typescript
interface HookDefinition {
  event: HookEvent;    // SessionStart, PreToolUse, PostToolUse, Stop, etc.
  type: HookType;      // 'command' | 'http' | 'script'
  command?: string;    // Shell command with template variables
  url?: string;        // HTTP endpoint
  script?: string;     // JS/TS file path
  timeout?: number;    // Default: 30000ms
  continueOnBlock?: boolean; // Feed rejection back to model
}
```

Key features:
- **Block Cap**: Consecutive Stop hook rejections are capped to prevent infinite loops
- **continueOnBlock**: When a hook rejects, the error is fed back to the model instead of halting
- **Template Variables**: Hook commands support `{​{toolName}}`, `{​{sessionId}}`, etc.

### `contextModification` payloads and `displayRole` hiding

Both `PreToolUse` and `PostToolUse` hooks can return a `contextModification` string. The agentic loop (`src/core/agenticChat.ts`) collects them across every tool call in an iteration and, once every tool result for that iteration has been appended, flushes them as stamped user messages in a fixed order:

1. Every `PreToolUse` payload for the iteration is emitted first, each wrapped as `<hook_context tool_name=\"…\" tool_call_id=\"…\" phase=\"pre\">…</hook_context>`.
2. Then every `PostToolUse` payload is emitted, wrapped as `<hook_context tool_name=\"…\" tool_call_id=\"…\">…</hook_context>` (no `phase` attribute — the omission preserves backwards compatibility with prompts that already reference the un-phased envelope).

Each payload is markup-sanitized via `sanitizeHookContext` (`src/utils/markup-sanitize.ts`): embedded `<hook_context>` tags are HTML-escaped so a malicious or buggy hook cannot break out of the envelope, forge a different `tool_name`, or spoof a `phase`. Each payload is also independently truncated to `MAX_HOOK_CONTEXT_BYTES` (50 KB, matching upstream Cline) inside `parseContextModification` — before it ever reaches the agent loop — so a runaway hook cannot drown the model prompt.

`contextModification` on a hook result whose `success` is `false` is intentionally dropped: rejection handling (halt or `continueOnBlock` feedback) always takes precedence and no `<hook_context>` block is injected for a failed hook.

Introduced in 1.21.4 (issue #1466): the same messages that reach the model are ALSO persisted to the session with `displayRole: 'system'` so they are hidden from the user-facing transcript (TUI `MessageArea`, `sessions export`, `SessionReplay`). This gives hook authors an \"instrument the model, don't clutter the user\" primitive.

```mermaid
flowchart TB
    Hook[PostToolUse hook returns<br/>contextModification: 'lint warnings ...']
    Sanitize[sanitizeHookContext<br/>escape embedded tags]
    Stamp[Wrap in &lt;hook_context&gt; envelope<br/>stamp tool_name + tool_call_id]
    Model[Push into messages array<br/>-&gt; next provider.complete call]
    Session[sessionManager.addMessage<br/>role='user'<br/>displayRole='system']
    TUI[MessageArea filter:<br/>hide displayRole=='system']
    Replay[SessionReplay filter:<br/>hide displayRole=='system'<br/>even when showSystemMessages=true]

    Hook --> Sanitize
    Sanitize --> Stamp
    Stamp --> Model
    Stamp --> Session
    Session --> TUI
    Session --> Replay
```

Contract:

- The provider always receives the message with its logical `role` (`'user'` for hook context). `displayRole` is a UI-only filter.
- `MessageArea` filters `messages.filter(m => m.displayRole !== 'system')` before rendering. When every message is filtered, the empty-state placeholder ("Start a conversation…") appears.
- `SessionReplay.replay(messages, opts)` hard-hides `displayRole: 'system'` even when `showSystemMessages: true`. Real `role: 'system'` messages (the actual system prompt) remain visible when that option is set.
- `SessionManager.addMessage(role, content, tokens?, options?)` accepts either the raw `displayRole` string or an options object (`{ displayRole }`) as its fourth argument for backwards compatibility with three-argument call sites.
- Auto-title generation (`activeSession.metadata.title` from the first user message) skips messages carrying any `displayRole` value, so hook payloads cannot end up as the session title.

## Compaction System

Context compaction manages conversation length when approaching token limits:

| Strategy | Description |
|----------|-------------|
| `truncate` | Remove oldest messages beyond limit |
| `summarize` | AI-powered summarization of old messages |
| `sliding` | Sliding window keeping recent messages |
| `smart` | Hybrid: importance scoring + summarization |

### Reactive Seeding

When context overflow is detected during LLM calls, the system calculates optimal summary size:

```typescript
const targetSummaryTokens = Math.max(
  1,
  Math.floor(totalOldTokens - overflowTokens * 1.5)
);
// Appended to summary prompt:
// "Keep your summary under approximately N tokens."
```

### Chunked Compaction

Large contexts are split into chunks at natural boundaries (newlines, paragraphs) before compaction:

```typescript
import { compactInChunks } from './compaction-chunks.js';

const result = await compactInChunks(content, async (chunk) => {
  return await summarize(chunk);
}, 100000); // max tokens per chunk
```

### Compaction Lifecycle Events

Compaction can take several seconds on large sessions — long enough that the
UI needs to distinguish "still working" from "hung". `src/core/compaction.ts`
publishes two typed events through the event bus (`src/bus/index.ts`) so any
subscriber (TUI, telemetry, plugins) can observe start/finish transitions:

```typescript
// src/bus/index.ts
export const CompactionStarted = defineEvent(
  'compaction.started',
  z.object({
    sessionId: z.string().optional(),
    messageCount: z.number(),
    estimatedTokens: z.number().optional(),
    trigger: z.enum(['auto', 'manual', 'partial']).optional(),
    timestamp: z.number(),
  })
);

export const CompactionComplete = defineEvent(
  'compaction.complete',
  z.object({
    sessionId: z.string().optional(),
    originalMessages: z.number(),
    compactedMessages: z.number(),
    estimatedTokensSaved: z.number(),
    durationMs: z.number(),
    trigger: z.enum(['auto', 'manual', 'partial']).optional(),
    error: z.string().optional(),
    timestamp: z.number(),
  })
);
```

Key invariants enforced by `compactConversation()` and `partialCompact()`:

- `CompactionStarted` is only published once real work begins — the
  early-return branches (empty input, messages below `preserveLastN`, generous
  target buffer) never emit lifecycle events, so consumers do not see spurious
  "Compacting…" flashes for no-op calls.
- `CompactionComplete` is emitted from a `try/finally` guard so it fires even
  when summary generation throws. The `error` field carries the message. This
  prevents the TUI from getting stuck on the spinner if the summarizer errors.
- Bus publish failures are swallowed inside the emit helpers so a broken
  subscriber cannot break compaction itself.
- The `trigger` discriminator lets subscribers separate normal auto-compaction
  (`'auto'`), user-invoked compaction (`'manual'`), and rewind/summarize
  partial compaction (`'partial'`).

The Ink TUI `StatusBar` (`src/cli/tui/components/StatusBar.tsx`) subscribes to
both events to show a "Compacting context..." spinner segment while
compaction is running, matching the existing streaming-spinner pattern:

```tsx
const [isCompacting, setIsCompacting] = React.useState(false);

React.useEffect(() => {
  const unsubStart = CompactionStarted.subscribe(() => setIsCompacting(true));
  const unsubComplete = CompactionComplete.subscribe(() => setIsCompacting(false));
  return () => {
    unsubStart();
    unsubComplete();
  };
}, []);
```

```mermaid
sequenceDiagram
    participant Caller as Agentic Chat / Rewind
    participant Compact as compactConversation()
    participant Bus as Event Bus
    participant TUI as StatusBar (Ink)

    Caller->>Compact: messages, options
    alt No work required (early return)
        Compact-->>Caller: unchanged messages
    else Real compaction
        Compact->>Bus: publish CompactionStarted<br/>{trigger, messageCount, estimatedTokens}
        Bus-->>TUI: setIsCompacting(true)
        Note over Compact: Summarize (LLM or fallback),<br/>chunk if oversized
        alt Success
            Compact->>Bus: publish CompactionComplete<br/>{compactedMessages, tokensSaved, durationMs}
        else Error thrown
            Compact->>Bus: publish CompactionComplete<br/>{error, durationMs} (finally block)
            Compact-->>Caller: re-throw
        end
        Bus-->>TUI: setIsCompacting(false)
        Compact-->>Caller: CompactionResult
    end
```

## Rewind Command

The `/rewind` command (`src/command/rewind.ts`) provides conversation history manipulation by allowing users to navigate to a specific turn boundary and either discard or summarize messages:

```mermaid
flowchart TB
    Input["/rewind [turn] [--summarize]"] --> Parse[Parse Arguments]
    Parse --> HasTurn{Turn Number?}
    
    HasTurn -->|No| List[List Turn Boundaries]
    HasTurn -->|Yes| HasSummarize{--summarize?}
    
    HasSummarize -->|Yes| Summarize[Summarize Mode]
    HasSummarize -->|No| Discard[Discard Mode]
    
    List --> ShowBoundaries[Show User Messages<br/>with Turn Numbers]
    
    Discard --> FindBoundary[Find Turn Boundary]
    FindBoundary --> KeepUpTo[Keep Messages Up To Turn End]
    KeepUpTo --> UpdateSession[Update Session Messages]
    
    Summarize --> FindBoundary2[Find Turn Boundary]
    FindBoundary2 --> PartialCompact[partialCompact: Summarize<br/>Messages Before Turn]
    PartialCompact --> InsertSummary[Insert Summary as<br/>System Message]
    InsertSummary --> KeepFrom[Keep Messages From Turn Onward]
    KeepFrom --> UpdateSession
    
    UpdateSession --> Result[Return RewindResult]
```

### Turn Boundaries

A "turn" is defined as starting at each user message (system messages are ignored). The rewind system identifies these boundaries and allows navigation:

```typescript
interface TurnBoundary {
  turnNumber: number;
  messageIndex: number;
  preview: string;        // First 50 chars of user message
  role: Message['role'];
}
```

### Rewind Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `list` | Show all turn boundaries | Explore conversation structure |
| `discard` | Remove messages after turn N | Undo recent conversation turns |
| `summarize` | Compress messages before turn N | Free context while preserving history |

The summarize mode delegates to `partialCompact()` from the compaction system, which uses the configured LLM summarize function to create a `[CONVERSATION SUMMARY]` system message.

## Code Review Command

The `code-review` command (`src/command/codeReview.ts`) runs a structured correctness-bug review
over `git diff`. The same `executeCodeReview` core is exposed through three surfaces:

| Surface | Entry point | File |
|---------|-------------|------|
| Non-interactive CLI | `alexi code-review` | `src/cli/commands/codeReview.ts` |
| Legacy interactive REPL | `/code-review [effort]` | `src/cli/interactive.ts` (`handleCommand`) |
| Ink TUI slash command | `/code-review [effort]` | `src/cli/tui/hooks/useCommands.ts` |

The executor reads the diff with `child_process.execFile('git', ['diff', ...])` (no shell) so
user-provided `--base <branch>` values cannot be interpreted as shell metacharacters. Reusing
`execFile` instead of the bash tool also keeps the executor self-contained and easy to mock in
unit tests.

```mermaid
flowchart TB
    Entry["alexi code-review<br/>or /code-review"] --> Opts[Parse effort and target]
    Opts --> Diff["readGitDiff()<br/>execFile('git', ['diff', ...])"]
    Diff --> Empty{Diff empty?}
    Empty -->|Yes| Skip["Return: 'No changes to review.'<br/>modelUsed=''  totalTokens=0"]
    Empty -->|No| Pick["pickModelForEffort(effort)"]
    Pick --> Override{modelOverride set?}
    Override -->|Yes| UseOverride[Use modelOverride]
    Override -->|No| ByEffort{effort?}
    ByEffort -->|high| Reasoning["Find reasoning + expensive model<br/>fallback: any expensive<br/>fallback: getDefaultModel()"]
    ByEffort -->|low| Cheap["Find costTier='cheap'<br/>fallback: getDefaultModel()"]
    ByEffort -->|medium| Default["getDefaultModel()"]
    Reasoning --> Build
    Cheap --> Build
    Default --> Build
    UseOverride --> Build["buildSystemPrompt(effort)<br/>= EFFORT_PREAMBLE + codeReviewSkill.prompt"]
    Build --> Send["sendChat(diff, { modelOverride, systemPrompt })"]
    Send --> Result[Return CodeReviewResult]
```

### Effort levels

The effort level controls both the system prompt preamble and the model selection:

| Effort | Preamble | Model preference |
|--------|----------|------------------|
| `low` | "Focus only on critical correctness bugs. Skip style and nice-to-haves." | `costTier === 'cheap'` |
| `medium` | _(none)_ | `getDefaultModel()` |
| `high` | "Be thorough: trace edge cases, race conditions, error handling, security implications, and test coverage gaps." | `reasoning === true` AND `costTier === 'expensive'` |

The base system prompt is the `code-review` skill prompt from `src/skill/skills/index.ts`,
preserving the structured `MUST FIX / SHOULD IMPROVE / NICE TO HAVE` review format.

### Targets

```typescript
export type CodeReviewTarget = 'uncommitted' | { base: string };
```

- `'uncommitted'` (default) → `git diff HEAD`
- `{ base: 'main' }` → `git diff main...HEAD`

The non-interactive CLI exposes both targets via `--base <branch>`. The interactive slash
commands only review uncommitted changes; use the CLI for base-branch reviews.

### Cancellation

The legacy REPL slash command creates a dedicated `AbortController` for the review and stores
it as `state.abortController` so Ctrl+C cancels the in-flight review without cancelling the
session. The original abort controller is restored in a `finally` block. The executor itself
checks `opts.signal?.aborted` before reading the diff and again before invoking the model.

### Empty-diff fast path

When `git diff` returns an empty string the executor returns
`{ success: true, review: 'No changes to review.', modelUsed: '', totalTokens: 0 }` without
invoking `sendChat`. Both interactive surfaces and the CLI handle this transparently.

## Network Management

The `NetworkManager` class (`src/core/network.ts`) provides automatic reconnection with exponential backoff to prevent session loss during network interruptions:

```typescript
class NetworkManager extends EventEmitter {
  // Exponential backoff with configurable parameters
  maxRetries: number;     // Default: 5
  baseDelayMs: number;    // Default: 1000ms
  maxDelayMs: number;     // Default: 30000ms
}
```

Events emitted: `reconnect:attempt`, `reconnect:success`, `reconnect:failed`.

## Error Handling

Alexi classifies runtime errors into two categories and applies different
policies to each:

- **Transient errors** are network- or timing-driven failures that a retry
  with backoff can plausibly resolve. Retry is bounded by an explicit
  attempt budget; each attempt waits an exponentially growing delay.
- **Permanent errors** are configuration, authentication, or shape errors
  that will not improve with more attempts. Retry is skipped so the
  attempt budget is not wasted on inputs that cannot succeed, and the
  underlying cause is surfaced with an actionable hint.

The rule of thumb across the codebase: **transient -> retry with backoff;
permanent -> fail fast with an actionable message**. Agent workflows and
human operators can rely on this contract to diagnose why a connection
attempt failed after 1 try (permanent) versus 3 tries (transient budget
exhausted).

### Error classification tables

The following patterns are treated as transient (safe to retry) throughout
Alexi and its CI wrappers:

| Pattern                                | Where classified                      |
| -------------------------------------- | ------------------------------------- |
| `socket hang up`                       | `.github/workflows/*.yml` retry loops |
| `ECONNRESET`                           | `TRANSIENT_ERROR_CODES` in `src/mcp/client.ts`, CI retry loops |
| `ECONNREFUSED`                         | `TRANSIENT_ERROR_CODES` in `src/mcp/client.ts` |
| `ETIMEDOUT`                            | `TRANSIENT_ERROR_CODES` in `src/mcp/client.ts`, CI retry loops |
| `ENOTFOUND`                            | CI retry loops (`ci-auto-fix.yml`, `documentation-update.yml`) |
| `EPIPE`, `EAGAIN`, `EBUSY`             | `TRANSIENT_ERROR_CODES` in `src/mcp/client.ts` |
| `fetch failed`                         | CI retry loops                        |
| HTTP `502`, `503`, `429` / `rate limit`| Agent factory retry regex, kilo run wrappers |
| MCP `startup timeout for server ...`   | `classifyConnectError` in `src/mcp/client.ts` |
| `xai capacity exceeded` / `capacity exceeded` (message match) | `isXAICapacityError` in `src/core/error-backoff.ts` |

The following patterns are treated as permanent (must NOT be retried) and
require operator intervention:

| Pattern                                | Where classified                      |
| -------------------------------------- | ------------------------------------- |
| HTTP `401`, `403` (auth)               | `classifyRouteError` in `src/core/router.ts` |
| HTTP `404` / `model_not_found` / `deployment_not_found` | `classifyRouteError` (route auto-disable) |
| HTTP `400`, `422` (validation)         | Provider layer; not retried           |
| `ENOENT` (command not found)           | `CONFIG_ERROR_CODES` in `src/mcp/client.ts` |
| `EACCES`, `ENOTDIR`, `EPERM`           | `CONFIG_ERROR_CODES` in `src/mcp/client.ts` |
| `missing environment variable ...`     | `findMissingEnvVars` in `src/mcp/client.ts` |
| `command not found` / `no such file or directory` | `classifyConnectError` in `src/mcp/client.ts` |

Note the split between routing errors and MCP errors. `src/core/router.ts`
owns provider-side HTTP status classification for route auto-disable; MCP
owns local child-process and system-call error classification. Transient
5xx / network failures at the provider layer are NOT recorded via
`recordRouteOutcome` -- they remain owned by `ErrorBackoff`.

### Exponential backoff formula

Every retry site in Alexi uses the same formula:

```text
delay = min(initialDelay * 2^(attempt - 1), maxDelay)
```

`attempt` is 1-indexed, so the first retry waits exactly `initialDelay`,
the second waits `initialDelay * 2`, and so on until `maxDelay` clamps
further growth. The canonical implementation is
`computeBackoffDelayMs(retryIndex, initialDelayMs, maxDelayMs)` in
`src/mcp/client.ts` (also mirrored inline in `NetworkManager` and
`ErrorBackoff`).

Concrete backoff sequences for the defaults each site ships with:

| Site                          | `initialDelay` | `maxDelay` | `maxAttempts` | Delay sequence (ms)                |
| ----------------------------- | -------------- | ---------- | ------------- | ---------------------------------- |
| MCP connect retry             | 1000           | 4000       | 3             | 1000, 2000                         |
| `NetworkManager` reconnect    | 1000           | 30000      | 5             | 1000, 2000, 4000, 8000             |
| `ErrorBackoff` (provider API) | 1000           | 60000      | 5             | 1000, 2000, 4000, 8000, 16000      |

`NetworkManager` and `ErrorBackoff` allow the caller to override every
field via the constructor options block; MCP retry defaults are documented
inline in `src/mcp/config.ts` and can be overridden per-server in
`mcp-servers.json`.

### Stream / provider error retry policy

Provider-layer failures during a chat completion or streaming call flow
through two independent mechanisms:

- **`ErrorBackoff` (`src/core/error-backoff.ts`)** — a circuit-breaker
  primitive. `recordError(statusCode?)` increments the consecutive-error
  counter, computes an exponential-backoff delay
  (`initialDelayMs * multiplier^(n-1)`, clamped at `maxDelayMs`), and
  arms `shouldBackoff()` for the length of that delay. A `4xx` status
  additionally flips `isFatal()` so the caller can distinguish "wait and
  retry" from "stop, this will not recover". `recordSuccess()` resets the
  counter on any successful call. Status codes are extracted from raw
  error messages with `extractStatusCode(errorMessage)`, which matches
  `status: NNN` for 4xx/5xx values only.
- **`isRetryableError(err)` in `src/core/error-backoff.ts`** (added 1.21.4, port of opencode `71d08e9`) — a coarse "is this transient?" check consulted by higher-level retry drivers. Returns `true` when `isRateLimitError(err)` OR `isXAICapacityError(err)` returns true, `false` for `null` / `undefined` and for permanent auth failures. Extend cautiously — a false positive means real config failures get retried and waste provider budget.
- **`isXAICapacityError(err)` in `src/core/error-backoff.ts`** — matches `err.message` against `/xai.*capacity|capacity.*exceeded/i`. xAI (and some SAP proxies fronting xAI-family models) occasionally emits a mid-stream "capacity exceeded" error that is semantically the same as a 5xx transient overload; without this classifier such errors would be treated as permanent and surface to the user as a hard failure. Detection is intentionally structural (message regex) because the upstream API does not attach a stable machine-readable code.
- **`classifyRouteError` in `src/core/router.ts`** — a permanent-failure
  classifier. Returns `{ kind: 'aborted' }` for user-initiated Ctrl+C
  (short-circuits so aborts never poison route health), `{ kind:
  'permanent' }` for HTTP 401/403/404 and `model_not_found` /
  `deployment_not_found` messages, and `{ kind: 'unknown' }` otherwise.
  Only `permanent` outcomes are fed to `recordRouteOutcome`, which
  disables a route after `routeFailureThreshold` (default 3) consecutive
  permanent failures. A single success resets the counter.

Example error messages and their classification:

- `Error: fetch failed: socket hang up` -> transient. Retried by the CI
  retry-with-backoff wrappers and by `ErrorBackoff` at the provider layer.
- `HTTP 429 Too Many Requests` -> transient. Retried; the CI regex
  matches `429` and `rate limit`.
- `status: 503 Service Unavailable` -> transient. `ErrorBackoff.recordError(503)`
  arms a backoff but does not mark the route fatal.
- `status: 401 Unauthorized` -> permanent. `classifyRouteError` returns
  `permanent`; the caller must not retry, and `ErrorBackoff.isFatal()`
  becomes true so the loop exits.
- `Error: model_not_found` -> permanent. `classifyRouteError` records a
  permanent outcome and, after `routeFailureThreshold` matches, disables
  the route for the rest of the session.

### MCP connection retry policy

MCP has TWO independent timeout budgets and a separate retry policy on top:

- **Startup timeout** (`config.timeout.startup`, default 3000 ms; see
  issue #1339 and Cline #13086) — bounds the stdio handshake / cold-spawn
  phase (`client.connect`). The 3 s cap is aggressive on purpose: a hung
  MCP server that never responds to `initialize` must NOT stall session
  creation on the critical path. It covers ~2 s cold `npx -y` warm-cache
  starters while keeping worst-case per-server connect near ~6 s.
  JVM-based servers (Oracle SQLcl and similar) OR a first-time cold
  `npx -y` install exceed this bound and MUST set an explicit
  `timeout.startup` override in `mcp-servers.json` (typical values
  15000-45000 ms). Exceeding it raises a named error pointing at
  `timeout.startup`.
- **Request timeout** (`config.timeout.request`, default 60000 ms) —
  bounds every metadata or tool call made after the handshake
  (`callTool`, `listTools`, `listResources`, `listPrompts`, `readResource`,
  `getPrompt`). Exceeding it raises a named error pointing at
  `timeout.request`. Legacy `timeout: number` applies to BOTH phases for
  backwards compatibility.

Retry is layered on top of the startup budget only. When
`config.retry.enabled === true` in `mcp-servers.json`, `McpClientManager.connect`
retries a failed initial connection with the backoff formula above.
Defaults: `maxAttempts: 3`, `initialDelayMs: 1000`, `maxDelayMs: 4000`
(so the worst-case attempt sequence is `attempt1, wait 1000ms, attempt2,
wait 2000ms, attempt3`, roughly 3 attempts across ~7 s).

Only transient errors consume attempts:

- Transient (`ECONNREFUSED`, `ECONNRESET`, `ETIMEDOUT`, `EPIPE`, `EAGAIN`,
  `EBUSY`, startup-timeout messages) -> retry with backoff. The connection
  moves to `retrying` status between attempts so `getStatus()` can render
  a spinner rather than a red X.
- Permanent (`ENOENT`, `EACCES`, `ENOTDIR`, `EPERM`, `missing environment
  variable`, `command not found`) -> fail immediately with `status: 'failed'`
  and an actionable `error` message naming the exact config field to fix.

Request-phase failures (`callTool`, `listTools`, ...) are NOT retried by
the MCP client. They surface directly to the caller as `{ success: false,
error: <message> }`; retry policy for those is owned by the agent loop
that invoked the tool, not by the transport.

### Agent workflow retry (CI)

Agent workflows (`.github/workflows/agent*.yml`, `auto-implement.yml`,
`ci-auto-fix.yml`, `documentation-update.yml`, `agent-autohealing.yml`)
wrap every `kilo run` invocation in a bash retry-with-backoff loop driven
by the `KILO_RETRIES` env var (default `2`). The loop consumes retry
budget ONLY when the run log matches the transient regex:

```text
socket hang up|ECONNRESET|ETIMEDOUT|ENOTFOUND|fetch failed|502|503|429|rate limit
```

Non-matching failures (agent errors, lint failures, test failures) exit
immediately -- retrying an expensive model on the same broken input just
wastes budget. When the budget is exhausted, the factory opens a
deduplicated `factory-escalation`-labelled issue so silent failures become
tracked human handoffs.

## Reference System

The reference module (`src/reference/`) manages external repository references with typed cache failures:

| Component | File | Description |
|-----------|------|-------------|
| `ReferenceService` | `reference.ts` | Manages local and git repository references |
| `RepositoryCache` | `repository-cache.ts` | TTL-based cache with typed error hierarchy |

The cache uses typed failure classes (`CacheMissError`, `CacheStaleError`, `CacheCapacityError`) extending a base `CacheError` for precise error handling.

## Plugin Tool System

The plugin tool system (`src/tool/plugin-tools.ts`) provides a compatibility layer for external plugin tools:

```typescript
interface PluginToolContext {
  workdir: string;
  signal?: AbortSignal;
  sessionId?: string;
  ask: (question: string) => Promise<string>;  // Promise-based, not Effect
}
```

Plugin tools use `createPluginToolWrapper()` to adapt their simplified interface to Alexi's full tool system, ensuring the `ask` method returns a Promise instead of an Effect for backwards compatibility.

### Plugin auto-load and `alexi plugin init`

Any directory under `.alexi/skills/<name>/` (project) or `~/.alexi/skills/<name>/` (global) that contains a valid `plugin.json` is auto-discovered by `PluginManager.loadAutoDiscovered()` (see `src/plugin/index.ts`). The manifest format is validated by `PluginManifestSchema` (Zod) and supports `name`, `version`, `description`, `author`, `dependencies`, and a `commands` array of relative markdown paths. Discovery dedupes by `fs.realpathSync` so symlinks pointing at the same target load only once; invalid manifests emit a `PluginError` event and do not block sibling plugins.

To bootstrap a new plugin, run:

```sh
alexi plugin init <name>             # scaffold under .alexi/skills/<name>/
alexi plugin init <name> --global    # scaffold under ~/.alexi/skills/<name>/
```

The scaffolder creates `plugin.json`, `commands/<name>.md`, and `README.md`. Reload via `/reload-skills` (when available) or restart Alexi.

## Enhanced Tool Registry

The `EnhancedToolRegistry` (`src/tool/registry.ts`) extends the base tool system with dynamic prompt-based tool resolution:

```typescript
class EnhancedToolRegistry {
  register(tool: Tool): void;
  registerPromptResolver(name: string, resolver: PromptToolResolver): void;
  resolveForPrompt(context: ToolResolutionContext): Promise<Tool[]>;
}
```

This allows tools to be dynamically resolved based on session context, agent permissions, and prompt characteristics.

## Session Replay

The `SessionReplay` class (`src/cli/session-replay.ts`) enables replaying session history when resuming interactive sessions:

```typescript
class SessionReplay {
  replay(messages: Message[], options?: ReplayOptions): Promise<ReplayResult>;
  formatMessage(message: Message): string;
  getSummary(messages: Message[]): SessionSummary;
}
```

Options include: `maxMessages` (default: 50), `showToolCalls`, `showSystemMessages`, and an `onMessage` callback for each replayed message.

## Permission System

```mermaid
flowchart LR
    ToolExec[Tool Execution Request] --> HasPerm{Has Permission Config?}
    HasPerm -->|Yes| GetResource[Get Resource Path]
    HasPerm -->|No| DirectExec[Execute Directly]
    
    GetResource --> ResolveCtx[Resolve with workdir Context]
    ResolveCtx --> CheckRules[Evaluate Rules by Priority]
    
    CheckRules --> LastMatch[Last Match Wins]
    
    LastMatch --> Decision{Decision?}
    Decision -->|Allow| Grant[Grant Permission]
    Decision -->|Deny| Reject[Deny Permission]
    Decision -->|Ask| Interactive[Interactive Prompt via Bus]
    
    Interactive --> UserResp{User Response}
    UserResp -->|Allow| Grant
    UserResp -->|Deny| Reject
    
    Grant --> DirectExec
    Reject --> RetErr[Return Error]
    DirectExec --> Result[Return ToolResult]
    RetErr --> Result
```

### Permission Actions

```typescript
type PermissionAction = 'read' | 'write' | 'execute' | 'network' | 'admin';
type PermissionDecision = 'allow' | 'deny' | 'ask';
```

### Read-only mode enforcement

`src/permission/index.ts` treats the session modes `ask` and `plan` as promises of read-only behaviour to the user. Under these modes, write-shaped tools are denied even when a broad wildcard rule like `"*": "allow"` would otherwise match. An explicit per-tool `allow` still wins so operators can opt individual tools back in without regressing on the read-only guarantee. This is important for SAP AI Core compliance workflows that rely on `ask` / `plan` for reviewable read-only runs.

```typescript
const READ_ONLY_MODES = new Set<string>(['ask', 'plan']);
const WRITE_TOOLS = new Set<string>([
  'write', 'edit', 'patch', 'shell', 'bash',
  'kilo_edit', 'kilo_write', 'apply_patch',
]);

export function evaluate(input: {
  tool: string;
  mode: string;
  rules: Record<string, 'allow' | 'ask' | 'deny'>;
}): 'allow' | 'ask' | 'deny' {
  if (READ_ONLY_MODES.has(input.mode) && WRITE_TOOLS.has(input.tool)) {
    const explicit = input.rules[input.tool];
    if (explicit === 'allow') {
      return 'allow';
    }
    return 'deny';
  }
  return input.rules[input.tool] ?? input.rules['*'] ?? 'ask';
}
```

`evaluate` defaults to `'ask'` when no rule matches so behaviour is safe by default. Exposed for tests and for callers (agent factory, hooks) that need to gate write-shaped tools without going through the full `PermissionManager.check()` flow.

### Doom Loop Detection

The permission system detects repeated denials and configures mitigation:

```typescript
interface DoomLoopConfig {
  maxRetries: number;
  windowMs: number;
  onDetected: 'warn' | 'block' | 'ask';
}
```

## MCP Integration

Model Context Protocol support allows external tool servers to be connected:

```typescript
import { getMcpClientManager } from './mcp/index.js';

const manager = getMcpClientManager();
await manager.connect({
  name: 'my-server',
  transport: 'stdio',
  command: 'npx',
  args: ['@my/mcp-server'],
});

// MCP tools are automatically registered in the tool registry
```

Connections are managed with automatic reconnection and a 30-second tool cache TTL.

See [MCP tool key composition](#mcp-tool-key-composition) below for the namespacing
contract every consumer of `getAllTools()` must respect.

### MCP tool key composition

MCP tools live in the same global tool registry as built-in tools, so their names
must be namespaced to avoid collisions between servers (and between MCP and
built-in tools). The contract below is the single source of truth — any caller
that dispatches, filters, or matches on tool names MUST follow it.

#### Qualified key shape

Every MCP tool is registered under a qualified key of the form:

```text
${escapedServer}::${tool}
```

- `escapedServer` is the MCP server name with reserved characters escaped (see
  below).
- `tool` is the raw tool name as advertised by the MCP server. It is NOT
  escaped, and it MAY itself contain `::` — split rules below handle that.
- The separator is exactly two ASCII colons (`::`). A single `:` is reserved
  and escaped inside `escapedServer` precisely so the separator stays
  unambiguous.

#### Escape order (server name → escaped server)

The escape MUST replace `%` first and `:` second. Reversing the order would
double-escape any `%` that the user-supplied server name introduces while
escaping `:` (e.g. `:` -> `%3A`, then `%` -> `%25` would turn the escape
sequence itself into `%253A`).

```typescript
const escapedServer = serverName
  .replaceAll('%', '%25') // FIRST: escape the escape character
  .replaceAll(':', '%3A'); // THEN: escape the separator character
```

#### Reverse-escape order (escaped server → server name)

The reverse path is also order-sensitive — unescape `%3A` first and `%25`
second, the mirror image of the forward order. Reversing this order would
incorrectly resurrect a literal `%3A` from a server name that legitimately
contained the substring `%253A`.

```typescript
const serverName = escapedServer
  .replaceAll('%3A', ':') // FIRST: restore the separator character
  .replaceAll('%25', '%'); // THEN: restore the escape character
```

#### Split on the LAST `::`

Because the right-hand `tool` segment may contain `::`, callers MUST split a
qualified key on the LAST occurrence of `::`, not the first. Splitting on the
first `::` would silently truncate tool names like `my-server::a::b::c` and
route to the wrong tool.

```typescript
const idx = qualified.lastIndexOf('::');
if (idx < 0) {
  // Not an MCP-qualified key — treat as a built-in tool name.
}
const serverPart = qualified.slice(0, idx); // still escaped — reverse-escape before display
const toolPart = qualified.slice(idx + 2); // raw tool name, never escaped
```

#### Display vs. routing

The UI MAY strip the `${escapedServer}::` prefix when rendering a tool name for
humans (e.g. show `read_file` instead of `filesystem::read_file` in a tool-use
trace). However:

- Routing (looking the tool up in the registry).
- Permission rules (`tools.allow` / `tools.deny` matchers).
- Hook matchers (`PreToolUse`, `PostToolUse` filters).

MUST use the full qualified key. NEVER round-trip the display form back into
dispatch — a stripped name is ambiguous (two servers can expose the same tool
name) and bypasses the namespacing guarantee.

#### Canonical implementation

The helpers above live in `src/mcp/client.ts`:

- `escapeServerName(serverName)` — forward escape (`%` then `:`).
- `parseQualifiedName(qualified)` — split on the last `::` and return
  `{ serverPart, toolPart }`; also reverse-escapes `serverPart`.
- `getToolByQualifiedName(qualified)` — registry lookup using the full
  qualified key.

When adding a new consumer of `getAllTools()`, import from `src/mcp/client.ts`
rather than re-implementing the split/escape logic.

### MCP Apps (experimental)

Introduced in 1.21.4 (port of kilocode `36c57c12c`, tightened by `c02134ab4` and `b7069922d`). "MCP Apps" is a thin API that wraps the existing `McpClientManager` and presents each connected server as an "app" with two verbs — `listResources` and `callTool`. Gated behind `ALEXI_EXPERIMENTAL_MCP_APPS=1` at the call site; the intent is to stabilise the shape before wiring it into a permanent HTTP surface. Exports live at `src/mcp/apps.ts` and are re-exported by `src/mcp/index.ts` under prefixed names (`mcpAppsListResources`, `mcpAppsCallTool`, `MCPAppsError`, `MCP_APPS_ENV_FLAG`, `isMCPAppsEnabled`, `MCPResource`) so both the flag check and the verbs are always available for feature detection.

Design notes:

1. **Tight error surface.** Every thrown value from `manager.callTool` or `manager.refreshResources` is wrapped in `MCPAppsError` carrying `operation: 'listResources' | 'callTool'`, `server`, optional `tool`, and the underlying `cause`. Upstream HTTP handlers can render a stable JSON envelope without inspecting the raw cause, and cross-module `instanceof` checks are avoided by matching on `name === 'MCPAppsError'`.
2. **Optional-method tolerance.** `listResources` gracefully returns an empty array when the connected server does not implement the optional method, mirroring the existing `McpClientManager.listResources` semantics so apps aren't forced to wrap it in `try/catch` for a common case.
3. **Borrowed transport.** The module intentionally does not spawn its own MCP transport; it borrows the connection already owned by the manager. Once the per-instance refactor (kilocode `b8984e468`) propagates to MCP, this will honour cross-instance isolation for free.

```typescript
import { isMCPAppsEnabled, mcpAppsListResources, mcpAppsCallTool, MCPAppsError } from '../mcp/index.js';

if (!isMCPAppsEnabled()) {
  // Short-circuit with a 404 or "not enabled" response.
  return { status: 404, body: 'mcp-apps not enabled' };
}

try {
  const resources = await mcpAppsListResources('filesystem');
  const result = await mcpAppsCallTool('filesystem', 'read_file', { path: '/etc/hosts' });
  return { status: 200, body: { resources, result } };
} catch (err) {
  if (err instanceof MCPAppsError) {
    return { status: 502, body: { operation: err.operation, server: err.server, cause: String(err.cause) } };
  }
  throw err;
}
```

`MCPResource` (`{ uri?, name?, mimeType?, [key: string]: unknown }`) is deliberately loose because the MCP resource contract has been evolving — callers are expected to pass this straight through to the HTTP client rather than reasoning about individual fields.

## Persistent State and SQLite

Alexi persists a small amount of long-lived state to the user's home directory. Two modules govern how that state is resolved and how the shared SQLite database is opened.

### State directory resolution

`src/core/global/paths.ts` transparently probes the preferred state directory (usually `$XDG_STATE_HOME/alexi`) for writability before use, and falls back to a secondary location when the primary is unwritable. This matters on containers, restricted user profiles, and VS Code Server on Windows where the preferred directory frequently is not writable; previously the CLI crashed on startup with an opaque `EACCES` / `EROFS`.

```mermaid
flowchart TD
    A[resolveStateDir<br/>dataDir, preferred] --> B{XDG_STATE_HOME<br/>explicitly set?}
    B -- yes --> C[fallback = undefined<br/>user's choice wins]
    B -- no --> D["fallback = &lt;dataDir&gt;/state"]
    C --> E[resolveState preferred, fallback]
    D --> E
    E --> F{fallback exists<br/>AND writable?<br/>sticky check}
    F -- yes --> G[return fallback<br/>no flapping]
    F -- no --> H[ready preferred:<br/>mkdirp + writable probe]
    H -- ok --> I[return preferred]
    H -- fail + no fallback --> J[throw]
    H -- fail + fallback --> K[ready fallback]
    K -- ok --> L[return fallback]
    K -- fail --> J
```

Writability is checked with an exclusive-mode temp file (`wx` flag, filename `.alexi-write-<pid>-<uuid>`, mode `0o600`) so a stale probe file from a crashed run cannot mask a real permission problem. The fallback is **sticky**: once selected it is preferred on subsequent runs so the resolved state directory does not flap between locations across restarts. When `$XDG_STATE_HOME` was explicitly set by the user, no fallback is provided — the user's explicit choice wins and any failure is surfaced rather than silently redirected.

### SQLite connection PRAGMAs

`src/core/database/database.ts` produces the canonical ordered list of PRAGMA statements a caller should execute against whichever SQLite binding is in use (better-sqlite3, effect-sql, node:sqlite). Order matters: when two processes open the same database and one is racing to recover an abandoned WAL/SHM segment, the busy handler MUST already be installed before `journal_mode = WAL` runs — otherwise the recovering process can crash with `SQLITE_BUSY` before any retry logic kicks in.

```typescript
export const CONNECTION_PRAGMAS: readonly string[] = Object.freeze([
  'PRAGMA busy_timeout = 5000',     // install busy handler FIRST
  'PRAGMA journal_mode = WAL',      // may trigger WAL recovery
  'PRAGMA synchronous = NORMAL',
  'PRAGMA cache_size = -64000',
  'PRAGMA foreign_keys = ON',
  'PRAGMA wal_checkpoint(PASSIVE)',
]);
```

`configureConnection(db, options?)` applies the sequence via a minimal `PragmaRunner` interface:

```typescript
export interface PragmaRunner {
  run(sql: string): Promise<unknown> | unknown;
}

// better-sqlite3
const db = new Database(filename);
await configureConnection({ run: (sql) => db.exec(sql) });
```

`ownsWalInit` (default `true`) skips the `journal_mode = WAL` step for adapters that already ran it — you almost certainly want the default. SAP AI Core deployments frequently run the daemon and CLI in parallel against the same session store, so this ordering is a required stability guarantee.

### Persistent snapshot-disable

`src/core/snapshot.ts` persists the "snapshots disabled" flag under `~/.alexi/state/snapshot.json` (JSON key: `disabled`) so the choice survives CLI restart. A missing or unreadable file is treated as "not disabled" (snapshots on by default) so an unwritable state directory degrades gracefully rather than silently disabling snapshots. Public API: `disableSnapshots()`, `enableSnapshots()`, `shouldSnapshot()`, `SNAPSHOT_DISABLE_STATE_KEY` (`kilocode.snapshot.disabled`). The paired `pruneSnapshots(sessionId, keep = 20)` helper cleans stale snapshot / truncation files by `mtime`, oldest first.

## Sandbox Git-Write Detection

`src/kilocode/sandbox/git.ts` isolates classification logic for git subcommands that mutate the working tree, index, refs, or config. On macOS `sandbox-exec` (and analogous restricted environments), such commands can silently fail or succeed with unexpected side-effects. The shell tool (`src/tool/tools/shell.ts`) consults `requiresSandboxEscalation(command, sandbox)` when `ALEXI_SANDBOX=1` and escalates through the interactive permission prompt so the user is aware their sandbox is about to be punched through.

Classification is deliberately broad — "when in doubt, escalate", not "only escalate on destructive commands". Read-only subcommands (`log`, `status`, `diff`, `show`, `ls-files`, `rev-parse`, …) are NOT included. Write-shaped subcommands: `add`, `am`, `apply`, `branch`, `checkout`, `cherry-pick`, `clean`, `commit`, `config`, `fetch`, `gc`, `init`, `merge`, `mv`, `pull`, `push`, `rebase`, `reflog`, `remote`, `reset`, `restore`, `revert`, `rm`, `stash`, `submodule`, `switch`, `tag`, `worktree`.

`isGitWrite(command)` walks past leading global flags (`-C`, `-c`, `--git-dir`, `--work-tree`) before checking the subcommand token, so `git -C path subcommand ...` and `git --git-dir=... subcommand ...` classify correctly.

## Directory Structure

```
alexi/
├── src/
│   ├── agent/          # Agent registry, custom loader, system prompt assembly,
│   │                   #   AGENTS.md reminder helpers
│   ├── bus/            # Typed event bus (defineEvent, BusEvent)
│   ├── ci/             # CI integration helpers (e.g. PR comment formatting)
│   ├── cli/            # CLI program + Ink/React TUI + session replay
│   ├── command/        # Slash command system (rewind, code-review, ...)
│   ├── compaction/     # Context compaction strategies
│   ├── config/         # Environment, routing, user config, project context
│   ├── context/        # Repo map, symbol ranking, tree-sitter
│   ├── core/           # Orchestrator, router, session, agentic chat,
│   │                   #   compaction-chunks, network, flag
│   ├── doctor/         # `alexi doctor` self-check command
│   ├── flag/           # User-facing feature-flag command surface
│   ├── git/            # Auto-commit message generation, attribution
│   ├── hooks/          # Lifecycle hooks (command, HTTP, script)
│   ├── i18n/           # Internationalization tables
│   ├── init/           # `alexi init` project bootstrap
│   ├── kilocode/       # Upstream-ported classification utilities
│   │                   #   (e.g. sandbox/git.ts) -- pending ADR 006
│   ├── log/            # Log surface (separate from utils/logger)
│   ├── mcp/            # Model Context Protocol client/server
│   ├── permission/     # Permission rules, doom loop detection,
│   │                   #   shell-parser
│   ├── plan/           # Plan-mode helpers (consumed by tool/tools/bash.ts)
│   ├── plugin/         # Plugin auto-load + rule command runner
│   ├── profile/        # Profile management
│   ├── providers/      # SAP AI Core Orchestration (SOLE provider surface)
│   ├── reference/      # External repository references and caching
│   ├── server/         # Embedded server entrypoint
│   ├── session/        # Session-side helpers (reminders, ask-code-switch)
│   ├── share/          # Sharing / export helpers
│   ├── skill/          # Specialized prompt skills (with reload)
│   ├── sound/          # Audio notification surface
│   ├── sync/           # Sync helpers (e.g. upstream sync)
│   ├── tool/           # Tool system + built-in tool implementations
│   ├── ui/             # UI shims (composer.css, timers.ts -- pending cleanup)
│   ├── undo/           # Undo / rewind state
│   ├── update/         # Self-update command
│   └── utils/          # Logger, telemetry, shared utilities
├── tests/              # Vitest test suites (also colocated under src/)
├── docs/
│   ├── adr/            # Architecture Decision Records (ADR 001 onward)
│   └── *.md            # Architecture, providers, routing, testing docs
├── .github/
│   ├── workflows/      # GitHub Actions workflows (T-shape agent factory)
│   └── prompts/        # baseline-system + role-* prompts
├── CHANGELOG.md
├── AGENTS.md
├── package.json
└── tsconfig.json
```

The current top-level layout has grown to 35 modules (up from the
original ~10). ADR 001 (`docs/adr/001-establish-adr-process.md`) records
the layering rules these directories must respect; planned follow-up
ADRs will backfill rationale for each newer top-level module. See
`docs/adr/REVIEW-2026-08-31.md` for the current baseline snapshot and
`docs/adr/REVIEW-*.md` more generally for the running architecture log.

## Minify-Safe Patterns

Production bundlers (esbuild, Bun, terser, swc) routinely rename local
class and function identifiers to single letters. Any runtime code that
relies on those names — most commonly through `obj.constructor.name` —
breaks silently the moment a minified build ships. This section codifies
the defensive patterns alexi uses (and expects every future telemetry /
instrumentation integration such as OpenTelemetry, Sentry, Datadog, or
Langfuse to adopt) so that class-detection logic keeps working after
minification.

### Rules

1. **Never use `constructor.name` for class detection in production
   code.** It is safe for logging, debug output, and error messages, but
   never as a control-flow gate. A minifier will rename
   `class TelemetryService {}` to `class t {}` and every
   `obj.constructor.name === 'TelemetryService'` check silently starts
   returning `false`.
2. **Prefer structural checks.** In descending order of preference:
   - **Object identity** (`obj === expectedSingleton`). Cheapest, most
     robust, immune to any bundler transform.
   - **Method existence** (`typeof obj.method === 'function'`). Requires
     that property names survive minification, which is the default in
     every major bundler unless the developer opts into
     property-mangling (`mangleProps` / `--minify-syntax` with a filter).
   - **Duck-typing on the full method surface**. Combine multiple method
     checks so that unrelated shapes carrying a single common method
     (e.g. any event emitter that exposes `track`) are not accepted.
3. **Verify with a minified-build test before shipping.** Any new
   telemetry / instrumentation module MUST come with a test that
   round-trips its exports through a minifier and re-imports the result.
   See `tests/utils/telemetry-minify.test.ts` for the reference pattern.

### Reference implementation: `src/utils/telemetry.ts`

The telemetry module exposes three surfaces designed for minify-safe
consumer code:

- `TelemetryServiceLike` — a structural interface listing the required
  method surface. Consumers type-check against this, not against the
  concrete `TelemetryService` class (which is not exported precisely
  because its identity should not be part of the public contract).
- `isTelemetryService(obj: unknown): obj is TelemetryServiceLike` — a
  duck-typed guard. Returns `true` only when `obj` is a non-null object
  carrying all four methods (`setEnabled`, `track`, `getEvents`,
  `clear`). Deliberately does NOT accept a single-method match to avoid
  false positives from unrelated event emitters.
- `telemetryInstance` — an exported reference to the singleton, so
  consumers that need identity-level detection can do
  `obj === telemetryInstance` instead of any name-based check.

```ts
// BAD: breaks under any minifier that renames local classes.
if (obj.constructor.name === 'TelemetryService') {
  register(obj);
}

// GOOD: identity check, minify-immune.
import { telemetryInstance } from '../utils/telemetry.js';
if (obj === telemetryInstance) {
  register(obj);
}

// ALSO GOOD: duck-typed, minify-safe as long as method names are not
// property-mangled (opt-in, not the default).
import { isTelemetryService } from '../utils/telemetry.js';
if (isTelemetryService(obj)) {
  obj.track('registered');
}
```

### Reference test: `tests/utils/telemetry-minify.test.ts`

The test loads `src/utils/telemetry.ts`, transforms it through esbuild
with `minify: true` (esbuild is the minifier already in the toolchain;
the same test can be run through Bun's `--minify` flag by pointing
`bun build --minify` at the same source file), imports the minified
output via a `data:text/javascript` URL, and then asserts:

- The internal `class TelemetryService {}` declaration has been renamed
  by the minifier (proving the risk is real).
- `isTelemetryService(telemetryInstance)` still returns `true` against
  the minified singleton — the structural check survives the transform.
- Partial-shape objects (`{ track: fn }` alone) are correctly rejected.
- The `Telemetry` facade round-trips `setEnabled` / `track` /
  `getEvents` / `clear` after minification.
- Cross-boundary duck-typing works both ways: the *unminified*
  `isTelemetryService` accepts an instance from the *minified* module,
  and vice versa.

Any future telemetry integration that adds a new detection surface
(class, factory, or singleton) MUST extend this test — or add a sibling
test alongside its module — before landing.

## Key Design Decisions

### 1. Single Provider Architecture (SAP AI Core)

All LLM calls route exclusively through SAP AI Core Orchestration API via `@sap-ai-sdk/orchestration`. This provides:
- Centralized governance and compliance
- Unified token tracking and cost management
- Single authentication surface (AICORE_SERVICE_KEY)
- Access to multiple underlying models (GPT-4o, Claude, Gemini) through one API

### 2. Tool System with Permission Control

Tools are implemented as independent modules with:
- Zod schema validation for parameters
- Permission-based access control (last-match-wins rule evaluation)
- Context-aware relative path resolution via workdir
- Event bus integration for observability
- Support for background execution (experimental)

### 3. Agentic Execution with Compaction

The agentic chat system enables autonomous multi-turn operations:
- Automatic permission configuration (priority 200 allow rules)
- Context overflow detection and reactive compaction
- Lifecycle hooks with block cap and continueOnBlock
- Configurable iteration limits (default: 50)
- Effort levels controlling max tokens and behavior

### 4. Event-Driven Architecture

The typed event bus enables:
- Loose coupling between modules
- Plugin extensibility
- Real-time TUI updates
- Telemetry collection
- Permission dialog coordination

### 5. Custom Agent System with File Inclusion

Custom agents support:
- Markdown + YAML frontmatter format
- `{file:path}` recursive inclusion (max depth 3)
- User-global and project-local scopes
- Tool allowlists and denylists
- Model and temperature preferences

## Optional Peer Dependencies

Some features rely on native or heavy libraries whose install cost is not
justified for users who never invoke them. These are declared as
`peerDependencies` with `peerDependenciesMeta.<pkg>.optional = true` in
`package.json`, so `npm install` succeeds without them and prints an
informational message rather than a hard failure.

### Tree-sitter grammars (~200MB+ combined install size)

The repo-map (`src/context/repoMap.ts`) and symbol extractor
(`src/context/symbols.ts`) parse source files with tree-sitter to produce
a ranked list of top-level definitions for the LLM system prompt. The
parser runtime and every language grammar are optional peer dependencies
so `npm install` for the base package stays fast (~30-50% faster on a
fresh `node_modules`) and only users who exercise code-analysis features
pay the native-build cost:

| Package                   | Language                    | Extensions             |
| ------------------------- | --------------------------- | ---------------------- |
| `tree-sitter`             | Runtime (required by every grammar) | -              |
| `tree-sitter-typescript`  | TypeScript / TSX            | `.ts`, `.tsx`, `.mts`, `.cts`, `.d.ts` |
| `tree-sitter-javascript`  | JavaScript                  | `.js`, `.jsx`, `.mjs`, `.cjs` |
| `tree-sitter-bash`        | Bash / shell                | `.sh`, `.bash` |
| `tree-sitter-python`      | Python                      | `.py` |
| `tree-sitter-rust`        | Rust                        | `.rs` |
| `tree-sitter-go`          | Go                          | `.go` |

`src/context/treeSitter.ts` lazy-loads every grammar the first time a file
of the matching extension is parsed. Loading is done via a
`createRequire(import.meta.url)`-backed shim wrapped in `try / catch`, and
each successful or failed load is memoised so subsequent parses are cheap.
When a grammar cannot be loaded, `parseSource()` returns `null`, which
`extractSymbols()` and `generateRepoMap()` treat as "no symbols for this
file" — the map is still produced, just without symbol detail for the
missing language.

If a user wants full repo-map support (or a downstream tool needs
tree-sitter parsing for a specific language), they should install the
runtime plus the corresponding grammar. Examples:

```bash
# Everything
npm install tree-sitter tree-sitter-typescript tree-sitter-javascript \
  tree-sitter-bash tree-sitter-python tree-sitter-rust tree-sitter-go

# Just Python
npm install tree-sitter tree-sitter-python

# Just Rust and Go
npm install tree-sitter tree-sitter-rust tree-sitter-go
```

For diagnostics, `treeSitter.ts` also exports:

- `getMissingGrammars(): Grammar[]` — returns the list of optional packages
  that failed to load.
- `formatMissingGrammarError(): string | null` — returns a copy-paste-ready
  install hint listing every missing package, or `null` when every
  optional grammar is available.
- `checkGrammarAvailable(language): boolean` — per-language capability
  probe. Returns `true` iff both the `tree-sitter` runtime AND the
  grammar for `language` (`'typescript' | 'javascript' | 'bash' |
  'python' | 'rust' | 'go'`) load successfully.
- `formatMissingLanguageError(language): string | null` — per-language,
  copy-paste-ready install hint of the form
  `Code analysis for <Language> requires <package>. Install: npm install
  <package>`. Returns `null` when the grammar is already loadable.
- `preloadGrammars(): Promise<void>` — eager async warm-up for
  long-running processes (e.g. the embedded server) that want to detect
  missing grammars at boot rather than on first parse.

The `definitions` tool (`src/tool/tools/definitions.ts`) uses regex-based
extraction and does NOT depend on the tree-sitter grammars, so it
continues to work even when the optional peers are absent. The install
hint above is however the recommended remediation any time a caller
observes the repo-map / symbol pipeline degrading to "no symbols".

### Puppeteer (headless browser screenshots)

`puppeteer` remains a regular `optionalDependencies` entry (not a peer)
because its install failure mode is more subtle — Chromium download can
fail behind corporate proxies but the JS package still lands. Consumers
that need browser automation should install it explicitly.

## Security Considerations

1. **Secrets Management**: AICORE_SERVICE_KEY stored in environment, never in config files
2. **Permission System**: Last-match-wins rules with doom loop detection
3. **Config Protection**: Sensitive config paths have special protection rules
4. **Environment Isolation**: User config in `~/.alexi/`, never committed
5. **Hook Sandboxing**: Hooks run with configurable timeout (default 30s)
6. **Type Safety**: Strict TypeScript with Zod runtime validation throughout

## TUI Tool-Call Disclosure

The Ink TUI renders tool calls through a two-layer component pair introduced in 1.20.2:

- `src/cli/tui/components/ToolRow.tsx` — the primary renderer. Owns disclosure state, per-status colors (`colors.toolRunning`, `colors.toolCompleted`, `colors.toolFailed`), tool-specific icons, and body rendering (bash command output, diff, plain output, error).
- `src/cli/tui/components/ToolCallBlock.tsx` — a thin backwards-compatible wrapper that re-exports `ToolRowProps` as `ToolCallBlockProps` and delegates to `ToolRow`. Preserved so external consumers importing `ToolCallBlock` continue to work.
- `src/cli/tui/utils/formatToolOutput.ts` — pure string helpers (`formatBashCommand`, `truncateOutput`, `formatParamsPreview`, `formatDuration`, `guessLanguageFromPath`) kept separate from the React components so they can be unit-tested without an Ink render harness.
- `src/cli/tui/components/DiffView.tsx` — now applies best-effort syntax highlighting via `cli-highlight` on every diff line, driven by `guessLanguageFromPath(filePath)`. Falls back to plain text on any highlighter failure so a broken grammar never breaks the render.

Behavioural rules:

- Rows auto-expand on `failed` status so users see errors without interacting.
- Bash output renders with a classic terminal-style `$ command` prefix.
- Long outputs are truncated to `DEFAULT_MAX_OUTPUT_LINES = 20` lines with a `... (N more lines)` hint (kept lines: `DEFAULT_TRUNCATED_OUTPUT_LINES = 15`).
- Param previews (`filePath`, `path`, `file`, `command`, `pattern`, `query` in that priority order) are truncated to 50 characters with a `\u2026` ellipsis.

```mermaid
sequenceDiagram
    participant Agent as AgenticChat
    participant Bus as EventBus
    participant MessageArea as MessageArea.tsx
    participant ToolRow as ToolRow.tsx
    participant DiffView as DiffView.tsx
    participant Format as formatToolOutput.ts
    participant Highlighter as cli-highlight

    Agent->>Bus: toolCallStarted(id, toolName, params)
    Bus->>MessageArea: ToolCallState (status: running)
    MessageArea->>ToolRow: render (status=running, isExpanded=false)
    ToolRow->>Format: formatParamsPreview(params)
    Format-->>ToolRow: "filePath: src/foo.ts"
    Note over ToolRow: Row shows Spinner + tool icon + params preview + " running\u2026"

    Agent->>Bus: toolCallCompleted(id, output, diff?)
    Bus->>MessageArea: ToolCallState (status: completed, output, diff?)
    MessageArea->>ToolRow: render (status=completed, isExpanded=true)

    alt Bash tool
        ToolRow->>Format: formatBashCommand(params.command)
        Format-->>ToolRow: "$ npm test"
        ToolRow->>Format: truncateOutput(output, 20, 15)
        Format-->>ToolRow: { text, truncated, remaining }
    else Edit tool with diff
        ToolRow->>DiffView: render(filePath, hunks)
        DiffView->>Format: guessLanguageFromPath(filePath)
        Format-->>DiffView: "typescript"
        loop for each diff line
            DiffView->>Highlighter: highlight(content, { language, ignoreIllegals: true })
            alt Highlighter throws
                Highlighter--xDiffView: error
                DiffView->>DiffView: fall back to raw content
            else
                Highlighter-->>DiffView: highlighted ANSI string
            end
        end
    end
```

## Session Response Completeness Classifier

`src/core/session/processor.ts` (ports opencode `58eea7381 fix(cli): retry reasoning-only incomplete responses`) is a small, purely-functional classifier that inspects the shape of a completed streaming response and decides whether the caller should surface it to the user OR retry silently. It exists to handle a specific pathological shape seen on reasoning-heavy models routed through SAP AI Core: the stream closes with a finish reason other than `stop` AND the entire message body consists only of `reasoning` / `thinking` parts with no visible `text` / `tool-call` / `tool-result` output. Without this check, the user would see a blank assistant turn.

Public surface:

```typescript
export type MessagePartType = 'text' | 'reasoning' | 'thinking' | 'tool-call' | 'tool-result';

export interface MessagePart {
  type: MessagePartType;
  [key: string]: unknown;
}

export interface CompletenessInput {
  parts: readonly MessagePart[];
  /**
   * Provider-reported stream finish reason. `stop` is the only value
   * that means "the model reached a natural end"; every other value
   * (`length`, `content-filter`, `error`, `unknown`, ...) is treated
   * as potentially incomplete when combined with a reasoning-only body.
   */
  finishReason?: string;
}

export type CompletenessResult =
  { status: 'complete' } | { status: 'retry'; reason: 'reasoning-only' };

export function isReasoningOnly(parts: readonly MessagePart[]): boolean;
export function evaluateCompleteness(input: CompletenessInput): CompletenessResult;
```

`isReasoningOnly` returns `true` when the parts list is non-empty AND every part has `type === 'reasoning'` or `type === 'thinking'`. The empty-parts case (no output at all) is deliberately NOT this classifier's job — that shape is caught by the separate empty-response check.

`evaluateCompleteness` returns:

- `{ status: 'retry', reason: 'reasoning-only' }` when both conditions hold — reasoning-only body AND `finishReason !== 'stop'`.
- `{ status: 'complete' }` in every other shape (any visible content, or a natural `stop`).

The `retry` outcome is wired into the same retry pump as transient network errors: the session store treats it identically to a `socket hang up` from the SAP AI Core Orchestration API, so it takes one attempt off the `withRetry(...)` budget documented below and does not consume the caller's `KILO_RETRIES` in agent workflows. The classifier is strictly additive — pre-existing complete responses (any shape with a `text` / `tool-call` / `tool-result` part, OR any shape with `finishReason === 'stop'`) still classify as `{ status: 'complete' }`.

```mermaid
flowchart LR
    Stream[Stream closes]
    Parts[parts: readonly MessagePart[]]
    Finish[finishReason]
    Classify[evaluateCompleteness]
    Complete[status: complete<br/>surface to user]
    Retry[status: retry<br/>reason: reasoning-only]
    Pump[Retry pump<br/>withRetry / session store]

    Stream --> Parts
    Stream --> Finish
    Parts --> Classify
    Finish --> Classify
    Classify -->|reasoning-only<br/>AND !== stop| Retry
    Classify -->|any visible content<br/>OR === stop| Complete
    Retry --> Pump
    Pump -->|re-issue request| Stream
```

The `CompletenessResult` type is a single flat discriminated union (`{ status: 'complete' } | { status: 'retry'; reason: 'reasoning-only' }`) — Prettier collapses this onto one line as of `de9d1530`, 2026-08-25; no semantic change.

## Session Retry with Bounded Exponential Backoff

`src/core/session/retry.ts` (introduced in 1.20.2, ports opencode `c789868`) provides `withRetry(fn, shouldRetry, opts)` — a classifier-agnostic retry helper used across session-level operations that fault transiently against SAP AI Core. Defaults are tuned for interactive chat:

| Option | Default | Description |
|--------|---------|-------------|
| `maxAttempts` | 8 | Maximum number of attempts (including the first) |
| `baseMs` | 500 | Initial delay in ms before the first retry |
| `maxMs` | 30 000 | Upper bound on any single delay in ms |
| `jitter` | `true` | Apply full jitter to the computed delay |

Formula: `delay(attempt) = min(maxMs, baseMs * 2^attempt)`, then full jitter (`Math.random() * delay`) — see AWS "Exponential Backoff and Jitter" (2015). Worst case with defaults: 8 attempts × 30s cap ≈ 4 minutes.

The `shouldRetry` predicate is supplied by the caller so this module stays classifier-agnostic. The transient-vs-permanent contract lives in `AGENTS.md` and is implemented in `src/core/error-backoff.ts`.

## Config Instance Cache Invalidation

`src/config/invalidation.ts` (introduced in 1.20.2, ports kilocode `19a2a3c4d`) provides a registry-based invalidation surface for per-instance config caches. Modules that maintain a config-derived cache (routing config, provider config, permission ruleset, etc.) register a disposer via `registerInstanceCache(dispose)` at module load; when global config changes, `invalidateGlobalConfig()` flushes every registered cache.

`updateGlobal(updates, { dispose: true })` in `src/config/userConfig.ts` performs a dynamic import of `./invalidation.js` and calls `invalidateGlobalConfig()` after writing the updated config to disk. This ensures in-flight sessions see fresh SAP AI Core credentials, routing rewrites, and permission changes without a restart. `dispose: false` opts out.

```mermaid
flowchart LR
    User[User writes<br/>~/.alexi/config.json]
    UpdateGlobal[updateGlobal<br/>userConfig.ts]
    SaveDisk[fs.writeFileSync<br/>config.json]
    DynImport[dynamic import<br/>invalidation.js]
    Invalidate[invalidateGlobalConfig]
    Reg[instanceCaches: Set]
    Routing[Routing config cache]
    Provider[Provider config cache]
    Permission[Permission ruleset cache]

    User --> UpdateGlobal
    UpdateGlobal --> SaveDisk
    UpdateGlobal -- "if dispose: true" --> DynImport
    DynImport --> Invalidate
    Invalidate --> Reg
    Reg -->|dispose| Routing
    Reg -->|dispose| Provider
    Reg -->|dispose| Permission
```

Errors thrown by individual disposers are caught and logged via `console.warn` (this module intentionally does not depend on `src/utils/logger.ts` to keep it importable from early boot paths).

## Database Migration Runner

`src/core/database/migration.ts` (introduced in 1.20.2, ports kilocode `2c2b0a2ff`) prevents primary-key collisions when two processes race to apply the same migration. The runner takes an IMMEDIATE write lock via `db.transactionImmediate(fn)` and re-checks `tx.has(migration.id)` inside the transaction before applying the migration body. If the id is already present, the migration was applied by the other process while we were waiting for the lock — return without replaying.

The `MigrationDb` / `MigrationTx` interfaces are intentionally narrow so this module does not hard-couple to a specific SQL adapter (better-sqlite3, effect-sql, or raw pg). Callers implement `transactionImmediate` against the equivalent of `BEGIN IMMEDIATE` (SQLite) or a serialize isolation level (Postgres).

## Filesystem Watcher (VCS-Guarded)

`src/core/filesystem/watcher.ts` (introduced in 1.20.2) only initializes the filesystem watcher when the workspace location has VCS metadata AND the experimental flag `ALEXI_EXPERIMENTAL_FILEWATCHER=1` is set. This prevents crashes and excessive polling in SAP AI Core sandboxed workspaces that may not be git repositories.

```ts
export function maybeStartFileWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null {
  if (location.vcs && isExperimentalFileWatcherEnabled()) {
    return subscribe(location.directory);
  }
  return null;
}
```

The `subscribe` callback is injected so this module stays independent of the concrete watcher backend (chokidar, native `fs.watch`, or an Effect-based stream).

### Per-instance scoping (`InstanceWatcher`)

Introduced in 1.21.4 (port of kilocode `b8984e468`). The watcher's `Map<directory, disposer>` state is now scoped to an `InstanceWatcher` object rather than a module-level singleton. Two concurrent Alexi sessions — multiple SAP AI Core workspaces running in the same process, or a headless `alexi agent` command running alongside the interactive TUI — MUST NOT share watcher state; a `stop()` from one session would otherwise tear down the peer's watches.

```mermaid
sequenceDiagram
    participant SessionA as Session A
    participant SessionB as Session B
    participant WatcherA as InstanceWatcher A
    participant WatcherB as InstanceWatcher B
    participant Default as defaultInstance (legacy)

    SessionA->>WatcherA: start(/proj/a, subscribe)
    WatcherA-->>SessionA: disposer (idempotent)
    SessionB->>WatcherB: start(/proj/b, subscribe)
    WatcherB-->>SessionB: disposer

    Note over WatcherA,WatcherB: state is isolated
    SessionB->>WatcherB: dispose()
    Note over WatcherA: WatcherA.size() still 1
    SessionA->>WatcherA: dispose()

    Note over Default: legacy callers use<br/>startWatcher() shim
```

Contract:

- `start(location, subscribe)` is idempotent per directory. A second call for the same directory returns the existing disposer without invoking `subscribe` again.
- `stop(directory)` only tears down the requested directory on this instance. Returns `true` if a watch was disposed, `false` otherwise.
- `has(directory)`, `size()` expose read-only introspection.
- `setDebounceTimer(directory, timer)` replaces any previously stored timer for the same directory (previous timer is `clearTimeout`'d first). Exposed so watcher backends can share the instance's timer table without holding a private `Map` of their own.
- `dispose()` is safe to call multiple times. It clears every debounce timer first, then iterates a snapshot of `watchers.values()` (each disposer mutates the map during iteration) and invokes each disposer.

Backwards compatibility is preserved via two shims:

- `startWatcher(location, subscribe)` — module-level function that delegates to `defaultInstance`. Pre-refactor call sites that assumed a global watcher keep working unchanged.
- `getDefaultWatcherInstance()` — test-only accessor exposed so watcher tests can assert on cross-instance isolation without exposing the raw instance state.

New code should own its own `InstanceWatcher` (typically hung off the session or workspace object) so concurrent sessions cannot tear down each other's watches.

## Provider Transform Additions

`src/providers/transform.ts` gained two new helpers in 1.20.2 (ports kilocode `031ea2feb`):

- `deriveReasoningVariants<T extends ModelInfoLike>(model): T[]` — returns the base model followed by one variant per available reasoning effort (id suffixed with `-<effort>`). Never mutates its input.
- `mergeProviderModels<T>(base, custom): Record<string, T>` — merges a custom provider's model map on top of a base provider's model map without wiping base variants. Custom entries win per-id; base variants survive when the custom map does not redefine the same id.

1.22.1 adds a third:

- `preserveCompletionLimit(provider: string, computed: number): number` (port of opencode `da4a91b36`) — clamps the caller's computed `max_completion_tokens` to a provider-declared hard cap. Cerebras (and a handful of other SAP-orchestrated providers) hard-cap `max_completion_tokens` at a value BELOW the model's advertised context window; Alexi's generic normalization step recomputes `max_completion_tokens = contextWindow - promptTokens`, which silently overwrites that cap and causes the request to fail with a 400 at the provider edge. The helper reads a static `PROVIDER_COMPLETION_LIMITS: Readonly<Record<string, number>>` table (currently `{ cerebras: 8192 }` — the tightest per-model cap across the SAP AI Core catalog) and returns `Math.max(0, Math.min(computed, cap))` when a cap exists, or the unclamped `computed` (still floored at zero) otherwise. Never raises above the cap; never returns a negative limit. New entries are added to `PROVIDER_COMPLETION_LIMITS` only when a provider's cap is BELOW its context window — providers whose cap equals the context window use the default assumption. See [PROVIDERS.md](./PROVIDERS.md#provider-completion-token-hard-caps) for the full call-site rationale.

The pre-existing `sanitizeOpenAISchema`, `enforceStrictSchema`, `isOpenAIShapedModel`, `lowerMcpToolsForOpenAIShaped`, `transformInterleavedReasoning`, and `ensureDeepSeekReasoning` helpers are unchanged.

## Session Response Classification and Output Budget

Two 1.22.1 modules port upstream fixes for reasoning-heavy models routed through the SAP AI Core orchestration API.

### `src/core/session/processor.ts` — reasoning-only response classifier

Some SAP AI Core deployments (notably OpenAI o1 / o3 and Claude reasoning models) occasionally emit a stream containing ONLY `reasoning` / `thinking` parts and then close the stream without ever producing a visible assistant message. Treating that as "complete" strands the user on a blank turn — the transcript renders empty and the retry pump has no signal to re-issue the request.

`evaluateCompleteness(input)` classifies each completed streaming response:

```typescript
export type MessagePartType = 'text' | 'reasoning' | 'thinking' | 'tool-call' | 'tool-result';

export interface MessagePart {
  type: MessagePartType;
  [key: string]: unknown;
}

export interface CompletenessInput {
  parts: readonly MessagePart[];
  finishReason?: string;
}

export type CompletenessResult =
  | { status: 'complete' }
  | { status: 'retry'; reason: 'reasoning-only' };

export function evaluateCompleteness(input: CompletenessInput): CompletenessResult;
export function isReasoningOnly(parts: readonly MessagePart[]): boolean;
```

Rules:

- Returns `{ status: 'retry', reason: 'reasoning-only' }` when the body contains ONLY reasoning/thinking parts AND the finish reason is anything except `'stop'`.
- Returns `{ status: 'complete' }` when `finishReason === 'stop'` even on a reasoning-only body (the model explicitly signalled a natural end — retrying would just burn budget).
- Returns `{ status: 'complete' }` when any `text` / `tool-call` / `tool-result` part is present.
- `isReasoningOnly([])` returns `false` — the "no output at all" case is handled by a separate empty-response classifier, not by this helper.

Callers wire the `retry` outcome into their existing retry pump; the session store treats this identically to a transient network error. Ports opencode `58eea7381`.

### `src/core/session/overflow.ts` — output-budget accounting

Some providers surface an ENCRYPTED reasoning payload alongside the visible output. That payload is provider-side state — the client never gets renderable tokens for it — so it must NOT be deducted from the `max_output_tokens` budget when Alexi decides whether the response fits or has overflowed.

```typescript
export interface OutputBudgetUsage {
  output: number;
  reasoningEncrypted?: number;
}

export function usableOutputBudget(max: number, used: OutputBudgetUsage): number;
```

Returns `Math.max(0, max - used.output)` — encrypted reasoning is DELIBERATELY excluded from the deduction. Clamps to zero on overshoot so callers never see a negative budget. Before this fix, `remaining = max - (output + reasoningEncrypted)` caused premature truncation whenever a reasoning-heavy model burned a large encrypted budget: Alexi would signal overflow and start compaction even though the user's visible output was well under the limit. Ports opencode `17611729e`.

## Sub-agent Blocker Store (`src/permission/agent-manager.ts`)

New 1.22.1 module for the orchestration layer to record and resolve blockers against sub-agent sessions. Ports opencode `7baefdddf feat(agent-manager): answer pending questions` plus `98559c9d6 fix(agent-manager): fail closed on blocker lookup errors`.

A blocker is a small record attached to a sub-agent id:

```typescript
export interface Blocker {
  kind: 'question' | 'permission';
  prompt?: string;
  meta?: Record<string, unknown>;
}
```

- `kind: 'question'` — the sub-agent is waiting for a text answer from the orchestrator.
- `kind: 'permission'` — the sub-agent is waiting on a tool-permission decision. Only `question` blockers are answerable through the `agent_manager` tool today.

Public API:

- `getBlocker(agentId): Promise<Blocker | undefined>` — return the blocker or `undefined`. Lookup failures propagate as `undefined` from this helper; use `isBlocked` when you need fail-closed semantics.
- `setBlocker(agentId, blocker): Promise<void>` — record a blocker against `agentId`.
- `answerQuestion(agentId, answer): Promise<void>` — clear the blocker after the orchestrator delivered an answer.
- `isBlocked(agentId): Promise<boolean>` — **fail-closed** lookup: returns `true` when the sub-agent is blocked OR when the store throws.
- `setBlockerStore(next: BlockerStore): void` — swap the backing store. Intended for tests and for future persistent backends (Redis, filesystem journal).
- `_resetBlockerStoreForTests(): void` — reset to a fresh `InMemoryBlockerStore`. Test hook only.

### Fail-closed invariant

`isBlocked` is the pinch point that keeps sub-agent permission safe under transient IO failure:

```typescript
export async function isBlocked(agentId: string): Promise<boolean> {
  try {
    const blocker = await store.get(agentId);
    return blocker != null;
  } catch (err) {
    logger.warn('blocker lookup failed; failing closed', { agentId, err });
    // Fail-closed: treat as blocked so caller cannot proceed on stale state.
    return true;
  }
}
```

Returning `false` on a store error would let a caller silently bypass a real block on a corrupted map, revoked credentials, or a partially-restarted Redis. That contradicts SAP-grade security posture — any ambiguity is resolved against the sub-agent, never against the user. The `_resetBlockerStoreForTests` hook combined with `setBlockerStore` lets tests inject a throwing `BlockerStore` implementation and pin the invariant down (see `tests/permission/agent-manager.test.ts`).

### `agent_manager` tool `answer` action

`src/tool/tools/agent-manager.ts` gains an `action: 'answer'` handler wired to `getBlocker` + `answerQuestion`:

```typescript
case 'answer': {
  if (!agentId || !answer) {
    return { success: false, error: 'agentId and answer are required for action=answer' };
  }
  const blocker = await getBlocker(agentId);      // fail-closed lookup
  if (!blocker) {
    return { success: false, error: `No pending question for agent ${agentId}` };
  }
  if (blocker.kind !== 'question') {
    return { success: false, error: `Agent ${agentId} is not blocked on a question` };
  }
  await answerQuestion(agentId, answer);
  return {
    success: true,
    data: {
      action: 'answer',
      answered: agentId,
      message: `Answer delivered to agent ${agentId}`,
    },
  };
}
```

The orchestrator LLM invokes this whenever a sub-agent's `status` shows a pending question. The Zod schema (`AgentManagerParamsSchema`) accepts both `undefined` and explicit `null` for every optional field, so strict providers (OpenAI structured output, SAP AI Core in strict mode) that emit `null` for absent fields validate cleanly without provider-specific pre-processing.

## Per-Task Model Selection (`src/tool/model-selection.ts`)

Alexi supports opt-in per-invocation model selection for subagents spawned by the `task` tool and sessions created by the `agent_manager` tool. The feature is gated behind a config flag (`experimental.task_model_selection`, default `false`) so the SAP AI Core default routing behaviour is preserved for operators who do not opt in.

Model resolution logic lives in `src/tool/model-selection.ts` (ports upstream opencode/kilocode `packages/opencode/src/kilocode/tool/model-selection.ts`, commit `ab143253a`). The module was extracted so both `task` and `agent_manager` share identical resolution semantics — historically the logic was inline inside `agent-manager.ts` only.

### Resolution flow

```mermaid
flowchart TD
    Start["Tool call with model / provider / reasoning_effort"] --> Gate{"experimental.task_model_selection<br/>enabled?"}
    Gate -->|no| Reject["return error:<br/>Per-task model selection disabled"]
    Gate -->|yes| ProviderCheck{"provider set<br/>but no model?"}
    ProviderCheck -->|yes| RejectProvider["return error:<br/>provider requires model"]
    ProviderCheck -->|no| Candidates["candidates()<br/>enumerate every (providerID, model)<br/>from modelCatalog"]
    Candidates --> Lookup["lookup(all, query)"]
    Lookup --> ExactID{"exact<br/>providerID/modelID<br/>match?"}
    ExactID -->|yes| Pool["pool = exactID matches"]
    ExactID -->|no| ExactName{"exact model.name<br/>match?"}
    ExactName -->|yes| Pool2["pool = name matches"]
    ExactName -->|no| Fuzzy["fuzzy token match<br/>on name + providerID/id"]
    Fuzzy --> Pool3["pool = fuzzy matches"]
    Pool --> Names
    Pool2 --> Names
    Pool3 --> Names
    Names["dedupe on model.name"] --> Empty{"pool empty?"}
    Empty -->|yes| NoMatch["return error:<br/>No model matches"]
    Empty -->|no| Ambig{"multiple distinct<br/>names?"}
    Ambig -->|yes| Ambiguous["return error:<br/>Ambiguous model"]
    Ambig -->|no| Prefer["provider preference:<br/>1. source.variant<br/>2. preferredProviderID<br/>3. first candidate"]
    Prefer --> Success["return SelectedModel<br/>{ providerID, modelID }"]
```

### Public API

```typescript
// src/tool/model-selection.ts

export type Candidate = {
  providerID: string;
  model: { id: string; name: string };
};

export type Source = { model: string; variant?: string };

export type SelectedModel = { providerID: string; modelID: string };

export type SelectModelError = { error: string };

/** Enumerate every (providerID, model) pair known to Alexi. */
export function candidates(): Candidate[];

/**
 * Resolve a free-form query to matching candidates + distinct names.
 * Precedence: exact providerID/modelID > exact model.name > fuzzy token match.
 */
export function lookup(all: Candidate[], value: string): {
  pool: Candidate[];
  names: string[];
};

/**
 * Resolve a model source to a concrete (providerID, modelID) pair.
 * Provider preference: source.variant > preferredProviderID > first in pool.
 */
export function selectModel(
  source: Source,
  preferredProviderID?: string
): SelectedModel | SelectModelError;

/** Type guard narrowing to the error branch. */
export function isSelectModelError(
  r: SelectedModel | SelectModelError
): r is SelectModelError;
```

Alexi ships a single runtime provider (`sap-ai-core`), so every catalog entry is emitted with `providerID = 'sap-ai-core'`. Upstream opencode returns the full cross-product across every registered provider — the shape (`Candidate`, `lookup`, `selectModel`) matches upstream exactly so callers port cleanly.

### Gating at the tool boundary

Both `task` and `agent_manager` gate on `getConfigTaskModelSelection()` before resolving:

- `src/tool/tools/task.ts:361` — when any of `params.model`, `params.provider`, or `params.reasoning_effort` is supplied AND the flag is `false`, the tool returns `error: 'Per-task model selection is disabled. Set experimental.task_model_selection=true in ~/.alexi/config.json to allow subagents to override model/provider/reasoning_effort.'`. The `provider` without `model` invariant is enforced identically to `agent_manager`.
- `src/tool/tools/agent-manager.ts:123` — `config.provider` without `config.model` returns `error: 'config.provider requires config.model to be set'`. Resolution delegates to `selectModel()`; the `create` response surfaces the resolved `session.model` and `session.provider` after resolution.
- `src/tool/tools/agent-manager-models.ts` — `agent_manager_models` discovery tool refuses to enumerate models when the flag is off and returns `{ enabled: false, message: '...' }` with a pointer to the flag. When on, returns paginated `{ modelName, providers, ids }` rows filtered by an optional `query`.

The `TaskResult` interface surfaces the resolved pair back to the parent orchestrator so logs record which model actually ran, not the free-form request string:

```typescript
interface TaskResult {
  taskId: string;
  agentId: string;
  response: string;
  completed: boolean;
  status?: TaskStatus;
  background?: boolean;
  usage?: TaskUsageSummary;
  /** Resolved provider-native model id after selectModel(). */
  model?: string;
  provider?: string;
  reasoning_effort?: 'low' | 'medium' | 'high';
}
```

## PowerShell 7 Resolver (`src/core/powershell.ts`)

New 1.22.1 module that detects `pwsh.exe` (PowerShell 7) so Windows tool invocation can prefer it over the legacy `powershell.exe` (Windows PowerShell 5.1). PS 5.1 has known UTF-8 / encoding bugs — redirected pipes lose non-ASCII characters, `Out-File` defaults to UTF-16 with BOM — which manifested in Alexi as broken diff and grep output on Windows hosts. Ports kilocode `98ea338c8`.

### Detection strategy

Filesystem-only, no process spawn (safe to call from cold paths):

1. `which('pwsh')` walks `$PATH` honouring `%PATHEXT%` (`.COM;.EXE;.BAT;.CMD` by default on Windows).
2. `probe(env)` filters `locations(env)` down to files that actually exist. Known install roots covered: MSI (`%ProgramFiles%\PowerShell\7\pwsh.exe`), MSIX (`%ProgramFiles(x86)%\PowerShell\7\pwsh.exe`), and the Store alias (`%LOCALAPPDATA%\Microsoft\WindowsApps\pwsh.exe`).

### Public API

```typescript
export function args(command: string): string[];      // ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', command]
export const locations: (env?: NodeJS.ProcessEnv) => string[];   // candidate absolute paths
export const probe:     (env?: NodeJS.ProcessEnv) => string[];   // subset of `locations` that exist as files
export const pwsh:      (env?: NodeJS.ProcessEnv) => string | undefined; // best available `pwsh.exe`
export const PowerShell = { args, locations, probe, pwsh };
```

All env-reading helpers accept an injected `NodeJS.ProcessEnv` map so tests can supply synthetic environments without mutating `process.env`.

### Integration with the shell resolver

`src/tool/tools/shell/id.ts:76` (`windowsCandidates()`) now prepends `PowerShell.pwsh()` and `PowerShell.probe()` results before its hard-coded candidate list:

```typescript
const pwshHits = [PowerShell.pwsh(), ...PowerShell.probe()].filter(
  (item): item is string => Boolean(item)
);
return [
  ...pwshHits,
  winJoin(programFiles, 'PowerShell', '7', 'pwsh.exe'),
  winJoin(programFilesX86, 'PowerShell', '7', 'pwsh.exe'),
  winJoin(localAppData, 'Microsoft', 'WindowsApps', 'pwsh.exe'),
  winJoin(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
  winJoin(systemRoot, 'System32', 'cmd.exe'),
];
```

Effect: pwsh installed off-`PATH` still wins over the always-present legacy shell, and behaviour when pwsh is not installed matches the previous version exactly (falls through to the hard-coded win32 candidate list).

## Process Tree Walker (`src/core/pty/termination.ts`)

New 1.22.1 module returning the flat pid/ppid list the PTY termination logic walks before signalling descendants of a spawned leader.

### `/proc`-preferred fast path

On Linux, `tree()` reads every numeric entry under `/proc`, parses each `/proc/<pid>/stat` payload, and returns one `{ pid, parent }` row per running process:

```mermaid
flowchart TD
  A[tree called] --> B{process.platform === 'linux'?}
  B -- yes --> C[readdir /proc]
  C --> D[for each numeric dirent]
  D --> E[readFile /proc/pid/stat]
  E -- ENOENT / race --> F[drop silently]
  E -- ok --> G[parse '&lt;pid&gt; (&lt;comm&gt;) &lt;state&gt; &lt;ppid&gt;']
  G --> H[push ProcessRow]
  F --> I[Promise.all resolves]
  H --> I
  I --> J{rows.length &gt; 0?}
  J -- yes --> K[return rows]
  J -- no --> L[fall back to ps -axo pid=,ppid=]
  B -- no --> L
  L --> K
```

### Why prefer `/proc` over `ps`

- Faster (no process spawn, no pipe buffering, no locale parsing).
- No dependency on the `ps` binary — slim SAP AI Core runtime containers frequently strip procps/busybox and the `ps` code path fails with `ENOENT` in exactly the environments where PTY termination is most needed.
- Cannot be broken by exotic locale settings that change the `ps` output format.

### `aadded4a3` race tolerance

The regex `/^\d+ \(.*\) [A-Z] (\d+)/` intentionally skips past the LAST `)` in the comm field so process names containing spaces or parentheses parse unambiguously. Entries that vanish between `readdir('/proc')` and `readFile('/proc/<pid>/stat')` are silently dropped — a process exiting mid-walk is the expected outcome and must NOT propagate as an error. Ports kilocode `aadded4a3`.

The `ps` fallback path is preserved for non-Linux platforms and for the (unlikely) case that `/proc` is not mounted or readable, so behaviour on macOS and inside restricted containers is unchanged.

## Image Generation

Alexi ships **capability infrastructure and streaming payload normalisation** for image generation via SAP AI Core. The end-to-end user surface (a dedicated `alexi image` CLI command and an `image_generate` tool the agent can call) is planned but not yet landed — see [Roadmap and unimplemented pieces](#image-generation-roadmap-and-unimplemented-pieces) below. This section documents what is in the code today so callers can start building against the stable pieces without waiting for the CLI/tool layer.

> Note: this section is about image _generation_ (the model produces an image as output). Attaching an image _to_ a prompt (multimodal input via clipboard paste, `/image <path>` in the TUI, drag-and-drop) is a separate, fully-shipped feature backed by `src/utils/image.ts`, `src/utils/imageValidation.ts`, `src/utils/clipboard.ts`, and `src/cli/tui/context/AttachmentContext.tsx`. Do not conflate the two.

### Capability system

The provider layer publishes a narrow, closed set of capability tags used by feature gates (tool registration, image response handling, embeddings dispatch). Defined in `src/providers/sapOrchestration.ts` and re-exported by `src/providers/index.ts`.

```typescript
// src/providers/sapOrchestration.ts
export type ModelCapability = 'image-generation' | 'tools' | 'embeddings';

export interface OrchestrationModelMetadata {
  /** Capability tags advertised by the model. Missing = unknown. */
  capabilities?: ModelCapability[];
}

// Companion map keyed by OrchestrationModel id. Absence of an entry
// means "capability data not authored yet" (see `assumeWhenUnspecified`).
export const ORCHESTRATION_MODEL_METADATA: Readonly<
  Partial<Record<OrchestrationModel, OrchestrationModelMetadata>>
>;
```

The router has an unrelated `ModelCapability` interface at `src/core/router.ts:15` that describes a routable model (cost tier, strengths, max tokens). That router-facing type is _not_ the same as the capability-tag union above — the two live in different modules and serve different purposes. When reading or contributing code, always resolve the type via its import path.

### `modelHasCapability`

The single entry point for feature gates. Callers check the tag before invoking capability-specific logic (image chunk extraction, tool schema attachment, embeddings dispatch).

```typescript
// src/providers/sapOrchestration.ts
export interface ModelHasCapabilityOptions {
  /** Default: false. Returned when the model has no metadata entry. */
  assumeWhenUnspecified?: boolean;
}

export function modelHasCapability(
  modelId: string,
  capability: ModelCapability,
  options?: ModelHasCapabilityOptions
): boolean;
```

Resolution rules:

1. The id is normalised by stripping a leading `<provider>/` prefix (`stripProviderPrefix`), so `sap-ai-core/anthropic--claude-4.7-opus` and `anthropic--claude-4.7-opus` resolve identically.
2. If the normalised id exists in `ORCHESTRATION_MODEL_METADATA`, the answer is `capabilities?.includes(capability) ?? false`.
3. If the id is unknown, the answer is `options.assumeWhenUnspecified ?? false`. This is the escape hatch for legacy call sites; new call sites should keep the default `false` so a missing tag stays visible.
4. Behavioural subtlety: `assumeWhenUnspecified` only fires when there is **no entry at all**. An entry with `capabilities: []` reports `false` for every capability, regardless of the option — this is intentional so authors can distinguish "not authored yet" (missing entry) from "explicitly does not support anything in this dimension" (empty list).

Example usage from a streaming consumer:

```typescript
import { modelHasCapability } from '../providers/index.js';
import { extractImageChunks } from '../providers/transform.js';

if (modelHasCapability(session.modelId, 'image-generation')) {
  const chunks = extractImageChunks(delta.content);
  for (const chunk of chunks) {
    if (chunk.kind === 'url') {
      // fetch chunk.url
    } else {
      // decode chunk.data (base64) with chunk.mimeType
    }
  }
}
```

### Streaming image response handling

SAP AI Core surfaces image payloads in **two shapes** depending on the underlying provider, and `src/providers/transform.ts` normalises both into a discriminated union so downstream code (session log serializer, TUI image renderer once landed) does not need to re-parse SDK payloads.

```typescript
// src/providers/transform.ts
export type NormalizedImageChunk =
  | { kind: 'url'; url: string; mimeType?: string }
  | { kind: 'base64'; data: string; mimeType?: string };

export function extractImageChunk(item: unknown): NormalizedImageChunk | undefined;
export function extractImageChunks(content: unknown): NormalizedImageChunk[];
```

The two supported input shapes:

| SDK shape                                                       | Emitted by                     | Normalised to                                   |
| --------------------------------------------------------------- | ------------------------------ | ----------------------------------------------- |
| `{ type: 'image_url', image_url: { url, mime_type? } }`         | OpenAI-style (GPT image)       | `{ kind: 'url', url, mimeType? }`               |
| `{ type: 'image', image: { b64_json \| data, mime_type? } }` | Anthropic / Gemini-style       | `{ kind: 'base64', data, mimeType? }`           |

Guarantees of the extractors:

- Both accept `unknown` — they compose with the loosely-typed `delta.content` field (`string | Array<{ type; ... }>`) without requiring a caller-side type narrowing.
- Non-image items are silently skipped, so callers can invoke `extractImageChunks` unconditionally on any streaming payload.
- Missing / non-string `url` or base64 fields cause the item to be rejected (`undefined`). This guards against upstream schema drift.
- No I/O, no allocation of oversized buffers — safe to call on every chunk.

Callers **must** gate on `modelHasCapability(modelId, 'image-generation')` before invoking the extractors; the extractors themselves do not check.

### Model routing for image-generation requests

The router (`src/core/router.ts`) does not currently apply image-generation-specific rules — `scoreModel` scores on complexity, task type, cost preference, and the reasoning flag only. The design intent (see issue #1389 in the research notes) is that capability validation happens at the **provider dispatch layer** rather than as new router rules: a request that requires image generation is answered by dispatching to a model that advertises the tag, or by falling back with a clear error when no such model is available.

Practically this means that until an image-gen-capable model is added to `ORCHESTRATION_MODEL_METADATA` (see below), routing an image-generation request through the auto-router will land on a text model and the request will fail at the provider boundary rather than at the router. This is the intended failure mode for the current partial-implementation state.

### Roadmap and unimplemented pieces

The following pieces of the image-generation feature are **not yet in the codebase** and are documented here so contributors and users know the current boundary:

- **`image-generation` on any model in the catalog.** `ORCHESTRATION_MODEL_METADATA` currently tags no model with `image-generation`. The `image-generation` string is a valid `ModelCapability`, and the transform layer will normalise the payloads when a model starts emitting them, but there is no model to route to today. A future SAP-hosted image model (Anthropic Claude with image output, Gemini Imagen, Stable Diffusion) will be enabled by a single edit to the metadata map, without any code change to consumers.
- **`alexi image` CLI command.** Planned at `src/cli/commands/image.ts` with flags `--model`, `--size`, `--output`, registered in `src/cli/program.ts`. Tracked as issue #1391.
- **`image_generate` tool.** Planned at `src/tool/tools/image-generate.ts` using `defineTool` from `src/tool/index.ts`, with a Zod schema accepting `prompt` (required) and optional `model`, `size`, `style`, `quality`. Registered in `src/tool/registry.ts`. Tracked as issue #1390.
- **TUI image rendering.** A component under `src/cli/tui/components/` will render a `NormalizedImageChunk` inline in terminals that support Kitty or iTerm2 graphics protocols, falling back to `[Image: <mime>, <size>]` placeholders elsewhere. The optional `terminal-image` module (already used for the input-side attachment flow in `src/cli/tui/utils/terminalImage.ts`) is the anticipated backend.

When these pieces land, this section will be revised to document their user-facing surfaces alongside the infrastructure above.
