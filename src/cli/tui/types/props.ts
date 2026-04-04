/**
 * Component prop types for the TUI layer.
 *
 * Originally defined in specs/001-tui-clone/contracts/; copied here so that
 * production code never imports from outside `src/`, keeping TypeScript's
 * inferred rootDir stable and `dist/` output flat.
 */

import type React from 'react';
import type { ImageAttachmentPreview } from '../context/AttachmentContext.js';
import type { SlashCommand } from '../hooks/useCommands.js';

// ---------------------------------------------------------------------------
// Header & StatusBar  (from contracts/app-layout.ts)
// ---------------------------------------------------------------------------

export interface HeaderProps {
  model: string;
  agent: string;
  agentColor: string;
  sessionId: string;
  tokenCount: number;
  autoRoute: boolean;
}

export interface StatusBarProps {
  agent: string;
  model: string;
  cost: { totalCost: number; currency: string };
  isStreaming: boolean;
  leaderActive: boolean;
  tokenCount?: number;
  sessionId?: string;
}

// ---------------------------------------------------------------------------
// InputBox  (from contracts/input-box.ts)
// ---------------------------------------------------------------------------

export interface InputBoxProps {
  /** Current agent name (determines prompt color) */
  agent: string;
  /** Agent color from theme */
  agentColor: string;
  /** Whether input should be disabled (e.g., during streaming) */
  disabled: boolean;
  /** Callback when user submits input (Enter) */
  onSubmit: (text: string) => void;
  /** Whether this component has focus */
  isFocused: boolean;
  /** Available slash commands for inline autocomplete */
  commands?: SlashCommand[];
}

// ---------------------------------------------------------------------------
// MessageBubble & MarkdownRenderer  (from contracts/message-area.ts)
// ---------------------------------------------------------------------------

export interface MessageBubbleProps {
  /** Message role determines styling */
  role: 'user' | 'assistant' | 'system';
  /** Message content (markdown for assistant, plain for user) */
  content: string;
  /** Agent name (for assistant messages — determines color) */
  agent?: string;
  /** Model name (for assistant messages — shown in metadata) */
  model?: string;
  /** Token count (shown in metadata) */
  tokens?: number;
  /** Timestamp */
  timestamp: number;
  /** Image attachments included with this message (display metadata only). */
  images?: ImageAttachmentPreview[];
}

export interface MarkdownRendererProps {
  /** Markdown text to render */
  markdown: string;
  /** Whether this is a partial (still streaming) render */
  isPartial: boolean;
  /** Override effective width for markdown rendering (defaults to columns - 8) */
  maxWidth?: number;
}

// ---------------------------------------------------------------------------
// Data types (from data-model.md)
// ---------------------------------------------------------------------------

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  timestamp: number;
}

export interface HelpEntry {
  key: string;
  description: string;
  category: 'navigation' | 'dialogs' | 'chat' | 'leader' | 'input' | 'vim';
  condition: string | null;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  data: unknown | null;
}

export interface FilePickerResult {
  path: string;
  positions: Set<number>;
  score: number;
}

export interface ScrollState {
  offset: number;
  isAtBottom: boolean;
  totalLines: number;
  viewportHeight: number;
}

export type VimMode = 'normal' | 'insert' | 'visual' | 'command';

export interface VimState {
  mode: VimMode;
  enabled: boolean;
  pendingOperator: string | null;
  count: number | null;
  commandBuffer: string;
}

export interface EditorSnapshot {
  lines: string[];
  cursorRow: number;
  cursorCol: number;
}

export interface EditorState {
  lines: string[];
  cursorRow: number;
  cursorCol: number;
  selectionStart: { row: number; col: number } | null;
  selectionEnd: { row: number; col: number } | null;
  undoStack: EditorSnapshot[];
  redoStack: EditorSnapshot[];
}

// ---------------------------------------------------------------------------
// New component props (from contracts/new-component-props.md)
// ---------------------------------------------------------------------------

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string | number;
  leftVisible?: boolean;
  borderStyle?: 'single' | 'round' | 'bold' | 'double';
  borderColor?: string;
}

export interface SidebarProps {
  files: FileChange[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onActivate: (path: string) => void;
  isFocused: boolean;
}

export interface LogViewerProps {
  entries: LogEntry[];
  filterQuery?: string;
  levelFilter?: LogEntry['level'] | 'all';
  autoScroll?: boolean;
}

export interface HelpDialogProps {
  entries: HelpEntry[];
  onClose: () => void;
}

export interface FilePickerProps {
  rootDir: string;
  onSelect: (paths: string[]) => void;
  onCancel: () => void;
  multiSelect?: boolean;
  include?: string[];
  exclude?: string[];
}

export interface QuitDialogProps {
  hasActiveSession: boolean;
  tokenCount: number;
  onChoice: (action: 'quit' | 'cancel' | 'save-and-quit') => void;
}

export interface ThemeDialogProps {
  currentTheme: 'dark' | 'light';
  themes: Array<{ name: string; label: string }>;
  onSelect: (theme: string) => void;
  onCancel: () => void;
}

export interface ArgField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export interface ArgDialogProps {
  title: string;
  fields: ArgField[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}
