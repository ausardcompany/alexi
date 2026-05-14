/**
 * Provider Index - SAP AI SDK Orchestration Only
 *
 * This module exports the SapOrchestrationProvider as the sole provider
 * for all LLM operations through SAP AI Core.
 */

import { env } from '../config/env.js';
import { getConfigDefaultModel } from '../config/userConfig.js';
import { SapOrchestrationProvider } from './sapOrchestration.js';

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

// Re-export model discovery module
export {
  discoverModels,
  fetchModelsFromAICore,
  getAvailableModelIds,
  getStaticModels,
  mergeWithStaticModels,
  clearModelDiscoveryCache,
  type DiscoveredModel,
  type ModelDiscoveryOptions,
} from './modelDiscovery.js';

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

/**
 * Check if a model is available (async version using dynamic discovery).
 *
 * Unlike the synchronous `isOrchestrationModel` which checks only the static list,
 * this function queries the discovery cache (and potentially SAP AI Core) to
 * determine if a model is available.
 *
 * @param modelId - The model identifier to check
 * @returns true if the model is available (discovered or static)
 */
export async function isModelAvailable(modelId: string): Promise<boolean> {
  const { getAvailableModelIds } = await import('./modelDiscovery.js');
  const ids = await getAvailableModelIds();
  return ids.includes(modelId);
}
