/**
 * Tests for `src/providers/catalog-retry.ts`.
 *
 * Covers:
 *   - `parseRetryAfter` for delta-seconds, HTTP-date, invalid, past dates
 *   - `withCatalogRetry` success / retry / exhaustion / abort / Retry-After
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  parseRetryAfter,
  withCatalogRetry,
  DEFAULT_CATALOG_RETRY,
  type CatalogFetchResult,
} from '../catalog-retry.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('parseRetryAfter', () => {
  it('returns undefined for missing header', () => {
    expect(parseRetryAfter(null)).toBeUndefined();
    expect(parseRetryAfter(undefined)).toBeUndefined();
    expect(parseRetryAfter('')).toBeUndefined();
    expect(parseRetryAfter('   ')).toBeUndefined();
  });

  it('parses delta-seconds as milliseconds', () => {
    expect(parseRetryAfter('30')).toBe(30_000);
    expect(parseRetryAfter('0')).toBe(0);
    expect(parseRetryAfter('1.5')).toBe(1500);
  });

  it('rejects negative delta-seconds', () => {
    expect(parseRetryAfter('-5')).toBeUndefined();
  });

  it('parses HTTP-date into milliseconds-until-that-date', () => {
    const future = new Date(Date.now() + 60_000).toUTCString();
    const ms = parseRetryAfter(future);
    expect(ms).toBeGreaterThan(55_000);
    expect(ms).toBeLessThanOrEqual(60_500);
  });

  it('clamps past HTTP-date to zero (retry immediately)', () => {
    const past = new Date(Date.now() - 60_000).toUTCString();
    expect(parseRetryAfter(past)).toBe(0);
  });

  it('returns undefined for unparseable garbage', () => {
    expect(parseRetryAfter('tomorrow')).toBeUndefined();
    expect(parseRetryAfter('not-a-number-or-date')).toBeUndefined();
  });
});

describe('withCatalogRetry', () => {
  it('returns on the first successful attempt', async () => {
    const fn = vi.fn(async (): Promise<CatalogFetchResult<string>> => ({ ok: true, value: 'ok' }));
    const result = await withCatalogRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure until success', async () => {
    const fn = vi
      .fn<(attempt: number) => Promise<CatalogFetchResult<number>>>()
      .mockResolvedValueOnce({ ok: false, error: new Error('boom-1') })
      .mockResolvedValueOnce({ ok: false, error: new Error('boom-2') })
      .mockResolvedValueOnce({ ok: true, value: 42 });

    const result = await withCatalogRetry(fn, {
      maxAttempts: 5,
      baseDelayMs: 1,
      maxDelayMs: 2,
    });
    expect(result).toBe(42);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws the last error after exhausting attempts', async () => {
    const err = new Error('nope');
    const fn = vi.fn(async (): Promise<CatalogFetchResult<string>> => ({
      ok: false,
      error: err,
    }));
    await expect(
      withCatalogRetry(fn, { maxAttempts: 3, baseDelayMs: 1, maxDelayMs: 1 })
    ).rejects.toBe(err);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('honors Retry-After hint over exponential backoff', async () => {
    const start = Date.now();
    const fn = vi
      .fn<(attempt: number) => Promise<CatalogFetchResult<string>>>()
      .mockResolvedValueOnce({ ok: false, retryAfterMs: 50, error: new Error('rate-limit') })
      .mockResolvedValueOnce({ ok: true, value: 'done' });
    const result = await withCatalogRetry(fn, {
      maxAttempts: 3,
      baseDelayMs: 1,
      maxDelayMs: 1_000,
    });
    const elapsed = Date.now() - start;
    expect(result).toBe('done');
    // Retry-After requested 50ms; allow timer slack.
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it('aborts promptly when the signal fires before an attempt', async () => {
    const controller = new AbortController();
    controller.abort(new Error('cancelled'));
    const fn = vi.fn(async (): Promise<CatalogFetchResult<string>> => ({ ok: true, value: 'x' }));
    await expect(
      withCatalogRetry(fn, DEFAULT_CATALOG_RETRY, controller.signal)
    ).rejects.toThrow('cancelled');
    expect(fn).not.toHaveBeenCalled();
  });

  it('rejects maxAttempts < 1', async () => {
    const fn = vi.fn(async (): Promise<CatalogFetchResult<string>> => ({ ok: true, value: 'x' }));
    await expect(
      withCatalogRetry(fn, { maxAttempts: 0, baseDelayMs: 1, maxDelayMs: 1 })
    ).rejects.toThrow(/maxAttempts/);
  });

  it('"rearms" on a fresh call — budget is per-call, not per-process', async () => {
    const fn = vi
      .fn<(attempt: number) => Promise<CatalogFetchResult<string>>>()
      .mockResolvedValueOnce({ ok: false, error: new Error('first') })
      .mockResolvedValueOnce({ ok: true, value: 'first-ok' })
      .mockResolvedValueOnce({ ok: false, error: new Error('second') })
      .mockResolvedValueOnce({ ok: true, value: 'second-ok' });
    const opts = { maxAttempts: 2, baseDelayMs: 1, maxDelayMs: 1 };
    expect(await withCatalogRetry(fn, opts)).toBe('first-ok');
    // A second top-level call must start a FRESH attempt counter, even
    // though the previous call used its full budget. This is the
    // "rearm after success" contract from the upstream fixes.
    expect(await withCatalogRetry(fn, opts)).toBe('second-ok');
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
