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
| TUI | `src/cli/tui/` | Ink-based terminal user interface |

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
| Read | `src/tool/tools/read.ts` | Read files and directories |
| Write | `src/tool/tools/write.ts` | Write files |
| Edit | `src/tool/tools/edit.ts` | Edit files with string replacement |
| Glob | `src/tool/tools/glob.ts` | Find files by pattern |
| Grep | `src/tool/tools/grep.ts` | Search file contents |
| Task | `src/tool/tools/task.ts` | Launch sub-agents |
| WebFetch | `src/tool/tools/webfetch.ts` | Fetch web content |
| Question | `src/tool/tools/question.ts` | Ask user questions |
| TodoWrite | `src/tool/tools/todowrite.ts` | Manage task lists |

### Support Systems

| Module | File | Description |
|--------|------|-------------|
| Event Bus | `src/bus/index.ts` | Pub/sub event system |
| Permission | `src/permission/index.ts` | File access control |
| Agent | `src/agent/index.ts` | Autonomous agent system |
| MCP | `src/mcp/index.ts` | Model Context Protocol |
| Skill | `src/skill/index.ts` | Specialized prompt skills |
| Compaction | `src/compaction/index.ts` | Context compression |
| Profile | `src/profile/index.ts` | User profile management |
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

## Terminal User Interface (TUI)

Alexi features a modern, interactive TUI built with Ink and React for real-time streaming conversations.

### TUI Architecture

```mermaid
graph TB
    subgraph TUI["TUI Layer (Ink + React)"]
        App[App.tsx]
        AppLayout[AppLayout Component]
        
        subgraph Components["UI Components"]
            Header[Header]
            MessageArea[MessageArea]
            InputBox[InputBox]
            StatusBar[StatusBar]
            AttachmentBar[AttachmentBar]
        end
        
        subgraph Contexts["React Contexts"]
            Theme[ThemeContext]
            Session[SessionContext]
            Chat[ChatContext]
            Keybind[KeybindContext]
            Dialog[DialogContext]
            Attachment[AttachmentContext]
        end
        
        subgraph Hooks["Custom Hooks"]
            UseStreamChat[useStreamChat]
            UseCommands[useCommands]
            UseKeyboard[useKeyboard]
            UseClipboard[useClipboardImage]
            UsePermission[usePermission]
            UseToolEvents[useToolEvents]
        end
        
        subgraph Dialogs["Dialog System"]
            ModelPicker[ModelPicker]
            AgentSelector[AgentSelector]
            PermissionDialog[PermissionDialog]
            CommandPalette[CommandPalette]
            SessionList[SessionList]
        end
    end
    
    App --> AppLayout
    AppLayout --> Components
    AppLayout --> Contexts
    AppLayout --> Hooks
    AppLayout --> Dialogs
    
    Components --> Contexts
    Hooks --> Contexts
    Dialogs --> Contexts
```

### TUI Component Structure

| Component | File | Description |
|-----------|------|-------------|
| App | `src/cli/tui/App.tsx` | Root component with provider tree |
| AppLayout | `src/cli/tui/App.tsx` | Main layout with header, messages, input, status |
| Header | `src/cli/tui/components/Header.tsx` | Session info and model display |
| MessageArea | `src/cli/tui/components/MessageArea.tsx` | Scrollable message history with streaming |
| InputBox | `src/cli/tui/components/InputBox.tsx` | Command input with autocomplete |
| StatusBar | `src/cli/tui/components/StatusBar.tsx` | Cost, streaming status, keybinds |
| AttachmentBar | `src/cli/tui/components/AttachmentBar.tsx` | Image attachment preview |
| CommandPalette | `src/cli/tui/components/CommandPalette.tsx` | Searchable command list (Ctrl+K) |

### TUI Context System

The TUI uses React Context for state management across components:

```typescript
// ThemeContext - Dark/light theme switching
interface ThemeContextValue {
  theme: Theme;
  setTheme: (name: 'dark' | 'light') => void;
}

// SessionContext - Session and agent state
interface SessionContextValue {
  sessionId: string;
  model: string;
  agent: string;
  setModel: (model: string) => void;
  setAgent: (agent: AgentName) => void;
  cycleAgent: (forward: boolean) => void;
  tokenCount: number;
  cost: { totalCost: number; currency: string };
}

// ChatContext - Message and streaming state
interface ChatContextValue {
  isStreaming: boolean;
  streamingText: string;
  responseModel: string | null;
  activeToolCalls: ToolCallDisplay[];
  clearStreamText: () => void;
  toggleToolCallExpansion: (id: string) => void;
  abortController: AbortController | null;
}

// KeybindContext - Leader key mode
interface KeybindContextValue {
  state: { leaderActive: boolean };
  activateLeader: () => void;
  deactivateLeader: () => void;
}

// AttachmentContext - Image attachments
interface AttachmentContextValue {
  pending: ImageAttachment[];
  reading: boolean;
  error: string | null;
  pasteFromClipboard: () => Promise<void>;
  addFromFile: (filePath: string) => Promise<void>;
  remove: (id: string) => void;
  clearAll: () => void;
  consumeAll: () => ImageAttachment[];
}
```

### Slash Command System

The TUI implements a declarative slash command system with autocomplete support:

```typescript
interface SlashCommand {
  name: string;
  aliases?: string[];
  description: string;
  category: CommandCategory;
  execute: (args: string, context: CommandContext) => Promise<boolean>;
}

// Built-in commands
const commands: SlashCommand[] = [
  { name: 'help', aliases: ['h'], description: 'Show available commands', category: 'general' },
  { name: 'exit', aliases: ['quit', 'q'], description: 'Exit the TUI', category: 'general' },
  { name: 'clear', description: 'Clear messages', category: 'general' },
  { name: 'model', description: 'Show or switch the current model', category: 'model' },
  { name: 'agent', description: 'Show or switch the current agent', category: 'session' },
  { name: 'status', description: 'Show current session status', category: 'session' },
  { name: 'sessions', description: 'Open session list', category: 'session' },
  { name: 'mcp', description: 'Manage MCP servers', category: 'config' },
  { name: 'theme', description: 'Switch theme (dark/light)', category: 'config' },
  { name: 'image', aliases: ['img'], description: 'Attach image from clipboard or file', category: 'general' },
  { name: 'clear-images', aliases: ['cli'], description: 'Remove all pending attachments', category: 'general' },
];
```

### Input Autocomplete Flow

```mermaid
sequenceDiagram
    participant User
    participant InputBox
    participant useCommands
    participant Autocomplete
    
    User->>InputBox: Type "/"
    InputBox->>Autocomplete: Filter commands (all)
    Autocomplete-->>InputBox: Show 6 suggestions
    
    User->>InputBox: Type "/he"
    InputBox->>Autocomplete: Filter commands (prefix "he")
    Autocomplete-->>InputBox: Show "help" (+ aliases)
    
    User->>InputBox: Press Down Arrow
    InputBox->>Autocomplete: Select next suggestion
    Autocomplete-->>InputBox: Highlight selection
    
    User->>InputBox: Press Enter/Tab
    InputBox->>InputBox: Accept suggestion
    InputBox-->>User: Fill "/help "
    
    User->>InputBox: Press Enter (submit)
    InputBox->>useCommands: handleCommand("/help")
    useCommands-->>InputBox: Command handled
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Cycle agents forward |
| `Shift+Tab` | Cycle agents backward (or navigate autocomplete) |
| `Ctrl+X` | Activate leader mode |
| `Ctrl+K` | Open command palette |
| `Ctrl+L` | Clear messages |
| `Ctrl+C` | Abort streaming / Exit |
| `Ctrl+V` | Paste image from clipboard |
| `Up Arrow` | Navigate command history / autocomplete |
| `Down Arrow` | Navigate command history / autocomplete |
| `Escape` | Dismiss autocomplete / Clear attachments |

### Leader Mode Keybinds

After pressing `Ctrl+X`, the following keys are active:

| Key | Action |
|-----|--------|
| `n` | New session |
| `m` | Open model picker |
| `a` | Open agent selector |
| `s` | Open session list |

### Clipboard Image Support

The TUI supports pasting images directly from the clipboard using platform-specific tools:

```mermaid
flowchart TB
    UserPaste[User Presses Ctrl+V] --> DetectPlatform{Detect Platform}
    
    DetectPlatform -->|macOS| TryPngpaste[Try pngpaste]
    DetectPlatform -->|Linux X11| TryXclip[Try xclip]
    DetectPlatform -->|Linux Wayland| TryWlPaste[Try wl-paste]
    DetectPlatform -->|Windows| TryPowershell[Try PowerShell]
    
    TryPngpaste -->|Available| UsePngpaste[Use pngpaste]
    TryPngpaste -->|Not Found| FallbackOsascript[Fallback to osascript]
    
    FallbackOsascript --> CreateTempFile[Create Temp File]
    CreateTempFile --> RunAppleScript[Run AppleScript]
    RunAppleScript --> ReadTempFile[Read PNG from Temp]
    ReadTempFile --> Cleanup[Cleanup Temp File]
    Cleanup --> ValidateImage
    
    UsePngpaste --> ReadStdout[Read PNG from stdout]
    TryXclip --> ReadStdout
    TryWlPaste --> ReadStdout
    TryPowershell --> ReadStdout
    
    ReadStdout --> ValidateImage[Validate Image Format]
    ValidateImage -->|PNG| AddAttachment[Add to Attachments]
    ValidateImage -->|Invalid| ShowError[Show Error]
    
    AddAttachment --> RenderPreview[Render Preview in AttachmentBar]
```

### Dialog System

Dialogs are rendered as full-screen overlays that replace the main content:

```typescript
type DialogType = 
  | 'permission'
  | 'model-picker'
  | 'agent-selector'
  | 'session-list'
  | 'mcp-manager'
  | 'command-palette'
  | 'confirm'
  | 'alert';

// Usage example
const { open } = useDialog();

// Open model picker
const selectedModel = await open('model-picker', {
  currentModel: 'gpt-4o',
  modelGroups: STATIC_MODEL_GROUPS,
});

// Open permission dialog
const result = await open('permission', {
  action: 'write',
  resource: '/path/to/file.ts',
  reason: 'Tool execution requires write access',
});
```

## Directory Structure

```
alexi/
├── src/
│   ├── cli/           # CLI entry points
│   │   └── tui/       # Terminal UI (Ink + React)
│   │       ├── components/   # UI components
│   │       ├── context/      # React contexts
│   │       ├── hooks/        # Custom hooks
│   │       ├── dialogs/      # Dialog components
│   │       ├── theme/        # Theme definitions
│   │       └── types/        # TypeScript types
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
│   └── utils/         # Utilities (clipboard, logger, etc.)
├── tests/             # Test files
│   ├── cli/tui/       # TUI component tests
│   └── ...
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

## Future Improvements

- [ ] Add more provider implementations
- [ ] Improve test coverage
- [ ] Add metrics and telemetry
- [ ] Implement caching layer
- [ ] Add web UI option
