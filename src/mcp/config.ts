/**
 * MCP Configuration
 * Manages external MCP server connections
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

export interface McpServerConfig {
  /** Unique server identifier */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Transport type */
  transport: 'stdio' | 'sse' | 'http';
  /** Command to start the server (for stdio) */
  command?: string;
  /** Arguments for the command */
  args?: string[];
  /** Environment variables */
  env?: Record<string, string>;
  /** URL for HTTP/SSE transport */
  url?: string;
  /** API key or token */
  apiKey?: string;
  /** Whether this server is enabled */
  enabled: boolean;
  /** Auto-connect on startup */
  autoConnect?: boolean;
}

export interface McpConfig {
  /** Version of the config format */
  version: string;
  /** List of MCP servers */
  servers: McpServerConfig[];
}

const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const CONFIG_FILE = path.join(CONFIG_DIR, 'mcp-servers.json');

/**
 * Get default MCP configuration
 */
function getDefaultConfig(): McpConfig {
  return {
    version: '1.0',
    servers: [
      // Example: filesystem MCP server
      {
        name: 'filesystem',
        description: 'File system access via MCP',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
        enabled: false,
        autoConnect: false,
      },
      // Example: GitHub MCP server
      {
        name: 'github',
        description: 'GitHub API access via MCP',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github'],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}',
        },
        enabled: false,
        autoConnect: false,
      },
      // Example: Brave Search MCP server
      {
        name: 'brave-search',
        description: 'Web search via Brave Search API',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-brave-search'],
        env: {
          BRAVE_API_KEY: '${BRAVE_API_KEY}',
        },
        enabled: false,
        autoConnect: false,
      },
    ],
  };
}

/**
 * Load MCP configuration from file
 */
export function loadMcpConfig(): McpConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      // Create default config
      const defaultConfig = getDefaultConfig();
      saveMcpConfig(defaultConfig);
      return defaultConfig;
    }

    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content) as McpConfig;
  } catch (error) {
    console.warn('Failed to load MCP config, using defaults:', error);
    return getDefaultConfig();
  }
}

/**
 * Save MCP configuration to file
 */
export function saveMcpConfig(config: McpConfig): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save MCP config:', error);
  }
}

/**
 * Add a new MCP server to configuration
 */
export function addMcpServer(server: McpServerConfig): McpConfig {
  const config = loadMcpConfig();
  
  // Check for duplicate name
  const existing = config.servers.findIndex(s => s.name === server.name);
  if (existing >= 0) {
    config.servers[existing] = server;
  } else {
    config.servers.push(server);
  }
  
  saveMcpConfig(config);
  return config;
}

/**
 * Remove an MCP server from configuration
 */
export function removeMcpServer(name: string): McpConfig {
  const config = loadMcpConfig();
  config.servers = config.servers.filter(s => s.name !== name);
  saveMcpConfig(config);
  return config;
}

/**
 * Enable/disable an MCP server
 */
export function toggleMcpServer(name: string, enabled: boolean): McpConfig {
  const config = loadMcpConfig();
  const server = config.servers.find(s => s.name === name);
  if (server) {
    server.enabled = enabled;
    saveMcpConfig(config);
  }
  return config;
}

/**
 * Get config file path
 */
export function getConfigPath(): string {
  return CONFIG_FILE;
}

/**
 * Resolve environment variables in config
 */
export function resolveEnvVars(env?: Record<string, string>): Record<string, string> {
  if (!env) return {};
  
  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    // Replace ${VAR} with process.env.VAR
    resolved[key] = value.replace(/\$\{([^}]+)\}/g, (_, varName) => {
      return process.env[varName] || '';
    });
  }
  return resolved;
}
