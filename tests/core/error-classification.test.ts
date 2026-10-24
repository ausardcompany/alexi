/**
 * Error classification tests (issue #2134).
 *
 * Verifies the taxonomy exported by `src/core/error-backoff.ts` and the
 * provider-specific helpers in `src/providers/index.ts`:
 *
 *   - Content policy / safety filter rejections are classified as
 *     `content_policy` + fatal + non-retryable, regardless of the
 *     provider family (OpenAI moderation, Google SAFETY, Anthropic
 *     content_policy, HTTP 451).
 *   - Transient failures (ECONNRESET, 502, 503, 429) are classified
 *     as `network`/`rate_limit` + retryable.
 *   - Auth failures (401, 403) and validation failures (400, 422) are
 *     fatal.
 *   - `ErrorBackoff` honours the content-policy signal and marks the
 *     state fatal, so outer retry loops stop immediately.
 */

import { describe, it, expect } from 'vitest';

import { classifyError, isContentPolicyError, ErrorBackoff } from '../../src/core/error-backoff.js';
import {
  isOpenAIContentPolicyError,
  isGoogleSafetyError,
  isAnthropicContentPolicyError,
} from '../../src/providers/index.js';

describe('classifyError taxonomy (issue #2134)', () => {
  it('classifies ECONNRESET as transient network', () => {
    const err = Object.assign(new Error('socket hang up (ECONNRESET)'), { code: 'ECONNRESET' });
    const c = classifyError(err);
    expect(c.type).toBe('network');
    expect(c.fatal).toBe(false);
    expect(c.retryable).toBe(true);
  });

  it('classifies ETIMEDOUT message as transient network', () => {
    const err = new Error('request ETIMEDOUT after 30000ms');
    const c = classifyError(err);
    expect(c.type).toBe('network');
    expect(c.retryable).toBe(true);
  });

  it('classifies HTTP 502 as transient network', () => {
    const c = classifyError({ status: 502, message: 'Bad Gateway' });
    expect(c.type).toBe('network');
    expect(c.fatal).toBe(false);
    expect(c.statusCode).toBe(502);
  });

  it('classifies HTTP 503 as transient network', () => {
    const c = classifyError({ statusCode: 503 });
    expect(c.type).toBe('network');
    expect(c.retryable).toBe(true);
  });

  it('classifies HTTP 429 as transient rate_limit', () => {
    const c = classifyError({ status: 429 });
    expect(c.type).toBe('rate_limit');
    expect(c.fatal).toBe(false);
    expect(c.retryable).toBe(true);
  });

  it('classifies HTTP 401 as permanent auth', () => {
    const c = classifyError({ status: 401 });
    expect(c.type).toBe('auth');
    expect(c.fatal).toBe(true);
    expect(c.retryable).toBe(false);
  });

  it('classifies HTTP 403 as permanent auth', () => {
    const c = classifyError({ status: 403 });
    expect(c.type).toBe('auth');
    expect(c.fatal).toBe(true);
  });

  it('classifies HTTP 400 as permanent validation', () => {
    const c = classifyError({ status: 400, message: 'bad request' });
    expect(c.type).toBe('validation');
    expect(c.fatal).toBe(true);
  });

  it('classifies HTTP 422 as permanent validation', () => {
    const c = classifyError({ status: 422 });
    expect(c.type).toBe('validation');
    expect(c.fatal).toBe(true);
  });

  it('classifies NoRefreshTokenError as permanent auth', () => {
    const c = classifyError({ name: 'NoRefreshTokenError', message: 'need refresh' });
    expect(c.type).toBe('auth');
    expect(c.fatal).toBe(true);
  });

  it('classifies a free-tier rate-limit error as permanent rate_limit', () => {
    const err = { code: 'free_tier_rate_limit', statusCode: 429 };
    const c = classifyError(err);
    expect(c.type).toBe('rate_limit');
    expect(c.fatal).toBe(true);
    expect(c.retryable).toBe(false);
  });

  it('classifies an xAI capacity message as transient rate_limit', () => {
    const c = classifyError({ message: 'xAI capacity exceeded, please retry' });
    expect(c.type).toBe('rate_limit');
    expect(c.retryable).toBe(true);
  });

  it('classifies an unclassified error as unknown (cautiously retryable)', () => {
    const c = classifyError(new Error('something weird happened'));
    expect(c.type).toBe('unknown');
    expect(c.fatal).toBe(false);
    expect(c.retryable).toBe(true);
  });

  it('returns an unknown classification for null / undefined input', () => {
    expect(classifyError(null).type).toBe('unknown');
    expect(classifyError(undefined).type).toBe('unknown');
  });
});

describe('content-policy detection (issue #2134)', () => {
  it('detects a message containing "moderation"', () => {
    const err = new Error('Request blocked by moderation');
    expect(isContentPolicyError(err)).toBe(true);
    const c = classifyError(err);
    expect(c.type).toBe('content_policy');
    expect(c.fatal).toBe(true);
    expect(c.retryable).toBe(false);
  });

  it('detects a message containing "content_filter"', () => {
    const err = new Error('response blocked: content_filter');
    expect(isContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('detects a message containing "content policy"', () => {
    const err = new Error('rejected by content policy');
    expect(isContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('detects a message containing "safety"', () => {
    const err = new Error('blocked by safety filter');
    expect(isContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('detects HTTP 451 as content policy', () => {
    const err = { status: 451, message: 'Unavailable For Legal Reasons' };
    expect(isContentPolicyError(err)).toBe(true);
    const c = classifyError(err);
    expect(c.type).toBe('content_policy');
    expect(c.fatal).toBe(true);
    expect(c.statusCode).toBe(451);
  });

  it('does not flag an unrelated error as content policy', () => {
    expect(isContentPolicyError(new Error('request failed'))).toBe(false);
    expect(isContentPolicyError({ status: 500 })).toBe(false);
    expect(isContentPolicyError(null)).toBe(false);
    expect(isContentPolicyError(undefined)).toBe(false);
    expect(isContentPolicyError(42)).toBe(false);
  });

  it('recognises the ContentFilterError class name (cross-module safe)', () => {
    expect(isContentPolicyError({ name: 'ContentFilterError' })).toBe(true);
  });

  it('recognises the content_filter code marker', () => {
    expect(isContentPolicyError({ code: 'content_filter' })).toBe(true);
  });
});

describe('provider-specific content-policy helpers (issue #2134)', () => {
  it('OpenAI: detects moderation API error shape', () => {
    const err = { error: { type: 'moderation' } };
    expect(isOpenAIContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('OpenAI: detects content_policy_violation code', () => {
    const err = { error: { code: 'content_policy_violation' } };
    expect(isOpenAIContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('OpenAI: detects HTTP 451', () => {
    const err = { status: 451, error: { message: 'blocked' } };
    expect(isOpenAIContentPolicyError(err)).toBe(true);
  });

  it('OpenAI: ignores unrelated error shapes', () => {
    expect(isOpenAIContentPolicyError({ error: { type: 'invalid_request' } })).toBe(false);
    expect(isOpenAIContentPolicyError({ status: 500 })).toBe(false);
    expect(isOpenAIContentPolicyError(null)).toBe(false);
  });

  it('Google: detects finishReason SAFETY', () => {
    const err = { finishReason: 'SAFETY' };
    expect(isGoogleSafetyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('Google: detects promptFeedback.blockReason SAFETY', () => {
    const err = { promptFeedback: { blockReason: 'SAFETY' } };
    expect(isGoogleSafetyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('Google: ignores unrelated finish reasons', () => {
    expect(isGoogleSafetyError({ finishReason: 'STOP' })).toBe(false);
    expect(isGoogleSafetyError({ promptFeedback: { blockReason: 'OK' } })).toBe(false);
    expect(isGoogleSafetyError(null)).toBe(false);
  });

  it('Anthropic: detects error_type content_policy', () => {
    const err = { error_type: 'content_policy' };
    expect(isAnthropicContentPolicyError(err)).toBe(true);
    expect(classifyError(err).type).toBe('content_policy');
  });

  it('Anthropic: detects invalid_request_error with content_policy message', () => {
    const err = {
      type: 'invalid_request_error',
      message: 'request violated content policy',
    };
    expect(isAnthropicContentPolicyError(err)).toBe(true);
  });

  it('Anthropic: ignores unrelated invalid_request_error messages', () => {
    const err = { type: 'invalid_request_error', message: 'missing field' };
    expect(isAnthropicContentPolicyError(err)).toBe(false);
  });
});

describe('ErrorBackoff + content-policy integration (issue #2134)', () => {
  it('does not retry a content-policy error from a message substring', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = new Error('Request blocked by content_policy');
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(true);
    expect(b.isFatal(err)).toBe(true);
  });

  it('does not retry an OpenAI moderation error', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = { error: { type: 'moderation' }, message: 'blocked' };
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(true);
  });

  it('does not retry a Google SAFETY error', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = { finishReason: 'SAFETY', message: 'blocked by safety setting' };
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(true);
  });

  it('does not retry an Anthropic content_policy error', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = { error_type: 'content_policy', message: 'blocked' };
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(true);
  });

  it('does not retry an HTTP 451 content-blocked response', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = { status: 451, message: 'blocked' };
    b.recordError(451, err);
    expect(b.isFatal()).toBe(true);
  });

  it('still retries a transient 503 error (not fatal)', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = { status: 503, message: 'service unavailable' };
    b.recordError(503, err);
    expect(b.isFatal()).toBe(false);
  });

  it('still retries a transient ECONNRESET error (not fatal)', () => {
    const b = new ErrorBackoff({ maxRetries: 5, initialDelayMs: 10 });
    const err = Object.assign(new Error('ECONNRESET'), { code: 'ECONNRESET' });
    b.recordError(undefined, err);
    expect(b.isFatal()).toBe(false);
  });

  it('isFatal(err) short-circuits for content-policy without recordError', () => {
    const b = new ErrorBackoff();
    const err = { error: { type: 'moderation' } };
    expect(b.isFatal(err)).toBe(true);
  });
});
