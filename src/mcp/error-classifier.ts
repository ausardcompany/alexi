/**
 * MCP Error Classifier
 *
 * Classifies errors raised while connecting to an MCP server into a small
 * set of categories and produces an actionable hint pointing at the exact
 * config field (or operator action) needed to fix the cause.
 *
 * The classifier is intentionally pure: it reads an unknown error and a
 * server config and returns a `{ category, hint }` pair. It does NOT
 * decide whether the error is transient or permanent — that split is
 * owned by `classifyConnectError` in `./client.ts`, which drives retry
 * budgeting. The categories here are a UX concern, not a retry one.
 *
 * Categories (stable string literals; new values may be added, existing
 * values will not be renamed):
 *
 * - `missing-command`     — `ENOENT` on spawn (binary not in PATH, or
 *   `command` points at a non-existent file).
 * - `permission-denied`   — `EACCES` / `EPERM` on spawn (binary exists
 *   but is not executable).
 * - `not-a-directory`     — `ENOTDIR` on spawn / cwd resolution.
 * - `timeout`             — `ETIMEDOUT` or a remote-transport connect
 *   timeout from `McpConnectTimeoutError` / startup timeout messages.
 * - `connection-refused`  — `ECONNREFUSED` from a remote transport dial.
 * - `connection-reset`    — `ECONNRESET` / `EPIPE` mid-handshake.
 * - `auth-failed`         — HTTP 401 / 403 from a remote transport,
 *   including `McpConnectAuthError`.
 * - `missing-env-var`     — resolved env map was missing a `${VAR}`
 *   that the raw config referenced.
 * - `transient-network`   — generic transient network / startup blip
 *   (`EAGAIN`, `EBUSY`, `fetch failed`, etc.) not covered above.
 * - `unknown`             — anything else.
 */

import type { McpServerConfig } from './config.js';

/**
 * Stable category identifier returned by {@link classifyMcpError}.
 *
 * Exposed as a union of string literals (rather than an enum) so
 * downstream code can store the value verbatim in logs, status
 * objects, or JSON serializations without an enum-to-string
 * translation step.
 */
export type McpErrorCategory =
  | 'missing-command'
  | 'permission-denied'
  | 'not-a-directory'
  | 'timeout'
  | 'connection-refused'
  | 'connection-reset'
  | 'auth-failed'
  | 'missing-env-var'
  | 'transient-network'
  | 'unknown';

export interface ClassifiedMcpError {
  /** Stable category identifier. */
  category: McpErrorCategory;
  /**
   * One-line actionable hint pointing at the exact config field,
   * environment variable, or operator action needed to resolve the
   * underlying cause. ASCII-only, no trailing punctuation beyond `.`.
   */
  hint: string;
}

/**
 * Read a `code` property off an unknown error object. Returns
 * `undefined` when the value is missing or non-string so downstream
 * `switch` statements do not need to re-guard the type.
 */
function readErrorCode(error: unknown): string | undefined {
  if (error === null || typeof error !== 'object') {
    return undefined;
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

/**
 * Read an HTTP-ish status off an unknown error object. Checks the
 * `status`, `statusCode`, and `httpStatus` fields in that order so
 * errors from different SDK layers (fetch wrappers, custom auth
 * errors, etc.) are classified consistently.
 */
function readHttpStatus(error: unknown): number | undefined {
  if (error === null || typeof error !== 'object') {
    return undefined;
  }
  const candidate = error as { status?: unknown; statusCode?: unknown; httpStatus?: unknown };
  for (const value of [candidate.status, candidate.statusCode, candidate.httpStatus]) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

/**
 * Read the human-readable message off an unknown error, defaulting to
 * an empty string when the value is missing or non-string.
 */
function readMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object') {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === 'string') {
      return msg;
    }
  }
  return '';
}

/**
 * Describe the configured target for a server in a form safe to embed
 * in a hint. Prefers the stdio `command`, then the remote `url`, then
 * falls back to the server name so a misconfigured entry (neither
 * command nor url) still produces a useful message.
 */
function describeTarget(config: McpServerConfig): string {
  if (typeof config.command === 'string' && config.command.length > 0) {
    return config.command;
  }
  if (typeof config.url === 'string' && config.url.length > 0) {
    return config.url;
  }
  return config.name;
}

/**
 * Extract a port number from a remote-transport URL, if one is both
 * configured and parseable. Returns `undefined` for stdio servers or
 * when the URL does not carry an explicit port. The default HTTP(S)
 * ports (80 / 443) are reported verbatim so the hint can name them;
 * callers that want to omit implicit ports can filter them out.
 */
function extractPort(config: McpServerConfig): number | undefined {
  if (typeof config.url !== 'string' || config.url.length === 0) {
    return undefined;
  }
  try {
    const url = new URL(config.url);
    if (url.port.length > 0) {
      const parsed = Number.parseInt(url.port, 10);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    if (url.protocol === 'http:') {
      return 80;
    }
    if (url.protocol === 'https:') {
      return 443;
    }
  } catch {
    // Fall through — malformed URL means we cannot name a port.
  }
  return undefined;
}

/**
 * Classify a raw error raised during an MCP connect attempt into one
 * of the stable {@link McpErrorCategory} values and produce an
 * actionable hint for operators. Pure function — safe to call from
 * log formatters, status serializers, and tests.
 *
 * The classifier checks (in order):
 * 1. Node system-call `code` fields (`ENOENT`, `EACCES`, ...). These
 *    are the single most reliable signal when they are present.
 * 2. HTTP status fields (`status` / `statusCode` / `httpStatus`) for
 *    `401` / `403` auth rejections raised by remote transports.
 * 3. Named error classes from `./client.ts` recognised by name /
 *    message substring (we match by substring rather than importing
 *    the classes to avoid a circular dependency: `client.ts` imports
 *    this file).
 * 4. Message substrings for signals that do not carry a `code` (e.g.
 *    `fetch failed`, `missing environment variable ...`).
 * 5. Fallback: `unknown` with a generic hint.
 */
export function classifyMcpError(error: unknown, config: McpServerConfig): ClassifiedMcpError {
  const code = readErrorCode(error);
  const status = readHttpStatus(error);
  const message = readMessage(error);
  const target = describeTarget(config);

  // 1. Node system-call codes — the strongest signal we have.
  if (code === 'ENOENT') {
    return {
      category: 'missing-command',
      hint: `Check that '${target}' is installed and in PATH, or fix the 'command' field in mcp-servers.json.`,
    };
  }
  if (code === 'EACCES' || code === 'EPERM') {
    return {
      category: 'permission-denied',
      hint: `Check that '${target}' is executable (chmod +x) and readable by the current user.`,
    };
  }
  if (code === 'ENOTDIR') {
    return {
      category: 'not-a-directory',
      hint: `Check the 'cwd' field in mcp-servers.json — a path component is not a directory.`,
    };
  }
  if (code === 'ETIMEDOUT') {
    return {
      category: 'timeout',
      hint: `Increase 'connectTimeout' or 'timeout.startup' in mcp-servers.json, or check network connectivity to '${target}'.`,
    };
  }
  if (code === 'ECONNREFUSED') {
    const port = extractPort(config);
    const portHint = port !== undefined ? ` (port ${port})` : '';
    return {
      category: 'connection-refused',
      hint: `Check that '${target}'${portHint} is reachable and the MCP server process is running.`,
    };
  }
  if (code === 'ECONNRESET' || code === 'EPIPE') {
    return {
      category: 'connection-reset',
      hint: `Connection was reset by '${target}'; retry if transient, or check the server logs for a crash.`,
    };
  }
  if (code === 'EAGAIN' || code === 'EBUSY') {
    return {
      category: 'transient-network',
      hint: `Transient OS error (${code}) while connecting to '${target}'; retry will be attempted if 'retry.enabled' is true.`,
    };
  }

  // 2. HTTP auth status codes.
  if (status === 401 || status === 403) {
    return {
      category: 'auth-failed',
      hint: `Check the 'apiKey' field in mcp-servers.json — remote server rejected credentials with HTTP ${status}.`,
    };
  }

  // 3. Named error classes raised by the client layer. We match by
  //    name/substring to avoid a circular dependency with client.ts.
  const errorName = error instanceof Error ? error.name : '';
  if (errorName === 'McpConnectAuthError') {
    return {
      category: 'auth-failed',
      hint: `Check the 'apiKey' field in mcp-servers.json — remote server rejected credentials.`,
    };
  }
  if (errorName === 'McpConnectTimeoutError' || /remote transport connect timeout/i.test(message)) {
    return {
      category: 'timeout',
      hint: `Increase 'connectTimeout' in mcp-servers.json, or check network connectivity to '${target}'.`,
    };
  }
  if (/startup timeout for server/i.test(message) && /timed out after/i.test(message)) {
    return {
      category: 'timeout',
      hint: `Increase 'timeout.startup' in mcp-servers.json — '${target}' did not complete the handshake in time.`,
    };
  }

  // 4. Message-only signals.
  if (/missing environment variable/i.test(message)) {
    return {
      category: 'missing-env-var',
      hint: `Set the referenced environment variable(s) in the process environment or in the 'env' block of mcp-servers.json.`,
    };
  }
  if (/HTTP\s+40[13]/i.test(message)) {
    return {
      category: 'auth-failed',
      hint: `Check the 'apiKey' field in mcp-servers.json — remote server rejected credentials.`,
    };
  }
  if (/fetch failed|network error|getaddrinfo|ENOTFOUND/i.test(message)) {
    return {
      category: 'transient-network',
      hint: `Transient network error while connecting to '${target}'; check connectivity and retry.`,
    };
  }

  // 5. Fallback.
  return {
    category: 'unknown',
    hint: `Unexpected error connecting to '${target}'; inspect the full error message and server logs.`,
  };
}
