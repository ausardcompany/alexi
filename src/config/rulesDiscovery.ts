/**
 * Rules File Discovery
 *
 * Locate and load `*.md` rule files for injection into the assembled system
 * prompt. Historically Alexi only scanned `<workdir>/.alexi/rules/*.md`; this
 * module expands discovery to accept common alternative rule directory
 * conventions (`.kilo/`, `.kilocode/`, `.opencode/`, `.cline/`, root-level
 * `rules/`, and `~/.alexi/rules/`) and honors a configurable `rulesPath` in
 * `.alexi/config.json` (project or global).
 *
 * Discovery order — LOWER-INDEX PATHS TAKE PRECEDENCE ON CONFLICT:
 *   1. Custom paths from project `<workdir>/.alexi/config.json:rulesPath`
 *   2. Custom paths from global `~/.alexi/config.json:rulesPath`
 *   3. Default project-level directories, in this order:
 *        - `<workdir>/.alexi/rules/`
 *        - `<workdir>/.kilo/rules/`
 *        - `<workdir>/.kilocode/rules/`
 *        - `<workdir>/.opencode/rules/`
 *        - `<workdir>/.cline/rules/`
 *        - `<workdir>/rules/`
 *   4. User-level `~/.alexi/rules/`
 *
 * When two rule files share the same basename we log a warning and keep the
 * higher-precedence copy (first-seen wins). All discovered files (including
 * shadowed ones) are logged at INFO level so operators can see exactly which
 * rules the model receives at session start.
 *
 * The `basename` (filename minus extension) is used as the conflict key. That
 * matches how prompts already tag rules via `<rule file="...">` in
 * `agent/system.ts`, and keeps conflicts across directory conventions
 * detectable (e.g. `.alexi/rules/style.md` vs `.kilo/rules/style.md`).
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { stripUtf8Bom } from '../utils/frontmatter.js';
import { logger } from '../utils/logger.js';

/**
 * Default project-relative directories scanned for `*.md` rule files, in
 * precedence order (first wins on conflict).
 */
export const DEFAULT_PROJECT_RULE_DIRS: readonly string[] = [
  '.alexi/rules',
  '.kilo/rules',
  '.kilocode/rules',
  '.opencode/rules',
  '.cline/rules',
  'rules',
];

/** Default user-level rules directory (resolved via `os.homedir()`). */
export const DEFAULT_USER_RULE_DIR = '.alexi/rules';

/**
 * A single discovered rule file.
 */
export interface DiscoveredRule {
  /** Absolute path to the file on disk. */
  filePath: string;
  /** Basename of the file (e.g. `style.md`). */
  fileName: string;
  /** Filename minus extension — used as the conflict key (e.g. `style`). */
  ruleKey: string;
  /** Human-readable source of this rule ("project", "user", "custom"). */
  source: 'project' | 'user' | 'custom';
  /** The directory (relative or absolute) this rule was discovered under. */
  originDir: string;
  /** Size in bytes of the file at read time. */
  sizeBytes: number;
  /** Trimmed textual contents of the file. */
  content: string;
}

/**
 * A single conflict record — two files that resolve to the same rule key.
 */
export interface RuleConflict {
  ruleKey: string;
  /** The path that won (higher precedence, first seen). */
  winner: string;
  /** Path(s) that were shadowed. */
  shadowed: string[];
}

/**
 * Result bundle from a discovery pass.
 */
export interface RulesDiscoveryResult {
  /** Rules that survived conflict resolution, in emission order. */
  rules: DiscoveredRule[];
  /** Every file examined, including shadowed duplicates. Useful for logging. */
  allFiles: DiscoveredRule[];
  /** Conflicts detected during discovery. */
  conflicts: RuleConflict[];
  /** Absolute paths of directories actually scanned (existing + accessible). */
  scannedDirs: string[];
}

/**
 * Options for {@link discoverRules}.
 */
export interface DiscoverRulesOptions {
  /** Project working directory. Defaults to `process.cwd()`. */
  workdir?: string;
  /**
   * Home directory override (primarily for tests). Defaults to
   * `os.homedir()`.
   */
  homedir?: string;
  /**
   * Override for the resolved list of custom rules paths. When provided,
   * `discoverRules` does NOT read `.alexi/config.json` and treats these
   * as the highest-priority paths. Useful for tests and CLI overrides.
   */
  customPaths?: string[];
  /**
   * Skip emitting INFO/warn logs from this function. Consumers that already
   * log their own summary (or tests that don't want log spam) pass `true`.
   */
  silent?: boolean;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Read `.alexi/config.json:rulesPath` from a given config file, returning a
 * normalized string array. Missing files, parse errors, and malformed shapes
 * silently degrade to `[]` so a broken config never crashes prompt assembly.
 */
function readRulesPathFromConfigFile(configPath: string): string[] {
  let raw: string;
  try {
    raw = fs.readFileSync(configPath, 'utf-8');
  } catch {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return [];
  }
  const value = (parsed as Record<string, unknown>).rulesPath;
  return normalizeRulesPathValue(value);
}

/**
 * Coerce a `rulesPath` config value into a trimmed non-empty string array.
 * Accepts either a single string (`"custom/rules"`) or an array of strings
 * (`["custom/rules", ".company/standards"]`). All other shapes yield `[]`.
 */
export function normalizeRulesPathValue(value: unknown): string[] {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }
  if (Array.isArray(value)) {
    const out: string[] = [];
    for (const entry of value) {
      if (typeof entry !== 'string') {
        continue;
      }
      const trimmed = entry.trim();
      if (trimmed.length > 0) {
        out.push(trimmed);
      }
    }
    return out;
  }
  return [];
}

/**
 * Resolve a possibly-relative rules directory. `~` at the start is expanded
 * to the given home directory. Otherwise `path.resolve` is applied against
 * `workdir` so that project configs can use paths like `custom/rules`.
 */
function resolveRuleDir(entry: string, workdir: string, homedir: string): string {
  if (entry === '~' || entry.startsWith('~/') || entry.startsWith(`~${path.sep}`)) {
    return path.resolve(homedir, entry.slice(2));
  }
  if (path.isAbsolute(entry)) {
    return path.resolve(entry);
  }
  return path.resolve(workdir, entry);
}

/**
 * Load one file safely — returns null on any I/O or decode failure so that
 * missing/unreadable rule files degrade gracefully rather than crashing
 * discovery.
 */
function loadRuleFile(
  filePath: string,
  source: DiscoveredRule['source'],
  originDir: string
): DiscoveredRule | null {
  let stat: fs.Stats;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return null;
  }
  if (!stat.isFile()) {
    return null;
  }
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
  const content = stripUtf8Bom(raw).trim();
  if (content.length === 0) {
    return null;
  }
  const fileName = path.basename(filePath);
  const ruleKey = fileName.replace(/\.md$/i, '');
  return {
    filePath,
    fileName,
    ruleKey,
    source,
    originDir,
    sizeBytes: stat.size,
    content,
  };
}

/**
 * Enumerate all `*.md` files (sorted, non-recursive) under `dir`. Returns
 * `[]` when the directory does not exist or cannot be read.
 */
function listMarkdownFiles(dir: string): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) {
      continue;
    }
    if (!e.name.toLowerCase().endsWith('.md')) {
      continue;
    }
    out.push(path.join(dir, e.name));
  }
  return out.sort();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve the effective list of custom `rulesPath` entries for a given
 * project working directory, merging project config (`<workdir>/.alexi/
 * config.json`) with global user config (`~/.alexi/config.json`). Project
 * entries win in precedence; global entries append.
 */
export function resolveCustomRulesPaths(workdir: string, homedir: string): string[] {
  const projectEntries = readRulesPathFromConfigFile(path.join(workdir, '.alexi', 'config.json'));
  const globalEntries = readRulesPathFromConfigFile(path.join(homedir, '.alexi', 'config.json'));
  // Deduplicate while preserving the project-first precedence order.
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const entry of [...projectEntries, ...globalEntries]) {
    if (seen.has(entry)) {
      continue;
    }
    seen.add(entry);
    merged.push(entry);
  }
  return merged;
}

/**
 * Discover all rule files applicable to the given workdir, resolving
 * conflicts and emitting startup logs.
 *
 * @see {@link RulesDiscoveryResult}
 */
export function discoverRules(options: DiscoverRulesOptions = {}): RulesDiscoveryResult {
  const workdir = path.resolve(options.workdir ?? process.cwd());
  const homedir = options.homedir ?? os.homedir();

  const customRaw = options.customPaths ?? resolveCustomRulesPaths(workdir, homedir);

  // Build a precedence-ordered list of (directory, source) pairs. Duplicates
  // (same resolved absolute path) are collapsed so a custom path that also
  // happens to be a default doesn't produce phantom conflicts.
  const seenDirs = new Set<string>();
  const dirs: Array<{ dir: string; source: DiscoveredRule['source'] }> = [];
  const pushDir = (rawDir: string, source: DiscoveredRule['source']): void => {
    const resolved = resolveRuleDir(rawDir, workdir, homedir);
    if (seenDirs.has(resolved)) {
      return;
    }
    seenDirs.add(resolved);
    dirs.push({ dir: resolved, source });
  };

  // 1. Custom paths (highest precedence).
  for (const entry of customRaw) {
    pushDir(entry, 'custom');
  }
  // 2. Default project directories.
  for (const rel of DEFAULT_PROJECT_RULE_DIRS) {
    pushDir(rel, 'project');
  }
  // 3. User-level `~/.alexi/rules`.
  pushDir(path.join(homedir, DEFAULT_USER_RULE_DIR), 'user');

  // Walk every candidate directory that actually exists.
  const allFiles: DiscoveredRule[] = [];
  const scannedDirs: string[] = [];
  for (const { dir, source } of dirs) {
    const mdFiles = listMarkdownFiles(dir);
    if (mdFiles.length === 0) {
      // Still note the directory as scanned if it exists — helps operators
      // realize an empty `.alexi/rules/` is actually being looked at.
      if (fs.existsSync(dir)) {
        scannedDirs.push(dir);
      }
      continue;
    }
    scannedDirs.push(dir);
    for (const f of mdFiles) {
      const loaded = loadRuleFile(f, source, dir);
      if (loaded) {
        allFiles.push(loaded);
      }
    }
  }

  // Resolve conflicts by rule key. First occurrence wins because we appended
  // in strict precedence order above.
  const conflictMap = new Map<string, RuleConflict>();
  const winners = new Map<string, DiscoveredRule>();
  for (const file of allFiles) {
    const existing = winners.get(file.ruleKey);
    if (!existing) {
      winners.set(file.ruleKey, file);
      continue;
    }
    let record = conflictMap.get(file.ruleKey);
    if (!record) {
      record = { ruleKey: file.ruleKey, winner: existing.filePath, shadowed: [] };
      conflictMap.set(file.ruleKey, record);
    }
    record.shadowed.push(file.filePath);
  }

  const conflicts = Array.from(conflictMap.values());
  const rules = allFiles.filter((f) => winners.get(f.ruleKey) === f);

  if (!options.silent) {
    logRulesDiscovery({ rules, allFiles, conflicts, scannedDirs });
  }

  return { rules, allFiles, conflicts, scannedDirs };
}

/**
 * Emit startup logs for a discovery pass. Extracted so callers that build a
 * `RulesDiscoveryResult` externally (e.g. tests, or a `--silent` code path
 * that wants to log later) can still opt in.
 */
export function logRulesDiscovery(result: RulesDiscoveryResult): void {
  const { rules, conflicts } = result;
  if (rules.length === 0) {
    logger.info('Discovered 0 rules files');
    return;
  }
  for (const rule of rules) {
    logger.info(`Loaded rules from ${rule.filePath} (${rule.sizeBytes} bytes)`);
  }
  logger.info(`Discovered ${rules.length} rules files`);
  for (const conflict of conflicts) {
    for (const shadowed of conflict.shadowed) {
      logger.warn(`Rule '${conflict.ruleKey}' redefined in ${shadowed} (using ${conflict.winner})`);
    }
  }
}
