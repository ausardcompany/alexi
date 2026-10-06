/**
 * Tests for the MCP auth-failure classifier.
 *
 * Ports upstream kilocode `21ed2b9e` tests
 * (`packages/opencode/test/kilocode/mcp/auth-classification.test.ts` and
 * `auth-failure.test.ts`).
 */

import { describe, expect, it } from 'vitest';
import {
  classifyAuthFailure,
  extractHeader,
  extractHttpStatus,
  McpAuthError,
} from '../auth-failure.js';

describe('extractHttpStatus', () => {
  it('reads a top-level `status` number', () => {
    expect(extractHttpStatus({ status: 401 })).toBe(401);
  });

  it('reads `statusCode` as a fallback', () => {
    expect(extractHttpStatus({ statusCode: 403 })).toBe(403);
  });

  it('reads `response.status` for axios-shaped errors', () => {
    expect(extractHttpStatus({ response: { status: 401 } })).toBe(401);
  });

  it('reads `cause.status` for undici-shaped errors', () => {
    expect(extractHttpStatus({ cause: { status: 401 } })).toBe(401);
  });

  it('falls back to scanning the message for a 4xx code', () => {
    expect(extractHttpStatus(new Error('HTTP 403 forbidden'))).toBe(403);
  });

  it('returns undefined for non-objects and unrelated errors', () => {
    expect(extractHttpStatus(null)).toBeUndefined();
    expect(extractHttpStatus(undefined)).toBeUndefined();
    expect(extractHttpStatus('oops')).toBeUndefined();
    expect(extractHttpStatus(new Error('ECONNRESET'))).toBeUndefined();
  });
});

describe('extractHeader', () => {
  it('finds a case-insensitive match in a plain-object header bag', () => {
    const err = { headers: { 'WWW-Authenticate': 'Bearer realm="x"' } };
    expect(extractHeader(err, 'www-authenticate')).toBe('Bearer realm="x"');
    expect(extractHeader(err, 'WWW-Authenticate')).toBe('Bearer realm="x"');
  });

  it('finds a header via a Headers-like `.get` accessor', () => {
    const err = {
      response: {
        headers: {
          get: (name: string) => (name.toLowerCase() === 'www-authenticate' ? 'OAuth' : null),
        },
      },
    };
    expect(extractHeader(err, 'www-authenticate')).toBe('OAuth');
  });

  it('returns undefined when the header is absent', () => {
    expect(extractHeader({ headers: {} }, 'www-authenticate')).toBeUndefined();
    expect(extractHeader(null, 'x')).toBeUndefined();
    expect(extractHeader({}, 'x')).toBeUndefined();
  });
});

describe('classifyAuthFailure', () => {
  it('returns null for non-auth errors', () => {
    expect(classifyAuthFailure('srv', new Error('ECONNRESET'))).toBeNull();
    expect(classifyAuthFailure('srv', { status: 500 })).toBeNull();
    expect(classifyAuthFailure('srv', null)).toBeNull();
  });

  it('classifies 401 + WWW-Authenticate: Bearer as oauth-required', () => {
    const failure = classifyAuthFailure('github-mcp', {
      status: 401,
      headers: { 'www-authenticate': 'Bearer realm="github"' },
    });
    expect(failure).not.toBeNull();
    expect(failure?.kind).toBe('oauth-required');
    expect(failure?.serverId).toBe('github-mcp');
    expect(failure?.message).toContain('OAuth');
  });

  it('classifies 401 + WWW-Authenticate: OAuth as oauth-required', () => {
    const failure = classifyAuthFailure('srv', {
      status: 401,
      headers: { 'WWW-Authenticate': 'OAuth realm="x"' },
    });
    expect(failure?.kind).toBe('oauth-required');
  });

  it('classifies bare 401 as token-expired', () => {
    const failure = classifyAuthFailure('srv', { status: 401 });
    expect(failure?.kind).toBe('token-expired');
    expect(failure?.message).toContain('expired');
  });

  it('classifies 403 as forbidden', () => {
    const failure = classifyAuthFailure('srv', { status: 403 });
    expect(failure?.kind).toBe('forbidden');
    expect(failure?.message).toContain('403');
  });

  it('carries the original error through on `.cause`', () => {
    const original = new Error('unauth');
    (original as unknown as { status: number }).status = 401;
    const failure = classifyAuthFailure('srv', original);
    expect(failure?.cause).toBe(original);
  });

  it('reads status from message when object fields are absent', () => {
    const failure = classifyAuthFailure('srv', new Error('MCP server returned 403'));
    expect(failure?.kind).toBe('forbidden');
  });
});

describe('McpAuthError', () => {
  it('wraps a failure and preserves the message', () => {
    const failure = {
      kind: 'oauth-required' as const,
      serverId: 'srv',
      message: 'needs oauth',
    };
    const err = new McpAuthError(failure);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('McpAuthError');
    expect(err.message).toBe('needs oauth');
    expect(err.failure).toBe(failure);
  });
});
