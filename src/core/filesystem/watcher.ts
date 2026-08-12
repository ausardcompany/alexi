/**
 * Filesystem Watcher (VCS-guarded)
 *
 * Ports kilocode upstream fix: only initialize the file watcher for
 * locations that have VCS metadata (e.g. a `.git/` directory). Watching
 * a location without VCS is a symptom of a sandboxed SAP AI Core
 * workspace or a scratch directory — the watcher either crashes on
 * missing metadata or falls back to polling and burns CPU.
 *
 * The guard is `location.vcs && experimentalFlag` (both must be true):
 *  - `location.vcs`: caller has already checked for a VCS root
 *    (`fs.stat('.git')` etc.) and set the flag on the location record.
 *  - `experimentalFlag`: opt-in `ALEXI_EXPERIMENTAL_FILEWATCHER=1`
 *    while the feature is behind a flag.
 */

/**
 * Minimal shape of a workspace location the watcher accepts. `directory`
 * is the absolute path to watch; `vcs` is true when the location has
 * been confirmed to have VCS metadata (git / hg / etc.).
 */
export interface WatchLocation {
  directory: string;
  vcs: boolean;
}

/**
 * Return true when the experimental filewatcher is enabled via env flag.
 * Kept as a function so tests can override `process.env` between cases.
 */
export function isExperimentalFileWatcherEnabled(): boolean {
  return process.env.ALEXI_EXPERIMENTAL_FILEWATCHER === '1';
}

/**
 * Subscribe a filesystem watcher to `location.directory` — but ONLY when
 * the location has VCS metadata AND the experimental flag is on. Returns
 * a disposer, or null when the watcher was skipped for either reason.
 *
 * The `subscribe` callback is injected so this module stays independent
 * of the concrete watcher backend (chokidar, native fs.watch, or an
 * Effect-based stream). Callers pass in whichever backend they use.
 */
export function maybeStartFileWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null {
  // Fix: prevents watcher initialization on locations without VCS
  // metadata, which causes crashes or excessive polling in SAP AI Core
  // sandboxed workspaces that may not be git repos.
  if (location.vcs && isExperimentalFileWatcherEnabled()) {
    return subscribe(location.directory);
  }
  return null;
}
