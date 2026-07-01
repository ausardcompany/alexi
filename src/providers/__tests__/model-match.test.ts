import { describe, expect, it } from 'vitest';
import { modelSupportsReasoningEffort, supportsReasoning } from '../model-match.js';

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
