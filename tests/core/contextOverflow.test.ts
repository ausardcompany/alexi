import { describe, it, expect } from 'vitest';

import {
  isContextOverflowError,
  detectContextOverflow,
  CONTEXT_OVERFLOW_PATTERNS,
  CONTEXT_OVERFLOW_USER_MESSAGE,
} from '../../src/core/contextOverflow.js';

describe('CONTEXT_OVERFLOW_PATTERNS', () => {
  // Each row is a real-world overflow message we want to detect.
  // Sources: OpenAI, Anthropic, and SAP AI Core error payloads plus the
  // upstream OpenCode PR #37840 expansion.
  const overflowMessages: Array<[string, string]> = [
    ['context_length_exceeded', "This model's context_length_exceeded error"],
    ['context length', "This model's maximum context length is 8192 tokens"],
    ['maximum context length', 'maximum context length is 200000 tokens'],
    ['maximum context', 'The maximum context of 128000 tokens has been exceeded'],
    ['context window', 'Request exceeds the model context window of 200k'],
    ['context_window', 'error: context_window exceeded (200000 tokens)'],
    ['context limit', 'You have hit the context limit for this model'],
    ['exceeds the context', 'The prompt exceeds the context of this deployment'],
    ['context exceeded', 'context has been exceeded, please shorten input'],
    ['too_many_tokens', 'error code: too_many_tokens (received 300000)'],
    ['too many tokens', 'Too many tokens for gpt-4o-mini'],
    ['token limit exceeded', 'daily token limit exceeded for account'],
    ['max_tokens_exceeded', 'max_tokens_exceeded when calling deployment'],
    ['input too long', 'Input is too long for the model'],
    ['request too large', 'Request too large for tier'],
    ['prompt too long', 'The prompt is too long, please truncate'],
  ];

  it.each(overflowMessages)('matches %s pattern', (_label, message) => {
    expect(isContextOverflowError(new Error(message))).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isContextOverflowError(new Error('CONTEXT WINDOW EXCEEDED'))).toBe(true);
    expect(isContextOverflowError(new Error('Context Window Exceeded'))).toBe(true);
    expect(isContextOverflowError(new Error('CONTEXT_LENGTH_EXCEEDED'))).toBe(true);
  });

  it('accepts non-Error thrown values (string, plain object)', () => {
    expect(isContextOverflowError('context_length_exceeded')).toBe(true);
    expect(isContextOverflowError({ toString: () => 'context window overflow' })).toBe(true);
  });

  it('does NOT match unrelated errors', () => {
    expect(isContextOverflowError(new Error('rate limit exceeded'))).toBe(false);
    expect(isContextOverflowError(new Error('deployment_not_found'))).toBe(false);
    expect(isContextOverflowError(new Error('fetch failed'))).toBe(false);
    expect(isContextOverflowError(new Error('401 unauthorized'))).toBe(false);
    expect(isContextOverflowError(new Error(''))).toBe(false);
    expect(isContextOverflowError(undefined)).toBe(false);
    expect(isContextOverflowError(null)).toBe(false);
  });

  it('exposes a non-empty user-facing message constant', () => {
    expect(CONTEXT_OVERFLOW_USER_MESSAGE).toMatch(/context/i);
    expect(CONTEXT_OVERFLOW_USER_MESSAGE.length).toBeGreaterThan(0);
  });

  it('exports the pattern list for downstream introspection', () => {
    expect(Array.isArray(CONTEXT_OVERFLOW_PATTERNS)).toBe(true);
    // Sanity check: expanded list should be at least as large as the
    // original (which had 9 patterns).
    expect(CONTEXT_OVERFLOW_PATTERNS.length).toBeGreaterThanOrEqual(9);
    for (const pat of CONTEXT_OVERFLOW_PATTERNS) {
      expect(pat).toBeInstanceOf(RegExp);
      // All patterns must be case-insensitive.
      expect(pat.flags).toContain('i');
    }
  });
});

describe('detectContextOverflow', () => {
  it('returns undefined for non-overflow errors', () => {
    expect(detectContextOverflow(new Error('boom'), 1000, 10000)).toBeUndefined();
    expect(detectContextOverflow(new Error('rate limit'), 100, 200)).toBeUndefined();
  });

  it('extracts a 4+ digit token count from the message when larger than max', () => {
    const err = new Error(
      "This model's maximum context length is 128000 tokens but you requested 130000 tokens"
    );
    // Regex picks the first 4+ digit run: 128000. It is NOT > maxTokens
    // (128000), so falls through to the currentEstimate branch. Use a
    // clearer input where the first match is the over-max count.
    const err2 = new Error('context_length_exceeded: 200000 tokens requested');
    expect(detectContextOverflow(err2, 0, 128000)).toBe(200000 - 128000);
    // The first-example fallback path (currentEstimate > max):
    expect(detectContextOverflow(err, 150000, 128000)).toBe(150000 - 128000);
  });

  it('uses currentEstimate - maxTokens when no token count in message', () => {
    const err = new Error('context window exceeded');
    expect(detectContextOverflow(err, 30000, 20000)).toBe(10000);
  });

  it('falls back to 20% of the current estimate when nothing else is available', () => {
    const err = new Error('context window overflow');
    expect(detectContextOverflow(err, 1000, 10000)).toBe(200);
  });
});
