/**
 * Provider Index - SAP AI SDK Orchestration Only
 *
 * This module exports the SapOrchestrationProvider as the sole provider
 * for all LLM operations through SAP AI Core.
 */

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

// Re-export model-fetch error surfacing (issue #1824 + #1851).
export {
  ModelFetchError,
  classifyFetchError,
  fetchWithRetry,
  formatCatalogErrorHint,
  hintForErrorMessage,
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

// Re-export prompt-cache error detection + fallback helpers (issue #1930).
export {
  isCacheError,
  stripOpenAICacheBreakpoints,
  stripAnthropicCacheControl,
  withCacheFallback,
  type AnthropicMessage,
  type AnthropicContentBlock,
  type CacheFallbackOptions,
} from './cache-error.js';

// Re-export BYOK Langfuse telemetry (direct exporter, opt-in via
// ALEXI_LANGFUSE_ALL_PROVIDERS=1). See src/providers/langfuse-telemetry.ts
// for the full contract (merge rules, env parsing, security boundary).
export {
  resolveAiSdkTelemetry,
  readEnvTraceAttributes,
  readDirectLangfuseTelemetryConfig,
  withLangfuseTraceAttributes,
  startLangfuseTrace,
  startLangfuseGeneration,
  finishLangfuseGeneration,
  failLangfuseGeneration,
  isEnvTruthy,
  LANGFUSE_SDK_INTEGRATION,
  LANGFUSE_ALL_PROVIDERS_ENV,
  LANGFUSE_TAGS_ENV,
  LANGFUSE_METADATA_ENV,
  LANGFUSE_ENVIRONMENT_ENV,
  LANGFUSE_BASE_URL_ENV,
  LANGFUSE_PUBLIC_KEY_ENV,
  LANGFUSE_SECRET_KEY_ENV,
  type AiSdkTelemetryDecision,
  type DirectLangfuseTelemetryConfig,
  type LangfuseTraceAttributes,
} from './langfuse-telemetry.js';

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
 * Get the SAP Orchestration provider for the specified model
 *
 * @param modelId - The model identifier (e.g., 'gpt-4o', 'anthropic--claude-3.7-sonnet')
 * @returns SapOrchestrationProvider instance configured for the model
 */
export function getProviderForModel(modelId: string): SapOrchestrationProvider {
  const resourceGroup = env('AICORE_RESOURCE_GROUP');

  return new SapOrchestrationProvider({
    modelName: modelId,
    resourceGroup: resourceGroup || undefined,
  });
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
  fallbackModel?: string
): ProviderResolution {
  if (isOrchestrationModel(modelId)) {
    return {
      provider: getProviderForModel(modelId),
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
    provider: getProviderForModel(fallbackId),
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

// ============================================================================
// Provider-specific content-policy detection (issue #2134)
// ============================================================================
//
// Each provider family surfaces moderation / safety filter blocks with a
// slightly different shape; these thin wrappers isolate the structural
// pattern per provider so callers do not have to re-derive it. The
// generic cross-provider check `isContentPolicyError` from
// `src/core/error-backoff.ts` already consumes all of these shapes — the
// helpers below exist for telemetry/logging paths that want to attribute
// a block to a specific provider.

/**
 * Return true when `err` looks like an OpenAI moderation / content-policy
 * rejection. Shapes covered:
 *   - `{ error: { type: 'moderation' } }` (moderation API).
 *   - `{ error: { code: 'content_policy_violation' } }`.
 *   - HTTP 451 (OpenAI reuses this for content-blocked requests).
 *
 * See upstream opencode PR #58544 for the original image-moderation case.
 */
export function isOpenAIContentPolicyError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as {
    status?: unknown;
    statusCode?: unknown;
    error?: unknown;
  };
  const status =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : undefined;
  if (status === 451) {
    return true;
  }
  if (candidate.error && typeof candidate.error === 'object') {
    const nested = candidate.error as { type?: unknown; code?: unknown };
    if (nested.type === 'moderation' || nested.code === 'content_policy_violation') {
      return true;
    }
  }
  return false;
}

/**
 * Return true when `err` looks like a Google (Gemini / Vertex) safety
 * filter rejection. Shapes covered:
 *   - `{ finishReason: 'SAFETY' }` on a generation response surfaced as
 *     an error by the caller.
 *   - `{ promptFeedback: { blockReason: 'SAFETY' } }` on a prompt-level
 *     block (the model never ran).
 */
export function isGoogleSafetyError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { finishReason?: unknown; promptFeedback?: unknown };
  if (candidate.finishReason === 'SAFETY') {
    return true;
  }
  if (candidate.promptFeedback && typeof candidate.promptFeedback === 'object') {
    const blockReason = (candidate.promptFeedback as { blockReason?: unknown }).blockReason;
    if (blockReason === 'SAFETY') {
      return true;
    }
  }
  return false;
}

/**
 * Return true when `err` looks like an Anthropic content-policy block.
 * Shapes covered:
 *   - `{ error_type: 'content_policy' }` (older SDK envelope).
 *   - `{ type: 'invalid_request_error', message: '... content policy ...' }`.
 */
export function isAnthropicContentPolicyError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { error_type?: unknown; type?: unknown; message?: unknown };
  if (candidate.error_type === 'content_policy') {
    return true;
  }
  if (
    candidate.type === 'invalid_request_error' &&
    typeof candidate.message === 'string' &&
    /content[_\s-]policy/i.test(candidate.message)
  ) {
    return true;
  }
  return false;
}

// Re-export the cross-provider helper so callers importing from this
// module (the canonical providers surface) get a single entry point.
export {
  isContentPolicyError,
  classifyError,
  type ErrorClassification,
  type ErrorType,
} from '../core/error-backoff.js';

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
