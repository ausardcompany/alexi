/**
 * Scheduled-status derivation.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/session/scheduled.ts`
 * (kwf/cli-scheduled-session-state-1f5e, +80 lines). A session that is
 * currently idle but has one or more pending `schedule_wakeup` entries is
 * dormant right now yet cooperating with a time-based event — the
 * orchestrator surfaces this by deriving a synthetic `scheduled` status
 * with the earliest `wakeAt` timestamp.
 *
 * The derivation is intentionally computed at the status-endpoint layer
 * (and at CLI session listing), NOT persisted: the underlying stored
 * status stays `idle`, and adding/cancelling a wakeup only changes what
 * consumers see, never what is written to disk.
 *
 * Alexi_change: the scheduled-status shape here matches what
 * `board.ts`/agent-manager consumers expect — a `SessionStatus` string
 * ('scheduled') plus a `wakeAt` epoch-ms number. This module has NO
 * side effects and no I/O — the caller (HTTP handler / CLI listing) is
 * responsible for feeding it the list of pending wakeups obtained from
 * `Wakeup.list(sessionID)`.
 */

import type { SessionStatus } from './agent-manager/orchestration-api.js';

/**
 * Minimal info about a single pending wakeup — just enough to derive
 * the scheduled status. Kept structural so callers can pass either the
 * raw {@link WakeupSchema.Entry} shape or a hand-built object.
 */
export interface ScheduledInfo {
  /** Session id the wakeup will resume. */
  readonly sessionId: string;
  /** Epoch milliseconds at which the wakeup fires. */
  readonly wakeAt: number;
}

/**
 * Result of {@link deriveScheduledStatus}. Kept as a discriminated
 * struct rather than reusing the plain `SessionStatus` string so the
 * caller has direct access to the `wakeAt` value for display.
 */
export interface ScheduledStatus {
  readonly status: SessionStatus;
  readonly wakeAt?: number;
}

/**
 * When `base` is `idle` and `pending` contains at least one wakeup,
 * upgrade to `'scheduled'` with the earliest `wakeAt`. Otherwise pass
 * `base` through untouched.
 *
 * Contract:
 *   - Only `idle` is upgraded. A `running`, `waiting`, `offline`,
 *     `completed`, or `failed` session is NOT converted to `scheduled`
 *     even if a pending wakeup exists — the current activity takes
 *     precedence.
 *   - An empty `pending` array returns `base` unchanged.
 *   - `wakeAt` in the returned struct is `undefined` unless the status
 *     is `'scheduled'`.
 */
export function deriveScheduledStatus(
  base: SessionStatus,
  pending: readonly ScheduledInfo[]
): ScheduledStatus {
  if (base !== 'idle') {
    return { status: base };
  }
  if (pending.length === 0) {
    return { status: base };
  }
  const wakeAt = Math.min(...pending.map((p) => p.wakeAt));
  return { status: 'scheduled', wakeAt };
}

/**
 * Convert an ISO-8601 timestamp string (the shape stored on each
 * `WakeupSchema.Entry.at`) into an epoch-ms number safe for
 * `deriveScheduledStatus`. Returns `NaN` for invalid input so callers
 * can filter with `Number.isFinite`.
 */
export function isoToEpochMs(iso: string): number {
  return new Date(iso).getTime();
}
