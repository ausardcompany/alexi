import path from 'path';
import os from 'os';
import { getGlobalPaths } from '../utils/global.js';

/**
 * Config directory prefixes (relative paths, forward-slash normalized).
 * Matches .kilo/, .kilocode/, .opencode/, .alexi/ at any depth within the project.
 */
const CONFIG_DIRS = ['.kilo/', '.kilocode/', '.opencode/', '.alexi/'];

/**
 * Subdirectories under CONFIG_DIRS that are NOT config files (e.g. plan files).
 * Paths under these subdirs are exempt from config protection.
 */
const EXCLUDED_SUBDIRS = ['plans/'];

/**
 * Root-level config files that must be protected.
 * Matched only when the relative path has no directory component.
 */
const CONFIG_ROOT_FILES = new Set([
  'kilo.json',
  'kilo.jsonc',
  'opencode.json',
  'opencode.jsonc',
  'alexi.json',
  'alexi.jsonc',
  'AGENTS.md',
]);

/**
 * Shell startup files (home-relative). Writes to these are blast-radius
 * critical: a payload here re-executes for every future shell on the host.
 * Source: anthropics/claude-code v2.1.160 protected-paths list.
 */
const SHELL_STARTUP_FILES = new Set([
  '.zshenv',
  '.zlogin',
  '.zshrc',
  '.zprofile',
  '.bash_login',
  '.bash_profile',
  '.bashrc',
  '.profile',
]);

/**
 * Shell startup files under nested home-relative directories. Stored as
 * forward-slash, home-relative paths.
 */
const SHELL_STARTUP_NESTED = new Set(['.config/fish/config.fish']);

/**
 * Git configuration files / directories (home-relative).
 * `.gitconfig` is a file; `.config/git/` is a directory whose contents
 * (e.g. `config`, `attributes`, `ignore`) all qualify as protected.
 */
const GIT_CONFIG_FILES = new Set(['.gitconfig']);
const GIT_CONFIG_DIRS = ['.config/git/'];

/**
 * Build tool / package manager exec-path config files. Each name is matched
 * both at the project root AND in the user's home directory.
 *
 * `.npmrc`, `.yarnrc`, `.yarnrc.yml`, `bunfig.toml` can all influence which
 * binary `npm` / `yarn` / `bun` resolves. `.bazelrc` and
 * `.pre-commit-config.yaml` follow the same upstream protection list.
 */
const BUILD_TOOL_FILES = new Set([
  '.npmrc',
  '.yarnrc',
  '.yarnrc.yml',
  'bunfig.toml',
  '.bazelrc',
  '.pre-commit-config.yaml',
]);

/**
 * Devcontainer directory prefix (project-relative). Writes to anything
 * under `.devcontainer/` can hijack the next container rebuild.
 */
const DEVCONTAINER_DIRS = ['.devcontainer/'];

/** Metadata key used to signal the UI to hide the "Allow always" option. */
export const DISABLE_ALWAYS_KEY = 'disableAlways' as const;

function normalize(p: string): string {
  return path.posix.normalize(p.replaceAll('\\', '/'));
}

/** Return true if the remainder path is in an excluded subdir. */
function excluded(remainder: string): boolean {
  return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub));
}

/** Match against any of CONFIG_DIRS, honouring EXCLUDED_SUBDIRS. */
function matchesConfigDir(normalized: string): boolean {
  for (const dir of CONFIG_DIRS) {
    const bare = dir.slice(0, -1); // e.g. ".kilo"
    // Match at root (e.g. ".kilo/foo") or nested (e.g. "packages/sub/.kilo/foo")
    if (normalized === bare || normalized.endsWith('/' + bare)) {
      return true;
    }
    if (normalized.startsWith(dir)) {
      if (excluded(normalized.slice(dir.length))) {
        continue;
      }
      return true;
    }
    const nested = '/' + dir;
    const idx = normalized.indexOf(nested);
    if (idx !== -1) {
      const remainder = normalized.slice(idx + nested.length);
      if (!excluded(remainder)) {
        return true;
      }
    }
  }
  return false;
}

/** Match a project-relative build-tool or devcontainer path. */
function matchesProjectRelativeProtected(normalized: string): boolean {
  // Devcontainer directory (anywhere in the project tree).
  for (const dir of DEVCONTAINER_DIRS) {
    if (normalized === dir.slice(0, -1) || normalized.startsWith(dir)) {
      return true;
    }
    const nested = '/' + dir;
    if (normalized.includes(nested) || normalized.endsWith('/' + dir.slice(0, -1))) {
      return true;
    }
  }

  // Build-tool config files at project root only (no directory component).
  if (!normalized.includes('/') && BUILD_TOOL_FILES.has(normalized)) {
    return true;
  }

  return false;
}

/** Check if a project-relative path points to a config file or directory. */
export function isRelative(pattern: string): boolean {
  const normalized = normalize(pattern);
  if (matchesConfigDir(normalized)) {
    return true;
  }
  if (matchesProjectRelativeProtected(normalized)) {
    return true;
  }
  // Check root-level config files
  if (!normalized.includes('/') && CONFIG_ROOT_FILES.has(normalized)) {
    return true;
  }
  return false;
}

/** Return true if `normalized` is a home-relative protected path. */
function matchesHomeRelativeProtected(normalized: string): boolean {
  // Shell startup files at home root (e.g. ".zshenv").
  if (!normalized.includes('/') && SHELL_STARTUP_FILES.has(normalized)) {
    return true;
  }
  // Shell startup files in nested home dirs (e.g. ".config/fish/config.fish").
  for (const file of SHELL_STARTUP_NESTED) {
    if (normalized === file) {
      return true;
    }
  }
  // Git config file at home root.
  if (!normalized.includes('/') && GIT_CONFIG_FILES.has(normalized)) {
    return true;
  }
  // Anything inside a git config directory (e.g. ".config/git/config").
  for (const dir of GIT_CONFIG_DIRS) {
    if (normalized === dir.slice(0, -1) || normalized.startsWith(dir)) {
      return true;
    }
  }
  // Build tool config files at home root (e.g. "~/.npmrc").
  if (!normalized.includes('/') && BUILD_TOOL_FILES.has(normalized)) {
    return true;
  }
  return false;
}

/** Check if an absolute path points to a config file. */
export function isAbsolute(absolutePath: string, projectRoot: string): boolean {
  const normalized = normalize(absolutePath);
  const normalizedRoot = normalize(projectRoot);

  // Within project: delegate to isRelative.
  if (normalized.startsWith(normalizedRoot + '/') || normalized === normalizedRoot) {
    const relative = normalized.slice(normalizedRoot.length).replace(/^\//, '');
    if (isRelative(relative)) {
      return true;
    }
  }

  // Global config directory (~/.alexi/).
  const globalPaths = getGlobalPaths();
  const globalConfig = normalize(globalPaths.config);
  if (normalized.startsWith(globalConfig + '/') || normalized === globalConfig) {
    return true;
  }

  // Home-relative protected files (shell-startup, git config, ~/.npmrc, ...).
  const home = normalize(os.homedir());
  if (normalized.startsWith(home + '/')) {
    const homeRel = normalized.slice(home.length + 1);
    if (matchesHomeRelativeProtected(homeRel)) {
      return true;
    }
  }

  return false;
}

/**
 * Determine if a permission request targets config files.
 * Gates `edit` permissions and bash-originated `external_directory` requests.
 * File-tool reads are not restricted.
 */
export function isRequest(request: {
  permission: string;
  patterns: string[];
  metadata?: Record<string, any>;
}): boolean {
  if (request.permission === 'external_directory') {
    // File tools include metadata.filepath. They may read global config
    // without prompting, but edits are still protected separately via `edit`.
    if (request.metadata?.filepath) {
      return false;
    }
    for (const pattern of request.patterns) {
      const dir = pattern.replace(/\/\*$/, '');
      if (path.isAbsolute(dir)) {
        return true;
      }
    }
    return false;
  }
  if (!['write', 'edit', 'patch', 'apply_patch'].includes(request.permission)) {
    return false;
  }
  return request.patterns.some((p) => {
    if (path.isAbsolute(p)) {
      return isAbsolute(p, process.cwd());
    }
    return isRelative(p);
  });
}

/** Get metadata to disable "always allow" for config file edits. */
export function getMetadata(): Record<string, boolean> {
  return { [DISABLE_ALWAYS_KEY]: true };
}

/**
 * Check whether a path (project-relative OR absolute) is a protected
 * config path. Convenience wrapper used by callers that may receive
 * either form (e.g. permission contexts where `ctx.resource` is the
 * absolute path resolved by the tool).
 */
export function isProtectedPath(p: string, projectRoot: string = process.cwd()): boolean {
  if (path.isAbsolute(p)) {
    return isAbsolute(p, projectRoot);
  }
  return isRelative(p);
}

export const ConfigProtection = {
  DISABLE_ALWAYS_KEY,
  isRelative,
  isAbsolute,
  isProtectedPath,
  isRequest,
  getMetadata,
};
