/**
 * Edit Tool - Perform exact string replacements in files
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

const EditParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file to modify'),
  oldString: z.string().describe('The text to replace'),
  newString: z.string().describe('The text to replace it with'),
  replaceAll: z.boolean().optional().describe('Replace all occurrences (default: false)'),
});

interface EditResult {
  path: string;
  replacements: number;
  bytesChanged: number;
}

export const editTool = defineTool<typeof EditParamsSchema, EditResult>({
  name: 'edit',
  description: `Perform exact string replacements in files.

Usage:
- The edit will FAIL if oldString is not found in the file.
- The edit will FAIL if oldString matches multiple times (unless replaceAll is true).
- Use replaceAll: true to replace all occurrences.
- Preserve exact indentation from the original file.`,

  parameters: EditParamsSchema,

  permission: {
    action: 'write',
    getResource: (params) => params.filePath,
  },

  async execute(params, context): Promise<ToolResult<EditResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Read existing file
      const content = await fs.readFile(filePath, 'utf-8');

      // Check for matches
      const matches = content.split(params.oldString).length - 1;

      if (matches === 0) {
        return {
          success: false,
          error: 'oldString not found in content',
        };
      }

      if (matches > 1 && !params.replaceAll) {
        return {
          success: false,
          error: `Found ${matches} matches for oldString. Provide more surrounding lines in oldString to identify the correct match, or use replaceAll: true.`,
        };
      }

      // Perform replacement
      let newContent: string;
      let replacements: number;

      if (params.replaceAll) {
        newContent = content.split(params.oldString).join(params.newString);
        replacements = matches;
      } else {
        newContent = content.replace(params.oldString, params.newString);
        replacements = 1;
      }

      // Write the file
      await fs.writeFile(filePath, newContent, 'utf-8');
      const bytesChanged = Math.abs(
        Buffer.byteLength(newContent, 'utf-8') - Buffer.byteLength(content, 'utf-8')
      );

      return {
        success: true,
        data: {
          path: filePath,
          replacements,
          bytesChanged,
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
        error: message,
      };
    }
  },
});
