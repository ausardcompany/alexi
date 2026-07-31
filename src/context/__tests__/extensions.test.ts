/**
 * Tests for the shared file-extension helper.
 */

import { describe, it, expect } from 'vitest';
import {
  getExtension,
  getLanguageForFile,
  isSourceFile,
  TYPESCRIPT_EXTENSIONS,
  JAVASCRIPT_EXTENSIONS,
  JSON_EXTENSIONS,
  BASH_EXTENSIONS,
  PYTHON_EXTENSIONS,
  SOURCE_EXTENSIONS,
} from '../extensions.js';

describe('getExtension', () => {
  it('returns lower-cased extension including the dot', () => {
    expect(getExtension('foo.TS')).toBe('.ts');
    expect(getExtension('foo.Jsx')).toBe('.jsx');
  });

  it('preserves .d.ts declarations verbatim instead of collapsing to .ts', () => {
    expect(getExtension('types.d.ts')).toBe('.d.ts');
    expect(getExtension('src/foo.d.ts')).toBe('.d.ts');
  });

  it('returns empty string for files with no extension', () => {
    expect(getExtension('Makefile')).toBe('');
    expect(getExtension('LICENSE')).toBe('');
  });

  it('handles nested paths', () => {
    expect(getExtension('src/context/extensions.ts')).toBe('.ts');
    expect(getExtension('src/component.tsx')).toBe('.tsx');
  });

  it('recognises .mjs, .cjs, .mts, .cts, .jsonc variants', () => {
    expect(getExtension('mod.mjs')).toBe('.mjs');
    expect(getExtension('mod.cjs')).toBe('.cjs');
    expect(getExtension('mod.mts')).toBe('.mts');
    expect(getExtension('mod.cts')).toBe('.cts');
    expect(getExtension('tsconfig.jsonc')).toBe('.jsonc');
  });
});

describe('getLanguageForFile', () => {
  it('classifies TypeScript variants', () => {
    for (const p of ['a.ts', 'a.tsx', 'a.mts', 'a.cts', 'a.d.ts']) {
      expect(getLanguageForFile(p)).toBe('typescript');
    }
  });

  it('classifies JavaScript variants', () => {
    for (const p of ['a.js', 'a.jsx', 'a.mjs', 'a.cjs']) {
      expect(getLanguageForFile(p)).toBe('javascript');
    }
  });

  it('classifies JSON variants (including .jsonc)', () => {
    expect(getLanguageForFile('package.json')).toBe('json');
    expect(getLanguageForFile('tsconfig.jsonc')).toBe('json');
  });

  it('classifies Python and Bash', () => {
    expect(getLanguageForFile('script.py')).toBe('python');
    expect(getLanguageForFile('run.sh')).toBe('bash');
    expect(getLanguageForFile('helpers.bash')).toBe('bash');
    expect(getLanguageForFile('setup.zsh')).toBe('bash');
  });

  it('returns unknown for unrecognised or extensionless files', () => {
    expect(getLanguageForFile('Makefile')).toBe('unknown');
    expect(getLanguageForFile('README.md')).toBe('unknown');
    expect(getLanguageForFile('main.rs')).toBe('unknown');
  });
});

describe('isSourceFile', () => {
  it('is true for every extension in SOURCE_EXTENSIONS', () => {
    for (const ext of SOURCE_EXTENSIONS) {
      expect(isSourceFile(`foo${ext}`)).toBe(true);
    }
  });

  it('is false for unknown extensions', () => {
    expect(isSourceFile('foo.md')).toBe(false);
    expect(isSourceFile('foo.txt')).toBe(false);
    expect(isSourceFile('Makefile')).toBe(false);
  });
});

describe('exported extension sets', () => {
  it('are disjoint across language buckets', () => {
    const buckets: ReadonlySet<string>[] = [
      TYPESCRIPT_EXTENSIONS,
      JAVASCRIPT_EXTENSIONS,
      JSON_EXTENSIONS,
      PYTHON_EXTENSIONS,
      BASH_EXTENSIONS,
    ];
    for (let i = 0; i < buckets.length; i++) {
      for (let j = i + 1; j < buckets.length; j++) {
        for (const ext of buckets[i]) {
          expect(buckets[j].has(ext)).toBe(false);
        }
      }
    }
  });

  it('SOURCE_EXTENSIONS is the union of the individual buckets', () => {
    const union = new Set<string>([
      ...TYPESCRIPT_EXTENSIONS,
      ...JAVASCRIPT_EXTENSIONS,
      ...JSON_EXTENSIONS,
      ...PYTHON_EXTENSIONS,
      ...BASH_EXTENSIONS,
    ]);
    expect(SOURCE_EXTENSIONS.size).toBe(union.size);
    for (const ext of union) {
      expect(SOURCE_EXTENSIONS.has(ext)).toBe(true);
    }
  });
});
