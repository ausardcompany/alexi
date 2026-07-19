/**
 * Usage display formatting helpers.
 *
 * Kilocode PR #12303 shipped a compact per-model breakdown format:
 *   - Per-model rows: `Sonnet 3.5: 12.3K tokens, $0.45`
 *   - Running total:  `Total: 45.2K tokens, $1.23`
 * with column-aligned labels and abbreviated numeric units.
 *
 * These helpers are UI-agnostic (return plain strings). They are consumed
 * by the Sidebar usage panel in `src/cli/tui/components/Sidebar.tsx` but
 * are otherwise pure so they can be unit-tested without Ink.
 */

/**
 * Abbreviate a non-negative integer token count with SI-style suffixes.
 *
 * Rules:
 * - < 1000              → exact integer (e.g. `999`)
 * - < 1_000_000         → `xx.xK` with one decimal (e.g. `12.3K`)
 * - >= 1_000_000        → `x.xM` with one decimal (e.g. `1.2M`)
 * - Trailing `.0` is stripped so `12000` → `12K`, not `12.0K`.
 * - Negative or non-finite inputs return `0`.
 */
export function abbreviateCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) {
    return '0';
  }
  if (n < 1_000) {
    // Integer only — decimal token counts do not exist upstream.
    return String(Math.floor(n));
  }
  const value = n < 1_000_000 ? n / 1_000 : n / 1_000_000;
  const suffix = n < 1_000_000 ? 'K' : 'M';
  // One decimal place, stripping a trailing `.0` for cleaner display.
  const fixed = value.toFixed(1);
  const clean = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  return `${clean}${suffix}`;
}

/**
 * Format a USD cost to two decimal places prefixed with `$`.
 *
 * `$0.45`, `$1.23`, `$0.00`. For sub-cent values we still render two
 * decimals (`$0.00`) because the goal of this display is compactness,
 * not precision — the exact figures live in the cost report/CSV.
 */
export function formatCost(cost: number): string {
  if (!Number.isFinite(cost) || cost < 0) {
    return '$0.00';
  }
  return `$${cost.toFixed(2)}`;
}

/**
 * One compact usage row: `<model>: <tokens> tokens, <cost>`.
 *
 * `model` is emitted verbatim — the caller is responsible for choosing a
 * display-friendly label (e.g. `Claude 4.5 Sonnet` rather than the raw
 * `anthropic--claude-4.5-sonnet` provider id).
 */
export function formatUsageRow(model: string, tokens: number, cost: number): string {
  return `${model}: ${abbreviateCount(tokens)} tokens, ${formatCost(cost)}`;
}

/**
 * Per-model usage entry used to build the compact display.
 */
export interface UsageEntry {
  /** Display label for the model (already human-friendly). */
  model: string;
  /** Combined input + output tokens for this model. */
  tokens: number;
  /** USD cost accumulated for this model. */
  cost: number;
}

/**
 * Render the full compact usage block: one row per model followed by a
 * `Total:` row. Rows are column-aligned so the ` tokens, $x.xx` segments
 * line up regardless of label width.
 *
 * Returns an array of strings (one per row) so the caller can decide how
 * to render them (e.g. `<Text>` per line in Ink, or a single `\n`-joined
 * string in a plain terminal).
 *
 * When `entries` is empty, returns an empty array so the caller can skip
 * the section entirely.
 */
export function formatUsageBlock(entries: UsageEntry[]): string[] {
  if (entries.length === 0) {
    return [];
  }

  // Sort by cost descending so the highest spend is at the top — matches
  // the pattern already used by `pickTopModelLabel` in ChatPage/LogsPage.
  const sorted = [...entries].sort((a, b) => b.cost - a.cost);

  const totalTokens = sorted.reduce((sum, e) => sum + e.tokens, 0);
  const totalCost = sorted.reduce((sum, e) => sum + e.cost, 0);

  // Column-align the label so all `: <tokens> tokens, <cost>` segments
  // start at the same column. `Total` is included in the width so it
  // aligns with the model rows too.
  const labels = [...sorted.map((e) => e.model), 'Total'];
  const labelWidth = labels.reduce((max, l) => Math.max(max, l.length), 0);
  const pad = (label: string): string => label.padEnd(labelWidth, ' ');

  const rows = sorted.map(
    (e) => `${pad(e.model)}: ${abbreviateCount(e.tokens)} tokens, ${formatCost(e.cost)}`
  );
  rows.push(`${pad('Total')}: ${abbreviateCount(totalTokens)} tokens, ${formatCost(totalCost)}`);
  return rows;
}
