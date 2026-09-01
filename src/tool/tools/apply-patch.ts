/**
 * Apply Patch Tool - Apply patches to files while preserving encoding
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { defineTool, type ToolResult } from '../index.js';
import { detectEncoding, decodeWithEncoding, encodeWithEncoding } from '../encoded-io.js';
import { detectLineEnding } from '../../utils/line-ending.js';

type LineEndingStyle = 'crlf' | 'lf';

/**
 * Detect the dominant line ending style for a string.
 *
 * Counts CRLF vs bare LF occurrences and returns the majority style. When
 * the content contains both conventions the majority wins; ties break to
 * `lf`. If the content has no line endings at all, falls back to the
 * platform default (CRLF on Windows, LF elsewhere).
 *
 * Kept in this module for backward compatibility with existing tests and
 * because it applies a platform-default fallback that the pure
 * string-detection helper in `src/utils/line-ending.ts` does not. New
 * code that has a file path in hand should prefer {@link detectLineEnding}
 * from `src/utils/line-ending.ts`, which reads only the first 8 KiB of
 * the file and returns the uppercase `'LF' | 'CRLF' | 'mixed'` label.
 */
export function detectLineEndingStyle(content: string): LineEndingStyle {
  let crlf = 0;
  let lf = 0;
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 0x0a) {
      if (i > 0 && content.charCodeAt(i - 1) === 0x0d) {
        crlf++;
      } else {
        lf++;
      }
    }
  }

  if (crlf === 0 && lf === 0) {
    return os.EOL === '\r\n' ? 'crlf' : 'lf';
  }
  return crlf > lf ? 'crlf' : 'lf';
}

/**
 * Normalize any CRLF sequences to LF for consistent parsing.
 */
export function normalizeToLf(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/**
 * Re-encode LF-only content to the given target style.
 */
export function applyLineEndingStyle(content: string, style: LineEndingStyle): string {
  if (style === 'lf') {
    return content;
  }
  // Replace bare LFs with CRLF; content is guaranteed to be LF-only here.
  return content.replace(/\n/g, '\r\n');
}

const ApplyPatchParamsSchema = z.object({
  path: z.string().describe('Absolute path to the file to patch'),
  patch: z.string().describe('Unified diff patch to apply'),
});

interface ApplyPatchResult {
  path: string;
  diff: string;
  linesChanged: number;
}

/**
 * Error thrown when a patch hunk does not match the file contents.
 *
 * Carries enough context to surface the failure back to the caller without
 * silently corrupting the file: which hunk failed, which line in the source
 * file, and what was expected vs. actually present.
 */
export class PatchHunkError extends Error {
  readonly hunkNumber: number;
  readonly filePath: string;
  readonly expected: string;
  readonly actual: string;
  readonly lineNumber: number;

  constructor(opts: {
    hunkNumber: number;
    filePath: string;
    expected: string;
    actual: string;
    lineNumber: number;
  }) {
    super(
      `Patch hunk ${opts.hunkNumber} failed at line ${opts.lineNumber}: ` +
        `expected ${JSON.stringify(opts.expected)}, got ${JSON.stringify(opts.actual)}`
    );
    this.name = 'PatchHunkError';
    this.hunkNumber = opts.hunkNumber;
    this.filePath = opts.filePath;
    this.expected = opts.expected;
    this.actual = opts.actual;
    this.lineNumber = opts.lineNumber;
  }
}

/**
 * Apply a unified diff patch to content.
 *
 * Validates context (` `) and deletion (`-`) lines against the actual file
 * contents and throws {@link PatchHunkError} on any mismatch so a stale or
 * wrong patch cannot silently corrupt the file.
 */
function applyPatchToContent(
  originalContent: string,
  patch: string,
  filePath: string = ''
): string {
  const lines = originalContent.split('\n');
  const patchLines = patch.split('\n');

  let lineIndex = 0;
  let hunkNumber = 0;
  const result: string[] = [];
  let i = 0;

  while (i < patchLines.length) {
    const line = patchLines[i];

    // Parse hunk header: @@ -start,count +start,count @@
    if (line.startsWith('@@')) {
      hunkNumber++;
      const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);
      if (match) {
        const oldStart = parseInt(match[1], 10) - 1; // Convert to 0-indexed

        // Copy unchanged lines before this hunk
        while (lineIndex < oldStart && lineIndex < lines.length) {
          result.push(lines[lineIndex]);
          lineIndex++;
        }
      }
      i++;
      continue;
    }

    // Context line (unchanged)
    if (line.startsWith(' ')) {
      const expected = line.slice(1);
      if (lineIndex >= lines.length) {
        throw new PatchHunkError({
          hunkNumber,
          filePath,
          expected,
          actual: '<EOF>',
          lineNumber: lineIndex + 1,
        });
      }
      const actual = lines[lineIndex];
      if (actual !== expected) {
        throw new PatchHunkError({
          hunkNumber,
          filePath,
          expected,
          actual,
          lineNumber: lineIndex + 1,
        });
      }
      result.push(actual);
      lineIndex++;
      i++;
      continue;
    }

    // Deletion line
    if (line.startsWith('-')) {
      const expected = line.slice(1);
      if (lineIndex >= lines.length) {
        throw new PatchHunkError({
          hunkNumber,
          filePath,
          expected,
          actual: '<EOF>',
          lineNumber: lineIndex + 1,
        });
      }
      const actual = lines[lineIndex];
      if (actual !== expected) {
        throw new PatchHunkError({
          hunkNumber,
          filePath,
          expected,
          actual,
          lineNumber: lineIndex + 1,
        });
      }
      // Skip this line in original
      lineIndex++;
      i++;
      continue;
    }

    // Addition line
    if (line.startsWith('+')) {
      result.push(line.slice(1));
      i++;
      continue;
    }

    i++;
  }

  // Copy any remaining lines
  while (lineIndex < lines.length) {
    result.push(lines[lineIndex]);
    lineIndex++;
  }

  return result.join('\n');
}

/**
 * Generate a simple diff summary
 */
function generateDiff(original: string, patched: string): string {
  const originalLines = original.split('\n');
  const patchedLines = patched.split('\n');

  const changes: string[] = [];
  const maxLines = Math.max(originalLines.length, patchedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const origLine = originalLines[i];
    const patchLine = patchedLines[i];

    if (origLine !== patchLine) {
      if (origLine !== undefined) {
        changes.push(`- ${origLine}`);
      }
      if (patchLine !== undefined) {
        changes.push(`+ ${patchLine}`);
      }
    }
  }

  return changes.join('\n');
}

export const applyPatchTool = defineTool<typeof ApplyPatchParamsSchema, ApplyPatchResult>({
  name: 'apply_patch',
  description: `Apply a unified diff patch to a file while preserving encoding.

Usage:
- Provide the file path and a unified diff patch
- The file's original encoding will be detected and preserved
- Returns a diff showing what changed`,

  parameters: ApplyPatchParamsSchema,

  permission: {
    action: 'write',
    getResource: (params) => params.path,
  },

  async execute(params, context): Promise<ToolResult<ApplyPatchResult>> {
    const filePath = path.isAbsolute(params.path)
      ? params.path
      : path.join(context.workdir, params.path);

    try {
      // Validate patch format before applying
      if (!params.patch || typeof params.patch !== 'string') {
        return {
          success: false,
          error: 'Invalid patch: must be a non-empty string',
        };
      }

      // Check if target file exists
      try {
        await fs.access(filePath);
      } catch {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      // Fast path: sample the first 8 KiB to classify the file's line
      // ending convention (LF / CRLF / mixed). This drives whether we
      // preserve CRLF on write; the full-content detection below is the
      // authoritative one for the majority-style decision.
      const sampledLineEnding = await detectLineEnding(filePath);

      // Read the original file as buffer
      const buffer = await fs.readFile(filePath);

      // Detect original file encoding
      const encoding = detectEncoding(buffer);

      // Decode with detected encoding
      const rawOriginalContent = decodeWithEncoding(buffer, encoding);

      // Detect line ending style BEFORE normalizing so we can preserve it.
      // Prefer the sampled result for pure LF / CRLF files; only fall
      // back to the majority-count logic when the sample says `mixed`,
      // which is where a decision has to be made about how to write the
      // file back out.
      const lineEndingStyle: LineEndingStyle =
        sampledLineEnding === 'CRLF'
          ? 'crlf'
          : sampledLineEnding === 'LF'
            ? 'lf'
            : // mixed: rely on the majority-of-file heuristic so we
              // don't flip a CRLF-dominated file to LF or vice-versa.
              detectLineEndingStyle(rawOriginalContent);

      // Normalize file + patch to LF for parsing. The patch parser is
      // line-based on '\n' and would treat trailing '\r' as content.
      const originalContent = normalizeToLf(rawOriginalContent);
      const normalizedPatch = normalizeToLf(params.patch);

      // Apply patch (may throw PatchHunkError before any file write)
      let patchedContent: string;
      try {
        patchedContent = applyPatchToContent(originalContent, normalizedPatch, filePath);
      } catch (err) {
        if (err instanceof PatchHunkError) {
          return {
            success: false,
            error:
              `Patch hunk ${err.hunkNumber} failed at line ${err.lineNumber}: ` +
              `expected ${JSON.stringify(err.expected)}, got ${JSON.stringify(err.actual)}`,
          };
        }
        throw err;
      }

      // Re-encode line endings to the original style before writing so
      // Windows files keep CRLF and Unix files keep LF.
      const contentToWrite = applyLineEndingStyle(patchedContent, lineEndingStyle);

      // Encode back with original encoding
      const encodedBuffer = encodeWithEncoding(contentToWrite, encoding);

      // Write back to file
      await fs.writeFile(filePath, encodedBuffer);

      // Generate diff for display (in UTF-8)
      const diff = generateDiff(originalContent, patchedContent);

      const originalLines = originalContent.split('\n').length;
      const patchedLines = patchedContent.split('\n').length;
      const linesChanged = Math.abs(patchedLines - originalLines);

      // Construct the result payload defensively — only include fields
      // whose values are defined so the payload stays JSON-encodable and
      // does not leak `undefined` into downstream permission / event
      // buses. Ports upstream kilocode f7da00f (`apply_patch`: guard
      // permission metadata against `movePath: undefined`).
      const data: ApplyPatchResult = {
        path: filePath,
        diff,
        linesChanged,
      };

      return {
        success: true,
        data,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      if (message.includes('EACCES')) {
        return {
          success: false,
          error: `Permission denied: ${filePath}`,
        };
      }

      return {
        success: false,
        error: `Failed to apply patch: ${message}`,
      };
    }
  },
});
