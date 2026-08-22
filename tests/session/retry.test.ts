/**
 * Tests for the bounded retry helper.
 *
 * Ported from opencode `c789868`. Covers:
 *  - Stops after maxAttempts and surfaces the last error.
 *  - Non-jittered delays are bounded by `maxMs`.
 *  - Jitter produces values in `[0, exp)`.
 *  - `shouldRetry` returning false short-circuits.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  computeDelay,
  withRetry,
  isNetworkRetryable,
  RETRYABLE_NETWORK_PATTERNS,
} from '../../src/core/session/retry.js';

describe('computeDelay', () => {
  it('returns exact exponential values when jitter is disabled', () => {
    expect(computeDelay(0, { baseMs: 100, jitter: false })).toBe(100);
    expect(computeDelay(1, { baseMs: 100, jitter: false })).toBe(200);
    expect(computeDelay(2, { baseMs: 100, jitter: false })).toBe(400);
  });

  it('caps exponential growth at maxMs', () => {
    expect(computeDelay(20, { baseMs: 100, maxMs: 1000, jitter: false })).toBe(1000);
    expect(computeDelay(30, { baseMs: 100, maxMs: 5000, jitter: false })).toBe(5000);
  });

  it('produces jittered values in the [0, exp) window by default', () => {
    // Stub Math.random to observe both extremes.
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(computeDelay(2, { baseMs: 100 })).toBe(0);
    spy.mockReturnValue(0.999999);
    // exp = 400 → floor(0.999999 * 400) = 399
    expect(computeDelay(2, { baseMs: 100 })).toBe(399);
    spy.mockRestore();
  });
});

describe('withRetry', () => {
  beforeEach(() => {
    // Deterministic zero-delay tests so we don't have to sleep for real.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the first successful attempt without retrying', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const result = await withRetry(fn, () => true, { maxAttempts: 3, baseMs: 1 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries transient errors up to maxAttempts then throws the last one', async () => {
    const err = new Error('transient');
    const fn = vi.fn().mockRejectedValue(err);
    await expect(withRetry(fn, () => true, { maxAttempts: 3, baseMs: 1 })).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry when shouldRetry returns false', async () => {
    const err = new Error('permanent');
    const fn = vi.fn().mockRejectedValue(err);
    await expect(withRetry(fn, () => false, { maxAttempts: 5, baseMs: 1 })).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('recovers after a transient failure', async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) throw new Error('flaky');
      return 'recovered';
    });
    const result = await withRetry(fn, () => true, { maxAttempts: 5, baseMs: 1 });
    expect(result).toBe('recovered');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('isNetworkRetryable', () => {
  // Ports opencode `e0b9e68` and `40282c1`: raw network variants and
  // unknown finish reasons should be treated as transient by default.
  it.each([
    ['ECONNRESET', 'socket ECONNRESET while reading'],
    ['ETIMEDOUT', 'request ETIMEDOUT after 30s'],
    ['ENOTFOUND', 'getaddrinfo ENOTFOUND api.example.com'],
    ['EAI_AGAIN', 'getaddrinfo EAI_AGAIN'],
    ['socket hang up', 'socket hang up'],
    ['fetch failed', 'TypeError: fetch failed'],
    ['terminated', 'undici: response terminated'],
    ['premature close', 'Error: Premature close'],
  ])('matches %s', (_label, message) => {
    expect(isNetworkRetryable(new Error(message))).toBe(true);
  });

  it('matches unknown finish reason on Error instances', () => {
    const err = Object.assign(new Error('stream ended'), { finishReason: 'unknown' });
    expect(isNetworkRetryable(err)).toBe(true);
  });

  it('does not match ordinary error messages', () => {
    expect(isNetworkRetryable(new Error('invalid api key'))).toBe(false);
    expect(isNetworkRetryable(new Error('deployment_not_found'))).toBe(false);
  });

  it('does not match non-Error values', () => {
    expect(isNetworkRetryable('ECONNRESET')).toBe(false);
    expect(isNetworkRetryable(undefined)).toBe(false);
    expect(isNetworkRetryable(null)).toBe(false);
    expect(isNetworkRetryable({ message: 'ECONNRESET' })).toBe(false);
  });

  it('exposes the pattern list for extension in tests', () => {
    expect(RETRYABLE_NETWORK_PATTERNS.length).toBeGreaterThan(0);
    expect(RETRYABLE_NETWORK_PATTERNS.every((p) => p instanceof RegExp)).toBe(true);
  });
});
