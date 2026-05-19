/**
 * MCP Client Manager
 * Connects to external MCP servers and aggregates their tools
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, type ChildProcess } from 'child_process';
import { loadMcpConfig, resolveEnvVars, type McpServerConfig } from './config.js';

export interface McpToolInfo {
  /** Tool name */
  name: string;
  /** Tool description */
  description?: string;
  /** Input schema */
  inputSchema: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
  /** Source server name */
  serverName: string;
}

export interface McpConnection {
  /** Server configuration */
  config: McpServerConfig;
  /** MCP Client instance */
  client: Client;
  /** Child process (for stdio transport) */
  process?: ChildProcess;
  /** Available tools from this server */
  tools: McpToolInfo[];
  /** Connection status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  /** Error message if any */
  error?: string;
  /** Last time tools were fetched */
  toolsCachedAt?: number;
}

export interface McpConnectOptions {
  /** Project working directory to pass as ALEXI_PROJECT_DIR */
  workdir?: string;
}

interface ToolCache {
  tools: McpToolInfo[];
  timestamp: number;
}

const CACHE_TTL_MS = 30000; // 30 seconds
const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60000; // 60 seconds
const MAX_PAGES = 100; // Safety cap for paginated tools/list

export class McpClientManager {
  private connections: Map<string, McpConnection> = new Map();
  private toolCache: Map<string, ToolCache> = new Map();

  /**
   * Fetch all tools from an MCP client, handling paginated responses.
   * Loops until no nextCursor is returned or MAX_PAGES is reached.
   */
  private async listAllTools(
    client: Client
  ): Promise<Array<{ name: string; description?: string; inputSchema: unknown }>> {
    const allTools: Array<{ name: string; description?: string; inputSchema: unknown }> = [];
    let cursor: string | undefined;
    let pages = 0;

    do {
      const result = await client.listTools(cursor ? { cursor } : undefined);
      allTools.push(...(result.tools || []));
      cursor = result.nextCursor;
      pages++;
    } while (cursor && pages < MAX_PAGES);

    return allTools;
  }

  /**
   * Map a raw MCP tool to McpToolInfo, tolerating malformed schemas.
   */
  private mapToolInfo(
    tool: { name: string; description?: string; inputSchema: unknown },
    serverName: string
  ): McpToolInfo {
    let inputSchema = tool.inputSchema as McpToolInfo['inputSchema'];
    try {
      if (!inputSchema || typeof inputSchema !== 'object') {
        throw new Error('Invalid schema structure');
      }
    } catch (error) {
      console.warn(
        `MCP tool schema parsing failed for ${tool.name} from ${serverName}, using permissive fallback:`,
        error
      );
      inputSchema = {
        type: 'object',
        properties: {},
      };
    }

    return {
      name: tool.name,
      description: tool.description,
      inputSchema,
      serverName,
    };
  }

  /**
   * Connect to an MCP server
   */
  async connect(config: McpServerConfig, options?: McpConnectOptions): Promise<McpConnection> {
    if (this.connections.has(config.name)) {
      const existing = this.connections.get(config.name)!;
      if (existing.status === 'connected') {
        return existing;
      }
      // Disconnect existing failed connection
      await this.disconnect(config.name);
    }

    const connection: McpConnection = {
      config,
      client: new Client({ name: 'alexi', version: '0.1.0' }, { capabilities: {} }),
      tools: [],
      status: 'connecting',
    };

    this.connections.set(config.name, connection);

    try {
      if (config.transport === 'stdio') {
        await this.connectStdio(connection, options);
      } else {
        throw new Error(`Transport ${config.transport} not yet implemented`);
      }

      // Fetch available tools (with pagination support)
      const rawTools = await this.listAllTools(connection.client);
      connection.tools = rawTools.map((tool) => this.mapToolInfo(tool, config.name));

      connection.status = 'connected';
      console.log(`Connected to MCP server: ${config.name} (${connection.tools.length} tools)`);

      return connection;
    } catch (error) {
      connection.status = 'error';
      connection.error = error instanceof Error ? error.message : String(error);
      console.error(`Failed to connect to MCP server ${config.name}:`, connection.error);
      return connection;
    }
  }

  private async connectStdio(
    connection: McpConnection,
    options?: McpConnectOptions
  ): Promise<void> {
    const { config } = connection;

    if (!config.command) {
      throw new Error('Stdio transport requires a command');
    }

    // Resolve environment variables
    // ALEXI_PROJECT_DIR is injected before user config.env so users can override it
    const env = {
      ...process.env,
      ALEXI_PROJECT_DIR: options?.workdir ?? process.cwd(),
      ...resolveEnvVars(config.env),
    };

    // Spawn the MCP server process
    const proc = spawn(config.command, config.args || [], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    connection.process = proc;

    // Handle process errors
    proc.on('error', (error) => {
      connection.status = 'error';
      connection.error = error.message;
    });

    proc.on('exit', (code) => {
      if (connection.status === 'connected') {
        connection.status = 'disconnected';
        console.log(`MCP server ${config.name} exited with code ${code}`);
      }
    });

    // Log stderr for debugging
    proc.stderr?.on('data', (data) => {
      console.error(`[${config.name}] ${data.toString()}`);
    });

    // Create stdio transport - filter out undefined values from env
    const cleanEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(env)) {
      if (value !== undefined) {
        cleanEnv[key] = value;
      }
    }

    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: cleanEnv,
    });

    const timeoutMs = this.getTimeoutForServer(config.name);
    await connection.client.connect(transport, { timeout: timeoutMs });
  }

  /**
   * Disconnect from an MCP server
   */
  async disconnect(name: string): Promise<void> {
    const connection = this.connections.get(name);
    if (!connection) return;

    try {
      await connection.client.close();
    } catch (error) {
      console.warn(`Error closing MCP client ${name}:`, error);
    }

    if (connection.process) {
      connection.process.kill();
    }

    this.connections.delete(name);
    console.log(`Disconnected from MCP server: ${name}`);
  }

  /**
   * Disconnect from all servers
   */
  async disconnectAll(): Promise<void> {
    for (const name of this.connections.keys()) {
      await this.disconnect(name);
    }
  }

  /**
   * Connect to all enabled servers from config
   * Enhanced with graceful failure handling and summary logging
   */
  async connectFromConfig(options?: McpConnectOptions): Promise<void> {
    const config = loadMcpConfig();

    // Add graceful handling for server initialization failures
    const servers = config.servers.filter((s) => s.enabled && s.autoConnect);
    const results = await Promise.allSettled(
      servers.map(async (server) => {
        try {
          const connection = await this.connect(server, options);
          if (connection.status === 'connected') {
            return { server: server.name, status: 'connected', tools: connection.tools.length };
          } else {
            return {
              server: server.name,
              status: 'failed',
              error: connection.error || 'Unknown error',
            };
          }
        } catch (error) {
          console.warn(`Failed to initialize MCP server ${server.name}:`, error);
          return {
            server: server.name,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    // Log initialization summary
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'connected'
    ).length;
    const failed = results.filter(
      (r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'failed')
    ).length;

    if (servers.length > 0) {
      if (failed > 0) {
        console.warn(`MCP initialization: ${successful} connected, ${failed} failed`);
      } else {
        console.log(`MCP initialization: ${successful} server(s) connected`);
      }
    }
  }

  /**
   * Get all available tools from connected servers
   * Uses cache to avoid redundant RPC calls
   */
  getAllTools(): McpToolInfo[] {
    const allTools: McpToolInfo[] = [];

    for (const connection of this.connections.values()) {
      if (connection.status === 'connected') {
        allTools.push(...connection.tools);
      }
    }

    return allTools;
  }

  /**
   * Get tools from a specific server with caching
   */
  getServerTools(serverName: string): McpToolInfo[] {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return [];
    }

    const cached = this.toolCache.get(serverName);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.tools;
    }

    // Cache the tools
    this.toolCache.set(serverName, {
      tools: connection.tools,
      timestamp: now,
    });

    return connection.tools;
  }

  /**
   * Invalidate tool cache for a specific server or all servers
   */
  invalidateToolCache(serverName?: string): void {
    if (serverName) {
      this.toolCache.delete(serverName);
    } else {
      this.toolCache.clear();
    }
  }

  /**
   * Refresh tools from a specific server
   */
  async refreshTools(serverName: string): Promise<void> {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return;
    }

    try {
      const rawTools = await this.listAllTools(connection.client);
      connection.tools = rawTools.map((tool) => this.mapToolInfo(tool, connection.config.name));
      connection.toolsCachedAt = Date.now();

      // Update cache
      this.toolCache.set(serverName, {
        tools: connection.tools,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`Failed to refresh tools from ${serverName}:`, error);
    }
  }

  /**
   * Get the timeout for a specific server.
   * Priority: per-server config > MCP_TOOL_TIMEOUT env var > default
   */
  private getTimeoutForServer(serverName: string): number {
    const connection = this.connections.get(serverName);
    if (connection?.config.timeout !== undefined) {
      return connection.config.timeout;
    }

    const envTimeout = process.env.MCP_TOOL_TIMEOUT;
    if (envTimeout !== undefined) {
      const parsed = Number(envTimeout);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return DEFAULT_TOOL_CALL_TIMEOUT_MS;
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const connection = this.connections.get(serverName);

    if (!connection) {
      return { success: false, error: `Server not connected: ${serverName}` };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: `Server not ready: ${serverName} (${connection.status})` };
    }

    const timeoutMs = this.getTimeoutForServer(serverName);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await connection.client.callTool(
        { name: toolName, arguments: args },
        undefined,
        { signal: controller.signal }
      );
      clearTimeout(timer);

      // Extract text content from result
      const content = (result.content || []) as Array<{ type: string; text?: string }>;
      const textContent = content
        .filter(
          (c): c is { type: 'text'; text: string } =>
            c.type === 'text' && typeof c.text === 'string'
        )
        .map((c) => c.text)
        .join('\n');

      if (result.isError) {
        return { success: false, error: textContent || 'Unknown error' };
      }

      return { success: true, result: textContent };
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: `MCP tool call timed out after ${timeoutMs}ms` };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Find which server provides a tool
   */
  findToolServer(toolName: string): string | undefined {
    for (const connection of this.connections.values()) {
      if (connection.status === 'connected') {
        const tool = connection.tools.find((t) => t.name === toolName);
        if (tool) {
          return connection.config.name;
        }
      }
    }
    return undefined;
  }

  /**
   * Get connection status for all servers
   */
  getStatus(): Array<{
    name: string;
    status: string;
    tools: number;
    error?: string;
  }> {
    return Array.from(this.connections.entries()).map(([name, conn]) => ({
      name,
      status: conn.status,
      tools: conn.tools.length,
      error: conn.error,
    }));
  }

  /**
   * Get a specific connection
   */
  getConnection(name: string): McpConnection | undefined {
    return this.connections.get(name);
  }
}

// Singleton instance
let globalManager: McpClientManager | null = null;

export function getMcpClientManager(): McpClientManager {
  if (!globalManager) {
    globalManager = new McpClientManager();
  }
  return globalManager;
}

export function resetMcpClientManager(): void {
  if (globalManager) {
    globalManager.disconnectAll();
  }
  globalManager = null;
}
