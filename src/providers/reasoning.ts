/**
 * Portable reasoning resolution for provider implementations.
 *
 * Centralizes the mapping between Alexi's user-facing reasoning effort
 * levels (`low`, `medium`, `high`, `max`) and the portable reasoning
 * option shape modeled on the AI SDK's portable reasoning API. Provider
 * modules call {@link resolvePortableReasoning} instead of re-deriving
 * the mapping themselves, which keeps behaviour aligned across providers
 * (DeepSeek, SAP Orchestration, adaptive thinking, ...).
 *
 * Contract:
 * - Returns `undefined` when no reasoning is requested (both `effortLevel`
 *   and `enabled` omitted, or `enabled === false` without an effort).
 * - `enabled === true` without an explicit level maps to `medium` — this
 *   matches the Cline "enable thinking with sensible default" contract.
 * - `enabled === false` returns a `{ effort: 'none' }` sentinel so callers
 *   can distinguish "explicitly off" from "not specified". Providers that
 *   have no way to represent an explicit disable can treat `none` the
 *   same as `undefined`.
 * - `effortLevel: 'max'` is normalized to `xhigh` so downstream provider
 *   code has a single canonical highest-tier value to match on. This is
 *   the same normalization Cline PR #12946 applied to align AI SDK
 *   providers with Anthropic's `xhigh` extended-thinking budget.
 *
 * Reference: Cline #12946 "feat(llms): add portable reasoning resolution
 * for AI SDK providers" (merged 2026-08-05).
 */

/** User-facing reasoning effort levels accepted by Alexi. */
export type ReasoningEffortLevel = 'low' | 'medium' | 'high' | 'max';

/**
 * Canonical effort values on the wire after normalization.
 *
 * - `low` / `medium` / `high` pass through unchanged.
 * - `max` is normalized to `xhigh` to match the AI SDK portable reasoning
 *   contract and Anthropic extended-thinking naming.
 * - `none` is emitted when reasoning was explicitly disabled by the caller
 *   (`enabled === false`); providers should turn native reasoning off.
 */
export type PortableReasoningEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'none';

/**
 * Portable reasoning option returned by {@link resolvePortableReasoning}.
 *
 * Providers should treat this as an opaque descriptor and only branch on
 * `effort`. Additional provider-specific controls (budget tokens, native
 * disable flags, model-family dispatch) belong in the provider module.
 */
export interface PortableReasoningOption {
  effort: PortableReasoningEffort;
}

/**
 * Resolve an Alexi reasoning-effort request into a portable option.
 *
 * @param effortLevel Optional effort level (`low` | `medium` | `high` | `max`).
 * @param enabled Optional explicit toggle. `true` without a level defaults to
 *                `medium`; `false` forces `none`. When both `effortLevel` and
 *                `enabled === false` are provided, the explicit disable wins.
 * @returns A portable reasoning option, or `undefined` when reasoning was
 *          not requested at all.
 */
export function resolvePortableReasoning(
  effortLevel?: ReasoningEffortLevel,
  enabled?: boolean
): PortableReasoningOption | undefined {
  // Explicit disable wins over any effort level. Providers can use this
  // sentinel to turn off native reasoning.
  if (enabled === false) {
    return { effort: 'none' };
  }

  if (effortLevel !== undefined) {
    return { effort: normalizeEffort(effortLevel) };
  }

  // Enable without a level defaults to medium — the common "just turn on
  // thinking" contract used by Cline's portable resolver.
  if (enabled === true) {
    return { effort: 'medium' };
  }

  // No reasoning requested.
  return undefined;
}

function normalizeEffort(level: ReasoningEffortLevel): PortableReasoningEffort {
  switch (level) {
    case 'low':
      return 'low';
    case 'medium':
      return 'medium';
    case 'high':
      return 'high';
    case 'max':
      return 'xhigh';
  }
}
