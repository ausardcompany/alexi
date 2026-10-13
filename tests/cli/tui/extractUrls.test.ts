import { describe, it, expect } from 'vitest';
import {
  extractUrlsFromText,
  extractUrlsFromMessages,
  type TranscriptEntry,
} from '../../../src/cli/tui/utils/extractUrls.js';

describe('extractUrlsFromText', () => {
  it('returns [] for empty input', () => {
    expect(extractUrlsFromText('')).toEqual([]);
  });

  it('returns [] for text with no URLs', () => {
    expect(extractUrlsFromText('hello world no links here')).toEqual([]);
  });

  it('extracts a bare https URL', () => {
    expect(extractUrlsFromText('see https://example.com for details')).toEqual([
      'https://example.com',
    ]);
  });

  it('extracts a bare http URL', () => {
    expect(extractUrlsFromText('visit http://foo.test/path')).toEqual(['http://foo.test/path']);
  });

  it('strips trailing sentence punctuation', () => {
    expect(extractUrlsFromText('check https://example.com.')).toEqual(['https://example.com']);
    expect(extractUrlsFromText('see https://a.test/path, and more')).toEqual([
      'https://a.test/path',
    ]);
    expect(extractUrlsFromText('(https://a.test/x)')).toEqual(['https://a.test/x']);
  });

  it('unwraps markdown inline links', () => {
    expect(extractUrlsFromText('[docs](https://docs.example.com/guide)')).toEqual([
      'https://docs.example.com/guide',
    ]);
  });

  it('unwraps markdown autolinks', () => {
    expect(extractUrlsFromText('see <https://autolink.test/x>')).toEqual([
      'https://autolink.test/x',
    ]);
  });

  it('does not double-count a URL inside a markdown link', () => {
    const text = 'before [name](https://x.test/a) after';
    expect(extractUrlsFromText(text)).toEqual(['https://x.test/a']);
  });

  it('extracts multiple URLs in visual (left-to-right) order', () => {
    const text = 'first https://one.test then [two](https://two.test/x) finally https://three.test';
    expect(extractUrlsFromText(text)).toEqual([
      'https://one.test',
      'https://two.test/x',
      'https://three.test',
    ]);
  });

  it('ignores non-http(s) schemes', () => {
    const text = 'try ftp://nope.test or file:///etc/passwd or javascript:alert(1)';
    expect(extractUrlsFromText(text)).toEqual([]);
  });

  it('handles multiline content', () => {
    const text = ['line 1 https://a.test', 'line 2 https://b.test', 'line 3'].join('\n');
    expect(extractUrlsFromText(text)).toEqual(['https://a.test', 'https://b.test']);
  });

  it('is defensive against non-string input', () => {
    // @ts-expect-error — intentionally wrong type to exercise guard
    expect(extractUrlsFromText(null)).toEqual([]);
    // @ts-expect-error — intentionally wrong type to exercise guard
    expect(extractUrlsFromText(42)).toEqual([]);
  });
});

describe('extractUrlsFromMessages', () => {
  const user: TranscriptEntry = { role: 'user', content: 'look at https://user.test' };
  const assistant1: TranscriptEntry = {
    role: 'assistant',
    content: 'docs: https://one.test and [tutorial](https://two.test/guide)',
  };
  const assistant2: TranscriptEntry = {
    role: 'assistant',
    content: 'also https://three.test',
  };
  const assistantDupe: TranscriptEntry = {
    role: 'assistant',
    content: 'repeating https://one.test again',
  };
  const hidden: TranscriptEntry = {
    role: 'assistant',
    displayRole: 'system',
    content: 'should be ignored https://hidden.test',
  };

  it('returns [] for an empty transcript', () => {
    expect(extractUrlsFromMessages([])).toEqual([]);
  });

  it('ignores user messages', () => {
    expect(extractUrlsFromMessages([user])).toEqual([]);
  });

  it('collects URLs from assistant messages in order', () => {
    expect(extractUrlsFromMessages([user, assistant1, assistant2])).toEqual([
      'https://one.test',
      'https://two.test/guide',
      'https://three.test',
    ]);
  });

  it('de-duplicates URLs while preserving first-seen order', () => {
    expect(extractUrlsFromMessages([assistant1, assistantDupe, assistant2])).toEqual([
      'https://one.test',
      'https://two.test/guide',
      'https://three.test',
    ]);
  });

  it('ignores messages flagged as displayRole: system', () => {
    expect(extractUrlsFromMessages([hidden, assistant1])).toEqual([
      'https://one.test',
      'https://two.test/guide',
    ]);
  });
});
