/**
 * Graph-based importance ranking via import analysis
 *
 * Builds a directed import graph across all files in the repo map, then
 * uses a simplified PageRank-style algorithm to assign each file an
 * importance score.  Files that are imported by many others rank higher.
 *
 * Import extraction is done with a lightweight regex pass (no full AST
 * needed here) to keep things fast on large repos.
 */

import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Map from resolved absolute path → set of absolute paths it imports */
export type ImportGraph = Map<string, Set<string>>;

/** Map from absolute path → importance score [0, 1] */
export type RankMap = Map<string, number>;

// ─── Import extraction ────────────────────────────────────────────────────────

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
const REQUIRE_RE = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

/**
 * Extract all module specifiers from source code (static imports/exports and
 * require() calls).  Only relative paths (starting with `.`) are returned;
 * bare package names are skipped.
 */
export function extractImports(source: string): string[] {
  const specifiers: string[] = [];

  for (const re of [IMPORT_RE, REQUIRE_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(source)) !== null) {
      const spec = m[1];
      if (spec.startsWith('.')) specifiers.push(spec);
    }
  }

  return specifiers;
}

// ─── Graph construction ───────────────────────────────────────────────────────

/**
 * The extensions we try when resolving a bare relative import like `./foo`
 * (mirrors the TypeScript module resolution order).
 */
const RESOLVE_EXTENSIONS = [
  '', // exact match (e.g. already has extension)
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
];

/**
 * Attempt to resolve a relative import specifier to one of the known file paths.
 *
 * @param spec      The import specifier (e.g. `"./utils"` or `"../config"`)
 * @param fromFile  Absolute path of the importing file
 * @param fileSet   Set of all known absolute paths in the repo
 */
function resolveSpecifier(spec: string, fromFile: string, fileSet: Set<string>): string | null {
  const dir = path.dirname(fromFile);
  const base = path.resolve(dir, spec);

  for (const ext of RESOLVE_EXTENSIONS) {
    const candidate = base + ext;
    if (fileSet.has(candidate)) return candidate;
  }

  // Also try `/index.ts` etc. for directory imports
  for (const ext of RESOLVE_EXTENSIONS.slice(1)) {
    const candidate = path.join(base, `index${ext}`);
    if (fileSet.has(candidate)) return candidate;
  }

  return null;
}

/**
 * Build an import graph from a map of filePath → source content.
 * Only edges between known files are included.
 */
export function buildImportGraph(files: Map<string, string>): ImportGraph {
  const fileSet = new Set(files.keys());
  const graph: ImportGraph = new Map();

  for (const [filePath, source] of files) {
    const imports = new Set<string>();
    for (const spec of extractImports(source)) {
      const resolved = resolveSpecifier(spec, filePath, fileSet);
      if (resolved) imports.add(resolved);
    }
    graph.set(filePath, imports);
  }

  return graph;
}

// ─── PageRank ─────────────────────────────────────────────────────────────────

const DAMPING = 0.85;
const ITERATIONS = 20;
const CONVERGENCE_THRESHOLD = 1e-6;

/**
 * Run a simplified PageRank on the import graph.
 *
 * In the import graph an edge A → B means "A imports B".  We want files that
 * are *imported by many others* to rank high, so we treat each edge as a vote
 * from A *for* B (i.e. the "in-link" model).
 *
 * Returns a map of filePath → score in (0, 1].
 */
export function rankFiles(graph: ImportGraph): RankMap {
  const nodes = [...graph.keys()];
  const N = nodes.length;
  if (N === 0) return new Map();

  const initialScore = 1 / N;
  const scores = new Map<string, number>(nodes.map((n) => [n, initialScore]));

  // Pre-compute the in-link lists (who imports me?)
  const inLinks = new Map<string, string[]>(nodes.map((n) => [n, []]));
  const outDegree = new Map<string, number>();

  for (const [from, targets] of graph) {
    outDegree.set(from, targets.size);
    for (const to of targets) {
      inLinks.get(to)?.push(from);
    }
  }

  // Iterative PageRank
  for (let iter = 0; iter < ITERATIONS; iter++) {
    let delta = 0;

    for (const node of nodes) {
      let rank = (1 - DAMPING) / N;

      for (const from of inLinks.get(node) ?? []) {
        const deg = outDegree.get(from) ?? 1;
        rank += (DAMPING * (scores.get(from) ?? 0)) / deg;
      }

      delta += Math.abs(rank - (scores.get(node) ?? 0));
      scores.set(node, rank);
    }

    if (delta < CONVERGENCE_THRESHOLD) break;
  }

  // Normalise to [0, 1] relative to the maximum score
  const max = Math.max(...scores.values());
  if (max > 0) {
    for (const [k, v] of scores) {
      scores.set(k, v / max);
    }
  }

  return scores;
}

// ─── Reference counting ───────────────────────────────────────────────────────

/**
 * Count how many times each symbol name appears in files *other than* the one
 * that defines the symbol.  This gives a rough "cross-file usage" count.
 *
 * For performance this is a simple substring search, not a full AST analysis.
 */
export function countSymbolReferences(
  symbolName: string,
  definingFile: string,
  files: Map<string, string>
): number {
  let count = 0;
  const re = new RegExp(`\\b${escapeRegex(symbolName)}\\b`, 'g');

  for (const [filePath, source] of files) {
    if (filePath === definingFile) continue;
    const matches = source.match(re);
    if (matches) count += matches.length;
  }

  return count;
}

function escapeRegex(s: string): string {
  return s.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}
