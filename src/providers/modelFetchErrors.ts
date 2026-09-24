/**
 * Model-list fetch error surfacing (issue #1824)
 *
 * When Alexi fetches the SAP AI Core deployment / model list at startup
 * (via `src/providers/modelCatalog.ts`) or on demand (`alexi models`), a
 * failure used to be swallowed silently: the catalog fell back to the
 * static seed and the CLI showed "no deployments found", leaving the
 * user unable to tell an empty tenant apart from a broken credential or
 * an unreachable endpoint.
 *
 * This module centralises three things so both the background catalog
 * refresh and the interactive `alexi models` command share one
 * classification contract:
 *
 *   - `ModelFetchError`   — a typed error carrying the classified
 *                            reason, HTTP status (when known), and a
 *                            `transient` flag consumers can inspect
 *                            without regex-matching the message.
 *   - `classifyFetchError`— folds the many shapes of upstream failures
 *                            (raw fetch, `@sap-cloud-sdk/http-client`
 *                            errors, `AICORE_SERVICE_KEY` mis-parse,
 *                            SAP proxy responses) into a single
 *                            {statusCode, transient, reason}.
 *   - `fetchWithRetry`    — retries transient failures with capped
 *                            exponential backoff and surfaces permanent
 *                            failures on the first attempt, per the
 *                            error contract in `AGENTS.md`.
 *
 * Design notes:
 *
 *   - We intentionally do NOT depend on `src/core/error-backoff.ts` for
 *     the retry loop. `ErrorBackoff` is a stateful circuit breaker for
 *     the chat/streaming hot path; the model-list fetch runs at most a
 *     few times per session and needs a stateless "try N times" loop.
 *     Duplicating a tiny amount of policy is cheaper than coupling
 *     providers ↔ core through a stateful helper.
 *
 *   - Transient classification uses the same set as the workflow
 *     retry regex in `.github/workflows/*.yml`
 *     (`socket hang up|ECONNRESET|ETIMEDOUT|ENOTFOUND|fetch failed|
 *     502|503|429|rate limit`) so a manual re-run of a failing agent
 *     workflow makes the same retry decision the runtime does.
 *
 *   - Permanent classification lists `400`, `401`, `403`, `404`, and
 *     `422`. These match the "permanent" bucket in AGENTS.md → error
 *     handling, so a bad `AICORE_SERVICE_KEY` fails FAST with a message
 *     the operator can act on rather than after three retries.
 */

/**
 * Classification of a single fetch failure.
 */
export interface FetchErrorClass {
  /** Whether the caller should retry this error under exponential backoff. */
  transient: boolean;
  /** HTTP status code, when the underlying error carried one. */
  statusCode?: number;
  /** Machine-readable code (`ECONNRESET`, `ENOTFOUND`, ...) when known. */
  code?: string;
  /** Short user-facing reason (e.g. "unauthorized (401)", "endpoint unreachable"). */
  reason: string;
}

/**
 * Error thrown when a model-list fetch ultimately fails. Carries the
 * classified reason and status so the CLI can render a targeted message
 * ("Failed to fetch models: unauthorized (401) — check AICORE_SERVICE_KEY")
 * instead of the raw upstream stack trace.
 *
 * Consumers that want to distinguish transient from permanent (for
 * example, "should we suppress this in the TUI status indicator?") can
 * inspect `.transient` directly.
 */
export class ModelFetchError extends Error {
  readonly reason: string;
  readonly statusCode?: number;
  readonly code?: string;
  readonly transient: boolean;
  readonly cause?: unknown;

  constructor(classification: FetchErrorClass, cause?: unknown) {
    super(`Failed to fetch models: ${classification.reason}`);
    this.name = 'ModelFetchError';
    this.reason = classification.reason;
    this.statusCode = classification.statusCode;
    this.code = classification.code;
    this.transient = classification.transient;
    this.cause = cause;
  }
}

const TRANSIENT_MESSAGE_RE =
  /socket hang up|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EPIPE|EAGAIN|EBUSY|fetch failed|rate limit/i;

const PERMANENT_STATUS = new Set([400, 401, 403, 404, 422]);
const TRANSIENT_STATUS = new Set([429, 500, 502, 503, 504]);

/**
 * Pull an HTTP status code out of the many shapes upstream libraries use:
 *
 *   - `err.status`                (native fetch Response-like)
 *   - `err.statusCode`            (SAP-provided rate-limit errors)
 *   - `err.response.status`       (`@sap-cloud-sdk/http-client`, axios-style)
 *   - `err.cause.status`          (`@sap-cloud-sdk` sometimes wraps)
 *   - `err.rootCause.status`
 *   - a bare number in the message ("... failed with status: 429")
 *
 * Returns `undefined` when none of the above are populated so callers can
 * fall back to message-based transient detection.
 */
function extractStatus(err: unknown): number | undefined {
  if (err === null || err === undefined || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as Record<string, unknown>;
  const direct =
    typeof candidate.status === 'number'
      ? candidate.status
      : typeof candidate.statusCode === 'number'
        ? candidate.statusCode
        : undefined;
  if (direct !== undefined) {
    return direct;
  }

  const nested = (key: string): number | undefined => {
    const val = candidate[key];
    if (val && typeof val === 'object') {
      const nestedStatus = (val as Record<string, unknown>).status;
      if (typeof nestedStatus === 'number') {
        return nestedStatus;
      }
    }
    return undefined;
  };
  const fromResponse = nested('response') ?? nested('cause') ?? nested('rootCause');
  if (fromResponse !== undefined) {
    return fromResponse;
  }

  // Last-resort: parse "status: NNN" out of the message. Anchored to
  // colon + 3-digit 4xx/5xx so unrelated numbers ("timeout 12000") do
  // not collide.
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  const match = message.match(/status[:\s]+([45]\d{2})\b/i);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Extract a Node.js-style error `code` (`ECONNRESET`, `ENOTFOUND`, ...) when
 * present. Follows the `err.cause` chain because the SAP SDK's request layer
 * wraps low-level connect failures in an intermediate error.
 */
function extractCode(err: unknown): string | undefined {
  if (err === null || err === undefined || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as { code?: unknown; cause?: unknown };
  if (typeof candidate.code === 'string') {
    return candidate.code;
  }
  if (candidate.cause && typeof candidate.cause === 'object') {
    const nested = (candidate.cause as { code?: unknown }).code;
    if (typeof nested === 'string') {
      return nested;
    }
  }
  return undefined;
}

/**
 * Best-effort message extraction. Falls back to `String(err)` so we never
 * bury the operator's only diagnostic in a `[object Object]`.
 */
function extractMessage(err: unknown): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err && typeof err === 'object') {
    const candidate = err as { message?: unknown };
    if (typeof candidate.message === 'string' && candidate.message.length > 0) {
      return candidate.message;
    }
  }
  return String(err);
}

/**
 * Fold an upstream error into a classified {statusCode, transient, reason}.
 *
 * Precedence:
 *   1. If the error carries an HTTP status, that is authoritative:
 *      permanent for 4xx (except 429), transient for 429/5xx.
 *   2. Otherwise, if the error carries a Node.js `code` we recognise,
 *      classify by code (`ECONNRESET` → transient, `ENOENT` → permanent).
 *   3. Otherwise fall back to the transient message regex.
 *   4. Otherwise assume permanent — retrying an unknown failure only
 *      wastes budget and delays the human diagnostic.
 */
export function classifyFetchError(err: unknown): FetchErrorClass {
  const status = extractStatus(err);
  const code = extractCode(err);
  const message = extractMessage(err);

  // 1. HTTP status is authoritative when present.
  if (status !== undefined) {
    if (PERMANENT_STATUS.has(status)) {
      const reason =
        status === 401 || status === 403
          ? `unauthorized (${status}) — check AICORE_SERVICE_KEY / credentials`
          : status === 404
            ? `endpoint not found (404) — check AI_API_URL / resource group`
            : status === 400 || status === 422
              ? `bad request (${status}) — ${message}`
              : `HTTP ${status}: ${message}`;
      return { transient: false, statusCode: status, code, reason };
    }
    if (TRANSIENT_STATUS.has(status)) {
      const reason =
        status === 429
          ? 'rate limit (429) — retrying with backoff'
          : `HTTP ${status} — retrying with backoff`;
      return { transient: true, statusCode: status, code, reason };
    }
    // Any other status: treat as permanent (unusual redirects, etc.)
    return {
      transient: false,
      statusCode: status,
      code,
      reason: `HTTP ${status}: ${message}`,
    };
  }

  // 2. Node.js error codes.
  if (code) {
    const transientCodes = new Set([
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'EPIPE',
      'EAGAIN',
      'EBUSY',
      'UND_ERR_SOCKET',
      'UND_ERR_CONNECT_TIMEOUT',
    ]);
    if (transientCodes.has(code)) {
      return {
        transient: true,
        code,
        reason: `network error (${code}) — retrying with backoff`,
      };
    }
    const permanentCodes = new Set(['ENOENT', 'EACCES', 'ENOTDIR', 'EPERM']);
    if (permanentCodes.has(code)) {
      return {
        transient: false,
        code,
        reason: `system error (${code}): ${message}`,
      };
    }
  }

  // 3. Message-based transient detection.
  if (TRANSIENT_MESSAGE_RE.test(message)) {
    return {
      transient: true,
      code,
      reason: `network error — retrying with backoff: ${message}`,
    };
  }

  // 4. Unknown → permanent.
  return {
    transient: false,
    code,
    reason: message || 'unknown error',
  };
}

/**
 * Retry policy for {@link fetchWithRetry}. Defaults follow the same
 * shape as `ErrorBackoff` (`initialDelay * 2^n`, capped) but with a
 * smaller `maxAttempts` because the model-list fetch is bounded — a
 * user typing `alexi models` should not wait 60s for a hopeless retry.
 */
export interface FetchRetryOptions {
  /** Maximum number of attempts including the first. Default 3. */
  maxAttempts?: number;
  /** Base delay in ms before the first retry. Default 1000. */
  initialDelayMs?: number;
  /** Cap on the delay between retries. Default 8000. */
  maxDelayMs?: number;
  /**
   * Sleep function. Overridable so tests can drive the timer without
   * `vi.useFakeTimers()`.
   */
  sleep?: (ms: number) => Promise<void>;
  /**
   * Callback invoked after every transient failure. Receives the
   * 1-indexed attempt number and the classification. Errors thrown
   * from the callback are swallowed so a broken logger cannot mask a
   * retry.
   */
  onRetry?: (attempt: number, classification: FetchErrorClass) => void;
}

const defaultSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms);
    if (
      typeof t === 'object' &&
      t !== null &&
      typeof (t as { unref?: () => void }).unref === 'function'
    ) {
      (t as { unref: () => void }).unref();
    }
  });

/**
 * Run `op` with capped exponential backoff on transient failures.
 *
 * Contract:
 *  - Permanent failures (per {@link classifyFetchError}) are wrapped in a
 *    {@link ModelFetchError} and thrown on the first attempt.
 *  - Transient failures are wrapped in a {@link ModelFetchError} and
 *    thrown only after the last attempt is exhausted; the classification
 *    is preserved so callers can display `err.reason` verbatim.
 *  - Success returns the raw operation result.
 *
 * The retry budget matches `KILO_RETRIES=2` in the agent workflows
 * (3 total attempts) but callers can shrink it for latency-sensitive
 * paths (interactive `alexi models`) or grow it for background refresh
 * loops that can afford to wait.
 */
export async function fetchWithRetry<T>(
  op: () => Promise<T>,
  options: FetchRetryOptions = {}
): Promise<T> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
  const initialDelay = Math.max(0, options.initialDelayMs ?? 1000);
  const maxDelay = Math.max(initialDelay, options.maxDelayMs ?? 8000);
  const sleep = options.sleep ?? defaultSleep;

  let lastClassification: FetchErrorClass | undefined;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await op();
    } catch (err) {
      const classification = classifyFetchError(err);
      lastClassification = classification;
      lastError = err;

      if (!classification.transient) {
        // Permanent — no more retries would help. Surface immediately.
        throw new ModelFetchError(classification, err);
      }
      if (attempt >= maxAttempts) {
        break;
      }
      if (options.onRetry) {
        try {
          options.onRetry(attempt, classification);
        } catch {
          // Swallow — a broken logger must not mask a retry.
        }
      }
      const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  // Transient budget exhausted.
  throw new ModelFetchError(
    lastClassification ?? {
      transient: true,
      reason: 'unknown transient error',
    },
    lastError
  );
}
