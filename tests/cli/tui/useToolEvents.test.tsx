import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import type { ChatContextValue } from '../../../src/cli/tui/context/ChatContext.js';

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use them
// ---------------------------------------------------------------------------

const mockAddToolCall = vi.fn();
const mockUpdateToolCall = vi.fn();

const mockChat: ChatContextValue = {
  isStreaming: false,
  streamingText: '',
  activeToolCalls: [],
  completedToolCalls: [],
  abortController: null,
  error: null,
  responseModel: null,
  setStreaming: vi.fn(),
  appendStreamText: vi.fn(),
  clearStreamText: vi.fn(),
  addToolCall: mockAddToolCall,
  updateToolCall: mockUpdateToolCall,
  toggleToolCallExpansion: vi.fn(),
  setError: vi.fn(),
  setAbortController: vi.fn(),
  setResponseModel: vi.fn(),
  reset: vi.fn(),
};

vi.mock('../../../src/cli/tui/context/ChatContext.js', () => ({
  useChat: () => mockChat,
}));

// Import hook AFTER mocks are set up
import { useToolEvents } from '../../../src/cli/tui/hooks/useToolEvents.js';
import {
  ToolExecutionStarted,
  ToolExecutionCompleted,
  ToolExecutionFailed,
  clearAllHandlers,
} from '../../../src/bus/index.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TestComponent(): React.JSX.Element {
  useToolEvents();
  return <Text>tool-events-test</Text>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useToolEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearAllHandlers();
  });

  it('renders without crashing', () => {
    const { lastFrame } = render(<TestComponent />);
    expect(lastFrame()).toContain('tool-events-test');
  });

  it('subscribes to ToolExecutionStarted and calls addToolCall', () => {
    render(<TestComponent />);

    ToolExecutionStarted.publish({
      toolName: 'read',
      toolId: 'tool-123',
      parameters: { filePath: '/tmp/test.ts' },
      timestamp: 1700000000000,
    });

    expect(mockAddToolCall).toHaveBeenCalledOnce();
    expect(mockAddToolCall).toHaveBeenCalledWith({
      id: 'tool-123',
      toolName: 'read',
      params: { filePath: '/tmp/test.ts' },
      status: 'running',
      output: null,
      error: null,
      isExpanded: true,
      diff: null,
      startedAt: 1700000000000,
      completedAt: null,
    });
  });

  it('subscribes to ToolExecutionCompleted and calls updateToolCall', () => {
    render(<TestComponent />);

    ToolExecutionCompleted.publish({
      toolName: 'read',
      toolId: 'tool-123',
      result: 'file content here',
      duration: 150,
      timestamp: 1700000000150,
    });

    expect(mockUpdateToolCall).toHaveBeenCalledOnce();
    expect(mockUpdateToolCall).toHaveBeenCalledWith('tool-123', {
      status: 'completed',
      output: 'file content here',
      isExpanded: false,
      completedAt: 1700000000150,
    });
  });

  it('subscribes to ToolExecutionFailed and calls updateToolCall with error', () => {
    render(<TestComponent />);

    ToolExecutionFailed.publish({
      toolName: 'bash',
      toolId: 'tool-456',
      error: 'Command failed with exit code 1',
      duration: 200,
      timestamp: 1700000000200,
    });

    expect(mockUpdateToolCall).toHaveBeenCalledOnce();
    expect(mockUpdateToolCall).toHaveBeenCalledWith('tool-456', {
      status: 'failed',
      error: 'Command failed with exit code 1',
      isExpanded: true,
      completedAt: 1700000000200,
    });
  });

  it('converts result to string when result is not a string', () => {
    render(<TestComponent />);

    ToolExecutionCompleted.publish({
      toolName: 'bash',
      toolId: 'tool-789',
      result: 42,
      duration: 50,
      timestamp: 1700000000050,
    });

    expect(mockUpdateToolCall).toHaveBeenCalledOnce();
    expect(mockUpdateToolCall).toHaveBeenCalledWith('tool-789', {
      status: 'completed',
      output: '42',
      isExpanded: false,
      completedAt: 1700000000050,
    });
  });

  it('sets isExpanded to true for started events', () => {
    render(<TestComponent />);

    ToolExecutionStarted.publish({
      toolName: 'glob',
      toolId: 'tool-exp-1',
      parameters: { pattern: '**/*.ts' },
      timestamp: 1700000000000,
    });

    const payload = mockAddToolCall.mock.calls[0][0];
    expect(payload.isExpanded).toBe(true);
  });

  it('sets isExpanded to false for completed events', () => {
    render(<TestComponent />);

    ToolExecutionCompleted.publish({
      toolName: 'glob',
      toolId: 'tool-exp-2',
      result: 'found files',
      duration: 100,
      timestamp: 1700000000100,
    });

    const [, updates] = mockUpdateToolCall.mock.calls[0];
    expect(updates.isExpanded).toBe(false);
  });

  it('sets isExpanded to true for failed events', () => {
    render(<TestComponent />);

    ToolExecutionFailed.publish({
      toolName: 'bash',
      toolId: 'tool-exp-3',
      error: 'timeout',
      duration: 5000,
      timestamp: 1700000005000,
    });

    const [, updates] = mockUpdateToolCall.mock.calls[0];
    expect(updates.isExpanded).toBe(true);
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = render(<TestComponent />);

    // Verify the subscription works before unmount
    ToolExecutionStarted.publish({
      toolName: 'read',
      toolId: 'tool-pre',
      parameters: {},
      timestamp: 1700000000000,
    });
    expect(mockAddToolCall).toHaveBeenCalledOnce();

    // Clear mocks and unmount
    mockAddToolCall.mockClear();
    mockUpdateToolCall.mockClear();
    unmount();

    // Publish all three event types — none should reach the mocks
    ToolExecutionStarted.publish({
      toolName: 'read',
      toolId: 'tool-post-1',
      parameters: {},
      timestamp: 1700000000001,
    });

    ToolExecutionCompleted.publish({
      toolName: 'read',
      toolId: 'tool-post-2',
      result: 'data',
      duration: 100,
      timestamp: 1700000000002,
    });

    ToolExecutionFailed.publish({
      toolName: 'read',
      toolId: 'tool-post-3',
      error: 'fail',
      duration: 100,
      timestamp: 1700000000003,
    });

    expect(mockAddToolCall).not.toHaveBeenCalled();
    expect(mockUpdateToolCall).not.toHaveBeenCalled();
  });
});
