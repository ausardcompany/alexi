/**
 * Edit Tool - Perform exact string replacements in files
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { attachAgentsMdReminders } from '../../agent/agentsMdReminders.js';

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
- Preserve exact indentation from the original file.

When independent reads, searches, or edits are also needed, emit those tool calls in the same response instead of splitting across turns.`,

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

      // Detect dominant line ending for this file. Upstream opencode
      // commit 0cb43477 (fix(core): preserve mixed line endings in edit tool)
      // taught the edit tool to recognise MIXED-EOL files and leave the
      // non-edited regions byte-identical. We mirror that here.
      //
      //   - 'lf'    => file uses only "\n"
      //   - 'crlf'  => file uses only "\r\n"
      //   - 'mixed' => file contains both "\n" and "\r\n"
      //
      // Previously any CRLF caused the whole file to be rewritten as CRLF,
      // which silently normalised mixed-EOL files written by Windows tools
      // under Git `core.autocrlf`. That broke downstream build/sign
      // pipelines in SAP enterprise codebases.
      const crlfCount = (content.match(/\r\n/g) ?? []).length;
      const lfOnlyCount = (content.match(/(?<!\r)\n/g) ?? []).length;
      // 'mixed' when both styles co-exist, 'crlf' when only CRLF, else 'lf'.
      // We derive the dominant line ending from this: for 'mixed' and 'lf'
      // we treat LF as dominant (keeps CRLF regions intact via the exact-
      // match fast path above), and for 'crlf' we treat CRLF as dominant.
      const isMixed = crlfCount > 0 && lfOnlyCount > 0;
      const dominantLineEnding: '\n' | '\r\n' = !isMixed && crlfCount > 0 ? '\r\n' : '\n';

      const normalizeLineEndings = (text: string): string => text.replaceAll('\r\n', '\n');
      const convertToLineEnding = (text: string, ending: '\n' | '\r\n'): string => {
        if (ending === '\n') return text;
        return text.replaceAll('\n', '\r\n');
      };

      // Fast path: if the oldString parameter already matches the file byte
      // for byte (same EOL style as the region it occupies), use it as-is.
      // This preserves whatever line endings the caller provided and avoids
      // any normalisation on write — critical for mixed-EOL files.
      if (content.includes(params.oldString)) {
        const exactMatches = content.split(params.oldString).length - 1;
        if (exactMatches === 1 || (exactMatches > 1 && params.replaceAll)) {
          const newContent = params.replaceAll
            ? content.split(params.oldString).join(params.newString)
            : content.replace(params.oldString, params.newString);
          await fs.writeFile(filePath, newContent, 'utf-8');
          const bytesChanged = Math.abs(
            Buffer.byteLength(newContent, 'utf-8') - Buffer.byteLength(content, 'utf-8')
          );
          const replacements = params.replaceAll ? exactMatches : 1;

          let startLine: number | undefined;
          let endLine: number | undefined;
          if (params.startLine !== undefined && params.endLine !== undefined) {
            startLine = params.startLine;
            endLine = params.endLine;
          } else {
            const beforeReplacement = content.indexOf(params.oldString);
            if (beforeReplacement !== -1) {
              // Count both CRLF and lone LF as a line break so mixed-EOL
              // files still report sensible line numbers.
              const prefix = content.substring(0, beforeReplacement);
              startLine = (prefix.match(/\r\n|\n/g) ?? []).length + 1;
              const spanLineBreaks = (params.oldString.match(/\r\n|\n/g) ?? []).length;
              endLine = startLine + spanLineBreaks;
            }
          }

          const toolResult: ToolResult<EditResult> = {
            success: true,
            data: {
              path: filePath,
              replacements,
              bytesChanged,
              startLine,
              endLine,
            },
          };

          attachAgentsMdReminders(toolResult, filePath, context);
          context.gitManager?.onFileChanged(filePath, 'edit', `${replacements} replacement(s)`);
          return toolResult;
        }
      }

      // Normalize parameters to match file's dominant line ending style.
      // This is the fallback path used when the caller passed an oldString
      // normalised to LF but the file is CRLF (or mixed, dominant CRLF).
      const oldString = convertToLineEnding(
        normalizeLineEndings(params.oldString),
        dominantLineEnding
      );
      const newString = convertToLineEnding(
        normalizeLineEndings(params.newString),
        dominantLineEnding
      );

      // Use line number hints if provided for faster matching
      let searchContent = content;
      if (params.startLine !== undefined && params.endLine !== undefined) {
        const lines = content.split(dominantLineEnding);
        const startIdx = Math.max(0, params.startLine - 1);
        const endIdx = Math.min(lines.length, params.endLine);
        searchContent = lines.slice(startIdx, endIdx).join(dominantLineEnding);
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
          const beforeLines = content.substring(0, beforeReplacement).split(dominantLineEnding);
          startLine = beforeLines.length;
          const replacementLines = oldString.split(dominantLineEnding).length;
          endLine = startLine + replacementLines - 1;
        }
      }

      const toolResult: ToolResult<EditResult> = {
        success: true,
        data: {
          path: filePath,
          replacements,
          bytesChanged,
          startLine,
          endLine,
        },
      };

      attachAgentsMdReminders(toolResult, filePath, context);

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
