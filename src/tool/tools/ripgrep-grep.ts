/**
 * Ripgrep JSON-event text extraction.
 *
 * Ports upstream kilocode `0e6da3104` / `31906a56b`: ripgrep emits
 * `{text}` for UTF-8 content and `{bytes}` (base64) when the content
 * contains invalid-UTF-8 sequences (Latin-1 blobs, GBK snippets,
 * mojibake). Previously Alexi's grep fast-path discarded `{bytes}`
 * matches entirely, which meant a grep against a repository that
 * contained even one Latin-1 file silently dropped matches.
 *
 * The upstream fix decodes `{bytes}` as lossy UTF-8 so the match is
 * surfaced with `U+FFFD` replacement characters rather than being
 * silently dropped. This mirrors the behaviour of `rg --encoding
 * none` + the default replacement codec that most users would observe
 * if they ran ripgrep interactively.
 *
 * SAP AI Core note: outputs flow through the LLM API as JSON strings.
 * `U+FFFD` is a valid Unicode scalar, so a decoded match is safely
 * JSON-encodable; a raw `Buffer` would not be.
 */

/**
 * The two shapes ripgrep uses for the `data.path`, `data.lines`, and
 * `data.submatches[].match` fields inside a `--json` event.
 *
 * Permissive on purpose: ripgrep's JSON schema says exactly one of the
 * two keys is present, but downstream type decoders often model both
 * as optional. The accessor below tolerates either shape.
 */
export interface RgArbitraryData {
  text?: string;
  bytes?: string;
}

/**
 * Normalise a ripgrep `{text}` | `{bytes}` field to a plain string.
 *
 * - `{text}` is passed through verbatim.
 * - `{bytes}` is base64-decoded, then decoded as UTF-8 with lossy
 *   replacement (`U+FFFD`) so a mixed-encoding file surfaces a
 *   best-effort preview instead of being dropped.
 * - Any other shape returns `undefined`; callers should treat this as
 *   "ripgrep emitted a shape we do not understand" and skip the entry.
 */
export function extractText(data: RgArbitraryData | undefined | null): string | undefined {
  if (data == null || typeof data !== 'object') {
    return undefined;
  }
  if (typeof data.text === 'string') {
    return data.text;
  }
  if (typeof data.bytes === 'string') {
    // Node's Buffer defaults to lossy UTF-8 decoding, which replaces
    // invalid sequences with U+FFFD. This matches ripgrep's own
    // behaviour when invoked without `--encoding none` + explicit
    // codec, so operators see the same substitution they would from
    // running `rg` at the shell.
    try {
      return Buffer.from(data.bytes, 'base64').toString('utf8');
    } catch {
      return undefined;
    }
  }
  return undefined;
}
