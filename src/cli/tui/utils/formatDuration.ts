/**
 * Human-friendly, coarse duration formatting for run-level work summaries.
 *
 * This is intentionally distinct from `formatDuration` in `formatToolOutput.ts`,
 * which formats short per-tool timings as `120ms` / `1.2s`. Run summaries
 * span many tool calls and read more naturally in whole seconds / minutes:
 *
 *   45s          -> under a minute
 *   4m 12s       -> minutes and seconds
 *   1h 23m       -> hours and minutes (seconds dropped)
 *
 * Contract:
 * - Input is milliseconds. Negative and non-finite inputs are clamped to 0.
 * - Sub-second runs render as `0s` rather than `0ms` — this helper is only
 *   used for run summaries, where sub-second granularity is noise.
 * - The output never contains a leading zero component (e.g. `0h 5m`);
 *   the largest non-zero unit leads.
 */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return '0s';
  }
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
