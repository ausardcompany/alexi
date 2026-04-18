/**
 * Tests for Suggest Tool
 */

import { describe, it, expect } from 'vitest';
import { suggestTool } from '../suggest.js';

describe('suggestTool', () => {
  const mockContext = {
    workdir: '/test',
  };

  it('should create a suggestion with required fields', async () => {
    const result = await suggestTool.execute(
      {
        title: 'Add error handling',
        description: 'Add try-catch block around API call',
      },
      mockContext
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.title).toBe('Add error handling');
    expect(result.data?.description).toBe('Add try-catch block around API call');
    expect(result.data?.status).toBe('pending');
    expect(result.data?.id).toBeDefined();
    expect(result.data?.createdAt).toBeDefined();
  });

  it('should include optional filepath and diff', async () => {
    const result = await suggestTool.execute(
      {
        title: 'Fix bug',
        description: 'Fix null pointer',
        filepath: 'src/main.ts',
        diff: '- const x = null\n+ const x = {}',
      },
      mockContext
    );

    expect(result.success).toBe(true);
    expect(result.data?.filepath).toBe('src/main.ts');
    expect(result.data?.diff).toBe('- const x = null\n+ const x = {}');
  });

  it('should return success with hint message', async () => {
    const result = await suggestTool.execute(
      {
        title: 'Refactor function',
        description: 'Extract helper method',
      },
      mockContext
    );

    expect(result.success).toBe(true);
    expect(result.hint).toContain('Refactor function');
    expect(result.hint).toContain('proposed for review');
  });

  it('should generate unique IDs for different suggestions', async () => {
    const result1 = await suggestTool.execute(
      {
        title: 'Suggestion 1',
        description: 'First suggestion',
      },
      mockContext
    );

    const result2 = await suggestTool.execute(
      {
        title: 'Suggestion 2',
        description: 'Second suggestion',
      },
      mockContext
    );

    expect(result1.data?.id).toBeDefined();
    expect(result2.data?.id).toBeDefined();
    expect(result1.data?.id).not.toBe(result2.data?.id);
  });

  it('should validate parameters using schema', async () => {
    // Missing required title field
    const result = await suggestTool.executeUnsafe(
      {
        description: 'Missing title',
      } as any,
      mockContext
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid parameters');
  });
});
