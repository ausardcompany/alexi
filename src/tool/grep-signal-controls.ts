/**
 * Grep Signal Controls (upstream kilocode #12811 parity)
 *
 * Signal-to-noise filters applied on top of raw grep results. Upstream
 * added these as a way to reduce the amount of low-value context that
 * grep dumps into the model window on broad queries — LLMs are easily
 * distracted by minified bundles, generated files, and long tails of
 * near-duplicate matches inside the same file.
 *
 * The filters here are all opt-in and stackable. `applySignalControls`
 * is a pure function so it composes cleanly with the existing grep tool
 * pipeline and is trivial to unit-test.
 */

export interface GrepMatch {
  path: string;
  line: string;
  match: string;
  lineNumber: number;
}

export interface GrepSignalControls {
  /**
   * Maximum number of matches to retain per file. After this many results
   * for a given file, additional matches are dropped. Preserves the first
   * N matches in encounter order.
   */
  maxResultsPerFile?: number;
  /**
   * Drop matches whose captured substring is shorter than this length.
   * Useful for filtering out single-character noise on wide regexes.
   */
  minMatchLength?: number;
  /**
   * Drop matches whose surrounding line contains binary-looking control
   * characters. Grep on non-UTF-8 binaries occasionally slips through
   * even with `--binary-files=without-match`.
   */
  suppressBinaryLike?: boolean;
  /**
   * Drop matches from paths that look generated (min.js, .gen., lockfiles,
   * `dist/`, `build/`, `node_modules/`).
   */
  suppressGeneratedFiles?: boolean;
  /**
   * Sort matches so those in paths containing any of these substrings are
   * returned first. Stable within each group.
   */
  boostPathPatterns?: string[];
}

/**
 * Apply the configured signal controls to a set of grep matches. Filters
 * that are unset in `controls` are skipped — no change to behavior unless
 * the caller opts in.
 */
export function applySignalControls(
  matches: GrepMatch[],
  controls: GrepSignalControls
): GrepMatch[] {
  let filtered = matches;
  if (controls.suppressBinaryLike) {
    filtered = filtered.filter((m) => !looksBinary(m.line));
  }
  if (controls.suppressGeneratedFiles) {
    filtered = filtered.filter((m) => !isGeneratedFile(m.path));
  }
  if (controls.minMatchLength && controls.minMatchLength > 0) {
    const min = controls.minMatchLength;
    filtered = filtered.filter((m) => m.match.length >= min);
  }
  if (controls.maxResultsPerFile) {
    const cap = controls.maxResultsPerFile;
    const perFile = new Map<string, number>();
    filtered = filtered.filter((m) => {
      const count = perFile.get(m.path) ?? 0;
      perFile.set(m.path, count + 1);
      return count < cap;
    });
  }
  if (controls.boostPathPatterns?.length) {
    const boosts = controls.boostPathPatterns;
    // Stable sort by boost score (descending). `Array.prototype.sort` in
    // modern V8 is stable, so equal-boost entries preserve insertion order.
    filtered = [...filtered].sort((a, b) => {
      const aBoost = boosts.some((p) => a.path.includes(p)) ? 1 : 0;
      const bBoost = boosts.some((p) => b.path.includes(p)) ? 1 : 0;
      return bBoost - aBoost;
    });
  }
  return filtered;
}

function looksBinary(line: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[\x00-\x08\x0E-\x1F]/.test(line);
}

function isGeneratedFile(path: string): boolean {
  return /(\.min\.|\.gen\.|node_modules\/|dist\/|build\/|\.lock$)/.test(path);
}
