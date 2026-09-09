/**
 * Session Goals — persistent per-session goal state.
 *
 * Ports the shape of upstream kilocode `feat(goal): add persistent session
 * goals` (`packages/opencode/src/kilocode/session/goal/*`) at the minimum
 * fidelity Alexi needs today. Full upstream fidelity — the ~486-line
 * `runner.ts`, `policy.ts`, dedicated `tool.ts`, and prompt-queue admission
 * hook — is intentionally deferred to a follow-up PR (see change #6 in
 * the 2026-09-09 update plan).
 *
 * This module gives call sites (prompt queue, orchestrator) a stable
 * `hasActiveGoal(sessionID)` predicate so the wiring for the future
 * runner can be threaded through without churning every call site again
 * later.
 *
 * Storage is in-memory only for now; upstream persists goals in SQLite
 * against the session row. When the SQL side is ported, swap
 * `activeGoals` for a DB read behind the same predicate.
 */

/**
 * A single persistent session goal, as stored per upstream shape. Only
 * the fields Alexi consumes today are typed; add more when the runner
 * lands.
 */
export interface SessionGoal {
  /** Session this goal is scoped to. */
  sessionID: string;
  /** User-supplied completion condition (natural language). */
  condition: string;
  /** Wall-clock enqueue timestamp for diagnostics. */
  createdAt: number;
  /**
   * Lifecycle state. `running` means the goal runner is (or should be)
   * driving turns for this session; `paused` means the user or a policy
   * check suspended it; `done` means the completion condition was met or
   * the max-turns cap was reached and the goal is retained only for the
   * transcript.
   */
  status: 'running' | 'paused' | 'done';
}

const activeGoals = new Map<string, SessionGoal>();

/**
 * Return true when the given session has a goal in the `running` state.
 * Used by the prompt queue to decide whether an incoming user prompt
 * should preempt an in-flight goal turn or be enqueued behind it.
 */
export function hasActiveGoal(sessionID: string): boolean {
  const goal = activeGoals.get(sessionID);
  return goal !== undefined && goal.status === 'running';
}

/**
 * Return the currently-tracked goal for a session, or `undefined` when
 * the session has none. Copies the row so callers cannot mutate the
 * store through the returned reference.
 */
export function getGoal(sessionID: string): SessionGoal | undefined {
  const goal = activeGoals.get(sessionID);
  return goal ? { ...goal } : undefined;
}

/**
 * Register a running goal for a session. Overwrites any existing goal
 * on the same session (upstream policy: one goal per session at a
 * time). Idempotent when called with the same condition.
 */
export function startGoal(sessionID: string, condition: string): SessionGoal {
  const goal: SessionGoal = {
    sessionID,
    condition,
    createdAt: Date.now(),
    status: 'running',
  };
  activeGoals.set(sessionID, goal);
  return goal;
}

/**
 * Move the session's goal (if any) into the terminal `done` state.
 * Retained in the map so subsequent `getGoal` calls can still surface
 * the completion condition to the transcript.
 */
export function completeGoal(sessionID: string): void {
  const goal = activeGoals.get(sessionID);
  if (!goal) {
    return;
  }
  activeGoals.set(sessionID, { ...goal, status: 'done' });
}

/**
 * Discard any tracked goal for the session. Called on session close.
 */
export function clearGoal(sessionID: string): void {
  activeGoals.delete(sessionID);
}

/** Test-only helper: reset the in-memory store. */
export function __resetSessionGoalsForTests(): void {
  activeGoals.clear();
}
