/**
 * Read Tool - Read files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, truncateOutput, MAX_LINES, type ToolResult } from '../index.js';

// Exported utilities for line-based file reading
export interface LinesOptions {
  limit?: number;
  offset?: number;
}

export interface LinesResult {
  raw: string[];
  cut: boolean;
  more: boolean;
}

/**
 * Read lines from a file with offset and limit support
 */
export async function lines(filepath: string, options?: LinesOptions): Promise<LinesResult> {
  const limit = options?.limit ?? 1000;
  const offset = options?.offset ?? 1;

  const content = await fs.readFile(filepath, 'utf-8');
  const allLines = content.split('\n');
  const startIndex = Math.max(0, offset - 1);
  const endIndex = Math.min(startIndex + limit, allLines.length);

  const raw = allLines.slice(startIndex, endIndex);
  const cut = startIndex > 0;
  const more = endIndex < allLines.length;

  return { raw, cut, more };
}

/**
 * Check if a file is binary by reading the first bytes
 */
export async function isBinaryFile(filepath: string, size: number): Promise<boolean> {
  if (size === 0) return false;
  if (size > 10 * 1024 * 1024) return true; // Files > 10MB treated as binary

  const buffer = Buffer.alloc(Math.min(8000, size));
  const fd = await fs.open(filepath, 'r');
  try {
    await fd.read(buffer, 0, buffer.length, 0);
    // Check for null bytes which indicate binary content
    return buffer.includes(0);
  } finally {
    await fd.close();
  }
}

const ReadParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file or directory to read'),
  offset: z.number().optional().describe('Line number to start from (1-indexed)'),
  limit: z.number().optional().describe('Maximum number of lines to read (default: 2000)'),
});

interface ReadFileResult {
  type: 'file';
  path: string;
  content: string;
  totalLines: number;
  shownLines: number;
  offset: number;
}

interface ReadDirResult {
  type: 'directory';
  path: string;
  entries: string;
}

type ReadResult = ReadFileResult | ReadDirResult;

export const readTool = defineTool<typeof ReadParamsSchema, ReadResult>({
  name: 'read',
  description: `Read a file or directory from the local filesystem. Returns contents with line numbers.
  
Usage:
- The filePath parameter should be an absolute path.
- By default, returns up to 2000 lines from the start of the file.
- Use offset to read from a specific line.
- For directories, returns a list of entries.
- Lines are prefixed with line numbers like "1: content".`,

  parameters: ReadParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.filePath,
  },

  async execute(params, context): Promise<ToolResult<ReadResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        // Read directory
        const entries = await fs.readdir(filePath, { withFileTypes: true });
        const formatted = entries
          .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
          .sort()
          .join('\n');

        return {
          success: true,
          data: {
            type: 'directory',
            path: filePath,
            entries: formatted,
          },
        };
      }

      // Read file
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const totalLines = lines.length;

      const offset = Math.max(1, params.offset ?? 1);
      const limit = params.limit ?? MAX_LINES;

      // Extract requested lines
      const startIdx = offset - 1;
      const endIdx = Math.min(startIdx + limit, lines.length);
      const selectedLines = lines.slice(startIdx, endIdx);

      // Add line numbers
      const numberedLines = selectedLines.map((line, i) => `${startIdx + i + 1}: ${line}`);

      const output = numberedLines.join('\n');
      const { content: truncated, truncated: wasTruncated } = truncateOutput(output);

      return {
        success: true,
        data: {
          type: 'file',
          path: filePath,
          content: truncated,
          totalLines,
          shownLines: selectedLines.length,
          offset,
        },
        truncated: wasTruncated,
        hint: wasTruncated
          ? `Output truncated. Use offset=${endIdx + 1} to continue reading.`
          : undefined,
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
