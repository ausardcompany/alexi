import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpClientManager } from '../../src/mcp/client.js';

describe('McpClientManager.callTool argument normalization', () => {
  let manager: McpClientManager;
  let mockCallTool: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    manager = new McpClientManager();
    mockCallTool = vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: 'ok' }],
      isError: false,
    });

    // Inject a fake connected connection with a mocked client
    const connections = (manager as unknown as { connections: Map<string, unknown> }).connections;
    connections.set('test-server', {
      config: { name: 'test-server', transport: 'stdio', command: 'echo' },
      client: { callTool: mockCallTool },
      tools: [],
      status: 'connected',
    });
  });

  it('should send {} when args is undefined', async () => {
    const result = await manager.callTool('test-server', 'my-tool', undefined);

    expect(result.success).toBe(true);
    expect(mockCallTool).toHaveBeenCalledWith({
      name: 'my-tool',
      arguments: {},
    });
  });

  it('should send {} when args is null', async () => {
    const result = await manager.callTool('test-server', 'my-tool', null);

    expect(result.success).toBe(true);
    expect(mockCallTool).toHaveBeenCalledWith({
      name: 'my-tool',
      arguments: {},
    });
  });

  it('should pass valid args object unchanged', async () => {
    const args = { key: 'value', count: 42 };
    const result = await manager.callTool('test-server', 'my-tool', args);

    expect(result.success).toBe(true);
    expect(mockCallTool).toHaveBeenCalledWith({
      name: 'my-tool',
      arguments: { key: 'value', count: 42 },
    });
  });

  it('should pass empty {} unchanged', async () => {
    const result = await manager.callTool('test-server', 'my-tool', {});

    expect(result.success).toBe(true);
    expect(mockCallTool).toHaveBeenCalledWith({
      name: 'my-tool',
      arguments: {},
    });
  });
});
