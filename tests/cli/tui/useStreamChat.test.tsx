import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useEffect, useRef } from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import type { ChatContextValue } from '../../../src/cli/tui/context/ChatContext.js';
import type { SessionContextValue } from '../../../src/cli/tui/context/SessionContext.js';
import type { UseStreamChatReturn } from '../../../src/cli/tui/hooks/useStreamChat.js';
import type { StreamingResult } from '../../../src/core/streamingOrchestrator.js';

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use them
// ---------------------------------------------------------------------------

const mockStreamChat = vi.fn();

vi.mock('../../../src/core/streamingOrchestrator.js', () => ({
  streamChat: (...args: unknown[]) => mockStreamChat(...args),
}));

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
  addToolCall: vi.fn(),
  updateToolCall: vi.fn(),
  toggleToolCallExpansion: vi.fn(),
  setError: vi.fn(),
  setAbortController: vi.fn(),
  setResponseModel: vi.fn(),
  reset: vi.fn(),
};

const mockSession: SessionContextValue = {
  sessionId: 'test-session',
  model: 'claude-sonnet-4',
  autoRoute: false,
  agent: 'code',
  stage: null,
  tokenCount: 0,
  cost: { inputTokens: 0, outputTokens: 0, totalCost: 0, currency: 'USD' },
  setModel: vi.fn(),
  setAgent: vi.fn(),
  cycleAgent: vi.fn(),
  setTokenCount: vi.fn(),
  setCost: vi.fn(),
};

vi.mock('../../../src/cli/tui/context/ChatContext.js', () => ({
  useChat: () => mockChat,
}));

vi.mock('../../../src/cli/tui/context/SessionContext.js', () => ({
  useSession: () => mockSession,
}));

const mockConsumeAll = vi.fn().mockReturnValue([]);

vi.mock('../../../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: null,
    pasteFromClipboard: vi.fn(),
    addFromFile: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn(),
    consumeAll: mockConsumeAll,
  }),
}));

// Import hook AFTER mocks are set up
import { useStreamChat } from '../../../src/cli/tui/hooks/useStreamChat.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Minimal component that captures the hook API via a callback.
 */
function TestComponent({
  onReady,
}: {
  onReady: (api: UseStreamChatReturn) => void;
}): React.JSX.Element {
  const api = useStreamChat();
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onReady(api);
    }
  }, [api, onReady]);
  return <Text>hook-test</Text>;
}

/**
 * Creates an async generator that yields the given chunks then returns a result.
 */
async function* fakeGenerator(
  chunks: Array<{ text?: string }>,
  result: StreamingResult
): AsyncGenerator<{ text?: string }, StreamingResult> {
  for (const chunk of chunks) {
    yield chunk;
  }
  return result;
}

/**
 * Renders the TestComponent, captures the hook API, and returns it.
 */
function renderHook(): UseStreamChatReturn {
  let api: UseStreamChatReturn | undefined;
  render(<TestComponent onReady={(a) => (api = a)} />);
  if (!api) {
    throw new Error('Hook API was not captured — TestComponent did not call onReady');
  }
  return api;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useStreamChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('sets streaming to true and calls streamChat with correct options', async () => {
      const result: StreamingResult = {
        text: 'Hello',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('hi');

      expect(mockChat.clearStreamText).toHaveBeenCalled();
      expect(mockChat.setError).toHaveBeenCalledWith(null);
      expect(mockChat.setResponseModel).toHaveBeenCalledWith(null);
      expect(mockChat.setStreaming).toHaveBeenCalledWith(true);

      expect(mockStreamChat).toHaveBeenCalledOnce();
      const [message, options] = mockStreamChat.mock.calls[0];
      expect(message).toBe('hi');
      expect(options.modelOverride).toBe('claude-sonnet-4');
      expect(options.autoRoute).toBe(false);
      expect(options.agentId).toBe('code');
      expect(options.signal).toBeInstanceOf(AbortSignal);
    });

    it('appends stream text from chunks', async () => {
      const result: StreamingResult = {
        text: 'Hello World',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(
        fakeGenerator([{ text: 'Hello' }, { text: ' World' }], result)
      );

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockChat.appendStreamText).toHaveBeenCalledTimes(2);
      expect(mockChat.appendStreamText).toHaveBeenNthCalledWith(1, 'Hello');
      expect(mockChat.appendStreamText).toHaveBeenNthCalledWith(2, ' World');
    });

    it('skips chunks without text', async () => {
      const result: StreamingResult = {
        text: 'ok',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([{ text: undefined }, { text: 'ok' }], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockChat.appendStreamText).toHaveBeenCalledTimes(1);
      expect(mockChat.appendStreamText).toHaveBeenCalledWith('ok');
    });

    it('sets streaming to false when done', async () => {
      const result: StreamingResult = {
        text: 'done',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      // setStreaming(true) first, then setStreaming(false) in finally
      const streamingCalls = (mockChat.setStreaming as ReturnType<typeof vi.fn>).mock.calls;
      expect(streamingCalls[0][0]).toBe(true);
      expect(streamingCalls[streamingCalls.length - 1][0]).toBe(false);
    });

    it('sets response model from result', async () => {
      const result: StreamingResult = {
        text: 'response',
        modelUsed: 'gpt-4o',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      // First call with null (reset), second with the model from result
      expect(mockChat.setResponseModel).toHaveBeenCalledWith(null);
      expect(mockChat.setResponseModel).toHaveBeenCalledWith('gpt-4o');
    });

    it('updates token count from usage', async () => {
      const result: StreamingResult = {
        text: 'response',
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockSession.setTokenCount).toHaveBeenCalledWith(30);
    });

    it('does not update token count when usage is missing', async () => {
      const result: StreamingResult = {
        text: 'response',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockSession.setTokenCount).not.toHaveBeenCalled();
    });

    it('sets error on failure', async () => {
      mockStreamChat.mockImplementation(async function* () {
        throw new Error('network failure');
      });

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockChat.setError).toHaveBeenCalledWith('network failure');
      // Streaming should still be set to false in finally
      const streamingCalls = (mockChat.setStreaming as ReturnType<typeof vi.fn>).mock.calls;
      expect(streamingCalls[streamingCalls.length - 1][0]).toBe(false);
    });

    it('sets error from non-Error thrown values', async () => {
      mockStreamChat.mockImplementation(async function* () {
        throw 'string error';
      });

      const { sendMessage } = renderHook();
      await sendMessage('test');

      expect(mockChat.setError).toHaveBeenCalledWith('string error');
    });

    it('does not set error on AbortError', async () => {
      mockStreamChat.mockImplementation(async function* () {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      });

      const { sendMessage } = renderHook();
      await sendMessage('test');

      // setError should only have been called once with null (the reset at start)
      expect(mockChat.setError).toHaveBeenCalledTimes(1);
      expect(mockChat.setError).toHaveBeenCalledWith(null);
    });

    it('clears abort controller in finally block', async () => {
      const result: StreamingResult = {
        text: 'done',
        modelUsed: 'claude-sonnet-4',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('test');

      // setAbortController called with an AbortController first, then null in finally
      const calls = (mockChat.setAbortController as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls[0][0]).toBeInstanceOf(AbortController);
      expect(calls[calls.length - 1][0]).toBeNull();
    });
  });

  describe('abort', () => {
    it('calls abort on the internal AbortController', async () => {
      // We need to capture the AbortController that sendMessage creates.
      // When setAbortController is called, we capture the controller.
      let capturedController: AbortController | null = null;
      (mockChat.setAbortController as ReturnType<typeof vi.fn>).mockImplementation(
        (ctrl: AbortController | null) => {
          capturedController = ctrl;
        }
      );

      // Use a generator that we can control (pauses before yielding)
      let resolveChunk: (() => void) | undefined;
      const chunkPromise = new Promise<void>((resolve) => {
        resolveChunk = resolve;
      });

      mockStreamChat.mockImplementation(async function* () {
        await chunkPromise;
        return { text: '', modelUsed: 'claude-sonnet-4' } as StreamingResult;
      });

      const { sendMessage, abort } = renderHook();

      // Start sending (don't await — it will hang on chunkPromise)
      const sendPromise = sendMessage('test');

      // Wait a tick to let the controller be created
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(capturedController).toBeInstanceOf(AbortController);
      expect(capturedController!.signal.aborted).toBe(false);

      // Abort
      abort();
      expect(capturedController!.signal.aborted).toBe(true);

      // Unblock the generator so sendMessage can finish
      resolveChunk!();
      await sendPromise;
    });
  });

  describe('session context usage', () => {
    it('passes session model and agent to streamChat', async () => {
      // Override session values for this test
      mockSession.model = 'gpt-4o-mini';
      mockSession.autoRoute = true;
      mockSession.agent = 'debug';

      const result: StreamingResult = {
        text: 'ok',
        modelUsed: 'gpt-4o-mini',
      };

      mockStreamChat.mockReturnValue(fakeGenerator([], result));

      const { sendMessage } = renderHook();
      await sendMessage('debug this');

      const [, options] = mockStreamChat.mock.calls[0];
      expect(options.modelOverride).toBe('gpt-4o-mini');
      expect(options.autoRoute).toBe(true);
      expect(options.agentId).toBe('debug');

      // Restore defaults for other tests
      mockSession.model = 'claude-sonnet-4';
      mockSession.autoRoute = false;
      mockSession.agent = 'code';
    });
  });
});
