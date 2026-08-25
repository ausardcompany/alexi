import { describe, expect, it } from 'vitest';

import {
  evaluateCompleteness,
  isReasoningOnly,
  type MessagePart,
} from '../../src/core/session/processor.js';
import { usableOutputBudget } from '../../src/core/session/overflow.js';
import { preserveCompletionLimit } from '../../src/providers/transform.js';

describe('session/processor.evaluateCompleteness', () => {
  it('signals retry when only reasoning parts are present and finishReason != stop', () => {
    const parts: MessagePart[] = [
      { type: 'reasoning', text: 'thinking' },
      { type: 'thinking', text: 'more thinking' },
    ];
    expect(evaluateCompleteness({ parts, finishReason: 'length' })).toEqual({
      status: 'retry',
      reason: 'reasoning-only',
    });
  });

  it('is complete when finishReason is stop, even if reasoning-only', () => {
    const parts: MessagePart[] = [{ type: 'reasoning', text: 'r' }];
    expect(evaluateCompleteness({ parts, finishReason: 'stop' })).toEqual({ status: 'complete' });
  });

  it('is complete when a visible text part is present', () => {
    const parts: MessagePart[] = [
      { type: 'reasoning', text: 'r' },
      { type: 'text', text: 'hello' },
    ];
    expect(evaluateCompleteness({ parts, finishReason: 'length' })).toEqual({
      status: 'complete',
    });
  });

  it('isReasoningOnly returns false for an empty parts list', () => {
    expect(isReasoningOnly([])).toBe(false);
  });
});

describe('session/overflow.usableOutputBudget', () => {
  it('subtracts only visible output tokens', () => {
    expect(usableOutputBudget(1000, { output: 200, reasoningEncrypted: 500 })).toBe(800);
  });

  it('clamps to zero on overshoot', () => {
    expect(usableOutputBudget(100, { output: 300 })).toBe(0);
  });

  it('ignores missing reasoningEncrypted', () => {
    expect(usableOutputBudget(500, { output: 100 })).toBe(400);
  });
});

describe('providers/transform.preserveCompletionLimit', () => {
  it('caps at the provider hard limit when computed is higher (cerebras)', () => {
    expect(preserveCompletionLimit('cerebras', 100_000)).toBe(8192);
  });

  it('returns computed when below the provider cap', () => {
    expect(preserveCompletionLimit('cerebras', 1024)).toBe(1024);
  });

  it('passes through unchanged for providers with no declared cap', () => {
    expect(preserveCompletionLimit('sap-ai-core', 32_000)).toBe(32_000);
  });

  it('never returns a negative limit', () => {
    expect(preserveCompletionLimit('unknown', -5)).toBe(0);
  });
});
