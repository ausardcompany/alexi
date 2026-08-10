/**
 * MCP timeout lifecycle tests.
 *
 * Covers the audit gap tracked in issue #1190: every MCP client method
 * (metadata fetches AND tool calls) must honour the per-server `request`
 * timeout, and `client.connect()` must honour the per-server `startup`
 * timeout. Failure messages must name the exceeded bound and point at the
 * exact `mcp-servers.json` field to change so operators know how to raise
 * it.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/client
const mockClientConnect = vi.fn();
const mockClientListTools = vi.fn();
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
  proc.pid = 42;
  return proc;
}

/**
 * Build a hang-until-aborted mock for any SDK method that accepts a
 * `RequestOptions`-shaped second arg. The returned promise rejects with an
 * `AbortError` as soon as the signal fires, which is exactly the shape the
 * SDK produces when a caller-supplied signal aborts.
 */
function hangUntilAborted() {
  return (_params: unknown, options?: { signal?: AbortSignal }) =>
    new Promise((_resolve, reject) => {
      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        });
      }
    });
}

const baseConfig: McpServerConfig = {
  name: 'lifecycle-server',
  transport: 'stdio',
  command: 'node',
  args: ['server.js'],
  enabled: true,
};

describe('MCP timeout lifecycle', () => {
  let manager: McpClientManager;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    mockClientConnect.mockResolvedValue(undefined);
    mockClientListTools.mockResolvedValue({ tools: [] });
    process.env = { ...originalEnv };
    delete process.env.MCP_TOOL_TIMEOUT;
  });

  afterEach(async () => {
    vi.useRealTimers();
    await manager.disconnectAll();
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('startup phase', () => {
    it('hung server (no initialize response) is failed after the 3s default cap', async () => {
      // Issue #1339: with the default DEFAULT_STARTUP_TIMEOUT_MS at 3000ms,
      // a server that never responds to initialize must fail within ~3s
      // instead of blocking session creation for 30s (previous default).
      mockClientConnect.mockImplementation(hangUntilAborted());

      const cfg: McpServerConfig = { ...baseConfig, name: 'hung-default' };

      const t0 = Date.now();
      const connectPromise = manager.connect(cfg);
      await vi.advanceTimersByTimeAsync(3000);
      const connection = await connectPromise;
      const elapsed = Date.now() - t0;

      expect(connection.status).toBe('failed');
      expect(connection.error).toMatch(/^MCP connect timed out after 3000ms /);
      expect(connection.error).toContain("(startup timeout for server 'hung-default')");
      expect(connection.error).toContain("increase 'timeout.startup' in mcp-servers.json");
      // Fake-timer clock advances exactly by the amount we ticked; sanity
      // check that the timeout was tripped by the 3s budget, not something
      // larger. Anything under 4000ms is acceptable.
      expect(elapsed).toBeLessThan(4000);
    });

    it('configured startup timeout overrides the 3s default', async () => {
      // A server that legitimately needs 10s to start (JVM-based like
      // Oracle SQLcl, or a first-time `npx -y` cold install) must be
      // able to opt out of the aggressive default via `timeout.startup`.
      // With `timeout: { startup: 10000 }`, a connect that would trip
      // after 3s (default) must instead succeed after ~5s.
      mockClientConnect.mockImplementation(async (_transport, options) => {
        // Simulate a 5s-slow initialize that respects the caller signal.
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => resolve(), 5000);
          const signal = (options as { signal?: AbortSignal } | undefined)?.signal;
          if (signal) {
            signal.addEventListener('abort', () => {
              clearTimeout(timer);
              const err = new Error('The operation was aborted');
              err.name = 'AbortError';
              reject(err);
            });
          }
        });
      });

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'slow-cold-start',
        timeout: { startup: 10000 },
      };

      const connectPromise = manager.connect(cfg);
      // Advance past the 3s default (which must NOT trip) and up to the
      // 5s the simulated server needs.
      await vi.advanceTimersByTimeAsync(5000);
      const connection = await connectPromise;

      expect(connection.status).toBe('connected');
      expect(connection.error).toBeUndefined();
      // Confirm the SDK was called with the raised 10s budget, not the
      // 3s default.
      expect(mockClientConnect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ timeout: 10000 })
      );
    });

    it('multiple slow servers stay under an aggregate deadline with the 3s cap', async () => {
      // Three hung servers connected in parallel must each hit the 3s
      // default independently. Aggregate wall-clock (fake-timer) must
      // stay well under 10s because Promise.all lets them share the
      // same clock window rather than serialising 3 x 3s.
      mockClientConnect.mockImplementation(hangUntilAborted());

      const cfgs: McpServerConfig[] = [
        { ...baseConfig, name: 'slow-1' },
        { ...baseConfig, name: 'slow-2' },
        { ...baseConfig, name: 'slow-3' },
      ];

      const t0 = Date.now();
      const connectPromise = Promise.all(cfgs.map((c) => manager.connect(c)));
      await vi.advanceTimersByTimeAsync(3000);
      const connections = await connectPromise;
      const elapsed = Date.now() - t0;

      // All three must have failed with the same actionable message.
      for (const conn of connections) {
        expect(conn.status).toBe('failed');
        expect(conn.error).toMatch(/^MCP connect timed out after 3000ms /);
        expect(conn.error).toContain("increase 'timeout.startup' in mcp-servers.json");
      }
      // Aggregate window: 3 hung servers connected in parallel must
      // resolve within a single 3s budget, not 9s. 10s is a generous
      // upper bound catching any accidental serialization regression.
      expect(elapsed).toBeLessThan(10000);
    });

    it('aborts client.connect() when the startup budget elapses and names the bound', async () => {
      // Make the SDK connect hang until its signal aborts.
      mockClientConnect.mockImplementation(hangUntilAborted());

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'startup-slow',
        timeout: { startup: 4000, request: 60000 },
      };

      const connectPromise = manager.connect(cfg);
      await vi.advanceTimersByTimeAsync(4000);
      const connection = await connectPromise;

      expect(connection.status).toBe('failed');
      expect(connection.error).toMatch(/^MCP connect timed out after 4000ms /);
      expect(connection.error).toContain("(startup timeout for server 'startup-slow')");
      expect(connection.error).toContain("increase 'timeout.startup' in mcp-servers.json");
    });

    it('does NOT charge the startup message when only the request phase times out', async () => {
      // Startup succeeds instantly, but tools/list hangs.
      mockClientConnect.mockResolvedValue(undefined);
      mockClientListTools.mockImplementation(hangUntilAborted());

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'req-slow',
        timeout: { startup: 30000, request: 1500 },
      };

      const connectPromise = manager.connect(cfg);
      await vi.advanceTimersByTimeAsync(1500);
      const connection = await connectPromise;

      expect(connection.status).toBe('failed');
      // The failing phase is a metadata request, not the handshake, so the
      // message must call out `request` / `timeout.request` — not `startup`.
      expect(connection.error).toMatch(/^MCP tools\/list timed out after 1500ms /);
      expect(connection.error).toContain("(request timeout for server 'req-slow')");
      expect(connection.error).toContain("increase 'timeout.request' in mcp-servers.json");
      expect(connection.error).not.toContain('startup timeout');
    });
  });

  describe('request phase - listAllTools pagination', () => {
    it('applies the request timeout to EACH page, not just the first', async () => {
      // Page 1 resolves fast; page 2 hangs until its signal aborts.
      let callCount = 0;
      mockClientListTools.mockImplementation(
        (_params: unknown, options?: { signal?: AbortSignal }) => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({
              tools: [{ name: 'fast-tool', inputSchema: { type: 'object', properties: {} } }],
              nextCursor: 'page-2',
            });
          }
          return new Promise((_resolve, reject) => {
            options?.signal?.addEventListener('abort', () => {
              const err = new Error('aborted');
              err.name = 'AbortError';
              reject(err);
            });
          });
        }
      );

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'paginated',
        timeout: { startup: 30000, request: 2000 },
      };

      const connectPromise = manager.connect(cfg);
      // First page returns instantly (microtask); advance for the second
      // page's timeout budget only.
      await vi.advanceTimersByTimeAsync(2000);
      const connection = await connectPromise;

      expect(connection.status).toBe('failed');
      expect(callCount).toBe(2);
      expect(connection.error).toMatch(/^MCP tools\/list timed out after 2000ms /);
      expect(connection.error).toContain("(request timeout for server 'paginated')");
    });

    it('produces the same rich error shape when refreshTools() page times out', async () => {
      // First, connect successfully with a single-page list.
      mockClientListTools.mockResolvedValueOnce({
        tools: [{ name: 'seed', inputSchema: { type: 'object', properties: {} } }],
      });

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'refresh-slow',
        timeout: { startup: 30000, request: 1000 },
      };

      const connectPromise = manager.connect(cfg);
      await vi.advanceTimersByTimeAsync(0);
      const connection = await connectPromise;
      expect(connection.status).toBe('connected');

      // Now refresh, and make listTools hang.
      mockClientListTools.mockImplementation(hangUntilAborted());

      // refreshTools swallows errors into logger.error; we detect the
      // timeout by inspecting the logger call.
      const { logger } = await import('../../src/utils/logger.js');
      const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

      const refreshPromise = manager.refreshTools('refresh-slow');
      await vi.advanceTimersByTimeAsync(1000);
      await refreshPromise;

      // logger.error(`Failed to refresh tools from ${name}:`, error)
      // The Error object is the second argument.
      const call = errorSpy.mock.calls.find(([msg]) =>
        String(msg).includes('Failed to refresh tools from refresh-slow')
      );
      expect(call).toBeDefined();
      const err = call![1] as Error;
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/^MCP tools\/list timed out after 1000ms /);
      expect(err.message).toContain("(request timeout for server 'refresh-slow')");
      expect(err.message).toContain("increase 'timeout.request' in mcp-servers.json");
    });
  });

  describe('request phase - callTool', () => {
    it('names the bound in callTool timeout errors', async () => {
      mockClientListTools.mockResolvedValueOnce({ tools: [] });

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'call-slow',
        timeout: { startup: 30000, request: 3000 },
      };
      await manager.connect(cfg);

      mockClientCallTool.mockImplementation(hangUntilAborted());

      const resultPromise = manager.callTool('call-slow', 'some-tool', {});
      await vi.advanceTimersByTimeAsync(3000);
      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^MCP callTool timed out after 3000ms /);
      expect(result.error).toContain("(request timeout for server 'call-slow')");
      expect(result.error).toContain("increase 'timeout.request' in mcp-servers.json");
    });

    it('preserves non-timeout errors verbatim (no false-positive timeout wrap)', async () => {
      mockClientListTools.mockResolvedValueOnce({ tools: [] });

      const cfg: McpServerConfig = {
        ...baseConfig,
        name: 'bad-server',
        timeout: { startup: 30000, request: 5000 },
      };
      await manager.connect(cfg);

      mockClientCallTool.mockRejectedValueOnce(new Error('server exploded'));

      const result = await manager.callTool('bad-server', 'boom', {});
      expect(result.success).toBe(false);
      expect(result.error).toBe('server exploded');
    });
  });

  describe('AbortSignal wiring', () => {
    it('passes an AbortSignal to every listTools page call', async () => {
      mockClientListTools.mockResolvedValueOnce({
        tools: [{ name: 't1', inputSchema: { type: 'object', properties: {} } }],
        nextCursor: 'c2',
      });
      mockClientListTools.mockResolvedValueOnce({
        tools: [{ name: 't2', inputSchema: { type: 'object', properties: {} } }],
      });

      const cfg: McpServerConfig = { ...baseConfig, name: 'signal-wired' };
      const connection = await manager.connect(cfg);
      expect(connection.status).toBe('connected');

      expect(mockClientListTools).toHaveBeenCalledTimes(2);
      for (const call of mockClientListTools.mock.calls) {
        // Second arg is a RequestOptions-shaped object with a signal.
        expect(call[1]).toEqual(expect.objectContaining({ signal: expect.any(AbortSignal) }));
      }
    });

    it('passes an AbortSignal to callTool', async () => {
      mockClientListTools.mockResolvedValueOnce({ tools: [] });
      const cfg: McpServerConfig = { ...baseConfig, name: 'call-signal' };
      await manager.connect(cfg);

      mockClientCallTool.mockResolvedValue({
        content: [{ type: 'text', text: 'ok' }],
        isError: false,
      });

      const result = await manager.callTool('call-signal', 'noop', {});
      expect(result.success).toBe(true);

      expect(mockClientCallTool).toHaveBeenCalledWith(
        { name: 'noop', arguments: {} },
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });
  });
});
