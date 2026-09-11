/**
 * Linkify tool output — auto-detect URLs and `path:line` patterns in text
 * and wrap them with OSC-8 hyperlinks so supporting terminals render them
 * as clickable links.
 *
 * The linkifier is deliberately conservative:
 *   - Full URLs (`https://`, `http://`, `file://`) are always linkified.
 *   - `path:line` is only linkified when the "path" segment contains at
 *     least one path separator (`/`) or a file extension (`.ts`, `.js`,
 *     etc.). This avoids false positives on timestamps (`12:34`) and
 *     bare `host:port` strings (`localhost:3000`).
 *
 * Non-supporting terminals get plain text back (see `hyperlink()`), so
 * the transformation is safe to apply unconditionally to tool output.
 */

import path from 'node:path';
import { hyperlink } from './hyperlink.js';

/**
 * Matches an absolute URL. We stop at whitespace, ASCII control chars, or
 * common trailing punctuation (`.,;:!?)`]}>`) so that a URL at the end of
 * a sentence (`See https://example.com.`) does not swallow the period.
 * Trailing punctuation stripping happens in {@link stripTrailingPunctuation}.
 */
const URL_RE = /\b(https?:\/\/|file:\/\/)[^\s<>"']+/g;

/**
 * Matches a `path:line` (and optional `:column`) reference. The path
 * segment must contain at least one `/` OR a `.` followed by 1-6 word
 * characters (a file extension) to avoid matching plain `host:port` or
 * `hh:mm` strings.
 *
 * Examples that match:
 *   - `src/foo.ts:42`
 *   - `./bar/baz.tsx:10:5`
 *   - `/abs/path/file.js:1`
 *   - `foo.ts:12`
 *
 * Examples that do NOT match:
 *   - `12:34` (no path chars)
 *   - `localhost:3000` (no `/` or extension)
 *   - `key: value` (spaces + no path shape)
 */
const FILE_LINE_RE =
  /(?<![\w/.-])((?:\.{0,2}\/)?(?:[\w.-]+\/)*[\w.-]+\.[a-zA-Z]{1,10}|(?:\.{0,2}\/)(?:[\w.-]+\/)*[\w.-]+):(\d+)(?::(\d+))?\b/g;

const TRAILING_PUNCT = /[.,;:!?)\]}>]+$/;

/**
 * Strip trailing sentence punctuation from a captured URL so the match
 * result does not include the period at the end of a sentence.
 * Returns `[cleanUrl, trimmedSuffix]` — callers re-append the suffix
 * after the OSC-8 wrap.
 */
function stripTrailingPunctuation(url: string): [string, string] {
  const m = TRAILING_PUNCT.exec(url);
  if (!m) {
    return [url, ''];
  }
  return [url.slice(0, url.length - m[0].length), m[0]];
}

/**
 * Build a `file://` URI for a local path, resolving relative paths against
 * `cwd`. Line/column numbers are appended as a fragment so terminals that
 * understand `file://...#LINE` (VS Code, WezTerm) can jump to the location.
 */
function toFileUri(
  filePath: string,
  line: string,
  column: string | undefined,
  cwd: string
): string {
  const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
  // Normalize backslashes to forward slashes for the URI form. On POSIX
  // this is a no-op; on Windows it produces `file:///C:/...`.
  const posix = absolute.replace(/\\/g, '/');
  const withLeadingSlash = posix.startsWith('/') ? posix : `/${posix}`;
  const fragment = column !== undefined ? `${line}:${column}` : line;
  return `file://${withLeadingSlash}#${fragment}`;
}

/**
 * Represents a single detected match in the input text, before we render
 * it into hyperlink escape codes. Kept internal so we can sort matches
 * by index and splice them into the string in one pass.
 */
interface Match {
  start: number;
  end: number;
  replacement: string;
}

/**
 * Auto-detect URLs and `path:line` references in `text` and wrap them
 * with OSC-8 hyperlink escape sequences (via `hyperlink()`), returning a
 * new string. If the active terminal does not support OSC-8 hyperlinks,
 * the returned text is byte-identical to the input.
 *
 * @param text - Raw tool output (multiline OK).
 * @param cwd - Base directory for resolving relative file paths. Defaults
 *   to `process.cwd()`.
 */
export function linkify(text: string, cwd: string = process.cwd()): string {
  if (text.length === 0) {
    return text;
  }

  const matches: Match[] = [];

  // Collect URL matches first — they take precedence over file:line so
  // that `https://example.com:8080/path:42` is treated as one URL rather
  // than a URL followed by a `path:42` fragment.
  URL_RE.lastIndex = 0;
  let urlMatch: RegExpExecArray | null;
  while ((urlMatch = URL_RE.exec(text)) !== null) {
    const raw = urlMatch[0];
    const [clean, trailing] = stripTrailingPunctuation(raw);
    if (clean.length === 0) {
      continue;
    }
    const start = urlMatch.index;
    const end = start + raw.length;
    matches.push({
      start,
      end,
      replacement: hyperlink(clean) + trailing,
    });
  }

  // Collect file:line matches, skipping any that fall inside an
  // already-matched URL range (avoids double-wrapping the `:42` at the
  // end of `http://host/path.ts:42`).
  const urlRanges = matches.map((m) => [m.start, m.end] as const);
  FILE_LINE_RE.lastIndex = 0;
  let fileMatch: RegExpExecArray | null;
  while ((fileMatch = FILE_LINE_RE.exec(text)) !== null) {
    const start = fileMatch.index;
    const end = start + fileMatch[0].length;
    const overlapsUrl = urlRanges.some(([s, e]) => start < e && end > s);
    if (overlapsUrl) {
      continue;
    }
    const filePath = fileMatch[1];
    const line = fileMatch[2];
    const column = fileMatch[3];
    const uri = toFileUri(filePath, line, column, cwd);
    matches.push({
      start,
      end,
      replacement: hyperlink(uri, fileMatch[0]),
    });
  }

  if (matches.length === 0) {
    return text;
  }

  // Splice matches into the string in ascending start order.
  matches.sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const m of matches) {
    if (m.start < cursor) {
      // Overlap with a previously-committed match; skip.
      continue;
    }
    out += text.slice(cursor, m.start);
    out += m.replacement;
    cursor = m.end;
  }
  out += text.slice(cursor);
  return out;
}
