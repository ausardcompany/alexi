/**
 * Grep Tool - Search file contents using regex
 *
 * When `rg` (ripgrep) is available on PATH, the search is dispatched through
 * it for speed. Otherwise (or when `ALEXI_DISABLE_RG=1` is set, or `rg`
 * spawn fails), we fall back to the in-process JavaScript file walker.
 *
 * The output shape (`{ matches, filesSearched, totalMatches }`) is identical
 * between the two paths so callers (and tests) cannot tell them apart.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { defineTool, type ToolResult } from '../index.js';
import { getReferenceService } from '../../reference/reference.js';
import { logger } from '../../utils/logger.js';
import { attachAgentsMdRemindersForPaths } from '../../agent/agentsMdReminders.js';
import { getConfigAdditionalExtensions } from '../../config/userConfig.js';
import { mergeIncludePattern } from './includePattern.js';

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

// ---------------------------------------------------------------------------
// rg feature detection (cached for the lifetime of the process)
// ---------------------------------------------------------------------------

let rgAvailable: boolean | null = null;
let rgDetectPromise: Promise<boolean> | null = null;

/**
 * Reset cached `rg` detection state. Used by tests.
 *
 * @internal
 */
export function _resetRgDetectionForTests(): void {
  rgAvailable = null;
  rgDetectPromise = null;
}

/**
 * Returns `true` when `rg` (ripgrep) is on PATH and `rg --version` exits
 * cleanly within a short timeout. Result is cached per-process so we only
 * pay the spawn cost once.
 *
 * Honors `ALEXI_DISABLE_RG=1` as a hard override to force the JS path.
 */
async function detectRg(): Promise<boolean> {
  if (process.env.ALEXI_DISABLE_RG === '1') {
    return false;
  }
  if (rgAvailable !== null) {
    return rgAvailable;
  }
  if (rgDetectPromise !== null) {
    return rgDetectPromise;
  }
  rgDetectPromise = new Promise<boolean>((resolve) => {
    let proc: ReturnType<typeof spawn>;
    try {
      proc = spawn('rg', ['--version'], { stdio: 'ignore' });
    } catch {
      rgAvailable = false;
      resolve(false);
      return;
    }
    const timer = setTimeout(() => {
      try {
        proc.kill();
      } catch {
        // ignore
      }
      rgAvailable = false;
      resolve(false);
    }, 200);
    proc.on('exit', (code) => {
      clearTimeout(timer);
      const ok = code === 0;
      rgAvailable = ok;
      resolve(ok);
    });
    proc.on('error', () => {
      clearTimeout(timer);
      rgAvailable = false;
      resolve(false);
    });
  });
  return rgDetectPromise;
}

// ---------------------------------------------------------------------------
// Helpers shared by both code paths
// ---------------------------------------------------------------------------

/**
 * Check if filename matches include pattern
 */
function matchesInclude(filename: string, include?: string): boolean {
  if (!include) {
    return true;
  }

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
 * Recursively find files (JS fallback path).
 */
async function findFiles(
  dir: string,
  include?: string,
  maxFiles = 10000,
  signal?: AbortSignal
): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    if (files.length >= maxFiles) {
      return;
    }

    // Check for abort signal
    if (signal?.aborted) {
      throw new Error('Operation aborted');
    }

    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (files.length >= maxFiles) {
          break;
        }

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

// ---------------------------------------------------------------------------
// rg-backed implementation
// ---------------------------------------------------------------------------

interface RgBeginEvent {
  type: 'begin';
  data: { path: { text?: string; bytes?: string } };
}

interface RgMatchEvent {
  type: 'match';
  data: {
    path: { text?: string; bytes?: string };
    lines: { text?: string; bytes?: string };
    line_number: number;
  };
}

interface RgEndEvent {
  type: 'end';
}

interface RgSummaryEvent {
  type: 'summary';
  data: { stats?: { searches?: number } };
}

type RgEvent =
  RgBeginEvent | RgMatchEvent | RgEndEvent | RgSummaryEvent | { type: string; data?: unknown };

/**
 * Count files visible to `rg` under `searchDir` honoring the same exclusions
 * as the search itself. Used when rg's match summary reports zero searches.
 */
async function countFilesWithRg(searchDir: string, include: string | undefined): Promise<number> {
  const args: string[] = [
    '--files',
    '--no-messages',
    '--no-ignore-vcs',
    '--no-ignore-parent',
    '--glob',
    '!node_modules',
    '--glob',
    '!dist',
    '--glob',
    '!build',
  ];
  if (include) {
    args.push('--glob', include);
  }
  args.push(searchDir);
  return new Promise<number>((resolve) => {
    let proc: ReturnType<typeof spawn>;
    try {
      proc = spawn('rg', args, { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      resolve(0);
      return;
    }
    let count = 0;
    let buf = '';
    proc.stdout?.setEncoding('utf-8');
    proc.stdout?.on('data', (chunk: string) => {
      buf += chunk;
      let idx: number;
      while ((idx = buf.indexOf('\n')) !== -1) {
        count += 1;
        buf = buf.slice(idx + 1);
      }
    });
    proc.on('close', () => {
      if (buf.trim().length > 0) {
        count += 1;
      }
      resolve(count);
    });
    proc.on('error', () => resolve(0));
  });
}

class RgSpawnError extends Error {
  constructor(
    message: string,
    public readonly code: number | null,
    public readonly stderr: string
  ) {
    super(message);
    this.name = 'RgSpawnError';
  }
}

/**
 * Execute the search by spawning `rg --json` and parsing the JSON-lines
 * stream. Returns a result with the same shape as the JS path so callers
 * cannot observe a difference.
 *
 * Throws on rg spawn failure / non-zero exit (other than exit code 1, which
 * rg uses to indicate "no matches"). Callers should fall back to the JS
 * path on throw.
 */
async function executeWithRg(
  pattern: string,
  searchDir: string,
  include: string | undefined,
  signal: AbortSignal | undefined
): Promise<GrepResult> {
  const args: string[] = [
    '--json',
    '--no-heading',
    '--line-number',
    '--no-messages',
    '--stats',
    // Don't read .gitignore / parent ignore files so behavior is deterministic
    // and matches the JS path. rg still skips hidden dirs by default, which
    // matches the JS path's hidden-dir skip.
    '--no-ignore-vcs',
    '--no-ignore-parent',
    // Mirror the JS path's hard-coded directory excludes.
    '--glob',
    '!node_modules',
    '--glob',
    '!dist',
    '--glob',
    '!build',
  ];
  if (include) {
    args.push('--glob', include);
  }
  args.push('--', pattern, searchDir);

  return new Promise<GrepResult>((resolve, reject) => {
    let proc: ReturnType<typeof spawn>;
    try {
      proc = spawn('rg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    let stderr = '';
    let stdoutBuf = '';
    let filesSearched = 0;
    const matches: GrepMatch[] = [];
    const filesSeen = new Set<string>();
    const fileMtimes = new Map<string, Promise<number>>();

    const onAbort = (): void => {
      try {
        proc.kill();
      } catch {
        // ignore
      }
      reject(new Error('Operation aborted'));
    };

    if (signal) {
      if (signal.aborted) {
        try {
          proc.kill();
        } catch {
          // ignore
        }
        reject(new Error('Operation aborted'));
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }

    const handleLine = (line: string): void => {
      if (!line) {
        return;
      }
      let event: RgEvent;
      try {
        event = JSON.parse(line) as RgEvent;
      } catch {
        return;
      }
      if (event.type === 'begin') {
        const e = event as RgBeginEvent;
        const filePath = e.data.path.text;
        if (filePath) {
          filesSeen.add(filePath);
          if (!fileMtimes.has(filePath)) {
            fileMtimes.set(
              filePath,
              fs.stat(filePath).then(
                (s) => s.mtimeMs,
                () => 0
              )
            );
          }
        }
      } else if (event.type === 'match') {
        const e = event as RgMatchEvent;
        const filePath = e.data.path.text;
        const text = e.data.lines.text;
        if (filePath === undefined || text === undefined) {
          // rg may emit base64 bytes for non-UTF-8 content; skip those.
          return;
        }
        // Strip the trailing newline that rg includes in `lines.text`.
        const stripped = text.endsWith('\n') ? text.slice(0, -1) : text;
        matches.push({
          file: path.relative(searchDir, filePath),
          line: e.data.line_number,
          content: stripped.slice(0, 200),
        });
      } else if (event.type === 'summary') {
        const e = event as RgSummaryEvent;
        const searches = e.data?.stats?.searches;
        if (typeof searches === 'number') {
          filesSearched = searches;
        }
      }
    };

    proc.stdout?.setEncoding('utf-8');
    proc.stdout?.on('data', (chunk: string) => {
      stdoutBuf += chunk;
      let idx: number;
      while ((idx = stdoutBuf.indexOf('\n')) !== -1) {
        const line = stdoutBuf.slice(0, idx);
        stdoutBuf = stdoutBuf.slice(idx + 1);
        handleLine(line);
      }
    });

    proc.stderr?.setEncoding('utf-8');
    proc.stderr?.on('data', (chunk: string) => {
      stderr += chunk;
    });

    proc.on('error', (err) => {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      reject(err);
    });

    proc.on('close', (code) => {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      // Drain any final partial line
      if (stdoutBuf.length > 0) {
        handleLine(stdoutBuf);
        stdoutBuf = '';
      }

      // rg exit codes:
      //   0 — matches found
      //   1 — no matches (not an error for us)
      //   2 — actual error
      //   >=2 — also error
      if (code !== 0 && code !== 1) {
        reject(new RgSpawnError(`rg exited with code ${code}: ${stderr.trim()}`, code, stderr));
        return;
      }

      // Sort by file mtime (newest first), then by line number — same as JS path.
      const filesWithMatches = [...new Set(matches.map((m) => m.file))];
      Promise.all(
        filesWithMatches.map(async (rel) => {
          const abs = path.join(searchDir, rel);
          const promise = fileMtimes.get(abs);
          const mtime = promise
            ? await promise
            : await fs.stat(abs).then(
                (s) => s.mtimeMs,
                () => 0
              );
          return { file: rel, mtime };
        })
      ).then((fileStats) => {
        fileStats.sort((a, b) => b.mtime - a.mtime);
        const sortOrder = new Map(fileStats.map((f, i) => [f.file, i]));
        matches.sort((a, b) => {
          const orderA = sortOrder.get(a.file) ?? 999999;
          const orderB = sortOrder.get(b.file) ?? 999999;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          return a.line - b.line;
        });

        // rg's `--stats` summary reports `searches=0` when no file produced
        // a match, even though it did scan files. To keep `filesSearched`
        // meaningful (and matching the JS path), do a separate `rg --files`
        // count in that case. We only take this branch when there are zero
        // matches, so the cost is negligible.
        const finishWith = (count: number): void => {
          resolve({
            matches,
            filesSearched: count,
            totalMatches: matches.length,
          });
        };

        if (matches.length === 0 && filesSearched === 0) {
          countFilesWithRg(searchDir, include).then(finishWith, () => finishWith(0));
        } else {
          finishWith(filesSearched > 0 ? filesSearched : filesSeen.size);
        }
      }, reject);
    });
  });
}

// ---------------------------------------------------------------------------
// Tool entrypoint
// ---------------------------------------------------------------------------

let rgFailureLogged = false;

export const grepTool = defineTool<typeof GrepParamsSchema, GrepResult>({
  name: 'grep',
  description: `Search file contents using regular expressions.

Usage:
- Supports full regex syntax (e.g., "log.*Error", "function\\s+\\w+")
- Filter files by pattern with include (e.g., "*.js", "*.{ts,tsx}")
- Returns file paths and line numbers with at least one match
- Results are sorted by modification time
- When you are doing an open-ended search where you do not know the exact symbol name, use the \`codebase_search\` tool first to narrow down the search scope, then follow up with \`grep\` and/or \`read\`
- Uses ripgrep (\`rg\`) as a fast path when available; set \`ALEXI_DISABLE_RG=1\` to force the JS implementation

When independent reads, searches, or edits are also needed, emit those tool calls in the same response instead of splitting across turns.`,

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

      // Validate the pattern up-front so invalid regexes produce the same
      // error message regardless of which backend ends up running.
      let validatedRegex: RegExp;
      try {
        validatedRegex = new RegExp(params.pattern);
      } catch (err) {
        if (err instanceof SyntaxError) {
          return {
            success: false,
            error: `Invalid regex pattern: ${err.message}`,
          };
        }
        throw err;
      }

      // Merge the caller's include filter with any additional extensions
      // configured via `indexing.additionalExtensions` in the user config.
      // When no include was passed, the pattern remains undefined and the
      // tool retains its historical "search all files" behavior.
      const additionalExtensions = getConfigAdditionalExtensions();
      const effectiveInclude = mergeIncludePattern(params.include, additionalExtensions);

      // Fast path: ripgrep when available.
      if (await detectRg()) {
        try {
          const value = await executeWithRg(
            params.pattern,
            searchPath,
            effectiveInclude,
            context.signal
          );
          // Apply the same 1000-match cap as the JS path.
          const limited = value.matches.slice(0, 1000);
          const rgResult: ToolResult<GrepResult> = {
            success: true,
            data: {
              matches: limited,
              filesSearched: value.filesSearched,
              totalMatches: value.totalMatches,
            },
            truncated: value.totalMatches > 1000,
            hint:
              value.totalMatches > 1000
                ? `Showing first 1000 of ${value.totalMatches} matches. Narrow your search.`
                : undefined,
          };
          if (limited.length > 0) {
            attachAgentsMdRemindersForPaths(
              rgResult,
              limited.map((m) => path.join(searchPath, m.file)),
              context
            );
          }
          return rgResult;
        } catch (err) {
          // Aborted searches should surface as aborted, not silently fall
          // through to the JS path.
          if (context.signal?.aborted) {
            return { success: false, error: 'Operation aborted' };
          }
          if (!rgFailureLogged) {
            rgFailureLogged = true;
            logger.warn(
              `[grep] rg fast-path failed (${err instanceof Error ? err.message : String(err)}); falling back to JS implementation. Set ALEXI_DISABLE_RG=1 to silence.`
            );
          }
          // fall through to JS path
        }
      }

      // JS fallback path
      const regex = validatedRegex;
      const files = await findFiles(searchPath, effectiveInclude, 10000, context.signal);
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
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.line - b.line;
      });

      // Limit total matches
      const limitedMatches = matches.slice(0, 1000);

      const jsResult: ToolResult<GrepResult> = {
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
      if (limitedMatches.length > 0) {
        attachAgentsMdRemindersForPaths(
          jsResult,
          limitedMatches.map((m) => path.join(searchPath, m.file)),
          context
        );
      }
      return jsResult;
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

// Re-export internals for tests.
export const _internalsForTests = {
  detectRg,
  executeWithRg,
};
