/**
 * Credential redaction for CLI debug output.
 *
 * Ports opencode PR #50956 (commit `82d4c89 fix(opencode): redact credentials
 * in debug config`). `alexi debug config` and other diagnostic commands
 * previously dumped the raw environment / service-key JSON, leaking API keys,
 * SAP AI Core client secrets, bearer tokens, and OAuth tokens into log
 * artefacts or shared bug reports.
 *
 * This module exposes a single `redact()` helper that walks an arbitrary
 * value (object, array, string, primitive) and replaces any value whose
 * KEY matches one of the known secret patterns with `'[REDACTED]'`. The
 * walker is intentionally conservative — it only inspects key names, not
 * string contents, to avoid mangling legitimate configuration that happens
 * to contain the word "key" in prose.
 *
 * SAP AI Core specifics
 * ---------------------
 * `AICORE_SERVICE_KEY` is a JSON blob containing `clientid`, `clientsecret`,
 * `url`, `identityzone`, and other tenant-identifying fields. The regex list
 * below covers `clientsecret`, `client_secret`, tokens, passwords, API keys,
 * and generic `authorization`/`credential` fields so the entire service key
 * is masked when nested inside a `debug config` dump.
 */

/**
 * Regex patterns that identify object keys whose VALUES must be redacted.
 *
 * Ordering is not significant — a match against any pattern is sufficient.
 * All patterns are case-insensitive.
 */
const SECRET_KEY_PATTERNS: readonly RegExp[] = [
  /api[_-]?key/i,
  /secret/i,
  /token/i,
  /password/i,
  /credential/i,
  /authorization/i,
  /client[_-]?secret/i,
  // SAP-specific — AICORE_SERVICE_KEY nested fields.
  /clientsecret/i,
  /serviceurl/i,
];

/**
 * Placeholder written in place of any redacted value. Kept as a single
 * exported constant so tests and downstream consumers can assert on the
 * exact replacement text.
 */
export const REDACTED = '[REDACTED]';

/**
 * Returns `true` when the supplied object key matches at least one secret
 * pattern. Non-string keys are treated as non-secret (e.g., array indices).
 */
export function isSecretKey(key: string): boolean {
  for (const pattern of SECRET_KEY_PATTERNS) {
    if (pattern.test(key)) {
      return true;
    }
  }
  return false;
}

/**
 * Recursively walk `value` and return a structurally equivalent copy in
 * which any property whose KEY matches a secret pattern has its value
 * replaced with `REDACTED`. Arrays are walked element-wise. Primitives
 * (strings, numbers, booleans, null, undefined) are returned unchanged.
 *
 * The returned value is a deep-cloned tree — callers can safely mutate it
 * without affecting the input. Circular structures are not supported (and
 * are not expected in a config dump); passing one will throw a
 * `RangeError` from the JS engine, which is the caller's cue to sanitize
 * the input before calling `redact`.
 */
export function redact(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redact(item));
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isSecretKey(k)) {
        out[k] = REDACTED;
      } else {
        out[k] = redact(v);
      }
    }
    return out;
  }
  return value;
}
