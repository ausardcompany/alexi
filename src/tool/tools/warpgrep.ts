/**
 * WarpGrep Codebase Search Tool - AI-powered semantic code search
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';

const WarpGrepParamsSchema = z.object({
  query: z
    .string()
    .describe(
      'Search query describing what code you are looking for. Be specific and descriptive for best results.'
    ),
});

interface CodeSpan {
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

interface WarpGrepResult {
  spans: CodeSpan[];
  query: string;
}

const DESCRIPTION = `Search the codebase for relevant code using AI-powered semantic search.
This tool finds code snippets most relevant to the search query using semantic search.
Returns matching content with file paths, line ranges, and relevance scores.
Searches based on meaning rather than exact text matches.
Use this for finding implementations, understanding code patterns, or locating specific functionality.
Be specific and descriptive in your query for best results.`;

// FREE_PERIOD_TODO: Remove KILO_WARPGREP_PROXY_URL constant and the proxy
// fallback below. After the free period ends, require MORPH_API_KEY and
// return an error when it is missing.
const KILO_WARPGREP_PROXY_URL = 'https://api.kilo.ai/api/gateway';

export const warpgrepTool = defineTool<typeof WarpGrepParamsSchema, WarpGrepResult>({
  name: 'codebase_search',
  description: DESCRIPTION,
  parameters: WarpGrepParamsSchema,

  async execute(params, context): Promise<ToolResult<WarpGrepResult>> {
    // Check if MorphSDK is available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let WarpGrepClient: any;
    try {
      // @ts-expect-error — @morphllm/morphsdk is an optional peer dependency
      const morphSDK = await import('@morphllm/morphsdk');
      WarpGrepClient = morphSDK.WarpGrepClient;
    } catch {
      return {
        success: false,
        error:
          'WarpGrep requires @morphllm/morphsdk to be installed. Run: npm install @morphllm/morphsdk',
      };
    }

    const apiKey = process.env['MORPH_API_KEY'];

    // FREE_PERIOD_TODO: Remove proxy fallback — require apiKey, error if missing
    const client = new WarpGrepClient({
      morphApiKey: apiKey ?? 'kilo-free',
      ...(apiKey ? {} : { morphApiUrl: KILO_WARPGREP_PROXY_URL }),
      timeout: 60000,
    });

    try {
      const result = await client.execute({
        searchTerm: params.query,
        repoRoot: context.workdir,
      });

      if (!result.success) {
        return {
          success: false,
          error: `Search failed: ${result.error || 'Unknown error'}`,
        };
      }

      const spans: CodeSpan[] = result.codeSpans || [];
      if (spans.length === 0) {
        return {
          success: true,
          data: {
            spans: [],
            query: params.query,
          },
          hint: 'No relevant code found for the given query.',
        };
      }

      return {
        success: true,
        data: {
          spans,
          query: params.query,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `WarpGrep search failed: ${message}`,
      };
    }
  },
});
