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
 * Checks whether an error represents an OS-level access denial.
 *
 * Alexi_change (opencode fix #55817): when Alexi runs inside a sandboxed
 * environment (SAP BTP job runners, hardened containers, GitHub
 * Codespaces, read-only filesystems), filesystem reads of ancestor
 * directories — notably the global config / instructions / location
 * discovery paths — can fail with `EACCES` or `EPERM` instead of
 * `ENOENT`. Historically Alexi treated these as fatal and aborted
 * boot. Treating a denied path as "unavailable" (same bucket as
 * missing) lets Alexi still start up with a reduced-but-functional
 * configuration.
 *
 * Mirrors upstream `isAccessDenied` from opencode's `util/fs-util`.
 */
export function isAccessDenied(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const code = (err as NodeJS.ErrnoException).code;
  return code === 'EACCES' || code === 'EPERM';
}

/**
 * Checks whether an error represents either a missing path (`ENOENT`)
 * or a sandboxed access denial. Convenience predicate for boot-time
 * optional lookups (location discovery, global config, instruction
 * files) that must degrade gracefully in both cases.
 */
export function isMissingOrDenied(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const code = (err as NodeJS.ErrnoException).code;
  return code === 'ENOENT' || code === 'EACCES' || code === 'EPERM';
}

/**
 * Attempt a `fs.stat` call that tolerates both missing files and
 * sandboxed access denials. Returns `undefined` for either condition
 * so callers can treat "cannot see this path" uniformly. Any other
 * error (e.g. `EIO`) propagates — those are genuine failures, not
 * expected states.
 */
export async function statOptional(path: string): Promise<Awaited<ReturnType<typeof fs.stat>> | undefined> {
  try {
    return await fs.stat(path);
  } catch (err) {
    if (isMissingOrDenied(err)) {
      return undefined;
    }
    throw err;
  }
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
