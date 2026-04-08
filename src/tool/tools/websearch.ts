/**
 * WebSearch Tool - Search the web using DuckDuckGo
 */

import { z } from 'zod';
import { search, SafeSearchType } from 'duck-duck-scrape';
import { defineTool, type ToolResult } from '../index.js';

const WebSearchParamsSchema = z.object({
  query: z.string().describe('Search query'),
  limit: z.number().optional().describe('Max results to return (1-10, default: 5)'),
  region: z.string().optional().describe('Region code like "us-en" or "ru-ru"'),
});

interface WebSearchResult {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  query: string;
  totalResults: number;
}

export const websearchTool = defineTool<typeof WebSearchParamsSchema, WebSearchResult>({
  name: 'websearch',
  description: `Search the web using DuckDuckGo.

Usage:
- Searches DuckDuckGo for the given query
- Returns structured results with title, URL, and snippet
- Limit results from 1-10 (default: 5)
- Optional region code for localized results (e.g., "us-en", "ru-ru")`,

  parameters: WebSearchParamsSchema,

  permission: {
    action: 'network',
    getResource: (params) => `duckduckgo.com (search: ${params.query.slice(0, 50)})`,
  },

  async execute(params, context): Promise<ToolResult<WebSearchResult>> {
    try {
      // Check for abort before starting
      if (context.signal?.aborted) {
        return {
          success: false,
          error: 'Search aborted',
        };
      }

      // Clamp limit to 1-10
      const limit = Math.max(1, Math.min(10, params.limit ?? 5));

      // Perform search
      const searchResults = await search(params.query, {
        safeSearch: SafeSearchType.MODERATE,
        locale: params.region || 'en-us',
      });

      // Map results to our format
      const results = searchResults.results
        .slice(0, limit)
        .map((r: { title: string; url: string; description: string }) => ({
          title: r.title,
          url: r.url,
          snippet: r.description,
        }));

      return {
        success: true,
        data: {
          results,
          query: params.query,
          totalResults: results.length,
        },
      };
    } catch (err) {
      // Check if aborted
      if (context.signal?.aborted) {
        return {
          success: false,
          error: 'Search aborted',
        };
      }

      // Handle specific error types
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Check for rate limiting
      if (
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('too many requests') ||
        errorMessage.includes('429')
      ) {
        return {
          success: false,
          error: 'Search rate limited, please try again later',
        };
      }

      // Network errors
      if (
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('fetch') ||
        errorMessage.toLowerCase().includes('econnrefused') ||
        errorMessage.toLowerCase().includes('enotfound')
      ) {
        return {
          success: false,
          error: `Failed to search: ${errorMessage}`,
        };
      }

      // Generic error
      return {
        success: false,
        error: `Failed to search: ${errorMessage}`,
      };
    }
  },
});
