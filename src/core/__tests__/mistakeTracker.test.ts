/**
 * Tests for MistakeTracker (issue #1692).
 */

import { describe, it, expect } from 'vitest';
import { MistakeTracker } from '../mistakeTracker.js';

describe('MistakeTracker', () => {
  it('does not trip below the limit', () => {
    const t = new MistakeTracker({ limit: 6 });
    for (let i = 0; i < 5; i++) {
      t.record(false);
    }
    expect(t.hasTripped()).toBe(false);
    expect(t.getConsecutiveCount()).toBe(5);
  });

  it('trips at exactly the limit of consecutive failures', () => {
    const t = new MistakeTracker({ limit: 6 });
    for (let i = 0; i < 6; i++) {
      t.record(false);
    }
    expect(t.hasTripped()).toBe(true);
    expect(t.getConsecutiveCount()).toBe(6);
  });

  it('defaults limit to 6', () => {
    const t = new MistakeTracker();
    expect(t.getLimit()).toBe(6);
  });

  it('a success resets the consecutive counter', () => {
    const t = new MistakeTracker({ limit: 3 });
    t.record(false);
    t.record(false);
    t.record(true); // reset
    t.record(false);
    expect(t.hasTripped()).toBe(false);
    expect(t.getConsecutiveCount()).toBe(1);
  });

  it('reset() clears state', () => {
    const t = new MistakeTracker({ limit: 2 });
    t.record(false);
    t.record(false);
    expect(t.hasTripped()).toBe(true);
    t.reset();
    expect(t.hasTripped()).toBe(false);
    expect(t.getConsecutiveCount()).toBe(0);
  });

  it('rejects a limit below 2', () => {
    expect(() => new MistakeTracker({ limit: 1 })).toThrow(/limit must be an integer >= 2/);
  });

  it('rejects a non-integer limit', () => {
    expect(() => new MistakeTracker({ limit: 2.5 })).toThrow(/limit must be an integer >= 2/);
  });
});
