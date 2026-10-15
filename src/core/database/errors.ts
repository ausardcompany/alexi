/**
 * Database Query Error Redaction
 *
 * Ports upstream opencode `a8fc567` ("scrub params from database query
 * errors to avoid leaking user data"). Database drivers routinely embed
 * the full prepared-statement parameter list in their error messages,
 * so a failing query that was carrying an API key, a session blob, or
 * a user prompt will surface that payload through:
 *
 *   - the Node error object's `message` (visible in stack traces),
 *   - the logger output shipped to central observability,
 *   - any crash reporter that captures `error.message`.
 *
 * Alexi is deployed into SAP AI Core environments whose logs are
 * commonly forwarded to Cloud Logging / SAP Alert Notification, so
 * silently leaking the raw params into those pipes is a privacy /
 * secrets-handling risk. This helper wraps a raw driver error with a
 * safe, redacted message while preserving the original `cause` for
 * local debugging.
 *
 * Pure module: no I/O, safe to call from any driver layer
 * (`better-sqlite3`, `effect-sql`, `node:sqlite`, ...).
 */

/**
 * Format a database query error with its parameters redacted.
 *
 * The returned `Error` message always names the SQL statement (useful
 * for grepping and for distinguishing between prepared statements) and
 * replaces every element of `params` with the literal string
 * `[redacted]`. The parameter COUNT is preserved so a shape-mismatch
 * bug is still visible to operators.
 *
 * The original error is attached as `.cause` so the native stack
 * trace / driver code remains available in local debugging builds.
 * The `.cause` is NOT serialised into `message`, so forwarding the
 * `message` field alone cannot leak the raw parameters.
 */
export function formatQueryError(err: unknown, sql: string, params: unknown[]): Error {
  const message = err instanceof Error ? err.message : String(err);
  const redactedParams = params.map(() => '[redacted]');
  const wrapped = new Error(
    `Database query failed: ${message}\n` +
      `  sql: ${sql}\n` +
      `  params: ${JSON.stringify(redactedParams)}`,
    err !== undefined ? { cause: err } : undefined
  );
  wrapped.name = 'QueryError';
  return wrapped;
}
