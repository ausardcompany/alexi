#!/usr/bin/env node
/**
 * Slow MCP server fixture.
 *
 * A minimal MCP stdio server used by the integration tests in
 * `tests/mcp/client.test.ts` (and any other test that needs a real
 * subprocess speaking the MCP wire protocol).
 *
 * Behaviour:
 * - Delays `STARTUP_DELAY_MS` milliseconds before connecting the
 *   `McpServer` to its `StdioServerTransport`. During the delay, stdin
 *   is buffered by the OS pipe — the client sees no `initialize`
 *   response, which is exactly the scenario the client-side
 *   `startup` timeout guards against.
 * - When `STARTUP_DELAY_MS <= 0` (or unset), the server connects
 *   immediately (fast-path).
 * - When `STARTUP_DELAY_MS < 0` (e.g. -1) the server intentionally
 *   never connects the transport — simulates a hung server.
 * - After connect it registers a single trivial `ping` tool so the
 *   client's `tools/list` initial-metadata probe succeeds and the
 *   connection reports as `connected`.
 *
 * This fixture is plain `.js` (not TypeScript) so it can be spawned
 * directly with `node <path>` without a tsx / build step. Local ESM
 * imports resolve out of `node_modules/`, so no `.js` extension
 * suffixing quirks apply here.
 */

import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';

const rawDelay = process.env.STARTUP_DELAY_MS;
const delayMs = rawDelay === undefined ? 0 : Number(rawDelay);

async function main() {
  const server = new McpServer({ name: 'slow-mcp-fixture', version: '0.0.0' });

  // Register one no-op tool so `tools/list` returns a non-empty
  // result. The client under test asserts on the connected state and
  // is not sensitive to what the tool does.
  server.registerTool(
    'ping',
    {
      description: 'Fixture tool that returns "pong".',
    },
    async () => ({
      content: [{ type: 'text', text: 'pong' }],
    })
  );

  if (Number.isFinite(delayMs) && delayMs < 0) {
    // Hung server: connect the transport but never respond. Keep the
    // event loop alive until the parent kills the process.
    setInterval(() => {}, 1_000_000);
    return;
  }

  if (Number.isFinite(delayMs) && delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.stderr.write(`slow-mcp-server fatal: ${String(error)}\n`);
  process.exit(1);
});
