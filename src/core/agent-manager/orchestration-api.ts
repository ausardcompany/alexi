/**
 * Agent Manager orchestration API — activity event forwarding.
 *
 * Ports the intent of upstream kilocode PR #14487 (merged 2026-09-23,
 * `fix(agent-manager): forward all owned session activity events`).
 * Previously the Agent Manager filtered activity events by the
 * currently-selected worktree, so sessions in background worktrees kept
 * stale status until the user switched to that worktree. Completed,
 * failed, waiting, scheduled state never reached the sidebar for those
 * sessions.
 *
 * The fix classifies events by cost and locality:
 *
 *  - **Activity events** (`status`, `deleted`, `wakeup`, `turn-close`,
 *    `error`, `asked`, `replied`) are cheap metadata updates. They are
 *    forwarded for ALL owned sessions regardless of the selected
 *    worktree so the sidebar always reflects reality.
 *  - **Transcript events** (message deltas, tool output chunks, etc.)
 *    are expensive and only useful for the session the user is looking
 *    at. They stay filtered by the selected worktree.
 *
 * Additionally, when a session goes `offline` we KEEP its owner entry
 * around, because offline is not end-of-turn: the session may reconnect
 * later and we want to resume forwarding without losing ownership.
 * Only an explicit `deleted` event drops the owner entry.
 *
 * Alexi does not (yet) run a live Agent Manager UI, so this module is
 * infrastructure that the future Ink sidebar and any headless
 * orchestrator will consume. It is self-contained and side-effect
 * free — subscribing to the internal event bus is the caller's job.
 */

import path from 'path';
import { clearProviderCache } from '../../providers/index.js';

/**
 * Activity event kinds forwarded for ALL owned sessions.
 *
 * Kept as a string-literal union rather than a `z.enum` so that
 * consumers of this module can add their own subclass events without
 * a schema-registry round trip. The runtime guard is
 * {@link isActivityEventKind}.
 */
export type ActivityEventKind =
  'status' | 'deleted' | 'wakeup' | 'turn-close' | 'error' | 'asked' | 'replied';

const ACTIVITY_EVENT_KINDS: ReadonlySet<ActivityEventKind> = new Set<ActivityEventKind>([
  'status',
  'deleted',
  'wakeup',
  'turn-close',
  'error',
  'asked',
  'replied',
]);

/**
 * Status values a session may report on `status` activity events.
 *
 * `offline` is intentionally NOT treated as end-of-turn — see
 * {@link isEndOfLife} — because a session that goes offline may
 * reconnect and continue.
 */
export type SessionStatus = 'idle' | 'offline' | 'completed' | 'failed' | 'waiting' | 'scheduled';

/**
 * A single activity event emitted by an owned session.
 */
export interface ActivityEvent {
  readonly kind: ActivityEventKind;
  readonly sessionId: string;
  /** Directory the session is running in (used for transcript filtering). */
  readonly worktreeDir?: string;
  /** Present on `status` events. */
  readonly status?: SessionStatus;
  /** Free-form payload passed through to consumers. */
  readonly payload?: unknown;
}

/**
 * A transcript event (message delta, tool output chunk, ...). Kept
 * intentionally structural so the forwarder does not have to know the
 * concrete transcript shape — that lives in `sessionManager` and
 * `streamingOrchestrator`.
 */
export interface TranscriptEvent {
  readonly sessionId: string;
  /** Directory the session is running in — required for filtering. */
  readonly worktreeDir: string;
  readonly payload: unknown;
}

/** Runtime guard used when a caller receives an arbitrary event string. */
export function isActivityEventKind(kind: string): kind is ActivityEventKind {
  return ACTIVITY_EVENT_KINDS.has(kind as ActivityEventKind);
}

/**
 * A session is considered end-of-life ONLY when it is explicitly
 * `deleted`. Every other status (including `offline`, `completed`,
 * `failed`) leaves the owner entry in place. This ports the
 * "keep owner entry when status goes offline" clause of PR #14487 —
 * offline is a transient reconnect state, not a terminal state.
 */
export function isEndOfLife(event: ActivityEvent): boolean {
  return event.kind === 'deleted';
}

/**
 * Forwarding decision returned by {@link ActivityEventForwarder.decide}.
 *
 * `reason` is populated for observability so callers (tests, TUI
 * telemetry overlay) can explain WHY an event was dropped without
 * re-implementing the classification.
 */
export interface ForwardingDecision {
  readonly forward: boolean;
  readonly reason:
    'activity-owned' | 'activity-not-owned' | 'transcript-selected' | 'transcript-background';
}

/**
 * Registry of "sessions we own" plus the pure forwarding decision
 * logic. Deliberately in-memory and synchronous — kilocode's
 * equivalent is also a plain object in the Agent Manager service.
 *
 * The forwarder does not itself subscribe to the internal event bus:
 * a caller (the Agent Manager service wiring, or a test) calls
 * `decide()` for each incoming event and forwards / drops based on
 * the result. This keeps the module trivial to unit-test.
 */
/**
 * Result of a worktree bootstrap attempt tracked by
 * {@link ActivityEventForwarder}. Consumers use this to decide whether
 * the next activation must retry provider/config initialization.
 */
export interface WorktreeBootstrapState {
  /** Normalized (resolved) worktree directory. */
  readonly worktreeDir: string;
  /** `true` when the last bootstrap succeeded. */
  readonly bootstrapped: boolean;
  /** Last error observed, if any. Kept purely for diagnostics. */
  readonly lastError?: string;
}

/**
 * Normalize a worktree path for use as a cache key. Mirrors
 * `normalizeProjectPath` in `src/providers/index.ts` — kept local to
 * avoid a mutual import.
 */
function normalizeWorktreeDir(dir: string): string {
  const resolved = path.resolve(dir);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

export class ActivityEventForwarder {
  private readonly owned = new Set<string>();
  private selectedWorktree: string | undefined;

  /**
   * Per-worktree bootstrap state. Populated by {@link markWorktreeBootstrap}
   * and consumed by {@link activateWorktree} to decide whether a retry
   * is required.
   */
  private readonly worktreeState = new Map<string, WorktreeBootstrapState>();

  /** Mark a session as owned by this Agent Manager instance. */
  addOwnedSession(sessionId: string): void {
    this.owned.add(sessionId);
  }

  /** Drop a session from the owned set (typically only on `deleted`). */
  removeOwnedSession(sessionId: string): void {
    this.owned.delete(sessionId);
  }

  isOwned(sessionId: string): boolean {
    return this.owned.has(sessionId);
  }

  /**
   * Set (or clear with `undefined`) the currently-selected worktree.
   *
   * When the selection changes to a DIFFERENT worktree (issue #1834),
   * the project-scoped provider cache for the OUTGOING worktree is
   * dropped so its resolved credentials, resource group, and model
   * catalog are not silently reused after the switch. This mirrors
   * Kilocode #14557 (project-scoped config caching): providers must
   * rebuild against the new worktree's environment on first use.
   *
   * Selecting the same worktree twice is a no-op (no cache flush).
   * Clearing the selection (`undefined`) drops the previous
   * worktree's cache but does NOT flush the entire process — other
   * projects keep their warm providers.
   */
  setSelectedWorktree(worktreeDir: string | undefined): void {
    const previous = this.selectedWorktree;
    const next = worktreeDir;

    if (previous === next) {
      return;
    }

    // Drop the outgoing worktree's provider cache so credentials do
    // not leak into it if it is reselected later after an env change.
    if (previous !== undefined) {
      clearProviderCache(previous);
    }

    this.selectedWorktree = next;
  }

  getSelectedWorktree(): string | undefined {
    return this.selectedWorktree;
  }

  /**
   * Record the outcome of a worktree bootstrap. Callers invoke this
   * from the worktree spawn / hydrate path with `ok=true` after a
   * successful provider/config init, or `ok=false` with the error
   * message when init throws. The stored state drives the
   * retry-on-activation behaviour of {@link activateWorktree}.
   */
  markWorktreeBootstrap(worktreeDir: string, ok: boolean, error?: string): void {
    const key = normalizeWorktreeDir(worktreeDir);
    this.worktreeState.set(key, {
      worktreeDir: key,
      bootstrapped: ok,
      lastError: ok ? undefined : (error ?? 'unknown error'),
    });
  }

  /**
   * Inspect the stored bootstrap state for a worktree.
   *
   * Returns `undefined` when the worktree has never been bootstrapped.
   * Consumers should treat that as "cold" — the same as a failed
   * bootstrap for the purpose of retry logic.
   */
  getWorktreeBootstrap(worktreeDir: string): WorktreeBootstrapState | undefined {
    return this.worktreeState.get(normalizeWorktreeDir(worktreeDir));
  }

  /**
   * Activate a worktree: select it, clear stale provider state for it,
   * and run `bootstrap` when the worktree has never been initialized or
   * its previous bootstrap failed.
   *
   * The `bootstrap` callback is expected to (re-)initialise providers,
   * routing config, and the model catalog for the target worktree. It
   * may be async; any thrown error is captured on the bootstrap state
   * and re-thrown so the caller can surface it — the next
   * `activateWorktree` call for the same worktree will retry.
   *
   * When the previous bootstrap already succeeded, this method still
   * flushes any cached providers for the OUTGOING worktree (via
   * {@link setSelectedWorktree}) but does NOT re-run bootstrap.
   * Callers that need an unconditional refresh should call
   * {@link markWorktreeBootstrap}`(worktreeDir, false)` before invoking
   * `activateWorktree`.
   */
  async activateWorktree(
    worktreeDir: string,
    bootstrap: () => Promise<void> | void
  ): Promise<void> {
    const key = normalizeWorktreeDir(worktreeDir);
    this.setSelectedWorktree(key);

    const state = this.worktreeState.get(key);
    if (state?.bootstrapped === true) {
      return;
    }

    // Also drop the incoming worktree's cache — a failed previous
    // bootstrap may have left partially-initialised providers that
    // reference broken credentials.
    clearProviderCache(key);

    try {
      await bootstrap();
      this.markWorktreeBootstrap(key, true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.markWorktreeBootstrap(key, false, msg);
      throw err;
    }
  }

  /**
   * Classify an activity event: forward for every owned session
   * regardless of selected worktree; drop for non-owned sessions.
   * This is the core PR #14487 change — the old code additionally
   * required `event.worktreeDir === selectedWorktree` here.
   */
  decideActivity(event: ActivityEvent): ForwardingDecision {
    if (this.owned.has(event.sessionId)) {
      return { forward: true, reason: 'activity-owned' };
    }
    return { forward: false, reason: 'activity-not-owned' };
  }

  /**
   * Classify a transcript event: only forward when the session's
   * worktree matches the currently-selected one. Background transcript
   * events are dropped because syncing full transcripts for background
   * sessions is too expensive and the user cannot see them anyway.
   */
  decideTranscript(event: TranscriptEvent): ForwardingDecision {
    if (!this.owned.has(event.sessionId)) {
      return { forward: false, reason: 'activity-not-owned' };
    }
    if (this.selectedWorktree && event.worktreeDir === this.selectedWorktree) {
      return { forward: true, reason: 'transcript-selected' };
    }
    return { forward: false, reason: 'transcript-background' };
  }

  /**
   * Process an incoming activity event: return whether to forward and,
   * as a side effect, drop the owner entry if and only if the event is
   * end-of-life. `offline` and every other non-`deleted` status leave
   * the owner entry intact so a reconnect resumes forwarding.
   */
  handleActivity(event: ActivityEvent): ForwardingDecision {
    const decision = this.decideActivity(event);
    if (decision.forward && isEndOfLife(event)) {
      this.owned.delete(event.sessionId);
    }
    return decision;
  }
}

/**
 * Legacy entrypoint retained for backward compatibility with the
 * stub that previously lived in this file. New callers should
 * instantiate {@link ActivityEventForwarder} directly.
 */
export function orchestrateAgentManagerSessions(): ActivityEventForwarder {
  return new ActivityEventForwarder();
}
