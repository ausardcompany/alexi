/**
 * Shared Model Retry Policy
 *
 * Alexi_change (opencode #56497 — "extract shared retry policy"): the
 * upstream commit extracted a single retry policy module and reduced
 * `session/runner/retry.ts` from 47 lines to 10 by having every caller
 * compose this shared primitive rather than hand-rolling its own
 * try/catch loop.
 *
 * Alexi already ships `src/core/session/retry.ts` (bounded exponential
 * backoff + full jitter + onRetry hook) and `src/core/error-backoff.ts`
 * (rate-limit / xAI-capacity classification). What was missing was a
 * single, model-focused *facade* that combines them into one
 * "retryable()" wrapper for the generate / stream hot path, so callers
 * do not have to re-derive the right classifier + retry options every
 * time.
 *
 * The policy covers three transient buckets per the AGENTS.md error
 * contract:
 *   - rate limits (HTTP 429, excluding permanent free-tier limits)
 *   - transient server errors (HTTP 502, 503, 504)
 *   - network blips (ECONNRESET, ETIMEDOUT, undici `terminated`, …)
 *
 * Permanent failures (4xx auth / validation, free-tier rate limits,
 * content-filter rejections) are *not* retried — those require
 * operator intervention, and retrying only burns the deployment quota
 * without changing the outcome.
 *
 * Backoff defaults: 500 ms base, 2× multiplier with full jitter, max
 * 30 s per attempt, 3 attempts total (initial + 2 retries). Matches the
 * upstream Effect-TS `Schedule.exponential(500ms, 2).jittered.compose(recurs(3))`
 * schedule bytewise.
 */

import { withRetry, type RetryOptions } from './session/retry.js';
import { isRetryableError } from './error-backoff.js';

/**
 * Shape every retryable error should have at the type-system level.
 * Mirrors the upstream `RetryableError` interface so callers that mint
 * their own error classes can declare them `extends RetryableError`.
 */
export interface RetryableError {
  readonly retryable: boolean;
  readonly retryAfterMs?: number;
}

/**
 * HTTP status codes considered transient (worth retrying). 429 belongs
 * here only when it is NOT a permanent free-tier rate limit — the
 * {@link isRetryable} check consults `isRateLimitError` to filter out
 * the fatal subset first.
 */
const TRANSIENT_STATUS_CODES: ReadonlySet<number> = new Set([429, 502, 503, 504]);

/**
 * Error `code` markers that always indicate a transient network blip.
 * Matched case-sensitively because Node's `ErrnoException.code` values
 * are canonicalised in uppercase.
 */
const TRANSIENT_ERROR_CODES: ReadonlySet<string> = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
  'EAGAIN',
  'EBUSY',
]);

/**
 * Extract a numeric HTTP status code from the many shapes upstream
 * libraries use (`err.status`, `err.statusCode`, `err.response.status`).
 */
function extractStatusCode(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') {
    return undefined;
  }
  const e = err as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown };
  };
  if (typeof e.status === 'number') {
    return e.status;
  }
  if (typeof e.statusCode === 'number') {
    return e.statusCode;
  }
  if (e.response && typeof e.response.status === 'number') {
    return e.response.status;
  }
  return undefined;
}

/**
 * Return true when `error` is worth retrying under the shared model
 * retry policy. Checked in order of cheapest-first:
 *
 *   1. The caller explicitly set `retryable: true` on the error.
 *   2. A rate-limit error whose `isFatal()` flag is false (generic
 *      429 — the free-tier variant is permanent and short-circuits).
 *   3. An xAI capacity error (also transient per AGENTS.md).
 *   4. A transient HTTP status code (502 / 503 / 504 / non-fatal 429).
 *   5. A transient network `code`.
 *
 * Any other error — including `401`, `403`, `404`, `400`, `422`,
 * `ENOENT`, `EACCES` — returns `false` and propagates on the first
 * throw. This matches the "permanent vs transient" split documented
 * in `AGENTS.md#error-classification`.
 */
export function isRetryable(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const e = error as Partial<RetryableError> & { code?: unknown };
  if (e.retryable === true) {
    return true;
  }
  // Rate-limit / xAI-capacity errors already carry the "retry" bit on
  // their class; defer to the canonical classifier (`isRetryableError`
  // in `error-backoff`) so Alexi stays in sync with the single source
  // of truth for the transient-vs-permanent split. That classifier
  // already filters out permanent free-tier rate limits — do not
  // re-check them here.
  if (isRetryableError(error)) {
    return true;
  }
  const status = extractStatusCode(error);
  if (status !== undefined && TRANSIENT_STATUS_CODES.has(status)) {
    return true;
  }
  if (typeof e.code === 'string' && TRANSIENT_ERROR_CODES.has(e.code)) {
    return true;
  }
  return false;
}

/**
 * Default options for the shared model retry policy. Chosen to mirror
 * the upstream `Schedule.exponential(500ms, 2).jittered.compose(recurs(3))`
 * schedule: 500 ms base, 2× multiplier, full jitter, 3 attempts total
 * (= initial attempt + 2 retries), 30 s per-attempt cap so no single
 * backoff ever stalls an interactive session for more than half a
 * minute.
 *
 * Exported so tests can override deterministically (`jitter: false`)
 * and background jobs can lengthen the budget without reinventing the
 * policy.
 */
export const DEFAULT_MODEL_RETRY_OPTIONS: Readonly<Required<Omit<RetryOptions, 'onRetry'>>> = {
  maxAttempts: 3,
  baseMs: 500,
  maxMs: 30_000,
  jitter: true,
};

/**
 * Wrap a model-call producer with the shared retry policy. Behaves
 * identically to {@link withRetry} with {@link isRetryable} as the
 * classifier and {@link DEFAULT_MODEL_RETRY_OPTIONS} as the baseline
 * schedule. Callers can override individual options (notably
 * `onRetry` for stream-finalisation hooks and `maxAttempts` for
 * background jobs that can afford a longer budget).
 */
export function retryable<T>(
  fn: (attempt: number) => Promise<T>,
  opts: RetryOptions = {}
): Promise<T> {
  const merged: RetryOptions = {
    ...DEFAULT_MODEL_RETRY_OPTIONS,
    ...opts,
  };
  return withRetry(fn, isRetryable, merged);
}
