import path from 'path';

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

  /** Return true if remainder path is in an excluded subdir. */
  function excluded(remainder: string): boolean {
    return EXCLUDED_SUBDIRS.some((sub) => remainder.startsWith(sub));
  }

  /** Check if a project-relative path points to a config file or directory. */
  export function isRelative(pattern: string): boolean {
    const normalized = normalize(pattern);
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
    // Check root-level config files
    if (!normalized.includes('/') && CONFIG_ROOT_FILES.has(normalized)) {
      return true;
    }
    return false;
  }

  /** Check if an absolute path points to a config file. */
  export function isAbsolute(absolutePath: string, projectRoot: string): boolean {
    const normalized = normalize(absolutePath);
    const normalizedRoot = normalize(projectRoot);

    // Check if path is within project
    if (normalized.startsWith(normalizedRoot)) {
      const relative = normalized.slice(normalizedRoot.length).replace(/^\//, '');
      return isRelative(relative);
    }

    // Check global config directory
    const globalConfigDir = normalize(getGlobalConfigDir());
    if (normalized.startsWith(globalConfigDir)) {
      return true;
    }

    return false;
  }

  /** Check if a permission request involves config files. */
  export function isRequest(info: { patterns: string[]; permission: string }): boolean {
    // Only protect write operations
    const writeOps = ['write', 'edit', 'delete', 'move', 'patch', 'apply_patch'];
    if (!writeOps.some((op) => info.permission.toLowerCase().includes(op))) {
      return false;
    }
    return info.patterns.some((p) => isRelative(p) || isAbsolute(p, process.cwd()));
  }

  function getGlobalConfigDir(): string {
    const home = process.env.HOME || process.env.USERPROFILE || '';
    return path.join(home, '.alexi');
  }
}
