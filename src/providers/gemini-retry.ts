/**
 * Gemini / Vertex malformed-finish retry.
 *
 * Ports opencode PR #56232 — Gemini (direct, Vertex AI, and SAP AI Core
 * Vertex-via-orchestration deployments) occasionally completes a
 * generation with `finishReason: MALFORMED_RESPONSE` or
 * `MALFORMED_FUNCTION_CALL`. These are server-side formatting failures:
 * the model produced tokens the Gemini service could not finalise. They
 * are strongly transient — re-issuing the same request almost always
 * succeeds — but surfacing them to the agent loop produces a confusing
 * "empty response" that is counted against the user's mistake budget.
 *
 * This helper wraps a provider-level invocation with a bounded retry
 * loop that retries ONCE on a malformed finish. Transport errors are
 * routed through {@link isRetryableTransportError} from `utils/retry`
 * so EPIPE / ECONNRESET during the retry are also handled.
 *
 * Intentionally kept as a tiny helper (not a provider class) so it can
 * be composed with the SAP AI Core orchestration path without
 * disturbing the existing `SapOrchestrationProvider.streamComplete`
 * contract: callers wrap their non-streaming Gemini probe (image
 * generation, tool-arg validation, catalog probes) in this helper and
 * leave streaming calls to the orchestration retry loop.
 */

import { logger } from '../utils/logger.js';
import { isRetryableTransportError } from '../utils/retry.js';

/**
 * Gemini finish reasons that indicate a server-side formatting failure.
 * These are transient and worth exactly one retry.
 */
export const MALFORMED_FINISH_REASONS: ReadonlySet<string> = new Set([
  'MALFORMED_RESPONSE',
  'MALFORMED_FUNCTION_CALL',
]);

/**
 * Minimal response shape the retry predicate reads. Deliberately
 * structural so callers can pass in either the SAP AI Core
 * orchestration result (which exposes `getFinishReason()`) via a
 * thin adapter, or a direct Gemini SDK response.
 */
export interface GeminiLikeResponse {
  candidates?: Array<{ finishReason?: string | null }>;
  finishReason?: string;
}

/**
 * Return the finish reason of the primary candidate, if any. Walks
 * both `candidates[0].finishReason` (Gemini SDK shape) and
 * `response.finishReason` (orchestration-adapter shape) so the helper
 * works for both direct Gemini and SAP AI Core Vertex deployments.
 */
export function extractFinishReason(res: GeminiLikeResponse | undefined | null): string | undefined {
  if (!res) {
    return undefined;
  }
  const primary = res.candidates?.[0]?.finishReason;
  if (typeof primary === 'string' && primary.length > 0) {
    return primary;
  }
  if (typeof res.finishReason === 'string' && res.finishReason.length > 0) {
    return res.finishReason;
  }
  return undefined;
}

/**
 * True when `res` carries a malformed-finish marker that should be
 * retried once.
 */
export function isMalformedGeminiResponse(res: GeminiLikeResponse | undefined | null): boolean {
  const finish = extractFinishReason(res);
  return finish !== undefined && MALFORMED_FINISH_REASONS.has(finish);
}

/**
 * Invoke `fn` with a bounded retry on malformed Gemini finishes and
 * retryable transport errors.
 *
 *  - Returns immediately on a non-malformed response.
 *  - On malformed finish, retries exactly ONCE (per opencode #56232).
 *  - On a thrown transport error that satisfies
 *    {@link isRetryableTransportError}, retries up to the same budget.
 *  - On any other thrown error, propagates immediately — permanent
 *    failures must NOT burn the retry budget.
 */
export async function invokeGeminiWithRetry<T extends GeminiLikeResponse>(
  fn: () => Promise<T>,
  opts: { maxAttempts?: number } = {}
): Promise<T> {
  const maxAttempts = Math.max(1, opts.maxAttempts ?? 2);
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fn();
      if (isMalformedGeminiResponse(res) && attempt < maxAttempts) {
        logger.warn('gemini.malformed_finish.retrying', {
          finish: extractFinishReason(res),
          attempt,
        });
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (!isRetryableTransportError(err) || attempt === maxAttempts) {
        throw err;
      }
      logger.warn('gemini.transient_transport.retrying', { attempt });
    }
  }
  // Unreachable in practice — the loop either returns a response or
  // throws from the catch above. Guard for a defensive final throw so
  // the function always has a defined termination.
  throw lastErr ?? new Error('invokeGeminiWithRetry: exhausted attempts without result');
}
