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

import { McpClientManager, formatContentPart } from '../../src/mcp/client.js';
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

describe('McpClientManager.callTool — error content preservation', () => {
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

  it('preserves text + resource parts in error message', async () => {
    mockClientCallTool.mockResolvedValue({
      isError: true,
      content: [
        { type: 'text', text: 'failed' },
        { type: 'resource', resource: { uri: 'file:///a' } },
      ],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('failed\n[resource: file:///a]');
  });

  it('renders image parts as compact placeholders in error message', async () => {
    mockClientCallTool.mockResolvedValue({
      isError: true,
      content: [{ type: 'image', mimeType: 'image/png', data: 'AAAA' }],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^\[image: image\/png, \d+ bytes omitted\]$/);
  });

  it('falls back to "Unknown error" when isError is true and content is empty', async () => {
    mockClientCallTool.mockResolvedValue({
      isError: true,
      content: [],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unknown error');
  });

  it('preserves mixed content on success path', async () => {
    mockClientCallTool.mockResolvedValue({
      content: [
        { type: 'text', text: 'rendered output' },
        { type: 'image', mimeType: 'image/jpeg', data: 'AAAAAAAA' },
      ],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(typeof result.result).toBe('string');
    const text = result.result as string;
    expect(text).toContain('rendered output');
    expect(text).toContain('[image: image/jpeg,');
  });

  it('preserves resource parts on success path', async () => {
    mockClientCallTool.mockResolvedValue({
      content: [
        { type: 'text', text: 'see file' },
        { type: 'resource', resource: { uri: 'file:///path/to/file.ts' } },
      ],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(true);
    expect(result.result).toBe('see file\n[resource: file:///path/to/file.ts]');
  });

  it('prefers non-empty content over structuredContent on error path', async () => {
    // Per MCP spec, `content` is canonical even on errors. structuredContent
    // is only used as a fallback when `content` is missing or empty.
    mockClientCallTool.mockResolvedValue({
      isError: true,
      structuredContent: { code: 'ENOENT' },
      content: [{ type: 'resource', resource: { uri: 'file:///missing' } }],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('[resource: file:///missing]');
  });

  it('falls back to structuredContent on error path when content is empty', async () => {
    mockClientCallTool.mockResolvedValue({
      isError: true,
      structuredContent: { code: 'ENOENT' },
      content: [],
    });

    const result = await manager.callTool('test-server', 'some-tool', {});

    expect(result.success).toBe(false);
    expect(result.error).toBe('{"code":"ENOENT"}');
  });
});

describe('formatContentPart helper', () => {
  it('returns text verbatim for text parts', () => {
    expect(formatContentPart({ type: 'text', text: 'hello' })).toBe('hello');
  });

  it('returns empty string when text part has no text', () => {
    expect(formatContentPart({ type: 'text' })).toBe('');
  });

  it('formats image parts with mime + estimated byte count', () => {
    // Base64 'AAAA' (4 chars) -> 3 bytes
    expect(formatContentPart({ type: 'image', mimeType: 'image/png', data: 'AAAA' })).toBe(
      '[image: image/png, 3 bytes omitted]'
    );
  });

  it('formats image parts with default mime when missing', () => {
    expect(formatContentPart({ type: 'image' })).toBe('[image: unknown, 0 bytes omitted]');
  });

  it('formats resource parts using nested resource.uri', () => {
    expect(formatContentPart({ type: 'resource', resource: { uri: 'file:///a' } })).toBe(
      '[resource: file:///a]'
    );
  });

  it('formats resource parts using top-level uri as fallback', () => {
    expect(formatContentPart({ type: 'resource', uri: 'file:///b' })).toBe('[resource: file:///b]');
  });

  it('JSON-stringifies unknown content types', () => {
    expect(formatContentPart({ type: 'audio', data: 'xyz' })).toBe('{"type":"audio","data":"xyz"}');
  });
});
