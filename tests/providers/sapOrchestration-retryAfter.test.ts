/**
 * Retry-After header handling + user-friendly rate-limit messages (issue #1373).
 *
 * These tests exercise the extended behaviour added on top of the
 * existing free-tier detection:
 *
 *   1. `parseRetryAfterHeader` accepts both the integer-seconds and
 *      HTTP-date shapes of the `Retry-After` header.
 *   2. `extractRetryAfterSeconds` finds the header across the common
 *      error shapes (direct `.headers`, nested `.response.headers`, a
 *      fetch `Headers`-like object, and pre-parsed `retryAfter` fields).
 *   3. `classifyRateLimitError` now wraps EVERY 429 in a user-friendly
 *      error class — `FreeTierRateLimitError` for free-tier models,
 *      `ProviderRateLimitError` for paid-tier models — and forwards the
 *      retry-after value to the error constructor.
 *   4. `ProviderRateLimitError` carries actionable guidance (wait /
 *      switch-model / upgrade) and the docs link.
 *   5. `isRateLimitError` in `error-backoff.ts` recognises both variants
 *      structurally.
 *   6. `ErrorBackoff.recordError` respects the `retryAfterSeconds`
 *      window when scheduling the next attempt.
 */

import { describe, it, expect } from 'vitest';

import {
  FreeTierRateLimitError,
  ProviderRateLimitError,
  PROVIDER_RATE_LIMIT_CODE,
  SAP_AI_CORE_RATE_LIMIT_DOCS_URL,
  classifyRateLimitError,
  extractRetryAfterSeconds,
  parseRetryAfterHeader,
} from '../../src/providers/sapOrchestration.js';
import { ErrorBackoff, isRateLimitError, getRetryAfterMs } from '../../src/core/error-backoff.js';

describe('parseRetryAfterHeader', () => {
  it('parses integer-seconds format', () => {
    expect(parseRetryAfterHeader('120')).toBe(120);
    expect(parseRetryAfterHeader('0')).toBe(0);
    expect(parseRetryAfterHeader('  60  ')).toBe(60);
  });

  it('parses HTTP-date format into a delta from now', () => {
    const future = new Date(Date.now() + 30_000).toUTCString();
    const parsed = parseRetryAfterHeader(future);
    // Allow a small jitter window for test timing.
    expect(parsed).toBeGreaterThanOrEqual(28);
    expect(parsed).toBeLessThanOrEqual(31);
  });

  it('returns 0 for HTTP-date values already in the past', () => {
    const past = new Date(Date.now() - 60_000).toUTCString();
    expect(parseRetryAfterHeader(past)).toBe(0);
  });

  it('returns undefined for missing, empty, or unparseable inputs', () => {
    expect(parseRetryAfterHeader(undefined)).toBeUndefined();
    expect(parseRetryAfterHeader('')).toBeUndefined();
    expect(parseRetryAfterHeader('   ')).toBeUndefined();
    expect(parseRetryAfterHeader('not a date and not a number')).toBeUndefined();
    // Non-string inputs are rejected upfront.
    expect(parseRetryAfterHeader(60 as unknown as string)).toBeUndefined();
  });

  it('rejects hex/octal literals that parseInt would otherwise accept', () => {
    // The anchored /^\d+$/ regex guards against sloppy numeric coercion.
    expect(parseRetryAfterHeader('0x10')).toBeUndefined();
    expect(parseRetryAfterHeader('12abc')).toBeUndefined();
  });
});

describe('extractRetryAfterSeconds', () => {
  it('reads a numeric header from a plain-object headers bag', () => {
    const err = { status: 429, headers: { 'Retry-After': '45' } };
    expect(extractRetryAfterSeconds(err)).toBe(45);
  });

  it('reads a header from nested response.headers (fetch-wrapper shape)', () => {
    const err = { response: { status: 429, headers: { 'retry-after': '90' } } };
    expect(extractRetryAfterSeconds(err)).toBe(90);
  });

  it('is case-insensitive for the header name', () => {
    const err = { headers: { 'RETRY-AFTER': '15' } };
    expect(extractRetryAfterSeconds(err)).toBe(15);
  });

  it('reads a header from a fetch Headers-like object with .get()', () => {
    const headers = {
      get(name: string): string | null {
        return name.toLowerCase() === 'retry-after' ? '30' : null;
      },
    };
    const err = { headers, status: 429 };
    expect(extractRetryAfterSeconds(err)).toBe(30);
  });

  it('reads a pre-parsed numeric retryAfter field', () => {
    expect(extractRetryAfterSeconds({ retryAfter: 12 })).toBe(12);
    expect(extractRetryAfterSeconds({ retry_after: 7 })).toBe(7);
  });

  it('reads a string retryAfter field via parseRetryAfterHeader', () => {
    expect(extractRetryAfterSeconds({ retryAfter: '20' })).toBe(20);
  });

  it('returns undefined when no header is present', () => {
    expect(extractRetryAfterSeconds({})).toBeUndefined();
    expect(extractRetryAfterSeconds({ headers: {} })).toBeUndefined();
    expect(extractRetryAfterSeconds({ status: 429 })).toBeUndefined();
  });

  it('returns undefined for non-object inputs', () => {
    expect(extractRetryAfterSeconds(null)).toBeUndefined();
    expect(extractRetryAfterSeconds(undefined)).toBeUndefined();
    expect(extractRetryAfterSeconds('boom')).toBeUndefined();
  });
});

describe('classifyRateLimitError with Retry-After', () => {
  it('wraps a paid-tier 429 in ProviderRateLimitError with retry-after', () => {
    const upstream = { status: 429, headers: { 'retry-after': '60' }, message: '429' };
    const classified = classifyRateLimitError(upstream, 'anthropic--claude-4.5-sonnet');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.code).toBe(PROVIDER_RATE_LIMIT_CODE);
    expect(wrapped.statusCode).toBe(429);
    expect(wrapped.retryAfterSeconds).toBe(60);
    expect(wrapped.modelName).toBe('anthropic--claude-4.5-sonnet');
    expect((wrapped as Error & { cause?: unknown }).cause).toBe(upstream);
  });

  it('wraps a free-tier 429 in FreeTierRateLimitError with retry-after', () => {
    const upstream = { status: 429, headers: { 'retry-after': '120' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    expect(wrapped.retryAfterSeconds).toBe(120);
  });

  it('produces a ProviderRateLimitError even when no Retry-After is present', () => {
    const upstream: Error & { status?: number } = new Error('Too Many Requests');
    upstream.status = 429;
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.retryAfterSeconds).toBeUndefined();
  });

  it('does not double-wrap an existing ProviderRateLimitError', () => {
    const already = new ProviderRateLimitError('gpt-4o', undefined, 30);
    const classified = classifyRateLimitError(already, 'gpt-4o');
    expect(classified).toBe(already);
  });
});

describe('ProviderRateLimitError message contents', () => {
  it('mentions the model, options, and docs link (no retry-after)', () => {
    const err = new ProviderRateLimitError('anthropic--claude-4.7-opus');
    expect(err.name).toBe('ProviderRateLimitError');
    expect(err.code).toBe(PROVIDER_RATE_LIMIT_CODE);
    expect(err.docsUrl).toBe(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    expect(err.message).toContain("'anthropic--claude-4.7-opus'");
    expect(err.message.toLowerCase()).toContain('rate limit');
    // Three concrete options must be surfaced.
    expect(err.message.toLowerCase()).toContain('wait');
    expect(err.message.toLowerCase()).toContain('smaller model');
    expect(err.message.toLowerCase()).toContain('upgrade');
    expect(err.message).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('inserts the specific retry-after time when provided', () => {
    const err = new ProviderRateLimitError('gpt-4o', undefined, 42);
    expect(err.retryAfterSeconds).toBe(42);
    expect(err.message).toContain('Wait 42 seconds');
  });

  it('falls back to a generic wait when retry-after is missing', () => {
    const err = new ProviderRateLimitError('gpt-4o');
    // Default wait guidance is 60 seconds when the server did not tell
    // us — the number must be visible so the user is not staring at "later".
    expect(err.message).toContain('Wait 60 seconds');
  });

  it('is an Error subclass with the stable name "ProviderRateLimitError"', () => {
    const err = new ProviderRateLimitError('gpt-4o');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ProviderRateLimitError);
    expect(err.name).toBe('ProviderRateLimitError');
  });
});

describe('FreeTierRateLimitError with retry-after', () => {
  it('surfaces the retry-after value in the message when supplied', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free', undefined, 15);
    expect(err.retryAfterSeconds).toBe(15);
    expect(err.message).toContain('Retry after 15 seconds');
  });

  it('omits the retry-after phrase when the header was absent', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free');
    expect(err.retryAfterSeconds).toBeUndefined();
    expect(err.message).not.toContain('Retry after');
  });
});

describe('isRateLimitError', () => {
  it('recognises the free-tier variant by code', () => {
    expect(isRateLimitError(new FreeTierRateLimitError('gpt-4o-free'))).toBe(true);
    expect(isRateLimitError({ code: 'free_tier_rate_limit' })).toBe(true);
  });

  it('recognises the paid-tier variant by code', () => {
    expect(isRateLimitError(new ProviderRateLimitError('gpt-4o'))).toBe(true);
    expect(isRateLimitError({ code: 'provider_rate_limit' })).toBe(true);
  });

  it('recognises rate-limit errors by name (cross-module boundary)', () => {
    // Duck-typed shape that lost `instanceof` identity across a module boundary.
    expect(isRateLimitError({ name: 'FreeTierRateLimitError' })).toBe(true);
    expect(isRateLimitError({ name: 'ProviderRateLimitError' })).toBe(true);
  });

  it('recognises a bare 429 by statusCode', () => {
    expect(isRateLimitError({ statusCode: 429 })).toBe(true);
  });

  it('returns false for non-rate-limit errors', () => {
    expect(isRateLimitError(new Error('boom'))).toBe(false);
    expect(isRateLimitError({ statusCode: 500 })).toBe(false);
    expect(isRateLimitError(null)).toBe(false);
    expect(isRateLimitError(undefined)).toBe(false);
    expect(isRateLimitError('boom')).toBe(false);
  });
});

describe('getRetryAfterMs', () => {
  it('returns milliseconds when the error carries retryAfterSeconds', () => {
    expect(getRetryAfterMs(new ProviderRateLimitError('m', undefined, 5))).toBe(5000);
    expect(getRetryAfterMs({ retryAfterSeconds: 12 })).toBe(12_000);
  });

  it('preserves a zero retry-after (server allows immediate retry)', () => {
    expect(getRetryAfterMs({ retryAfterSeconds: 0 })).toBe(0);
  });

  it('returns undefined when no retryAfterSeconds is present', () => {
    expect(getRetryAfterMs(new ProviderRateLimitError('m'))).toBeUndefined();
    expect(getRetryAfterMs({})).toBeUndefined();
    expect(getRetryAfterMs(null)).toBeUndefined();
  });

  it('rejects negative or non-finite retryAfterSeconds values', () => {
    expect(getRetryAfterMs({ retryAfterSeconds: -1 })).toBeUndefined();
    expect(getRetryAfterMs({ retryAfterSeconds: Number.POSITIVE_INFINITY })).toBeUndefined();
    expect(getRetryAfterMs({ retryAfterSeconds: Number.NaN })).toBeUndefined();
  });
});

describe('ErrorBackoff honours Retry-After', () => {
  it('uses the retry-after window instead of the default schedule', () => {
    // Small initial delay so we can distinguish the two paths cleanly.
    const backoff = new ErrorBackoff({ initialDelayMs: 100, maxDelayMs: 10_000 });
    const err = new ProviderRateLimitError('gpt-4o', undefined, 5);
    const before = Date.now();
    backoff.recordError(429, err);
    const remaining = backoff.getRemainingBackoffMs();
    // We expect ~5000 ms, well above the 100 ms default schedule.
    expect(remaining).toBeGreaterThanOrEqual(4000);
    expect(remaining).toBeLessThanOrEqual(5100);
    // Sanity: the backoff is not in the past.
    expect(before + remaining).toBeGreaterThanOrEqual(before);
  });

  it('falls back to the default schedule when no retry-after is present', () => {
    const backoff = new ErrorBackoff({ initialDelayMs: 100, maxDelayMs: 10_000 });
    const err: Error & { statusCode?: number } = new Error('Too Many Requests');
    err.statusCode = 429;
    backoff.recordError(429, err);
    const remaining = backoff.getRemainingBackoffMs();
    // First attempt: initialDelay * multiplier^0 = 100 ms.
    expect(remaining).toBeLessThanOrEqual(150);
  });

  it('caps the retry-after wait at the configured maxDelayMs', () => {
    const backoff = new ErrorBackoff({ initialDelayMs: 100, maxDelayMs: 2_000 });
    const err = new ProviderRateLimitError('gpt-4o', undefined, 3600); // 1h
    backoff.recordError(429, err);
    const remaining = backoff.getRemainingBackoffMs();
    // Server told us to wait an hour, but the config says max 2s.
    expect(remaining).toBeLessThanOrEqual(2_000);
    expect(remaining).toBeGreaterThanOrEqual(1_500);
  });

  it('paid-tier 429 is NOT marked fatal (transient)', () => {
    const backoff = new ErrorBackoff();
    backoff.recordError(429, new ProviderRateLimitError('gpt-4o', undefined, 5));
    expect(backoff.isFatal()).toBe(false);
  });
});
