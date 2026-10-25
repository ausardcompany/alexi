/**
 * Error Backoff System
 * Circuit breaker and exponential backoff for handling API errors gracefully
 */

export interface BackoffConfig {
  initialDelayMs: number;
  maxDelayMs: number;
  multiplier: number;
  maxRetries: number;
}

/**
 * Machine-readable error code for free-tier rate limits. Duplicated as a
 * string constant here (rather than imported from `src/providers/`) to keep
 * `src/core/**` free of a hard dependency on the providers layer — providers
 * are upstream of core in the dependency graph.
 *
 * Kept in sync with `FREE_TIER_RATE_LIMIT_CODE` in
 * `src/providers/sapOrchestration.ts`.
 */
const FREE_TIER_RATE_LIMIT_CODE = 'free_tier_rate_limit';

/**
 * Machine-readable error code for paid-tier rate limits. Same duplication
 * rationale as {@link FREE_TIER_RATE_LIMIT_CODE}. Kept in sync with
 * `PROVIDER_RATE_LIMIT_CODE` in `src/providers/sapOrchestration.ts`.
 */
const PROVIDER_RATE_LIMIT_CODE = 'provider_rate_limit';

/**
 * Machine-readable error code for content-filter policy rejections.
 * Duplicated here (rather than imported from `src/providers/`) for the
 * same layering reason as the rate-limit codes above.
 *
 * Kept in sync with `CONTENT_FILTER_ERROR_CODE` in
 * `src/providers/sapOrchestration.ts`. See issue #1903.
 */
const CONTENT_FILTER_ERROR_CODE = 'content_filter';

/**
 * Return true when `err` carries the content-filter marker. Matches on
 * the machine-readable `code` or the class `name` so detection survives
 * cross-module re-imports (identity `instanceof` checks fail when the
 * providers module has been loaded twice, e.g. by vitest workers).
 *
 * A content-filter rejection is PERMANENT per the AGENTS.md error
 * contract: the provider's content policy blocked the request, and
 * retrying the same prompt will hit the same block. See issue #1903.
 */
export function isContentFilterError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { code?: unknown; name?: unknown };
  if (candidate.code === CONTENT_FILTER_ERROR_CODE) {
    return true;
  }
  return candidate.name === 'ContentFilterError';
}

/**
 * Message substrings that unambiguously name a content policy / safety
 * filter rejection in provider error payloads. Case-insensitive match.
 *
 * The list intentionally mirrors upstream opencode PR #58544 (OpenAI
 * image moderation classified as `content_policy` instead of a generic
 * error) and the AGENTS.md error-classification taxonomy: these
 * rejections are PERMANENT and must not be retried.
 *
 * We bracket `moderation` and `safety` with word boundaries to reduce
 * false positives (e.g. unrelated 5xx messages that happen to contain
 * the substrings `safety-related` or `moderation-note` in telemetry).
 */
const CONTENT_POLICY_MESSAGE_RE =
  /\bmoderation\b|content[_\s-]filter|content[_\s-]policy|\bsafety filter\b|\bsafety setting|safety_rating|\bsafety\b/i;

/**
 * Broader structural check for a provider content-policy violation.
 *
 * Supersedes {@link isContentFilterError} by also catching shapes the
 * `ContentFilterError` class does not wrap: raw provider error payloads
 * that leak through before orchestrator-level mapping, string-only
 * errors from the raw `fetch` layer, and the standardised HTTP 451
 * ("Unavailable For Legal Reasons" — reused by OpenAI for moderation
 * blocks). All three provider families covered:
 *
 *   - OpenAI: `error.type === 'moderation'`, `error.code ===
 *     'content_policy_violation'`, HTTP 451.
 *   - Google: `finishReason === 'SAFETY'`, `promptFeedback.blockReason`.
 *   - Anthropic: `error_type === 'content_policy'`, `type ===
 *     'invalid_request_error'` with a content_policy message.
 *
 * A content-policy rejection is PERMANENT per the AGENTS.md error
 * contract (same bucket as content-filter): retrying the same prompt
 * will hit the same block. `ErrorBackoff.recordError` and
 * `ErrorBackoff.isFatal` consume this helper to short-circuit the
 * retry loop.
 */
export function isContentPolicyError(err: unknown): boolean {
  if (isContentFilterError(err)) {
    return true;
  }
  if (err === null || err === undefined) {
    return false;
  }
  if (typeof err === 'string') {
    return CONTENT_POLICY_MESSAGE_RE.test(err);
  }
  if (typeof err !== 'object') {
    return false;
  }
  const candidate = err as {
    message?: unknown;
    status?: unknown;
    statusCode?: unknown;
    type?: unknown;
    error_type?: unknown;
    finishReason?: unknown;
    error?: unknown;
    promptFeedback?: unknown;
  };
  // HTTP 451 — Unavailable For Legal Reasons; reused by OpenAI for
  // content moderation blocks.
  const status =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : undefined;
  if (status === 451) {
    return true;
  }
  // Direct provider markers.
  if (candidate.type === 'moderation' || candidate.type === 'content_policy_violation') {
    return true;
  }
  if (candidate.error_type === 'content_policy') {
    return true;
  }
  // Google: finishReason === 'SAFETY'.
  if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'content-filter') {
    return true;
  }
  // Nested OpenAI error envelope: { error: { type: 'moderation', ... } }.
  if (candidate.error && typeof candidate.error === 'object') {
    const nested = candidate.error as { type?: unknown; code?: unknown };
    if (nested.type === 'moderation' || nested.code === 'content_policy_violation') {
      return true;
    }
  }
  // Google promptFeedback.blockReason === 'SAFETY'.
  if (candidate.promptFeedback && typeof candidate.promptFeedback === 'object') {
    const blockReason = (candidate.promptFeedback as { blockReason?: unknown }).blockReason;
    if (blockReason === 'SAFETY' || blockReason === 'OTHER') {
      return true;
    }
  }
  // Message-based fallback — the last line of defence for raw string
  // errors wrapped in Error objects without structured fields.
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  if (message.length > 0 && CONTENT_POLICY_MESSAGE_RE.test(message)) {
    return true;
  }
  return false;
}

/**
 * Return true when `err` carries the free-tier rate-limit marker. Matches
 * either the `code` property (set by `FreeTierRateLimitError`) or the
 * class `name` — the latter keeps the check working across module-boundary
 * re-imports in tests (a common issue when multiple copies of the
 * provider module coexist under vitest workers).
 */
function isFreeTierRateLimitError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { code?: unknown; name?: unknown };
  if (candidate.code === FREE_TIER_RATE_LIMIT_CODE) {
    return true;
  }
  return candidate.name === 'FreeTierRateLimitError';
}

/**
 * Return true when `err` is a rate-limit error (either free-tier or the
 * generic paid-tier variant). Detection is structural — we match on
 * `code`, `name`, or a numeric `statusCode === 429` — so it survives
 * cross-module re-imports (identity `instanceof` checks fail when the
 * providers module has been loaded twice, e.g. by vitest workers).
 *
 * This is the coarse test callers use to decide whether to render the
 * user-friendly "rate limit reached" UX; use {@link ErrorBackoff.isFatal}
 * to separate the permanent free-tier variant from the transient
 * paid-tier one.
 */
export function isRateLimitError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { code?: unknown; name?: unknown; statusCode?: unknown };
  if (candidate.code === FREE_TIER_RATE_LIMIT_CODE || candidate.code === PROVIDER_RATE_LIMIT_CODE) {
    return true;
  }
  if (candidate.name === 'FreeTierRateLimitError' || candidate.name === 'ProviderRateLimitError') {
    return true;
  }
  return candidate.statusCode === 429;
}

/**
 * Message substrings that unambiguously name a provider-side throttling
 * condition. Case-insensitive match. Ported in spirit from SST OpenCode
 * PR #58866 — those projects keep "known throttles" out of overflow
 * compaction and generic 4xx fatal classification so rate-limit
 * responses retry with the correct delay instead of being treated as
 * permanent configuration errors.
 *
 * Phrases are deliberately conservative:
 *   - `rate limit` (optionally spaced) is the canonical substring.
 *   - `quota exceeded` is the standard phrasing for provider daily/
 *     per-minute caps.
 *   - `too many requests` is the HTTP 429 reason phrase, which some
 *     providers surface verbatim in the error message when the status
 *     code did not propagate through intermediate wrappers.
 */
const THROTTLE_MESSAGE_RE = /\brate\s*limit\b|\bquota\s+exceeded\b|too many requests/i;

/**
 * Return true when `err` is a *known throttle* — i.e. a rate-limit /
 * quota-exceeded response that must be treated as transient and not
 * folded into generic 4xx fatal classification or overflow compaction.
 *
 * Supersedes {@link isRateLimitError} by also catching:
 *   - string-only errors from the raw `fetch` layer (no `.statusCode`,
 *     no machine-readable `.code`, just a message).
 *   - errors whose only signal is a message substring (`rate limit`,
 *     `quota exceeded`, `too many requests`) — common when a provider
 *     SDK unwraps the response before reaching us.
 *   - errors nesting status under `response.status` (axios-style
 *     wrappers).
 *
 * This is the classifier used by {@link ErrorBackoff.isFatal} and
 * {@link classifyError} to short-circuit the fatal fallback path for
 * throttling signals. Both known-throttle variants (free-tier and paid)
 * are matched; callers that need to distinguish quota-exhausted
 * (permanent) from timing-throttled (transient) use the dedicated
 * `isFreeTierRateLimitError` helper on top of this check.
 */
export function isKnownThrottle(err: unknown): boolean {
  if (err === null || err === undefined) {
    return false;
  }
  if (typeof err === 'string') {
    return THROTTLE_MESSAGE_RE.test(err);
  }
  if (typeof err !== 'object') {
    return false;
  }
  const candidate = err as {
    code?: unknown;
    name?: unknown;
    message?: unknown;
  };
  if (candidate.code === FREE_TIER_RATE_LIMIT_CODE || candidate.code === PROVIDER_RATE_LIMIT_CODE) {
    return true;
  }
  if (candidate.name === 'FreeTierRateLimitError' || candidate.name === 'ProviderRateLimitError') {
    return true;
  }
  if (readStatus(err) === 429) {
    return true;
  }
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  if (message.length > 0 && THROTTLE_MESSAGE_RE.test(message)) {
    return true;
  }
  return false;
}

/**
 * Return true when `err` looks like an xAI capacity-exceeded error.
 *
 * Ported from opencode 71d08e9. xAI (and some SAP proxies fronting
 * xAI-family models) occasionally emits a mid-stream "capacity
 * exceeded" error that is semantically the same as a 5xx transient
 * overload — retrying with backoff clears it. Without this classifier
 * such errors are treated as permanent and surface to the user as a
 * hard failure.
 *
 * Detection is intentionally structural (message regex) because the
 * upstream API does not attach a stable machine-readable code. Callers
 * feed this through the retry loop alongside rate-limit checks.
 */
export function isXAICapacityError(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { message?: unknown };
  if (typeof candidate.message !== 'string') {
    return false;
  }
  return /xai.*capacity|capacity.*exceeded/i.test(candidate.message);
}

/**
 * Coarse "is this transient?" check consulted by higher-level retry
 * drivers. Currently returns true for rate limits and xAI capacity
 * errors; extend cautiously — a false positive here means real config
 * failures get retried and waste provider budget.
 */
export function isRetryableError(err: unknown): boolean {
  return isRateLimitError(err) || isXAICapacityError(err);
}

/**
 * Extract a `Retry-After` window from a rate-limit error and convert it to
 * milliseconds. Returns `undefined` when no header was captured — the
 * caller then falls back to the default exponential-backoff schedule.
 *
 * Two sources are consulted, in order:
 *   1. `retryAfterSeconds` (set by the constructors of
 *      `FreeTierRateLimitError` / `ProviderRateLimitError` from the
 *      `Retry-After` response header).
 *   2. `resetAt` (set from `X-RateLimit-Reset`). Only used when
 *      `retryAfterSeconds` is absent; converted to a positive delta from
 *      the current wall-clock. A past reset time collapses to 0
 *      (retry-immediately).
 *
 * We intentionally do NOT re-parse raw headers here — that parsing
 * belongs to the providers layer where the raw response is still
 * available.
 *
 * A zero value is preserved (returns 0) so callers can honour an
 * "immediate retry allowed" hint from the server rather than defaulting
 * to the standard exponential delay.
 */
export function getRetryAfterMs(err: unknown): number | undefined {
  if (err === null || err === undefined || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as { retryAfterSeconds?: unknown; resetAt?: unknown };
  const seconds = candidate.retryAfterSeconds;
  if (typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0) {
    return Math.floor(seconds * 1000);
  }
  const resetAt = candidate.resetAt;
  if (resetAt instanceof Date && !Number.isNaN(resetAt.getTime())) {
    const delta = resetAt.getTime() - Date.now();
    return delta > 0 ? delta : 0;
  }
  return undefined;
}

export class ErrorBackoff {
  private consecutiveErrors = 0;
  private backoffUntil: number | null = null;
  private fatalNotified = false;

  private readonly config: BackoffConfig;

  constructor(config: Partial<BackoffConfig> = {}) {
    this.config = {
      initialDelayMs: config.initialDelayMs ?? 1000,
      maxDelayMs: config.maxDelayMs ?? 60000,
      multiplier: config.multiplier ?? 2,
      maxRetries: config.maxRetries ?? 5,
    };
  }

  /**
   * Record an error and update backoff state.
   *
   * @param statusCode - HTTP status code, when known.
   * @param err - Optional underlying error object. When present, its
   *   `code`/`name` are inspected for the free-tier rate-limit marker so
   *   that the fatal flag is set even though the raw status (429) would
   *   otherwise be classified as transient.
   */
  recordError(statusCode?: number, err?: unknown): void {
    this.consecutiveErrors++;

    // Free-tier 429 is a permanent condition — the caller must wait for
    // the quota window to reset or upgrade to a paid deployment. Marking
    // it fatal here short-circuits the retry loop and prevents wasted
    // budget on identical follow-up calls. See `FreeTierRateLimitError`
    // in `src/providers/sapOrchestration.ts`.
    //
    // Content-filter rejections (issue #1903) are the second permanent
    // non-4xx shape: the provider's content policy blocked the request
    // and no amount of retrying will unblock it. Same fatal flag so the
    // outer retry loop stops immediately. Issue #2134 broadens the check
    // to cover provider-specific content-policy shapes (OpenAI
    // moderation, Google SAFETY, Anthropic content_policy, HTTP 451).
    if (isFreeTierRateLimitError(err) || isContentPolicyError(err)) {
      this.fatalNotified = true;
    } else if (isKnownThrottle(err)) {
      // Known throttles (HTTP 429, provider rate-limit codes, "rate
      // limit" / "quota exceeded" messages) are always transient — the
      // provider has told us to slow down, not that the request is
      // malformed. Even if the status code the caller passed in happens
      // to be a 4xx (some wrappers surface 400 with a rate-limit body),
      // we must not fold it into the generic fatal 4xx branch. See
      // SST OpenCode PR #58866 and issue #2152.
    } else if (statusCode !== undefined && statusCode >= 400 && statusCode < 500) {
      // Generic 429 is transient per the AGENTS.md error contract: the
      // rate-limit window will eventually reset, so let the exponential
      // backoff schedule handle it. Only the *other* 4xx codes (auth,
      // validation, not-found, etc.) are truly permanent.
      if (statusCode !== 429) {
        this.fatalNotified = true;
      }
    }

    // Server-provided Retry-After (from `Retry-After` header on a 429)
    // wins over the default exponential schedule when present. Rationale:
    // the server has explicitly told us when the quota window will reopen,
    // so honouring that is both more accurate and cheaper than blindly
    // doubling the delay on every attempt. When the header is absent,
    // fall through to the standard `initialDelay * multiplier^n` curve.
    const retryAfterMs = getRetryAfterMs(err);
    let delay: number;
    if (retryAfterMs !== undefined) {
      // Cap at the configured maximum so a malicious/misconfigured server
      // cannot pin the client into an unbounded wait.
      delay = Math.min(retryAfterMs, this.config.maxDelayMs);
    } else {
      delay = Math.min(
        this.config.initialDelayMs * Math.pow(this.config.multiplier, this.consecutiveErrors - 1),
        this.config.maxDelayMs
      );
    }
    this.backoffUntil = Date.now() + delay;
  }

  recordSuccess(): void {
    this.consecutiveErrors = 0;
    this.backoffUntil = null;
  }

  reset(): void {
    this.consecutiveErrors = 0;
    this.backoffUntil = null;
    this.fatalNotified = false;
  }

  shouldBackoff(): boolean {
    if (this.backoffUntil === null) return false;
    return Date.now() < this.backoffUntil;
  }

  getRemainingBackoffMs(): number {
    if (this.backoffUntil === null) return 0;
    return Math.max(0, this.backoffUntil - Date.now());
  }

  /**
   * Return true when the current state (or the supplied `err`) is a
   * permanent failure that must not be retried.
   *
   * Three lookup paths:
   *   1. When `err` is provided, check whether it carries the
   *      `free_tier_rate_limit` or `content_filter` marker. This lets
   *      callers make a fatal decision *without* first calling
   *      `recordError` — useful for short-circuit checks in tests and
   *      CLI error rendering. Content-filter is treated identically to
   *      a 4xx validation error (issue #1903): retrying the same prompt
   *      against the same policy will hit the same block.
   *   2. When `err` is provided AND `isRetryableError(err)` is true AND
   *      this backoff instance has already recorded `maxRetries` or more
   *      consecutive errors, treat the error as fatal: the transient
   *      retry budget is spent, and an outer retry loop (NetworkManager,
   *      agent-workflow `KILO_RETRIES`, etc.) must not keep retrying.
   *      Without this check an outer layer would ignore the exhausted
   *      budget and loop forever on a flaky `ECONNRESET`, violating the
   *      retry contract in `docs/ARCHITECTURE.md#error-handling` and
   *      disabling graceful degradation. Issue #1994.
   *   3. When `err` is omitted, fall back to the internal
   *      `fatalNotified` flag set by prior `recordError` calls.
   */
  isFatal(err?: unknown): boolean {
    if (err !== undefined && (isFreeTierRateLimitError(err) || isContentPolicyError(err))) {
      return true;
    }
    // Known throttle (HTTP 429, rate-limit codes, "rate limit" / "quota
    // exceeded" messages) — transient per the AGENTS.md error contract.
    // Short-circuit to false so the paid-tier throttle path never leaks
    // into the generic `fatalNotified` fallback below. The only way a
    // throttle becomes fatal is budget exhaustion (checked next). See
    // SST OpenCode PR #58866 and issue #2152.
    if (err !== undefined && isKnownThrottle(err) && !isFreeTierRateLimitError(err)) {
      if (this.consecutiveErrors >= this.config.maxRetries) {
        return true;
      }
      return false;
    }
    if (
      err !== undefined &&
      isRetryableError(err) &&
      this.consecutiveErrors >= this.config.maxRetries
    ) {
      return true;
    }
    return this.fatalNotified;
  }

  getConsecutiveErrors(): number {
    return this.consecutiveErrors;
  }
}

/**
 * Extract status code from error messages
 */
export function extractStatusCode(errorMessage: string): number | undefined {
  // Anchor to colon to avoid false matches, restrict to 4xx/5xx
  const match = errorMessage.match(/status:\s*([45]\d{2})\b/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Structural check for the two permanent auth errors introduced by the
 * OAuth refresh flow. We test by `name` instead of `instanceof` because
 * errors may cross module boundaries in tests (multiple copies of the
 * `auth.ts` module) and would otherwise fail the identity check.
 *
 * Callers use this to decide whether to skip the retry loop entirely
 * — a `NoRefreshTokenError` or `ReauthenticationRequiredError` is
 * classified as *permanent* per the error contract in `AGENTS.md`, and
 * further retries only waste budget and confuse the user.
 */
export function isPermanentAuthFailure(err: unknown): boolean {
  if (err === null || err === undefined) {
    return false;
  }
  const name = (err as { name?: unknown }).name;
  return name === 'NoRefreshTokenError' || name === 'ReauthenticationRequiredError';
}

/**
 * Coarse-grained taxonomy of provider failures used by callers that need
 * a single-field decision (telemetry, user-facing error rendering, outer
 * retry loops). Values match the "Error classification taxonomy" table
 * in issue #2134 / AGENTS.md → error-handling.
 *
 * `content_policy`, `auth`, and `validation` are PERMANENT — the caller
 * must not retry. `network` and `rate_limit` are TRANSIENT (though the
 * caller still gets to decide whether its retry budget allows another
 * attempt). `unknown` is treated cautiously as transient-with-small-budget
 * by {@link ErrorBackoff.isFatal} fallback paths.
 */
export type ErrorType =
  'network' | 'content_policy' | 'auth' | 'validation' | 'rate_limit' | 'unknown';

/**
 * Result of {@link classifyError}. `type` is the taxonomy bucket;
 * `fatal` marks errors that must not be retried; `retryable` is the
 * inverse convenience for conditional retry loops. `statusCode` is the
 * HTTP status when the underlying error carried one.
 */
export interface ErrorClassification {
  type: ErrorType;
  fatal: boolean;
  retryable: boolean;
  statusCode?: number;
}

/**
 * Internal: pull an HTTP status out of the many shapes upstream libraries
 * use. Mirrors `extractStatus` in `src/providers/modelFetchErrors.ts` but
 * kept local to preserve `src/core/` → providers independence (providers
 * are upstream in the dependency graph, not the other way around).
 */
function readStatus(err: unknown): number | undefined {
  if (err === null || err === undefined || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown };
  };
  if (typeof candidate.status === 'number') {
    return candidate.status;
  }
  if (typeof candidate.statusCode === 'number') {
    return candidate.statusCode;
  }
  const responseStatus = candidate.response?.status;
  if (typeof responseStatus === 'number') {
    return responseStatus;
  }
  return undefined;
}

/**
 * Internal: best-effort message extraction (never throws, never returns
 * `[object Object]`).
 */
function readMessage(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err && typeof err === 'object') {
    const candidate = err as { message?: unknown };
    if (typeof candidate.message === 'string') {
      return candidate.message;
    }
  }
  return '';
}

const NETWORK_MESSAGE_RE =
  /socket hang up|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EPIPE|EAGAIN|EBUSY|fetch failed/i;

/**
 * Fold an upstream error into a single {type, fatal, retryable,
 * statusCode} record. Precedence (most-specific first):
 *
 *   1. Content-policy signals (dedicated detector covers OpenAI
 *      moderation, Google SAFETY, Anthropic content_policy, HTTP 451,
 *      message substrings). PERMANENT.
 *   2. Permanent auth failures from the OAuth flow
 *      (`NoRefreshTokenError`, `ReauthenticationRequiredError`).
 *      PERMANENT.
 *   3. Free-tier rate limits (permanent per the AGENTS.md contract).
 *      PERMANENT, type `rate_limit`.
 *   4. HTTP status mapping:
 *      - `401`, `403` -> `auth` (fatal).
 *      - `400`, `422` -> `validation` (fatal).
 *      - `429` -> `rate_limit` (transient).
 *      - `451` -> `content_policy` (fatal; also matched by step 1).
 *      - `5xx` -> `network` (transient).
 *   5. Transient network message regex -> `network` (transient).
 *   6. Rate-limit markers / `isRetryableError` -> `rate_limit`
 *      (transient).
 *   7. Fall-through -> `unknown` (treated cautiously; `fatal: false`,
 *      `retryable: true`).
 *
 * This is the "single source of truth" callers should use when they
 * only need a one-line decision. For retry-budget bookkeeping over
 * multiple attempts, keep using the stateful {@link ErrorBackoff}
 * instance — this function is stateless.
 */
export function classifyError(err: unknown): ErrorClassification {
  const statusCode = readStatus(err);

  // 1. Content policy — permanent regardless of status code.
  if (isContentPolicyError(err)) {
    return { type: 'content_policy', fatal: true, retryable: false, statusCode };
  }

  // 2. Permanent auth failures from the OAuth refresh flow.
  if (isPermanentAuthFailure(err)) {
    return { type: 'auth', fatal: true, retryable: false, statusCode };
  }

  // 3. Free-tier rate limit — same bucket as the paid tier for
  //    classification purposes, but permanent (not retryable).
  if (isFreeTierRateLimitError(err)) {
    return { type: 'rate_limit', fatal: true, retryable: false, statusCode };
  }

  // 3b. Known throttle (HTTP 429, provider rate-limit codes, "rate
  //     limit"/"quota exceeded" messages) — must be tagged `rate_limit`
  //     and classified as transient BEFORE the generic 4xx fallback
  //     below folds a rate-limit-with-wrapper-4xx-status into
  //     `validation` (fatal). See SST OpenCode PR #58866 and issue
  //     #2152.
  if (isKnownThrottle(err)) {
    return { type: 'rate_limit', fatal: false, retryable: true, statusCode };
  }

  // 4. HTTP status mapping.
  if (statusCode !== undefined) {
    if (statusCode === 451) {
      return { type: 'content_policy', fatal: true, retryable: false, statusCode };
    }
    if (statusCode === 401 || statusCode === 403) {
      return { type: 'auth', fatal: true, retryable: false, statusCode };
    }
    if (statusCode === 400 || statusCode === 422) {
      return { type: 'validation', fatal: true, retryable: false, statusCode };
    }
    if (statusCode === 429) {
      return { type: 'rate_limit', fatal: false, retryable: true, statusCode };
    }
    if (statusCode >= 500 && statusCode < 600) {
      return { type: 'network', fatal: false, retryable: true, statusCode };
    }
    if (statusCode >= 400 && statusCode < 500) {
      // Any other 4xx we did not special-case: permanent per the
      // AGENTS.md error contract.
      return { type: 'validation', fatal: true, retryable: false, statusCode };
    }
  }

  // 5. Transient network message heuristic.
  const message = readMessage(err);
  if (message && NETWORK_MESSAGE_RE.test(message)) {
    return { type: 'network', fatal: false, retryable: true, statusCode };
  }

  // 6. Rate-limit markers that did not surface via statusCode (e.g.
  //    `code: 'provider_rate_limit'`).
  if (isRateLimitError(err) || isXAICapacityError(err)) {
    return { type: 'rate_limit', fatal: false, retryable: true, statusCode };
  }

  // 7. Unknown — cautiously retryable but not fatal, so a caller with
  //    a small retry budget can give it one more go.
  return { type: 'unknown', fatal: false, retryable: true, statusCode };
}
