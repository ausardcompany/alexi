import { describe, expect, it } from 'vitest';
import { modelSupportsReasoningEffort } from '../model-match.js';

describe('modelSupportsReasoningEffort', () => {
  it('returns "levels" for deepseek model ids', () => {
    expect(modelSupportsReasoningEffort('deepseek-r1')).toBe('levels');
  });

  it('is case-insensitive when matching deepseek', () => {
    expect(modelSupportsReasoningEffort('DeepSeek-R1')).toBe('levels');
    expect(modelSupportsReasoningEffort('sap-ai-core/DEEPSEEK-V3')).toBe('levels');
  });

  it('returns "none" for an unknown model id', () => {
    expect(modelSupportsReasoningEffort('anthropic--claude-4.7-opus')).toBe('none');
  });

  it('returns "none" for an empty model id', () => {
    expect(modelSupportsReasoningEffort('')).toBe('none');
  });
});
