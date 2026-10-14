/**
 * Glob matching that keeps ripgrep's ignore rules in charge.
 *
 * Ports upstream kilocode fix #15003 / #15017: passing the agent's pattern as
 * `--glob=<pattern>` makes it a ripgrep **override**, and overrides win over
 * `.gitignore`. That causes `**\/*` globs to walk `node_modules`, `.git`, and
 * other ignored directories, which exposes secrets (`.env`, `secret/`) and
 * blows out search latency on big trees.
 *
 * The fix: let ripgrep list the files its ignore rules allow, then apply the
 * agent-supplied pattern **in this process** using gitignore-style rules.
 *
 * Alexi deviates from upstream in two mechanical ways:
 *   - We use Node's `minimatch` (already in the dependency tree via `overrides`)
 *     instead of `Bun.Glob` — Alexi runs on Node >= 22.12, not Bun.
 *   - No `Effect` runtime; callers get plain predicates. The companion
 *     `src/core/ripgrep.ts` module threads these into whichever search
 *     primitive the glob/grep tools dispatch to.
 */

import { minimatch } from 'minimatch';

export interface Input {
  readonly pattern: string;
  readonly hidden?: boolean;
  readonly include?: readonly string[];
}

export interface Walk {
  readonly args: readonly string[];
  readonly match: (file: string) => boolean;
  readonly keep: (file: string | undefined) => boolean;
}

/**
 * Compile a pattern into a matcher the way ripgrep would match an override
 * glob. Patterns without a leading `/` match at ANY depth
 * (`foo.ts` → `**\/foo.ts`); trailing `/` means "folder only". Leading `/`
 * anchors the pattern to the cwd.
 */
export function compile(pattern: string): (path: string, folder: boolean) => boolean {
  const dir = pattern.endsWith('/');
  const body = pattern.replace(/\/+$/, '');
  const text = body.includes('/') ? body.replace(/^\//, '') : `**/${body}`;
  const folderText = text.endsWith('/**') ? `${text}/*` : text;
  const options = { dot: true, nocomment: true } as const;
  return (path: string, folder: boolean) => {
    if (folder) {
      return minimatch(path, folderText, options);
    }
    return !dir && minimatch(path, text, options);
  };
}

/**
 * Extract the trailing filename segment of the pattern to use as a ripgrep
 * `--type-add` body plus `--pre-glob` prefilter. Ripgrep applies file-type
 * filters AFTER its ignore rules, so this is safe (unlike `--glob=`).
 *
 * Brace-expansion patterns (`*.{ts,tsx}`) are skipped because ripgrep's
 * `--type-add` syntax does not support them in the same way — we fall
 * through to a non-prefiltered walk and rely on the in-process matcher.
 */
function prefilter(pattern: string): { typeArgs: readonly string[]; preGlob?: string } {
  const name = pattern.split('/').at(-1) ?? '';
  if (!name || name.includes('{') || name.includes('}')) {
    return { typeArgs: [] };
  }
  return {
    typeArgs: [`--type-add=kiloglob:${name}`, '--type=kiloglob'],
    preGlob: name,
  };
}

/**
 * Normalize a ripgrep output line to a cwd-relative POSIX path. ripgrep emits
 * `./foo/bar.ts` on POSIX and `.\foo\bar.ts` on Windows; strip the leading
 * `./` / `.\\`, drop any leading slash, and swap backslashes.
 */
export function relative(line: string): string {
  return line
    .replace(/^(?:\.[\\/])+/u, '')
    .replace(/^[\\/]+/u, '')
    .replaceAll('\\', '/');
}

/**
 * Build the ripgrep argv additions and the in-process matcher/filter pair for
 * a glob invocation. `args` is spread into the ripgrep command, `match` and
 * `keep` run against each candidate path (post ignore rules) in this process.
 */
export function glob(input: Input): Walk {
  const matcher = compile(input.pattern);
  const pre = prefilter(input.pattern);
  const args = [...pre.typeArgs, ...(pre.preGlob ? [`--pre-glob=${pre.preGlob}`] : [])];
  const match = (file: string): boolean => matcher(file, false);
  const keep = (file: string | undefined): boolean => {
    if (file === undefined) {
      return false;
    }
    return match(file);
  };
  return { args, match, keep };
}
