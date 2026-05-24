/**
 * Filesystem Utilities
 * Windows-resilient filesystem operations
 */

import * as fs from 'fs/promises';

/**
 * Checks if an error is an EEXIST error (directory already exists)
 * Windows with NTFS reparse points can throw EEXIST even with recursive: true
 *
 * References:
 *   https://github.com/Kilo-Org/kilocode/issues/9618
 *   https://github.com/Kilo-Org/kilocode/issues/9755
 */
function isEexist(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as NodeJS.ErrnoException).code === 'EEXIST'
  );
}

/**
 * Checks if an error is an ENOENT error (file not found)
 */
function isEnoent(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as NodeJS.ErrnoException).code === 'ENOENT'
  );
}

/**
 * Windows-resilient mkdir -p implementation.
 * Catches EEXIST errors that can occur on Windows with OneDrive,
 * directory junctions, or WSL-served paths.
 */
export async function mkdirSafe(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err: unknown) {
    if (isEexist(err)) {
      return;
    }
    throw err;
  }
}

/**
 * Ensures a directory exists, creating it if necessary.
 * Uses Windows-resilient implementation that handles EEXIST errors.
 */
export async function ensureDir(path: string): Promise<void> {
  await mkdirSafe(path);
}

/**
 * Safe file reading that returns undefined instead of throwing on NotFound
 * Based on upstream kilocode filesystem utilities
 */
export async function readFileStringSafe(filePath: string): Promise<string | undefined> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (err: unknown) {
    if (isEnoent(err)) {
      return undefined;
    }
    throw err;
  }
}

/**
 * Check if a file exists safely
 */
export async function existsSafe(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
