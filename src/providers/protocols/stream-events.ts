/**
 * Forward-compatible stream event guards.
 *
 * Ports opencode PR #56286 (`fix(ai): tolerate unknown and untyped
 * stream events`). SAP AI Core proxies multiple upstream providers
 * (Anthropic, OpenAI, Gemini, Mistral, Bedrock); each one occasionally
 * introduces a new SSE event kind without a corresponding client-side
 * handler. Crashing on `Unknown stream event: <type>` turns a benign
 * forward-rolled server into a hard failure for every Alexi caller.
 *
 * This module exports two tiny helpers:
 *
 *   - {@link isTypedStreamEvent} — narrows an arbitrary SSE payload to
 *     a `{ type: string }` shape, so callers can safely branch on
 *     `event.type` without a `null`/non-object/missing-type crash.
 *
 *   - {@link classifyUnknownStreamEvent} — reports whether a known
 *     event kind was received. The matching behaviour is callsite-
 *     specific (the caller supplies the known set), so this helper is
 *     purely a classifier: callers typically log at `debug` and
 *     continue instead of throwing.
 *
 * Usage pattern expected at every stream decoder (replaces the old
 * `throw new Error('Unknown stream event: …')`):
 *
 * ```ts
 * if (!isTypedStreamEvent(event)) {
 *   logger.debug('stream.untyped_event', { event });
 *   return;
 * }
 * switch (event.type) {
 *   case 'content_block_delta': // ...
 *   case 'message_stop':        // ...
 *   default:
 *     logger.debug('stream.unknown_event', { type: event.type });
 *     break;
 * }
 * ```
 */

/**
 * Minimal shape every typed stream event must satisfy. Decoders that
 * need extra fields can further narrow with a provider-specific
 * discriminated union; this type is intentionally structural so the
 * guard is portable across providers.
 */
export interface TypedStreamEvent {
  type: string;
  [k: string]: unknown;
}

/**
 * Narrow an unknown SSE payload to {@link TypedStreamEvent}.
 *
 * Returns `false` for `null`, non-objects, and objects whose `type`
 * field is missing or not a string. Callers that get `false` MUST NOT
 * throw — they should log at `debug` and continue so the stream stays
 * open for the next event.
 */
export function isTypedStreamEvent(event: unknown): event is TypedStreamEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }
  const t = (event as { type?: unknown }).type;
  return typeof t === 'string' && t.length > 0;
}

/**
 * Classification result for an incoming event kind.
 *
 *   - `known`    — the event is in the caller-supplied `knownTypes`
 *                  set and should be dispatched as usual.
 *   - `unknown`  — the event has a type but the decoder does not
 *                  recognise it. Caller should log and skip.
 *   - `untyped`  — the event lacks a usable `type` field. Caller
 *                  should log and skip.
 */
export type StreamEventClassification = 'known' | 'unknown' | 'untyped';

/**
 * Classify an SSE payload against a caller-supplied set of known event
 * types. Non-throwing by contract so callers stay forward-compatible
 * with new provider event kinds (opencode #56286).
 */
export function classifyStreamEvent(
  event: unknown,
  knownTypes: ReadonlySet<string>
): StreamEventClassification {
  if (!isTypedStreamEvent(event)) {
    return 'untyped';
  }
  return knownTypes.has(event.type) ? 'known' : 'unknown';
}
