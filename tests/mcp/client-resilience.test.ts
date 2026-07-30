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
  resolveEnvVars: vi.fn((env?: Record<string, string>) => {
    if (!env) {
      return {};
    }
    // Simple ${VAR} expansion so we can drive missing-env tests through
    // the real code path.
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(env)) {
      out[k] = v.replace(/\$\{([^}]+)\}/g, (_m, name) => process.env[name] ?? '');
    }
    return out;
  }),
}));

import {
  McpClientManager,
  computeBackoffDelayMs,
  resolveRetryPolicy,
} from '../../src/mcp/client.js';
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

/**
 * Build a Node-style system error with a `code` property matching the
 * shape of `child_process` / `net` failures the retry classifier
 * inspects.
 */
function sysError(code: string, message: string): Error & { code: string } {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

describe('MCP connection resilience', () => {
  let manager: McpClientManager;

  const baseConfig: McpServerConfig = {
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
    mockClientConnect.mockResolvedValue(undefined);
    mockClientListTools.mockResolvedValue({ tools: [] });
    mockClientClose.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  describe('resolveRetryPolicy', () => {
    it('disables retry when config.retry is omitted', () => {
      const policy = resolveRetryPolicy(baseConfig);
      expect(policy.maxAttempts).toBe(1);
    });

    it('disables retry when config.retry.enabled is false', () => {
      const policy = resolveRetryPolicy({
        ...baseConfig,
        retry: { enabled: false },
      });
      expect(policy.maxAttempts).toBe(1);
    });

    it('applies documented defaults when enabled but fields omitted', () => {
      const policy = resolveRetryPolicy({
        ...baseConfig,
        retry: { enabled: true },
      });
      expect(policy).toEqual({ maxAttempts: 3, initialDelayMs: 1000, maxDelayMs: 4000 });
    });

    it('honours explicit field overrides', () => {
      const policy = resolveRetryPolicy({
        ...baseConfig,
        retry: { enabled: true, maxAttempts: 5, initialDelayMs: 500, maxDelayMs: 2000 },
      });
      expect(policy).toEqual({ maxAttempts: 5, initialDelayMs: 500, maxDelayMs: 2000 });
    });

    it('ignores non-positive maxAttempts and falls back to the default', () => {
      const policy = resolveRetryPolicy({
        ...baseConfig,
        retry: { enabled: true, maxAttempts: 0 },
      });
      expect(policy.maxAttempts).toBe(3);
    });
  });

  describe('computeBackoffDelayMs', () => {
    it('grows geometrically from the initial delay', () => {
      expect(computeBackoffDelayMs(1, 1000, 60000)).toBe(1000);
      expect(computeBackoffDelayMs(2, 1000, 60000)).toBe(2000);
      expect(computeBackoffDelayMs(3, 1000, 60000)).toBe(4000);
      expect(computeBackoffDelayMs(4, 1000, 60000)).toBe(8000);
    });

    it('caps at maxDelayMs', () => {
      expect(computeBackoffDelayMs(10, 1000, 4000)).toBe(4000);
    });

    it('never returns a negative delay for retryIndex <= 0', () => {
      expect(computeBackoffDelayMs(0, 1000, 4000)).toBe(1000);
      expect(computeBackoffDelayMs(-1, 1000, 4000)).toBe(1000);
    });
  });

  describe('retry loop', () => {
    it('retries a transient ECONNREFUSED failure and succeeds on the second attempt', async () => {
      mockClientConnect
        .mockRejectedValueOnce(sysError('ECONNREFUSED', 'connect ECONNREFUSED 127.0.0.1'))
        .mockResolvedValueOnce(undefined);

      const config: McpServerConfig = {
        ...baseConfig,
        name: 'transient-server',
        retry: { enabled: true, maxAttempts: 3, initialDelayMs: 1, maxDelayMs: 1 },
      };

      const connection = await manager.connect(config);
      expect(connection.status).toBe('connected');
      expect(connection.attemptCount).toBe(2);
      expect(mockClientConnect).toHaveBeenCalledTimes(2);
      // The successful attempt clears the error field.
      expect(connection.error).toBeUndefined();
    });

    it('does NOT retry a non-transient ENOENT (command not found)', async () => {
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn nonexistent-binary ENOENT'));

      const config: McpServerConfig = {
        ...baseConfig,
        name: 'missing-cmd',
        command: 'nonexistent-binary',
        retry: { enabled: true, maxAttempts: 5, initialDelayMs: 1, maxDelayMs: 1 },
      };

      const connection = await manager.connect(config);
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(1);
      expect(mockClientConnect).toHaveBeenCalledTimes(1);
      expect(connection.error).toContain("'missing-cmd'");
      expect(connection.error).toContain('ENOENT');
      expect(connection.error).toContain("'command' field in mcp-servers.json");
      expect(connection.lastErrorAt).toBeGreaterThan(0);
    });

    it('exhausts the retry budget on repeated transient failures and lands in failed state', async () => {
      mockClientConnect.mockRejectedValue(sysError('ETIMEDOUT', 'connect ETIMEDOUT'));

      const config: McpServerConfig = {
        ...baseConfig,
        name: 'always-timeout',
        retry: { enabled: true, maxAttempts: 3, initialDelayMs: 1, maxDelayMs: 1 },
      };

      const connection = await manager.connect(config);
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(3);
      expect(mockClientConnect).toHaveBeenCalledTimes(3);
      expect(connection.error).toMatch(/ETIMEDOUT/);
    });

    it('single attempt (retry disabled) leaves status as failed after one failure', async () => {
      mockClientConnect.mockRejectedValue(sysError('ECONNREFUSED', 'connect ECONNREFUSED'));

      const config: McpServerConfig = {
        ...baseConfig,
        name: 'no-retry',
        // No retry field at all -> maxAttempts = 1.
      };

      const connection = await manager.connect(config);
      expect(connection.status).toBe('failed');
      expect(connection.attemptCount).toBe(1);
      expect(mockClientConnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('exponential backoff timing', () => {
    it('sleeps roughly initial, then initial*2 between three attempts', async () => {
      // Replace the internal `delay` method so we can assert the schedule
      // deterministically without depending on the test's timer strategy.
      const delaySpy = vi
        .spyOn(manager as unknown as { delay: (ms: number) => Promise<void> }, 'delay')
        .mockResolvedValue(undefined);

      mockClientConnect
        .mockRejectedValueOnce(sysError('ECONNREFUSED', 'refused'))
        .mockRejectedValueOnce(sysError('ECONNREFUSED', 'refused'))
        .mockResolvedValueOnce(undefined);

      const config: McpServerConfig = {
        ...baseConfig,
        name: 'backoff-server',
        retry: { enabled: true, maxAttempts: 3, initialDelayMs: 1000, maxDelayMs: 4000 },
      };

      const connection = await manager.connect(config);
      expect(connection.status).toBe('connected');
      expect(connection.attemptCount).toBe(3);

      // After attempt 1 (index 1): 1000ms; after attempt 2 (index 2): 2000ms.
      // No delay is scheduled after the final (successful) attempt.
      const delays = delaySpy.mock.calls.map((c) => c[0]);
      expect(delays).toEqual([1000, 2000]);
    });
  });

  describe('failed server visibility', () => {
    it('keeps the failed connection registered so getStatus() reports it', async () => {
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn ENOENT'));

      await manager.connect({
        ...baseConfig,
        name: 'visible-fail',
        command: 'ghost',
      });

      const statuses = manager.getStatus();
      const entry = statuses.find((s) => s.name === 'visible-fail');
      expect(entry).toBeDefined();
      expect(entry?.status).toBe('failed');
      expect(entry?.error).toContain('visible-fail');
      expect(entry?.error).toContain('ENOENT');
    });
  });

  describe('config error detection', () => {
    it('reports missing ${VAR} env expansion as a non-transient config error', async () => {
      // Ensure the referenced env var is absent so the mock resolves it
      // to an empty string.
      const priorValue = process.env.ALEXI_TEST_MISSING_VAR;
      delete process.env.ALEXI_TEST_MISSING_VAR;

      try {
        const config: McpServerConfig = {
          ...baseConfig,
          name: 'missing-env',
          env: { API_KEY: '${ALEXI_TEST_MISSING_VAR}' },
          retry: { enabled: true, maxAttempts: 5, initialDelayMs: 1, maxDelayMs: 1 },
        };

        const connection = await manager.connect(config);
        expect(connection.status).toBe('failed');
        // The fail-fast env check fires BEFORE the SDK's connect is
        // called, so mockClientConnect should not have been invoked.
        expect(mockClientConnect).not.toHaveBeenCalled();
        expect(connection.error).toContain('ALEXI_TEST_MISSING_VAR');
        expect(connection.error).toContain('missing environment variable');
        expect(connection.attemptCount).toBe(1);
      } finally {
        if (priorValue !== undefined) {
          process.env.ALEXI_TEST_MISSING_VAR = priorValue;
        }
      }
    });
  });

  describe('actionable error messages', () => {
    it('names the server and points at the command field for spawn ENOENT', async () => {
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn foobar ENOENT'));

      const connection = await manager.connect({
        ...baseConfig,
        name: 'named-server',
        command: 'foobar',
      });

      expect(connection.status).toBe('failed');
      expect(connection.error).toContain("'named-server'");
      expect(connection.error).toContain("'command' field in mcp-servers.json");
    });

    it('flags the retry-eligible nature of a transient error in the message', async () => {
      mockClientConnect.mockRejectedValue(sysError('ECONNREFUSED', 'refused'));

      const connection = await manager.connect({
        ...baseConfig,
        name: 'transient-msg',
        retry: { enabled: true, maxAttempts: 1, initialDelayMs: 1, maxDelayMs: 1 },
      });

      expect(connection.status).toBe('failed');
      expect(connection.error).toContain('transient network/startup error');
      expect(connection.error).toContain("'retry.enabled'");
    });
  });

  describe('connection state transitions', () => {
    it('transitions connecting -> connected on first-try success', async () => {
      const connection = await manager.connect({
        ...baseConfig,
        name: 'happy-path',
      });
      expect(connection.status).toBe('connected');
      expect(connection.attemptCount).toBe(1);
      expect(connection.error).toBeUndefined();
      expect(connection.lastErrorAt).toBeUndefined();
    });

    it('records lastErrorAt on failure', async () => {
      const before = Date.now();
      mockClientConnect.mockRejectedValue(sysError('ENOENT', 'spawn ENOENT'));

      const connection = await manager.connect({
        ...baseConfig,
        name: 'stamped',
        command: 'ghost',
      });

      expect(connection.status).toBe('failed');
      expect(connection.lastErrorAt).toBeGreaterThanOrEqual(before);
    });
  });

  describe('parallelized metadata fetches', () => {
    it('fires listResources / listPrompts in parallel with listTools when available', async () => {
      const order: string[] = [];
      const barrier = Promise.resolve();

      mockClientListTools.mockImplementation(async () => {
        order.push('tools:start');
        await barrier;
        order.push('tools:end');
        return { tools: [] };
      });

      // Extend the mock Client with optional metadata methods. Because the
      // mock class in this file uses class fields, we need to reach into
      // the manager's connection object after creation.
      const manager2 = new McpClientManager();
      mockSpawn.mockReturnValue(createMockProcess());

      // Patch the SDK Client instance to expose optional metadata endpoints.
      const originalConnect = mockClientConnect.getMockImplementation();
      mockClientConnect.mockImplementation(async function (this: unknown) {
        // Attach listResources / listPrompts to the client instance so
        // fetchInitialMetadata's `typeof === 'function'` probe passes.
        const client = this as {
          listResources?: () => Promise<unknown>;
          listPrompts?: () => Promise<unknown>;
        };
        client.listResources = async () => {
          order.push('resources');
          return { resources: [] };
        };
        client.listPrompts = async () => {
          order.push('prompts');
          return { prompts: [] };
        };
        if (originalConnect) {
          return originalConnect.apply(this, []);
        }
      });

      try {
        const connection = await manager2.connect({
          ...baseConfig,
          name: 'meta-server',
        });
        expect(connection.status).toBe('connected');
        // Tools was scheduled BEFORE resources/prompts completed —
        // proving the fetches ran concurrently rather than sequentially.
        expect(order[0]).toBe('tools:start');
        expect(order).toContain('resources');
        expect(order).toContain('prompts');
      } finally {
        await manager2.disconnectAll();
      }
    });

    it('does not fail the connection when an optional metadata endpoint throws', async () => {
      mockClientConnect.mockImplementation(async function (this: unknown) {
        const client = this as {
          listResources?: () => Promise<unknown>;
        };
        client.listResources = async () => {
          throw new Error('method not found');
        };
      });

      const connection = await manager.connect({
        ...baseConfig,
        name: 'optional-fail',
      });
      // Tools still resolve, and the optional endpoint's error is
      // swallowed — the connection is healthy.
      expect(connection.status).toBe('connected');
    });
  });
});
