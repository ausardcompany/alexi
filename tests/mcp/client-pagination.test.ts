import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/sdk
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  return {
    Client: class MockClient {
      connect = mockClientConnect;
      listTools = mockClientListTools;
      close = mockClientClose;
    },
  };
});

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function () {
    return {};
  }),
}));

// Mock config loading
vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
}));

import { McpClientManager } from '../../src/mcp/client.js';
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
  proc.pid = 12345;
  return proc;
}

describe('McpClientManager - Paginated tools/list', () => {
  let manager: McpClientManager;

  const stdioConfig: McpServerConfig = {
    name: 'test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  describe('single page (no cursor)', () => {
    it('should fetch all tools from a single page response', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'tool-a',
            description: 'Tool A',
            inputSchema: { type: 'object', properties: { x: { type: 'string' } } },
          },
          {
            name: 'tool-b',
            description: 'Tool B',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      expect(connection.tools).toHaveLength(2);
      expect(connection.tools[0].name).toBe('tool-a');
      expect(connection.tools[1].name).toBe('tool-b');
      expect(mockClientListTools).toHaveBeenCalledTimes(1);
      expect(mockClientListTools).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty tools list', async () => {
      mockClientListTools.mockResolvedValueOnce({ tools: [] });

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      expect(connection.tools).toHaveLength(0);
      expect(mockClientListTools).toHaveBeenCalledTimes(1);
    });
  });

  describe('multi-page (with nextCursor)', () => {
    it('should aggregate tools from multiple pages', async () => {
      // Page 1
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'tool-1',
            description: 'First page tool',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
        nextCursor: 'cursor-page-2',
      });
      // Page 2
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'tool-2',
            description: 'Second page tool',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
        nextCursor: 'cursor-page-3',
      });
      // Page 3 (last page, no cursor)
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'tool-3',
            description: 'Third page tool',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      expect(connection.tools).toHaveLength(3);
      expect(connection.tools[0].name).toBe('tool-1');
      expect(connection.tools[1].name).toBe('tool-2');
      expect(connection.tools[2].name).toBe('tool-3');
      expect(mockClientListTools).toHaveBeenCalledTimes(3);
      // First call has no cursor
      expect(mockClientListTools).toHaveBeenNthCalledWith(1, undefined);
      // Subsequent calls pass the cursor
      expect(mockClientListTools).toHaveBeenNthCalledWith(2, { cursor: 'cursor-page-2' });
      expect(mockClientListTools).toHaveBeenNthCalledWith(3, { cursor: 'cursor-page-3' });
    });

    it('should aggregate tools across pages in refreshTools()', async () => {
      // Initial connect with single page
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'initial-tool',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);
      expect(connection.tools).toHaveLength(1);

      // refreshTools with paginated response
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'refreshed-1',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
        nextCursor: 'refresh-cursor',
      });
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'refreshed-2',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      });

      await manager.refreshTools('test-server');

      const updatedConnection = manager.getConnection('test-server');
      expect(updatedConnection?.tools).toHaveLength(2);
      expect(updatedConnection?.tools[0].name).toBe('refreshed-1');
      expect(updatedConnection?.tools[1].name).toBe('refreshed-2');
    });
  });

  describe('safety cap (MAX_PAGES)', () => {
    it('should stop paginating after 100 pages to prevent infinite loops', async () => {
      // Set up mock to always return a cursor (infinite pagination)
      mockClientListTools.mockImplementation(() =>
        Promise.resolve({
          tools: [
            {
              name: 'tool',
              inputSchema: { type: 'object', properties: {} },
            },
          ],
          nextCursor: 'next',
        })
      );

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      // Should have fetched exactly 100 pages (MAX_PAGES)
      expect(mockClientListTools).toHaveBeenCalledTimes(100);
      expect(connection.tools).toHaveLength(100);
    });
  });

  describe('mapToolInfo - schema validation', () => {
    it('should use permissive fallback for tools with invalid schemas', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'bad-schema-tool',
            description: 'Has null schema',
            inputSchema: null,
          },
          {
            name: 'good-tool',
            description: 'Has valid schema',
            inputSchema: { type: 'object', properties: { foo: { type: 'string' } } },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      expect(connection.tools).toHaveLength(2);

      // Bad schema gets fallback
      expect(connection.tools[0].inputSchema).toEqual({
        type: 'object',
        properties: {},
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('MCP tool schema parsing failed for bad-schema-tool'),
        expect.anything()
      );

      // Good schema is preserved
      expect(connection.tools[1].inputSchema).toEqual({
        type: 'object',
        properties: { foo: { type: 'string' } },
      });

      consoleSpy.mockRestore();
    });

    it('should set serverName on all tools', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'tool-x',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.tools[0].serverName).toBe('test-server');
    });
  });
});
