/**
 * Dynamic Model Discovery from SAP AI Core
 *
 * Fetches available models from SAP AI Core deployments and caches
 * results with a configurable TTL. Falls back to the static model
 * list when the API is unavailable.
 */

import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { env } from '../config/env.js';
import { ORCHESTRATION_MODELS } from './sapOrchestration.js';

// ============================================================================
// Types
// ============================================================================

export interface DiscoveredModel {
  /** The model identifier (e.g., 'gpt-4o', 'anthropic--claude-4.5-sonnet') */
  id: string;
  /** Whether this model came from dynamic discovery or the static list */
  source: 'discovered' | 'static';
  /** Deployment status (only for discovered models) */
  status?: string;
}

export interface ModelDiscoveryOptions {
  /** Resource group to query (default: from AICORE_RESOURCE_GROUP or 'default') */
  resourceGroup?: string;
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTtlMs?: number;
  /** Timeout for the API call in milliseconds (default: 10 seconds) */
  timeoutMs?: number;
}

interface CacheEntry {
  models: DiscoveredModel[];
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_TIMEOUT_MS = 10_000; // 10 seconds
const FOUNDATION_MODELS_SCENARIO = 'foundation-models';

// ============================================================================
// Cache
// ============================================================================

let modelCache: CacheEntry | null = null;

/**
 * Clear the model discovery cache. Useful for testing or forcing a refresh.
 */
export function clearModelDiscoveryCache(): void {
  modelCache = null;
}

/**
 * Check if the cache is still valid.
 */
function isCacheValid(cacheTtlMs: number): boolean {
  if (!modelCache) {
    return false;
  }
  return Date.now() - modelCache.timestamp < cacheTtlMs;
}

// ============================================================================
// Core Discovery
// ============================================================================

/**
 * Extract model name from a deployment's configuration name.
 *
 * SAP AI Core deployments for foundation models typically use the model name
 * as the configuration name (e.g., 'gpt-4o', 'anthropic--claude-4.5-sonnet').
 */
function extractModelName(configurationName: string | undefined): string | undefined {
  if (!configurationName || configurationName === 'N/A') {
    return undefined;
  }
  return configurationName.trim();
}

/**
 * Fetch available models from SAP AI Core deployment API.
 *
 * Queries only RUNNING deployments with the 'foundation-models' scenario
 * to find actively available models.
 *
 * @param options - Discovery options
 * @returns Array of discovered model identifiers
 * @throws When AICORE_SERVICE_KEY is not configured
 */
export async function fetchModelsFromAICore(
  options: ModelDiscoveryOptions = {}
): Promise<DiscoveredModel[]> {
  const resourceGroup = options.resourceGroup ?? env('AICORE_RESOURCE_GROUP') ?? 'default';
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // Verify credentials are available
  const serviceKey = env('AICORE_SERVICE_KEY');
  if (!serviceKey) {
    throw new Error(
      'AICORE_SERVICE_KEY is not configured. Cannot discover models from SAP AI Core.'
    );
  }

  // Query running deployments for foundation models
  const response = await Promise.race([
    DeploymentApi.deploymentQuery(
      { scenarioId: FOUNDATION_MODELS_SCENARIO, status: 'RUNNING' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute(),
    new Promise<never>((_resolve, reject) =>
      setTimeout(() => reject(new Error('Model discovery request timed out')), timeoutMs)
    ),
  ]);

  const deployments = response.resources || [];
  const models: DiscoveredModel[] = [];
  const seen = new Set<string>();

  for (const deployment of deployments) {
    const modelName = extractModelName(deployment.configurationName);
    if (modelName && !seen.has(modelName)) {
      seen.add(modelName);
      models.push({
        id: modelName,
        source: 'discovered',
        status: deployment.status,
      });
    }
  }

  return models;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Discover available models from SAP AI Core with caching and fallback.
 *
 * Resolution strategy:
 * 1. Return cached results if still valid
 * 2. Try to fetch from SAP AI Core deployment API
 * 3. Merge discovered models with the static model list (static models are
 *    always included to ensure baseline availability)
 * 4. On failure, fall back to the static model list only
 *
 * @param options - Discovery options
 * @returns Combined list of available models (discovered + static)
 */
export async function discoverModels(
  options: ModelDiscoveryOptions = {}
): Promise<DiscoveredModel[]> {
  const cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;

  // Return cached results if valid
  if (isCacheValid(cacheTtlMs) && modelCache) {
    return modelCache.models;
  }

  try {
    const discoveredModels = await fetchModelsFromAICore(options);

    // Merge with static list: discovered models first, then static-only models
    const merged = mergeWithStaticModels(discoveredModels);

    // Update cache
    modelCache = {
      models: merged,
      timestamp: Date.now(),
    };

    return merged;
  } catch {
    // On any failure, fall back to static model list
    const staticModels = getStaticModels();

    // Cache the fallback with a shorter TTL (1 minute) to retry sooner
    modelCache = {
      models: staticModels,
      timestamp: Date.now() - cacheTtlMs + 60_000, // Expire in 1 minute
    };

    return staticModels;
  }
}

/**
 * Get the static model list as DiscoveredModel objects.
 */
export function getStaticModels(): DiscoveredModel[] {
  return ORCHESTRATION_MODELS.map((id) => ({
    id,
    source: 'static' as const,
  }));
}

/**
 * Merge discovered models with static models.
 * Discovered models take priority; static models not found in discovery
 * are appended at the end.
 */
export function mergeWithStaticModels(discoveredModels: DiscoveredModel[]): DiscoveredModel[] {
  const merged: DiscoveredModel[] = [...discoveredModels];
  const discoveredIds = new Set(discoveredModels.map((m) => m.id));

  // Add static models not already discovered
  for (const staticId of ORCHESTRATION_MODELS) {
    if (!discoveredIds.has(staticId)) {
      merged.push({
        id: staticId,
        source: 'static',
      });
    }
  }

  return merged;
}

/**
 * Get just the model IDs from discovery (convenience method).
 * Useful for validation checks like isOrchestrationModel.
 *
 * @param options - Discovery options
 * @returns Array of model ID strings
 */
export async function getAvailableModelIds(options: ModelDiscoveryOptions = {}): Promise<string[]> {
  const models = await discoverModels(options);
  return models.map((m) => m.id);
}
