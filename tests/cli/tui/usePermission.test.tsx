import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use them
// ---------------------------------------------------------------------------

const mockOpen = vi.fn();
const mockClose = vi.fn();
const mockCancel = vi.fn();

vi.mock('../../../src/cli/tui/context/DialogContext.js', () => ({
  useDialog: () => ({
    open: mockOpen,
    close: mockClose,
    cancel: mockCancel,
    isOpen: false,
    currentType: null,
    currentEntry: null,
    stack: [],
  }),
  DialogProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import hook AFTER mocks are set up
import { usePermission } from '../../../src/cli/tui/hooks/usePermission.js';
import {
  PermissionRequested,
  PermissionResponse,
  clearAllHandlers,
} from '../../../src/bus/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TestComponent(): React.JSX.Element {
  usePermission();
  return <Text>perm-test</Text>;
}

const BASE_PAYLOAD = {
  id: 'test-id',
  toolName: 'read-tool',
  action: 'read' as const,
  resource: '/tmp/file.txt',
  description: 'Read a file',
  timestamp: 1700000000000,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearAllHandlers();
  });

  it('renders without crashing', () => {
    const { lastFrame } = render(<TestComponent />);
    expect(lastFrame()).toContain('perm-test');
  });

  it('subscribes to PermissionRequested and calls open("permission", ...)', async () => {
    mockOpen.mockResolvedValue({ granted: true, remember: false });
    render(<TestComponent />);

    await act(async () => {
      PermissionRequested.publish(BASE_PAYLOAD);
    });

    expect(mockOpen).toHaveBeenCalledOnce();
    expect(mockOpen).toHaveBeenCalledWith(
      'permission',
      expect.objectContaining({
        toolName: BASE_PAYLOAD.toolName,
        action: BASE_PAYLOAD.action,
        resource: BASE_PAYLOAD.resource,
        description: BASE_PAYLOAD.description,
      })
    );
  });

  it('uses correct icon for each known action', async () => {
    type Action = 'read' | 'write' | 'execute' | 'network' | 'admin';
    const cases: Array<[Action, string]> = [
      ['read', '📖'],
      ['write', '✏️'],
      ['execute', '⚙️'],
      ['network', '🌐'],
      ['admin', '🔐'],
    ];

    for (const [action, expectedIcon] of cases) {
      vi.clearAllMocks();
      clearAllHandlers();
      mockOpen.mockResolvedValue({ granted: true, remember: false });
      render(<TestComponent />);

      await act(async () => {
        PermissionRequested.publish({ ...BASE_PAYLOAD, action });
      });

      expect(mockOpen).toHaveBeenCalledWith(
        'permission',
        expect.objectContaining({ icon: expectedIcon })
      );
    }
  });

  it('unknown action falls back to "🔒" icon', async () => {
    mockOpen.mockResolvedValue({ granted: true, remember: false });

    // PermissionRequested.publish() validates via Zod and rejects unknown enum values,
    // so we subscribe directly to capture the handler and invoke it with an unknown action.
    let capturedHandler: ((payload: unknown) => Promise<void>) | null = null;
    const origSubscribe = PermissionRequested.subscribe.bind(PermissionRequested);
    vi.spyOn(PermissionRequested, 'subscribe').mockImplementationOnce((handler) => {
      capturedHandler = handler as (payload: unknown) => Promise<void>;
      return origSubscribe(handler);
    });

    render(<TestComponent />);
    expect(capturedHandler).not.toBeNull();

    await act(async () => {
      await capturedHandler!({
        ...BASE_PAYLOAD,
        action: 'unknown',
      });
    });

    expect(mockOpen).toHaveBeenCalledWith('permission', expect.objectContaining({ icon: '🔒' }));
  });

  it('publishes PermissionResponse with granted:true when dialog resolves', async () => {
    mockOpen.mockResolvedValue({ granted: true, remember: false });

    const responses: Array<{ id: string; granted: boolean; remember?: boolean }> = [];
    const unsub = PermissionResponse.subscribe((payload) => {
      responses.push(payload);
    });

    render(<TestComponent />);

    await act(async () => {
      PermissionRequested.publish(BASE_PAYLOAD);
    });

    expect(responses).toHaveLength(1);
    expect(responses[0]).toMatchObject({
      id: 'test-id',
      granted: true,
      remember: false,
    });

    unsub();
  });

  it('publishes PermissionResponse with granted:false when dialog is cancelled (rejects)', async () => {
    mockOpen.mockRejectedValue(new Error('cancelled'));

    const responses: Array<{ id: string; granted: boolean; remember?: boolean }> = [];
    const unsub = PermissionResponse.subscribe((payload) => {
      responses.push(payload);
    });

    render(<TestComponent />);

    await act(async () => {
      PermissionRequested.publish(BASE_PAYLOAD);
    });

    expect(responses).toHaveLength(1);
    expect(responses[0]).toMatchObject({
      id: 'test-id',
      granted: false,
      remember: false,
    });

    unsub();
  });

  it('unsubscribes on unmount', async () => {
    mockOpen.mockResolvedValue({ granted: true, remember: false });

    const { unmount } = render(<TestComponent />);

    // Verify subscription is active before unmount
    await act(async () => {
      PermissionRequested.publish(BASE_PAYLOAD);
    });
    expect(mockOpen).toHaveBeenCalledOnce();

    // Clear and unmount
    mockOpen.mockClear();
    unmount();

    // Publishing after unmount should not trigger mockOpen
    await act(async () => {
      PermissionRequested.publish({ ...BASE_PAYLOAD, id: 'post-unmount-id' });
    });

    expect(mockOpen).not.toHaveBeenCalled();
  });
});
