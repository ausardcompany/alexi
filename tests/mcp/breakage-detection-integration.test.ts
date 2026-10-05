import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn (matches the client.test.ts pattern).
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/client so we control the server's responses.
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
  StdioClientTransport: vi.fn().mockImplementation(() => ({})),
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

// Capture logger.warn calls so we can assert the violation warnings fire
// and the disable message is emitted.
const { loggerWarnMock } = vi.hoisted(() => ({ loggerWarnMock: vi.fn() }));
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: loggerWarnMock,
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { McpClientManager } from '../../src/mcp/client.js';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
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
  proc.pid = 54321;
  return proc;
}

describe('McpClientManager — protocol breakage detection', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    vi.mocked(StdioClientTransport).mockImplementation(function () {
      return {} as unknown as InstanceType<typeof StdioClientTransport>;
    });
    mockClientConnect.mockResolvedValue(undefined);
    mockClientClose.mockResolvedValue(undefined);
    loggerWarnMock.mockClear();
  });

  afterEach(async () => {
    await manager.disconnectAll();
  });

  const baseConfig: McpServerConfig = {
    name: 'broken-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  it('logs a WARN and increments the breakage tracker on malformed tools/list', async () => {
    // Tool entry missing inputSchema — a classic MCP spec violation.
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search' }],
    });

    const connection = await manager.connect(baseConfig);
    expect(connection.status).toBe('connected');

    const tracker = manager.getBreakageTracker();
    expect(tracker.getViolationCount('broken-server')).toBe(1);

    const warned = loggerWarnMock.mock.calls.some((call) =>
      String(call[0]).includes('MCP protocol violation')
    );
    expect(warned).toBe(true);
  });

  it('disables the server after the default threshold of 3 malformed responses', async () => {
    const tracker = manager.getBreakageTracker();
    // Seed to one violation shy of the threshold so a single malformed
    // tools/list on connect flips the server to failed.
    tracker.recordViolation('broken-server', 'tools/list', ['prior']);
    tracker.recordViolation('broken-server', 'tools/list', ['prior']);

    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search' }],
    });

    const connection = await manager.connect(baseConfig);
    // After the threshold is crossed, the server is marked failed and
    // the client is closed. `connect` returns the registered
    // connection so operators can inspect the disable reason.
    expect(connection.status).toBe('failed');
    expect(connection.error).toContain('disabled after 3 protocol violations');

    const reasonWarned = loggerWarnMock.mock.calls.some((call) =>
      String(call[0]).includes('disabled after 3 protocol violations')
    );
    expect(reasonWarned).toBe(true);
  });

  it('does not record a violation when the response is spec-compliant', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search', inputSchema: { type: 'object', properties: {} } }],
    });

    const connection = await manager.connect(baseConfig);
    expect(connection.status).toBe('connected');
    expect(manager.getBreakageTracker().getViolationCount('broken-server')).toBe(0);
    const warned = loggerWarnMock.mock.calls.some((call) =>
      String(call[0]).includes('MCP protocol violation')
    );
    expect(warned).toBe(false);
  });

  it('resetMcpClientManager()-style tracker reset clears per-server counts', async () => {
    const tracker = manager.getBreakageTracker();
    tracker.recordViolation('broken-server', 'tools/list', ['v']);
    tracker.reset('broken-server');
    expect(tracker.getViolationCount('broken-server')).toBe(0);
  });

  it('still accepts the tools array when individual entries are malformed', async () => {
    // One good tool, one bad (missing inputSchema). The validator logs
    // + counts the violation but the connection stays open so the good
    // tool is still exposed.
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'good', inputSchema: { type: 'object', properties: {} } }, { name: 'bad' }],
    });

    const connection = await manager.connect(baseConfig);
    expect(connection.status).toBe('connected');
    expect(connection.tools.length).toBe(2);
    expect(manager.getBreakageTracker().getViolationCount('broken-server')).toBe(1);
  });
});
