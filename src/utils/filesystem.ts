/**
 * Filesystem Utility Functions
 * Path containment checking and security utilities
 */

import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Result type for resolveInside() path resolution
 */
export type ResolveInsideResult =
  | { safe: true; resolved: string }
  | { safe: false; reason: string };

/**
 * Check if a path is contained within a parent directory
 * Handles edge cases like symlinks and path traversal attempts
 * @param parent - The parent directory path
 * @param child - The child path to check
 * @returns true if child is within parent, false otherwise
 */
export function containsPath(parent: string, child: string): boolean {
  const normalizedParent = path.resolve(parent);
  const normalizedChild = path.resolve(child);

  // Normalize to POSIX-style for consistent comparison
  const parentPosix = normalizedParent.split(path.sep).join(path.posix.sep);
  const childPosix = normalizedChild.split(path.sep).join(path.posix.sep);

  // Check if child starts with parent path
  if (!childPosix.startsWith(parentPosix)) {
    return false;
  }

  // Ensure it's actually a subdirectory, not just a prefix match
  // e.g., /home/user should not contain /home/user-data
  const remainder = childPosix.slice(parentPosix.length);
  return remainder.length === 0 || remainder.startsWith(path.posix.sep);
}

/**
 * Safely resolve a path and check if it's contained within a parent directory
 * Also resolves symlinks to prevent symlink-based traversal attacks
 * @param parent - The parent directory path
 * @param child - The child path to check
 * @returns Object with containment status and resolved path
 */
export async function safePathCheck(
  parent: string,
  child: string
): Promise<{ contained: boolean; resolved: string }> {
  try {
    const resolved = path.resolve(parent, child);

    // First check without symlink resolution
    if (!containsPath(parent, resolved)) {
      return { contained: false, resolved };
    }

    // Try to resolve symlinks
    try {
      const realPath = await fs.realpath(resolved);
      const contained = containsPath(parent, realPath);
      return { contained, resolved: realPath };
    } catch {
      // File doesn't exist yet, or we can't resolve it
      // In this case, trust the initial containment check
      return { contained: true, resolved };
    }
  } catch {
    // Path resolution failed
    return { contained: false, resolved: child };
  }
}

/**
 * Check if a path attempts directory traversal
 * @param filePath - The path to check
 * @returns true if path contains suspicious patterns
 */
export function hasTraversalAttempt(filePath: string): boolean {
  const normalized = path.normalize(filePath);
  // Check for parent directory references that escape
  return normalized.includes('..') || normalized.startsWith('..');
}

/**
 * Symlink-safe path resolution utility.
 * Resolves a target path relative to a base directory and verifies that the
 * resolved path (including symlink targets) stays within the base directory.
 *
 * - Uses lstat to detect symlinks without following them
 * - If a symlink is detected, uses realpath to verify the destination is within baseDir
 * - Handles non-existent paths by checking the lexical resolution
 * - Rejects paths that use `..` traversal to escape the workspace
 *
 * @param baseDir - The workspace root directory (must be absolute)
 * @param targetPath - The path to resolve (absolute or relative to baseDir)
 * @returns A result indicating whether the path is safe and the resolved path
 */
export async function resolveInside(
  baseDir: string,
  targetPath: string
): Promise<ResolveInsideResult> {
  try {
    // Resolve the base directory to its real path to handle symlinked workspaces
    const realBase = await fs.realpath(baseDir);

    // Resolve target relative to the real base
    const resolved = path.isAbsolute(targetPath)
      ? path.resolve(targetPath)
      : path.resolve(realBase, targetPath);

    // First check: does the lexically resolved path stay within base?
    if (!containsPath(realBase, resolved)) {
      return {
        safe: false,
        reason: `Path escapes workspace boundary: ${targetPath}`,
      };
    }

    // Second check: detect symlinks using lstat
    try {
      const stats = await fs.lstat(resolved);

      if (stats.isSymbolicLink()) {
        // Resolve the symlink target to its real path
        const realTarget = await fs.realpath(resolved);

        if (!containsPath(realBase, realTarget)) {
          return {
            safe: false,
            reason: `Symlink target escapes workspace boundary: ${targetPath} -> ${realTarget}`,
          };
        }

        return { safe: true, resolved: realTarget };
      }

      // Not a symlink, path exists and is within bounds
      return { safe: true, resolved };
    } catch (err) {
      // Path doesn't exist yet (ENOENT) - check parent directories for symlinks
      if (
        err instanceof Error &&
        'code' in err &&
        (err as NodeJS.ErrnoException).code === 'ENOENT'
      ) {
        // Walk up the path to find the deepest existing ancestor
        let current = resolved;
        while (current !== realBase && current !== path.dirname(current)) {
          const parent = path.dirname(current);
          try {
            const parentStats = await fs.lstat(parent);
            if (parentStats.isSymbolicLink()) {
              const realParent = await fs.realpath(parent);
              if (!containsPath(realBase, realParent)) {
                return {
                  safe: false,
                  reason: `Parent symlink escapes workspace boundary: ${parent} -> ${realParent}`,
                };
              }
            }
            // Found an existing non-symlink parent, trust the lexical check
            break;
          } catch {
            // Parent doesn't exist either, continue walking up
            current = parent;
          }
        }

        // Lexical resolution is within bounds and no escaping symlinks found
        return { safe: true, resolved };
      }

      // Some other error (permission denied, etc.)
      const message = err instanceof Error ? err.message : String(err);
      return { safe: false, reason: `Cannot verify path safety: ${message}` };
    }
  } catch (err) {
    // baseDir itself cannot be resolved
    const message = err instanceof Error ? err.message : String(err);
    return { safe: false, reason: `Cannot resolve base directory: ${message}` };
  }
}
