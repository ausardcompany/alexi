/**
 * Filesystem Utility Functions
 * Path containment checking and security utilities
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { allowed } from '../core/kilocode/fff.js';

/**
 * User-facing error thrown by tools when they refuse to enumerate a
 * workspace whose root is the user's home directory or a filesystem
 * root. Kept as a single canonical string so callers (glob, codesearch,
 * future indexers) surface the same message and downstream tests can
 * assert on it without duplicating the copy.
 *
 * Origin: kilocode #13960 (do not build a file index for the home
 * directory or filesystem root). Indexing $HOME or `/` can freeze the
 * terminal for minutes and exhaust system memory (10+ GB RSS reported
 * upstream in #13930 / #13905).
 */
export const UNSAFE_WORKSPACE_ROOT_MESSAGE =
  'Indexing the home directory or filesystem root is disabled to prevent OOM. ' +
  'Please cd into a project directory.';

/**
 * Return true when `workdir` should NOT be walked recursively because
 * it is either a filesystem root (`/`, `C:\`, a UNC share root) or the
 * user's home directory (in either the given or symlink-resolved form).
 *
 * This is the inverse of {@link import('../core/kilocode/fff.js').allowed}
 * and exists so tool call sites (`glob`, `codesearch`, ...) can read as
 * `if (isUnsafeWorkspaceRoot(ctx.workdir)) throw ...` without importing
 * the deeper kilocode module directly. Both call sites intentionally go
 * through this wrapper so the guard is discoverable from the filesystem
 * utility surface.
 *
 * The optional `home` argument mirrors `allowed`'s override — tests use
 * it (or the `ALEXI_TEST_HOME` env var) to pin the home anchor without
 * mutating `process.env.HOME` for the whole process.
 */
export function isUnsafeWorkspaceRoot(workdir: string, home?: string): boolean {
  return !allowed(workdir, home);
}

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
