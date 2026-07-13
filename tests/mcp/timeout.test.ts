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

/**
 * Drive a `callTool` invocation to completion using fake timers and return
 * the resolved value. The mocked `callTool` hangs until its `AbortSignal`
 * fires, so we advance the timer by `advanceMs` to trip the internal
 * `AbortController` created by the manager.
 */
async function runTimingCall(
  manager: McpClientManager,
  serverName: string,
  advanceMs: number
): Promise<{ success: boolean; result?: unknown; error?: string }> {
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

  const promise = manager.callTool(serverName, 'some-tool', {});
  await vi.advanceTimersByTimeAsync(advanceMs);
  return promise;
}

describe('MCP split startup / request timeouts', () => {
  let manager: McpClientManager;
  const originalEnv = process.env;

  const baseConfig: McpServerConfig = {
    name: 'timeout-server',
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

  it('legacy: bare number timeout applies to both startup and request phases', async () => {
    const cfg: McpServerConfig = { ...baseConfig, name: 'legacy', timeout: 5000 };

    await manager.connect(cfg);

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 5000 })
    );

    const result = await runTimingCall(manager, 'legacy', 5000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 5000ms');
  });

  it('object form: both startup and request set independently', async () => {
    const cfg: McpServerConfig = {
      ...baseConfig,
      name: 'both',
      timeout: { startup: 10000, request: 2000 },
    };

    await manager.connect(cfg);

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 10000 })
    );

    const result = await runTimingCall(manager, 'both', 2000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 2000ms');
  });

  it('object form: partial (startup only) uses default request', async () => {
    const cfg: McpServerConfig = {
      ...baseConfig,
      name: 'startup-only',
      timeout: { startup: 10000 },
    };

    await manager.connect(cfg);

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 10000 })
    );

    // Default request timeout is 60000ms
    const result = await runTimingCall(manager, 'startup-only', 60000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 60000ms');
  });

  it('object form: partial (request only) uses default startup', async () => {
    const cfg: McpServerConfig = {
      ...baseConfig,
      name: 'request-only',
      timeout: { request: 2000 },
    };

    await manager.connect(cfg);

    // Default startup timeout is 30000ms
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 30000 })
    );

    const result = await runTimingCall(manager, 'request-only', 2000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 2000ms');
  });

  it('no timeout config: both phases use their respective defaults', async () => {
    const cfg: McpServerConfig = { ...baseConfig, name: 'defaults' };

    await manager.connect(cfg);

    // Default startup: 30000ms
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 30000 })
    );

    // Default request: 60000ms
    const result = await runTimingCall(manager, 'defaults', 60000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 60000ms');
  });

  it('MCP_TOOL_TIMEOUT env var applies to BOTH phases (backwards-compat)', async () => {
    process.env.MCP_TOOL_TIMEOUT = '7000';

    const cfg: McpServerConfig = { ...baseConfig, name: 'env-both' };
    await manager.connect(cfg);

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 7000 })
    );

    const result = await runTimingCall(manager, 'env-both', 7000);
    expect(result.success).toBe(false);
    expect(result.error).toBe('MCP tool call timed out after 7000ms');
  });
});
