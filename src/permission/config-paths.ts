/**
 * Config Path Protection System
 * Prevents unauthorized modification of configuration files
 * Based on kilocode/opencode security patterns
 */

import path from 'path';
import { CONFIG_DIR } from '../config/userConfig.js';

export namespace ConfigProtection {
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

  /** Metadata key used to signal the UI to hide the "Allow always" option. */
  export const DISABLE_ALWAYS_KEY = 'disableAlways' as const;

  function normalize(p: string): string {
    return path.posix.normalize(p.replaceAll('\\', '/'));
  }

  /** Return true if remainder path is in an excluded subdirectory */
  function excluded(remainder: string): boolean {
    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub));
  }

  /** Check if a project-relative path points to a config file or directory. */
  export function isRelative(pattern: string): boolean {
    const normalized = normalize(pattern);
    for (const dir of CONFIG_DIRS) {
      const bare = dir.slice(0, -1); // e.g. ".kilo"
      // Match at root (e.g. ".kilo/foo") or nested (e.g. "packages/sub/.kilo/foo")
      if (normalized === bare || normalized.endsWith('/' + bare)) return true;
      if (normalized.startsWith(dir)) {
        if (excluded(normalized.slice(dir.length))) continue;
        return true;
      }
      // Check for nested config dirs
      const nestedIndex = normalized.indexOf('/' + dir);
      if (nestedIndex !== -1) {
        const remainder = normalized.slice(nestedIndex + 1 + dir.length);
        if (!excluded(remainder)) return true;
      }
    }
    // Check root-level config files
    if (!normalized.includes('/') && CONFIG_ROOT_FILES.has(normalized)) {
      return true;
    }
    return false;
  }

  /** Check if an absolute path points to the global config directory. */
  export function isGlobalConfig(absolutePath: string): boolean {
    const globalDir = CONFIG_DIR;
    const normalized = normalize(absolutePath);
    const normalizedGlobal = normalize(globalDir);
    return normalized.startsWith(normalizedGlobal + '/') || normalized === normalizedGlobal;
  }

  /** Check if a permission request involves config files. */
  export function isRequest(request: { patterns?: string[]; permission?: string }): boolean {
    if (!request.patterns) return false;
    // Only protect write operations
    const writePermissions = ['write', 'edit', 'patch', 'delete', 'move', 'rename'];
    const isWriteOp = request.permission
      ? writePermissions.some((wp) => request.permission!.includes(wp))
      : true;
    if (!isWriteOp) return false;

    return request.patterns.some((p) => isRelative(p) || isGlobalConfig(p));
  }
}
