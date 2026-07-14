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
