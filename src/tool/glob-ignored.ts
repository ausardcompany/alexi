/**
 * Resolve the user-provided `experimental.glob_include_ignored` allowlist
 * into ripgrep `--glob=` include patterns.
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
 */

export interface IgnoredAllowlist {
  readonly include: readonly string[];
  readonly noRequireGit: boolean;
}

const EMPTY: IgnoredAllowlist = { include: [], noRequireGit: false };

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
  return { include, noRequireGit: true };
}
