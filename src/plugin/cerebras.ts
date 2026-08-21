/**
 * Cerebras completion-token cap plugin.
 *
 * Port of opencode e49772a: Cerebras enforces a hard cap on
 * `max_completion_tokens`. If a caller (or a routing config) passes a
 * higher value, the provider silently truncates the response — losing
 * the trailing tokens without an error. This plugin clamps any explicit
 * `maxTokens` on a Cerebras-routed call to the documented ceiling so we
 * never make a request that will be silently truncated.
 *
 * Applicability to Alexi: Alexi routes exclusively through SAP AI Core,
 * so under normal operation there is no direct Cerebras provider. The
 * plugin is still shipped as a builtin because:
 *   1. SAP AI Core proxy deployments MAY expose a Cerebras-family model
 *      id (`cerebras-*`); the guard here catches those.
 *   2. Users running the fork behind a custom proxy that adds Cerebras
 *      get the cap for free.
 *
 * The plugin is a no-op for every non-Cerebras provider.
 */

import { definePlugin, type Plugin } from './index.js';

/**
 * Hard upper bound for `max_completion_tokens` on Cerebras deployments.
 * Sourced from Cerebras' documented per-model ceiling; see upstream
 * commit e49772a for the empirical rationale (higher values are
 * accepted by the API but the response is truncated at this length).
 */
export const CEREBRAS_MAX_COMPLETION_TOKENS = 32_768;

/**
 * Return true when the given provider/model identifier should be
 * treated as Cerebras. Both direct provider ids and prefixed model ids
 * (e.g. `cerebras/llama-3.1-70b`) are recognised so callers don't need
 * to plumb a separate provider field through.
 */
export function isCerebrasTarget(providerOrModel: string | undefined): boolean {
  if (!providerOrModel) {
    return false;
  }
  return /^cerebras[/-]/i.test(providerOrModel) || providerOrModel.toLowerCase() === 'cerebras';
}

/**
 * Clamp a caller-supplied `maxTokens` value to the Cerebras ceiling.
 * Returns the original value unchanged for non-Cerebras targets or
 * when `maxTokens` is undefined / already within bounds.
 */
export function clampCerebrasMaxTokens(
  providerOrModel: string | undefined,
  maxTokens: number | undefined
): number | undefined {
  if (!isCerebrasTarget(providerOrModel)) {
    return maxTokens;
  }
  if (typeof maxTokens !== 'number' || !Number.isFinite(maxTokens)) {
    return maxTokens;
  }
  return Math.min(maxTokens, CEREBRAS_MAX_COMPLETION_TOKENS);
}

/**
 * Builtin Cerebras completion-limit plugin. Registered from the plugin
 * bootstrap path when Alexi runs against a proxy that exposes Cerebras
 * models; no-op otherwise.
 */
export const CerebrasPlugin: Plugin = definePlugin({
  name: 'cerebras',
  version: '1.0.0',
  description: 'Clamp max_completion_tokens for Cerebras deployments to the documented ceiling',
});
