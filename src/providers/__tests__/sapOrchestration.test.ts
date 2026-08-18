/**
 * Rate-limit detection tests for the SAP AI Core orchestration provider.
 *
 * Related to issue #1435. The provider layer maps HTTP 429 responses
 * into either:
 *   - `FreeTierRateLimitError` (permanent) when the model id targets a
 *     free-tier deployment (heuristic: `-free` suffix).
 *   - `ProviderRateLimitError` (transient) for all other paid-tier
 *     deployments — retried by `ErrorBackoff` and the workflow
 *     `KILO_RETRIES` loop.
 *
 * These tests exercise the pure classification / parsing helpers so we
 * do not need to spin up a real SAP AI Core client. The end-to-end
 * "provider throws → orchestrator catches" flow is covered by the
 * higher-level suites in `tests/core/orchestrator.error.test.ts`.
 */

import { describe, it, expect } from 'vitest';

import {
  FreeTierRateLimitError,
  ProviderRateLimitError,
  FREE_TIER_RATE_LIMIT_CODE,
  PROVIDER_RATE_LIMIT_CODE,
  SAP_AI_CORE_RATE_LIMIT_DOCS_URL,
  classifyRateLimitError,
  extractRetryAfterSeconds,
  parseRetryAfterHeader,
  isFreeModel,
} from '../sapOrchestration.js';

describe('classifyRateLimitError (HTTP 429 → typed rate-limit error)', () => {
  it('wraps a 429 + paid model in ProviderRateLimitError (transient)', () => {
    const upstream = Object.assign(new Error('HTTP 429'), { status: 429 });
    const classified = classifyRateLimitError(upstream, 'anthropic--claude-4.5-sonnet');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    expect(classified).not.toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as ProviderRateLimitError;
    expect(wrapped.code).toBe(PROVIDER_RATE_LIMIT_CODE);
    expect(wrapped.statusCode).toBe(429);
    expect(wrapped.modelName).toBe('anthropic--claude-4.5-sonnet');
    expect((wrapped as Error & { cause?: unknown }).cause).toBe(upstream);
  });

  it('wraps a 429 + free-tier model in FreeTierRateLimitError (permanent)', () => {
    const upstream = Object.assign(new Error('HTTP 429'), { status: 429 });
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    expect(wrapped.code).toBe(FREE_TIER_RATE_LIMIT_CODE);
    expect(wrapped.statusCode).toBe(429);
    expect(wrapped.docsUrl).toBe(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    expect(wrapped.message).toContain('gpt-4o-free');
    expect(wrapped.message).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('detects 429 from response.status (fetch-wrapper style)', () => {
    const upstream = Object.assign(new Error('boom'), { response: { status: 429 } });
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
  });

  it('detects 429 from a "status: 429" message', () => {
    const upstream = new Error('request failed with status: 429');
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
  });

  it('detects a bare "429" token in the error message', () => {
    const upstream = new Error('HTTP 429 Too Many Requests');
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
  });

  it('leaves non-429 errors unchanged', () => {
    const other = new Error('random failure');
    const classified = classifyRateLimitError(other, 'gpt-4o');
    expect(classified).toBe(other);
  });

  it('leaves non-object errors unchanged', () => {
    expect(classifyRateLimitError(null, 'gpt-4o')).toBe(null);
    expect(classifyRateLimitError(undefined, 'gpt-4o')).toBe(undefined);
  });

  it('does not double-wrap an existing typed rate-limit error', () => {
    const already = new FreeTierRateLimitError('gpt-4o-free');
    const classified = classifyRateLimitError(already, 'gpt-4o-free');
    expect(classified).toBe(already);

    const paid = new ProviderRateLimitError('gpt-4o');
    expect(classifyRateLimitError(paid, 'gpt-4o')).toBe(paid);
  });

  it('populates retryAfterSeconds from the Retry-After header on the 429', () => {
    const upstream = Object.assign(new Error('HTTP 429'), {
      status: 429,
      headers: { 'Retry-After': '25' },
    });
    const classified = classifyRateLimitError(upstream, 'gpt-4o');
    expect(classified).toBeInstanceOf(ProviderRateLimitError);
    expect((classified as ProviderRateLimitError).retryAfterSeconds).toBe(25);
  });
});

describe('extractRetryAfterSeconds', () => {
  it('reads a numeric string header', () => {
    expect(extractRetryAfterSeconds({ headers: { 'Retry-After': '30' } })).toBe(30);
  });

  it('reads a lower-case header (HTTP/2 style)', () => {
    expect(extractRetryAfterSeconds({ headers: { 'retry-after': '15' } })).toBe(15);
  });

  it('reads a header from response.headers', () => {
    expect(extractRetryAfterSeconds({ response: { headers: { 'Retry-After': '5' } } })).toBe(5);
  });

  it('accepts a pre-parsed retryAfter numeric field', () => {
    expect(extractRetryAfterSeconds({ retryAfter: 42 })).toBe(42);
  });

  it('returns undefined when no header is available', () => {
    expect(extractRetryAfterSeconds({})).toBeUndefined();
    expect(extractRetryAfterSeconds(null)).toBeUndefined();
    expect(extractRetryAfterSeconds(undefined)).toBeUndefined();
  });

  it('rejects a negative numeric retryAfter field', () => {
    expect(extractRetryAfterSeconds({ retryAfter: -5 })).toBeUndefined();
  });
});

describe('parseRetryAfterHeader', () => {
  it('parses a plain integer seconds header', () => {
    expect(parseRetryAfterHeader('60')).toBe(60);
  });

  it('parses an HTTP-date and converts to a delta in seconds', () => {
    const future = new Date(Date.now() + 10_000).toUTCString();
    const parsed = parseRetryAfterHeader(future);
    // Allow a small drift for the test's own execution time.
    expect(parsed).toBeGreaterThanOrEqual(9);
    expect(parsed).toBeLessThanOrEqual(11);
  });

  it('resolves a past HTTP-date to 0', () => {
    const past = new Date(Date.now() - 5000).toUTCString();
    expect(parseRetryAfterHeader(past)).toBe(0);
  });

  it('rejects garbage values', () => {
    expect(parseRetryAfterHeader('not-a-time')).toBeUndefined();
    expect(parseRetryAfterHeader('')).toBeUndefined();
    expect(parseRetryAfterHeader(undefined as unknown as string)).toBeUndefined();
  });
});

describe('isFreeModel', () => {
  it('matches ids ending in -free (case insensitive)', () => {
    expect(isFreeModel('sap-ai-core/anthropic--claude-4.7-haiku-free')).toBe(true);
    expect(isFreeModel('gpt-4o-FREE')).toBe(true);
  });

  it('rejects paid-tier ids', () => {
    expect(isFreeModel('gpt-4o')).toBe(false);
    expect(isFreeModel('anthropic--claude-4.5-sonnet')).toBe(false);
  });

  it('does not match `free` embedded elsewhere in the id', () => {
    expect(isFreeModel('some-freerider-model')).toBe(false);
  });
});

describe('ProviderRateLimitError message contents', () => {
  it('includes model name, wait guidance, and docs link', () => {
    const err = new ProviderRateLimitError('gpt-4o', undefined, 15);
    expect(err.name).toBe('ProviderRateLimitError');
    expect(err.message).toContain('gpt-4o');
    expect(err.message).toContain('15 seconds');
    expect(err.message).toContain('smaller model');
    expect(err.docsUrl).toBe(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
  });

  it('falls back to the default 60s guidance when no retry-after is known', () => {
    const err = new ProviderRateLimitError('gpt-4o');
    expect(err.message).toContain('60 seconds');
    expect(err.retryAfterSeconds).toBeUndefined();
  });
});
