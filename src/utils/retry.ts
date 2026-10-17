/**
 * Transport-level retry predicate.
 *
 * Ports opencode PR #56307 — adds EPIPE / "broken pipe" to the set of
 * transient transport errors that should be retried rather than
 * surfaced to the caller. Long-running SAP AI Core streaming calls
 * routed through load balancers (SAP Cloud Connector, corporate HTTP
 * proxies) occasionally see the upstream half-close the socket while
 * the server is still writing, producing an EPIPE on the next write.
 * Those must flow through the retry path, not fail the whole turn.
 *
 * This helper is intentionally classifier-only — it does NOT retry on
 * its own. Callers (e.g. the catalog refresh loop, the stream retry
 * loop in `src/core/session/retry.ts`) feed its result into their own
 * `shouldRetry` predicate.
 *
 * Keep in sync with:
 *   - `src/providers/modelFetchErrors.ts` TRANSIENT_FETCH_ERROR_REGEX
 *   - `src/session/network.ts#isRetryableConnectionReset`
 *   - `src/mcp/client.ts` TRANSIENT_ERROR_CODES
 *   - AGENTS.md "Error classification" section (authoritative).
 */

/**
 * Node ErrnoException codes that indicate a retryable transport
 * failure. Mirrors the AGENTS.md transient-error list for network
 * failures (minus codes that are not transport-specific such as
 * EAGAIN/EBUSY, which have their own retry sites).
 */
export const TRANSIENT_ERROR_CODES: ReadonlySet<string> = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  // Added per opencode #56307: broken-pipe on long-running SAP AI
  // Core streaming calls through load balancers.
  'EPIPE',
]);

/**
 * Return `true` when `err` looks like a transient transport failure
 * worth retrying.
 *
 * Detection order:
 *   1. `err.code` is a well-known transient Node ErrnoException code.
 *   2. `err.cause.code` is a well-known code — Node's global `fetch`
 *      wraps the underlying libuv error in `cause`, so a single-level
 *      lookup misses it.
 *   3. Case-insensitive message match for callers that encode the
 *      code only in the error string (`new Error('EPIPE: broken pipe')`
 *      or `new Error('write EPIPE')`).
 *
 * Non-object inputs always return `false` so this helper is safe to
 * call on arbitrary `catch` values.
 */
export function isRetryableTransportError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const record = err as { code?: unknown; cause?: unknown; message?: unknown };
  if (typeof record.code === 'string' && TRANSIENT_ERROR_CODES.has(record.code)) {
    return true;
  }
  if (record.cause && typeof record.cause === 'object') {
    const inner = record.cause as { code?: unknown };
    if (typeof inner.code === 'string' && TRANSIENT_ERROR_CODES.has(inner.code)) {
      return true;
    }
  }
  const message = typeof record.message === 'string' ? record.message : '';
  if (message.length > 0 && /broken pipe|EPIPE/i.test(message)) {
    return true;
  }
  return false;
}
