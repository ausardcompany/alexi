/**
 * Plugin rule-content cache (B004).
 *
 * Two cache maps back the `command`-source rule loader so we don't re-spawn
 * a generator on every prompt assembly:
 *
 *   - {@link alwaysCache}: process-lifetime cache for `scope: 'always'` rules.
 *     Keyed by `${pluginId}::${ruleName}`. Populated once on first miss and
 *     never invalidated (intentional — `always` rules are meant to be
 *     captured once at plugin install time-style snapshots).
 *
 *   - {@link sessionCache}: per-session cache for `scope: 'session'` rules.
 *     Keyed by session id, then by `${pluginId}::${ruleName}`. Entries are
 *     dropped wholesale when the session ends via {@link clearSession} —
 *     `sessionManager.endSession` / `closeAndExtract` already calls into
 *     the legacy `clearRuleCommandCache` shim which delegates here.
 *
 * Limitation: there is no signal for "process is exiting". Entries in
 * {@link alwaysCache} live until the process dies; that's by design (see
 * the parent tracker #633 design doc) and matches the issue text:
 *
 *     populated once per process lifetime.
 *
 * The {@link getOrLoad} accessor is the only public way to *populate* the
 * cache — callers pass a `loader` that produces the (already-capped) string
 * to store. Errors thrown by the loader are not cached so a transient
 * failure (e.g. timeout, missing binary) can recover automatically on the
 * next prompt assembly.
 */

/**
 * Cache scope. Mirrors the `PluginRule.scope` literal so callers can pass
 * `rule.scope` straight through.
 */
export type RuleCacheScope = 'always' | 'session';

/**
 * Process-lifetime cache for `scope: 'always'` rules.
 * Keyed by `${pluginId}::${ruleName}`.
 *
 * Exported for the test suite; production code should go through
 * {@link getOrLoad} or {@link clearAll} rather than mutating this map
 * directly.
 */
export const alwaysCache: Map<string, string> = new Map();

/**
 * Per-session cache for `scope: 'session'` rules.
 * Outer key: session id. Inner key: `${pluginId}::${ruleName}`.
 *
 * Exported for the test suite (see note on {@link alwaysCache}).
 */
export const sessionCache: Map<string, Map<string, string>> = new Map();

/**
 * Build a cache key in the canonical `${pluginId}::${ruleName}` shape.
 * Centralised so callers can't accidentally drift from one another.
 */
export function ruleCacheKey(pluginId: string, ruleName: string): string {
  return `${pluginId}::${ruleName}`;
}

/**
 * Get-or-load accessor used by the rule loader (B005).
 *
 * On hit, returns the cached value synchronously-resolved.
 * On miss, awaits `loader()`, stores its result under `key` in the
 * appropriate map, and returns it. Loader errors propagate to the caller
 * and the entry is *not* stored.
 *
 * @param scope     The rule's scope. Drives which map is consulted.
 * @param key       Pre-built cache key — typically {@link ruleCacheKey}.
 * @param sessionId Session id (required when `scope === 'session'`). When
 *                  `scope === 'always'` this is ignored.
 * @param loader    Async producer of the value to cache on miss.
 */
export async function getOrLoad(
  scope: RuleCacheScope,
  key: string,
  sessionId: string | undefined,
  loader: () => Promise<string>
): Promise<string> {
  if (scope === 'always') {
    const hit = alwaysCache.get(key);
    if (hit !== undefined) {
      return hit;
    }
    const value = await loader();
    alwaysCache.set(key, value);
    return value;
  }

  // scope === 'session'
  const sid = sessionId ?? 'default';
  let inner = sessionCache.get(sid);
  if (inner === undefined) {
    inner = new Map();
    sessionCache.set(sid, inner);
  }
  const hit = inner.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const value = await loader();
  inner.set(key, value);
  return value;
}

/**
 * Drop every session-scoped entry for `sessionId`. No-op when the session
 * has no cached entries. Always-scoped entries are unaffected — those live
 * for the process lifetime by design.
 */
export function clearSession(sessionId: string): void {
  sessionCache.delete(sessionId);
}

/**
 * Drop every cached entry from both maps. Intended for tests; production
 * code should prefer {@link clearSession}.
 */
export function clearAll(): void {
  alwaysCache.clear();
  sessionCache.clear();
}
