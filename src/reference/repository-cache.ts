/**
 * Repository Cache Service with Typed Failures
 * Based on opencode refactor(repository): type cache failures
 */

// Typed cache failures based on opencode refactor(repository): type cache failures
export class CacheError extends Error {
  readonly _tag: string = 'CacheError';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CacheError';
  }
}

export class CacheMissError extends CacheError {
  readonly _tag = 'CacheMissError';

  constructor(public readonly key: string) {
    super(`Cache miss for key: ${key}`);
    this.name = 'CacheMissError';
  }
}

export class CacheStaleError extends CacheError {
  readonly _tag = 'CacheStaleError';

  constructor(
    public readonly key: string,
    public readonly ageMs: number
  ) {
    super(`Cache entry stale for key: ${key} (age: ${ageMs}ms)`);
    this.name = 'CacheStaleError';
  }
}

export class CacheCapacityError extends CacheError {
  readonly _tag = 'CacheCapacityError';

  constructor(
    public readonly currentSize: number,
    public readonly maxSize: number
  ) {
    super(`Cache at capacity: ${currentSize}/${maxSize}`);
    this.name = 'CacheCapacityError';
  }
}

export interface RepositoryCacheEntry {
  content: string;
  hash: string;
  fetchedAt: Date;
  expiresAt: Date;
}

export interface RepositoryCacheOptions {
  capacity?: number;
  ttlMs?: number;
}

/**
 * Repository cache with properly typed failures
 * Supports TTL-based expiration and capacity limits
 */
export class RepositoryCache {
  private cache: Map<string, RepositoryCacheEntry> = new Map();
  private readonly capacity: number;
  private readonly ttlMs: number;

  constructor(options: RepositoryCacheOptions = {}) {
    this.capacity = options.capacity ?? 1000;
    this.ttlMs = options.ttlMs ?? 60 * 60 * 1000; // 1 hour default
  }

  /**
   * Get a cache entry
   * Throws CacheMissError if not found or CacheStaleError if expired
   */
  async get(key: string): Promise<RepositoryCacheEntry> {
    const entry = this.cache.get(key);

    if (!entry) {
      throw new CacheMissError(key);
    }

    // Check if entry is stale
    const now = new Date();
    if (entry.expiresAt < now) {
      const ageMs = now.getTime() - entry.fetchedAt.getTime();
      throw new CacheStaleError(key, ageMs);
    }

    return entry;
  }

  /**
   * Set a cache entry
   * Throws CacheCapacityError if cache is at capacity
   */
  async set(key: string, entry: RepositoryCacheEntry): Promise<void> {
    // Check capacity before adding new entry
    if (!this.cache.has(key) && this.cache.size >= this.capacity) {
      throw new CacheCapacityError(this.cache.size, this.capacity);
    }

    this.cache.set(key, entry);
  }

  /**
   * Invalidate a specific cache entry
   */
  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean up expired entries
   * Returns the number of entries removed
   */
  async cleanup(): Promise<number> {
    const now = new Date();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    capacity: number;
    utilizationPercent: number;
  } {
    const size = this.cache.size;
    return {
      size,
      capacity: this.capacity,
      utilizationPercent: (size / this.capacity) * 100,
    };
  }
}

// Global repository cache instance
let globalRepositoryCache: RepositoryCache | null = null;

/**
 * Get the global repository cache instance
 */
export function getRepositoryCache(): RepositoryCache {
  if (!globalRepositoryCache) {
    globalRepositoryCache = new RepositoryCache();
  }
  return globalRepositoryCache;
}

/**
 * Reset the global repository cache (useful for testing)
 */
export function resetRepositoryCache(): void {
  globalRepositoryCache = null;
}

// --- Legacy API for backward compatibility ---

export interface CachedRepository {
  repository: string;
  path: string;
  branch?: string;
  lastAccessed: Date;
}

/**
 * Legacy RepositoryCacheService for backward compatibility
 * Used by repo-clone tool and tests
 */
export class RepositoryCacheService {
  private entries: Map<string, CachedRepository> = new Map();
  private readonly cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  private makeKey(repository: string, branch?: string): string {
    return branch ? `${repository}#${branch}` : repository;
  }

  get(repository: string, branch?: string): CachedRepository | undefined {
    const key = this.makeKey(repository, branch);
    const entry = this.entries.get(key);
    if (entry) {
      entry.lastAccessed = new Date();
    }
    return entry;
  }

  set(repository: string, localPath: string, branch?: string): void {
    const key = this.makeKey(repository, branch);
    this.entries.set(key, {
      repository,
      path: localPath,
      branch,
      lastAccessed: new Date(),
    });
  }

  getCachePath(repository: string, branch?: string): string {
    const safeName = repository.replace(/[^a-zA-Z0-9]/g, '_');
    const branchSuffix = branch ? `_${branch}` : '';
    return `${this.cacheDir}/repos/${safeName}${branchSuffix}`;
  }

  getAll(): CachedRepository[] {
    return Array.from(this.entries.values());
  }

  clear(): void {
    this.entries.clear();
  }
}

// Global legacy cache service instance
let globalRepositoryCacheService: RepositoryCacheService | null = null;

/**
 * Initialize the legacy repository cache service
 */
export function initRepositoryCache(cacheDir: string): RepositoryCacheService {
  globalRepositoryCacheService = new RepositoryCacheService(cacheDir);
  return globalRepositoryCacheService;
}

/**
 * Get the legacy repository cache service instance
 */
export function getRepositoryCacheService(): RepositoryCacheService | null {
  return globalRepositoryCacheService;
}
