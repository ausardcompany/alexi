/**
 * Ripgrep glob post-filtering.
 *
 * Ports upstream kilocode PR #15017 (`e48c9785c`, `17448f5c5`): passing
 * a user-supplied pattern to ripgrep as `--glob=<pattern>` makes ripgrep
 * treat it as an INCLUDE OVERRIDE that wins over `.gitignore` /
 * `.ignore` rules. The result: a glob like `**\/*.ts` happily walks into
 * `node_modules` (because it is ignored by `.gitignore`, not by a
 * `--glob` rule), which was never the intent.
 *
 * Fix: do NOT pass the user pattern as a ripgrep `--glob`. Let ripgrep
 * enumerate files per its normal ignore rules, then apply the pattern
 * locally as a post-filter. The behaviour now matches:
 *
 *   - `.gitignore` rules apply (as expected),
 *   - the user pattern narrows the result set,
 *   - include/exclude override globs (opencode allowlist) still work
 *     at the ripgrep layer because they are AUTHORITATIVELY declared
 *     by the operator, not inferred from a user pattern.
 *
 * SAP AI Core note: this change makes `grep **\/*.ts` safe to run in
 * repositories with large `node_modules` trees that would otherwise
 * balloon the LLM context budget. The post-filter adds O(files-visited)
 * work per search, which is negligible compared to the ripgrep walk
 * itself.
 */

import { minimatch } from 'minimatch';

export interface GlobFilterInput {
  /** User-supplied include pattern (minimatch dialect). */
  readonly pattern: string;
}

export interface GlobFilter {
  /** Return `true` when `file` (relative or absolute) matches the pattern. */
  match(file: string): boolean;
}

/**
 * Compile a user pattern into a post-filter predicate.
 *
 * Patterns that do not contain a `/` are implicitly promoted to
 * `**\/<pattern>` so a bare `*.ts` matches at any depth, which is
 * what users expect when they type `grep foo --include "*.ts"`.
 *
 * Patterns that end with `/` are treated as directory-only matches —
 * the predicate always returns `false` for a file because ripgrep's
 * post-filter path only ever sees files. Directory restriction is
 * delegated to the ripgrep walker via its native glob support
 * (which, unlike the include case, does NOT override `.gitignore`).
 */
export function compile(input: GlobFilterInput): GlobFilter {
  const raw = input.pattern.trim();
  if (raw.length === 0) {
    return { match: () => true };
  }
  const isDirectoryOnly = raw.endsWith('/');
  if (isDirectoryOnly) {
    return { match: () => false };
  }
  // Bare `*.ts` -> `**/*.ts` so it matches at any depth, matching the
  // mental model users have when supplying `--include "*.ts"`.
  const effective = raw.includes('/') ? raw : `**/${raw}`;
  return {
    match: (file: string) => minimatch(file, effective, { dot: false, matchBase: false }),
  };
}
