/**
 * Session Retry with Bounded Exponential Backoff + Full Jitter
 *
 * Ports opencode commit `c789868` — prevents runaway retry loops that
 * exhaust SAP AI Core deployment quotas and burn tokens. Callers supply
 * a `shouldRetry` predicate so this module stays classifier-agnostic;
 * the transient-vs-permanent contract lives in `AGENTS.md` and is
 * implemented in `src/core/error-backoff.ts`.
 *
 * Formula: `delay(attempt) = min(maxMs, baseMs * 2^attempt)`, then
 * full-jitter — the delay actually slept is `random() * delay`. See
 * AWS "Exponential Backoff and Jitter" (2015) for the rationale: full
 * jitter minimises thundering-herd collisions when many clients retry
 * in the same window (e.g. after a 429 or 503 storm).
 *
 * Defaults are tuned for interactive chat: 8 attempts × 30s cap ≈ 4
 * minutes worst case. Adjust via `RetryOptions` for background jobs.
 */

const DEFAULT_MAX_ATTEMPTS = 8;
const DEFAULT_BASE_MS = 500;
const DEFAULT_MAX_MS = 30_000;

export interface RetryOptions {
  /** Maximum number of attempts (including the first). Default: 8. */
  maxAttempts?: number;
  /** Initial delay in ms before the first retry. Default: 500. */
  baseMs?: number;
  /** Upper bound on any single delay in ms. Default: 30 000. */
  maxMs?: number;
  /**
   * When true (default), apply full jitter to the computed delay so
   * concurrent retriers don't collide. Set false only in tests that
   * need deterministic timing.
   */
  jitter?: boolean;
}

/**
 * Compute the (possibly jittered) backoff delay for a given attempt.
 * `attempt` is 0-indexed: attempt 0 is the first retry.
 */
export function computeDelay(attempt: number, opts: RetryOptions = {}): number {
  const base = opts.baseMs ?? DEFAULT_BASE_MS;
  const cap = opts.maxMs ?? DEFAULT_MAX_MS;
  const exp = Math.min(cap, base * 2 ** attempt);
  if (opts.jitter === false) {
    return exp;
  }
  // Full jitter — see AWS backoff-and-jitter blog post.
  return Math.floor(Math.random() * exp);
}

/**
 * Invoke `fn` up to `maxAttempts` times, sleeping a jittered exponential
 * backoff between attempts. Retries only on errors for which
 * `shouldRetry(err)` returns true; permanent failures propagate on the
 * first throw. The final error (or the last transient error, if the
 * budget was exhausted) is re-thrown.
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  shouldRetry: (err: unknown) => boolean,
  opts: RetryOptions = {}
): Promise<T> {
  const max = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  let lastErr: unknown;
  for (let attempt = 0; attempt < max; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (!shouldRetry(err) || attempt === max - 1) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, computeDelay(attempt, opts)));
    }
  }
  throw lastErr;
}
