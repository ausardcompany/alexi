/**
 * CodeSearch Tool - Smart code search combining symbol search and content search
 *
 * Provides semantic-aware code search that understands code structure:
 * - Search by symbol name (functions, classes, interfaces, types)
 * - Search by content with context
 * - Filter by symbol type
 * - Cross-reference definitions and usages
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

// ============ Types ============

export type SymbolType =
  | 'function'
  | 'class'
  | 'interface'
  | 'type'
  | 'const'
  | 'variable'
  | 'method'
  | 'import'
  | 'export';

export interface CodeSymbol {
  name: string;
  type: SymbolType;
  file: string;
  line: number;
  column: number;
  signature: string;
  exported: boolean;
}

export interface CodeMatch {
  file: string;
  line: number;
  column: number;
  content: string;
  context?: {
    before: string[];
    after: string[];
  };
  symbol?: CodeSymbol;
}

export interface CodeSearchResult {
  query: string;
  searchType: 'symbol' | 'content' | 'both';
  matches: CodeMatch[];
  symbols: CodeSymbol[];
  filesSearched: number;
  totalMatches: number;
}

// ============ Schema ============

const SearchTypeEnum = z.enum(['symbol', 'content', 'both']);
const SymbolTypeEnum = z.enum([
  'function',
  'class',
  'interface',
  'type',
  'const',
  'variable',
  'method',
  'import',
  'export',
]);

const CodeSearchParamsSchema = z.object({
  query: z.string().describe('Search query - symbol name or regex pattern'),
  searchType: SearchTypeEnum.optional()
    .default('both')
    .describe('Type of search: symbol (find definitions), content (grep-like), or both'),
  symbolTypes: z
    .array(SymbolTypeEnum)
    .optional()
    .describe('Filter by symbol types (only for symbol search)'),
  path: z.string().optional().describe('Directory to search in (defaults to workdir)'),
  include: z.string().optional().describe('File pattern to include (e.g., "*.ts", "*.{js,tsx}")'),
  contextLines: z
    .number()
    .int()
    .min(0)
    .max(10)
    .optional()
    .default(2)
    .describe('Number of context lines around matches'),
  maxResults: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .default(100)
    .describe('Maximum number of results'),
  caseSensitive: z.boolean().optional().default(false).describe('Case-sensitive search'),
});

type CodeSearchParams = z.infer<typeof CodeSearchParamsSchema>;

// ============ Symbol Patterns ============

const SYMBOL_PATTERNS: Record<SymbolType, RegExp> = {
  function:
    /(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>/gm,
  class: /(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/gm,
  interface: /(?:export\s+)?interface\s+(\w+)/gm,
  type: /(?:export\s+)?type\s+(\w+)\s*(?:<[^=]*>)?\s*=/gm,
  const: /(?:export\s+)?const\s+(\w+)\s*[=:]/gm,
  variable: /(?:export\s+)?(?:let|var)\s+(\w+)\s*[=:]/gm,
  method:
    /(?:public|private|protected)?\s*(?:static\s+)?(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{/gm,
  import: /import\s+(?:\{[^}]+\}|[^;]+)\s+from\s+['"]([^'"]+)['"]/gm,
  export:
    /export\s+(?:default\s+)?(?:\{[^}]+\}|(?:class|function|const|let|var|interface|type|enum)\s+(\w+))/gm,
};

// ============ File Utilities ============

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.next',
  'coverage',
  '__pycache__',
  '.venv',
  'venv',
]);
const CODE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.py',
  '.go',
  '.rs',
  '.java',
  '.c',
  '.cpp',
  '.h',
  '.hpp',
  '.cs',
  '.rb',
  '.php',
]);

function isCodeFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return CODE_EXTENSIONS.has(ext);
}

function matchesInclude(filename: string, include?: string): boolean {
  if (!include) return isCodeFile(filename);

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

async function findCodeFiles(dir: string, include?: string, maxFiles = 5000): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    if (files.length >= maxFiles) return;

    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (files.length >= maxFiles) break;

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name.startsWith('.') || IGNORED_DIRS.has(entry.name)) {
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

// ============ Symbol Extraction ============

function extractSymbols(content: string, filePath: string, types?: SymbolType[]): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];
  const lines = content.split('\n');
  const typesToSearch = types || (Object.keys(SYMBOL_PATTERNS) as SymbolType[]);

  for (const symbolType of typesToSearch) {
    if (symbolType === 'import' || symbolType === 'export') continue; // Skip import/export for symbol extraction

    const pattern = new RegExp(SYMBOL_PATTERNS[symbolType].source, 'gm');
    let match;

    while ((match = pattern.exec(content)) !== null) {
      // Find the captured group (name)
      const name = match.slice(1).find((g) => g !== undefined);
      if (!name) continue;

      const lineIndex = content.substring(0, match.index).split('\n').length - 1;
      const line = lines[lineIndex] || '';
      const column = match.index - content.lastIndexOf('\n', match.index - 1);

      // Determine if exported
      const isExported = line.includes('export ');

      // Build signature (first line of the match, cleaned up)
      let signature = line.trim();
      if (signature.length > 100) {
        signature = signature.substring(0, 100) + '...';
      }

      symbols.push({
        name,
        type: symbolType,
        file: filePath,
        line: lineIndex + 1,
        column,
        signature,
        exported: isExported,
      });
    }
  }

  return symbols;
}

// ============ Content Search ============

function searchContent(
  content: string,
  query: string,
  filePath: string,
  caseSensitive: boolean,
  contextLines: number
): CodeMatch[] {
  const matches: CodeMatch[] = [];
  const lines = content.split('\n');

  let regex: RegExp;
  try {
    regex = new RegExp(query, caseSensitive ? 'g' : 'gi');
  } catch {
    // If invalid regex, escape and search as literal
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Get context
      const before: string[] = [];
      const after: string[] = [];

      for (let j = Math.max(0, i - contextLines); j < i; j++) {
        before.push(lines[j]);
      }
      for (let j = i + 1; j <= Math.min(lines.length - 1, i + contextLines); j++) {
        after.push(lines[j]);
      }

      matches.push({
        file: filePath,
        line: i + 1,
        column: match.index + 1,
        content: line.slice(0, 200), // Limit line length
        context: contextLines > 0 ? { before, after } : undefined,
      });

      // Only report first match per line
      break;
    }
  }

  return matches;
}

// ============ Main Tool ============

export const codesearchTool = defineTool<typeof CodeSearchParamsSchema, CodeSearchResult>({
  name: 'codesearch',
  description: `Smart code search that understands code structure.

Search modes:
- symbol: Find definitions (functions, classes, interfaces, types, etc.)
- content: Search file contents (like grep but for code)
- both: Combine symbol and content search

Examples:
- Find all functions named "handle*": query="handle", searchType="symbol", symbolTypes=["function"]
- Find usages of "useState": query="useState", searchType="content"
- Find class definitions: searchType="symbol", symbolTypes=["class"]

Returns matches with file location, content, context, and symbol information.`,

  parameters: CodeSearchParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.path ?? '.',
  },

  async execute(params: CodeSearchParams, context): Promise<ToolResult<CodeSearchResult>> {
    const {
      query,
      searchType = 'both',
      symbolTypes,
      include,
      contextLines = 2,
      maxResults = 100,
      caseSensitive = false,
    } = params;

    const searchPath = params.path
      ? path.isAbsolute(params.path)
        ? params.path
        : path.join(context.workdir, params.path)
      : context.workdir;

    try {
      const files = await findCodeFiles(searchPath, include);
      const allMatches: CodeMatch[] = [];
      const allSymbols: CodeSymbol[] = [];

      for (const file of files) {
        if (allMatches.length >= maxResults && allSymbols.length >= maxResults) break;

        try {
          const content = await fs.readFile(file, 'utf-8');
          const relativePath = path.relative(searchPath, file);

          // Symbol search
          if (searchType === 'symbol' || searchType === 'both') {
            const symbols = extractSymbols(content, relativePath, symbolTypes);

            // Filter by query
            const queryRegex = new RegExp(query, caseSensitive ? '' : 'i');
            const matchingSymbols = symbols.filter((s) => queryRegex.test(s.name));

            allSymbols.push(...matchingSymbols);
          }

          // Content search
          if (searchType === 'content' || searchType === 'both') {
            const matches = searchContent(
              content,
              query,
              relativePath,
              caseSensitive,
              contextLines
            );
            allMatches.push(...matches);
          }
        } catch {
          // Skip files that can't be read
        }
      }

      // Sort by file, then line
      allMatches.sort((a, b) => {
        const fileCompare = a.file.localeCompare(b.file);
        return fileCompare !== 0 ? fileCompare : a.line - b.line;
      });

      allSymbols.sort((a, b) => {
        const fileCompare = a.file.localeCompare(b.file);
        return fileCompare !== 0 ? fileCompare : a.line - b.line;
      });

      // Limit results
      const limitedMatches = allMatches.slice(0, maxResults);
      const limitedSymbols = allSymbols.slice(0, maxResults);
      const truncated = allMatches.length > maxResults || allSymbols.length > maxResults;

      return {
        success: true,
        data: {
          query,
          searchType,
          matches: limitedMatches,
          symbols: limitedSymbols,
          filesSearched: files.length,
          totalMatches: allMatches.length + allSymbols.length,
        },
        truncated,
        hint: truncated
          ? `Results limited to ${maxResults}. Use more specific query or filters.`
          : undefined,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});

// ============ Formatting Utilities ============

/**
 * Format code search results for display
 */
export function formatCodeSearchResults(result: CodeSearchResult, showContext = true): string {
  const lines: string[] = [];

  lines.push(`Query: "${result.query}" (${result.searchType})`);
  lines.push(`Files searched: ${result.filesSearched}`);
  lines.push(`Total matches: ${result.totalMatches}`);
  lines.push('');

  if (result.symbols.length > 0) {
    lines.push('## Symbols');
    lines.push('');

    for (const symbol of result.symbols) {
      lines.push(`${symbol.type.toUpperCase()} ${symbol.name}`);
      lines.push(`  ${symbol.file}:${symbol.line}`);
      lines.push(`  ${symbol.signature}`);
      lines.push('');
    }
  }

  if (result.matches.length > 0) {
    lines.push('## Content Matches');
    lines.push('');

    for (const match of result.matches) {
      lines.push(`${match.file}:${match.line}:${match.column}`);

      if (showContext && match.context) {
        for (const line of match.context.before) {
          lines.push(`  | ${line}`);
        }
      }

      lines.push(`> | ${match.content}`);

      if (showContext && match.context) {
        for (const line of match.context.after) {
          lines.push(`  | ${line}`);
        }
      }

      lines.push('');
    }
  }

  if (result.symbols.length === 0 && result.matches.length === 0) {
    lines.push('No matches found.');
  }

  return lines.join('\n');
}
