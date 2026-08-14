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

// ---------------------------------------------------------------------------
// Provider-specific reasoning parameter shapes.
//
// The functions below extend the portable resolver above with a concrete
// provider-family dispatch: given a model id and a user-facing
// {@link ReasoningConfig}, {@link resolveReasoning} emits the wire-shape
// each provider family expects, so callers (orchestrator, streaming
// orchestrator, router) do not have to re-derive per-provider conditionals.
//
// Provider families and their expected reasoning parameter shapes:
//
//   Anthropic (claude-*, opus-*, sonnet-*, haiku-*):
//     { thinking: { type: 'enabled' | 'disabled', budget_tokens?: number } }
//
//   OpenAI (gpt-*, o1-*, openai/*):
//     { reasoning_effort: 'low' | 'medium' | 'high' }
//
//   Gemini (gemini-*):
//     { thinkingConfig: { thinkingBudget: number } }
//
// Unknown model ids receive an empty object so callers can spread the
// result unconditionally without changing the request shape.
//
// Model-specific quirks:
//   - Anthropic Opus 4.7 does NOT accept `reasoning_effort` on the OpenAI
//     wire; instead it expects the `thinking` shape with `budget_tokens`.
//     `resolveReasoning` respects that by always emitting the `thinking`
//     shape for the Anthropic family and never emitting a bare
//     `reasoning_effort` for Opus 4.7. Callers requesting an `effort`
//     level for Opus 4.7 get the equivalent `budget_tokens` mapping
//     (low=4096, medium=10000, high=32000) instead.
// ---------------------------------------------------------------------------

/**
 * User-facing reasoning configuration passed into {@link resolveReasoning}.
 *
 * All three fields are optional; the resolver decides which subset each
 * provider family cares about:
 *
 * - `effort`   -> primary input for OpenAI's `reasoning_effort` field.
 *                 Also mapped to Anthropic `budget_tokens` when `budget`
 *                 is not explicitly provided.
 * - `budget`   -> explicit token budget for Anthropic `thinking` and
 *                 Gemini `thinkingConfig.thinkingBudget`. Wins over the
 *                 effort-derived default when both are set.
 * - `enabled`  -> explicit toggle. `false` forces the reasoning off
 *                 (Anthropic `type: 'disabled'`); a missing `enabled` with
 *                 no `effort`/`budget` defers to provider defaults (empty
 *                 result).
 */
export interface ReasoningConfig {
  effort?: 'low' | 'medium' | 'high';
  budget?: number;
  enabled?: boolean;
}

/**
 * Provider family key. Callers may pass a full model id (e.g.
 * `'anthropic--claude-4.7-opus'`), which the resolver classifies via
 * substring match, or a canonical family name.
 */
export type ProviderFamily = 'anthropic' | 'openai' | 'gemini' | 'unknown';

/**
 * Default thinking budgets used when only an `effort` level was supplied
 * and the provider family requires a token count (Anthropic, Gemini).
 * Values mirror the tiering used by the AI SDK and Cline PR #12946.
 */
const EFFORT_BUDGET_TOKENS: Record<'low' | 'medium' | 'high', number> = {
  low: 4096,
  medium: 10000,
  high: 32000,
};

/**
 * Classify a model id or provider name into one of the known families.
 *
 * Matching is deliberately conservative: an unrecognised id returns
 * `'unknown'` so callers can spread an empty result and let provider
 * defaults apply.
 */
export function detectProviderFamily(providerOrModelId: string): ProviderFamily {
  const lower = providerOrModelId.toLowerCase();
  if (lower === 'anthropic' || lower === 'openai' || lower === 'gemini') {
    return lower as ProviderFamily;
  }
  if (
    lower.includes('anthropic') ||
    lower.includes('claude') ||
    lower.includes('opus') ||
    lower.includes('sonnet') ||
    lower.includes('haiku')
  ) {
    return 'anthropic';
  }
  if (
    lower.includes('gpt') ||
    lower.startsWith('o1') ||
    lower.includes('/o1') ||
    lower.includes('-o1') ||
    lower.includes('openai')
  ) {
    return 'openai';
  }
  if (lower.includes('gemini')) {
    return 'gemini';
  }
  return 'unknown';
}

/**
 * Detect Anthropic Opus 4.7 (or newer 4.x >= 4.7) from a model id.
 *
 * Opus 4.7 refuses the OpenAI-style `reasoning_effort` field on SAP AI
 * Core and requires the native `thinking` shape with `budget_tokens`.
 * We always emit the `thinking` shape for the Anthropic family, so this
 * predicate only exists to make the intent explicit in tests and to
 * suppress the equivalent `reasoning_effort` field for Opus 4.7 callers
 * that were previously using OpenAI-style params.
 */
export function isAnthropicOpus47(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  const opusMatch =
    lower.match(/opus-(\d+)(?:\.(\d+))?/) ?? lower.match(/claude-(\d+)(?:\.(\d+))?-opus/);
  if (!opusMatch) {
    return false;
  }
  const major = Number(opusMatch[1]);
  const minor = opusMatch[2] !== undefined ? Number(opusMatch[2]) : 0;
  return major > 4 || (major === 4 && minor >= 7);
}

/**
 * Portable reasoning resolution: turn a provider-agnostic
 * {@link ReasoningConfig} into the exact wire-shape a given provider
 * family expects.
 *
 * Returns an empty object when no reasoning was requested or when the
 * provider family is unknown, so callers can safely spread the result
 * into the request payload without conditional guards.
 *
 * @param providerOrModelId Either a canonical family name (`'anthropic'`,
 *   `'openai'`, `'gemini'`) or a full model id. The resolver classifies
 *   full ids via {@link detectProviderFamily}.
 * @param config User-facing reasoning configuration (effort / budget /
 *   enabled). All three fields are optional.
 * @returns A plain object containing the provider-specific reasoning
 *   parameters. Never returns `null` or `undefined`.
 */
export function resolveReasoning(
  providerOrModelId: string,
  config: ReasoningConfig
): Record<string, unknown> {
  // Nothing to do when the caller passed no reasoning intent at all.
  if (config.effort === undefined && config.budget === undefined && config.enabled === undefined) {
    return {};
  }

  const family = detectProviderFamily(providerOrModelId);

  if (family === 'anthropic') {
    // Anthropic uses the native `thinking` shape end-to-end (SAP AI Core
    // + Anthropic API). An explicit `enabled: false` disables it; any
    // other configuration enables it and sets a token budget derived
    // from `budget` (wins) or `effort` (fallback).
    if (config.enabled === false) {
      return { thinking: { type: 'disabled' } };
    }
    const budgetTokens =
      config.budget ?? (config.effort ? EFFORT_BUDGET_TOKENS[config.effort] : undefined);
    const thinking: Record<string, unknown> = { type: 'enabled' };
    if (budgetTokens !== undefined) {
      thinking.budget_tokens = budgetTokens;
    }
    return { thinking };
  }

  if (family === 'openai') {
    // OpenAI accepts `reasoning_effort` on reasoning-capable models (o1,
    // gpt-5, ...). We only emit the field when an explicit effort level
    // was supplied — `enabled` alone does not map to an OpenAI level.
    if (config.enabled === false) {
      return {};
    }
    if (config.effort !== undefined) {
      return { reasoning_effort: config.effort };
    }
    return {};
  }

  if (family === 'gemini') {
    // Gemini uses `thinkingConfig.thinkingBudget` (in tokens). Explicit
    // `enabled: false` disables it via a budget of 0; otherwise derive
    // from `budget` (wins) or `effort` (fallback).
    if (config.enabled === false) {
      return { thinkingConfig: { thinkingBudget: 0 } };
    }
    const budgetTokens =
      config.budget ?? (config.effort ? EFFORT_BUDGET_TOKENS[config.effort] : undefined);
    if (budgetTokens === undefined) {
      return {};
    }
    return { thinkingConfig: { thinkingBudget: budgetTokens } };
  }

  // Unknown provider family: return empty so callers can spread safely
  // without changing the request shape.
  return {};
}
