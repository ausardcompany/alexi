/**
 * MCP Apps — experimental resource + tool endpoints
 *
 * Port of kilocode 36c57c12c (with follow-up hardening in c02134ab4 and
 * b7069922d). "MCP Apps" wraps the existing `McpClientManager` in a
 * thinner API that presents each connected server as an "app" with two
 * verbs: `listResources` (enumerate what the server exposes) and
 * `callTool` (invoke a tool by qualified name). It is behind an
 * experimental flag (`ALEXI_EXPERIMENTAL_MCP_APPS`) — the intent is to
 * stabilise the shape before wiring it into a permanent HTTP surface.
 *
 * Design notes:
 *   1. Error handling is tightened relative to raw `callTool`: any
 *      thrown value is wrapped in {@link MCPAppsError} carrying the
 *      operation / server / tool / cause metadata, so upstream HTTP
 *      handlers can render a stable JSON envelope without inspecting
 *      the raw cause.
 *   2. `listResources` gracefully returns an empty array when the
 *      connected server does not implement the optional method — mirrors
 *      the existing `McpClientManager.listResources` semantics so
 *      apps aren't forced to `try/catch` for a common case.
 *   3. The module intentionally does not spawn its own MCP transport;
 *      it borrows the connection already owned by the manager (respects
 *      cross-instance isolation once the watcher-style per-instance
 *      refactor propagates to MCP — kilocode b8984e468 rationale).
 */

import { getMcpClientManager, type McpClientManager } from './client.js';
import { logger } from '../utils/logger.js';

/**
 * Environment flag gating the MCP Apps experimental surface. When
 * unset, {@link isMCPAppsEnabled} returns false and callers should
 * short-circuit with a 404 / "not enabled" response rather than
 * accidentally exposing an unstable API.
 */
export const MCP_APPS_ENV_FLAG = 'ALEXI_EXPERIMENTAL_MCP_APPS';

/**
 * True when the experimental MCP Apps flag is enabled.
 */
export function isMCPAppsEnabled(): boolean {
  return process.env[MCP_APPS_ENV_FLAG] === '1';
}

/**
 * Structured error surfaced from any MCP Apps operation. Captures the
 * operation label (`'listResources'` / `'callTool'`), the affected
 * server, an optional tool name, and the underlying cause so HTTP
 * handlers can render a stable envelope. Cross-module `instanceof`
 * checks are avoided by matching on `name === 'MCPAppsError'`.
 */
export class MCPAppsError extends Error {
  readonly operation: 'listResources' | 'callTool';
  readonly server: string;
  readonly tool?: string;
  override readonly cause: unknown;

  constructor(detail: {
    operation: 'listResources' | 'callTool';
    server: string;
    tool?: string;
    cause: unknown;
  }) {
    const causeMessage =
      detail.cause instanceof Error ? detail.cause.message : String(detail.cause);
    const toolPart = detail.tool ? ` tool="${detail.tool}"` : '';
    super(
      `MCP Apps ${detail.operation} failed (server="${detail.server}"${toolPart}): ${causeMessage}`
    );
    this.name = 'MCPAppsError';
    this.operation = detail.operation;
    this.server = detail.server;
    if (detail.tool !== undefined) {
      this.tool = detail.tool;
    }
    this.cause = detail.cause;
  }
}

/**
 * Shape of a resource returned by `listResources`. Deliberately loose
 * (the MCP resource contract has been evolving) — callers are expected
 * to pass this straight through to the HTTP client, not to reason about
 * individual fields.
 */
export interface MCPResource {
  uri?: string;
  name?: string;
  mimeType?: string;
  [key: string]: unknown;
}

/**
 * Return the resources advertised by `server` via the underlying MCP
 * client's `listResources`. Servers that don't implement the optional
 * method yield an empty list.
 *
 * Throws {@link MCPAppsError} on any transport / handler failure.
 */
export async function listResources(
  server: string,
  manager: McpClientManager = getMcpClientManager()
): Promise<MCPResource[]> {
  try {
    // The manager caches resources on the connection object; refresh
    // first so callers always see the current list. `refreshResources`
    // is a no-op for servers that don't advertise the optional method.
    await manager.refreshResources(server);
    const connection = manager.getConnection(server);
    if (!connection) {
      throw new Error(`MCP server "${server}" is not connected`);
    }
    const cached = connection.resources;
    if (Array.isArray(cached)) {
      return cached as MCPResource[];
    }
    logger.warn(`[mcp-apps] listResources(${server}) returned non-array; treating as empty`);
    return [];
  } catch (cause) {
    throw new MCPAppsError({ operation: 'listResources', server, cause });
  }
}

/**
 * Invoke `tool` on `server` with `args`. All errors are normalised to
 * {@link MCPAppsError} so downstream HTTP handlers can render a stable
 * response shape without pattern-matching on the raw cause (kilocode
 * c02134ab4 tightened the error surface here — previously a raw MCP
 * `-32001` payload could leak through the HTTP handler).
 */
export async function callTool(
  server: string,
  tool: string,
  args: Record<string, unknown>,
  manager: McpClientManager = getMcpClientManager()
): Promise<unknown> {
  try {
    return await manager.callTool(server, tool, args);
  } catch (cause) {
    throw new MCPAppsError({ operation: 'callTool', server, tool, cause });
  }
}
