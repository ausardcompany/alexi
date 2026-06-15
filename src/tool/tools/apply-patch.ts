/**
 * Apply Patch Tool - Apply patches to files while preserving encoding
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { detectEncoding, decodeWithEncoding, encodeWithEncoding } from '../encoded-io.js';

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

      // Read the original file as buffer
      const buffer = await fs.readFile(filePath);

      // Detect original file encoding
      const encoding = detectEncoding(buffer);

      // Decode with detected encoding
      const originalContent = decodeWithEncoding(buffer, encoding);

      // Apply patch (may throw PatchHunkError before any file write)
      let patchedContent: string;
      try {
        patchedContent = applyPatchToContent(originalContent, params.patch, filePath);
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

      // Encode back with original encoding
      const encodedBuffer = encodeWithEncoding(patchedContent, encoding);

      // Write back to file
      await fs.writeFile(filePath, encodedBuffer);

      // Generate diff for display (in UTF-8)
      const diff = generateDiff(originalContent, patchedContent);

      const originalLines = originalContent.split('\n').length;
      const patchedLines = patchedContent.split('\n').length;
      const linesChanged = Math.abs(patchedLines - originalLines);

      return {
        success: true,
        data: {
          path: filePath,
          diff,
          linesChanged,
        },
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
