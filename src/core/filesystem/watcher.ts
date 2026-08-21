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
 *
 * ## Instance scoping (kilocode b8984e468)
 *
 * The watcher's `Map<string, disposer>` state is scoped to an
 * {@link InstanceWatcher} rather than a module-level singleton. Two
 * concurrent Alexi sessions (e.g. multiple SAP AI Core workspaces
 * running in the same process, or a headless `agent` command running
 * alongside the interactive TUI) MUST NOT share watcher state — a
 * `stop()` from one session would otherwise tear down the peer's
 * watches. A backwards-compatible module-level default instance is
 * preserved so callers that never touched the multi-instance surface
 * keep working unchanged.
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

/**
 * Per-instance watcher registry. Tracks the set of directories
 * currently being watched by *this* instance and disposes them on
 * {@link dispose}. Kilocode b8984e468 refactored the upstream watcher
 * from module-global state (which caused cross-talk between concurrent
 * sessions) to this per-instance shape.
 *
 * The instance holds:
 *   - a `Map<directory, disposer>` of active watches;
 *   - a `Map<directory, NodeJS.Timeout>` for debounced re-fires (owned
 *     by whichever backend the caller passes in via `subscribe`).
 *
 * All state is private; the class exposes `start`, `stop`, `has`,
 * `size`, and `dispose` so callers cannot accidentally reach into
 * another instance's state.
 */
export class InstanceWatcher {
  private readonly watchers = new Map<string, () => void>();
  private readonly debouncers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Begin watching `location` when both the VCS guard and the
   * experimental flag allow it. No-op when the guard skips the
   * subscription. Idempotent: calling `start` twice for the same
   * directory returns the existing disposer.
   */
  start(location: WatchLocation, subscribe: (dir: string) => () => void): (() => void) | null {
    const existing = this.watchers.get(location.directory);
    if (existing) {
      return existing;
    }
    const disposer = maybeStartFileWatcher(location, subscribe);
    if (disposer === null) {
      return null;
    }
    // Wrap the disposer so `stop` and external callers converge on the
    // same cleanup path — otherwise a caller that holds onto the raw
    // disposer could bypass our bookkeeping.
    const tracked = (): void => {
      const timer = this.debouncers.get(location.directory);
      if (timer) {
        clearTimeout(timer);
        this.debouncers.delete(location.directory);
      }
      this.watchers.delete(location.directory);
      disposer();
    };
    this.watchers.set(location.directory, tracked);
    return tracked;
  }

  /**
   * Stop watching `directory` if this instance owns a watch on it.
   * Returns true when a watch was disposed, false otherwise.
   */
  stop(directory: string): boolean {
    const disposer = this.watchers.get(directory);
    if (!disposer) {
      return false;
    }
    disposer();
    return true;
  }

  /**
   * Register a debounce timer for `directory`. Any previously stored
   * timer for the same directory is cleared. Exposed so watcher
   * backends can share the instance's timer table without holding a
   * private `Map` of their own.
   */
  setDebounceTimer(directory: string, timer: ReturnType<typeof setTimeout>): void {
    const previous = this.debouncers.get(directory);
    if (previous) {
      clearTimeout(previous);
    }
    this.debouncers.set(directory, timer);
  }

  /** True when this instance is currently watching `directory`. */
  has(directory: string): boolean {
    return this.watchers.has(directory);
  }

  /** Number of active watches on this instance. */
  size(): number {
    return this.watchers.size;
  }

  /**
   * Tear down every watch and clear every pending debounce timer owned
   * by this instance. Safe to call multiple times.
   */
  dispose(): void {
    for (const timer of this.debouncers.values()) {
      clearTimeout(timer);
    }
    this.debouncers.clear();
    // Iterate over a snapshot because each disposer mutates the map.
    for (const disposer of Array.from(this.watchers.values())) {
      disposer();
    }
    this.watchers.clear();
  }
}

/**
 * Legacy default instance for callers that predate the multi-instance
 * refactor. New call sites should own their own {@link InstanceWatcher}
 * (typically hung off the session or workspace object) so concurrent
 * sessions cannot tear down each other's watches.
 */
const defaultInstance = new InstanceWatcher();

/**
 * Backwards-compatible module-level `start` shim. Prefer constructing
 * an {@link InstanceWatcher} directly in new code — this shim exists
 * only for a couple of pre-refactor call sites that assumed a global
 * watcher.
 */
export function startWatcher(
  location: WatchLocation,
  subscribe: (dir: string) => () => void
): (() => void) | null {
  return defaultInstance.start(location, subscribe);
}

/**
 * Test-only accessor for the default instance. Exported so watcher
 * tests can assert on its cross-instance isolation without exposing
 * the raw instance state.
 */
export function getDefaultWatcherInstance(): InstanceWatcher {
  return defaultInstance;
}
