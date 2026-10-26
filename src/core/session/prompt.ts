/**
 * Prompt builder: combines a text prompt with a normalized set of
 * attachments, collecting rejections instead of discarding the whole
 * prompt on the first unsupported attachment.
 *
 * Backports upstream opencode behaviour from
 * `packages/opencode/src/kilocode/session/prompt.ts` where previously an
 * attachment rejection threw and the user's text prompt was lost. New
 * behaviour: keep the text, keep the accepted attachments, and surface
 * rejections as a non-fatal warning for the caller to render.
 *
 * Session compaction state (kilocode `ccf958a1d`): callers that drive
 * auto-compaction should carry `lastCompactionAtTokens` on their session
 * state and pass it through to `shouldCompact` so a stuck summariser
 * cannot be invoked repeatedly on the same input.
 */

import { buildAttachments, type NormalizedAttachment, type RawAttachment } from './attachment.js';

export interface PromptBuildResult {
  text: string;
  attachments: NormalizedAttachment[];
  rejected: { source: string; reason: string }[];
}

/**
 * Minimal session-level state the compaction loop needs. Persist this on
 * the session record between turns and refresh `lastCompactionAtTokens`
 * every time a compaction run completes successfully.
 */
export interface SessionCompactionState {
  /**
   * Token count observed at the most recent compaction. Compared against
   * the current token count by `shouldCompact` to abort compaction loops.
   */
  lastCompactionAtTokens?: number;
}

/**
 * Record that a compaction run just completed, so the next call to
 * `shouldCompact` can refuse to run again until the token count moves.
 */
export function recordCompactionRun(
  state: SessionCompactionState,
  compactedTokens: number
): SessionCompactionState {
  return { ...state, lastCompactionAtTokens: compactedTokens };
}

/**
 * Build a submittable prompt from a text body plus a batch of raw
 * attachments. Unsupported attachments are collected in `rejected` so the
 * caller can emit a warning per rejection, but the text and the accepted
 * attachments always make it through.
 */
export function buildPrompt(text: string, raw: RawAttachment[] = []): PromptBuildResult {
  const { attachments, rejected } = buildAttachments(raw);
  return {
    text,
    attachments,
    rejected,
  };
}
