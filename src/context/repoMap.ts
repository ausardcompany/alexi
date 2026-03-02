/**
 * Repository Map — main module
 *
 * Scans the working directory for TypeScript/JavaScript source files,
 * extracts symbols via tree-sitter, ranks files by import importance,
 * and serialises the result into a compact text block suitable for
 * inclusion in an LLM system prompt.
 *
 * Public API:
 *   generateRepoMap(workdir, options)  — build and format a repo map
 *   RepoMapManager                     — stateful class with caching
 */

import * as fs from 'fs';
import * as path from 'path';
import { isSupportedFile } from './treeSitter.js';
import { extractSymbols, type CodeSymbol } from './symbols.js';
import { buildImportGraph, rankFiles, countSymbolReferences } from './ranking.js';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface RepoMap {
  /** filePath → symbols in that file */
  files: Map<string, CodeSymbol[]>;
  /** Approximate token count of the rendered map */
  totalTokens: number;
  /** Unix timestamp (ms) of when the map was generated */
  lastUpdated: number;
}

export interface RepoMapOptions {
  /** Maximum token budget for the rendered map (default: 1000) */
  maxTokens?: number;
  /** Additional glob-style patterns to ignore (on top of defaults + .alexiignore) */
  extraIgnore?: string[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

/** Always-ignored directory / file patterns */
const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '.next',
  '.nuxt',
  '.turbo',
  '__pycache__',
  '.DS_Store',
];

const DEFAULT_MAX_TOKENS = 1000;

// ─── .alexiignore support ────────────────────────────────────────────────────

/**
 * Load patterns from `.alexiignore` in `workdir`.
 * Lines starting with `#` and blank lines are skipped.
 */
function loadAlexiIgnore(workdir: string): string[] {
  const ignoreFile = path.join(workdir, '.alexiignore');
  try {
    const content = fs.readFileSync(ignoreFile, 'utf-8');
    return content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
  } catch {
    return [];
  }
}

// ─── File discovery ───────────────────────────────────────────────────────────

/**
 * Returns true if any segment of `relativePath` matches an ignored pattern.
 * Patterns are matched as simple substring checks or exact segment matches.
 */
function isIgnored(relativePath: string, ignorePatterns: string[]): boolean {
  const segments = relativePath.split(path.sep);
  for (const pattern of ignorePatterns) {
    // Exact segment match (e.g. "node_modules")
    if (segments.includes(pattern)) return true;
    // Substring match (e.g. ".test." to skip test files)
    if (relativePath.includes(pattern)) return true;
  }
  return false;
}

/**
 * Recursively walk `dir`, collecting all supported source files.
 * Skips directories/files matching `ignorePatterns`.
 */
function collectFiles(
  dir: string,
  workdir: string,
  ignorePatterns: string[],
  results: string[] = []
): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(workdir, fullPath);

    if (isIgnored(relPath, ignorePatterns)) continue;

    if (entry.isDirectory()) {
      collectFiles(fullPath, workdir, ignorePatterns, results);
    } else if (entry.isFile() && isSupportedFile(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

// ─── Token estimation ────────────────────────────────────────────────────────

/**
 * Rough token count: ~4 characters per token (GPT-style approximation).
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ─── Rendering ────────────────────────────────────────────────────────────────

/**
 * Format a single file's symbols as a compact text block.
 *
 * Example:
 *   src/core/router.ts
 *     function routePrompt(…)
 *     interface RouterOptions
 */
function formatFile(relPath: string, symbols: CodeSymbol[]): string {
  if (symbols.length === 0) return `${relPath}\n`;

  const lines = [`${relPath}`];
  for (const sym of symbols) {
    const sigLine = sym.signature ? `  ${sym.signature}` : `  ${sym.kind} ${sym.name}`;
    lines.push(sigLine);
  }
  return lines.join('\n') + '\n';
}

/**
 * Build the full repo map text, respecting the token budget.
 *
 * Files are ordered by importance score (descending).  Within each file,
 * symbols are ordered by line number.  If the full map would exceed the
 * token budget we progressively drop lower-ranked files.
 */
function renderRepoMap(
  fileSymbols: Map<string, CodeSymbol[]>,
  rankScores: Map<string, number>,
  maxTokens: number
): { text: string; tokensUsed: number } {
  // Sort files by rank score descending
  const sorted = [...fileSymbols.entries()].sort(([a], [b]) => {
    const ra = rankScores.get(a) ?? 0;
    const rb = rankScores.get(b) ?? 0;
    return rb - ra;
  });

  const chunks: string[] = [];
  let tokensUsed = 0;

  for (const [filePath, symbols] of sorted) {
    const chunk = formatFile(filePath, symbols);
    const chunkTokens = estimateTokens(chunk);

    if (tokensUsed + chunkTokens > maxTokens && chunks.length > 0) {
      // Stop adding files once we'd exceed the budget
      break;
    }

    chunks.push(chunk);
    tokensUsed += chunkTokens;
  }

  return { text: chunks.join('\n'), tokensUsed };
}

// ─── Core generation ─────────────────────────────────────────────────────────

/**
 * Scan `workdir`, extract symbols, rank files, and return a `RepoMap`.
 */
export async function buildRepoMap(
  workdir: string,
  options: RepoMapOptions = {}
): Promise<RepoMap> {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const alexiIgnore = loadAlexiIgnore(workdir);
  const allIgnore = [...DEFAULT_IGNORE_PATTERNS, ...alexiIgnore, ...(options.extraIgnore ?? [])];

  // Discover files
  const absolutePaths = collectFiles(workdir, workdir, allIgnore);

  // Read sources
  const sources = new Map<string, string>();
  for (const filePath of absolutePaths) {
    try {
      sources.set(filePath, fs.readFileSync(filePath, 'utf-8'));
    } catch {
      // unreadable file — skip
    }
  }

  // Build import graph and rank
  const graph = buildImportGraph(sources);
  const rankScores = rankFiles(graph);

  // Extract symbols for each file
  const fileSymbols = new Map<string, CodeSymbol[]>();
  for (const [filePath, source] of sources) {
    const relPath = path.relative(workdir, filePath);
    const symbols = extractSymbols(source, relPath);
    fileSymbols.set(filePath, symbols);
  }

  // Enrich symbols with cross-file reference counts
  for (const symbols of fileSymbols.values()) {
    for (const sym of symbols) {
      sym.references = countSymbolReferences(sym.name, sym.filePath, sources);
    }
  }

  // Render respecting token budget
  const { tokensUsed } = renderRepoMap(fileSymbols, rankScores, maxTokens);

  return {
    files: fileSymbols,
    totalTokens: tokensUsed,
    lastUpdated: Date.now(),
  };
}

/**
 * Generate a formatted repo map string ready for insertion into a system prompt.
 *
 * Returns an empty string if no files were found.
 */
export async function generateRepoMap(
  workdir: string,
  options: RepoMapOptions = {}
): Promise<string> {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const alexiIgnore = loadAlexiIgnore(workdir);
  const allIgnore = [...DEFAULT_IGNORE_PATTERNS, ...alexiIgnore, ...(options.extraIgnore ?? [])];

  const absolutePaths = collectFiles(workdir, workdir, allIgnore);
  if (absolutePaths.length === 0) return '';

  const sources = new Map<string, string>();
  for (const filePath of absolutePaths) {
    try {
      sources.set(filePath, fs.readFileSync(filePath, 'utf-8'));
    } catch {
      /* skip */
    }
  }

  const graph = buildImportGraph(sources);
  const rankScores = rankFiles(graph);

  // Build relative-path keyed map for rendering
  const relFileSymbols = new Map<string, CodeSymbol[]>();
  const absToRel = new Map<string, string>();
  for (const [filePath, source] of sources) {
    const relPath = path.relative(workdir, filePath);
    absToRel.set(filePath, relPath);
    relFileSymbols.set(relPath, extractSymbols(source, relPath));
  }

  // Re-key rank scores to relative paths
  const relRankScores = new Map<string, number>();
  for (const [abs, score] of rankScores) {
    const rel = absToRel.get(abs);
    if (rel) relRankScores.set(rel, score);
  }

  const { text, tokensUsed } = renderRepoMap(relFileSymbols, relRankScores, maxTokens);
  if (!text.trim()) return '';

  return [
    `# Repository Map (~${tokensUsed} tokens)`,
    '# Files are ordered by import importance (most-imported first)',
    '',
    text,
  ].join('\n');
}

// ─── Stateful manager ────────────────────────────────────────────────────────

export interface RepoMapManagerOptions extends RepoMapOptions {
  /** Minimum milliseconds between automatic refreshes (default: 30_000) */
  refreshIntervalMs?: number;
}

/**
 * Stateful wrapper around `generateRepoMap` that caches the last result
 * and can refresh automatically on a timer or on explicit request.
 */
export class RepoMapManager {
  private workdir: string;
  private opts: Required<RepoMapManagerOptions>;
  private cachedMap: string | null = null;
  private lastBuilt = 0;
  private buildPromise: Promise<string> | null = null;

  constructor(workdir: string, opts: RepoMapManagerOptions = {}) {
    this.workdir = workdir;
    this.opts = {
      maxTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
      extraIgnore: opts.extraIgnore ?? [],
      refreshIntervalMs: opts.refreshIntervalMs ?? 30_000,
    };
  }

  /** Return the cached map text, rebuilding if stale. */
  async getMap(): Promise<string> {
    const now = Date.now();
    if (this.cachedMap !== null && now - this.lastBuilt < this.opts.refreshIntervalMs) {
      return this.cachedMap;
    }
    return this.refresh();
  }

  /** Force a rebuild and return the new map text. */
  async refresh(): Promise<string> {
    // Deduplicate concurrent calls
    if (this.buildPromise) return this.buildPromise;

    this.buildPromise = generateRepoMap(this.workdir, {
      maxTokens: this.opts.maxTokens,
      extraIgnore: this.opts.extraIgnore,
    })
      .then((map) => {
        this.cachedMap = map;
        this.lastBuilt = Date.now();
        this.buildPromise = null;
        return map;
      })
      .catch((err) => {
        this.buildPromise = null;
        throw err;
      });

    return this.buildPromise;
  }

  /** Update the token budget and invalidate the cache. */
  setMaxTokens(n: number): void {
    this.opts.maxTokens = n;
    this.cachedMap = null;
  }

  /** Returns the current token budget. */
  get maxTokens(): number {
    return this.opts.maxTokens;
  }

  /** Returns the cached map without triggering a refresh. */
  get cached(): string | null {
    return this.cachedMap;
  }
}
