/**
 * Diagnostics Tool - Get code diagnostics (errors, warnings, hints)
 *
 * Integrates with external tools like TypeScript, ESLint, etc. to provide
 * code diagnostics for files or entire projects.
 */

import { z } from 'zod';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { defineTool, type ToolResult } from '../index.js';

// ============ Types ============

export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface Diagnostic {
  file: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  severity: DiagnosticSeverity;
  message: string;
  source: string;
  code?: string;
}

export interface DiagnosticsResult {
  diagnostics: Diagnostic[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    hints: number;
    total: number;
  };
  sources: string[];
}

// ============ Schema ============

const DiagnosticsParamsSchema = z.object({
  filePath: z
    .string()
    .optional()
    .describe('Path to a specific file. Leave empty for project-wide diagnostics.'),
  sources: z
    .array(z.enum(['typescript', 'eslint', 'tsc']))
    .optional()
    .describe('Which diagnostic sources to use. Default: auto-detect based on project.'),
  maxDiagnostics: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('Maximum number of diagnostics to return. Default: 50.'),
});

type DiagnosticsParams = z.infer<typeof DiagnosticsParamsSchema>;

// ============ Diagnostic Parsers ============

/**
 * Parse TypeScript compiler output
 * Format: file(line,col): error TS1234: message
 */
function parseTscOutput(output: string, workdir: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const regex = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/gm;

  let match;
  while ((match = regex.exec(output)) !== null) {
    const [, file, line, col, severity, code, message] = match;
    diagnostics.push({
      file: path.isAbsolute(file) ? file : path.join(workdir, file),
      line: parseInt(line, 10),
      column: parseInt(col, 10),
      severity: severity === 'error' ? 'error' : 'warning',
      message: message.trim(),
      source: 'tsc',
      code,
    });
  }

  return diagnostics;
}

/**
 * Parse ESLint JSON output
 */
function parseEslintOutput(output: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  try {
    const results = JSON.parse(output) as Array<{
      filePath: string;
      messages: Array<{
        line: number;
        column: number;
        endLine?: number;
        endColumn?: number;
        severity: 1 | 2;
        message: string;
        ruleId: string | null;
      }>;
    }>;

    for (const result of results) {
      for (const msg of result.messages) {
        diagnostics.push({
          file: result.filePath,
          line: msg.line,
          column: msg.column,
          endLine: msg.endLine,
          endColumn: msg.endColumn,
          severity: msg.severity === 2 ? 'error' : 'warning',
          message: msg.message,
          source: 'eslint',
          code: msg.ruleId || undefined,
        });
      }
    }
  } catch {
    // Failed to parse ESLint output
  }

  return diagnostics;
}

// ============ Diagnostic Runners ============

interface RunCommandOptions {
  command: string;
  args: string[];
  cwd: string;
  timeout?: number;
}

async function runCommand(options: RunCommandOptions): Promise<string> {
  const { command, args, cwd, timeout = 30000 } = options;

  return new Promise((resolve) => {
    let output = '';

    const proc = spawn(command, args, {
      cwd,
      shell: true,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve('');
    }, timeout);

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', () => {
      clearTimeout(timer);
      resolve(output);
    });

    proc.on('error', () => {
      clearTimeout(timer);
      resolve('');
    });
  });
}

async function runTsc(workdir: string, filePath?: string): Promise<Diagnostic[]> {
  const tsconfigPath = path.join(workdir, 'tsconfig.json');

  // Check if TypeScript project
  if (!fs.existsSync(tsconfigPath)) {
    return [];
  }

  const args = ['--noEmit', '--pretty', 'false'];
  if (filePath) {
    // For single file, we still need to run tsc on the whole project
    // but filter results later
  }

  const output = await runCommand({
    command: 'npx',
    args: ['tsc', ...args],
    cwd: workdir,
  });

  let diagnostics = parseTscOutput(output, workdir);

  // Filter by file if specified
  if (filePath) {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(workdir, filePath);
    diagnostics = diagnostics.filter((d) => d.file === absolutePath);
  }

  return diagnostics;
}

async function runEslint(workdir: string, filePath?: string): Promise<Diagnostic[]> {
  // Check if ESLint is available
  const eslintConfigFiles = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    'eslint.config.js',
    'eslint.config.mjs',
  ];

  const hasEslint = eslintConfigFiles.some((f) => fs.existsSync(path.join(workdir, f)));
  if (!hasEslint) {
    return [];
  }

  const target = filePath || '.';
  const args = ['eslint', target, '--format', 'json', '--no-error-on-unmatched-pattern'];

  const output = await runCommand({
    command: 'npx',
    args,
    cwd: workdir,
  });

  return parseEslintOutput(output);
}

// ============ Auto-detection ============

function detectSources(workdir: string): Array<'typescript' | 'eslint' | 'tsc'> {
  const sources: Array<'typescript' | 'eslint' | 'tsc'> = [];

  // Check for TypeScript
  if (fs.existsSync(path.join(workdir, 'tsconfig.json'))) {
    sources.push('tsc');
  }

  // Check for ESLint
  const eslintConfigFiles = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    'eslint.config.js',
    'eslint.config.mjs',
  ];
  if (eslintConfigFiles.some((f) => fs.existsSync(path.join(workdir, f)))) {
    sources.push('eslint');
  }

  return sources;
}

// ============ Main Tool ============

export const diagnosticsTool = defineTool<typeof DiagnosticsParamsSchema, DiagnosticsResult>({
  name: 'diagnostics',
  description: `Get code diagnostics (errors, warnings, hints) for a file or project.

Usage:
- Leave filePath empty to get project-wide diagnostics
- Specify filePath for diagnostics on a single file
- Supports TypeScript (tsc) and ESLint
- Auto-detects available tools based on project configuration

Returns:
- List of diagnostics with file, line, column, severity, and message
- Summary with counts by severity
- List of sources that were checked`,

  parameters: DiagnosticsParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.filePath || 'project',
  },

  async execute(params: DiagnosticsParams, context): Promise<ToolResult<DiagnosticsResult>> {
    const { filePath, maxDiagnostics = 50 } = params;
    const workdir = context.workdir;

    // Validate file exists if specified
    if (filePath) {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(workdir, filePath);
      if (!fs.existsSync(absolutePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
          data: {
            diagnostics: [],
            summary: { errors: 0, warnings: 0, info: 0, hints: 0, total: 0 },
            sources: [],
          },
        };
      }
    }

    // Determine which sources to use
    const sources = params.sources || detectSources(workdir);

    if (sources.length === 0) {
      return {
        success: true,
        data: {
          diagnostics: [],
          summary: { errors: 0, warnings: 0, info: 0, hints: 0, total: 0 },
          sources: [],
        },
        hint: 'No diagnostic sources found. Ensure tsconfig.json or eslint config exists.',
      };
    }

    // Run all diagnostic sources in parallel
    const allDiagnostics: Diagnostic[] = [];
    const usedSources: string[] = [];

    const runners: Promise<Diagnostic[]>[] = [];

    if (sources.includes('tsc') || sources.includes('typescript')) {
      runners.push(
        runTsc(workdir, filePath).then((d) => {
          if (d.length > 0 || fs.existsSync(path.join(workdir, 'tsconfig.json'))) {
            usedSources.push('tsc');
          }
          return d;
        })
      );
    }

    if (sources.includes('eslint')) {
      runners.push(
        runEslint(workdir, filePath).then((d) => {
          usedSources.push('eslint');
          return d;
        })
      );
    }

    const results = await Promise.all(runners);
    for (const diagnostics of results) {
      allDiagnostics.push(...diagnostics);
    }

    // Sort by severity (errors first) then by file and line
    const severityOrder: Record<DiagnosticSeverity, number> = {
      error: 0,
      warning: 1,
      info: 2,
      hint: 3,
    };

    allDiagnostics.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;

      const fileDiff = a.file.localeCompare(b.file);
      if (fileDiff !== 0) return fileDiff;

      return a.line - b.line;
    });

    // Limit results
    const limitedDiagnostics = allDiagnostics.slice(0, maxDiagnostics);
    const truncated = allDiagnostics.length > maxDiagnostics;

    // Calculate summary
    const summary = {
      errors: allDiagnostics.filter((d) => d.severity === 'error').length,
      warnings: allDiagnostics.filter((d) => d.severity === 'warning').length,
      info: allDiagnostics.filter((d) => d.severity === 'info').length,
      hints: allDiagnostics.filter((d) => d.severity === 'hint').length,
      total: allDiagnostics.length,
    };

    return {
      success: true,
      data: {
        diagnostics: limitedDiagnostics,
        summary,
        sources: usedSources,
      },
      truncated,
      hint: truncated
        ? `Showing ${maxDiagnostics} of ${allDiagnostics.length} diagnostics. Use maxDiagnostics to see more.`
        : undefined,
    };
  },
});

// ============ Formatting Utilities ============

/**
 * Format diagnostics for display
 */
export function formatDiagnostics(diagnostics: Diagnostic[], workdir?: string): string {
  if (diagnostics.length === 0) {
    return 'No diagnostics found.';
  }

  const lines: string[] = [];

  for (const d of diagnostics) {
    const file = workdir ? path.relative(workdir, d.file) : d.file;
    const location = `${file}:${d.line}:${d.column}`;
    const severity = d.severity.toUpperCase().padEnd(7);
    const code = d.code ? ` [${d.code}]` : '';
    const source = ` (${d.source})`;

    lines.push(`${severity} ${location}${code}${source}`);
    lines.push(`        ${d.message}`);
  }

  return lines.join('\n');
}

/**
 * Format summary for display
 */
export function formatSummary(summary: DiagnosticsResult['summary']): string {
  const parts: string[] = [];

  if (summary.errors > 0) parts.push(`${summary.errors} error${summary.errors > 1 ? 's' : ''}`);
  if (summary.warnings > 0)
    parts.push(`${summary.warnings} warning${summary.warnings > 1 ? 's' : ''}`);
  if (summary.info > 0) parts.push(`${summary.info} info`);
  if (summary.hints > 0) parts.push(`${summary.hints} hint${summary.hints > 1 ? 's' : ''}`);

  if (parts.length === 0) {
    return 'No issues found.';
  }

  return parts.join(', ');
}
