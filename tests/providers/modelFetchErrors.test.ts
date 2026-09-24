/**
 * Tests for the model-list fetch error surfacing helpers (issue #1824).
 *
 * These are pure-unit tests for `classifyFetchError` and `fetchWithRetry`:
 * no SAP SDK, no environment, no network. The higher-level
 * `refreshModelCatalog` / `alexi models` integrations are covered in
 * separate suites so a failure in one layer is not confused with a
 * regression in the classifier.
 */

import { describe, expect, it, vi } from 'vitest';
import {
  ModelFetchError,
  classifyFetchError,
  fetchWithRetry,
} from '../../src/providers/modelFetchErrors.js';

describe('classifyFetchError', () => {
  it('classifies 401 as permanent with an actionable reason', () => {
    const err = Object.assign(new Error('boom'), { status: 401 });
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(false);
    expect(cls.statusCode).toBe(401);
    expect(cls.reason).toMatch(/unauthorized/i);
    expect(cls.reason).toMatch(/AICORE_SERVICE_KEY/);
  });

  it('classifies 403 as permanent with the unauthorized message', () => {
    const err = Object.assign(new Error('forbidden'), { status: 403 });
    expect(classifyFetchError(err).transient).toBe(false);
    expect(classifyFetchError(err).reason).toMatch(/unauthorized/i);
  });

  it('classifies 404 as permanent with an endpoint-not-found reason', () => {
    const err = Object.assign(new Error('nope'), { status: 404 });
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(false);
    expect(cls.statusCode).toBe(404);
    expect(cls.reason).toMatch(/not found|endpoint/i);
  });

  it('classifies 400 and 422 as permanent bad-request errors', () => {
    for (const status of [400, 422]) {
      const err = Object.assign(new Error(`bad payload ${status}`), { status });
      const cls = classifyFetchError(err);
      expect(cls.transient).toBe(false);
      expect(cls.statusCode).toBe(status);
    }
  });

  it('classifies 502 / 503 / 504 as transient', () => {
    for (const status of [502, 503, 504]) {
      const err = Object.assign(new Error(`upstream ${status}`), { status });
      const cls = classifyFetchError(err);
      expect(cls.transient).toBe(true);
      expect(cls.statusCode).toBe(status);
    }
  });

  it('classifies 429 as transient with a rate-limit reason', () => {
    const err = Object.assign(new Error('too many'), { status: 429 });
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(true);
    expect(cls.reason).toMatch(/rate limit/i);
  });

  it('classifies 500 as transient (generic server error)', () => {
    const err = Object.assign(new Error('boom'), { status: 500 });
    expect(classifyFetchError(err).transient).toBe(true);
  });

  it('reads statusCode alongside status (SAP rate-limit shape)', () => {
    const err = Object.assign(new Error('rl'), { statusCode: 429 });
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(true);
    expect(cls.statusCode).toBe(429);
  });

  it('reads nested response.status (axios / http-client shape)', () => {
    const err = Object.assign(new Error('wrapped'), { response: { status: 503 } });
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(true);
    expect(cls.statusCode).toBe(503);
  });

  it('parses status: NNN out of the message when no explicit field is present', () => {
    const err = new Error('request failed with status: 401');
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(false);
    expect(cls.statusCode).toBe(401);
  });

  it('classifies Node.js network error codes as transient', () => {
    for (const code of ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED']) {
      const err = Object.assign(new Error(code), { code });
      const cls = classifyFetchError(err);
      expect(cls.transient, `code=${code}`).toBe(true);
      expect(cls.code).toBe(code);
    }
  });

  it('classifies ENOENT / EACCES as permanent system errors', () => {
    for (const code of ['ENOENT', 'EACCES']) {
      const err = Object.assign(new Error(code), { code });
      const cls = classifyFetchError(err);
      expect(cls.transient, `code=${code}`).toBe(false);
    }
  });

  it('classifies a "fetch failed" message as transient when no status is present', () => {
    const err = new Error('fetch failed');
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(true);
  });

  it('follows err.cause.code (SAP SDK wraps low-level connect errors)', () => {
    const err = new Error('wrapped');
    (err as unknown as { cause?: unknown }).cause = { code: 'ECONNRESET' };
    const cls = classifyFetchError(err);
    expect(cls.transient).toBe(true);
    expect(cls.code).toBe('ECONNRESET');
  });

  it('treats unknown errors as permanent to avoid wasted retries', () => {
    const cls = classifyFetchError(new Error('undocumented failure mode'));
    expect(cls.transient).toBe(false);
    expect(cls.reason).toContain('undocumented failure mode');
  });

  it('handles non-Error throw values gracefully', () => {
    const cls = classifyFetchError('string thrown');
    expect(cls.transient).toBe(false);
    expect(cls.reason).toBe('string thrown');
  });
});

describe('fetchWithRetry', () => {
  const noSleep = () => Promise.resolve();

  it('returns the operation result when the first attempt succeeds', async () => {
    const op = vi.fn().mockResolvedValue('ok');
    const result = await fetchWithRetry(op, { sleep: noSleep });
    expect(result).toBe('ok');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('retries transient errors under exponential backoff and eventually succeeds', async () => {
    const transient = Object.assign(new Error('boom'), { status: 503 });
    const op = vi
      .fn()
      .mockRejectedValueOnce(transient)
      .mockRejectedValueOnce(transient)
      .mockResolvedValueOnce('recovered');
    const onRetry = vi.fn();
    const result = await fetchWithRetry(op, {
      maxAttempts: 3,
      sleep: noSleep,
      onRetry,
    });
    expect(result).toBe('recovered');
    expect(op).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
    // The classification is forwarded so a logger can print the reason.
    expect(onRetry.mock.calls[0][0]).toBe(1);
    expect(onRetry.mock.calls[0][1].transient).toBe(true);
    expect(onRetry.mock.calls[0][1].statusCode).toBe(503);
  });

  it('surfaces permanent errors on the FIRST attempt (no retry)', async () => {
    const permanent = Object.assign(new Error('bad key'), { status: 401 });
    const op = vi.fn().mockRejectedValue(permanent);
    await expect(fetchWithRetry(op, { maxAttempts: 5, sleep: noSleep })).rejects.toBeInstanceOf(
      ModelFetchError
    );
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('wraps the permanent error with the classified reason', async () => {
    const permanent = Object.assign(new Error('nope'), { status: 401 });
    const op = vi.fn().mockRejectedValue(permanent);
    try {
      await fetchWithRetry(op, { sleep: noSleep });
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ModelFetchError);
      const mfe = err as ModelFetchError;
      expect(mfe.transient).toBe(false);
      expect(mfe.statusCode).toBe(401);
      expect(mfe.reason).toMatch(/unauthorized/i);
      expect(mfe.message).toMatch(/Failed to fetch models/i);
      expect(mfe.cause).toBe(permanent);
    }
  });

  it('exhausts the transient retry budget and throws with the last classification', async () => {
    const transient = Object.assign(new Error('boom'), { status: 502 });
    const op = vi.fn().mockRejectedValue(transient);
    await expect(fetchWithRetry(op, { maxAttempts: 3, sleep: noSleep })).rejects.toBeInstanceOf(
      ModelFetchError
    );
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('does not sleep after the last failed attempt', async () => {
    const transient = Object.assign(new Error('boom'), { status: 503 });
    const op = vi.fn().mockRejectedValue(transient);
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(fetchWithRetry(op, { maxAttempts: 3, sleep })).rejects.toBeInstanceOf(
      ModelFetchError
    );
    // 3 attempts → 2 sleeps between them.
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it('respects maxAttempts=1 (no retry)', async () => {
    const transient = Object.assign(new Error('boom'), { status: 503 });
    const op = vi.fn().mockRejectedValue(transient);
    await expect(fetchWithRetry(op, { maxAttempts: 1, sleep: noSleep })).rejects.toBeInstanceOf(
      ModelFetchError
    );
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('caps the backoff delay at maxDelayMs', async () => {
    const transient = Object.assign(new Error('boom'), { status: 503 });
    const op = vi.fn().mockRejectedValue(transient);
    const sleep = vi.fn().mockResolvedValue(undefined);
    await expect(
      fetchWithRetry(op, {
        maxAttempts: 5,
        initialDelayMs: 100,
        maxDelayMs: 250,
        sleep,
      })
    ).rejects.toBeInstanceOf(ModelFetchError);
    // Delays: 100, 200, 250 (capped), 250 (capped).
    expect(sleep.mock.calls.map((c) => c[0])).toEqual([100, 200, 250, 250]);
  });

  it('swallows onRetry errors so a broken logger does not mask the retry', async () => {
    const transient = Object.assign(new Error('boom'), { status: 503 });
    const op = vi.fn().mockRejectedValueOnce(transient).mockResolvedValueOnce('ok');
    const onRetry = vi.fn(() => {
      throw new Error('logger broken');
    });
    await expect(fetchWithRetry(op, { maxAttempts: 2, sleep: noSleep, onRetry })).resolves.toBe(
      'ok'
    );
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('ModelFetchError', () => {
  it('exposes reason, statusCode, transient, and cause on the instance', () => {
    const cause = new Error('root');
    const err = new ModelFetchError(
      { transient: false, statusCode: 401, reason: 'unauthorized' },
      cause
    );
    expect(err.name).toBe('ModelFetchError');
    expect(err).toBeInstanceOf(Error);
    expect(err.reason).toBe('unauthorized');
    expect(err.statusCode).toBe(401);
    expect(err.transient).toBe(false);
    expect(err.cause).toBe(cause);
    expect(err.message).toBe('Failed to fetch models: unauthorized');
  });
});
