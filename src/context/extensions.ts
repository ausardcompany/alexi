/**
 * File extension → language classification
 *
 * Centralised mapping for tool selection so custom / non-standard extensions
 * (`.cjs`, `.mjs`, `.jsonc`, `.d.ts`, `.tsx`, `.jsx`, ...) are handled
 * consistently across the codebase (tree-sitter parsing, definitions
 * extraction, code search, repo mapping, ...).
 *
 * Consumers should prefer these helpers over ad-hoc `path.extname()` checks
 * so a new extension only has to be added in one place.
 */

import * as path from 'path';

/**
 * Canonical source-language buckets that tools care about.
 * `unknown` is returned for files with no known mapping.
 */
export type SourceLanguage = 'typescript' | 'javascript' | 'python' | 'bash' | 'json' | 'unknown';

/**
 * Return the lower-cased extension of a file path *including* the leading
 * dot, with the additional convention that `.d.ts` is preserved verbatim
 * instead of collapsing to `.ts`. This makes it possible to distinguish
 * TypeScript declaration files from regular TypeScript sources.
 *
 * Examples:
 *   getExtension('foo.ts')        // '.ts'
 *   getExtension('foo.d.ts')      // '.d.ts'
 *   getExtension('module.mjs')    // '.mjs'
 *   getExtension('config.jsonc')  // '.jsonc'
 *   getExtension('Makefile')      // ''
 */
export function getExtension(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.d.ts')) {
    return '.d.ts';
  }
  return path.extname(lower);
}

/**
 * TypeScript-family extensions. `.d.ts` is included because declaration
 * files are valid TypeScript syntax.
 */
export const TYPESCRIPT_EXTENSIONS: ReadonlySet<string> = new Set([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.d.ts',
]);

/**
 * JavaScript-family extensions. `.mjs` is ES module mode, `.cjs` is
 * CommonJS mode; both are still JavaScript for AST / definitions purposes.
 */
export const JAVASCRIPT_EXTENSIONS: ReadonlySet<string> = new Set(['.js', '.jsx', '.mjs', '.cjs']);

/** JSON-family extensions. `.jsonc` = JSON with comments (tsconfig, VSCode). */
export const JSON_EXTENSIONS: ReadonlySet<string> = new Set(['.json', '.jsonc']);

/** Python extensions. */
export const PYTHON_EXTENSIONS: ReadonlySet<string> = new Set(['.py']);

/** Bash / shell extensions. */
export const BASH_EXTENSIONS: ReadonlySet<string> = new Set(['.sh', '.bash']);

/**
 * All source-code extensions understood by the tool suite. Useful as a
 * default filter for repository walkers, symbol indexers, and code search.
 */
export const SOURCE_EXTENSIONS: ReadonlySet<string> = new Set([
  ...TYPESCRIPT_EXTENSIONS,
  ...JAVASCRIPT_EXTENSIONS,
  ...JSON_EXTENSIONS,
  ...PYTHON_EXTENSIONS,
  ...BASH_EXTENSIONS,
]);

/**
 * Classify a file path into a canonical source language. Returns
 * `'unknown'` for extensions the tool suite does not recognise.
 */
export function getLanguageForFile(filePath: string): SourceLanguage {
  const ext = getExtension(filePath);
  if (TYPESCRIPT_EXTENSIONS.has(ext)) return 'typescript';
  if (JAVASCRIPT_EXTENSIONS.has(ext)) return 'javascript';
  if (JSON_EXTENSIONS.has(ext)) return 'json';
  if (PYTHON_EXTENSIONS.has(ext)) return 'python';
  if (BASH_EXTENSIONS.has(ext)) return 'bash';
  return 'unknown';
}

/**
 * True if the file has a known source-code extension.
 */
export function isSourceFile(filePath: string): boolean {
  return SOURCE_EXTENSIONS.has(getExtension(filePath));
}
