/**
 * Tests for PreToolUse hook execution in the agentic loop
 *
 * Verifies that PreToolUse hooks are called before each tool execution,
 * can block tool execution (halt or feed back), and pass through when successful.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CompletionResult } from '../../src/providers/sapOrchestration.js';

// Mock memory module (dynamic import)
vi.mock('../../src/core/memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

// Mock session context module (dynamic import)
vi.mock('../../src/core/sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

// Mock the providers module
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

// Mock the router
vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(() => ({
    modelId: 'gpt-4o',
    reason: 'test routing',
    confidence: 0.9,
  })),
}));

// Mock the cost tracker
vi.mock('../../src/core/costTracker.js', () => ({
  getCostTracker: vi.fn(() => ({
    recordUsage: vi.fn(),
  })),
}));

// Mock the tool registry
const mockToolRegistry = {
  list: vi.fn(),
  get: vi.fn(),
};

vi.mock('../../src/tool/index.js', () => ({
  getToolRegistry: () => mockToolRegistry,
  registerTool: vi.fn(),
}));

// Mock registerBuiltInTools
vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

// Mock hooks module
const mockExecuteHooks = vi.fn();
const mockCreateHookContext = vi.fn();

vi.mock('../../src/hooks/index.js', () => ({
  executeHooks: (...args: unknown[]) => mockExecuteHooks(...args),
  createHookContext: (...args: unknown[]) => mockCreateHookContext(...args),
}));

import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel } from '../../src/providers/index.js';

describe('PreToolUse hooks', () => {
  let mockProvider: {
    complete: ReturnType<typeof vi.fn>;
  };

  const mockWriteTool = {
    name: 'write',
    description: 'Write to file',
    toFunctionSchema: () => ({
      name: 'write',
      description: 'Write to file',
      parameters: { type: 'object', properties: {} },
    }),
    execute: vi.fn().mockResolvedValue({
      success: true,
      data: { written: true },
    }),
  };

  const mockReadTool = {
    name: 'read',
    description: 'Read a file',
    toFunctionSchema: () => ({
      name: 'read',
      description: 'Read a file',
      parameters: { type: 'object', properties: {} },
    }),
    execute: vi.fn().mockResolvedValue({
      success: true,
      data: { content: 'file contents' },
    }),
  };

  beforeEach(() => {
    mockProvider = {
      complete: vi.fn(),
    };
    vi.mocked(getProviderForModel).mockReturnValue(
      mockProvider as unknown as ReturnType<typeof getProviderForModel>
    );

    mockToolRegistry.list.mockReturnValue([mockWriteTool, mockReadTool]);
    mockToolRegistry.get.mockImplementation((name: string) => {
      if (name === 'write') {
        return mockWriteTool;
      }
      if (name === 'read') {
        return mockReadTool;
      }
      return undefined;
    });

    // Default: hooks pass (no rejections)
    mockExecuteHooks.mockResolvedValue([]);
    mockCreateHookContext.mockImplementation((event: string, data: Record<string, unknown>) => ({
      event,
      timestamp: Date.now(),
      ...data,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('PreToolUse hook blocks tool execution and halts', () => {
    it('should throw and halt when PreToolUse hook rejects without continueOnBlock', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/etc/passwd"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse hook rejects without continueOnBlock
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          error: 'Writing to /etc/passwd is forbidden',
          duration: 5,
        },
      ]);

      await expect(agenticChat('Write to /etc/passwd')).rejects.toThrow(
        'PreToolUse hook blocked execution: Writing to /etc/passwd is forbidden'
      );

      // Tool should NOT have been executed
      expect(mockWriteTool.execute).not.toHaveBeenCalled();
    });

    it('should throw with hook output when error is not provided', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          output: 'Policy: tool blocked by admin',
          duration: 3,
        },
      ]);

      await expect(agenticChat('Write something')).rejects.toThrow(
        'PreToolUse hook blocked execution: Policy: tool blocked by admin'
      );

      expect(mockWriteTool.execute).not.toHaveBeenCalled();
    });

    it('should throw with default message when neither error nor output is provided', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          duration: 1,
        },
      ]);

      await expect(agenticChat('Write something')).rejects.toThrow(
        'PreToolUse hook blocked execution: Hook rejected tool execution'
      );

      expect(mockWriteTool.execute).not.toHaveBeenCalled();
    });
  });

  describe('PreToolUse hook with continueOnBlock feeds rejection to model', () => {
    it('should inject error message and skip tool execution when hook rejects', async () => {
      // First call: LLM makes a tool call
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: {
              name: 'write',
              arguments: '{"filePath": "/etc/passwd", "content": "bad"}',
            },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse hook rejects with continueOnBlock: true
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          error: 'Writing to /etc/passwd is not allowed',
          duration: 5,
          continueOnBlock: true,
        },
      ]);

      // Second call: LLM self-corrects after seeing the error
      mockProvider.complete.mockResolvedValueOnce({
        text: 'I cannot write to system files. Let me try a different approach.',
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write something');

      expect(result.text).toBe('I cannot write to system files. Let me try a different approach.');
      expect(result.iterations).toBe(2);

      // Tool should NOT have been executed
      expect(mockWriteTool.execute).not.toHaveBeenCalled();

      // Verify the error message was injected into conversation
      const secondCallMessages = mockProvider.complete.mock.calls[1][0];
      const userMessages = secondCallMessages.filter(
        (m: { role: string; content?: string }) =>
          m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(userMessages).toHaveLength(1);
      expect(userMessages[0].content).toContain('Writing to /etc/passwd is not allowed');
      expect(userMessages[0].content).toContain('Please try a different approach');
    });

    it('should use hook output as error reason when error field is empty', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // Hook rejects with output but no error
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          output: 'Policy violation: operation not permitted',
          duration: 3,
          continueOnBlock: true,
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Understood.',
        usage: { prompt_tokens: 100, completion_tokens: 15, total_tokens: 115 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write a file');

      const secondCallMessages = mockProvider.complete.mock.calls[1][0];
      const blockedMessage = secondCallMessages.find(
        (m: { role: string; content?: string }) =>
          m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(blockedMessage.content).toContain('Policy violation: operation not permitted');
      expect(result.text).toBe('Understood.');
    });
  });

  describe('PreToolUse hook passes and tool executes normally', () => {
    it('should execute tool when PreToolUse hook succeeds', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/ok.txt"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse hook passes
      mockExecuteHooks.mockResolvedValueOnce([
        { success: true, output: 'Hook passed', duration: 2 },
      ]);

      // PostToolUse hook also passes
      mockExecuteHooks.mockResolvedValueOnce([]);

      // Stop hooks pass
      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'File written.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write ok file');

      expect(result.text).toBe('File written.');
      expect(result.iterations).toBe(2);
      expect(result.toolCallsExecuted).toBe(1);

      // Tool SHOULD have been executed
      expect(mockWriteTool.execute).toHaveBeenCalled();
    });

    it('should execute tool when no PreToolUse hooks are registered', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/ok.txt"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse: no hooks registered — returns empty array
      mockExecuteHooks.mockResolvedValueOnce([]);

      // PostToolUse: no hooks
      mockExecuteHooks.mockResolvedValueOnce([]);

      // Stop hooks
      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write');

      expect(result.text).toBe('Done.');
      expect(result.toolCallsExecuted).toBe(1);
      expect(mockWriteTool.execute).toHaveBeenCalled();
    });
  });

  describe('Multiple PreToolUse hooks execute sequentially', () => {
    it('should execute all PreToolUse hooks and pass if all succeed', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/test.txt"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse: multiple hooks all pass
      mockExecuteHooks.mockResolvedValueOnce([
        { success: true, output: 'Hook 1 passed', duration: 2 },
        { success: true, output: 'Hook 2 passed', duration: 3 },
        { success: true, output: 'Hook 3 passed', duration: 1 },
      ]);

      // PostToolUse: passes
      mockExecuteHooks.mockResolvedValueOnce([]);

      // Stop hooks
      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'All good.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write test file');

      expect(result.text).toBe('All good.');
      expect(result.toolCallsExecuted).toBe(1);
      expect(mockWriteTool.execute).toHaveBeenCalled();
    });

    it('should halt on first failing hook without continueOnBlock', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse: first passes, second fails (halt)
      mockExecuteHooks.mockResolvedValueOnce([
        { success: true, output: 'Hook 1 passed', duration: 2 },
        { success: false, error: 'Security check failed', duration: 5 },
      ]);

      await expect(agenticChat('Write')).rejects.toThrow(
        'PreToolUse hook blocked execution: Security check failed'
      );

      expect(mockWriteTool.execute).not.toHaveBeenCalled();
    });

    it('should block tool and feed back on first failing hook with continueOnBlock', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse: first passes, second fails with continueOnBlock
      mockExecuteHooks.mockResolvedValueOnce([
        { success: true, output: 'Hook 1 passed', duration: 2 },
        { success: false, error: 'Blocked by policy', duration: 5, continueOnBlock: true },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Got it, will try differently.',
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write');

      expect(result.text).toBe('Got it, will try differently.');
      expect(mockWriteTool.execute).not.toHaveBeenCalled();
    });
  });

  describe('hook context creation', () => {
    it('should create PreToolUse hook context with correct event, toolName, and toolParams', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/test.txt", "content": "hi"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // PreToolUse passes
      mockExecuteHooks.mockResolvedValueOnce([]);

      // PostToolUse passes
      mockExecuteHooks.mockResolvedValueOnce([]);

      // Stop hooks
      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      await agenticChat('Write test');

      expect(mockCreateHookContext).toHaveBeenCalledWith('PreToolUse', {
        sessionId: undefined,
        toolName: 'write',
        toolParams: { filePath: '/test.txt', content: 'hi' },
      });
    });
  });
});
