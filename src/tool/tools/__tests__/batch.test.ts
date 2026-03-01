import { describe, it, expect, beforeEach, vi } from 'vitest';
import { batchTool, MAX_BATCH_SIZE } from '../batch.js';
import { registerTool, type Tool, type ToolContext } from '../../index.js';
import { z } from 'zod';

// Mock tools for testing
const mockReadTool = {
  name: 'read',
  description: 'Mock read tool',
  parameters: z.object({
    filePath: z.string(),
  }),
  toFunctionSchema: () => ({
    name: 'read',
    description: 'Mock read tool',
    parameters: { type: 'object', properties: { filePath: { type: 'string' } } },
  }),
  execute: vi.fn(async (params: { filePath: string }) => ({
    success: true,
    data: { content: `Content of ${params.filePath}` },
  })),
  executeUnsafe: vi.fn(async (params: { filePath: string }) => ({
    success: true,
    data: { content: `Content of ${params.filePath}` },
  })),
} as unknown as Tool<z.ZodTypeAny, unknown>;

const mockGlobTool = {
  name: 'glob',
  description: 'Mock glob tool',
  parameters: z.object({
    pattern: z.string(),
  }),
  toFunctionSchema: () => ({
    name: 'glob',
    description: 'Mock glob tool',
    parameters: { type: 'object', properties: { pattern: { type: 'string' } } },
  }),
  execute: vi.fn(async (_params: { pattern: string }) => ({
    success: true,
    data: { files: [`file1.ts`, `file2.ts`] },
  })),
  executeUnsafe: vi.fn(async (_params: { pattern: string }) => ({
    success: true,
    data: { files: [`file1.ts`, `file2.ts`] },
  })),
} as unknown as Tool<z.ZodTypeAny, unknown>;

const mockFailingTool = {
  name: 'failing',
  description: 'Mock failing tool',
  parameters: z.object({
    shouldFail: z.boolean(),
  }),
  toFunctionSchema: () => ({
    name: 'failing',
    description: 'Mock failing tool',
    parameters: { type: 'object', properties: { shouldFail: { type: 'boolean' } } },
  }),
  execute: vi.fn(async (params: { shouldFail: boolean }) => {
    if (params.shouldFail) {
      return { success: false, error: 'Intentional failure' };
    }
    return { success: true, data: { message: 'Success' } };
  }),
  executeUnsafe: vi.fn(async (params: { shouldFail: boolean }) => {
    if (params.shouldFail) {
      return { success: false, error: 'Intentional failure' };
    }
    return { success: true, data: { message: 'Success' } };
  }),
} as unknown as Tool<z.ZodTypeAny, unknown>;

const mockSlowTool = {
  name: 'slow',
  description: 'Mock slow tool',
  parameters: z.object({
    delay: z.number(),
  }),
  toFunctionSchema: () => ({
    name: 'slow',
    description: 'Mock slow tool',
    parameters: { type: 'object', properties: { delay: { type: 'number' } } },
  }),
  execute: vi.fn(async (params: { delay: number }) => {
    await new Promise((resolve) => setTimeout(resolve, params.delay));
    return { success: true, data: { elapsed: params.delay } };
  }),
  executeUnsafe: vi.fn(async (params: { delay: number }) => {
    await new Promise((resolve) => setTimeout(resolve, params.delay));
    return { success: true, data: { elapsed: params.delay } };
  }),
} as unknown as Tool<z.ZodTypeAny, unknown>;

describe('batch tool', () => {
  const context: ToolContext = {
    workdir: '/tmp',
  };

  beforeEach(() => {
    // Clear the registry and re-register mock tools
    vi.clearAllMocks();

    // Register mock tools
    registerTool(mockReadTool);
    registerTool(mockGlobTool);
    registerTool(mockFailingTool);
    registerTool(mockSlowTool);
    registerTool(batchTool as Tool<z.ZodTypeAny, unknown>);
  });

  describe('basic functionality', () => {
    it('should execute a single tool invocation', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [{ tool: 'read', params: { filePath: '/test/file.ts' } }],
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalInvocations).toBe(1);
      expect(result.data?.successful).toBe(1);
      expect(result.data?.failed).toBe(0);
      expect(result.data?.results).toHaveLength(1);
      expect(result.data?.results[0].tool).toBe('read');
      expect(result.data?.results[0].success).toBe(true);
    });

    it('should execute multiple tool invocations in parallel', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'read', params: { filePath: '/test/file1.ts' } },
            { tool: 'read', params: { filePath: '/test/file2.ts' } },
            { tool: 'glob', params: { pattern: '**/*.ts' } },
          ],
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalInvocations).toBe(3);
      expect(result.data?.successful).toBe(3);
      expect(result.data?.failed).toBe(0);
      expect(result.data?.results).toHaveLength(3);
    });

    it('should preserve order of results', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'read', params: { filePath: '/first.ts' } },
            { tool: 'glob', params: { pattern: '*.ts' } },
            { tool: 'read', params: { filePath: '/third.ts' } },
          ],
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.results[0].index).toBe(0);
      expect(result.data?.results[0].tool).toBe('read');
      expect(result.data?.results[1].index).toBe(1);
      expect(result.data?.results[1].tool).toBe('glob');
      expect(result.data?.results[2].index).toBe(2);
      expect(result.data?.results[2].tool).toBe('read');
    });
  });

  describe('parallel execution', () => {
    it('should execute tools in parallel (timing verification)', async () => {
      const startTime = Date.now();

      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'slow', params: { delay: 50 } },
            { tool: 'slow', params: { delay: 50 } },
            { tool: 'slow', params: { delay: 50 } },
          ],
        },
        context
      );

      const elapsed = Date.now() - startTime;

      expect(result.success).toBe(true);
      // If truly parallel, should take ~50ms, not ~150ms
      // Allow some buffer for execution overhead
      expect(elapsed).toBeLessThan(120);
    });
  });

  describe('error handling', () => {
    it('should handle tool not found error', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [{ tool: 'nonexistent', params: {} }],
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.data?.failed).toBe(1);
      expect(result.data?.results[0].success).toBe(false);
      expect(result.data?.results[0].error).toContain('Tool not found');
    });

    it('should handle mixed success and failure', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'read', params: { filePath: '/test.ts' } },
            { tool: 'failing', params: { shouldFail: true } },
            { tool: 'glob', params: { pattern: '*.ts' } },
          ],
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.data?.totalInvocations).toBe(3);
      expect(result.data?.successful).toBe(2);
      expect(result.data?.failed).toBe(1);
      expect(result.hint).toContain('1 of 3 invocations failed');
    });

    it('should prevent recursive batch calls', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'read', params: { filePath: '/test.ts' } },
            {
              tool: 'batch',
              params: { invocations: [{ tool: 'read', params: { filePath: '/inner.ts' } }] },
            },
          ],
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.data?.results[1].success).toBe(false);
      expect(result.data?.results[1].error).toContain('Recursive batch calls are not allowed');
    });

    it('should continue other invocations when one fails', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [
            { tool: 'failing', params: { shouldFail: true } },
            { tool: 'read', params: { filePath: '/test.ts' } },
            { tool: 'failing', params: { shouldFail: false } },
          ],
        },
        context
      );

      expect(result.data?.results[0].success).toBe(false);
      expect(result.data?.results[1].success).toBe(true);
      expect(result.data?.results[2].success).toBe(true);
    });
  });

  describe('abort signal handling', () => {
    it('should return error when signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      const result = await batchTool.executeUnsafe(
        {
          invocations: [{ tool: 'read', params: { filePath: '/test.ts' } }],
        },
        { ...context, signal: controller.signal }
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('aborted');
    });
  });

  describe('batch size limits', () => {
    it('should export MAX_BATCH_SIZE constant', () => {
      expect(MAX_BATCH_SIZE).toBe(25);
    });

    it('should reject empty invocations array', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [],
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid parameters');
    });

    it('should reject invocations exceeding MAX_BATCH_SIZE', async () => {
      const invocations = Array(26).fill({ tool: 'read', params: { filePath: '/test.ts' } });

      const result = await batchTool.executeUnsafe(
        {
          invocations,
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid parameters');
    });

    it('should accept exactly MAX_BATCH_SIZE invocations', async () => {
      const invocations = Array(25).fill({ tool: 'read', params: { filePath: '/test.ts' } });

      const result = await batchTool.executeUnsafe(
        {
          invocations,
        },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalInvocations).toBe(25);
    });
  });

  describe('tool schema', () => {
    it('should have correct name and description', () => {
      expect(batchTool.name).toBe('batch');
      expect(batchTool.description).toContain('parallel');
      expect(batchTool.description).toContain('25');
    });

    it('should generate valid function schema', () => {
      const schema = batchTool.toFunctionSchema();

      expect(schema.name).toBe('batch');
      expect(schema.parameters).toHaveProperty('properties');
      expect((schema.parameters as Record<string, unknown>).properties).toHaveProperty(
        'invocations'
      );
    });
  });

  describe('result structure', () => {
    it('should include result data from each tool', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [{ tool: 'read', params: { filePath: '/test.ts' } }],
        },
        context
      );

      expect(result.data?.results[0].result).toBeDefined();
      expect(result.data?.results[0].result?.data).toBeDefined();
    });

    it('should not include result for failed tools with error', async () => {
      const result = await batchTool.executeUnsafe(
        {
          invocations: [{ tool: 'nonexistent', params: {} }],
        },
        context
      );

      expect(result.data?.results[0].result).toBeUndefined();
      expect(result.data?.results[0].error).toBeDefined();
    });
  });
});
