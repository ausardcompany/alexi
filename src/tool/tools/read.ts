/**
 * Read Tool - Read files or directories with encoding-aware streaming
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
 * Size threshold for streaming reads (1MB).
 * Files larger than this are streamed in chunks.
 */
const STREAM_THRESHOLD = 1024 * 1024;

/**
 * Read file as a buffer using streaming for large files.
 * For files under STREAM_THRESHOLD, reads entirely into memory.
 * For larger files, streams chunks to avoid high memory usage.
 */
async function readFileBuffer(filePath: string, fileSize: number): Promise<Buffer> {
  if (fileSize <= STREAM_THRESHOLD) {
    // Small files: read all at once
    return fs.readFile(filePath);
  }

  // Large files: stream in chunks
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = createReadStream(filePath);

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', (err) => {
      stream.destroy();
      reject(err);
    });
  });
}

/**
 * Stream a file and return only the requested lines (offset/limit).
 * Converts from detected encoding to UTF-8 during streaming.
 * This avoids loading and splitting the entire file when only a portion is needed.
 */
async function streamFileLines(
  filePath: string,
  encoding: EncodingInfo,
  offset: number,
  limit: number
): Promise<{ lines: string[]; totalLines: number }> {
  return new Promise((resolve, reject) => {
    const lines: string[] = [];
    let currentLine = '';
    let lineCount = 0;
    let collected = 0;
    const startLine = offset; // 1-indexed
    const stream = createReadStream(filePath);
    let bomSkipped = false;

    stream.on('data', (chunk: Buffer) => {
      // For non-UTF-8 files, we need to decode the entire chunk properly
      // This handles the case where multi-byte chars span chunk boundaries
      let text: string;

      if (!bomSkipped && encoding.hasBOM && encoding.bomBytes) {
        chunk = chunk.slice(encoding.bomBytes.length);
        bomSkipped = true;
      } else if (!bomSkipped) {
        bomSkipped = true;
      }

      switch (encoding.encoding) {
        case 'utf-16le':
          text = chunk.toString('utf16le');
          break;
        case 'utf-16be': {
          // Swap bytes for BE -> LE conversion
          const swapped = Buffer.alloc(chunk.length);
          for (let i = 0; i < chunk.length - 1; i += 2) {
            swapped[i] = chunk[i + 1];
            swapped[i + 1] = chunk[i];
          }
          if (chunk.length % 2 !== 0) {
            swapped[chunk.length - 1] = chunk[chunk.length - 1];
          }
          text = swapped.toString('utf16le');
          break;
        }
        case 'latin1':
          text = chunk.toString('latin1');
          break;
        default:
          text = chunk.toString('utf-8');
          break;
      }

      for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') {
          lineCount++;
          if (lineCount >= startLine && collected < limit) {
            lines.push(currentLine);
            collected++;
          }
          currentLine = '';

          // If we've collected enough and only want a subset, we still need totalLines
          // So we keep reading to count, but stop collecting
        } else {
          currentLine += text[i];
        }
      }
    });

    stream.on('end', () => {
      // Handle last line (no trailing newline)
      lineCount++;
      if (lineCount >= startLine && collected < limit) {
        lines.push(currentLine);
      }
      resolve({ lines, totalLines: lineCount });
    });

    stream.on('error', (err) => {
      stream.destroy();
      reject(err);
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

      // Read file with streaming for large files
      const fileSize = stat.size;
      const buffer = await readFileBuffer(filePath, fileSize);

      // Check for binary first
      if (isBinaryFile(buffer)) {
        return {
          success: false,
          error: `Cannot read binary file: ${filePath}`,
        };
      }

      // Detect encoding from the buffer
      const encoding = detectEncoding(buffer);

      // Cache encoding for write operations
      fileEncodings.set(filePath, encoding);

      // For large files with offset/limit, use streaming to avoid full decode
      if (fileSize > STREAM_THRESHOLD && (params.offset || params.limit)) {
        const offset = Math.max(1, params.offset ?? 1);
        const limit = params.limit ?? MAX_LINES;

        const { lines: selectedLines, totalLines } = await streamFileLines(
          filePath,
          encoding,
          offset,
          limit
        );

        // Add line numbers
        const numberedLines = selectedLines.map((line, i) => `${offset + i}: ${line}`);
        const output = numberedLines.join('\n');
        const { content: truncated, truncated: wasTruncated } = truncateOutput(output);

        const endIdx = offset + selectedLines.length - 1;
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
      }

      // Decode with proper encoding to UTF-8
      const content = decodeWithEncoding(buffer, encoding);
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
