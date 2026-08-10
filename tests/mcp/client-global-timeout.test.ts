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

// `loadMcpConfig` is what `connectFromConfig` reads for the global
// timeout. Individual tests override the mock return value before
// calling `connectFromConfig`.
const mockLoadMcpConfig = vi.fn();
vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: (...args: unknown[]) => mockLoadMcpConfig(...args),
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

async function runTimingCall(
  manager: McpClientManager,
  serverName: string,
  advanceMs: number
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  mockClientCallTool.mockImplementation((_params: unknown, options?: { signal?: AbortSignal }) => {
    return new Promise((_resolve, reject) => {
      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        });
      }
    });
  });

  const promise = manager.callTool(serverName, 'some-tool', {});
  await vi.advanceTimersByTimeAsync(advanceMs);
  return promise;
}

describe('MCP global config timeout precedence', () => {
  let manager: McpClientManager;
  const originalEnv = process.env;

  const baseServer: McpServerConfig = {
    name: 'srv',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
    autoConnect: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    process.env = { ...originalEnv };
    delete process.env.MCP_TOOL_TIMEOUT;
    mockLoadMcpConfig.mockReturnValue({ version: '1.0', servers: [] });
  });

  afterEach(async () => {
    vi.useRealTimers();
    await manager.disconnectAll();
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  it('applies global config timeout when per-server timeout is absent', async () => {
    // connectFromConfig reads loadMcpConfig(); return a global bare
    // number that both phases should adopt.
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      timeout: 4000,
      servers: [{ ...baseServer, name: 'srv-global-num' }],
    });

    await manager.connectFromConfig();

    // Startup: manager forwards the resolved startup budget to
    // `client.connect({ timeout })`.
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 4000 })
    );

    // Request: callTool trips at the global request timeout.
    const result = await runTimingCall(manager, 'srv-global-num', 4000);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 4000ms /);
    expect(result.error).toContain("(request timeout for server 'srv-global-num')");
  });

  it('applies global object-form timeout with independent startup / request', async () => {
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      timeout: { startup: 8000, request: 2500 },
      servers: [{ ...baseServer, name: 'srv-global-obj' }],
    });

    await manager.connectFromConfig();

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 8000 })
    );

    const result = await runTimingCall(manager, 'srv-global-obj', 2500);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 2500ms /);
  });

  it('per-server timeout overrides global timeout', async () => {
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      timeout: 20000,
      servers: [{ ...baseServer, name: 'srv-override', timeout: 1500 }],
    });

    await manager.connectFromConfig();

    // Per-server bare number wins for the startup handshake.
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 1500 })
    );

    const result = await runTimingCall(manager, 'srv-override', 1500);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 1500ms /);
  });

  it('per-server object partially overrides global (fills missing phase from global)', async () => {
    // Server sets only `request`; global provides `startup`. Result
    // should be startup=global.startup, request=server.request.
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      timeout: { startup: 12000, request: 40000 },
      servers: [
        {
          ...baseServer,
          name: 'srv-partial',
          timeout: { request: 1200 },
        },
      ],
    });

    await manager.connectFromConfig();

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 12000 })
    );

    const result = await runTimingCall(manager, 'srv-partial', 1200);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 1200ms /);
  });

  it('global timeout beats MCP_TOOL_TIMEOUT env var', async () => {
    process.env.MCP_TOOL_TIMEOUT = '25000';
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      timeout: 3500,
      servers: [{ ...baseServer, name: 'srv-vs-env' }],
    });

    await manager.connectFromConfig();

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 3500 })
    );

    const result = await runTimingCall(manager, 'srv-vs-env', 3500);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 3500ms /);
  });

  it('falls back to env / defaults when global timeout is absent', async () => {
    process.env.MCP_TOOL_TIMEOUT = '9000';
    mockLoadMcpConfig.mockReturnValue({
      version: '1.0',
      servers: [{ ...baseServer, name: 'srv-no-global' }],
    });

    await manager.connectFromConfig();

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 9000 })
    );

    const result = await runTimingCall(manager, 'srv-no-global', 9000);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 9000ms /);
  });

  it('setGlobalTimeout works for callers connecting servers directly', async () => {
    // Simulates a caller that bypasses connectFromConfig but still
    // wants the global override to apply.
    manager.setGlobalTimeout({ startup: 6000, request: 1800 });
    await manager.connect({ ...baseServer, name: 'srv-direct' });

    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 6000 })
    );

    const result = await runTimingCall(manager, 'srv-direct', 1800);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 1800ms /);
  });

  it('setGlobalTimeout(undefined) clears the override so env / defaults apply', async () => {
    manager.setGlobalTimeout({ startup: 6000, request: 1800 });
    manager.setGlobalTimeout(undefined);

    await manager.connect({ ...baseServer, name: 'srv-cleared' });

    // Falls through to DEFAULT_STARTUP_TIMEOUT_MS (3000; issue #1339).
    expect(mockClientConnect).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ timeout: 3000 })
    );

    // Falls through to DEFAULT_TOOL_CALL_TIMEOUT_MS (60000).
    const result = await runTimingCall(manager, 'srv-cleared', 60000);
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^MCP callTool timed out after 60000ms /);
  });
});
