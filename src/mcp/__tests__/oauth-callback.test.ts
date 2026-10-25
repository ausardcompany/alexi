/**
 * Tests for MCP OAuth authorization-URL hardening. We only exercise
 * the scheme allow-list here — actually spawning `xdg-open` in CI
 * would be flaky and platform-specific.
 */

import { describe, expect, it } from 'vitest';
import { assertHttpUrl, startMcpOAuth } from '../oauth-callback.js';

describe('assertHttpUrl', () => {
  it('accepts http and https URLs', () => {
    expect(assertHttpUrl('http://example.com', 'authorization_endpoint').href).toBe(
      'http://example.com/'
    );
    expect(
      assertHttpUrl('https://auth.example.com/oauth/authorize', 'authorization_endpoint').href
    ).toBe('https://auth.example.com/oauth/authorize');
  });

  it('rejects empty and non-URL inputs with field label', () => {
    expect(() => assertHttpUrl('', 'authorization_endpoint')).toThrow(/authorization_endpoint/);
    expect(() => assertHttpUrl('not a url', 'token_endpoint')).toThrow(/token_endpoint/);
  });

  it('rejects dangerous schemes with http/https hint', () => {
    for (const bad of [
      'file:///etc/hosts',
      'javascript:alert(1)',
      'ms-msdt:/id PCWDiagnostic',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
    ]) {
      expect(() => assertHttpUrl(bad, 'authorization_endpoint')).toThrow(
        /must use http or https/
      );
    }
  });

  it('rejects UNC-style paths', () => {
    expect(() => assertHttpUrl('\\\\server\\share\\file.html', 'authorization_endpoint')).toThrow(
      /must use http or https/
    );
    expect(() => assertHttpUrl('//server/share/file.html', 'authorization_endpoint')).toThrow(
      /must use http or https/
    );
  });
});

describe('startMcpOAuth', () => {
  it('rejects before spawning for non-http(s) URLs', async () => {
    await expect(startMcpOAuth('file:///etc/hosts')).rejects.toThrow(/http or https/);
    await expect(startMcpOAuth('javascript:alert(1)')).rejects.toThrow(/http or https/);
    await expect(startMcpOAuth('')).rejects.toThrow(/not a valid URL/);
  });

  it('surfaces the configured label in the error', async () => {
    await expect(
      startMcpOAuth('file:///etc/hosts', { label: 'authorization_endpoint' })
    ).rejects.toThrow(/authorization_endpoint/);
  });
});
