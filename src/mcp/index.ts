/**
 * MCP (Model Context Protocol) Integration
 * Provides MCP Server and Client for tool/skill sharing
 */

export { McpServerAdapter, createMcpServer } from './server.js';
export { McpClientManager, getMcpClientManager } from './client.js';
export { loadMcpConfig, saveMcpConfig, type McpServerConfig, type McpConfig } from './config.js';
