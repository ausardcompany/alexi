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

describe('McpClientManager.callTool — structuredContent handling', () => {
  let manager: McpClientManager;

  const stdioConfig: McpServerConfig = {
    name: 'test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    await manager.connect(stdioConfig);
  });

  afterEach(async () => {
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  it('returns JSON-stringified structuredContent when only structuredContent is present', async () => {
    mockClientCallTool.mockResolvedValue({
      structuredContent: { foo: 'bar' },
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('{"foo":"bar"}');
  });

  it('falls back to content flattening when only content is present', async () => {
    mockClientCallTool.mockResolvedValue({
      content: [{ type: 'text', text: 'hello' }],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('hello');
  });

  it('prefers structuredContent over content when both are present', async () => {
    mockClientCallTool.mockResolvedValue({
      structuredContent: { foo: 'bar' },
      content: [{ type: 'text', text: 'narrative description' }],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('{"foo":"bar"}');
  });

  it('falls back to content path when structuredContent is null', async () => {
    mockClientCallTool.mockResolvedValue({
      structuredContent: null,
      content: [{ type: 'text', text: 'fallback text' }],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('fallback text');
  });

  it('honors isError when structuredContent is set', async () => {
    mockClientCallTool.mockResolvedValue({
      structuredContent: { foo: 'bar' },
      isError: true,
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('{"foo":"bar"}');
  });

  it('returns raw string when structuredContent is already a string', async () => {
    mockClientCallTool.mockResolvedValue({
      structuredContent: 'plain string',
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('plain string');
  });
});
