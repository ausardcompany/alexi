/**
 * Contract: Input Box
 *
 * Fixed input area at the bottom of the TUI layout.
 * Phase 1: single-line via ink-text-input.
 * Phase 2: multi-line custom component.
 */

// --- InputBox ---

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

/**
 * Rendering:
 * - Prompt prefix: colored agent name + " ❯ " (e.g., green "code ❯ ")
 * - Text input area with cursor
 * - When disabled (streaming): show dimmed placeholder "Streaming..."
 * - Border: bottom border or no border (depends on layout)
 *
 * Behavior:
 * - Enter: submit text, clear input, call onSubmit
 * - Up arrow: cycle through input history (session-scoped)
 * - Slash commands: detected by "/" prefix, dispatched to command registry
 * - Bang commands: detected by "!" prefix, executed via child_process
 *
 * Phase 1 (single-line):
 * - Uses ink-text-input component
 * - No multi-line support
 *
 * Phase 2 (multi-line):
 * - Custom component with useInput
 * - Shift+Enter inserts newline
 * - Enter submits
 * - Input area grows up to maxHeight, then scrolls internally
 */

// --- Input History ---

export interface InputHistory {
  /** Add an entry to history */
  push: (entry: string) => void;
  /** Navigate up (older entries) */
  up: () => string | null;
  /** Navigate down (newer entries) */
  down: () => string | null;
  /** Reset navigation position */
  reset: () => void;
}

/**
 * Input history is session-scoped. Navigating with Up/Down arrows
 * cycles through previous inputs. Pressing Up at the top stays at
 * the oldest entry. Pressing Down past the newest returns to empty.
 */
