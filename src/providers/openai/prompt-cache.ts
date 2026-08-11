/**
 * Prompt Cache Breakpoints (upstream opencode v1.17.13 parity)
 *
 * Explicit prompt-cache breakpoint helper for OpenAI-family models routed
 * through the Vercel AI SDK path. Upstream (kilocode c55440908..a5aaef74a)
 * added `applyCaching` for GPT-5.6+ that:
 *
 *   - Marks a stable prefix boundary so the provider can cache the prompt
 *     up to that point across calls (cost + latency savings).
 *   - Is excluded for ChatGPT subscription accounts, which cache implicitly
 *     — an explicit breakpoint there is at best redundant and at worst
 *     confuses provider-side accounting.
 *
 * SAP AI Core routes OpenAI models via the Vercel SDK, so we apply the same
 * scoping here. See docs/PROVIDERS.md for the wider caching story.
 */

/**
 * Minimal structural type for a Vercel AI SDK v2 prompt message. We keep
 * this local to avoid pulling `@ai-sdk/provider` into `dependencies` — the
 * SAP AI SDK re-exports compatible shapes at runtime and callers pass plain
 * objects.
 */
export type LanguageModelV2Prompt = ReadonlyArray<{
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: unknown;
  providerOptions?: Record<string, unknown>;
  [key: string]: unknown;
}>;

/**
 * Determines if a provider/model supports explicit prompt cache breakpoints.
 * Excludes ChatGPT subscription accounts (they cache implicitly).
 */
export function supportsPromptCacheBreakpoint(opts: {
  providerId: string;
  modelId: string;
  isChatGPTSubscription?: boolean;
}): boolean {
  if (opts.isChatGPTSubscription) {
    return false;
  }
  // GPT-5.6 and later support explicit cache breakpoints.
  // Match both direct OpenAI provider ids and SAP AI Core routes to
  // OpenAI-family models.
  if (opts.providerId === 'openai' || opts.providerId === 'sap-ai-core') {
    return /gpt-5\.[6-9]|gpt-[6-9]/i.test(opts.modelId);
  }
  return false;
}

/**
 * Zero-cost heuristic for detecting ChatGPT subscription accounts.
 * ChatGPT subscribers should not receive explicit cache breakpoints.
 */
export function isChatGPTSubscription(auth: { type?: string; source?: string }): boolean {
  return auth.type === 'oauth' && auth.source === 'chatgpt';
}

/**
 * Applies a cache breakpoint marker to the stable prefix of the prompt,
 * placed before trailing environment-details injection.
 *
 * Strategy: walk from the tail and mark the last `system` or `assistant`
 * message. The breakpoint says "everything up to and including this
 * message is stable and cacheable"; trailing user turns (which typically
 * carry per-call env details) intentionally sit outside the breakpoint.
 */
export function applyCacheBreakpoint(prompt: LanguageModelV2Prompt): LanguageModelV2Prompt {
  // Find last stable content boundary (before env details / trailing user content).
  let breakpointIndex = -1;
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i];
    if (msg.role === 'system' || msg.role === 'assistant') {
      breakpointIndex = i;
      break;
    }
  }
  if (breakpointIndex < 0) {
    return prompt;
  }
  // Mark the message with a provider-specific hint on providerOptions.openai.
  const result = [...prompt];
  const target = result[breakpointIndex];
  const existingProviderOptions =
    (target.providerOptions as Record<string, unknown> | undefined) ?? {};
  const existingOpenAI =
    (existingProviderOptions.openai as Record<string, unknown> | undefined) ?? {};
  result[breakpointIndex] = {
    ...target,
    providerOptions: {
      ...existingProviderOptions,
      openai: { ...existingOpenAI, cacheBreakpoint: true },
    },
  };
  return result;
}
