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

import { readTool } from '../../../src/tool/tools/read.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Read Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    // Create a temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'read-tool-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('reading a file', () => {
    it('should read file contents with line numbers', async () => {
      const testFile = path.join(tempDir, 'test.txt');
      await fs.writeFile(testFile, 'line 1\nline 2\nline 3');

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('file');
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('1: line 1');
        expect(result.data.content).toContain('2: line 2');
        expect(result.data.content).toContain('3: line 3');
        expect(result.data.totalLines).toBe(3);
        expect(result.data.shownLines).toBe(3);
      }
    });

    it('should handle empty files', async () => {
      const testFile = path.join(tempDir, 'empty.txt');
      await fs.writeFile(testFile, '');

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('file');
      if (result.data?.type === 'file') {
        expect(result.data.totalLines).toBe(1); // Empty file has one empty line
      }
    });

    it('should handle files with special characters', async () => {
      const testFile = path.join(tempDir, 'special.txt');
      await fs.writeFile(testFile, 'line with tabs\t\tand spaces\nline with unicode: 日本語');

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('file');
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('tabs\t\tand spaces');
        expect(result.data.content).toContain('日本語');
      }
    });
  });

  describe('reading a directory', () => {
    it('should list directory entries', async () => {
      // Create some files and directories
      await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content');
      await fs.writeFile(path.join(tempDir, 'file2.js'), 'content');
      await fs.mkdir(path.join(tempDir, 'subdir'));

      const result = await readTool.execute({ filePath: tempDir }, context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('directory');
      if (result.data?.type === 'directory') {
        expect(result.data.entries).toContain('file1.txt');
        expect(result.data.entries).toContain('file2.js');
        expect(result.data.entries).toContain('subdir/');
      }
    });

    it('should handle empty directories', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.mkdir(emptyDir);

      const result = await readTool.execute({ filePath: emptyDir }, context);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('directory');
      if (result.data?.type === 'directory') {
        expect(result.data.entries).toBe('');
      }
    });

    it('should sort directory entries alphabetically', async () => {
      await fs.writeFile(path.join(tempDir, 'zebra.txt'), 'content');
      await fs.writeFile(path.join(tempDir, 'alpha.txt'), 'content');
      await fs.mkdir(path.join(tempDir, 'middle'));

      const result = await readTool.execute({ filePath: tempDir }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'directory') {
        const entries = result.data.entries.split('\n');
        expect(entries[0]).toBe('alpha.txt');
        expect(entries[1]).toBe('middle/');
        expect(entries[2]).toBe('zebra.txt');
      }
    });
  });

  describe('reading with offset and limit', () => {
    it('should read from specific offset', async () => {
      const testFile = path.join(tempDir, 'lines.txt');
      await fs.writeFile(testFile, 'line 1\nline 2\nline 3\nline 4\nline 5');

      const result = await readTool.execute({ filePath: testFile, offset: 3 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('3: line 3');
        expect(result.data.content).toContain('4: line 4');
        expect(result.data.content).toContain('5: line 5');
        expect(result.data.content).not.toContain('1: line 1');
        expect(result.data.content).not.toContain('2: line 2');
        expect(result.data.offset).toBe(3);
      }
    });

    it('should limit number of lines read', async () => {
      const testFile = path.join(tempDir, 'lines.txt');
      await fs.writeFile(testFile, 'line 1\nline 2\nline 3\nline 4\nline 5');

      const result = await readTool.execute({ filePath: testFile, limit: 2 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('1: line 1');
        expect(result.data.content).toContain('2: line 2');
        expect(result.data.content).not.toContain('3: line 3');
        expect(result.data.shownLines).toBe(2);
      }
    });

    it('should combine offset and limit', async () => {
      const testFile = path.join(tempDir, 'lines.txt');
      await fs.writeFile(testFile, 'line 1\nline 2\nline 3\nline 4\nline 5');

      const result = await readTool.execute({ filePath: testFile, offset: 2, limit: 2 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('2: line 2');
        expect(result.data.content).toContain('3: line 3');
        expect(result.data.content).not.toContain('1: line 1');
        expect(result.data.content).not.toContain('4: line 4');
        expect(result.data.shownLines).toBe(2);
        expect(result.data.offset).toBe(2);
      }
    });

    it('should handle offset greater than file length', async () => {
      const testFile = path.join(tempDir, 'short.txt');
      await fs.writeFile(testFile, 'line 1\nline 2');

      const result = await readTool.execute({ filePath: testFile, offset: 100 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.shownLines).toBe(0);
      }
    });

    it('should handle offset of 0 as 1', async () => {
      const testFile = path.join(tempDir, 'lines.txt');
      await fs.writeFile(testFile, 'line 1\nline 2');

      const result = await readTool.execute({ filePath: testFile, offset: 0 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.offset).toBe(1);
        expect(result.data.content).toContain('1: line 1');
      }
    });
  });

  describe('error handling', () => {
    it('should return error for non-existent file', async () => {
      const result = await readTool.execute(
        { filePath: path.join(tempDir, 'nonexistent.txt') },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should return error for non-existent directory', async () => {
      const result = await readTool.execute(
        { filePath: path.join(tempDir, 'nonexistent-dir') },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should handle relative paths using workdir', async () => {
      const testFile = path.join(tempDir, 'relative.txt');
      await fs.writeFile(testFile, 'relative content');

      const result = await readTool.execute({ filePath: 'relative.txt' }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('relative content');
      }
    });
  });

  describe('tool metadata', () => {
    it('should have correct name', () => {
      expect(readTool.name).toBe('read');
    });

    it('should have a description', () => {
      expect(readTool.description).toBeDefined();
      expect(readTool.description.length).toBeGreaterThan(0);
    });
  });
});
