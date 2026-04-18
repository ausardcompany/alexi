/**
 * Read Directory Tool - Read directory contents with file content aggregation
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { isBinaryFile, lines } from './read.js';

const LIMIT = 2000;
const CONCURRENCY = 8;

const ReadDirectoryParamsSchema = z.object({
  directoryPath: z.string().describe('Absolute path to the directory'),
  items: z.array(z.string()).describe('List of file names to read from the directory'),
});

export interface DirectoryFile {
  filepath: string;
  content: string;
}

interface ReadDirectoryResult {
  files: DirectoryFile[];
  totalFiles: number;
  skippedBinary: number;
  errors: number;
}

export const readDirectoryTool = defineTool<typeof ReadDirectoryParamsSchema, ReadDirectoryResult>({
  name: 'read_directory',
  description: `Read multiple files from a directory concurrently.

Usage:
- Provide the directory path and a list of file names to read
- Binary files are automatically skipped
- Files are truncated at ${LIMIT} lines
- Supports concurrent reading of up to ${CONCURRENCY} files`,

  parameters: ReadDirectoryParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.directoryPath,
  },

  async execute(params, context): Promise<ToolResult<ReadDirectoryResult>> {
    const directoryPath = path.isAbsolute(params.directoryPath)
      ? params.directoryPath
      : path.join(context.workdir, params.directoryPath);

    try {
      // Verify directory exists
      const stat = await fs.stat(directoryPath);
      if (!stat.isDirectory()) {
        return {
          success: false,
          error: `Not a directory: ${directoryPath}`,
        };
      }

      // Read directory entries to verify items exist
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      const entryMap = new Map(entries.map((e) => [e.name, e]));

      const files: DirectoryFile[] = [];
      let skippedBinary = 0;
      let errors = 0;

      // Process items in batches for concurrency control
      const batchSize = CONCURRENCY;
      for (let i = 0; i < params.items.length; i += batchSize) {
        const batch = params.items.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(async (item) => {
            // Skip directories
            if (item.endsWith('/')) {
              return null;
            }

            const entry = entryMap.get(item);
            if (!entry || !entry.isFile()) {
              return null;
            }

            const filePath = path.join(directoryPath, item);

            try {
              const fileStats = await fs.stat(filePath);

              // Check if binary
              const binary = await isBinaryFile(filePath, fileStats.size);
              if (binary) {
                skippedBinary++;
                return null;
              }

              // Read file content
              const fileLines = await lines(filePath, { limit: LIMIT, offset: 1 });

              const relativePath = path.relative(context.workdir, filePath).replace(/\\/g, '/');
              const note = fileLines.cut || fileLines.more ? '\n\n(File truncated)' : '';
              const content = `<file_content path="${relativePath}">\n${fileLines.raw.join('\n')}${note}\n</file_content>`;

              return {
                filepath: filePath,
                content,
              };
            } catch {
              errors++;
              return null;
            }
          })
        );

        // Collect successful results
        for (const result of results) {
          if (result.status === 'fulfilled' && result.value) {
            files.push(result.value);
          }
        }
      }

      return {
        success: true,
        data: {
          files,
          totalFiles: files.length,
          skippedBinary,
          errors,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Failed to read directory: ${message}`,
      };
    }
  },
});
