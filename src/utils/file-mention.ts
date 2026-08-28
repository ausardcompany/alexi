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
/**
 * A single `@`-file mention parsed out of a template or user message.
 *
 * `fullMatch` is the exact substring that should be replaced when the
 * mention is expanded (e.g. `@"My Documents/report.txt"` or `@src/foo.ts`).
 * `path` is the extracted path with any surrounding quotes and escape
 * sequences resolved (e.g. `My Documents/report.txt`).
 * `index` is the 0-based offset of `fullMatch` in the source string.
 */
export interface FileMention {
  readonly fullMatch: string;
  readonly path: string;
  readonly index: number;
}

/**
 * Parse `@<path>` file mentions from a source string, with support for
 * quoted paths that contain spaces or other special characters.
 *
 * Supported forms:
 *   - `@src/foo.ts`                  — bareword, terminated by whitespace
 *   - `@"My Documents/file.txt"`     — double-quoted, allows spaces
 *   - `@'draft (2)/notes.md'`        — single-quoted, allows spaces
 *
 * Inside quoted forms, `\"`, `\'`, and `\\` are honoured as escapes so a
 * path containing the wrapping quote character can still be expressed.
 *
 * Mentions preceded by another `@` (e.g. inside an email address like
 * `user@host@domain`) or by a word character are NOT matched, mirroring
 * the historical behaviour of the bareword-only regex.
 *
 * The parser is a small hand-rolled scanner rather than a regex because
 * the quoted form requires balanced-delimiter matching that plain regex
 * flavours in JavaScript cannot express cleanly.
 *
 * @param source - The string to scan.
 * @returns All mentions in order of appearance.
 */
export function parseFileMentions(source: string): FileMention[] {
  if (typeof source !== 'string' || source.length === 0) {
    return [];
  }
  const mentions: FileMention[] = [];
  const len = source.length;
  let i = 0;
  while (i < len) {
    const ch = source[i];
    if (ch !== '@') {
      i++;
      continue;
    }
    // Only match `@` at the start of the string or when the preceding
    // character is not part of a word / another `@`. This preserves the
    // historical email-address exclusion (`user@host` won't match `@host`)
    // and matches the previous regex's tacit behaviour.
    if (i > 0) {
      const prev = source[i - 1];
      if (prev === '@' || /[A-Za-z0-9_]/.test(prev)) {
        i++;
        continue;
      }
    }
    // Determine the delimiter, if any, and the start of the path body.
    const next = source[i + 1];
    if (next === '"' || next === "'") {
      const quote = next;
      let j = i + 2;
      let pathBody = '';
      let closed = false;
      while (j < len) {
        const cj = source[j];
        if (cj === '\\' && j + 1 < len) {
          const escaped = source[j + 1];
          if (escaped === quote || escaped === '\\') {
            pathBody += escaped;
            j += 2;
            continue;
          }
        }
        if (cj === quote) {
          closed = true;
          j++;
          break;
        }
        pathBody += cj;
        j++;
      }
      if (!closed || pathBody.length === 0) {
        // Unterminated or empty quoted mention: skip past the opening `@`.
        i++;
        continue;
      }
      mentions.push({
        fullMatch: source.slice(i, j),
        path: pathBody,
        index: i,
      });
      i = j;
      continue;
    }
    // Bareword form: consume until whitespace.
    let j = i + 1;
    while (j < len && !/\s/.test(source[j])) {
      j++;
    }
    const body = source.slice(i + 1, j);
    if (body.length === 0) {
      i++;
      continue;
    }
    // Preserve the historical guard: skip mentions that themselves
    // contain another `@` (email heuristic) or that begin with `$` (a
    // positional/variable token that a prior pass should have handled).
    if (body.includes('@') || body.startsWith('$')) {
      i = j;
      continue;
    }
    mentions.push({
      fullMatch: source.slice(i, j),
      path: body,
      index: i,
    });
    i = j;
  }
  return mentions;
}

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
