/**
 * MCP (Model Context Protocol) Integration
 * Provides MCP Server and Client for tool/skill sharing
 */

export { McpServerAdapter, createMcpServer } from './server.js';
export { McpClientManager, getMcpClientManager, type McpConnectOptions } from './client.js';
export { loadMcpConfig, saveMcpConfig, type McpServerConfig, type McpConfig } from './config.js';

// MCP Client ID Metadata Document (CIMD) support — opt-in helper for
// OAuth flows against third-party MCP servers. Alexi's SAP AI Core
// integration does not use OAuth, so this surface is unused by default.
export {
  ClientMetadataDocumentSchema,
  fetchClientMetadata,
  isClientMetadataUrl,
  type ClientMetadataDocument,
} from './client-metadata.js';

// MCP OAuth issuer-rotation detection (kilocode `84b26c697`). Pure
// helpers; used by any future OAuth-provider wiring to detect when a
// third-party MCP server has moved to a new authorization server and
// trigger re-registration instead of looping on stale credentials.
export {
  hasIssuerChanged,
  requireReregistration,
  type StoredOAuthClient,
  type DiscoveredOAuthMetadata,
  type ReregistrationAction,
} from './oauth-issuer.js';

// MCP Capability Interface Metadata (CIMD) validation. Detects
// breaking-change drift between an expected `expectedCapabilities`
// manifest and the manifest observed on the wire at connect time.
export {
  CapabilityManifestSchema,
  CapabilityToolSchema,
  validateCapabilities,
  buildManifestFromTools,
  McpCapabilityMismatchError,
  type CapabilityManifest,
  type CapabilityTool,
  type CapabilityMismatch,
  type CapabilityMismatchKind,
  type ValidationResult,
} from './cimd.js';

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

// Auth-failure classification (kilocode 21ed2b9e + c9632e495). Lets
// callers surface structured OAuth / token-expired / forbidden errors
// to the CLI instead of a generic transport error.
export {
  classifyAuthFailure,
  extractHttpStatus,
  extractHeader,
  McpAuthError,
  type McpAuthFailure,
  type McpAuthFailureKind,
} from './auth-failure.js';

// Scoped MCP runtime-status registry (kilocode c58468b1c + d395d0314).
// Clears cached status when a server is uninstalled; purge is scoped
// to the installing scope (user vs project) so a cross-scope same-name
// entry is NOT accidentally wiped.
export {
  setStatus as setMcpStatus,
  getStatus as getMcpStatus,
  listStatuses as listMcpStatuses,
  uninstallServer as uninstallMcpServer,
  type McpScope,
  type McpStatusEntry,
} from './registry.js';
