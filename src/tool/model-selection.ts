/**
 * Model selection helper — shared model resolution logic for the
 * `task` and `agent_manager` tools.
 *
 * Ports upstream opencode/kilocode `packages/opencode/src/kilocode/tool/
 * model-selection.ts` (2026-08 sync). Previously, model lookup and
 * candidate resolution lived inline inside `agent-manager.ts`; this
 * module extracts it so the `task` tool can reuse the same resolution
 * when the experimental `task_model_selection` flag is enabled.
 *
 * Alexi adapter notes
 * -------------------
 * Upstream uses an `Effect`-based `Provider.Service` that lists every
 * provider + its models. Alexi's runtime provider is `SapOrchestration`
 * only, so we resolve against Alexi's `modelCatalog` (static + live SAP
 * AI Core deployments) rather than a generic `providers` map. The
 * shape of `Candidate`, the `lookup()` result, and the `selectModel()`
 * return type all match the upstream contract so callers port cleanly.
 *
 * Provider preference precedence:
 *   1. Explicit `source.variant` (e.g. `sap-ai-core`) if it matches.
 *   2. `preferredProviderID` (the caller's current-turn provider).
 *   3. First candidate in the resolved pool.
 */

import { getCatalogEntries } from '../providers/modelCatalog.js';

/**
 * A resolved (providerID, model) pair. `model.id` is the provider-native
 * model identifier and `model.name` is a human-readable label suitable
 * for fuzzy matching (upstream uses `Provider.Info["models"][string]`).
 */
export type Candidate = {
  providerID: string;
  model: { id: string; name: string };
};

/**
 * A logical model reference from a tool call. `model` is the free-form
 * name / id the caller typed (`gpt-4o`, `sap-ai-core/anthropic--claude-4.5-opus`,
 * `Claude Opus`); `variant` optionally constrains the provider id
 * (mirrors upstream's `task.provider` field).
 */
export type Source = { model: string; variant?: string };

/**
 * Case-insensitive substring / token match. Upstream's `matchesQuery`
 * lives in `packages/opencode/src/kilocode/tool/model-search.ts`; the
 * shape we need here is a boolean predicate over a list of haystacks
 * and a single query. Split the query on whitespace and require every
 * token to appear in AT LEAST ONE haystack (order-independent,
 * case-insensitive). Empty queries never match — callers should
 * short-circuit with `pool = all`.
 */
function matchesQuery(haystacks: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return false;
  }
  const tokens = q.split(/\s+/);
  const lowerHays = haystacks.map((h) => h.toLowerCase());
  return tokens.every((tok) => lowerHays.some((h) => h.includes(tok)));
}

/**
 * Enumerate every `(providerID, model)` pair known to Alexi. Alexi ships
 * one runtime provider (`sap-ai-core`), so every catalog entry is
 * emitted with `providerID = 'sap-ai-core'`. Upstream returns the full
 * cross-product across all registered providers.
 */
export function candidates(): Candidate[] {
  const entries = getCatalogEntries();
  return entries.map((entry) => ({
    providerID: 'sap-ai-core',
    model: {
      id: entry.id,
      // Prefer a friendlier display name when the catalog carries one;
      // otherwise fall back to the raw id. `entry.metadata?.name` is
      // typed loosely because the catalog metadata shape varies with
      // provider revisions.
      name: (entry.metadata as { name?: string } | undefined)?.name ?? entry.id,
    },
  }));
}

/**
 * Resolve a free-form query to the pool of matching candidates and the
 * set of distinct model names in that pool.
 *
 * Precedence (matches upstream):
 *   1. Exact `providerID/modelID` match wins outright.
 *   2. Exact `model.name` match wins next.
 *   3. Fall back to fuzzy substring/token match across both
 *      `model.name` and `providerID/modelID`.
 *
 * `names` deduplicates on the display name so the caller can detect
 * "ambiguous — multiple distinct models match" separately from
 * "one logical model is offered by multiple providers".
 */
export function lookup(all: Candidate[], value: string): { pool: Candidate[]; names: string[] } {
  const query = value.trim().toLowerCase();
  if (query.length === 0) {
    return { pool: [], names: [] };
  }

  const exactId = all.filter(
    (item) => `${item.providerID}/${item.model.id}`.toLowerCase() === query
  );
  const exactName =
    exactId.length > 0 ? exactId : all.filter((item) => item.model.name.toLowerCase() === query);

  const pool =
    exactName.length > 0
      ? exactName
      : all.filter((item) =>
          matchesQuery([item.model.name, `${item.providerID}/${item.model.id}`], value)
        );

  const names = [...new Set(pool.map((item) => item.model.name))];
  return { pool, names };
}

/**
 * Result of a successful `selectModel()` call.
 */
export type SelectedModel = { providerID: string; modelID: string };

/**
 * Error shape returned by `selectModel()` when the query is unresolvable
 * (no matches) or ambiguous (multiple distinct model names match).
 * The `error` string is designed to be surfaced verbatim to the model in
 * a `ToolResult.error`.
 */
export type SelectModelError = { error: string };

/**
 * Resolve a model source (from a tool call) to a concrete
 * `(providerID, modelID)` pair, applying provider-preference rules.
 *
 * @param source           The `{ model, variant }` requested by the caller.
 * @param preferredProviderID Optional current-turn provider id — used as a
 *                            tie-break when the resolved pool spans
 *                            multiple providers but no `source.variant`
 *                            was supplied.
 * @returns `SelectedModel` on success, or `SelectModelError` on failure.
 */
export function selectModel(
  source: Source,
  preferredProviderID?: string
): SelectedModel | SelectModelError {
  const all = candidates();
  const { pool, names } = lookup(all, source.model);

  if (pool.length === 0) {
    return { error: `No model matches "${source.model}"` };
  }
  if (names.length > 1) {
    return {
      error: `Ambiguous model "${source.model}" — candidates: ${names.join(', ')}`,
    };
  }

  // Prefer the requested variant (upstream `task.provider`), else the
  // caller's current-turn provider, else fall through to the first
  // candidate in the pool.
  const byVariant = source.variant
    ? pool.filter((c) => c.providerID.toLowerCase() === source.variant!.toLowerCase())
    : pool;
  const byPreferred =
    preferredProviderID && byVariant.length > 1
      ? byVariant.filter((c) => c.providerID === preferredProviderID)
      : [];

  const picked = byPreferred[0] ?? byVariant[0] ?? pool[0];
  return { providerID: picked.providerID, modelID: picked.model.id };
}

/**
 * Type guard: narrow a `selectModel()` result to the error branch.
 * Included as a convenience so callers can write:
 *
 * ```ts
 * const r = selectModel(source, providerID);
 * if (isSelectModelError(r)) return { success: false, error: r.error };
 * // r is SelectedModel here
 * ```
 */
export function isSelectModelError(r: SelectedModel | SelectModelError): r is SelectModelError {
  return (r as SelectModelError).error !== undefined;
}
