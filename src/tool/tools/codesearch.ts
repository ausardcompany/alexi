/**
 * CodeSearch Tool - DEPRECATED
 * 
 * This tool has been removed upstream as it was broken.
 * Search functionality is now handled by grep, glob, and other search tools.
 * 
 * This stub exists only for backward compatibility.
 * The tool will return an error if called.
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const CodeSearchParamsSchema = z.object({
  query: z.string(),
  searchType: z.enum(['symbol', 'content', 'both']).optional(),
  path: z.string().optional(),
});

interface CodeSearchResult {
  query: string;
  error: string;
}

/**
 * @deprecated This tool has been removed. Use grep, glob, or other search tools instead.
 */
export const codesearchTool = defineTool<typeof CodeSearchParamsSchema, CodeSearchResult>({
  name: 'codesearch',
  description: `[DEPRECATED] This tool has been removed. Use grep for content search or glob for file search instead.`,

  parameters: CodeSearchParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.path ?? '.',
  },

  async execute(_params, _context): Promise<ToolResult<CodeSearchResult>> {
    return {
      success: false,
      error:
        'The codesearch tool has been deprecated. Please use grep for content search or glob for file search instead.',
    };
  },
});

/**
 * @deprecated Use grep or glob tools instead
 */
export function formatCodeSearchResults(): string {
  return 'CodeSearch tool is deprecated. Use grep or glob instead.';
}
