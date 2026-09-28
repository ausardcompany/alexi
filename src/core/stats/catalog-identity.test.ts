/**
 * Tests for the canonical model-identity helper (ported from opencode
 * commit acb6859). Verifies that offerings routed through multiple
 * providers all resolve to the same canonical lab, that ambiguous names
 * are dropped from the `models` output, and that invalid input is
 * rejected.
 */

import { describe, expect, it } from 'vitest';
import { catalogIdentity, DEFAULT_STATS_PROVIDERS } from './catalog-identity.js';

describe('catalogIdentity', () => {
  it('rejects non-object input', () => {
    expect(() => catalogIdentity(null)).toThrow(/Invalid model catalog/);
    expect(() => catalogIdentity('nope')).toThrow(/Invalid model catalog/);
    expect(() => catalogIdentity([])).toThrow(/Invalid model catalog/);
  });

  it('rejects inputs missing models or providers', () => {
    expect(() => catalogIdentity({ models: {} })).toThrow(/Invalid model catalog/);
    expect(() => catalogIdentity({ providers: {} })).toThrow(/Invalid model catalog/);
  });

  it('maps sap-ai-core offerings to their canonical lab', () => {
    const catalog = {
      models: {
        'anthropic/claude-opus-4': {},
      },
      providers: {
        'sap-ai-core': {
          models: {
            'anthropic--claude-4.7-opus': {
              canonical_model_id: 'anthropic/claude-opus-4',
            },
          },
        },
      },
    };
    const { offerings, models } = catalogIdentity(catalog);
    expect(offerings.get('sap-ai-core/anthropic--claude-4.7-opus')).toBe('anthropic');
    expect(models.get('anthropic--claude-4.7-opus')).toBe('anthropic');
  });

  it('falls back to modelID when the canonical map already contains it', () => {
    const catalog = {
      models: {
        'gpt-4o': {},
      },
      providers: {
        opencode: {
          models: {
            'gpt-4o': {},
          },
        },
      },
    };
    const { offerings } = catalogIdentity(catalog);
    expect(offerings.get('opencode/gpt-4o')).toBe('gpt-4o');
  });

  it('drops ambiguous normalised names from the models output', () => {
    const catalog = {
      models: {
        'anthropic/claude-opus-4': {},
        'meituan/claude-opus-4': {},
      },
      providers: {
        opencode: {
          models: {
            'claude-opus-4': { canonical_model_id: 'anthropic/claude-opus-4' },
          },
        },
        'opencode-go': {
          models: {
            'claude-opus-4': { canonical_model_id: 'meituan/claude-opus-4' },
          },
        },
      },
    };
    const { offerings, models } = catalogIdentity(catalog);
    // Offerings still resolve per-provider.
    expect(offerings.get('opencode/claude-opus-4')).toBe('anthropic');
    expect(offerings.get('opencode-go/claude-opus-4')).toBe('meituan');
    // But the shared name has two candidate labs, so it is dropped.
    expect(models.has('claude-opus-4')).toBe(false);
  });

  it('normalises -free / -preview suffixes when counting candidates', () => {
    const catalog = {
      models: {
        'anthropic/claude-opus-4': {},
      },
      providers: {
        opencode: {
          models: {
            'claude-opus-4-free': { canonical_model_id: 'anthropic/claude-opus-4' },
            'claude-opus-4-preview': { canonical_model_id: 'anthropic/claude-opus-4' },
          },
        },
      },
    };
    const { models } = catalogIdentity(catalog);
    expect(models.get('claude-opus-4')).toBe('anthropic');
  });

  it('honours a custom statsProviders list', () => {
    const catalog = {
      models: {
        'openai/gpt-4o': {},
      },
      providers: {
        'other-provider': {
          models: {
            'gpt-4o': { canonical_model_id: 'openai/gpt-4o' },
          },
        },
      },
    };
    // Default list does not include "other-provider" → empty maps.
    const defaultResult = catalogIdentity(catalog);
    expect(defaultResult.offerings.size).toBe(0);

    // With an explicit override, we pick it up.
    const overridden = catalogIdentity(catalog, ['other-provider']);
    expect(overridden.offerings.get('other-provider/gpt-4o')).toBe('openai');
  });

  it('exposes sap-ai-core in the default provider list', () => {
    expect(DEFAULT_STATS_PROVIDERS).toContain('sap-ai-core');
  });
});
