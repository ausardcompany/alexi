import { describe, it, expect } from 'vitest';

import { formatDuration } from '../../src/cli/tui/utils/formatDuration.js';

describe('formatDuration (run-level)', () => {
  it('formats sub-second durations as 0s', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(500)).toBe('0s');
    expect(formatDuration(999)).toBe('0s');
  });

  it('formats seconds under a minute', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(45000)).toBe('45s');
    expect(formatDuration(59999)).toBe('59s');
  });

  it('formats minutes with seconds remainder', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(4 * 60000 + 12 * 1000)).toBe('4m 12s');
    expect(formatDuration(59 * 60000 + 59 * 1000)).toBe('59m 59s');
  });

  it('formats hours with minutes remainder and drops seconds', () => {
    expect(formatDuration(60 * 60000)).toBe('1h 0m');
    expect(formatDuration(1 * 60 * 60000 + 23 * 60000 + 30 * 1000)).toBe('1h 23m');
    expect(formatDuration(3 * 60 * 60000 + 5 * 60000)).toBe('3h 5m');
  });

  it('clamps negative and non-finite input to 0s', () => {
    expect(formatDuration(-1)).toBe('0s');
    expect(formatDuration(Number.NaN)).toBe('0s');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('0s');
    expect(formatDuration(Number.NEGATIVE_INFINITY)).toBe('0s');
  });
});
