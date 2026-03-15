/**
 * Contract: Dialog System
 *
 * Modal dialog overlays rendered with position="absolute" in Ink.
 * Managed by DialogContext which maintains a dialog stack.
 */

// --- DialogProvider ---

export interface DialogContextValue {
  /** Open a dialog and return a promise that resolves with the result */
  open: <T>(type: DialogType, props?: Record<string, unknown>) => Promise<T>;
  /** Close the topmost dialog */
  close: (result?: unknown) => void;
  /** Cancel the topmost dialog */
  cancel: () => void;
  /** Whether any dialog is currently open */
  isOpen: boolean;
  /** Current dialog type (topmost) */
  currentType: DialogType | null;
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

// --- ModelPicker Dialog ---

export interface ModelPickerProps {
  /** Currently selected model */
  currentModel: string;
  /** Available models grouped by provider */
  modelGroups: ModelGroup[];
}

export interface ModelGroup {
  provider: string;
  models: ModelOption[];
}

export interface ModelOption {
  id: string;
  label: string;
  description?: string;
}

/** Resolves with: selected model ID string */

// --- AgentSelector Dialog ---

export interface AgentSelectorProps {
  /** Currently active agent */
  currentAgent: string;
  /** Available agents */
  agents: AgentOption[];
}

export interface AgentOption {
  name: string;
  color: string;
  description: string;
}

/** Resolves with: selected agent name string */

// --- PermissionDialog ---

export interface PermissionDialogProps {
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

export interface PermissionResult {
  /** Whether permission was granted */
  granted: boolean;
  /** Whether to remember this decision */
  remember: boolean;
}

/**
 * Rendering:
 * - Centered modal with border
 * - Icon + action label at top
 * - Tool name + resource path
 * - Description text (word-wrapped)
 * - Action buttons: [A]pprove  [D]eny  [R]emember & Approve  [N]ever Ask
 *
 * Keyboard shortcuts:
 * - 'a' → granted: true, remember: false
 * - 'd' → granted: false, remember: false
 * - 'r' → granted: true, remember: true
 * - 'n' → granted: false, remember: true (never ask again for this pattern)
 * - Escape → same as 'd'
 */

// --- SessionList Dialog ---

export interface SessionListProps {
  /** All available sessions */
  sessions: SessionSummary[];
  /** Currently active session ID */
  activeSessionId: string;
}

export interface SessionSummary {
  id: string;
  name?: string;
  createdAt: number;
  messageCount: number;
  lastMessage?: string;
}

/** Resolves with: selected session ID string, or 'new' for new session */

// --- McpManager Dialog ---

export interface McpManagerProps {
  /** Connected MCP servers */
  servers: McpServerInfo[];
}

export interface McpServerInfo {
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  toolCount: number;
}

/**
 * Actions:
 * - Connect to new server (URL input)
 * - Disconnect server
 * - View server tools
 * - Refresh server connection
 */

// --- CommandPalette Dialog ---

export interface CommandPaletteProps {
  /** All available commands */
  commands: CommandEntry[];
}

export interface CommandEntry {
  name: string;
  description: string;
  category: string;
  shortcut?: string;
}

/**
 * Rendering:
 * - Top-center modal
 * - Search input with fuzzy matching (fuzzysort or simple includes)
 * - Filtered command list with category grouping
 * - Keyboard: type to filter, Up/Down to navigate, Enter to execute, Escape to close
 *
 * Resolves with: selected command name string
 */

// --- Generic Dialogs ---

export interface ConfirmDialogProps {
  message: string;
  confirmLabel?: string; // default: "Yes"
  cancelLabel?: string; // default: "No"
}

/** Resolves with: boolean */

export interface AlertDialogProps {
  title: string;
  message: string;
}

/** Resolves with: void (dismissed) */
