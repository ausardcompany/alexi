/**
 * Gateway model capability helpers.
 *
 * These helpers operate over `ModelInfo`-shaped records loaded from
 * *external* catalogs (SAP AI Core deployment queries, OpenRouter-style
 * gateways, Cloudflare AI Gateway, etc.) rather than the authoritative
 * in-code metadata in `sapOrchestration.ts`.
 *
 * The distinction matters:
 *
 *  - `ORCHESTRATION_MODEL_METADATA` in `sapOrchestration.ts` is authored
 *    by Alexi maintainers. An entry with `capabilities: []` is an
 *    intentional, tested "definitely no tools" declaration and MUST NOT
 *    be treated as fail-open.
 *  - `ModelInfo.supported_parameters` here is provided by a remote
 *    gateway. Some gateways (including certain SAP AI Core deployment
 *    revisions) omit the field entirely, or return an empty array when
 *    they simply do not publish parameter metadata for a model. Treating
 *    "unknown" as "unsupported" here would incorrectly disable tools for
 *    valid tool-capable models routed through a gateway, downgrading the
 *    agent to a text-only fallback.
 *
 * This module ports the fix from kilocode c4506f7ef ("fix(gateway):
 * assume models with empty supported parameters support tools").
 */

/**
 * Subset of the OpenRouter/OpenAI-compatible `ModelInfo` shape that the
 * gateway capability helpers care about. Kept intentionally loose so
 * callers can pass any provider-supplied record without a strict
 * `satisfies` clause.
 */
export interface GatewayModelInfo {
  /** Model identifier (e.g. `"anthropic--claude-4.7-opus"`). */
  id?: string;
  /**
   * Parameters advertised as supported by the gateway. Three observable
   * states carry three different meanings:
   *
   *  - `undefined` / `null` — the gateway does not publish parameter
   *    metadata for this model (treat as fail-open per kilocode c4506f7ef).
   *  - `[]` — the gateway returned an empty list (treat as fail-open
   *    per kilocode c4506f7ef; empty is not distinguishable from "no
   *    metadata" for most upstream gateways).
   *  - `[...names]` — an explicit, non-empty list; look up
   *    `"tools"` / `"tool_choice"` in the list.
   */
  supported_parameters?: readonly string[] | null;
}

/**
 * Whether a gateway-routed model should be treated as tool-capable.
 *
 * Resolution rules:
 *
 *  1. If `supported_parameters` is `undefined` or `null` — the gateway
 *     did not publish parameter metadata — return `true`. Fail-open so
 *     tool-capable models are not silently downgraded to text-only.
 *  2. If `supported_parameters` is an empty array — the gateway returned
 *     no parameters — return `true`. Same fail-open rationale: some
 *     gateways collapse "no metadata authored" into an empty list.
 *  3. Otherwise, return `true` iff the list contains `"tools"` or
 *     `"tool_choice"`.
 *
 * Rationale: some gateways (incl. SAP AI Core deployments) omit the
 * `supported_parameters` field entirely. Treating "unknown" as
 * "unsupported" incorrectly disables tools.
 *
 * Reference: kilocode c4506f7ef.
 *
 * @param model - Gateway model record.
 * @returns Whether the model should be offered tool calling.
 */
export function modelSupportsTools(model: GatewayModelInfo): boolean {
  const params = model.supported_parameters;
  if (params === undefined || params === null) {
    return true;
  }
  if (Array.isArray(params) && params.length === 0) {
    return true;
  }
  return params.includes('tools') || params.includes('tool_choice');
}
