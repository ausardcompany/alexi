/**
 * Network disconnect classification & event surface.
 *
 * Ports upstream opencode/kilocode `d6bb0ef05` (PR #13523) — the CLI/TUI
 * used to silently hang when the network dropped mid-stream. Users on
 * flaky SAP corporate VPNs would see the spinner keep spinning with no
 * indication that the underlying socket had died. The fix is to
 * classify low-level socket/network errors into a small discriminated
 * union and emit a discrete `network.disconnected` bus event so the TUI
 * (or headless CLI) can render a "reconnecting…" line instead of the
 * indefinite spinner.
 *
 * The classifier is intentionally conservative:
 *  - Only well-known Node.js socket / DNS error codes count as network
 *    disconnects.
 *  - `AbortError` (user-initiated cancel) is classified as `abort`,
 *    `retriable: false` so upstream retry logic does NOT try to
 *    reconnect against a cancelled request.
 *  - Anything else falls through to `null` — callers must handle a
 *    return of `null` as "not a network error, propagate normally".
 *
 * The bus event carries the classified reason plus an optional provider
 * id (from the routing config) so the UI can surface WHICH deployment
 * dropped — helpful when a chat is fanned out across multiple SAP AI
 * Core deployments and only one of them lost its socket.
 */

import { z } from 'zod';

import { defineEvent } from '../bus/index.js';

/**
 * Classified network-disconnect reasons.
 *
 *  - `timeout`  — request or socket timeout (ETIMEDOUT, "timeout").
 *  - `abort`    — user-initiated cancellation (AbortError). NOT retriable.
 *  - `socket`   — socket-level failure (ECONNRESET, "socket hang up",
 *                 ECONNREFUSED, EPIPE).
 *  - `dns`      — DNS resolution failure (ENOTFOUND, EAI_AGAIN).
 *  - `unknown`  — matched the classifier heuristic but not one of the
 *                 above; reserved for future extension.
 */
export type NetworkDisconnectReason = 'timeout' | 'abort' | 'socket' | 'dns' | 'unknown';

/**
 * Zod schema for the `network.disconnected` bus event payload.
 */
export const NetworkDisconnectPayload = z.object({
  reason: z.enum(['timeout', 'abort', 'socket', 'dns', 'unknown']),
  provider: z.string().optional(),
  retriable: z.boolean(),
  /**
   * Raw error message, best-effort — useful for logs but MUST NOT be
   * rendered verbatim to end-users (it can leak internal URLs).
   */
  raw: z.string().optional(),
});

export type NetworkDisconnectPayloadT = z.infer<typeof NetworkDisconnectPayload>;

/**
 * Discrete bus event fired when a network-level disconnect is detected.
 * Subscribers: the TUI status bar, headless CLI logger, and the session
 * queue drain that pauses new requests while a reconnect is in flight.
 */
export const NetworkDisconnectEvent = defineEvent('network.disconnected', NetworkDisconnectPayload);

/**
 * Classify an unknown error value as a network disconnect, or return
 * `null` if it does not look like one. Callers should propagate `null`
 * results to their existing error path — this classifier deliberately
 * does NOT swallow non-network errors.
 *
 * Detection order (first-match wins):
 *  1. `AbortError` (checked by `err.name`) → `abort`, not retriable.
 *  2. Node `ErrnoException.code` lookup — the authoritative signal when
 *     available. This mirrors upstream opencode `055d95b` which switched
 *     ECONNRESET detection from message-substring to error-code so that
 *     retryable connection resets are routed through the normal
 *     exponential-backoff retry path instead of being misclassified by
 *     wording. See `isRetryableConnectionReset` below.
 *  3. Case-insensitive message match (fallback for errors that carry the
 *     Node code only in `.message`, e.g. `new Error('read ECONNRESET')`
 *     constructed by tests or by callers that re-wrap the original).
 *     Order: `ETIMEDOUT`/"timeout" → `ECONNRESET`/`EPIPE`/`ECONNREFUSED`/
 *     "socket hang up" → `ENOTFOUND`/`EAI_AGAIN` → "fetch failed".
 */
export function classifyNetworkError(
  err: unknown
): { reason: NetworkDisconnectReason; retriable: boolean } | null {
  if (!(err instanceof Error)) {
    return null;
  }
  if (err.name === 'AbortError') {
    return { reason: 'abort', retriable: false };
  }

  // Primary: detect by Node ErrnoException code (authoritative). Walking
  // `err.code` + `err.cause.code` matches `src/core/network.ts` and the
  // transient-error contract in AGENTS.md.
  const code = extractErrorCode(err);
  if (code) {
    const classified = classifyByCode(code);
    if (classified) {
      return classified;
    }
  }

  // Fallback: message-substring match for callers (and tests) that
  // encode the code in the error message without setting `.code`.
  const msg = err.message.toLowerCase();
  if (msg.includes('etimedout') || msg.includes('timeout')) {
    return { reason: 'timeout', retriable: true };
  }
  if (
    msg.includes('econnreset') ||
    msg.includes('socket hang up') ||
    msg.includes('econnrefused') ||
    msg.includes('epipe')
  ) {
    return { reason: 'socket', retriable: true };
  }
  if (msg.includes('enotfound') || msg.includes('eai_again')) {
    return { reason: 'dns', retriable: true };
  }
  if (msg.includes('fetch failed')) {
    return { reason: 'unknown', retriable: true };
  }
  return null;
}

/**
 * True when `err` is a connection-reset that should flow through the
 * normal exponential-backoff retry path (see
 * `src/core/session/retry.ts#withRetry`) instead of failing fast.
 *
 * Ports opencode `055d95b` "fix(session): retry retryable conn reset
 * through the normal retry path". The upstream regression: callers were
 * detecting `ECONNRESET` by wording and short-circuiting to a
 * fail-fast "serverReset" branch, which bypassed the retry budget. Keying
 * off the Node ErrnoException code fixes it on corporate proxies that
 * drop long-lived SAP AI Core connections.
 */
export function isRetryableConnectionReset(err: unknown): boolean {
  const code = extractErrorCode(err);
  if (!code) {
    // Fallback: message-based detection so wrapped/stringified errors
    // still route through retry.
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      return (
        msg.includes('econnreset') ||
        msg.includes('etimedout') ||
        msg.includes('eai_again') ||
        msg.includes('socket hang up')
      );
    }
    return false;
  }
  return code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'EAI_AGAIN';
}

/**
 * Map a Node ErrnoException code to a classified disconnect reason, or
 * return `null` if the code is not a recognised network transport error.
 */
function classifyByCode(
  code: string
): { reason: NetworkDisconnectReason; retriable: boolean } | null {
  switch (code) {
    case 'ETIMEDOUT':
      return { reason: 'timeout', retriable: true };
    case 'ECONNRESET':
    case 'EPIPE':
    case 'ECONNREFUSED':
      return { reason: 'socket', retriable: true };
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return { reason: 'dns', retriable: true };
    default:
      return null;
  }
}

/**
 * Walk `err.code` and `err.cause.code` to extract a Node ErrnoException
 * code. Node's global `fetch` wraps the underlying libuv code inside
 * `cause`, so a single-level lookup misses it. Mirrors the extractor in
 * `src/core/network.ts`.
 */
function extractErrorCode(err: unknown): string | undefined {
  if (!err || typeof err !== 'object') {
    return undefined;
  }
  const record = err as { code?: unknown; cause?: unknown };
  if (typeof record.code === 'string') {
    return record.code;
  }
  if (record.cause && typeof record.cause === 'object') {
    const inner = record.cause as { code?: unknown };
    if (typeof inner.code === 'string') {
      return inner.code;
    }
  }
  return undefined;
}

/**
 * Report a network-level error to the bus so subscribers can surface a
 * disconnect UI. Returns `true` when the error was classified and the
 * event was published, `false` when the error did not look like a
 * network disconnect (caller MUST propagate the error normally).
 *
 * NEVER re-throws — this is a pure sink. Callers that want retry
 * semantics look up `retriable` in the event payload (or in the return
 * value below when they need it synchronously).
 */
export function reportNetworkDisconnect(
  err: unknown,
  provider?: string
): { reason: NetworkDisconnectReason; retriable: boolean } | null {
  const classified = classifyNetworkError(err);
  if (!classified) {
    return null;
  }
  const payload: NetworkDisconnectPayloadT = {
    reason: classified.reason,
    retriable: classified.retriable,
    ...(provider !== undefined ? { provider } : {}),
    ...(err instanceof Error && err.message ? { raw: err.message } : {}),
  };
  try {
    NetworkDisconnectEvent.publish(payload);
  } catch {
    // A bus handler crashing must not mask the underlying network error;
    // swallow so callers still see the classification return value.
  }
  return classified;
}
