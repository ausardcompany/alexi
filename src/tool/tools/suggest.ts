/**
 * Suggest Tool - Propose code change suggestions for user review
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const SuggestParamsSchema = z.object({
  title: z.string().describe('Brief title for the suggestion'),
  description: z.string().describe('Detailed description of the suggested change'),
  filepath: z.string().optional().describe('File path the suggestion applies to'),
  diff: z.string().optional().describe('Unified diff format of the suggested change'),
});

interface SuggestResult {
  id: string;
  title: string;
  description: string;
  filepath?: string;
  diff?: string;
  status: 'pending';
  createdAt: string;
}

export const suggestTool = defineTool<typeof SuggestParamsSchema, SuggestResult>({
  name: 'suggest',
  description: `Propose a code change suggestion for user review. Use this when you want to suggest improvements or fixes that the user can accept or dismiss.

Usage:
- Provide a clear title and description for the suggestion
- Optionally include the filepath and a unified diff of the proposed change
- The suggestion will be presented to the user for approval`,

  parameters: SuggestParamsSchema,

  async execute(params, _context): Promise<ToolResult<SuggestResult>> {
    // Generate a unique suggestion ID
    const suggestionId = `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const suggestion: SuggestResult = {
      id: suggestionId,
      title: params.title,
      description: params.description,
      filepath: params.filepath,
      diff: params.diff,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Emit suggestion event when event system is integrated
    // For now, return the suggestion as a result
    // In the future, this should emit a SuggestionCreated event

    return {
      success: true,
      data: suggestion,
      hint: `Suggestion "${params.title}" has been proposed for review.`,
    };
  },
});
