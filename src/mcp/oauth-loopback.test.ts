/**
 * Tests for the MCP OAuth loopback helper.
 *
 * Guards upstream opencode `b55f220` ("treat `*.localhost` as loopback
 * for MCP OAuth token endpoints"). A token endpoint URL whose hostname
 * is a sub-name of `.localhost` must be classified as loopback per RFC
 * 6761; otherwise the OAuth flow refuses to speak plain HTTP to it.
 */

import { describe, it, expect } from 'vitest';
import { isLoopback } from './oauth-loopback.js';

describe('isLoopback', () => {
  it('returns true for the literal `localhost` host', () => {
    expect(isLoopback(new URL('http://localhost/token'))).toBe(true);
    expect(isLoopback(new URL('http://LOCALHOST:8080/token'))).toBe(true);
  });

  it('returns true for `*.localhost` subdomains (RFC 6761)', () => {
    expect(isLoopback(new URL('http://auth.service.localhost/token'))).toBe(true);
    expect(isLoopback(new URL('http://my-dev.localhost:3000/'))).toBe(true);
  });

  it('returns true for IPv4 loopback (127.0.0.0/8)', () => {
    expect(isLoopback(new URL('http://127.0.0.1/token'))).toBe(true);
    expect(isLoopback(new URL('http://127.1.2.3/token'))).toBe(true);
  });

  it('returns true for IPv6 loopback (::1)', () => {
    expect(isLoopback(new URL('http://[::1]/token'))).toBe(true);
  });

  it('returns false for external hostnames', () => {
    expect(isLoopback(new URL('https://example.com/token'))).toBe(false);
    expect(isLoopback(new URL('https://auth.example.com/token'))).toBe(false);
  });

  it('does NOT match `localhost` as a suffix of unrelated hosts', () => {
    expect(isLoopback(new URL('https://notlocalhost.example.com/'))).toBe(false);
    // `attacker-localhost.example.com` must NOT be classified as loopback —
    // only a `.localhost` boundary counts.
    expect(isLoopback(new URL('https://attacker-localhost.example.com/'))).toBe(false);
  });
});
