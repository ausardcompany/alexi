/**
 * Session title generation.
 *
 * Ports upstream commits `d2812d1` (tighten session title prompt) and
 * `5c52626` (generate titles at the lowest model variant). Together they
 * cut per-session title cost on SAP AI Core — every call is billed and
 * throttled, so generating titles with the cheapest variant of the
 * active model and a terser prompt is a real win on long workloads.
 *
 * This module is deliberately decoupled from `src/providers/`: the
 * caller passes a `TitleModel` adapter that knows how to invoke the
 * target provider. The deferred-attempt gating lives separately in
 * `src/kilocode/session/title.ts` — this module only concerns itself
 * with WHAT prompt to send and WHICH variant to pick.
 */

/**
 * The system/instruction prompt sent to the title model. Intentionally
 * terse: titles are 3–7 words, no markdown, no filler nouns. Reducing
 * the system prompt also reduces per-call input tokens.
 */
export const TITLE_PROMPT = `Generate a concise 3-7 word title summarizing the user's request.
Rules:
- No quotes, no trailing punctuation, no markdown.
- Prefer imperative or noun phrases.
- Do NOT include words like "chat", "conversation", "session".`;

/**
 * Minimal shape of a model variant the title generator cares about.
 *
 * `cost.input` is the per-million-token input cost; the cheapest
 * variant wins. Variants without cost metadata fall through to the
 * caller's default (last-known-good) variant.
 */
export interface TitleModelVariant {
  id: string;
  cost?: { input?: number };
}

/**
 * Minimal shape of a title-capable model. Mirrors the structure returned
 * by `getCatalogEntries()` but strips everything the title path does
 * not use so this module stays independent of the providers layer.
 */
export interface TitleModel {
  id: string;
  variants?: readonly TitleModelVariant[];
  generate: (opts: TitleGenerateOptions) => Promise<string>;
}

export interface TitleGenerateOptions {
  system: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
}

/** Minimal message shape the title generator consumes. */
export interface TitleMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Pick the cheapest variant of a model for title generation.
 *
 * Returns the model itself when no variants are declared — the caller
 * is already on the smallest known shape and swapping would be a no-op.
 *
 * Ports upstream commit `5c52626`.
 */
export function selectTitleVariant(model: TitleModel): TitleModel | TitleModelVariant {
  const variants = model.variants;
  if (!variants || variants.length === 0) {
    return model;
  }
  const sorted = [...variants].sort(
    (a, b) => (a.cost?.input ?? Infinity) - (b.cost?.input ?? Infinity)
  );
  return sorted[0] ?? model;
}

/**
 * Extract the first user text message from a message list. Used so the
 * title model only sees the user's actual request, not the whole
 * transcript — the whole transcript blows the input budget on long
 * sessions and skews the title toward later tangents.
 */
export function extractFirstUserText(messages: readonly TitleMessage[]): string {
  for (const m of messages) {
    if (m.role === 'user' && typeof m.content === 'string' && m.content.trim().length > 0) {
      return m.content;
    }
  }
  return '';
}

/**
 * Generate a session title from the message history using the cheapest
 * available model variant and the tightened `TITLE_PROMPT`.
 *
 * Returns the raw title string; the caller is responsible for trimming
 * / fallback behaviour (e.g. use a heuristic slice if the model returns
 * an empty string).
 */
export async function generateTitle(
  messages: readonly TitleMessage[],
  model: TitleModel
): Promise<string> {
  const chosen = selectTitleVariant(model);
  const userText = extractFirstUserText(messages);
  // Variants delegate back to the parent model's `generate` — the only
  // thing the variant selection changes is which `id` is quoted to the
  // provider at call time. `TitleModelVariant` does not carry its own
  // `generate` function, so bail back to the model when we got a bare
  // variant object.
  const generator = 'generate' in chosen ? chosen : model;
  return generator.generate({
    system: TITLE_PROMPT,
    prompt: userText,
    maxTokens: 32,
    temperature: 0.2,
  });
}
