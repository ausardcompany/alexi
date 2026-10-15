/**
 * Tests for the ripgrep `{text}` / `{bytes}` normaliser.
 *
 * Guards upstream kilocode `0e6da3104` / `31906a56b` — invalid-UTF-8
 * matches must be decoded as lossy UTF-8 so operators grepping a
 * repository with Latin-1 files still see the match (with U+FFFD) rather
 * than it being silently dropped.
 */

import { describe, it, expect } from 'vitest';
import { extractText } from './ripgrep-grep.js';

describe('extractText', () => {
  it('returns `{text}` verbatim for ASCII content', () => {
    expect(extractText({ text: 'hello world' })).toBe('hello world');
  });

  it('passes through UTF-8 content with multi-byte characters', () => {
    expect(extractText({ text: 'café — 日本語' })).toBe('café — 日本語');
  });

  it('base64-decodes `{bytes}` as UTF-8 for valid payloads', () => {
    const encoded = Buffer.from('hello', 'utf-8').toString('base64');
    expect(extractText({ bytes: encoded })).toBe('hello');
  });

  it('decodes invalid-UTF-8 `{bytes}` using lossy replacement (U+FFFD)', () => {
    // 0xFF 0xFE is not a valid UTF-8 sequence; Node's `toString('utf8')`
    // replaces each invalid byte with U+FFFD.
    const encoded = Buffer.from([0xff, 0xfe, 0x41]).toString('base64');
    const decoded = extractText({ bytes: encoded })!;
    expect(decoded.includes('A')).toBe(true);
    expect(decoded.includes('\uFFFD')).toBe(true);
  });

  it('returns undefined for malformed inputs', () => {
    expect(extractText(null)).toBeUndefined();
    expect(extractText(undefined)).toBeUndefined();
    expect(extractText({})).toBeUndefined();
  });
});
