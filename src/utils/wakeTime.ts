/**
 * Human-friendly formatting for a scheduled session wake time.
 *
 * Added for issue #1901 so CLI (`alexi sessions`) and TUI
 * (`SessionList`) share one formatter: a wake time in the near future
 * renders as a relative countdown (`resumes in 2h 15m`), a wake time
 * further out or anywhere in the past collapses to an absolute UTC
 * stamp (`wakes at 2026-10-01 14:30 UTC` / `wake overdue since
 * 2026-10-01 14:30 UTC`). Keeping the branch logic in one place is
 * what guarantees `--json` consumers, the plain-text table, and the
 * React/Ink surface agree on the string the user sees.
 *
 * `scheduledWakeTime` is a plain milliseconds-since-epoch number on
 * `SessionMetadata`, matching the shape of neighbouring timestamp
 * fields (`created`, `updated`, `lastAccessedAt`). The formatter
 * accepts a `Date` instance or a numeric epoch to make callers
 * ergonomic from both the CLI (reading `session.scheduledWakeTime`)
 * and tests (passing a fixed `Date`).
 */

/** Switch between relative and absolute rendering above this delta. */
const RELATIVE_HORIZON_MS = 24 * 60 * 60 * 1000; // 24h

/** When the wake time is within this window, treat it as "any moment". */
const IMMINENT_WINDOW_MS = 30_000;

export interface FormatWakeTimeOptions {
  /** Override for `Date.now()` — used in tests for a stable snapshot. */
  now?: Date | number;
  /** Prefix for an upcoming wake. Default: `"resumes in"`. */
  upcomingPrefix?: string;
  /** Prefix for an overdue wake. Default: `"wake overdue since"`. */
  overduePrefix?: string;
  /** Prefix for an absolute far-future wake. Default: `"wakes at"`. */
  absolutePrefix?: string;
}

function toMs(value: Date | number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isFinite(t) ? t : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return null;
}

/**
 * Format a positive duration in milliseconds as `Nd Mh`, `Nh Mm`, or
 * `Nm` depending on magnitude. Rounds down to avoid the surprise of
 * `resumes in 1m` becoming `0m 59s` on the next refresh.
 */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return '0s';
  }
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainderHours = hours % 24;
  return remainderHours > 0 ? `${days}d ${remainderHours}h` : `${days}d`;
}

/**
 * Format a UTC "YYYY-MM-DD HH:MM UTC" stamp. We deliberately avoid
 * `toLocaleString()` so output is stable across CI timezones and the
 * TUI/CLI render the same string.
 */
export function formatAbsoluteUtc(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`
  );
}

/**
 * Produce the user-facing wake-time label.
 *
 * Returns `null` when `wakeTime` is missing or malformed so the
 * caller can skip the whole row/column instead of displaying `N/A` on
 * a session that was never scheduled.
 */
export function formatWakeTime(
  wakeTime: Date | number | null | undefined,
  options: FormatWakeTimeOptions = {}
): string | null {
  const target = toMs(wakeTime);
  if (target === null) {
    return null;
  }
  const nowMs = toMs(options.now) ?? Date.now();
  const delta = target - nowMs;

  const upcomingPrefix = options.upcomingPrefix ?? 'resumes in';
  const overduePrefix = options.overduePrefix ?? 'wake overdue since';
  const absolutePrefix = options.absolutePrefix ?? 'wakes at';

  // Overdue: fire time is in the past. Surface the absolute stamp so
  // the user has an anchor for when the schedule missed.
  if (delta < -IMMINENT_WINDOW_MS) {
    return `${overduePrefix} ${formatAbsoluteUtc(target)}`;
  }

  // Imminent window: within 30s on either side, render as "any moment"
  // so a flicker between "resumes in 1s" and "wake overdue since now"
  // does not confuse the user.
  if (Math.abs(delta) <= IMMINENT_WINDOW_MS) {
    return `${upcomingPrefix} <1m`;
  }

  if (delta <= RELATIVE_HORIZON_MS) {
    return `${upcomingPrefix} ${formatDuration(delta)}`;
  }

  return `${absolutePrefix} ${formatAbsoluteUtc(target)}`;
}
