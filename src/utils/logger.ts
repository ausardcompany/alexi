/**
 * Centralized logging utility to replace direct console.* calls
 * This allows for consistent logging and easier ESLint compliance
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface _LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'info';

/**
 * Redact sensitive data from a URL while preserving origin + pathname.
 *
 * Query parameters frequently carry OAuth tokens (`?token=...`,
 * `?access_token=...`), API keys (`?api_key=...`, `?key=...`), and other
 * credentials that must not appear in log files. The hash fragment can
 * also carry OAuth implicit-flow access tokens, so it is redacted too.
 *
 * Non-URL input is returned unchanged so this helper is safe to call on
 * arbitrary strings. For stripping URLs out of a larger error message
 * (e.g. the string body of an `Error.message`), use
 * {@link scrubUrlsFromString} instead.
 *
 * @example
 *   scrubUrl('https://api.example.com/v1/users?token=secret') ===
 *     'https://api.example.com/v1/users?[REDACTED]'
 *   scrubUrl('not a url') === 'not a url'
 */
export function scrubUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const hash = parsed.hash ? '#[REDACTED]' : '';
    if (parsed.search) {
      return `${parsed.origin}${parsed.pathname}?[REDACTED]${hash}`;
    }
    if (hash) {
      return `${parsed.origin}${parsed.pathname}${hash}`;
    }
    return url;
  } catch {
    return url;
  }
}

// URL detection used by scrubUrlsFromString. Matches http(s) URLs up to
// the first whitespace or common delimiter. Kept intentionally permissive
// so we scrub inside quoted strings, parens, backticks, etc.
const URL_PATTERN = /https?:\/\/[^\s<>"'`\\^|{}[\]]+/gi;

/**
 * Scrub every `http(s)` URL embedded in a free-form string. Each URL is
 * passed through {@link scrubUrl} so query parameters and hash fragments
 * are redacted while scheme, host, port, and pathname are preserved for
 * debuggability.
 *
 * Safe to call on `error.message`, provider error payloads, or any text
 * that may interpolate a URL. Non-URL content is left untouched.
 */
export function scrubUrlsFromString(text: string): string {
  if (!text || text.indexOf('http') === -1) {
    return text;
  }
  return text.replace(URL_PATTERN, (match) => {
    // Strip trailing punctuation that was likely part of the surrounding
    // sentence rather than the URL itself (e.g. "see https://x/y?t=1.")
    const trimmed = match.replace(/[.,;:!?)\]}'"`]+$/, '');
    const suffix = match.slice(trimmed.length);
    return scrubUrl(trimmed) + suffix;
  });
}

/**
 * Format an unknown thrown value for a log line. Always includes the
 * message when available; non-Error throws fall back to `String(err)`.
 * URLs embedded in the message are redacted so OAuth tokens / API keys
 * cannot leak into log files.
 *
 * When the logger is configured at `debug` level and `includeStack` is
 * true, the stack trace is appended on a new line. Stack traces are
 * intentionally omitted at higher levels because they are too verbose
 * for normal operation.
 */
export function formatError(err: unknown, includeStack = true): string {
  if (err instanceof Error) {
    const message = scrubUrlsFromString(err.message || err.name || 'Error');
    if (includeStack && err.stack && LOG_LEVELS[currentLevel] <= LOG_LEVELS.debug) {
      // Replace the first line of the stack (which repeats message) with
      // the scrubbed message so tokens inside the message don't leak back
      // through the stack header.
      const stackLines = err.stack.split('\n');
      const rest = stackLines.slice(1).join('\n');
      return `${message}\n${scrubUrlsFromString(rest)}`;
    }
    return message;
  }
  return scrubUrlsFromString(String(err));
}

export const logger = {
  setLevel(level: LogLevel): void {
    currentLevel = level;
  },

  getLevel(): LogLevel {
    return currentLevel;
  },

  debug(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.info) {
      console.log(message, ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  },

  // For direct output without formatting (like CLI output)
  print(message: string): void {
    console.log(message);
  },
};

export default logger;
