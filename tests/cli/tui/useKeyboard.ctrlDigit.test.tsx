import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';

// ---------------------------------------------------------------------------
// Mocks -- capture the useInput handler so we can invoke it synchronously
// with crafted (input, key) pairs. Ctrl+digit on most terminals is reported
// as `input === '<digit>'` with `key.ctrl === true`, and raw stdin cannot
// reliably reproduce that across OS / terminal combinations in tests.
// ---------------------------------------------------------------------------

let capturedHandler: ((input: string, key: Record<string, boolean | undefined>) => void) | null =
  null;

vi.mock('ink', async () => {
  const actual = await vi.importActual<typeof import('ink')>('ink');
  return {
    ...actual,
    useInput: (
      handler: (input: string, key: Record<string, boolean | undefined>) => void
    ): void => {
      capturedHandler = handler;
    },
  };
});

const mockCycleAgent = vi.fn();
const mockActivateLeader = vi.fn();
const mockDeactivateLeader = vi.fn();
const mockOpen = vi.fn(() => Promise.resolve('result'));

vi.mock('../../../src/cli/tui/context/SessionContext.js', () => ({
  useSession: () => ({
    cycleAgent: mockCycleAgent,
    sessionId: 'test-session',
    model: 'test-model',
    agent: 'orchestrator',
    autoRoute: false,
    stage: null,
    tokenCount: 0,
    cost: { inputTokens: 0, outputTokens: 0, totalCost: 0, currency: 'USD' },
    setModel: vi.fn(),
    setAgent: vi.fn(),
    setTokenCount: vi.fn(),
    setCost: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/KeybindContext.js', () => ({
  useKeybind: () => ({
    state: { leaderActive: false },
    activateLeader: mockActivateLeader,
    deactivateLeader: mockDeactivateLeader,
    setInputFocused: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/DialogContext.js', () => ({
  useDialog: () => ({
    open: mockOpen,
    close: vi.fn(),
    cancel: vi.fn(),
    isOpen: false,
    currentType: null,
    currentEntry: null,
    stack: [],
  }),
}));

vi.mock('../../../src/cli/tui/context/SidebarContext.js', () => ({
  useSidebar: () => ({
    visible: false,
    files: [],
    selectedIndex: 0,
    setSelectedIndex: vi.fn(),
    toggle: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    addFile: vi.fn(),
    removeFile: vi.fn(),
    clearFiles: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/PageContext.js', () => ({
  usePage: () => ({
    page: 'chat' as const,
    setPage: vi.fn(),
    togglePage: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/SubagentContext.js', () => ({
  useSubagent: () => ({
    activeSubagentId: null,
    steeringPrompt: null,
    steeringDeliveredAt: null,
    setActiveSubagent: vi.fn(),
    steer: vi.fn(() => Promise.resolve(false)),
    clearSteering: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/ChatContext.js', () => ({
  useChat: () => ({
    isStreaming: false,
    abortController: null,
    streamingText: '',
    activeToolCalls: [],
    completedToolCalls: [],
    error: null,
    responseModel: null,
    setStreaming: vi.fn(),
    appendStreamText: vi.fn(),
    clearStreamText: vi.fn(),
    addToolCall: vi.fn(),
    updateToolCall: vi.fn(),
    toggleToolCallExpansion: vi.fn(),
    setError: vi.fn(),
    setAbortController: vi.fn(),
    setResponseModel: vi.fn(),
    reset: vi.fn(),
  }),
}));

import { useKeyboard, type UseKeyboardOptions } from '../../../src/cli/tui/hooks/useKeyboard.js';

// ---------------------------------------------------------------------------
// Test component
// ---------------------------------------------------------------------------

const defaultOptions: UseKeyboardOptions = {
  onExit: vi.fn(),
  onClear: vi.fn(),
  onNewSession: vi.fn(),
  isInputActive: false,
};

function TestComponent({ options }: { options: UseKeyboardOptions }): React.JSX.Element {
  useKeyboard(options);
  return <></>;
}

function ctrl(_input: string): Record<string, boolean | undefined> {
  return { ctrl: true, shift: false, tab: false, escape: false, meta: false };
}

function tab(opts: { shift?: boolean } = {}): Record<string, boolean | undefined> {
  return {
    tab: true,
    shift: opts.shift ?? false,
    ctrl: false,
    escape: false,
    meta: false,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useKeyboard -- Tab / Shift+Tab agent cycling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedHandler = null;
  });

  it('Tab cycles agent forward', () => {
    render(<TestComponent options={defaultOptions} />);
    expect(capturedHandler).not.toBeNull();
    capturedHandler!('', tab());
    expect(mockCycleAgent).toHaveBeenCalledTimes(1);
    expect(mockCycleAgent).toHaveBeenCalledWith(true);
  });

  it('Shift+Tab cycles agent backward', () => {
    render(<TestComponent options={defaultOptions} />);
    expect(capturedHandler).not.toBeNull();
    capturedHandler!('', tab({ shift: true }));
    expect(mockCycleAgent).toHaveBeenCalledTimes(1);
    expect(mockCycleAgent).toHaveBeenCalledWith(false);
  });
});

describe('useKeyboard -- Ctrl+1..9 direct agent selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedHandler = null;
  });

  it('invokes onJumpToAgent with 1 on Ctrl+1', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    expect(capturedHandler).not.toBeNull();
    capturedHandler!('1', ctrl('1'));
    expect(onJumpToAgent).toHaveBeenCalledTimes(1);
    expect(onJumpToAgent).toHaveBeenCalledWith(1);
  });

  it('invokes onJumpToAgent with 9 on Ctrl+9', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    capturedHandler!('9', ctrl('9'));
    expect(onJumpToAgent).toHaveBeenCalledTimes(1);
    expect(onJumpToAgent).toHaveBeenCalledWith(9);
  });

  it('maps every Ctrl+{1..9} to the correct 1-based index', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    for (let i = 1; i <= 9; i++) {
      capturedHandler!(String(i), ctrl(String(i)));
    }
    expect(onJumpToAgent).toHaveBeenCalledTimes(9);
    for (let i = 0; i < 9; i++) {
      expect(onJumpToAgent).toHaveBeenNthCalledWith(i + 1, i + 1);
    }
  });

  it('does not fire for Ctrl+0 (0 is not in the 1..9 range)', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    capturedHandler!('0', ctrl('0'));
    expect(onJumpToAgent).not.toHaveBeenCalled();
  });

  it('does not fire for plain digit (no Ctrl modifier)', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    capturedHandler!('1', { ctrl: false, shift: false, tab: false, escape: false, meta: false });
    expect(onJumpToAgent).not.toHaveBeenCalled();
  });

  it('is a no-op when onJumpToAgent is not provided (does not crash)', () => {
    render(<TestComponent options={defaultOptions} />);
    expect(() => capturedHandler!('1', ctrl('1'))).not.toThrow();
  });

  it('does not clash with the Ctrl+K command palette handler', () => {
    const onJumpToAgent = vi.fn();
    render(<TestComponent options={{ ...defaultOptions, onJumpToAgent }} />);
    capturedHandler!('k', ctrl('k'));
    expect(onJumpToAgent).not.toHaveBeenCalled();
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });
});
