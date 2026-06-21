/**
 * DeepSeek-specific provider utilities
 * Handles DeepSeek model features and API quirks
 */

import { modelSupportsReasoningEffort } from './model-match.js';

interface Message {
  role: string;
  content: string;
  [key: string]: unknown;
}

interface ProviderRequest {
  messages: Message[];
  max_tokens?: number;
  max_completion_tokens?: number | 'max';
  [key: string]: unknown;
}

export interface DeepSeekOptions {
  maxTokens?: number | 'max';
  reasoningEffort?: 'low' | 'medium' | 'high';
  modelId?: string;
}

/**
 * Build DeepSeek-specific request with special token handling
 */
export function buildDeepSeekRequest(
  messages: Message[],
  options: DeepSeekOptions
): ProviderRequest {
  const request: ProviderRequest = {
    messages,
  };

  // Handle special "max" value for max_tokens
  if (options.maxTokens === 'max') {
    // Let provider use maximum - DeepSeek supports "max" as special value
    request.max_completion_tokens = 'max' as any;
  } else if (options.maxTokens) {
    request.max_tokens = options.maxTokens;
  }

  // Dispatch reasoning_effort handling on per-model capability.
  // When modelId is omitted, default to 'levels' to preserve existing
  // DeepSeek behaviour bit-for-bit.
  if (options.reasoningEffort) {
    const mode = options.modelId ? modelSupportsReasoningEffort(options.modelId) : 'levels';
    if (mode === 'levels') {
      request.reasoning_effort = options.reasoningEffort;
    } else if (mode === 'binary') {
      request.enable_thinking = true;
    }
    // 'none' -> do nothing
  }

  return request;
}
