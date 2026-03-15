/**
 * Contract: Message Area
 *
 * Scrollable conversation display showing user messages, assistant responses
 * (with streaming markdown), tool calls, and system messages.
 */

// --- MessageArea ---

export interface MessageAreaProps {
  /** All messages in the conversation */
  messages: MessageDisplay[];
  /** Currently streaming text (appended to last assistant message) */
  streamingText: string;
  /** Whether streaming is in progress */
  isStreaming: boolean;
  /** Active tool calls being executed */
  activeToolCalls: ToolCallDisplay[];
  /** Callback to toggle tool call expansion */
  onToggleToolCall: (toolCallId: string) => void;
}

/**
 * Rendering behavior:
 * - Uses flexGrow={1} + overflow="hidden" within the parent layout
 * - Manages scrollOffset state internally
 * - Auto-scrolls to bottom on new content when user is at/near bottom
 * - Supports manual scroll via Up/Down/PageUp/PageDown when focused
 * - Completed messages use <Static> for performance (write-once, never re-rendered)
 * - Only the latest streaming message + active tool calls are in the dynamic area
 */

// --- MessageBubble ---

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

/**
 * Rendering:
 * - User messages: right-aligned or prefixed with "You ❯", plain text
 * - Assistant messages: rendered through MarkdownRenderer, prefixed with agent badge
 * - System messages: dimmed, centered
 * - Metadata line below assistant messages: [model | N tokens | time]
 */

// --- MarkdownRenderer ---

export interface MarkdownRendererProps {
  /** Markdown text to render */
  markdown: string;
  /** Whether this is a partial (still streaming) render */
  isPartial: boolean;
}

/**
 * Rendering:
 * - Parses markdown using `marked` with `marked-terminal` renderer
 * - Handles partial markdown (unclosed code fences) by auto-closing
 * - Syntax-highlighted code blocks via `cli-highlight`
 * - Bold, italic, headers, lists, blockquotes, tables, links
 * - Output is ANSI string wrapped in <Text>
 *
 * Performance:
 * - Re-parses on every content change (streaming chunk)
 * - For very large messages (>10KB), consider caching parsed prefix
 */

// --- ToolCallBlock ---

export interface ToolCallBlockProps {
  /** Tool name */
  toolName: string;
  /** Tool parameters */
  params: Record<string, unknown>;
  /** Execution status */
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** Tool output */
  output: string | null;
  /** Error message */
  error: string | null;
  /** Whether output is expanded */
  isExpanded: boolean;
  /** Toggle expansion callback */
  onToggle: () => void;
  /** Diff data for file operations */
  diff: DiffData | null;
}

/**
 * Rendering:
 * - Header line: [icon] toolName(params...) [status indicator]
 *   - pending: ○ dimmed
 *   - running: spinner
 *   - completed: ✓ green
 *   - failed: ✗ red
 * - Body (when expanded):
 *   - For file ops with diff: <DiffView diff={diff} />
 *   - For bash: $ command\n output
 *   - For others: raw output text
 * - Click/Enter to toggle expansion
 * - Starts expanded while running, collapses when completed
 */

// --- DiffView ---

export interface DiffViewProps {
  /** File path being modified */
  filePath: string;
  /** Diff hunks to display */
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}

/**
 * Rendering:
 * - File path header: "─── path/to/file.ts ───"
 * - Hunk headers: "@@ -oldStart,oldLines +newStart,newLines @@" (dimmed)
 * - Added lines: green with "+" prefix
 * - Removed lines: red with "-" prefix
 * - Context lines: default color with " " prefix
 * - Line numbers in left gutter (dimmed)
 */

// Types referenced
interface MessageDisplay {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls: ToolCallDisplay[];
  agent?: string;
  model?: string;
  tokens?: number;
  timestamp: number;
}

interface ToolCallDisplay {
  id: string;
  toolName: string;
  params: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  diff: DiffData | null;
}

interface DiffData {
  filePath: string;
  hunks: DiffHunk[];
}
