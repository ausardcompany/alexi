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

    const delay = Math.min(
      this.config.initialDelayMs * Math.pow(this.config.multiplier, this.consecutiveErrors - 1),
      this.config.maxDelayMs
    );
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
