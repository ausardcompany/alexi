import { describe, it, expect } from 'vitest';
import { McpBreakageTracker, DEFAULT_BREAKAGE_THRESHOLD } from '../../src/mcp/breakage-tracker.js';

describe('McpBreakageTracker', () => {
  it('starts with a zero violation count for an unknown server', () => {
    const tracker = new McpBreakageTracker();
    expect(tracker.getViolationCount('srv')).toBe(0);
    expect(tracker.shouldDisableServer('srv')).toBe(false);
  });

  it('increments the count by ONE per recorded call, not per violation string', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('srv', 'tools/list', ['v1', 'v2', 'v3']);
    expect(tracker.getViolationCount('srv')).toBe(1);
  });

  it('is a no-op when the violation list is empty', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('srv', 'tools/list', []);
    expect(tracker.getViolationCount('srv')).toBe(0);
  });

  it('disables the server after the default threshold of 3 violations', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('srv', 'tools/list', ['v']);
    expect(tracker.shouldDisableServer('srv')).toBe(false);
    tracker.recordViolation('srv', 'tools/list', ['v']);
    expect(tracker.shouldDisableServer('srv')).toBe(false);
    tracker.recordViolation('srv', 'resources/list', ['v']);
    expect(tracker.shouldDisableServer('srv')).toBe(true);
  });

  it('respects a custom threshold', () => {
    const tracker = new McpBreakageTracker(1);
    tracker.recordViolation('srv', 'tools/list', ['v']);
    expect(tracker.shouldDisableServer('srv')).toBe(true);
  });

  it('rejects a non-positive threshold', () => {
    expect(() => new McpBreakageTracker(0)).toThrow();
    expect(() => new McpBreakageTracker(-1)).toThrow();
    expect(() => new McpBreakageTracker(1.5)).toThrow();
    expect(() => new McpBreakageTracker(Number.NaN)).toThrow();
  });

  it('exposes DEFAULT_BREAKAGE_THRESHOLD as 3', () => {
    expect(DEFAULT_BREAKAGE_THRESHOLD).toBe(3);
  });

  it('tracks counts independently per server', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('a', 'tools/list', ['v']);
    tracker.recordViolation('a', 'tools/list', ['v']);
    tracker.recordViolation('b', 'tools/list', ['v']);
    expect(tracker.getViolationCount('a')).toBe(2);
    expect(tracker.getViolationCount('b')).toBe(1);
  });

  it('keeps a history of recorded violations per server', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('srv', 'tools/list', ['v1']);
    tracker.recordViolation('srv', 'resources/list', ['v2', 'v3']);
    const history = tracker.getHistory('srv');
    expect(history).toHaveLength(2);
    expect(history[0].method).toBe('tools/list');
    expect(history[0].violations).toEqual(['v1']);
    expect(history[1].method).toBe('resources/list');
    expect(history[1].violations).toEqual(['v2', 'v3']);
  });

  it('returns a defensive copy from getHistory', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('srv', 'tools/list', ['v']);
    const h1 = tracker.getHistory('srv');
    h1.push({ method: 'bogus', violations: [], recordedAt: 0 });
    expect(tracker.getHistory('srv')).toHaveLength(1);
  });

  it('reset() clears only the targeted server', () => {
    const tracker = new McpBreakageTracker(2);
    tracker.recordViolation('a', 'tools/list', ['v']);
    tracker.recordViolation('a', 'tools/list', ['v']);
    tracker.recordViolation('b', 'tools/list', ['v']);
    tracker.reset('a');
    expect(tracker.getViolationCount('a')).toBe(0);
    expect(tracker.shouldDisableServer('a')).toBe(false);
    expect(tracker.getViolationCount('b')).toBe(1);
  });

  it('resetAll() clears every server', () => {
    const tracker = new McpBreakageTracker();
    tracker.recordViolation('a', 'tools/list', ['v']);
    tracker.recordViolation('b', 'tools/list', ['v']);
    tracker.resetAll();
    expect(tracker.getViolationCount('a')).toBe(0);
    expect(tracker.getViolationCount('b')).toBe(0);
    expect(tracker.getHistory('a')).toEqual([]);
  });

  it('builds a disable reason message that names the server and threshold', () => {
    const tracker = new McpBreakageTracker(5);
    const msg = tracker.disableReason('my-server');
    expect(msg).toContain('my-server');
    expect(msg).toContain('5 protocol violations');
    expect(msg).toContain('mcp-servers.json');
  });
});
