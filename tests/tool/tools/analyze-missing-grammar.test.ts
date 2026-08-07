/**
 * Tests for the per-language missing-grammar detection surface exposed by
 * `src/context/treeSitter.ts`.
 *
 * Issue #1296 introduced Python / Rust / Go as new optional-peer grammars
 * alongside the existing TypeScript / JavaScript / Bash trio, and added a
 * `checkGrammarAvailable(language)` + `formatMissingLanguageError(language)`
 * pair so downstream code-analysis tools can surface actionable install
 * hints when a specific grammar is missing.
 *
 * The file path (`analyze-missing-grammar`) matches the location requested
 * in the issue spec even though the analysis lives in the shared
 * `treeSitter.ts` helper rather than a dedicated `analyze` tool — this is
 * the correct home because the definitions tool already uses regex
 * extraction and does not touch tree-sitter.
 *
 * Strategy: we poison the Node `require` cache for the optional grammar
 * packages so `createRequire(...)(pkg)` throws a MODULE_NOT_FOUND-shaped
 * error, then assert:
 *
 *   1. `checkGrammarAvailable(language)` returns `false` for every
 *      language whose grammar has been poisoned.
 *   2. `formatMissingLanguageError(language)` returns a copy-paste-ready
 *      install command that names the correct grammar package.
 *   3. The catalogue of missing grammars exposed by
 *      `getMissingGrammars()` covers the new Python / Rust / Go packages,
 *      not just the pre-existing three.
 *   4. `MISSING_GRAMMAR_INSTALL_HINT` lists every optional grammar so
 *      operators get one canonical remediation command.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';
import {
  checkGrammarAvailable,
  formatMissingLanguageError,
  getMissingGrammars,
  formatMissingGrammarError,
  MISSING_GRAMMAR_INSTALL_HINT,
  __resetGrammarCache,
  type Grammar,
  type SupportedLanguage,
} from '../../../src/context/treeSitter.js';

const nodeRequire = createRequire(import.meta.url);

const OPTIONAL_GRAMMARS: readonly Grammar[] = [
  'tree-sitter',
  'tree-sitter-typescript',
  'tree-sitter-javascript',
  'tree-sitter-bash',
  'tree-sitter-python',
  'tree-sitter-rust',
  'tree-sitter-go',
];

const LANGUAGE_TO_PACKAGE: Readonly<Record<SupportedLanguage, Grammar>> = {
  typescript: 'tree-sitter-typescript',
  javascript: 'tree-sitter-javascript',
  bash: 'tree-sitter-bash',
  python: 'tree-sitter-python',
  rust: 'tree-sitter-rust',
  go: 'tree-sitter-go',
};

/**
 * Poison the Node require cache so any `require(pkg)` call for the
 * given optional grammar throws — regardless of whether the package is
 * actually installed on the current runner. This lets the test simulate
 * a MODULE_NOT_FOUND without touching `node_modules/`.
 */
function poisonRequireCache(): Map<string, NodeJS.Module | undefined> {
  const saved = new Map<string, NodeJS.Module | undefined>();
  const cache = (nodeRequire as unknown as { cache: Record<string, NodeJS.Module | undefined> })
    .cache;

  for (const pkg of OPTIONAL_GRAMMARS) {
    let resolved: string;
    try {
      resolved = nodeRequire.resolve(pkg);
    } catch {
      // Package not installed on this runner — the loader will already
      // fail on real require, so no poisoning needed.
      continue;
    }
    saved.set(resolved, cache[resolved]);
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

  return saved;
}

function restoreRequireCache(saved: Map<string, NodeJS.Module | undefined>): void {
  const cache = (nodeRequire as unknown as { cache: Record<string, NodeJS.Module | undefined> })
    .cache;
  for (const [id, original] of saved) {
    if (original === undefined) {
      delete cache[id];
    } else {
      cache[id] = original;
    }
  }
}

describe('checkGrammarAvailable / formatMissingLanguageError (issue #1296)', () => {
  let saved: Map<string, NodeJS.Module | undefined>;

  beforeEach(() => {
    __resetGrammarCache();
    saved = poisonRequireCache();
  });

  afterEach(() => {
    restoreRequireCache(saved);
    __resetGrammarCache();
  });

  it('checkGrammarAvailable returns false for every supported language when grammars are missing', () => {
    for (const lang of Object.keys(LANGUAGE_TO_PACKAGE) as SupportedLanguage[]) {
      expect(checkGrammarAvailable(lang)).toBe(false);
    }
  });

  it('formatMissingLanguageError returns a copy-paste-ready install command per language', () => {
    for (const [lang, pkg] of Object.entries(LANGUAGE_TO_PACKAGE) as Array<
      [SupportedLanguage, Grammar]
    >) {
      const msg = formatMissingLanguageError(lang);
      expect(msg).not.toBeNull();
      const display = lang.charAt(0).toUpperCase() + lang.slice(1);
      // The error must name the human-readable language, the package,
      // and include a runnable `npm install` command so operators can
      // copy-paste it verbatim.
      expect(msg).toContain(`Code analysis for ${display} requires ${pkg}`);
      expect(msg).toContain(`npm install`);
      expect(msg).toContain(pkg);
    }
  });

  it('formatMissingLanguageError includes the runtime in the install list when it is missing too', () => {
    const msg = formatMissingLanguageError('python');
    // Both the language grammar and the runtime were poisoned in
    // beforeEach, so the hint must instruct the user to install both.
    expect(msg).toContain('tree-sitter-python');
    expect(msg).toContain('tree-sitter ');
  });

  it('getMissingGrammars reports the new Python / Rust / Go grammars alongside the pre-existing three', () => {
    const missing = getMissingGrammars();
    expect(missing).toEqual(
      expect.arrayContaining([
        'tree-sitter',
        'tree-sitter-typescript',
        'tree-sitter-javascript',
        'tree-sitter-bash',
        'tree-sitter-python',
        'tree-sitter-rust',
        'tree-sitter-go',
      ])
    );
  });

  it('MISSING_GRAMMAR_INSTALL_HINT lists every optional grammar package', () => {
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('npm install tree-sitter');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-typescript');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-javascript');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-bash');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-python');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-rust');
    expect(MISSING_GRAMMAR_INSTALL_HINT).toContain('tree-sitter-go');
  });

  it('formatMissingGrammarError surfaces the aggregate install hint', () => {
    const msg = formatMissingGrammarError();
    expect(msg).not.toBeNull();
    expect(msg).toContain(MISSING_GRAMMAR_INSTALL_HINT);
  });

  it('formatMissingLanguageError returns null when the grammar is loadable', () => {
    // Skip this branch when either the runtime or the grammar package
    // is genuinely absent on the runner — poisonRequireCache can only
    // simulate the "installed but broken" case.
    const canResolve = (pkg: string): boolean => {
      try {
        nodeRequire.resolve(pkg);
        return true;
      } catch {
        return false;
      }
    };
    if (!canResolve('tree-sitter-python') || !canResolve('tree-sitter')) {
      return;
    }
    // Un-poison the require cache for the test.
    restoreRequireCache(saved);
    __resetGrammarCache();
    expect(formatMissingLanguageError('python')).toBeNull();
    expect(checkGrammarAvailable('python')).toBe(true);
    // Re-poison for the afterEach cleanup contract.
    saved = poisonRequireCache();
  });
});
