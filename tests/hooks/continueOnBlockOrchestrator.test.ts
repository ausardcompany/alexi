/**
 * Tests for continueOnBlock integration with the orchestrator (agenticChat)
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

describe('agenticChat with continueOnBlock hooks', () => {
  let mockProvider: {
    complete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockProvider = {
      complete: vi.fn(),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as any);

    // Default: register a mock tool
    const mockTool = {
      name: 'bash',
      description: 'Execute a command',
      parameters: { parse: vi.fn((x: unknown) => x) },
      toFunctionSchema: () => ({
        name: 'bash',
        description: 'Execute a command',
        parameters: { type: 'object', properties: { command: { type: 'string' } } },
      }),
      execute: vi.fn().mockResolvedValue({ success: true, data: 'output' }),
      executeUnsafe: vi.fn().mockResolvedValue({ success: true, data: 'output' }),
    };

    mockToolRegistry.list.mockReturnValue([mockTool]);
    mockToolRegistry.get.mockReturnValue(mockTool);

    // Default: hooks pass (no blocking)
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

  it('should inject feedback message when hook blocks with continueOnBlock', async () => {
    // First call: LLM requests a tool call
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'bash',
            arguments: '{"command": "rm -rf /"}',
          },
        },
      ],
    } satisfies CompletionResult);

    // Hook blocks the tool
    mockExecuteHooks.mockResolvedValueOnce([
      {
        success: false,
        error: 'Dangerous command detected',
        duration: 5,
        blocked: true,
        blockReason: 'Dangerous command detected',
      },
    ]);

    // Second call: LLM responds after receiving blocking feedback
    mockProvider.complete.mockResolvedValueOnce({
      text: 'I apologize, I will use a safer approach.',
      usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('Delete everything');

    expect(result.text).toBe('I apologize, I will use a safer approach.');
    expect(result.iterations).toBe(2);
    expect(result.toolCallsExecuted).toBe(1);
    expect(result.toolCallSummary[0].success).toBe(false);
    expect(result.toolCallSummary[0].error).toContain('was blocked');
    expect(result.toolCallSummary[0].error).toContain('Dangerous command detected');

    // Verify the tool was NOT actually executed
    const tool = mockToolRegistry.get('bash');
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it('should halt execution when hook rejects without continueOnBlock', async () => {
    // First call: LLM requests a tool call
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'bash',
            arguments: '{"command": "rm -rf /"}',
          },
        },
      ],
    } satisfies CompletionResult);

    // Hook rejects without blocked flag (halt behavior)
    mockExecuteHooks.mockResolvedValueOnce([
      {
        success: false,
        error: 'Security violation',
        duration: 5,
        // No blocked flag — this means halt
      },
    ]);

    const result = await agenticChat('Delete everything');

    expect(result.text).toContain('Tool execution halted by hook');
    expect(result.text).toContain('Security violation');
    expect(result.iterations).toBe(1);

    // Verify the tool was NOT actually executed
    const tool = mockToolRegistry.get('bash');
    expect(tool.execute).not.toHaveBeenCalled();
  });

  it('should execute tool normally when no hooks block', async () => {
    // First call: LLM requests a tool call
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'bash',
            arguments: '{"command": "echo hello"}',
          },
        },
      ],
    } satisfies CompletionResult);

    // Hooks pass (empty results)
    mockExecuteHooks.mockResolvedValueOnce([]);

    // Second call: LLM responds after tool execution
    mockProvider.complete.mockResolvedValueOnce({
      text: 'Done! The command output was "hello".',
      usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('Say hello');

    expect(result.text).toBe('Done! The command output was "hello".');
    expect(result.toolCallsExecuted).toBe(1);
    expect(result.toolCallSummary[0].success).toBe(true);

    // Verify the tool WAS executed
    const tool = mockToolRegistry.get('bash');
    expect(tool.execute).toHaveBeenCalled();
  });

  it('should execute tool when hooks succeed', async () => {
    // First call: LLM requests a tool call
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'bash',
            arguments: '{"command": "echo hello"}',
          },
        },
      ],
    } satisfies CompletionResult);

    // Hook succeeds
    mockExecuteHooks.mockResolvedValueOnce([
      {
        success: true,
        output: 'allowed',
        duration: 2,
      },
    ]);

    // Second call: LLM responds
    mockProvider.complete.mockResolvedValueOnce({
      text: 'Command executed successfully.',
      usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('Run echo');

    expect(result.text).toBe('Command executed successfully.');
    expect(result.toolCallSummary[0].success).toBe(true);

    // Verify the tool WAS executed
    const tool = mockToolRegistry.get('bash');
    expect(tool.execute).toHaveBeenCalled();
  });

  it('should continue processing other tool calls when one is blocked with continueOnBlock', async () => {
    // Register a second tool
    const readTool = {
      name: 'read',
      description: 'Read a file',
      parameters: { parse: vi.fn((x: unknown) => x) },
      toFunctionSchema: () => ({
        name: 'read',
        description: 'Read a file',
        parameters: { type: 'object', properties: { filePath: { type: 'string' } } },
      }),
      execute: vi.fn().mockResolvedValue({ success: true, data: 'file content' }),
      executeUnsafe: vi.fn().mockResolvedValue({ success: true, data: 'file content' }),
    };

    mockToolRegistry.list.mockReturnValue([mockToolRegistry.get('bash'), readTool]);
    mockToolRegistry.get.mockImplementation((name: string) => {
      if (name === 'read') return readTool;
      return {
        name: 'bash',
        description: 'Execute a command',
        parameters: { parse: vi.fn((x: unknown) => x) },
        toFunctionSchema: () => ({
          name: 'bash',
          description: 'Execute a command',
          parameters: { type: 'object', properties: { command: { type: 'string' } } },
        }),
        execute: vi.fn().mockResolvedValue({ success: true, data: 'output' }),
        executeUnsafe: vi.fn().mockResolvedValue({ success: true, data: 'output' }),
      };
    });

    // LLM requests two tool calls
    mockProvider.complete.mockResolvedValueOnce({
      text: '',
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      toolCalls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: 'bash',
            arguments: '{"command": "rm -rf /"}',
          },
        },
        {
          id: 'call_2',
          type: 'function',
          function: {
            name: 'read',
            arguments: '{"filePath": "/tmp/safe.txt"}',
          },
        },
      ],
    } satisfies CompletionResult);

    // First hook call blocks bash
    mockExecuteHooks.mockResolvedValueOnce([
      {
        success: false,
        error: 'Dangerous command',
        duration: 5,
        blocked: true,
        blockReason: 'Dangerous command',
      },
    ]);

    // Second hook call allows read
    mockExecuteHooks.mockResolvedValueOnce([]);

    // LLM responds after
    mockProvider.complete.mockResolvedValueOnce({
      text: 'I read the file instead.',
      usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('Delete and read');

    expect(result.text).toBe('I read the file instead.');
    expect(result.toolCallsExecuted).toBe(2);
    // bash was blocked
    expect(result.toolCallSummary[0].success).toBe(false);
    expect(result.toolCallSummary[0].error).toContain('was blocked');
    // read was executed
    expect(result.toolCallSummary[1].success).toBe(true);
    // Read tool was actually executed
    expect(readTool.execute).toHaveBeenCalled();
  });
});
