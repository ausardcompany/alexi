/**
 * DeepSeek-specific provider utilities
 * Handles DeepSeek model features and API quirks
 */

import { modelSupportsReasoningEffort } from './model-match.js';
import { resolvePortableReasoning, type ReasoningEffortLevel } from './reasoning.js';

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
  reasoningEffort?: ReasoningEffortLevel;
  /**
   * Optional explicit reasoning toggle. Passed through to
   * {@link resolvePortableReasoning} for the "enable with default" and
   * "explicit off" contracts. Existing callers that only pass
   * `reasoningEffort` are unaffected.
   */
  reasoningEnabled?: boolean;
  modelId?: string;
}

/**
 * Build DeepSeek-specific request with special token handling.
 *
 * Reasoning handling:
 * - Portable resolution happens first via {@link resolvePortableReasoning}
 *   so the effort/enabled contract stays aligned with other providers.
 * - The resolved portable option is then adapted to DeepSeek's wire
 *   format according to the model's capability:
 *     - "levels"  -> emit `reasoning_effort` (mapping `xhigh` -> `high`,
 *                    which is the highest tier DeepSeek accepts on the
 *                    `reasoning_effort` field).
 *     - "binary"  -> emit `enable_thinking: true` and drop the level.
 *     - "none"    -> do nothing.
 * - An explicit portable disable (`effort: 'none'`) leaves both fields
 *   unset so DeepSeek defaults apply.
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
    request.max_completion_tokens = 'max' as unknown as number | 'max';
  } else if (options.maxTokens) {
    request.max_tokens = options.maxTokens;
  }

  // Centralized portable reasoning resolution. Providers-specific dispatch
  // (levels vs binary vs none) happens after the resolver so behaviour
  // stays bit-for-bit compatible with existing DeepSeek callers.
  const portable = resolvePortableReasoning(options.reasoningEffort, options.reasoningEnabled);
  if (portable && portable.effort !== 'none') {
    // When modelId is omitted, default to 'levels' to preserve the
    // pre-centralization DeepSeek default.
    const mode = options.modelId ? modelSupportsReasoningEffort(options.modelId) : 'levels';
    if (mode === 'levels') {
      // DeepSeek's `reasoning_effort` field accepts low/medium/high.
      // Portable `xhigh` (from user-facing `max`) collapses to `high`
      // because DeepSeek has no higher tier on this endpoint.
      request.reasoning_effort =
        portable.effort === 'xhigh' ? 'high' : (portable.effort as 'low' | 'medium' | 'high');
    } else if (mode === 'binary') {
      request.enable_thinking = true;
    }
    // 'none' -> do nothing
  }

  return request;
}
