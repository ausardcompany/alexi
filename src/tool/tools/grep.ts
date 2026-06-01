/**
 * Grep Tool - Search file contents using regex
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { getReferenceService } from '../../reference/reference.js';
import { instructionsForPath } from '../../agent/system.js';

const GrepParamsSchema = z.object({
  pattern: z.string().describe('Regex pattern to search for'),
  path: z.string().optional().describe('Directory to search in (defaults to workdir)'),
  include: z.string().optional().describe("File pattern to include (e.g., '*.ts', '*.{js,jsx}')"),
});

interface GrepMatch {
  file: string;
  line: number;
  content: string;
}

interface GrepResult {
  matches: GrepMatch[];
  filesSearched: number;
  totalMatches: number;
}

/**
 * Check if filename matches include pattern
 */
function matchesInclude(filename: string, include?: string): boolean {
  if (!include) return true;

  // Handle {a,b} alternatives
  const patterns = include.replace(/\{([^}]+)\}/g, (_, group) => {
    return `(${group.split(',').join('|')})`;
  });

  const regex = new RegExp(
    '^' +
      patterns
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\|/g, '|')
        .replace(/\*/g, '.*') +
      '$'
  );

  return regex.test(filename);
}

/**
 * Recursively find files
 */
async function findFiles(
  dir: string,
  include?: string,
  maxFiles = 10000,
  signal?: AbortSignal
): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    if (files.length >= maxFiles) return;

    // Check for abort signal
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (files.length >= maxFiles) break;

        // Check abort signal in loop
        if (signal?.aborted) {
          throw new Error('Operation aborted');
        }

        const fullPath = path.join(currentDir, entry.name);

        // Skip hidden directories and node_modules
        if (entry.isDirectory()) {
          if (
            entry.name.startsWith('.') ||
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === 'build'
          ) {
            continue;
          }
          await walk(fullPath);
        } else if (matchesInclude(entry.name, include)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  await walk(dir);
  return files;
}

export const grepTool = defineTool<typeof GrepParamsSchema, GrepResult>({
  name: 'grep',
  description: `Search file contents using regular expressions.

Usage:
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files by pattern with include (e.g., "*.js", "*.{ts,tsx}")
- Returns file paths and line numbers with at least one match
- Results are sorted by modification time
- When you are doing an open-ended search where you do not know the exact symbol name, use the \`codebase_search\` tool first to narrow down the search scope, then follow up with \`grep\` and/or \`read\``,

  parameters: GrepParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.path ?? '.',
  },

  async execute(params, context): Promise<ToolResult<GrepResult>> {
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

      const regex = new RegExp(params.pattern);
      const files = await findFiles(searchPath, params.include, 10000, context.signal);
      const matches: GrepMatch[] = [];

      for (const file of files) {
        // Check abort signal between files
        if (context.signal?.aborted) {
          return {
            success: false,
            error: 'Operation aborted',
          };
        }

        try {
          const content = await fs.readFile(file, 'utf-8');
          const lines = content.split('\n');

          for (let i = 0; i < lines.length; i++) {
            if (regex.test(lines[i])) {
              matches.push({
                file: path.relative(searchPath, file),
                line: i + 1,
                content: lines[i].slice(0, 200), // Limit line length
              });
            }
          }
        } catch {
          // Skip files that can't be read
        }
      }

      // Sort by file modification time
      const filesWithMatches = [...new Set(matches.map((m) => m.file))];
      const fileStats = await Promise.all(
        filesWithMatches.map(async (f) => {
          try {
            const fullPath = path.join(searchPath, f);
            const stat = await fs.stat(fullPath);
            return { file: f, mtime: stat.mtimeMs };
          } catch {
            return { file: f, mtime: 0 };
          }
        })
      );

      fileStats.sort((a, b) => b.mtime - a.mtime);
      const sortOrder = new Map(fileStats.map((f, i) => [f.file, i]));

      matches.sort((a, b) => {
        const orderA = sortOrder.get(a.file) ?? 999999;
        const orderB = sortOrder.get(b.file) ?? 999999;
        if (orderA !== orderB) return orderA - orderB;
        return a.line - b.line;
      });

      // Limit total matches
      const limitedMatches = matches.slice(0, 1000);

      const grepResult: ToolResult<GrepResult> = {
        success: true,
        data: {
          matches: limitedMatches,
          filesSearched: files.length,
          totalMatches: matches.length,
        },
        truncated: matches.length > 1000,
        hint:
          matches.length > 1000
            ? `Showing first 1000 of ${matches.length} matches. Narrow your search.`
            : undefined,
      };

      // Per-directory AGENTS.md reminders — for each unique file in the
      // returned matches, walk parent directories looking for AGENTS.md.
      // The shared `agentsMdSeen` set guarantees one reminder per unique
      // AGENTS.md per session, even if many matches live under the same
      // subtree. Mirror read.ts:55-76.
      if (context.agentsMdSeen) {
        const uniqueFiles = new Set<string>();
        for (const m of limitedMatches) {
          // m.file is relative to searchPath; rebuild absolute path.
          uniqueFiles.add(path.join(searchPath, m.file));
        }
        const allReminders: { source: string; content: string }[] = [];
        for (const absFile of uniqueFiles) {
          const reminders = instructionsForPath(absFile, context.workdir, context.agentsMdSeen);
          for (const r of reminders) {
            allReminders.push({
              source: path.relative(context.workdir, r.path),
              content: r.content,
            });
          }
        }
        if (allReminders.length > 0) {
          grepResult.metadata = {
            ...(grepResult.metadata ?? {}),
            systemReminders: allReminders,
          };
        }
      }

      return grepResult;
    } catch (err) {
      if (err instanceof SyntaxError) {
        return {
          success: false,
          error: `Invalid regex pattern: ${err.message}`,
        };
      }
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});
