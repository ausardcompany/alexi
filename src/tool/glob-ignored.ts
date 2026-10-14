/**
 * Resolve the user-provided `experimental.glob_include_ignored` allowlist
 * into include patterns that re-open specific paths that `.gitignore` or
 * hidden-folder rules would otherwise hide.
 *
 * Mirrors `packages/opencode/src/kilocode/tool/glob-ignored.ts` upstream.
 *
 * The glob tool normally honors `.gitignore` and skips hidden folders.
 * This allowlist opts specific folders (or exact files) back into the
 * search without disabling ignore handling globally — folders nested
 * inside an allowlisted folder that are themselves ignored still stay
 * skipped.
 *
 * Pattern rules (same as the opencode kilocode port):
 *  - Blank lines and lines starting with `#` are ignored.
 *  - A pattern without a `/` matches a folder NAMED `<pattern>` at any
 *    depth. We emit both `**\/<pattern>/**` (its contents) and
 *    `**\/<pattern>` (the folder entry itself).
 *  - A pattern with a `/` is treated as a path relative to the
 *    workspace root. We also append `/<pattern>/**` so that listing a
 *    folder also includes its descendants.
 *
 * When the allowlist is non-empty, `noRequireGit` is set so ripgrep's
 * ignore-file handling still runs (so nested ignored folders inside an
 * allowlisted folder are honored) even if the search root is not inside
 * a git working tree.
 *
 * Note on the recent fix (kilocode #15003 / #15017): the AGENT-supplied
 * pattern must NOT be plumbed through `--glob=`, because that makes it a
 * ripgrep override and leaks ignored paths. The include patterns computed
 * here ARE intentional operator-driven overrides (that's the whole point
 * of the allowlist), so they CAN still be emitted as `--glob=`. See
 * `src/core/kilocode/ripgrep-glob.ts` for the full story.
 */

import { compile } from '../core/kilocode/ripgrep-glob.js';

export interface IgnoredAllowlist {
  readonly include: readonly string[];
  readonly noRequireGit: boolean;
  /**
   * Predicate that returns true when the given cwd-relative POSIX path is
   * covered by at least one allowlist pattern. Lets the in-process JS
   * walker (`src/tool/tools/glob.ts`) honor the allowlist with the same
   * semantics as the ripgrep code path, without having to recompile the
   * patterns itself.
   */
  readonly matches: (relativePath: string, isDirectory: boolean) => boolean;
}

const ALWAYS_FALSE = (): boolean => false;

const EMPTY: IgnoredAllowlist = {
  include: [],
  noRequireGit: false,
  matches: ALWAYS_FALSE,
};

export function resolveAllowlist(
  patterns: readonly string[] | undefined,
  _cwd: string
): IgnoredAllowlist {
  if (!patterns || patterns.length === 0) {
    return EMPTY;
  }
  const include: string[] = [];
  for (const raw of patterns) {
    const pattern = raw.trim();
    if (!pattern || pattern.startsWith('#')) {
      continue;
    }
    // Patterns without slash match folders at any depth.
    if (!pattern.includes('/')) {
      include.push(`**/${pattern}/**`);
      include.push(`**/${pattern}`);
    } else {
      include.push(pattern);
      if (!pattern.endsWith('/**')) {
        include.push(`${pattern}/**`);
      }
    }
  }
  if (include.length === 0) {
    return EMPTY;
  }
  // Compile each include pattern once up-front so the predicate stays cheap
  // in the hot walker loop.
  const matchers = include.map((p) => compile(p));
  const matches = (relativePath: string, isDirectory: boolean): boolean =>
    matchers.some((m) => m(relativePath, isDirectory));
  return { include, noRequireGit: true, matches };
}
