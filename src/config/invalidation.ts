/**
 * Config Instance Cache Invalidation
 *
 * Ports kilocode upstream `19a2a3c4d`: when global config changes (e.g.
 * SAP AI Core credentials refresh, model rotation, routing rewrite),
 * per-instance cached config becomes stale. Without invalidation, an
 * in-flight session keeps using the old credentials and fails auth on
 * the next request.
 *
 * The pattern intentionally mirrors upstream's `invalidateGlobal`:
 *   1. Clear the global config snapshot.
 *   2. Clear every active per-instance config cache that keyed off it.
 *
 * We keep the registry structural: consumers register a disposer via
 * `registerInstanceCache` at module load and receive an invalidation
 * signal when `invalidateGlobalConfig` is called.
 */

type InstanceCacheDisposer = () => void;

/**
 * Registry of per-instance config caches that must be flushed when the
 * global config is invalidated. Populated by any module that maintains
 * a config-derived cache (routing config, provider config, permission
 * ruleset, etc.).
 */
const instanceCaches = new Set<InstanceCacheDisposer>();

/**
 * Register a disposer for a per-instance config cache. Returns a
 * function that unregisters the disposer — call it on teardown.
 *
 * Example:
 *   const dispose = registerInstanceCache(() => routingConfigCache.clear());
 *   // ...
 *   dispose(); // on shutdown
 */
export function registerInstanceCache(dispose: InstanceCacheDisposer): () => void {
  instanceCaches.add(dispose);
  return () => {
    instanceCaches.delete(dispose);
  };
}

/**
 * Test/debug helper: return how many instance caches are currently
 * registered. Not part of the stable public surface.
 * @internal
 */
export function _instanceCacheCount(): number {
  return instanceCaches.size;
}

/**
 * Invalidate the global config snapshot AND every registered
 * per-instance cache. Call this whenever a persistent config file has
 * been rewritten (e.g. after `updateGlobal` with `dispose: true`, after
 * an OAuth refresh, or after a `AICORE_SERVICE_KEY` rotation).
 *
 * Errors thrown by individual disposers are caught and logged (via
 * console.warn only — this module intentionally does not depend on
 * `src/utils/logger.ts` to keep it importable from very early boot
 * paths). A misbehaving disposer never blocks the rest of the flush.
 *
 * Also flushes the project-scoped caches in `projectCache.ts` (issue
 * #1848): a global-config rewrite frequently changes rules, routing,
 * or MCP servers indirectly, and stale worktree entries there would
 * survive `invalidateGlobalConfig` otherwise. Dynamic import keeps
 * this file free of a boot-time cycle with `projectCache.ts` (which
 * imports higher-level loaders from `mcp/`, `agent/`, `skill/`).
 */
export function invalidateGlobalConfig(): void {
  for (const dispose of instanceCaches) {
    try {
      dispose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[config] instance cache disposer threw during invalidation: ${String(err)}`);
    }
  }
  // Best-effort: project caches are optional (dynamic import so a
  // consumer that never touches `projectCache` avoids the transitive
  // load), and a failure here must not block the rest of the flush.
  void import('./projectCache.js')
    .then(({ invalidateAllProjectCaches }) => {
      invalidateAllProjectCaches();
    })
    .catch(() => {
      // Project cache not loaded — nothing to purge.
    });
}

/**
 * Invalidate project-scoped config caches for a specific workdir. Use
 * this from session-context boundaries (workdir switch during a
 * long-lived process) rather than the global `invalidateGlobalConfig`
 * — a global flush is overkill when only one worktree's on-disk
 * config changed.
 *
 * When `workdir` is omitted, invalidates project caches for every
 * workdir (a stronger flush than a targeted purge, but still narrower
 * than `invalidateGlobalConfig` which also runs registered instance
 * disposers).
 */
export function invalidateProjectConfig(workdir?: string): void {
  void import('./projectCache.js')
    .then(({ invalidateProjectCache }) => {
      invalidateProjectCache(workdir);
    })
    .catch(() => {
      // Project cache not loaded — nothing to purge.
    });
}
