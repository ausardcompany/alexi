/**
 * Git-based MCP Plugin Installer
 *
 * Installs MCP servers directly from GitHub / GitLab / Bitbucket
 * repositories. Wired to the `ax mcp install <repo-url>` CLI surface.
 *
 * The installer:
 *
 * - Parses public HTTPS URLs, SSH URLs (`git@host:owner/repo`), and a
 *   handful of shorthand shapes (bare `owner/repo`, `github:owner/repo`,
 *   `gitlab:owner/repo`, `bitbucket:owner/repo`) into a canonical repo
 *   descriptor.
 * - Clones the resolved repo via `git clone` (spawned as a subprocess,
 *   argv-only — no shell — so untrusted URLs cannot inject flags).
 * - Auto-detects the MCP entry point from either `.alexi/mcp.json` in
 *   the repo root, or the `mcp` / `bin` fields of `package.json`.
 * - Registers the plugin in `~/.alexi/mcp-servers.json` via
 *   {@link addMcpServer}, storing the origin `git` metadata so the
 *   entry can later be refreshed on demand.
 *
 * Compared with the older {@link './git-resolver.ts'} module, this
 * installer targets end-user plugin installation (single-shot clone
 * into `~/.alexi/mcp-plugins/<name>/`, registration in the persisted
 * MCP server list) rather than the resolver's cache + revalidate flow
 * used internally by the plugin loader.
 */

import { spawn } from 'child_process';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { addMcpServer, type McpServerConfig } from './config.js';

/**
 * Default install root for git-based MCP plugins. Each plugin lives in
 * its own subdirectory named after the resolved plugin name.
 */
export const DEFAULT_MCP_PLUGINS_DIR = path.join(os.homedir(), '.alexi', 'mcp-plugins');

/** Provider tag inferred from the URL/shorthand. */
export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'custom';

const PROVIDER_HOSTS: Record<Exclude<GitProvider, 'custom'>, string> = {
  github: 'github.com',
  gitlab: 'gitlab.com',
  bitbucket: 'bitbucket.org',
};

const HOST_TO_PROVIDER: Record<string, GitProvider> = {
  'github.com': 'github',
  'gitlab.com': 'gitlab',
  'bitbucket.org': 'bitbucket',
};

/** Result of {@link parseGitUrl}. */
export interface ParsedRepoUrl {
  /** Provider tag, or `custom` for self-hosted hosts. */
  provider: GitProvider;
  /** Canonical hostname (e.g. `github.com`). */
  host: string;
  /** Owner / organisation segment. */
  owner: string;
  /** Repository name (with the `.git` suffix stripped). */
  repo: string;
  /**
   * Canonical clone URL. HTTPS for shorthand and HTTPS inputs; the
   * original SSH shape is preserved for SSH inputs so the caller can
   * hand it directly to `git clone`.
   */
  url: string;
  /** True when the input was a SSH URL. */
  isSsh: boolean;
  /**
   * Suggested plugin name derived from the repo segment. Sanitised to
   * a filesystem-safe slug via {@link sanitizePluginName}.
   */
  name: string;
}

// Character classes intentionally forbid `-` at either end and disallow
// separator characters like `/`, `:`, `#`, `@` so parsers below can rely
// on structural anchors.
const SEGMENT_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;

const SHORTHAND_RE = /^([A-Za-z0-9][A-Za-z0-9_.-]*)\/([A-Za-z0-9][A-Za-z0-9_.-]*)$/;
const PROVIDER_SHORTHAND_RE =
  /^(github|gitlab|bitbucket):([A-Za-z0-9][A-Za-z0-9_.-]*)\/([A-Za-z0-9][A-Za-z0-9_.-]*)$/;

/**
 * Turn a repo name into a filesystem-safe plugin slug. Non-alphanumeric
 * characters collapse to a single dash, leading / trailing dashes are
 * trimmed.
 */
export function sanitizePluginName(name: string): string {
  return name
    .replace(/\.git$/i, '')
    .replace(/[^A-Za-z0-9_.-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .replace(/-+/g, '-');
}

function stripGitSuffix(value: string): string {
  return value.replace(/\.git$/i, '');
}

function assertSegment(value: string, kind: 'owner' | 'repo', input: string): void {
  if (!SEGMENT_RE.test(value)) {
    throw new Error(`git url: invalid ${kind} segment '${value}' in ${input}`);
  }
}

/**
 * Parse a repo reference in any of the supported shapes:
 *
 * - `owner/repo`                — GitHub shorthand (default provider).
 * - `github:owner/repo`         — GitHub explicit shorthand.
 * - `gitlab:owner/repo`         — GitLab shorthand.
 * - `bitbucket:owner/repo`      — Bitbucket shorthand.
 * - `https://host/owner/repo`   — Full HTTPS URL (with or without `.git`).
 * - `git@host:owner/repo(.git)` — SSH URL.
 *
 * Throws with a specific message on anything else so operator-facing
 * errors are actionable. Rejects segments containing shell
 * metacharacters, whitespace, `.git`-suffixed repo values, or leading
 * dashes.
 */
export function parseGitUrl(input: string): ParsedRepoUrl {
  if (typeof input !== 'string' || input.length === 0) {
    throw new Error('git url: empty URL is not allowed');
  }
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new Error('git url: empty URL is not allowed');
  }

  // Provider-prefixed shorthand (`github:owner/repo`).
  const providerMatch = PROVIDER_SHORTHAND_RE.exec(trimmed);
  if (providerMatch) {
    const provider = providerMatch[1] as Exclude<GitProvider, 'custom'>;
    const owner = providerMatch[2];
    const repo = stripGitSuffix(providerMatch[3]);
    assertSegment(owner, 'owner', trimmed);
    assertSegment(repo, 'repo', trimmed);
    const host = PROVIDER_HOSTS[provider];
    return {
      provider,
      host,
      owner,
      repo,
      url: `https://${host}/${owner}/${repo}.git`,
      isSsh: false,
      name: sanitizePluginName(repo),
    };
  }

  // Bare shorthand `owner/repo` (defaults to GitHub).
  const shorthandMatch = SHORTHAND_RE.exec(trimmed);
  if (shorthandMatch) {
    const owner = shorthandMatch[1];
    const repo = stripGitSuffix(shorthandMatch[2]);
    assertSegment(owner, 'owner', trimmed);
    assertSegment(repo, 'repo', trimmed);
    return {
      provider: 'github',
      host: PROVIDER_HOSTS.github,
      owner,
      repo,
      url: `https://${PROVIDER_HOSTS.github}/${owner}/${repo}.git`,
      isSsh: false,
      name: sanitizePluginName(repo),
    };
  }

  // SSH URL: `git@host:owner/repo(.git)`.
  const sshMatch = /^([A-Za-z0-9_.-]+)@([A-Za-z0-9_.-]+):([^/].*)$/.exec(trimmed);
  if (sshMatch) {
    const host = sshMatch[2];
    const rest = sshMatch[3];
    const parts = stripGitSuffix(rest).split('/');
    if (parts.length < 2 || parts[0].length === 0 || parts[1].length === 0) {
      throw new Error(`git url: missing owner/repo in ${trimmed}`);
    }
    const owner = parts[0];
    const repo = parts[1];
    assertSegment(owner, 'owner', trimmed);
    assertSegment(repo, 'repo', trimmed);
    const provider = HOST_TO_PROVIDER[host] ?? 'custom';
    return {
      provider,
      host,
      owner,
      repo,
      url: trimmed,
      isSsh: true,
      name: sanitizePluginName(repo),
    };
  }

  // HTTPS / HTTP URL.
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    let hostPath: string;
    try {
      const parsedUrl = new URL(trimmed);
      hostPath = parsedUrl.host + parsedUrl.pathname;
    } catch {
      throw new Error(`git url: malformed URL ${trimmed}`);
    }
    const [host, ...pathSegments] = hostPath.split('/').filter((s) => s.length > 0);
    if (!host || pathSegments.length < 2) {
      throw new Error(`git url: missing owner/repo in ${trimmed}`);
    }
    const owner = pathSegments[0];
    const repo = stripGitSuffix(pathSegments[1]);
    assertSegment(owner, 'owner', trimmed);
    assertSegment(repo, 'repo', trimmed);
    const provider = HOST_TO_PROVIDER[host] ?? 'custom';
    // Normalize to HTTPS clone URL (no query / fragment) with `.git`.
    const canonical = `https://${host}/${owner}/${repo}.git`;
    return {
      provider,
      host,
      owner,
      repo,
      url: canonical,
      isSsh: false,
      name: sanitizePluginName(repo),
    };
  }

  throw new Error(
    `git url: unsupported format (expected owner/repo, github:owner/repo, https://..., or git@host:...): ${trimmed}`
  );
}

/**
 * Injectable git spawner. Real callers use the default (spawns the local
 * `git` binary with the argv passed through — never a shell); tests
 * replace this with a mock via {@link setGitSpawner}.
 */
export type GitSpawner = (
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv }
) => Promise<{ stdout: string; stderr: string; code: number }>;

let currentSpawner: GitSpawner = defaultGitSpawner;

/**
 * Replace the git spawner (test-only seam). Returns the previous
 * spawner so callers can restore it in `afterEach`.
 */
export function setGitSpawner(spawner: GitSpawner): GitSpawner {
  const previous = currentSpawner;
  currentSpawner = spawner;
  return previous;
}

/** Reset the git spawner back to the real `spawn`-backed default. */
export function resetGitSpawner(): void {
  currentSpawner = defaultGitSpawner;
}

function defaultGitSpawner(
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv }
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, {
      cwd: options.cwd,
      env: options.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf-8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf-8');
    });
    child.on('error', (err) => {
      reject(err);
    });
    child.on('close', (code) => {
      resolve({ stdout, stderr, code: code ?? 1 });
    });
  });
}

/**
 * Options accepted by {@link cloneMCPPlugin}.
 */
export interface CloneOptions {
  /** Optional git ref (branch, tag) passed as `--branch`. */
  branch?: string;
  /**
   * When true, remove any existing directory at `dest` before cloning.
   * Defaults to `false` — an existing directory is treated as an error
   * so the caller has to explicitly opt in to overwrite.
   */
  force?: boolean;
  /**
   * Optional callback for streaming progress messages. Currently invoked
   * once with a start message and once with a completion message; the
   * git subprocess itself does not stream because `--quiet` is used.
   */
  onProgress?: (message: string) => void;
}

/** Result of {@link cloneMCPPlugin}. */
export interface CloneMcpResult {
  /** Absolute path to the cloned repo on disk. */
  path: string;
  /** URL that was cloned. */
  url: string;
  /** Branch/ref used, when supplied. */
  branch?: string;
}

/**
 * Reject refs that git would interpret as an option flag or that
 * contain shell metacharacters. Kept independent of `git-resolver`'s
 * validator because this installer accepts a slightly narrower set of
 * shapes (no `#ref@subpath` fragments — branches only).
 */
export function validateBranch(branch: string): void {
  if (typeof branch !== 'string' || branch.length === 0) {
    throw new Error('git branch: empty branch is not allowed');
  }
  if (branch.startsWith('-')) {
    throw new Error(`git branch: option-injection branch rejected: ${branch}`);
  }
  if (/\s/.test(branch)) {
    throw new Error(`git branch: whitespace in branch: ${JSON.stringify(branch)}`);
  }
  if (/[;|&$`\\]/.test(branch)) {
    throw new Error(`git branch: shell metacharacter in branch: ${branch}`);
  }
  if (branch.includes('..') || branch.endsWith('/') || branch.endsWith('.lock')) {
    throw new Error(`git branch: malformed branch: ${branch}`);
  }
}

/**
 * Clone an MCP plugin repository to `dest`. Uses `git clone --depth 1`
 * for a shallow clone. When `dest` already exists and `force` is not
 * set, throws with a specific message so the caller can prompt the
 * operator or pick a different name.
 */
export async function cloneMCPPlugin(
  url: string,
  dest: string,
  options: CloneOptions = {}
): Promise<CloneMcpResult> {
  if (options.branch !== undefined) {
    validateBranch(options.branch);
  }

  const parentDir = path.dirname(dest);
  await fsPromises.mkdir(parentDir, { recursive: true });

  if (fs.existsSync(dest)) {
    if (!options.force) {
      throw new Error(
        `mcp install: destination already exists: ${dest} (use --force to overwrite, or --name to pick a different slug)`
      );
    }
    await fsPromises.rm(dest, { recursive: true, force: true });
  }

  const args = ['clone', '--depth', '1', '--quiet'];
  if (options.branch !== undefined) {
    args.push('--branch', options.branch);
  }
  args.push('--', url, dest);

  options.onProgress?.(`Cloning ${url}${options.branch ? ` (branch ${options.branch})` : ''}...`);
  const result = await currentSpawner(args, { env: process.env });
  if (result.code !== 0) {
    // Best-effort cleanup of a half-written clone.
    await safeRemove(dest);
    const message = result.stderr.trim() || result.stdout.trim() || 'unknown error';
    throw new Error(`git clone failed (exit ${result.code}): ${message}`);
  }
  options.onProgress?.(`Cloned into ${dest}`);

  return { path: dest, url, branch: options.branch };
}

async function safeRemove(target: string): Promise<void> {
  try {
    await fsPromises.rm(target, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup.
  }
}

/** Descriptor produced by {@link detectMCPEntry}. */
export interface DetectedEntry {
  /** Where the entry was discovered. */
  source: 'alexi-mcp' | 'package-mcp' | 'package-bin';
  /** Command to launch (usually `node`, `npx`, or an absolute path). */
  command: string;
  /** Argv passed to the command. */
  args: string[];
  /** Optional environment overrides declared by the plugin. */
  env?: Record<string, string>;
  /** Optional friendly description declared by the plugin. */
  description?: string;
}

interface AlexiMcpManifest {
  name?: string;
  description?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  /** Legacy field: single entry-point script path. */
  entrypoint?: string;
}

interface PackageJsonMcp {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  entrypoint?: string;
}

interface PackageJson {
  name?: string;
  description?: string;
  bin?: string | Record<string, string>;
  mcp?: PackageJsonMcp;
}

async function readJsonFile<T>(filePath: string): Promise<T | undefined> {
  try {
    const content = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return undefined;
    }
    throw err;
  }
}

function normalizeEntrypoint(
  pluginDir: string,
  entry: string
): { command: string; args: string[] } {
  const absolute = path.isAbsolute(entry) ? entry : path.join(pluginDir, entry);
  return { command: process.execPath, args: [absolute] };
}

/**
 * Auto-detect the MCP entry point for a cloned plugin. Resolution
 * order:
 *
 * 1. `.alexi/mcp.json` at the repo root (Alexi-native manifest).
 * 2. `package.json` `mcp` field (structured entry declaration).
 * 3. `package.json` `bin` field (fallback to the single bin, or the bin
 *    whose name matches the package name).
 *
 * Throws when no entry can be inferred so the CLI can surface a clear
 * "did you clone the right repo?" error before writing anything to
 * `~/.alexi/mcp-servers.json`.
 */
export async function detectMCPEntry(pluginDir: string): Promise<DetectedEntry> {
  const alexiPath = path.join(pluginDir, '.alexi', 'mcp.json');
  const alexi = await readJsonFile<AlexiMcpManifest>(alexiPath);
  if (alexi) {
    if (alexi.command) {
      return {
        source: 'alexi-mcp',
        command: alexi.command,
        args: Array.isArray(alexi.args) ? [...alexi.args] : [],
        env: alexi.env,
        description: alexi.description,
      };
    }
    if (alexi.entrypoint) {
      const resolved = normalizeEntrypoint(pluginDir, alexi.entrypoint);
      return {
        source: 'alexi-mcp',
        command: resolved.command,
        args: resolved.args,
        env: alexi.env,
        description: alexi.description,
      };
    }
    throw new Error(
      `mcp install: .alexi/mcp.json is missing a 'command' or 'entrypoint' field in ${pluginDir}`
    );
  }

  const packagePath = path.join(pluginDir, 'package.json');
  const pkg = await readJsonFile<PackageJson>(packagePath);
  if (!pkg) {
    throw new Error(
      `mcp install: no .alexi/mcp.json or package.json found in ${pluginDir} — cannot detect entry point`
    );
  }

  if (pkg.mcp && (pkg.mcp.command || pkg.mcp.entrypoint)) {
    if (pkg.mcp.command) {
      return {
        source: 'package-mcp',
        command: pkg.mcp.command,
        args: Array.isArray(pkg.mcp.args) ? [...pkg.mcp.args] : [],
        env: pkg.mcp.env,
        description: pkg.description,
      };
    }
    if (pkg.mcp.entrypoint) {
      const resolved = normalizeEntrypoint(pluginDir, pkg.mcp.entrypoint);
      return {
        source: 'package-mcp',
        command: resolved.command,
        args: resolved.args,
        env: pkg.mcp.env,
        description: pkg.description,
      };
    }
  }

  if (pkg.bin) {
    let binScript: string | undefined;
    if (typeof pkg.bin === 'string') {
      binScript = pkg.bin;
    } else if (typeof pkg.bin === 'object') {
      const entries = Object.entries(pkg.bin);
      if (entries.length === 1) {
        binScript = entries[0][1];
      } else if (pkg.name && pkg.bin[pkg.name]) {
        binScript = pkg.bin[pkg.name];
      } else if (entries.length > 0) {
        binScript = entries[0][1];
      }
    }
    if (binScript) {
      const resolved = normalizeEntrypoint(pluginDir, binScript);
      return {
        source: 'package-bin',
        command: resolved.command,
        args: resolved.args,
        description: pkg.description,
      };
    }
  }

  throw new Error(
    `mcp install: could not find an MCP entry point in ${pluginDir} (looked for .alexi/mcp.json, package.json 'mcp' field, package.json 'bin' field)`
  );
}

/** Options accepted by {@link installGitMCPPlugin}. */
export interface InstallGitMcpOptions {
  /** Optional custom plugin name (overrides the repo-derived slug). */
  name?: string;
  /** Optional git branch/tag to check out. */
  branch?: string;
  /**
   * Enable auto-update on future refreshes. Persisted in the server
   * config's `git` block. Defaults to `false`.
   */
  autoUpdate?: boolean;
  /** Overwrite an existing plugin directory. Defaults to `false`. */
  force?: boolean;
  /**
   * Auto-connect the server on session startup. Defaults to `true` —
   * users typically install a plugin to use it immediately.
   */
  autoConnect?: boolean;
  /** Progress callback (currently: clone start / end messages). */
  onProgress?: (message: string) => void;
  /** Override the install root. Defaults to {@link DEFAULT_MCP_PLUGINS_DIR}. */
  installRoot?: string;
}

/** Result of {@link installGitMCPPlugin}. */
export interface InstallGitMcpResult {
  /** Server config that was persisted. */
  server: McpServerConfig;
  /** Absolute path where the plugin was cloned. */
  pluginPath: string;
  /** Parsed URL info. */
  parsed: ParsedRepoUrl;
  /** Detected entry-point information. */
  entry: DetectedEntry;
}

/**
 * End-to-end install: parse -> clone -> detect entry -> register in
 * `~/.alexi/mcp-servers.json`.
 *
 * The plugin is installed to `<installRoot>/<name>/`; when no explicit
 * name is provided, the repo slug is used. A duplicate name is treated
 * as an error unless {@link InstallGitMcpOptions.force} is set — in
 * which case the old directory is removed and the server entry is
 * overwritten.
 */
export async function installGitMCPPlugin(
  input: string,
  options: InstallGitMcpOptions = {}
): Promise<InstallGitMcpResult> {
  const parsed = parseGitUrl(input);
  const name = options.name ? sanitizePluginName(options.name) : parsed.name;
  if (!name) {
    throw new Error(
      `mcp install: could not derive a plugin name from '${input}' — pass --name <slug>`
    );
  }

  const root = options.installRoot ?? DEFAULT_MCP_PLUGINS_DIR;
  const pluginPath = path.join(root, name);

  const cloneResult = await cloneMCPPlugin(parsed.url, pluginPath, {
    branch: options.branch,
    force: options.force,
    onProgress: options.onProgress,
  });

  let entry: DetectedEntry;
  try {
    entry = await detectMCPEntry(cloneResult.path);
  } catch (err) {
    // Roll back the clone so a failed install leaves no orphan on disk.
    await safeRemove(cloneResult.path);
    throw err;
  }

  const server: McpServerConfig = {
    name,
    description: entry.description ?? `MCP plugin from ${parsed.url}`,
    transport: 'stdio',
    command: entry.command,
    args: entry.args,
    enabled: true,
    autoConnect: options.autoConnect ?? true,
  };
  if (entry.env && Object.keys(entry.env).length > 0) {
    server.env = entry.env;
  }
  // Attach git origin metadata via a passthrough property. The schema
  // allows unknown keys, so this survives the round-trip through
  // validateMcpConfig without a schema bump.
  (server as McpServerConfig & { git?: McpGitOrigin }).git = {
    type: 'git',
    url: parsed.url,
    branch: options.branch,
    autoUpdate: options.autoUpdate ?? false,
    installedPath: cloneResult.path,
  };

  try {
    addMcpServer(server);
  } catch (err) {
    // Roll back the clone if the config write refuses the new entry.
    await safeRemove(cloneResult.path);
    throw err;
  }

  return { server, pluginPath: cloneResult.path, parsed, entry };
}

/**
 * Persisted metadata attached to a server entry that was installed from
 * a git repository. Kept as a passthrough field on
 * {@link McpServerConfig} so future refresh / autoUpdate flows can find
 * the origin without reparsing.
 */
export interface McpGitOrigin {
  type: 'git';
  url: string;
  branch?: string;
  autoUpdate?: boolean;
  installedPath?: string;
}
