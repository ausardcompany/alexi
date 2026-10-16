/**
 * Surgical credential redaction for URLs and nested objects.
 *
 * This module complements the aggressive {@link scrubUrl} / {@link scrubUrlsFromString}
 * helpers in `./logger.js`. Where `scrubUrl` collapses the entire query string
 * to `?[REDACTED]`, {@link redactUrl} redacts only query parameters whose KEYS
 * match a credential-like pattern — the remaining non-sensitive parameters
 * (pagination, sort order, A/B flags, ...) are preserved verbatim so debug
 * output stays actionable. Hash fragments are redacted whole-or-nothing
 * because OAuth implicit-flow access tokens are expected to live there.
 *
 * {@link redactCredentials} is a recursive object-tree walker that replaces
 * any value whose KEY matches a credential-like pattern with `[REDACTED]`.
 * It is intended for logging MCP transport configs, provider auth state,
 * and similar structured payloads where field names reveal secrets.
 *
 * Carry-forward from 2026-10-08 upstream research: Cline PR addressing error
 * detail logging with URL redaction. OAuth tokens routinely surface in
 * provider error messages as `?code=...`, `?access_token=...`,
 * `?api_key=...`, and MCP server connection failures often include the full
 * transport config (`{ apiKey, authorization, headers: { Authorization } }`)
 * verbatim. Both must be redacted before any log line is emitted.
 */

/**
 * Case-insensitive regexes that identify URL query/hash parameter names
 * and object property names whose VALUES carry secrets. A match against
 * ANY pattern is sufficient to redact the value.
 *
 * These are intentionally conservative: match the parameter name only,
 * never free-form prose. Order is not significant.
 */
const SENSITIVE_KEY_PATTERNS: readonly RegExp[] = [
  /^token$/i,
  /token$/i, // access_token, id_token, refresh_token, bearer_token, ...
  /^code$/i, // OAuth authorization code
  /^(api[_-]?)?key$/i,
  /^secret$/i,
  /secret$/i, // client_secret, app_secret, ...
  /^password$/i,
  /^passwd$/i,
  /^pwd$/i,
  /^auth$/i,
  /authorization/i,
  /^credential$/i,
  /^credentials$/i,
  /^session[_-]?id$/i, // session hijacking vector
  /^signature$/i,
  /^sig$/i,
  // SAP AI Core / cloud specifics.
  /clientsecret/i,
  /client[_-]?secret/i,
  /serviceurl/i,
];

/**
 * Placeholder written in place of any redacted value. Exported so tests
 * and downstream consumers can assert on the exact replacement text.
 */
export const REDACTED = '[REDACTED]';

/**
 * Return `true` when the supplied name (query param or object key)
 * matches at least one sensitive pattern. Empty / non-string names are
 * treated as non-sensitive.
 */
export function isSensitiveKey(name: string): boolean {
  if (!name) {
    return false;
  }
  for (const pattern of SENSITIVE_KEY_PATTERNS) {
    if (pattern.test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Redact credential-like query parameters and hash fragments from a URL
 * while preserving everything else.
 *
 * Behaviour:
 *  1. Non-URL input is returned unchanged (safe to call on arbitrary strings).
 *  2. The scheme, host, port, and pathname are always preserved so operators
 *     can still see WHICH endpoint failed.
 *  3. Each query parameter is kept if its name is not credential-like; its
 *     value is replaced with `[REDACTED]` otherwise.
 *  4. A non-empty hash fragment is redacted whole (`#[REDACTED]`) because
 *     OAuth implicit-flow access tokens live there and the fragment is
 *     not structured as key=value in the general case.
 *
 * @example
 *   redactUrl('https://cb.example.com/callback?code=SECRET&state=xyz')
 *   // => 'https://cb.example.com/callback?code=[REDACTED]&state=xyz'
 *
 *   redactUrl('https://api.example.com/items?page=2&sort=asc')
 *   // => 'https://api.example.com/items?page=2&sort=asc' (unchanged)
 *
 *   redactUrl('https://cb.example.com/#access_token=xyz&token_type=bearer')
 *   // => 'https://cb.example.com/#[REDACTED]'
 *
 *   redactUrl('not a url')
 *   // => 'not a url'
 */
export function redactUrl(url: string): string {
  if (typeof url !== 'string' || url.length === 0) {
    return url;
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  // The URL constructor accepts any string with a `scheme:` prefix,
  // which means `ECONNRESET: socket hang up` and other error messages
  // parse "successfully". Guard with an explicit scheme allowlist so
  // we only touch real web URLs.
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return url;
  }

  // Fast path: no query, no hash → nothing to redact. Return the input
  // string verbatim so round-tripping does not add a trailing slash or
  // otherwise alter the shape (`https://host` must not become
  // `https://host/`).
  if (!parsed.search && !parsed.hash) {
    return url;
  }

  // Scan query parameters for any that look sensitive. If none do and
  // the hash is empty, return the input unchanged — same reasoning as
  // the fast path above.
  const hasSensitiveParam = Array.from(parsed.searchParams.keys()).some(isSensitiveKey);
  if (!parsed.hash && !hasSensitiveParam) {
    return url;
  }

  // Walk query parameters, redact values whose keys look sensitive.
  // We build the search string manually (not via URLSearchParams) so the
  // `[REDACTED]` placeholder does not get percent-encoded to
  // `%5BREDACTED%5D`, which would be unreadable in log output. Keys and
  // non-redacted values ARE re-encoded via `encodeURIComponent` so a
  // round-tripped URL remains syntactically valid.
  let search = '';
  if (parsed.searchParams.size > 0) {
    const parts: string[] = [];
    for (const [key, value] of parsed.searchParams.entries()) {
      const encodedKey = encodeURIComponent(key);
      if (isSensitiveKey(key)) {
        parts.push(`${encodedKey}=${REDACTED}`);
      } else {
        parts.push(`${encodedKey}=${encodeURIComponent(value)}`);
      }
    }
    search = `?${parts.join('&')}`;
  }

  // Hash fragments: redact wholesale when present. Implicit-flow access
  // tokens are the dominant hash-payload shape in OAuth, and the fragment
  // is not always key=value, so we don't try to be surgical here.
  const hash = parsed.hash ? `#${REDACTED}` : '';

  return `${parsed.origin}${parsed.pathname}${search}${hash}`;
}

/**
 * Recursively walk `value` and return a structurally equivalent copy in
 * which any property whose KEY matches a sensitive pattern has its value
 * replaced with `[REDACTED]`.
 *
 * - Primitives (string, number, boolean, null, undefined, bigint, symbol)
 *   are returned unchanged.
 * - Arrays are walked element-wise and returned as a new array.
 * - Plain objects are walked key-by-key. Keys that look sensitive have
 *   their values replaced with `[REDACTED]`; other keys are recursed.
 * - `Date`, `URL`, `RegExp`, `Error`, and other non-plain objects are
 *   returned as-is (not walked) to avoid clobbering their shape.
 *
 * The returned value is a deep-cloned tree for plain-object branches;
 * callers can mutate it safely. Circular object graphs are not supported
 * and will throw a `RangeError` from the JS engine — sanitize before
 * calling if you are not sure.
 *
 * @example
 *   redactCredentials({ apiKey: 'SECRET', endpoint: 'https://example.com' })
 *   // => { apiKey: '[REDACTED]', endpoint: 'https://example.com' }
 *
 *   redactCredentials({ nested: { authorization: 'Bearer abc', ok: true } })
 *   // => { nested: { authorization: '[REDACTED]', ok: true } }
 */
export function redactCredentials(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean' || t === 'bigint' || t === 'symbol') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactCredentials(item));
  }
  if (t !== 'object') {
    return value;
  }
  // Only walk plain objects (prototype === Object.prototype or null).
  // Non-plain objects (Date, URL, RegExp, Error, Map, Set, Buffer, ...)
  // are returned as-is to avoid stripping their constructor identity.
  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype) {
    return value;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (isSensitiveKey(k)) {
      out[k] = REDACTED;
    } else {
      out[k] = redactCredentials(v);
    }
  }
  return out;
}
