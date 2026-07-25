/**
 * Context overflow detection.
 *
 * Provider-agnostic detection of "context window exceeded" style errors.
 * SAP AI Core surfaces different overflow messages depending on the
 * underlying vendor (Anthropic, OpenAI, ...). Rather than hard-coding a
 * single string, we match a curated list of case-insensitive regexes and
 * expose a small helper API used by:
 *
 *   - `src/core/agenticChat.ts` — to trigger reactive compaction.
 *   - `src/core/orchestrator.ts` — to rewrite the user-facing error so the
 *     CLI shows an actionable message instead of the raw provider payload.
 *
 * Patterns were expanded to align with upstream OpenCode (PR sst/opencode#37840)
 * and to cover the strings we have actually seen from SAP AI Core:
 *   "context window", "maximum context", "too_many_tokens",
 *   "context limit", "exceeds the context", "context_length_exceeded",
 *   "maximum context length".
 */

/**
 * Common patterns in context overflow error messages from LLM providers.
 *
 * All patterns are case-insensitive. Use `\s` to allow both space and
 * underscore variants where providers alternate between them.
 */
export const CONTEXT_OVERFLOW_PATTERNS: readonly RegExp[] = [
  // Snake_case identifiers used by OpenAI-family providers.
  /context_length_exceeded/i,
  /max_tokens_exceeded/i,
  /too_many_tokens/i,
  // Human-readable phrases. `[\s_]` covers both "context window" and
  // "context_window" style variants without duplicating the pattern.
  /context[\s_]window/i,
  /context[\s_]limit/i,
  /maximum[\s_]context([\s_]length)?/i,
  /exceeds[\s_]the[\s_]context/i,
  /context[\s.]length/i,
  /context.*exceeded/i,
  /token.*limit.*exceeded/i,
  /too[\s.]many[\s.]tokens/i,
  /input.*too.long/i,
  /request.*too.*large/i,
  /prompt.*too.*long/i,
];

/**
 * User-facing message shown when a context overflow is detected. Kept as
 * a single, importable constant so tests can assert on the exact string
 * and future translation/theming has a single source of truth.
 */
export const CONTEXT_OVERFLOW_USER_MESSAGE =
  'Context window exceeded. Reduce context size or use a model with a larger window.';

/**
 * Extract the underlying error message from any thrown value.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Return true if `error` looks like a context-overflow error from an LLM
 * provider.
 *
 * Matches against a curated list of case-insensitive regexes covering
 * OpenAI, Anthropic, and SAP AI Core surface strings. Non-Error values
 * are stringified via `String(err)` before matching.
 */
export function isContextOverflowError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return CONTEXT_OVERFLOW_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Detect context overflow and, when detected, estimate the number of
 * tokens over the limit.
 *
 * Returns:
 *   - `undefined` when the error is not a context overflow.
 *   - A positive integer estimate of overflow tokens otherwise.
 *
 * Estimation strategy:
 *   1. If the error message contains a 4+ digit token count larger than
 *      `maxTokens`, use `reported - maxTokens`.
 *   2. Otherwise, if `currentTokenEstimate > maxTokens`, use the
 *      difference.
 *   3. As a last resort, return 20% of the current estimate so compaction
 *      still makes meaningful progress.
 */
export function detectContextOverflow(
  error: unknown,
  currentTokenEstimate: number,
  maxTokens: number
): number | undefined {
  if (!isContextOverflowError(error)) {
    return undefined;
  }

  const message = getErrorMessage(error);

  // Try to extract a token count from the error message
  // (common format: "...N tokens...").
  const tokenMatch = message.match(/(\d{4,})\s*tokens/);
  if (tokenMatch) {
    const reportedTokens = parseInt(tokenMatch[1], 10);
    if (reportedTokens > maxTokens) {
      return reportedTokens - maxTokens;
    }
  }

  if (currentTokenEstimate > maxTokens) {
    return currentTokenEstimate - maxTokens;
  }

  // Conservative fallback so compaction still makes progress even when
  // we could not extract a precise number from the error.
  return Math.ceil(currentTokenEstimate * 0.2);
}
