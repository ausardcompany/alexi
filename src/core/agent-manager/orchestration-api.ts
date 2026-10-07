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

// ---------------------------------------------------------------------------
// Worktree pinning (upstream kilocode PR #14891)
// ---------------------------------------------------------------------------
//
// The Agent Manager sidebar lets users pin individual worktrees to the top
// so critical ones stay visible when the fleet grows beyond what fits on
// screen. Pin state is tracked in two places:
//
//   1. The in-memory worktree status registry (`src/agent/worktreeStatus.ts`)
//      so the TUI can project it into sort order on every snapshot.
//   2. A tiny on-disk file under `~/.alexi/agent-manager.json` so a user
//      who pinned a worktree in one session sees it pinned on the next
//      launch.
//
// The two layers are kept decoupled by this module: the TUI pushes pin
// events through `toggleWorktreePin` (updates registry + schedules a
// debounced write), and startup code calls `loadPersistedPinnedWorktrees`
// to seed the registry from the file.

import { promises as fsPromises } from 'fs';
import path from 'path';
import os from 'os';
import {
  getPinnedWorktreeIds,
  getWorktreeStatus,
  setWorktreePinned,
  toggleWorktreePin as toggleRegistryPin,
} from '../../agent/worktreeStatus.js';

/**
 * On-disk shape of `~/.alexi/agent-manager.json`. Deliberately small and
 * forward-compatible: unknown fields are preserved on write via spread so
 * a future release can add keys without clobbering state written by the
 * current one.
 */
export interface AgentManagerPersistedState {
  readonly pinnedWorktrees?: readonly string[];
  readonly [extra: string]: unknown;
}

/**
 * Default path for the persisted Agent Manager state. Exported so tests
 * can override via {@link setAgentManagerStatePathForTesting} without
 * reaching into module internals.
 */
export const DEFAULT_AGENT_MANAGER_STATE_PATH = path.join(
  os.homedir(),
  '.alexi',
  'agent-manager.json'
);

let agentManagerStatePath = DEFAULT_AGENT_MANAGER_STATE_PATH;

/**
 * Test-only hook: redirect the persistence file to a temp location. The
 * CLI never calls this; test setup does, typically against a path under
 * `fs.mkdtemp(os.tmpdir())`.
 */
export function setAgentManagerStatePathForTesting(nextPath: string): void {
  agentManagerStatePath = nextPath;
}

/**
 * Reset the persistence path to the default (`~/.alexi/agent-manager.json`).
 * Test-only companion to {@link setAgentManagerStatePathForTesting}.
 */
export function resetAgentManagerStatePathForTesting(): void {
  agentManagerStatePath = DEFAULT_AGENT_MANAGER_STATE_PATH;
}

/**
 * Read the persisted Agent Manager state. Returns an empty object when
 * the file is missing (first run) or malformed — a corrupted file must
 * not block the TUI from starting.
 */
export async function readAgentManagerState(): Promise<AgentManagerPersistedState> {
  try {
    const raw = await fsPromises.readFile(agentManagerStatePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as AgentManagerPersistedState;
    }
    return {};
  } catch (err) {
    const code = (err as NodeJS.ErrnoException | undefined)?.code;
    if (code === 'ENOENT') {
      return {};
    }
    // Treat anything else (bad JSON, EACCES, EISDIR, ...) as "no state"
    // rather than crashing. The next successful write will overwrite the
    // broken file.
    return {};
  }
}

/**
 * Write the persisted Agent Manager state, creating the parent directory
 * when needed. Unknown fields from the previous version are preserved by
 * callers via spread before invoking this function.
 */
export async function writeAgentManagerState(state: AgentManagerPersistedState): Promise<void> {
  await fsPromises.mkdir(path.dirname(agentManagerStatePath), { recursive: true });
  await fsPromises.writeFile(agentManagerStatePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

/**
 * Load the persisted pin list and apply it to any entries already in
 * the in-memory registry. Returns the subset of ids that were actually
 * applied (i.e. ids whose entries were present) so callers can detect
 * stale pins pointing at worktrees that no longer exist.
 *
 * Call this from Agent Manager startup, after the initial worktree
 * discovery pass has populated the registry.
 */
export async function loadPersistedPinnedWorktrees(): Promise<readonly string[]> {
  const state = await readAgentManagerState();
  const ids = Array.isArray(state.pinnedWorktrees) ? state.pinnedWorktrees : [];
  const applied: string[] = [];
  for (const id of ids) {
    if (typeof id !== 'string') {
      continue;
    }
    if (getWorktreeStatus(id) !== undefined) {
      setWorktreePinned(id, true);
      applied.push(id);
    }
  }
  return applied;
}

/**
 * Persist the current set of pinned worktree ids to disk, preserving
 * any unknown fields already present in the state file. Safe to call
 * repeatedly; the file is small and the write is atomic enough for a
 * single-user config.
 */
export async function persistPinnedWorktrees(): Promise<void> {
  const existing = await readAgentManagerState();
  const next: AgentManagerPersistedState = {
    ...existing,
    pinnedWorktrees: Array.from(getPinnedWorktreeIds()),
  };
  await writeAgentManagerState(next);
}

/**
 * Toggle the pin flag on a worktree AND persist the change to disk.
 * Returns the new pin state (`true` pinned, `false` unpinned) or
 * `undefined` when the id is not in the registry — in that case the
 * disk file is not touched.
 *
 * TUI callers should prefer this over the lower-level registry helper:
 * it keeps the on-disk state in lockstep with the live snapshot so a
 * crash between toggle and write cannot leave the user with a pinned
 * worktree that silently loses its pin on next launch.
 */
export async function toggleWorktreePin(id: string): Promise<boolean | undefined> {
  const next = toggleRegistryPin(id);
  if (next === undefined) {
    return undefined;
  }
  await persistPinnedWorktrees();
  return next;
}
