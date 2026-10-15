/**
 * Tests for bash tree-sitter tag extraction.
 *
 * These tests exercise the four tag categories we surface for repomap /
 * context extraction: function definitions, for loops, while loops, and
 * case statements. They mirror the tag categories Aider added for
 * shell-script support.
 */

import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import {
  extractBashTags,
  extractTopLevelBashTags,
  extractBashTagsFromRoot,
  isBashSupported,
  bashTagName,
  type BashTag,
} from '../bashTags.js';
import { parseSource } from '../treeSitter.js';

// tree-sitter-bash is an optional peer dependency — skip grammar-dependent
// suites when it is not installed (matches the pattern used by the other
// context tests, see #1154).
const nodeRequire = createRequire(import.meta.url);
function hasBashGrammar(): boolean {
  for (const pkg of ['tree-sitter', 'tree-sitter-bash']) {
    try {
      nodeRequire.resolve(pkg);
    } catch {
      return false;
    }
  }
  return true;
}
const bashInstalled = hasBashGrammar();
const describeIfBash = bashInstalled ? describe : describe.skip;

function kinds(tags: BashTag[]): string[] {
  return tags.map((t) => t.kind);
}

function names(tags: BashTag[]): string[] {
  return tags.map((t) => t.name);
}

describe('isBashSupported', () => {
  it('returns true for .sh / .bash / .zsh files', () => {
    expect(isBashSupported('deploy.sh')).toBe(true);
    expect(isBashSupported('helpers.bash')).toBe(true);
    expect(isBashSupported('zsh/plugin.zsh')).toBe(true);
  });

  it('returns false for non-bash files', () => {
    expect(isBashSupported('script.py')).toBe(false);
    expect(isBashSupported('index.ts')).toBe(false);
    expect(isBashSupported('README.md')).toBe(false);
    expect(isBashSupported('Makefile')).toBe(false);
  });
});

describe('extractBashTags (unsupported inputs)', () => {
  it('returns an empty array for non-bash paths without touching the parser', () => {
    expect(extractBashTags('x = 1', 'file.py')).toEqual([]);
    expect(extractBashTags('const x = 1;', 'file.ts')).toEqual([]);
  });
});

describeIfBash('extractBashTags', () => {
  it('extracts a POSIX function definition', () => {
    const src = 'greet() {\n  echo "hi"\n}';
    const tags = extractBashTags(src, 'script.sh');
    const fn = tags.find((t) => t.kind === 'function');
    expect(fn).toBeDefined();
    expect(fn!.name).toBe('greet');
    expect(fn!.line).toBe(1);
    expect(fn!.column).toBe(1);
    expect(fn!.parentType).toBe('program');
    expect(fn!.text.startsWith('greet()')).toBe(true);
  });

  it('extracts a Bash keyword-style function definition', () => {
    const src = 'function farewell {\n  echo bye\n}';
    const tags = extractBashTags(src, 'script.sh');
    const fn = tags.find((t) => t.kind === 'function');
    expect(fn).toBeDefined();
    expect(fn!.name).toBe('farewell');
  });

  it('extracts a for loop', () => {
    const src = 'for i in 1 2 3; do\n  echo "$i"\ndone';
    const tags = extractBashTags(src, 'script.sh');
    const loop = tags.find((t) => t.kind === 'for');
    expect(loop).toBeDefined();
    expect(loop!.name).toBe('i');
    expect(loop!.line).toBe(1);
    expect(loop!.text).toMatch(/^for\s+i\s+in\b/);
  });

  it('extracts a while loop with a positional fallback name', () => {
    const src = 'i=0\nwhile [ "$i" -lt 3 ]; do\n  i=$((i+1))\ndone';
    const tags = extractBashTags(src, 'script.sh');
    const loop = tags.find((t) => t.kind === 'while');
    expect(loop).toBeDefined();
    expect(loop!.name).toBe('while@L2');
    expect(loop!.line).toBe(2);
    expect(loop!.text.startsWith('while')).toBe(true);
  });

  it('extracts a case statement with the scrutinee as the name', () => {
    const src = [
      'case "$1" in',
      '  start) echo "Starting" ;;',
      '  stop) echo "Stopping" ;;',
      'esac',
    ].join('\n');
    const tags = extractBashTags(src, 'script.sh');
    const stmt = tags.find((t) => t.kind === 'case');
    expect(stmt).toBeDefined();
    expect(stmt!.name).toBe('"$1"');
    expect(stmt!.line).toBe(1);
    expect(stmt!.text.startsWith('case')).toBe(true);
  });

  it('surfaces all four tag categories from a mixed script', () => {
    const src = [
      '#!/bin/bash',
      'function greet() {',
      '  echo "Hello"',
      '}',
      'for i in 1 2 3; do',
      '  echo "$i"',
      'done',
      'while read line; do',
      '  echo "$line"',
      'done < input.txt',
      'case "$1" in',
      '  start) echo start ;;',
      '  stop) echo stop ;;',
      'esac',
    ].join('\n');
    const tags = extractBashTags(src, 'mixed.sh');
    expect(kinds(tags)).toEqual(expect.arrayContaining(['function', 'for', 'while', 'case']));
    // The function must come first (program order).
    const first = tags[0];
    expect(first.kind).toBe('function');
    expect(first.name).toBe('greet');
  });

  it('reports tags in source order (sorted by line/column)', () => {
    const src = [
      'for i in 1 2; do echo "$i"; done',
      'function a() { echo a; }',
      'while true; do break; done',
      'case $x in y) ;; esac',
    ].join('\n');
    const tags = extractBashTags(src, 'order.sh');
    expect(kinds(tags)).toEqual(['for', 'function', 'while', 'case']);
  });

  it('returns tags for constructs nested inside a function', () => {
    const src = [
      'deploy() {',
      '  for host in "$@"; do',
      '    echo "deploying to $host"',
      '  done',
      '}',
    ].join('\n');
    const tags = extractBashTags(src, 'deploy.sh');
    const forTag = tags.find((t) => t.kind === 'for');
    expect(forTag).toBeDefined();
    // The for loop is nested inside the function body, so its parent is
    // not the program root.
    expect(forTag!.parentType).not.toBe('program');
  });
});

describeIfBash('extractTopLevelBashTags', () => {
  it('drops tags whose parent is not the program root', () => {
    const src = [
      'deploy() {',
      '  for host in "$@"; do',
      '    echo "$host"',
      '  done',
      '}',
      'for env in dev prod; do',
      '  deploy "$env"',
      'done',
    ].join('\n');
    const topLevel = extractTopLevelBashTags(src, 'deploy.sh');
    // Must contain the deploy function and the outer for loop,
    // but must NOT contain the inner for loop.
    expect(names(topLevel)).toEqual(expect.arrayContaining(['deploy', 'env']));
    const forTags = topLevel.filter((t) => t.kind === 'for');
    expect(forTags).toHaveLength(1);
    expect(forTags[0].name).toBe('env');
  });

  it('returns an empty array when the file has no bash tags', () => {
    const src = 'echo hello\nls -la\n';
    expect(extractTopLevelBashTags(src, 'script.sh')).toEqual([]);
  });
});

describeIfBash('extractBashTagsFromRoot', () => {
  it('matches extractBashTags when given the same source', () => {
    const src = 'foo() { echo hi; }\nfor x in a b; do echo "$x"; done';
    const viaSource = extractBashTags(src, 'script.sh');
    const root = parseSource(src, 'script.sh');
    expect(root).not.toBeNull();
    const viaRoot = extractBashTagsFromRoot(root!);
    expect(viaRoot).toEqual(viaSource);
  });
});

describeIfBash('bashTagName fallbacks', () => {
  it('uses the function node name when present', () => {
    const src = 'alpha() { echo a; }';
    const root = parseSource(src, 'script.sh')!;
    const fn = root.child(0)!;
    expect(bashTagName('function', fn)).toBe('alpha');
  });

  it('uses a positional fallback for while loops regardless of grammar fields', () => {
    const src = 'while true; do break; done';
    const root = parseSource(src, 'script.sh')!;
    const loop = root.child(0)!;
    expect(bashTagName('while', loop)).toBe('while@L1');
  });
});
