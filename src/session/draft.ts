/**
 * Session Draft Cache
 *
 * Alexi_change (upstream kilocode `0d2fee251` "discard empty draft caches
 * after goal promotion"): tracks in-progress prompt buffers across
 * reload / resume so a user's mid-composition text is not lost. Empty
 * drafts are never persisted — they are actively evicted on set and
 * are removed after promotion (submit), matching the upstream fix.
 *
 * Persistence is deliberately in-memory: Alexi's interactive TUI holds
 * a single process, and cross-process persistence would require a
 * durable store that survives crashes AND respects the empty-draft
 * eviction contract. If a durable store is added later, plug it in
 * via the {@link DraftCacheStore} interface without changing callers.
 */

/**
 * Minimal store contract behind {@link DraftCache}. The default
 * in-memory implementation is a plain `Map`; tests or persistent
 * variants can swap in their own.
 */
export interface DraftCacheStore {
  get(sessionID: string): string | undefined;
  set(sessionID: string, value: string): void;
  delete(sessionID: string): void;
  clear(): void;
}

class InMemoryDraftStore implements DraftCacheStore {
  private readonly map = new Map<string, string>();

  get(sessionID: string): string | undefined {
    return this.map.get(sessionID);
  }
  set(sessionID: string, value: string): void {
    this.map.set(sessionID, value);
  }
  delete(sessionID: string): void {
    this.map.delete(sessionID);
  }
  clear(): void {
    this.map.clear();
  }
}

export class DraftCache {
  constructor(private readonly store: DraftCacheStore = new InMemoryDraftStore()) {}

  /**
   * Read the current draft for a session. Returns `undefined` when
   * nothing is cached — never returns an empty string.
   */
  get(sessionID: string): string | undefined {
    return this.store.get(sessionID);
  }

  /**
   * Persist a draft. Empty / whitespace-only values are actively
   * evicted from the store rather than persisted — matches the upstream
   * kilocode contract that empty drafts must never linger past their
   * setter. Callers do not need to pre-trim.
   */
  set(sessionID: string, draft: string): void {
    if (!draft || draft.trim().length === 0) {
      this.store.delete(sessionID);
      return;
    }
    this.store.set(sessionID, draft);
  }

  /**
   * Remove any cached draft for the session. Idempotent — safe to call
   * on a session that has no cached draft.
   */
  delete(sessionID: string): void {
    this.store.delete(sessionID);
  }

  /**
   * Promote a draft to an actual submitted prompt. Trims the input,
   * evicts the cache entry, and returns the trimmed prompt (or
   * `undefined` when the draft was empty — the caller should NOT
   * submit an empty prompt).
   *
   * The eviction happens in both branches:
   *   - empty input → drop any stale cache and return `undefined`;
   *   - non-empty input → drop the cache and return the trimmed value
   *     so the caller can hand it to the session's submit path.
   *
   * This mirrors the upstream fix: the cache never survives promotion
   * even when the promotion itself is a no-op.
   */
  promote(sessionID: string, draft: string): string | undefined {
    const trimmed = (draft ?? '').trim();
    this.store.delete(sessionID);
    return trimmed.length > 0 ? trimmed : undefined;
  }

  /** Test / shutdown helper: wipe every cached draft. */
  clear(): void {
    this.store.clear();
  }
}

let globalCache: DraftCache | null = null;

/**
 * Process-global draft cache. Callers that don't have a natural
 * lifetime to hang an instance off (CLI subcommands, TUI hooks) can
 * use this singleton. Tests should construct their own {@link DraftCache}
 * for isolation.
 */
export function getDraftCache(): DraftCache {
  if (!globalCache) {
    globalCache = new DraftCache();
  }
  return globalCache;
}

/** Test-only helper to reset the process-global cache. */
export function resetDraftCache(): void {
  globalCache?.clear();
  globalCache = null;
}
