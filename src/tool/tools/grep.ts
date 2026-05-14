/**
 * Grep Tool - Search file contents using regex
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';
import { getReferenceService } from '../../reference/reference.js';
import { SearchDiagnostics } from './search-errors.js';

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
  warnings?: string;
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
  signal?: AbortSignal,
  diagnostics?: SearchDiagnostics
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
    } catch (err) {
      diagnostics?.addError({
        type: 'walk_error',
        message: err instanceof Error ? err.message : String(err),
        path: currentDir,
      });
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
- Results are sorted by modification time`,

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

      const diagnostics = new SearchDiagnostics();
      const regex = new RegExp(params.pattern);
      const files = await findFiles(searchPath, params.include, 10000, context.signal, diagnostics);
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
        } catch (err) {
          diagnostics.addError({
            type: 'permission_denied',
            message: err instanceof Error ? err.message : 'Cannot read file',
            path: path.relative(searchPath, file),
          });
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
      const warnings = diagnostics.hasErrors() ? diagnostics.getSummary() : undefined;

      return {
        success: true,
        data: {
          matches: limitedMatches,
          filesSearched: files.length,
          totalMatches: matches.length,
          warnings,
        },
        truncated: matches.length > 1000,
        hint:
          matches.length > 1000
            ? `Showing first 1000 of ${matches.length} matches. Narrow your search.`
            : diagnostics.hasErrors()
              ? warnings
              : undefined,
      };
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
