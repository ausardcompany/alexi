/**
 * Suggest Tool - Present code review suggestions to the user
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { quoteFilePath } from '../../utils/file-mention.js';

const SuggestParamsSchema = z.object({
  suggestion: z.string().describe('The code review suggestion to present to the user'),
  file: z.string().optional().describe('Optional file path the suggestion relates to'),
  line: z.number().optional().describe('Optional line number for the suggestion'),
});

interface SuggestResult {
  type: 'suggestion';
  suggestion: string;
  file?: string;
  line?: number;
}

export const suggestTool = defineTool<typeof SuggestParamsSchema, SuggestResult>({
  name: 'suggest',
  description: `Present a code review suggestion to the user for their consideration.

Usage:
- Use to provide code improvement recommendations
- Suggestions are informational and non-blocking
- Can reference specific files and line numbers
- User can accept, reject, or modify suggestions`,

  parameters: SuggestParamsSchema,

  async execute(params, _context): Promise<ToolResult<SuggestResult>> {
    // Suggestion handling is done by the permission system
    // The tool itself just returns the suggestion for display
    return {
      success: true,
      data: {
        type: 'suggestion',
        suggestion: params.suggestion,
        file: params.file ? quoteFilePath(params.file) : params.file,
        line: params.line,
      },
    };
  },
});
