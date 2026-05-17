/**
 * Glob Tool - Find files by pattern matching
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { getReferenceService } from '../../reference/reference.js';

const GlobParamsSchema = z.object({
  pattern: z.string().describe("Glob pattern to match files (e.g., '**/*.ts')"),
  path: z.string().optional().describe('Directory to search in (defaults to workdir)'),
});

interface GlobResult {
  matches: string[];
  count: number;
}

/**
 * Simple glob implementation supporting ** and *
 */
async function globMatch(
  baseDir: string,
  pattern: string,
  signal?: AbortSignal
): Promise<string[]> {
  const matches: string[] = [];
  const parts = pattern.split('/');

  async function walk(dir: string, partIndex: number): Promise<void> {
    // Check for abort signal
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    if (partIndex >= parts.length) return;

    const part = parts[partIndex];
    const isLast = partIndex === parts.length - 1;

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        // Check abort signal in loop
        if (signal?.aborted) {
          throw new Error('Operation aborted');
        }

        const fullPath = path.join(dir, entry.name);

        if (part === '**') {
          // Match any depth
          if (entry.isDirectory()) {
            // Continue searching in subdirectory with same ** pattern
            await walk(fullPath, partIndex);
            // Also try next pattern part
            if (!isLast) {
              await walk(fullPath, partIndex + 1);
            }
          }
          // Try matching the next part with current entry
          if (!isLast) {
            const nextPart = parts[partIndex + 1];
            if (matchPart(entry.name, nextPart)) {
              if (partIndex + 1 === parts.length - 1) {
                if (!entry.isDirectory() || nextPart.endsWith('/')) {
                  matches.push(fullPath);
                }
              } else if (entry.isDirectory()) {
                await walk(fullPath, partIndex + 2);
              }
            }
          }
        } else if (matchPart(entry.name, part)) {
          if (isLast) {
            matches.push(fullPath);
          } else if (entry.isDirectory()) {
            await walk(fullPath, partIndex + 1);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  function matchPart(name: string, pattern: string): boolean {
    if (pattern === '*') return true;

    // Convert glob pattern to regex
    const regex = new RegExp(
      '^' +
        pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.') +
        '$'
    );
    return regex.test(name);
  }

  await walk(baseDir, 0);
  return matches;
}

export const globTool = defineTool<typeof GlobParamsSchema, GlobResult>({
  name: 'glob',
  description: `Find files matching a glob pattern.

Usage:
- Supports patterns like "**/*.ts", "src/**/*.js"
- Returns matching file paths sorted by modification time
- Use this when searching for files by name patterns
- When you are doing an open-ended search where you do not know the exact symbol name, use the \`codebase_search\` tool first to narrow down the search scope, then follow up with \`glob\` and/or \`read\``,

  parameters: GlobParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.path ?? '.',
  },

  async execute(params, context): Promise<ToolResult<GlobResult>> {
    const searchPath = params.path
      ? path.isAbsolute(params.path)
        ? params.path
        : path.join(context.workdir, params.path)
      : context.workdir;

    try {
      // Check for abort before starting
      if (context.signal?.aborted) {
        return {
          success: false,
          error: 'Operation aborted',
        };
      }

      // Ensure reference is materialized if this is a reference path
      const referenceService = getReferenceService();
      if (referenceService) {
        await referenceService.ensure(searchPath);
      }

      // Validate that searchPath is a directory, not a file
      try {
        const stat = await fs.stat(searchPath);
        if (!stat.isDirectory()) {
          return {
            success: false,
            error: `glob path must be a directory, not a file: ${searchPath}`,
          };
        }
      } catch (err) {
        return {
          success: false,
          error: `Cannot access path: ${err instanceof Error ? err.message : String(err)}`,
        };
      }

      let matches = await globMatch(searchPath, params.pattern, context.signal);

      // Sort by modification time (most recent first)
      const withStats = await Promise.all(
        matches.map(async (f) => {
          try {
            const stat = await fs.stat(f);
            return { path: f, mtime: stat.mtimeMs };
          } catch {
            return { path: f, mtime: 0 };
          }
        })
      );

      withStats.sort((a, b) => b.mtime - a.mtime);
      matches = withStats.map((f) => f.path);

      // Convert to relative paths
      const relativePaths = matches.map((f) => path.relative(searchPath, f));

      return {
        success: true,
        data: {
          matches: relativePaths,
          count: matches.length,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});
