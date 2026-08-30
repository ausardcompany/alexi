/**
 * Line ending detection helpers.
 *
 * The `apply_patch` tool (and any other write path that round-trips a file
 * through a normalized-to-LF intermediate representation) needs to know
 * whether the target file uses Windows-style CRLF or Unix-style LF so it
 * can preserve the convention instead of silently rewriting every line
 * ending. Silently converting LF <-> CRLF causes patch failures on Windows
 * repos and confuses git.
 *
 * These helpers deliberately read only the first 8 KiB of the target file
 * to keep detection cheap on very large files — CRLF/LF conventions are
 * consistent within a single file in practice, so a small prefix sample
 * is enough.
 *
 * String-level detection is also exposed for callers that already have
 * the file contents in memory (e.g. apply-patch, which decodes with a
 * detected encoding before this step).
 */

import { promises as fs } from 'fs';

/**
 * Uppercase style label used by the public API. LF and CRLF are the two
 * pure conventions; `mixed` is returned when a file contains both bare
 * LFs and CRLFs and neither is clearly dominant enough to treat the file
 * as one style.
 */
export type LineEnding = 'LF' | 'CRLF' | 'mixed';

/** Size of the head chunk read from disk during detection. */
export const LINE_ENDING_SAMPLE_BYTES = 8 * 1024;

/**
 * Detect the line-ending convention of an in-memory string.
 *
 * Returns:
 * - `'CRLF'` when at least one `\r\n` is present and no bare `\n` is
 *   present.
 * - `'LF'` when at least one bare `\n` is present and no `\r\n` is
 *   present.
 * - `'mixed'` when both `\r\n` and bare `\n` occur in the same content.
 * - `'LF'` as a safe default when the content has no line endings at all
 *   (a single-line file has no convention to preserve; LF is the
 *   canonical choice for TypeScript / Node source).
 */
export function detectLineEndingFromString(content: string): LineEnding {
  let crlf = 0;
  let bareLf = 0;

  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 0x0a /* \n */) {
      if (i > 0 && content.charCodeAt(i - 1) === 0x0d /* \r */) {
        crlf++;
      } else {
        bareLf++;
      }
    }
  }

  if (crlf > 0 && bareLf > 0) {
    return 'mixed';
  }
  if (crlf > 0) {
    return 'CRLF';
  }
  if (bareLf > 0) {
    return 'LF';
  }
  return 'LF';
}

/**
 * Detect the line-ending convention of a file on disk.
 *
 * Reads at most {@link LINE_ENDING_SAMPLE_BYTES} bytes from the head of
 * the file — enough to classify the convention without paying the cost of
 * a full read on multi-megabyte files.
 *
 * The sample is decoded as UTF-8 with `fatal: false` so that a chunk that
 * happens to end in the middle of a multi-byte code point still yields a
 * usable string for `\r\n` / `\n` counting.
 */
export async function detectLineEnding(filePath: string): Promise<LineEnding> {
  const handle = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(LINE_ENDING_SAMPLE_BYTES);
    const { bytesRead } = await handle.read(buf, 0, LINE_ENDING_SAMPLE_BYTES, 0);
    if (bytesRead === 0) {
      return 'LF';
    }
    // Note: TextDecoder with fatal:false tolerates a split multi-byte
    // char at the tail of the sample — we only care about \r and \n bytes
    // anyway, which are always single-byte in UTF-8.
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const sample = decoder.decode(buf.subarray(0, bytesRead));
    return detectLineEndingFromString(sample);
  } finally {
    await handle.close();
  }
}
