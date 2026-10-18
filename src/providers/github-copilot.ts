/**
 * GitHub Copilot provider helpers.
 *
 * Alexi does not currently ship a first-class GitHub Copilot provider —
 * its primary surface is SAP AI Core (`sapOrchestration.ts`) plus proxy
 * adapters. Upstream opencode, however, maintains a Copilot provider and
 * recently landed two fixes that any future Copilot adapter in Alexi
 * will need to replicate verbatim:
 *
 *   - Commit 9f282f8c (2026-10): accept `response.reasoning_opaque.delta`
 *     stream events interleaved with `response.output_text.delta`.
 *     Without this, Copilot reasoning models (o3-family) break because
 *     the opaque reasoning blocks produce an unhandled event type and
 *     the stream decoder either drops subsequent text deltas or errors
 *     out of the loop.
 *
 *   - Commit 1a9e29a0 (2026-10): Gemini models routed through Copilot
 *     only work via the chat-completions endpoint, NOT via the responses
 *     API. models.dev does not advertise this constraint, so a hardcoded
 *     routing rule is required.
 *
 *   - Commit 823ac87f (2026-10): use the models.dev package list to
 *     resolve the right provider-compat package for Copilot fallback
 *     routes.
 *
 * These helpers are intentionally dependency-light so they can be
 * imported directly from a Copilot adapter without pulling the rest of
 * Alexi's provider stack. They have no behavioural effect until a
 * caller imports them, so existing SAP AI Core flows are unaffected.
 */

/**
 * Lower-cased model id prefixes that must be routed to the Copilot
 * chat-completions endpoint rather than the responses API. All other
 * known Copilot-exposed model families (GPT, Claude) use `responses`.
 */
const COPILOT_CHAT_PREFIXES = ['gemini'];

/** Lower-cased prefixes that must use the Copilot responses API. */
const COPILOT_RESPONSES_PREFIXES = ['gpt-', 'claude'];

export type CopilotEndpoint = 'responses' | 'chat';

/**
 * Pick the correct Copilot endpoint for a given model id. Falls back to
 * `chat` when the model family is unknown — the chat-completions API
 * is a strict subset of what the responses API supports, so defaulting
 * there avoids silent breakage when Copilot adds a new model family
 * before the models.dev snapshot catches up.
 */
export function selectCopilotEndpoint(modelId: string): CopilotEndpoint {
  const lower = modelId.toLowerCase();
  if (COPILOT_CHAT_PREFIXES.some((p) => lower.startsWith(p))) {
    return 'chat';
  }
  if (COPILOT_RESPONSES_PREFIXES.some((p) => lower.startsWith(p))) {
    return 'responses';
  }
  return 'chat';
}

/**
 * A minimal shape for the Copilot responses-API stream chunks that we
 * care about. The full event list is much larger; this type only
 * enumerates the handful needed to document the opaque-reasoning fix.
 */
export interface CopilotStreamChunk {
  type: string;
  delta?: string;
  item?: { type: string; id: string };
  [k: string]: unknown;
}

/** Normalised event emitted by `parseCopilotResponseStream`. */
export type ParsedCopilotEvent =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string; opaque: boolean }
  | { type: 'reasoning_start'; id: string }
  | { type: 'ignored'; reason: string };

/**
 * Parse one Copilot responses-API stream chunk into a normalised event.
 *
 * Alexi_change (opencode 9f282f8c, 2026-10): `response.reasoning_opaque.delta`
 * is treated identically to `response.reasoning.delta`, but with
 * `opaque: true` so downstream renderers know the content is encrypted
 * blob data rather than human-readable reasoning text.
 *
 * Alexi_change (opencode fix #56669): the OpenAI-compatible Responses
 * API now sends explicit `null` for optional fields (`delta`, `item`,
 * `output`) instead of omitting them. A naive `chunk.delta ?? ''`
 * handles that for scalar strings, but nested property access on a
 * `null` `item` would still throw. Normalise `null` to "absent" on
 * every path so a forward-rolled server cannot crash the decoder.
 */
export function parseCopilotResponseStream(chunk: CopilotStreamChunk): ParsedCopilotEvent {
  // Guard: the whole chunk may itself be malformed. A `null`/non-object
  // payload should degrade to a logged-and-skipped `ignored` event
  // rather than throw.
  if (!chunk || typeof chunk !== 'object' || typeof chunk.type !== 'string') {
    return { type: 'ignored', reason: 'untyped' };
  }
  // Normalise `null` deltas to '' (same bucket as "omitted" per the
  // Responses API spec). Non-string deltas also fall through to ''.
  const delta = typeof chunk.delta === 'string' ? chunk.delta : '';
  switch (chunk.type) {
    case 'response.output_text.delta':
      return { type: 'text', text: delta };
    case 'response.reasoning.delta':
      return { type: 'reasoning', text: delta, opaque: false };
    case 'response.reasoning_opaque.delta':
      // NEW: accept opaque reasoning interleaved with text deltas.
      return { type: 'reasoning', text: delta, opaque: true };
    case 'response.output_item.added': {
      // `item` may be explicitly `null` on forward-rolled servers.
      // Treat it as absent rather than reading `.type` on `null`.
      const item = chunk.item ?? undefined;
      if (item?.type === 'reasoning') {
        return { type: 'reasoning_start', id: item.id };
      }
      return { type: 'ignored', reason: `output_item.added type=${item?.type ?? '?'}` };
    }
    default:
      return { type: 'ignored', reason: chunk.type };
  }
}

/**
 * Resolve the models.dev `providerPackage` to use for a Copilot fallback
 * routing decision. When the snapshot has no entry for the given model,
 * fall back to the generic `openai-compatible` adapter (safe default
 * because every Copilot-exposed model honours the OpenAI chat schema at
 * minimum).
 *
 * Callers inject the models.dev snapshot explicitly to avoid a hard
 * dependency on the on-disk file layout. See `src/providers/catalog.ts`
 * for how Alexi currently loads provider manifests.
 */
export function resolveCopilotProviderPackage(
  modelId: string,
  snapshot: { copilot?: { models?: Record<string, { providerPackage?: string }> } }
): string {
  return snapshot.copilot?.models?.[modelId]?.providerPackage ?? 'openai-compatible';
}
