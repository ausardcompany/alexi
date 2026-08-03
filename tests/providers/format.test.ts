import { describe, it, expect } from 'vitest';
import { formatProviderError, classifyProviderError } from '../../src/providers/format.js';

describe('formatProviderError', () => {
  it('formats the undici fetch failed / SocketError reference case', () => {
    // Reproduce the undici shape:
    //   TypeError: fetch failed
    //     [cause]: SocketError { message: 'other side closed', code: 'UND_ERR_SOCKET' }
    const cause: Error & { code?: string } = new Error('other side closed');
    cause.name = 'SocketError';
    cause.code = 'UND_ERR_SOCKET';

    const outer = new TypeError('fetch failed');
    (outer as Error & { cause?: unknown }).cause = cause;

    expect(formatProviderError(outer)).toBe(
      'fetch failed: SocketError: other side closed (UND_ERR_SOCKET)'
    );
  });

  it('returns message unchanged for a plain Error with no cause', () => {
    expect(formatProviderError(new Error('boom'))).toBe('boom');
  });

  it('coerces non-Error input via String()', () => {
    expect(formatProviderError(42)).toBe('42');
  });

  it('caps recursion at depth 2 and does not walk cause.cause', () => {
    // Build a 3-level chain: outer -> middle -> inner
    const inner: Error & { code?: string } = new Error('inner message');
    inner.name = 'InnerError';
    inner.code = 'INNER_CODE';

    const middle: Error & { cause?: unknown; code?: string } = new Error('middle message');
    middle.name = 'MiddleError';
    middle.code = 'MIDDLE_CODE';
    middle.cause = inner;

    const outer = new Error('outer message');
    (outer as Error & { cause?: unknown }).cause = middle;

    const formatted = formatProviderError(outer);

    // First two levels are folded in.
    expect(formatted).toBe('outer message: MiddleError: middle message (MIDDLE_CODE)');
    // Third level (cause.cause) is NOT included.
    expect(formatted).not.toContain('InnerError');
    expect(formatted).not.toContain('inner message');
    expect(formatted).not.toContain('INNER_CODE');
  });

  it('omits the code suffix when cause has no code', () => {
    const cause = new Error('some reason');
    cause.name = 'GenericError';
    const outer = new Error('wrapper');
    (outer as Error & { cause?: unknown }).cause = cause;

    expect(formatProviderError(outer)).toBe('wrapper: GenericError: some reason');
  });

  it('ignores non-error-shaped cause values', () => {
    const outer = new Error('wrapper');
    (outer as Error & { cause?: unknown }).cause = 'a plain string';

    expect(formatProviderError(outer)).toBe('wrapper');
  });
});

describe('classifyProviderError', () => {
  it('returns context_overflow for message: "context window exceeded"', () => {
    expect(classifyProviderError(new Error('context window exceeded'))).toBe('context_overflow');
  });

  it('matches common overflow phrasings from provider bodies', () => {
    expect(classifyProviderError(new Error('context_length_exceeded'))).toBe('context_overflow');
    expect(
      classifyProviderError(new Error("this model's maximum context length is 8192 tokens"))
    ).toBe('context_overflow');
    expect(classifyProviderError(new Error('prompt too long for this deployment'))).toBe(
      'context_overflow'
    );
    expect(classifyProviderError(new Error('input too long: 300000 tokens'))).toBe(
      'context_overflow'
    );
  });

  it('returns rate_limit for statusCode 429 (with veto over context_overflow)', () => {
    const err = new Error('too many requests');
    (err as Error & { statusCode?: number }).statusCode = 429;
    expect(classifyProviderError(err)).toBe('rate_limit');
  });

  it('vetoes context_overflow when a 429 is present, even if body mentions context', () => {
    // Real-world: 429 body sometimes carries "context length exceeded" as
    // the reason for the throttle. The correct recovery is backoff, not
    // compaction, so rate_limit must win.
    const err = new Error('rate limit exceeded: context length exceeded');
    (err as Error & { statusCode?: number }).statusCode = 429;
    expect(classifyProviderError(err)).toBe('rate_limit');
  });

  it('detects rate_limit from message alone (no status code)', () => {
    expect(classifyProviderError(new Error('rate limit hit, retry in 5s'))).toBe('rate_limit');
  });

  it('returns auth for statusCode 401 and 403', () => {
    const e401 = new Error('unauthorized');
    (e401 as Error & { statusCode?: number }).statusCode = 401;
    expect(classifyProviderError(e401)).toBe('auth');

    const e403 = new Error('forbidden');
    (e403 as Error & { statusCode?: number }).statusCode = 403;
    expect(classifyProviderError(e403)).toBe('auth');
  });

  it('returns validation for statusCode 400 and 422 without overflow markers', () => {
    const e400 = new Error('bad request');
    (e400 as Error & { statusCode?: number }).statusCode = 400;
    expect(classifyProviderError(e400)).toBe('validation');

    const e422 = new Error('unprocessable entity');
    (e422 as Error & { statusCode?: number }).statusCode = 422;
    expect(classifyProviderError(e422)).toBe('validation');
  });

  it('prefers context_overflow over validation when 400 body indicates overflow', () => {
    // Some SAP AI Core deployments map overflow to HTTP 400. The overflow
    // path is recoverable via compaction; do not lose it.
    const err = new Error('bad request');
    (err as Error & { statusCode?: number; responseBody?: string }).statusCode = 400;
    (err as Error & { responseBody?: string }).responseBody = '{"error":"context window exceeded"}';
    expect(classifyProviderError(err)).toBe('context_overflow');
  });

  it('returns undefined for unclassified errors', () => {
    expect(classifyProviderError(new Error('boom'))).toBeUndefined();
    expect(classifyProviderError(new Error('fetch failed'))).toBeUndefined();
    expect(classifyProviderError(null)).toBeUndefined();
    expect(classifyProviderError(undefined)).toBeUndefined();
  });

  it('walks cause chains up to 2 levels deep', () => {
    // Level 2: cause carries the overflow message.
    const inner = new Error('context window exceeded');
    const outer = new Error('provider request failed');
    (outer as Error & { cause?: unknown }).cause = inner;
    expect(classifyProviderError(outer)).toBe('context_overflow');

    // Level 3: cause.cause carries the overflow message but is BEYOND
    // the depth cap. Still detected because collectMessages walks 0/1/2.
    const deep = new Error('bottom');
    const mid = new Error('middle');
    (mid as Error & { cause?: unknown }).cause = deep;
    const top = new Error('top');
    (top as Error & { cause?: unknown }).cause = mid;
    // top -> mid -> deep, three levels; the "deep" message has no overflow
    // marker so this stays undefined.
    expect(classifyProviderError(top)).toBeUndefined();

    // Same 3-level chain but the overflow marker is at level 2 (mid), so
    // it IS detected.
    const midOverflow = new Error('context_length_exceeded');
    const top2 = new Error('top');
    (top2 as Error & { cause?: unknown }).cause = midOverflow;
    expect(classifyProviderError(top2)).toBe('context_overflow');
  });

  it('extracts status from response.status when top-level status is absent', () => {
    const err = new Error('nested response');
    (err as Error & { response?: { status?: number } }).response = { status: 401 };
    expect(classifyProviderError(err)).toBe('auth');
  });

  it('does not blow up on self-referential cause chains', () => {
    const err = new Error('loop');
    (err as Error & { cause?: unknown }).cause = err;
    expect(classifyProviderError(err)).toBeUndefined();
  });
});
