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

import { editTool } from '../../../src/tool/tools/edit.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Edit Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    // Create a temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'edit-tool-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('basic replacements', () => {
    it('should replace a single occurrence', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'Hello World\nGoodbye World');

      const result = await editTool.execute(
        { filePath, oldString: 'Hello', newString: 'Hi' },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.replacements).toBe(1);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Hi World\nGoodbye World');
    });

    it('should fail when oldString is not found', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'Hello World');

      const result = await editTool.execute(
        { filePath, oldString: 'NotFound', newString: 'Replaced' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('oldString not found');
    });

    it('should fail when multiple matches found without replaceAll', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'Hello Hello Hello');

      const result = await editTool.execute(
        { filePath, oldString: 'Hello', newString: 'Hi' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Found');
      expect(result.error).toContain('matches');
    });

    it('should replace all occurrences with replaceAll', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'Hello Hello Hello');

      const result = await editTool.execute(
        { filePath, oldString: 'Hello', newString: 'Hi', replaceAll: true },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.replacements).toBe(3);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('Hi Hi Hi');
    });

    it('should handle multi-line replacements', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, 'line 1\nline 2\nline 3\n');

      const result = await editTool.execute(
        { filePath, oldString: 'line 2\nline 3', newString: 'new line 2\nnew line 3' },
        context
      );

      expect(result.success).toBe(true);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('line 1\nnew line 2\nnew line 3\n');
    });

    it('should preserve whitespace exactly', async () => {
      const filePath = path.join(tempDir, 'file.txt');
      await fs.writeFile(filePath, '  indented\n    double indented');

      const result = await editTool.execute(
        { filePath, oldString: '  indented', newString: '  modified' },
        context
      );

      expect(result.success).toBe(true);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('  modified\n    double indented');
    });
  });

  describe('relative paths', () => {
    it('should handle relative paths using workdir', async () => {
      const filePath = path.join(tempDir, 'relative.txt');
      await fs.writeFile(filePath, 'original content');

      const result = await editTool.execute(
        { filePath: 'relative.txt', oldString: 'original', newString: 'modified' },
        context
      );

      expect(result.success).toBe(true);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('modified content');
    });
  });

  describe('error handling', () => {
    it('should return error for non-existent file', async () => {
      const result = await editTool.execute(
        { filePath: path.join(tempDir, 'nonexistent.txt'), oldString: 'a', newString: 'b' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });
  });

  describe('symlink traversal protection', () => {
    it('should reject symlinks pointing outside workspace', async () => {
      // Create a file outside the workspace
      const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), 'outside-edit-'));
      const outsideFile = path.join(outsideDir, 'target.txt');
      await fs.writeFile(outsideFile, 'original content');

      // Create a symlink inside workspace pointing outside
      const linkPath = path.join(tempDir, 'evil-link.txt');
      await fs.symlink(outsideFile, linkPath);

      const result = await editTool.execute(
        { filePath: linkPath, oldString: 'original', newString: 'malicious' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Path rejected');
      expect(result.error).toContain('Symlink target escapes workspace boundary');

      // Verify original file was not modified
      const content = await fs.readFile(outsideFile, 'utf-8');
      expect(content).toBe('original content');

      // Cleanup
      await fs.rm(outsideDir, { recursive: true, force: true });
    });

    it('should allow editing via symlinks pointing inside workspace', async () => {
      const realFile = path.join(tempDir, 'real-file.txt');
      await fs.writeFile(realFile, 'editable content');

      const linkPath = path.join(tempDir, 'safe-link.txt');
      await fs.symlink(realFile, linkPath);

      const result = await editTool.execute(
        { filePath: linkPath, oldString: 'editable', newString: 'edited' },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.replacements).toBe(1);
    });

    it('should reject path traversal escaping workspace', async () => {
      const result = await editTool.execute(
        {
          filePath: path.join(tempDir, '..', '..', 'etc', 'passwd'),
          oldString: 'root',
          newString: 'hacked',
        },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Path rejected');
    });
  });

  describe('tool metadata', () => {
    it('should have correct name', () => {
      expect(editTool.name).toBe('edit');
    });

    it('should have a description', () => {
      expect(editTool.description).toBeDefined();
      expect(editTool.description.length).toBeGreaterThan(0);
    });
  });
});
