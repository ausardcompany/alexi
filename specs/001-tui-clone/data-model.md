# Data Model: Full TUI Clone

## 1. Core State Entities

### AppState

Top-level application state, managed across context providers.

```typescript
interface AppState {
  /** Active session data */
  session: SessionState;
  /** Chat/streaming state */
  chat: ChatState;
  /** Active dialog (if any) */
  dialog: DialogState;
  /** Theme preferences */
  theme: ThemeState;
  /** Keybinding mode */
  keybind: KeybindState;
}
```

---

### SessionState

Managed by `SessionContext`. Wraps the existing `SessionManager`.

```typescript
interface SessionState {
  /** Current session ID (from SessionManager) */
  sessionId: string;
  /** Current model identifier */
  model: string;
  /** Whether auto-routing is enabled */
  autoRoute: boolean;
  /** Active agent name */
  agent: AgentName;
  /** Active stage (if any) */
  stage: string | null;
  /** Conversation messages (from session history) */
  messages: Message[];
  /** Token count for current session */
  tokenCount: number;
  /** Cost tracking for current session */
  cost: CostInfo;
}

type AgentName = 'code' | 'debug' | 'plan' | 'explore' | 'orchestrator';

interface CostInfo {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  currency: string;
}
```

---

### ChatState

Managed by `ChatContext`. Drives the streaming message area.

```typescript
interface ChatState {
  /** Whether the LLM is currently streaming */
  isStreaming: boolean;
  /** Accumulated streaming text (partial markdown) */
  streamingText: string;
  /** Currently executing tool calls */
  activeToolCalls: ToolCallState[];
  /** Completed tool calls for the current turn */
  completedToolCalls: ToolCallState[];
  /** AbortController for cancelling the stream */
  abortController: AbortController | null;
  /** Error from the last chat attempt */
  error: string | null;
  /** Model used for the current response (may differ from session model if routed) */
  responseModel: string | null;
}

interface ToolCallState {
  /** Unique ID for this tool call */
  id: string;
  /** Tool name (read, write, edit, bash, glob, grep, etc.) */
  toolName: string;
  /** Tool parameters (varies per tool) */
  params: Record<string, unknown>;
  /** Tool execution status */
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** Tool output (populated when completed) */
  output: string | null;
  /** Error message (if failed) */
  error: string | null;
  /** Whether the output section is expanded in the UI */
  isExpanded: boolean;
  /** For file operations: the diff (if applicable) */
  diff: DiffData | null;
  /** Timestamp when tool call started */
  startedAt: number;
  /** Timestamp when tool call completed */
  completedAt: number | null;
}

interface DiffData {
  filePath: string;
  hunks: DiffHunk[];
}

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}
```

---

### DialogState

Managed by `DialogContext`. Dialog stack for modal overlays.

```typescript
interface DialogState {
  /** Stack of active dialogs (topmost is rendered) */
  stack: DialogEntry[];
}

interface DialogEntry {
  /** Dialog type discriminator */
  type: DialogType;
  /** Props passed to the dialog component */
  props: Record<string, unknown>;
  /** Callback when dialog resolves */
  onResolve: (result: unknown) => void;
  /** Callback when dialog is cancelled */
  onCancel: () => void;
}

type DialogType =
  | 'model-picker'
  | 'agent-selector'
  | 'permission'
  | 'session-list'
  | 'session-rename'
  | 'mcp-manager'
  | 'command-palette'
  | 'confirm'
  | 'alert';
```

---

### ThemeState

Managed by `ThemeContext`.

```typescript
interface ThemeState {
  /** Active theme name */
  active: 'dark' | 'light';
  /** Resolved theme colors */
  colors: ThemeColors;
  /** Border style preference */
  borderStyle: 'single' | 'round' | 'double' | 'bold';
}

interface ThemeColors {
  // Layout
  primary: string;        // Main accent color
  secondary: string;      // Secondary accent
  background: string;     // Not rendered (terminal bg) — for contrast decisions
  border: string;         // Box border color
  borderFocused: string;  // Focused element border

  // Text
  text: string;           // Default text color
  dimText: string;        // Muted/secondary text
  bold: string;           // Bold text color (usually same as text)

  // Semantic
  error: string;          // Error messages
  success: string;        // Success messages
  warning: string;        // Warnings
  info: string;           // Informational

  // Agent-specific
  agents: Record<AgentName, string>;

  // Tool call
  toolHeader: string;     // Tool call header color
  toolOutput: string;     // Tool output text color

  // Diff
  diffAdd: string;        // Added line color
  diffRemove: string;     // Removed line color
  diffContext: string;     // Context line color

  // Input
  prompt: string;         // Input prompt color
  cursor: string;         // Cursor color
  placeholder: string;    // Placeholder text color
}
```

---

### KeybindState

Managed by `KeybindContext`.

```typescript
interface KeybindState {
  /** Whether Ctrl+X leader mode is active */
  leaderActive: boolean;
  /** Leader mode timeout handle */
  leaderTimeout: ReturnType<typeof setTimeout> | null;
  /** Whether input is focused (vs dialog/palette) */
  inputFocused: boolean;
}
```

---

## 2. Message Entity

Messages represent the conversation history displayed in the message area.

```typescript
interface Message {
  /** Unique message ID */
  id: string;
  /** Message role */
  role: 'user' | 'assistant' | 'system';
  /** Message content (markdown for assistant, plain text for user) */
  content: string;
  /** Tool calls associated with this message (assistant only) */
  toolCalls: ToolCallState[];
  /** Timestamp */
  timestamp: number;
  /** Model that generated this message (assistant only) */
  model?: string;
  /** Agent that handled this message */
  agent?: AgentName;
  /** Token count for this message */
  tokens?: number;
}
```

---

## 3. Permission Entity

Permission requests flow through the event bus and surface as dialogs.

```typescript
interface PermissionRequest {
  /** Unique request ID */
  id: string;
  /** Permission action type */
  action: 'read' | 'write' | 'execute' | 'network' | 'admin';
  /** Tool requesting permission */
  toolName: string;
  /** Resource being accessed */
  resource: string;
  /** Human-readable description */
  description: string;
  /** Icon for the action */
  icon: string;
}

interface PermissionResponse {
  /** Request ID being responded to */
  requestId: string;
  /** Whether permission was granted */
  granted: boolean;
  /** Whether to remember this decision */
  remember: boolean;
}
```

---

## 4. Command Palette Entity

For the Ctrl+K command palette.

```typescript
interface Command {
  /** Slash command name (e.g., '/model', '/agent') */
  name: string;
  /** Human-readable description */
  description: string;
  /** Category for grouping */
  category: CommandCategory;
  /** Keyboard shortcut (if any) */
  shortcut?: string;
  /** Handler function */
  execute: (args?: string) => void | Promise<void>;
}

type CommandCategory =
  | 'general'
  | 'session'
  | 'context'
  | 'agent'
  | 'config'
  | 'git'
  | 'data'
  | 'mcp';
```

---

## 5. State Transitions

### Chat Flow
```
IDLE → USER_INPUT → STREAMING → TOOL_CALL → TOOL_RESULT → STREAMING → COMPLETE → IDLE
                                    ↓
                              PERMISSION_NEEDED → PERMISSION_DIALOG → GRANTED/DENIED
                                                                         ↓
                                                                   TOOL_CALL (resumed)
```

### Dialog Flow
```
NO_DIALOG → DIALOG_OPEN → USER_ACTION → DIALOG_RESOLVE → NO_DIALOG
                              ↓
                        DIALOG_CANCEL → NO_DIALOG
```

### Agent Cycling
```
Tab → cycleAgent(current, forward: true) → update SessionState.agent → refresh prompt color
Shift+Tab → cycleAgent(current, forward: false) → same
```

### Leader Mode
```
NORMAL → Ctrl+X → LEADER_ACTIVE (1.5s timeout) → key press → ACTION_DISPATCH → NORMAL
                                                → timeout → NORMAL
```

---

## 6. Relationship to Existing Entities

| TUI Entity | Existing Source | Mapping |
|------------|----------------|---------|
| `SessionState.messages` | `SessionManager.getHistory()` | Direct read |
| `SessionState.model` | `ReplState.model` | Renamed, same data |
| `SessionState.agent` | `ReplState.agent` | Same |
| `ChatState.isStreaming` | `ReplState.isStreaming` | Same |
| `ChatState.abortController` | `ReplState.abortController` | Same |
| `ToolCallState` | Event bus `ToolExecution` events | Subscription |
| `PermissionRequest` | Event bus `PermissionRequested` events | Subscription |
| `Message` | `streamChat()` return + session history | Composed from stream |
| `Command` | `handleCommand()` switch cases | Extracted into registry |
