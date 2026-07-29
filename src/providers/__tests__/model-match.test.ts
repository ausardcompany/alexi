import { describe, expect, it } from 'vitest';
import {
  ANTHROPIC_MODELS,
  isAnthropicModel,
  modelSupportsReasoningEffort,
  supportsReasoning,
} from '../model-match.js';

describe('modelSupportsReasoningEffort', () => {
  it('returns "levels" for deepseek model ids', () => {
    expect(modelSupportsReasoningEffort('deepseek-r1')).toBe('levels');
  });

  it('is case-insensitive when matching deepseek', () => {
    expect(modelSupportsReasoningEffort('DeepSeek-R1')).toBe('levels');
    expect(modelSupportsReasoningEffort('sap-ai-core/DEEPSEEK-V3')).toBe('levels');
  });

  it('returns "none" for an empty model id', () => {
    expect(modelSupportsReasoningEffort('')).toBe('none');
  });

  it('returns "levels" for Anthropic Opus 4.7 (pinned AGENT_MODEL)', () => {
    expect(modelSupportsReasoningEffort('sap-ai-core/anthropic--claude-4.7-opus')).toBe('levels');
  });

  it('returns "levels" for Anthropic Sonnet 5+', () => {
    expect(modelSupportsReasoningEffort('anthropic--claude-5-sonnet')).toBe('levels');
  });

  it('returns "none" for Opus below the 4.7 gate', () => {
    expect(modelSupportsReasoningEffort('claude-4.6-opus')).toBe('none');
  });

  it('returns "none" for Sonnet below the 5 gate', () => {
    expect(modelSupportsReasoningEffort('claude-4-sonnet')).toBe('none');
  });

  it('returns "none" for Claude 3.5 Sonnet (regression guard)', () => {
    expect(modelSupportsReasoningEffort('claude-3.5-sonnet')).toBe('none');
  });

  it('is case-insensitive when matching Anthropic Opus 4.7', () => {
    expect(modelSupportsReasoningEffort('SAP-AI-CORE/ANTHROPIC--CLAUDE-4.7-OPUS')).toBe('levels');
  });
});

describe('supportsReasoning (Claude family unchanged)', () => {
  it('still returns true for Anthropic Claude ids', () => {
    expect(supportsReasoning('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });
});

describe('ANTHROPIC_MODELS catalog', () => {
  it('includes claude-opus-4 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4');
    expect(ANTHROPIC_MODELS).toContain('claude-opus-4-1221-v1');
  });

  it('includes claude-sonnet-4.5 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.5');
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.5-1221-v1');
  });

  it('includes claude-sonnet-4.7 and its -1221-v1 extended-context variant', () => {
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.7');
    expect(ANTHROPIC_MODELS).toContain('claude-sonnet-4.7-1221-v1');
  });

  it('is frozen/readonly at the type level and non-empty at runtime', () => {
    expect(Array.isArray(ANTHROPIC_MODELS)).toBe(true);
    expect(ANTHROPIC_MODELS.length).toBeGreaterThan(0);
  });
});

describe('isAnthropicModel', () => {
  it('returns true for claude-opus-4', () => {
    expect(isAnthropicModel('claude-opus-4')).toBe(true);
  });

  it('returns true for claude-sonnet-4.7-1221-v1', () => {
    expect(isAnthropicModel('claude-sonnet-4.7-1221-v1')).toBe(true);
  });

  it('returns true for claude-sonnet-4.5 and its -1221-v1 variant', () => {
    expect(isAnthropicModel('claude-sonnet-4.5')).toBe(true);
    expect(isAnthropicModel('claude-sonnet-4.5-1221-v1')).toBe(true);
  });

  it('returns true for provider-prefixed SAP AI Core Anthropic ids', () => {
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-opus-4')).toBe(true);
    expect(isAnthropicModel('sap-ai-core/anthropic--claude-4.7-opus')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAnthropicModel('CLAUDE-OPUS-4')).toBe(true);
    expect(isAnthropicModel('Claude-Sonnet-4.7')).toBe(true);
  });

  it('falls back to the claude substring for unlisted Claude variants', () => {
    // Not in the explicit catalog, but still an Anthropic model.
    expect(isAnthropicModel('claude-99-experimental')).toBe(true);
  });

  it('returns false for non-Anthropic model ids', () => {
    expect(isAnthropicModel('gpt-4o')).toBe(false);
    expect(isAnthropicModel('deepseek-r1')).toBe(false);
    expect(isAnthropicModel('gemini-2.5-pro')).toBe(false);
    expect(isAnthropicModel('')).toBe(false);
  });
});
