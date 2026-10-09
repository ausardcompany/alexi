/**
 * Embedding dimension-omission cache
 *
 * Some OpenAI-compatible embedding servers (LM Studio, Ollama's OpenAI
 * adapter, vLLM) reject the optional `dimensions` request parameter with
 * HTTP 400 / 422. The retry helper in `./embeddings.ts` reacts to such a
 * rejection by retrying the exact same request WITHOUT `dimensions`.
 * Once that succeeds, we never want to pay the cost of a doomed
 * dimensions-first attempt again, so this cache records the model id and
 * is consulted up-front on subsequent requests.
 *
 * The cache is intentionally tiny: it stores one boolean per model id.
 * Persistence is a plain JSON file at `~/.alexi/embedding-cache.json`
 * so the hint survives across CLI invocations. Corruption / permission
 * errors are swallowed — the cache is strictly an optimisation hint and
 * must never block a working embedding request.
 *
 * Source: kilocode PR #14921, Alexi issue #1968.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Default on-disk location: `~/.alexi/embedding-cache.json`.
 */
export const DEFAULT_EMBEDDING_CACHE_PATH = path.join(
  os.homedir(),
  '.alexi',
  'embedding-cache.json'
);

/**
 * JSON on-disk shape. Kept intentionally conservative so a future
 * extension (e.g. remembering per-endpoint overrides) can add fields
 * without a breaking schema change.
 */
interface EmbeddingCacheFile {
  /** schema version — bump when the file layout changes incompatibly */
  version: 1;
  /** map of model id -> `true` when that model rejects `dimensions` */
  omitDimensions: Record<string, boolean>;
}

/**
 * Per-model cache of which embedding models reject the `dimensions`
 * request parameter.
 *
 * The class is deliberately small and synchronous: a lookup is `O(1)`
 * and persistence is best-effort. Call sites are expected to:
 *
 * ```ts
 * const cache = new DimensionCache();
 * cache.load();
 * if (!cache.shouldOmit(model)) {
 *   // try with `dimensions`
 * }
 * // on retry success:
 * cache.recordOmission(model);
 * cache.save();
 * ```
 */
export class DimensionCache {
  private readonly filePath: string;
  private readonly cache: Map<string, boolean> = new Map();

  constructor(filePath: string = DEFAULT_EMBEDDING_CACHE_PATH) {
    this.filePath = filePath;
  }

  /**
   * Whether the next request for `model` should be sent WITHOUT the
   * `dimensions` parameter (because a previous call learned the server
   * rejects it).
   */
  public shouldOmit(model: string): boolean {
    return this.cache.get(model) === true;
  }

  /**
   * Record that `model` rejected `dimensions`. The next call to
   * `shouldOmit(model)` will return `true` even without a reload.
   * `save()` must be called separately to persist across runs.
   */
  public recordOmission(model: string): void {
    this.cache.set(model, true);
  }

  /**
   * Remove any recorded omission for `model`. Useful for tests and for
   * a future "I upgraded the server" reset flow.
   */
  public clear(model: string): void {
    this.cache.delete(model);
  }

  /**
   * Drop every entry in the in-memory cache. Does NOT delete the
   * underlying file — call `save()` afterwards to persist the reset.
   */
  public clearAll(): void {
    this.cache.clear();
  }

  /**
   * In-memory snapshot, exposed for tests and diagnostics.
   */
  public entries(): ReadonlyMap<string, boolean> {
    return new Map(this.cache);
  }

  /**
   * Load cached omissions from disk into memory.
   *
   * - Missing file: silently initialises an empty cache.
   * - Corrupt JSON / wrong schema: silently ignored. The cache remains
   *   whatever was already in memory. This is intentional — the cache
   *   is a hint, never a correctness requirement.
   */
  public load(): void {
    try {
      if (!fs.existsSync(this.filePath)) {
        return;
      }
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const parsed: unknown = JSON.parse(raw);
      if (!isEmbeddingCacheFile(parsed)) {
        return;
      }
      for (const [model, omit] of Object.entries(parsed.omitDimensions)) {
        if (omit === true) {
          this.cache.set(model, true);
        }
      }
    } catch {
      // Permission / FS errors are strictly best-effort.
    }
  }

  /**
   * Persist the in-memory cache to `filePath`.
   *
   * Creates the parent directory on demand. Failures (disk full, EACCES,
   * read-only FS) are swallowed to preserve the "hint, never required"
   * contract. Callers that need a hard guarantee can call
   * `JSON.stringify(cache.entries())` and write it themselves.
   */
  public save(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const omitDimensions: Record<string, boolean> = {};
      for (const [model, omit] of this.cache.entries()) {
        if (omit === true) {
          omitDimensions[model] = true;
        }
      }
      const file: EmbeddingCacheFile = { version: 1, omitDimensions };
      fs.writeFileSync(this.filePath, JSON.stringify(file, null, 2), 'utf-8');
    } catch {
      // Best-effort — see `load()` rationale.
    }
  }
}

function isEmbeddingCacheFile(value: unknown): value is EmbeddingCacheFile {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const v = value as { version?: unknown; omitDimensions?: unknown };
  if (v.version !== 1) {
    return false;
  }
  if (!v.omitDimensions || typeof v.omitDimensions !== 'object') {
    return false;
  }
  for (const entry of Object.values(v.omitDimensions as Record<string, unknown>)) {
    if (typeof entry !== 'boolean') {
      return false;
    }
  }
  return true;
}

/**
 * Module-level singleton so unrelated call sites (today: codesearch,
 * tomorrow: any other embedding consumer) share the same hint without
 * having to thread an instance through every API.
 *
 * The singleton lazily loads on first access. Tests can call
 * `resetSharedDimensionCache(path)` to pin it to an isolated file.
 */
let shared: DimensionCache | undefined;
let sharedLoaded = false;

export function getSharedDimensionCache(): DimensionCache {
  if (!shared) {
    shared = new DimensionCache();
  }
  if (!sharedLoaded) {
    shared.load();
    sharedLoaded = true;
  }
  return shared;
}

/**
 * Test-only: swap the shared singleton for a cache rooted at `filePath`
 * (or a brand-new default-rooted cache when omitted) and force a fresh
 * load on next access.
 *
 * @internal
 */
export function resetSharedDimensionCache(filePath?: string): DimensionCache {
  shared = new DimensionCache(filePath);
  sharedLoaded = false;
  return shared;
}
