/**
 * Prompt cache policy (opencode `9007700` port).
 *
 * Anthropic's prompt caching accepts a `cache_control` block on each
 * cached content item that carries an optional `ttl` field. Upstream
 * opencode made the TTL user-configurable (default `5m`, upgrade to
 * `1h` for long-running sessions) because long sessions benefit
 * disproportionately from the longer cache window — the fixed 5m TTL
 * made the cache miss on every follow-up turn.
 *
 * This module exposes:
 *   - {@link CachePolicySchema}: Zod schema for config loading.
 *   - {@link CachePolicy}: inferred type callers thread through to the
 *     provider request builder.
 *   - {@link anthropicCacheControl}: helper that produces the
 *     `cache_control` block to attach to a cached content item.
 *
 * SAP AI Core routes Anthropic models through the orchestration provider
 * which forwards `cache_control` verbatim, so this helper is wired into
 * the same path used for direct Anthropic calls.
 */

import { z } from 'zod';

/**
 * Valid prompt-cache TTL values. Keep the enum narrow so misconfigured
 * TTLs are caught at config load time rather than causing silent cache
 * misses at the provider.
 */
export const CachePolicySchema = z
  .object({
    /**
     * How long the provider should hold cached prefixes before eviction.
     * `5m` is Anthropic's default; `1h` is the long-session option
     * (opencode `9007700`).
     */
    ttl: z.enum(['5m', '1h']).default('5m'),
  })
  .optional();

/** Inferred config type callers reference without re-declaring the schema. */
export type CachePolicy = z.infer<typeof CachePolicySchema>;

/**
 * Build an Anthropic-shaped `cache_control` block. Defaults to the
 * standard `5m` TTL when no policy is supplied, matching Anthropic's
 * default — passing an explicit value is only necessary when the caller
 * wants the long-session `1h` TTL.
 *
 * Returns a frozen object so callers cannot accidentally mutate the
 * shared instance passed to the request builder.
 */
export function anthropicCacheControl(policy?: CachePolicy): {
  type: 'ephemeral';
  ttl: '5m' | '1h';
} {
  return Object.freeze({
    type: 'ephemeral' as const,
    ttl: policy?.ttl ?? '5m',
  });
}

/**
 * Convenience helper that mirrors the opencode call-site shape. Returns
 * a provider-options block the orchestration layer can merge into its
 * per-message `providerOptions.anthropic` field.
 */
export function anthropicCacheProviderOptions(policy?: CachePolicy): {
  anthropic: { cacheControl: { type: 'ephemeral'; ttl: '5m' | '1h' } };
} {
  return {
    anthropic: {
      cacheControl: anthropicCacheControl(policy),
    },
  };
}
