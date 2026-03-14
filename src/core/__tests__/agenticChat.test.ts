/**
 * Tests for agentic chat functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CompletionResult } from '../../providers/sapOrchestration.js';

// Mock memory module (dynamic import)
vi.mock('../memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

// Mock session context module (dynamic import)
vi.mock('../sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

// Mock the providers module
vi.mock('../../providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

// Mock the router
vi.mock('../router.js', () => ({
  routePrompt: vi.fn(() => ({
    modelId: 'gpt-4o',
    reason: 'test routing',
    confidence: 0.9,
  })),
}));

// Mock the cost tracker
vi.mock('../costTracker.js', () => ({
  getCostTracker: vi.fn(() => ({
    recordUsage: vi.fn(),
  })),
}));

// Mock the tool registry
const mockToolRegistry = {
  list: vi.fn(),
  get: vi.fn(),
};

vi.mock('../../tool/index.js', () => ({
  getToolRegistry: () => mockToolRegistry,
  registerTool: vi.fn(),
}));

// Mock registerBuiltInTools
vi.mock('../../tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

import { agenticChat } from '../agenticChat.js';
import { getProviderForModel } from '../../providers/index.js';
import { getMemoryManager } from '../memory.js';
import { getSessionContextString } from '../sessionContext.js';

describe('agenticChat', () => {
  let mockProvider: {
    complete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockProvider = {
      complete: vi.fn(),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    // Default: no tools registered
    mockToolRegistry.list.mockReturnValue([]);
    mockToolRegistry.get.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic chat without tools', () => {
    it('should return response when LLM responds without tool calls', async () => {
      mockProvider.complete.mockResolvedValue({
        text: 'Hello! How can I help you?',
        usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
        toolCalls: undefined,
      } satisfies CompletionResult);

      const result = await agenticChat('Hello');

      expect(result.text).toBe('Hello! How can I help you?');
      expect(result.iterations).toBe(1);
      expect(result.toolCallsExecuted).toBe(0);
      expect(result.toolCallSummary).toEqual([]);
    });

    it('should include usage statistics', async () => {
      mockProvider.complete.mockResolvedValue({
        text: 'Response',
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      } satisfies CompletionResult);

      const result = await agenticChat('Test');

      expect(result.usage).toEqual({
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      });
    });

    it('should use specified model', async () => {
      mockProvider.complete.mockResolvedValue({
        text: 'Response',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      const result = await agenticChat('Test', { modelOverride: 'claude-3-opus' });

      expect(result.modelUsed).toBe('claude-3-opus');
      expect(getProviderForModel).toHaveBeenCalledWith('claude-3-opus');
    });
  });

  describe('tool execution loop', () => {
    it('should execute tool calls and continue conversation', async () => {
      // Register a mock tool
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

      mockToolRegistry.list.mockReturnValue([mockWriteTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'write' ? mockWriteTool : undefined
      );

      // First call: LLM wants to use write tool
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_123',
            type: 'function',
            function: {
              name: 'write',
              arguments: '{"filePath": "/test.txt", "content": "hello"}',
            },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      // Second call: LLM responds with text (done)
      mockProvider.complete.mockResolvedValueOnce({
        text: 'I have written the file.',
        usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
      } satisfies CompletionResult);

      const result = await agenticChat('Write hello to /test.txt');

      expect(result.text).toBe('I have written the file.');
      expect(result.iterations).toBe(2);
      expect(result.toolCallsExecuted).toBe(1);
      expect(result.toolCallSummary).toEqual([{ name: 'write', success: true }]);
      expect(mockWriteTool.execute).toHaveBeenCalledWith(
        { filePath: '/test.txt', content: 'hello' },
        expect.objectContaining({ workdir: expect.any(String) })
      );
    });

    it('should handle multiple tool calls in one iteration', async () => {
      const mockReadTool = {
        name: 'read',
        description: 'Read file',
        toFunctionSchema: () => ({
          name: 'read',
          description: 'Read file',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockResolvedValue({
          success: true,
          data: { content: 'file content' },
        }),
      };

      const mockGrepTool = {
        name: 'grep',
        description: 'Search file',
        toFunctionSchema: () => ({
          name: 'grep',
          description: 'Search file',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockResolvedValue({
          success: true,
          data: { matches: [] },
        }),
      };

      mockToolRegistry.list.mockReturnValue([mockReadTool, mockGrepTool]);
      mockToolRegistry.get.mockImplementation((name: string) => {
        if (name === 'read') return mockReadTool;
        if (name === 'grep') return mockGrepTool;
        return undefined;
      });

      // First call: LLM wants to use both read and grep
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'read', arguments: '{"filePath": "/a.txt"}' },
          },
          {
            id: 'call_2',
            type: 'function',
            function: { name: 'grep', arguments: '{"pattern": "test"}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 30, total_tokens: 80 },
      } satisfies CompletionResult);

      // Second call: LLM responds with text
      mockProvider.complete.mockResolvedValueOnce({
        text: 'Found the information.',
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 },
      } satisfies CompletionResult);

      const result = await agenticChat('Search and read');

      expect(result.iterations).toBe(2);
      expect(result.toolCallsExecuted).toBe(2);
      expect(result.toolCallSummary).toHaveLength(2);
      expect(mockReadTool.execute).toHaveBeenCalled();
      expect(mockGrepTool.execute).toHaveBeenCalled();
    });

    it('should accumulate token usage across iterations', async () => {
      const mockTool = {
        name: 'test',
        description: 'Test tool',
        toFunctionSchema: () => ({
          name: 'test',
          description: 'Test tool',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockResolvedValue({ success: true }),
      };

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockReturnValue(mockTool);

      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { id: 'call_1', type: 'function', function: { name: 'test', arguments: '{}' } },
        ],
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      } satisfies CompletionResult);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done',
        usage: { prompt_tokens: 200, completion_tokens: 25, total_tokens: 225 },
      } satisfies CompletionResult);

      const result = await agenticChat('Run test');

      expect(result.usage).toEqual({
        prompt_tokens: 300,
        completion_tokens: 75,
        total_tokens: 375,
      });
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool gracefully', async () => {
      mockToolRegistry.list.mockReturnValue([]);
      mockToolRegistry.get.mockReturnValue(undefined);

      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'unknown_tool', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'The tool was not found.',
        usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
      } satisfies CompletionResult);

      const result = await agenticChat('Use unknown tool');

      expect(result.toolCallSummary).toEqual([
        { name: 'unknown_tool', success: false, error: 'Unknown tool: unknown_tool' },
      ]);
    });

    it('should handle invalid JSON in tool arguments', async () => {
      const mockTool = {
        name: 'test',
        description: 'Test',
        toFunctionSchema: () => ({
          name: 'test',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn(),
      };

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockReturnValue(mockTool);

      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'test', arguments: 'not valid json' },
          },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'There was an error.',
        usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
      } satisfies CompletionResult);

      const result = await agenticChat('Test');

      expect(result.toolCallSummary[0].success).toBe(false);
      expect(result.toolCallSummary[0].error).toContain('Invalid JSON');
      expect(mockTool.execute).not.toHaveBeenCalled();
    });

    it('should handle tool execution errors', async () => {
      const mockTool = {
        name: 'failing',
        description: 'Fails',
        toFunctionSchema: () => ({
          name: 'failing',
          description: 'Fails',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockRejectedValue(new Error('Tool crashed')),
      };

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockReturnValue(mockTool);

      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { id: 'call_1', type: 'function', function: { name: 'failing', arguments: '{}' } },
        ],
        usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
      } satisfies CompletionResult);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Tool failed.',
        usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
      } satisfies CompletionResult);

      const result = await agenticChat('Run failing tool');

      expect(result.toolCallSummary).toEqual([
        { name: 'failing', success: false, error: 'Tool execution error: Tool crashed' },
      ]);
    });
  });

  describe('max iterations', () => {
    it('should stop at max iterations', async () => {
      const mockTool = {
        name: 'loop',
        description: 'Loop',
        toFunctionSchema: () => ({
          name: 'loop',
          description: 'Loop',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockResolvedValue({ success: true }),
      };

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockReturnValue(mockTool);

      // Always return tool calls (infinite loop attempt)
      mockProvider.complete.mockResolvedValue({
        text: '',
        toolCalls: [
          { id: 'call_1', type: 'function', function: { name: 'loop', arguments: '{}' } },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      const result = await agenticChat('Loop forever', { maxIterations: 3 });

      expect(result.iterations).toBe(3);
      expect(mockProvider.complete).toHaveBeenCalledTimes(3);
    });
  });

  describe('progress callbacks', () => {
    it('should call onProgress for each event', async () => {
      const onProgress = vi.fn();

      const mockTool = {
        name: 'test',
        description: 'Test',
        toFunctionSchema: () => ({
          name: 'test',
          description: 'Test',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn().mockResolvedValue({ success: true, data: {} }),
      };

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockReturnValue(mockTool);

      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          { id: 'call_1', type: 'function', function: { name: 'test', arguments: '{}' } },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'Done',
        usage: { prompt_tokens: 20, completion_tokens: 5, total_tokens: 25 },
      } satisfies CompletionResult);

      await agenticChat('Test', { onProgress });

      const eventTypes = onProgress.mock.calls.map((call) => call[0].type);
      expect(eventTypes).toContain('iteration');
      expect(eventTypes).toContain('llm_call');
      expect(eventTypes).toContain('tool_start');
      expect(eventTypes).toContain('tool_end');
      expect(eventTypes).toContain('complete');
    });
  });

  describe('tool filtering', () => {
    it('should only enable specified tools', async () => {
      const readTool = {
        name: 'read',
        description: 'Read',
        toFunctionSchema: () => ({
          name: 'read',
          description: 'Read',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn(),
      };

      const writeTool = {
        name: 'write',
        description: 'Write',
        toFunctionSchema: () => ({
          name: 'write',
          description: 'Write',
          parameters: { type: 'object', properties: {} },
        }),
        execute: vi.fn(),
      };

      mockToolRegistry.list.mockReturnValue([readTool, writeTool]);

      mockProvider.complete.mockResolvedValue({
        text: 'Response',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      await agenticChat('Test', { enabledTools: ['read'] });

      // Check that only 'read' tool was passed to the provider
      const completionCall = mockProvider.complete.mock.calls[0];
      const options = completionCall[1];

      expect(options.tools).toHaveLength(1);
      expect(options.tools[0].function.name).toBe('read');
    });
  });

  describe('system prompt context injection', () => {
    beforeEach(() => {
      // Reset context mocks to return empty by default
      vi.mocked(getMemoryManager).mockReturnValue({
        getContextString: vi.fn().mockReturnValue(''),
      } as any);
      vi.mocked(getSessionContextString).mockReturnValue('');

      mockProvider.complete.mockResolvedValue({
        text: 'Response',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      });
    });

    describe('memory context injection', () => {
      it('should include memory context in the system message when non-empty', async () => {
        vi.mocked(getMemoryManager).mockReturnValue({
          getContextString: vi.fn().mockReturnValue('## Decisions & Facts\n- Use TypeScript'),
        } as any);

        await agenticChat('Test message');

        const messages = mockProvider.complete.mock.calls[0][0];
        expect(messages[0].role).toBe('system');
        expect(messages[0].content).toContain('## Decisions & Facts\n- Use TypeScript');
      });
    });

    describe('session context injection', () => {
      it('should include session context in the system message when non-empty', async () => {
        vi.mocked(getSessionContextString).mockReturnValue(
          '## Recent Session Context\n### Session: "Fix bugs" (2025-01-01)\n- Working on: fixing tests'
        );

        await agenticChat('Test message');

        const messages = mockProvider.complete.mock.calls[0][0];
        expect(messages[0].role).toBe('system');
        expect(messages[0].content).toContain('## Recent Session Context');
        expect(messages[0].content).toContain('Fix bugs');
      });
    });

    describe('both contexts combined', () => {
      it('should include both memory and session context with correct ordering', async () => {
        const memoryText = '## Decisions & Facts\n- Use TypeScript';
        const sessionText = '## Recent Session Context\n### Session: "Refactor" (2025-06-01)';

        vi.mocked(getMemoryManager).mockReturnValue({
          getContextString: vi.fn().mockReturnValue(memoryText),
        } as any);
        vi.mocked(getSessionContextString).mockReturnValue(sessionText);

        await agenticChat('Test message');

        const messages = mockProvider.complete.mock.calls[0][0];
        const systemContent = messages[0].content as string;

        expect(systemContent).toContain(memoryText);
        expect(systemContent).toContain(sessionText);

        // Memory context should appear before session context
        const memoryIndex = systemContent.indexOf(memoryText);
        const sessionIndex = systemContent.indexOf(sessionText);
        expect(memoryIndex).toBeLessThan(sessionIndex);
      });
    });

    describe('system prompt with contexts', () => {
      it('should include systemPrompt before contexts in the system message (cache-friendly)', async () => {
        const memoryText = '## Decisions & Facts\n- Prefer functional style';
        const sessionText = '## Recent Session Context\n### Session: "Init" (2025-03-01)';
        const systemPromptText = 'You are a helpful assistant.';

        vi.mocked(getMemoryManager).mockReturnValue({
          getContextString: vi.fn().mockReturnValue(memoryText),
        } as any);
        vi.mocked(getSessionContextString).mockReturnValue(sessionText);

        await agenticChat('Test message', { systemPrompt: systemPromptText });

        const messages = mockProvider.complete.mock.calls[0][0];
        const systemContent = messages[0].content as string;

        expect(systemContent).toContain(memoryText);
        expect(systemContent).toContain(sessionText);
        expect(systemContent).toContain(systemPromptText);

        // Cache-friendly ordering: systemPrompt < memory < session
        const systemPromptIndex = systemContent.indexOf(systemPromptText);
        const memoryIndex = systemContent.indexOf(memoryText);
        const sessionIndex = systemContent.indexOf(sessionText);
        expect(systemPromptIndex).toBeLessThan(memoryIndex);
        expect(memoryIndex).toBeLessThan(sessionIndex);
      });
    });

    describe('no context', () => {
      it('should include a system message from the assembled prompt even when all dynamic contexts are empty', async () => {
        vi.mocked(getMemoryManager).mockReturnValue({
          getContextString: vi.fn().mockReturnValue(''),
        } as any);
        vi.mocked(getSessionContextString).mockReturnValue('');

        await agenticChat('Test message');

        const messages = mockProvider.complete.mock.calls[0][0];
        const systemMessages = messages.filter((m: { role: string }) => m.role === 'system');
        // buildAssembledSystemPrompt always produces at least the soul + env block
        expect(systemMessages).toHaveLength(1);
        expect(systemMessages[0].content).toBeTruthy();
      });
    });

    describe('context failure resilience', () => {
      it('should succeed when memory module throws', async () => {
        vi.mocked(getMemoryManager).mockImplementation(() => {
          throw new Error('Memory unavailable');
        });

        const result = await agenticChat('Test message');

        expect(result.text).toBe('Response');
        expect(result.iterations).toBe(1);
      });

      it('should succeed when session context module throws', async () => {
        vi.mocked(getSessionContextString).mockImplementation(() => {
          throw new Error('Session context unavailable');
        });

        const result = await agenticChat('Test message');

        expect(result.text).toBe('Response');
        expect(result.iterations).toBe(1);
      });

      it('should succeed when both modules throw', async () => {
        vi.mocked(getMemoryManager).mockImplementation(() => {
          throw new Error('Memory unavailable');
        });
        vi.mocked(getSessionContextString).mockImplementation(() => {
          throw new Error('Session context unavailable');
        });

        const result = await agenticChat('Test message');

        expect(result.text).toBe('Response');
        expect(result.iterations).toBe(1);
      });
    });
  });
});
