/**
 * Actionable rate-limit error tests (issue #1534).
 *
 * The provider layer extracts `Retry-After`, `X-RateLimit-Reset`, and
 * `X-RateLimit-Limit` from a 429 response and encodes them on the typed
 * rate-limit error. `src/core/error-backoff.ts` then honours those hints
 * when scheduling the next retry:
 *
 *   1. `retryAfterSeconds` (from `Retry-After`) wins over the exponential
 *      backoff schedule when present.
 *   2. `resetAt` (from `X-RateLimit-Reset`) is the fallback when
 *      `Retry-After` was absent — converted to a delta from wall-clock.
 *   3. Otherwise, the standard `initialDelay * multiplier^n` curve runs.
 *
 * These tests live under `tests/core/` (per the issue's file path
 * request) and are complementary to the existing suite in
 * `src/core/__tests__/error-backoff.test.ts` — no assertions are
 * duplicated across the two files.
 */

import { describe, it, expect } from 'vitest';

import {
  ErrorBackoff,
  classifyError,
  getRetryAfterMs,
  isKnownThrottle,
  isRateLimitError,
} from '../../src/core/error-backoff.js';
import {
  FreeTierRateLimitError,
  ProviderRateLimitError,
  classifyRateLimitError,
  extractRateLimitReset,
  extractRateLimitLimit,
  parseRateLimitResetHeader,
} from '../../src/providers/sapOrchestration.js';

describe('parseRateLimitResetHeader', () => {
  it('parses an integer epoch-seconds value into a Date', () => {
    // 2033-05-18T03:33:20Z — a well-known 10-digit epoch that will not
    // be confused with a delta or a "recent" 13-digit ms value.
    const parsed = parseRateLimitResetHeader('2000000000');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getUTCFullYear()).toBe(2033);
  });

  it('parses a 13-digit epoch-milliseconds value into a Date', () => {
    const ms = 2_000_000_000_000; // year 2033, millisecond precision.
    const parsed = parseRateLimitResetHeader(String(ms));
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getTime()).toBe(ms);
  });

  it('accepts a numeric input (not just a string)', () => {
    const parsed = parseRateLimitResetHeader(2_000_000_000);
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getUTCFullYear()).toBe(2033);
  });

  it('rejects garbage / non-integer strings', () => {
    expect(parseRateLimitResetHeader('not-a-time')).toBeUndefined();
    expect(parseRateLimitResetHeader('')).toBeUndefined();
    expect(parseRateLimitResetHeader('  ')).toBeUndefined();
    expect(parseRateLimitResetHeader('12.5')).toBeUndefined();
    expect(parseRateLimitResetHeader(undefined)).toBeUndefined();
    expect(parseRateLimitResetHeader(null)).toBeUndefined();
  });
});

describe('extractRateLimitReset', () => {
  it('reads a header from err.headers (record shape, mixed case)', () => {
    const err = { status: 429, headers: { 'X-RateLimit-Reset': '2000000000' } };
    const parsed = extractRateLimitReset(err);
    expect(parsed).toBeInstanceOf(Date);
  });

  it('reads a lower-case header (HTTP/2 style)', () => {
    const err = { status: 429, headers: { 'x-ratelimit-reset': '2000000000' } };
    expect(extractRateLimitReset(err)).toBeInstanceOf(Date);
  });

  it('reads from response.headers (fetch-wrapper style)', () => {
    const err = { response: { headers: { 'X-RateLimit-Reset': '2000000000' } } };
    expect(extractRateLimitReset(err)).toBeInstanceOf(Date);
  });

  it('returns undefined when the header is absent', () => {
    expect(extractRateLimitReset({ status: 429 })).toBeUndefined();
    expect(extractRateLimitReset({})).toBeUndefined();
    expect(extractRateLimitReset(null)).toBeUndefined();
    expect(extractRateLimitReset(undefined)).toBeUndefined();
  });
});

describe('extractRateLimitLimit', () => {
  it('reads the integer quota from X-RateLimit-Limit', () => {
    expect(extractRateLimitLimit({ headers: { 'X-RateLimit-Limit': '5000' } })).toBe(5000);
  });

  it('reads a lower-case header', () => {
    expect(extractRateLimitLimit({ headers: { 'x-ratelimit-limit': '10' } })).toBe(10);
  });

  it('reads from response.headers', () => {
    expect(extractRateLimitLimit({ response: { headers: { 'X-RateLimit-Limit': '42' } } })).toBe(
      42
    );
  });

  it('returns undefined when the header is missing or garbage', () => {
    expect(extractRateLimitLimit({})).toBeUndefined();
    expect(extractRateLimitLimit({ headers: { 'X-RateLimit-Limit': 'many' } })).toBeUndefined();
    expect(extractRateLimitLimit(null)).toBeUndefined();
    expect(extractRateLimitLimit(undefined)).toBeUndefined();
  });
});

describe('classifyRateLimitError: header → error field plumbing', () => {
  it('populates message with Retry-After seconds when the header is present', () => {
    // Scenario from the issue: mock 429 with `Retry-After: 60`.
    const upstream = { status: 429, headers: { 'Retry-After': '60' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.retryAfterSeconds).toBe(60);
    expect(wrapped.message).toContain('Wait 60 seconds and try again');
    // Recovery hint (single-line, for CLI/telemetry).
    expect(wrapped.suggestedAction).toContain('Wait 60s');
  });

  it('populates message with reset timestamp when X-RateLimit-Reset is present and Retry-After is absent', () => {
    // Scenario from the issue: mock 429 with `X-RateLimit-Reset: <ts>`.
    const upstream = {
      status: 429,
      headers: { 'X-RateLimit-Reset': '2000000000', 'X-RateLimit-Limit': '1000' },
    };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    // retryAfterSeconds is undefined because the response only carried the
    // reset header; the error falls through to the reset-based message.
    expect(wrapped.retryAfterSeconds).toBeUndefined();
    expect(wrapped.resetAt).toBeInstanceOf(Date);
    expect(wrapped.limit).toBe(1000);
    expect(wrapped.message).toContain('Wait until');
    expect(wrapped.message).toContain(wrapped.resetAt!.toISOString());
    // The recovery hint mirrors the wait phrasing so a single-line CLI
    // renderer can present a coherent action.
    expect(wrapped.suggestedAction).toContain('Wait until');
    expect(wrapped.suggestedAction).toContain(wrapped.resetAt!.toISOString());
  });

  it('falls back to the generic "wait 60s / switch model" message when no headers are present', () => {
    // Scenario from the issue: mock 429 with no headers → fallback.
    const upstream = new Error('HTTP 429');
    Object.assign(upstream, { status: 429 });
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.retryAfterSeconds).toBeUndefined();
    expect(wrapped.resetAt).toBeUndefined();
    expect(wrapped.limit).toBeUndefined();
    // The fallback message must still be actionable: it must mention a
    // concrete wait time and the switch-to-smaller-model option.
    expect(wrapped.message).toContain('Wait 60 seconds and try again');
    expect(wrapped.message.toLowerCase()).toContain('smaller model');
    // No bogus placeholder timestamps in the user-facing message.
    expect(wrapped.message).not.toContain('undefined');
    expect(wrapped.message).not.toContain('NaN');
  });

  it('prefers Retry-After over X-RateLimit-Reset when both are present', () => {
    const upstream = {
      status: 429,
      headers: { 'Retry-After': '5', 'X-RateLimit-Reset': '2000000000' },
    };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.retryAfterSeconds).toBe(5);
    // The `resetAt` field is still recorded on the error for telemetry,
    // but the message uses the more precise Retry-After value.
    expect(wrapped.resetAt).toBeInstanceOf(Date);
    expect(wrapped.message).toContain('Wait 5 seconds and try again');
    expect(wrapped.message).not.toContain('Wait until');
  });

  it('routes free-tier 429 with X-RateLimit-Reset to FreeTierRateLimitError (permanent)', () => {
    const upstream = { status: 429, headers: { 'X-RateLimit-Reset': '2000000000' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    expect(wrapped.resetAt).toBeInstanceOf(Date);
    // Free-tier is permanent — the message must not tell the user to
    // "switch to a smaller model" (they are already on free).
    expect(wrapped.message.toLowerCase()).not.toContain('smaller model');
    expect(wrapped.message.toLowerCase()).toContain('upgrade');
    expect(wrapped.message).toContain('Resets at');
  });
});

describe('ErrorBackoff honours resetAt when Retry-After is absent', () => {
  it('uses X-RateLimit-Reset delta as the backoff delay', () => {
    const resetAt = new Date(Date.now() + 20_000); // 20s from now.
    const err = { statusCode: 429, resetAt };
    const b = new ErrorBackoff({ initialDelayMs: 500, maxDelayMs: 60_000 });
    b.recordError(429, err);
    const remaining = b.getRemainingBackoffMs();
    // Allow a small drift for test execution time.
    expect(remaining).toBeGreaterThan(18_000);
    expect(remaining).toBeLessThanOrEqual(20_000);
  });

  it('caps the resetAt delta at maxDelayMs', () => {
    const resetAt = new Date(Date.now() + 3_600_000); // 1h from now.
    const err = { statusCode: 429, resetAt };
    const b = new ErrorBackoff({ initialDelayMs: 500, maxDelayMs: 5000 });
    b.recordError(429, err);
    expect(b.getRemainingBackoffMs()).toBeLessThanOrEqual(5000);
  });

  it('collapses a past resetAt to zero (retry immediately)', () => {
    const resetAt = new Date(Date.now() - 60_000); // 1 min in the past.
    expect(getRetryAfterMs({ resetAt })).toBe(0);
  });

  it('prefers retryAfterSeconds over resetAt when both are set', () => {
    const resetAt = new Date(Date.now() + 60_000);
    const err = { retryAfterSeconds: 5, resetAt };
    expect(getRetryAfterMs(err)).toBe(5000);
  });

  it('returns undefined when neither hint is available', () => {
    expect(getRetryAfterMs({ statusCode: 429 })).toBeUndefined();
    expect(getRetryAfterMs({})).toBeUndefined();
  });
});

describe('rate-limit UX end-to-end (issue #1534 acceptance)', () => {
  it('mock 429 with Retry-After: 60 produces "Wait 60 seconds" in the user message', () => {
    const upstream = { status: 429, headers: { 'Retry-After': '60' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect((classified as Error).message).toContain('Wait 60 seconds');
  });

  it('mock 429 with X-RateLimit-Reset: <ts> produces a "Resets at"/"Wait until" message', () => {
    const upstream = { status: 429, headers: { 'X-RateLimit-Reset': '2000000000' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect((classified as Error).message).toMatch(/Wait until [\dTZ:.-]+/);
  });

  it('mock 429 with no headers produces the generic fallback with a concrete wait suggestion', () => {
    const upstream = Object.assign(new Error('Too Many Requests'), { status: 429 });
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    const msg = (classified as Error).message;
    expect(msg).toContain('Wait 60 seconds and try again');
    expect(msg.toLowerCase()).toContain('smaller model');
  });

  it('the classified error is still detected as a rate-limit error for downstream retry logic', () => {
    const upstream = { status: 429, headers: { 'Retry-After': '10' } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(isRateLimitError(classified)).toBe(true);
  });
});

describe('isKnownThrottle (issue #2152)', () => {
  it('matches a bare HTTP 429 response (no code, no name)', () => {
    expect(isKnownThrottle({ status: 429 })).toBe(true);
    expect(isKnownThrottle({ statusCode: 429 })).toBe(true);
    expect(isKnownThrottle({ response: { status: 429 } })).toBe(true);
  });

  it('matches the provider rate-limit code marker', () => {
    expect(isKnownThrottle({ code: 'provider_rate_limit' })).toBe(true);
  });

  it('matches the free-tier rate-limit code marker', () => {
    expect(isKnownThrottle({ code: 'free_tier_rate_limit' })).toBe(true);
  });

  it('matches by class name (cross-module safety)', () => {
    expect(isKnownThrottle({ name: 'ProviderRateLimitError' })).toBe(true);
    expect(isKnownThrottle({ name: 'FreeTierRateLimitError' })).toBe(true);
  });

  it('matches common rate-limit message patterns', () => {
    expect(isKnownThrottle({ message: 'rate limit exceeded' })).toBe(true);
    expect(isKnownThrottle({ message: 'quota exceeded for this project' })).toBe(true);
    expect(isKnownThrottle({ message: 'Too Many Requests' })).toBe(true);
    expect(isKnownThrottle({ message: 'HTTP 429: rate limit' })).toBe(true);
  });

  it('matches raw string errors from the fetch layer', () => {
    expect(isKnownThrottle('rate limit reached')).toBe(true);
    expect(isKnownThrottle('quota exceeded')).toBe(true);
  });

  it('returns false for non-throttle errors', () => {
    expect(isKnownThrottle(null)).toBe(false);
    expect(isKnownThrottle(undefined)).toBe(false);
    expect(isKnownThrottle({})).toBe(false);
    expect(isKnownThrottle({ status: 500 })).toBe(false);
    expect(isKnownThrottle({ status: 403 })).toBe(false);
    expect(isKnownThrottle({ message: 'permission denied' })).toBe(false);
    expect(isKnownThrottle('socket hang up')).toBe(false);
    expect(isKnownThrottle(42)).toBe(false);
  });
});

describe('ErrorBackoff.isFatal honours known throttles (issue #2152)', () => {
  it('mock HTTP 429 is non-fatal and schedules a retry', () => {
    const b = new ErrorBackoff({ initialDelayMs: 500, maxDelayMs: 60_000, maxRetries: 5 });
    const err = { status: 429, statusCode: 429 };
    b.recordError(429, err);
    expect(b.isFatal(err)).toBe(false);
    expect(b.isFatal()).toBe(false);
    // A retry is scheduled with a positive delay (exponential schedule
    // kicked in because no Retry-After hint was attached).
    expect(b.shouldBackoff()).toBe(true);
    expect(b.getRemainingBackoffMs()).toBeGreaterThan(0);
    expect(b.getConsecutiveErrors()).toBe(1);
  });

  it('known throttle message with a wrapper 400 status is still non-fatal', () => {
    // Some provider SDKs normalise 429 to a 4xx envelope with a
    // throttle message in the body. Without the known-throttle check
    // this would fall into the generic fatal 4xx branch.
    const b = new ErrorBackoff();
    const err = { statusCode: 400, message: 'rate limit exceeded, retry later' };
    b.recordError(400, err);
    expect(b.isFatal(err)).toBe(false);
    expect(b.isFatal()).toBe(false);
  });

  it('known throttle still becomes fatal once the transient retry budget is exhausted', () => {
    const b = new ErrorBackoff({ maxRetries: 2, initialDelayMs: 10 });
    const err = { status: 429 };
    b.recordError(429, err);
    expect(b.isFatal(err)).toBe(false);
    b.recordError(429, err);
    expect(b.isFatal(err)).toBe(true);
  });

  it('free-tier throttle remains fatal (permanent) even when known-throttle matches', () => {
    const b = new ErrorBackoff();
    const err = { code: 'free_tier_rate_limit', status: 429 };
    b.recordError(429, err);
    expect(b.isFatal(err)).toBe(true);
  });
});

describe('classifyError tags known throttles distinctly (issue #2152)', () => {
  it('classifies HTTP 429 as rate_limit (transient, retryable)', () => {
    const result = classifyError({ status: 429 });
    expect(result.type).toBe('rate_limit');
    expect(result.fatal).toBe(false);
    expect(result.retryable).toBe(true);
    expect(result.statusCode).toBe(429);
  });

  it('classifies a provider_rate_limit code marker without a status as rate_limit', () => {
    const result = classifyError({ code: 'provider_rate_limit' });
    expect(result.type).toBe('rate_limit');
    expect(result.fatal).toBe(false);
    expect(result.retryable).toBe(true);
  });

  it('classifies a rate-limit message-only error as rate_limit (not validation)', () => {
    // Without the known-throttle precedence in classifyError, this would
    // fall through to the generic "unknown" bucket. With the fix it is
    // tagged `rate_limit` so outer retry loops schedule the correct
    // delay instead of overflow-compacting.
    const result = classifyError(new Error('rate limit exceeded'));
    expect(result.type).toBe('rate_limit');
    expect(result.fatal).toBe(false);
    expect(result.retryable).toBe(true);
  });

  it('classifies a "quota exceeded" message as rate_limit', () => {
    const result = classifyError({ message: 'quota exceeded for today' });
    expect(result.type).toBe('rate_limit');
    expect(result.fatal).toBe(false);
    expect(result.retryable).toBe(true);
  });

  it('still classifies free-tier throttle as fatal rate_limit (permanent)', () => {
    const result = classifyError({ code: 'free_tier_rate_limit', status: 429 });
    expect(result.type).toBe('rate_limit');
    expect(result.fatal).toBe(true);
    expect(result.retryable).toBe(false);
  });

  it('does not reclassify a 401 as rate_limit when message happens to say nothing', () => {
    const result = classifyError({ status: 401 });
    expect(result.type).toBe('auth');
    expect(result.fatal).toBe(true);
  });
});
