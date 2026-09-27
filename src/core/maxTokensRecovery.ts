/**
 * Max-tokens recovery for context-length errors.
 *
 * Complementary to `src/core/compaction.ts` and the compaction-based
 * recovery in `src/core/streamingOrchestrator.ts`. Where compaction
 * reduces the *prompt* by summarizing older messages, this module
 * reduces the *response budget* (`maxTokens`) so a retry fits inside
 * the model's context window.
 *
 * Typical failure modes handled here:
 *   - HTTP 413 "Request Entity Too Large"
 *   - HTTP 400 with `max_tokens_exceeded` / `context_length_exceeded`
 *   - Provider messages of the form
 *     "maximum context length is X tokens" /
 *     "model supports up to X tokens" /
 *     "context window: X"
 *
 * The strategy is deliberately conservative: extract the context window
 * from the error text when possible; otherwise fall back to a curated
 * per-model default; otherwise a coarse universal default. The resulting
 * `maxTokens` is clamped to a minimum floor (`MIN_SAFE_MAX_TOKENS`) so a
 * retry always produces at least a short response instead of an empty
 * turn.
 *
 * Autonomous / headless callers auto-retry. Interactive TUI callers can
 * intercept via `RecoveryPromptFn` and confirm/decline the retry.
 */

import { estimateMessagesTokens } from './compaction.js';
import type { Message } from './sessionManager.js';

/**
 * Universal fallback context window (tokens) when no per-model default
 * matches. 32K covers most legacy chat completions APIs and is small
 * enough to always fit under mainstream deployments.
 */
export const DEFAULT_CONTEXT_WINDOW_TOKENS = 32_000;

/**
 * Minimum viable `maxTokens` for a retry response. A retry that
 * produces zero output tokens is worse than a hard error — the caller
 * cannot make progress and the user has no feedback. 100 tokens is
 * enough for a short "context still too large" apology.
 */
export const MIN_SAFE_MAX_TOKENS = 100;

/**
 * Default safety margin (tokens) subtracted from `contextWindow - prompt`
 * when computing the reduced `maxTokens`. Guards against tokenizer drift
 * between our chars/4 estimate and the provider's real count.
 */
export const DEFAULT_SAFETY_MARGIN_TOKENS = 1_000;

/**
 * Fraction of the context window used as an alternative safety margin
 * when it is larger than {@link DEFAULT_SAFETY_MARGIN_TOKENS}. Matches
 * the issue spec: "10% of context window or 1000 tokens, whichever is
 * larger".
 */
const SAFETY_MARGIN_FRACTION = 0.1;

/**
 * Per-model-family fallback context windows. Used only when the error
 * message does not carry an explicit token count. Values are the
 * public documented windows for the mainstream deployments Alexi
 * routes to — deliberately conservative so a retry never over-shoots
 * a smaller variant of the same family.
 */
const MODEL_CONTEXT_WINDOWS: readonly { readonly pattern: RegExp; readonly tokens: number }[] = [
  // Anthropic Claude family: 200K window across Opus / Sonnet / Haiku.
  { pattern: /anthropic|claude/i, tokens: 200_000 },
  // OpenAI GPT-4 / GPT-4o / o-series: 128K window.
  { pattern: /gpt-4|gpt-5|o1|o3|o4/i, tokens: 128_000 },
  // Google Gemini: 1M for pro/flash 1.5+, 32K for older.
  { pattern: /gemini-1\.5|gemini-2/i, tokens: 1_000_000 },
  { pattern: /gemini/i, tokens: 32_000 },
  // DeepSeek: 128K on v4 flash, 64K on earlier.
  { pattern: /deepseek-v4/i, tokens: 128_000 },
  { pattern: /deepseek/i, tokens: 64_000 },
  // Meta Llama family: 128K on 3.1+, 8K on legacy.
  { pattern: /llama-3\.1|llama-3\.2|llama-3\.3/i, tokens: 128_000 },
  { pattern: /llama|meta--/i, tokens: 8_000 },
  // Mistral: 128K on Large 2, 32K on standard.
  { pattern: /mistral-large-2/i, tokens: 128_000 },
  { pattern: /mistral|mixtral/i, tokens: 32_000 },
];

/**
 * Regex patterns used to extract a context-window token count from a
 * provider error message. Each pattern MUST capture the token count in
 * group 1 as a decimal integer. Order matters: more specific patterns
 * come first.
 */
const CONTEXT_WINDOW_PATTERNS: readonly RegExp[] = [
  // "maximum context length is 128000 tokens"
  /maximum\s+context\s+length\s+is\s+(\d{3,7})\s*tokens?/i,
  // "This model's maximum context length is 8192 tokens"
  /maximum\s+context\s+length[^0-9]{0,30}(\d{3,7})/i,
  // "model supports up to 128000 tokens"
  /model\s+supports\s+up\s+to\s+(\d{3,7})\s*tokens?/i,
  // "context window: 200000" or "context window is 200000"
  /context\s+window[^0-9]{0,15}(\d{3,7})/i,
  // "context_window: 128000"
  /context_window[^0-9]{0,15}(\d{3,7})/i,
  // "limit of 128000 tokens" / "limit is 128000 tokens"
  /limit\s+(?:of|is)\s+(\d{3,7})\s*tokens?/i,
  // "128000 tokens allowed" as a last-resort fallback
  /(\d{4,7})\s*tokens?\s+(?:allowed|maximum|max)/i,
];

/**
 * Regex patterns used to detect that an error is a max-tokens / context
 * length rejection that we may recover from by reducing `maxTokens`.
 * These patterns are complementary to the broader context-overflow
 * detection in `src/core/contextOverflow.ts` — where that module drives
 * *compaction*, this one drives *maxTokens reduction*.
 */
const MAX_TOKENS_ERROR_PATTERNS: readonly RegExp[] = [
  /max_tokens_exceeded/i,
  /context_length_exceeded/i,
  /maximum\s+context\s+length/i,
  /request\s+entity\s+too\s+large/i,
  /completion\s+exceeds\s+the\s+model'?s?\s+context/i,
  /max[\s_-]?tokens.*(?:too\s+large|exceeds?)/i,
];

/**
 * Structural HTTP status extractor. Mirrors `extractStatus` in
 * `src/providers/format.ts` but kept local to avoid a `core → providers`
 * dependency (providers is upstream of core in the dependency graph).
 */
function extractHttpStatus(err: unknown): number | undefined {
  if (err === null || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown; statusCode?: unknown };
  };
  const direct = candidate.status ?? candidate.statusCode;
  if (typeof direct === 'number' && Number.isFinite(direct)) {
    return direct;
  }
  const resp = candidate.response;
  if (resp && typeof resp === 'object') {
    const respStatus = resp.status ?? resp.statusCode;
    if (typeof respStatus === 'number' && Number.isFinite(respStatus)) {
      return respStatus;
    }
  }
  return undefined;
}

/**
 * Extract a text haystack from an unknown error value, including its
 * `message`, `responseBody` (string or JSON-serialized object), and up
 * to two levels of `cause`.
 */
function extractErrorHaystack(err: unknown, depth = 0): string {
  if (depth > 2 || err === null || err === undefined) {
    return '';
  }
  if (typeof err === 'string') {
    return err;
  }
  if (typeof err !== 'object') {
    return '';
  }
  const parts: string[] = [];
  const candidate = err as {
    message?: unknown;
    responseBody?: unknown;
    body?: unknown;
    cause?: unknown;
  };
  if (typeof candidate.message === 'string') {
    parts.push(candidate.message);
  }
  if (typeof candidate.responseBody === 'string') {
    parts.push(candidate.responseBody);
  } else if (candidate.responseBody && typeof candidate.responseBody === 'object') {
    try {
      parts.push(JSON.stringify(candidate.responseBody));
    } catch {
      // ignore non-serializable
    }
  }
  if (typeof candidate.body === 'string') {
    parts.push(candidate.body);
  }
  if (candidate.cause !== undefined && candidate.cause !== err) {
    parts.push(extractErrorHaystack(candidate.cause, depth + 1));
  }
  return parts.join('\n');
}

/**
 * Return true when `err` looks like a max-tokens / context-length
 * rejection that we may recover from by reducing `maxTokens`.
 *
 * Detection is deliberately narrower than the compaction-driving
 * {@link isContextOverflowError}: HTTP 413 is included here (a payload
 * that is too large by *body size* is a max-tokens problem, not
 * necessarily a prompt-history problem), and free-form phrases like
 * "prompt too long" are excluded so they continue routing through
 * compaction.
 */
export function isMaxTokensError(err: unknown): boolean {
  const status = extractHttpStatus(err);
  if (status === 413) {
    return true;
  }
  const haystack = extractErrorHaystack(err);
  if (haystack.length === 0) {
    return false;
  }
  if (status === 400) {
    // A generic 400 needs a max-tokens marker in the body; without it
    // this could be any validation error and we do not want to retry
    // blindly.
    return MAX_TOKENS_ERROR_PATTERNS.some((p) => p.test(haystack));
  }
  return MAX_TOKENS_ERROR_PATTERNS.some((p) => p.test(haystack));
}

/**
 * Extract the context window (tokens) from a provider error message.
 * Returns `undefined` when no explicit count can be recovered.
 *
 * Extraction is regex-based and tolerant of surrounding punctuation.
 * See {@link CONTEXT_WINDOW_PATTERNS} for the full pattern list.
 */
export function extractContextWindow(err: unknown): number | undefined {
  const haystack = extractErrorHaystack(err);
  if (haystack.length === 0) {
    return undefined;
  }
  for (const pattern of CONTEXT_WINDOW_PATTERNS) {
    const match = haystack.match(pattern);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return undefined;
}

/**
 * Model-family fallback context window when the error message does
 * not include an explicit token count. Returns
 * {@link DEFAULT_CONTEXT_WINDOW_TOKENS} when nothing matches.
 */
export function getModelContextWindow(modelId: string): number {
  if (!modelId) {
    return DEFAULT_CONTEXT_WINDOW_TOKENS;
  }
  for (const entry of MODEL_CONTEXT_WINDOWS) {
    if (entry.pattern.test(modelId)) {
      return entry.tokens;
    }
  }
  return DEFAULT_CONTEXT_WINDOW_TOKENS;
}

/**
 * Compute the effective safety margin: the larger of
 * {@link DEFAULT_SAFETY_MARGIN_TOKENS} and 10% of the context window.
 */
export function computeSafetyMargin(contextWindow: number): number {
  if (!Number.isFinite(contextWindow) || contextWindow <= 0) {
    return DEFAULT_SAFETY_MARGIN_TOKENS;
  }
  return Math.max(DEFAULT_SAFETY_MARGIN_TOKENS, Math.floor(contextWindow * SAFETY_MARGIN_FRACTION));
}

/**
 * Compute a safe reduced `maxTokens` value.
 *
 * ```
 * safeMaxTokens = max(
 *   MIN_SAFE_MAX_TOKENS,
 *   min(originalMaxTokens, contextWindow - estimatedPrompt - safetyMargin)
 * )
 * ```
 *
 * When the prompt already exceeds the context window (compaction was
 * not enough), the formula degenerates to `MIN_SAFE_MAX_TOKENS` — the
 * caller must surface a terminal error rather than actually issue the
 * retry, but returning the floor keeps the return type non-optional
 * and lets pure tests exercise the boundary.
 */
export function computeSafeMaxTokens(input: {
  originalMaxTokens: number;
  contextWindow: number;
  estimatedPromptTokens: number;
  safetyMargin?: number;
}): number {
  const {
    originalMaxTokens,
    contextWindow,
    estimatedPromptTokens,
    safetyMargin = computeSafetyMargin(contextWindow),
  } = input;

  const headroom = contextWindow - estimatedPromptTokens - safetyMargin;
  const candidate = Math.min(originalMaxTokens, headroom);
  return Math.max(MIN_SAFE_MAX_TOKENS, candidate);
}

/**
 * Result of a {@link planMaxTokensRecovery} call. Callers apply the
 * plan by issuing the next provider request with `maxTokens` set to
 * `plan.safeMaxTokens`.
 */
export interface MaxTokensRecoveryPlan {
  /**
   * The context window used for computation. Either extracted from the
   * error message or looked up via {@link getModelContextWindow}.
   */
  contextWindow: number;
  /**
   * Whether {@link contextWindow} was recovered from the error message
   * (`true`) or fell back to a model-family / universal default
   * (`false`).
   */
  contextWindowExtracted: boolean;
  /** Chars/4 estimate of the current prompt (system + history + user). */
  estimatedPromptTokens: number;
  /** Effective safety margin used. */
  safetyMargin: number;
  /** Reduced `maxTokens` value to pass to the retry. */
  safeMaxTokens: number;
  /** Original `maxTokens` before reduction. */
  originalMaxTokens: number;
  /**
   * `true` when the reduction produced a strictly smaller `maxTokens`
   * than the original. When `false`, retrying will not help — the
   * caller should surface a terminal error.
   */
  reducedFromOriginal: boolean;
}

/**
 * Build a recovery plan for a max-tokens error. Pure function — does
 * not perform any I/O and does not touch the session.
 */
export function planMaxTokensRecovery(input: {
  err: unknown;
  modelId: string;
  originalMaxTokens: number;
  messages: readonly Message[];
  safetyMargin?: number;
}): MaxTokensRecoveryPlan {
  const extracted = extractContextWindow(input.err);
  const contextWindow = extracted ?? getModelContextWindow(input.modelId);
  const estimatedPromptTokens = estimateMessagesTokens(input.messages as Message[]);
  const safetyMargin = input.safetyMargin ?? computeSafetyMargin(contextWindow);
  const safeMaxTokens = computeSafeMaxTokens({
    originalMaxTokens: input.originalMaxTokens,
    contextWindow,
    estimatedPromptTokens,
    safetyMargin,
  });
  return {
    contextWindow,
    contextWindowExtracted: extracted !== undefined,
    estimatedPromptTokens,
    safetyMargin,
    safeMaxTokens,
    originalMaxTokens: input.originalMaxTokens,
    reducedFromOriginal: safeMaxTokens < input.originalMaxTokens,
  };
}

/**
 * Callback signature for interactive recovery confirmation. TUI callers
 * register one via {@link setRecoveryPrompt}; when unset the streaming
 * orchestrator auto-retries in headless / agent mode.
 *
 * Return `true` to accept the plan and retry, `false` to decline (the
 * caller then surfaces a terminal error).
 */
export type RecoveryPromptFn = (plan: MaxTokensRecoveryPlan) => Promise<boolean> | boolean;

let recoveryPromptFn: RecoveryPromptFn | null = null;

/**
 * Register (or clear) an interactive recovery-prompt callback. Passing
 * `null` restores headless-auto-retry behaviour. Intended to be called
 * once by the TUI at startup and cleared at teardown.
 */
export function setRecoveryPrompt(fn: RecoveryPromptFn | null): void {
  recoveryPromptFn = fn;
}

/** Retrieve the currently registered prompt callback, if any. */
export function getRecoveryPrompt(): RecoveryPromptFn | null {
  return recoveryPromptFn;
}

/**
 * Decide whether to accept a recovery plan. In headless / agent mode
 * (no prompt callback registered) the answer is always `true` — the
 * whole point of this module is graceful degradation, and blocking on
 * a missing UI would defeat that. Interactive callers get the plan
 * routed through {@link RecoveryPromptFn}.
 */
export async function confirmMaxTokensRecovery(plan: MaxTokensRecoveryPlan): Promise<boolean> {
  if (!plan.reducedFromOriginal) {
    return false;
  }
  const fn = recoveryPromptFn;
  if (!fn) {
    // Headless / agent mode: auto-accept.
    return true;
  }
  try {
    const decision = await fn(plan);
    return decision === true;
  } catch {
    // A UI callback that itself throws should never wedge recovery —
    // fall through to a decline so the caller surfaces a terminal
    // error rather than looping.
    return false;
  }
}
