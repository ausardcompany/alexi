/**
 * Glob Tool - Find files by pattern matching
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { getReferenceService } from '../../reference/reference.js';
import { getConfigAdditionalExtensions } from '../../config/userConfig.js';

const GlobParamsSchema = z.object({
  pattern: z.string().describe("Glob pattern to match files (e.g., '**/*.ts')"),
  path: z.string().optional().describe('Directory to search in (defaults to workdir)'),
});

interface GlobResult {
  matches: string[];
  count: number;
}

/**
 * Extend a glob pattern's last segment to include additional file
 * extensions from the user config. Only the final path segment is
 * touched so directory portions (`src/**`) are preserved.
 *
 * Recognized last-segment shapes (matching the grep include merger):
 *   - `*.ts`         -> `*.{ts,proto}`
 *   - `*.{ts,tsx}`   -> `*.{ts,tsx,proto}`
 *   - anything else  -> returned unchanged (no safe way to inject
 *                       alternates without changing semantics).
 *
 * When `additionalExtensions` is empty, the pattern is returned as-is.
 */
export function extendGlobPattern(pattern: string, additionalExtensions: string[]): string {
  if (additionalExtensions.length === 0) {
    return pattern;
  }
  const idx = pattern.lastIndexOf('/');
  const prefix = idx === -1 ? '' : pattern.slice(0, idx + 1);
  const last = idx === -1 ? pattern : pattern.slice(idx + 1);
  const bare = additionalExtensions.map((e) => (e.startsWith('.') ? e.slice(1) : e).toLowerCase());

  const singleExt = /^\*\.([A-Za-z0-9_-]+)$/.exec(last);
  if (singleExt) {
    const merged = uniqueLower([singleExt[1], ...bare]);
    return `${prefix}${merged.length === 1 ? `*.${merged[0]}` : `*.{${merged.join(',')}}`}`;
  }

  const groupExt = /^\*\.\{([^{}]+)\}$/.exec(last);
  if (groupExt) {
    const parts = groupExt[1]
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const merged = uniqueLower([...parts, ...bare]);
    return `${prefix}*.{${merged.join(',')}}`;
  }

  return pattern;
}

function uniqueLower(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const lower = v.toLowerCase();
    if (seen.has(lower)) {
      continue;
    }
    seen.add(lower);
    out.push(lower);
  }
  return out;
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

    // Expand `{a,b,c}` alternates first so that patterns like
    // `*.{ts,proto}` (used by indexing.additionalExtensions) match. We
    // capture the group with a non-greedy inner class before escaping.
    const expanded = pattern.replace(/\{([^{}]+)\}/g, (_, group: string) => {
      const opts = group.split(',').map((s) => s.trim());
      return `(${opts.join('|')})`;
    });

    // Convert glob pattern to regex. Escape regex specials, then
    // restore the `(a|b)` groups we produced above.
    const regex = new RegExp(
      '^' +
        expanded
          .replace(/[.+^${}[\]\\]/g, '\\$&')
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
- When you are doing an open-ended search where you do not know the exact symbol name, use the \`codebase_search\` tool first to narrow down the search scope, then follow up with \`glob\` and/or \`read\`

When independent reads, searches, or edits are also needed, emit those tool calls in the same response instead of splitting across turns.`,

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

      // Extend the caller's pattern with any additional extensions
      // configured via `indexing.additionalExtensions`. Only the last
      // segment is touched (e.g. `**/*.ts` -> `**/*.{ts,proto}`), so
      // directory scoping is preserved. Patterns whose last segment is
      // not a recognized extension shape (e.g. exact filenames) pass
      // through unchanged.
      const additionalExtensions = getConfigAdditionalExtensions();
      const effectivePattern = extendGlobPattern(params.pattern, additionalExtensions);

      let matches = await globMatch(searchPath, effectivePattern, context.signal);

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
