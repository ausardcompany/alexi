import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// Mock dependencies before importing
vi.mock('../../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getDefaultModel: vi.fn(),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
}));

vi.mock('../../src/core/costTracker.js', () => ({
  getCostTracker: vi.fn(() => ({
    recordUsage: vi.fn(),
  })),
}));

vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

vi.mock('../../src/agent/system.js', () => ({
  buildAssembledSystemPrompt: vi.fn().mockReturnValue('system prompt'),
}));

vi.mock('../../src/reference/reference.js', () => ({
  initReferenceService: vi.fn(),
  getReferenceService: vi.fn().mockReturnValue(null),
}));

vi.mock('../../src/reference/repository-cache.js', () => ({
  initRepositoryCache: vi.fn(),
}));

vi.mock('../../src/hooks/index.js', () => ({
  getHookManager: vi.fn(),
  createHookContext: vi.fn((_event, data) => ({
    event: _event,
    timestamp: Date.now(),
    ...data,
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

// Import after mocking
import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel, getDefaultModel } from '../../src/providers/index.js';
import { getHookManager } from '../../src/hooks/index.js';

// Helper to create a mock provider
function createMockProvider(responses: Array<{ text: string; toolCalls?: unknown[] }>) {
  let callIndex = 0;
  return {
    complete: vi.fn().mockImplementation(() => {
      const response = responses[callIndex] ?? responses[responses.length - 1];
      callIndex++;
      return Promise.resolve({
        text: response.text,
        toolCalls: response.toolCalls || [],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        finishReason: response.toolCalls?.length ? 'tool_calls' : 'stop',
      });
    }),
  };
}

// Helper to create a mock tool object
function createMockTool(name: string, executeFn: ReturnType<typeof vi.fn>) {
  return {
    name,
    description: `Mock ${name}`,
    execute: executeFn,
    toFunctionSchema: () => ({
      name,
      description: `Mock ${name}`,
      parameters: { type: 'object', properties: {} },
    }),
  };
}

describe('Hook continueOnBlock behavior', () => {
  let mockHookManager: {
    execute: ReturnType<typeof vi.fn>;
    register: ReturnType<typeof vi.fn>;
    unregister: ReturnType<typeof vi.fn>;
    getHooks: ReturnType<typeof vi.fn>;
    loadFromConfig: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');

    // Default: no tools registered
    mockToolRegistry.list.mockReturnValue([]);
    mockToolRegistry.get.mockReturnValue(undefined);

    // Setup hook manager mock
    mockHookManager = {
      execute: vi.fn().mockResolvedValue([]),
      register: vi.fn(),
      unregister: vi.fn(),
      getHooks: vi.fn().mockReturnValue([]),
      loadFromConfig: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(getHookManager).mockReturnValue(mockHookManager);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('PreToolUse hook with continueOnBlock: true', () => {
    it('should feed rejection error back to model and continue the loop', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true, data: 'file content' });
      const mockTool = createMockTool('read_file', mockExecute);

      // Register tool in mock registry
      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'read_file' ? mockTool : undefined
      );

      // Provider returns a tool call first, then a final text response
      const mockProvider = createMockProvider([
        {
          text: '',
          toolCalls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'read_file', arguments: '{"input":"test.ts"}' },
            },
          ],
        },
        { text: 'I corrected my approach.' },
      ]);

      vi.mocked(getProviderForModel).mockReturnValue(
        mockProvider as unknown as ReturnType<typeof getProviderForModel>
      );

      // Hook rejects with continueOnBlock: true
      mockHookManager.execute.mockImplementation(async (event: string) => {
        if (event === 'PreToolUse') {
          return [
            {
              success: false,
              error: 'File read not allowed in restricted directory',
              duration: 5,
              continueOnBlock: true,
            },
          ];
        }
        return [];
      });

      const result = await agenticChat('Read test.ts', { maxIterations: 5 });

      // Should have continued (got final text from second LLM call)
      expect(result.text).toBe('I corrected my approach.');
      expect(result.iterations).toBe(2);
      // The tool was blocked, not executed
      expect(mockExecute).not.toHaveBeenCalled();
      // Provider was called twice (first returned tool_call, second returned text)
      expect(mockProvider.complete).toHaveBeenCalledTimes(2);
      // Tool call summary should show failure
      expect(result.toolCallSummary[0]).toEqual({
        name: 'read_file',
        success: false,
        error: 'File read not allowed in restricted directory',
      });
    });
  });

  describe('PreToolUse hook with continueOnBlock: false (default)', () => {
    it('should end the turn when hook rejects', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true });
      const mockTool = createMockTool('write_file', mockExecute);

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'write_file' ? mockTool : undefined
      );

      const mockProvider = createMockProvider([
        {
          text: '',
          toolCalls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'write_file', arguments: '{"input":"malicious.sh"}' },
            },
          ],
        },
      ]);

      vi.mocked(getProviderForModel).mockReturnValue(
        mockProvider as unknown as ReturnType<typeof getProviderForModel>
      );

      // Hook rejects with continueOnBlock: false (default)
      mockHookManager.execute.mockImplementation(async (event: string) => {
        if (event === 'PreToolUse') {
          return [
            {
              success: false,
              error: 'Writing to system directories is forbidden',
              duration: 3,
              continueOnBlock: false,
            },
          ];
        }
        return [];
      });

      const result = await agenticChat('Write malicious.sh', { maxIterations: 5 });

      // Turn should have ended
      expect(result.text).toContain('Turn ended');
      expect(result.text).toContain('write_file');
      expect(result.text).toContain('Writing to system directories is forbidden');
      // Only 1 iteration — the loop broke immediately
      expect(result.iterations).toBe(1);
      // Tool was not executed
      expect(mockExecute).not.toHaveBeenCalled();
      // Provider was called only once
      expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('PostToolUse hook with continueOnBlock: true', () => {
    it('should feed post-execution rejection back to model', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true, data: 'executed' });
      const mockTool = createMockTool('bash_exec', mockExecute);

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'bash_exec' ? mockTool : undefined
      );

      const mockProvider = createMockProvider([
        {
          text: '',
          toolCalls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'bash_exec', arguments: '{"input":"rm -rf /"}' },
            },
          ],
        },
        { text: 'I will use a safer approach.' },
      ]);

      vi.mocked(getProviderForModel).mockReturnValue(
        mockProvider as unknown as ReturnType<typeof getProviderForModel>
      );

      // PreToolUse passes, PostToolUse rejects with continueOnBlock: true
      mockHookManager.execute.mockImplementation(async (event: string) => {
        if (event === 'PostToolUse') {
          return [
            {
              success: false,
              error: 'Dangerous command detected in output',
              duration: 2,
              continueOnBlock: true,
            },
          ];
        }
        return [];
      });

      const result = await agenticChat('Run rm -rf /', { maxIterations: 5 });

      // Model should have received the error and self-corrected
      expect(result.text).toBe('I will use a safer approach.');
      expect(result.iterations).toBe(2);
      // Tool WAS executed (PostToolUse fires after execution)
      expect(mockExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('PostToolUse hook with continueOnBlock: false', () => {
    it('should end the turn when post-execution hook rejects', async () => {
      const mockExecute = vi.fn().mockResolvedValue({ success: true, data: 'deployed' });
      const mockTool = createMockTool('bash_run', mockExecute);

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'bash_run' ? mockTool : undefined
      );

      const mockProvider = createMockProvider([
        {
          text: '',
          toolCalls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'bash_run', arguments: '{"input":"deploy"}' },
            },
          ],
        },
      ]);

      vi.mocked(getProviderForModel).mockReturnValue(
        mockProvider as unknown as ReturnType<typeof getProviderForModel>
      );

      // PostToolUse rejects with continueOnBlock: false
      mockHookManager.execute.mockImplementation(async (event: string) => {
        if (event === 'PostToolUse') {
          return [
            {
              success: false,
              error: 'Deployment not allowed in this environment',
              duration: 1,
              continueOnBlock: false,
            },
          ];
        }
        return [];
      });

      const result = await agenticChat('Deploy the app', { maxIterations: 5 });

      // Turn should have ended
      expect(result.text).toContain('Turn ended');
      expect(result.text).toContain('PostToolUse hook rejected');
      expect(result.text).toContain('bash_run');
      expect(result.iterations).toBe(1);
      // Tool WAS executed (PostToolUse fires after)
      expect(mockExecute).toHaveBeenCalledTimes(1);
      // Provider was only called once
      expect(mockProvider.complete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hooks that succeed', () => {
    it('should not alter the tool loop flow when hooks pass', async () => {
      const mockExecute = vi
        .fn()
        .mockResolvedValue({ success: true, data: ['file1.ts', 'file2.ts'] });
      const mockTool = createMockTool('list_files', mockExecute);

      mockToolRegistry.list.mockReturnValue([mockTool]);
      mockToolRegistry.get.mockImplementation((name: string) =>
        name === 'list_files' ? mockTool : undefined
      );

      const mockProvider = createMockProvider([
        {
          text: '',
          toolCalls: [
            {
              id: 'call_1',
              type: 'function',
              function: { name: 'list_files', arguments: '{"input":"."}' },
            },
          ],
        },
        { text: 'Here are the files.' },
      ]);

      vi.mocked(getProviderForModel).mockReturnValue(
        mockProvider as unknown as ReturnType<typeof getProviderForModel>
      );

      // All hooks succeed
      mockHookManager.execute.mockResolvedValue([
        { success: true, output: 'ok', duration: 1, continueOnBlock: false },
      ]);

      const result = await agenticChat('List the files', { maxIterations: 5 });

      // Normal flow — tool executed, model responded
      expect(result.text).toBe('Here are the files.');
      expect(result.iterations).toBe(2);
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result.toolCallSummary[0]).toEqual({
        name: 'list_files',
        success: true,
        error: undefined,
      });
    });
  });
});
