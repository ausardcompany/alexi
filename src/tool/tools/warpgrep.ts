/**
 * WarpGrep Codebase Search Tool - AI-powered semantic code search
 */

import { z } from 'zod';
import { defineTool, type ToolResult } from '../index.js';
import { Telemetry } from '../../utils/telemetry.js';

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

const DESCRIPTION = `Find code snippets by semantic meaning and return ranked matches with file paths and line ranges.

## When to use

- Explore an unfamiliar code area before you know exact identifiers
- Find related implementations of a concept or behavior across the workspace
- Search by intent such as authentication, caching, or session resume logic
- Narrow a large codebase before following up with \`Read\` or \`Grep\`
- Limit semantic search to one subdirectory with \`path\`

## When NOT to use

- Search for an exact symbol or regex pattern — use \`Grep\`
- Find files by filename or extension — use \`Glob\`
- Read the contents of a known file — use \`Read\`
- Explore files outside the current workspace - use \`Grep\`, \`Glob\`, and \`Read\`

## Examples

- "User login and password hashing" → search for auth-related code by meaning
- "Database connection pooling" → find conceptually similar implementations
- "Session resume flow" → retrieve snippets involved in restoring session state
- "Tool approval UI" with \`path: "packages/opencode/src"\` → combine a natural-language query with \`path\`

## Constraints

- Write the query in English.
- Use \`path\` only for subdirectories inside the current workspace.`;

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
      
      // Track codebase search usage
      Telemetry.track('codebase_search', {
        tool: 'warpgrep',
        query_length: params.query?.length ?? 0,
        results_count: spans.length,
        path_filter: false,
      });
      
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
