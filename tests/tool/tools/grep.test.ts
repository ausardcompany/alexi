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

import { grepTool } from '../../../src/tool/tools/grep.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Grep Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    // Create a temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'grep-tool-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('searching for patterns', () => {
    it('should find simple string pattern', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'Hello World\nGoodbye World');

      const result = await grepTool.execute({ pattern: 'Hello' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
      expect(result.data?.matches[0].content).toContain('Hello');
      expect(result.data?.matches[0].line).toBe(1);
    });

    it('should find pattern on multiple lines', async () => {
      await fs.writeFile(
        path.join(tempDir, 'file.txt'),
        'World one\nWorld two\nNo match\nWorld three'
      );

      const result = await grepTool.execute({ pattern: 'World' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(3);
    });

    it('should find pattern in multiple files', async () => {
      await fs.writeFile(path.join(tempDir, 'file1.txt'), 'Match here');
      await fs.writeFile(path.join(tempDir, 'file2.txt'), 'Match here too');
      await fs.writeFile(path.join(tempDir, 'file3.txt'), 'No pattern');

      const result = await grepTool.execute({ pattern: 'Match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });

    it('should return empty results for non-matching pattern', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'Hello World');

      const result = await grepTool.execute({ pattern: 'Goodbye' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(0);
      expect(result.data?.matches).toEqual([]);
    });

    it('should be case sensitive by default', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'Hello\nhello\nHELLO');

      const result = await grepTool.execute({ pattern: 'Hello' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
    });
  });

  describe('include filter', () => {
    it('should filter by file extension', async () => {
      await fs.writeFile(path.join(tempDir, 'file.ts'), 'const match = true;');
      await fs.writeFile(path.join(tempDir, 'file.js'), 'const match = true;');
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'const match = true;');

      const result = await grepTool.execute({ pattern: 'match', include: '*.ts' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
      expect(result.data?.matches[0].file).toBe('file.ts');
    });

    it('should support multiple extensions with braces', async () => {
      await fs.writeFile(path.join(tempDir, 'file.ts'), 'match');
      await fs.writeFile(path.join(tempDir, 'file.tsx'), 'match');
      await fs.writeFile(path.join(tempDir, 'file.js'), 'match');

      const result = await grepTool.execute({ pattern: 'match', include: '*.{ts,tsx}' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });

    it('should include all files when no filter specified', async () => {
      await fs.writeFile(path.join(tempDir, 'file.ts'), 'match');
      await fs.writeFile(path.join(tempDir, 'file.js'), 'match');

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });
  });

  describe('regex patterns', () => {
    it('should support basic regex', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'hello123\nhello456\nworld');

      const result = await grepTool.execute({ pattern: 'hello\\d+' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });

    it('should support word boundary', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'test\ncontest\ntesting');

      const result = await grepTool.execute({ pattern: '\\btest\\b' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
      expect(result.data?.matches[0].content).toBe('test');
    });

    it('should support character classes', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'cat\nbat\nrat\ndog');

      const result = await grepTool.execute({ pattern: '[cbr]at' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(3);
    });

    it('should support alternation', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'red\nblue\ngreen\nyellow');

      const result = await grepTool.execute({ pattern: 'red|blue' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });

    it('should support quantifiers', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'a\naa\naaa\naaaa');

      const result = await grepTool.execute({ pattern: 'a{2,3}' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(3); // aa, aaa, aaaa (matches 'aa' or 'aaa' within aaaa)
    });

    it('should handle invalid regex gracefully', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');

      const result = await grepTool.execute({ pattern: '[invalid' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid regex pattern');
    });

    it('should support case-insensitive search with regex flag', async () => {
      await fs.writeFile(path.join(tempDir, 'file.txt'), 'Hello\nhello\nHELLO');

      const result = await grepTool.execute({ pattern: '(?i)hello' }, context);

      // Note: JavaScript regex doesn't support inline flags like (?i)
      // This test documents current behavior
      expect(result.success).toBe(false);
    });
  });

  describe('subdirectory searching', () => {
    it('should search recursively by default', async () => {
      await fs.mkdir(path.join(tempDir, 'subdir'));
      await fs.writeFile(path.join(tempDir, 'root.txt'), 'match');
      await fs.writeFile(path.join(tempDir, 'subdir', 'nested.txt'), 'match');

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(2);
    });

    it('should search in specified path', async () => {
      await fs.mkdir(path.join(tempDir, 'src'));
      await fs.writeFile(path.join(tempDir, 'root.txt'), 'match');
      await fs.writeFile(path.join(tempDir, 'src', 'file.txt'), 'match');

      const result = await grepTool.execute(
        { pattern: 'match', path: path.join(tempDir, 'src') },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
      expect(result.data?.matches[0].file).toBe('file.txt');
    });

    it('should skip node_modules directory', async () => {
      await fs.mkdir(path.join(tempDir, 'node_modules'));
      await fs.writeFile(path.join(tempDir, 'src.txt'), 'match');
      await fs.writeFile(path.join(tempDir, 'node_modules', 'pkg.txt'), 'match');

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
    });

    it('should skip hidden directories', async () => {
      await fs.mkdir(path.join(tempDir, '.hidden'));
      await fs.writeFile(path.join(tempDir, 'visible.txt'), 'match');
      await fs.writeFile(path.join(tempDir, '.hidden', 'secret.txt'), 'match');

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
    });
  });

  describe('result format', () => {
    it('should include file path, line number, and content', async () => {
      await fs.writeFile(path.join(tempDir, 'test.txt'), 'line one\nmatch line\nline three');

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.matches[0]).toHaveProperty('file');
      expect(result.data?.matches[0]).toHaveProperty('line');
      expect(result.data?.matches[0]).toHaveProperty('content');
      expect(result.data?.matches[0].file).toBe('test.txt');
      expect(result.data?.matches[0].line).toBe(2);
      expect(result.data?.matches[0].content).toBe('match line');
    });

    it('should truncate long lines', async () => {
      const longLine = 'match' + 'x'.repeat(300);
      await fs.writeFile(path.join(tempDir, 'long.txt'), longLine);

      const result = await grepTool.execute({ pattern: 'match' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.matches[0].content.length).toBeLessThanOrEqual(200);
    });

    it('should report files searched count', async () => {
      await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content');
      await fs.writeFile(path.join(tempDir, 'file2.txt'), 'content');
      await fs.writeFile(path.join(tempDir, 'file3.txt'), 'content');

      const result = await grepTool.execute({ pattern: 'anything' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.filesSearched).toBe(3);
    });
  });

  describe('tool metadata', () => {
    it('should have correct name', () => {
      expect(grepTool.name).toBe('grep');
    });

    it('should have a description', () => {
      expect(grepTool.description).toBeDefined();
      expect(grepTool.description.length).toBeGreaterThan(0);
    });
  });
});
