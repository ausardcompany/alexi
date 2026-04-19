/**
 * Suggest Tool
 * Provides code review suggestions or recommendations to the user
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

// Suggest parameters schema
const SuggestParamsSchema = z.object({
  suggestion: z.string().describe('The code suggestion or review comment'),
  file: z.string().optional().describe('Optional file path the suggestion relates to'),
  line: z.number().optional().describe('Optional line number for the suggestion'),
});

type SuggestParams = z.infer<typeof SuggestParamsSchema>;

interface SuggestResult {
  type: 'suggestion';
  suggestion: string;
  file?: string;
  line?: number;
}

/**
 * Suggest tool implementation
 */
export const suggestTool = defineTool<typeof SuggestParamsSchema, SuggestResult>({
  name: 'suggest',
  description: 'Provide a code review suggestion or recommendation to the user',
  parameters: SuggestParamsSchema,
  permission: {
    action: 'read', // Suggestions are informational, like read operations
    getResource: (params) => params.file ?? 'suggestion',
  },
  async execute(params: SuggestParams): Promise<ToolResult<SuggestResult>> {
    // Suggestion handling is done by the client
    return {
      success: true,
      data: {
        type: 'suggestion',
        suggestion: params.suggestion,
        file: params.file,
        line: params.line,
      },
    };
  },
});
