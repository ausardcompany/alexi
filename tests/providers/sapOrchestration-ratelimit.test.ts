/**
 * Free-tier rate-limit detection tests (issue #1302).
 *
 * When the SAP AI Core API rejects a request with HTTP 429 AND the model id
 * targets a free-tier deployment (heuristic: `-free` suffix), the provider
 * must raise `FreeTierRateLimitError` with:
 *   - `code === 'free_tier_rate_limit'` — the machine-readable marker
 *     `ErrorBackoff.isFatal()` uses to short-circuit the retry loop.
 *   - a user-facing message that names the model, explains the quota, and
 *     links to the SAP AI Core rate-limit documentation.
 *
 * Generic (non-free) 429 responses stay unchanged so the existing transient
 * retry path in `ErrorBackoff` and the workflow-level `KILO_RETRIES` loop
 * keep handling them the same way. See AGENTS.md "Error classification":
 * 429 is transient by default; only the free-tier variant is permanent.
 */

import { describe, it, expect } from 'vitest';

import {
  FreeTierRateLimitError,
  FREE_TIER_RATE_LIMIT_CODE,
  SAP_AI_CORE_RATE_LIMIT_DOCS_URL,
  classifyRateLimitError,
  isFreeModel,
} from '../../src/providers/sapOrchestration.js';
import { ErrorBackoff } from '../../src/core/error-backoff.js';

describe('isFreeModel', () => {
  it('returns true for model ids ending in -free (case insensitive)', () => {
    expect(isFreeModel('sap-ai-core/anthropic--claude-4.7-haiku-free')).toBe(true);
    expect(isFreeModel('anthropic--claude-4.5-sonnet-free')).toBe(true);
    expect(isFreeModel('gpt-4o-free')).toBe(true);
    expect(isFreeModel('gpt-4o-FREE')).toBe(true);
    expect(isFreeModel('free')).toBe(true);
  });

  it('returns false for paid-tier model ids', () => {
    expect(isFreeModel('sap-ai-core/anthropic--claude-4.7-opus')).toBe(false);
    expect(isFreeModel('anthropic--claude-4.5-sonnet')).toBe(false);
    expect(isFreeModel('gpt-4o')).toBe(false);
    expect(isFreeModel('gpt-4o-mini')).toBe(false);
  });

  it('does NOT match `free` embedded in the middle of the id', () => {
    // The heuristic is deliberately narrow — only the trailing segment.
    expect(isFreeModel('some-freerider-model')).toBe(false);
    expect(isFreeModel('free-tier-embedded-name')).toBe(false);
  });

  it('handles empty and non-string inputs safely', () => {
    expect(isFreeModel('')).toBe(false);
    // Guard against callers that pass a non-string despite the type sig.
    expect(isFreeModel(undefined as unknown as string)).toBe(false);
    expect(isFreeModel(null as unknown as string)).toBe(false);
  });
});

describe('classifyRateLimitError', () => {
  it('wraps 429 + free-tier model in a FreeTierRateLimitError', () => {
    const upstream: Error & { status?: number } = new Error('Too Many Requests');
    upstream.status = 429;
    const classified = classifyRateLimitError(upstream, 'anthropic--claude-4.7-haiku-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
    const wrapped = classified as FreeTierRateLimitError;
    expect(wrapped.code).toBe(FREE_TIER_RATE_LIMIT_CODE);
    expect(wrapped.modelName).toBe('anthropic--claude-4.7-haiku-free');
    expect(wrapped.statusCode).toBe(429);
    // The original error is preserved so consumers can still inspect the
    // upstream cause chain (e.g. `formatProviderError`).
    expect((wrapped as Error & { cause?: unknown }).cause).toBe(upstream);
  });

  it('returns the original error unchanged for 429 + paid model', () => {
    const upstream: Error & { status?: number } = new Error('Too Many Requests');
    upstream.status = 429;
    const classified = classifyRateLimitError(upstream, 'anthropic--claude-4.5-sonnet');
    expect(classified).toBe(upstream);
    expect(classified).not.toBeInstanceOf(FreeTierRateLimitError);
  });

  it('returns the original error unchanged for non-429 + free model', () => {
    const upstream: Error & { status?: number } = new Error('Internal Server Error');
    upstream.status = 500;
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBe(upstream);
  });

  it('extracts 429 status from `response.status` (fetch-wrapper shape)', () => {
    const upstream = { message: 'rate limit', response: { status: 429 } };
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
  });

  it('extracts 429 status from the message text (SDK error strings)', () => {
    const upstream = new Error('Request failed with status: 429');
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
  });

  it('extracts 429 status from a bare "429" in the message (no `status:` prefix)', () => {
    const upstream = new Error('HTTP 429 Too Many Requests');
    const classified = classifyRateLimitError(upstream, 'gpt-4o-free');
    expect(classified).toBeInstanceOf(FreeTierRateLimitError);
  });

  it('does not double-wrap an existing FreeTierRateLimitError', () => {
    const already = new FreeTierRateLimitError('gpt-4o-free');
    const classified = classifyRateLimitError(already, 'gpt-4o-free');
    expect(classified).toBe(already);
  });

  it('returns the original error when it is null/undefined', () => {
    expect(classifyRateLimitError(null, 'gpt-4o-free')).toBe(null);
    expect(classifyRateLimitError(undefined, 'gpt-4o-free')).toBe(undefined);
  });
});

describe('FreeTierRateLimitError message contents', () => {
  it('includes the model name, quota guidance, and docs link', () => {
    const err = new FreeTierRateLimitError('anthropic--claude-4.7-haiku-free');
    expect(err.name).toBe('FreeTierRateLimitError');
    expect(err.code).toBe('free_tier_rate_limit');
    expect(err.docsUrl).toBe(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    expect(err.message).toContain("'anthropic--claude-4.7-haiku-free'");
    expect(err.message.toLowerCase()).toContain('free-tier');
    expect(err.message.toLowerCase()).toContain('rate limit');
    // Actionable guidance: wait OR upgrade.
    expect(err.message.toLowerCase()).toContain('wait');
    expect(err.message.toLowerCase()).toContain('upgrade');
    // Documentation link is present and points at the SAP AI Core docs.
    expect(err.message).toContain(SAP_AI_CORE_RATE_LIMIT_DOCS_URL);
    expect(SAP_AI_CORE_RATE_LIMIT_DOCS_URL).toMatch(/^https:\/\/help\.sap\.com\//);
  });

  it('is an Error subclass with the stable name "FreeTierRateLimitError"', () => {
    const err = new FreeTierRateLimitError('gpt-4o-free');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(FreeTierRateLimitError);
    expect(err.name).toBe('FreeTierRateLimitError');
  });
});

describe('ErrorBackoff.isFatal() free-tier classification', () => {
  it('returns true for a FreeTierRateLimitError passed to isFatal()', () => {
    const backoff = new ErrorBackoff();
    const err = new FreeTierRateLimitError('gpt-4o-free');
    expect(backoff.isFatal(err)).toBe(true);
  });

  it('returns true for a plain object carrying the free_tier_rate_limit code', () => {
    // Cross-module boundary safety: production code may see the error via
    // a re-exported class where `instanceof` fails; the code check handles it.
    const backoff = new ErrorBackoff();
    const err = { code: 'free_tier_rate_limit', message: 'quota' };
    expect(backoff.isFatal(err)).toBe(true);
  });

  it('returns false for a generic 429 error passed to isFatal()', () => {
    const backoff = new ErrorBackoff();
    const err = new Error('Too Many Requests');
    (err as Error & { status?: number }).status = 429;
    expect(backoff.isFatal(err)).toBe(false);
  });

  it('recordError with a FreeTierRateLimitError sets the fatal flag', () => {
    const backoff = new ErrorBackoff();
    const err = new FreeTierRateLimitError('gpt-4o-free');
    backoff.recordError(429, err);
    expect(backoff.isFatal()).toBe(true);
  });

  it('recordError with a generic 429 (no free-tier marker) does NOT set fatal', () => {
    // 429 is transient per AGENTS.md — only the free-tier variant is
    // permanent. Generic 429 must fall through to the backoff schedule.
    const backoff = new ErrorBackoff();
    backoff.recordError(429);
    expect(backoff.isFatal()).toBe(false);
  });

  it('recordError with 401/403/404 still sets fatal (unchanged behavior)', () => {
    for (const status of [401, 403, 404, 400, 422]) {
      const backoff = new ErrorBackoff();
      backoff.recordError(status);
      expect(backoff.isFatal(), `status ${status} should be fatal`).toBe(true);
    }
  });

  it('recordError with 5xx does not set fatal (transient)', () => {
    for (const status of [500, 502, 503, 504]) {
      const backoff = new ErrorBackoff();
      backoff.recordError(status);
      expect(backoff.isFatal(), `status ${status} should not be fatal`).toBe(false);
    }
  });

  it('reset() clears the fatal flag set by a free-tier error', () => {
    const backoff = new ErrorBackoff();
    backoff.recordError(429, new FreeTierRateLimitError('gpt-4o-free'));
    expect(backoff.isFatal()).toBe(true);
    backoff.reset();
    expect(backoff.isFatal()).toBe(false);
  });
});
