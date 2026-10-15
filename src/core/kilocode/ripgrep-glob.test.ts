/**
 * Tests for `src/core/kilocode/ripgrep-glob.ts`.
 *
 * The glob/gitignore interaction is subtle; without tests this regresses
 * easily. Mirrors upstream kilocode's `ripgrep-glob.test.ts` by covering the
 * cases that previously silently included ignored paths:
 *   - `.gitignore` is respected for `**\/*` patterns.
 *   - `.env` / `secret/` are NOT returned.
 *   - Hidden files behave consistently with their matched/not-matched
 *     counterparts.
 *   - `--pre-glob` + `--type-add` are emitted for a bare filename pattern
 *     (used by the ripgrep argv for prefilter), and NOT for brace-expansion
 *     patterns that `--type-add` cannot represent.
 */

import { describe, it, expect } from 'vitest';
import { compile, glob, relative } from './ripgrep-glob.js';

describe('ripgrep-glob', () => {
  describe('compile', () => {
    it('matches a bare filename at any depth', () => {
      const matcher = compile('foo.ts');
      expect(matcher('foo.ts', false)).toBe(true);
      expect(matcher('src/foo.ts', false)).toBe(true);
      expect(matcher('a/b/c/foo.ts', false)).toBe(true);
      expect(matcher('bar.ts', false)).toBe(false);
    });

    it('matches a wildcard filename at any depth', () => {
      const matcher = compile('*.ts');
      expect(matcher('foo.ts', false)).toBe(true);
      expect(matcher('src/foo.ts', false)).toBe(true);
      expect(matcher('foo.js', false)).toBe(false);
    });

    it('anchors a slash-containing pattern to the cwd', () => {
      const matcher = compile('src/foo.ts');
      expect(matcher('src/foo.ts', false)).toBe(true);
      // Note: anchoring semantics — nested occurrences are NOT matched.
      expect(matcher('other/src/foo.ts', false)).toBe(false);
    });

    it('treats a trailing slash as folder-only', () => {
      const matcher = compile('build/');
      // Folders match the folder wildcard, files do NOT.
      expect(matcher('build', true)).toBe(true);
      expect(matcher('build/foo.ts', false)).toBe(false);
    });

    it('matches ** recursively', () => {
      const matcher = compile('src/**');
      expect(matcher('src/a.ts', false)).toBe(true);
      expect(matcher('src/a/b.ts', false)).toBe(true);
    });
  });

  describe('relative', () => {
    it('strips leading "./" on POSIX output', () => {
      expect(relative('./src/foo.ts')).toBe('src/foo.ts');
    });

    it('normalises Windows backslashes to forward slashes', () => {
      expect(relative('.\\src\\foo.ts')).toBe('src/foo.ts');
      expect(relative('src\\nested\\foo.ts')).toBe('src/nested/foo.ts');
    });

    it('drops a leading slash so paths stay cwd-relative', () => {
      expect(relative('/src/foo.ts')).toBe('src/foo.ts');
    });

    it('is idempotent', () => {
      expect(relative('src/foo.ts')).toBe('src/foo.ts');
    });
  });

  describe('glob (ripgrep argv assembly)', () => {
    it('emits --pre-glob and --type-add for a bare filename pattern', () => {
      const walk = glob({ pattern: '*.ts' });
      expect(walk.args).toContain('--pre-glob=*.ts');
      expect(walk.args).toContain('--type-add=kiloglob:*.ts');
    });

    it('does NOT emit the agent pattern as --glob= (that would override .gitignore)', () => {
      const walk = glob({ pattern: '**/*' });
      // The critical bugfix: `--glob=**/*` is NOT in the args. Overrides win
      // over .gitignore and would surface node_modules/, .env, secret/, etc.
      expect(walk.args).not.toContain('--glob=**/*');
      expect(walk.args).not.toContain('--glob=*.ts');
    });

    it('skips the file-type prefilter for brace-expansion patterns', () => {
      // `--type-add` can't represent `*.{ts,tsx}` the same way, so we fall
      // through to a pure in-process match (no args emitted).
      const walk = glob({ pattern: '*.{ts,tsx}' });
      expect(walk.args.filter((a) => a.startsWith('--type-add='))).toHaveLength(0);
      expect(walk.args.filter((a) => a.startsWith('--pre-glob='))).toHaveLength(0);
    });

    it('keep() drops paths that do not match the pattern', () => {
      const walk = glob({ pattern: '*.ts' });
      expect(walk.keep('src/foo.ts')).toBe(true);
      expect(walk.keep('src/foo.js')).toBe(false);
      expect(walk.keep(undefined)).toBe(false);
    });

    it('keep() respects anchored patterns (fix for #15003)', () => {
      // Even if ripgrep hands us a nested-but-ignored path, the in-process
      // matcher still refuses it when the pattern was anchored.
      const walk = glob({ pattern: 'src/foo.ts' });
      expect(walk.keep('src/foo.ts')).toBe(true);
      // other/src/foo.ts came from ripgrep walking an unignored sibling —
      // the anchored pattern must still reject it.
      expect(walk.keep('other/src/foo.ts')).toBe(false);
    });
  });

  describe('regression: ignored paths are not surfaced via override globs', () => {
    // These are the paths upstream #15003 proved were leaking. We cannot
    // actually run ripgrep inside a unit test, but we CAN prove that the
    // agent's pattern is applied in-process (via keep()) after ripgrep
    // would have surfaced them.
    it('drops .env when the pattern is a folder-only build/', () => {
      const walk = glob({ pattern: 'build/' });
      expect(walk.keep('.env')).toBe(false);
      expect(walk.keep('secret/private.key')).toBe(false);
    });

    it('matches hidden files only when the pattern names them', () => {
      // `.env` is hidden but matches when the pattern names it explicitly.
      const explicit = glob({ pattern: '.env' });
      expect(explicit.keep('.env')).toBe(true);
      // A generic `*.ts` must NOT match a hidden non-ts file.
      const generic = glob({ pattern: '*.ts' });
      expect(generic.keep('.env')).toBe(false);
    });
  });
});
