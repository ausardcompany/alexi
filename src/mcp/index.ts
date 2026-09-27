/**
 * MCP (Model Context Protocol) Integration
 * Provides MCP Server and Client for tool/skill sharing
 */

export { McpServerAdapter, createMcpServer } from './server.js';
export { McpClientManager, getMcpClientManager, type McpConnectOptions } from './client.js';
export { loadMcpConfig, saveMcpConfig, type McpServerConfig, type McpConfig } from './config.js';

// Git-based MCP plugin installer — wired to `ax mcp install <repo-url>`.
export {
  parseGitUrl as parseMcpGitUrl,
  cloneMCPPlugin,
  detectMCPEntry,
  installGitMCPPlugin,
  sanitizePluginName as sanitizeMcpPluginName,
  validateBranch as validateMcpBranch,
  setGitSpawner as setMcpGitSpawner,
  resetGitSpawner as resetMcpGitSpawner,
  DEFAULT_MCP_PLUGINS_DIR,
  type ParsedRepoUrl as ParsedMcpRepoUrl,
  type DetectedEntry as DetectedMcpEntry,
  type InstallGitMcpOptions,
  type InstallGitMcpResult,
  type CloneOptions as McpCloneOptions,
  type CloneMcpResult,
  type McpGitOrigin,
  type GitSpawner as McpGitSpawner,
} from './git-installer.js';

// MCP Client ID Metadata Document (CIMD) support — opt-in helper for
// OAuth flows against third-party MCP servers. Alexi's SAP AI Core
// integration does not use OAuth, so this surface is unused by default.
export {
  ClientMetadataDocumentSchema,
  fetchClientMetadata,
  isClientMetadataUrl,
  type ClientMetadataDocument,
} from './client-metadata.js';

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
