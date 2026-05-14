/**
 * Write Tool - Write or create files
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { encodeWithEncoding, type EncodingInfo } from '../encoded-io.js';
import { getFileEncoding } from './read.js';
import { resolveInside } from '../../utils/filesystem.js';

const WriteParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file to write'),
  content: z.string().describe('Content to write to the file'),
});

interface WriteResult {
  path: string;
  bytesWritten: number;
  created: boolean;
}

export const writeTool = defineTool<typeof WriteParamsSchema, WriteResult>({
  name: 'write',
  description: `Write content to a file. Creates the file if it doesn't exist, or overwrites if it does.

Usage:
- Use absolute paths
- Parent directories will be created if needed
- Prefer editing existing files over creating new ones`,

  parameters: WriteParamsSchema,

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

  async execute(params, context): Promise<ToolResult<WriteResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    // Symlink-safe path validation
    const pathCheck = await resolveInside(context.workdir, filePath);
    if (!pathCheck.safe) {
      return {
        success: false,
        error: `Path rejected: ${pathCheck.reason}`,
      };
    }

    try {
      // Check if file exists
      let exists = false;
      try {
        await fs.access(filePath);
        exists = true;
      } catch {
        // File doesn't exist
      }

      // Create parent directories if needed
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      // Get cached encoding from previous read, default to UTF-8
      const encoding: EncodingInfo = getFileEncoding(filePath) || {
        encoding: 'utf-8',
        confidence: 1,
        hasBOM: false,
      };

      // Handle UTF-8 BOM preservation
      // If content starts with U+FEFF and we already have BOM, don't double it
      let finalContent = params.content;
      if (
        encoding.hasBOM &&
        encoding.encoding === 'utf-8' &&
        params.content.charCodeAt(0) === 0xfeff
      ) {
        finalContent = params.content.slice(1);
      }

      // Encode with proper encoding
      const buffer = encodeWithEncoding(finalContent, encoding);

      // Write the file
      await fs.writeFile(filePath, buffer);
      const bytesWritten = buffer.length;

      const toolResult = {
        success: true,
        data: {
          path: filePath,
          bytesWritten,
          created: !exists,
        },
      };

      context.gitManager?.onFileChanged(
        filePath,
        'write',
        !exists ? 'created file' : 'overwrote file'
      );

      return toolResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

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
