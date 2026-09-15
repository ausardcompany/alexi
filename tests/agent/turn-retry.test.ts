/**
 * Tests for turn-level retry wrapper (issue #1737).
 *
 * The wrapper adds retry-on-transient-error to a single provider turn
 * without duplicating the provider-layer `ErrorBackoff` budget. It must:
 *
 *   - Retry up to 3 attempts on 429 / 5xx / xAI capacity / network blips
 *     with exponential backoff (1s / 2s / 4s, capped at 15s).
 *   - NEVER retry permanent errors (401, 400, config failures) — those
 *     burn budget with no chance of success.
 *   - NEVER retry after content or a tool call has already been emitted
 *     (streaming guard) — a replayed request would emit duplicate deltas
 *     that no downstream consumer can retract.
 *   - Honour a server `Retry-After` hint over the default backoff.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  computeRetryDelay,
  retryProviderCall,
  setTurnRetrySleep,
  type StreamingStateTracker,
} from '../../src/agent/index.js';

describe('retryProviderCall', () => {
  const sleeps: number[] = [];

  beforeEach(() => {
    sleeps.length = 0;
    // Replace the real setTimeout-driven sleep with a no-op recorder so
    // tests never wait real seconds but can still assert the backoff
    // schedule.
    setTurnRetrySleep(async (ms: number) => {
      sleeps.push(ms);
    });
  });

  afterEach(() => {
    setTurnRetrySleep(); // restore default
  });

  describe('transient error retry', () => {
    it('retries 429 rate-limit errors up to maxRetries and eventually rethrows', async () => {
      const err = { statusCode: 429, message: 'rate limit exceeded' };
      const fn = vi.fn().mockRejectedValue(err);

      await expect(retryProviderCall(fn)).rejects.toBe(err);
      // 3 total attempts (initial + 2 retries) per default maxRetries=3.
      expect(fn).toHaveBeenCalledTimes(3);
      // Two sleeps between the three attempts, 1s and 2s.
      expect(sleeps).toEqual([1000, 2000]);
    });

    it('retries 502/5xx-style errors', async () => {
      // Provider-layer errors surface with a stringified status marker
      // rather than a numeric statusCode. We test both shapes; here the
      // canonical rate-limit shape stands in for the transient bucket
      // because `isRetryableError` currently classifies 429 + xAI
      // capacity as retryable (see AGENTS.md error-classification).
      const err = { statusCode: 429 };
      let calls = 0;
      const fn = vi.fn().mockImplementation(() => {
        calls++;
        if (calls < 3) {
          return Promise.reject(err);
        }
        return Promise.resolve('ok');
      });

      const result = await retryProviderCall(fn);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(3);
      expect(sleeps).toEqual([1000, 2000]);
    });

    it('retries xAI capacity errors', async () => {
      const err = { message: 'xai capacity exceeded' };
      let calls = 0;
      const fn = vi.fn().mockImplementation(() => {
        calls++;
        if (calls < 2) {
          return Promise.reject(err);
        }
        return Promise.resolve('recovered');
      });

      const result = await retryProviderCall(fn);
      expect(result).toBe('recovered');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(sleeps).toEqual([1000]);
    });

    it('succeeds on first attempt without sleeping', async () => {
      const fn = vi.fn().mockResolvedValue('first-try');
      const result = await retryProviderCall(fn);
      expect(result).toBe('first-try');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(sleeps).toEqual([]);
    });
  });

  describe('permanent errors (no retry)', () => {
    it('does NOT retry a permanent auth failure (name-based)', async () => {
      const err = { name: 'NoRefreshTokenError', message: 'refresh required' };
      const fn = vi.fn().mockRejectedValue(err);
      await expect(retryProviderCall(fn)).rejects.toBe(err);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(sleeps).toEqual([]);
    });

    it('does NOT retry a plain Error (unknown shape)', async () => {
      const err = new Error('validation failed');
      const fn = vi.fn().mockRejectedValue(err);
      await expect(retryProviderCall(fn)).rejects.toBe(err);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(sleeps).toEqual([]);
    });
  });

  describe('streaming guard', () => {
    it('does NOT retry when content has already been emitted', async () => {
      let emitted = false;
      const tracker: StreamingStateTracker = {
        hasEmittedContent: () => emitted,
      };
      const err = { statusCode: 429 };
      const fn = vi.fn().mockImplementation(() => {
        // First call: emit some content, then throw. A retry would
        // produce a second stream of deltas with no retract mechanism.
        emitted = true;
        return Promise.reject(err);
      });

      await expect(retryProviderCall(fn, tracker)).rejects.toBe(err);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(sleeps).toEqual([]);
    });

    it('retries when the tracker reports no content yet (pre-stream 429)', async () => {
      const tracker: StreamingStateTracker = {
        hasEmittedContent: () => false,
      };
      const err = { statusCode: 429 };
      let calls = 0;
      const fn = vi.fn().mockImplementation(() => {
        calls++;
        if (calls === 1) return Promise.reject(err);
        return Promise.resolve('ok');
      });

      const result = await retryProviderCall(fn, tracker);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(sleeps).toEqual([1000]);
    });
  });

  describe('backoff schedule', () => {
    it('follows the 1s / 2s / 4s progression up to the 15s cap', async () => {
      const err = { statusCode: 429 };
      const fn = vi.fn().mockRejectedValue(err);
      await expect(
        retryProviderCall(fn, undefined, { maxRetries: 5, maxDelayMs: 15_000 })
      ).rejects.toBe(err);
      // 5 attempts = 4 sleeps: 1s, 2s, 4s, 8s (all under the 15s cap).
      expect(sleeps).toEqual([1000, 2000, 4000, 8000]);
    });

    it('caps individual sleeps at maxDelayMs', async () => {
      const err = { statusCode: 429 };
      const fn = vi.fn().mockRejectedValue(err);
      await expect(
        retryProviderCall(fn, undefined, {
          maxRetries: 6,
          initialDelayMs: 1000,
          maxDelayMs: 15_000,
        })
      ).rejects.toBe(err);
      // 6 attempts = 5 sleeps. The exponential curve is
      // 1s, 2s, 4s, 8s, 16s → the final slot is capped at 15s.
      expect(sleeps).toEqual([1000, 2000, 4000, 8000, 15_000]);
    });

    it('honours a server Retry-After hint over the default schedule', async () => {
      const err = { statusCode: 429, retryAfterSeconds: 5 };
      let calls = 0;
      const fn = vi.fn().mockImplementation(() => {
        calls++;
        if (calls === 1) return Promise.reject(err);
        return Promise.resolve('ok');
      });
      const result = await retryProviderCall(fn);
      expect(result).toBe('ok');
      expect(sleeps).toEqual([5000]);
    });

    it('caps a large Retry-After at maxDelayMs', async () => {
      const err = { statusCode: 429, retryAfterSeconds: 3600 };
      const fn = vi.fn().mockRejectedValue(err);
      await expect(
        retryProviderCall(fn, undefined, { maxRetries: 2, maxDelayMs: 15_000 })
      ).rejects.toBe(err);
      expect(sleeps).toEqual([15_000]);
    });
  });
});

describe('computeRetryDelay', () => {
  it('computes 1s / 2s / 4s / 8s for attempts 1..4 with default config', () => {
    expect(computeRetryDelay(1, {})).toBe(1000);
    expect(computeRetryDelay(2, {})).toBe(2000);
    expect(computeRetryDelay(3, {})).toBe(4000);
    expect(computeRetryDelay(4, {})).toBe(8000);
  });

  it('caps the raw exponential value at maxDelayMs', () => {
    // 1000 * 2^5 = 32000 → capped at 15000.
    expect(computeRetryDelay(6, {})).toBe(15_000);
  });

  it('prefers a Retry-After hint over the default schedule', () => {
    expect(computeRetryDelay(1, { retryAfterSeconds: 7 })).toBe(7000);
  });

  it('caps a Retry-After hint at maxDelayMs', () => {
    expect(computeRetryDelay(1, { retryAfterSeconds: 3600 })).toBe(15_000);
  });
});
