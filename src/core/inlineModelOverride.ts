/**
 * Inline model override detection (issue #1716).
 *
 * Recognises `@<provider>/<model>` mentions embedded in a user message
 * so the caller can switch the model for a single turn without changing
 * the session default. The first match wins — subsequent mentions in
 * the same message are ignored. The extracted id is validated against
 * the live-merged model catalog via
 * {@link import('../providers/modelCatalog.js').isAvailableModel}; when
 * the candidate is unknown, this module logs a warning and returns
 * `undefined` so the caller falls back to its normal model selection.
 *
 * Ported from Kilocode #14006. See the CLI precedence contract in
 * `sendChat` / `streamChat`: explicit `modelOverride` (CLI `--model`
 * flag) beats an inline reference, which in turn beats auto-routing
 * and the session default.
 */

import { logger } from '../utils/logger.js';
import { isAvailableModel } from '../providers/modelCatalog.js';

/**
 * Regex for `@<provider>/<model>` mentions.
 *
 * `<provider>` is one or more ASCII lower-case letters/digits/dashes.
 * `<model>` may additionally contain `.` and `/` so ids like
 * `anthropic/claude-opus-4` and `gemini-2.5-pro` parse correctly.
 * The pattern is case-insensitive so `@Anthropic/Claude-Opus-4` also
 * matches, but the extracted candidate is preserved verbatim for
 * catalog lookup.
 */
export const INLINE_MODEL_PATTERN = /@([a-z0-9-]+)\/([a-z0-9-./]+)/i;

/**
 * Extract an inline `@<provider>/<model>` override from a message and
 * validate it against the model catalog.
 *
 * Returns the candidate model id (`<provider>/<model>`) when the
 * message contains a match AND the candidate is present in the
 * catalog. Returns `undefined` otherwise — including the case where
 * a candidate is present but unknown (a warning is logged so the
 * user sees why the override was ignored).
 *
 * Never throws.
 */
export function extractInlineModelOverride(message: string): string | undefined {
  if (typeof message !== 'string' || message.length === 0) {
    return undefined;
  }

  const match = message.match(INLINE_MODEL_PATTERN);
  if (!match) {
    return undefined;
  }

  const candidateModel = `${match[1]}/${match[2]}`;
  if (isAvailableModel(candidateModel)) {
    logger.info(`[Inline Override] Using ${candidateModel} for this turn`);
    return candidateModel;
  }

  logger.warn(`[Inline Override] Model "${candidateModel}" not found in catalog, ignoring`);
  return undefined;
}
