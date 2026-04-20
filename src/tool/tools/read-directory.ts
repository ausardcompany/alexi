/**
 * Read Directory Tool - List directory contents
 * Based on kilocode/opencode read_directory tool
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

const ReadDirectoryParamsSchema = z.object({
  path: z.string().describe('Directory path to read'),
  recursive: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to read recursively into subdirectories'),
  maxDepth: z
    .number()
    .optional()
    .default(3)
    .describe('Maximum depth for recursive reads (default: 3)'),
});

interface DirectoryEntry {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'symlink' | 'other';
  size?: number;
  modified?: Date;
}

interface ReadDirectoryResult {
  path: string;
  entries: DirectoryEntry[];
  count: number;
  truncated?: boolean;
}

const MAX_ENTRIES = 1000;

async function readDirectoryRecursive(
  dirPath: string,
  currentDepth: number,
  maxDepth: number,
  entries: DirectoryEntry[]
): Promise<void> {
  if (currentDepth >= maxDepth || entries.length >= MAX_ENTRIES) {
    return;
  }

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (entries.length >= MAX_ENTRIES) {
        break;
      }

      const itemPath = path.join(dirPath, item.name);
      const stats = await fs.stat(itemPath).catch(() => null);

      let type: DirectoryEntry['type'] = 'other';
      if (item.isFile()) type = 'file';
      else if (item.isDirectory()) type = 'directory';
      else if (item.isSymbolicLink()) type = 'symlink';

      entries.push({
        name: item.name,
        path: itemPath,
        type,
        size: stats?.size,
        modified: stats?.mtime,
      });

      // Recurse into subdirectories
      if (item.isDirectory()) {
        await readDirectoryRecursive(itemPath, currentDepth + 1, maxDepth, entries);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
}

export const readDirectoryTool = defineTool<
  typeof ReadDirectoryParamsSchema,
  ReadDirectoryResult
>({
  name: 'read_directory',
  description: `List contents of a directory with optional recursive traversal.

Returns file and directory entries with metadata (name, type, size, modified date).
Useful for exploring project structure or finding files.

Examples:
- List files in current directory: { "path": "." }
- Recursively list up to 2 levels: { "path": "./src", "recursive": true, "maxDepth": 2 }`,

  parameters: ReadDirectoryParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.path,
  },

  async execute(params, context): Promise<ToolResult<ReadDirectoryResult>> {
    const dirPath = path.isAbsolute(params.path)
      ? params.path
      : path.join(context.workdir, params.path);

    try {
      // Check if path exists and is a directory
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return {
          success: false,
          error: `Path is not a directory: ${dirPath}`,
        };
      }

      const entries: DirectoryEntry[] = [];

      if (params.recursive) {
        await readDirectoryRecursive(dirPath, 0, params.maxDepth ?? 3, entries);
      } else {
        // Non-recursive read
        const items = await fs.readdir(dirPath, { withFileTypes: true });

        for (const item of items) {
          if (entries.length >= MAX_ENTRIES) {
            break;
          }

          const itemPath = path.join(dirPath, item.name);
          const itemStats = await fs.stat(itemPath).catch(() => null);

          let type: DirectoryEntry['type'] = 'other';
          if (item.isFile()) type = 'file';
          else if (item.isDirectory()) type = 'directory';
          else if (item.isSymbolicLink()) type = 'symlink';

          entries.push({
            name: item.name,
            path: itemPath,
            type,
            size: itemStats?.size,
            modified: itemStats?.mtime,
          });
        }
      }

      const truncated = entries.length >= MAX_ENTRIES;

      return {
        success: true,
        data: {
          path: dirPath,
          entries,
          count: entries.length,
          truncated,
        },
        truncated,
        hint: truncated
          ? `Output truncated to ${MAX_ENTRIES} entries. Consider using more specific paths or filters.`
          : undefined,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `Directory not found: ${dirPath}`,
        };
      }

      if (message.includes('EACCES') || message.includes('EPERM')) {
        return {
          success: false,
          error: `Permission denied: ${dirPath}`,
        };
      }

      return {
        success: false,
        error: message,
      };
    }
  },
});
