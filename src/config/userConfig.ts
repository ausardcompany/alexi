/**
 * User Configuration
 * Shared module for reading/writing ~/.alexi/config.json
 *
 * Provides a centralized API for persistent user preferences.
 * Other modules (sound, interactive, providers) should use this
 * instead of reimplementing config.json I/O inline.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// ============ Constants ============

export const CONFIG_DIR = path.join(os.homedir(), '.alexi');
export const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// ============ macOS Managed Preferences ============

const MANAGED_DOMAIN = 'ai.alexi.cli';

interface ManagedConfig {
  disableTelemetry?: boolean;
  allowedProviders?: string[];
  defaultModel?: string;
  proxyUrl?: string;
}

function readManagedKey(key: string): string | null {
  try {
    const result = execSync(`defaults read ${MANAGED_DOMAIN} ${key} 2>/dev/null`, {
      encoding: 'utf-8',
      timeout: 5000,
    });
    return result.trim();
  } catch {
    return null;
  }
}

export function readManagedPreferences(): ManagedConfig | null {
  if (os.platform() !== 'darwin') {
    return null;
  }

  try {
    const config: ManagedConfig = {};

    const disableTelemetry = readManagedKey('disableTelemetry');
    if (disableTelemetry !== null) {
      config.disableTelemetry = disableTelemetry === '1' || disableTelemetry === 'true';
    }

    const allowedProviders = readManagedKey('allowedProviders');
    if (allowedProviders !== null) {
      config.allowedProviders = allowedProviders.split(',').map((s) => s.trim());
    }

    const defaultModel = readManagedKey('defaultModel');
    if (defaultModel !== null) {
      config.defaultModel = defaultModel;
    }

    const proxyUrl = readManagedKey('proxyUrl');
    if (proxyUrl !== null) {
      config.proxyUrl = proxyUrl;
    }

    return Object.keys(config).length > 0 ? config : null;
  } catch {
    return null;
  }
}

// ============ Low-level helpers ============

/**
 * Ensure the config directory exists
 */
export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load the full config object from disk.
 * Returns an empty object if the file doesn't exist or is corrupt.
 * Managed preferences (macOS MDM) take precedence over user config.
 */
export function loadFullConfig(): Record<string, unknown> {
  ensureConfigDir();

  let config: Record<string, unknown> = {};

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(content) as Record<string, unknown>;
    } catch {
      // Return empty config on parse error (corrupt file)
      config = {};
    }
  }

  // Apply managed preferences (macOS MDM) - these take precedence
  const managedPrefs = readManagedPreferences();
  if (managedPrefs) {
    if (managedPrefs.disableTelemetry !== undefined) {
      config.telemetryEnabled = !managedPrefs.disableTelemetry;
    }
    if (managedPrefs.defaultModel) {
      config.defaultModel = managedPrefs.defaultModel;
    }
    if (managedPrefs.proxyUrl) {
      config.proxyUrl = managedPrefs.proxyUrl;
    }
    if (managedPrefs.allowedProviders) {
      config.allowedProviders = managedPrefs.allowedProviders;
    }
  }

  return config;
}

/**
 * Save the full config object to disk (overwrites entire file).
 */
export function saveFullConfig(config: Record<string, unknown>): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

// ============ Key-level accessors ============

/**
 * Read a single top-level key from config.
 * Returns `undefined` when the key is absent.
 */
export function getConfigValue(key: string): unknown {
  const config = loadFullConfig();
  return config[key];
}

/**
 * Write a single top-level key to config, preserving all other keys.
 * Performs a read-modify-write cycle.
 */
export function setConfigValue(key: string, value: unknown): void {
  const config = loadFullConfig();
  config[key] = value;
  saveFullConfig(config);
}

/**
 * Delete a single top-level key from config.
 */
export function deleteConfigValue(key: string): void {
  const config = loadFullConfig();
  delete config[key];
  saveFullConfig(config);
}

// ============ Typed convenience accessors ============

/**
 * Get the user's persisted default model, or undefined if not set.
 */
export function getConfigDefaultModel(): string | undefined {
  const value = getConfigValue('defaultModel');
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

/**
 * Persist the user's chosen default model.
 */
export function setConfigDefaultModel(modelId: string): void {
  setConfigValue('defaultModel', modelId);
}

/**
 * Get the user's persisted default agent slug, or undefined if not set.
 * Read from the `agent` top-level key in ~/.alexi/config.json.
 *
 * Returns `undefined` for non-string values, empty strings, or
 * whitespace-only strings.
 */
export function getConfigDefaultAgent(): string | undefined {
  const value = getConfigValue('agent');
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return undefined;
}

/**
 * Persist the user's chosen default agent slug.
 */
export function setConfigDefaultAgent(slug: string): void {
  setConfigValue('agent', slug);
}

/**
 * Clear the user's default agent setting.
 */
export function clearConfigDefaultAgent(): void {
  deleteConfigValue('agent');
}

// ============ Indexing (custom file extensions) ============

/**
 * Regex describing a valid additional-extension value: must begin with `.`
 * followed by one or more alphanumerics / `-` / `_`. Rejects `proto`,
 * `.`, `..foo`, `.foo/bar`, whitespace, etc.
 */
const EXTENSION_PATTERN = /^\.[A-Za-z0-9_-]+$/;

/**
 * Regex describing a bare extension (no leading dot). Used when parsing
 * the `indexing.extensions` field of `.alexi/config.json` and the flat
 * `.alexi/extensions` file, where the user may write `mdx` or `.mdx`
 * interchangeably.
 */
const BARE_EXTENSION_PATTERN = /^[A-Za-z0-9_-]+$/;

/**
 * Validate a single additional-extension entry.
 * Returns the trimmed extension when valid, or throws when invalid.
 */
export function validateAdditionalExtension(ext: unknown): string {
  if (typeof ext !== 'string') {
    throw new Error(`indexing.additionalExtensions entries must be strings (got ${typeof ext})`);
  }
  const trimmed = ext.trim();
  if (!EXTENSION_PATTERN.test(trimmed)) {
    throw new Error(
      `indexing.additionalExtensions entry '${ext}' is invalid: must start with '.' and contain only [A-Za-z0-9_-] (e.g. '.proto')`
    );
  }
  return trimmed.toLowerCase();
}

/**
 * Normalize an extension entry to dotted lower-case form.
 * Accepts both `.mdx` and `mdx` shapes; returns `null` for anything
 * else (including empty strings, non-strings, path-like values).
 */
function normalizeExtension(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (EXTENSION_PATTERN.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (BARE_EXTENSION_PATTERN.test(trimmed)) {
    return `.${trimmed.toLowerCase()}`;
  }
  return null;
}

/**
 * Extract dotted, lower-cased, deduped extensions from an `indexing`
 * section of a parsed config object. Reads both `additionalExtensions`
 * (canonical, strictly dotted) and `extensions` (alias, accepts bare
 * or dotted names). Invalid entries are silently dropped.
 */
function extractIndexingExtensions(indexing: unknown): string[] {
  if (!indexing || typeof indexing !== 'object' || Array.isArray(indexing)) {
    return [];
  }
  const rec = indexing as Record<string, unknown>;
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (normalized: string | null): void => {
    if (normalized === null) {
      return;
    }
    if (seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    out.push(normalized);
  };

  // `additionalExtensions`: strict dotted form (backward compatible).
  if (Array.isArray(rec.additionalExtensions)) {
    for (const entry of rec.additionalExtensions) {
      if (typeof entry !== 'string') {
        continue;
      }
      const trimmed = entry.trim();
      if (!EXTENSION_PATTERN.test(trimmed)) {
        continue;
      }
      push(trimmed.toLowerCase());
    }
  }
  // `extensions`: lax alias, accepts `mdx` or `.mdx`.
  if (Array.isArray(rec.extensions)) {
    for (const entry of rec.extensions) {
      push(normalizeExtension(entry));
    }
  }
  return out;
}

/**
 * Load the configured additional file extensions for indexing from the
 * user's global config at `~/.alexi/config.json`.
 *
 * Returns an array of normalized extensions (each starting with `.` and
 * lower-cased). Reads both `indexing.additionalExtensions` (canonical,
 * dotted) and `indexing.extensions` (alias, accepts bare names).
 * Invalid entries are silently dropped so that a corrupt config never
 * crashes tool execution.
 */
export function getConfigAdditionalExtensions(): string[] {
  const config = loadFullConfig();
  return extractIndexingExtensions(config.indexing);
}

/**
 * Read extensions from a project-local `.alexi/config.json` file at the
 * given directory. Returns an empty array when the file is missing,
 * unreadable, or does not declare any indexing extensions. Never throws.
 */
export function readProjectConfigExtensions(cwd: string): string[] {
  const projectConfigPath = path.join(cwd, '.alexi', 'config.json');
  let content: string;
  try {
    content = fs.readFileSync(projectConfigPath, 'utf-8');
  } catch {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return [];
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return [];
  }
  return extractIndexingExtensions((parsed as Record<string, unknown>).indexing);
}

/**
 * Read extensions from a flat `.alexi/extensions` file at the given
 * directory. Format: one extension per line, blank lines are ignored,
 * lines starting with `#` (after optional leading whitespace) are
 * treated as comments. Extensions may be written with or without a
 * leading dot (`mdx`, `.mdx`). Returns an empty array when the file is
 * missing or unreadable. Never throws.
 */
export function readProjectExtensionsFile(cwd: string): string[] {
  const extensionsFilePath = path.join(cwd, '.alexi', 'extensions');
  let content: string;
  try {
    content = fs.readFileSync(extensionsFilePath, 'utf-8');
  } catch {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0) {
      continue;
    }
    if (line.startsWith('#')) {
      continue;
    }
    // Support inline comments: `mdx  # markdown extended`
    const withoutComment = line.split('#', 1)[0].trim();
    if (withoutComment.length === 0) {
      continue;
    }
    const normalized = normalizeExtension(withoutComment);
    if (normalized === null) {
      continue;
    }
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

/**
 * Return the effective set of indexing extensions for a given working
 * directory. Merges (in this precedence order, later sources add to
 * earlier ones):
 *
 *   1. Global user config (`~/.alexi/config.json`, `indexing.extensions`
 *      or `indexing.additionalExtensions`)
 *   2. Project config (`<cwd>/.alexi/config.json`, same fields)
 *   3. Project extensions file (`<cwd>/.alexi/extensions`)
 *
 * Result is deduplicated case-insensitively and normalized to dotted
 * lower-case form (e.g. `.mdx`, `.astro`). Never throws.
 */
export function getIndexingExtensions(cwd?: string): string[] {
  const globalExts = getConfigAdditionalExtensions();
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (ext: string): void => {
    if (seen.has(ext)) {
      return;
    }
    seen.add(ext);
    out.push(ext);
  };
  for (const ext of globalExts) {
    push(ext);
  }
  if (cwd) {
    for (const ext of readProjectConfigExtensions(cwd)) {
      push(ext);
    }
    for (const ext of readProjectExtensionsFile(cwd)) {
      push(ext);
    }
  }
  return out;
}

/**
 * Persist the list of additional file extensions for indexing.
 * Validates every entry; throws on the first invalid one so callers
 * (e.g. a `config set` CLI command) can surface the error to the user.
 */
export function setConfigAdditionalExtensions(extensions: string[]): void {
  if (!Array.isArray(extensions)) {
    throw new Error('indexing.additionalExtensions must be an array of strings');
  }
  const normalized = extensions.map(validateAdditionalExtension);
  const config = loadFullConfig();
  const existingIndexing =
    config.indexing && typeof config.indexing === 'object' && !Array.isArray(config.indexing)
      ? (config.indexing as Record<string, unknown>)
      : {};
  config.indexing = { ...existingIndexing, additionalExtensions: normalized };
  saveFullConfig(config);
}

// ============ Batch update with options ============

export interface UpdateGlobalOptions {
  dispose?: boolean;
}

/**
 * Update multiple config keys at once.
 * The `dispose` option controls whether any config instances should be disposed after update.
 * Default behavior (dispose=true) is preserved for backward compatibility.
 */
export function updateGlobal(
  updates: Partial<Record<string, unknown>>,
  options: UpdateGlobalOptions = {}
): void {
  const { dispose = true } = options;

  const config = loadFullConfig();
  Object.assign(config, updates);
  saveFullConfig(config);

  // Disposal logic would go here if needed
  // For now, this is a placeholder for future config instance management
  if (dispose) {
    // In a more complex system, this would dispose of cached config instances
    // Currently, Alexi doesn't maintain config instances, so this is a no-op
  }
}
