import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock child_process.spawn (matches the client.test.ts pattern).
const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Mock @modelcontextprotocol/client so we control which tools the
// server appears to expose during connect.
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
  StdioClientTransport: vi.fn(),
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

// Capture logger.warn calls so we can assert the warning path fires
// when cimdEnabled is false. `vi.hoisted` avoids the temporal-dead-zone
// error caused by hoisted `vi.mock` factories referencing top-level
// mock variables.
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
import { McpCapabilityMismatchError } from '../../src/mcp/cimd.js';
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
  proc.pid = 12345;
  return proc;
}

describe('McpClientManager CIMD integration', () => {
  let manager: McpClientManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    // Reinstate the constructor stub — client.test.ts's pattern for the
    // same fake transport class.
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
    name: 'cimd-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  it('caches the observed capability manifest after connect', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search', description: 'Search', inputSchema: { type: 'object' } }],
    });

    const connection = await manager.connect(baseConfig);
    expect(connection.status).toBe('connected');
    expect(connection.capabilityManifest).toBeDefined();
    expect(connection.capabilityManifest?.tools).toHaveLength(1);
    expect(connection.capabilityManifest?.tools?.[0].name).toBe('search');
  });

  it('logs a warning and connects when a tool is missing and cimdEnabled is false', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search', inputSchema: { type: 'object' } }],
    });

    const config: McpServerConfig = {
      ...baseConfig,
      expectedCapabilities: {
        tools: [{ name: 'search' }, { name: 'summarise' }],
      },
    };

    const connection = await manager.connect(config);
    expect(connection.status).toBe('connected');
    const warnedForMismatch = loggerWarnMock.mock.calls.some((call) =>
      String(call[0]).includes('capability mismatch')
    );
    expect(warnedForMismatch).toBe(true);
  });

  it('fails the connect attempt with McpCapabilityMismatchError when cimdEnabled is true', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search', inputSchema: { type: 'object' } }],
    });

    const config: McpServerConfig = {
      ...baseConfig,
      cimdEnabled: true,
      expectedCapabilities: {
        tools: [{ name: 'search' }, { name: 'summarise' }],
      },
    };

    const connection = await manager.connect(config);
    expect(connection.status).toBe('failed');
    expect(connection.error).toContain('capability validation');
    expect(connection.error).toContain('summarise');
  });

  it('does not throw when cimdEnabled is true but expectedCapabilities is absent', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [{ name: 'search', inputSchema: { type: 'object' } }],
    });

    const config: McpServerConfig = { ...baseConfig, cimdEnabled: true };
    const connection = await manager.connect(config);
    expect(connection.status).toBe('connected');
  });

  it('connects cleanly when the observed manifest matches expected capabilities exactly', async () => {
    mockClientListTools.mockResolvedValueOnce({
      tools: [
        {
          name: 'search',
          description: 'Search the corpus',
          inputSchema: { type: 'object', properties: {} },
        },
      ],
    });

    const config: McpServerConfig = {
      ...baseConfig,
      cimdEnabled: true,
      expectedCapabilities: {
        tools: [
          {
            name: 'search',
            description: 'Search the corpus',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      },
    };

    const connection = await manager.connect(config);
    expect(connection.status).toBe('connected');
    const anyMismatch = loggerWarnMock.mock.calls.some((call) =>
      String(call[0]).includes('capability mismatch')
    );
    expect(anyMismatch).toBe(false);
  });

  it('exports McpCapabilityMismatchError so callers can instanceof-check it', () => {
    const err = new McpCapabilityMismatchError('srv', [
      { kind: 'tool_removed', toolName: 't', message: 'gone' },
    ]);
    expect(err).toBeInstanceOf(McpCapabilityMismatchError);
    expect(err).toBeInstanceOf(Error);
  });
});
