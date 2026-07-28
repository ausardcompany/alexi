/**
 * Stream watchdog for provider streaming.
 *
 * Wraps a provider `AsyncIterable<StreamChunk>` (e.g.
 * `provider.streamComplete(...)`) in a hand-rolled `AsyncIterableIterator`
 * with two properties that a native `async function*` generator cannot
 * provide:
 *
 * 1. **Preemptive return().** Calling `return()` fires an internal
 *    `AbortController` and *does not await* the outstanding pull on the
 *    source. The source's `return()` is forwarded (best-effort, unawaited)
 *    so its finally-block runs, but the wrapper resolves the caller
 *    immediately. This fixes the Cline-#12249 preemption trap in which a
 *    native `async function*` cannot preempt its in-flight `await` on the
 *    source iterator when the consumer breaks the loop or calls `return()`.
 *
 * 2. **Idle-timeout watchdog.** If no chunk arrives within
 *    `idleTimeoutMs` (default 30_000 ms), the wrapper aborts the source
 *    and rejects the pending `next()` with a synthetic `AbortError` carrying
 *    the reason `stream idle timeout`. Long-running tool calls (bash,
 *    shell, background_process, agent_manager, ...) extend the idle
 *    window to `toolExtensionMs` (default 10 minutes) while the model is
 *    streaming their tool-call deltas.
 *
 * The wrapper is deliberately provider-agnostic: it consumes any
 * `AsyncIterable<StreamChunk>` and forwards the caller's `AbortSignal` to
 * the source (in addition to its own idle-timeout controller). Callers pass
 * `sourceFactory(signal)` — a function that returns the source iterable
 * given the effective abort signal — so the wrapper can splice in its own
 * timeout controller upstream of the source.
 */

import type { StreamChunk } from '../providers/index.js';

/**
 * Error raised when the streaming watchdog detects a stalled provider
 * stream — i.e. no chunk arrived within the configured idle window.
 *
 * The error is thrown from the pending `next()` call on the watchdog
 * iterator and propagates up through `streamChat`. Callers can
 * distinguish a stall from a user-initiated abort via
 * `err instanceof StreamStalledError`. For legacy call sites that
 * key off `err.name === 'AbortError'`, the name is set to
 * `'StreamStalledError'` but a companion boolean flag `isStreamStalled`
 * and `code: 'STREAM_STALLED'` are attached so the router can classify
 * it as transient without a string-compare.
 *
 * See issue #1164.
 */
export class StreamStalledError extends Error {
  /** Discriminator for `router.classifyRouteError` and TUI/CLI branches. */
  readonly isStreamStalled = true;
  /** Machine-readable code kept stable across message revisions. */
  readonly code = 'STREAM_STALLED';
  /** Idle window (ms) that had elapsed with no chunk when the timer fired. */
  readonly timeoutMs: number;
  constructor(timeoutMs: number, message?: string) {
    super(message ?? `Stream stalled. No response for ${Math.round(timeoutMs / 1000)}s.`);
    this.name = 'StreamStalledError';
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Type-guard for {@link StreamStalledError} that also matches plain
 * objects wearing the `isStreamStalled` marker (defensive against error
 * instances re-created across module boundaries).
 */
export function isStreamStalledError(err: unknown): err is StreamStalledError {
  if (err instanceof StreamStalledError) {
    return true;
  }
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { isStreamStalled?: unknown }).isStreamStalled === true
  );
}

/**
 * Names of tools whose in-flight tool-call chunks should extend the idle
 * timeout window. These are tools that legitimately produce long silent
 * periods (e.g. shell commands, background processes, sub-agents). The
 * match is done on the `tool_calls[].function.name` field of streaming
 * deltas.
 *
 * Keep this list in sync with the actual tool `name` values in
 * `src/tool/tools/*.ts`.
 */
export const DEFAULT_LONG_RUNNING_TOOL_NAMES: ReadonlySet<string> = new Set([
  'bash',
  'shell',
  'background_process',
  'agent_manager',
]);

/**
 * Resolve the effective default idle timeout, honouring the
 * `STREAM_STALL_TIMEOUT_MS` environment variable when set to a positive
 * integer. Falls back to 30_000 ms otherwise.
 *
 * The env var is read on each call (not cached at import time) so tests
 * and long-running processes can adjust the value at runtime.
 */
export function resolveDefaultStreamIdleTimeoutMs(): number {
  const raw = process.env.STREAM_STALL_TIMEOUT_MS;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const parsed = parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return 30_000;
}

/**
 * Default idle-timeout window before a stalled stream is aborted.
 *
 * NOTE: Read at import time. For env-var-aware resolution use
 * {@link resolveDefaultStreamIdleTimeoutMs} — the streaming orchestrator
 * calls the function on every stream so a mid-session `STREAM_STALL_TIMEOUT_MS`
 * change takes effect on the next request.
 */
export const DEFAULT_STREAM_IDLE_TIMEOUT_MS = resolveDefaultStreamIdleTimeoutMs();

/** Default extended idle window when a long-running tool is in-flight. */
export const DEFAULT_STREAM_TOOL_EXTENSION_MS = 10 * 60 * 1000;

/**
 * Options accepted by {@link createStreamWatchdog}.
 */
export interface StreamWatchdogOptions {
  /**
   * Idle timeout in milliseconds. If no chunk arrives within this window,
   * the watchdog aborts the source stream. Default: 30_000 ms.
   */
  idleTimeoutMs?: number;
  /**
   * Extended idle window (ms) applied while a long-running tool-call chunk
   * is being streamed. Default: 600_000 ms (10 minutes).
   */
  toolExtensionMs?: number;
  /**
   * Set of tool names whose tool-call deltas extend the idle window.
   * Default: {@link DEFAULT_LONG_RUNNING_TOOL_NAMES}.
   */
  longRunningToolNames?: ReadonlySet<string>;
  /**
   * Parent abort signal from the caller (e.g. user-pressed Ctrl+C).
   * The watchdog links its internal controller so aborting either
   * parent or watchdog triggers the source's teardown.
   */
  signal?: AbortSignal;
}

/**
 * Factory that produces the source stream, given the effective abort
 * signal the caller must forward to the provider. This indirection lets
 * the watchdog splice its own timeout controller into the signal chain
 * without the caller having to know about it.
 *
 * The returned source may be either an `AsyncIterable<StreamChunk>` (the
 * production case, where `provider.streamComplete` is an
 * `async function*`) or an `Iterable<StreamChunk>` (test doubles that use
 * a sync `function*`). The watchdog normalizes both shapes.
 */
export type StreamSourceFactory = (
  signal: AbortSignal
) => AsyncIterable<StreamChunk> | Iterable<StreamChunk>;

/**
 * The hand-rolled async-iterator shape the watchdog returns. Exposes the
 * same surface as `AsyncGenerator<StreamChunk, void>` so callers can drop
 * it into a `for await` loop OR drive it manually with `next()`/`return()`.
 */
export interface StreamWatchdogIterator extends AsyncIterableIterator<StreamChunk> {
  /**
   * Preemptively terminate the stream. Fires the internal abort controller
   * (which cascades to the source) and forwards `return()` to the source
   * without awaiting outstanding pulls. Resolves synchronously with
   * `{ done: true, value: undefined }`.
   */
  return(value?: unknown): Promise<IteratorResult<StreamChunk, undefined>>;
  /**
   * Propagate an error into the wrapper. Behaves like `return()` for
   * cleanup purposes and then rejects with the given error.
   */
  throw(err?: unknown): Promise<IteratorResult<StreamChunk, undefined>>;
}

/**
 * Create a watchdog-wrapped async iterator over a provider stream.
 *
 * @param sourceFactory Callback that creates the source iterable given
 *   the effective abort signal. The factory is called eagerly (before
 *   the first `next()`) so any construction cost is paid up-front.
 * @param options Optional watchdog configuration.
 * @returns A hand-rolled AsyncIterableIterator whose `return()` preempts
 *   the outstanding source pull.
 */
export function createStreamWatchdog(
  sourceFactory: StreamSourceFactory,
  options?: StreamWatchdogOptions
): StreamWatchdogIterator {
  const idleTimeoutMs = options?.idleTimeoutMs ?? DEFAULT_STREAM_IDLE_TIMEOUT_MS;
  const toolExtensionMs = options?.toolExtensionMs ?? DEFAULT_STREAM_TOOL_EXTENSION_MS;
  const longRunningToolNames = options?.longRunningToolNames ?? DEFAULT_LONG_RUNNING_TOOL_NAMES;

  // Internal controller: aborted on idle timeout, on preemptive return(), or
  // when the parent signal fires. Its signal is what we forward to the
  // provider source, so any of the three paths cascades to a real HTTP
  // teardown inside the provider.
  const controller = new AbortController();

  const parentSignal = options?.signal;
  if (parentSignal) {
    if (parentSignal.aborted) {
      controller.abort(parentSignal.reason);
    } else {
      parentSignal.addEventListener(
        'abort',
        () => {
          controller.abort(parentSignal.reason);
        },
        { once: true }
      );
    }
  }

  // Construct the source eagerly so we can grab its iterator up-front.
  // Any exception here bubbles synchronously to the caller (parity with an
  // async generator's first-`next()` throw).
  const source = sourceFactory(controller.signal);
  const sourceIter = toAsyncIterator(source);

  // Track whether we have already torn down. Multiple return() calls are
  // idempotent.
  let finished = false;
  // Track currently-active tool-call names so the idle window can be
  // extended while any long-running tool is in flight.
  const activeLongRunningTools = new Map<number, string>();

  // Idle watchdog state: a single active timer, restarted on each chunk.
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let currentWindowMs = idleTimeoutMs;

  function clearIdleTimer(): void {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function armIdleTimer(): void {
    clearIdleTimer();
    if (currentWindowMs <= 0 || !Number.isFinite(currentWindowMs)) {
      return;
    }
    const armedWindowMs = currentWindowMs;
    idleTimer = setTimeout(() => {
      idleTimer = null;
      if (!finished && !controller.signal.aborted) {
        controller.abort(new StreamStalledError(armedWindowMs));
      }
    }, currentWindowMs);
    // Do not keep the Node event loop alive solely for a watchdog timer.
    // If the user has explicitly abandoned the process, the timer should
    // not delay exit.
    if (typeof (idleTimer as { unref?: () => void }).unref === 'function') {
      (idleTimer as { unref: () => void }).unref();
    }
  }

  function recomputeWindow(): void {
    // Extend to toolExtensionMs while any long-running tool is active,
    // otherwise revert to the base idle timeout.
    const nextWindow = activeLongRunningTools.size > 0 ? toolExtensionMs : idleTimeoutMs;
    if (nextWindow !== currentWindowMs) {
      currentWindowMs = nextWindow;
    }
  }

  function trackToolCalls(chunk: StreamChunk): void {
    const toolCalls = chunk.toolCalls;
    if (!toolCalls || toolCalls.length === 0) {
      return;
    }
    let changed = false;
    for (const tc of toolCalls) {
      const name = tc.function?.name;
      if (!name) {
        continue;
      }
      if (!longRunningToolNames.has(name)) {
        continue;
      }
      // Streaming tool-call deltas repeat the same index for one tool call;
      // record the first observed name at that index. New indices signal a
      // new tool call.
      if (!activeLongRunningTools.has(tc.index)) {
        activeLongRunningTools.set(tc.index, name);
        changed = true;
      }
    }
    if (changed) {
      recomputeWindow();
    }
  }

  function releaseToolCallsOnFinish(chunk: StreamChunk): void {
    // The provider emits a terminal chunk with `finishReason` set; at that
    // point any in-flight tool call is considered "queued" for execution
    // and no longer producing streamed silence. Reset the idle window so
    // stale extensions do not linger for the caller's post-stream logic.
    if (chunk.finishReason && activeLongRunningTools.size > 0) {
      activeLongRunningTools.clear();
      recomputeWindow();
    }
  }

  // Hand-rolled next(): races the source's pull against our internal abort
  // signal. If the source resolves first, we forward the chunk (and reset
  // the idle timer). If the abort fires first (idle timeout OR parent OR
  // preemptive return()), we reject with an AbortError immediately, without
  // waiting for the source to unstick.
  async function next(): Promise<IteratorResult<StreamChunk, undefined>> {
    if (finished) {
      return { value: undefined, done: true };
    }
    // If already aborted before we start pulling, short-circuit.
    if (controller.signal.aborted) {
      await cleanup();
      throw abortError(controller.signal.reason);
    }

    armIdleTimer();

    const abortPromise = new Promise<never>((_resolve, reject) => {
      if (controller.signal.aborted) {
        reject(abortError(controller.signal.reason));
        return;
      }
      controller.signal.addEventListener(
        'abort',
        () => {
          reject(abortError(controller.signal.reason));
        },
        { once: true }
      );
    });

    try {
      const result = await Promise.race([sourceIter.next(), abortPromise]);
      // Any completion (value or done) counts as activity: clear the timer
      // before we re-arm on the next pull.
      clearIdleTimer();
      if (result.done) {
        finished = true;
        return { value: undefined, done: true };
      }
      const chunk = result.value;
      trackToolCalls(chunk);
      releaseToolCallsOnFinish(chunk);
      return { value: chunk, done: false };
    } catch (err) {
      // On any error (including our own abort), tear down the source.
      // Cleanup is best-effort and intentionally unawaited to preserve the
      // preemption guarantee from return().
      finished = true;
      clearIdleTimer();
      // Fire-and-forget source.return() so its finally-block runs; do not
      // await, because that is precisely the Cline #12249 trap.
      void safeSourceReturn();
      throw err;
    }
  }

  async function cleanup(): Promise<void> {
    finished = true;
    clearIdleTimer();
    void safeSourceReturn();
  }

  // Best-effort source teardown. Some sources implement `return()`, others
  // do not. Anything thrown from the source's return is swallowed here to
  // preserve the preemption guarantee.
  async function safeSourceReturn(): Promise<void> {
    try {
      if (typeof sourceIter.return === 'function') {
        await sourceIter.return();
      }
    } catch {
      // Swallow — source cleanup errors should not surface to the caller
      // that already asked to stop.
    }
  }

  // Preemptive return(): fires the abort controller (waking any pending
  // race in next()), marks finished, forwards return() to the source
  // WITHOUT awaiting it, and resolves immediately.
  async function returnFn(_value?: unknown): Promise<IteratorResult<StreamChunk, undefined>> {
    if (finished) {
      return { value: undefined, done: true };
    }
    finished = true;
    clearIdleTimer();
    if (!controller.signal.aborted) {
      controller.abort(new DOMException('stream cancelled by consumer', 'AbortError'));
    }
    // Fire-and-forget: do NOT await. This is the whole point of the
    // hand-rolled iterator vs. `async function*` — the outstanding
    // source.next() must not delay teardown.
    void safeSourceReturn();
    return { value: undefined, done: true };
  }

  async function throwFn(err?: unknown): Promise<IteratorResult<StreamChunk, undefined>> {
    if (finished) {
      throw err;
    }
    finished = true;
    clearIdleTimer();
    if (!controller.signal.aborted) {
      controller.abort(
        err instanceof Error ? err : new DOMException(String(err ?? 'throw'), 'AbortError')
      );
    }
    void safeSourceReturn();
    throw err;
  }

  const iterator: StreamWatchdogIterator = {
    next,
    return: returnFn,
    throw: throwFn,
    [Symbol.asyncIterator](): StreamWatchdogIterator {
      return iterator;
    },
  };
  return iterator;
}

/**
 * Normalize a source that may be either `AsyncIterable` or `Iterable`
 * into an `AsyncIterator`. Sync iterables have their `next()`/`return()`
 * results promise-wrapped so the watchdog can uniformly `await` them.
 */
function toAsyncIterator(
  source: AsyncIterable<StreamChunk> | Iterable<StreamChunk>
): AsyncIterator<StreamChunk> {
  const asyncIt = (source as AsyncIterable<StreamChunk>)[Symbol.asyncIterator];
  if (typeof asyncIt === 'function') {
    return asyncIt.call(source);
  }
  const syncIt = (source as Iterable<StreamChunk>)[Symbol.iterator];
  if (typeof syncIt === 'function') {
    const it = syncIt.call(source);
    return {
      next(): Promise<IteratorResult<StreamChunk>> {
        try {
          const result = it.next();
          return Promise.resolve(result);
        } catch (err) {
          return Promise.reject(err);
        }
      },
      return(value?: StreamChunk): Promise<IteratorResult<StreamChunk>> {
        try {
          if (typeof it.return === 'function') {
            const result = it.return(value);
            return Promise.resolve(result);
          }
          return Promise.resolve({ value: undefined as unknown as StreamChunk, done: true });
        } catch (err) {
          return Promise.reject(err);
        }
      },
      throw(err?: unknown): Promise<IteratorResult<StreamChunk>> {
        try {
          if (typeof it.throw === 'function') {
            const result = it.throw(err);
            return Promise.resolve(result);
          }
          return Promise.reject(err);
        } catch (thrown) {
          return Promise.reject(thrown);
        }
      },
    };
  }
  throw new TypeError('stream watchdog source is neither AsyncIterable nor Iterable');
}

/**
 * Coerce an unknown abort-reason into an `Error`. Node's `signal.reason`
 * may be any value (including the DOMException we set), so we normalize
 * to make `err instanceof Error` reliable for consumers.
 */
function abortError(reason: unknown): Error {
  if (reason instanceof Error) {
    return reason;
  }
  const err = new DOMException(
    typeof reason === 'string' && reason.length > 0 ? reason : 'stream aborted',
    'AbortError'
  );
  return err as unknown as Error;
}
