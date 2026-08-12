/**
 * Reference Module - External repository reference management
 */

export {
  ReferenceService,
  initReferenceService,
  getReferenceService,
  type ReferenceEntry,
  type ResolvedReference,
  type ReferenceConfig,
} from './reference.js';

export {
  RepositoryCacheService,
  initRepositoryCache,
  getRepositoryCache,
  canonicalizeRepoPath,
  type CachedRepository,
  RepositoryCache,
} from './repository-cache.js';
