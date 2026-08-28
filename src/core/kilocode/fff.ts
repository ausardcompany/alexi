/**
 * Filesystem root / home directory indexing guard.
 *
 * Ports upstream kilocode commits `6e05f48fb`, `08467dba4`, and `b0dbd398a` —
 * the search/watcher subsystems must NEVER eagerly enumerate a filesystem
 * root (`/`, `C:\`, a UNC share root) or a user's home directory. Doing so
 * causes runaway indexing, resource exhaustion, and accidental scanning of
 * sensitive files.
 *
 * The check is performed on the *resolved* (realpath) directory so symlinks
 * that point at `/` or `$HOME` are also rejected. On Windows, both the
 * canonical `C:\` shape and the extended `\\?\UNC\...` form are recognised.
 *
 * Call sites:
 *   - The filesystem search bootstrap (`src/core/filesystem/*`) must gate
 *     ripgrep/glob enumeration on {@link allowed}. When it returns `false`,
 *     the search subsystem is disabled for that workspace and the user is
 *     shown {@link message} via {@link notices}. File tools (read, write,
 *     grep on explicit paths) remain available; only *automatic* indexing
 *     is disabled.
 *   - The filesystem watcher (`src/core/filesystem/watcher.ts`) must also
 *     gate `subscribe(...)` on {@link allowed} in addition to its existing
 *     VCS + experimental flag guard.
 *
 * The `ALEXI_TEST_HOME` env var overrides the home-directory anchor for
 * tests — production code never sets it.
 */
import { realpathSync } from 'node:fs';
import os from 'os';
import path from 'path';

/** User-facing notice attached to a location when indexing is refused. */
export const message =
  'Automatic indexing is disabled in home and filesystem root directories. Open a project folder to enable indexing. File tools remain available.';

/**
 * Return true when `directory` (already normalised by `api`) is a filesystem
 * root under that path API. `api.parse(dir).root` yields the root form for
 * either POSIX (`/`) or win32 (`C:\`, `\\server\share\`) which we then
 * compare against the normalised input.
 */
function root(directory: string, api: typeof path.posix): boolean {
  if (!api.isAbsolute(directory)) {
    return false;
  }
  return api.normalize(directory) === api.normalize(api.parse(directory).root);
}

/**
 * Best-effort realpath resolution. Falls back to `path.resolve` so a
 * missing / permission-denied directory still yields a comparable string
 * — indexing is refused on the fallback path just as it would be on the
 * resolved one.
 */
function real(directory: string): string {
  try {
    return realpathSync.native(directory);
  } catch {
    return path.resolve(directory);
  }
}

/**
 * Return true when `directory` is a safe location for automatic indexing —
 * i.e. NOT a filesystem root and NOT the user's home directory (in either
 * the given or the resolved form). Callers that automatically enumerate
 * files (search, watcher) MUST gate on this predicate.
 *
 * The optional `home` argument exists so tests can pin the home-directory
 * anchor without mutating `process.env.HOME` for the whole process; the
 * `ALEXI_TEST_HOME` env var provides the same override in a way that
 * respects a nested test.
 */
export function allowed(
  directory: string,
  home = (process.env.ALEXI_TEST_HOME ?? os.homedir()).trim()
): boolean {
  // Recognise the win32 extended-path prefix (`\\?\UNC\server\share\...`) —
  // it decorates a UNC path and must be stripped before the root check.
  const value = path.win32.normalize(directory);
  const prefix = '\\\\?\\UNC\\';
  const windows = value.toUpperCase().startsWith(prefix)
    ? `\\\\${value.slice(prefix.length)}`
    : value;

  if (root(directory, path.posix) || root(windows, path.win32)) {
    return false;
  }

  const resolved = real(directory);
  if (root(resolved, path)) {
    return false;
  }

  const base = real(home);
  return process.platform === 'win32'
    ? resolved.toLowerCase() !== base.toLowerCase()
    : resolved !== base;
}

/**
 * Return the user-facing notice list for a directory. Empty when the
 * directory is safe to index; otherwise a single-entry list carrying
 * {@link message}. Callers surface these notices in the UI so users
 * understand why automatic indexing was skipped.
 */
export function notices(directory: string): Array<{ path: string; message: string }> {
  return allowed(directory) ? [] : [{ path: directory, message }];
}
