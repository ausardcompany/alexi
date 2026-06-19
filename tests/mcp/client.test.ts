import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/sdk
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
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
  StdioClientTransport: vi.fn().mockImplementation(() => ({})),
}));

// Mock config loading
vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
}));

import { McpClientManager } from '../../src/mcp/client.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
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

describe('McpClientManager', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    // `vi.restoreAllMocks` in afterEach wipes the StdioClientTransport
    // implementation, so reinstate it before each test. Use a regular
    // function so it can be invoked with `new`.
    vi.mocked(StdioClientTransport).mockImplementation(function () {
      return {} as unknown as InstanceType<typeof StdioClientTransport>;
    });
    mockClientConnect.mockResolvedValue(undefined);
    mockClientListTools.mockResolvedValue({ tools: [] });
    mockClientClose.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  const stdioConfig: McpServerConfig = {
    name: 'test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  describe('ALEXI_PROJECT_DIR injection', () => {
    it('should set ALEXI_PROJECT_DIR in child process env from options.workdir', async () => {
      await manager.connect(stdioConfig, { workdir: '/my/project/dir' });

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_PROJECT_DIR: '/my/project/dir',
          }),
        })
      );
    });

    it('should default ALEXI_PROJECT_DIR to process.cwd() when no workdir is provided', async () => {
      const cwd = process.cwd();

      await manager.connect(stdioConfig);

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_PROJECT_DIR: cwd,
          }),
        })
      );
    });

    it('should allow user-configured env in config.env to override ALEXI_PROJECT_DIR', async () => {
      const { resolveEnvVars } = await import('../../src/mcp/config.js');
      vi.mocked(resolveEnvVars).mockReturnValue({
        ALEXI_PROJECT_DIR: '/user/override/path',
      });

      const configWithEnv: McpServerConfig = {
        ...stdioConfig,
        env: { ALEXI_PROJECT_DIR: '/user/override/path' },
      };

      await manager.connect(configWithEnv, { workdir: '/my/project/dir' });

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_PROJECT_DIR: '/user/override/path',
          }),
        })
      );
    });

    it('should pass ALEXI_PROJECT_DIR to spawn env as well', async () => {
      const { resolveEnvVars } = await import('../../src/mcp/config.js');
      vi.mocked(resolveEnvVars).mockReturnValue({});

      await manager.connect(stdioConfig, { workdir: '/spawn/test/dir' });

      expect(mockSpawn).toHaveBeenCalledWith(
        'node',
        ['server.js'],
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_PROJECT_DIR: '/spawn/test/dir',
          }),
        })
      );
    });
  });

  describe('ALEXI_SESSION_ID and ALEXICODE injection', () => {
    it('should set ALEXI_SESSION_ID from options.sessionId and ALEXICODE=1', async () => {
      await manager.connect(stdioConfig, { sessionId: 'test-session-123' });

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_SESSION_ID: 'test-session-123',
            ALEXICODE: '1',
          }),
        })
      );
    });

    it('should default ALEXI_SESSION_ID to empty string when no sessionId is provided', async () => {
      await manager.connect(stdioConfig);

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_SESSION_ID: '',
            ALEXICODE: '1',
          }),
        })
      );
    });

    it('should pass ALEXI_SESSION_ID and ALEXICODE to spawn env as well', async () => {
      const { resolveEnvVars } = await import('../../src/mcp/config.js');
      vi.mocked(resolveEnvVars).mockReturnValue({});

      await manager.connect(stdioConfig, { sessionId: 'spawn-session-456' });

      expect(mockSpawn).toHaveBeenCalledWith(
        'node',
        ['server.js'],
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_SESSION_ID: 'spawn-session-456',
            ALEXICODE: '1',
          }),
        })
      );
    });

    it('should allow user-configured env to override ALEXI_SESSION_ID and ALEXICODE', async () => {
      const { resolveEnvVars } = await import('../../src/mcp/config.js');
      vi.mocked(resolveEnvVars).mockReturnValue({
        ALEXI_SESSION_ID: 'user-override-session',
        ALEXICODE: '0',
      });

      const configWithEnv: McpServerConfig = {
        ...stdioConfig,
        env: { ALEXI_SESSION_ID: 'user-override-session', ALEXICODE: '0' },
      };

      await manager.connect(configWithEnv, { sessionId: 'alexi-internal-id' });

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_SESSION_ID: 'user-override-session',
            ALEXICODE: '0',
          }),
        })
      );
    });

    it('should preserve ALEXI_PROJECT_DIR alongside ALEXI_SESSION_ID and ALEXICODE', async () => {
      const { resolveEnvVars } = await import('../../src/mcp/config.js');
      vi.mocked(resolveEnvVars).mockReturnValue({});

      await manager.connect(stdioConfig, {
        workdir: '/proj/dir',
        sessionId: 'sess-789',
      });

      expect(StdioClientTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            ALEXI_PROJECT_DIR: '/proj/dir',
            ALEXI_SESSION_ID: 'sess-789',
            ALEXICODE: '1',
          }),
        })
      );
    });
  });

  describe('inputSchema normalization', () => {
    it('should default missing properties to {} when schema type is "object"', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'get_current_time',
            description: 'Returns the current time',
            inputSchema: { type: 'object' },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.status).toBe('connected');
      expect(connection.tools).toHaveLength(1);
      expect(connection.tools[0].inputSchema).toEqual({
        type: 'object',
        properties: {},
      });
    });

    it('should default missing properties to {} when schema type array includes "object"', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'maybe_object',
            inputSchema: { type: ['object', 'null'] },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.tools[0].inputSchema).toEqual({
        type: ['object', 'null'],
        properties: {},
      });
    });

    it('should preserve existing properties when already set', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'has_props',
            inputSchema: {
              type: 'object',
              properties: { foo: { type: 'string' } },
              required: ['foo'],
            },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.tools[0].inputSchema).toEqual({
        type: 'object',
        properties: { foo: { type: 'string' } },
        required: ['foo'],
      });
    });

    it('should leave non-object schemas alone (no properties injected)', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'string_tool',
            inputSchema: { type: 'string' },
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.tools[0].inputSchema).toEqual({ type: 'string' });
      expect(
        (connection.tools[0].inputSchema as { properties?: unknown }).properties
      ).toBeUndefined();
    });

    it('should fall back to permissive default for malformed (non-object) schemas', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [
          {
            name: 'broken',
            inputSchema: null as unknown,
          },
        ],
      });

      const connection = await manager.connect(stdioConfig);

      expect(connection.tools[0].inputSchema).toEqual({
        type: 'object',
        properties: {},
      });
    });
  });
});
