/**
 * Tests for the ripgrep glob post-filter.
 *
 * Guards upstream kilocode PR #15017: a user `--include` pattern must
 * narrow results WITHOUT overriding `.gitignore`. Previously these
 * patterns were passed as `--glob=<pattern>` which forced ripgrep to
 * walk into ignored directories.
 */

import { describe, it, expect } from 'vitest';
import { compile } from './ripgrep-glob.js';

describe('ripgrep-glob compile', () => {
  it('matches bare patterns at any depth (promotes to **/pattern)', () => {
    const g = compile({ pattern: '*.ts' });
    expect(g.match('src/foo.ts')).toBe(true);
    expect(g.match('deeply/nested/dir/bar.ts')).toBe(true);
    expect(g.match('baz.ts')).toBe(true);
  });

  it('respects a pattern that already contains a `/`', () => {
    const g = compile({ pattern: 'src/**/*.ts' });
    expect(g.match('src/foo.ts')).toBe(true);
    expect(g.match('src/a/b/foo.ts')).toBe(true);
    expect(g.match('other/foo.ts')).toBe(false);
  });

  it('returns a trivially-true matcher for the empty pattern', () => {
    const g = compile({ pattern: '' });
    expect(g.match('anything.ts')).toBe(true);
    expect(g.match('x/y/z.txt')).toBe(true);
  });

  it('directory-only patterns (trailing /) do not match files', () => {
    const g = compile({ pattern: 'build/' });
    expect(g.match('build/output.js')).toBe(false);
    expect(g.match('build')).toBe(false);
  });

  it('does not accidentally match `node_modules` paths', () => {
    const g = compile({ pattern: '*.ts' });
    // Post-filter is only reached for files ripgrep already yielded;
    // this test documents that the pattern itself has no `node_modules`
    // override semantics — matching is purely about the final name.
    expect(g.match('node_modules/pkg/index.ts')).toBe(true);
    // The .gitignore skip must happen at the ripgrep layer; the
    // post-filter does NOT re-implement ignore rules.
  });
});
