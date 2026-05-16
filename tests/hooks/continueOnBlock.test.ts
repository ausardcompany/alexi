/**
 * Tests for hook continueOnBlock feature
 *
 * Verifies that PostToolUse hook rejections are handled correctly:
 * - continueOnBlock: true feeds error back to model and continues
 * - continueOnBlock: false (default) halts the agent turn
 * - Successful hooks don't affect flow
 * - Multiple hooks with mixed blocking behavior
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

describe('continueOnBlock', () => {
  let mockProvider: {
    complete: ReturnType<typeof vi.fn>;
  };

  const mockWriteTool = {
    name: 'write',
    description: 'Write file',
    toFunctionSchema: () => ({
      name: 'write',
      description: 'Write file',
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

    // Default: hooks return success
    mockExecuteHooks.mockResolvedValue([]);
    mockCreateHookContext.mockImplementation((event: string, data: unknown) => ({
      event,
      timestamp: Date.now(),
      ...(data as Record<string, unknown>),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should continue loop when hook blocks with continueOnBlock: true', async () => {
    // Hook rejects with continueOnBlock: true
    mockExecuteHooks.mockResolvedValue([
      {
        success: false,
        error: 'Writing to /etc is not allowed',
        duration: 5,
        blocked: true,
        continueOnBlock: true,
      },
    ]);

    // First call: LLM wants to write
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'write',
            arguments: '{"filePath": "/etc/passwd", "content": "hack"}',
          },
        },
      ],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    } satisfies CompletionResult);

    // Second call: LLM self-corrects and responds with text
    mockProvider.complete.mockResolvedValueOnce({
      text: 'I cannot write to /etc. Let me try a different path.',
      usage: { prompt_tokens: 80, completion_tokens: 15, total_tokens: 95 },
    } satisfies CompletionResult);

    const result = await agenticChat('Write hack to /etc/passwd');

    // Should have continued (2 iterations — first with tool call, second with final text)
    expect(result.iterations).toBe(2);
    expect(result.text).toBe('I cannot write to /etc. Let me try a different path.');

    // Verify hooks were invoked
    expect(mockExecuteHooks).toHaveBeenCalledWith('PostToolUse', expect.any(Object));
    expect(mockCreateHookContext).toHaveBeenCalledWith(
      'PostToolUse',
      expect.objectContaining({
        toolName: 'write',
      })
    );

    // Verify the rejection was fed back as a tool message
    const secondCallMessages = mockProvider.complete.mock.calls[1][0];
    const toolMessage = secondCallMessages.find(
      (m: Record<string, unknown>) => m['role'] === 'tool'
    );
    expect(toolMessage).toBeDefined();
    const toolContent = JSON.parse(toolMessage.content);
    expect(toolContent.success).toBe(false);
    expect(toolContent.error).toContain('[Hook Rejection]');
    expect(toolContent.error).toContain('Writing to /etc is not allowed');
  });

  it('should halt the loop when hook blocks without continueOnBlock', async () => {
    // Hook rejects with continueOnBlock: false (default)
    mockExecuteHooks.mockResolvedValue([
      {
        success: false,
        error: 'Security violation: forbidden path',
        duration: 3,
        blocked: true,
        continueOnBlock: false,
      },
    ]);

    // First call: LLM wants to write
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'write',
            arguments: '{"filePath": "/etc/shadow", "content": "bad"}',
          },
        },
      ],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    } satisfies CompletionResult);

    const result = await agenticChat('Write to shadow file');

    // Should have halted after first iteration (no second LLM call)
    expect(result.iterations).toBe(1);
    expect(result.text).toContain('[Hook Rejection]');
    expect(result.text).toContain('Security violation: forbidden path');

    // LLM should only have been called once
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
  });

  it('should not affect flow when hooks succeed', async () => {
    // All hooks pass
    mockExecuteHooks.mockResolvedValue([
      {
        success: true,
        output: 'Hook passed',
        duration: 2,
      },
    ]);

    // First call: LLM uses write tool
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'write',
            arguments: '{"filePath": "/home/user/file.txt", "content": "hello"}',
          },
        },
      ],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    } satisfies CompletionResult);

    // Second call: LLM responds with text
    mockProvider.complete.mockResolvedValueOnce({
      text: 'File written successfully.',
      usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
    } satisfies CompletionResult);

    const result = await agenticChat('Write hello to file');

    expect(result.iterations).toBe(2);
    expect(result.text).toBe('File written successfully.');
    expect(result.toolCallsExecuted).toBe(1);

    // Tool result should be the normal success result
    const secondCallMessages = mockProvider.complete.mock.calls[1][0];
    const toolMessage = secondCallMessages.find(
      (m: Record<string, unknown>) => m['role'] === 'tool'
    );
    expect(toolMessage).toBeDefined();
    const toolContent = JSON.parse(toolMessage.content);
    expect(toolContent.success).toBe(true);
  });

  it('should handle multiple hooks where one blocks and one passes', async () => {
    // Multiple hooks: first passes, second blocks with continueOnBlock: true
    mockExecuteHooks.mockResolvedValue([
      {
        success: true,
        output: 'Logging hook passed',
        duration: 1,
      },
      {
        success: false,
        error: 'Rate limit exceeded',
        duration: 2,
        blocked: true,
        continueOnBlock: true,
      },
    ]);

    // First call: LLM uses write tool
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'write',
            arguments: '{"filePath": "/tmp/test.txt", "content": "data"}',
          },
        },
      ],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    } satisfies CompletionResult);

    // Second call: LLM self-corrects
    mockProvider.complete.mockResolvedValueOnce({
      text: 'Rate limit hit, waiting before retry.',
      usage: { prompt_tokens: 80, completion_tokens: 12, total_tokens: 92 },
    } satisfies CompletionResult);

    const result = await agenticChat('Write data to file');

    // Should continue because the blocking hook has continueOnBlock: true
    expect(result.iterations).toBe(2);
    expect(result.text).toBe('Rate limit hit, waiting before retry.');

    // Rejection message should mention rate limit
    const secondCallMessages = mockProvider.complete.mock.calls[1][0];
    const toolMessage = secondCallMessages.find(
      (m: Record<string, unknown>) => m['role'] === 'tool'
    );
    const toolContent = JSON.parse(toolMessage.content);
    expect(toolContent.error).toContain('Rate limit exceeded');
  });

  it('should use hook output when error is not available in rejection message', async () => {
    // Hook rejects with output but no error
    mockExecuteHooks.mockResolvedValue([
      {
        success: false,
        output: 'Blocked by security policy',
        duration: 4,
        blocked: true,
        continueOnBlock: true,
      },
    ]);

    // First call: LLM uses write tool
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'write',
            arguments: '{"filePath": "/tmp/test.txt", "content": "data"}',
          },
        },
      ],
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    } satisfies CompletionResult);

    // Second call: LLM responds
    mockProvider.complete.mockResolvedValueOnce({
      text: 'Understood, adjusting approach.',
      usage: { prompt_tokens: 80, completion_tokens: 10, total_tokens: 90 },
    } satisfies CompletionResult);

    const result = await agenticChat('Write data');

    expect(result.iterations).toBe(2);

    const secondCallMessages = mockProvider.complete.mock.calls[1][0];
    const toolMessage = secondCallMessages.find(
      (m: Record<string, unknown>) => m['role'] === 'tool'
    );
    const toolContent = JSON.parse(toolMessage.content);
    expect(toolContent.error).toContain('[Hook Rejection]');
    expect(toolContent.error).toContain('Blocked by security policy');
  });

  it('should halt on first blocking hook with continueOnBlock: false even if others have continueOnBlock: true', async () => {
    // First blocking hook has continueOnBlock: false — should halt
    mockExecuteHooks.mockResolvedValue([
      {
        success: false,
        error: 'Critical security violation',
        duration: 1,
        blocked: true,
        continueOnBlock: false,
      },
      {
        success: false,
        error: 'Rate limit (would continue)',
        duration: 2,
        blocked: true,
        continueOnBlock: true,
      },
    ]);

    // First call: LLM uses write tool
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

    const result = await agenticChat('Attempt dangerous write');

    // Should halt — first blocking hook says no continue
    expect(result.iterations).toBe(1);
    expect(result.text).toContain('[Hook Rejection]');
    expect(result.text).toContain('Critical security violation');
    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
  });
});
