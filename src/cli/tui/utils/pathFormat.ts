/**
 * Path Formatting Utilities for TUI
 * Format file paths relative to the session directory for better readability
 * From PR #26648
 */

import * as path from 'path';

/**
 * Format a path relative to the session's working directory.
 * Falls back to the original path if it's outside the session directory.
 */
export function formatPathRelativeToSession(
  absolutePath: string,
  sessionDirectory: string
): string {
  if (!absolutePath || !sessionDirectory) {
    return absolutePath;
  }

  const relative = path.relative(sessionDirectory, absolutePath);

  // If the relative path starts with "..", it's outside the session directory
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return absolutePath;
  }

  // Return relative path with "./" prefix for clarity
  return `./${relative}`;
}

/**
 * Format multiple paths relative to the session directory
 */
export function formatPathsRelativeToSession(
  paths: string[],
  sessionDirectory: string
): string[] {
  return paths.map((p) => formatPathRelativeToSession(p, sessionDirectory));
}

/**
 * Shorten a path for display by abbreviating the home directory
 */
export function abbreviateHomePath(filePath: string): string {
  const home = process.env.HOME || process.env.USERPROFILE;
  if (home && filePath.startsWith(home)) {
    return `~${filePath.slice(home.length)}`;
  }
  return filePath;
}

/**
 * Format a path for display in the TUI
 * - Uses relative path if within session directory
 * - Abbreviates home directory otherwise
 */
export function formatPathForDisplay(
  absolutePath: string,
  sessionDirectory: string
): string {
  const relativePath = formatPathRelativeToSession(absolutePath, sessionDirectory);

  // If we got a relative path, use it
  if (relativePath.startsWith('./')) {
    return relativePath;
  }

  // Otherwise abbreviate home directory
  return abbreviateHomePath(absolutePath);
}
