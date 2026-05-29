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

  describe('partial view for oversized files', () => {
    it('should set partial=true and PARTIAL view hint on implicit whole-file read of oversized file', async () => {
      const testFile = path.join(tempDir, 'huge.txt');
      // Create > MAX_LINES (2000) lines, each long enough to push past the 50KB byte budget.
      // 3000 lines x ~80 chars => ~240KB, so both line and byte budgets are exceeded.
      const lineContent = 'x'.repeat(80);
      const totalLines = 3000;
      const content = Array.from({ length: totalLines }, (_, i) => `${lineContent}-${i}`).join(
        '\n'
      );
      await fs.writeFile(testFile, content);

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      expect(result.truncated).toBe(true);
      expect(result.hint).toContain('PARTIAL view');
      expect(result.hint).toMatch(/offset=\d+/);

      if (result.data?.type === 'file') {
        expect(result.data.partial).toBe(true);
        expect(result.data.totalLines).toBe(totalLines);
        // Default limit is MAX_LINES = 2000 starting from offset 1, so the next
        // continuation offset should be 2001.
        expect(result.hint).toContain('offset=2001');
        expect(result.hint).toContain(`file has ${totalLines} lines`);
        expect(result.hint).toContain('showing 1..2000');
      }
    });

    it('should NOT set partial when caller explicitly provides offset/limit even if truncated', async () => {
      const testFile = path.join(tempDir, 'huge-windowed.txt');
      const lineContent = 'y'.repeat(80);
      const totalLines = 3000;
      const content = Array.from({ length: totalLines }, (_, i) => `${lineContent}-${i}`).join(
        '\n'
      );
      await fs.writeFile(testFile, content);

      // Explicit windowed read that still triggers byte-budget truncation.
      const result = await readTool.execute(
        { filePath: testFile, offset: 1, limit: 2000 },
        context
      );

      expect(result.success).toBe(true);
      expect(result.truncated).toBe(true);
      // Should keep the existing (non-PARTIAL) hint behavior.
      expect(result.hint).toBeDefined();
      expect(result.hint).not.toContain('PARTIAL view');
      expect(result.hint).toContain('Output truncated');
      if (result.data?.type === 'file') {
        expect(result.data.partial).toBeUndefined();
      }
    });

    it('should NOT set partial on small files that fit within the budget', async () => {
      const testFile = path.join(tempDir, 'small.txt');
      const content = Array.from({ length: 50 }, (_, i) => `line ${i + 1}`).join('\n');
      await fs.writeFile(testFile, content);

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      expect(result.truncated).toBeFalsy();
      expect(result.hint).toBeUndefined();
      if (result.data?.type === 'file') {
        expect(result.data.partial).toBeUndefined();
        expect(result.data.totalLines).toBe(50);
        expect(result.data.shownLines).toBe(50);
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
