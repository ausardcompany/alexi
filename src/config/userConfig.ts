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

// ============ Compaction model (auxiliary-task model) ============

/**
 * Get the user's persisted "compaction" (auxiliary-task) model id.
 *
 * Ports upstream kilocode commit `f64c6646d`, which moved the compaction
 * model setting from the Context tab to the Models tab in the webview
 * settings. In Alexi (terminal-first) the analogue is to prefer reading
 * the value from `models.compaction` (grouped alongside `defaultModel`)
 * over the legacy `context.compactionModel` key — improving
 * discoverability via `alexi config` while remaining backward compatible.
 *
 * Resolution order (first non-empty wins):
 *   1. `models.compaction` (new canonical location)
 *   2. `context.compactionModel` (legacy — emits a one-shot deprecation
 *      warning per process the first time it is read)
 *
 * Returns `undefined` when neither is set — the caller is expected to
 * reuse the primary model in that case (see
 * `src/providers/model-selection.ts::selectModelForTask`).
 */
let _warnedLegacyCompactionModel = false;

export function getConfigCompactionModel(): string | undefined {
  const config = loadFullConfig();

  const models = config.models;
  if (models && typeof models === 'object' && !Array.isArray(models)) {
    const value = (models as Record<string, unknown>).compaction;
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  const context = config.context;
  if (context && typeof context === 'object' && !Array.isArray(context)) {
    const legacy = (context as Record<string, unknown>).compactionModel;
    if (typeof legacy === 'string' && legacy.trim().length > 0) {
      if (!_warnedLegacyCompactionModel) {
        _warnedLegacyCompactionModel = true;
        // Deprecation notice — one-shot per process to avoid spam.
        // Uses the logger indirectly via console.warn; kept minimal
        // because this file cannot depend on utils/logger without
        // creating an import cycle.
        // eslint-disable-next-line no-console
        console.warn(
          '[alexi] config: `context.compactionModel` is deprecated; use `models.compaction` instead.'
        );
      }
      return legacy.trim();
    }
  }

  return undefined;
}

/**
 * Persist the user's chosen compaction (auxiliary) model.
 *
 * Always writes to the new `models.compaction` location. If the legacy
 * `context.compactionModel` key is present, it is cleared so subsequent
 * reads don't fall back to a stale value.
 */
export function setConfigCompactionModel(modelId: string): void {
  const trimmed = modelId.trim();
  if (trimmed.length === 0) {
    throw new Error('compaction model id must be a non-empty string');
  }
  const config = loadFullConfig();
  const existingModels =
    config.models && typeof config.models === 'object' && !Array.isArray(config.models)
      ? (config.models as Record<string, unknown>)
      : {};
  config.models = { ...existingModels, compaction: trimmed };

  // Clean up the legacy key so migration is one-way.
  if (config.context && typeof config.context === 'object' && !Array.isArray(config.context)) {
    const ctx = { ...(config.context as Record<string, unknown>) };
    if ('compactionModel' in ctx) {
      delete ctx.compactionModel;
      config.context = ctx;
    }
  }

  saveFullConfig(config);
}

/**
 * Test-only hook: reset the one-shot legacy-key deprecation warning cache.
 * @internal
 */
export function _resetLegacyCompactionModelWarning(): void {
  _warnedLegacyCompactionModel = false;
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

// ============ Auth token persistence ============

/**
 * Return whether Alexi should cache OAuth access tokens between CLI
 * invocations. Defaults to `true` -- persistence saves ~500ms-2s on
 * each session start by avoiding a fresh token exchange. Security-
 * sensitive deployments can opt out by setting
 * `persistAuthTokens: false` in `~/.alexi/config.json`, in which case
 * every session performs a fresh authentication and no tokens are
 * written to disk.
 *
 * The value is coerced to `boolean` -- non-boolean values fall back
 * to the `true` default so a corrupt config never disables auth
 * caching silently or vice-versa.
 */
export function getConfigPersistAuthTokens(): boolean {
  const value = getConfigValue('persistAuthTokens');
  if (typeof value === 'boolean') {
    return value;
  }
  return true;
}

/**
 * Persist the user's choice of whether to cache OAuth access tokens.
 */
export function setConfigPersistAuthTokens(enabled: boolean): void {
  setConfigValue('persistAuthTokens', enabled);
}

// ============ Tool call display preferences ============

/**
 * Controls whether MCP tool blocks (and generic tool call bodies) are
 * expanded or collapsed by default in the interactive TUI once the tool
 * has finished executing.
 *
 * Mirrors upstream kilocode's `mcp_tool_display` config option
 * (kilocode #13010 lineage) so serialized configs stay compatible.
 * Default behaviour (`'collapsed'`) matches upstream and Alexi's
 * existing behaviour in `useToolEvents.ts`, which flips `isExpanded`
 * to `false` once a tool completes.
 *
 * The value is read from the `mcpToolDisplay` (camelCase, matches the
 * rest of Alexi's config) OR `mcp_tool_display` (snake_case, matches
 * upstream serialized configs) top-level key.
 *
 * Non-string / non-`"expanded"|"collapsed"` values fall back to the
 * `'collapsed'` default so a corrupt config never crashes the TUI.
 */
export type McpToolDisplay = 'expanded' | 'collapsed';

export function getConfigMcpToolDisplay(): McpToolDisplay {
  const config = loadFullConfig();
  const raw = config.mcpToolDisplay ?? config.mcp_tool_display;
  if (raw === 'expanded' || raw === 'collapsed') {
    return raw;
  }
  return 'collapsed';
}

export function setConfigMcpToolDisplay(display: McpToolDisplay): void {
  if (display !== 'expanded' && display !== 'collapsed') {
    throw new Error(`mcpToolDisplay must be 'expanded' or 'collapsed' (got '${String(display)}')`);
  }
  setConfigValue('mcpToolDisplay', display);
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

// ============ Experimental flags ============

/**
 * Experimental feature flag: allow `task` subagents to select their own
 * model / provider / reasoning_effort.
 *
 * Mirrors the upstream opencode/kilocode `experimental.task_model_selection`
 * config flag (2026-08 sync). Default is `false` so Alexi's SAP AI Core
 * defaults are preserved for every subagent unless the operator opts in.
 *
 * Stored as `experimental.task_model_selection` inside the top-level
 * `experimental` object of `~/.alexi/config.json`, matching the upstream
 * serialized shape:
 *
 * ```json
 * { "experimental": { "task_model_selection": true } }
 * ```
 *
 * Non-boolean or missing values fall back to `false`.
 */
export function getConfigTaskModelSelection(): boolean {
  const config = loadFullConfig();
  const experimental = config.experimental;
  if (!experimental || typeof experimental !== 'object' || Array.isArray(experimental)) {
    return false;
  }
  const value = (experimental as Record<string, unknown>).task_model_selection;
  return value === true;
}

/**
 * Persist the `experimental.task_model_selection` flag.
 */
export function setConfigTaskModelSelection(enabled: boolean): void {
  const config = loadFullConfig();
  const existing =
    config.experimental &&
    typeof config.experimental === 'object' &&
    !Array.isArray(config.experimental)
      ? (config.experimental as Record<string, unknown>)
      : {};
  config.experimental = { ...existing, task_model_selection: enabled };
  saveFullConfig(config);
}

/**
 * Experimental feature flag: `code_mode` — route MCP tool calls through
 * a confined JavaScript runtime with on-demand tool discovery instead
 * of exposing every MCP tool directly.
 *
 * Ports upstream `experimental.code_mode` (kilocode commit 6b5e8a04e).
 * Reduces token overhead by not advertising every MCP tool to the model
 * on every turn — important for SAP AI Core token budgets.
 *
 * Default is `false` so vanilla SAP AI Core behaviour is preserved.
 * Non-boolean or missing values fall back to `false`.
 */
export function getConfigCodeMode(): boolean {
  const config = loadFullConfig();
  const experimental = config.experimental;
  if (!experimental || typeof experimental !== 'object' || Array.isArray(experimental)) {
    return false;
  }
  const value = (experimental as Record<string, unknown>).code_mode;
  return value === true;
}

/**
 * Persist the `experimental.code_mode` flag.
 */
export function setConfigCodeMode(enabled: boolean): void {
  const config = loadFullConfig();
  const existing =
    config.experimental &&
    typeof config.experimental === 'object' &&
    !Array.isArray(config.experimental)
      ? (config.experimental as Record<string, unknown>)
      : {};
  config.experimental = { ...existing, code_mode: enabled };
  saveFullConfig(config);
}

/**
 * Experimental feature flag: enable the task-scoped shared agent board.
 *
 * Ports upstream kilocode `experimental.sharedAgentBoard` (2026-08 sync,
 * commit `162e30d23`). When enabled, subagents spawned by the `task`
 * tool are attached to a shared board and gain access to
 * `kilo_board_read` / `kilo_board_write` for lightweight peer-to-peer
 * coordination.
 *
 * kilocode_change (upstream 2026-09 sync): the setting has been PROMOTED
 * out of `experimental.*` to the top-level `sharedAgentBoard` key
 * (commits 1c33649f9, c63f77c2e) and its default is now `true`
 * (commit 50fc57db0). The reader below implements the resolution order:
 *
 *   1. Top-level `sharedAgentBoard` (new preferred location).
 *   2. Legacy `experimental.sharedAgentBoard` (accepted for backwards
 *      compatibility; a one-time deprecation warning is logged the
 *      first time this path is hit — commit 6cfb025f9).
 *   3. Default `true`.
 *
 * `setConfigSharedAgentBoard` writes the new top-level key AND, if the
 * legacy key is present, removes it so the retired location does not
 * linger. Callers that want to keep the legacy shape (e.g. a fixture
 * exercising the deprecation warning) must write to `config.experimental`
 * directly via `saveFullConfig`.
 */
let _sharedAgentBoardDeprecationWarned = false;

function warnLegacySharedAgentBoardOnce(): void {
  if (_sharedAgentBoardDeprecationWarned) {
    return;
  }
  _sharedAgentBoardDeprecationWarned = true;
  // Deferred import so a bare `require('userConfig')` in a test harness
  // that does not want console noise can still reach the accessors.
  import('../utils/logger.js')
    .then(({ logger }) => {
      logger.warn(
        '[config] experimental.sharedAgentBoard is deprecated — move the setting to top-level "sharedAgentBoard" in ~/.alexi/config.json'
      );
    })
    .catch(() => {
      // Non-fatal: warning is best-effort.
    });
}

/**
 * Reset the once-per-process deprecation-warning latch. Exposed for
 * tests so consecutive fixtures can each observe the warning without
 * spawning a fresh process.
 */
export function _resetSharedAgentBoardDeprecationWarningLatchForTests(): void {
  _sharedAgentBoardDeprecationWarned = false;
}

export function getConfigSharedAgentBoard(): boolean {
  const config = loadFullConfig();

  // Preferred: top-level `sharedAgentBoard`.
  const topLevel = config.sharedAgentBoard;
  if (typeof topLevel === 'boolean') {
    return topLevel;
  }

  // Legacy: `experimental.sharedAgentBoard`. Emits a one-time
  // deprecation warning when the key is actually consulted.
  const experimental = config.experimental;
  if (experimental && typeof experimental === 'object' && !Array.isArray(experimental)) {
    const legacy = (experimental as Record<string, unknown>).sharedAgentBoard;
    if (typeof legacy === 'boolean') {
      warnLegacySharedAgentBoardOnce();
      return legacy;
    }
  }

  // Default: enabled (kilocode 50fc57db0).
  return true;
}

/**
 * Persist the shared-agent-board flag to the top-level `sharedAgentBoard`
 * key. Also removes any legacy `experimental.sharedAgentBoard` entry so
 * the config file converges on the new shape on the next write.
 */
export function setConfigSharedAgentBoard(enabled: boolean): void {
  const config = loadFullConfig();
  config.sharedAgentBoard = enabled;

  if (
    config.experimental &&
    typeof config.experimental === 'object' &&
    !Array.isArray(config.experimental)
  ) {
    const experimental = { ...(config.experimental as Record<string, unknown>) };
    if ('sharedAgentBoard' in experimental) {
      delete experimental.sharedAgentBoard;
      if (Object.keys(experimental).length === 0) {
        delete config.experimental;
      } else {
        config.experimental = experimental;
      }
    }
  }

  saveFullConfig(config);
}

/**
 * Resolve whether the shared agent board is enabled for the current process.
 *
 * Ports upstream kilocode #14013 — the board can be enabled via any of:
 *   1. `experimental.sharedAgentBoard: true` in `~/.alexi/config.json`
 *   2. `KILO_EXPERIMENTAL_SHARED_AGENT_BOARD=1` in the environment
 *   3. `KILO_EXPERIMENTAL=1` umbrella flag in the environment
 *
 * The rule is a boolean OR: an explicit config `false` does NOT override a
 * set env flag. This mirrors upstream `BoardEnabled.resolve` so operators
 * can flip the board on temporarily (CI, Docker, ad-hoc testing) without
 * editing the persistent config file, while a permanent opt-in via config
 * continues to work when no env vars are set.
 *
 * Env flag values are compared literally to `'1'` — any other value
 * (`'0'`, `'true'`, empty, unset) is treated as unset. This keeps the
 * enable path unambiguous and prevents `KILO_EXPERIMENTAL=0` from being
 * misread as an opt-in.
 */
export function isBoardEnabled(): boolean {
  return (
    getConfigSharedAgentBoard() ||
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD === '1' ||
    process.env.KILO_EXPERIMENTAL === '1'
  );
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

  // Ports kilocode `19a2a3c4d`: when global config changes, per-instance
  // cached config becomes stale. Flush every registered instance cache
  // so subsequent reads see the fresh values (SAP AI Core credentials
  // refresh, routing rewrites, etc.). Dynamic import keeps this file
  // free of a boot-time cycle with `invalidation.ts` consumers.
  if (dispose) {
    void import('./invalidation.js').then(({ invalidateGlobalConfig }) => {
      invalidateGlobalConfig();
    });
  }
}

// ============ Session retention policy ============

/**
 * Machine-wide session retention policy.
 *
 * Ports upstream opencode `Info.retention` (2026-09 sync). When enabled,
 * a background sweep permanently deletes sessions older than
 * `maxAgeDays`. Alexi keeps the schema/reader/writer here so the CLI can
 * surface the setting via `alexi config`; the actual retention *runner*
 * is intentionally deferred (upstream centralises this in a backend
 * service that Alexi does not yet own).
 *
 * Serialized shape in `~/.alexi/config.json`:
 * ```json
 * { "retention": { "enabled": true, "maxAgeDays": 30 } }
 * ```
 *
 * - `enabled` defaults to `false` — deletion is permanent, so the
 *   feature is strictly opt-in.
 * - `maxAgeDays` defaults to 30, clamped to a minimum of 1. Values that
 *   are not positive finite integers fall back to the default rather
 *   than throwing, so a corrupt config never wedges the CLI.
 */
export interface SessionRetentionPolicy {
  /**
   * Whether automatic deletion is enabled. `false` (or missing) means
   * the retention runner is a no-op even if `maxAgeDays` is set.
   */
  enabled: boolean;
  /**
   * Days a session is kept before retention deletes it. Minimum 1.
   */
  maxAgeDays: number;
}

const DEFAULT_RETENTION_MAX_AGE_DAYS = 30;

/**
 * Return the effective session-retention policy. When `retention` is
 * absent from `~/.alexi/config.json`, returns the safe default
 * (`enabled: false`, `maxAgeDays: 30`) so callers can rely on the
 * shape being present without null-checks.
 */
export function getConfigSessionRetention(): SessionRetentionPolicy {
  const config = loadFullConfig();
  const raw = config.retention;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { enabled: false, maxAgeDays: DEFAULT_RETENTION_MAX_AGE_DAYS };
  }
  const rec = raw as Record<string, unknown>;
  const enabled = rec.enabled === true;
  let maxAgeDays = DEFAULT_RETENTION_MAX_AGE_DAYS;
  const rawMax = rec.maxAgeDays;
  if (typeof rawMax === 'number' && isFinite(rawMax) && rawMax >= 1) {
    maxAgeDays = Math.floor(rawMax);
  }
  return { enabled, maxAgeDays };
}

/**
 * Persist the session-retention policy. Validates that `maxAgeDays` is
 * a positive integer; throws otherwise so callers (e.g. a `config set`
 * subcommand) can surface a clear error message.
 */
export function setConfigSessionRetention(policy: Partial<SessionRetentionPolicy>): void {
  if (
    policy.maxAgeDays !== undefined &&
    (!Number.isFinite(policy.maxAgeDays) || policy.maxAgeDays < 1)
  ) {
    throw new Error(
      `retention.maxAgeDays must be a positive integer >= 1 (got ${String(policy.maxAgeDays)})`
    );
  }
  const config = loadFullConfig();
  const existing =
    config.retention && typeof config.retention === 'object' && !Array.isArray(config.retention)
      ? (config.retention as Record<string, unknown>)
      : {};
  const merged: Record<string, unknown> = { ...existing };
  if (policy.enabled !== undefined) {
    merged.enabled = policy.enabled;
  }
  if (policy.maxAgeDays !== undefined) {
    merged.maxAgeDays = Math.floor(policy.maxAgeDays);
  }
  config.retention = merged;
  saveFullConfig(config);
}
