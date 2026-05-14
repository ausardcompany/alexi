/**
 * Read Tool - Read files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import * as path from 'path';
import { defineTool, truncateOutput, MAX_LINES, type ToolResult } from '../index.js';
import {
  detectEncoding,
  decodeWithEncoding,
  isBinaryFile,
  type EncodingInfo,
} from '../encoded-io.js';
import { getReferenceService } from '../../reference/reference.js';

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

// Store encoding info for later write operations
const fileEncodings = new Map<string, EncodingInfo>();

export function getFileEncoding(filePath: string): EncodingInfo | undefined {
  return fileEncodings.get(filePath);
}

/**
 * Read file with streaming for better UTF-8 handling and memory efficiency.
 * Destroys the stream early when the byte cap is reached to avoid reading
 * entire large files into memory.
 */
async function readFileStreaming(filePath: string): Promise<Buffer> {
  const MAX_READ_BYTES = 102400; // 100KB cap — generous for 50KB output limit
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let resolved = false;
    const stream = createReadStream(filePath, { encoding: undefined });

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
      totalBytes += chunk.length;
      if (totalBytes >= MAX_READ_BYTES) {
        stream.destroy();
      }
    });

    stream.on('end', () => {
      if (!resolved) {
        resolved = true;
        resolve(Buffer.concat(chunks));
      }
    });

    stream.on('close', () => {
      if (!resolved) {
        resolved = true;
        resolve(Buffer.concat(chunks));
      }
    });

    stream.on('error', (err) => {
      if (!stream.destroyed) {
        reject(err);
      } else if (!resolved) {
        // Stream was destroyed by us (byte cap reached), resolve with collected data
        resolved = true;
        resolve(Buffer.concat(chunks));
      }
    });
  });
}

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
    getResource: (params, context) => {
      // Return worktree-relative path for permission pattern matching
      // This prevents permission bypass with absolute paths
      const absolutePath = path.isAbsolute(params.filePath)
        ? params.filePath
        : path.join(context?.workdir || process.cwd(), params.filePath);
      const workdir = context?.workdir || process.cwd();
      return path.relative(workdir, absolutePath);
    },
  },

  async execute(params, context): Promise<ToolResult<ReadResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Ensure reference is materialized for reference paths
      const referenceService = getReferenceService();
      if (referenceService) {
        await referenceService.ensure(path.dirname(filePath));
      }

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
      // Use streaming for better UTF-8 handling
      const buffer = await readFileStreaming(filePath);

      // Check for binary first
      if (isBinaryFile(buffer)) {
        return {
          success: false,
          error: `Cannot read binary file: ${filePath}`,
        };
      }

      // Detect and decode with proper encoding
      const encoding = detectEncoding(buffer);
      const content = decodeWithEncoding(buffer, encoding);

      // Cache encoding for write operations
      fileEncodings.set(filePath, encoding);

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
