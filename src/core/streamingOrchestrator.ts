/**
 * Streaming Orchestrator for real-time chat completions
 * Uses SAP AI SDK Orchestration provider exclusively
 */

import { getProviderForModel, getDefaultModel, type StreamChunk } from '../providers/index.js';
import { routePrompt } from './router.js';
import { SessionManager } from './sessionManager.js';
import { getCostTracker } from './costTracker.js';
import { type EffortLevel, getEffortConfig, DEFAULT_EFFORT } from './effortLevel.js';
import { buildAssembledSystemPrompt } from '../agent/system.js';

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
  message: string,
  options?: StreamingOptions
): AsyncGenerator<StreamChunk, StreamingResult> {
  const effortConfig = getEffortConfig(options?.effort ?? DEFAULT_EFFORT);
  const preferCheap = options?.preferCheap ?? effortConfig.preferCheap;

  let modelId: string;
  let routingReason: string | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
  } else {
    // Use specified or default model
    modelId = (options?.modelOverride ?? getDefaultModel()).trim();
  }

  // Assemble the effective system prompt using the pipeline.
  // buildAssembledSystemPrompt handles soul → model → env → agent → AGENTS.md layers.
  // A manual systemPrompt (e.g. from /system command) is appended as custom rules.
  const assembledPrompt = buildAssembledSystemPrompt({
    modelId,
    agentId: options?.agentId,
    workdir: options?.workdir,
    customRules: options?.systemPrompt,
  });

  // Build messages array with history if session manager provided
  const messages: Array<{ role: string; content: string }> = [];

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

  // Add current user message
  messages.push({ role: 'user', content: message });

  // Get SAP Orchestration provider for this model
  const provider = getProviderForModel(modelId);

  let fullText = '';
  let finalUsage: StreamingResult['usage'];

  // Stream using SAP Orchestration provider
  for await (const chunk of provider.streamComplete(messages, {
    maxTokens: options?.maxTokens ?? effortConfig.maxTokens,
    temperature: options?.temperature,
    signal: options?.signal,
  })) {
    fullText += chunk.text;
    if (chunk.usage) finalUsage = chunk.usage;
    yield chunk;
  }

  // Save messages to session AFTER streaming completes (not per-chunk)
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', message, {
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
      sessionId
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
