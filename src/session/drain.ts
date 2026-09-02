/**
 * Session drain service.
 *
 * Ports the upstream opencode `packages/opencode/src/kilocode/session/drain.ts`
 * lifecycle contract to Alexi's Promise-based runtime. The goal is the
 * same: guarantee that background session work (tool events, streaming
 * chunks still being written to disk, telemetry flushes) finishes before
 * a headless CLI command (`alexi chat`, `alexi agent`) exits. Without this
 * the process can `exit(0)` while sessions are still emitting events,
 * corrupting persisted state and losing user-visible output.
 *
 * Upstream commits addressed by this port:
 *   - fix(cli): drain background work before headless exit
 *   - harden drain lifecycle (idempotent drain, timeout budget)
 *   - snapshot drain waiters before resuming them (avoid mutation-during-
 *     iteration bugs when a completing waiter registers a follow-up)
 *   - resolve main conflicts in headless drain
 *
 * Alexi does NOT ship the upstream Effect-TS `SessionDrain` Service /
 * LayerNode surface — Alexi's runtime is plain Node.js Promises with an
 * ESM module singleton. The public API below mirrors the upstream method
 * names (`track`, `untrack`, `drain`) so future ports of run.ts /
 * headless flush code can call them verbatim.
 */

/**
 * A pending piece of session work being tracked by the drain manager.
 * Each entry pairs a stable `id` (usually a session or tool-call id) with
 * the underlying Promise that must settle before the process exits.
 */
interface TrackedWork {
  readonly id: string;
  readonly promise: Promise<unknown>;
}

/** Options accepted by {@link SessionDrain.drain}. */
export interface DrainOptions {
  /**
   * Upper bound on how long the drain call will wait for outstanding work
   * before giving up. Defaults to 30_000 ms (30s), matching upstream. A
   * value of `0` disables the timeout and waits indefinitely — use with
   * care from CLI commands.
   */
  timeoutMs?: number;
}

/**
 * Singleton drain manager. Callers should not construct this directly;
 * use the exported {@link SessionDrain} instance. A single module-level
 * singleton is intentional so that call sites deep in the tool pipeline
 * (e.g. bash streaming, session persistence) do not need to thread a
 * service instance through every function signature.
 */
class SessionDrainImpl {
  private readonly pending = new Map<string, Promise<unknown>>();
  /**
   * `true` once {@link drain} has completed. Further `track` calls become
   * no-ops so callers cannot re-arm the drain after the process has
   * decided to exit. Matches upstream "drain is one-shot per lifecycle"
   * semantics.
   */
  private drained = false;

  /**
   * Register a Promise representing outstanding session work. The
   * returned function untracks the entry — call it in a `finally` block
   * so exceptions do not leave orphaned entries in the map.
   *
   * If the drain has already run, `track` is a no-op (returns a no-op
   * unregister) so late-arriving work cannot indefinitely block exit.
   */
  track(id: string, promise: Promise<unknown>): () => void {
    if (this.drained) {
      return () => {};
    }
    this.pending.set(id, promise);
    // Auto-untrack when the tracked promise settles so callers that
    // forget to untrack (or lose the returned handle) still let the
    // drain succeed. `catch` swallows the rejection here because the
    // caller owns error handling for their own promise.
    promise
      .catch(() => {
        /* rejection handled by caller */
      })
      .finally(() => {
        this.pending.delete(id);
      });
    return () => this.untrack(id);
  }

  /**
   * Remove a tracked entry. Safe to call multiple times or with an
   * unknown id — extra calls are no-ops.
   */
  untrack(id: string): void {
    this.pending.delete(id);
  }

  /**
   * Number of currently tracked entries. Exposed for tests and debug
   * logging. Not part of the drain contract itself.
   */
  size(): number {
    return this.pending.size;
  }

  /**
   * Wait for all tracked work to settle, then mark the drain as complete.
   * The set of waiters is snapshotted at the start (upstream fix
   * "snapshot drain waiters before resuming them") so a completing
   * waiter that registers a follow-up cannot mutate the collection we
   * are iterating.
   *
   * The call is idempotent: after the first drain resolves, subsequent
   * `drain()` calls resolve immediately with an empty set.
   */
  async drain(options: DrainOptions = {}): Promise<void> {
    if (this.drained) {
      return;
    }
    const timeoutMs = options.timeoutMs ?? 30_000;

    // Snapshot the waiter set BEFORE awaiting — otherwise a handler that
    // schedules follow-up work during its own settle would race with us.
    const snapshot: TrackedWork[] = Array.from(this.pending.entries()).map(([id, promise]) => ({
      id,
      promise,
    }));

    const settle = Promise.allSettled(snapshot.map((entry) => entry.promise));

    if (timeoutMs > 0) {
      let timer: ReturnType<typeof setTimeout> | undefined;
      const timeout = new Promise<'timeout'>((resolve) => {
        timer = setTimeout(() => resolve('timeout'), timeoutMs);
      });
      const outcome = await Promise.race([settle.then(() => 'done' as const), timeout]);
      if (timer) {
        clearTimeout(timer);
      }
      // On timeout we still mark drain complete — the process is exiting
      // and further tracking would leak. Callers that need a hard
      // guarantee can await `settle` themselves before calling drain.
      if (outcome === 'timeout') {
        // Intentional: swallow late settle so unhandled rejections don't
        // fire after we've conceptually torn down.
        settle.catch(() => {
          /* drained past timeout */
        });
      }
    } else {
      await settle;
    }

    this.drained = true;
    this.pending.clear();
  }

  /**
   * Reset the drain state. Test-only — production code should never
   * call this. Mirrors upstream test fixture behaviour where the drain
   * is torn down between test runs.
   */
  __resetForTests(): void {
    this.pending.clear();
    this.drained = false;
  }
}

/**
 * Module-level singleton. Import this and call `.track()` / `.drain()`
 * from any subsystem that owns session-scoped background work.
 *
 * @example
 *   const unregister = SessionDrain.track(sessionId, longRunningFlush());
 *   // ... later, before `process.exit(...)` in a headless entry point:
 *   await SessionDrain.drain({ timeoutMs: 30_000 });
 */
export const SessionDrain = new SessionDrainImpl();
