/**
 * Delete Tool - Delete files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

const DeleteParamsSchema = z.object({
  path: z.string().describe('File or directory to delete'),
  recursive: z.boolean().optional().describe('Allow recursive directory deletion'),
});

interface DeleteResult {
  deleted: boolean;
  path: string;
  type: 'file' | 'directory';
  itemsDeleted?: number;
}

/**
 * Count items recursively in a directory
 */
async function countItems(dirPath: string): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    count++;
    if (entry.isDirectory()) {
      count += await countItems(path.join(dirPath, entry.name));
    }
  }

  return count;
}

/**
 * Check if a path is protected and should not be deleted
 */
function checkProtectedPath(
  targetPath: string,
  workdir: string
): { protected: boolean; reason?: string } {
  // Normalize paths for comparison
  const normalizedTarget = path.normalize(targetPath);
  const normalizedWorkdir = path.normalize(workdir);

  // Check for path traversal with ..
  if (targetPath.includes('..')) {
    return { protected: true, reason: 'Path contains ".." which is not allowed' };
  }

  // Check if outside workdir
  const relativePath = path.relative(normalizedWorkdir, normalizedTarget);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return { protected: true, reason: 'Cannot delete outside workdir' };
  }

  // Check if trying to delete workdir itself
  if (normalizedTarget === normalizedWorkdir) {
    return { protected: true, reason: 'Cannot delete workdir itself' };
  }

  // Check if .git directory
  const pathParts = normalizedTarget.split(path.sep);
  if (pathParts.includes('.git')) {
    return { protected: true, reason: 'Cannot delete .git directory or its contents' };
  }

  return { protected: false };
}

export const deleteTool = defineTool<typeof DeleteParamsSchema, DeleteResult>({
  name: 'delete',
  description: `Delete a file or directory from the filesystem.

Usage:
- Use absolute paths or paths relative to workdir
- For non-empty directories, use recursive=true
- Cannot delete protected paths (.git, outside workdir, workdir itself)`,

  parameters: DeleteParamsSchema,

  permission: {
    action: 'write',
    getResource: (params) => params.path,
  },

  async execute(params, context): Promise<ToolResult<DeleteResult>> {
    // Check for path traversal in the original input before resolving
    if (params.path.includes('..')) {
      return {
        success: false,
        error: 'Cannot delete protected path: Path contains ".." which is not allowed',
      };
    }

    const targetPath = path.isAbsolute(params.path)
      ? params.path
      : path.join(context.workdir, params.path);

    // Security check for protected paths
    const protectionCheck = checkProtectedPath(targetPath, context.workdir);
    if (protectionCheck.protected) {
      return {
        success: false,
        error: `Cannot delete protected path: ${protectionCheck.reason}`,
      };
    }

    try {
      const stat = await fs.stat(targetPath);
      const isDirectory = stat.isDirectory();

      if (isDirectory) {
        // Check if directory is empty
        const entries = await fs.readdir(targetPath);
        const isEmpty = entries.length === 0;

        if (!isEmpty && params.recursive !== true) {
          return {
            success: false,
            error: 'Directory not empty. Use recursive=true to delete',
          };
        }

        let itemsDeleted: number | undefined;
        if (!isEmpty && params.recursive === true) {
          itemsDeleted = await countItems(targetPath);
        }

        // Delete directory
        if (isEmpty) {
          await fs.rmdir(targetPath);
        } else {
          await fs.rm(targetPath, { recursive: true });
        }

        context.gitManager?.onFileChanged(targetPath, 'delete', 'deleted directory');

        return {
          success: true,
          data: {
            deleted: true,
            path: targetPath,
            type: 'directory',
            itemsDeleted,
          },
        };
      }

      // Delete file
      await fs.unlink(targetPath);

      context.gitManager?.onFileChanged(targetPath, 'delete', 'deleted file');

      return {
        success: true,
        data: {
          deleted: true,
          path: targetPath,
          type: 'file',
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `File not found: ${targetPath}`,
        };
      }

      if (message.includes('EACCES')) {
        return {
          success: false,
          error: `Permission denied: ${targetPath}`,
        };
      }

      return {
        success: false,
        error: message,
      };
    }
  },
});
