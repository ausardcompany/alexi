import { getProviderForModelWithFallback, getDefaultModel } from '../providers/index.js';
import { formatProviderError } from '../providers/format.js';
import { resolveReasoning, type ReasoningConfig } from '../providers/reasoning.js';
import { routePrompt, recordRouteOutcome, classifyRouteError } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { isContextOverflowError, CONTEXT_OVERFLOW_USER_MESSAGE } from './contextOverflow.js';
import { isRateLimitError } from './error-backoff.js';
import { logger } from '../utils/logger.js';

export async function sendChat(
  message: string,
  options?: {
    modelOverride?: string;
    autoRoute?: boolean;
    preferCheap?: boolean;
    sessionManager?: SessionManager;
    systemPrompt?: string;
    /**
     * Optional cancellation signal. Forwarded to `provider.complete()` so a
     * user-initiated Ctrl+C (or any upstream abort) cancels the in-flight
     * HTTP request instead of burning tokens until the model finishes.
     * When the resulting error is an `AbortError`, the route health counter
     * is deliberately not touched -- see `classifyRouteError`.
     */
    signal?: AbortSignal;
    /**
     * Optional portable reasoning configuration. When provided, the
     * orchestrator resolves it into provider-specific parameters via
     * {@link resolveReasoning} and threads them through
     * {@link CompletionOptions.reasoning} — no per-provider conditionals
     * live in this file.
     */
    reasoning?: ReasoningConfig;
  }
) {
  let modelId: string;
  let routingReason: string | undefined;
  let routeReasoning: ReasoningConfig | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap: options.preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
    routeReasoning = decision.reasoning;
    console.log(
      `[Router] Selected ${modelId}: ${decision.reason} (confidence: ${(decision.confidence * 100).toFixed(0)}%)`
    );
  } else {
    // Use specified or default model
    modelId = (options?.modelOverride ?? getDefaultModel()).trim();
  }

  // Improved orchestration logic with better error handling and processing
  const messages: Array<{ role: string; content: string }> = [];

  if (options?.sessionManager) {
    const session = options.sessionManager.getCurrentSession();

    // Initialize session if needed
    if (!session) {
      options.sessionManager.createSession(modelId);
    }

    // Get conversation history
    const history = options.sessionManager.getHistory(20); // Last 20 messages

    // Add system prompt if provided and not already in history
    if (options.systemPrompt && !history.some((m) => m.role === 'system')) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }

    // Add conversation history
    messages.push(...history.map((m) => ({ role: m.role, content: m.content })));
  } else {
    // Single message without history
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: message });

  // Get SAP Orchestration provider for this model, automatically falling back
  // to the configured fallback model if the primary id is not recognized.
  const resolution = getProviderForModelWithFallback(modelId);
  const provider = resolution.provider;
  if (resolution.usedFallback) {
    modelId = resolution.effectiveModelId;
  }

  // Use SAP Orchestration complete() method.
  // Record route outcome for auto-disable bookkeeping: permanent failures
  // (401/403/404, model_not_found, deployment_not_found) tick the route's
  // failure counter; success resets it. Transient errors are owned by
  // ErrorBackoff and are intentionally NOT recorded here.
  // Resolve portable reasoning config into provider-specific parameters.
  // Preference order: explicit caller option > router-attached hint.
  // When neither is supplied, `resolveReasoning` returns an empty object
  // so the completion request stays byte-for-byte identical to the
  // previous call site.
  const effectiveReasoning = options?.reasoning ?? routeReasoning;
  const reasoningParams = effectiveReasoning ? resolveReasoning(modelId, effectiveReasoning) : {};

  let result;
  try {
    result = await provider.complete(messages, {
      maxTokens: 4096,
      signal: options?.signal,
      reasoning: reasoningParams,
    });
  } catch (err) {
    const classified = classifyRouteError(err);
    // User-initiated aborts are NOT a route health signal: skip recording
    // entirely so a healthy route is not falsely penalised or auto-disabled
    // just because the user pressed Ctrl+C.
    if (classified.kind === 'permanent') {
      recordRouteOutcome(modelId, classified);
    }
    // Context-window overflow: rewrite the message so the CLI presents an
    // actionable line instead of the raw provider payload. The original
    // provider text is preserved after `:` so it remains debuggable and
    // any operator with logs can still see the vendor-specific string.
    if (err instanceof Error && isContextOverflowError(err)) {
      err.message = `${CONTEXT_OVERFLOW_USER_MESSAGE} (${err.message})`;
      throw err;
    }
    // Rate-limit UX: `FreeTierRateLimitError` and `ProviderRateLimitError`
    // already carry a fully-formatted, user-facing message with model,
    // wait time, and the docs link. Log the full details at debug level
    // (including the upstream `cause` and any `Retry-After`) so operators
    // running with `LOG_LEVEL=debug` see the provider's raw payload, then
    // rethrow the classified error unchanged so the CLI displays the
    // curated message instead of a stack trace of the raw HTTP failure.
    if (isRateLimitError(err)) {
      const rateLimitErr = err as {
        name?: string;
        code?: string;
        modelName?: string;
        retryAfterSeconds?: number;
        suggestedAction?: string;
        cause?: unknown;
        message?: string;
      };
      logger.debug('Rate limit error from provider', {
        name: rateLimitErr.name,
        code: rateLimitErr.code,
        model: rateLimitErr.modelName ?? modelId,
        retryAfterSeconds: rateLimitErr.retryAfterSeconds,
        suggestedAction: rateLimitErr.suggestedAction,
        message: rateLimitErr.message,
        cause: rateLimitErr.cause,
      });
      throw err;
    }
    const formatted = formatProviderError(err);
    if (err instanceof Error && formatted !== err.message) {
      err.message = formatted;
    }
    throw err;
  }
  recordRouteOutcome(modelId, { kind: 'success' });

  const responseText = result.text;
  const usage = result.usage;

  // Save messages to session if session manager provided
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', message, {
      input: usage?.prompt_tokens,
    });
    options.sessionManager.addMessage('assistant', responseText, {
      output: usage?.completion_tokens,
    });
  }

  // Record cost for this API call
  if (usage?.prompt_tokens || usage?.completion_tokens) {
    const sessionId = options?.sessionManager?.getCurrentSession()?.metadata.id;
    getCostTracker().recordUsage(
      modelId,
      usage.prompt_tokens ?? 0,
      usage.completion_tokens ?? 0,
      sessionId,
      {
        read: usage.cache_read_input_tokens,
        write: usage.cache_creation_input_tokens,
      }
    );
  }

  return {
    text: responseText,
    usage,
    modelUsed: modelId,
    routingReason,
  };
}
