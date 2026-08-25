/**
 * EOL (End-Of-Line) normalization helpers.
 *
 * When creating new files we want to match the host platform's native line
 * ending convention so that new files do not immediately show up as
 * "entire file changed" in git diffs on Windows repositories (which use
 * CRLF via `core.autocrlf`). When overwriting an existing file we want to
 * preserve whatever line ending style the file already uses.
 *
 * Model input is normalized to `\n` internally, so we always start from
 * LF-only content and, if needed, upgrade to CRLF when writing.
 */

import * as os from 'os';

export type LineEnding = '\n' | '\r\n';

/**
 * Detect the dominant line ending in the given content.
 *
 * Rule: if any `\r\n` sequence exists in the string, treat the file as
 * CRLF. Otherwise treat it as LF. Files with no line endings at all are
 * reported as LF (a safe default and consistent with existing tests).
 */
export function detectLineEnding(content: string): LineEnding {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

/**
 * Normalize the given content for writing to a NEW file.
 *
 * The content is first collapsed to LF (in case the caller mixed line
 * endings) and then rewritten to the target EOL. When `eol` is omitted
 * the host platform's `os.EOL` is used.
 */
export function normalizeNewFileLineEndings(
  content: string,
  eol: LineEnding = getPlatformEol()
): string {
  const lfOnly = content.replace(/\r\n/g, '\n');
  if (eol === '\n') {
    return lfOnly;
  }
  return lfOnly.replace(/\n/g, '\r\n');
}

/**
 * Rewrite content to match the line ending style of an existing file.
 * Used when overwriting so we do not flip the file's EOL style.
 */
export function preserveExistingLineEndings(newContent: string, existingContent: string): string {
  const targetEol = detectLineEnding(existingContent);
  const lfOnly = newContent.replace(/\r\n/g, '\n');
  if (targetEol === '\n') {
    return lfOnly;
  }
  return lfOnly.replace(/\n/g, '\r\n');
}

/**
 * Resolve the host platform's native line ending to our `LineEnding` union.
 * Anything other than `\r\n` is treated as `\n` (defensive default).
 */
export function getPlatformEol(): LineEnding {
  return os.EOL === '\r\n' ? '\r\n' : '\n';
}
