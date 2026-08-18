/**
 * Core error types and helpers.
 *
 * This module hosts the canonical `RateLimitError` class and the retry
 * driver used by higher-level chat / agent flows to gracefully handle
 * HTTP 429 responses from provider APIs (SAP AI Core, proxy providers,
 * etc.).
 *
 * Dependency direction: `src/core/**` MUST stay independent of
 * `src/providers/**` (providers are upstream of core in the graph).
 * Provider-specific rate-limit classes (`FreeTierRateLimitError`,
 * `ProviderRateLimitError`) live in `src/providers/sapOrchestration.ts`
 * and match this class structurally — they share `code`, `name`,
 * `statusCode`, `modelName`, `retryAfterSeconds`, and `suggestedAction`
 * fields so `instanceof`-free callers work across module boundaries.
 *
 * See also `src/core/error-backoff.ts` for the transient/permanent
 * classification helpers and the `ErrorBackoff` schedule.
 */
import { logger } from '../utils/logger.js';
import { isRateLimitError as backoffIsRateLimitError, getRetryAfterMs } from './error-backoff.js';

/**
 * Machine-readable error code for a generic (provider-agnostic) rate
 * limit. Distinct from the provider-specific `free_tier_rate_limit` and
 * `provider_rate_limit` codes so callers can differentiate the origin
 * without an `instanceof` chain.
 */
export const RATE_LIMIT_CODE = 'rate_limit' as const;

/**
 * Constructor options for {@link RateLimitError}.
 */
export interface RateLimitErrorOptions {
  /** Model id the rate limit applies to (e.g. `gpt-4o`). */
  modelName?: string;
  /**
   * Retry window in seconds parsed from the upstream `Retry-After`
   * header (or the SDK-normalised `retryAfter` field). When present, the
   * retry driver honours this over its default exponential backoff.
   */
  retryAfterSeconds?: number;
  /** Upstream error preserved on `cause`. */
  cause?: unknown;
  /**
   * Optional short, single-line, user-facing guidance to display
   * alongside the message (e.g. "Wait 30s or switch models").
   */
  suggestedAction?: string;
  /** Documentation URL for operators to learn more. */
  docsUrl?: string;
}

/**
 * Canonical rate-limit error for the core layer.
 *
 * Thrown when a provider indicates a rate limit (HTTP 429) and no
 * provider-specific subclass is available. Provider-layer subclasses
 * (`FreeTierRateLimitError`, `ProviderRateLimitError`) match this shape
 * structurally so downstream callers can detect rate-limit failures
 * with {@link isRateLimitError} without a hard dependency on the
 * concrete class identity.
 *
 * The class is intentionally minimal: it captures the parsed metadata
 * (`retryAfterSeconds`, `modelName`, `suggestedAction`, `docsUrl`) and
 * leaves *policy* (retry budget, backoff schedule, user-facing
 * countdown) to {@link retryWithRateLimit} and `ErrorBackoff`.
 */
export class RateLimitError extends Error {
  readonly code: typeof RATE_LIMIT_CODE = RATE_LIMIT_CODE;
  readonly statusCode = 429;
  readonly modelName?: string;
  readonly retryAfterSeconds?: number;
  readonly suggestedAction?: string;
  readonly docsUrl?: string;

  constructor(message: string, options: RateLimitErrorOptions = {}) {
    super(message);
    this.name = 'RateLimitError';
    if (options.modelName !== undefined) {
      this.modelName = options.modelName;
    }
    if (
      typeof options.retryAfterSeconds === 'number' &&
      Number.isFinite(options.retryAfterSeconds) &&
      options.retryAfterSeconds >= 0
    ) {
      this.retryAfterSeconds = Math.floor(options.retryAfterSeconds);
    }
    if (options.suggestedAction !== undefined) {
      this.suggestedAction = options.suggestedAction;
    }
    if (options.docsUrl !== undefined) {
      this.docsUrl = options.docsUrl;
    }
    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

/**
 * Re-exported structural rate-limit detection.
 *
 * Recognises {@link RateLimitError}, the provider-layer
 * `FreeTierRateLimitError` / `ProviderRateLimitError` variants, and any
 * error carrying `statusCode === 429`. Detection is by `code`, `name`
 * or `statusCode` so it survives cross-module re-imports (identity
 * `instanceof` checks fail when multiple copies of a module coexist,
 * e.g. under vitest workers).
 */
export const isRateLimitError = backoffIsRateLimitError;

/**
 * Detect the permanent free-tier variant, distinct from the transient
 * paid-tier one. This is a structural check on the well-known code /
 * name marker set by `FreeTierRateLimitError` in the providers layer.
 */
export function isFreeTierRateLimit(err: unknown): boolean {
  if (err === null || err === undefined || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { code?: unknown; name?: unknown };
  return candidate.code === 'free_tier_rate_limit' || candidate.name === 'FreeTierRateLimitError';
}

/**
 * Options for {@link retryWithRateLimit}.
 */
export interface RetryWithRateLimitOptions {
  /**
   * Maximum number of attempts including the first. Default: 3. A value
   * < 1 is treated as 1 (no retries).
   */
  maxAttempts?: number;
  /**
   * Base delay in ms used when the upstream error does not carry a
   * `Retry-After` window. Default: 1000.
   */
  initialDelayMs?: number;
  /** Upper bound for any single backoff delay in ms. Default: 60_000. */
  maxDelayMs?: number;
  /** Exponential base multiplier. Default: 2. */
  multiplier?: number;
  /**
   * Callback fired before each backoff sleep. Receives the 1-indexed
   * attempt that just failed (i.e. the attempt for which we are about
   * to wait), the computed delay in ms, the remaining attempts, and
   * the classified error. Used by CLI to render "Rate limit reached,
   * retrying in Xs..." with a live countdown. Errors thrown by this
   * callback are swallowed so they cannot mask retry progress.
   */
  onRetry?: (info: { attempt: number; delayMs: number; remaining: number; error: unknown }) => void;
  /**
   * Test hook: override `setTimeout` for deterministic timing in unit
   * tests. Production callers should leave this unset — the default
   * uses `setTimeout` from the Node event loop.
   */
  sleep?: (ms: number) => Promise<void>;
}

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY_MS = 1000;
const DEFAULT_MAX_DELAY_MS = 60_000;
const DEFAULT_MULTIPLIER = 2;

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Compute the retry delay for a given attempt.
 *
 * Priority: a `Retry-After`-derived window on the error (see
 * `getRetryAfterMs`) wins over the exponential schedule when present.
 * A zero window is honoured (immediate retry allowed). Otherwise the
 * delay is `min(initialDelay * multiplier^(attempt-1), maxDelay)`.
 *
 * Exposed for direct unit testing of the schedule.
 */
export function computeRateLimitDelay(
  err: unknown,
  attempt: number,
  opts: {
    initialDelayMs?: number;
    maxDelayMs?: number;
    multiplier?: number;
  } = {}
): number {
  const initialDelay = opts.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const maxDelay = opts.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
  const multiplier = opts.multiplier ?? DEFAULT_MULTIPLIER;
  const retryAfterMs = getRetryAfterMs(err);
  if (retryAfterMs !== undefined) {
    // Cap the server-provided window at the configured maximum so a
    // misconfigured server cannot pin the client into an unbounded wait.
    return Math.min(retryAfterMs, maxDelay);
  }
  const exp = initialDelay * Math.pow(multiplier, Math.max(0, attempt - 1));
  return Math.min(exp, maxDelay);
}

/**
 * Run `fn` and, when it throws a rate-limit error, retry it with
 * exponential backoff up to `maxAttempts` times. `Retry-After` metadata
 * from the upstream error (when present) overrides the exponential
 * schedule.
 *
 * Non-rate-limit errors and permanent free-tier rate limits propagate
 * immediately — retrying them wastes budget. The final rate-limit
 * error after budget exhaustion is rethrown so the caller can surface
 * an actionable failure message.
 *
 * User-visible countdown is emitted via `logger.info` on each attempt
 * with the message shape "Rate limit reached, retrying in Xs..." plus
 * the remaining retry count. Callers that need a richer UX (progress
 * bar, live spinner) pass their own `onRetry` callback.
 */
export async function retryWithRateLimit<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryWithRateLimitOptions = {}
): Promise<T> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  const sleep = options.sleep ?? defaultSleep;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (!isRateLimitError(err)) {
        throw err;
      }
      // Free-tier rate limits are permanent per the AGENTS.md error
      // contract: retrying will hit the same limit. Bail out so budget
      // is not wasted.
      if (isFreeTierRateLimit(err)) {
        throw err;
      }
      if (attempt === maxAttempts) {
        throw err;
      }
      const delayMs = computeRateLimitDelay(err, attempt, options);
      const remaining = maxAttempts - attempt;
      const seconds = Math.max(1, Math.round(delayMs / 1000));
      const model = (err as { modelName?: unknown }).modelName;
      const modelSuffix = typeof model === 'string' && model.length > 0 ? ` (${model})` : '';
      logger.info(
        `Rate limit reached${modelSuffix}, retrying in ${seconds}s... (${remaining} attempt${
          remaining === 1 ? '' : 's'
        } remaining)`
      );
      if (options.onRetry) {
        try {
          options.onRetry({ attempt, delayMs, remaining, error: err });
        } catch {
          // Swallow to avoid masking retry progress.
        }
      }
      await sleep(delayMs);
    }
  }
  // Unreachable in practice — the loop either returns on success or
  // throws on the final attempt. Kept for exhaustiveness in case
  // maxAttempts is 0 (guarded above) or the loop body is ever
  // refactored to break instead of throw.
  throw lastErr;
}
