import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index module
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    // Override defineTool to bypass permission checks
    defineTool: (def: any) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import { writeTool } from '../../../src/tool/tools/write.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Write Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    // Create a temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'write-tool-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('writing a new file', () => {
    it('should create a new file with content', async () => {
      const filePath = path.join(tempDir, 'new-file.txt');
      const content = 'Hello, World!';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(true);
      expect(result.data?.path).toBe(filePath);
      expect(result.data?.bytesWritten).toBe(Buffer.byteLength(content, 'utf-8'));

      // Verify file was actually created
      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should create file with empty content', async () => {
      const filePath = path.join(tempDir, 'empty.txt');

      const result = await writeTool.execute({ filePath, content: '' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(true);
      expect(result.data?.bytesWritten).toBe(0);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe('');
    });

    it('should write file with unicode content', async () => {
      const filePath = path.join(tempDir, 'unicode.txt');
      const content = '日本語 テスト 🎉 emoji';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);
      expect(result.data?.bytesWritten).toBe(Buffer.byteLength(content, 'utf-8'));

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should write file with multi-line content', async () => {
      const filePath = path.join(tempDir, 'multiline.txt');
      const content = 'line 1\nline 2\nline 3';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);
      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });
  });

  describe('overwriting existing file', () => {
    it('should overwrite existing file', async () => {
      const filePath = path.join(tempDir, 'existing.txt');
      await fs.writeFile(filePath, 'old content');

      const newContent = 'new content';
      const result = await writeTool.execute({ filePath, content: newContent }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(false);
      expect(result.data?.path).toBe(filePath);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(newContent);
    });

    it('should replace larger file with smaller content', async () => {
      const filePath = path.join(tempDir, 'large.txt');
      await fs.writeFile(filePath, 'This is a much longer content that will be replaced');

      const newContent = 'short';
      const result = await writeTool.execute({ filePath, content: newContent }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(false);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(newContent);
    });

    it('should replace smaller file with larger content', async () => {
      const filePath = path.join(tempDir, 'small.txt');
      await fs.writeFile(filePath, 'tiny');

      const newContent = 'This is a much longer content that replaces the small file';
      const result = await writeTool.execute({ filePath, content: newContent }, context);

      expect(result.success).toBe(true);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(newContent);
    });
  });

  describe('creating directories', () => {
    it('should create parent directories if they do not exist', async () => {
      const filePath = path.join(tempDir, 'deep', 'nested', 'dir', 'file.txt');
      const content = 'nested content';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(true);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should work when parent directory already exists', async () => {
      const subDir = path.join(tempDir, 'existing-dir');
      await fs.mkdir(subDir);

      const filePath = path.join(subDir, 'file.txt');
      const content = 'content in existing dir';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should create deeply nested structure', async () => {
      const filePath = path.join(tempDir, 'a', 'b', 'c', 'd', 'e', 'file.txt');
      const content = 'deep content';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);

      // Verify all directories were created
      const stat = await fs.stat(path.join(tempDir, 'a', 'b', 'c', 'd', 'e'));
      expect(stat.isDirectory()).toBe(true);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });
  });

  describe('error handling', () => {
    it('should handle relative paths using workdir', async () => {
      const content = 'relative path content';

      const result = await writeTool.execute({ filePath: 'relative.txt', content }, context);

      expect(result.success).toBe(true);

      const actualContent = await fs.readFile(path.join(tempDir, 'relative.txt'), 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should handle paths with spaces', async () => {
      const filePath = path.join(tempDir, 'path with spaces', 'file name.txt');
      const content = 'content';

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);

      const actualContent = await fs.readFile(filePath, 'utf-8');
      expect(actualContent).toBe(content);
    });

    it('should report correct bytes written for utf-8 content', async () => {
      const filePath = path.join(tempDir, 'bytes.txt');
      const content = 'Hello 世界'; // 6 ASCII + 1 space + 6 bytes for Chinese chars = 13 bytes

      const result = await writeTool.execute({ filePath, content }, context);

      expect(result.success).toBe(true);
      expect(result.data?.bytesWritten).toBe(Buffer.byteLength(content, 'utf-8'));
    });
  });

  describe('tool metadata', () => {
    it('should have correct name', () => {
      expect(writeTool.name).toBe('write');
    });

    it('should have a description', () => {
      expect(writeTool.description).toBeDefined();
      expect(writeTool.description.length).toBeGreaterThan(0);
    });
  });
});
