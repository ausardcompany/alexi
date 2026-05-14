import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn
const mockSpawn = vi.hoisted(() => vi.fn());
vi.mock('child_process', () => ({
  spawn: mockSpawn,
}));

// Mock the MCP SDK client
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  return {
    Client: class MockClient {
      connect = vi.fn().mockResolvedValue(undefined);
      listTools = vi.fn().mockResolvedValue({ tools: [] });
      close = vi.fn().mockResolvedValue(undefined);
    },
  };
});

// Mock the MCP SDK stdio transport
vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: class MockTransport {},
}));

// Mock loadMcpConfig and resolveEnvVars
const mockResolveEnvVars = vi.hoisted(() => vi.fn((env?: Record<string, string>) => env || {}));
vi.mock('../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: mockResolveEnvVars,
}));

import { McpClientManager } from '../src/mcp/client.js';
import type { McpServerConfig } from '../src/mcp/config.js';

describe('McpClientManager', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    manager = new McpClientManager();
    mockSpawn.mockReset();
    mockResolveEnvVars.mockImplementation((env?: Record<string, string>) => env || {});

    // Create a mock child process
    const mockProc = new EventEmitter() as EventEmitter & {
      stdin: NodeJS.WritableStream;
      stdout: NodeJS.ReadableStream;
      stderr: EventEmitter;
      kill: () => void;
    };
    mockProc.stdin = new EventEmitter() as unknown as NodeJS.WritableStream;
    mockProc.stdout = new EventEmitter() as unknown as NodeJS.ReadableStream;
    mockProc.stderr = new EventEmitter();
    mockProc.kill = vi.fn();

    mockSpawn.mockReturnValue(mockProc);
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  describe('connectStdio - ALEXI_PROJECT_DIR', () => {
    it('should pass ALEXI_PROJECT_DIR set to process.cwd() in the spawned env', async () => {
      const config: McpServerConfig = {
        name: 'test-server',
        description: 'Test server',
        transport: 'stdio',
        command: 'node',
        args: ['test-server.js'],
        enabled: true,
        autoConnect: true,
      };

      await manager.connect(config);

      // Verify spawn was called
      expect(mockSpawn).toHaveBeenCalledTimes(1);

      // Get the env passed to spawn
      const spawnArgs = mockSpawn.mock.calls[0];
      const spawnOptions = spawnArgs[2] as { env: Record<string, string> };

      // Verify ALEXI_PROJECT_DIR is set to process.cwd()
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(process.cwd());
    });

    it('should include ALEXI_PROJECT_DIR alongside config env vars', async () => {
      mockResolveEnvVars.mockReturnValue({ CUSTOM_VAR: 'custom-value' });

      const config: McpServerConfig = {
        name: 'test-server-env',
        description: 'Test server with env',
        transport: 'stdio',
        command: 'node',
        args: ['test-server.js'],
        env: { CUSTOM_VAR: 'custom-value' },
        enabled: true,
        autoConnect: true,
      };

      await manager.connect(config);

      const spawnArgs = mockSpawn.mock.calls[0];
      const spawnOptions = spawnArgs[2] as { env: Record<string, string> };

      // ALEXI_PROJECT_DIR should be present
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(process.cwd());
      // Config env vars should also be present
      expect(spawnOptions.env.CUSTOM_VAR).toBe('custom-value');
    });

    it('should not allow config env to override ALEXI_PROJECT_DIR', async () => {
      // resolveEnvVars returns whatever is in config.env, so if someone
      // tries to set ALEXI_PROJECT_DIR in config, our code should override it
      // because ALEXI_PROJECT_DIR comes after resolveEnvVars spread
      mockResolveEnvVars.mockReturnValue({
        ALEXI_PROJECT_DIR: '/some/other/path',
      });

      const config: McpServerConfig = {
        name: 'test-override',
        transport: 'stdio',
        command: 'node',
        args: [],
        env: { ALEXI_PROJECT_DIR: '/some/other/path' },
        enabled: true,
      };

      await manager.connect(config);

      const spawnArgs = mockSpawn.mock.calls[0];
      const spawnOptions = spawnArgs[2] as { env: Record<string, string> };

      // Our explicit ALEXI_PROJECT_DIR should win over config env
      expect(spawnOptions.env.ALEXI_PROJECT_DIR).toBe(process.cwd());
    });
  });
});
