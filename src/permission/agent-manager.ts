/**
 * Agent-manager permission / blocker store.
 *
 * Ports two upstream fixes:
 *  - opencode `7baefdddf feat(agent-manager): answer pending questions` —
 *    exposes `getBlocker` / `answerQuestion` so the orchestrator can
 *    unblock sub-agents waiting on a clarification.
 *  - opencode `98559c9d6 fix(agent-manager): fail closed on blocker
 *    lookup errors` — when the underlying store throws (transient IO,
 *    corrupted state, revoked credentials, ...), `isBlocked()` returns
 *    `true` so the caller can NOT proceed on stale/unknown state. This
 *    matches SAP-grade security posture: any ambiguity is resolved
 *    against the sub-agent, never against the user.
 *
 * The store is in-process by default; a persistent backing can be
 * plugged in later via `setBlockerStore`. This is intentionally
 * minimal — Alexi doesn't yet run cross-process sub-agents, but the
 * shape is what the upstream tool expects.
 */

import { logger } from '../utils/logger.js';

/**
 * A blocker recorded against a sub-agent. `kind === 'question'` means
 * the sub-agent is waiting for a text answer from the orchestrator;
 * `kind === 'permission'` means it is waiting on a tool-permission
 * decision. Only `question` is answerable via `answerQuestion` today.
 */
export interface Blocker {
  kind: 'question' | 'permission';
  /** The question prompt shown to the orchestrator when it inspects the sub-agent. */
  prompt?: string;
  /** Optional metadata payload attached by the sub-agent. */
  meta?: Record<string, unknown>;
}

export interface BlockerStore {
  get(agentId: string): Promise<Blocker | undefined>;
  set(agentId: string, blocker: Blocker): Promise<void>;
  clear(agentId: string): Promise<void>;
}

/**
 * Default in-memory store. Sufficient for single-process Alexi runs;
 * multi-process orchestration should call `setBlockerStore` with a
 * shared backend (Redis, filesystem journal, ...) at boot.
 */
class InMemoryBlockerStore implements BlockerStore {
  private readonly map = new Map<string, Blocker>();

  async get(agentId: string): Promise<Blocker | undefined> {
    return this.map.get(agentId);
  }

  async set(agentId: string, blocker: Blocker): Promise<void> {
    this.map.set(agentId, blocker);
  }

  async clear(agentId: string): Promise<void> {
    this.map.delete(agentId);
  }
}

let store: BlockerStore = new InMemoryBlockerStore();

/**
 * Replace the backing blocker store. Intended for tests (to inject a
 * throwing store and exercise the fail-closed branch of `isBlocked`)
 * and for future persistent backends.
 */
export function setBlockerStore(next: BlockerStore): void {
  store = next;
}

/**
 * Reset the store to a fresh in-memory instance. Test hook only.
 */
export function _resetBlockerStoreForTests(): void {
  store = new InMemoryBlockerStore();
}

/**
 * Return the blocker recorded for `agentId`, or `undefined` when the
 * sub-agent is not currently blocked. Lookup failures propagate as
 * `undefined` from this helper — callers that need the fail-closed
 * semantics should use `isBlocked` instead.
 */
export async function getBlocker(agentId: string): Promise<Blocker | undefined> {
  try {
    return await store.get(agentId);
  } catch (err) {
    logger.warn('blocker lookup failed', { agentId, err });
    return undefined;
  }
}

/**
 * Record a blocker against `agentId`. Called by the sub-agent runtime
 * whenever it needs a decision from the orchestrator.
 */
export async function setBlocker(agentId: string, blocker: Blocker): Promise<void> {
  await store.set(agentId, blocker);
}

/**
 * Deliver an answer to a sub-agent's pending question. This clears the
 * blocker; the sub-agent runtime is responsible for actually delivering
 * the answer to the waiting session (wired via a bus event in the
 * orchestration layer). Alexi's minimal implementation just clears
 * the entry — future work will publish on the internal event bus.
 */
export async function answerQuestion(agentId: string, _answer: string): Promise<void> {
  await store.clear(agentId);
}

/**
 * Fail-closed lookup: return `true` when the sub-agent is blocked, OR
 * when the store lookup threw (upstream `98559c9d6`). Returning `false`
 * on a store error would let the caller silently bypass a real block.
 */
export async function isBlocked(agentId: string): Promise<boolean> {
  try {
    const blocker = await store.get(agentId);
    return blocker != null;
  } catch (err) {
    logger.warn('blocker lookup failed; failing closed', { agentId, err });
    // Fail-closed: treat as blocked so caller cannot proceed on stale state.
    return true;
  }
}
