/**
 * Provider allowlist filter (upstream security port).
 *
 * Ports kilocode fix `9340d34f5`: provider auth loaders must run only for
 * providers the operator has actually enabled via `enabled_providers`.
 * Loading auth for excluded providers wastes work and — more importantly
 * for SAP AI Core deployments where only specific providers are approved
 * — surfaces credential errors for providers the operator has explicitly
 * disabled, which the UI/logs then treat as real failures.
 *
 * Callers use this helper BEFORE invoking any per-provider auth loader:
 *
 *   const active = filterEnabledProviders(cfg.provider ?? {}, cfg.enabled_providers);
 *   for (const [id, prov] of Object.entries(active)) {
 *     await loadAuth(id, prov);
 *   }
 *
 * When `enabled` is `undefined` or empty, the filter is a no-op (returns
 * the input unchanged) — an empty allowlist means "no explicit allowlist
 * configured", not "no providers allowed", matching upstream semantics.
 */

/**
 * Filter a provider config map by an optional `enabled_providers`
 * allowlist. Providers not in the allowlist are dropped from the result
 * so downstream auth loaders never see them.
 *
 * @param providers - Full map of provider id → provider config as read
 *   from user / project config.
 * @param enabled - Optional allowlist of provider ids. When absent or
 *   empty, all providers are returned unchanged.
 * @returns A new map containing only the entries whose id appears in
 *   `enabled`. Object identity is not preserved (a fresh object is
 *   returned even when nothing was filtered) so callers can mutate the
 *   result without affecting the input.
 */
export function filterEnabledProviders<T>(
  providers: Record<string, T>,
  enabled?: readonly string[]
): Record<string, T> {
  if (!enabled || enabled.length === 0) {
    return { ...providers };
  }
  const allow = new Set(enabled);
  return Object.fromEntries(Object.entries(providers).filter(([id]) => allow.has(id)));
}
