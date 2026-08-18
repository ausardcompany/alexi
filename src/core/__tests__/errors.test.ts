/**
 * Tests for the canonical `RateLimitError` class and the
 * `retryWithRateLimit` driver in `src/core/errors.ts`.
 *
 * Related to issue #1435 — rate-limit detection and backoff for
 * free-tier models. The provider layer (`sapOrchestration.ts`) is
 * responsible for detecting HTTP 429 responses and raising the
 * `FreeTierRateLimitError` / `ProviderRateLimitError` variants; those
 * variants are structurally compatible with `RateLimitError` and are
 * exercised end-to-end by the retry driver here.
 */

import { describe, it, expect, vi } from 'vitest';

import {
  RateLimitError,
  RATE_LIMIT_CODE,
  computeRateLimitDelay,
  isFreeTierRateLimit,
  isRateLimitError,
  retryWithRateLimit,
} from '../errors.js';

describe('RateLimitError', () => {
  it('captures modelName and retryAfterSeconds', () => {
    const err = new RateLimitError('Rate limit reached for gpt-4o', {
      modelName: 'gpt-4o',
      retryAfterSeconds: 30,
    });
    expect(err.name).toBe('RateLimitError');
    expect(err.code).toBe(RATE_LIMIT_CODE);
    expect(err.statusCode).toBe(429);
    expect(err.modelName).toBe('gpt-4o');
    expect(err.retryAfterSeconds).toBe(30);
    expect(err).toBeInstanceOf(Error);
  });

  it('preserves the underlying cause when provided', () => {
    const upstream = new Error('HTTP 429');
    const err = new RateLimitError('rate limit', { cause: upstream });
    expect((err as Error & { cause?: unknown }).cause).toBe(upstream);
  });

  it('omits retryAfterSeconds when the value is invalid', () => {
    const bad = new RateLimitError('x', { retryAfterSeconds: -1 });
    expect(bad.retryAfterSeconds).toBeUndefined();

    const nan = new RateLimitError('x', { retryAfterSeconds: Number.NaN });
    expect(nan.retryAfterSeconds).toBeUndefined();
  });

  it('is detected by isRateLimitError', () => {
    const err = new RateLimitError('rate limit');
    expect(isRateLimitError(err)).toBe(true);
  });

  it('recognises a bare error with statusCode 429', () => {
    // Providers that skip our custom class still surface `statusCode`.
    expect(isRateLimitError({ statusCode: 429 })).toBe(true);
    expect(isRateLimitError({ statusCode: 500 })).toBe(false);
  });

  it('does not classify a RateLimitError as free-tier', () => {
    const err = new RateLimitError('rate limit');
    expect(isFreeTierRateLimit(err)).toBe(false);
  });

  it('recognises a free-tier error structurally', () => {
    // Providers set `code === 'free_tier_rate_limit'` on their subclass.
    expect(isFreeTierRateLimit({ code: 'free_tier_rate_limit' })).toBe(true);
    expect(isFreeTierRateLimit({ name: 'FreeTierRateLimitError' })).toBe(true);
    expect(isFreeTierRateLimit({ code: 'other' })).toBe(false);
  });
});

describe('computeRateLimitDelay', () => {
  it('uses exponential backoff when no Retry-After is present', () => {
    // attempt 1 → initial, attempt 2 → initial * multiplier, ...
    expect(computeRateLimitDelay(new RateLimitError('x'), 1, { initialDelayMs: 1000 })).toBe(1000);
    expect(computeRateLimitDelay(new RateLimitError('x'), 2, { initialDelayMs: 1000 })).toBe(2000);
    expect(computeRateLimitDelay(new RateLimitError('x'), 3, { initialDelayMs: 1000 })).toBe(4000);
  });

  it('caps exponential backoff at maxDelayMs', () => {
    const delay = computeRateLimitDelay(new RateLimitError('x'), 10, {
      initialDelayMs: 1000,
      maxDelayMs: 5000,
    });
    expect(delay).toBe(5000);
  });

  it('honours Retry-After from the error over the exponential schedule', () => {
    const err = new RateLimitError('x', { retryAfterSeconds: 12 });
    const delay = computeRateLimitDelay(err, 1, { initialDelayMs: 500 });
    expect(delay).toBe(12_000);
  });

  it('caps Retry-After at maxDelayMs to prevent unbounded waits', () => {
    const err = new RateLimitError('x', { retryAfterSeconds: 10_000 });
    const delay = computeRateLimitDelay(err, 1, { maxDelayMs: 60_000 });
    expect(delay).toBe(60_000);
  });

  it('honours a zero Retry-After as "immediate retry"', () => {
    const err = new RateLimitError('x', { retryAfterSeconds: 0 });
    const delay = computeRateLimitDelay(err, 3, { initialDelayMs: 1000 });
    expect(delay).toBe(0);
  });
});

describe('retryWithRateLimit', () => {
  it('returns the successful result on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await retryWithRateLimit(fn, { sleep: async () => {} });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on RateLimitError and eventually succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new RateLimitError('rl-1', { retryAfterSeconds: 0 }))
      .mockRejectedValueOnce(new RateLimitError('rl-2', { retryAfterSeconds: 0 }))
      .mockResolvedValueOnce('ok');
    const sleep = vi.fn().mockResolvedValue(undefined);
    const result = await retryWithRateLimit(fn, { maxAttempts: 3, sleep });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it('throws the last rate-limit error after budget exhaustion', async () => {
    const err1 = new RateLimitError('first', { retryAfterSeconds: 0 });
    const err2 = new RateLimitError('second', { retryAfterSeconds: 0 });
    const err3 = new RateLimitError('third', { retryAfterSeconds: 0 });
    const fn = vi
      .fn()
      .mockRejectedValueOnce(err1)
      .mockRejectedValueOnce(err2)
      .mockRejectedValueOnce(err3);
    await expect(retryWithRateLimit(fn, { maxAttempts: 3, sleep: async () => {} })).rejects.toBe(
      err3
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does NOT retry non-rate-limit errors', async () => {
    const other = new Error('boom');
    const fn = vi.fn().mockRejectedValueOnce(other).mockResolvedValueOnce('never');
    await expect(retryWithRateLimit(fn, { sleep: async () => {} })).rejects.toBe(other);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry free-tier rate limits (permanent)', async () => {
    // Free-tier errors are permanent per the AGENTS.md contract.
    const freeErr = Object.assign(new Error('free-tier exhausted'), {
      code: 'free_tier_rate_limit',
      name: 'FreeTierRateLimitError',
      statusCode: 429,
      retryAfterSeconds: 60,
    });
    const fn = vi.fn().mockRejectedValueOnce(freeErr);
    await expect(retryWithRateLimit(fn, { sleep: async () => {} })).rejects.toBe(freeErr);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects Retry-After when scheduling the next attempt', async () => {
    const err = new RateLimitError('r', { retryAfterSeconds: 7 });
    const fn = vi.fn().mockRejectedValueOnce(err).mockResolvedValueOnce('ok');
    const delays: number[] = [];
    const sleep = vi.fn(async (ms: number) => {
      delays.push(ms);
    });
    const result = await retryWithRateLimit(fn, { maxAttempts: 2, sleep });
    expect(result).toBe('ok');
    expect(delays).toEqual([7000]);
  });

  it('invokes onRetry with attempt metadata', async () => {
    const err = new RateLimitError('r', { retryAfterSeconds: 0 });
    const fn = vi.fn().mockRejectedValueOnce(err).mockResolvedValueOnce('ok');
    const onRetry = vi.fn();
    await retryWithRateLimit(fn, {
      maxAttempts: 2,
      sleep: async () => {},
      onRetry,
    });
    expect(onRetry).toHaveBeenCalledTimes(1);
    const info = onRetry.mock.calls[0][0];
    expect(info.attempt).toBe(1);
    expect(info.remaining).toBe(1);
    expect(info.error).toBe(err);
    expect(typeof info.delayMs).toBe('number');
  });

  it('swallows errors thrown from onRetry so retries continue', async () => {
    const err = new RateLimitError('r', { retryAfterSeconds: 0 });
    const fn = vi.fn().mockRejectedValueOnce(err).mockResolvedValueOnce('ok');
    const onRetry = vi.fn(() => {
      throw new Error('callback boom');
    });
    await expect(
      retryWithRateLimit(fn, { maxAttempts: 2, sleep: async () => {}, onRetry })
    ).resolves.toBe('ok');
  });

  it('treats maxAttempts < 1 as 1 (no retries)', async () => {
    const err = new RateLimitError('r', { retryAfterSeconds: 0 });
    const fn = vi.fn().mockRejectedValueOnce(err);
    await expect(retryWithRateLimit(fn, { maxAttempts: 0, sleep: async () => {} })).rejects.toBe(
      err
    );
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
