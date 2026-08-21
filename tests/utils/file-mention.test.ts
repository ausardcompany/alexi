import { describe, it, expect } from 'vitest';
import { toPosixPath, quoteFilePath, formatFileMention } from '../../src/utils/file-mention.js';

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
