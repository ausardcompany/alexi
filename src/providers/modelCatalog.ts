/**
 * Dynamic Model Catalog
 *
 * Fetches the list of available deployments from SAP AI Core at startup and
 * caches the result with a configurable TTL (default 5 min). Falls back to
 * the static ORCHESTRATION_MODELS catalog when the API is unreachable.
 *
 * Architecture:
 *   - `refreshModelCatalog()` — called once at provider init (fire-and-forget)
 *   - `getAvailableModels()` — sync, returns the current cached list
 *   - `isAvailableModel(id)` — sync guard used by router and provider validation
 *   - `getCatalogStatus()` — for the TUI status indicator
 *
 * The catalog never blocks startup: all callers see the static list until the
 * first refresh completes. A background refresh fires automatically every
 * CATALOG_TTL_MS to stay fresh during long sessions.
 */

import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import {
  ORCHESTRATION_MODELS,
  ORCHESTRATION_MODEL_METADATA,
  type OrchestrationModelMetadata,
} from './sapOrchestration.js';

// ============================================================================
// Constants
// ============================================================================

/** Re-fetch interval (ms). Default 5 minutes. */
const CATALOG_TTL_MS = 5 * 60 * 1_000;

/**
 * Provider prefix patterns used to identify LLM deployments inside AI Core.
 * Deployments whose configurationName matches one of these prefixes are
 * treated as model ids that Alexi can route to.
 */
const MODEL_ID_PREFIXES = [
  'gpt-',
  'anthropic--',
  'gemini-',
  'amazon--',
  'mistralai--',
  'meta--',
  'deepseek-',
  'sap-',
];

// ============================================================================
// Types
// ============================================================================

export type CatalogStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface CatalogEntry {
  /** Model id as used in OrchestrationConfig.modelName */
  id: string;
  /** Deployment id in SAP AI Core (the concrete binding) */
  deploymentId?: string;
  /** Source of the entry */
  source: 'static' | 'live' | 'both';
  /** Whether the live deployment is currently RUNNING */
  live: boolean;
  /** Capabilities and metadata (from static catalog when known) */
  metadata?: OrchestrationModelMetadata;
}

export interface CatalogState {
  status: CatalogStatus;
  entries: readonly CatalogEntry[];
  lastRefreshedAt: number | null;
  errorMessage?: string;
  /** Resource group used for the last successful fetch */
  resourceGroup?: string;
}

// ============================================================================
// Internal state
// ============================================================================

let _state: CatalogState = {
  status: 'idle',
  entries: buildStaticEntries(),
  lastRefreshedAt: null,
};

let _refreshTimer: ReturnType<typeof setTimeout> | null = null;
let _refreshInProgress = false;

/** Listeners notified on every state change. */
const _listeners = new Set<() => void>();

// ============================================================================
// Static seed
// ============================================================================

function buildStaticEntries(): CatalogEntry[] {
  return ORCHESTRATION_MODELS.map((id) => ({
    id,
    source: 'static' as const,
    live: false,
    metadata: (ORCHESTRATION_MODEL_METADATA as Record<string, OrchestrationModelMetadata>)[id],
  }));
}

// ============================================================================
// Deployment → model id extraction
// ============================================================================

/**
 * Try to derive a model id from a SAP AI Core deployment record.
 *
 * Resolution order:
 *   1. `configurationName` is already in the static ORCHESTRATION_MODELS list
 *   2. `configurationName` starts with a known provider prefix
 *   3. Return null (deployment ignored — not an LLM we can route to)
 */
function extractModelId(configurationName: string | undefined): string | null {
  if (!configurationName) return null;
  const name = configurationName.trim();
  // Exact match in static catalog
  if ((ORCHESTRATION_MODELS as readonly string[]).includes(name)) return name;
  // Prefix-based heuristic
  for (const prefix of MODEL_ID_PREFIXES) {
    if (name.toLowerCase().startsWith(prefix)) return name;
  }
  return null;
}

// ============================================================================
// Core refresh logic
// ============================================================================

/**
 * Perform a single fetch from SAP AI Core and merge results with the static
 * catalog. Idempotent — safe to call concurrently (second call is a no-op
 * while one is in flight).
 */
export async function refreshModelCatalog(resourceGroup = 'default'): Promise<void> {
  if (_refreshInProgress) return;
  _refreshInProgress = true;

  setState({ status: 'loading' });

  try {
    const response = await DeploymentApi.deploymentQuery(
      { status: 'RUNNING' },
      { 'AI-Resource-Group': resourceGroup }
    ).execute();

    const liveDeployments = response.resources ?? [];

    // Build a map: modelId → deploymentId for live entries
    const liveMap = new Map<string, string>();
    for (const d of liveDeployments) {
      const modelId = extractModelId(d.configurationName);
      if (modelId) {
        // If multiple deployments map to the same model id, keep the first one.
        if (!liveMap.has(modelId)) {
          liveMap.set(modelId, d.id);
        }
      }
    }

    // Merge: static entries updated with live info + purely live entries added
    const staticIds = new Set(ORCHESTRATION_MODELS as readonly string[]);
    const entries: CatalogEntry[] = [];

    // 1. All static entries, marking which ones are live
    for (const id of ORCHESTRATION_MODELS) {
      entries.push({
        id,
        deploymentId: liveMap.get(id),
        source: liveMap.has(id) ? 'both' : 'static',
        live: liveMap.has(id),
        metadata: (ORCHESTRATION_MODEL_METADATA as Record<string, OrchestrationModelMetadata>)[id],
      });
    }

    // 2. Purely live models not in the static catalog (e.g. new SAP releases)
    for (const [modelId, deploymentId] of liveMap) {
      if (!staticIds.has(modelId)) {
        entries.push({
          id: modelId,
          deploymentId,
          source: 'live',
          live: true,
          metadata: undefined,
        });
      }
    }

    setState({
      status: 'ready',
      entries,
      lastRefreshedAt: Date.now(),
      resourceGroup,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Keep existing entries (static or previous live), just mark as error
    setState({
      status: 'error',
      errorMessage: msg,
    });
  } finally {
    _refreshInProgress = false;
  }

  // Schedule next background refresh
  scheduleNextRefresh(resourceGroup);
}

function scheduleNextRefresh(resourceGroup: string): void {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  _refreshTimer = setTimeout(() => {
    void refreshModelCatalog(resourceGroup);
  }, CATALOG_TTL_MS);
  // Don't prevent Node from exiting if the process is idle
  if (_refreshTimer.unref) _refreshTimer.unref();
}

function setState(patch: Partial<CatalogState>): void {
  _state = { ..._state, ...patch };
  for (const fn of _listeners) fn();
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Subscribe to catalog state changes. Returns an unsubscribe function.
 *
 * Used by the TUI to react to the loading → ready transition and refresh
 * the ModelPicker list without a full re-mount.
 */
export function subscribeCatalog(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Current state snapshot — cheap sync read. */
export function getCatalogState(): Readonly<CatalogState> {
  return _state;
}

/** Current status — cheap sync read for status bar indicators. */
export function getCatalogStatus(): CatalogStatus {
  return _state.status;
}

/**
 * All currently known model ids (static + any live models discovered).
 *
 * Always returns the static catalog until the first refresh completes, so
 * callers are never blocked. Live entries appear immediately when the refresh
 * succeeds.
 */
export function getAvailableModels(): readonly string[] {
  return _state.entries.map((e) => e.id);
}

/**
 * Only models confirmed as RUNNING in SAP AI Core.
 * Returns empty array before the first successful refresh.
 */
export function getLiveModels(): readonly string[] {
  return _state.entries.filter((e) => e.live).map((e) => e.id);
}

/**
 * All catalog entries with full metadata (source, live flag, deploymentId).
 * Useful for the TUI model picker to show ● live / ○ offline indicators.
 */
export function getCatalogEntries(): readonly CatalogEntry[] {
  return _state.entries;
}

/**
 * Check if a model id is known (either static or live).
 *
 * Replaces the old `isOrchestrationModel()` guard: first checks the live
 * catalog (if loaded), then falls back to the static list so validation
 * is never stricter than the hardcoded catalog.
 */
export function isAvailableModel(modelId: string): boolean {
  if (!modelId) return false;
  // Fast path: check the live-merged catalog
  for (const entry of _state.entries) {
    if (entry.id === modelId) return true;
  }
  // Fallback: static list in case catalog is still loading
  return (ORCHESTRATION_MODELS as readonly string[]).includes(modelId);
}

/**
 * Retrieve the metadata for a model (capabilities, etc.).
 * Returns the static metadata when available; undefined for purely live models.
 */
export function getModelMetadata(modelId: string): OrchestrationModelMetadata | undefined {
  const entry = _state.entries.find((e) => e.id === modelId);
  return entry?.metadata;
}

/**
 * Whether a live deployment is available for this model.
 * Useful to surface warnings like "model is in catalog but not deployed".
 */
export function isModelLive(modelId: string): boolean {
  const entry = _state.entries.find((e) => e.id === modelId);
  // If we haven't fetched yet, we can't know — treat as live (optimistic)
  if (!entry || _state.status === 'idle' || _state.status === 'loading') return true;
  return entry.live;
}

/**
 * Invalidate the cache immediately. Triggers a fresh fetch on the next
 * `refreshModelCatalog()` call. Useful for testing and after config changes.
 */
export function invalidateCatalog(): void {
  if (_refreshTimer) {
    clearTimeout(_refreshTimer);
    _refreshTimer = null;
  }
  _refreshInProgress = false;
  setState({
    status: 'idle',
    entries: buildStaticEntries(),
    lastRefreshedAt: null,
    errorMessage: undefined,
  });
}

// Export catalog TTL for tests
export { CATALOG_TTL_MS };
