/**
 * Tests for the shared logging utility.
 *
 * Covers:
 *  - `scrubUrl` redacts query strings / hash fragments while preserving
 *    origin + pathname.
 *  - `scrubUrl` passes non-URL input through unchanged.
 *  - `scrubUrlsFromString` finds URLs embedded in free-form error messages
 *    and scrubs them in place, leaving surrounding prose intact.
 *  - `formatError` includes `error.message` (never only the error code),
 *    scrubs credentials from the message, and attaches the stack trace
 *    only when the logger is at `debug` level.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatError, logger, scrubUrl, scrubUrlsFromString } from '../../src/utils/logger.js';

describe('scrubUrl', () => {
  it('redacts the query string while preserving origin and pathname', () => {
    expect(scrubUrl('https://api.example.com/v1/users?token=secret123')).toBe(
      'https://api.example.com/v1/users?[REDACTED]'
    );
  });

  it('redacts tokens embedded as api_key / access_token / code', () => {
    expect(scrubUrl('https://api.example.com/oauth?code=abc&state=xyz')).toBe(
      'https://api.example.com/oauth?[REDACTED]'
    );
    expect(scrubUrl('https://api.example.com/me?api_key=KEY-123')).toBe(
      'https://api.example.com/me?[REDACTED]'
    );
    expect(scrubUrl('https://api.example.com/data?access_token=TKN')).toBe(
      'https://api.example.com/data?[REDACTED]'
    );
  });

  it('preserves scheme, host, port, and pathname', () => {
    expect(scrubUrl('https://api.example.com:8443/v2/path/sub?x=1')).toBe(
      'https://api.example.com:8443/v2/path/sub?[REDACTED]'
    );
  });

  it('returns the URL unchanged when there is no query or hash', () => {
    expect(scrubUrl('https://api.example.com/v1/users')).toBe('https://api.example.com/v1/users');
    expect(scrubUrl('http://localhost:3000/')).toBe('http://localhost:3000/');
  });

  it('redacts hash fragment (OAuth implicit-flow access tokens)', () => {
    // Implicit flow puts the access token in the fragment, which the server
    // never sees but can still leak into logs via error.toString().
    expect(scrubUrl('https://cb.example.com/#access_token=xyz&token_type=bearer')).toBe(
      'https://cb.example.com/#[REDACTED]'
    );
  });

  it('redacts both query and hash when both are present', () => {
    expect(scrubUrl('https://cb.example.com/path?code=abc#state=xyz')).toBe(
      'https://cb.example.com/path?[REDACTED]#[REDACTED]'
    );
  });

  it('passes a non-URL string through unchanged', () => {
    expect(scrubUrl('not a url')).toBe('not a url');
    expect(scrubUrl('')).toBe('');
    expect(scrubUrl('ECONNRESET: socket hang up')).toBe('ECONNRESET: socket hang up');
  });
});

describe('scrubUrlsFromString', () => {
  it('scrubs a URL embedded inside an error sentence', () => {
    const input = 'OAuth exchange failed at https://api.example.com/token?code=secret: 401';
    expect(scrubUrlsFromString(input)).toBe(
      'OAuth exchange failed at https://api.example.com/token?[REDACTED]: 401'
    );
  });

  it('scrubs multiple URLs within one message', () => {
    const input =
      'Redirect from https://a.example.com/x?token=1 to https://b.example.com/y?api_key=2 failed';
    expect(scrubUrlsFromString(input)).toBe(
      'Redirect from https://a.example.com/x?[REDACTED] to https://b.example.com/y?[REDACTED] failed'
    );
  });

  it('leaves non-URL text unchanged', () => {
    expect(scrubUrlsFromString('ECONNRESET: socket hang up')).toBe('ECONNRESET: socket hang up');
    expect(scrubUrlsFromString('')).toBe('');
  });

  it('does not touch URLs without query parameters', () => {
    expect(scrubUrlsFromString('fetched https://api.example.com/health ok')).toBe(
      'fetched https://api.example.com/health ok'
    );
  });

  it('preserves trailing sentence punctuation outside the redacted URL', () => {
    const out = scrubUrlsFromString('see https://api.example.com/v1?token=t.');
    expect(out).toBe('see https://api.example.com/v1?[REDACTED].');
    // No naked token must remain.
    expect(out).not.toContain('token=t');
  });

  it('never allows a bare `token=` or `api_key=` value to survive', () => {
    const input =
      'HTTP 500 while calling https://provider.example.com/v1/complete?api_key=sk-live-DEADBEEF';
    const out = scrubUrlsFromString(input);
    expect(out).not.toContain('sk-live-DEADBEEF');
    expect(out).not.toContain('api_key=');
    expect(out).toContain('https://provider.example.com/v1/complete?[REDACTED]');
  });
});

describe('formatError', () => {
  const originalLevel = logger.getLevel();
  afterEach(() => {
    logger.setLevel(originalLevel);
  });

  it('returns the error message for Error instances', () => {
    const err = new Error('boom');
    expect(formatError(err)).toBe('boom');
  });

  it('scrubs URLs embedded in error.message', () => {
    const err = new Error('request failed at https://api.example.com/x?token=secret');
    const out = formatError(err);
    expect(out).toContain('[REDACTED]');
    expect(out).not.toContain('token=secret');
    expect(out).toContain('https://api.example.com/x');
  });

  it('falls back to String(err) for non-Error throws', () => {
    expect(formatError('plain string reason')).toBe('plain string reason');
    expect(formatError(42)).toBe('42');
    expect(formatError({ code: 'X' })).toBe('[object Object]');
  });

  it('scrubs URLs in non-Error string throws', () => {
    const out = formatError('failed https://api.example.com/x?token=secret');
    expect(out).not.toContain('token=secret');
    expect(out).toContain('[REDACTED]');
  });

  it('omits stack trace at info level', () => {
    logger.setLevel('info');
    const err = new Error('boom');
    const out = formatError(err);
    expect(out).toBe('boom');
    expect(out).not.toContain('at ');
  });

  it('includes stack trace at debug level', () => {
    logger.setLevel('debug');
    const err = new Error('boom');
    const out = formatError(err);
    expect(out).toContain('boom');
    // Node stack frames start with "at ".
    expect(out).toContain('\n');
  });

  it('scrubs URLs that appear in a stack trace at debug level', () => {
    logger.setLevel('debug');
    const err = new Error('boom');
    // Simulate a stack frame containing a URL (e.g. module specifier
    // reported by ESM loader).
    err.stack = `Error: boom\n    at fetch (https://cdn.example.com/mod.js?token=secret:12:5)`;
    const out = formatError(err);
    expect(out).not.toContain('token=secret');
    expect(out).toContain('[REDACTED]');
  });

  it('respects includeStack=false even at debug level', () => {
    logger.setLevel('debug');
    const err = new Error('boom');
    const out = formatError(err, false);
    expect(out).toBe('boom');
  });
});

describe('logger output', () => {
  beforeEach(() => {
    logger.setLevel('info');
  });

  it('writes error output through console.error with [ERROR] prefix', () => {
    const noop = (): void => undefined;
    const spy = vi.spyOn(console, 'error').mockImplementation(noop);
    try {
      logger.error('boom');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toContain('[ERROR] boom');
    } finally {
      spy.mockRestore();
    }
  });

  it('is safe to call formatError on an error whose message contains a credential URL', () => {
    const noop = (): void => undefined;
    const spy = vi.spyOn(console, 'error').mockImplementation(noop);
    try {
      const err = new Error(
        'OAuth exchange failed at https://api.example.com/token?code=supersecret: HTTP 401'
      );
      logger.error(`MCP auth failed: ${formatError(err)}`);
      expect(spy).toHaveBeenCalledTimes(1);
      const line = String(spy.mock.calls[0][0]);
      expect(line).not.toContain('supersecret');
      expect(line).toContain('[REDACTED]');
      // The HTTP status code must still be visible for debuggability.
      expect(line).toContain('HTTP 401');
    } finally {
      spy.mockRestore();
    }
  });
});
