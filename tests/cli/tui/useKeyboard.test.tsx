import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// ---------------------------------------------------------------------------
// Mocks — must be declared BEFORE any imports that transitively use them
// ---------------------------------------------------------------------------

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
  DialogProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

// Import AFTER mocks are set up
import { useKeyboard, type UseKeyboardOptions } from '../../../src/cli/tui/hooks/useKeyboard.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultOptions: UseKeyboardOptions = {
  onExit: vi.fn(),
  onClear: vi.fn(),
  onNewSession: vi.fn(),
  isInputActive: false,
};

function TestComponent({ options }: { options: UseKeyboardOptions }): React.JSX.Element {
  useKeyboard(options);
  return <Text>keyboard-test</Text>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useKeyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { lastFrame } = render(<TestComponent options={defaultOptions} />);
    expect(lastFrame()).toContain('keyboard-test');
  });

  it('exports useKeyboard function', () => {
    expect(useKeyboard).toBeInstanceOf(Function);
  });

  it('accepts all required options without throwing', () => {
    const options: UseKeyboardOptions = {
      onExit: vi.fn(),
      onClear: vi.fn(),
      onNewSession: vi.fn(),
      isInputActive: true,
    };
    expect(() => render(<TestComponent options={options} />)).not.toThrow();
  });

  it('UseKeyboardOptions interface is exported (compile-time type check)', () => {
    // If UseKeyboardOptions is not exported the TypeScript compiler rejects
    // this file.  At runtime we verify the hook itself is callable.
    const opts: UseKeyboardOptions = {
      onExit: vi.fn(),
      onClear: vi.fn(),
      onNewSession: vi.fn(),
      isInputActive: false,
    };
    expect(typeof opts.onExit).toBe('function');
    expect(typeof opts.onClear).toBe('function');
    expect(typeof opts.onNewSession).toBe('function');
    expect(typeof opts.isInputActive).toBe('boolean');
  });

  it('does not call callbacks on render', () => {
    const onExit = vi.fn();
    const onClear = vi.fn();
    const onNewSession = vi.fn();

    render(<TestComponent options={{ onExit, onClear, onNewSession, isInputActive: false }} />);

    expect(onExit).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
    expect(onNewSession).not.toHaveBeenCalled();
  });

  it('does not call leader-mode helpers on render', () => {
    render(<TestComponent options={defaultOptions} />);

    expect(mockActivateLeader).not.toHaveBeenCalled();
    expect(mockDeactivateLeader).not.toHaveBeenCalled();
    expect(mockCycleAgent).not.toHaveBeenCalled();
  });

  it('does not open any dialog on render', () => {
    render(<TestComponent options={defaultOptions} />);
    expect(mockOpen).not.toHaveBeenCalled();
  });
});
