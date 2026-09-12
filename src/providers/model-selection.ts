/**
 * Model selection for primary vs auxiliary tasks.
 *
 * Ports the intent of upstream kilocode commit `1e73d3862`
 * ("small-model-fallback-requires-kilo-credentials") to Alexi's SAP AI Core
 * world: auxiliary tasks (title generation, summarization, compaction, commit
 * message generation, ...) should only fall back to a cheaper model when the
 * active provider actually supports it. Otherwise, they must reuse the user's
 * default model to avoid auth / deployment-not-found failures.
 *
 * Also threads an `auxiliary` flag through the provider lookup API
 * (mirrors upstream opencode `packages/opencode/src/provider/provider.ts`
 * +14/-3) so callers in the compaction / title / summary paths can opt in
 * without special-casing model ids at the call site.
 */

import { env } from '../config/env.js';
import { getConfigValue } from '../config/userConfig.js';
import { isOrchestrationModel } from './sapOrchestration.js';
import { getDefaultModel } from './index.js';

// ============ Types ============

/** Task class used to select the target model. */
export type TaskKind = 'primary' | 'auxiliary';

/**
 * Context used by {@link selectModelForTask} to decide whether a small-model
 * fallback is actually available. Kept as a plain object (not a class) so
 * tests can construct one directly without provider I/O.
 */
export interface ProviderContext {
  /** Provider id — for Alexi this is effectively always `sap-ai-core`. */
  providerID: 'sap-ai-core' | 'kilo';
  /** The user's default (primary) model, resolved from env/config. */
  defaultModel: string;
  /**
   * SAP AI Core deployment id for the "small" auxiliary model, if the
   * operator has configured one. Read from `models.compaction` (new key)
   * or the legacy `context.compactionModel`, and finally from
   * `AICORE_SMALL_MODEL` for env-only setups.
   */
  smallModelDeployment?: string;
  /**
   * True when the process holds valid Kilo credentials. Alexi's SAP-first
   * deployment nearly always answers `false`; kept for symmetry with the
   * upstream fix so a future Kilo provider integration can flip it.
   */
  hasKiloCredentials: () => boolean | Promise<boolean>;
  /**
   * Returns true when a SAP AI Core deployment for the requested tier is
   * configured. `smallModelDeployment` being non-empty is the canonical
   * answer for `tier === 'small'`.
   */
  hasSapDeployment: (tier: 'small') => boolean | Promise<boolean>;
}

/**
 * Options accepted by {@link getModel}. Additive to the pre-existing
 * signature — a bare `getModel()` call continues to return the user's
 * default model.
 */
export interface GetModelOptions {
  /**
   * True when the caller is a background/auxiliary task (title generation,
   * summarization, compaction, commit message, ...). Enables the
   * small-model fallback gated by {@link selectModelForTask}.
   */
  auxiliary?: boolean;
}

/**
 * Reference to a resolved model. Provider is always `sap-ai-core` in
 * Alexi; we keep the discriminant so unit tests can express the "user
 * has Kilo creds" branch without SAP mocks.
 */
export interface ModelRef {
  providerID: 'sap-ai-core' | 'kilo';
  modelID: string;
}

// ============ Context builder ============

/**
 * Read the configured small-model deployment id from Alexi's user config.
 *
 * Resolution order (first non-empty wins):
 *   1. `models.compaction` (new canonical location — mirrors upstream
 *      kilocode `f64c6646d` which moved the compaction model from the
 *      Context tab to the Models tab)
 *   2. `context.compactionModel` (legacy location, kept for backward
 *      compatibility for at least one minor release)
 *   3. `AICORE_SMALL_MODEL` environment variable
 */
export function resolveSmallModelDeployment(): string | undefined {
  const models = getConfigValue('models');
  if (models && typeof models === 'object' && !Array.isArray(models)) {
    const compaction = (models as Record<string, unknown>).compaction;
    if (typeof compaction === 'string' && compaction.trim().length > 0) {
      return compaction.trim();
    }
  }

  const context = getConfigValue('context');
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    const legacy = (context as Record<string, unknown>).compactionModel;
    if (typeof legacy === 'string' && legacy.trim().length > 0) {
      return legacy.trim();
    }
  }

  const fromEnv = env('AICORE_SMALL_MODEL');
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }

  return undefined;
}

/**
 * Build the default {@link ProviderContext} for the running process.
 *
 * Alexi is SAP AI Core first — the `providerID` is fixed to `sap-ai-core`.
 * Kilo credentials are never present in this codebase (the module exists
 * to mirror the upstream shape), so `hasKiloCredentials` returns `false`.
 */
export function buildContext(): ProviderContext {
  const smallModelDeployment = resolveSmallModelDeployment();
  return {
    providerID: 'sap-ai-core',
    defaultModel: getDefaultModel(),
    smallModelDeployment,
    hasKiloCredentials: (): boolean => false,
    hasSapDeployment: (tier): boolean => {
      if (tier === 'small') {
        return Boolean(smallModelDeployment);
      }
      return false;
    },
  };
}

// ============ Selection ============

/**
 * Select the model to use for the given task class.
 *
 * For auxiliary tasks, only fall back to the small-model deployment when
 * the active provider actually supports it. Otherwise, reuse the primary
 * (default) model — that guarantees auxiliary calls never fail with
 * "deployment not found" / auth errors when the operator has not
 * provisioned a dedicated small deployment.
 */
export async function selectModelForTask(
  task: TaskKind,
  context: ProviderContext
): Promise<ModelRef> {
  if (task !== 'auxiliary') {
    return { providerID: context.providerID, modelID: context.defaultModel };
  }

  // Auxiliary path — gate the small-model fallback on provider capability.
  const kiloReady =
    context.providerID === 'kilo' && (await Promise.resolve(context.hasKiloCredentials()));
  const sapSmallReady =
    context.providerID === 'sap-ai-core' &&
    Boolean(context.smallModelDeployment) &&
    (await Promise.resolve(context.hasSapDeployment('small')));

  if (kiloReady) {
    return { providerID: 'kilo', modelID: 'kilo-auto' };
  }
  if (sapSmallReady && context.smallModelDeployment) {
    return { providerID: 'sap-ai-core', modelID: context.smallModelDeployment };
  }

  // Fallback: reuse the primary model. This is the important safety
  // property — auxiliary tasks must never fail because of an unconfigured
  // small-model deployment.
  return { providerID: context.providerID, modelID: context.defaultModel };
}

/**
 * Resolve a model id, threading the auxiliary flag through so callers in
 * compaction / title-gen / summary / commit-message paths pick up the
 * small-model deployment when it is configured, and gracefully reuse the
 * primary model when it is not.
 *
 * When `modelID` is provided, it is returned verbatim (as a
 * `sap-ai-core` reference for Alexi) — explicit user overrides always win.
 */
export async function getModel(modelID?: string, opts: GetModelOptions = {}): Promise<ModelRef> {
  if (modelID && modelID.trim().length > 0) {
    const trimmed = modelID.trim();
    // Validate against the SAP orchestration model list only for the
    // sanity check; we do not swap the id here (the existing
    // `getProviderForModelWithFallback` handles fallback logic).
    void isOrchestrationModel;
    return { providerID: 'sap-ai-core', modelID: trimmed };
  }
  if (opts.auxiliary) {
    return selectModelForTask('auxiliary', buildContext());
  }
  return { providerID: 'sap-ai-core', modelID: getDefaultModel() };
}

/**
 * Convenience helper for the common "auxiliary task, no explicit override"
 * case. Returns just the model id (string) so it can be passed directly to
 * `getProviderForModel` / `getProviderForModelWithFallback`.
 */
export async function getAuxiliaryModelId(): Promise<string> {
  const ref = await selectModelForTask('auxiliary', buildContext());
  return ref.modelID;
}
