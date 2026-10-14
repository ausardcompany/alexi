/**
 * Ripgrep glob/search command assembly.
 *
 * Alexi's grep/glob tools (`src/tool/tools/grep.ts`, `src/tool/tools/glob.ts`)
 * historically dispatched to `rg` directly, with the agent-supplied pattern
 * passed as `--glob=<pattern>`. That turns the pattern into a ripgrep
 * **override**, and overrides win over `.gitignore` — causing `**\/*` searches
 * to walk `node_modules`, `.git`, and anything else the user intended to be
 * ignored. See `src/core/kilocode/ripgrep-glob.ts` for the full write-up.
 *
 * This module centralises the command-assembly contract so the pattern lives
 * in exactly one place: `--glob=` is no longer used for the agent pattern,
 * and the pattern is re-applied in-process after ripgrep has filtered by its
 * ignore rules.
 *
 * The implementation is deliberately thin: the real file walk still happens
 * in the grep/glob tools, which can import these helpers to stay consistent
 * with the fix. Callers that spawn `rg` themselves should (a) spread
 * `assembleGlobArgs(input)` into the argv instead of `--glob=${pattern}`, and
 * (b) run each output line through `filterGlobLine(input, line)` to drop
 * anything that does not actually match the pattern after decoding.
 */

import * as KiloGlob from './kilocode/ripgrep-glob.js';

export interface GlobInput {
  readonly pattern: string;
  readonly noRequireGit?: boolean;
  readonly include?: readonly string[];
  readonly exclude?: readonly string[];
  /** Optional secondary filter run after KiloGlob.keep succeeds. */
  readonly filter?: (path: string) => boolean;
}

/**
 * Return the ripgrep argv fragment for a glob query. The agent pattern is NOT
 * emitted as `--glob=`; include/exclude patterns stay as `--glob=` because
 * they are opt-in operator config and the override semantics are intentional
 * there.
 */
export function assembleGlobArgs(input: GlobInput): readonly string[] {
  return [
    ...KiloGlob.glob(input).args, // pattern is applied AFTER ignore rules
    ...(input.include ?? []).map((pattern) => `--glob=${pattern}`),
    ...(input.exclude ?? []).map((pattern) => `--glob=!${pattern}`),
  ];
}

/**
 * Decode one ripgrep output line and return the normalised relative path, or
 * `undefined` when the line should be dropped (the pattern does not match
 * after the ignore rules have been applied, or `input.filter` rejects it).
 */
export function filterGlobLine(input: GlobInput, line: string): string | undefined {
  const file = KiloGlob.relative(line);
  const walker = KiloGlob.glob(input);
  const kept = walker.keep(file) && (!input.filter || input.filter(file));
  return kept ? file : undefined;
}

export { KiloGlob };
