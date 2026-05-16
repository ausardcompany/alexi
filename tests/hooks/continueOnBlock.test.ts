/**
 * Tests for continueOnBlock hook rejection feedback loop
 *
 * Verifies that PostToolUse hooks with continueOnBlock: true feed rejection
 * reasons back to the model, while hooks without it halt execution.
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

describe('continueOnBlock - hook rejection feedback loop', () => {
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

  beforeEach(() => {
    mockProvider = {
      complete: vi.fn(),
    };
    vi.mocked(getProviderForModel).mockReturnValue(
      mockProvider as unknown as ReturnType<typeof getProviderForModel>
    );

    mockToolRegistry.list.mockReturnValue([mockWriteTool]);
    mockToolRegistry.get.mockImplementation((name: string) =>
      name === 'write' ? mockWriteTool : undefined
    );

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

  describe('hook with continueOnBlock: true', () => {
    it('should inject error message into conversation when hook rejects', async () => {
      // First call: LLM makes a tool call
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/etc/passwd", "content": "bad"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // Hook rejects with continueOnBlock: true
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
        text: 'I apologize, I cannot write to system files. Let me try a different approach.',
        usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write something');

      expect(result.text).toBe(
        'I apologize, I cannot write to system files. Let me try a different approach.'
      );
      expect(result.iterations).toBe(2);

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
          output: 'Policy violation: file size exceeds limit',
          duration: 3,
          continueOnBlock: true,
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Understood, I will reduce the file size.',
        usage: { prompt_tokens: 100, completion_tokens: 15, total_tokens: 115 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write large file');

      const secondCallMessages = mockProvider.complete.mock.calls[1][0];
      const blockedMessage = secondCallMessages.find(
        (m: { role: string; content?: string }) =>
          m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(blockedMessage.content).toContain('Policy violation: file size exceeds limit');
      expect(result.text).toBe('Understood, I will reduce the file size.');
    });

    it('should continue the agentic loop after rejection', async () => {
      // First LLM call: tool call that will be blocked
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/bad"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // Hook rejects
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          error: 'Blocked path',
          duration: 2,
          continueOnBlock: true,
        },
      ]);

      // Second LLM call: tries again with a good path
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_2',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/good"}' },
          },
        ],
        usage: { prompt_tokens: 80, completion_tokens: 20, total_tokens: 100 },
      } satisfies CompletionResult);

      // Second hook execution passes
      mockExecuteHooks.mockResolvedValueOnce([{ success: true, duration: 1 }]);

      // Third LLM call: done
      mockProvider.complete.mockResolvedValueOnce({
        text: 'File written successfully.',
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write to file');

      expect(result.text).toBe('File written successfully.');
      expect(result.iterations).toBe(3);
      expect(result.toolCallsExecuted).toBe(2);
    });
  });

  describe('hook without continueOnBlock (default halt behavior)', () => {
    it('should throw and halt when hook rejects without continueOnBlock', async () => {
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

      // Hook rejects without continueOnBlock
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          error: 'Critical security violation',
          duration: 5,
        },
      ]);

      await expect(agenticChat('Write something dangerous')).rejects.toThrow(
        'PostToolUse hook blocked execution: Critical security violation'
      );
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

      // Hook rejects with output but no error, no continueOnBlock
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          output: 'Audit log: unauthorized operation detected',
          duration: 3,
        },
      ]);

      await expect(agenticChat('Do something')).rejects.toThrow(
        'PostToolUse hook blocked execution: Audit log: unauthorized operation detected'
      );
    });

    it('should use default message when neither error nor output is provided', async () => {
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

      // Hook rejects with no error and no output
      mockExecuteHooks.mockResolvedValueOnce([
        {
          success: false,
          duration: 1,
        },
      ]);

      await expect(agenticChat('Do something')).rejects.toThrow(
        'PostToolUse hook blocked execution: Hook rejected tool execution'
      );
    });
  });

  describe('error message content matches hook output', () => {
    it('should include exact error text from hook stderr in the injected message', async () => {
      const hookErrorMessage = 'POLICY_VIOLATION: Cannot write to protected directory /var/lib';

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
          error: hookErrorMessage,
          duration: 10,
          continueOnBlock: true,
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'I will use a different directory.',
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 },
      } satisfies CompletionResult);

      await agenticChat('Write to /var/lib');

      const secondCallMessages = mockProvider.complete.mock.calls[1][0];
      const blockedMessage = secondCallMessages.find(
        (m: { role: string; content?: string }) =>
          m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(blockedMessage).toBeDefined();
      expect(blockedMessage.content).toBe(
        `Tool execution was blocked: ${hookErrorMessage}. Please try a different approach.`
      );
    });
  });

  describe('hooks that pass (no rejection)', () => {
    it('should not inject any message when hooks succeed', async () => {
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

      // Hook succeeds
      mockExecuteHooks.mockResolvedValueOnce([
        { success: true, output: 'Hook passed', duration: 2 },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write ok file');

      expect(result.text).toBe('Done.');
      expect(result.iterations).toBe(2);

      // Verify no "blocked" message in conversation
      const secondCallMessages = mockProvider.complete.mock.calls[1][0];
      const blockedMessages = secondCallMessages.filter(
        (m: { role: string; content?: string }) =>
          m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(blockedMessages).toHaveLength(0);
    });

    it('should not inject any message when no hooks are registered', async () => {
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

      // No hooks registered — returns empty array
      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write');

      expect(result.text).toBe('Done.');
    });
  });

  describe('hook context creation', () => {
    it('should create hook context with correct event and tool info', async () => {
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

      mockExecuteHooks.mockResolvedValueOnce([]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 80, completion_tokens: 5, total_tokens: 85 },
      } satisfies CompletionResult);

      await agenticChat('Write test');

      expect(mockCreateHookContext).toHaveBeenCalledWith('PostToolUse', {
        sessionId: undefined,
        toolName: 'write',
        toolResult: expect.objectContaining({ success: true }),
      });
    });
  });
});
