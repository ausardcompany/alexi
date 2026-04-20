/**
 * Suggest Tool - Provide code review suggestions
 * Based on kilocode/opencode suggest tool pattern
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const SuggestParamsSchema = z.object({
  suggestion: z.string().describe('The code review suggestion or improvement'),
  file: z.string().optional().describe('Optional file path the suggestion relates to'),
  line: z.number().optional().describe('Optional line number in the file'),
  severity: z
    .enum(['info', 'warning', 'error'])
    .optional()
    .default('info')
    .describe('Severity level of the suggestion'),
});

interface SuggestResult {
  recorded: boolean;
  suggestion: string;
  file?: string;
  line?: number;
  severity: string;
}

export const suggestTool = defineTool<typeof SuggestParamsSchema, SuggestResult>({
  name: 'suggest',
  description: `Suggest code improvements or review comments to the user.

Use this tool to provide non-blocking suggestions during code review or analysis.
Suggestions are recorded and displayed to the user but do not block execution.

Examples:
- Code quality improvements
- Best practice recommendations  
- Potential bug warnings
- Performance optimization ideas`,

  parameters: SuggestParamsSchema,

  permission: {
    action: 'suggest',
    getResource: (params) => params.file || 'general',
  },

  async execute(params, _context): Promise<ToolResult<SuggestResult>> {
    // Suggestions are non-blocking and always succeed
    // The event bus will handle displaying them to the user
    return {
      success: true,
      data: {
        recorded: true,
        suggestion: params.suggestion,
        file: params.file,
        line: params.line,
        severity: params.severity ?? 'info',
      },
    };
  },
});
