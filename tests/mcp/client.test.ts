import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { McpClientManager } from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

// Mock child_process spawn
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock the MCP SDK client
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  class MockClient {
    connect = vi.fn().mockResolvedValue(undefined);
    listTools = vi.fn().mockResolvedValue({ tools: [] });
    close = vi.fn().mockResolvedValue(undefined);
  }
  return { Client: MockClient };
});

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => {
  class MockStdioClientTransport {}
  return { StdioClientTransport: MockStdioClientTransport };
});

describe('McpClientManager', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();

    // Setup mock spawn to return a fake child process
    mockSpawn.mockReturnValue({
      on: vi.fn(),
      stderr: { on: vi.fn() },
      stdout: { on: vi.fn() },
      stdin: { on: vi.fn() },
      kill: vi.fn(),
      pid: 12345,
    });
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  describe('connectStdio', () => {
    it('should pass ALEXI_PROJECT_DIR environment variable to spawned process', async () => {
      const config: McpServerConfig = {
        name: 'test-server',
        transport: 'stdio',
        command: 'node',
        args: ['test-server.js'],
        enabled: true,
        autoConnect: false,
      };

      await manager.connect(config);

      expect(mockSpawn).toHaveBeenCalledTimes(1);
      const [, , spawnOptions] = mockSpawn.mock.calls[0] as [
        string,
        string[],
        { env: Record<string, string> },
      ];
      expect(spawnOptions.env).toHaveProperty('ALEXI_PROJECT_DIR');
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(process.cwd());
    });

    it('should include ALEXI_PROJECT_DIR alongside resolved config env vars', async () => {
      process.env.TEST_TOKEN = 'my-secret-token';

      const config: McpServerConfig = {
        name: 'test-server-with-env',
        transport: 'stdio',
        command: 'node',
        args: ['test-server.js'],
        env: {
          API_TOKEN: '${TEST_TOKEN}',
          STATIC_VAR: 'static-value',
        },
        enabled: true,
        autoConnect: false,
      };

      await manager.connect(config);

      expect(mockSpawn).toHaveBeenCalledTimes(1);
      const [, , spawnOptions] = mockSpawn.mock.calls[0] as [
        string,
        string[],
        { env: Record<string, string> },
      ];
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(process.cwd());
      expect(spawnOptions.env.API_TOKEN).toBe('my-secret-token');
      expect(spawnOptions.env.STATIC_VAR).toBe('static-value');

      delete process.env.TEST_TOKEN;
    });

    it('should set ALEXI_PROJECT_DIR to process.cwd()', async () => {
      const cwd = process.cwd();

      const config: McpServerConfig = {
        name: 'test-cwd-server',
        transport: 'stdio',
        command: 'echo',
        args: [],
        enabled: true,
        autoConnect: false,
      };

      await manager.connect(config);

      const [, , spawnOptions] = mockSpawn.mock.calls[0] as [
        string,
        string[],
        { env: Record<string, string> },
      ];
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(cwd);
    });
  });
});
