/**
 * Deferred Session Title Generation
 *
 * Ports upstream kilocode commits 7e0ce5ec6 (+196 LOC), 31bfc440c,
 * 4ab5fe935. Deferring session title generation until AFTER the first
 * substantive user activity dramatically improves perceived latency on
 * session start — the model no longer spends a round-trip generating a
 * title before the user's actual first prompt executes.
 *
 * Gating rules (all must hold before an attempt is scheduled):
 *   1. The session has NOT yet been titled.
 *   2. Attempt budget (`TITLE_MAX_ATTEMPTS`) not exhausted.
 *   3. The current wall clock is past `gatedUntil` (backoff after a
 *      failed attempt so we don't hammer the provider on repeated
 *      short user turns).
 *   4. The user's message is at least `TITLE_MIN_MESSAGE_LENGTH`
 *      characters after trimming — one-word acknowledgements ("yes",
 *      "ok", "no") should not seed a permanent title.
 *
 * Alexi does not use Effect-TS in-tree; the upstream code shape is
 * translated to plain async/await here.
 */

import { logger } from '../../utils/logger.js';

const TITLE_MIN_MESSAGE_LENGTH = 8;
const TITLE_MAX_ATTEMPTS = 3;
const TITLE_BACKOFF_MS = 60_000;

interface TitleState {
  sessionId: string;
  generated: boolean;
  attempts: number;
  firstUserMessage?: string;
  gatedUntil: number;
  title?: string;
}

const states = new Map<string, TitleState>();

/**
 * Callback shape for the actual model call that generates a title.
 * Kept as a caller-supplied function so this module stays decoupled
 * from `src/providers/` — the caller wires in whichever provider it
 * wants (SAP AI Core / proxy / mock).
 */
export type TitleGenerator = (sessionId: string, firstMessage: string) => Promise<string>;

/**
 * Ensure a title exists for the given session, deferred by the gating
 * rules above. Idempotent — repeat calls after the title is generated
 * are no-ops. Failed attempts back off for `TITLE_BACKOFF_MS` before
 * the next call will try again.
 *
 * Returns the generated title on success, `undefined` if the call was
 * gated out or an attempt is already in-flight for this session.
 */
export async function ensureTitle(
  sessionId: string,
  message: string,
  generate: TitleGenerator
): Promise<string | undefined> {
  const state: TitleState = states.get(sessionId) ?? {
    sessionId,
    generated: false,
    attempts: 0,
    gatedUntil: 0,
  };

  if (state.generated) {
    return state.title;
  }
  if (state.attempts >= TITLE_MAX_ATTEMPTS) {
    return undefined;
  }
  if (Date.now() < state.gatedUntil) {
    return undefined;
  }
  if (message.trim().length < TITLE_MIN_MESSAGE_LENGTH) {
    return undefined;
  }

  state.attempts += 1;
  state.firstUserMessage = message;
  states.set(sessionId, state);

  try {
    const title = await generate(sessionId, message);
    state.generated = true;
    state.title = title;
    states.set(sessionId, state);
    return title;
  } catch (err) {
    state.gatedUntil = Date.now() + TITLE_BACKOFF_MS;
    states.set(sessionId, state);
    logger.warn(
      `[session-title] generation for ${sessionId} failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return undefined;
  }
}

/**
 * Reset all deferred-title state — used by session close so a re-used
 * id starts fresh, and by test harnesses.
 */
export function resetTitleState(sessionId?: string): void {
  if (sessionId === undefined) {
    states.clear();
    return;
  }
  states.delete(sessionId);
}

/**
 * Test-only: read the current in-memory state for a session.
 */
export function _peekTitleStateForTests(sessionId: string): Readonly<TitleState> | undefined {
  return states.get(sessionId);
}

export const _TITLE_MIN_MESSAGE_LENGTH_FOR_TESTS = TITLE_MIN_MESSAGE_LENGTH;
export const _TITLE_MAX_ATTEMPTS_FOR_TESTS = TITLE_MAX_ATTEMPTS;
export const _TITLE_BACKOFF_MS_FOR_TESTS = TITLE_BACKOFF_MS;
