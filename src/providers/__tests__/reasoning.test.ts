import { describe, expect, it } from 'vitest';

import {
  detectProviderFamily,
  isAnthropicOpus47,
  resolvePortableReasoning,
  resolveReasoning,
} from '../reasoning.js';

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

describe('detectProviderFamily', () => {
  it('classifies canonical family names', () => {
    expect(detectProviderFamily('anthropic')).toBe('anthropic');
    expect(detectProviderFamily('openai')).toBe('openai');
    expect(detectProviderFamily('gemini')).toBe('gemini');
  });

  it('classifies Anthropic model ids by substring', () => {
    expect(detectProviderFamily('anthropic--claude-4.7-opus')).toBe('anthropic');
    expect(detectProviderFamily('claude-3.5-sonnet')).toBe('anthropic');
    expect(detectProviderFamily('claude-3-haiku')).toBe('anthropic');
    expect(detectProviderFamily('opus-4.7')).toBe('anthropic');
    expect(detectProviderFamily('sonnet-5')).toBe('anthropic');
  });

  it('classifies OpenAI model ids by substring', () => {
    expect(detectProviderFamily('gpt-4o')).toBe('openai');
    expect(detectProviderFamily('gpt-5')).toBe('openai');
    expect(detectProviderFamily('o1-mini')).toBe('openai');
    expect(detectProviderFamily('openai--gpt-4o')).toBe('openai');
  });

  it('classifies Gemini model ids by substring', () => {
    expect(detectProviderFamily('gemini-1.5-pro')).toBe('gemini');
    expect(detectProviderFamily('gemini-2.0-flash')).toBe('gemini');
  });

  it('returns unknown for unrecognized ids', () => {
    expect(detectProviderFamily('mistral-large')).toBe('unknown');
    expect(detectProviderFamily('deepseek-r1')).toBe('unknown');
    expect(detectProviderFamily('')).toBe('unknown');
  });
});

describe('isAnthropicOpus47', () => {
  it('matches Opus 4.7 and newer', () => {
    expect(isAnthropicOpus47('anthropic--claude-4.7-opus')).toBe(true);
    expect(isAnthropicOpus47('opus-4.7')).toBe(true);
    expect(isAnthropicOpus47('opus-5')).toBe(true);
    expect(isAnthropicOpus47('claude-4.7-opus')).toBe(true);
  });

  it('does not match older Opus versions', () => {
    expect(isAnthropicOpus47('opus-4.5')).toBe(false);
    expect(isAnthropicOpus47('opus-4')).toBe(false);
    expect(isAnthropicOpus47('claude-4.5-opus')).toBe(false);
  });

  it('does not match non-opus Anthropic models', () => {
    expect(isAnthropicOpus47('sonnet-5')).toBe(false);
    expect(isAnthropicOpus47('claude-3.5-sonnet')).toBe(false);
    expect(isAnthropicOpus47('haiku-3')).toBe(false);
  });
});

describe('resolveReasoning', () => {
  describe('Anthropic family', () => {
    it('emits `thinking` shape with budget_tokens derived from effort', () => {
      expect(resolveReasoning('anthropic--claude-4.7-opus', { effort: 'high' })).toEqual({
        thinking: { type: 'enabled', budget_tokens: 32000 },
      });
      expect(resolveReasoning('claude-3.5-sonnet', { effort: 'medium' })).toEqual({
        thinking: { type: 'enabled', budget_tokens: 10000 },
      });
      expect(resolveReasoning('claude-3-haiku', { effort: 'low' })).toEqual({
        thinking: { type: 'enabled', budget_tokens: 4096 },
      });
    });

    it('respects an explicit budget over the effort-derived default', () => {
      expect(
        resolveReasoning('anthropic--claude-4.7-opus', { effort: 'medium', budget: 25000 })
      ).toEqual({
        thinking: { type: 'enabled', budget_tokens: 25000 },
      });
    });

    it('emits `type: disabled` when reasoning is explicitly disabled', () => {
      expect(resolveReasoning('claude-3.5-sonnet', { enabled: false })).toEqual({
        thinking: { type: 'disabled' },
      });
      // Explicit disable wins over any effort level.
      expect(resolveReasoning('claude-3.5-sonnet', { enabled: false, effort: 'high' })).toEqual({
        thinking: { type: 'disabled' },
      });
    });

    it('emits `type: enabled` with no budget when only `enabled: true` is passed', () => {
      expect(resolveReasoning('claude-3.5-sonnet', { enabled: true })).toEqual({
        thinking: { type: 'enabled' },
      });
    });

    it('emits `thinking` with only a budget when no effort is provided', () => {
      expect(resolveReasoning('claude-3.5-sonnet', { budget: 8000 })).toEqual({
        thinking: { type: 'enabled', budget_tokens: 8000 },
      });
    });

    it('honors reasoning budget for Opus 4.7 without emitting reasoning_effort', () => {
      const result = resolveReasoning('anthropic--claude-4.7-opus', {
        effort: 'high',
        budget: 30000,
      });
      expect(result).toEqual({
        thinking: { type: 'enabled', budget_tokens: 30000 },
      });
      // Opus 4.7 must never receive the OpenAI-style reasoning_effort field.
      expect(result.reasoning_effort).toBeUndefined();
    });
  });

  describe('OpenAI family', () => {
    it('maps effort to `reasoning_effort` as-is', () => {
      expect(resolveReasoning('gpt-4o', { effort: 'low' })).toEqual({
        reasoning_effort: 'low',
      });
      expect(resolveReasoning('gpt-5', { effort: 'medium' })).toEqual({
        reasoning_effort: 'medium',
      });
      expect(resolveReasoning('o1-mini', { effort: 'high' })).toEqual({
        reasoning_effort: 'high',
      });
    });

    it('emits empty object when only enabled=true is passed (no effort level)', () => {
      // OpenAI needs an explicit level; `enabled` alone does not map.
      expect(resolveReasoning('gpt-4o', { enabled: true })).toEqual({});
    });

    it('emits empty object when reasoning is explicitly disabled', () => {
      expect(resolveReasoning('gpt-4o', { enabled: false })).toEqual({});
      expect(resolveReasoning('gpt-4o', { enabled: false, effort: 'high' })).toEqual({});
    });

    it('ignores `budget` for OpenAI (not part of the wire format)', () => {
      expect(resolveReasoning('gpt-4o', { budget: 12000 })).toEqual({});
      expect(resolveReasoning('gpt-4o', { budget: 12000, effort: 'medium' })).toEqual({
        reasoning_effort: 'medium',
      });
    });
  });

  describe('Gemini family', () => {
    it('emits `thinkingConfig.thinkingBudget` from an explicit budget', () => {
      expect(resolveReasoning('gemini-1.5-pro', { budget: 20000 })).toEqual({
        thinkingConfig: { thinkingBudget: 20000 },
      });
    });

    it('derives thinkingBudget from effort when no explicit budget is given', () => {
      expect(resolveReasoning('gemini-2.0-flash', { effort: 'high' })).toEqual({
        thinkingConfig: { thinkingBudget: 32000 },
      });
      expect(resolveReasoning('gemini-2.0-flash', { effort: 'low' })).toEqual({
        thinkingConfig: { thinkingBudget: 4096 },
      });
    });

    it('emits budget=0 when reasoning is explicitly disabled', () => {
      expect(resolveReasoning('gemini-1.5-pro', { enabled: false })).toEqual({
        thinkingConfig: { thinkingBudget: 0 },
      });
    });

    it('emits empty object when only enabled=true is passed (no budget hint)', () => {
      expect(resolveReasoning('gemini-1.5-pro', { enabled: true })).toEqual({});
    });
  });

  describe('unsupported / unknown models', () => {
    it('returns empty object for unknown model ids', () => {
      expect(resolveReasoning('mistral-large', { effort: 'high' })).toEqual({});
      expect(resolveReasoning('deepseek-r1', { effort: 'high', budget: 5000 })).toEqual({});
    });

    it('returns empty object when no reasoning intent is provided', () => {
      expect(resolveReasoning('gpt-4o', {})).toEqual({});
      expect(resolveReasoning('claude-3.5-sonnet', {})).toEqual({});
      expect(resolveReasoning('gemini-1.5-pro', {})).toEqual({});
    });
  });

  describe('shape invariants', () => {
    it('always returns a plain object (never null/undefined)', () => {
      expect(typeof resolveReasoning('gpt-4o', {})).toBe('object');
      expect(resolveReasoning('gpt-4o', {})).not.toBeNull();
      expect(resolveReasoning('unknown-model', { effort: 'high' })).not.toBeNull();
    });

    it('is safe to spread into an existing request payload', () => {
      const base = { model: 'gpt-4o', temperature: 0.3 };
      const merged = { ...base, ...resolveReasoning('gpt-4o', { effort: 'high' }) };
      expect(merged).toEqual({
        model: 'gpt-4o',
        temperature: 0.3,
        reasoning_effort: 'high',
      });
    });

    it('never lets Opus 4.7 emit reasoning_effort (issue #1381 acceptance)', () => {
      const result = resolveReasoning('anthropic--claude-4.7-opus', { effort: 'high' });
      expect(result.reasoning_effort).toBeUndefined();
      expect(result.thinking).toBeDefined();
    });
  });
});
