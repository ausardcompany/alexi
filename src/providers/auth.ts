/**
 * Provider Authentication Error Types + OAuth refresh flow.
 *
 * Two families of concerns live here:
 *
 *  1. Typed errors mapped from provider auth failures. These are used by
 *     `parseAuthError` to normalise upstream messages into a shape the
 *     TUI / router / logger can reason about. Each error class carries
 *     the provider id and, when relevant, a machine-readable field like
 *     `retryAfter` so the caller does not have to re-parse the message.
 *
 *  2. `refreshAccessToken`, the OAuth refresh flow. When an access token
 *     expires mid-session, callers invoke this instead of surfacing a
 *     hard failure to the user. It looks up a stored `refreshToken` in
 *     the connector store, POSTs `grant_type=refresh_token` to the
 *     configured token endpoint, updates the store atomically, emits a
 *     `TokenRefreshed` bus event, and returns the new bearer.
 *
 * Two new error classes support the flow:
 *
 *   - `NoRefreshTokenError` — thrown when no connector state exists or
 *     no `refreshToken` is stored. Classified as *permanent* — the
 *     caller cannot recover by retrying the same call; the user must
 *     run `alexi login`.
 *   - `ReauthenticationRequiredError` — thrown when the OAuth server
 *     rejects the refresh (invalid / revoked refresh token). Also
 *     *permanent* — the refresh token is dead, the user must re-login.
 *
 * Both are marked non-retryable via `isPermanentAuthError()` so the
 * `ErrorBackoff` / route-retry layers do not spend budget on them.
 */

import { getConnectorStore, saveConnectorState, type ConnectorState } from './connectorStore.js';
import { TokenRefreshed } from '../bus/index.js';
import { saveToken } from '../utils/tokenStorage.js';
import { getConfigPersistAuthTokens } from '../config/userConfig.js';

export class AuthError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Invalid credentials for provider: ${provider}`, provider, cause);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenExpiredError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Authentication token expired for provider: ${provider}`, provider, cause);
    this.name = 'TokenExpiredError';
  }
}

export class MissingCredentialsError extends AuthError {
  constructor(
    provider: string,
    readonly missingFields: string[]
  ) {
    super(`Missing credentials for provider ${provider}: ${missingFields.join(', ')}`, provider);
    this.name = 'MissingCredentialsError';
  }
}

export class NetworkError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(`Network error while authenticating with provider: ${provider}`, provider, cause);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends AuthError {
  constructor(
    provider: string,
    readonly retryAfter?: number,
    cause?: unknown
  ) {
    const retryMsg = retryAfter ? ` Retry after ${retryAfter} seconds.` : '';
    super(`Rate limit exceeded for provider: ${provider}.${retryMsg}`, provider, cause);
    this.name = 'RateLimitError';
  }
}

export class StartupTimeoutError extends AuthError {
  constructor(provider: string, detail?: string, cause?: unknown) {
    const msg = detail
      ? `Startup connectivity check failed for provider ${provider}: ${detail}`
      : `Startup connectivity check failed for provider: ${provider}`;
    super(msg, provider, cause);
    this.name = 'StartupTimeoutError';
  }
}

/**
 * Thrown by `refreshAccessToken` when the connector store has no entry
 * for the requested provider, or the entry has no `refreshToken`.
 *
 * Semantics: *permanent* failure. The refresh flow cannot succeed
 * without a stored refresh token; the operator must re-authenticate.
 * See `isPermanentAuthError()` — this class returns `true`.
 */
export class NoRefreshTokenError extends AuthError {
  constructor(provider: string) {
    super(
      `No stored refresh token for provider '${provider}'. ` +
        'Session expired. Run `alexi login` to re-authenticate.',
      provider
    );
    this.name = 'NoRefreshTokenError';
  }
}

/**
 * Thrown when the OAuth server rejects the refresh request (typically
 * because the refresh token was revoked, invalidated by policy, or
 * belongs to a different tenant). The message is intentionally
 * user-facing — the CLI surfaces it verbatim.
 *
 * Semantics: *permanent* failure. Retrying with the same refresh token
 * will produce the same rejection; the operator must re-authenticate.
 */
export class ReauthenticationRequiredError extends AuthError {
  constructor(provider: string, cause?: unknown) {
    super(
      `Session expired. Run \`alexi login\` to re-authenticate (provider: ${provider}).`,
      provider,
      cause
    );
    this.name = 'ReauthenticationRequiredError';
  }
}

/**
 * Return `true` when the given error means the caller must not retry
 * — either because the credential material itself is unrecoverable
 * (`NoRefreshTokenError`, `ReauthenticationRequiredError`) or because
 * the credentials are structurally invalid (`InvalidCredentialsError`,
 * `MissingCredentialsError`). `TokenExpiredError` is NOT permanent
 * here — the refresh flow may still rescue it.
 */
export function isPermanentAuthError(err: unknown): boolean {
  return (
    err instanceof NoRefreshTokenError ||
    err instanceof ReauthenticationRequiredError ||
    err instanceof InvalidCredentialsError ||
    err instanceof MissingCredentialsError
  );
}

/**
 * Parse error response and return appropriate typed error
 */
export function parseAuthError(error: unknown, provider: string): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('invalid') && lowerMessage.includes('credential')) {
    return new InvalidCredentialsError(provider, error);
  }

  if (lowerMessage.includes('expired') || lowerMessage.includes('token')) {
    return new TokenExpiredError(provider, error);
  }

  if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests')) {
    return new RateLimitError(provider, undefined, error);
  }

  if (lowerMessage.includes('startup') && lowerMessage.includes('timeout')) {
    return new StartupTimeoutError(provider, message, error);
  }

  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('timeout')
  ) {
    return new NetworkError(provider, error);
  }

  return new AuthError(message, provider, error);
}

// ============================================================================
// OAuth refresh flow
// ============================================================================

/**
 * Result returned by `refreshAccessToken` after a successful refresh.
 * `expiry` is a Unix epoch millisecond timestamp.
 */
export interface RefreshedToken {
  accessToken: string;
  expiry: number;
}

/**
 * Injection point for the HTTP client used by `refreshAccessToken`.
 *
 * We inject rather than reach for `globalThis.fetch` directly so tests
 * can stub the OAuth endpoint deterministically without polluting the
 * global. Consumers that want the built-in `fetch` simply omit the
 * argument.
 */
export type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }
) => Promise<{
  ok: boolean;
  status: number;
  statusText?: string;
  text(): Promise<string>;
}>;

/**
 * Options for `refreshAccessToken`. `fetchImpl` and `now` are test
 * seams; production callers omit both.
 */
export interface RefreshOptions {
  /** Override the HTTP client (test seam). */
  fetchImpl?: FetchLike;
  /** Override the wall clock (test seam). */
  now?: () => number;
}

/**
 * Parse a token endpoint response body into `{ access_token, expires_in }`.
 * The OAuth 2.0 spec requires JSON with these fields; some providers add
 * `refresh_token` (rotation) which we honour by storing it back into the
 * connector state on the next `set()`.
 */
interface TokenResponseShape {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

function parseTokenResponse(raw: string, provider: string): TokenResponseShape {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new AuthError(`Token endpoint returned non-JSON response`, provider, err);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new AuthError('Token endpoint response was not an object', provider);
  }
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.access_token !== 'string' || obj.access_token.length === 0) {
    throw new AuthError('Token endpoint response missing access_token', provider);
  }
  if (typeof obj.expires_in !== 'number') {
    throw new AuthError('Token endpoint response missing numeric expires_in', provider);
  }
  const out: TokenResponseShape = {
    access_token: obj.access_token,
    expires_in: obj.expires_in,
  };
  if (typeof obj.refresh_token === 'string' && obj.refresh_token.length > 0) {
    out.refresh_token = obj.refresh_token;
  }
  return out;
}

/**
 * Refresh an expired OAuth access token using the stored refresh token.
 *
 * Flow:
 *  1. Load `ConnectorState` from the connector store for `providerId`.
 *     If the entry is missing or has no `refreshToken`, throw
 *     `NoRefreshTokenError` immediately — no HTTP call is attempted.
 *  2. POST `grant_type=refresh_token&refresh_token=<token>` to the
 *     stored `tokenEndpoint` with `application/x-www-form-urlencoded`.
 *  3. On a 4xx response (invalid_grant, expired refresh token, etc.):
 *     throw `ReauthenticationRequiredError`. The operator must
 *     re-authenticate; retrying with the same refresh token is
 *     guaranteed to fail again.
 *  4. On a non-4xx failure (500, network error, malformed body): throw
 *     `AuthError`. These may be transient and the caller's error-backoff
 *     layer can decide to retry.
 *  5. On success: update the connector store with the new
 *     `accessToken`, computed `expiry`, and (if the server rotated it)
 *     new `refreshToken`. Emit `TokenRefreshed`. Return the new bearer.
 *
 * The refresh flow itself does NOT retry — the caller (typically
 * `sapOrchestration.ts`) will retry the original request once with the
 * new token. Nesting a retry loop inside `refreshAccessToken` would
 * risk multiplying budget across layers.
 */
export async function refreshAccessToken(
  providerId: string,
  options: RefreshOptions = {}
): Promise<RefreshedToken> {
  const store = getConnectorStore();
  const state = await store.get(providerId);

  if (!state) {
    throw new NoRefreshTokenError(providerId);
  }
  if (!state.refreshToken || state.refreshToken.length === 0) {
    throw new NoRefreshTokenError(providerId);
  }
  if (!state.tokenEndpoint) {
    throw new AuthError(
      `Connector for '${providerId}' has a refresh token but no tokenEndpoint`,
      providerId
    );
  }

  const now = options.now ?? Date.now;
  const fetchImpl: FetchLike =
    options.fetchImpl ?? ((input, init) => fetch(input, init) as unknown as ReturnType<FetchLike>);

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', state.refreshToken);
  if (state.clientId) {
    body.set('client_id', state.clientId);
  }
  if (state.clientSecret) {
    body.set('client_secret', state.clientSecret);
  }

  let response: Awaited<ReturnType<FetchLike>>;
  try {
    response = await fetchImpl(state.tokenEndpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      body: body.toString(),
    });
  } catch (err) {
    // Network-level failure — do NOT classify as permanent. Let the
    // caller's backoff layer decide.
    throw new NetworkError(providerId, err);
  }

  if (!response.ok) {
    // OAuth spec: a 4xx (typically 400 invalid_grant or 401) on the
    // token endpoint means the refresh token is dead. Anything else
    // (5xx) is a transient server issue.
    if (response.status >= 400 && response.status < 500) {
      const detail = await response.text().catch(() => response.statusText ?? '');
      throw new ReauthenticationRequiredError(providerId, detail);
    }
    throw new AuthError(
      `Token endpoint returned status ${response.status}`,
      providerId,
      response.statusText
    );
  }

  const rawBody = await response.text();
  const parsed = parseTokenResponse(rawBody, providerId);

  // `expires_in` is delivered in seconds per RFC 6749. Convert to a
  // wall-clock millisecond expiry so callers do not have to know the
  // unit convention.
  const expiry = now() + parsed.expires_in * 1000;

  const nextState: ConnectorState = {
    ...state,
    accessToken: parsed.access_token,
    expiry,
  };
  if (parsed.refresh_token) {
    nextState.refreshToken = parsed.refresh_token;
  }
  await store.set(providerId, nextState);

  // Persist the refreshed token to the on-disk token cache so a new
  // Alexi process can reuse it without paying the refresh round-trip.
  // Failures here are non-fatal -- the in-memory connector store still
  // has the fresh token, and the caller can complete the current
  // request. See `src/utils/tokenStorage.ts` for the file format.
  if (getConfigPersistAuthTokens()) {
    try {
      await saveToken(providerId, parsed.access_token, expiry);
    } catch {
      // Ignore disk write errors (permissions, out-of-space). The
      // token is already in the in-memory connector store, so the
      // current invocation continues; only cross-process reuse is
      // lost, which is a soft-fail we accept.
    }

    // Also persist the broader connector state (refresh token +
    // access token + expiry) to `~/.alexi/connectors.json` so the
    // next session can skip re-authentication entirely. Failures
    // here are non-fatal for the same reason as the `saveToken`
    // path above: the in-memory store already has the fresh
    // credentials, so the current invocation succeeds regardless.
    try {
      await saveConnectorState({ [providerId]: nextState });
    } catch {
      // Non-fatal — see comment above.
    }
  }

  TokenRefreshed.publish({
    providerId,
    expiry,
    timestamp: now(),
  });

  return { accessToken: parsed.access_token, expiry };
}

/**
 * Classify a thrown error as "the caller should attempt a token
 * refresh". The heuristic mirrors `classifyProviderError`'s auth
 * branch: any wrapped error carrying HTTP 401 or 403 counts. We keep
 * the check narrow (only status-based) so hooks that surface strings
 * containing the word "unauthorized" for unrelated reasons do not
 * trigger a refresh.
 */
export function isTokenExpiredError(err: unknown): boolean {
  if (err === null || err === undefined) {
    return false;
  }
  if (err instanceof TokenExpiredError) {
    return true;
  }
  const obj = err as { status?: unknown; statusCode?: unknown; response?: unknown };
  const status = typeof obj.status === 'number' ? obj.status : undefined;
  const statusCode = typeof obj.statusCode === 'number' ? obj.statusCode : undefined;
  const responseStatus =
    obj.response && typeof obj.response === 'object'
      ? ((obj.response as { status?: unknown }).status as unknown)
      : undefined;
  const s =
    status ?? statusCode ?? (typeof responseStatus === 'number' ? responseStatus : undefined);
  return s === 401 || s === 403;
}
