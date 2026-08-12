/**
 * Tests for reasoning-variant derivation and provider model merging.
 *
 * Ports the intent of kilocode's Grok reasoning / Kimi adaptive-effort
 * variant tests to Alexi's simpler ModelInfoLike shape.
 */

import { describe, it, expect } from 'vitest';
import { deriveReasoningVariants, mergeProviderModels } from '../../src/providers/transform.js';

describe('deriveReasoningVariants', () => {
  it('returns the base model unchanged when no reasoning.efforts are declared', () => {
    const model = { id: 'gpt-4o' };
    expect(deriveReasoningVariants(model)).toEqual([model]);
  });

  it('emits one variant per declared reasoning effort with a suffixed id', () => {
    const base = {
      id: 'grok-4',
      reasoning: { efforts: ['low', 'medium', 'high'] as const },
    };
    const variants = deriveReasoningVariants(base);
    expect(variants).toHaveLength(4); // base + 3
    expect(variants[0]).toBe(base);
    expect(variants.map((v) => v.id)).toEqual([
      'grok-4',
      'grok-4-low',
      'grok-4-medium',
      'grok-4-high',
    ]);
  });

  it('sets defaultEffort on the derived variant so downstream picks the intended effort', () => {
    const base = {
      id: 'kimi-adaptive',
      reasoning: { efforts: ['low', 'high'] as const, defaultEffort: 'low' },
    };
    const variants = deriveReasoningVariants(base);
    const high = variants.find((v) => v.id === 'kimi-adaptive-high');
    expect(high?.reasoning?.defaultEffort).toBe('high');
    // Base is preserved untouched (still points to `low`).
    expect(base.reasoning.defaultEffort).toBe('low');
  });

  it('never mutates its input', () => {
    const base = { id: 'gpt-5', reasoning: { efforts: ['minimal'] as const } };
    const snapshot = JSON.stringify(base);
    deriveReasoningVariants(base);
    expect(JSON.stringify(base)).toBe(snapshot);
  });
});

describe('mergeProviderModels', () => {
  it('preserves base variants that are not overridden by the custom map', () => {
    const base = {
      'gpt-5': { id: 'gpt-5' },
      'gpt-5-high': { id: 'gpt-5-high' },
    };
    const custom = {
      'gpt-5': { id: 'gpt-5', label: 'custom' },
    };
    const merged = mergeProviderModels(base, custom);
    expect(merged['gpt-5']).toEqual({ id: 'gpt-5', label: 'custom' });
    // The reasoning variant survives — this is the whole point of the fix.
    expect(merged['gpt-5-high']).toEqual({ id: 'gpt-5-high' });
  });

  it('lets custom entries override the base per-id', () => {
    const merged = mergeProviderModels({ a: 1 }, { a: 2, b: 3 });
    expect(merged).toEqual({ a: 2, b: 3 });
  });

  it('handles undefined inputs gracefully', () => {
    expect(mergeProviderModels(undefined, { a: 1 })).toEqual({ a: 1 });
    expect(mergeProviderModels({ a: 1 }, undefined)).toEqual({ a: 1 });
    expect(mergeProviderModels(undefined, undefined)).toEqual({});
  });
});
