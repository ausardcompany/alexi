# Alexi Architecture

This document describes the high-level architecture of Alexi, an AI-powered CLI assistant.

## Overview

Alexi is a TypeScript/Node.js application that orchestrates multiple LLM providers with intelligent routing, session management, and extensible tool systems.

## System Architecture

```mermaid
graph TB
    subgraph CLI["CLI Layer"]
        Program[program.ts]
        Interactive[interactive.ts]
    end

    subgraph Core["Core Layer"]
        Orchestrator[orchestrator.ts]
        Router[router.ts]
        SessionManager[sessionManager.ts]
        StreamingOrch[streamingOrchestrator.ts]
    end

    subgraph Providers["Provider Layer"]
        OpenAI[openaiCompatible.ts]
        Anthropic[anthropicCompatible.ts]
        Claude[claudeNative.ts]
        SAP[sapOrchestration.ts]
        SAPNative[sapNative.ts]
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
    end

    subgraph Support["Support Systems"]
        Bus[bus/index.ts]
        Permission[permission/index.ts]
        Agent[agent/index.ts]
        MCP[mcp/index.ts]
        Skill[skill/index.ts]
    end

    Program --> Interactive
    Interactive --> Orchestrator
    Orchestrator --> Router
    Orchestrator --> SessionManager
    Orchestrator --> StreamingOrch
    Router --> OpenAI
    Router --> Anthropic
    Router --> Claude
    Router --> SAP
    Router --> SAPNative
    Orchestrator --> ToolIndex
    ToolIndex --> Bash
    ToolIndex --> Read
    ToolIndex --> Write
    ToolIndex --> Edit
    ToolIndex --> Glob
    ToolIndex --> Grep
    ToolIndex --> Task
    ToolIndex --> WebFetch
    Orchestrator --> Bus
    Orchestrator --> Permission
    Orchestrator --> Agent
    Orchestrator --> MCP
    Orchestrator --> Skill
```

## Module Descriptions

### CLI Layer

| Module | File | Description |
|--------|------|-------------|
| Program | `src/cli/program.ts` | CLI entry point using Commander.js |
| Interactive | `src/cli/interactive.ts` | Interactive mode with streaming UI |
| Completer | `src/cli/utils/completer.ts` | Unified autocomplete engine for commands, models, paths |
| Keybindings | `src/cli/utils/keybindings.ts` | Keyboard shortcut handling |

### Core Layer

| Module | File | Description |
|--------|------|-------------|
| Orchestrator | `src/core/orchestrator.ts` | Main orchestration logic |
| Router | `src/core/router.ts` | Model selection and routing |
| Session Manager | `src/core/sessionManager.ts` | Conversation session persistence |
| Streaming Orchestrator | `src/core/streamingOrchestrator.ts` | Real-time streaming support |
| Agentic Chat | `src/core/agenticChat.ts` | Autonomous agent with tool execution loop |
| Stage Manager | `src/core/stageManager.ts` | Workflow stage management |
| Workflow Manager | `src/core/workflowManager.ts` | Multi-stage workflow orchestration |

### Provider Layer

| Module | File | Description |
|--------|------|-------------|
| OpenAI Compatible | `src/providers/openaiCompatible.ts` | OpenAI API compatible provider |
| Anthropic Compatible | `src/providers/anthropicCompatible.ts` | Anthropic Messages API |
| Claude Native | `src/providers/claudeNative.ts` | Direct Claude integration |
| SAP Orchestration | `src/providers/sapOrchestration.ts` | SAP AI Core via SDK |
| SAP Native | `src/providers/sapNative.ts` | Native SAP AI Core API |

### Tool System

| Tool | File | Description |
|------|------|-------------|
| Bash | `src/tool/tools/bash.ts` | Execute shell commands |
| Bash Hierarchy | `src/tool/tools/bash-hierarchy.ts` | Hierarchical permission rules for bash commands |
| Read | `src/tool/tools/read.ts` | Read files and directories |
| Write | `src/tool/tools/write.ts` | Write files |
| Edit | `src/tool/tools/edit.ts` | Edit files with string replacement |
| Glob | `src/tool/tools/glob.ts` | Find files by pattern |
| Grep | `src/tool/tools/grep.ts` | Search file contents |
| WarpGrep | `src/tool/tools/warpgrep.ts` | AI-powered semantic code search |
| Task | `src/tool/tools/task.ts` | Launch sub-agents |
| WebFetch | `src/tool/tools/webfetch.ts` | Fetch web content |
| Question | `src/tool/tools/question.ts` | Ask user questions |
| TodoWrite | `src/tool/tools/todowrite.ts` | Manage task lists |

### Support Systems

| Module | File | Description |
|--------|------|-------------|
| Event Bus | `src/bus/index.ts` | Pub/sub event system |
| Permission | `src/permission/index.ts` | File access control |
| Permission Drain | `src/permission/drain.ts` | Auto-resolve pending permissions |
| Permission Next | `src/permission/next.ts` | Pattern matching utilities |
| Agent | `src/agent/index.ts` | Autonomous agent system |
| Agent System | `src/agent/system.ts` | Multi-layer system prompt assembly |
| Modes Migrator | `src/config/modes-migrator.ts` | Organization mode synchronization |
| Error Backoff | `src/core/error-backoff.ts` | Circuit breaker and exponential backoff |
| MCP | `src/mcp/index.ts` | Model Context Protocol |
| MCP Client | `src/mcp/client.ts` | MCP server connection management |
| Skill | `src/skill/index.ts` | Specialized prompt skills |
| Compaction | `src/compaction/index.ts` | Context compression |
| Profile | `src/profile/index.ts` | User profile management |
| User Config | `src/config/userConfig.ts` | Persistent user configuration |
| Logger | `src/utils/logger.ts` | Centralized logging utility |

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Orchestrator
    participant Router
    participant Provider
    participant Tools

    User->>CLI: Input message
    CLI->>Orchestrator: Process request
    Orchestrator->>Router: Select model
    Router-->>Orchestrator: Model selection
    Orchestrator->>Provider: Send to LLM
    Provider-->>Orchestrator: LLM response
    
    alt Tool calls needed
        Orchestrator->>Tools: Execute tool
        Tools-->>Orchestrator: Tool result
        Orchestrator->>Provider: Continue with result
        Provider-->>Orchestrator: Final response
    end
    
    Orchestrator-->>CLI: Response
    CLI-->>User: Display output
```

## Agentic Chat Flow

```mermaid
flowchart TB
    Start([Start Agentic Chat]) --> Init[Initialize Permission Manager]
    Init --> SetRoot[Set Project Root to workdir]
    SetRoot --> EnableExt[Enable External Directories]
    EnableExt --> AddRules[Add High-Priority Allow Rules]
    AddRules --> DetermineModel[Determine Model via Router]
    
    DetermineModel --> BuildMessages[Build Message History]
    BuildMessages --> LoopStart{Iteration < Max?}
    
    LoopStart -->|Yes| CallLLM[Call LLM with Tools]
    CallLLM --> CheckTools{Tool Calls?}
    
    CheckTools -->|Yes| ExecTools[Execute Tool Calls]
    ExecTools --> CheckPerm[Check Permissions]
    CheckPerm -->|Allowed| RunTool[Run Tool]
    CheckPerm -->|Denied| ReturnError[Return Permission Error]
    
    RunTool --> AddToolResult[Add Tool Result to Messages]
    ReturnError --> AddToolResult
    AddToolResult --> LoopStart
    
    CheckTools -->|No| RecordCost[Record Token Usage]
    RecordCost --> SaveSession[Save to Session]
    SaveSession --> End([Return Result])
    
    LoopStart -->|No| MaxReached[Max Iterations Reached]
    MaxReached --> End
```

## Permission System Flow

```mermaid
flowchart LR
    ToolExec[Tool Execution Request] --> HasPerm{Has Permission Config?}
    HasPerm -->|Yes| GetResource[Get Resource Path]
    HasPerm -->|No| DirectExec[Execute Directly]
    
    GetResource --> ResolveCtx[Resolve with Context]
    ResolveCtx --> CheckRules[Check Permission Rules]
    
    CheckRules --> EvalRules[Evaluate Rules by Priority]
    EvalRules --> LastMatch[Last Match Wins]
    
    LastMatch --> Decision{Decision?}
    Decision -->|Allow| Grant[Grant Permission]
    Decision -->|Deny| Reject[Deny Permission]
    Decision -->|Ask| Interactive[Interactive Prompt]
    
    Interactive --> UserResp{User Response}
    UserResp -->|Allow| Grant
    UserResp -->|Deny| Reject
    
    Grant --> DirectExec
    Reject --> RetErr[Return Error]
    DirectExec --> Result[Return Result]
    RetErr --> Result
```

## Tool System with Context Resolution

The tool system resolves relative paths using the workdir context:

```mermaid
flowchart TB
    ToolCall[Tool Call with Params] --> ParseParams[Parse Parameters]
    ParseParams --> CheckPath{Path Type?}
    
    CheckPath -->|Absolute| UseAbsolute[Use Path As-Is]
    CheckPath -->|Relative| ResolveRelative[Resolve with Workdir]
    
    ResolveRelative --> JoinPath[path.join workdir, filePath]
    JoinPath --> AbsolutePath[Absolute Path]
    UseAbsolute --> AbsolutePath
    
    AbsolutePath --> PermCheck[Permission Check]
    PermCheck --> GetResource[getResource params, context]
    GetResource --> CheckPerms[Check Against Rules]
    
    CheckPerms --> Allowed{Allowed?}
    Allowed -->|Yes| Execute[Execute Tool]
    Allowed -->|No| Deny[Return Permission Denied]
    
    Execute --> Result[Return Result]
    Deny --> Result
```

## Instruction File System

Alexi uses a multi-layer instruction file system to provide context to AI agents:

```mermaid
graph TB
    subgraph Sources[\"Instruction Sources\"]
        Soul[Soul Prompt<br/>core identity]
        Model[Model Prompt<br/>Anthropic/OpenAI/Gemini]
        Env[Environment Info<br/>workdir, git, platform]
        Agent[Agent Prompt<br/>code/debug/plan/explore]
        Project[Project AGENTS.md<br/>./AGENTS.md]
        User[User ALEXI.md<br/>~/.alexi/ALEXI.md]
        Rules[Project Rules<br/>.alexi/rules/*.md]
        Custom[Custom Rules<br/>user-provided]
    end
    
    subgraph Assembly[\"System Prompt Assembly\"]
        Assemble[buildAssembledSystemPrompt]
    end
    
    subgraph Output[\"Final Prompt\"]
        System[Complete System Prompt]
    end
    
    Soul --> Assemble
    Model --> Assemble
    Env --> Assemble
    Agent --> Assemble
    Project --> Assemble
    User --> Assemble
    Rules --> Assemble
    Custom --> Assemble
    
    Assemble --> System
    
    style Soul fill:#E3F2FD
    style Model fill:#E8F5E9
    style Agent fill:#FFF3E0
    style Project fill:#F3E5F5
    style User fill:#FCE4EC
    style Rules fill:#E0F2F1
    style System fill:#4CAF50
```

### Instruction File Locations

| File | Path | Purpose |
|------|------|---------|
| Project Instructions | `./AGENTS.md` | Project-specific context, coding standards, build commands |
| User Instructions | `~/.alexi/ALEXI.md` | Global user preferences applied to all projects |
| Project Rules | `./.alexi/rules/*.md` | Scoped rules for specific aspects (API design, security, etc.) |

### Managing Instruction Files

```bash
# List all instruction files
/memory

# Edit project instructions
/memory edit project

# Edit user instructions
/memory edit user

# Create AGENTS.md from template
/memory init
```

## Configuration

### Environment Variables

```
AICORE_SERVICE_KEY    # SAP AI Core credentials
AICORE_RESOURCE_GROUP # SAP AI Core resource group
OPENAI_API_KEY        # OpenAI API key (optional)
ANTHROPIC_API_KEY     # Anthropic API key (optional)
```

### Routing Configuration

Routing rules are defined in `routing-config.json` or `~/.alexi/routing-config.json`:

```json
{
  "rules": [
    {
      "name": "code-tasks",
      "priority": 100,
      "condition": { "contains": ["code", "implement", "fix"] },
      "model": "anthropic--claude-4-sonnet"
    }
  ],
  "default": {
    "model": "anthropic--claude-4-sonnet"
  }
}
```

## Directory Structure

```
alexi/
├── src/
│   ├── cli/           # CLI entry points
│   ├── core/          # Core orchestration
│   ├── providers/     # LLM providers
│   ├── tool/          # Tool system
│   │   └── tools/     # Individual tools
│   ├── agent/         # Agent system
│   ├── bus/           # Event bus
│   ├── permission/    # Permission system
│   ├── mcp/           # MCP integration
│   ├── skill/         # Skill system
│   ├── config/        # Configuration
│   ├── log/           # Logging
│   ├── profile/       # Profile management
│   └── ...
├── tests/             # Test files
├── dist/              # Compiled output
└── docs/              # Documentation
```

## Key Design Decisions

### 1. Multi-Provider Architecture

Alexi supports multiple LLM providers through a unified interface, allowing:
- Easy switching between providers
- Fallback mechanisms
- Cost optimization through routing

### 2. Tool System with Permission Control

Tools are implemented as independent modules that:
- Follow a consistent interface based on Zod schema validation
- Can be enabled/disabled per session
- Support permission-based access control with last-match-wins rule evaluation
- Resolve relative paths using workdir context for agentic operations
- Support interactive permission prompts and high-priority allow rules
- Convert Zod schemas to JSON Schema for LLM function calling with proper type handling

### 3. Agentic Execution Mode

The agentic chat system enables autonomous file operations:
- Automatic permission configuration for write and execute actions
- High-priority allow rules (priority 200) override default ask prompts
- External directory access for full workspace capability
- Tool execution loop with LLM-driven decision making
- Iteration limits to prevent infinite loops (default: 50)

### 4. Event-Driven Architecture

The event bus enables:
- Loose coupling between modules
- Plugin extensibility
- Real-time streaming updates
- Permission events (DoomLoopDetected, ExternalAccessAttempted)

### 5. Session Management

Sessions provide:
- Multi-turn conversation context
- Persistence across CLI invocations
- Export and sharing capabilities

## Security Considerations

1. **Secrets Management**: Secrets are redacted in exports and logs
2. **Permission System**: File access is controlled by configurable rules
3. **Environment Isolation**: Sensitive config stored in `~/.alexi/`
4. **Type Safety**: Strict TypeScript configuration with proper type assertions
5. **Logging**: Centralized logger replaces direct console calls for better control

## Logging System

Alexi uses a centralized logging utility to provide consistent logging across the application.

### Logger API

```typescript
import { logger } from './utils/logger.js';

// Set log level (debug, info, warn, error)
logger.setLevel('debug');

// Log messages at different levels
logger.debug('Debug message', additionalData);
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);

// Print without formatting (for CLI output)
logger.print('Raw output');
```

### Log Levels

| Level | Priority | Description | Output Format |
|-------|----------|-------------|---------------|
| `debug` | 0 | Detailed debugging information | `[DEBUG] message` |
| `info` | 1 | General informational messages | `message` (no prefix) |
| `warn` | 2 | Warning messages | `[WARN] message` |
| `error` | 3 | Error messages | `[ERROR] message` |

The logger respects the configured log level and only outputs messages at or above that level. The default level is `info`.

### ESLint Integration

The logger utility is the only module permitted to use direct console calls. All other modules should import and use the centralized logger to maintain ESLint compliance.

```typescript
// ❌ Avoid direct console usage
console.log('message');

// ✅ Use centralized logger
import { logger } from './utils/logger.js';
logger.info('message');
```

## Type Safety and Code Quality

### TypeScript Configuration

Alexi uses strict TypeScript configuration with proper type assertions:

```typescript
// Model capability filtering with explicit type assertion
const models = config.models.filter(
  (m) => (m as ModelCapability & { enabled?: boolean }).enabled !== false
);

// Zod schema type handling with interface definitions
interface ZodDefBase {
  description?: string;
}

const def = (schema as unknown as { _def: ZodDefBase })._def;
```

### ESLint Rules

Key ESLint rules enforced:

- `no-console: warn` - Prevents direct console usage (except in logger)
- `@typescript-eslint/no-explicit-any: warn` - Flags any type usage
- `@typescript-eslint/no-unused-vars: error` - Prevents unused variables
- `prefer-const: error` - Enforces const for immutable variables
- `eqeqeq: error` - Requires strict equality checks

### Code Quality Diagram

```mermaid
flowchart LR
    subgraph Development
        Code[Write Code] --> TypeCheck[TypeScript Check]
        TypeCheck --> Lint[ESLint]
        Lint --> Test[Run Tests]
    end
    
    subgraph Quality Gates
        Test --> Build[Build Project]
        Build --> CI[CI Pipeline]
    end
    
    subgraph Standards
        Logger[Centralized Logger]
        Types[Type Safety]
        Validation[Zod Validation]
    end
    
    Code --> Logger
    Code --> Types
    Code --> Validation
    
    CI --> Deploy{Pass?}
    Deploy -->|Yes| Merge[Merge to Main]
    Deploy -->|No| Fix[Fix Issues]
    Fix --> Code
```

## Organization-Managed Agents

Alexi supports organization-managed agent modes that sync from cloud configuration, enabling centralized agent management across teams.

### Organization Mode Architecture

```mermaid
graph TB
    subgraph Cloud[\"Cloud Configuration\"]
        OrgModes[Organization Modes]
    end
    
    subgraph Local[\"Local Agent Registry\"]
        Registry[Agent Registry]
        BuiltIn[Built-in Agents]
        OrgAgents[Organization Agents]
    end
    
    OrgModes -->|Sync| Migrator[Modes Migrator]
    Migrator -->|Register| Registry
    BuiltIn -->|Protected| Registry
    OrgAgents -->|Protected| Registry
    
    Registry -->|Switch| CurrentAgent[Current Agent]
    
    style OrgModes fill:#E3F2FD
    style Migrator fill:#4CAF50
    style Registry fill:#FFF3E0
```

### Organization Mode Features

1. **Cloud Synchronization**: Organization modes are synced from cloud configuration
2. **Display Names**: Human-readable names for better UX
3. **Protection**: Organization agents cannot be removed locally
4. **Metadata**: Options field tracks source and additional configuration
5. **Dashboard Management**: Changes must be made through cloud dashboard

```typescript
// Organization mode structure
interface OrgMode {
  name: string;
  displayName?: string;
  description?: string;
  steps?: string[];
  options?: Record<string, unknown>;
  permission?: Record<string, unknown>;
}

// Migrated to agent config
const agentConfig: AgentConfig = {
  id: mode.name,
  name: mode.displayName ?? mode.name,
  displayName: mode.displayName,
  description: mode.description ?? '',
  mode: 'all',
  systemPrompt: '',
  options: {
    ...mode.options,
    source: 'organization',
    displayName: mode.displayName,
  },
};
```

## Error Backoff System

The error backoff system provides resilient API error handling with circuit breaker pattern and exponential backoff.

### Error Backoff Flow

```mermaid
stateDiagram-v2
    [*] --> Normal
    Normal --> Error: API Error
    Error --> Backoff: Record Error
    Backoff --> CheckStatus: Time Elapsed
    CheckStatus --> Normal: Success
    CheckStatus --> Backoff: Still Backing Off
    CheckStatus --> Fatal: 4xx Error
    Fatal --> [*]
    
    note right of Backoff
        Exponential delay:
        initialDelay * multiplier^(errors-1)
        Max: maxDelayMs
    end note
```

### Backoff Configuration

```typescript
interface BackoffConfig {
  initialDelayMs: number;  // Default: 1000ms
  maxDelayMs: number;      // Default: 60000ms
  multiplier: number;      // Default: 2
  maxRetries: number;      // Default: 5
}

// Usage
const backoff = new ErrorBackoff({
  initialDelayMs: 1000,
  maxDelayMs: 60000,
  multiplier: 2,
  maxRetries: 5
});

// Record error (with optional status code)
backoff.recordError(503);

// Check if should wait
if (backoff.shouldBackoff()) {
  const remainingMs = backoff.getRemainingBackoffMs();
  await sleep(remainingMs);
}

// Check for fatal errors
if (backoff.isFatal()) {
  throw new Error('Fatal API error - client issue');
}

// Record success to reset
backoff.recordSuccess();
```

### Fatal Error Detection

The backoff system detects fatal 4xx client errors that should not be retried:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

These errors indicate client-side issues that won't be resolved by retrying.

## Permission Drain System

The permission drain system automatically resolves pending permissions when new rules are approved or denied, enabling seamless cross-session permission synchronization.

### Permission Drain Flow

```mermaid
sequenceDiagram
    participant SubA as Subagent A
    participant User
    participant Drain as Permission Drain
    participant SubB as Subagent B
    
    SubA->>User: Request Permission (file:write /project/*)
    User->>SubA: Approve Rule
    SubA->>Drain: Trigger Drain (approved rules)
    
    Note over Drain,SubB: SubB has pending permission<br/>for same pattern
    
    Drain->>Drain: Evaluate SubB's pending<br/>against new rules
    Drain->>SubB: Auto-approve (covered by rule)
    SubB->>SubB: Resume execution
```

### Drain Algorithm

```typescript
// Auto-resolve pending permissions
await drainCovered(
  pending,           // Pending permission requests
  approved,          // Newly approved/denied rules
  evaluate,          // Rule evaluation function
  events,            // Event bus for notifications
  DeniedError,       // Error class for denials
  exclude            // Optional: exclude triggering request
);

// Evaluation logic
for (const [id, entry] of Object.entries(pending)) {
  // Evaluate all patterns against current rules
  const actions = entry.info.patterns.map((pattern) =>
    evaluate(entry.info.permission, pattern, entry.ruleset, approved)
  );
  
  const denied = actions.some((r) => r.action === 'deny');
  const allowed = !denied && actions.every((r) => r.action === 'allow');
  
  if (denied) {
    entry.reject(new DeniedError(matchingRules));
  } else if (allowed) {
    entry.resolve();
  }
}
```

### Pattern Matching

The drain system uses glob pattern matching for granular permission control:

```typescript
// Pattern matching examples
matchesPattern('*.md', 'README.md')           // true
matchesPattern('src/**', 'src/core/file.ts')  // true
matchesPattern('/project/*', '/project/file') // true
matchesPattern('*', 'any-file')               // true

// Rule evaluation
const rules = [
  { pattern: 'src/**', action: 'allow' },
  { pattern: '*.test.ts', action: 'deny' }
];

evaluatePatternRules(rules, 'src/core/file.ts')    // 'allow'
evaluatePatternRules(rules, 'src/core/file.test.ts') // 'deny'
```

## MCP Client Resilience

The MCP (Model Context Protocol) client manager provides graceful failure handling for server initialization.

### MCP Connection Flow

```mermaid
graph TB
    Config[MCP Config] --> Filter[Filter Enabled Servers]
    Filter --> Parallel[Parallel Connection]
    
    Parallel --> Server1[Server 1]
    Parallel --> Server2[Server 2]
    Parallel --> Server3[Server 3]
    
    Server1 --> Result1{Success?}
    Server2 --> Result2{Success?}
    Server3 --> Result3{Success?}
    
    Result1 -->|Yes| Connected1[Connected]
    Result1 -->|No| Failed1[Failed - Warn]
    Result2 -->|Yes| Connected2[Connected]
    Result2 -->|No| Failed2[Failed - Warn]
    Result3 -->|Yes| Connected3[Connected]
    Result3 -->|No| Failed3[Failed - Warn]
    
    Connected1 --> Summary[Log Summary]
    Connected2 --> Summary
    Connected3 --> Summary
    Failed1 --> Summary
    Failed2 --> Summary
    Failed3 --> Summary
    
    style Connected1 fill:#4CAF50
    style Connected2 fill:#4CAF50
    style Connected3 fill:#4CAF50
    style Failed1 fill:#FF9800
    style Failed2 fill:#FF9800
    style Failed3 fill:#FF9800
```

### Graceful Failure Handling

```typescript
// Connect to all enabled servers
async connectFromConfig(): Promise<void> {
  const config = loadMcpConfig();
  const servers = config.servers.filter((s) => s.enabled && s.autoConnect);
  
  // Use Promise.allSettled for parallel connections
  const results = await Promise.allSettled(
    servers.map(async (server) => {
      try {
        const connection = await this.connect(server);
        if (connection.status === 'connected') {
          return { 
            server: server.name, 
            status: 'connected', 
            tools: connection.tools.length 
          };
        } else {
          return {
            server: server.name,
            status: 'failed',
            error: connection.error || 'Unknown error',
          };
        }
      } catch (error) {
        console.warn(`Failed to initialize MCP server ${server.name}:`, error);
        return {
          server: server.name,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );
  
  // Log initialization summary
  const successful = results.filter(
    (r) => r.status === 'fulfilled' && r.value.status === 'connected'
  ).length;
  const failed = results.filter(
    (r) => r.status === 'rejected' || 
           (r.status === 'fulfilled' && r.value.status === 'failed')
  ).length;
  
  if (servers.length > 0) {
    if (failed > 0) {
      console.warn(`MCP initialization: ${successful} connected, ${failed} failed`);
    } else {
      console.log(`MCP initialization: ${successful} server(s) connected`);
    }
  }
}
```

### Benefits

1. **Parallel Initialization**: All servers connect simultaneously
2. **Isolated Failures**: One server failure doesn't block others
3. **Detailed Logging**: Summary shows success/failure counts
4. **Graceful Degradation**: Application continues with available servers
5. **Error Tracking**: Failed servers logged with error messages

## Future Improvements

- [ ] Add more provider implementations
- [ ] Improve test coverage
- [ ] Add metrics and telemetry
- [ ] Implement caching layer
- [ ] Add web UI option
