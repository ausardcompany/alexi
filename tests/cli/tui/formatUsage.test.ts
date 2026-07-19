/**
 * Tests for the compact usage-display formatting helpers used by the
 * sidebar Usage panel (issue #1043, mirrors Kilocode PR #12303).
 */

import { describe, it, expect } from 'vitest';

import {
  abbreviateCount,
  formatCost,
  formatUsageRow,
  formatUsageBlock,
} from '../../../src/cli/tui/utils/formatUsage.js';

describe('abbreviateCount', () => {
  it('returns integer form for counts under 1000', () => {
    expect(abbreviateCount(0)).toBe('0');
    expect(abbreviateCount(1)).toBe('1');
    expect(abbreviateCount(42)).toBe('42');
    expect(abbreviateCount(999)).toBe('999');
  });

  it('abbreviates thousands with a single decimal and K suffix', () => {
    expect(abbreviateCount(1_000)).toBe('1K');
    expect(abbreviateCount(1_500)).toBe('1.5K');
    expect(abbreviateCount(12_345)).toBe('12.3K');
    expect(abbreviateCount(999_999)).toBe('1000K');
  });

  it('strips trailing .0 for whole thousand/million values', () => {
    expect(abbreviateCount(2_000)).toBe('2K');
    expect(abbreviateCount(12_000)).toBe('12K');
    expect(abbreviateCount(3_000_000)).toBe('3M');
  });

  it('abbreviates millions with a single decimal and M suffix', () => {
    expect(abbreviateCount(1_000_000)).toBe('1M');
    expect(abbreviateCount(1_234_567)).toBe('1.2M');
    expect(abbreviateCount(25_800_000)).toBe('25.8M');
  });

  it('rounds thousands to one decimal place', () => {
    // 12_345 -> 12.345 -> "12.3"
    expect(abbreviateCount(12_345)).toBe('12.3K');
    // 12_355 -> 12.355 -> "12.4"
    expect(abbreviateCount(12_355)).toBe('12.4K');
  });

  it('returns "0" for negative or non-finite inputs', () => {
    expect(abbreviateCount(-1)).toBe('0');
    expect(abbreviateCount(Number.NaN)).toBe('0');
    expect(abbreviateCount(Number.POSITIVE_INFINITY)).toBe('0');
  });

  it('floors fractional counts below 1000 to an integer', () => {
    // Providers occasionally report fractional aggregate tokens after
    // cache-adjusted arithmetic; we still want a clean integer display.
    expect(abbreviateCount(999.7)).toBe('999');
    expect(abbreviateCount(0.4)).toBe('0');
  });
});

describe('formatCost', () => {
  it('formats to two decimals with a $ prefix', () => {
    expect(formatCost(0)).toBe('$0.00');
    expect(formatCost(0.45)).toBe('$0.45');
    expect(formatCost(1.234)).toBe('$1.23');
    expect(formatCost(45.678)).toBe('$45.68');
  });

  it('renders sub-cent values as $0.00 (compactness > precision)', () => {
    expect(formatCost(0.0001)).toBe('$0.00');
    expect(formatCost(0.004)).toBe('$0.00');
  });

  it('returns $0.00 for negative or non-finite inputs', () => {
    expect(formatCost(-1)).toBe('$0.00');
    expect(formatCost(Number.NaN)).toBe('$0.00');
    expect(formatCost(Number.POSITIVE_INFINITY)).toBe('$0.00');
  });
});

describe('formatUsageRow', () => {
  it('produces "<model>: <tokens> tokens, <cost>"', () => {
    expect(formatUsageRow('Claude 3.5 Sonnet', 12_345, 0.45)).toBe(
      'Claude 3.5 Sonnet: 12.3K tokens, $0.45'
    );
  });

  it('handles zero tokens/cost', () => {
    expect(formatUsageRow('GPT-4o', 0, 0)).toBe('GPT-4o: 0 tokens, $0.00');
  });

  it('handles million-scale tokens', () => {
    expect(formatUsageRow('Opus', 1_234_567, 12.5)).toBe('Opus: 1.2M tokens, $12.50');
  });

  it('does not mutate the model label', () => {
    // Ensures the helper is purely a string composer — no case changes,
    // no truncation, no prefix injection.
    const label = 'anthropic--claude-4.5-sonnet';
    expect(formatUsageRow(label, 1000, 0.01).startsWith(`${label}: `)).toBe(true);
  });
});

describe('formatUsageBlock', () => {
  it('returns an empty array when no entries are provided', () => {
    expect(formatUsageBlock([])).toEqual([]);
  });

  it('emits one row per model plus a Total row', () => {
    const rows = formatUsageBlock([
      { model: 'Sonnet', tokens: 12_000, cost: 0.5 },
      { model: 'Haiku', tokens: 3_000, cost: 0.02 },
    ]);
    expect(rows).toHaveLength(3);
    expect(rows[rows.length - 1]).toContain('Total');
  });

  it('sorts per-model rows by cost descending', () => {
    const rows = formatUsageBlock([
      { model: 'Cheap', tokens: 1_000, cost: 0.01 },
      { model: 'Expensive', tokens: 500, cost: 5.0 },
      { model: 'Middle', tokens: 2_000, cost: 1.0 },
    ]);
    // First per-model row must be the highest-cost model.
    expect(rows[0].startsWith('Expensive')).toBe(true);
    // Total row is always last.
    expect(rows[rows.length - 1].startsWith('Total')).toBe(true);
  });

  it('column-aligns labels so the ": " separator lines up', () => {
    const rows = formatUsageBlock([
      { model: 'Sonnet', tokens: 12_000, cost: 0.5 },
      { model: 'GPT-4o Mini', tokens: 3_000, cost: 0.02 },
    ]);
    const colonIndexes = rows.map((row) => row.indexOf(':'));
    // Every row's ':' should be at the same column.
    for (const idx of colonIndexes) {
      expect(idx).toBe(colonIndexes[0]);
    }
  });

  it('sums tokens and cost into the Total row', () => {
    const rows = formatUsageBlock([
      { model: 'A', tokens: 10_000, cost: 0.2 },
      { model: 'B', tokens: 20_000, cost: 0.3 },
    ]);
    const total = rows[rows.length - 1];
    // 30_000 tokens -> "30K", 0.5 cost -> "$0.50"
    expect(total).toContain('30K tokens');
    expect(total).toContain('$0.50');
  });

  it('renders abbreviated units in every row', () => {
    const rows = formatUsageBlock([
      { model: 'A', tokens: 1_234_567, cost: 12.3 },
      { model: 'B', tokens: 45_678, cost: 0.9 },
    ]);
    expect(rows.some((r) => r.includes('1.2M tokens'))).toBe(true);
    expect(rows.some((r) => r.includes('45.7K tokens'))).toBe(true);
  });
});
