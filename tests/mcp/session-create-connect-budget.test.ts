/**
 * Regression tests for the session-creation critical path: unreachable
 * remote MCP servers MUST NOT stall `connectFromConfig` beyond the hub's
 * 30s deadline.
 *
 * This is the exact scenario Cline #13639 (and Alexi #1611 / #1572)
 * targets: session.create previously blocked for 60s (the request
 * timeout) when SSE/HTTP MCP servers were unreachable, causing TUI
 * exits and one-shot run failures.
 *
 * The `connectRemote` path uses `withConnectTimeout` (10s default) with
 * `AbortController` so the fetch probe is bounded. `connectFromConfig`
 * runs all server connects in parallel via `Promise.allSettled`, so the
 * total wall-clock ceiling is `max(perServerConnectTimeout)`, NOT the
 * sum of them.
 *
 * These tests use fake timers to prove the budget contract without
 * spending real seconds on wall-clock waits — the point is to codify
 * the bounded-parallel-connect invariant so a future refactor cannot
 * regress it silently.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock child_process.spawn — not exercised on the remote paths but
// referenced during module load.
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

// Mock the MCP SDK client. The remote path never reaches the SDK's
// `connect()` in the current implementation (it throws after the
// reachability probe), but the module load path still needs it.
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

// `loadMcpConfig` is what `connectFromConfig` calls to read the on-disk
// config. Each test overrides its return value to inject a fleet of
// unreachable remote servers.
const mockLoadMcpConfig = vi.fn();
vi.mock('../../src/mcp/config.js', async () => {
  const actual =
    await vi.importActual<typeof import('../../src/mcp/config.js')>('../../src/mcp/config.js');
  return {
    ...actual,
    loadMcpConfig: (...args: unknown[]) => mockLoadMcpConfig(...args),
    resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
  };
});

import { McpClientManager } from '../../src/mcp/client.js';
import type { McpConfig } from '../../src/mcp/config.js';

/**
 * Build a fetch mock that hangs forever until the caller's AbortSignal
 * fires. This simulates the exact failure mode we care about:
 * unreachable remote MCP server that never returns a response and
 * never resets the TCP connection.
 */
function makeUnreachableFetch(): (url: string, init?: RequestInit) => Promise<Response> {
  return (_url: string, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      if (init?.signal) {
        init.signal.addEventListener('abort', () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        });
      }
    });
}

describe('session.create critical path — remote MCP connect budget', () => {
  let manager: McpClientManager;
  let originalFetch: typeof fetch;
  const globalScope = globalThis as typeof globalThis & { fetch: typeof fetch };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    manager = new McpClientManager();
    originalFetch = globalScope.fetch;
  });

  afterEach(async () => {
    vi.useRealTimers();
    await manager.disconnectAll();
    globalScope.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('bounds total connectFromConfig time by max(connectTimeout), not sum, for parallel remote failures', async () => {
    // Five unreachable remote MCP servers, each with the default 10s
    // connect budget. If connects were sequential, the total wall-clock
    // would be 50s — well past the 30s hub deadline. With parallel
    // Promise.allSettled dispatch, the total is bounded by 10s.
    const servers: McpConfig['servers'] = [];
    for (let i = 0; i < 5; i++) {
      servers.push({
        name: `remote-${i}`,
        transport: 'sse',
        url: `http://127.0.0.1:${9000 + i}/mcp`,
        enabled: true,
        autoConnect: true,
        connectTimeout: 10000,
      });
    }
    const config: McpConfig = { version: '1.0', servers };
    mockLoadMcpConfig.mockReturnValue(config);
    globalScope.fetch = makeUnreachableFetch();

    const connectPromise = manager.connectFromConfig();

    // Advance clock to just past 10s — a single connect budget. All
    // five parallel connects should abort within this window.
    await vi.advanceTimersByTimeAsync(10_500);
    await connectPromise;

    // All five servers must be registered in `failed` state with the
    // connect-timeout error message. If any were still `connecting` or
    // `retrying`, the parallel-connect budget contract is broken.
    for (let i = 0; i < 5; i++) {
      const status = manager.getStatus().find((s) => s.name === `remote-${i}`);
      expect(status, `remote-${i} must be registered`).toBeDefined();
      expect(status?.status).toBe('failed');
      expect(status?.error ?? '').toContain('remote transport connect timeout');
    }
  });

  it('completes connectFromConfig under 30s ceiling for a fleet of unreachable remotes', async () => {
    // Ten unreachable remote MCPs. Even in the pathological worst
    // case, connectFromConfig must be done well under the 30s hub
    // deadline named in issue #1611.
    const servers: McpConfig['servers'] = [];
    for (let i = 0; i < 10; i++) {
      servers.push({
        name: `remote-${i}`,
        transport: 'http',
        url: `http://127.0.0.1:${9100 + i}/mcp`,
        enabled: true,
        autoConnect: true,
        // Deliberately tight budget to exercise the bound. The point
        // isn't the exact value — it's that the ceiling holds.
        connectTimeout: 5000,
      });
    }
    const config: McpConfig = { version: '1.0', servers };
    mockLoadMcpConfig.mockReturnValue(config);
    globalScope.fetch = makeUnreachableFetch();

    const connectPromise = manager.connectFromConfig();

    // Advance to 6s — well under 30s but past the 5s per-server
    // budget. All ten connects should have aborted.
    await vi.advanceTimersByTimeAsync(6_000);
    await connectPromise;

    const statuses = manager.getStatus();
    expect(statuses).toHaveLength(10);
    for (const status of statuses) {
      expect(status.status).toBe('failed');
      expect(status.error ?? '').toContain('remote transport connect timeout');
    }
  });

  it('does NOT retry unreachable remotes when retry.enabled is not set (default)', async () => {
    // Default policy: single attempt. This test guards against a
    // regression where retry would silently default to enabled and
    // multiply the connect budget by 3 (breaking the 30s ceiling).
    const config: McpConfig = {
      version: '1.0',
      servers: [
        {
          name: 'remote-no-retry',
          transport: 'sse',
          url: 'http://127.0.0.1:9200/mcp',
          enabled: true,
          autoConnect: true,
          connectTimeout: 10000,
        },
      ],
    };
    mockLoadMcpConfig.mockReturnValue(config);
    const fetchMock = vi.fn(makeUnreachableFetch());
    globalScope.fetch = fetchMock;

    const connectPromise = manager.connectFromConfig();
    await vi.advanceTimersByTimeAsync(10_500);
    await connectPromise;

    // Exactly one probe. If default retry ever flips to enabled, this
    // will jump to 3 and blow the connect budget.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const connection = manager.getConnection('remote-no-retry');
    expect(connection?.status).toBe('failed');
    expect(connection?.attemptCount).toBe(1);
  });

  it('applies the global connectTimeout when per-server override is absent', async () => {
    // Regression: verify the config-file-level `connectTimeout` is
    // wired through `connectFromConfig` via `setGlobalConnectTimeout`.
    const config: McpConfig = {
      version: '1.0',
      connectTimeout: 2000,
      servers: [
        {
          name: 'remote-global-timeout',
          transport: 'sse',
          url: 'http://127.0.0.1:9300/mcp',
          enabled: true,
          autoConnect: true,
          // Deliberately no per-server `connectTimeout` — must inherit
          // the global 2s value.
        },
      ],
    };
    mockLoadMcpConfig.mockReturnValue(config);
    globalScope.fetch = makeUnreachableFetch();

    const connectPromise = manager.connectFromConfig();
    // 2s + margin; the connect must abort within this window.
    await vi.advanceTimersByTimeAsync(2_500);
    await connectPromise;

    expect(manager.getConnectTimeoutForServer('remote-global-timeout')).toBe(2000);
    const status = manager.getStatus()[0];
    expect(status?.status).toBe('failed');
    expect(status?.error ?? '').toContain('within 2000ms');
  });
});
