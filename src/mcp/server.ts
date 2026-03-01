/**
 * MCP Server Adapter
 * Exposes existing tools as an MCP server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool as McpTool,
} from '@modelcontextprotocol/sdk/types.js';

import { getToolRegistry, type ToolContext } from '../tool/index.js';
import { registerBuiltInTools } from '../tool/tools/index.js';

export class McpServerAdapter {
  private server: Server;
  private context: ToolContext;

  constructor(options?: { workdir?: string }) {
    this.context = {
      workdir: options?.workdir || process.cwd(),
    };

    // Register built-in tools
    registerBuiltInTools();

    // Create MCP server
    this.server = new Server(
      {
        name: 'alexi',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    const registry = getToolRegistry();

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = registry.list();

      const mcpTools: McpTool[] = tools.map((tool) => {
        const schema = tool.toFunctionSchema();
        return {
          name: schema.name,
          description: schema.description,
          inputSchema: {
            type: 'object' as const,
            properties: (schema.parameters as any).properties || {},
            required: (schema.parameters as any).required || [],
          },
        };
      });

      return { tools: mcpTools };
    });

    // Execute a tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = registry.get(name);
      if (!tool) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Tool not found: ${name}`,
            },
          ],
          isError: true,
        };
      }

      try {
        const result = await tool.execute(args || {}, this.context);

        if (result.success) {
          return {
            content: [
              {
                type: 'text' as const,
                text:
                  typeof result.data === 'string'
                    ? result.data
                    : JSON.stringify(result.data, null, 2),
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text' as const,
                text: result.error || 'Unknown error',
              },
            ],
            isError: true,
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: error instanceof Error ? error.message : String(error),
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server started on stdio');
  }

  /**
   * Get the server instance for custom transports
   */
  getServer(): Server {
    return this.server;
  }
}

/**
 * Create and start an MCP server
 */
export async function createMcpServer(options?: {
  workdir?: string;
  autoStart?: boolean;
}): Promise<McpServerAdapter> {
  const adapter = new McpServerAdapter(options);

  if (options?.autoStart !== false) {
    await adapter.start();
  }

  return adapter;
}
