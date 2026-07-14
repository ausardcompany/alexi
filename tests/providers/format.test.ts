import { describe, it, expect } from 'vitest';
import { formatProviderError } from '../../src/providers/format.js';

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
