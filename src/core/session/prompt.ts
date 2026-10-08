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
 */

import {
  buildAttachments,
  type NormalizedAttachment,
  type RawAttachment,
} from './attachment.js';

export interface PromptBuildResult {
  text: string;
  attachments: NormalizedAttachment[];
  rejected: { source: string; reason: string }[];
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
