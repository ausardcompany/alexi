/**
 * Provider Index - SAP AI SDK Orchestration Only
 *
 * This module exports the SapOrchestrationProvider as the sole provider
 * for all LLM operations through SAP AI Core.
 */

import path from 'path';
import { ProviderModelFellBack } from '../bus/index.js';

// Integrate new SDK changes from upstream
import { env } from '../config/env.js';
import { loadRoutingConfig } from '../config/routingConfig.js';
import { getConfigDefaultModel } from '../config/userConfig.js';
import { installHarvestedCAs } from './ca.js';
import { isOrchestrationModel, SapOrchestrationProvider } from './sapOrchestration.js';
import { refreshModelCatalog } from './modelCatalog.js';

// Auto-harvest CAs from the OS trust store and merge them into the HTTPS
// global agent so provider requests transparently trust internal corporate
// CAs. Safe to call at module load: fast on Linux (single file read),
// cached on macOS, and no-op when `ALEXI_DISABLE_CA_HARVEST=1`. See
// docs/PROVIDERS.md#auto-ca-harvesting.
installHarvestedCAs();

// Kick off a background refresh of the live model catalog from SAP AI Core.
// Fire-and-forget: the static ORCHESTRATION_MODELS list remains available
// immediately; the catalog upgrades itself once the API responds.
// AICORE_SERVICE_KEY must be set for this to succeed; silently skipped
// when credentials are absent (the catalog falls back to static data).
if (env('AICORE_SERVICE_KEY')) {
  const resourceGroup = env('AICORE_RESOURCE_GROUP') ?? 'default';
  void refreshModelCatalog(resourceGroup);
}

// Re-export connectivity check
export { checkConnectivity, type ConnectivityResult } from './connectivity.js';

// Re-export model-fetch error surfacing (issue #1824).
export {
  ModelFetchError,
  classifyFetchError,
  fetchWithRetry,
  type FetchErrorClass,
  type FetchRetryOptions,
} from './modelFetchErrors.js';
export {
  fetchDeploymentCatalog,
  type DeploymentFetchResult,
  type RefreshCatalogOptions,
} from './modelCatalog.js';

// Re-export CA harvesting API for advanced consumers / diagnostics.
export {
  detectPlatform,
  isDisabled as isCaHarvestDisabled,
  extractPemBlocks,
  harvestLinuxCAs,
  harvestMacosCAs,
  harvestCAs,
  getHarvestedCAs,
  readNodeExtraCACerts,
  installHarvestedCAs,
  LINUX_CA_BUNDLE_PATHS,
  MACOS_KEYCHAINS,
  type CaPlatform,
  type HarvestOptions,
  type InstallOptions,
  type InstallResult,
} from './ca.js';

// Re-export auth errors
export { StartupTimeoutError } from './auth.js';

// Re-export image response transforms (issue #1389)
export { extractImageChunk, extractImageChunks, type NormalizedImageChunk } from './transform.js';

// Re-export auxiliary-task model selection (kilocode `1e73d3862` +
// opencode provider.ts +14/-3). See `./model-selection.ts` for the full
// rationale — auxiliary tasks (title, summary, compaction) must not fall
// back to a cheap model that isn't provisioned in the operator's SAP AI
// Core deployment.
export {
  selectModelForTask,
  buildContext as buildProviderContext,
  resolveSmallModelDeployment,
  getModel as getModelRef,
  getAuxiliaryModelId,
  type TaskKind,
  type ProviderContext,
  type GetModelOptions,
  type ModelRef,
} from './model-selection.js';

// Re-export everything from sapOrchestration
export {
  SapOrchestrationProvider,
  SapOrchestrationEmbeddings,
  createSapOrchestrationProvider,
  createSapOrchestrationEmbeddings,
  createTool,
  createToolResponse,
  isOrchestrationModel,
  InvalidModelError,
  FreeTierRateLimitError,
  FREE_TIER_RATE_LIMIT_CODE,
  ProviderRateLimitError,
  PROVIDER_RATE_LIMIT_CODE,
  SAP_AI_CORE_RATE_LIMIT_DOCS_URL,
  isFreeModel,
  hasFreeTierErrorSignal,
  classifyRateLimitError,
  extractRetryAfterSeconds,
  parseRetryAfterHeader,
  extractRateLimitReset,
  extractRateLimitLimit,
  parseRateLimitResetHeader,
  type RateLimitDetails,
  ORCHESTRATION_MODELS,
  ORCHESTRATION_MODEL_METADATA,
  modelHasCapability,
  type ModelCapability,
  type ModelHasCapabilityOptions,
  type OrchestrationModelMetadata,
  type OrchestrationModel,
  type OrchestrationConfig,
  type CompletionOptions,
  type CompletionResult,
  type StreamChunk,
  type TokenUsage,
  type ToolCallChunk,
  type FilteringConfig,
  type MaskingConfig,
  type GroundingConfig,
  type TranslationConfig,
  type EmbeddingOptions,
  type EmbeddingResult,
  type ChatCompletionTool,
  type FunctionObject,
  type MessageToolCall,
  type ToolChatMessage,
  type ChatMessage,
  ImageGenerationNotSupportedError,
  type ImageGenerationParams,
  type ImageGenerationImage,
  type ImageGenerationResult,
} from './sapOrchestration.js';

/**
 * Project-scoped provider cache.
 *
 * Keyed by `<resolved-project-path>::<modelId>::<resourceGroup>` so that
 * switching worktrees (e.g. via Agent Manager) does NOT reuse a provider
 * instantiated against a different project's credentials or resource
 * group. Prior to this cache, `getProviderForModel` allocated a brand
 * new `SapOrchestrationProvider` on every call — which was safe but
 * expensive — and any future memoisation without project scoping would
 * silently leak worktree A's credentials into worktree B.
 *
 * The map is keyed by the resolved project path so callers do not need
 * to normalize `cwd` themselves; `path.resolve()` handles `.`, `..`, and
 * trailing separators. On Windows the path is lowercased before hashing
 * to mirror filesystem case-insensitivity.
 *
 * See issue #1834.
 */
const providerCache = new Map<string, SapOrchestrationProvider>();

/**
 * Normalize a project path to a stable cache key segment. Mirrors
 * `normalizeWorkdir` in `sessionManager.ts` — kept local to avoid an
 * import cycle.
 */
function normalizeProjectPath(p: string): string {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

/**
 * Compose the composite cache key. The resource group is part of the
 * key because two projects sharing a `cwd` but with different
 * `AICORE_RESOURCE_GROUP` values (e.g. via a `.env`-driven override)
 * must not collide.
 */
function providerCacheKey(
  projectPath: string,
  modelId: string,
  resourceGroup: string | undefined
): string {
  return `${normalizeProjectPath(projectPath)}::${modelId}::${resourceGroup ?? ''}`;
}

/**
 * Get the SAP Orchestration provider for the specified model
 *
 * The returned instance is cached per (project path, modelId,
 * resourceGroup) tuple. When callers switch projects (Agent Manager
 * worktree switch) they must invoke {@link clearProviderCache} — either
 * globally, or for the outgoing project only — so a subsequent lookup
 * rebuilds the provider against the new project's environment.
 *
 * @param modelId - The model identifier (e.g., 'gpt-4o', 'anthropic--claude-3.7-sonnet')
 * @param projectPath - Optional project path override (defaults to `process.cwd()`)
 * @returns SapOrchestrationProvider instance configured for the model
 */
export function getProviderForModel(
  modelId: string,
  projectPath?: string
): SapOrchestrationProvider {
  const resourceGroup = env('AICORE_RESOURCE_GROUP');
  const scope = projectPath ?? process.cwd();
  const key = providerCacheKey(scope, modelId, resourceGroup);

  const cached = providerCache.get(key);
  if (cached) {
    return cached;
  }

  const provider = new SapOrchestrationProvider({
    modelName: modelId,
    resourceGroup: resourceGroup || undefined,
  });
  providerCache.set(key, provider);
  return provider;
}

/**
 * Clear the project-scoped provider cache.
 *
 * When `projectPath` is provided, only entries keyed to that project
 * are dropped — this is the surgical path used by Agent Manager on
 * worktree switch so that background worktrees keep their warm
 * providers. When called without arguments the entire cache is
 * flushed; that path is used by tests and by explicit "reload
 * everything" operator commands.
 *
 * Safe to call when the cache is empty. Never throws.
 */
export function clearProviderCache(projectPath?: string): void {
  if (projectPath === undefined) {
    providerCache.clear();
    return;
  }
  const scope = normalizeProjectPath(projectPath);
  const prefix = `${scope}::`;
  for (const key of Array.from(providerCache.keys())) {
    if (key.startsWith(prefix)) {
      providerCache.delete(key);
    }
  }
}

/**
 * Diagnostic hook: number of provider instances currently cached.
 *
 * Exposed for tests and for future observability. Not part of a
 * stable public API — do not rely on this from production code.
 *
 * @internal
 */
export function _providerCacheSize(): number {
  return providerCache.size;
}

/**
 * Result of a fallback-aware provider resolution.
 */
export interface ProviderResolution {
  provider: SapOrchestrationProvider;
  effectiveModelId: string;
  usedFallback: boolean;
}

/**
 * Module-level dedup set so the "primary model not recognized" warning
 * fires at most once per (badModelId, processLifetime) pair.
 *
 * Mirrors the dedup pattern used elsewhere for one-time startup notices.
 */
const warnedFor = new Set<string>();

/**
 * Resolve the fallback model id.
 *
 * Resolution order (first non-empty wins):
 *   1. Explicit `fallbackModel` argument
 *   2. `routingConfig.preferences.fallbackModel`
 *   3. Hardcoded 'gpt-4o'
 */
function resolveFallbackModelId(fallbackModel?: string): string {
  if (fallbackModel && fallbackModel.trim().length > 0) {
    return fallbackModel.trim();
  }

  try {
    const cfg = loadRoutingConfig();
    const fromConfig = cfg.preferences?.fallbackModel;
    if (fromConfig && fromConfig.trim().length > 0) {
      return fromConfig.trim();
    }
  } catch {
    // Routing config failed to load — fall through to hardcoded default
  }

  return 'gpt-4o';
}

/**
 * Get the SAP Orchestration provider for the specified model, automatically
 * falling back to the configured `fallbackModel` if the primary id is not
 * recognized.
 *
 * If `modelId` is unknown, a `ProviderModelFellBack` event is published on the
 * application bus (deduplicated per bad-model-id for the process lifetime) and
 * a provider is built for the fallback id instead. The TUI subscribes to this
 * event to surface a one-line status banner; non-TUI callers (e.g. the
 * `alexi chat -m ...` one-shot path) print a stderr warning. This mirrors
 * Claude Code v2.1.152 behavior so a misconfigured `AICORE_MODEL` (typo,
 * renamed deployment id, etc.) is visible at first turn instead of silently
 * masquerading as a working configuration.
 *
 * `getProviderForModel` remains the low-level primitive that does no
 * validation; this helper is the recommended entry point for chat pipelines.
 *
 * @param modelId - The configured/primary model identifier
 * @param fallbackModel - Optional explicit fallback override
 * @returns The provider, the model id actually used, and whether fallback fired
 */
export function getProviderForModelWithFallback(
  modelId: string,
  fallbackModel?: string,
  projectPath?: string
): ProviderResolution {
  if (isOrchestrationModel(modelId)) {
    return {
      provider: getProviderForModel(modelId, projectPath),
      effectiveModelId: modelId,
      usedFallback: false,
    };
  }

  const fallbackId = resolveFallbackModelId(fallbackModel);

  if (!warnedFor.has(modelId)) {
    warnedFor.add(modelId);
    ProviderModelFellBack.publish({
      requestedModel: modelId,
      effectiveModel: fallbackId,
      timestamp: Date.now(),
    });
  }

  return {
    provider: getProviderForModel(fallbackId, projectPath),
    effectiveModelId: fallbackId,
    usedFallback: true,
  };
}

/**
 * Test-only hook: clear the dedup cache so each unit test starts from
 * a clean slate. Not part of the public surface.
 *
 * @internal
 */
export function _resetFallbackWarningCache(): void {
  warnedFor.clear();
}

/**
 * Get the default model.
 *
 * Resolution order (first non-empty wins):
 *   1. AICORE_MODEL environment variable  (explicit env always wins)
 *   2. defaultModel in ~/.alexi/config.json (persistent user preference)
 *   3. Hardcoded 'gpt-4o' fallback
 */
export function getDefaultModel(): string {
  return env('AICORE_MODEL') ?? getConfigDefaultModel() ?? 'gpt-4o';
}
