/**
 * Session status helpers — running-vs-dormant classification.
 *
 * Ports upstream kilocode `kwf/cli-scheduled-session-state-1f5e` (2026-09):
 * a new `scheduled` status was introduced to describe an idle session
 * that is waiting on a pending `schedule_wakeup` / cron task. Both `idle`
 * and `scheduled` mean "no work happening right now" — the overview
 * aggregation and any board / sidebar / status endpoint must NOT treat
 * these as running work.
 *
 * `running` and `waiting` are the two states where a session is doing
 * something (executing a tool call, awaiting a permission decision, …).
 * Everything else — including `offline`, `completed`, `failed`, `idle`,
 * `scheduled` — is dormant from the orchestrator's perspective and is
 * coerced to `idle` in the overview so a scheduled session is never
 * misclassified as active work.
 *
 * Kept as a small, standalone module so the classification is trivial
 * to unit-test and can be imported by any layer without dragging in the
 * whole agent-manager orchestration surface.
 */

import type { SessionStatus as _SessionStatus } from './agent-manager/orchestration-api.js';

// Re-export the canonical union so callers do not need two imports.
export type SessionStatus = _SessionStatus;

/**
 * The complete set of session statuses considered "running" — i.e. the
 * session is actively doing work or blocked awaiting a resolution that
 * is *not* a scheduled wakeup.
 *
 * The current {@link SessionStatus} union only encodes dormant/terminal
 * states plus `waiting`; a first-class `running` state may be added in a
 * later upstream port, so the set is deliberately extensible.
 *
 * Explicitly excluded: `idle`, `offline`, `completed`, `failed`,
 * `scheduled`. All of these map to `idle` in the overview.
 */
const RUNNING_STATUSES: ReadonlySet<string> = new Set<string>(['running', 'waiting']);

/**
 * Return `true` when `status` represents a session that is actively
 * doing work. `scheduled` and every other dormant/terminal state
 * returns `false` so overview aggregation coerces them to `idle`.
 *
 * Accepts an arbitrary string so callers with statuses coming from
 * external boundaries (HTTP payloads, event bus) do not have to
 * pre-cast to the literal union.
 */
export function isRunningStatus(status: string): boolean {
  return RUNNING_STATUSES.has(status);
}

/**
 * Coerce a raw session status to the overview form: pass through the
 * two running statuses, collapse everything else to `'idle'`.
 *
 * This is the one-line helper orchestration loops call while
 * populating a `Map<sessionId, statusForDisplay>` so the sidebar and
 * board never show a scheduled/offline/completed session as "running".
 */
export function toOverviewStatus(status: string): string {
  return isRunningStatus(status) ? status : 'idle';
}
