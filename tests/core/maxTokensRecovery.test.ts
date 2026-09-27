/**
 * Unit tests for the max-tokens recovery module (issue #1850).
 *
 * Verifies:
 *   - `isMaxTokensError` catches `max_tokens_exceeded`,
 *     `context_length_exceeded`, HTTP 413, HTTP 400 with a
 *     max-tokens message, and rejects unrelated errors.
 *   - `extractContextWindow` pulls a token count out of common
 *     provider phrasings.
 *   - `getModelContextWindow` returns per-family fallbacks.
 *   - `computeSafeMaxTokens` respects the min-floor and the
 *     `context - prompt - margin` formula.
 *   - `planMaxTokensRecovery` composes the above into a plan.
 *   - `confirmMaxTokensRecovery` auto-accepts in headless mode and
 *     honours a TUI callback when one is registered.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_CONTEXT_WINDOW_TOKENS,
  MIN_SAFE_MAX_TOKENS,
  computeSafeMaxTokens,
  computeSafetyMargin,
  confirmMaxTokensRecovery,
  extractContextWindow,
  getModelContextWindow,
  getRecoveryPrompt,
  isMaxTokensError,
  planMaxTokensRecovery,
  setRecoveryPrompt,
} from '../../src/core/maxTokensRecovery.js';

describe('isMaxTokensError', () => {
  it('detects max_tokens_exceeded body markers', () => {
    expect(isMaxTokensError(new Error('max_tokens_exceeded'))).toBe(true);
  });

  it('detects context_length_exceeded body markers', () => {
    expect(isMaxTokensError(new Error('Error: context_length_exceeded'))).toBe(true);
  });

  it('detects "maximum context length" phrasings', () => {
    expect(
      isMaxTokensError(new Error("This model's maximum context length is 128000 tokens"))
    ).toBe(true);
  });

  it('detects HTTP 413 by status code alone', () => {
    const err = Object.assign(new Error('Request Entity Too Large'), { statusCode: 413 });
    expect(isMaxTokensError(err)).toBe(true);
  });

  it('detects HTTP 400 combined with a max-tokens marker in the body', () => {
    const err = Object.assign(new Error('Bad Request'), {
      statusCode: 400,
      responseBody: { error: { code: 'context_length_exceeded' } },
    });
    expect(isMaxTokensError(err)).toBe(true);
  });

  it('rejects unrelated errors', () => {
    expect(isMaxTokensError(new Error('rate limit exceeded'))).toBe(false);
    expect(isMaxTokensError(new Error('ECONNREFUSED'))).toBe(false);
    expect(isMaxTokensError(null)).toBe(false);
    expect(isMaxTokensError(undefined)).toBe(false);
  });

  it('rejects a bare HTTP 400 without a max-tokens marker', () => {
    const err = Object.assign(new Error('missing required field: model'), { statusCode: 400 });
    expect(isMaxTokensError(err)).toBe(false);
  });
});

describe('extractContextWindow', () => {
  it('extracts from "maximum context length is X tokens"', () => {
    expect(extractContextWindow(new Error('maximum context length is 128000 tokens'))).toBe(128000);
  });

  it('extracts from "model supports up to X tokens"', () => {
    expect(extractContextWindow(new Error('The model supports up to 200000 tokens.'))).toBe(200000);
  });

  it('extracts from "context window: X"', () => {
    expect(extractContextWindow(new Error('context window: 8192'))).toBe(8192);
  });

  it('returns undefined when no count is present', () => {
    expect(extractContextWindow(new Error('some other error'))).toBeUndefined();
  });

  it('handles nested responseBody objects', () => {
    const err = {
      message: 'Bad Request',
      responseBody: { error: { message: 'maximum context length is 128000 tokens' } },
    };
    expect(extractContextWindow(err)).toBe(128000);
  });
});

describe('getModelContextWindow', () => {
  it('returns 200K for Claude family', () => {
    expect(getModelContextWindow('sap-ai-core/anthropic--claude-4.7-opus')).toBe(200000);
  });

  it('returns 128K for GPT-4 family', () => {
    expect(getModelContextWindow('gpt-4o')).toBe(128000);
    expect(getModelContextWindow('gpt-4-turbo')).toBe(128000);
  });

  it('returns 1M for Gemini 1.5+ family', () => {
    expect(getModelContextWindow('gemini-1.5-pro')).toBe(1000000);
    expect(getModelContextWindow('gemini-2.0-flash')).toBe(1000000);
  });

  it('falls back to the universal default when nothing matches', () => {
    expect(getModelContextWindow('unknown-model-xyz')).toBe(DEFAULT_CONTEXT_WINDOW_TOKENS);
    expect(getModelContextWindow('')).toBe(DEFAULT_CONTEXT_WINDOW_TOKENS);
  });
});

describe('computeSafetyMargin', () => {
  it('returns at least 1000 tokens', () => {
    expect(computeSafetyMargin(5000)).toBe(1000);
  });

  it('scales to 10% of the context window for large windows', () => {
    expect(computeSafetyMargin(200000)).toBe(20000);
  });

  it('returns the default for non-finite input', () => {
    expect(computeSafetyMargin(NaN)).toBe(1000);
    expect(computeSafetyMargin(-1)).toBe(1000);
  });
});

describe('computeSafeMaxTokens', () => {
  it('respects the min floor', () => {
    // Prompt effectively fills the whole window.
    const result = computeSafeMaxTokens({
      originalMaxTokens: 4096,
      contextWindow: 8192,
      estimatedPromptTokens: 8000,
      safetyMargin: 1000,
    });
    expect(result).toBe(MIN_SAFE_MAX_TOKENS);
  });

  it('does not exceed originalMaxTokens', () => {
    // Ample headroom, but original was 4096.
    const result = computeSafeMaxTokens({
      originalMaxTokens: 4096,
      contextWindow: 128000,
      estimatedPromptTokens: 1000,
      safetyMargin: 1000,
    });
    expect(result).toBe(4096);
  });

  it('uses the headroom formula when it is the tighter constraint', () => {
    const result = computeSafeMaxTokens({
      originalMaxTokens: 4096,
      contextWindow: 8192,
      estimatedPromptTokens: 5000,
      safetyMargin: 1000,
    });
    // 8192 - 5000 - 1000 = 2192
    expect(result).toBe(2192);
  });
});

describe('planMaxTokensRecovery', () => {
  it('extracts contextWindow from the error when available', () => {
    const plan = planMaxTokensRecovery({
      err: new Error("This model's maximum context length is 128000 tokens"),
      modelId: 'gpt-4o',
      originalMaxTokens: 4096,
      messages: [{ role: 'user', content: 'hello', timestamp: 0 }],
    });
    expect(plan.contextWindowExtracted).toBe(true);
    expect(plan.contextWindow).toBe(128000);
    // Very short prompt, so safeMaxTokens should equal originalMaxTokens
    // (no reduction needed, but the algorithm still returns the plan).
    expect(plan.safeMaxTokens).toBe(4096);
    expect(plan.reducedFromOriginal).toBe(false);
  });

  it('falls back to model-family window when the error omits a count', () => {
    const plan = planMaxTokensRecovery({
      err: new Error('max_tokens_exceeded'),
      modelId: 'anthropic--claude-4.7-opus',
      originalMaxTokens: 8192,
      messages: [{ role: 'user', content: 'x'.repeat(4), timestamp: 0 }],
    });
    expect(plan.contextWindowExtracted).toBe(false);
    expect(plan.contextWindow).toBe(200000);
  });

  it('reports reducedFromOriginal=true when the prompt actually forces a smaller budget', () => {
    // Prompt ~2000 tokens (8000 chars / 4). Context window 8192. Margin 1000.
    // Headroom = 8192 - 2000 - 1000 = 5192. originalMaxTokens=4096 -> safe=4096.
    // But if originalMaxTokens=6000, headroom clamps it to 5192.
    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 6000,
      messages: [{ role: 'user', content: 'x'.repeat(8000), timestamp: 0 }],
    });
    expect(plan.contextWindow).toBe(8192);
    expect(plan.reducedFromOriginal).toBe(true);
    expect(plan.safeMaxTokens).toBeLessThan(6000);
    expect(plan.safeMaxTokens).toBeGreaterThanOrEqual(MIN_SAFE_MAX_TOKENS);
  });

  it('clamps safeMaxTokens to the min floor when the prompt fills the window', () => {
    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 4096,
      // 32000 chars / 4 = 8000 tokens => exceeds window minus margin.
      messages: [{ role: 'user', content: 'x'.repeat(32000), timestamp: 0 }],
    });
    expect(plan.safeMaxTokens).toBe(MIN_SAFE_MAX_TOKENS);
  });
});

describe('confirmMaxTokensRecovery / setRecoveryPrompt', () => {
  beforeEach(() => {
    setRecoveryPrompt(null);
  });

  afterEach(() => {
    setRecoveryPrompt(null);
  });

  it('auto-accepts in headless mode (no callback registered)', async () => {
    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 6000,
      messages: [{ role: 'user', content: 'x'.repeat(8000), timestamp: 0 }],
    });
    expect(plan.reducedFromOriginal).toBe(true);
    const decision = await confirmMaxTokensRecovery(plan);
    expect(decision).toBe(true);
  });

  it('never accepts when the plan does not reduce maxTokens', async () => {
    const plan = planMaxTokensRecovery({
      err: new Error("This model's maximum context length is 128000 tokens"),
      modelId: 'gpt-4o',
      originalMaxTokens: 4096,
      messages: [{ role: 'user', content: 'hi', timestamp: 0 }],
    });
    expect(plan.reducedFromOriginal).toBe(false);
    const decision = await confirmMaxTokensRecovery(plan);
    expect(decision).toBe(false);
  });

  it('routes through the registered TUI callback', async () => {
    const seenPlans: unknown[] = [];
    setRecoveryPrompt(async (plan) => {
      seenPlans.push(plan);
      return true;
    });
    expect(getRecoveryPrompt()).not.toBeNull();

    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 6000,
      messages: [{ role: 'user', content: 'x'.repeat(8000), timestamp: 0 }],
    });
    const decision = await confirmMaxTokensRecovery(plan);
    expect(decision).toBe(true);
    expect(seenPlans).toHaveLength(1);
  });

  it('honours a decline from the TUI callback', async () => {
    setRecoveryPrompt(() => false);
    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 6000,
      messages: [{ role: 'user', content: 'x'.repeat(8000), timestamp: 0 }],
    });
    const decision = await confirmMaxTokensRecovery(plan);
    expect(decision).toBe(false);
  });

  it('declines when the TUI callback itself throws', async () => {
    setRecoveryPrompt(() => {
      throw new Error('UI unavailable');
    });
    const plan = planMaxTokensRecovery({
      err: new Error('maximum context length is 8192 tokens'),
      modelId: 'gpt-4-legacy',
      originalMaxTokens: 6000,
      messages: [{ role: 'user', content: 'x'.repeat(8000), timestamp: 0 }],
    });
    const decision = await confirmMaxTokensRecovery(plan);
    expect(decision).toBe(false);
  });
});
