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

describe('McpClientManager.callTool — content vs structuredContent priority', () => {
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

  it('prefers image content over structuredContent (Playwright screenshot case)', async () => {
    // When a server returns both an image and structuredContent, we MUST
    // surface the formatted image marker — not the JSON-stringified
    // structuredContent — so the model can reason about the screenshot.
    mockClientCallTool.mockResolvedValue({
      content: [{ type: 'image', data: 'b64==', mimeType: 'image/png' }],
      structuredContent: { foo: 'bar' },
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(typeof result.result).toBe('string');
    const text = result.result as string;
    expect(text).toContain('image/png');
    expect(text).not.toBe('{"foo":"bar"}');
    expect(text).not.toContain('"foo"');
  });

  it('falls back to structuredContent when content array is empty', async () => {
    mockClientCallTool.mockResolvedValue({
      content: [],
      structuredContent: { foo: 'bar' },
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('{"foo":"bar"}');
  });

  it('preserves mixed text + resource_link arrays end-to-end', async () => {
    mockClientCallTool.mockResolvedValue({
      content: [
        { type: 'text', text: 'hello' },
        { type: 'resource_link', uri: 'file:///x' },
      ],
      structuredContent: { ignored: true },
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(typeof result.result).toBe('string');
    const text = result.result as string;
    expect(text).toContain('hello');
    expect(text).toContain('file:///x');
    // structuredContent must NOT bleed into the output when content is non-empty
    expect(text).not.toContain('"ignored"');
  });

  it('uses content (not structuredContent) on the error path when both present', async () => {
    mockClientCallTool.mockResolvedValue({
      isError: true,
      content: [{ type: 'text', text: 'boom' }],
      structuredContent: { code: 500 },
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('boom');
  });
});
