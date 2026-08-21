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
 * The value read is `retryAfterSeconds` (set by the constructors of
 * `FreeTierRateLimitError` / `ProviderRateLimitError` in
 * `src/providers/sapOrchestration.ts`). We intentionally do NOT re-parse
 * raw headers here — that parsing belongs to the providers layer where
 * the raw response is still available.
 *
 * A zero value is preserved (returns 0) so callers can honour an
 * "immediate retry allowed" hint from the server rather than defaulting
 * to the standard exponential delay.
 */
export function getRetryAfterMs(err: unknown): number | undefined {
  if (err === null || err === undefined || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as { retryAfterSeconds?: unknown };
  const seconds = candidate.retryAfterSeconds;
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
    return undefined;
  }
  return Math.floor(seconds * 1000);
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
    if (isFreeTierRateLimitError(err)) {
      this.fatalNotified = true;
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
   * Two lookup paths:
   *   1. When `err` is provided, check whether it carries the
   *      `free_tier_rate_limit` marker (from
   *      `FreeTierRateLimitError`). This lets callers make a fatal
   *      decision *without* first calling `recordError` — useful for
   *      short-circuit checks in tests and CLI error rendering.
   *   2. When `err` is omitted, fall back to the internal
   *      `fatalNotified` flag set by prior `recordError` calls.
   */
  isFatal(err?: unknown): boolean {
    if (err !== undefined && isFreeTierRateLimitError(err)) {
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
