/**
 * Tests for the surgical URL / object credential redaction helpers.
 *
 * Covers:
 *  - `redactUrl` redacts only sensitive query parameters, preserving
 *    non-sensitive ones (page, sort, state, ...).
 *  - `redactUrl` redacts hash fragments wholesale.
 *  - `redactUrl` preserves scheme, host, port, and pathname.
 *  - `redactUrl` passes non-URL input through unchanged.
 *  - `redactCredentials` recursively replaces values of credential-like
 *    keys inside nested objects / arrays.
 *  - `redactCredentials` leaves non-credential fields intact.
 *  - `isSensitiveKey` matches the documented set of patterns.
 */

import { describe, expect, it } from 'vitest';
import {
  REDACTED,
  isSensitiveKey,
  redactCredentials,
  redactUrl,
} from '../../src/utils/url-redact.js';

describe('isSensitiveKey', () => {
  it('matches common credential param names', () => {
    expect(isSensitiveKey('token')).toBe(true);
    expect(isSensitiveKey('access_token')).toBe(true);
    expect(isSensitiveKey('refresh_token')).toBe(true);
    expect(isSensitiveKey('id_token')).toBe(true);
    expect(isSensitiveKey('code')).toBe(true);
    expect(isSensitiveKey('key')).toBe(true);
    expect(isSensitiveKey('api_key')).toBe(true);
    expect(isSensitiveKey('api-key')).toBe(true);
    expect(isSensitiveKey('apiKey')).toBe(true);
    expect(isSensitiveKey('secret')).toBe(true);
    expect(isSensitiveKey('client_secret')).toBe(true);
    expect(isSensitiveKey('clientSecret')).toBe(true);
    expect(isSensitiveKey('password')).toBe(true);
    expect(isSensitiveKey('passwd')).toBe(true);
    expect(isSensitiveKey('pwd')).toBe(true);
    expect(isSensitiveKey('authorization')).toBe(true);
    expect(isSensitiveKey('Authorization')).toBe(true);
    expect(isSensitiveKey('auth')).toBe(true);
    expect(isSensitiveKey('credential')).toBe(true);
    expect(isSensitiveKey('credentials')).toBe(true);
    expect(isSensitiveKey('signature')).toBe(true);
    expect(isSensitiveKey('sig')).toBe(true);
    expect(isSensitiveKey('session_id')).toBe(true);
    expect(isSensitiveKey('sessionId')).toBe(true);
  });

  it('does not flag common non-sensitive param names', () => {
    expect(isSensitiveKey('page')).toBe(false);
    expect(isSensitiveKey('sort')).toBe(false);
    expect(isSensitiveKey('limit')).toBe(false);
    expect(isSensitiveKey('offset')).toBe(false);
    expect(isSensitiveKey('q')).toBe(false);
    expect(isSensitiveKey('query')).toBe(false);
    expect(isSensitiveKey('state')).toBe(false);
    expect(isSensitiveKey('name')).toBe(false);
    expect(isSensitiveKey('id')).toBe(false);
    expect(isSensitiveKey('user')).toBe(false);
    expect(isSensitiveKey('')).toBe(false);
  });
});

describe('redactUrl', () => {
  it('redacts sensitive query params while preserving non-sensitive ones', () => {
    expect(redactUrl('https://cb.example.com/callback?code=SECRET&state=xyz')).toBe(
      `https://cb.example.com/callback?code=${REDACTED}&state=xyz`
    );
  });

  it('redacts OAuth token in query string', () => {
    const out = redactUrl('https://api.example.com/v1?token=sk-live-DEADBEEF');
    expect(out).not.toContain('DEADBEEF');
    expect(out).toBe(`https://api.example.com/v1?token=${REDACTED}`);
    // Round-trip through URL — brackets are legal in query strings, so
    // the readable placeholder survives parsing.
    const u = new URL(out);
    expect(u.searchParams.get('token')).toBe(REDACTED);
  });

  it('redacts api_key / access_token / password across the common set', () => {
    const u1 = new URL(redactUrl('https://api.example.com/me?api_key=KEY-123'));
    expect(u1.searchParams.get('api_key')).toBe(REDACTED);

    const u2 = new URL(redactUrl('https://api.example.com/data?access_token=TKN&user=bob'));
    expect(u2.searchParams.get('access_token')).toBe(REDACTED);
    expect(u2.searchParams.get('user')).toBe('bob');

    const u3 = new URL(redactUrl('https://api.example.com/login?password=p%40ssword'));
    expect(u3.searchParams.get('password')).toBe(REDACTED);
  });

  it('leaves URLs with no sensitive params completely untouched', () => {
    // page / sort / limit are non-sensitive — the entire URL round-trips.
    const u = new URL(redactUrl('https://api.example.com/items?page=2&sort=asc&limit=50'));
    expect(u.searchParams.get('page')).toBe('2');
    expect(u.searchParams.get('sort')).toBe('asc');
    expect(u.searchParams.get('limit')).toBe('50');
  });

  it('preserves scheme, host, port, and pathname', () => {
    const u = new URL(redactUrl('https://api.example.com:8443/v2/path/sub?token=T&page=2'));
    expect(u.protocol).toBe('https:');
    expect(u.hostname).toBe('api.example.com');
    expect(u.port).toBe('8443');
    expect(u.pathname).toBe('/v2/path/sub');
    expect(u.searchParams.get('token')).toBe(REDACTED);
    expect(u.searchParams.get('page')).toBe('2');
  });

  it('redacts hash fragment wholesale (OAuth implicit-flow access tokens)', () => {
    expect(redactUrl('https://cb.example.com/#access_token=xyz&token_type=bearer')).toBe(
      `https://cb.example.com/#${REDACTED}`
    );
  });

  it('redacts both sensitive query and hash when both present', () => {
    const out = redactUrl('https://cb.example.com/path?code=abc&state=s#at=xyz');
    const u = new URL(out);
    expect(u.searchParams.get('code')).toBe(REDACTED);
    expect(u.searchParams.get('state')).toBe('s');
    expect(u.hash).toBe(`#${REDACTED}`);
  });

  it('returns the URL unchanged when there is no query or hash', () => {
    expect(redactUrl('https://api.example.com/v1/users')).toBe('https://api.example.com/v1/users');
    expect(redactUrl('http://localhost:3000/')).toBe('http://localhost:3000/');
  });

  it('passes non-URL input through unchanged', () => {
    expect(redactUrl('not a url')).toBe('not a url');
    expect(redactUrl('')).toBe('');
    expect(redactUrl('ECONNRESET: socket hang up')).toBe('ECONNRESET: socket hang up');
  });

  it('never leaves the raw secret value in the output', () => {
    const out = redactUrl('https://provider.example.com/v1/complete?api_key=sk-live-DEADBEEF');
    expect(out).not.toContain('sk-live-DEADBEEF');
  });
});

describe('redactCredentials', () => {
  it('redacts a shallow credential field in an object', () => {
    const out = redactCredentials({ apiKey: 'SECRET', endpoint: 'https://example.com' });
    expect(out).toEqual({ apiKey: REDACTED, endpoint: 'https://example.com' });
  });

  it('recursively redacts nested credential fields', () => {
    const input = {
      server: 'mcp-fs',
      transport: {
        kind: 'http',
        headers: { Authorization: 'Bearer abc123', 'content-type': 'application/json' },
      },
      meta: { ok: true },
    };
    const out = redactCredentials(input) as typeof input;
    expect(out.server).toBe('mcp-fs');
    expect(out.transport.kind).toBe('http');
    expect(out.transport.headers.Authorization).toBe(REDACTED);
    expect(out.transport.headers['content-type']).toBe('application/json');
    expect(out.meta.ok).toBe(true);
  });

  it('redacts every supported credential key', () => {
    const input = {
      token: 'a',
      access_token: 'a',
      refresh_token: 'a',
      id_token: 'a',
      code: 'a',
      apiKey: 'a',
      api_key: 'a',
      key: 'a',
      secret: 'a',
      clientSecret: 'a',
      client_secret: 'a',
      password: 'a',
      passwd: 'a',
      pwd: 'a',
      auth: 'a',
      authorization: 'a',
      credential: 'a',
      credentials: 'a',
      signature: 'a',
      sig: 'a',
      session_id: 'a',
    };
    const out = redactCredentials(input) as Record<string, unknown>;
    for (const k of Object.keys(input)) {
      expect(out[k]).toBe(REDACTED);
    }
  });

  it('walks arrays element-wise', () => {
    const input = [{ token: 'a' }, { ok: true }];
    const out = redactCredentials(input) as Array<Record<string, unknown>>;
    expect(out[0].token).toBe(REDACTED);
    expect(out[1].ok).toBe(true);
  });

  it('returns primitives unchanged', () => {
    expect(redactCredentials('string')).toBe('string');
    expect(redactCredentials(42)).toBe(42);
    expect(redactCredentials(true)).toBe(true);
    expect(redactCredentials(null)).toBe(null);
    expect(redactCredentials(undefined)).toBe(undefined);
  });

  it('does not clobber non-plain objects (Date, URL, RegExp)', () => {
    const d = new Date(0);
    const u = new URL('https://example.com');
    const r = /x/;
    expect(redactCredentials(d)).toBe(d);
    expect(redactCredentials(u)).toBe(u);
    expect(redactCredentials(r)).toBe(r);
  });

  it('does not mutate the input tree', () => {
    const input = { apiKey: 'SECRET', nested: { token: 'T' } };
    const snapshot = JSON.stringify(input);
    redactCredentials(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });

  it('redacts the realistic SAP AI Core service key shape', () => {
    // Mirrors the AICORE_SERVICE_KEY JSON blob — see src/cli/commands/debug/redact.ts.
    const input = {
      clientid: 'sb-123',
      clientsecret: 'MASTER-SECRET',
      url: 'https://auth.example.com/oauth/token',
      identityzone: 'tenant-a',
    };
    const out = redactCredentials(input) as Record<string, unknown>;
    expect(out.clientid).toBe('sb-123');
    expect(out.clientsecret).toBe(REDACTED);
    expect(out.url).toBe('https://auth.example.com/oauth/token');
    expect(out.identityzone).toBe('tenant-a');
  });
});
