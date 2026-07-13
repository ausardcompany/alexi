import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn so no real server is spawned.
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Each mock server needs its own listTools response, keyed by construction
// order. The Client mock advances through the queue as connections are
// established.
const listToolsQueue: Array<Array<{ name: string; description?: string; inputSchema: unknown }>> =
  [];
const callToolByServer: Record<string, (name: string, args: unknown) => Promise<unknown>> = {};

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  return {
    Client: class MockClient {
      private toolList: Array<{ name: string; description?: string; inputSchema: unknown }>;
      private serverName = '';
      constructor() {
        this.toolList = listToolsQueue.shift() ?? [];
      }
      connect = vi.fn().mockResolvedValue(undefined);
      listTools = vi.fn().mockImplementation(async () => ({ tools: this.toolList }));
      close = vi.fn().mockResolvedValue(undefined);
      callTool = vi.fn().mockImplementation(async (req: { name: string; arguments: unknown }) => {
        const handler = callToolByServer[this.serverName];
        const result = handler ? await handler(req.name, req.arguments) : { result: 'ok' };
        return { content: [{ type: 'text', text: JSON.stringify(result) }] };
      });
      // Helper the test uses to associate this client with a server name
      // AFTER construction, since McpClientManager calls listTools right
      // after connect.
      _setServer(name: string): void {
        this.serverName = name;
      }
    },
  };
});

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function MockStdio() {
    return {};
  }),
}));

vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
}));

import {
  McpClientManager,
  escapeServerName,
  unescapeServerName,
  buildQualifiedName,
  parseQualifiedName,
} from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

function createMockProcess() {
  const proc = new EventEmitter() as EventEmitter & {
    stdin: EventEmitter;
    stdout: EventEmitter;
    stderr: EventEmitter;
    kill: ReturnType<typeof vi.fn>;
    pid: number;
  };
  proc.stdin = new EventEmitter();
  proc.stdout = new EventEmitter();
  proc.stderr = new EventEmitter();
  proc.kill = vi.fn();
  proc.pid = 4242;
  return proc;
}

function stdioConfig(name: string): McpServerConfig {
  return {
    name,
    transport: 'stdio',
    command: 'node',
    args: [],
    enabled: true,
    autoConnect: false,
  };
}

describe('MCP qualified tool names', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    listToolsQueue.length = 0;
    for (const key of Object.keys(callToolByServer)) {
      delete callToolByServer[key];
    }
    mockSpawn.mockImplementation(() => createMockProcess());
    manager = new McpClientManager();
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  describe('escapeServerName / unescapeServerName round-trip', () => {
    it('leaves plain ASCII names untouched', () => {
      expect(escapeServerName('filesystem')).toBe('filesystem');
      expect(unescapeServerName('filesystem')).toBe('filesystem');
    });

    it('escapes `:` as %3A', () => {
      expect(escapeServerName('foo:bar')).toBe('foo%3Abar');
      expect(unescapeServerName('foo%3Abar')).toBe('foo:bar');
    });

    it('escapes `%` first so %3A introduced by `:` is not double-escaped', () => {
      // Raw name contains %3A literally AND a `:`; the `:` becomes %3A,
      // but the pre-existing %3A must survive the round-trip.
      const raw = 'weird%3A:name';
      const escaped = escapeServerName(raw);
      expect(escaped).toBe('weird%253A%3Aname');
      expect(unescapeServerName(escaped)).toBe(raw);
    });

    it('round-trips names containing only `%`', () => {
      const raw = '100%pure';
      const escaped = escapeServerName(raw);
      expect(escaped).toBe('100%25pure');
      expect(unescapeServerName(escaped)).toBe(raw);
    });
  });

  describe('buildQualifiedName / parseQualifiedName', () => {
    it('joins server and tool with `::`', () => {
      expect(buildQualifiedName('fs', 'read')).toBe('fs::read');
    });

    it('preserves tool names containing `::` (server names are escaped)', () => {
      const qualified = buildQualifiedName('fs', 'ns::do::thing');
      expect(qualified).toBe('fs::ns::do::thing');
      const parsed = parseQualifiedName(qualified);
      expect(parsed.serverName).toBe('fs');
      expect(parsed.toolName).toBe('ns::do::thing');
    });

    it('unescapes `:` in the server name segment', () => {
      const qualified = buildQualifiedName('a:b', 'read');
      expect(qualified).toBe('a%3Ab::read');
      const parsed = parseQualifiedName(qualified);
      expect(parsed.serverName).toBe('a:b');
      expect(parsed.toolName).toBe('read');
    });

    it('unescapes `%` in the server name segment', () => {
      const qualified = buildQualifiedName('100%pure', 'read');
      const parsed = parseQualifiedName(qualified);
      expect(parsed.serverName).toBe('100%pure');
      expect(parsed.toolName).toBe('read');
    });

    it('throws when the input is missing the `::` separator', () => {
      expect(() => parseQualifiedName('no-separator')).toThrow(/Invalid qualified tool name/);
    });
  });

  describe('collision-free dispatch across servers', () => {
    it('surfaces two servers exposing the same tool name with distinct qualifiedName', async () => {
      const toolList = [
        { name: 'read', description: 'read file', inputSchema: { type: 'object' } },
      ];
      listToolsQueue.push(toolList);
      listToolsQueue.push(toolList);

      await manager.connect(stdioConfig('alpha'));
      await manager.connect(stdioConfig('beta'));

      const tools = manager.getAllTools();
      expect(tools).toHaveLength(2);

      const qualifiedNames = tools.map((t) => t.qualifiedName).sort();
      expect(qualifiedNames).toEqual(['alpha::read', 'beta::read']);
      // Raw name is unchanged so existing UI groupings keep working.
      expect(tools.every((t) => t.name === 'read')).toBe(true);
    });

    it('getToolByQualifiedName routes to the correct connection', async () => {
      const toolList = [{ name: 'read', inputSchema: { type: 'object' } }];
      listToolsQueue.push(toolList);
      listToolsQueue.push(toolList);

      await manager.connect(stdioConfig('alpha'));
      await manager.connect(stdioConfig('beta'));

      const alpha = manager.getToolByQualifiedName('alpha::read');
      const beta = manager.getToolByQualifiedName('beta::read');
      expect(alpha).toBeDefined();
      expect(beta).toBeDefined();
      expect(alpha?.connection.config.name).toBe('alpha');
      expect(beta?.connection.config.name).toBe('beta');
      expect(alpha?.tool.name).toBe('read');
      expect(beta?.tool.name).toBe('read');
    });

    it('getToolByQualifiedName returns undefined for unknown servers or tools', async () => {
      listToolsQueue.push([{ name: 'read', inputSchema: { type: 'object' } }]);
      await manager.connect(stdioConfig('alpha'));

      expect(manager.getToolByQualifiedName('missing::read')).toBeUndefined();
      expect(manager.getToolByQualifiedName('alpha::missing')).toBeUndefined();
      expect(manager.getToolByQualifiedName('not-qualified')).toBeUndefined();
    });
  });

  describe('server names containing separator characters', () => {
    it('round-trips a server name containing `:`', async () => {
      listToolsQueue.push([{ name: 'read', inputSchema: { type: 'object' } }]);
      await manager.connect(stdioConfig('kube:prod'));

      const [tool] = manager.getAllTools();
      expect(tool.qualifiedName).toBe('kube%3Aprod::read');

      const lookup = manager.getToolByQualifiedName(tool.qualifiedName);
      expect(lookup?.connection.config.name).toBe('kube:prod');
      expect(lookup?.tool.name).toBe('read');
    });

    it('round-trips a server name containing `%`', async () => {
      listToolsQueue.push([{ name: 'read', inputSchema: { type: 'object' } }]);
      await manager.connect(stdioConfig('100%pure'));

      const [tool] = manager.getAllTools();
      expect(tool.qualifiedName).toBe('100%25pure::read');

      const lookup = manager.getToolByQualifiedName(tool.qualifiedName);
      expect(lookup?.connection.config.name).toBe('100%pure');
    });

    it('round-trips a tool name containing `::`', async () => {
      listToolsQueue.push([{ name: 'ns::sub::action', inputSchema: { type: 'object' } }]);
      await manager.connect(stdioConfig('fs'));

      const [tool] = manager.getAllTools();
      expect(tool.qualifiedName).toBe('fs::ns::sub::action');

      const lookup = manager.getToolByQualifiedName(tool.qualifiedName);
      expect(lookup?.connection.config.name).toBe('fs');
      expect(lookup?.tool.name).toBe('ns::sub::action');
    });
  });
});
