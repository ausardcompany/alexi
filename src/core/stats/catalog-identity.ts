/**
 * Canonical model identity for usage attribution.
 *
 * Ported from opencode `packages/stats/core/src/domain/catalog-identity.ts`
 * (commit acb6859). Adapted to Alexi's provider registry.
 *
 * Purpose: when Alexi aggregates usage across SAP AI Core deployments,
 * OpenAI direct calls, and other gateway-routed providers, the same
 * underlying model (e.g. Anthropic Claude Opus) may be exposed under
 * multiple `provider/model` combinations:
 *
 *   - `sap-ai-core/anthropic--claude-4.7-opus`
 *   - `anthropic/claude-4-opus`
 *   - `openrouter/anthropic/claude-opus-4`
 *
 * Naive per-`provider/modelID` grouping would triple-count that model in
 * per-lab spend reports. `catalogIdentity` normalises each offering to a
 * canonical lab identity (`"anthropic"`) so downstream aggregation can
 * bucket by lab correctly.
 *
 * The helper is intentionally decoupled from Alexi's static catalog: it
 * consumes a JSON-shaped value (produced by an upstream tool or fetched
 * from a shared model index) and returns two read-only maps for the
 * caller to look up.
 */

/**
 * Result of {@link catalogIdentity}.
 */
export interface CatalogIdentity {
  /**
   * `"<providerID>/<modelID>"` → canonical lab id (e.g. `"anthropic"`).
   * Populated for every offering the input catalog declares, as long as
   * the offering can be resolved to a canonical model id.
   */
  readonly offerings: ReadonlyMap<string, string>;
  /**
   * Normalised model name → canonical lab id. Only populated for
   * unambiguous names — i.e. when every provider that offers the same
   * normalised name maps back to the same lab. Ambiguous names (offered
   * by multiple labs) are dropped so callers cannot accidentally
   * mis-attribute usage.
   */
  readonly models: ReadonlyMap<string, string>;
}

/** Narrowing type guard for plain object records. */
function record(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Default list of provider ids whose entries participate in the
 * canonical-identity resolution. Extended with `"sap-ai-core"` relative
 * to the upstream opencode list so SAP-routed offerings map to the
 * correct lab.
 */
export const DEFAULT_STATS_PROVIDERS: readonly string[] = ['opencode', 'opencode-go', 'sap-ai-core'];

/**
 * Build canonical `offering → lab` and `model → lab` maps from a model
 * catalog value.
 *
 * The input shape mirrors the upstream models.dev catalog:
 * ```jsonc
 * {
 *   "models":    { "<canonicalID>": {...} },
 *   "providers": { "<providerID>": { "models": { "<modelID>": { canonical_model_id?: string } } } }
 * }
 * ```
 *
 * Resolution rules:
 *  1. For each provider in `statsProviders`, iterate `provider.models`.
 *  2. Determine the canonical id for each model:
 *     - use `model.canonical_model_id` if set;
 *     - else fall back to `modelID` when the top-level `models` map
 *       already contains it;
 *     - else fall back to `"<providerID>/<modelID>"` for the same reason;
 *     - else skip the entry (we do not have canonical data).
 *  3. The lab is the segment before the first `/` of the canonical id.
 *  4. Record `"<providerID>/<modelID>" → lab` in `offerings`.
 *  5. Track candidate labs per normalised model name; only surface names
 *     with a single candidate lab in the `models` output.
 *
 * @param value          Raw catalog value (untrusted input — validated inline).
 * @param statsProviders Provider ids to include; defaults to
 *   {@link DEFAULT_STATS_PROVIDERS}.
 * @returns Canonical `offerings` and `models` maps.
 * @throws Error when `value` is not a valid catalog shape.
 */
export function catalogIdentity(
  value: unknown,
  statsProviders: readonly string[] = DEFAULT_STATS_PROVIDERS
): CatalogIdentity {
  if (!record(value) || !record(value.models) || !record(value.providers)) {
    throw new Error('Invalid model catalog');
  }
  const models = value.models;
  const providers = value.providers;

  const offerings = new Map<string, string>();
  const candidates = new Map<string, Set<string>>();

  for (const providerID of statsProviders) {
    const provider = providers[providerID];
    if (!record(provider) || !record(provider.models)) {
      continue;
    }
    for (const [modelID, model] of Object.entries(provider.models)) {
      if (!record(model)) {
        continue;
      }
      let canonicalID: string | undefined;
      if (typeof model.canonical_model_id === 'string') {
        canonicalID = model.canonical_model_id;
      } else if (modelID in models) {
        canonicalID = modelID;
      } else if (`${providerID}/${modelID}` in models) {
        canonicalID = `${providerID}/${modelID}`;
      }
      if (!canonicalID) {
        continue;
      }
      const lab = canonicalID.split('/')[0];
      if (!lab) {
        continue;
      }
      offerings.set(`${providerID}/${modelID}`, lab);

      // Normalise the model id so `-free` / `-preview` suffixed variants
      // collapse into one candidate group per underlying model. This
      // mirrors the upstream logic byte-for-byte.
      const norm = modelID.replace(/-free$|-preview$/g, '');
      let labSet = candidates.get(norm);
      if (!labSet) {
        labSet = new Set();
        candidates.set(norm, labSet);
      }
      labSet.add(lab);
    }
  }

  const modelsOut = new Map<string, string>();
  for (const [name, labs] of candidates) {
    if (labs.size === 1) {
      const [only] = labs;
      if (only !== undefined) {
        modelsOut.set(name, only);
      }
    }
  }

  return { offerings, models: modelsOut };
}
