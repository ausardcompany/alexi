#!/usr/bin/env node
/**
 * alexi-mcp-warpgrep - MCP server entry point
 *
 * Exposes the `codebase_search` tool over the MCP protocol using stdio
 * transport. Designed to be registered in `mcp-servers.json` and driven by
 * an MCP client (Alexi, Claude Desktop, etc.).
 */

import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';

import { WARPGREP_DESCRIPTION, WarpGrepParamsSchema, warpgrepExecute } from './warpgrep.js';

/**
 * Build a fresh, unstarted `McpServer` with the `codebase_search` tool
 * registered. Exported for tests so they can inspect registration without
 * connecting to a live transport.
 */
export function createWarpgrepServer(opts: { repoRoot?: string } = {}): McpServer {
  const server = new McpServer({
    name: 'alexi-mcp-warpgrep',
    version: '1.0.0',
  });

  server.registerTool(
    'codebase_search',
    {
      title: 'Codebase Search',
      description: WARPGREP_DESCRIPTION,
      inputSchema: WarpGrepParamsSchema,
    },
    async ({ query }) => {
      const outcome = await warpgrepExecute({ query }, { repoRoot: opts.repoRoot });

      if (!outcome.success) {
        return {
          content: [{ type: 'text' as const, text: outcome.error }],
          isError: true,
        };
      }

      const payload =
        outcome.data.spans.length === 0
          ? (outcome.hint ?? 'No relevant code found for the given query.')
          : JSON.stringify(outcome.data, null, 2);

      return {
        content: [{ type: 'text' as const, text: payload }],
      };
    }
  );

  return server;
}

/**
 * Boot the server on stdio and block until the transport closes.
 */
export async function main(): Promise<void> {
  const server = createWarpgrepServer({ repoRoot: process.cwd() });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so it does not corrupt the JSON-RPC stream on stdout.
  process.stderr.write('[alexi-mcp-warpgrep] MCP server started on stdio\n');
}

// Only auto-run when this module is invoked directly (not when imported by
// tests or other consumers). Guarded by an `import.meta.url` check that
// works under both `node dist/index.js` and `alexi-mcp-warpgrep` bin usage.
const isEntry =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] !== undefined &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isEntry) {
  main().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[alexi-mcp-warpgrep] fatal: ${message}\n`);
    process.exit(1);
  });
}
