/**
 * Edit Tool - Perform exact string replacements in files
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { ConfigValidation } from '../../alexi/config-validation.js';

const EditParamsSchema = z.object({
  filePath: z
    .string()
    .describe('Path to the file to edit, relative to the project root or absolute'),
  oldString: z
    .string()
    .describe('The exact text to find and replace. Must match exactly including whitespace.'),
  newString: z.string().describe('The new text to replace the old text with'),
  replaceAll: z.boolean().optional().describe('Replace all occurrences (default: false)'),
  startLine: z
    .number()
    .optional()
    .describe('Optional: Starting line number hint for faster matching'),
  endLine: z.number().optional().describe('Optional: Ending line number hint for faster matching'),
});

interface EditResult {
  path: string;
  replacements: number;
  bytesChanged: number;
  startLine?: number;
  endLine?: number;
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
    getResource: (params, context) => {
      // Resolve relative paths to absolute using workdir
      if (path.isAbsolute(params.filePath)) {
        return params.filePath;
      }
      return path.join(context?.workdir || process.cwd(), params.filePath);
    },
  },

  async execute(params, context): Promise<ToolResult<EditResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Read existing file
      const content = await fs.readFile(filePath, 'utf-8');

      // Detect and preserve line endings
      const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
      const normalizeLineEndings = (text: string): string => text.replaceAll('\r\n', '\n');
      const convertToLineEnding = (text: string, ending: '\n' | '\r\n'): string => {
        if (ending === '\n') return text;
        return text.replaceAll('\n', '\r\n');
      };

      // Normalize parameters to match file's line ending style
      const oldString = convertToLineEnding(normalizeLineEndings(params.oldString), lineEnding);
      const newString = convertToLineEnding(normalizeLineEndings(params.newString), lineEnding);

      // Use line number hints if provided for faster matching
      let searchContent = content;
      if (params.startLine !== undefined && params.endLine !== undefined) {
        const lines = content.split(lineEnding);
        const startIdx = Math.max(0, params.startLine - 1);
        const endIdx = Math.min(lines.length, params.endLine);
        searchContent = lines.slice(startIdx, endIdx).join(lineEnding);
      }

      // Check for matches
      const matches = searchContent.split(oldString).length - 1;

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
        newContent = content.split(oldString).join(newString);
        replacements = matches;
      } else {
        newContent = content.replace(oldString, newString);
        replacements = 1;
      }

      // Write the file
      await fs.writeFile(filePath, newContent, 'utf-8');
      const bytesChanged = Math.abs(
        Buffer.byteLength(newContent, 'utf-8') - Buffer.byteLength(content, 'utf-8')
      );

      // Validate config files after changes
      const validationWarning = await ConfigValidation.check(filePath);

      // Calculate line numbers for the change
      let startLine: number | undefined;
      let endLine: number | undefined;
      if (params.startLine !== undefined && params.endLine !== undefined) {
        startLine = params.startLine;
        endLine = params.endLine;
      } else {
        // Try to find the line numbers of the first replacement
        const beforeReplacement = content.indexOf(oldString);
        if (beforeReplacement !== -1) {
          const beforeLines = content.substring(0, beforeReplacement).split(lineEnding);
          startLine = beforeLines.length;
          const replacementLines = oldString.split(lineEnding).length;
          endLine = startLine + replacementLines - 1;
        }
      }

      const toolResult = {
        success: true,
        data: {
          path: filePath,
          replacements,
          bytesChanged,
          startLine,
          endLine,
        },
        hint: validationWarning || undefined,
      };

      context.gitManager?.onFileChanged(filePath, 'edit', `${replacements} replacement(s)`);

      return toolResult;
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
