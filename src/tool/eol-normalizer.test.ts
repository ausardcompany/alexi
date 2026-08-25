import { describe, it, expect } from 'vitest';
import {
  detectLineEnding,
  normalizeNewFileLineEndings,
  preserveExistingLineEndings,
  getPlatformEol,
} from './eol-normalizer.js';

describe('eol-normalizer', () => {
  describe('detectLineEnding', () => {
    it('returns CRLF when any \\r\\n sequence is present', () => {
      expect(detectLineEnding('a\r\nb\r\n')).toBe('\r\n');
    });

    it('returns LF for content with only \\n', () => {
      expect(detectLineEnding('a\nb\n')).toBe('\n');
    });

    it('returns LF for empty content', () => {
      expect(detectLineEnding('')).toBe('\n');
    });

    it('returns LF for content with no line endings at all', () => {
      expect(detectLineEnding('single line no ending')).toBe('\n');
    });

    it('prefers CRLF for mixed line ending files', () => {
      // If any CRLF is found we treat the whole file as CRLF.
      expect(detectLineEnding('a\nb\r\nc\n')).toBe('\r\n');
    });
  });

  describe('normalizeNewFileLineEndings', () => {
    it('rewrites LF content to CRLF when target is CRLF', () => {
      expect(normalizeNewFileLineEndings('a\nb\nc\n', '\r\n')).toBe('a\r\nb\r\nc\r\n');
    });

    it('leaves LF content untouched when target is LF', () => {
      expect(normalizeNewFileLineEndings('a\nb\nc\n', '\n')).toBe('a\nb\nc\n');
    });

    it('collapses pre-existing CRLF to LF before re-applying target EOL', () => {
      // Guard against double CR: input already has \r\n, target is \r\n.
      expect(normalizeNewFileLineEndings('a\r\nb\r\n', '\r\n')).toBe('a\r\nb\r\n');
    });

    it('converts CRLF input to LF when target is LF', () => {
      expect(normalizeNewFileLineEndings('a\r\nb\r\n', '\n')).toBe('a\nb\n');
    });

    it('is idempotent when re-applying the same target', () => {
      const once = normalizeNewFileLineEndings('a\nb\n', '\r\n');
      const twice = normalizeNewFileLineEndings(once, '\r\n');
      expect(twice).toBe(once);
    });

    it('defaults to the platform EOL when no target is given', () => {
      const expected = getPlatformEol();
      const result = normalizeNewFileLineEndings('a\nb\n');
      if (expected === '\r\n') {
        expect(result).toBe('a\r\nb\r\n');
      } else {
        expect(result).toBe('a\nb\n');
      }
    });
  });

  describe('preserveExistingLineEndings', () => {
    it('uses CRLF when the existing file is CRLF', () => {
      const out = preserveExistingLineEndings('new\ncontent\n', 'old\r\nfile\r\n');
      expect(out).toBe('new\r\ncontent\r\n');
    });

    it('uses LF when the existing file is LF', () => {
      const out = preserveExistingLineEndings('new\r\ncontent\r\n', 'old\nfile\n');
      expect(out).toBe('new\ncontent\n');
    });

    it('defaults to LF when the existing file has no line endings', () => {
      const out = preserveExistingLineEndings('new\ncontent\n', 'oldnoeol');
      expect(out).toBe('new\ncontent\n');
    });
  });

  describe('getPlatformEol', () => {
    it('returns either \\n or \\r\\n', () => {
      const eol = getPlatformEol();
      expect(eol === '\n' || eol === '\r\n').toBe(true);
    });
  });
});
