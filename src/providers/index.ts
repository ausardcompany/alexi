/**
 * Provider Index - SAP AI SDK Orchestration Only
 *
 * This module exports the SapOrchestrationProvider as the sole provider
 * for all LLM operations through SAP AI Core.
 */

import { ProviderModelFellBack } from '../bus/index.js';
import { env } from '../config/env.js';
import { loadRoutingConfig } from '../config/routingConfig.js';
import { getConfigDefaultModel } from '../config/userConfig.js';
import { isOrchestrationModel, SapOrchestrationProvider } from './sapOrchestration.js';

// Re-export connectivity check
export { checkConnectivity, type ConnectivityResult } from './connectivity.js';

// Re-export auth errors
export { StartupTimeoutError } from './auth.js';

// Re-export everything from sapOrchestration
export {
  SapOrchestrationProvider,
  SapOrchestrationEmbeddings,
  createSapOrchestrationProvider,
  createSapOrchestrationEmbeddings,
  createTool,
  createToolResponse,
  isOrchestrationModel,
  ORCHESTRATION_MODELS,
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
