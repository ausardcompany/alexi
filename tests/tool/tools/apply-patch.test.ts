import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index module to bypass permission checks (mirror write.test.ts pattern)
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: {
      name: string;
      description: string;
      execute: (...args: unknown[]) => unknown;
    }) => ({
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

import { applyPatchTool, PatchHunkError } from '../../../src/tool/tools/apply-patch.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('apply_patch tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'apply-patch-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('PatchHunkError', () => {
    it('exposes the expected fields', () => {
      const err = new PatchHunkError({
        hunkNumber: 2,
        filePath: '/tmp/foo.ts',
        expected: 'foo',
        actual: 'bar',
        lineNumber: 7,
      });
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe('PatchHunkError');
      expect(err.hunkNumber).toBe(2);
      expect(err.filePath).toBe('/tmp/foo.ts');
      expect(err.expected).toBe('foo');
      expect(err.actual).toBe('bar');
      expect(err.lineNumber).toBe(7);
      expect(err.message).toContain('hunk 2');
      expect(err.message).toContain('line 7');
    });
  });

  describe('valid patch', () => {
    it('applies a valid patch and updates the file', async () => {
      const filePath = path.join(tempDir, 'valid.txt');
      const original = ['line one', 'line two', 'line three'].join('\n');
      await fs.writeFile(filePath, original, 'utf-8');

      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);

      expect(result.success).toBe(true);
      expect(result.data?.path).toBe(filePath);
      expect(result.data?.diff.length ?? 0).toBeGreaterThan(0);

      const updated = await fs.readFile(filePath, 'utf-8');
      expect(updated).toBe(['line one', 'line TWO', 'line three'].join('\n'));
    });
  });

  describe('context line mismatch', () => {
    it('returns success: false and does not write the file', async () => {
      const filePath = path.join(tempDir, 'ctx-mismatch.txt');
      const original = ['alpha', 'beta', 'gamma'].join('\n');
      await fs.writeFile(filePath, original, 'utf-8');

      // Context line `WRONG` does not match actual `alpha`
      const patch = ['@@ -1,3 +1,3 @@', ' WRONG', '-beta', '+BETA', ' gamma'].join('\n');

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('hunk 1');
      expect(result.error).toContain('expected');

      // File must remain unchanged
      const onDisk = await fs.readFile(filePath, 'utf-8');
      expect(onDisk).toBe(original);
    });
  });

  describe('deletion line mismatch', () => {
    it('returns success: false and leaves the file untouched on disk', async () => {
      const filePath = path.join(tempDir, 'del-mismatch.txt');
      const original = ['alpha', 'beta', 'gamma'].join('\n');
      await fs.writeFile(filePath, original, 'utf-8');

      // Deletion targets `WRONG` but actual line at index 1 is `beta`
      const patch = ['@@ -1,3 +1,3 @@', ' alpha', '-WRONG', '+BETA', ' gamma'].join('\n');

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('hunk 1');

      const onDisk = await fs.readFile(filePath, 'utf-8');
      expect(onDisk).toBe(original);
    });
  });

  describe('patch overruns EOF', () => {
    it('returns success: false when the patch references lines past the end of file', async () => {
      const filePath = path.join(tempDir, 'eof.txt');
      const original = ['only line'].join('\n');
      await fs.writeFile(filePath, original, 'utf-8');

      // Hunk header says start at line 1, but expects 3 lines of context past EOF
      const patch = [
        '@@ -1,3 +1,3 @@',
        ' only line',
        ' missing line',
        '-also missing',
        '+replacement',
      ].join('\n');

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('hunk 1');
      expect(result.error).toContain('<EOF>');

      const onDisk = await fs.readFile(filePath, 'utf-8');
      expect(onDisk).toBe(original);
    });
  });

  describe('tool metadata', () => {
    it('has the expected name', () => {
      expect(applyPatchTool.name).toBe('apply_patch');
    });
  });
});
