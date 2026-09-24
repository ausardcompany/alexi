/**
 * Plan-mode follow-up event routing.
 *
 * Ports opencode commit `5e05988b1 fix(cli): route plan follow-up events by
 * directory` (2026-09 sync, `src/session/processor.ts` +11/-2). Plan-mode
 * subagents periodically emit follow-up questions back to the primary
 * agent. Previously these events were published on a global channel with
 * no directory scoping, which caused cross-project bleed: a plan question
 * raised in project A's session could be delivered to a listener attached
 * to project B's session in the same host process (relevant when running
 * `alexi server` for multiple workspaces).
 *
 * The fix is minimal — every follow-up event now carries the originating
 * `directory`, and subscribers filter events whose `directory` does not
 * match their own working directory before handling them.
 *
 * This module exports the shared schema plus a `matchesDirectory()`
 * helper so both the publisher in `src/session/*` and any TUI subscriber
 * agree on the filter semantics.
 */

import { z } from 'zod';
import { defineEvent, type BusEvent } from './index.js';

/**
 * Payload shape for `plan.followup`. `directory` is the absolute working
 * directory of the session emitting the question — subscribers use it to
 * filter out events belonging to other workspaces.
 */
export const PlanFollowupSchema = z.object({
  question: z.string().min(1),
  sessionID: z.string().min(1),
  directory: z.string().min(1),
});

export type PlanFollowupPayload = z.infer<typeof PlanFollowupSchema>;

/**
 * Typed event handle. Register subscribers with `PlanFollowupEvent.subscribe`
 * and gate their handler on `matchesDirectory()` to preserve the
 * directory-scoped routing contract.
 */
export const PlanFollowupEvent: BusEvent<PlanFollowupPayload> = defineEvent(
  'plan.followup',
  PlanFollowupSchema
);

/**
 * Returns `true` when the event's `directory` field matches (or is
 * absent from) the subscriber's `currentDirectory`. Absence is treated
 * as a wildcard so future events emitted from a non-directory-scoped
 * context still reach every listener — real drift would show up as a
 * `directory` mismatch, not as a missing field.
 */
export function matchesDirectory(
  event: Pick<PlanFollowupPayload, 'directory'>,
  currentDirectory: string
): boolean {
  if (!event.directory) {
    return true;
  }
  return event.directory === currentDirectory;
}
