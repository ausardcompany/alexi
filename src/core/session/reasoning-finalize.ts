/**
 * Reasoning-finalization helper used by stream retry sites.
 *
 * Ports kilocode commit `54eacd5ff` ("finalize reasoning before stream
 * retries"). When a streaming response is retried after a transient
 * failure (socket hang up, premature close, ETIMEDOUT, ...), any
 * reasoning / thinking tokens that were in flight on the dropped
 * stream must be marked as finalized before the next stream is opened.
 * If they are not, the UI (and any persistence layer) can carry the
 * partial reasoning block into the retried turn, producing corrupted
 * output where the retried turn's reasoning is concatenated onto a
 * stale half-finished one.
 *
 * The helper here is deliberately framework-agnostic: callers pass a
 * `ReasoningStreamState` describing an in-flight reasoning block (with
 * a `finalize` callback to emit the terminal reasoning part) and this
 * module resets the state. The actual emit is the caller's job because
 * every stream pipeline in Alexi carries a slightly different bus /
 * React-state / message-store surface.
 *
 * SAP AI Core streams through the orchestration API routinely surface
 * transient failures on reasoning-heavy models; this helper is wired
 * into `src/core/session/retry.ts::withRetry` via the optional
 * `onRetry` hook so every retry site gets the fix for free.
 */

export interface ReasoningStreamState {
  /** Accumulated reasoning text for the current block. Empty when no block is open. */
  buffer: string;
  /**
   * Whether the current block has been finalized. `true` means the
   * terminal reasoning-part event was already emitted and no further
   * finalization is required. Reset to `false` when a new block opens.
   */
  finalized: boolean;
  /**
   * Emit the terminal `reasoning` part. Implementations typically
   * publish a `{ type: 'reasoning', done: true }` event on the chat
   * bus or write a finalized reasoning message into the session store.
   *
   * Called at most once per block (the helper guards against double
   * finalize). May be synchronous or async.
   */
  finalize: () => void | Promise<void>;
}

/**
 * Finalize the in-flight reasoning block, if any, before a stream
 * retry opens the next stream.
 *
 * No-ops when the block is already finalized OR when the buffer is
 * empty (no reasoning tokens were seen yet on this attempt). Errors
 * thrown by `finalize` are swallowed with a warning: a retry must
 * always proceed, even if the finalization emit itself failed.
 */
export async function finalizeReasoningBeforeRetry(
  state: ReasoningStreamState | undefined
): Promise<void> {
  if (!state) {
    return;
  }
  if (state.finalized) {
    return;
  }
  if (state.buffer.length === 0) {
    // No reasoning tokens were seen on this attempt; mark finalized so
    // a stray late event does not reopen it, but skip the emit.
    state.finalized = true;
    return;
  }
  try {
    await state.finalize();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      `[alexi] reasoning finalize failed before stream retry (${
        err instanceof Error ? err.message : String(err)
      }); continuing with retry`
    );
  }
  state.finalized = true;
  state.buffer = '';
}

/**
 * Create a fresh reasoning stream state with the supplied finalize
 * emitter. Returns a mutable record that callers append tokens to via
 * {@link appendReasoningToken}.
 */
export function createReasoningStreamState(
  finalize: ReasoningStreamState['finalize']
): ReasoningStreamState {
  return {
    buffer: '',
    finalized: false,
    finalize,
  };
}

/**
 * Append a reasoning token to the state. Resets `finalized` to `false`
 * so a subsequent {@link finalizeReasoningBeforeRetry} call will emit
 * the terminal part.
 */
export function appendReasoningToken(state: ReasoningStreamState, token: string): void {
  if (token.length === 0) {
    return;
  }
  state.buffer += token;
  state.finalized = false;
}
