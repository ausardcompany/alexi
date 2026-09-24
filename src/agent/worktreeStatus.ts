/**
 * Agent worktree status registry.
 *
 * Ports the intent of upstream kilocode PR #14487 (`fix(agent-manager): forward
 * all owned session activity events`) into an Alexi-native, TUI-friendly
 * shape: a tiny in-memory registry that maps a worktree id (or directory
 * path — either works, the registry treats it as an opaque string key) to
 * its current lifecycle status, plus a pub/sub API so React consumers can
 * subscribe without reaching into the module state directly.
 *
 * The registry is deliberately synchronous, in-process, and side-effect
 * free. It has no dependency on `src/core/agent-manager/orchestration-api.ts`
 * because that module is transport-layer forwarding logic — this one is UI
 * state. Callers (the future headless orchestrator, tests, or the tool
 * layer) push status updates in with {@link setWorktreeStatus}; TUI code
 * subscribes via {@link useWorktreeStatus}.
 *
 * Status vocabulary matches the Kilocode #14487 semantics and the
 * "running / idle / error / blocked" mapping requested by issue #1826:
 *
 *   - `running` : session is actively producing output (spinner).
 *   - `idle`    : session is alive but not currently working (checkmark).
 *   - `error`   : session terminated with a failure (X).
 *   - `blocked` : session is waiting on a permission or question (pause).
 *   - `unknown` : status has not been reported yet (question mark).
 *
 * The `unknown` state is intentionally the default: a worktree that has
 * never emitted a status event should surface as `unknown` in the UI
 * rather than silently defaulting to `idle` (which would misrepresent a
 * dead session as ready).
 */

/**
 * Lifecycle status of a single Agent Manager worktree, as displayed in
 * the TUI sidebar. Kept as a plain string-literal union so that the icon
 * mapping in `StatusIcon.tsx` is exhaustive at compile time.
 */
export type WorktreeStatus = 'running' | 'idle' | 'error' | 'blocked' | 'unknown';

/**
 * Snapshot of one worktree's tracked state.
 *
 * The `label` is what the TUI renders next to the status icon (typically
 * the worktree directory basename or a human-readable branch name). It
 * is separate from `id` so multiple worktrees can share the same label
 * without collision — the id must be unique.
 */
export interface WorktreeStatusEntry {
  readonly id: string;
  readonly label: string;
  readonly status: WorktreeStatus;
  /** Optional detail string surfaced on hover / in a status tooltip. */
  readonly detail?: string;
  /** Wall-clock ms when the status was last updated. */
  readonly updatedAt: number;
}

/**
 * Listener signature for {@link subscribe}. Receives the current full
 * snapshot on every change; consumers may re-render or diff themselves.
 */
export type WorktreeStatusListener = (snapshot: readonly WorktreeStatusEntry[]) => void;

/**
 * In-memory registry. Kept module-scoped rather than exported directly so
 * consumers must go through the API (which enforces immutability of the
 * emitted snapshots).
 */
const entries = new Map<string, WorktreeStatusEntry>();
const listeners = new Set<WorktreeStatusListener>();

function snapshot(): readonly WorktreeStatusEntry[] {
  // Freeze each entry so accidental mutation surfaces immediately in
  // tests. The outer array is intentionally readonly by return type
  // rather than Object.frozen — freezing arrays disables Array.prototype
  // methods that some consumers rely on.
  return Array.from(entries.values(), (entry) => Object.freeze({ ...entry }));
}

function emit(): void {
  const snap = snapshot();
  for (const listener of listeners) {
    listener(snap);
  }
}

/**
 * Insert or update a worktree's status. Emits a snapshot to every
 * subscriber whenever the effective status, label, or detail changes.
 *
 * Passing the same (status, label, detail) as the current entry is a
 * no-op that does NOT emit — this avoids re-render storms when the
 * orchestrator pushes redundant `idle` events during a quiet period.
 */
export function setWorktreeStatus(
  id: string,
  update: { label: string; status: WorktreeStatus; detail?: string }
): void {
  const existing = entries.get(id);
  if (
    existing !== undefined &&
    existing.label === update.label &&
    existing.status === update.status &&
    existing.detail === update.detail
  ) {
    return;
  }
  entries.set(id, {
    id,
    label: update.label,
    status: update.status,
    detail: update.detail,
    updatedAt: Date.now(),
  });
  emit();
}

/**
 * Remove a worktree from the registry. Matches the "explicit deleted
 * event drops the owner entry" clause of PR #14487 — every other status
 * transition (including `error`) leaves the entry in place so the UI
 * still shows the failure. Only call this when the worktree is fully
 * torn down.
 */
export function removeWorktreeStatus(id: string): void {
  if (entries.delete(id)) {
    emit();
  }
}

/**
 * Return an immutable snapshot of the current registry. Order is
 * insertion order (Map iteration order) so the UI renders new worktrees
 * at the bottom of the list — matching how Kilocode #14487 stacks them.
 */
export function getWorktreeStatuses(): readonly WorktreeStatusEntry[] {
  return snapshot();
}

/**
 * Look up a single worktree's status. Returns `undefined` when the id
 * has never been reported (as opposed to explicitly `unknown`, which
 * would be a real entry with `status: 'unknown'`).
 */
export function getWorktreeStatus(id: string): WorktreeStatusEntry | undefined {
  const entry = entries.get(id);
  return entry ? { ...entry } : undefined;
}

/**
 * Subscribe to registry changes. Returns an unsubscribe function.
 *
 * The listener is invoked once synchronously with the current snapshot
 * so subscribers can seed their state without a separate `getSnapshot`
 * call — a common pattern for React `useSyncExternalStore` bindings.
 */
export function subscribe(listener: WorktreeStatusListener): () => void {
  listeners.add(listener);
  listener(snapshot());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Test-only helper: wipe the registry and drop every listener. NOT
 * exported through the barrel; import directly in tests.
 */
export function __resetWorktreeStatusRegistry(): void {
  entries.clear();
  listeners.clear();
}
