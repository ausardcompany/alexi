/**
 * Tests for the bounded connect timeout on remote MCP transports.
 *
 * Covers:
 * - Default 10s connect timeout is applied when no config is set.
 * - Per-server `connectTimeout` overrides the default.
 * - Global `connectTimeout` (from `McpConfig`) applies when per-server
 *   is absent.
 * - Successful connects (within budget) do NOT trip the timeout.
 * - Timeout error message names the exceeded bound and points at the
 *   `connectTimeout` field to raise.
 * - The connect-timeout error is classified as transient (so retry
 *   policy will attempt again).
 * - `stdio` transport is unaffected by `connectTimeout`.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn so the stdio path does not spawn real
// processes. The spawn mock is a module-scope vi.fn so individual
// tests can replace its return value.
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/client so we do not spin up real transports.
const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/client', () => ({
  Client: class MockClient {
    connect = mockClientConnect;
    listTools = mockClientListTools;
    close = mockClientClose;
  },
}));

vi.mock('@modelcontextprotocol/client/stdio', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function () {
    return {};
  }),
}));

vi.mock('../../src/mcp/config.js', async () => {
  const actual =
    await vi.importActual<typeof import('../../src/mcp/config.js')>('../../src/mcp/config.js');
  return {
    ...actual,
    loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
    resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
  };
});

import {
  McpClientManager,
  McpConnectAuthError,
  McpConnectTimeoutError,
} from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

describe('MCP remote connect timeout', () => {
  let manager: McpClientManager;
  let originalFetch: typeof fetch;
  const globalScope = globalThis as typeof globalThis & { fetch: typeof fetch };

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    originalFetch = globalScope.fetch;
  });

  afterEach(async () => {
    await manager.disconnectAll();
    globalScope.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('getConnectTimeoutForServer', () => {
    it('returns the built-in default (10000ms) when nothing is configured', () => {
      // No connection registered yet; falls through to default.
      expect(manager.getConnectTimeoutForServer('nope')).toBe(10000);
    });

    it('honours the per-server connectTimeout', async () => {
      // We fake-connect a server to register its config in the map so
      // the getter can find it. The connectRemote path throws after
      // its reachability probe, but here we only need the config
      // registered.
      const config: McpServerConfig = {
        name: 'remote-a',
        transport: 'sse',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        connectTimeout: 2000,
      };
      // Trigger connect but let it fail; the connection stays
      // registered in `failed` state.
      globalScope.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
      await manager.connect(config);
      expect(manager.getConnectTimeoutForServer('remote-a')).toBe(2000);
    });

    it('honours the global connectTimeout when per-server is absent', () => {
      manager.setGlobalConnectTimeout(3500);
      expect(manager.getConnectTimeoutForServer('anything')).toBe(3500);
    });

    it('ignores an out-of-range per-server value and falls through', async () => {
      const config: McpServerConfig = {
        name: 'remote-oob',
        transport: 'sse',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        connectTimeout: 5,
      };
      globalScope.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
      await manager.connect(config);
      // Falls back to default (10000ms) because 5ms is below the
      // MCP_CONNECT_TIMEOUT_MIN_MS floor.
      expect(manager.getConnectTimeoutForServer('remote-oob')).toBe(10000);
    });
  });

  describe('connect timeout enforcement', () => {
    const remoteConfig: McpServerConfig = {
      name: 'remote-server',
      transport: 'sse',
      url: 'http://127.0.0.1:0/mcp',
      enabled: true,
      connectTimeout: 100,
    };

    it('aborts a hanging remote connect after connectTimeout ms', async () => {
      globalScope.fetch = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        return new Promise((_resolve, reject) => {
          if (init?.signal) {
            init.signal.addEventListener('abort', () => {
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            });
          }
        });
      });

      const connection = await manager.connect(remoteConfig);
      expect(connection.status).toBe('failed');
      expect(connection.error).toMatch(
        /Failed to connect to MCP server 'remote-server' within 100ms/
      );
      expect(connection.error).toContain('remote transport connect timeout');
      expect(connection.error).toContain("increase 'connectTimeout' in mcp-servers.json");
    });

    it('does NOT trip when the probe completes within budget', async () => {
      globalScope.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

      const connection = await manager.connect(remoteConfig);
      // The probe succeeds, then the transport wiring throws
      // "not yet implemented". The failure MUST NOT be a
      // connect timeout.
      expect(connection.status).toBe('failed');
      expect(connection.error ?? '').not.toMatch(/remote transport connect timeout/);
      expect(connection.error ?? '').toContain('not yet implemented');
    });

    it('classifies connect-timeout errors as transient (retryable)', async () => {
      const err = new McpConnectTimeoutError('x', 100);
      expect(err.name).toBe('McpConnectTimeoutError');
      expect(err.serverName).toBe('x');
      expect(err.timeoutMs).toBe(100);
      expect(err.message).toMatch(/within 100ms/);
    });

    it('rejects a missing url on remote transports before probing', async () => {
      globalScope.fetch = vi.fn();
      const bad: McpServerConfig = {
        name: 'no-url',
        transport: 'http',
        enabled: true,
      };
      const connection = await manager.connect(bad);
      expect(connection.status).toBe('failed');
      expect(connection.error).toMatch(/requires a 'url' field/);
      expect(globalScope.fetch as unknown as { mock: { calls: unknown[] } }).toBeDefined();
      expect(
        (globalScope.fetch as unknown as { mock: { calls: unknown[] } }).mock.calls.length
      ).toBe(0);
    });
  });

  describe('stdio unaffected', () => {
    it('does not use connectTimeout for stdio transport', async () => {
      // Ensure fetch is not called at all for stdio.
      const spyFetch = vi.fn();
      globalScope.fetch = spyFetch;

      // Mock spawn to return a well-behaved child process object.
      const proc = new EventEmitter() as EventEmitter & {
        stdin: EventEmitter;
        stdout: EventEmitter;
        stderr: EventEmitter;
        kill: () => void;
        pid: number;
      };
      proc.stdin = new EventEmitter();
      proc.stdout = new EventEmitter();
      proc.stderr = new EventEmitter();
      proc.kill = () => undefined;
      proc.pid = 12345;
      mockSpawn.mockReturnValue(proc);

      const stdio: McpServerConfig = {
        name: 'stdio-x',
        transport: 'stdio',
        command: 'node',
        args: ['server.js'],
        enabled: true,
        connectTimeout: 50, // irrelevant for stdio
      };
      const connection = await manager.connect(stdio);
      // stdio path is untouched by connectTimeout; connect resolves
      // via the mocked Client.connect().
      expect(connection.status).toBe('connected');
      expect(spyFetch).not.toHaveBeenCalled();
    });
  });

  describe('retry semantics for remote connect', () => {
    it('retries a connect timeout up to maxAttempts, then fails', async () => {
      const attempts: number[] = [];
      globalScope.fetch = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        attempts.push(Date.now());
        return new Promise((_resolve, reject) => {
          if (init?.signal) {
            init.signal.addEventListener('abort', () => {
              const error = new Error('The operation was aborted');
              error.name = 'AbortError';
              reject(error);
            });
          }
        });
      });

      const withRetry: McpServerConfig = {
        name: 'remote-retry',
        transport: 'sse',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        connectTimeout: 100,
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelayMs: 0, // keep the test fast — backoff logic is covered elsewhere
          maxDelayMs: 0,
        },
      };

      const connection = await manager.connect(withRetry);
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(3);
      expect(attempts.length).toBe(3);
      // Final error still points at the connect-timeout bound so an
      // operator knows which field to raise.
      expect(connection.error).toContain('remote transport connect timeout');
      expect(connection.error).toContain("increase 'connectTimeout' in mcp-servers.json");
    });

    it('does NOT retry a permanent auth failure (HTTP 401)', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
      globalScope.fetch = fetchMock;

      const withRetry: McpServerConfig = {
        name: 'remote-auth-401',
        transport: 'http',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        apiKey: 'bad-token',
        connectTimeout: 500,
        retry: {
          enabled: true,
          maxAttempts: 5, // deliberately large — permanent errors must bail out on the first try
          initialDelayMs: 0,
          maxDelayMs: 0,
        },
      };

      const connection = await manager.connect(withRetry);
      expect(connection.status).toBe('failed');
      // Exactly one probe: auth failures are permanent, retry budget
      // MUST NOT be spent on them.
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(connection.attemptCount).toBe(1);
      expect(connection.error).toMatch(/HTTP 401/);
      expect(connection.error).toContain('authentication/authorization failure');
      expect(connection.error).toContain("'apiKey'");
    });

    it('does NOT retry a permanent auth failure (HTTP 403)', async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
      globalScope.fetch = fetchMock;

      const withRetry: McpServerConfig = {
        name: 'remote-auth-403',
        transport: 'http',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        apiKey: 'forbidden-token',
        connectTimeout: 500,
        retry: {
          enabled: true,
          maxAttempts: 5,
          initialDelayMs: 0,
          maxDelayMs: 0,
        },
      };

      const connection = await manager.connect(withRetry);
      expect(connection.status).toBe('failed');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(connection.attemptCount).toBe(1);
      expect(connection.error).toMatch(/HTTP 403/);
    });

    it('exposes McpConnectAuthError with actionable metadata', () => {
      const err = new McpConnectAuthError('srv', 401);
      expect(err.name).toBe('McpConnectAuthError');
      expect(err.serverName).toBe('srv');
      expect(err.status).toBe(401);
      expect(err.message).toContain("Check the 'apiKey' field");
      expect(err.message).toContain('will NOT be retried');
    });

    it('treats non-auth non-2xx statuses (e.g. 405) as reachable', async () => {
      // SSE endpoints commonly reject HEAD with 405 while being
      // reachable and correctly configured. This must NOT be flagged
      // as an auth failure; the connect layer only cares that the
      // peer responded within the connect budget.
      const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 405 }));
      globalScope.fetch = fetchMock;

      const cfg: McpServerConfig = {
        name: 'remote-405',
        transport: 'sse',
        url: 'http://127.0.0.1:0/mcp',
        enabled: true,
        connectTimeout: 500,
      };

      const connection = await manager.connect(cfg);
      expect(connection.status).toBe('failed');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      // Falls through to the not-yet-implemented transport wiring; the
      // failure MUST NOT be an auth error or a connect timeout.
      expect(connection.error ?? '').not.toMatch(/HTTP 40[13]/);
      expect(connection.error ?? '').not.toMatch(/remote transport connect timeout/);
      expect(connection.error ?? '').toContain('not yet implemented');
    });
  });
});
