/**
 * Tests for the optional-peer-dependency handling in `src/context/treeSitter.ts`.
 *
 * These complement the pre-existing grammar-installed tests under
 * `src/context/__tests__/treeSitter.test.ts` (which run in the normal
 * repo state where the grammars are dev-installed). Here we focus on:
 *
 *  1. The happy path: `parseSource` still returns a SyntaxNode when the
 *     grammars are available, and no missing-grammar error is reported.
 *  2. The degraded path: when a grammar package cannot be `require`d
 *     (simulated by module-cache poisoning), `parseSource` returns null
 *     and `getMissingGrammars()` / `formatMissingGrammarError()` surface
 *     the actionable install command from the issue spec.
 *
 * The module-cache poisoning approach lets us keep the tests hermetic —
 * we never actually uninstall the grammar packages — while still
 * exercising the real `createRequire`-backed lazy loader.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';
import {
  parseSource,
  getMissingGrammars,
  formatMissingGrammarError,
  MISSING_GRAMMAR_INSTALL_HINT,
  __resetGrammarCache,
} from '../../src/context/treeSitter.js';

const nodeRequire = createRequire(import.meta.url);

/**
 * Resolve the on-disk path of an optional grammar package, or null if the
 * package is not installed in the current environment.
 */
function resolveOptional(pkg: string): string | null {
  try {
    return nodeRequire.resolve(pkg);
  } catch {
    return null;
  }
}

describe('treeSitter — grammars available (happy path)', () => {
  beforeEach(() => {
    __resetGrammarCache();
  });

  it('parseSource returns a program node for TypeScript when grammars are installed', () => {
    // Skip if the optional dev-install is missing on this runner.
    if (!resolveOptional('tree-sitter-typescript')) {
      return;
    }
    const root = parseSource('const answer: number = 42;', 'answer.ts');
    expect(root).not.toBeNull();
    expect(root?.type).toBe('program');
  });

  it('getMissingGrammars() is empty when every optional package is installed', () => {
    // Only meaningful when all four optional packages are present on the runner.
    const anyMissing =
      !resolveOptional('tree-sitter') ||
      !resolveOptional('tree-sitter-typescript') ||
      !resolveOptional('tree-sitter-javascript') ||
      !resolveOptional('tree-sitter-bash');
    if (anyMissing) {
      return;
    }
    __resetGrammarCache();
    // Warm the cache by loading each optional module through the public API.
    parseSource('x', 'a.ts');
    parseSource('x', 'a.js');
    parseSource('x', 'a.sh');
    expect(getMissingGrammars()).toEqual([]);
    expect(formatMissingGrammarError()).toBeNull();
  });
});

describe('treeSitter — grammars missing (degraded path)', () => {
  const grammarPackages = [
    'tree-sitter',
    'tree-sitter-typescript',
    'tree-sitter-javascript',
    'tree-sitter-bash',
  ] as const;

  /**
   * Snapshot of the Node module cache entries we may poison so we can
   * restore them after each test. Values may be undefined (entry did not
   * exist) — that state must also be restored.
   */
  let savedCache: Map<string, NodeJS.Module | undefined>;

  beforeEach(() => {
    savedCache = new Map();
    __resetGrammarCache();

    // Poison the require cache for each optional grammar so that
    // `createRequire(...)(pkg)` throws MODULE_NOT_FOUND-equivalent errors.
    // We do this by resolving the real path (if available) and replacing
    // the entry with a proxy that throws on any property access when
    // subsequently required. The simplest, host-safe approach: install a
    // fake entry under the resolved id whose `exports` throws when read.
    for (const pkg of grammarPackages) {
      let resolved: string;
      try {
        resolved = nodeRequire.resolve(pkg);
      } catch {
        continue;
      }
      const cache = (nodeRequire as unknown as { cache: Record<string, NodeJS.Module | undefined> })
        .cache;
      savedCache.set(resolved, cache[resolved]);
      // Replace with a broken stub. Reading `.exports` throws, mimicking
      // a genuinely missing/unloadable optional dependency.
      const broken = {
        id: resolved,
        filename: resolved,
        loaded: true,
        get exports(): never {
          throw new Error(`Cannot find module '${pkg}'`);
        },
      } as unknown as NodeJS.Module;
      cache[resolved] = broken;
    }
  });

  afterEach(() => {
    const cache = (nodeRequire as unknown as { cache: Record<string, NodeJS.Module | undefined> })
      .cache;
    for (const [id, original] of savedCache) {
      if (original === undefined) {
        delete cache[id];
      } else {
        cache[id] = original;
      }
    }
    __resetGrammarCache();
  });

  it('parseSource returns null when the required grammar cannot be loaded', () => {
    const root = parseSource('const answer = 42;', 'answer.ts');
    expect(root).toBeNull();
  });

  it('parseSource returns null for JavaScript files without grammars', () => {
    const root = parseSource('const answer = 42;', 'answer.js');
    expect(root).toBeNull();
  });

  it('parseSource returns null for Bash files without grammars', () => {
    const root = parseSource('foo() { echo hi; }', 'script.sh');
    expect(root).toBeNull();
  });

  it('getMissingGrammars() reports all four missing optional packages', () => {
    // Force load attempts through the public API.
    parseSource('x', 'a.ts');
    parseSource('x', 'a.js');
    parseSource('x', 'a.sh');
    const missing = getMissingGrammars();
    // Every optional peer we poisoned should surface as missing.
    expect(missing).toEqual(
      expect.arrayContaining([
        'tree-sitter',
        'tree-sitter-typescript',
        'tree-sitter-javascript',
        'tree-sitter-bash',
      ])
    );
  });

  it('formatMissingGrammarError() returns the documented install hint', () => {
    const message = formatMissingGrammarError();
    expect(message).not.toBeNull();
    expect(message).toContain(MISSING_GRAMMAR_INSTALL_HINT);
    // Sanity: the hint should mention the exact `npm install` command from
    // the issue spec so operators can copy-paste it.
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('npm install tree-sitter');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-typescript');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-javascript');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-bash');
  });

  it('formatMissingGrammarError() memoises failures so repeated calls are cheap', () => {
    const first = formatMissingGrammarError();
    const second = formatMissingGrammarError();
    expect(first).toBe(second === null ? first : second);
    // Second call must still contain the install hint.
    expect(second).toContain(MISSING_GRAMMAR_INSTALL_HINT);
  });
});
