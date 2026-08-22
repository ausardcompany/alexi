/**
 * Shared protocol adapter utilities.
 *
 * Ports kilocode PRs #13255 / #13301 — Anthropic, Bedrock Converse, and
 * Gemini all require strict user/assistant alternation. Previously each
 * adapter carried its own inline coalescing loop; this module centralises
 * the logic so a bug fix (or a new provider that shares the constraint)
 * only needs to land in one place.
 *
 * Alexi does not currently ship dedicated per-protocol adapters (chat is
 * routed via `sapOrchestration.ts`), but this helper is exported here so
 * future adapter modules — and any custom provider a plugin ships —
 * can consume it without re-implementing the merge.
 */

/**
 * Minimal ModelMessage shape the coalescer needs. Kept structural (no
 * import from `ai` or a provider SDK) so this module has no runtime
 * dependency on the vendor package and stays importable from unit tests
 * without provider mocks.
 *
 * `content` may be either a plain string (the common OpenAI-style shape)
 * or an array of content parts (Anthropic / Gemini multimodal shape).
 * Both are normalised to the array form during merge so the resulting
 * message stays consumable by every protocol.
 */
export interface CoalesceableMessage {
  role: 'user' | 'assistant' | 'system' | 'tool' | string;
  content: string | Array<Record<string, unknown>>;
  [key: string]: unknown;
}

/**
 * Merge consecutive user messages into a single user message so that
 * providers requiring strict alternation (Anthropic, Bedrock Converse,
 * Gemini) do not receive back-to-back user turns.
 *
 * Non-user roles pass through untouched. When two adjacent user
 * messages are merged, the surviving message keeps the first message's
 * fields (role, any custom keys) and its `content` becomes the
 * concatenation of both messages' content arrays. String content is
 * lifted to `[{ type: 'text', text: <string> }]` before concatenation so
 * the result is uniform and downstream serializers do not have to
 * branch on the two shapes.
 *
 * Never mutates its inputs — always returns a new array with new
 * message objects for every merged pair.
 */
export function coalesceUserMessages<T extends CoalesceableMessage>(messages: readonly T[]): T[] {
  const out: T[] = [];
  for (const msg of messages) {
    const last = out[out.length - 1];
    if (last && last.role === 'user' && msg.role === 'user') {
      const lastContent = Array.isArray(last.content)
        ? last.content
        : [{ type: 'text', text: last.content }];
      const nextContent = Array.isArray(msg.content)
        ? msg.content
        : [{ type: 'text', text: msg.content }];
      out[out.length - 1] = {
        ...last,
        content: [...lastContent, ...nextContent],
      } as T;
    } else {
      out.push(msg);
    }
  }
  return out;
}
