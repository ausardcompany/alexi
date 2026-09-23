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
export class ActivityEventForwarder {
  private readonly owned = new Set<string>();
  private selectedWorktree: string | undefined;

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

  /** Set (or clear with `undefined`) the currently-selected worktree. */
  setSelectedWorktree(worktreeDir: string | undefined): void {
    this.selectedWorktree = worktreeDir;
  }

  getSelectedWorktree(): string | undefined {
    return this.selectedWorktree;
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
