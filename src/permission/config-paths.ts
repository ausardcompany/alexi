/**
 * Config Path Protection System
 * Prevents unauthorized modifications to configuration files.
 * Based on kilocode/opencode patterns adapted for Alexi.
 */

import path from 'path';
import os from 'os';

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .alexi/, .kilo/, .kilocode/, .opencode/ at any depth within the project.
   */
  const CONFIG_DIRS = ['.alexi/', '.kilo/', '.kilocode/', '.opencode/'];

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
    'alexi.json',
    'alexi.jsonc',
    'kilo.json',
    'kilo.jsonc',
    'opencode.json',
    'opencode.jsonc',
    'AGENTS.md',
  ]);

  /** Metadata key used to signal the UI to hide the "Allow always" option. */
  export const DISABLE_ALWAYS_KEY = 'disableAlways' as const;

  function normalize(p: string): string {
    return path.posix.normalize(p.replaceAll('\\', '/'));
  }

  /** Return the remainder after the config dir prefix, or undefined if excluded. */
  function excluded(remainder: string): boolean {
    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub));
  }

  /** Check if a project-relative path points to a config file or directory. */
  export function isRelative(pattern: string): boolean {
    const normalized = normalize(pattern);
    for (const dir of CONFIG_DIRS) {
      const bare = dir.slice(0, -1); // e.g. ".alexi"
      // Match at root (e.g. ".alexi/foo") or nested (e.g. "packages/sub/.alexi/foo")
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
    // Root-level config files
    if (!normalized.includes('/') && CONFIG_ROOT_FILES.has(normalized)) {
      return true;
    }
    return false;
  }

  /** Check if an absolute path points to a config file. */
  export function isAbsolute(absolutePath: string, cwd: string): boolean {
    const normalized = normalize(absolutePath);
    const normalizedCwd = normalize(cwd);

    // Check if within project directory
    if (normalized.startsWith(normalizedCwd + '/')) {
      const relative = normalized.slice(normalizedCwd.length + 1);
      return isRelative(relative);
    }

    // Check global config directory (~/.alexi or equivalent)
    const homeDir = normalize(os.homedir());
    const globalConfigDir = normalize(path.join(homeDir, '.alexi'));
    if (normalized.startsWith(globalConfigDir + '/') || normalized === globalConfigDir) {
      return true;
    }

    return false;
  }

  /** Check if a permission request involves config file modification. */
  export function isRequest(request: { permission: string; patterns?: string[] }): boolean {
    if (!request.patterns) {
      return false;
    }
    const writePermissions = ['write', 'edit', 'patch', 'move', 'delete'];
    if (!writePermissions.some((p) => request.permission.includes(p))) {
      return false;
    }
    const cwd = process.cwd();
    return request.patterns.some(
      (pattern) => isRelative(pattern) || isAbsolute(pattern, cwd)
    );
  }
}
