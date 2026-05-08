/**
 * Read Tool - Read files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, truncateOutput, MAX_LINES, type ToolResult } from '../index.js';
import {
  detectEncoding,
  decodeWithEncoding,
  isBinaryFile,
  type EncodingInfo,
} from '../encoded-io.js';

// Supported image formats for reading
const SUPPORTED_IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'gif', 'webp'] as const;
const _SUPPORTED_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'] as const;

// Common image extensions (for detection)
const IMAGE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'tiff',
  'tif',
  'svg',
  'ico',
  'heic',
  'heif',
] as const;

function isSupportedImageFormat(filePath: string): boolean {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return SUPPORTED_IMAGE_FORMATS.includes(ext as any);
}

function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext as any);
}

const ReadParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file or directory to read'),
  offset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Line number to start from (0-indexed, default: 0)'),
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

      // Check if it's an image file
      if (isImageFile(filePath)) {
        if (!isSupportedImageFormat(filePath)) {
          return {
            success: false,
            error: `Unsupported image format. Supported formats: ${SUPPORTED_IMAGE_FORMATS.join(', ')}`,
          };
        }
        // For now, return error as we don't have image handling in place
        // In the future, this would return base64 encoded image data
        return {
          success: false,
          error: 'Image reading not yet implemented. Use supported formats: png, jpg, gif, webp',
        };
      }

      // Read file
      const buffer = await fs.readFile(filePath);

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

      // offset of 0 is now explicitly allowed
      const offset = Math.max(0, params.offset ?? 0);
      const limit = params.limit ?? MAX_LINES;

      // Extract requested lines
      const startIdx = offset;
      const endIdx = Math.min(startIdx + limit, lines.length);
      const selectedLines = lines.slice(startIdx, endIdx);

      // Add line numbers (1-indexed for display)
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
          offset: offset + 1, // Return 1-indexed offset for consistency
        },
        truncated: wasTruncated,
        hint: wasTruncated
          ? `Output truncated. Use offset=${endIdx} to continue reading.`
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
