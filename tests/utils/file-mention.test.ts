import { describe, it, expect } from 'vitest';
import {
  toPosixPath,
  quoteFilePath,
  formatFileMention,
  parseFileMentions,
} from '../../src/utils/file-mention.js';

describe('toPosixPath', () => {
  it('replaces backslashes with forward slashes', () => {
    expect(toPosixPath('C:\\Program Files\\app\\file.ts')).toBe('C:/Program Files/app/file.ts');
  });

  it('leaves POSIX paths unchanged', () => {
    expect(toPosixPath('/home/user/file.ts')).toBe('/home/user/file.ts');
  });

  it('leaves relative POSIX paths unchanged', () => {
    expect(toPosixPath('src/core/router.ts')).toBe('src/core/router.ts');
  });

  it('handles empty string', () => {
    expect(toPosixPath('')).toBe('');
  });

  it('handles mixed separators', () => {
    expect(toPosixPath('src\\core/router.ts')).toBe('src/core/router.ts');
  });
});

describe('quoteFilePath', () => {
  it('wraps Windows path with spaces in quotes and normalizes separators', () => {
    expect(quoteFilePath('C:\\Program Files\\app\\file.ts')).toBe('"C:/Program Files/app/file.ts"');
  });

  it('wraps Unix path with spaces in quotes', () => {
    expect(quoteFilePath('/home/user/My Documents/file.ts')).toBe(
      '"/home/user/My Documents/file.ts"'
    );
  });

  it('does not quote path without spaces or special chars', () => {
    expect(quoteFilePath('src/core/router.ts')).toBe('src/core/router.ts');
  });

  it('does not quote absolute POSIX path without spaces', () => {
    expect(quoteFilePath('/usr/local/bin/node')).toBe('/usr/local/bin/node');
  });

  it('normalizes Windows path without spaces (no quotes needed)', () => {
    expect(quoteFilePath('C:\\Users\\alexi\\file.ts')).toBe('C:/Users/alexi/file.ts');
  });

  it('quotes paths containing shell metacharacters', () => {
    expect(quoteFilePath('src/foo(bar).ts')).toBe('"src/foo(bar).ts"');
  });

  it('escapes embedded double quotes', () => {
    expect(quoteFilePath('weird "name".ts')).toBe('"weird \\"name\\".ts"');
  });

  it('handles empty string', () => {
    expect(quoteFilePath('')).toBe('');
  });

  it('quotes paths with tabs', () => {
    expect(quoteFilePath('src/tab\there.ts')).toBe('"src/tab\there.ts"');
  });
});

describe('formatFileMention', () => {
  it('appends line to a plain path without quoting', () => {
    expect(formatFileMention('src/core/router.ts', 42)).toBe('src/core/router.ts:42');
  });

  it('appends line and column to a plain path', () => {
    expect(formatFileMention('src/core/router.ts', 42, 7)).toBe('src/core/router.ts:42:7');
  });

  it('wraps path with spaces including line suffix', () => {
    expect(formatFileMention('/home/user/My Documents/file.ts', 10)).toBe(
      '"/home/user/My Documents/file.ts:10"'
    );
  });

  it('normalizes Windows separators and wraps if needed', () => {
    expect(formatFileMention('C:\\Program Files\\app.ts', 5, 3)).toBe(
      '"C:/Program Files/app.ts:5:3"'
    );
  });

  it('omits suffix when line is undefined', () => {
    expect(formatFileMention('src/core/router.ts')).toBe('src/core/router.ts');
  });

  it('omits column when line is provided but column is not', () => {
    expect(formatFileMention('src/foo.ts', 3)).toBe('src/foo.ts:3');
  });
});

describe('parseFileMentions', () => {
  it('parses a single bareword mention', () => {
    const out = parseFileMentions('see @src/foo.ts for details');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ fullMatch: '@src/foo.ts', path: 'src/foo.ts', index: 4 });
  });

  it('parses a double-quoted mention with spaces', () => {
    const out = parseFileMentions('open @"My Documents/report.txt" now');
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      fullMatch: '@"My Documents/report.txt"',
      path: 'My Documents/report.txt',
    });
  });

  it('parses a single-quoted mention with parentheses', () => {
    const out = parseFileMentions("look at @'archive (2)/notes.md' please");
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      fullMatch: "@'archive (2)/notes.md'",
      path: 'archive (2)/notes.md',
    });
  });

  it('honours escape sequences inside quoted paths', () => {
    const out = parseFileMentions('read @"file \\"draft\\".txt" here');
    expect(out).toHaveLength(1);
    expect(out[0].path).toBe('file "draft".txt');
  });

  it('parses multiple mixed mentions in order', () => {
    const out = parseFileMentions('a @src/a.ts and @"b b/c.ts" then @d.md');
    expect(out.map((m) => m.path)).toEqual(['src/a.ts', 'b b/c.ts', 'd.md']);
  });

  it('does not match an email address', () => {
    const out = parseFileMentions('mail me at user@example.com');
    expect(out).toEqual([]);
  });

  it('does not match @ preceded by a word character', () => {
    const out = parseFileMentions('foo@bar/baz.ts');
    expect(out).toEqual([]);
  });

  it('matches @ at the start of the string', () => {
    const out = parseFileMentions('@src/foo.ts is the file');
    expect(out).toHaveLength(1);
    expect(out[0].path).toBe('src/foo.ts');
  });

  it('skips @$N placeholders (positional variable form)', () => {
    // These should be expanded by an earlier pass; the parser must not
    // treat them as literal file mentions.
    const out = parseFileMentions('review @$1 please');
    expect(out).toEqual([]);
  });

  it('skips unterminated quoted mentions', () => {
    const out = parseFileMentions('open @"missing close and more');
    expect(out).toEqual([]);
  });

  it('returns [] for empty or non-string input', () => {
    expect(parseFileMentions('')).toEqual([]);
    // @ts-expect-error - testing runtime robustness for a non-string value.
    expect(parseFileMentions(undefined)).toEqual([]);
  });

  it('handles a Windows-style path with spaces inside quotes', () => {
    const out = parseFileMentions('doc @"C:/Program Files/app/config.json" now');
    expect(out).toHaveLength(1);
    expect(out[0].path).toBe('C:/Program Files/app/config.json');
  });
});
