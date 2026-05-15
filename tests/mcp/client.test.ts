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
});
