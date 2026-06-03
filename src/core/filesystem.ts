/**
 * Filesystem Utilities
 * Windows-resilient filesystem operations
 */

import { FSUtil } from './fs-util';

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
