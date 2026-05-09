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
 * Apply a unified diff patch to content
 */
function applyPatchToContent(originalContent: string, patch: string): string {
  const lines = originalContent.split('\n');
  const patchLines = patch.split('\n');

  let lineIndex = 0;
  const result: string[] = [];
  let i = 0;

  while (i < patchLines.length) {
    const line = patchLines[i];

    // Parse hunk header: @@ -start,count +start,count @@
    if (line.startsWith('@@')) {
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
      result.push(lines[lineIndex]);
      lineIndex++;
      i++;
      continue;
    }

    // Deletion line
    if (line.startsWith('-')) {
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
      // Read the original file as buffer
      const buffer = await fs.readFile(filePath);

      // Detect original file encoding
      const encoding = detectEncoding(buffer);

      // Decode with detected encoding
      const originalContent = decodeWithEncoding(buffer, encoding);

      // Apply patch
      const patchedContent = applyPatchToContent(originalContent, params.patch);

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
