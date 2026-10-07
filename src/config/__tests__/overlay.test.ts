/**
 * Tests for `config/overlay` shadowed-write detection.
 */

import { describe, it, expect } from 'vitest';
import {
  detectShadowedWrite,
  formatShadowedWriteWarning,
  type OverlayLayer,
} from '../overlay.js';

function layer(id: string, precedence: number, keys: string[]): OverlayLayer {
  return { id, precedence, keys: new Set(keys) };
}

describe('detectShadowedWrite', () => {
  it('returns null when no higher-precedence layer defines the key', () => {
    const layers = [
      layer('managed', 100, ['routing.model']),
      layer('user', 50, ['routing.model']),
    ];
    expect(detectShadowedWrite('routing.timeout', 'user', layers)).toBeNull();
  });

  it('returns null when writing to the highest-precedence layer', () => {
    const layers = [
      layer('managed', 100, ['routing.model']),
      layer('user', 50, ['routing.model']),
    ];
    expect(detectShadowedWrite('routing.model', 'managed', layers)).toBeNull();
  });

  it('detects shadowing by a single higher-precedence layer', () => {
    const layers = [
      layer('managed', 100, ['routing.model']),
      layer('user', 50, ['routing.model']),
    ];
    expect(detectShadowedWrite('routing.model', 'user', layers)).toEqual({
      shadowedBy: 'managed',
    });
  });

  it('picks the highest-precedence shadower when multiple layers conflict', () => {
    const layers = [
      layer('policy', 200, ['routing.model']),
      layer('managed', 100, ['routing.model']),
      layer('project', 75, ['routing.model']),
      layer('user', 50, []),
    ];
    expect(detectShadowedWrite('routing.model', 'user', layers)).toEqual({
      shadowedBy: 'policy',
    });
  });

  it('returns null when target overlay is unknown', () => {
    const layers = [layer('managed', 100, ['x'])];
    expect(detectShadowedWrite('x', 'ghost', layers)).toBeNull();
  });

  it('ignores same-precedence layers (ties do NOT shadow)', () => {
    const layers = [
      layer('a', 50, ['x']),
      layer('b', 50, ['x']),
    ];
    expect(detectShadowedWrite('x', 'a', layers)).toBeNull();
  });
});

describe('formatShadowedWriteWarning', () => {
  it('names the key, the target, and the shadower', () => {
    const msg = formatShadowedWriteWarning('routing.model', 'user', { shadowedBy: 'managed' });
    expect(msg).toContain('routing.model');
    expect(msg).toContain('"user"');
    expect(msg).toContain('"managed"');
    expect(msg).toContain('shadowed');
  });
});
