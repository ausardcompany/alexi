/**
 * Markup sanitization for hook context injection.
 *
 * When hook output (`contextModification`) is embedded inside a
 * `<hook_context tool_name="..." tool_call_id="...">...</hook_context>`
 * user message that is fed back to the model, malicious or accidental
 * `<hook_context>` tags in the payload could otherwise break out of the
 * envelope or forge tool identity. This helper produces an injective
 * encoding of the payload so:
 *
 * 1. Embedded `<hook_context>` / `</hook_context>` tags (any casing, any
 *    attribute suffix up to the closing `>`) are neutralized so they
 *    cannot terminate or spoof the wrapper.
 * 2. Attribute delimiters (`"`), open/close angle brackets (`<`, `>`) and
 *    the `&` used by the encoding are escaped with distinct tokens so no
 *    two distinct inputs collapse to the same output.
 *
 * The mapping is deliberately HTML-entity-shaped (`&amp;`, `&lt;`, `&gt;`,
 * `&quot;`) so the encoding is stable, human-readable, and reversible.
 * Escaping `&` FIRST is what keeps the encoding injective — otherwise a
 * literal `&lt;` in the input and the escape of a real `<` would collide.
 */
export function sanitizeHookContext(text: string): string {
  // 1. Escape `&` first. This is the injective anchor: every subsequent
  //    escape produces sequences that start with `&`, so pre-escaping any
  //    literal `&` guarantees no collision with the escapes below.
  let safe = text.replace(/&/g, '&amp;');

  // 2. Neutralize any embedded `<hook_context ...>` / `</hook_context ...>`
  //    tags case-insensitively so the payload cannot terminate or forge
  //    the wrapper. We match `<` optionally followed by `/`, the literal
  //    `hook_context`, and everything up to (but not including) the next
  //    `>`. The captured group is emitted verbatim between escaped angle
  //    brackets so a caller can still see what was quarantined.
  safe = safe.replace(/<(\/?hook_context[^>]*)>/gi, '&lt;$1&gt;');

  // 3. Escape attribute delimiters and remaining angle brackets. Order
  //    does not matter here because none of the replacement strings
  //    contain `"`, `<`, or `>`.
  safe = safe.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return safe;
}
