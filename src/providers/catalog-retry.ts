/**
 * Catalog recovery retry primitives.
 *
 * Ports the upstream kilocode catalog-recovery hardening commits
 * (`07b18a1a2`, `b1642e87c`, `88f8ea950`, `59313c749`, `5539dd3ae`) into
 * Alexi's SAP AI Core provider layer. The upstream fixes make the model
 * catalog refresh loop:
 *
 *   (a) sustain retries after transient failures,
 *   (b) bound the total number of retries,
 *   (c) rearm the budget after a success (so a later blip gets a fresh
 *       budget rather than inheriting an exhausted counter), and
 *   (d) honor the HTTP `Retry-After` response header when the upstream
 *       server tells us how long to wait (RFC 7231).
 *
 * SAP AI Core's deployment / model-list endpoints are rate-limited (429 +
 * `Retry-After`), so this logic is a direct fit for `modelCatalog.ts`'s
 * background refresh loop.
 *
 * This module is intentionally stateless. The "rearm after success"
 * clause is satisfied by the shape of {@link withCatalogRetry} alone:
 * each top-level call starts with a fresh `attempt = 0` counter, so a
 * previous successful call does not carry its budget into the next.
 * Callers that want longer-lived rearming (e.g. a scheduler that only
 * wants to retry N times across the whole process lifetime) should wrap
 * {@link withCatalogRetry} themselves.
 *
 * Design notes:
 *   - We do NOT delegate to `fetchWithRetry` in `modelFetchErrors.ts`.
 *     That helper is tied to the SAP SDK's thrown-error shape; this
 *     helper is a generic Result-returning wrapper so callers can
 *     surface a `Retry-After` without having to throw/catch a typed
 *     error. The two helpers coexist: `fetchWithRetry` for the direct
 *     SDK path, `withCatalogRetry` for `fetch()`-style HTTP where the
 *     response headers are accessible.
 *   - Exponential backoff formula matches the AGENTS.md contract:
 *     `delay = min(initialDelay * 2^attempt, maxDelay)`.
 */

/**
 * Options controlling the retry loop. All fields are required so the
 * callsite has to make an explicit decision about budget; the exported
 * {@link DEFAULT_CATALOG_RETRY} covers the common case.
 */
export interface CatalogRetryOptions {
  /** Maximum number of attempts (first try + retries). */
  readonly maxAttempts: number;
  /** Delay before the first retry (ms). Doubled on each attempt. */
  readonly baseDelayMs: number;
  /** Hard cap on the computed delay (ms). */
  readonly maxDelayMs: number;
}

/**
 * Sensible defaults for the SAP AI Core catalog refresh:
 *   - 5 attempts (1 try + 4 retries) matches `ErrorBackoff` in `src/core`.
 *   - 1s initial backoff — short enough that a flapping TLS handshake
 *     recovers before the user notices.
 *   - 30s cap — long enough that a sustained 429 does not hammer the
 *     SAP endpoint, short enough that a successful recovery is still
 *     perceived as "almost immediate" from the TUI.
 */
export const DEFAULT_CATALOG_RETRY: CatalogRetryOptions = {
  maxAttempts: 5,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
};

/**
 * Parse the HTTP `Retry-After` response header into milliseconds.
 *
 * Supports both forms defined in RFC 7231 §7.1.3:
 *   - delta-seconds (`"120"`)              → 120_000 ms
 *   - HTTP-date (`"Wed, 21 Oct 2015 ..."`) → milliseconds until that date
 *
 * Returns `undefined` for a missing / unparseable header so the caller
 * falls back to its exponential-backoff schedule. A past HTTP-date yields
 * `0` (retry immediately), per the RFC intent that the server has already
 * released the lock by then.
 *
 * @param header Raw header value, or `null` / `undefined` when absent.
 */
export function parseRetryAfter(header: string | null | undefined): number | undefined {
  if (header === null || header === undefined) {
    return undefined;
  }
  const trimmed = header.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const secs = Number(trimmed);
  if (Number.isFinite(secs) && secs >= 0) {
    return Math.round(secs * 1000);
  }
  const date = Date.parse(trimmed);
  if (!Number.isNaN(date)) {
    const delta = date - Date.now();
    return delta > 0 ? delta : 0;
  }
  return undefined;
}

/**
 * Discriminated-union result returned by the user-supplied fetch
 * function. Using an explicit result instead of thrown exceptions lets
 * callers surface a response-level `Retry-After` without having to
 * encode it into an error class.
 */
export type CatalogFetchResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly retryAfterMs?: number; readonly error: unknown };

/**
 * Run `fn` with bounded exponential-backoff retries. On failure the
 * schedule is `max(retryAfterMs, baseDelay * 2^attempt)` capped at
 * `maxDelayMs`; on success the loop returns the value immediately.
 *
 * The retry budget is spent on EVERY failure — classification of
 * transient vs permanent is the caller's responsibility (e.g. by
 * returning `{ ok: false, error }` only for transient failures and
 * throwing for permanent ones). This keeps the helper policy-free so
 * both the SAP AI Core model-list refresh and future provider catalog
 * fetches can share it.
 *
 * The function honors `signal.aborted` BEFORE every attempt and during
 * the backoff sleep, so a user-initiated cancellation is observed
 * promptly without waiting for the current attempt to finish.
 *
 * @throws The last `error` seen when every attempt failed. If `signal`
 *         fires, throws `signal.reason` (or a generic `AbortError`).
 */
export async function withCatalogRetry<T>(
  fn: (attempt: number) => Promise<CatalogFetchResult<T>>,
  opts: CatalogRetryOptions = DEFAULT_CATALOG_RETRY,
  signal?: AbortSignal
): Promise<T> {
  if (opts.maxAttempts < 1) {
    throw new Error(`withCatalogRetry: maxAttempts must be >= 1, got ${opts.maxAttempts}`);
  }
  let lastError: unknown;
  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    if (signal?.aborted) {
      throw signal.reason ?? new Error('aborted');
    }
    const result = await fn(attempt);
    if (result.ok) {
      return result.value;
    }
    lastError = result.error;
    // No sleep after the final attempt — just surface the last error.
    if (attempt === opts.maxAttempts - 1) {
      break;
    }
    const exponential = Math.min(opts.maxDelayMs, opts.baseDelayMs * 2 ** attempt);
    const backoff = Math.min(
      opts.maxDelayMs,
      // Honor server-supplied Retry-After when present; otherwise the
      // schedule is purely exponential.
      result.retryAfterMs !== undefined ? Math.max(result.retryAfterMs, 0) : exponential
    );
    await sleepWithSignal(backoff, signal);
  }
  throw lastError ?? new Error('withCatalogRetry: exhausted attempts without error');
}

/**
 * Sleep for `ms` milliseconds, resolving early (and rejecting with the
 * abort reason) if the caller aborts. Kept module-private because its
 * only consumer is the retry loop above.
 */
async function sleepWithSignal(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) {
    return;
  }
  if (signal?.aborted) {
    throw signal.reason ?? new Error('aborted');
  }
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason ?? new Error('aborted'));
    };
    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}
