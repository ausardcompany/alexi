/**
 * Provider error formatting.
 *
 * Node/undici transport failures typically surface as
 * `TypeError('fetch failed')` with the real reason nested on `err.cause`
 * (e.g. `{ name: 'SocketError', message: 'other side closed',
 * code: 'UND_ERR_SOCKET' }`). If the orchestrator rethrows the outer
 * error unchanged, users only see `fetch failed` — the underlying cause
 * is discarded.
 *
 * `formatProviderError` folds the cause chain into a single, bounded
 * string so that transport/provider incidents are debuggable without
 * requiring additional logging plumbing. It is intentionally
 * depth-bounded (2 levels) to avoid pathological / self-referential
 * chains blowing up the message width.
 *
 * Mirrors the upstream cline/cline fix (PR #11928, commit 263b58f).
 */

/**
 * Minimal shape checked when deciding whether a `cause` value is
 * error-like enough to be worth folding into the message.
 */
interface ErrorLike {
  name: string;
  message: string;
  code?: string;
}

/**
 * Return true if `value` looks like an `Error` (has string `name` and
 * `message`). We do not require `instanceof Error` because undici
 * sometimes surfaces cause objects that structurally match but are not
 * subclasses.
 */
function isErrorLike(value: unknown): value is ErrorLike {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const candidate = value as { name?: unknown; message?: unknown };
  return typeof candidate.name === 'string' && typeof candidate.message === 'string';
}

/**
 * Format an error for user display, preserving `error.cause` when
 * present.
 *
 * - Non-`Error` input: returns `String(err)`.
 * - Native `Error` without a distinct `cause`: returns `err.message`.
 * - Native `Error` whose `cause` is itself error-shaped: returns
 *   `` `${err.message}: ${cause.name}: ${cause.message}${code ? ' (' + code + ')' : ''}` ``.
 *
 * Recursion is capped at depth 2; `cause.cause` is intentionally not
 * walked so a self-referential chain cannot loop or explode the
 * message width.
 */
export function formatProviderError(err: unknown): string {
  if (!(err instanceof Error)) {
    return String(err);
  }

  const cause = (err as Error & { cause?: unknown }).cause;
  if (!isErrorLike(cause)) {
    return err.message;
  }

  const codeSuffix =
    typeof cause.code === 'string' && cause.code.length > 0 ? ` (${cause.code})` : '';
  return `${err.message}: ${cause.name}: ${cause.message}${codeSuffix}`;
}

/**
 * Coarse classification of provider-side failures, used by the streaming
 * orchestrator to decide whether an error is recoverable via automatic
 * compaction/retry (`context_overflow`) or must bubble up unchanged
 * (`rate_limit`, `auth`, `validation`).
 *
 * `undefined` is returned when the error does not match any known class;
 * callers should treat that as "unknown, propagate as-is".
 *
 * Mirrors the shape of upstream Kilo PR #12804 so the recovery path in
 * `src/core/streamingOrchestrator.ts` can classify BEFORE flattening the
 * cause chain via `formatProviderError`.
 */
export type ProviderErrorClass =
  'context_overflow' | 'rate_limit' | 'auth' | 'validation' | undefined;

/**
 * Case-insensitive patterns that indicate the provider rejected the
 * request because the model's context window was exceeded. Duplicated at
 * this layer (rather than importing from `src/core/contextOverflow.ts`)
 * because `src/providers/**` must not depend on `src/core/**` — the
 * providers layer is upstream in the dependency graph.
 */
const CONTEXT_OVERFLOW_MESSAGE_PATTERNS: readonly RegExp[] = [
  /context[\s_]window.*(exceed|too\s*long|overflow)/i,
  /context[\s_]length.*(exceed|too\s*long)/i,
  /maximum[\s_]context([\s_]length)?/i,
  /context_length_exceeded/i,
  /max_tokens_exceeded/i,
  /too_many_tokens/i,
  /exceeds[\s_]the[\s_]context/i,
  /prompt[\s_]too[\s_]long/i,
  /input[\s_]too[\s_]long/i,
];

/**
 * Extract the HTTP status code from a variety of shapes that SAP AI Core,
 * OpenAI-family SDKs, and undici throwables use. Returns `undefined` when
 * no numeric status can be found.
 */
function extractStatus(err: unknown): number | undefined {
  if (err === null || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as {
    status?: unknown;
    statusCode?: unknown;
    code?: unknown;
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
 * Collect message strings from `error`, `error.responseBody`, and up to two
 * levels of `error.cause`. Bounded depth prevents pathological
 * self-referential chains from looping. Empty strings are filtered out.
 */
function collectMessages(err: unknown, depth = 0): string[] {
  if (depth > 2 || err === null || err === undefined) {
    return [];
  }
  const out: string[] = [];
  if (typeof err === 'string') {
    out.push(err);
    return out;
  }
  if (typeof err !== 'object') {
    return out;
  }
  const candidate = err as {
    message?: unknown;
    responseBody?: unknown;
    body?: unknown;
    cause?: unknown;
  };
  if (typeof candidate.message === 'string' && candidate.message.length > 0) {
    out.push(candidate.message);
  }
  if (typeof candidate.responseBody === 'string' && candidate.responseBody.length > 0) {
    out.push(candidate.responseBody);
  } else if (candidate.responseBody && typeof candidate.responseBody === 'object') {
    try {
      out.push(JSON.stringify(candidate.responseBody));
    } catch {
      // ignore non-serializable bodies
    }
  }
  if (typeof candidate.body === 'string' && candidate.body.length > 0) {
    out.push(candidate.body);
  }
  if (candidate.cause !== undefined && candidate.cause !== err) {
    out.push(...collectMessages(candidate.cause, depth + 1));
  }
  return out;
}

/**
 * Classify a thrown provider error into one of a small set of coarse
 * buckets used by the streaming orchestrator's recovery path.
 *
 * Priority order (higher wins):
 *   1. `rate_limit` — status 429 or messages matching `rate limit`. Vetoes
 *      `context_overflow` so a 429 never accidentally triggers compaction.
 *   2. `auth` — status 401 or 403.
 *   3. `validation` — status 400 or 422.
 *   4. `context_overflow` — matches a message pattern from the curated
 *      list above.
 *   5. `undefined` — unclassified.
 */
export function classifyProviderError(error: unknown): ProviderErrorClass {
  if (error === null || error === undefined) {
    return undefined;
  }

  const status = extractStatus(error);
  const messages = collectMessages(error);
  const haystack = messages.join('\n');

  // Rate limit takes precedence over context_overflow: the two can
  // co-occur textually ("rate limit exceeded due to context length"),
  // and the correct recovery for 429 is backoff, not compaction.
  if (status === 429 || /rate[\s_-]?limit/i.test(haystack)) {
    return 'rate_limit';
  }

  if (status === 401 || status === 403) {
    return 'auth';
  }

  if (status === 400 || status === 422) {
    // Validation errors sometimes carry a context-overflow message body
    // from providers that map overflow to HTTP 400 (e.g. some SAP AI
    // Core deployments). Prefer `context_overflow` when the message
    // clearly indicates it, since that is recoverable via compaction.
    if (CONTEXT_OVERFLOW_MESSAGE_PATTERNS.some((p) => p.test(haystack))) {
      return 'context_overflow';
    }
    return 'validation';
  }

  if (CONTEXT_OVERFLOW_MESSAGE_PATTERNS.some((p) => p.test(haystack))) {
    return 'context_overflow';
  }

  return undefined;
}
