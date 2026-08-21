/**
 * MCP (Model Context Protocol) Integration
 * Provides MCP Server and Client for tool/skill sharing
 */

export { McpServerAdapter, createMcpServer } from './server.js';
export { McpClientManager, getMcpClientManager, type McpConnectOptions } from './client.js';
export { loadMcpConfig, saveMcpConfig, type McpServerConfig, type McpConfig } from './config.js';

// Experimental MCP Apps surface (kilocode 36c57c12c). Gated behind
// `ALEXI_EXPERIMENTAL_MCP_APPS=1` at the call site — the exports here
// are always available so callers can feature-detect without a
// dynamic import.
export {
  isMCPAppsEnabled,
  listResources as mcpAppsListResources,
  callTool as mcpAppsCallTool,
  MCPAppsError,
  MCP_APPS_ENV_FLAG,
  type MCPResource,
} from './apps.js';
