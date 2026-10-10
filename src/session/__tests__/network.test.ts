/**
 * Tests for network disconnect classification.
 *
 * Regression coverage for the port of upstream opencode/kilocode
 * `d6bb0ef05` (PR #13523): the classifier must map well-known Node
 * socket / DNS error codes to structured `NetworkDisconnectReason`
 * values so the TUI can render a "reconnecting…" line instead of
 * hanging indefinitely.
 */

import { describe, expect, it, vi } from 'vitest';

import {
  classifyNetworkError,
  isRetryableConnectionReset,
  NetworkDisconnectEvent,
  reportNetworkDisconnect,
} from '../network.js';

describe('classifyNetworkError', () => {
  it('returns null for non-Error inputs', () => {
    expect(classifyNetworkError('boom')).toBeNull();
    expect(classifyNetworkError(null)).toBeNull();
    expect(classifyNetworkError(undefined)).toBeNull();
    expect(classifyNetworkError(42)).toBeNull();
  });

  it('returns null for unrelated errors', () => {
    expect(classifyNetworkError(new Error('unauthorized'))).toBeNull();
    expect(classifyNetworkError(new Error('invalid input'))).toBeNull();
  });

  it('classifies AbortError as non-retriable abort', () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    expect(classifyNetworkError(err)).toEqual({ reason: 'abort', retriable: false });
  });

  it('classifies ETIMEDOUT as retriable timeout', () => {
    expect(classifyNetworkError(new Error('connect ETIMEDOUT 1.2.3.4:443'))).toEqual({
      reason: 'timeout',
      retriable: true,
    });
    expect(classifyNetworkError(new Error('socket timeout'))).toEqual({
      reason: 'timeout',
      retriable: true,
    });
  });

  it('classifies ECONNRESET / socket hang up as retriable socket', () => {
    expect(classifyNetworkError(new Error('read ECONNRESET'))).toEqual({
      reason: 'socket',
      retriable: true,
    });
    expect(classifyNetworkError(new Error('socket hang up'))).toEqual({
      reason: 'socket',
      retriable: true,
    });
  });

  it('prefers Node ErrnoException .code over message wording (opencode 055d95b)', () => {
    // An error whose message does NOT mention a known transport code but
    // whose `.code` IS a known transport code must still be classified.
    const err = Object.assign(new Error('server reset'), { code: 'ECONNRESET' });
    expect(classifyNetworkError(err)).toEqual({ reason: 'socket', retriable: true });
  });

  it('classifies ECONNRESET nested in err.cause.code (undici fetch)', () => {
    const err = Object.assign(new Error('fetch failed'), {
      cause: Object.assign(new Error('socket'), { code: 'ECONNRESET' }),
    });
    expect(classifyNetworkError(err)).toEqual({ reason: 'socket', retriable: true });
  });

  it('classifies ENOTFOUND as retriable dns', () => {
    expect(classifyNetworkError(new Error('getaddrinfo ENOTFOUND api.example.com'))).toEqual({
      reason: 'dns',
      retriable: true,
    });
  });

  it('classifies undici `fetch failed` wrappers as retriable unknown', () => {
    expect(classifyNetworkError(new Error('fetch failed'))).toEqual({
      reason: 'unknown',
      retriable: true,
    });
  });
});

describe('reportNetworkDisconnect', () => {
  it('publishes a network.disconnected event when classified', () => {
    const handler = vi.fn();
    const unsub = NetworkDisconnectEvent.subscribe(handler);
    try {
      const result = reportNetworkDisconnect(new Error('read ECONNRESET'), 'aicore-anthropic');
      expect(result).toEqual({ reason: 'socket', retriable: true });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'socket',
          retriable: true,
          provider: 'aicore-anthropic',
        })
      );
    } finally {
      unsub();
    }
  });

  it('returns null and does NOT publish for non-network errors', () => {
    const handler = vi.fn();
    const unsub = NetworkDisconnectEvent.subscribe(handler);
    try {
      const result = reportNetworkDisconnect(new Error('validation failed'));
      expect(result).toBeNull();
      expect(handler).not.toHaveBeenCalled();
    } finally {
      unsub();
    }
  });
});

describe('isRetryableConnectionReset', () => {
  it('returns true for ECONNRESET detected via .code (upstream 055d95b fix)', () => {
    const err = Object.assign(new Error('server reset'), { code: 'ECONNRESET' });
    expect(isRetryableConnectionReset(err)).toBe(true);
  });

  it('returns true for ETIMEDOUT and EAI_AGAIN via .code', () => {
    expect(
      isRetryableConnectionReset(Object.assign(new Error('x'), { code: 'ETIMEDOUT' }))
    ).toBe(true);
    expect(
      isRetryableConnectionReset(Object.assign(new Error('x'), { code: 'EAI_AGAIN' }))
    ).toBe(true);
  });

  it('returns true for ECONNRESET detected via err.cause.code (undici fetch)', () => {
    const err = Object.assign(new Error('fetch failed'), {
      cause: Object.assign(new Error('socket'), { code: 'ECONNRESET' }),
    });
    expect(isRetryableConnectionReset(err)).toBe(true);
  });

  it('falls back to message detection when .code is absent', () => {
    expect(isRetryableConnectionReset(new Error('read ECONNRESET'))).toBe(true);
    expect(isRetryableConnectionReset(new Error('socket hang up'))).toBe(true);
  });

  it('returns false for non-reset error codes', () => {
    expect(
      isRetryableConnectionReset(Object.assign(new Error('x'), { code: 'ENOTFOUND' }))
    ).toBe(false);
    expect(isRetryableConnectionReset(new Error('validation failed'))).toBe(false);
    expect(isRetryableConnectionReset('boom')).toBe(false);
    expect(isRetryableConnectionReset(null)).toBe(false);
  });
});
