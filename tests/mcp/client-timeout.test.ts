import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/client
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientCallTool = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/client', () => {
  return {
    Client: class MockClient {
      connect = mockClientConnect;
      listTools = mockClientListTools;
      callTool = mockClientCallTool;
      close = mockClientClose;
    },
  };
});

vi.mock('@modelcontextprotocol/client/stdio', () => ({
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
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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
      expect(result.error).toMatch(/^MCP callTool timed out after 60000ms /);
      expect(result.error).toContain("(request timeout for server 'test-server')");
      expect(result.error).toContain("increase 'timeout.request' in mcp-servers.json");
    });

    it('should use per-server config timeout', async () => {
      const configWithTimeout: McpServerConfig = {
        ...stdioConfig,
        name: 'timeout-server',
        timeout: 5000,
      };

      await manager.connect(configWithTimeout);

      mockClientCallTool.mockImplementation(
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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
      expect(result.error).toMatch(/^MCP callTool timed out after 5000ms /);
      expect(result.error).toContain("(request timeout for server 'timeout-server')");
    });

    it('should use MCP_TOOL_TIMEOUT env var when no per-server config', async () => {
      process.env.MCP_TOOL_TIMEOUT = '10000';

      await manager.connect(stdioConfig);

      mockClientCallTool.mockImplementation(
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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
      expect(result.error).toMatch(/^MCP callTool timed out after 10000ms /);
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
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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
      expect(result.error).toMatch(/^MCP callTool timed out after 3000ms /);
      expect(result.error).toContain("(request timeout for server 'priority-server')");
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
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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
      expect(result.error).toMatch(/^MCP callTool timed out after 15000ms /);
      expect(result.error).toContain("(request timeout for server 'format-server')");
      expect(result.error).toContain("increase 'timeout.request' in mcp-servers.json");
    });
  });

  describe('per-server independence', () => {
    // Issue #1532: a slow MCP server must not block callTool on a fast
    // server. Each server owns its own timeout budget (AbortController)
    // and the fast server's response must be delivered on schedule
    // regardless of how long the slow server hangs.
    it('slow server times out independently without blocking fast server', async () => {
      const fastConfig: McpServerConfig = {
        ...stdioConfig,
        name: 'fast-server',
        timeout: 5000,
      };
      const slowConfig: McpServerConfig = {
        ...stdioConfig,
        name: 'slow-server',
        timeout: 30000,
      };

      await manager.connect(fastConfig);
      await manager.connect(slowConfig);

      // The mock is shared across clients (both connections share the
      // same `mockClientCallTool`). Route behaviour by the tool name so
      // the fast server responds immediately while the slow one hangs
      // until its own signal aborts.
      mockClientCallTool.mockImplementation(
        (params: { name: string }, options?: { signal?: AbortSignal }) => {
          if (params.name === 'fast-tool') {
            return Promise.resolve({
              content: [{ type: 'text', text: 'fast ok' }],
              isError: false,
            });
          }
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

      // Fire both calls concurrently. The fast call must resolve while
      // the slow one is still pending the 30s deadline.
      const fastPromise = manager.callTool('fast-server', 'fast-tool', {});
      const slowPromise = manager.callTool('slow-server', 'slow-tool', {});

      // The fast call completes without any timer advance (microtask
      // flush is enough). This is the critical assertion: a slow peer
      // with a 30s budget must not delay a fast peer's response.
      const fastResult = await fastPromise;
      expect(fastResult.success).toBe(true);
      expect(fastResult.result).toBe('fast ok');

      // The slow call is still pending — its 30s budget has NOT
      // elapsed. Fast server's completion did not force the slow one
      // to abort early.
      let slowResolved = false;
      void slowPromise.then(() => {
        slowResolved = true;
      });
      // Drain any pending microtasks without advancing timers.
      await Promise.resolve();
      expect(slowResolved).toBe(false);

      // Advance past the slow server's independent 30s budget. Only
      // now does it trip.
      await vi.advanceTimersByTimeAsync(30000);
      const slowResult = await slowPromise;
      expect(slowResult.success).toBe(false);
      expect(slowResult.error).toMatch(/^MCP callTool timed out after 30000ms /);
      expect(slowResult.error).toContain("(request timeout for server 'slow-server')");
    });

    // Issue #1532: when a server declares no `timeout` field, the manager
    // must fall through to the next precedence layer and preserve the
    // pre-existing 60s default (no breaking change).
    it('falls back to the 60s default when per-server timeout is not specified', async () => {
      const noTimeoutConfig: McpServerConfig = {
        ...stdioConfig,
        name: 'default-server',
      };

      await manager.connect(noTimeoutConfig);

      mockClientCallTool.mockImplementation(
        (_params: unknown, options?: { signal?: AbortSignal }) => {
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

      const resultPromise = manager.callTool('default-server', 'some-tool', {});

      // At 59s the call must still be pending — the 60s default has
      // not elapsed yet.
      await vi.advanceTimersByTimeAsync(59000);
      let resolved = false;
      void resultPromise.then(() => {
        resolved = true;
      });
      await Promise.resolve();
      expect(resolved).toBe(false);

      // Advance the last second to cross the 60s boundary.
      await vi.advanceTimersByTimeAsync(1000);
      const result = await resultPromise;
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^MCP callTool timed out after 60000ms /);
      expect(result.error).toContain("(request timeout for server 'default-server')");
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

    it('should use default startup timeout (3s) for connect when no config timeout', async () => {
      await manager.connect(stdioConfig);

      // Issue #1339: hung-server guard — default startup shrunk 30s -> 3s.
      expect(mockClientConnect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeout: 3000 })
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
