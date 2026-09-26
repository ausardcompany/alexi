/**
 * Tests for `classifyNetworkError` — the transport-failure classifier
 * used by the TUI to surface disconnects instead of hanging.
 */

import { describe, expect, it } from 'vitest';
import { classifyNetworkError } from './network.js';

describe('classifyNetworkError', () => {
  it('returns undefined for non-error values', () => {
    expect(classifyNetworkError(null)).toBeUndefined();
    expect(classifyNetworkError(undefined)).toBeUndefined();
    expect(classifyNetworkError('boom')).toBeUndefined();
    expect(classifyNetworkError(42)).toBeUndefined();
    expect(classifyNetworkError(new Error('plain'))).toBeUndefined();
  });

  it('classifies ENOTFOUND as dns and retriable', () => {
    const err = Object.assign(new Error('getaddrinfo ENOTFOUND api.example'), {
      code: 'ENOTFOUND',
    });
    const info = classifyNetworkError(err);
    expect(info).toBeDefined();
    expect(info!.kind).toBe('dns');
    expect(info!.retriable).toBe(true);
    expect(info!.message).toContain('ENOTFOUND');
  });

  it('classifies ETIMEDOUT as timeout', () => {
    const err = Object.assign(new Error('connect ETIMEDOUT'), { code: 'ETIMEDOUT' });
    const info = classifyNetworkError(err);
    expect(info?.kind).toBe('timeout');
  });

  it('classifies ECONNRESET as reset', () => {
    const err = Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' });
    const info = classifyNetworkError(err);
    expect(info?.kind).toBe('reset');
  });

  it('classifies ECONNREFUSED and EHOSTUNREACH as offline', () => {
    const refused = Object.assign(new Error('conn refused'), { code: 'ECONNREFUSED' });
    const unreach = Object.assign(new Error('unreachable'), { code: 'EHOSTUNREACH' });
    expect(classifyNetworkError(refused)?.kind).toBe('offline');
    expect(classifyNetworkError(unreach)?.kind).toBe('offline');
  });

  it('walks err.cause.code for wrapped fetch failures', () => {
    const cause = Object.assign(new Error('inner'), { code: 'ENOTFOUND' });
    const outer = Object.assign(new Error('fetch failed'), { cause });
    const info = classifyNetworkError(outer);
    expect(info?.kind).toBe('dns');
    expect(info?.message).toContain('ENOTFOUND');
  });

  it('returns undefined for non-offline codes', () => {
    const err = Object.assign(new Error('nope'), { code: 'ERR_INVALID_ARG_TYPE' });
    expect(classifyNetworkError(err)).toBeUndefined();
  });
});
