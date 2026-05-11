/**
 * Repository Cache Service - Manages cloned reference repositories
 *
 * This service prevents redundant cloning operations and provides
 * a consistent interface for accessing external code repositories.
 */

import * as path from 'path';
import * as crypto from 'crypto';

export interface CachedRepository {
  path: string;
  repository: string;
  branch?: string;
  lastAccessed: Date;
}

/**
 * Repository Cache Service for managing cloned repositories
 */
export class RepositoryCacheService {
  private cache = new Map<string, CachedRepository>();
  private cacheDir: string;

  constructor(cacheDir: string) {
    this.cacheDir = cacheDir;
  }

  /**
   * Generate a cache key for a repository
   */
  private getCacheKey(repository: string, branch?: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(repository);
    if (branch) {
      hash.update(branch);
    }
    return hash.digest('hex').slice(0, 12);
  }

  /**
   * Get a cached repository
   */
  get(repository: string, branch?: string): CachedRepository | undefined {
    const key = this.getCacheKey(repository, branch);
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccessed = new Date();
    }
    return entry;
  }

  /**
   * Set a cached repository
   */
  set(repository: string, localPath: string, branch?: string): void {
    const key = this.getCacheKey(repository, branch);
    this.cache.set(key, {
      path: localPath,
      repository,
      branch,
      lastAccessed: new Date(),
    });
  }

  /**
   * Get the cache path for a repository
   */
  getCachePath(repository: string, branch?: string): string {
    const key = this.getCacheKey(repository, branch);
    return path.join(this.cacheDir, 'repos', key);
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cached repositories
   */
  getAll(): CachedRepository[] {
    return Array.from(this.cache.values());
  }
}

// Global repository cache instance
let globalRepositoryCache: RepositoryCacheService | null = null;

/**
 * Initialize the global repository cache
 */
export function initRepositoryCache(cacheDir: string): RepositoryCacheService {
  globalRepositoryCache = new RepositoryCacheService(cacheDir);
  return globalRepositoryCache;
}

/**
 * Get the global repository cache instance
 */
export function getRepositoryCache(): RepositoryCacheService | null {
  return globalRepositoryCache;
}
