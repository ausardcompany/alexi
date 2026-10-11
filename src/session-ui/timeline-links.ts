/**
 * Deterministic timeline file-link detection.
 *
 * Ports upstream opencode commit f43903d8 (2026-10): deterministically detect
 * and resolve file links in session timeline / message rendering. Prevents
 * false positives when model output contains path-like strings that aren't
 * real files on disk — only resolved, existing paths are returned.
 *
 * The matcher is intentionally conservative: it anchors on a leading
 * whitespace / "(" / start-of-string so bare words like "foo.ts" inside
 * prose do not get linkified, and only paths whose leading segment is a
 * recognisable path prefix (`./`, `../`, `/`, `~/`, `C:\`) survive.
 */

import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const FILE_LINK_RE = /(?:^|[\s(])((?:\.{0,2}\/|[a-zA-Z]:\\|~\/)[\w./\\-]+(?::\d+)?(?::\d+)?)/g;

export interface FileLink {
  /** Raw matched substring, including any `:line:col` suffix. */
  raw: string;
  /** Absolute, resolved path on disk. */
  absolutePath: string;
  /** Optional 1-based line number parsed from a `:N` suffix. */
  line?: number;
  /** Optional 1-based column number parsed from a `:N:M` suffix. */
  column?: number;
  /** `true` once `fs.access` has confirmed the path exists. */
  exists: boolean;
}

/**
 * Scan `text` for file-path references, resolve them against `workspaceRoot`,
 * and return only those that actually exist on disk. Non-existent matches
 * are discarded (not returned with `exists: false`) because the whole point
 * of the deterministic matcher is to suppress false positives.
 */
export async function detectFileLinks(text: string, workspaceRoot: string): Promise<FileLink[]> {
  const matches = [...text.matchAll(FILE_LINK_RE)];
  const results: FileLink[] = [];
  for (const m of matches) {
    const raw = m[1];
    if (!raw) {
      continue;
    }
    // Windows drive letters (`C:\...`) contain colons that we must NOT
    // interpret as `:line:col`. Split only when the leading byte sequence
    // is not a drive letter.
    let filePart = raw;
    let lineStr: string | undefined;
    let colStr: string | undefined;
    const driveRe = /^[a-zA-Z]:\\/;
    if (driveRe.test(raw)) {
      // Strip the "C:" prefix before splitting the rest on ':'.
      const prefix = raw.slice(0, 2); // "C:"
      const rest = raw.slice(2); // "\\path\\...[:L[:C]]"
      const parts = rest.split(':');
      filePart = prefix + parts[0];
      lineStr = parts[1];
      colStr = parts[2];
    } else {
      const parts = raw.split(':');
      filePart = parts[0];
      lineStr = parts[1];
      colStr = parts[2];
    }
    const abs = path.isAbsolute(filePart) ? filePart : path.resolve(workspaceRoot, filePart);
    let exists = false;
    try {
      await fs.access(abs);
      exists = true;
    } catch {
      /* not a real file — skip */
    }
    if (exists) {
      const parsedLine = lineStr !== undefined ? Number(lineStr) : NaN;
      const parsedCol = colStr !== undefined ? Number(colStr) : NaN;
      results.push({
        raw,
        absolutePath: abs,
        line: Number.isFinite(parsedLine) ? parsedLine : undefined,
        column: Number.isFinite(parsedCol) ? parsedCol : undefined,
        exists,
      });
    }
  }
  return results;
}
