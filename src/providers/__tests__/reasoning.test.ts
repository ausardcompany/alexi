import { describe, expect, it } from 'vitest';

import { resolvePortableReasoning } from '../reasoning.js';

describe('resolvePortableReasoning', () => {
  describe('effort level mapping', () => {
    it('maps low to low', () => {
      expect(resolvePortableReasoning('low')).toEqual({ effort: 'low' });
    });

    it('maps medium to medium', () => {
      expect(resolvePortableReasoning('medium')).toEqual({ effort: 'medium' });
    });

    it('maps high to high', () => {
      expect(resolvePortableReasoning('high')).toEqual({ effort: 'high' });
    });

    it('normalizes max to xhigh (Cline PR #12946 convention)', () => {
      expect(resolvePortableReasoning('max')).toEqual({ effort: 'xhigh' });
    });
  });

  describe('explicit enable/disable', () => {
    it('maps enabled=true (no level) to medium default', () => {
      expect(resolvePortableReasoning(undefined, true)).toEqual({ effort: 'medium' });
    });

    it('maps enabled=false (no level) to none', () => {
      expect(resolvePortableReasoning(undefined, false)).toEqual({ effort: 'none' });
    });

    it('explicit disable (enabled=false) overrides an effort level', () => {
      // Callers may pass both; the explicit disable should win so providers
      // can turn native reasoning off deterministically.
      expect(resolvePortableReasoning('high', false)).toEqual({ effort: 'none' });
    });

    it('effort level with enabled=true prefers the level (level is more specific)', () => {
      expect(resolvePortableReasoning('low', true)).toEqual({ effort: 'low' });
    });
  });

  describe('no reasoning requested', () => {
    it('returns undefined when neither effortLevel nor enabled is provided', () => {
      expect(resolvePortableReasoning()).toBeUndefined();
    });

    it('returns undefined when both args are undefined', () => {
      expect(resolvePortableReasoning(undefined, undefined)).toBeUndefined();
    });
  });

  describe('shape invariants', () => {
    it('always returns an object with a single effort field when defined', () => {
      const result = resolvePortableReasoning('medium');
      expect(result).toBeDefined();
      expect(Object.keys(result as object)).toEqual(['effort']);
    });

    it('never emits max on the wire (always normalized)', () => {
      const result = resolvePortableReasoning('max');
      expect(result?.effort).not.toBe('max');
      expect(result?.effort).toBe('xhigh');
    });
  });
});
