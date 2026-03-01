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
}

export class McpClientManager {
  private connections: Map<string, McpConnection> = new Map();

  /**
   * Connect to an MCP server
   */
  async connect(config: McpServerConfig): Promise<McpConnection> {
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
        await this.connectStdio(connection);
      } else {
        throw new Error(`Transport ${config.transport} not yet implemented`);
      }

      // Fetch available tools
      const toolsResult = await connection.client.listTools();
      connection.tools = (toolsResult.tools || []).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema as McpToolInfo['inputSchema'],
        serverName: config.name,
      }));

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

  private async connectStdio(connection: McpConnection): Promise<void> {
    const { config } = connection;

    if (!config.command) {
      throw new Error('Stdio transport requires a command');
    }

    // Resolve environment variables
    const env = {
      ...process.env,
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

    await connection.client.connect(transport);
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
   */
  async connectFromConfig(): Promise<void> {
    const config = loadMcpConfig();

    for (const server of config.servers) {
      if (server.enabled && server.autoConnect) {
        await this.connect(server);
      }
    }
  }

  /**
   * Get all available tools from connected servers
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
   * Get tools from a specific server
   */
  getServerTools(serverName: string): McpToolInfo[] {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return [];
    }
    return connection.tools;
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

    try {
      const result = await connection.client.callTool({
        name: toolName,
        arguments: args,
      });

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
