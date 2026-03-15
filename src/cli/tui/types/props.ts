/**
 * Component prop types for the TUI layer.
 *
 * Originally defined in specs/001-tui-clone/contracts/; copied here so that
 * production code never imports from outside `src/`, keeping TypeScript's
 * inferred rootDir stable and `dist/` output flat.
 */

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
}

export interface MarkdownRendererProps {
  /** Markdown text to render */
  markdown: string;
  /** Whether this is a partial (still streaming) render */
  isPartial: boolean;
}
