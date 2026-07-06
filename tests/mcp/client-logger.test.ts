import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn();
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/sdk/client/index.js', () => ({
  Client: class MockClient {
    connect = mockClientConnect;
    listTools = mockClientListTools;
    close = mockClientClose;
  },
}));

vi.mock('@modelcontextprotocol/sdk/client/stdio.js', () => ({
  StdioClientTransport: vi.fn().mockImplementation(function () {
    return {};
  }),
}));

vi.mock('../../src/mcp/config.js', () => ({
  loadMcpConfig: vi.fn().mockReturnValue({ version: '1.0', servers: [] }),
  resolveEnvVars: vi.fn((env?: Record<string, string>) => env ?? {}),
}));

import { McpClientManager } from '../../src/mcp/client.js';
import type { McpServerConfig } from '../../src/mcp/config.js';
import { logger } from '../../src/utils/logger.js';

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

describe('McpClientManager - logger integration', () => {
  let manager: McpClientManager;

  const stdioConfig: McpServerConfig = {
    name: 'logger-test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  it('routes the connect success message through logger.info', async () => {
    const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {});
    mockClientListTools.mockResolvedValueOnce({ tools: [] });

    const connection = await manager.connect(stdioConfig);

    expect(connection.status).toBe('connected');
    expect(infoSpy).toHaveBeenCalledWith('Connected to MCP server: logger-test-server (0 tools)');
  });

  it('routes the disconnect message through logger.info', async () => {
    mockClientListTools.mockResolvedValueOnce({ tools: [] });
    await manager.connect(stdioConfig);

    const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {});
    await manager.disconnect('logger-test-server');

    expect(infoSpy).toHaveBeenCalledWith('Disconnected from MCP server: logger-test-server');
  });

  it('routes connect failures through logger.error', async () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    mockClientConnect.mockRejectedValueOnce(new Error('boom'));

    const connection = await manager.connect(stdioConfig);

    expect(connection.status).toBe('error');
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to connect to MCP server logger-test-server:',
      'boom'
    );
  });

  it('disconnect() on a missing server is a silent no-op', async () => {
    const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    await manager.disconnect('nonexistent');

    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
