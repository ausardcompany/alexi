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
const mockClientCallTool = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  return {
    Client: class MockClient {
      connect = mockClientConnect;
      listTools = mockClientListTools;
      callTool = mockClientCallTool;
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

describe('MCP Tool Call Timeout', () => {
  let manager: McpClientManager;
  const originalEnv = process.env;

  const stdioConfig: McpServerConfig = {
    name: 'test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    process.env = { ...originalEnv };
    delete process.env.MCP_TOOL_TIMEOUT;
  });

  afterEach(async () => {
    vi.useRealTimers();
    await manager.disconnectAll();
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('callTool timeout', () => {
    it('should time out after default duration (60s)', async () => {
      // Set up connection
      await manager.connect(stdioConfig);

      // Make callTool hang indefinitely
      mockClientCallTool.mockImplementation(
        (_params: unknown, _schema: unknown, options?: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        }
      );

      const resultPromise = manager.callTool('test-server', 'some-tool', { arg: 'value' });

      // Advance time past default timeout (60s)
      await vi.advanceTimersByTimeAsync(60000);

      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toBe('MCP tool call timed out after 60000ms');
    });

    it('should use per-server config timeout', async () => {
      const configWithTimeout: McpServerConfig = {
        ...stdioConfig,
        name: 'timeout-server',
        timeout: 5000,
      };

      await manager.connect(configWithTimeout);

      mockClientCallTool.mockImplementation(
        (_params: unknown, _schema: unknown, options?: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        }
      );

      const resultPromise = manager.callTool('timeout-server', 'some-tool', {});

      // Advance time past configured timeout (5s)
      await vi.advanceTimersByTimeAsync(5000);

      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toBe('MCP tool call timed out after 5000ms');
    });

    it('should use MCP_TOOL_TIMEOUT env var when no per-server config', async () => {
      process.env.MCP_TOOL_TIMEOUT = '10000';

      await manager.connect(stdioConfig);

      mockClientCallTool.mockImplementation(
        (_params: unknown, _schema: unknown, options?: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        }
      );

      const resultPromise = manager.callTool('test-server', 'some-tool', {});

      // Advance time past env timeout (10s)
      await vi.advanceTimersByTimeAsync(10000);

      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toBe('MCP tool call timed out after 10000ms');
    });

    it('should prefer per-server config over MCP_TOOL_TIMEOUT env var', async () => {
      process.env.MCP_TOOL_TIMEOUT = '30000';

      const configWithTimeout: McpServerConfig = {
        ...stdioConfig,
        name: 'priority-server',
        timeout: 3000,
      };

      await manager.connect(configWithTimeout);

      mockClientCallTool.mockImplementation(
        (_params: unknown, _schema: unknown, options?: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        }
      );

      const resultPromise = manager.callTool('priority-server', 'some-tool', {});

      // Advance past per-server timeout (3s), but before env timeout (30s)
      await vi.advanceTimersByTimeAsync(3000);

      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toBe('MCP tool call timed out after 3000ms');
    });

    it('should succeed when call completes within timeout', async () => {
      await manager.connect(stdioConfig);

      mockClientCallTool.mockResolvedValue({
        content: [{ type: 'text', text: 'success result' }],
        isError: false,
      });

      const result = await manager.callTool('test-server', 'some-tool', { arg: 'value' });
      expect(result.success).toBe(true);
      expect(result.result).toBe('success result');
    });

    it('should return correct error message format on timeout', async () => {
      const configWithTimeout: McpServerConfig = {
        ...stdioConfig,
        name: 'format-server',
        timeout: 15000,
      };

      await manager.connect(configWithTimeout);

      mockClientCallTool.mockImplementation(
        (_params: unknown, _schema: unknown, options?: { signal?: AbortSignal }) => {
          return new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        }
      );

      const resultPromise = manager.callTool('format-server', 'some-tool', {});
      await vi.advanceTimersByTimeAsync(15000);

      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^MCP tool call timed out after \d+ms$/);
    });
  });

  describe('connect handshake timeout', () => {
    it('should pass timeout to client.connect()', async () => {
      const configWithTimeout: McpServerConfig = {
        ...stdioConfig,
        name: 'connect-timeout-server',
        timeout: 20000,
      };

      await manager.connect(configWithTimeout);

      expect(mockClientConnect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeout: 20000 })
      );
    });

    it('should use default startup timeout for connect when no config timeout', async () => {
      await manager.connect(stdioConfig);

      expect(mockClientConnect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeout: 30000 })
      );
    });

    it('should use MCP_TOOL_TIMEOUT env var for connect timeout', async () => {
      process.env.MCP_TOOL_TIMEOUT = '25000';

      await manager.connect(stdioConfig);

      expect(mockClientConnect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeout: 25000 })
      );
    });
  });
});
