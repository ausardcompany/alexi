/**
 * Session prompt entry — small refresh to match the upstream opencode
 * 2026-08 sync (`packages/opencode/src/session/prompt.ts`, +8/-1).
 *
 * Alexi's session-prompt surface is still a stub while the TUI-driven
 * session flow lives in `src/cli/tui/pages/ChatPage.tsx`, so the port
 * here is a lightweight helper module: it exports a `sendPrompt()`
 * facade that future consumers can wire into the streaming
 * orchestrator without touching the render layer.
 */

export interface SendPromptOptions {
  /** The prompt text as entered by the user (post-trim). */
  text: string;
  /**
   * Optional model override — when the operator has opted in via
   * `experimental.task_model_selection`, subagent prompts can pin a
   * specific model. Ignored otherwise (see `getConfigTaskModelSelection`).
   */
  model?: string;
  /** Optional provider hint accompanying `model`. */
  provider?: string;
  /** Optional reasoning effort hint for reasoning-capable models. */
  reasoning_effort?: 'low' | 'medium' | 'high';
}

/**
 * Facade for dispatching a prompt into the active session. The real
 * dispatch is owned by the streaming orchestrator in
 * `src/core/streamingOrchestrator.ts`; this helper exists so the TUI
 * can hand off a normalized payload without importing the orchestrator
 * directly (keeps the render layer testable in isolation).
 *
 * Returns the normalized options unchanged. When Alexi wires this up
 * to a real dispatcher, callers won't need to change their call sites.
 */
export function sendPrompt(options: SendPromptOptions): SendPromptOptions {
  return {
    ...options,
    text: options.text.trim(),
  };
}
