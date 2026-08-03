/**
 * Tests for MCP `list_changed` notification handling in
 * {@link McpClientManager}. Verifies:
 *
 * - `notifications/tools/list_changed` triggers a debounced tool-list refresh.
 * - `notifications/resources/list_changed` triggers a resources refresh.
 * - `notifications/prompts/list_changed` triggers a prompts refresh.
 * - Bursts of notifications within the debounce window collapse to a single
 *   refresh.
 * - The absolute deadline fires the refresh even if notifications keep
 *   arriving (trailing timer never stabilizes).
 * - Unhandled notification methods are downgraded to a debug log with no
 *   throw and no user-facing toast (nothing is scheduled).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'events';

const mockSpawn = vi.fn();
vi.mock('child_process', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Track registered notification handlers by method so tests can drive
// them the same way the real SDK's `_onnotification` dispatcher would.
const notificationHandlers = new Map<string, (n: unknown) => void>();

const mockClientConnect = vi.fn().mockResolvedValue(undefined);
const mockClientListTools = vi.fn().mockResolvedValue({ tools: [] });
const mockClientListResources = vi.fn().mockResolvedValue({ resources: [] });
const mockClientListPrompts = vi.fn().mockResolvedValue({ prompts: [] });
const mockClientClose = vi.fn().mockResolvedValue(undefined);

vi.mock('@modelcontextprotocol/client', () => {
  return {
    Client: class MockClient {
      connect = mockClientConnect;
      listTools = mockClientListTools;
      listResources = mockClientListResources;
      listPrompts = mockClientListPrompts;
      close = mockClientClose;
      setNotificationHandler = (method: string, handler: (n: unknown) => void) => {
        notificationHandlers.set(method, handler);
      };
      // Public property mirrors the SDK's `fallbackNotificationHandler`
      // slot on `Protocol`. The manager assigns to it directly.
      fallbackNotificationHandler?: (n: unknown) => void | Promise<void>;
    },
  };
});

vi.mock('@modelcontextprotocol/client/stdio', () => ({
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

const stdioConfig: McpServerConfig = {
  name: 'test-server',
  transport: 'stdio',
  command: 'node',
  args: ['server.js'],
  enabled: true,
};

describe('McpClientManager list_changed notifications', () => {
  let manager: McpClientManager;

  beforeEach(async () => {
    vi.clearAllMocks();
    notificationHandlers.clear();
    vi.useFakeTimers();
    manager = new McpClientManager();
    mockSpawn.mockReturnValue(createMockProcess());
    mockClientConnect.mockResolvedValue(undefined);
    mockClientListTools.mockResolvedValue({ tools: [] });
    mockClientListResources.mockResolvedValue({ resources: [] });
    mockClientListPrompts.mockResolvedValue({ prompts: [] });
    mockClientClose.mockResolvedValue(undefined);
  });

  afterEach(async () => {
    vi.useRealTimers();
    await manager.disconnectAll();
    vi.restoreAllMocks();
  });

  it('registers a handler for each list_changed method plus a fallback', async () => {
    const connection = await manager.connect(stdioConfig);
    expect(connection.status).toBe('connected');
    expect(notificationHandlers.has('notifications/tools/list_changed')).toBe(true);
    expect(notificationHandlers.has('notifications/resources/list_changed')).toBe(true);
    expect(notificationHandlers.has('notifications/prompts/list_changed')).toBe(true);
    // The fallback slot is a property on the Client instance, not a
    // method-keyed handler. Grab it off the connection's client.
    const client = connection.client as unknown as {
      fallbackNotificationHandler?: unknown;
    };
    expect(typeof client.fallbackNotificationHandler).toBe('function');
  });

  it('triggers a debounced tools refresh 300ms after tools/list_changed', async () => {
    await manager.connect(stdioConfig);
    // Reset the mock so we only count refresh-driven listTools calls,
    // not the initial fetch during connect.
    mockClientListTools.mockClear();

    const handler = notificationHandlers.get('notifications/tools/list_changed');
    expect(handler).toBeDefined();
    handler!({ method: 'notifications/tools/list_changed' });

    // Not yet fired
    await vi.advanceTimersByTimeAsync(299);
    expect(mockClientListTools).not.toHaveBeenCalled();

    // Trailing edge fires at 300ms
    await vi.advanceTimersByTimeAsync(1);
    expect(mockClientListTools).toHaveBeenCalledTimes(1);
  });

  it('triggers a debounced resources refresh 300ms after resources/list_changed', async () => {
    await manager.connect(stdioConfig);
    mockClientListResources.mockClear();

    const handler = notificationHandlers.get('notifications/resources/list_changed');
    expect(handler).toBeDefined();
    handler!({ method: 'notifications/resources/list_changed' });

    await vi.advanceTimersByTimeAsync(299);
    expect(mockClientListResources).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(mockClientListResources).toHaveBeenCalledTimes(1);
  });

  it('triggers a debounced prompts refresh 300ms after prompts/list_changed', async () => {
    await manager.connect(stdioConfig);
    mockClientListPrompts.mockClear();

    const handler = notificationHandlers.get('notifications/prompts/list_changed');
    expect(handler).toBeDefined();
    handler!({ method: 'notifications/prompts/list_changed' });

    await vi.advanceTimersByTimeAsync(299);
    expect(mockClientListPrompts).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(mockClientListPrompts).toHaveBeenCalledTimes(1);
  });

  it('merges a burst of 5 tools/list_changed notifications within 200ms into 1 refresh', async () => {
    await manager.connect(stdioConfig);
    mockClientListTools.mockClear();

    const handler = notificationHandlers.get('notifications/tools/list_changed')!;

    // Fire 5 notifications spaced 40ms apart (total elapsed: 160ms).
    for (let i = 0; i < 5; i++) {
      handler({ method: 'notifications/tools/list_changed' });
      await vi.advanceTimersByTimeAsync(40);
    }

    // Trailing timer resets on every notification. 300ms after the LAST
    // notification, the single coalesced refresh fires.
    expect(mockClientListTools).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(300);
    expect(mockClientListTools).toHaveBeenCalledTimes(1);
  });

  it('honors the 2000ms absolute deadline even if notifications keep arriving', async () => {
    await manager.connect(stdioConfig);
    mockClientListTools.mockClear();

    const handler = notificationHandlers.get('notifications/tools/list_changed')!;

    // Fire the first notification, then keep firing every 100ms so the
    // trailing 300ms timer never gets a chance to stabilize.
    handler({ method: 'notifications/tools/list_changed' });
    let elapsed = 0;
    while (elapsed < 1900) {
      await vi.advanceTimersByTimeAsync(100);
      elapsed += 100;
      handler({ method: 'notifications/tools/list_changed' });
    }

    // We have fired notifications continuously for ~1900ms of virtual
    // time. Nothing should have refreshed yet — the trailing 300ms
    // timer keeps resetting.
    expect(mockClientListTools).not.toHaveBeenCalled();

    // Push past the 2000ms absolute deadline (relative to the FIRST
    // notification). The refresh MUST fire even though notifications
    // are still landing.
    await vi.advanceTimersByTimeAsync(200);
    expect(mockClientListTools).toHaveBeenCalledTimes(1);
  });

  it('downgrades unhandled notification methods to logger output without scheduling refresh', async () => {
    const connection = await manager.connect(stdioConfig);
    mockClientListTools.mockClear();
    mockClientListResources.mockClear();
    mockClientListPrompts.mockClear();

    const client = connection.client as unknown as {
      fallbackNotificationHandler?: (n: unknown) => Promise<void>;
    };
    expect(typeof client.fallbackNotificationHandler).toBe('function');

    // Should not throw for any of these.
    await client.fallbackNotificationHandler!({ method: 'notifications/message' });
    await client.fallbackNotificationHandler!({ method: 'notifications/progress' });
    await client.fallbackNotificationHandler!({ method: 'notifications/cancelled' });
    await client.fallbackNotificationHandler!({ method: undefined });
    await client.fallbackNotificationHandler!(null);

    // Advance well past any possible debounce window — no refresh should
    // fire for any list, because unhandled notifications are informational.
    await vi.advanceTimersByTimeAsync(5000);
    expect(mockClientListTools).not.toHaveBeenCalled();
    expect(mockClientListResources).not.toHaveBeenCalled();
    expect(mockClientListPrompts).not.toHaveBeenCalled();
  });

  it('populates connection.resources on a resources/list_changed refresh', async () => {
    const connection = await manager.connect(stdioConfig);
    mockClientListResources.mockResolvedValueOnce({
      resources: [{ uri: 'file:///a', name: 'a' }],
    });

    const handler = notificationHandlers.get('notifications/resources/list_changed')!;
    handler({ method: 'notifications/resources/list_changed' });
    await vi.advanceTimersByTimeAsync(300);
    // Let the async refresh settle (the timer callback is sync but the
    // refresh itself is async).
    await vi.runOnlyPendingTimersAsync();
    // Flush microtasks so the awaited refresh promise resolves.
    await Promise.resolve();
    await Promise.resolve();

    expect(Array.isArray(connection.resources)).toBe(true);
    expect(connection.resources).toHaveLength(1);
  });
});
