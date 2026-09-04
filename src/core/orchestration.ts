/**
 * Orchestration Prompt Gate
 *
 * Thin coordination layer that decides whether a new user prompt can be
 * dispatched into a session's agent loop, or whether a still-open blocker
 * (a pending clarification question from a prior turn) must be resolved
 * first. Ports upstream opencode fix #13774 — "allow reissued prompts to
 * dismiss stale questions" — where the orchestrator would block
 * indefinitely on an unanswered question if the user typed a new prompt
 * instead of answering.
 *
 * Alexi's blocker store lives in `src/permission/agent-manager.ts` and
 * distinguishes `permission` blockers (must be resolved — permission
 * decisions are not dismissable) from `question` blockers (the sub-agent
 * asked a clarifying question, no side effect until it is answered).
 * `dismissQuestions: 'dismiss'` clears only the `question` blocker so a
 * fresh prompt can proceed while any outstanding permission gate is
 * still respected.
 *
 * See `docs/ARCHITECTURE.md#error-handling` for the transient-vs-permanent
 * error classification that governs whether an outer retry is appropriate
 * on top of this gate.
 */

import { getBlocker } from '../permission/agent-manager.js';

/**
 * Structured error returned by {@link checkPromptBlocker} instead of a
 * bare string, so callers can distinguish "the session is not yet
 * dispatchable" from a real transport failure. Ports the upstream
 * `OrchestrationError('unavailable_session', ...)` shape without pulling
 * the whole opencode error taxonomy into Alexi.
 */
export class OrchestrationError extends Error {
  constructor(
    public readonly code: 'unavailable_session' | 'host_error',
    message: string
  ) {
    super(message);
    this.name = 'OrchestrationError';
  }
}

/**
 * Options accepted by the prompt gate. `questions: 'dismiss'` mirrors the
 * upstream opencode #13774 fix: when the user reissues a slash command or
 * types a new prompt while a prior question is still open, the caller can
 * signal that the outstanding question should be skipped as a blocker so
 * the new prompt can proceed. Permission blockers are never dismissable.
 */
export interface PromptGateOptions {
  /** Session id whose blocker store is consulted. */
  sessionID: string;
  /**
   * When set to `'dismiss'`, any outstanding *question* blocker on this
   * session is skipped and this call proceeds. Any `permission` blocker
   * is always honoured regardless of this flag. Unset (the default) is
   * the pre-fix behaviour: a stale question stops a new prompt.
   */
  questions?: 'dismiss';
}

/**
 * Consult the blocker store for {@link opts.sessionID} and return a
 * human-readable reason when a new prompt must NOT proceed. Returns
 * `undefined` when the caller may go ahead.
 *
 * The caller is expected to translate a non-undefined return into an
 * `OrchestrationError('unavailable_session', reason)` throw (or an
 * equivalent user-facing surface) — the raw string is exposed rather
 * than the error class so tests and TUI code can format it however they
 * want without catching-and-rethrowing.
 */
export async function checkPromptBlocker(opts: PromptGateOptions): Promise<string | undefined> {
  const blocker = await getBlocker(opts.sessionID);
  if (!blocker) return undefined;

  // Permission blockers are always honoured. A user cannot silently
  // dismiss a pending tool-permission decision by typing a new prompt.
  if (blocker.kind === 'permission') {
    return blocker.prompt ?? 'Session is waiting on a permission decision';
  }

  // Question blockers are dismissable when the caller opts in. This is
  // the upstream #13774 fix: reissuing a prompt should not deadlock on
  // a stale clarification question the user has moved past.
  if (blocker.kind === 'question') {
    if (opts.questions === 'dismiss') {
      return undefined;
    }
    return blocker.prompt ?? 'Session is waiting on an unanswered question';
  }

  // Unknown kind — fail closed. Matches the SAP-grade security posture
  // used throughout the permission surface: ambiguity resolves against
  // proceeding, never against the user.
  return 'Session is blocked (unknown blocker kind)';
}

/**
 * Convenience wrapper: throw {@link OrchestrationError} when
 * {@link checkPromptBlocker} would return a reason, otherwise resolve.
 * Callers that reissue a prompt after user edit should pass
 * `questions: 'dismiss'`.
 */
export async function assertPromptDispatchable(opts: PromptGateOptions): Promise<void> {
  const reason = await checkPromptBlocker(opts);
  if (reason) {
    throw new OrchestrationError('unavailable_session', reason);
  }
}
