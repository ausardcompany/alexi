/**
 * Streaming Orchestrator for real-time chat completions
 * Routes requests to appropriate provider and yields text chunks via async generator
 */

import { getProviderForModel, isClaudeModel } from "../providers/index.js"
import { env } from "../config/env.js"
import { routePrompt } from "./router.js"
import { SessionManager, type Message } from "./sessionManager.js"
import { OpenAIStreamingProvider, type StreamChunk } from "../providers/openaiCompatible.js"
import { AnthropicCompatibleProvider } from "../providers/anthropicCompatible.js"
import { ClaudeNativeProvider } from "../providers/claudeNative.js"
import { SapOrchestrationProvider } from "../providers/sapOrchestration.js"

export interface StreamingOptions {
  modelOverride?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  sessionManager?: SessionManager;
  systemPrompt?: string;
  signal?: AbortSignal;
  maxTokens?: number;
  temperature?: number;
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

/**
 * Stream chat completion, yielding text chunks as they arrive
 * Collects and returns full response after streaming completes
 */
export async function* streamChat(
  message: string,
  options?: StreamingOptions
): AsyncGenerator<StreamChunk, StreamingResult> {
  let modelId: string;
  let routingReason: string | undefined;

  // Auto-routing enabled?
  if (options?.autoRoute && !options?.modelOverride) {
    const decision = routePrompt(message, { preferCheap: options.preferCheap });
    modelId = decision.modelId;
    routingReason = decision.reason;
  } else {
    // Use specified or default model
    const proxyModel = env("SAP_PROXY_MODEL")
    const nativeModel = env("AICORE_MODEL")
    const defaultModel = proxyModel ?? nativeModel ?? "gpt-4o"
    modelId = (options?.modelOverride ?? defaultModel).trim()
  }

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
    
    // Add system prompt if provided and not already in history
    if (options.systemPrompt && !history.some(m => m.role === 'system')) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    
    // Add conversation history
    messages.push(...history.map(m => ({ role: m.role, content: m.content })));
  } else {
    // Single message without history
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
  }
  
  // Add current user message
  messages.push({ role: 'user', content: message });

  // Get appropriate provider for this model
  const { type, sdk } = getProviderForModel(modelId)

  let fullText = '';
  let finalUsage: StreamingResult['usage'];

  // Route to appropriate streaming method based on provider type
  if (type === "anthropic") {
    // Anthropic-compatible provider via proxy
    const provider = sdk as AnthropicCompatibleProvider;
    
    for await (const chunk of provider.streamComplete(messages, modelId, {
      maxTokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      signal: options?.signal,
    })) {
      fullText += chunk.text;
      if (chunk.usage) finalUsage = chunk.usage;
      yield chunk;
    }
  } else if (type === "claude-native") {
    // Direct Bedrock Converse API
    const provider = sdk as ClaudeNativeProvider;
    
    for await (const chunk of provider.streamComplete(messages, {
      maxTokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      signal: options?.signal,
    })) {
      fullText += chunk.text;
      if (chunk.usage) finalUsage = chunk.usage;
      yield chunk;
    }
  } else if (type === "proxy") {
    // OpenAI-compatible streaming
    const baseURL = env("SAP_PROXY_BASE_URL")!
    const apiKey = env("SAP_PROXY_API_KEY")!
    const provider = new OpenAIStreamingProvider(baseURL, apiKey);
    
    for await (const chunk of provider.streamComplete(messages, modelId, {
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
      signal: options?.signal,
    })) {
      fullText += chunk.text;
      if (chunk.usage) finalUsage = chunk.usage;
      yield chunk;
    }
  } else if (type === "orchestration") {
    // SAP AI SDK Orchestration streaming
    const provider = sdk as SapOrchestrationProvider;
    
    for await (const chunk of provider.streamComplete(messages, {
      maxTokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature,
      signal: options?.signal,
    })) {
      fullText += chunk.text;
      if (chunk.usage) finalUsage = chunk.usage;
      yield chunk;
    }
  } else {
    // Native provider - no streaming support, fall back to non-streaming
    // and yield entire response at once
    const model = sdk.languageModel(modelId)
    const result: any = await model({ messages })
    const text = result?.outputText ?? result?.text ?? ""
    fullText = text;
    finalUsage = result?.usage;
    yield { text, usage: finalUsage };
  }

  // Save messages to session AFTER streaming completes (not per-chunk)
  if (options?.sessionManager) {
    options.sessionManager.addMessage('user', message, {
      input: finalUsage?.prompt_tokens
    });
    options.sessionManager.addMessage('assistant', fullText, {
      output: finalUsage?.completion_tokens
    });
  }

  return {
    text: fullText,
    usage: finalUsage,
    modelUsed: modelId,
    routingReason
  };
}

/**
 * Get model ID that would be used for a message (for display purposes)
 */
export function resolveModelId(options?: StreamingOptions): string {
  if (options?.modelOverride) {
    return options.modelOverride.trim();
  }
  
  const proxyModel = env("SAP_PROXY_MODEL")
  const nativeModel = env("AICORE_MODEL")
  return proxyModel ?? nativeModel ?? "gpt-4o"
}

/**
 * Check if abort was requested
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
