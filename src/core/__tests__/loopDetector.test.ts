/**
 * Tests for LoopDetector (issue #1692).
 */

import { describe, it, expect } from 'vitest';
import { LoopDetector } from '../loopDetector.js';

describe('LoopDetector', () => {
  it('does not trip below the limit', () => {
    const d = new LoopDetector({ limit: 5 });
    for (let i = 0; i < 4; i++) {
      d.record('write', '{"path":"/a"}');
    }
    expect(d.hasTripped()).toBe(false);
    expect(d.getConsecutiveCount()).toBe(4);
  });

  it('trips exactly at the limit of identical calls', () => {
    const d = new LoopDetector({ limit: 5 });
    for (let i = 0; i < 5; i++) {
      d.record('write', '{"path":"/a"}');
    }
    expect(d.hasTripped()).toBe(true);
    expect(d.getConsecutiveCount()).toBe(5);
  });

  it('defaults limit to 5', () => {
    const d = new LoopDetector();
    expect(d.getLimit()).toBe(5);
  });

  it('resets consecutive count when tool name changes', () => {
    const d = new LoopDetector({ limit: 3 });
    d.record('write', '{"path":"/a"}');
    d.record('write', '{"path":"/a"}');
    d.record('read', '{"path":"/a"}');
    expect(d.hasTripped()).toBe(false);
    expect(d.getConsecutiveCount()).toBe(1);
  });

  it('resets consecutive count when arguments change', () => {
    const d = new LoopDetector({ limit: 3 });
    d.record('write', '{"path":"/a"}');
    d.record('write', '{"path":"/a"}');
    d.record('write', '{"path":"/b"}');
    expect(d.hasTripped()).toBe(false);
    expect(d.getConsecutiveCount()).toBe(1);
  });

  it('fingerprints semantically identical JSON with different key order', () => {
    const d = new LoopDetector({ limit: 2 });
    d.record('edit', '{"path":"/a","content":"x"}');
    d.record('edit', '{"content":"x","path":"/a"}');
    expect(d.hasTripped()).toBe(true);
  });

  it('falls back to raw-string fingerprint for invalid JSON', () => {
    const d = new LoopDetector({ limit: 2 });
    d.record('bash', 'not-json');
    d.record('bash', 'not-json');
    expect(d.hasTripped()).toBe(true);
  });

  it('reset() clears state so the next call starts fresh', () => {
    const d = new LoopDetector({ limit: 2 });
    d.record('write', '{}');
    d.record('write', '{}');
    expect(d.hasTripped()).toBe(true);
    d.reset();
    expect(d.hasTripped()).toBe(false);
    expect(d.getConsecutiveCount()).toBe(0);
    d.record('write', '{}');
    expect(d.hasTripped()).toBe(false);
  });

  it('rejects a limit below 2', () => {
    expect(() => new LoopDetector({ limit: 1 })).toThrow(/limit must be an integer >= 2/);
  });

  it('rejects a non-integer limit', () => {
    expect(() => new LoopDetector({ limit: 3.5 })).toThrow(/limit must be an integer >= 2/);
  });
});
