/**
 * Streaming Orchestrator for real-time chat completions
 * Uses SAP AI SDK Orchestration provider exclusively
 */

import {
  getProviderForModelWithFallback,
  getDefaultModel,
  type StreamChunk,
} from '../providers/index.js';
import { formatProviderError, classifyProviderError } from '../providers/format.js';
import { NothingToCompactError } from './compaction.js';
import { logger } from '../utils/logger.js';
import { routePrompt, recordRouteOutcome, classifyRouteError } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { type EffortLevel, getEffortConfig, DEFAULT_EFFORT } from './effortLevel.js';
import { buildAssembledSystemPromptAsync } from '../agent/system.js';
import { stripInternalOptions } from '../agent/index.js';
import { buildSessionHeaders } from '../providers/sessionHeaders.js';
import type { CompletionOptions } from '../providers/sapOrchestration.js';
import { retryEmptyResponse } from '../providers/sapOrchestration.js';
import {
  createStreamWatchdog,
  DEFAULT_STREAM_TOOL_EXTENSION_MS,
  resolveDefaultStreamIdleTimeoutMs,
} from './streamWatchdog.js';

export interface StreamingOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  signal?: AbortSignal;
  maxTokens?: number;
  temperature?: number;
  /** Effort level for cost/quality tradeoff (default: 'medium') */
  effort?: EffortLevel;
  /** Agent ID to use for assembled system prompt (e.g. 'code', 'debug') */
  agentId?: string;
  /** Working directory for env info and AGENTS.md loading */
  workdir?: string;
  /**
   * Idle timeout in ms for the streaming watchdog. If no chunk arrives
   * within this window, the stream is aborted with an AbortError.
   * Default: 30_000 ms. Set to `Infinity` or `0` to disable.
   */
  streamIdleTimeoutMs?: number;
  /**
   * Extended idle window (ms) applied while a long-running tool call
   * (bash, shell, background_process, agent_manager) is being streamed.
   * Default: 600_000 ms (10 minutes).
   */
  streamToolExtensionMs?: number;
  /**
   * Maximum number of attempts the empty-response retry wrapper will make
   * per turn. Default: 3. Set to 1 to disable retry.
   *
   * A turn is retried ONLY when it produces genuinely nothing — no text,
   * no tool call. Tool-call-only turns are never retried. Errors are NOT
   * retried here (higher layers own that policy).
   *
   * See `retryEmptyResponse` in `providers/sapOrchestration.ts` for the
   * full contract (issue #1279, Kilo PR #12927).
   */
  emptyResponseMaxAttempts?: number;
}

export interface StreamingResult {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  };
  modelUsed: string;
  routingReason?: string;
}

// Re-export StreamChunk for consumers
export type { StreamChunk };

// Re-export the stall-error surface so CLI/TUI can `import { ... } from
// '../core/streamingOrchestrator.js'` without reaching into the watchdog
// module.
export { StreamStalledError, isStreamStalledError } from './streamWatchdog.js';

/**
 * The hand-rolled iterator returned by {@link streamChat}. Mirrors the
 * `AsyncGenerator<StreamChunk, StreamingResult>` shape so existing callers
 * that either `for await` or manually drive `next()` / inspect the final
 * `{ done: true, value }` continue to work unchanged.
 *
 * The critical difference from a native `async function*` is that
 * `return()` runs immediately — it fires the internal abort controller,
 * schedules a fire-and-forget teardown of the underlying provider stream,
 * and resolves synchronously without awaiting any outstanding pull. This
 * fixes the Cline-#12249 preemption trap where a stalled provider stream
 * (server responded 200 but has gone silent) hangs the caller on
 * teardown.
 */
export interface StreamChatIterator extends AsyncIterableIterator<StreamChunk> {
  next(): Promise<IteratorResult<StreamChunk, StreamingResult>>;
  return(value?: unknown): Promise<IteratorResult<StreamChunk, StreamingResult>>;
  throw(err?: unknown): Promise<IteratorResult<StreamChunk, StreamingResult>>;
}

/**
 * Stream chat completion, yielding text chunks as they arrive.
 *
 * Collects and returns the full response as the terminal value of the
 * iterator (accessible via the `value` field when `done === true`). The
 * iterator is hand-rolled (not a native `async function*`) so that
 * `return()` can preempt outstanding provider pulls — see
 * {@link StreamChatIterator} for the rationale.
 */
export function streamChat(
  message: string | unknown[],
  options?: StreamingOptions
): StreamChatIterator {
  const effortConfig = getEffortConfig(options?.effort ?? DEFAULT_EFFORT);
  const preferCheap = options?.preferCheap ?? effortConfig.preferCheap;

  // Extract text for routing and session history (multimodal messages have
  // array content).
  const isMultimodal = Array.isArray(message);
  const messageText = isMultimodal ? '[multimodal message]' : message;

  // Mutable state shared across the setup phase and the streaming phase.
  // `modelId` may be reassigned by the fallback resolver or the router.
  let modelId: string;
  let routingReason: string | undefined;

  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(messageText, { preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
  } else {
    modelId = (options?.modelOverride ?? getDefaultModel()).trim();
  }

  let fullText = '';
  let finalUsage: StreamingResult['usage'];
  // The watchdog-wrapped source iterator, created lazily on first next().
  let watchdog: ReturnType<typeof createStreamWatchdog> | null = null;
  let setupDone = false;
  let finished = false;
  // Naturally-completed vs. aborted/failed. We only tick route success on
  // a clean end-of-stream, not on preemptive return() or provider error.
  let completedCleanly = false;
  // Cache the terminal result so repeat `next()` calls after `done: true`
  // return the same value without re-persisting the session/cost record.
  let cachedResult: StreamingResult | null = null;
  let outboundTextForSession = messageText;
  // Context-overflow recovery is one-shot per streamChat() invocation.
  // Once we have compacted-and-retried, a second overflow is a terminal
  // state — the model still cannot fit the compacted transcript, so
  // retrying again would just waste tokens.
  let overflowRetried = false;
  // When true, the next tick of the iterator loop reruns setup after a
  // successful compaction. Cleared once setup completes.
  let pendingOverflowRetry = false;

  async function setup(): Promise<void> {
    if (setupDone && !pendingOverflowRetry) {
      return;
    }
    setupDone = true;
    pendingOverflowRetry = false;

    // Assemble the effective system prompt using the pipeline.
    // buildAssembledSystemPrompt handles soul -> model -> env -> agent ->
    // AGENTS.md layers. A manual systemPrompt (e.g. from /system command)
    // is appended as custom rules.
    const assembledPrompt = await buildAssembledSystemPromptAsync({
      modelId,
      agentId: options?.agentId,
      workdir: options?.workdir,
      customRules: options?.systemPrompt,
      sessionId: options?.sessionManager?.getCurrentSession()?.metadata.id,
    });

    // Build messages array with history if session manager provided.
    // Content can be string (text) or unknown[] (multimodal content items).
    const messages: Array<{ role: string; content: string | unknown[] }> = [];

    if (options?.sessionManager) {
      const session = options.sessionManager.getCurrentSession();
      if (!session) {
        options.sessionManager.createSession(modelId);
      }
      const history = options.sessionManager.getHistory(20);
      if (assembledPrompt && !history.some((m) => m.role === 'system')) {
        messages.push({ role: 'system', content: assembledPrompt });
      }
      messages.push(...history.map((m) => ({ role: m.role, content: m.content })));
    } else {
      if (assembledPrompt) {
        messages.push({ role: 'system', content: assembledPrompt });
      }
    }

    // If a `switchTo(...)` happened since the last outbound user turn,
    // stamp an `<agent_switch from="X" to="Y"/>` marker on this user
    // message so the destination agent's model can see the handover.
    let outboundContent: string | unknown[] = message;
    try {
      const { getAgentRegistry } = await import('../agent/index.js');
      const marker = getAgentRegistry().consumePendingSwitchMarker();
      if (marker && !isMultimodal && typeof message === 'string') {
        const prefixed = `<agent_switch from="${marker.from}" to="${marker.to}"/>\n\n${message}`;
        outboundContent = prefixed;
        outboundTextForSession = prefixed;
      }
    } catch {
      // Agent registry not available in this environment - no-op.
    }

    messages.push({ role: 'user', content: outboundContent });

    // Get SAP Orchestration provider for this model, falling back to
    // routingConfig.preferences.fallbackModel if the primary id is not
    // recognized.
    const resolution = getProviderForModelWithFallback(modelId);
    const provider = resolution.provider;
    if (resolution.usedFallback) {
      modelId = resolution.effectiveModelId;
    }

    // Build agent observability headers.
    const sessionId = options?.sessionManager?.getCurrentSession()?.metadata.id;
    const extraHeaders = buildSessionHeaders(
      sessionId ?? 'anonymous',
      undefined,
      options?.agentId,
      undefined // parentAgentId - future enhancement
    );

    // Build the completion-options bag and strip any agent-metadata keys
    // before dispatch. Keys defined in `INTERNAL_OPTION_KEYS` must never
    // reach SAP AI Core / SAP Orchestration; see `stripInternalOptions`.
    const merged: CompletionOptions = {
      maxTokens: options?.maxTokens ?? effortConfig.maxTokens,
      temperature: options?.temperature,
      // Note: the watchdog splices its own signal in via sourceFactory,
      // combining the caller signal with an idle-timeout controller. Do
      // not forward options.signal here — the watchdog forwards it.
      headers: extraHeaders as Record<string, string>,
    };
    const providerOpts = stripInternalOptions(merged) as CompletionOptions;

    // Wrap the provider stream with the empty-response retry wrapper so a
    // transient empty turn (no text, no tool call — Kilo telemetry showed
    // ~46 tasks / 120 events / 24h) can be recovered before it surfaces as
    // a hard failure. See `retryEmptyResponse` in
    // `providers/sapOrchestration.ts` (issue #1279, Kilo PR #12927).
    const emptyRetryMax = options?.emptyResponseMaxAttempts ?? 3;
    watchdog = createStreamWatchdog(
      (effectiveSignal) =>
        retryEmptyResponse(
          () => provider.streamComplete(messages, { ...providerOpts, signal: effectiveSignal }),
          { maxAttempts: emptyRetryMax }
        ),
      {
        signal: options?.signal,
        // Resolve the idle timeout on every stream so a mid-session
        // `STREAM_STALL_TIMEOUT_MS` env change takes effect immediately.
        idleTimeoutMs: options?.streamIdleTimeoutMs ?? resolveDefaultStreamIdleTimeoutMs(),
        toolExtensionMs: options?.streamToolExtensionMs ?? DEFAULT_STREAM_TOOL_EXTENSION_MS,
      }
    );
  }

  function persistAndRecord(): StreamingResult {
    if (cachedResult) {
      return cachedResult;
    }
    if (completedCleanly) {
      recordRouteOutcome(modelId, { kind: 'success' });
    }
    // Save messages to session AFTER streaming completes (not per-chunk).
    // Persist the raw outbound content (including any `<agent_switch/>`
    // marker) so session replay preserves the handover context. TUI
    // display and `sessions export` strip the wrappers.
    if (options?.sessionManager) {
      options.sessionManager.addMessage('user', outboundTextForSession, {
        input: finalUsage?.prompt_tokens,
      });
      options.sessionManager.addMessage('assistant', fullText, {
        output: finalUsage?.completion_tokens,
      });
    }

    if (finalUsage?.prompt_tokens || finalUsage?.completion_tokens) {
      const sessionId = options?.sessionManager?.getCurrentSession()?.metadata.id;
      getCostTracker().recordUsage(
        modelId,
        finalUsage.prompt_tokens ?? 0,
        finalUsage.completion_tokens ?? 0,
        sessionId,
        {
          read: finalUsage.cache_read_input_tokens,
          write: finalUsage.cache_creation_input_tokens,
        }
      );
    }

    cachedResult = {
      text: fullText,
      usage: finalUsage,
      modelUsed: modelId,
      routingReason,
    };
    return cachedResult;
  }

  /**
   * Attempt to recover from a context-window overflow by compacting the
   * session and rearming setup for a single retry. Returns true when the
   * caller should re-drive the loop (retry), false when the error is
   * unrecoverable and must be rethrown.
   *
   * Emits an assistant-role status chunk on `fullText` so the caller sees
   * the actionable message inline with the stream:
   *   - Compaction started (info)
   *   - Nothing to compact (terminal)
   *   - Retry still overflows (terminal)
   */
  async function tryOverflowRecovery(err: unknown): Promise<boolean> {
    if (overflowRetried) {
      return false;
    }
    if (classifyProviderError(err) !== 'context_overflow') {
      return false;
    }
    const sm = options?.sessionManager;
    if (!sm) {
      return false;
    }
    overflowRetried = true;

    // Emit a visible status notice into the stream so the CLI/TUI can
    // surface it inline. This is not persisted to session history.
    fullText += '\n\n[status] Context window exceeded, compacting conversation...\n\n';

    // Also log an actionable info line so non-TUI callers (plain CLI,
    // agent workflows, CI logs) see that recovery was triggered.
    logger.info('Context window exceeded, compacting conversation history and retrying...');

    try {
      await sm.compact({
        overflowRecovery: true,
        maxContextTokens: sm.getMaxContextTokens(),
        reserveOutputTokens: options?.maxTokens ?? effortConfig.maxTokens,
      });
    } catch (compactErr) {
      if (compactErr instanceof NothingToCompactError) {
        // Terminal: no history to compact (overflow on first prompt).
        const term = new Error(
          'Context window exceeded on first prompt with no history to compact. ' +
            'Please shorten your message or switch to a model with a larger context window.'
        );
        term.name = 'ContextOverflowError';
        throw term;
      }
      throw compactErr;
    }

    // Rearm setup on the next tick so the compacted session is reloaded.
    setupDone = false;
    pendingOverflowRetry = true;
    if (watchdog) {
      void watchdog.return();
      watchdog = null;
    }
    return true;
  }

  const iterator: StreamChatIterator = {
    async next(): Promise<IteratorResult<StreamChunk, StreamingResult>> {
      if (finished) {
        return { value: persistAndRecord(), done: true };
      }
      try {
        if (!setupDone || pendingOverflowRetry) {
          await setup();
        }
        // watchdog is guaranteed non-null after setup().
        const step = await watchdog!.next();
        if (step.done) {
          finished = true;
          completedCleanly = true;
          return { value: persistAndRecord(), done: true };
        }
        const chunk = step.value;
        fullText += chunk.text;
        if (chunk.usage) {
          finalUsage = chunk.usage;
        }
        return { value: chunk, done: false };
      } catch (err) {
        // Context-overflow recovery: one-shot compaction + retry per run.
        // Only attempt when we have a sessionManager to compact.
        try {
          const recovered = await tryOverflowRecovery(err);
          if (recovered) {
            // Signal the caller to re-drive `.next()` — we return an empty
            // chunk so the streaming loop naturally advances into the
            // reloaded watchdog on the next tick. This keeps overflow
            // recovery invisible to `for await` consumers.
            return { value: { text: '' }, done: false };
          }
        } catch (recoveryErr) {
          // Compaction itself failed with a terminal error (nothing to
          // compact). Fall through with the wrapped error.
          finished = true;
          if (watchdog) {
            void watchdog.return();
          }
          throw recoveryErr;
        }

        finished = true;
        // Best-effort tear down the source without awaiting.
        if (watchdog) {
          void watchdog.return();
        }
        // Flush partial transcript on abort so context is not silently
        // lost when the user cancels a long-running request (issue
        // #1330). We persist the outbound user prompt and whatever
        // assistant text was already streamed. This is best-effort — a
        // save failure is swallowed by SessionManager.saveSession to
        // avoid masking the original abort error the caller is about
        // to see.
        if (options?.sessionManager && SessionManager.detectAbort(err)) {
          try {
            options.sessionManager.addMessage('user', outboundTextForSession, {
              input: finalUsage?.prompt_tokens,
            });
            if (fullText.length > 0) {
              options.sessionManager.addMessage('assistant', fullText, {
                output: finalUsage?.completion_tokens,
              });
            }
            options.sessionManager.flush();
          } catch {
            // Best-effort; do not shadow the original abort.
          }
        }
        const classified = classifyRouteError(err);
        if (classified.kind === 'permanent') {
          recordRouteOutcome(modelId, classified);
        }
        // If we already retried once and still overflow, surface an
        // actionable terminal message instead of the raw provider error.
        if (overflowRetried && classifyProviderError(err) === 'context_overflow') {
          const term = new Error(
            'Context window still exceeded after compacting history. ' +
              'Please start a new session or switch to a model with a larger context window.'
          );
          term.name = 'ContextOverflowError';
          throw term;
        }
        const formatted = formatProviderError(err);
        if (err instanceof Error && formatted !== err.message) {
          err.message = formatted;
        }
        throw err;
      }
    },

    async return(_value?: unknown): Promise<IteratorResult<StreamChunk, StreamingResult>> {
      if (finished) {
        return { value: persistAndRecord(), done: true };
      }
      finished = true;
      // Preemptive teardown: signal the watchdog to fire its abort and
      // schedule a fire-and-forget provider.return(). Critically we do
      // NOT await the watchdog's own outstanding pull chain here — the
      // watchdog's return() is designed to resolve immediately.
      if (watchdog) {
        void watchdog.return();
      }
      return { value: persistAndRecord(), done: true };
    },

    async throw(err?: unknown): Promise<IteratorResult<StreamChunk, StreamingResult>> {
      if (!finished) {
        finished = true;
        if (watchdog) {
          void watchdog.return();
        }
      }
      throw err;
    },

    [Symbol.asyncIterator](): StreamChatIterator {
      return iterator;
    },
  };

  return iterator;
}

/**
 * Get model ID that would be used for a message (for display purposes)
 */
export function resolveModelId(options?: StreamingOptions): string {
  if (options?.modelOverride) {
    return options.modelOverride.trim();
  }

  return getDefaultModel();
}

/**
 * Detect an abort-family error, regardless of how the runtime surfaced it.
 *
 * Aborts show up in three shapes depending on the source:
 *
 * 1. `DOMException` with `name === 'AbortError'` — the standard shape emitted
 *    by `AbortController`/`AbortSignal` and by fetch/streams that speak the
 *    Web Streams API. `DOMException` is `instanceof Error` in modern Node.
 * 2. Plain `Error` whose `name` was manually set to `'AbortError'` — used by
 *    older provider SDKs and the stream watchdog before it was tagged.
 * 3. Node native abort: `Error` with `code === 'ABORT_ERR'`. This is what
 *    `AbortSignal.throwIfAborted()` and some Node core APIs (undici, timers,
 *    fs) emit and it does NOT always carry `name === 'AbortError'`.
 *
 * All three should be treated identically by the CLI/TUI: log a cancellation
 * message and return to the prompt without exiting the process.
 */
export function isAbortError(error: unknown): boolean {
  if (!(error instanceof Error) && !(typeof error === 'object' && error !== null)) {
    return false;
  }
  const err = error as { name?: unknown; code?: unknown };
  if (typeof err.name === 'string' && err.name === 'AbortError') {
    return true;
  }
  if (typeof err.code === 'string' && err.code === 'ABORT_ERR') {
    return true;
  }
  return false;
}
