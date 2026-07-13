/**
 * MCP Client Manager
 * Connects to external MCP servers and aggregates their tools
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { logger } from '../utils/logger.js';
import { loadMcpConfig, resolveEnvVars, type McpServerConfig } from './config.js';

export interface McpToolInfo {
  /** Tool name (raw short name as advertised by the server) */
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
  /**
   * Fully qualified name in the form `<escapedServerName>::<toolName>`.
   *
   * `serverName` is escaped so that literal `:` and `%` characters in a
   * server name do not collide with the `::` separator. `%` is escaped
   * first (as `%25`) so the `%3A` introduced by escaping `:` is not
   * double-escaped on the way back.
   *
   * `toolName` is passed through verbatim; a tool name that itself
   * contains `::` still round-trips because parsing splits on the LAST
   * `::` occurrence.
   */
  qualifiedName: string;
}

/**
 * Escape a server name for use in the `qualifiedName` prefix.
 *
 * `%` is escaped first as `%25` so that the `%3A` introduced by escaping
 * `:` cannot be misinterpreted on the reverse pass.
 */
export function escapeServerName(name: string): string {
  return name.replaceAll('%', '%25').replaceAll(':', '%3A');
}

/**
 * Reverse of {@link escapeServerName}. `%3A` -> `:` first, then `%25` -> `%`.
 */
export function unescapeServerName(escaped: string): string {
  return escaped.replaceAll('%3A', ':').replaceAll('%25', '%');
}

/**
 * Build a qualified tool name from a raw server name and tool name.
 */
export function buildQualifiedName(serverName: string, toolName: string): string {
  return `${escapeServerName(serverName)}::${toolName}`;
}

/**
 * Parse a qualified tool name into its (unescaped) server and tool components.
 *
 * Splits on the FIRST `::` occurrence. Because {@link escapeServerName}
 * turns any literal `:` in the server segment into `%3A`, the server
 * segment never contains `::`; splitting on the first separator therefore
 * preserves tool names that themselves contain `::`. Throws when no `::`
 * separator is present.
 */
export function parseQualifiedName(qualified: string): {
  serverName: string;
  toolName: string;
} {
  const idx = qualified.indexOf('::');
  if (idx === -1) {
    throw new Error(`Invalid qualified tool name (missing '::'): ${qualified}`);
  }
  const escapedServer = qualified.slice(0, idx);
  const toolName = qualified.slice(idx + 2);
  return {
    serverName: unescapeServerName(escapedServer),
    toolName,
  };
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
  /** Active Alexi session id to pass as ALEXI_SESSION_ID */
  sessionId?: string;
}

interface ToolCache {
  tools: McpToolInfo[];
  timestamp: number;
}

const CACHE_TTL_MS = 30000; // 30 seconds
const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60000; // 60 seconds
const MAX_PAGES = 100; // Safety cap for paginated tools/list

/**
 * Format a single MCP content part into a string suitable for the model.
 *
 * - `text` parts pass through their text verbatim.
 * - `image` parts render as `[image: <mime>, <bytes> bytes omitted]` so the
 *   model knows an image was returned without flooding context with base64.
 * - `resource` parts render as `[resource: <uri>]` so the model can reference
 *   the file/URI that was returned.
 * - Any other type falls back to `JSON.stringify(part)` to avoid silent loss.
 */
export function formatContentPart(part: unknown): string {
  const p = part as {
    type?: string;
    text?: string;
    mimeType?: string;
    data?: string;
    uri?: string;
    resource?: { uri?: string };
  };
  switch (p.type) {
    case 'text':
      return typeof p.text === 'string' ? p.text : '';
    case 'image': {
      const mime = p.mimeType ?? 'unknown';
      const bytes = typeof p.data === 'string' ? Math.floor((p.data.length * 3) / 4) : 0;
      return `[image: ${mime}, ${bytes} bytes omitted]`;
    }
    case 'resource': {
      const uri = p.resource?.uri ?? p.uri ?? 'unknown';
      return `[resource: ${uri}]`;
    }
    default:
      return JSON.stringify(part);
  }
}

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
   *
   * Also normalizes object schemas that omit `properties` to an empty object,
   * because OpenAI-shaped function-tool registration (used by SAP AI Core
   * deployments) rejects the entire `tools` payload when an object schema
   * lacks `properties`. Spec-compliant MCP servers (e.g. the official
   * `@modelcontextprotocol/server-time`) emit `{ type: 'object' }` with no
   * `properties` for zero-arg tools; without this fix the whole server
   * silently disables for that session. See opencode `25cb2be6`.
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
      logger.warn(
        `MCP tool schema parsing failed for ${tool.name} from ${serverName}, using permissive fallback:`,
        error
      );
      inputSchema = {
        type: 'object',
        properties: {},
      };
    }

    // Default `properties` to `{}` when the schema declares an object type but
    // omits it. We deliberately do NOT rewrite schemas that already have
    // `properties` set (even to a truthy non-object value) — those are the
    // user's responsibility.
    const schemaType = (inputSchema as { type?: unknown }).type;
    const isObjectType =
      schemaType === 'object' || (Array.isArray(schemaType) && schemaType.includes('object'));
    if (isObjectType && (inputSchema as { properties?: unknown }).properties === undefined) {
      inputSchema = { ...inputSchema, properties: {} };
    }

    return {
      name: tool.name,
      description: tool.description,
      inputSchema,
      serverName,
      qualifiedName: buildQualifiedName(serverName, tool.name),
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
      logger.info(`Connected to MCP server: ${config.name} (${connection.tools.length} tools)`);

      return connection;
    } catch (error) {
      connection.status = 'error';
      connection.error = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to connect to MCP server ${config.name}:`, connection.error);
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
    // ALEXI_PROJECT_DIR, ALEXI_SESSION_ID and ALEXICODE are injected before user
    // config.env so users can override them (last-write semantics).
    const env = {
      ...process.env,
      ALEXI_PROJECT_DIR: options?.workdir ?? process.cwd(),
      ALEXI_SESSION_ID: options?.sessionId ?? '',
      ALEXICODE: '1',
      ...resolveEnvVars(config.env),
    };

    // Resolve optional working directory for the stdio server. Relative
    // paths are resolved against options.workdir (or process.cwd() if
    // not supplied). When undefined, the cwd key is omitted so the child
    // inherits the parent process cwd (preserves prior behaviour).
    const baseDir = options?.workdir ?? process.cwd();
    const resolvedCwd = config.cwd
      ? path.isAbsolute(config.cwd)
        ? config.cwd
        : path.resolve(baseDir, config.cwd)
      : undefined;

    const spawnOptions: Parameters<typeof spawn>[2] = {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    };
    if (resolvedCwd !== undefined) {
      spawnOptions.cwd = resolvedCwd;
    }

    // Spawn the MCP server process
    const proc = spawn(config.command, config.args || [], spawnOptions);

    connection.process = proc;

    // Handle process errors
    proc.on('error', (error) => {
      connection.status = 'error';
      connection.error = error.message;
    });

    proc.on('exit', (code) => {
      if (connection.status === 'connected') {
        connection.status = 'disconnected';
        logger.info(`MCP server ${config.name} exited with code ${code}`);
      }
    });

    // Log stderr for debugging
    proc.stderr?.on('data', (data) => {
      logger.warn(`[${config.name}] ${data.toString()}`);
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
      logger.warn(`Error closing MCP client ${name}:`, error);
    }

    if (connection.process) {
      connection.process.kill();
    }

    this.connections.delete(name);
    logger.info(`Disconnected from MCP server: ${name}`);
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
          logger.warn(`Failed to initialize MCP server ${server.name}:`, error);
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
        logger.warn(`MCP initialization: ${successful} connected, ${failed} failed`);
      } else {
        logger.info(`MCP initialization: ${successful} server(s) connected`);
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
      logger.error(`Failed to refresh tools from ${serverName}:`, error);
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

      // Per the MCP spec, `content` is the canonical narrated output and
      // `structuredContent` is a supplementary machine-readable payload.
      // Prefer non-empty `content` so we preserve images, resource links,
      // and mixed text+resource arrays from servers (Playwright, Qt Creator,
      // Codex wrappers) that emit BOTH fields. Fall back to the
      // `structuredContent` stringify path only when `content` is missing
      // or empty -- spec-compliant servers that emit ONLY `structuredContent`
      // (zero-arg tools, pure data results) still work via the fallback.
      const rawContent = (result as { content?: unknown }).content;
      if (Array.isArray(rawContent) && rawContent.length > 0) {
        // Extract content from result, preserving non-text parts as compact
        // placeholders so the model can reason about structured failures
        // (e.g. an MCP error that returns text + a `resource` link to the
        // offending file). Spec-compliant MCP servers routinely return mixed
        // content arrays; filtering them to text-only loses critical context.
        const flattened = (rawContent as unknown[]).map(formatContentPart).join('\n');

        if (result.isError) {
          return { success: false, error: flattened || 'Unknown error' };
        }

        return { success: true, result: flattened };
      }

      const structured = (result as { structuredContent?: unknown }).structuredContent;
      if (structured !== undefined && structured !== null) {
        const text = typeof structured === 'string' ? structured : JSON.stringify(structured);
        if (result.isError) {
          return { success: false, error: text || 'Unknown error' };
        }
        return { success: true, result: text };
      }

      // Neither content nor structuredContent present — return empty result
      // (preserves prior behaviour where empty content flattened to '').
      if (result.isError) {
        return { success: false, error: 'Unknown error' };
      }
      return { success: true, result: '' };
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
   * Look up a connected tool by its qualified name.
   *
   * Returns the owning connection and the {@link McpToolInfo} entry, or
   * `undefined` if no connected server currently exposes that tool.
   */
  getToolByQualifiedName(
    qualified: string
  ): { connection: McpConnection; tool: McpToolInfo } | undefined {
    let parsed: { serverName: string; toolName: string };
    try {
      parsed = parseQualifiedName(qualified);
    } catch {
      return undefined;
    }
    const connection = this.connections.get(parsed.serverName);
    if (!connection || connection.status !== 'connected') {
      return undefined;
    }
    const tool = connection.tools.find((t) => t.name === parsed.toolName);
    if (!tool) {
      return undefined;
    }
    return { connection, tool };
  }

  /**
   * Call a tool identified by its qualified name (`serverName::toolName`).
   *
   * Delegates to {@link callTool} once the qualified name has been resolved.
   * Existing callers using `callTool(serverName, toolName, args)` are
   * unaffected.
   */
  async callToolByQualified(
    qualified: string,
    args: Record<string, unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const entry = this.getToolByQualifiedName(qualified);
    if (!entry) {
      return { success: false, error: `Tool not found: ${qualified}` };
    }
    return this.callTool(entry.connection.config.name, entry.tool.name, args);
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
