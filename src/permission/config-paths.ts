/**
 * Config Path Protection System
 * Prevents AI agents from modifying configuration files without explicit user approval.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export namespace ConfigProtection {
  /**
   * Config directory prefixes (relative paths, forward-slash normalized).
   * Matches .alexi/, .kilocode/, .opencode/ at any depth within the project.
   */
  const CONFIG_DIRS = ['.alexi/', '.kilocode/', '.opencode/'];

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

  /** Return true if the remainder after the config dir prefix should be excluded. */
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
      if (idx >= 0) {
        const remainder = normalized.slice(idx + nested.length);
        if (!excluded(remainder)) {
          return true;
        }
      }
    }
    // Check root-level config files
    const basename = path.posix.basename(normalized);
    const dirnamePath = path.posix.dirname(normalized);
    if ((dirnamePath === '.' || dirnamePath === '') && CONFIG_ROOT_FILES.has(basename)) {
      return true;
    }
    return false;
  }

  /** Check if an absolute path points to the global config directory. */
  export function isGlobalConfigDir(absolutePath: string): boolean {
    // Get global config directory (typically ~/.alexi or similar)
    const globalConfigDir = path.join(os.homedir(), '.alexi');
    const normalized = normalize(absolutePath);
    const normalizedGlobal = normalize(globalConfigDir);
    return normalized.startsWith(normalizedGlobal + '/') || normalized === normalizedGlobal;
  }

  /** Check if a permission request involves config files. */
  export function isRequest(request: {
    patterns?: string[];
    metadata?: Record<string, unknown>;
  }): boolean {
    if (!request.patterns) {
      return false;
    }
    return request.patterns.some((p) => isRelative(p) || isGlobalConfigDir(p));
  }
}
