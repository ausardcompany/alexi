/**
 * MultiEdit Tool - Apply multiple string replacements in a single file atomically
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

const EditItemSchema = z.object({
  oldString: z.string().describe('The text to replace'),
  newString: z.string().describe('The text to replace it with'),
});

const MultiEditParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file to modify'),
  edits: z.array(EditItemSchema).min(1).describe('Array of edits to apply in order'),
});

interface MultiEditResult {
  filePath: string;
  editsApplied: number;
  changes: Array<{
    oldString: string;
    newString: string;
    lineNumber: number;
  }>;
}

/**
 * Find the line number where a string starts in the content
 */
function findLineNumber(content: string, searchString: string): number {
  const index = content.indexOf(searchString);
  if (index === -1) return -1;

  // Count newlines before the match
  const beforeMatch = content.substring(0, index);
  const lineNumber = beforeMatch.split('\n').length;
  return lineNumber;
}

/**
 * Normalize line endings (CRLF -> LF)
 */
function normalizeLineEndings(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

/**
 * Truncate string for error messages
 */
function truncateForError(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

export const multieditTool = defineTool<typeof MultiEditParamsSchema, MultiEditResult>({
  name: 'multiedit',
  description: `Apply multiple string replacements in a single file atomically.

Usage:
- All edits must pass validation before any changes are made.
- Each oldString must exist exactly once in the file.
- Edits are applied in order, so later edits see the result of earlier ones.
- Line endings are normalized (CRLF -> LF) before processing.`,

  parameters: MultiEditParamsSchema,

  permission: {
    action: 'write',
    getResource: (params) => params.filePath,
  },

  async execute(params, context): Promise<ToolResult<MultiEditResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Read existing file
      let content = await fs.readFile(filePath, 'utf-8');

      // Normalize line endings
      content = normalizeLineEndings(content);

      // Also normalize line endings in the edit strings
      const normalizedEdits = params.edits.map((edit) => ({
        oldString: normalizeLineEndings(edit.oldString),
        newString: normalizeLineEndings(edit.newString),
      }));

      // Validation phase: Check ALL oldStrings exist exactly once before making any changes
      for (let i = 0; i < normalizedEdits.length; i++) {
        const edit = normalizedEdits[i];
        const matches = content.split(edit.oldString).length - 1;

        if (matches === 0) {
          return {
            success: false,
            error: `Edit ${i + 1}: String not found: '${truncateForError(edit.oldString)}'`,
          };
        }

        if (matches > 1) {
          return {
            success: false,
            error: `Edit ${i + 1}: String found ${matches} times, expected exactly 1`,
          };
        }
      }

      // Application phase: Apply all edits in order
      const changes: Array<{
        oldString: string;
        newString: string;
        lineNumber: number;
      }> = [];

      for (const edit of normalizedEdits) {
        const lineNumber = findLineNumber(content, edit.oldString);

        // Apply the replacement
        content = content.replace(edit.oldString, edit.newString);

        changes.push({
          oldString: edit.oldString,
          newString: edit.newString,
          lineNumber,
        });
      }

      // Write the file
      await fs.writeFile(filePath, content, 'utf-8');

      // Check for empty file warning
      const result: ToolResult<MultiEditResult> = {
        success: true,
        data: {
          filePath,
          editsApplied: changes.length,
          changes,
        },
      };

      if (content.trim() === '') {
        result.hint = 'Warning: File became empty after edits';
      }

      context.gitManager?.onFileChanged(filePath, 'multiedit', `${changes.length} edit(s) applied`);

      return result;
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
        error: message,
      };
    }
  },
});
