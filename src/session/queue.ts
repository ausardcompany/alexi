/**
 * Session Prompt Queue
 *
 * Ports upstream kilocode commits `039a235b6`, `de9e1edcf`, `52d4247d9`,
 * and `c3deca608` — a per-session FIFO of pending user prompts. When a
 * session's agent is already running a turn, incoming user prompts are
 * queued here instead of being dropped or racing against the in-flight
 * turn. After each turn completes, the caller drains the next queued
 * prompt and dispatches it.
 *
 * ## Why this exists
 *
 * Before the queue, a user typing while the assistant was still
 * streaming would either:
 *   - see their input silently dropped (bad UX);
 *   - get a `SessionBusy` error from `SessionBusyTracker` (worse UX);
 *   - or start a concurrent turn that mangled the transcript.
 *
 * The queue turns this into a natural "your message will be handled
 * after the current one" flow, and additionally supports:
 *   - editing a queued prompt (typo fix while waiting);
 *   - cancelling a queued prompt (`drop`) — carried by `messageID`
 *     forwarded by the remote sender, per commit `c3deca608`;
 *   - dropping empty prompts on enqueue (per commit `de9e1edcf` —
 *     empty submissions from the TUI should not queue a no-op turn).
 *
 * ## Guarantees
 *
 * - FIFO per session; no cross-session ordering.
 * - `messageID` is the caller-supplied stable id used to correlate the
 *   queued prompt with UI-side state (draft, edit, cancel). The queue
 *   itself does not generate it.
 * - The queue holds no references beyond the strings and does not
 *   perform I/O; construction is cheap.
 * - All mutating methods are O(n) in the queue length for that session
 *   (typically 0-3 in practice); the queue is not designed for
 *   thousands of pending prompts.
 */

/**
 * One entry in the per-session prompt queue.
 */
export interface QueuedPrompt {
  /** Caller-supplied stable id (mirrors the message id emitted by the UI). */
  messageID: string;
  /** Session this prompt is queued against. */
  sessionID: string;
  /** Prompt text as typed by the user. */
  text: string;
  /** Enqueue timestamp (`Date.now()`), for age-based diagnostics. */
  createdAt: number;
}

/**
 * Per-session FIFO of pending user prompts. See module JSDoc for the
 * lifecycle and integration contract.
 */
export class SessionQueue {
  private readonly queues = new Map<string, QueuedPrompt[]>();

  /**
   * Append a prompt to the given session's queue. Empty / whitespace-only
   * prompts are dropped (kilocode `de9e1edcf` — empty submissions should
   * not queue a no-op turn).
   */
  enqueue(sessionID: string, prompt: Omit<QueuedPrompt, 'createdAt'>): void {
    if (!prompt.text.trim()) {
      return;
    }
    const list = this.queues.get(sessionID) ?? [];
    list.push({ ...prompt, createdAt: Date.now() });
    this.queues.set(sessionID, list);
  }

  /**
   * Remove and return the next queued prompt for the given session, or
   * `undefined` when the queue is empty. Callers invoke this immediately
   * after a turn completes to drive the next queued turn.
   */
  drainNext(sessionID: string): QueuedPrompt | undefined {
    const list = this.queues.get(sessionID);
    if (!list || list.length === 0) {
      return undefined;
    }
    const next = list.shift();
    if (list.length === 0) {
      this.queues.delete(sessionID);
    }
    return next;
  }

  /**
   * Cancel a queued prompt by `messageID`. Returns true when a prompt
   * was actually removed. No-op when the prompt is not (or no longer)
   * queued. Ports commit `c3deca608`: the remote-sender forwards the
   * originating `messageID` so a cancellation from the client cleanly
   * removes the pending prompt.
   */
  drop(sessionID: string, messageID: string): boolean {
    const list = this.queues.get(sessionID);
    if (!list) {
      return false;
    }
    const idx = list.findIndex((p) => p.messageID === messageID);
    if (idx < 0) {
      return false;
    }
    list.splice(idx, 1);
    if (list.length === 0) {
      this.queues.delete(sessionID);
    }
    return true;
  }

  /**
   * Update the text of a queued prompt in-place. No-op when the prompt
   * is not queued. Empty text is *not* rejected here — that would leave
   * the queue in a state the caller cannot recover from; callers that
   * want to remove-on-empty should call `drop` explicitly.
   */
  edit(sessionID: string, messageID: string, text: string): boolean {
    const list = this.queues.get(sessionID);
    if (!list) {
      return false;
    }
    const idx = list.findIndex((p) => p.messageID === messageID);
    if (idx < 0) {
      return false;
    }
    list[idx] = { ...list[idx], text };
    return true;
  }

  /**
   * Snapshot of the queued prompts for a session (empty when nothing is
   * queued). Returned array is a copy — callers may not mutate the
   * queue through it.
   */
  peek(sessionID: string): QueuedPrompt[] {
    const list = this.queues.get(sessionID);
    return list ? list.slice() : [];
  }

  /** Number of prompts queued for the session. */
  size(sessionID: string): number {
    return this.queues.get(sessionID)?.length ?? 0;
  }

  /** Discard every queued prompt for the session. */
  clear(sessionID: string): void {
    this.queues.delete(sessionID);
  }

  /** Discard every queued prompt for every session. */
  clearAll(): void {
    this.queues.clear();
  }
}

// ============================================================================
// Global singleton (default queue)
// ============================================================================

let globalQueue: SessionQueue | null = null;

/**
 * Get the process-global `SessionQueue`. Convenient for call sites that
 * don't have a natural place to hold their own instance (agent runtime
 * hooks, remote-sender receivers). Tests that need isolation should
 * construct a fresh `SessionQueue` instead of relying on the global.
 */
export function getSessionQueue(): SessionQueue {
  if (!globalQueue) {
    globalQueue = new SessionQueue();
  }
  return globalQueue;
}

/** Test-only reset for the global queue. */
export function resetSessionQueue(): void {
  globalQueue = null;
}
