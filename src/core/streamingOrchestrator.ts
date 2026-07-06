/**
 * Streaming Orchestrator for real-time chat completions
 * Uses SAP AI SDK Orchestration provider exclusively
 */

import {
  getProviderForModelWithFallback,
  getDefaultModel,
  type StreamChunk,
} from '../providers/index.js';
import { routePrompt, recordRouteOutcome, classifyRouteError } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { type EffortLevel, getEffortConfig, DEFAULT_EFFORT } from './effortLevel.js';
import { buildAssembledSystemPromptAsync } from '../agent/system.js';
import { buildSessionHeaders } from '../providers/sessionHeaders.js';

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
 * Stream chat completion, yielding text chunks as they arrive
 * Collects and returns full response after streaming completes
 */
export async function* streamChat(
  message: string | unknown[],
  options?: StreamingOptions
): AsyncGenerator<StreamChunk, StreamingResult> {
  const effortConfig = getEffortConfig(options?.effort ?? DEFAULT_EFFORT);
  const preferCheap = options?.preferCheap ?? effortConfig.preferCheap;

  // Extract text for routing and session history (multimodal messages have array content)
  const isMultimodal = Array.isArray(message);
  const messageText = isMultimodal ? '[multimodal message]' : message;

  let modelId: string;
  let routingReason: string | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(messageText, { preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
  } else {
    // Use specified or default model
    modelId = (options?.modelOverride ?? getDefaultModel()).trim();
  }

  // Assemble the effective system prompt using the pipeline.
  // buildAssembledSystemPrompt handles soul → model → env → agent → AGENTS.md layers.
  // A manual systemPrompt (e.g. from /system command) is appended as custom rules.
  const assembledPrompt = await buildAssembledSystemPromptAsync({
    modelId,
    agentId: options?.agentId,
    workdir: options?.workdir,
    customRules: options?.systemPrompt,
    sessionId: options?.sessionManager?.getCurrentSession()?.metadata.id,
  });

  // Build messages array with history if session manager provided
  // Content can be string (text) or unknown[] (multimodal content items)
  const messages: Array<{ role: string; content: string | unknown[] }> = [];

  if (options?.sessionManager) {
    const session = options.sessionManager.getCurrentSession();

    // Initialize session if needed
    if (!session) {
      options.sessionManager.createSession(modelId);
    }

    // Get conversation history
    const history = options.sessionManager.getHistory(20); // Last 20 messages

    // Add assembled system prompt if not already in history
    if (assembledPrompt && !history.some((m) => m.role === 'system')) {
      messages.push({ role: 'system', content: assembledPrompt });
    }

    // Add conversation history
    messages.push(...history.map((m) => ({ role: m.role, content: m.content })));
  } else {
    // Single message without history
    if (assembledPrompt) {
      messages.push({ role: 'system', content: assembledPrompt });
    }
  }

  // If a `switchTo(...)` happened since the last outbound user turn, stamp
  // an `<agent_switch from="X" to="Y"/>` marker on this user message so the
  // destination agent's model can see the handover. Only text messages get
  // the prefix; multimodal content arrays are passed through unchanged
  // because prepending to an array item is ambiguous.
  let outboundContent: string | unknown[] = message;
  let outboundTextForSession = messageText;
  try {
    const { getAgentRegistry } = await import('../agent/index.js');
    const marker = getAgentRegistry().consumePendingSwitchMarker();
    if (marker && !isMultimodal && typeof message === 'string') {
      const prefixed = `<agent_switch from="${marker.from}" to="${marker.to}"/>\n\n${message}`;
      outboundContent = prefixed;
      outboundTextForSession = prefixed;
    }
  } catch {
    // Agent registry not available in this environment — no-op.
  }

  // Add current user message
  messages.push({ role: 'user', content: outboundContent });

  // Get SAP Orchestration provider for this model, falling back to
  // routingConfig.preferences.fallbackModel if the primary id is not recognized.
  const resolution = getProviderForModelWithFallback(modelId);
  const provider = resolution.provider;
  if (resolution.usedFallback) {
    modelId = resolution.effectiveModelId;
  }

  // Build agent observability headers
  const sessionId = options?.sessionManager?.getCurrentSession()?.metadata.id;
  const extraHeaders = buildSessionHeaders(
    sessionId ?? 'anonymous',
    undefined,
    options?.agentId,
    undefined // parentAgentId - future enhancement
  );

  let fullText = '';
  let finalUsage: StreamingResult['usage'];

  // Stream using SAP Orchestration provider. Wrap so permanent failures
  // (401/403/404, model_not_found, deployment_not_found) tick the route's
  // auto-disable counter; success resets it. Transient errors are left to
  // ErrorBackoff.
  try {
    for await (const chunk of provider.streamComplete(messages, {
      maxTokens: options?.maxTokens ?? effortConfig.maxTokens,
      temperature: options?.temperature,
      signal: options?.signal,
      headers: extraHeaders as Record<string, string>,
    })) {
      fullText += chunk.text;
      if (chunk.usage) finalUsage = chunk.usage;
      yield chunk;
    }
  } catch (err) {
    const classified = classifyRouteError(err);
    if (classified.kind === 'permanent') {
      recordRouteOutcome(modelId, classified);
    }
    throw err;
  }
  recordRouteOutcome(modelId, { kind: 'success' });

  // Save messages to session AFTER streaming completes (not per-chunk).
  // Persist the raw outbound content (including any `<agent_switch/>`
  // marker) so session replay preserves the handover context. TUI display
  // and `sessions export` strip the wrappers.
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', outboundTextForSession, {
      input: finalUsage?.prompt_tokens,
    });
    options.sessionManager.addMessage('assistant', fullText, {
      output: finalUsage?.completion_tokens,
    });
  }

  // Record cost for this API call
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

  return {
    text: fullText,
    usage: finalUsage,
    modelUsed: modelId,
    routingReason,
  };
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
