/**
 * Prompt-cache error recovery (issue #1930).
 *
 * SAP AI Core routes OpenAI- and Anthropic-family models through the
 * orchestration provider (`./sapOrchestration.ts`). Both families support
 * prompt caching via explicit breakpoints:
 *   - OpenAI (GPT-5.6+): `providerOptions.openai.cacheBreakpoint` marker
 *     on the stable prompt prefix (see `./openai/prompt-cache.ts`).
 *   - Anthropic (Claude 3+): `cache_control: { type: 'ephemeral' }` blocks
 *     on individual content items.
 *
 * Prompt caching reduces latency and cost but can fail transiently due to
 * cache eviction (provider-side LRU), API errors specific to the cache
 * endpoint (429/503 on the cache path), or invalid breakpoint shape
 * mismatches between a cached prompt and the current one. When any of
 * these happen, the user-visible symptom is a generic "prompt cache error"
 * that does NOT reflect a real provider outage — the exact same request
 * without cache markers would succeed.
 *
 * This module centralises:
 *   1. {@link isCacheError} — the detector used by call sites to decide
 *      whether a thrown error is safe to retry without cache markers.
 *   2. {@link stripOpenAICacheBreakpoints} / {@link stripAnthropicCacheControl}
 *      — pure helpers that remove cache markers from a prompt or message
 *      list without touching any other fields.
 *   3. {@link withCacheFallback} — a thin wrapper that runs an async call,
 *      detects cache errors, logs a one-shot WARN, and retries the call
 *      with a caller-provided "uncached" factory. The retry budget is
 *      capped at ONE additional attempt — this is a graceful-degradation
 *      path, not a general retry loop (that lives in `ErrorBackoff`).
 *
 * Design notes:
 *   - Detection is deliberately conservative. We only flag errors whose
 *     text or HTTP status strongly suggests a cache-specific failure.
 *     An auth error (401), a rate-limit on the regular endpoint (429 on
 *     chat, not cache), or a timeout MUST NOT trip this detector —
 *     retrying those without the cache marker just wastes budget.
 *   - The WARN log is emitted at most once per call site invocation; the
 *     caller does not need to debounce it. For process-wide dedup, the
 *     caller can gate the `logger.warn` through its own `Set<string>`
 *     cache keyed by `error.message`.
 */

import { logger } from '../utils/logger.js';
import type { LanguageModelV2Prompt } from './openai/prompt-cache.js';

/**
 * Cache-related keywords matched against the error message. Case-insensitive.
 * The list is intentionally narrow: a generic "error" or "timeout" MUST NOT
 * match, otherwise non-cache errors would get silently retried.
 */
const CACHE_KEYWORDS: readonly string[] = [
  'prompt_cache',
  'prompt cache',
  'cache_control',
  'cache control',
  'cache breakpoint',
  'cache_breakpoint',
  'cache miss',
  'cache evicted',
  'cache eviction',
  'invalid breakpoint',
  'invalid_breakpoint',
  'invalid cache',
  'evicted',
];

/**
 * HTTP status codes that, in combination with a cache keyword in the
 * message or an explicit `cache_control` reference, indicate a cache-
 * specific failure. 422 is Anthropic's and OpenAI's typical response for
 * an invalid or stale breakpoint; 429/503 on the cache endpoint also
 * surface this way. We DO NOT treat a bare 422 (no cache keyword) as a
 * cache error — 422 is also used for generic validation failures.
 */
const CACHE_HTTP_STATUSES: ReadonlySet<number> = new Set([422]);

/**
 * Extract a stringified error message from an unknown error value.
 * Handles plain Error, string, and `{ message: string }` shapes.
 */
function errorMessage(err: unknown): string {
  if (err === null || err === undefined) {
    return '';
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err instanceof Error) {
    return err.message ?? '';
  }
  if (typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') {
      return maybeMessage;
    }
  }
  return '';
}

/**
 * Extract an HTTP status code from an unknown error value. Mirrors the
 * surface area that `classifyRateLimitError` already walks for the SAP
 * SDK (status, response.status).
 */
function errorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') {
    return undefined;
  }
  const e = err as { status?: unknown; response?: { status?: unknown } };
  if (typeof e.status === 'number' && Number.isFinite(e.status)) {
    return e.status;
  }
  if (e.response && typeof e.response === 'object') {
    const s = e.response.status;
    if (typeof s === 'number' && Number.isFinite(s)) {
      return s;
    }
  }
  return undefined;
}

/**
 * Returns `true` when the given error is a prompt-cache-specific failure
 * that is safe to retry WITHOUT cache markers.
 *
 * Matching rules (any one is sufficient):
 *   - Message contains a cache keyword from {@link CACHE_KEYWORDS}
 *     (case-insensitive substring match).
 *   - HTTP status is in {@link CACHE_HTTP_STATUSES} AND the message also
 *     mentions "cache" or "breakpoint" (defensive: a bare 422 without a
 *     cache signal is NOT treated as a cache error — generic validation
 *     failures also surface as 422).
 *
 * Returns `false` for null/undefined errors, non-object/non-string
 * errors, and any error that doesn't satisfy the rules above.
 */
export function isCacheError(err: unknown): boolean {
  if (err === null || err === undefined) {
    return false;
  }
  const message = errorMessage(err).toLowerCase();
  if (message.length === 0) {
    return false;
  }

  for (const keyword of CACHE_KEYWORDS) {
    if (message.includes(keyword)) {
      return true;
    }
  }

  const status = errorStatus(err);
  if (status !== undefined && CACHE_HTTP_STATUSES.has(status)) {
    // Guard against generic 422s: require a cache or breakpoint hint in
    // the message as well.
    if (message.includes('cache') || message.includes('breakpoint')) {
      return true;
    }
  }

  return false;
}

/**
 * Return a copy of the given prompt with any OpenAI cache-breakpoint
 * markers removed. The marker lives at
 * `providerOptions.openai.cacheBreakpoint` and is set by
 * `applyCacheBreakpoint` in `./openai/prompt-cache.ts`.
 *
 * Other `providerOptions.openai.*` fields are preserved. If removing the
 * breakpoint leaves `providerOptions.openai` empty, the empty object is
 * kept to avoid changing the key presence (consumers may rely on it).
 *
 * The function is pure: it does not mutate the input prompt or any of
 * its message objects, and messages without a breakpoint are returned
 * as-is (reference-equal).
 */
export function stripOpenAICacheBreakpoints(prompt: LanguageModelV2Prompt): LanguageModelV2Prompt {
  let changed = false;
  const result = prompt.map((msg) => {
    const providerOptions = msg.providerOptions as Record<string, unknown> | undefined;
    if (!providerOptions || typeof providerOptions !== 'object') {
      return msg;
    }
    const openai = providerOptions.openai as Record<string, unknown> | undefined;
    if (!openai || typeof openai !== 'object' || !('cacheBreakpoint' in openai)) {
      return msg;
    }
    changed = true;
    // Build a copy without the cacheBreakpoint key.
    const { cacheBreakpoint: _cacheBreakpoint, ...restOpenAI } = openai;
    return {
      ...msg,
      providerOptions: {
        ...providerOptions,
        openai: restOpenAI,
      },
    };
  });
  return changed ? result : prompt;
}

/**
 * Minimal shape of an Anthropic-style message content block that MAY
 * carry a `cache_control` marker.
 */
export interface AnthropicContentBlock {
  type?: string;
  cache_control?: unknown;
  [key: string]: unknown;
}

/**
 * Minimal shape of an Anthropic-style message. `content` can be a bare
 * string (no cache markers possible) or an array of content blocks that
 * MAY carry `cache_control` markers.
 */
export interface AnthropicMessage {
  role: string;
  content: string | AnthropicContentBlock[];
  [key: string]: unknown;
}

/**
 * Return a copy of the given message list with any Anthropic
 * `cache_control` markers removed. Pure: strings are returned as-is,
 * blocks without a marker are returned reference-equal, and the input
 * list is not mutated.
 *
 * Removes both top-level `cache_control` on the message and `cache_control`
 * on each content block. Anthropic's SDK accepts the marker in both
 * positions.
 */
export function stripAnthropicCacheControl<T extends AnthropicMessage>(messages: T[]): T[] {
  let changed = false;
  const result = messages.map((msg) => {
    let next: T = msg;
    // Strip top-level cache_control if present.
    if ('cache_control' in msg && msg.cache_control !== undefined) {
      changed = true;
      const { cache_control: _cc, ...rest } = msg;
      next = rest as unknown as T;
    }
    // Strip from content blocks when content is an array.
    if (Array.isArray(next.content)) {
      let blocksChanged = false;
      const newBlocks = next.content.map((block) => {
        if (
          block &&
          typeof block === 'object' &&
          'cache_control' in block &&
          block.cache_control !== undefined
        ) {
          blocksChanged = true;
          const { cache_control: _bc, ...restBlock } = block;
          return restBlock;
        }
        return block;
      });
      if (blocksChanged) {
        changed = true;
        next = { ...next, content: newBlocks } as T;
      }
    }
    return next;
  });
  return changed ? result : messages;
}

/**
 * Options for {@link withCacheFallback}.
 */
export interface CacheFallbackOptions<T> {
  /**
   * Produce the primary (cached) call. Called first; its thrown error is
   * inspected by {@link isCacheError}.
   */
  cached: () => Promise<T>;
  /**
   * Produce the fallback (uncached) call. Called only when `cached()`
   * throws a cache-specific error. The factory MUST build a request that
   * does NOT carry cache markers.
   */
  uncached: () => Promise<T>;
  /**
   * Short label used in the WARN log so operators can tell which call
   * site degraded. Example: `"openai chatCompletion"`.
   */
  label?: string;
  /**
   * Optional callback invoked after a successful fallback. Useful for
   * incrementing an observability counter without threading a metric
   * handle through every call site. Errors from the callback are
   * swallowed.
   */
  onFallback?: () => void;
}

/**
 * Run `cached()`. On a cache-specific error (per {@link isCacheError}),
 * log a WARN with a remediation hint, run `uncached()` once, and return
 * its result. On any non-cache error from `cached()` OR any error from
 * `uncached()`, rethrow — this is a graceful-degradation hook, NOT a
 * general retry loop. The caller's broader retry policy (ErrorBackoff,
 * workflow `KILO_RETRIES`) is still responsible for everything else.
 *
 * Rationale: retrying an auth error, a true rate limit, or a validation
 * failure without cache markers would just waste budget — those are not
 * cache-specific. Reporting the ORIGINAL error on fallback failure keeps
 * the user-visible error message aligned with the true root cause.
 */
export async function withCacheFallback<T>(options: CacheFallbackOptions<T>): Promise<T> {
  try {
    return await options.cached();
  } catch (err) {
    if (!isCacheError(err)) {
      throw err;
    }
    const label = options.label ?? 'provider call';
    const msg = errorMessage(err);
    logger.warn(
      `Prompt cache error, retrying without cache (${label}): ${msg}. ` +
        `Hint: this is usually a transient cache eviction; if it repeats, ` +
        `inspect prompt stability or provider cache status.`
    );
    try {
      const result = await options.uncached();
      if (options.onFallback) {
        try {
          options.onFallback();
        } catch {
          // Swallow — observability callbacks must not mask success.
        }
      }
      return result;
    } catch (fallbackErr) {
      // The fallback itself failed. Rethrow the ORIGINAL error so the
      // user sees the true root cause instead of a secondary symptom.
      // The fallback error is attached as `cause` for debugging.
      if (err instanceof Error) {
        try {
          (err as Error & { cause?: unknown }).cause = fallbackErr;
        } catch {
          // Some errors have non-writable properties; ignore.
        }
      }
      throw err;
    }
  }
}
