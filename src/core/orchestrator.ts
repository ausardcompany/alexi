import { getProviderForModelWithFallback, getDefaultModel } from '../providers/index.js';
import { routePrompt, recordRouteOutcome, classifyRouteError } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';

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
  }
) {
  let modelId: string;
  let routingReason: string | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap: options.preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
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
  let result;
  try {
    result = await provider.complete(messages, { maxTokens: 4096, signal: options?.signal });
  } catch (err) {
    const classified = classifyRouteError(err);
    // User-initiated aborts are NOT a route health signal: skip recording
    // entirely so a healthy route is not falsely penalised or auto-disabled
    // just because the user pressed Ctrl+C.
    if (classified.kind === 'permanent') {
      recordRouteOutcome(modelId, classified);
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
