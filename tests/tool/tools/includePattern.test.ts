import { describe, it, expect } from 'vitest';

import { mergeIncludePattern, mergeExtensionSet } from '../../../src/tool/tools/includePattern.js';

describe('mergeIncludePattern', () => {
  it('returns include unchanged when extensions is empty', () => {
    expect(mergeIncludePattern('*.ts', [])).toBe('*.ts');
    expect(mergeIncludePattern(undefined, [])).toBeUndefined();
  });

  it('leaves undefined include untouched (additive semantics)', () => {
    // When no include filter is passed, additional extensions must NOT
    // narrow the search — the tool should keep searching all files.
    expect(mergeIncludePattern(undefined, ['.proto', '.graphql'])).toBeUndefined();
    expect(mergeIncludePattern('', ['.proto'])).toBe('');
  });

  it('extends a single-extension include with additional extensions', () => {
    expect(mergeIncludePattern('*.ts', ['.proto', '.graphql'])).toBe('*.{ts,proto,graphql}');
  });

  it('extends a braced include with additional extensions', () => {
    expect(mergeIncludePattern('*.{ts,tsx}', ['.proto'])).toBe('*.{ts,tsx,proto}');
  });

  it('dedupes overlapping extensions', () => {
    expect(mergeIncludePattern('*.ts', ['.ts', '.proto'])).toBe('*.{ts,proto}');
    expect(mergeIncludePattern('*.{ts,proto}', ['.proto', '.graphql'])).toBe(
      '*.{ts,proto,graphql}'
    );
  });

  it('accepts extensions without a leading dot', () => {
    expect(mergeIncludePattern('*.ts', ['proto', 'graphql'])).toBe('*.{ts,proto,graphql}');
  });

  it('normalizes casing consistently', () => {
    expect(mergeIncludePattern('*.TS', ['.Proto'])).toBe('*.{ts,proto}');
  });

  it('wraps an unrecognized pattern in an alternation', () => {
    // Non-extension shapes (exact filenames, path patterns) cannot safely
    // have alternates injected in-place; fall back to a top-level `{a,b}`
    // union that both rg --glob and the in-process matcher understand.
    expect(mergeIncludePattern('README.md', ['.proto'])).toBe('{README.md,*.proto}');
  });

  it('drops empty and whitespace entries', () => {
    expect(mergeIncludePattern('*.ts', ['', '   ', '.proto'])).toBe('*.{ts,proto}');
  });
});

describe('mergeExtensionSet', () => {
  it('returns a copy of the base set when extensions is empty', () => {
    const base = new Set(['.ts', '.js']);
    const merged = mergeExtensionSet(base, []);
    expect(merged).not.toBe(base);
    expect([...merged].sort()).toEqual(['.js', '.ts']);
  });

  it('adds new extensions with a leading dot', () => {
    const base = new Set(['.ts']);
    const merged = mergeExtensionSet(base, ['.proto', 'graphql']);
    expect(merged.has('.ts')).toBe(true);
    expect(merged.has('.proto')).toBe(true);
    expect(merged.has('.graphql')).toBe(true);
  });

  it('lower-cases everything', () => {
    const base = new Set(['.TS']);
    const merged = mergeExtensionSet(base, ['.PROTO']);
    expect(merged.has('.ts')).toBe(true);
    expect(merged.has('.proto')).toBe(true);
    expect(merged.has('.PROTO')).toBe(false);
  });

  it('does not duplicate existing extensions', () => {
    const base = new Set(['.proto']);
    const merged = mergeExtensionSet(base, ['.proto']);
    expect(merged.size).toBe(1);
  });
});
