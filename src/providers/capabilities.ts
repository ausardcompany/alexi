/**
 * Fail-open capability list helpers.
 *
 * A model's capability list can be in three observable states:
 *
 *   1. `undefined` — no metadata authored (unknown).
 *   2. `[]` — an empty declared list.
 *   3. `[...capabilities]` — a non-empty declared list.
 *
 * Cline's session-runtime bug (PR #13583) treated states 1 and 2 as
 * "definitively lacks every capability", so a model whose catalog entry
 * happened to carry `capabilities: []` had image attachments silently
 * stripped by the file-read tool. The upstream fix collapsed states 1 and 2
 * into a single "unspecified" bucket that falls back to a caller-provided
 * default (fail-open for image input, fail-closed for reasoning, etc.).
 *
 * These helpers port that semantic to Alexi. They are intentionally generic
 * over `string[]` rather than the narrower provider-layer `ModelCapability`
 * union so the exact same primitives can be reused for:
 *
 *   - Router-layer `capabilities?: string[]` (see `src/core/router.ts`).
 *   - Session-runtime image-input gate (see the `modelSupportsImageInput`
 *     shortcut below).
 *   - Any future capability gate that reads from JSON metadata where the
 *     schema author cannot tell the difference between "we don't know" and
 *     "we deliberately said none".
 *
 * The specialised `modelHasCapability` in `src/providers/sapOrchestration.ts`
 * is NOT layered on top of these helpers on purpose: it operates over
 * Alexi-authored, in-code metadata where `capabilities: []` is an
 * intentional, tested "definitely no tools" declaration and callers pass
 * `assumeWhenUnspecified` to opt into fail-open for the "no entry at all"
 * case. That authoritative-catalog semantic is documented and locked in
 * with tests; do not route it through these fail-open helpers.
 */

/**
 * Return whether a capability list declares a given capability, treating
 * both `undefined` and empty `[]` as "unspecified" and returning
 * `defaultValue` in that case.
 *
 * Resolution rules:
 *   1. If `capabilities` is `undefined` or an empty array, return
 *      `defaultValue`. Empty is fail-open, matching Cline PR #13583.
 *   2. Otherwise return `capabilities.includes(capability)`.
 *
 * The default of `false` mirrors the safe fail-closed choice for feature
 * gates that should stay off unless a model explicitly advertises support.
 * Callers who want fail-open behaviour (e.g. attachments should be
 * forwarded unless we KNOW the model rejects them) pass `defaultValue: true`
 * — the `modelSupportsImageInput` shortcut below wraps that pattern.
 *
 * @param capabilities - Declared capability list from catalog metadata.
 * @param capability - Capability tag to look up (case-sensitive).
 * @param defaultValue - Value to return when `capabilities` is unspecified.
 *   Defaults to `false`.
 */
export function declaredCapability(
  capabilities: readonly string[] | undefined,
  capability: string,
  defaultValue = false
): boolean {
  if (capabilities === undefined || capabilities.length === 0) {
    return defaultValue;
  }
  return capabilities.includes(capability);
}

/**
 * Return whether a model with the given capability list should be treated
 * as accepting image input. Fail-open: unspecified metadata means
 * "forward the image and let the provider reject it if necessary" rather
 * than "silently strip attachments".
 *
 * This is the direct port of Cline's `modelSupportsImages` helper from
 * PR #13583. It exists so the file-read tool and any other multimodal
 * pathway cannot regress into the empty-list trap by re-inlining
 * `capabilities?.includes('images') ?? true` — a pattern that fails for
 * `capabilities: []` because nullish-coalescing does not fire on a
 * non-null empty array.
 *
 * The check is intentionally string-based (not a typed capability enum) so
 * it can be evaluated against router-config metadata whose schema is
 * intentionally loose. Callers with a typed provider-layer catalog should
 * continue to use `modelHasCapability` from `sapOrchestration.ts`.
 *
 * @param capabilities - Declared capability list from catalog metadata.
 * @param defaultValue - Fallback when metadata is unspecified. Defaults
 *   to `true` (fail-open) to preserve attachments for models that have
 *   not authored capability data yet.
 */
export function modelSupportsImageInput(
  capabilities: readonly string[] | undefined,
  defaultValue = true
): boolean {
  return declaredCapability(capabilities, 'images', defaultValue);
}
