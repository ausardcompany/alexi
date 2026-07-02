import { describe, expect, test } from 'vitest';
import { MaxCostNudge } from './max-cost-nudge.js';

describe('MaxCostNudge', () => {
  test('normalizeLimit returns undefined for null/undefined/non-positive/non-finite', () => {
    expect(MaxCostNudge.normalizeLimit(null)).toBeUndefined();
    expect(MaxCostNudge.normalizeLimit(undefined)).toBeUndefined();
    expect(MaxCostNudge.normalizeLimit(0)).toBeUndefined();
    expect(MaxCostNudge.normalizeLimit(-1)).toBeUndefined();
    expect(MaxCostNudge.normalizeLimit(Number.NaN)).toBeUndefined();
    expect(MaxCostNudge.normalizeLimit(Number.POSITIVE_INFINITY)).toBeUndefined();
  });

  test('normalizeLimit ceils positive values', () => {
    expect(MaxCostNudge.normalizeLimit(4.2)).toBe(5);
    expect(MaxCostNudge.normalizeLimit(5)).toBe(5);
    expect(MaxCostNudge.normalizeLimit(0.01)).toBe(1);
  });

  test('formatCost uses 4-digit precision below 1 and 2-digit precision at/above 1', () => {
    expect(MaxCostNudge.formatCost(0.5)).toBe('$0.5000');
    expect(MaxCostNudge.formatCost(0.0001)).toBe('$0.0001');
    expect(MaxCostNudge.formatCost(1)).toBe('$1.00');
    expect(MaxCostNudge.formatCost(1.5)).toBe('$1.50');
    expect(MaxCostNudge.formatCost(12)).toBe('$12.00');
  });

  test('setLimit normalizes and getLimit returns the stored value', () => {
    const nudge = new MaxCostNudge();
    expect(nudge.getLimit()).toBeUndefined();
    nudge.setLimit(4.2);
    expect(nudge.getLimit()).toBe(5);
    nudge.setLimit(null);
    expect(nudge.getLimit()).toBeUndefined();
    nudge.setLimit(-1);
    expect(nudge.getLimit()).toBeUndefined();
  });
});
