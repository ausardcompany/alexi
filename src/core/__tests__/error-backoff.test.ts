/**
 * Tests for `src/core/error-backoff.ts` focused on rate-limit
 * classification and the Retry-After header contract.
 *
 * Related to issue #1435. The provider layer wraps HTTP 429 responses
 * in `FreeTierRateLimitError` / `ProviderRateLimitError`; both variants
 * are detected structurally here (by `code`, `name`, or numeric
 * `statusCode === 429`) so `instanceof` failures across module
 * boundaries never mis-classify a rate-limit error as a generic 4xx.
 */

import { describe, it, expect } from 'vitest';

import {
  ErrorBackoff,
  isRateLimitError,
  getRetryAfterMs,
  extractStatusCode,
  isPermanentAuthFailure,
  isXAICapacityError,
  isRetryableError,
} from '../error-backoff.js';

describe('isRateLimitError', () => {
  it('detects the free-tier code marker', () => {
    expect(isRateLimitError({ code: 'free_tier_rate_limit' })).toBe(true);
  });

  it('detects the provider (paid-tier) code marker', () => {
    expect(isRateLimitError({ code: 'provider_rate_limit' })).toBe(true);
  });

  it('detects by class name (cross-module safety)', () => {
    expect(isRateLimitError({ name: 'ProviderRateLimitError' })).toBe(true);
    expect(isRateLimitError({ name: 'FreeTierRateLimitError' })).toBe(true);
  });

  it('detects by numeric statusCode 429', () => {
    expect(isRateLimitError({ statusCode: 429 })).toBe(true);
  });

  it('returns false for non-rate-limit shapes', () => {
    expect(isRateLimitError(null)).toBe(false);
    expect(isRateLimitError(undefined)).toBe(false);
    expect(isRateLimitError('string')).toBe(false);
    expect(isRateLimitError({ statusCode: 500 })).toBe(false);
    expect(isRateLimitError({ code: 'other' })).toBe(false);
  });
});

describe('isXAICapacityError', () => {
  it('detects a canonical xAI capacity message', () => {
    expect(isXAICapacityError({ message: 'xAI capacity exceeded, please retry' })).toBe(true);
  });

  it('detects a generic capacity-exceeded message regardless of provider prefix', () => {
    expect(isXAICapacityError({ message: 'capacity exceeded for grok-2' })).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isXAICapacityError({ message: 'XAI CAPACITY overloaded' })).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isXAICapacityError({ message: 'permission denied' })).toBe(false);
    expect(isXAICapacityError({ statusCode: 429 })).toBe(false);
    expect(isXAICapacityError(null)).toBe(false);
    expect(isXAICapacityError(undefined)).toBe(false);
    expect(isXAICapacityError('capacity exceeded')).toBe(false);
  });
});

describe('isRetryableError', () => {
  it('is true for rate-limit errors', () => {
    expect(isRetryableError({ code: 'free_tier_rate_limit' })).toBe(true);
    expect(isRetryableError({ statusCode: 429 })).toBe(true);
  });

  it('is true for xAI capacity errors', () => {
    expect(isRetryableError({ message: 'xai capacity exceeded' })).toBe(true);
  });

  it('is false for permanent auth failures', () => {
    expect(isRetryableError({ name: 'NoRefreshTokenError' })).toBe(false);
  });

  it('is false for null / undefined', () => {
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});

describe('getRetryAfterMs', () => {
  it('converts retryAfterSeconds to milliseconds', () => {
    expect(getRetryAfterMs({ retryAfterSeconds: 5 })).toBe(5000);
  });

  it('preserves a zero retryAfterSeconds', () => {
    expect(getRetryAfterMs({ retryAfterSeconds: 0 })).toBe(0);
  });

  it('returns undefined when no retryAfterSeconds is set', () => {
    expect(getRetryAfterMs({})).toBeUndefined();
    expect(getRetryAfterMs(null)).toBeUndefined();
    expect(getRetryAfterMs(undefined)).toBeUndefined();
  });

  it('rejects negative or non-finite retryAfterSeconds', () => {
    expect(getRetryAfterMs({ retryAfterSeconds: -1 })).toBeUndefined();
    expect(getRetryAfterMs({ retryAfterSeconds: Number.NaN })).toBeUndefined();
    expect(getRetryAfterMs({ retryAfterSeconds: Number.POSITIVE_INFINITY })).toBeUndefined();
  });
});

describe('ErrorBackoff exponential schedule', () => {
  it('doubles the delay on each consecutive error', () => {
    const b = new ErrorBackoff({ initialDelayMs: 100, maxDelayMs: 10_000, multiplier: 2 });
    b.recordError(500);
    const first = b.getRemainingBackoffMs();
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThanOrEqual(100);

    b.recordError(500);
    const second = b.getRemainingBackoffMs();
    expect(second).toBeGreaterThan(first - 10);
    expect(second).toBeLessThanOrEqual(200);

    b.recordError(500);
    const third = b.getRemainingBackoffMs();
    expect(third).toBeLessThanOrEqual(400);
  });

  it('caps the delay at maxDelayMs', () => {
    const b = new ErrorBackoff({ initialDelayMs: 1000, maxDelayMs: 2000, multiplier: 2 });
    // 4th consecutive → 1000 * 2^3 = 8000 → capped at 2000.
    for (let i = 0; i < 4; i++) {
      b.recordError(500);
    }
    const remaining = b.getRemainingBackoffMs();
    expect(remaining).toBeLessThanOrEqual(2000);
  });

  it('recordSuccess resets the consecutive counter', () => {
    const b = new ErrorBackoff({ initialDelayMs: 100 });
    b.recordError(500);
    b.recordError(500);
    b.recordSuccess();
    expect(b.getConsecutiveErrors()).toBe(0);
    expect(b.shouldBackoff()).toBe(false);
  });
});

describe('ErrorBackoff rate-limit handling', () => {
  it('honours Retry-After from the error over the exponential schedule', () => {
    const b = new ErrorBackoff({ initialDelayMs: 500, maxDelayMs: 60_000 });
    const err = { statusCode: 429, retryAfterSeconds: 10 };
    b.recordError(429, err);
    // Delay should be ~10s (from Retry-After), not the 500ms default.
    const remaining = b.getRemainingBackoffMs();
    expect(remaining).toBeGreaterThan(9000);
    expect(remaining).toBeLessThanOrEqual(10_000);
  });

  it('caps a large Retry-After at maxDelayMs', () => {
    const b = new ErrorBackoff({ initialDelayMs: 500, maxDelayMs: 5000 });
    const err = { statusCode: 429, retryAfterSeconds: 3600 };
    b.recordError(429, err);
    expect(b.getRemainingBackoffMs()).toBeLessThanOrEqual(5000);
  });

  it('treats generic 429 as transient (not fatal)', () => {
    const b = new ErrorBackoff();
    b.recordError(429);
    expect(b.isFatal()).toBe(false);
  });

  it('treats free-tier rate limit as fatal (permanent)', () => {
    const b = new ErrorBackoff();
    const err = { code: 'free_tier_rate_limit', statusCode: 429 };
    b.recordError(429, err);
    expect(b.isFatal()).toBe(true);
    expect(b.isFatal(err)).toBe(true);
  });

  it('treats other 4xx (401, 403, 404) as permanent', () => {
    for (const status of [401, 403, 404]) {
      const b = new ErrorBackoff();
      b.recordError(status);
      expect(b.isFatal()).toBe(true);
    }
  });

  it('treats 5xx as transient (retryable)', () => {
    const b = new ErrorBackoff();
    b.recordError(503);
    expect(b.isFatal()).toBe(false);
  });
});

describe('extractStatusCode', () => {
  it('extracts a 4xx / 5xx status code from an error message', () => {
    expect(extractStatusCode('request failed with status: 429')).toBe(429);
    expect(extractStatusCode('status: 500 internal')).toBe(500);
  });

  it('returns undefined when no status marker is present', () => {
    expect(extractStatusCode('generic failure')).toBeUndefined();
    expect(extractStatusCode('')).toBeUndefined();
  });

  it('ignores 3xx / 2xx codes', () => {
    expect(extractStatusCode('status: 301 redirect')).toBeUndefined();
  });
});

describe('isPermanentAuthFailure', () => {
  it('identifies NoRefreshTokenError by name', () => {
    expect(isPermanentAuthFailure({ name: 'NoRefreshTokenError' })).toBe(true);
    expect(isPermanentAuthFailure({ name: 'ReauthenticationRequiredError' })).toBe(true);
  });

  it('returns false for anything else', () => {
    expect(isPermanentAuthFailure(new Error('boom'))).toBe(false);
    expect(isPermanentAuthFailure(null)).toBe(false);
    expect(isPermanentAuthFailure(undefined)).toBe(false);
  });
});
