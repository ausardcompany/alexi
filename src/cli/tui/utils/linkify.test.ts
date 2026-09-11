/**
 * Tests for {@link linkify}.
 *
 * We force `FORCE_HYPERLINK=1` so `hyperlink()` always emits the OSC-8
 * escape sequence; that lets us assert on the wrapped bytes deterministically
 * regardless of the CI environment.
 */

import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { linkify } from './linkify.js';

const OSC = '\u001B]';
const ST = '\u001B\\';

/** Build the OSC-8 wrapped form for `url` with `label`. */
function wrap(url: string, label: string = url): string {
  return `${OSC}8;;${url}${ST}${label}${OSC}8;;${ST}`;
}

describe('linkify', () => {
  beforeEach(() => {
    vi.stubEnv('FORCE_HYPERLINK', '1');
    vi.stubEnv('NO_HYPERLINK', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('URL detection', () => {
    it('wraps a bare https URL', () => {
      const out = linkify('See https://example.com for docs.');
      expect(out).toBe(`See ${wrap('https://example.com')} for docs.`);
    });

    it('wraps http URLs too', () => {
      const out = linkify('http://example.com');
      expect(out).toBe(wrap('http://example.com'));
    });

    it('wraps file:// URLs', () => {
      const out = linkify('file:///etc/passwd');
      expect(out).toBe(wrap('file:///etc/passwd'));
    });

    it('strips trailing sentence punctuation from URL', () => {
      // The trailing period should remain in the plain-text portion, not
      // inside the hyperlink target — otherwise clicking sends the user
      // to `https://example.com.` which typically 404s.
      const out = linkify('Visit https://example.com.');
      expect(out).toBe(`Visit ${wrap('https://example.com')}.`);
    });

    it('handles multiple URLs on one line', () => {
      const out = linkify('a https://a.example b https://b.example');
      expect(out).toBe(`a ${wrap('https://a.example')} b ${wrap('https://b.example')}`);
    });

    it('preserves URLs across multiple lines', () => {
      const out = linkify('line1\nhttps://x.example\nline3');
      expect(out).toBe(`line1\n${wrap('https://x.example')}\nline3`);
    });
  });

  describe('file:line detection', () => {
    it('wraps a relative file path with line number', () => {
      const cwd = '/tmp/proj';
      const out = linkify('at src/foo.ts:42 something', cwd);
      const uri = `file://${path.resolve(cwd, 'src/foo.ts')}#42`;
      expect(out).toBe(`at ${wrap(uri, 'src/foo.ts:42')} something`);
    });

    it('wraps a relative file path with line and column', () => {
      const cwd = '/tmp/proj';
      const out = linkify('src/foo.ts:12:5', cwd);
      const uri = `file://${path.resolve(cwd, 'src/foo.ts')}#12:5`;
      expect(out).toBe(wrap(uri, 'src/foo.ts:12:5'));
    });

    it('wraps an absolute file path', () => {
      const out = linkify('at /home/x/y.tsx:10 !', '/tmp');
      const uri = 'file:///home/x/y.tsx#10';
      expect(out).toBe(`at ${wrap(uri, '/home/x/y.tsx:10')} !`);
    });

    it('wraps a dot-slash relative path', () => {
      const cwd = '/tmp/proj';
      const out = linkify('at ./foo/bar.ts:3', cwd);
      const uri = `file://${path.resolve(cwd, './foo/bar.ts')}#3`;
      expect(out).toBe(`at ${wrap(uri, './foo/bar.ts:3')}`);
    });
  });

  describe('false positives', () => {
    it('does NOT linkify a bare timestamp `12:34`', () => {
      expect(linkify('at 12:34 the job ran')).toBe('at 12:34 the job ran');
    });

    it('does NOT linkify `localhost:3000` (no path or extension)', () => {
      expect(linkify('server on localhost:3000')).toBe('server on localhost:3000');
    });

    it('does NOT linkify `key: value` shaped strings', () => {
      expect(linkify('token: 12345')).toBe('token: 12345');
    });

    it('does NOT linkify a version like `1.2.3` on its own', () => {
      expect(linkify('version 1.2.3 released')).toBe('version 1.2.3 released');
    });
  });

  describe('URL / file:line interaction', () => {
    it('does not double-wrap `path.ts:42` inside a URL', () => {
      const url = 'https://example.com/foo/bar.ts:42';
      const out = linkify(`see ${url}`);
      // Whole URL wrapped exactly once; no secondary file:line match.
      expect(out).toBe(`see ${wrap(url)}`);
    });

    it('handles URL followed by unrelated file:line reference', () => {
      const cwd = '/tmp/proj';
      const uri = `file://${path.resolve(cwd, 'src/x.ts')}#1`;
      const out = linkify('https://example.com and src/x.ts:1', cwd);
      expect(out).toBe(`${wrap('https://example.com')} and ${wrap(uri, 'src/x.ts:1')}`);
    });
  });

  describe('degenerate input', () => {
    it('returns empty string unchanged', () => {
      expect(linkify('')).toBe('');
    });

    it('returns plain text unchanged when nothing matches', () => {
      const text = 'hello world, nothing to see here';
      expect(linkify(text)).toBe(text);
    });
  });

  describe('when terminal does NOT support hyperlinks', () => {
    it('returns byte-identical text (URL is plain)', () => {
      vi.stubEnv('FORCE_HYPERLINK', '');
      vi.stubEnv('NO_HYPERLINK', '1');
      const input = 'see https://example.com and src/foo.ts:42';
      // hyperlink() falls back to plain text, so linkify() is a no-op.
      // (For file:line, the fallback is `label (url)` because label !== url,
      // so we only check the URL case here to keep the assertion clean.)
      expect(linkify('see https://example.com')).toBe('see https://example.com');
      // For completeness assert the file:line variant surfaces label + uri
      // form via the fallback.
      expect(linkify(input)).toContain('https://example.com');
      expect(linkify(input)).toContain('src/foo.ts:42');
    });
  });
});
