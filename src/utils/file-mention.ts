/**
 * File-mention helpers
 *
 * Universal quoting and separator normalization for file paths that appear
 * in generated output (tool hints, diagnostics, PR comments, suggestions).
 *
 * Motivation: paths containing spaces (Windows "Program Files", macOS
 * "Application Support") get truncated at the first space when embedded
 * unquoted in output. Windows backslash separators also create
 * cross-platform inconsistency. Cline #13402 fixes both by:
 *   1. Normalizing separators to POSIX forward slashes.
 *   2. Wrapping paths that contain whitespace or other special characters
 *      in double quotes.
 *
 * The helpers are pure string transforms — they do not touch the
 * filesystem, so they are safe to use in synchronous formatters.
 */

/**
 * Convert Windows-style backslash separators to POSIX forward slashes.
 *
 * Only converts single backslashes acting as path separators; a path that
 * is already POSIX-style is returned unchanged. This function is
 * intentionally simple — it does not attempt to interpret escape
 * sequences.
 *
 * @param filePath - Path in any separator style.
 * @returns Path using forward slashes.
 */
export function toPosixPath(filePath: string): string {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return filePath;
  }
  return filePath.replace(/\\/g, '/');
}

/**
 * Regex matching characters that require quoting when the path is
 * embedded in generated output (whitespace, quotes, shell metacharacters).
 */
const NEEDS_QUOTES = /[\s"'`$()[\]{}<>|&;*?!]/;

/**
 * Quote a file path for safe embedding in generated output.
 *
 * The path is first normalized to POSIX separators, then wrapped in
 * double quotes if it contains any whitespace or other characters that
 * would break naive downstream parsers.
 *
 * Paths that are already safe are returned unchanged so common cases
 * (e.g. `src/core/router.ts`) stay readable.
 *
 * @param filePath - Path to quote.
 * @returns Quoted, POSIX-normalized path suitable for user-facing output.
 */
export function quoteFilePath(filePath: string): string {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return filePath;
  }
  const normalized = toPosixPath(filePath);
  if (!NEEDS_QUOTES.test(normalized)) {
    return normalized;
  }
  // Escape embedded double quotes so the wrapping remains parseable.
  const escaped = normalized.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

/**
 * Format a `file:line` or `file:line:column` mention with universal
 * quoting. When the path needs quoting, the line/column suffix stays
 * inside the quoted span so downstream parsers treat the whole mention
 * as a single token.
 *
 * @param filePath - Path to the file.
 * @param line - Optional 1-indexed line number.
 * @param column - Optional 1-indexed column number.
 * @returns A single string mention suitable for output.
 */
export function formatFileMention(filePath: string, line?: number, column?: number): string {
  if (typeof filePath !== 'string' || filePath.length === 0) {
    return filePath;
  }
  const normalized = toPosixPath(filePath);
  const suffixParts: string[] = [];
  if (typeof line === 'number' && Number.isFinite(line)) {
    suffixParts.push(String(line));
    if (typeof column === 'number' && Number.isFinite(column)) {
      suffixParts.push(String(column));
    }
  }
  const suffix = suffixParts.length > 0 ? `:${suffixParts.join(':')}` : '';
  const combined = `${normalized}${suffix}`;
  if (!NEEDS_QUOTES.test(combined)) {
    return combined;
  }
  const escaped = combined.replace(/"/g, '\\"');
  return `"${escaped}"`;
}
