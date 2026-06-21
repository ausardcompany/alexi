import { describe, expect, it, vi } from 'vitest';

vi.mock('../model-match.js', async () => {
  const actual = await vi.importActual<typeof import('../model-match.js')>('../model-match.js');
  return {
    ...actual,
    modelSupportsReasoningEffort: vi.fn((modelId: string) => {
      const lower = modelId.toLowerCase();
      if (lower.includes('deepseek')) {
        return 'levels';
      }
      if (lower.includes('binary-thinker')) {
        return 'binary';
      }
      return 'none';
    }),
  };
});

import { buildDeepSeekRequest } from '../deepseek.js';

describe('buildDeepSeekRequest', () => {
  const messages = [{ role: 'user', content: 'hi' }];

  describe('reasoning_effort dispatch', () => {
    it('preserves existing deepseek behaviour bit-for-bit when modelId is omitted ("levels" default)', () => {
      const request = buildDeepSeekRequest(messages, { reasoningEffort: 'high' });
      expect(request.reasoning_effort).toBe('high');
      expect(request.enable_thinking).toBeUndefined();
    });

    it('sends reasoning_effort as-is for "levels" mode (deepseek modelId)', () => {
      const request = buildDeepSeekRequest(messages, {
        reasoningEffort: 'medium',
        modelId: 'deepseek-r1',
      });
      expect(request.reasoning_effort).toBe('medium');
      expect(request.enable_thinking).toBeUndefined();
    });

    it('sends enable_thinking: true and drops reasoning_effort for "binary" mode', () => {
      const request = buildDeepSeekRequest(messages, {
        reasoningEffort: 'low',
        modelId: 'binary-thinker-v1',
      });
      expect(request.enable_thinking).toBe(true);
      expect(request.reasoning_effort).toBeUndefined();
    });

    it('does not forward reasoning_effort for "none" mode (unknown modelId)', () => {
      const request = buildDeepSeekRequest(messages, {
        reasoningEffort: 'high',
        modelId: 'anthropic--claude-4.7-opus',
      });
      expect(request.reasoning_effort).toBeUndefined();
      expect(request.enable_thinking).toBeUndefined();
    });

    it('does nothing when reasoningEffort is not provided', () => {
      const request = buildDeepSeekRequest(messages, {});
      expect(request.reasoning_effort).toBeUndefined();
      expect(request.enable_thinking).toBeUndefined();
    });
  });

  describe('max_tokens handling (unchanged)', () => {
    it('forwards numeric max_tokens', () => {
      const request = buildDeepSeekRequest(messages, { maxTokens: 256 });
      expect(request.max_tokens).toBe(256);
      expect(request.max_completion_tokens).toBeUndefined();
    });

    it('forwards "max" as max_completion_tokens', () => {
      const request = buildDeepSeekRequest(messages, { maxTokens: 'max' });
      expect(request.max_completion_tokens).toBe('max');
      expect(request.max_tokens).toBeUndefined();
    });
  });
});
