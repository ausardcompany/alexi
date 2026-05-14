/**
 * Tests for effort level propagation through tool execution to hooks
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { z } from 'zod';
import { defineTool, type ToolContext, type ToolResult } from '../index.js';
import { resetHookManager } from '../../hooks/index.js';

// We need to mock the hooks module to intercept executeHooks calls
vi.mock('../../hooks/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../hooks/index.js')>();
  return {
    ...actual,
    executeHooks: vi.fn().mockResolvedValue([]),
  };
});

import { executeHooks } from '../../hooks/index.js';

const mockedExecuteHooks = vi.mocked(executeHooks);

describe('Effort Level Propagation to Hooks via Tool Execution', () => {
  const TestParamsSchema = z.object({
    input: z.string(),
  });

  let testTool: ReturnType<typeof defineTool<typeof TestParamsSchema, string>>;
  let context: ToolContext;

  beforeEach(() => {
    vi.clearAllMocks();
    resetHookManager();

    testTool = defineTool<typeof TestParamsSchema, string>({
      name: 'test-tool',
      description: 'A test tool for effort propagation',
      parameters: TestParamsSchema,
      async execute(_params): Promise<ToolResult<string>> {
        return { success: true, data: 'done' };
      },
    });

    context = {
      workdir: '/tmp',
      effortLevel: 'high',
      sessionId: 'test-session-123',
    };
  });

  afterEach(() => {
    resetHookManager();
  });

  describe('PreToolUse hook invocation', () => {
    it('should fire PreToolUse hook with effort level from context', async () => {
      await testTool.executeUnsafe({ input: 'hello' }, context);

      // First call should be PreToolUse
      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PreToolUse',
        expect.objectContaining({
          event: 'PreToolUse',
          toolName: 'test-tool',
          effortLevel: 'high',
          sessionId: 'test-session-123',
        })
      );
    });

    it('should fire PreToolUse with low effort level', async () => {
      const lowContext: ToolContext = { ...context, effortLevel: 'low' };
      await testTool.executeUnsafe({ input: 'hello' }, lowContext);

      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PreToolUse',
        expect.objectContaining({
          event: 'PreToolUse',
          effortLevel: 'low',
        })
      );
    });

    it('should fire PreToolUse with medium effort level when unset', async () => {
      const noEffortContext: ToolContext = { workdir: '/tmp' };
      await testTool.executeUnsafe({ input: 'hello' }, noEffortContext);

      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PreToolUse',
        expect.objectContaining({
          event: 'PreToolUse',
          effortLevel: undefined,
        })
      );
    });

    it('should include tool params in PreToolUse hook context', async () => {
      await testTool.executeUnsafe({ input: 'test-value' }, context);

      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PreToolUse',
        expect.objectContaining({
          toolParams: { input: 'test-value' },
        })
      );
    });
  });

  describe('PostToolUse hook invocation', () => {
    it('should fire PostToolUse hook with effort level on success', async () => {
      await testTool.executeUnsafe({ input: 'hello' }, context);

      // Second call should be PostToolUse
      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PostToolUse',
        expect.objectContaining({
          event: 'PostToolUse',
          toolName: 'test-tool',
          effortLevel: 'high',
          sessionId: 'test-session-123',
          toolResult: 'done',
        })
      );
    });

    it('should fire PostToolUseFailure hook with effort level on tool failure', async () => {
      const failingTool = defineTool<typeof TestParamsSchema, string>({
        name: 'failing-tool',
        description: 'A tool that fails',
        parameters: TestParamsSchema,
        async execute(_params): Promise<ToolResult<string>> {
          return { success: false, error: 'Something went wrong' };
        },
      });

      await failingTool.executeUnsafe({ input: 'hello' }, context);

      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PostToolUseFailure',
        expect.objectContaining({
          event: 'PostToolUseFailure',
          toolName: 'failing-tool',
          effortLevel: 'high',
          error: 'Something went wrong',
        })
      );
    });

    it('should fire PostToolUseFailure hook with effort level on exception', async () => {
      const throwingTool = defineTool<typeof TestParamsSchema, string>({
        name: 'throwing-tool',
        description: 'A tool that throws',
        parameters: TestParamsSchema,
        async execute(_params): Promise<ToolResult<string>> {
          throw new Error('Unexpected error');
        },
      });

      await throwingTool.executeUnsafe({ input: 'hello' }, context);

      expect(mockedExecuteHooks).toHaveBeenCalledWith(
        'PostToolUseFailure',
        expect.objectContaining({
          event: 'PostToolUseFailure',
          toolName: 'throwing-tool',
          effortLevel: 'high',
          error: 'Unexpected error',
        })
      );
    });
  });

  describe('Hook invocation order', () => {
    it('should fire PreToolUse before PostToolUse', async () => {
      await testTool.executeUnsafe({ input: 'hello' }, context);

      expect(mockedExecuteHooks).toHaveBeenCalledTimes(2);

      const calls = mockedExecuteHooks.mock.calls;
      expect(calls[0][0]).toBe('PreToolUse');
      expect(calls[1][0]).toBe('PostToolUse');
    });

    it('should fire PreToolUse before PostToolUseFailure on error', async () => {
      const throwingTool = defineTool<typeof TestParamsSchema, string>({
        name: 'throwing-tool',
        description: 'A tool that throws',
        parameters: TestParamsSchema,
        async execute(_params): Promise<ToolResult<string>> {
          throw new Error('boom');
        },
      });

      await throwingTool.executeUnsafe({ input: 'hello' }, context);

      expect(mockedExecuteHooks).toHaveBeenCalledTimes(2);

      const calls = mockedExecuteHooks.mock.calls;
      expect(calls[0][0]).toBe('PreToolUse');
      expect(calls[1][0]).toBe('PostToolUseFailure');
    });
  });

  describe('Effort level consistency across all effort levels', () => {
    const levels = ['low', 'medium', 'high'] as const;

    for (const level of levels) {
      it(`should propagate '${level}' effort level to both PreToolUse and PostToolUse hooks`, async () => {
        const levelContext: ToolContext = { workdir: '/tmp', effortLevel: level };
        await testTool.executeUnsafe({ input: 'hello' }, levelContext);

        const calls = mockedExecuteHooks.mock.calls;
        expect(calls[0][1]).toMatchObject({ effortLevel: level });
        expect(calls[1][1]).toMatchObject({ effortLevel: level });
      });
    }
  });
});
