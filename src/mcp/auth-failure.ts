/**
 * MCP auth-failure classification.
 *
 * Ports upstream kilocode `21ed2b9e` and `c9632e495` ("consolidate MCP
 * OAuth in core"). When an MCP tool call or connect attempt fails
 * with an HTTP 401/403, the error is better surfaced as a structured
 * auth failure so the CLI can offer actionable guidance ("run
 * `alexi mcp login <server>`", "token expired, re-authenticate",
 * "server forbids this credential") rather than a generic transport
 * error.
 *
 * The classifier is deliberately pure: it inspects an unknown error
 * value, extracts status + headers via best-effort reflection, and
 * returns either an {@link McpAuthFailure} record or `null` when the
 * error is not an auth failure. Non-auth errors keep flowing through
 * the existing transport-error pipeline unchanged.
 *
 * SAP AI Core's own transport does NOT use OAuth; this surface is
 * only exercised when an operator wires a third-party OAuth-protected
 * MCP server (e.g. GitHub, Linear) into Alexi's MCP client. Keeping
 * the classifier here lets Alexi stay transport-agnostic.
 */

/**
 * Kind of auth failure reported to higher layers. UIs can branch on
 * `kind` to pick a specific remediation hint; CLI tools can map every
 * kind to a single "please re-authenticate" message.
 */
export type McpAuthFailureKind = 'oauth-required' | 'token-expired' | 'forbidden' | 'unknown-auth';

export interface McpAuthFailure {
  /** Classification bucket — see {@link McpAuthFailureKind}. */
  kind: McpAuthFailureKind;
  /** Server id the failure is attributed to (free-form; usually the config `name`). */
  serverId: string;
  /** Human-readable message suitable for direct CLI output. */
  message: string;
  /** Original error object, carried through for diagnostic logging. */
  cause?: unknown;
}

/**
 * Narrow an unknown error to an HTTP status code when possible.
 *
 * Supports the three shapes we see in practice:
 *   - `error.status` (axios, undici, fetch Response)
 *   - `error.response.status` (axios error with response)
 *   - `error.cause.status` (undici dispatched errors)
 * Anything else returns `undefined`.
 */
export function extractHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  const e = error as Record<string, unknown>;
  if (typeof e.status === 'number') {
    return e.status;
  }
  if (typeof e.statusCode === 'number') {
    return e.statusCode;
  }
  const response = e.response as Record<string, unknown> | undefined;
  if (response && typeof response.status === 'number') {
    return response.status;
  }
  const cause = e.cause as Record<string, unknown> | undefined;
  if (cause && typeof cause.status === 'number') {
    return cause.status;
  }
  // Fallback: scan the message for a leading "401" / "403".
  if (typeof e.message === 'string') {
    const match = /\b(4\d{2})\b/.exec(e.message);
    if (match) {
      const code = Number(match[1]);
      if (code >= 400 && code < 500) {
        return code;
      }
    }
  }
  return undefined;
}

/**
 * Best-effort case-insensitive header lookup on an error object.
 *
 * Checks `error.headers`, `error.response.headers`, and
 * `error.cause.headers`. Supports both plain-object header bags and
 * `Headers`-like objects (anything exposing a `.get(name)` method).
 */
export function extractHeader(error: unknown, name: string): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  const lower = name.toLowerCase();
  const candidates: unknown[] = [];
  const e = error as Record<string, unknown>;
  candidates.push(e.headers);
  const response = e.response as Record<string, unknown> | undefined;
  if (response) {
    candidates.push(response.headers);
  }
  const cause = e.cause as Record<string, unknown> | undefined;
  if (cause) {
    candidates.push(cause.headers);
  }
  for (const bag of candidates) {
    if (!bag || typeof bag !== 'object') {
      continue;
    }
    // Headers-like: has a .get method.
    const getter = (bag as { get?: unknown }).get;
    if (typeof getter === 'function') {
      try {
        const value = (getter as (n: string) => unknown).call(bag, name);
        if (typeof value === 'string') {
          return value;
        }
      } catch {
        // Fall through to plain-object lookup.
      }
    }
    for (const [k, v] of Object.entries(bag as Record<string, unknown>)) {
      if (k.toLowerCase() === lower && typeof v === 'string') {
        return v;
      }
    }
  }
  return undefined;
}

/**
 * Classify an unknown MCP error as an auth failure, or return `null`
 * when the error is not auth-related.
 *
 * Rules (match upstream kilocode behaviour):
 *   - HTTP 401 + `WWW-Authenticate` containing `oauth` or `bearer`
 *     ⇒ `oauth-required` (operator must sign in).
 *   - HTTP 401 otherwise ⇒ `token-expired` (cached token no longer
 *     valid; a refresh / re-login will fix it).
 *   - HTTP 403 ⇒ `forbidden` (credential is valid but lacks the
 *     required scope / role; operator fix, not a token refresh).
 *   - Everything else ⇒ `null` (not an auth failure).
 */
export function classifyAuthFailure(serverId: string, error: unknown): McpAuthFailure | null {
  const status = extractHttpStatus(error);
  if (status === 401) {
    const wwwAuth = extractHeader(error, 'www-authenticate') ?? '';
    if (/oauth|bearer/i.test(wwwAuth)) {
      return {
        kind: 'oauth-required',
        serverId,
        message: `MCP server "${serverId}" requires OAuth sign-in. Re-authenticate to continue.`,
        cause: error,
      };
    }
    return {
      kind: 'token-expired',
      serverId,
      message: `MCP server "${serverId}" auth token expired or invalid. Re-authenticate to continue.`,
      cause: error,
    };
  }
  if (status === 403) {
    return {
      kind: 'forbidden',
      serverId,
      message: `MCP server "${serverId}" denied access (403). Check scopes/permissions.`,
      cause: error,
    };
  }
  return null;
}

/**
 * Error subclass used to propagate an {@link McpAuthFailure} through
 * code that only accepts thrown errors. Preserves the structured
 * failure on `.failure` so callers can `instanceof` + pattern-match
 * without re-classifying.
 */
export class McpAuthError extends Error {
  readonly failure: McpAuthFailure;
  constructor(failure: McpAuthFailure) {
    super(failure.message);
    this.name = 'McpAuthError';
    this.failure = failure;
  }
}
