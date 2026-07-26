/**
 * Streaming Orchestrator for real-time chat completions
 * Uses SAP AI SDK Orchestration provider exclusively
 */

import {
  getProviderForModelWithFallback,
  getDefaultModel,
  type StreamChunk,
} from '../providers/index.js';
import { formatProviderError } from '../providers/format.js';
import { routePrompt, recordRouteOutcome, classifyRouteError } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { type EffortLevel, getEffortConfig, DEFAULT_EFFORT } from './effortLevel.js';
import { buildAssembledSystemPromptAsync } from '../agent/system.js';
import { stripInternalOptions } from '../agent/index.js';
import { buildSessionHeaders } from '../providers/sessionHeaders.js';
import type { CompletionOptions } from '../providers/sapOrchestration.js';
import {
  createStreamWatchdog,
  DEFAULT_STREAM_IDLE_TIMEOUT_MS,
  DEFAULT_STREAM_TOOL_EXTENSION_MS,
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

  async function setup(): Promise<void> {
    if (setupDone) {
      return;
    }
    setupDone = true;

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

    watchdog = createStreamWatchdog(
      (effectiveSignal) =>
        provider.streamComplete(messages, { ...providerOpts, signal: effectiveSignal }),
      {
        signal: options?.signal,
        idleTimeoutMs: options?.streamIdleTimeoutMs ?? DEFAULT_STREAM_IDLE_TIMEOUT_MS,
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

  const iterator: StreamChatIterator = {
    async next(): Promise<IteratorResult<StreamChunk, StreamingResult>> {
      if (finished) {
        return { value: persistAndRecord(), done: true };
      }
      try {
        if (!setupDone) {
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
        finished = true;
        // Best-effort tear down the source without awaiting.
        if (watchdog) {
          void watchdog.return();
        }
        const classified = classifyRouteError(err);
        if (classified.kind === 'permanent') {
          recordRouteOutcome(modelId, classified);
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
 * Check if abort was requested
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
