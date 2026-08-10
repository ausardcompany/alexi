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
  /**
   * Timeout budget(s) in milliseconds.
   *
   * Accepts either:
   * - A single number applied to BOTH the stdio handshake / cold-spawn
   *   phase (`client.connect`) and per-tool `callTool` deadlines.
   *   This is the legacy shape and remains supported for
   *   backwards-compatibility.
   * - An object `{ startup?: number; request?: number }` that lets the
   *   slow spawn phase and the fast tool-call phase have independent
   *   budgets. Missing keys fall back to the defaults below.
   *
   * Defaults when unspecified:
   * - `startup`: 3000 ms — aggressive cap so a hung MCP server cannot
   *   stall session creation on the critical path. Covers ~2s cold
   *   `npx -y` warm-cache starters while keeping worst-case per-server
   *   connect near ~6s. JVM-based servers (e.g. Oracle SQLcl) OR a
   *   first-time `npx -y` cold install WILL exceed this and MUST set an
   *   explicit `timeout.startup` override here (typical values 15000-45000).
   * - `request`: 60000 ms (per-tool call deadline)
   *
   * When this field is absent, the client falls back to the config-file
   * global {@link McpConfig.timeout}, then to the `MCP_TOOL_TIMEOUT` env
   * variable, and finally to the defaults above. See
   * `McpClientManager.getTimeoutsForServer` for the full precedence chain.
   */
  timeout?: number | { startup?: number; request?: number };
  /**
   * Working directory for the spawned stdio server. Relative paths are
   * resolved against `options.workdir` (or `process.cwd()` if no workdir
   * is supplied to `connect()`). Ignored for non-stdio transports.
   */
  cwd?: string;
  /**
   * Connection retry policy for transient failures.
   *
   * When `enabled` is true, `McpClientManager.connect` retries a failed
   * initial connection with exponential backoff. Only transient errors
   * are retried (`ECONNREFUSED`, `ETIMEDOUT`, `ECONNRESET`, `EPIPE`,
   * `spawn` failures with recoverable codes, and startup-timeout errors
   * emitted by the manager). Configuration errors (`ENOENT` — command
   * not found — and missing required environment variables detected at
   * config-load time) are NEVER retried; they will only get worse with
   * more attempts.
   *
   * Defaults when the object is present but a field is omitted:
   * - `maxAttempts`: 3 (initial attempt + 2 retries)
   * - `initialDelayMs`: 1000
   * - `maxDelayMs`: 4000
   *
   * Backoff sequence: initialDelay, initialDelay*2, initialDelay*4, ...
   * capped at `maxDelayMs`.
   */
  retry?: {
    enabled: boolean;
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
  };
}

export interface McpConfig {
  /** Version of the config format */
  version: string;
  /** List of MCP servers */
  servers: McpServerConfig[];
  /**
   * Global default timeout budget(s) in milliseconds applied to every
   * server that does NOT declare its own {@link McpServerConfig.timeout}.
   *
   * Accepts the same shapes as the per-server field:
   * - A single number applied to BOTH startup and request phases.
   * - An object `{ startup?: number; request?: number }` for independent
   *   budgets; missing keys fall back to the built-in defaults
   *   (3000ms startup, 60000ms request).
   *
   * Resolution order at call time (per server):
   * 1. Per-server `McpServerConfig.timeout` (if set)
   * 2. Global `McpConfig.timeout` (this field)
   * 3. `MCP_TOOL_TIMEOUT` environment variable (applied to both phases)
   * 4. Built-in defaults (3000ms startup, 60000ms request)
   */
  timeout?: number | { startup?: number; request?: number };
}

const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const CONFIG_FILE = path.join(CONFIG_DIR, 'mcp-servers.json');

/**
 * Get default MCP configuration
 */
function getDefaultConfig(): McpConfig {
  return {
    version: '1.0',
    // Optional config-file global timeout. Applied to every server that
    // does NOT declare its own `timeout` field. Accepts a bare number
    // (both phases) or `{ startup?, request? }`. Omitted from the default
    // config so built-in defaults (3s startup, 60s request) apply until
    // an operator explicitly opts in. Slow-starting servers (JVM-based
    // like Oracle SQLcl, first-time `npx -y` cold installs) MUST bump
    // `timeout.startup` to avoid tripping the aggressive 3s default.
    // Example:
    //   "timeout": { "startup": 45000, "request": 90000 }
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
        // Per-server timeout overrides the global default. Bare number
        // applies to both startup and request phases.
        // timeout: 45000,
      },
      // Example: Brave Search MCP server with an explicit per-server
      // timeout that a slow-starting server may need.
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
        // Object form lets startup and per-tool call have independent
        // budgets. Omitted keys fall back through the precedence chain.
        // timeout: { startup: 60000, request: 30000 },
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
  const existing = config.servers.findIndex((s) => s.name === server.name);
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
  config.servers = config.servers.filter((s) => s.name !== name);
  saveMcpConfig(config);
  return config;
}

/**
 * Enable/disable an MCP server
 */
export function toggleMcpServer(name: string, enabled: boolean): McpConfig {
  const config = loadMcpConfig();
  const server = config.servers.find((s) => s.name === name);
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
