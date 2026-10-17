/**
 * Reasoning-replay buffer for late OpenRouter reasoning events.
 *
 * Ports kilocode commit `0f4936df1` — OpenRouter (and some SAP AI Core
 * reasoning-capable deployments routed through it) can emit reasoning
 * tokens AFTER the final content delta on a streaming turn. Without a
 * dedicated buffer those late events are discarded, which makes a
 * replayed session transcript look different from what the user saw
 * live (missing reasoning blocks on turns that showed them during
 * streaming).
 *
 * This buffer:
 *
 *   1. Accepts in-order reasoning events during the stream.
 *   2. Captures a `finalize()` barrier when the stream closes.
 *   3. Still accepts "late" events after finalization — they are
 *      inserted into the buffer and re-sorted by their `index` so the
 *      persisted record matches the live reasoning order.
 *
 * Pairs with `src/core/session/reasoning-finalize.ts` (which handles
 * the opposite problem: reasoning blocks that need to be finalized
 * before a stream retry so the retried turn does not inherit partial
 * reasoning). The two helpers are complementary:
 *
 *   - `reasoning-finalize.ts` → "stream dropped, don't let the partial
 *                               reasoning bleed into the next turn".
 *   - `reasoning-replay.ts`   → "stream finished cleanly, don't drop
 *                               late reasoning that arrived after the
 *                               final content delta".
 *
 * Framework-agnostic by design: the caller wires the buffer snapshot
 * into whatever persistence layer the session uses (sessionManager
 * JSONL, in-memory React state, etc.). This module does NOT touch
 * disk.
 */

/**
 * A single reasoning-token event emitted by the provider.
 *
 *   - `index` is the provider-assigned sequence number for the event.
 *     OpenRouter emits a strictly increasing index per turn; we rely on
 *     it to re-sort late events into their canonical position when
 *     `acceptLate` is called after `finalize`.
 *   - `text` is the raw reasoning fragment. The buffer does NOT join
 *     adjacent fragments — the caller does that on replay so empty
 *     fragments and provider-specific delimiters stay available.
 *   - `receivedAt` is the local wall-clock time the buffer saw the
 *     event. Useful for diagnostics ("how late was 'late'?") and for
 *     deterministic ordering when two events share the same `index`
 *     (shouldn't happen, but defensive).
 */
export interface ReasoningEvent {
  index: number;
  text: string;
  receivedAt: number;
}

/**
 * Minimal input shape callers supply — `receivedAt` is filled in by
 * the buffer so clients cannot forge it (which would break the "how
 * late is late?" diagnostic).
 */
export type ReasoningEventInput = Omit<ReasoningEvent, 'receivedAt'>;

/**
 * Append-mostly buffer for reasoning events with a `finalize` barrier.
 */
export class ReasoningBuffer {
  private events: ReasoningEvent[] = [];
  private finalized = false;

  /**
   * Record an in-stream reasoning event. Order follows caller insertion
   * — the buffer does NOT sort by `index` on the hot path because
   * OpenRouter already emits in order and sorting on every insert
   * would be O(n²) over the turn.
   */
  append(event: ReasoningEventInput): void {
    this.events.push({ ...event, receivedAt: Date.now() });
  }

  /**
   * Mark the stream as closed. Subsequent events must flow through
   * {@link acceptLate} so the ordering invariant is preserved.
   */
  finalize(): void {
    this.finalized = true;
  }

  /**
   * Record a reasoning event that MAY have arrived after finalization.
   *
   *   - Before finalize: behaves like {@link append} (fast path).
   *   - After finalize: appends then re-sorts the entire buffer by
   *     `index`. The sort is stable, so simultaneous indices (unusual
   *     but defended against) keep their original relative order.
   *
   * Returning `void` keeps the API identical to `append` so callers
   * can swap the two without branching.
   */
  acceptLate(event: ReasoningEventInput): void {
    if (!this.finalized) {
      this.append(event);
      return;
    }
    this.events.push({ ...event, receivedAt: Date.now() });
    this.events.sort((a, b) => a.index - b.index);
  }

  /**
   * Return a shallow-cloned snapshot of the recorded events in order.
   * Callers persist this to the session store; the clone keeps later
   * mutations on the buffer from aliasing the persisted record.
   */
  snapshot(): ReasoningEvent[] {
    return [...this.events];
  }

  /**
   * Whether `finalize()` has been called. Exposed so persistence
   * layers can decide whether a resave is still required (unfinalized
   * means the stream is in flight and a resave on every event would
   * be wasteful).
   */
  isFinalized(): boolean {
    return this.finalized;
  }

  /**
   * Reset the buffer. Primarily for test fixtures and session rewind
   * flows that reopen a prior turn for a fresh retry.
   */
  reset(): void {
    this.events = [];
    this.finalized = false;
  }
}
