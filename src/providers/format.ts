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

  // Rate-limit errors already carry a fully-formatted, multi-line
  // user-facing message (with wait time, alternative-model guidance, and a
  // documentation link). Appending the raw upstream cause here would only
  // add noise ("Rate limit reached ... : Error: HTTP 429"). The upstream
  // error is still preserved on `err.cause` for operators who need it.
  const name = (err as Error).name;
  if (name === 'FreeTierRateLimitError' || name === 'ProviderRateLimitError') {
    return err.message;
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
 * Signals that drive verdict resolution. Extracted so both the typed
 * AI SDK pre-pass (which knows the fields authoritatively) and the
 * structural fallback (which walks arbitrary shapes) can share the same
 * priority rules.
 */
interface ErrorSignals {
  /** Human-readable messages harvested from the error tree. */
  message: string;
  /** HTTP status code, when known and authoritative. */
  statusCode?: number;
  /** Serialized response body, used for context-overflow markers on 4xx. */
  responseBody?: unknown;
  /** Additional structured payload (e.g. TypeValidationError.value). */
  data?: unknown;
}

/**
 * Resolve a set of `ErrorSignals` to a verdict using the fixed priority
 * order:
 *
 *   1. `rate_limit` — status 429 or messages matching `rate limit`. Vetoes
 *      `context_overflow` so a 429 never accidentally triggers compaction.
 *   2. `auth` — status 401 or 403.
 *   3. `validation` — status 400 or 422, BUT `context_overflow` wins if a
 *      known overflow marker is present in the body (some SAP AI Core
 *      deployments map overflow to HTTP 400).
 *   4. `context_overflow` — matches a message pattern from the curated list.
 *   5. `undefined` — unclassified.
 *
 * Exported for unit testing. Not part of the public provider surface.
 */
export function verdictFromSignals(signals: ErrorSignals): ProviderErrorClass {
  const { statusCode } = signals;

  // Fold responseBody and data into the searchable haystack. We do this
  // here (rather than at the call site) so both entry paths reuse the
  // exact same overflow-detection surface.
  const haystackParts: string[] = [];
  if (signals.message.length > 0) {
    haystackParts.push(signals.message);
  }
  if (typeof signals.responseBody === 'string' && signals.responseBody.length > 0) {
    haystackParts.push(signals.responseBody);
  } else if (signals.responseBody && typeof signals.responseBody === 'object') {
    try {
      haystackParts.push(JSON.stringify(signals.responseBody));
    } catch {
      // ignore non-serializable bodies
    }
  }
  if (typeof signals.data === 'string' && signals.data.length > 0) {
    haystackParts.push(signals.data);
  } else if (signals.data && typeof signals.data === 'object') {
    try {
      haystackParts.push(JSON.stringify(signals.data));
    } catch {
      // ignore non-serializable payloads
    }
  }
  const haystack = haystackParts.join('\n');

  // Rate limit takes precedence over context_overflow: the two can
  // co-occur textually ("rate limit exceeded due to context length"),
  // and the correct recovery for 429 is backoff, not compaction.
  if (statusCode === 429 || /rate[\s_-]?limit/i.test(haystack)) {
    return 'rate_limit';
  }

  if (statusCode === 401 || statusCode === 403) {
    return 'auth';
  }

  if (statusCode === 400 || statusCode === 422) {
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

/**
 * AI SDK error tags. The `ai` package (and the SDK error types re-exported
 * by SAP AI SDK wrappers) assigns each error class a stable `name`
 * property, e.g. `AI_APICallError`, `AI_RetryError`, `AI_TypeValidationError`,
 * `AI_AISDKError`. The classes also expose a static `isInstance()` method
 * that matches on the same tag, which makes cross-realm / re-imported
 * instances safe to detect without an `instanceof` check.
 *
 * We recognise these tags structurally rather than importing the classes,
 * so the classification remains correct whether the caller is running
 * against the raw `ai` package, a SAP AI SDK re-export, or a duck-typed
 * mock in tests. When the class is available on `error.constructor`, we
 * prefer its own `isInstance()` guard; otherwise we fall back to the name
 * tag, which is what `isInstance()` itself compares.
 */
const AI_SDK_TAGS = {
  APICallError: 'AI_APICallError',
  RetryError: 'AI_RetryError',
  TypeValidationError: 'AI_TypeValidationError',
  AISDKError: 'AI_AISDKError',
} as const;

/**
 * Test whether `err` is a specific AI SDK error class by tag. Uses the
 * class's own `isInstance()` static guard when available; otherwise
 * compares the tag on `err.name`. This mirrors how `isInstance()` itself
 * is implemented in the `ai` package (a name-tag comparison), so the two
 * paths are behaviourally identical for AI SDK errors.
 */
function isAiSdkError(err: unknown, tag: string): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { name?: unknown; constructor?: unknown };
  // Prefer the class's own guard if it was imported. `isInstance` is a
  // static method on each AI SDK error class.
  const ctor = candidate.constructor as { isInstance?: (v: unknown) => boolean } | undefined;
  if (ctor && typeof ctor.isInstance === 'function') {
    try {
      if (ctor.isInstance(err)) {
        // Confirm the tag matches. `AISDKError.isInstance` returns true
        // for ALL AI SDK subclasses, so a tag check is still required to
        // route between APICallError vs RetryError vs the base class.
        if (typeof candidate.name === 'string' && candidate.name === tag) {
          return true;
        }
      }
    } catch {
      // isInstance is defensive; ignore errors and fall through.
    }
  }
  return typeof candidate.name === 'string' && candidate.name === tag;
}

/**
 * Convert an AI SDK error to `ErrorSignals` for the shared verdict
 * function. Individual fields (`statusCode`, `responseBody`, `value`,
 * `data`) are read directly from the typed properties documented by the
 * `ai` package.
 */
function signalsFromAiSdkError(err: unknown): ErrorSignals {
  const candidate = err as {
    message?: unknown;
    statusCode?: unknown;
    responseBody?: unknown;
    data?: unknown;
    value?: unknown;
  };
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  const statusCode =
    typeof candidate.statusCode === 'number' && Number.isFinite(candidate.statusCode)
      ? candidate.statusCode
      : undefined;
  return {
    message,
    statusCode,
    responseBody: candidate.responseBody,
    // TypeValidationError carries the offending payload on `value`; other
    // typed errors may use `data`. Prefer `value` when present so we
    // capture validation payloads.
    data: candidate.value ?? candidate.data,
  };
}

/**
 * Classify a thrown provider error into one of a small set of coarse
 * buckets used by the streaming orchestrator's recovery path.
 *
 * The classification runs in two stages:
 *
 *   1. **Typed AI SDK pre-pass.** If `error` is a recognised AI SDK error
 *      class (`APICallError`, `RetryError`, `TypeValidationError`, or the
 *      `AISDKError` base), we read its typed fields authoritatively:
 *        - `APICallError.statusCode` is the sole HTTP status source.
 *          A stale `response.status` hanging off the same object is
 *          ignored — the typed field wins.
 *        - `RetryError.lastError` (a.k.a. `lastAttempt`) is unwrapped and
 *          re-classified so the terminal failure drives the verdict, not
 *          the RetryError's own message. Falls back to the last entry of
 *          `errors[]` when neither `lastError` nor `lastAttempt` is set.
 *        - `TypeValidationError.value` is treated as the response body
 *          for overflow detection; defaults to `validation` otherwise.
 *        - `AISDKError.cause` is recursed into for wrapping errors.
 *
 *   2. **Structural fallback.** For anything else (plain `Error`, undici
 *      throwables, gateway-forwarded plain JSON error objects that
 *      dropped the AI SDK class tag), we walk the shape and collect
 *      messages/statuses across up to two levels of `cause` chain. This
 *      is also the path taken for AI SDK errors that were serialised
 *      over an IPC boundary and lost their constructor's `isInstance()`
 *      static method — we then match on the `name` tag alone.
 *
 * **When each path is used:**
 * - Typed pre-pass: `error` is a live `Error` instance (or object
 *   literal) whose `name` matches an AI SDK tag (`AI_APICallError`,
 *   `AI_RetryError`, `AI_TypeValidationError`, `AI_AISDKError`).
 * - Structural fallback: everything else, including
 *   `TypeError('fetch failed')` with an undici `cause`, gateway
 *   proxies that flatten the AI SDK error into raw provider JSON, and
 *   plain `Error` throwables from bespoke provider adapters.
 *
 * Recursion is depth-capped at 3 to survive pathological chains
 * (RetryError wrapping AISDKError wrapping RetryError) without
 * unbounded stack growth. Beyond depth 3, classification returns
 * `undefined` for that branch rather than throwing.
 *
 * The final verdict comes from the shared `verdictFromSignals` helper so
 * priority rules stay in one place regardless of entry path:
 *   `rate_limit > auth > (validation | context_overflow) > undefined`.
 */
export function classifyProviderError(error: unknown): ProviderErrorClass {
  return classifyProviderErrorInternal(error, 0);
}

/**
 * Bounded-depth internal recursion. Depth is capped at 3 to survive
 * pathological chains where a RetryError wraps an AISDKError wraps
 * another RetryError, without introducing an unbounded loop through
 * self-referential `cause` fields.
 */
function classifyProviderErrorInternal(error: unknown, depth: number): ProviderErrorClass {
  if (error === null || error === undefined || depth > 3) {
    return undefined;
  }

  // ── Typed AI SDK pre-pass ────────────────────────────────────────────
  // Order matters: check RetryError first so we unwrap to the terminal
  // attempt before considering it as an APICallError candidate. Check
  // the base AISDKError last so subclasses match their specific handler.

  if (isAiSdkError(error, AI_SDK_TAGS.RetryError)) {
    // RetryError.lastError is the terminal underlying failure that
    // caused retries to give up. The `ai` package used `lastError` in
    // recent versions; older wrappers use `lastAttempt`. Fall back to
    // the last entry of `errors[]` if neither is present.
    const retry = error as {
      lastError?: unknown;
      lastAttempt?: unknown;
      errors?: unknown;
    };
    const inner =
      retry.lastError ??
      retry.lastAttempt ??
      (Array.isArray(retry.errors) && retry.errors.length > 0
        ? retry.errors[retry.errors.length - 1]
        : undefined);
    if (inner !== undefined && inner !== error) {
      const nested = classifyProviderErrorInternal(inner, depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
    // Fall through to structural walk if unwrap yielded nothing.
  }

  if (isAiSdkError(error, AI_SDK_TAGS.APICallError)) {
    // APICallError.statusCode is authoritative — do NOT fall back to the
    // structural extractor, because a mixed shape could carry a stale
    // status on `response.status` from a previous attempt.
    return verdictFromSignals(signalsFromAiSdkError(error));
  }

  if (isAiSdkError(error, AI_SDK_TAGS.TypeValidationError)) {
    // TypeValidationError has no statusCode of its own; the offending
    // payload is on `.value`. Treat it as validation unless the payload
    // clearly indicates a context overflow.
    const signals = signalsFromAiSdkError(error);
    const verdict = verdictFromSignals(signals);
    return verdict ?? 'validation';
  }

  if (isAiSdkError(error, AI_SDK_TAGS.AISDKError)) {
    // Base class: recurse into `cause` if present, then fall through to
    // the structural walk if the cause did not classify.
    const wrapped = (error as { cause?: unknown }).cause;
    if (wrapped !== undefined && wrapped !== error) {
      const nested = classifyProviderErrorInternal(wrapped, depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
    // Fall through.
  }

  // ── Structural fallback ──────────────────────────────────────────────
  // For non-typed errors (plain Error, undici, JSON error objects) we
  // walk arbitrary shapes and collect signals across the cause chain.
  const statusCode = extractStatus(error);
  const messages = collectMessages(error);
  return verdictFromSignals({
    message: messages.join('\n'),
    statusCode,
  });
}
