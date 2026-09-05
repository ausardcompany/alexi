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
    return isGpt5_6OrLater(opts.modelId);
  }
  return false;
}

/**
 * Robust GPT version comparator (opencode PRs #47384, #47385).
 *
 * Two edge cases the plain `/gpt-5\.[6-9]|gpt-[6-9]/i` regex handles by
 * accident but that we make explicit here to guard against future
 * refactors:
 *
 *   1. Integer versions without a minor (`"gpt-6"`) must be accepted —
 *      opencode's original code compared only against `major.minor`
 *      strings and crashed on `NaN` when the minor was absent.
 *   2. Comparison must be by `(major, minor)` tuple, not major alone —
 *      otherwise `"gpt-5.4"` would incorrectly match a `major >= 5` check.
 *
 * Returns `true` when the parsed version is >= 5.6 (i.e. `major > 5`, OR
 * `major === 5 && minor >= 6`). Returns `false` for unparseable ids.
 */
export function isGpt5_6OrLater(modelId: string): boolean {
  // Accept both "gpt-5" and "gpt-5.6" style versions. The minor group is
  // optional; when absent it defaults to 0.
  const match = /^gpt-(\d+)(?:\.(\d+))?/i.exec(modelId);
  if (!match) {
    return false;
  }
  const major = Number(match[1]);
  const minor = match[2] !== undefined ? Number(match[2]) : 0;
  if (!Number.isFinite(major) || !Number.isFinite(minor)) {
    return false;
  }
  // Tuple comparison against (5, 6).
  if (major > 5) {
    return true;
  }
  if (major === 5 && minor >= 6) {
    return true;
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
 * Returns true when the given message content string contains an
 * `<environment_details>` block. Trims leading/trailing whitespace before
 * matching so that blank lines or padding preceding the block do not
 * defeat the check (Kilocode #13190).
 *
 * Exported so orchestrators can share the same predicate when deciding
 * whether an env block has already been injected upstream.
 */
export function hasEnvironmentDetailsBlock(content: unknown): boolean {
  if (typeof content !== 'string') {
    return false;
  }
  return content.trim().includes('<environment_details>');
}

/**
 * Extracts a plain-text view of a message's `content` for tag-detection
 * purposes. Handles the Vercel AI SDK v2 shape where `content` may be a
 * string OR an array of `{ type: 'text', text: string }` parts. Non-text
 * parts are ignored — they cannot carry an env-details fence.
 */
function contentToText(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part && typeof part === 'object' && 'text' in (part as Record<string, unknown>)) {
          const text = (part as { text?: unknown }).text;
          return typeof text === 'string' ? text : '';
        }
        return '';
      })
      .join('\n');
  }
  return '';
}

/**
 * Applies a cache breakpoint marker to the stable prefix of the prompt,
 * placed before trailing environment-details injection.
 *
 * Strategy: walk from the tail and mark the last `system` or `assistant`
 * message that does NOT itself contain an `<environment_details>` block.
 * The breakpoint says "everything up to and including this message is
 * stable and cacheable"; env-details blocks vary per call (working dir,
 * timestamp, file paths) and would poison the cache prefix if included.
 * Trailing user turns (which typically carry per-call env details)
 * intentionally sit outside the breakpoint.
 *
 * Falls back to the last system/assistant message unconditionally when
 * every stable-role message carries an env block, so the caller still
 * gets some caching benefit.
 */
export function applyCacheBreakpoint(prompt: LanguageModelV2Prompt): LanguageModelV2Prompt {
  // First pass: prefer the last system/assistant message that is free of
  // env-details content. This maximises the cacheable prefix.
  let breakpointIndex = -1;
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i];
    if (msg.role !== 'system' && msg.role !== 'assistant') {
      continue;
    }
    if (!hasEnvironmentDetailsBlock(contentToText(msg.content))) {
      breakpointIndex = i;
      break;
    }
  }
  // Fallback: if every stable-role message carries an env block, mark the
  // last one anyway so callers still get partial caching.
  if (breakpointIndex < 0) {
    for (let i = prompt.length - 1; i >= 0; i--) {
      const msg = prompt[i];
      if (msg.role === 'system' || msg.role === 'assistant') {
        breakpointIndex = i;
        break;
      }
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
