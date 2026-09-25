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
 * Detection rules (first-match wins, case-insensitive on message):
 *  1. `AbortError` (checked by `err.name`) → `abort`, not retriable.
 *  2. `ETIMEDOUT` / literal "timeout" substring → `timeout`, retriable.
 *  3. `ECONNRESET` / `EPIPE` / `ECONNREFUSED` / "socket hang up" → `socket`,
 *     retriable.
 *  4. `ENOTFOUND` / `EAI_AGAIN` → `dns`, retriable.
 *  5. `fetch failed` (undici wrapper) → `unknown`, retriable.
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
