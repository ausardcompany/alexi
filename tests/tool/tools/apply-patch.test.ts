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

import {
  applyPatchTool,
  PatchHunkError,
  detectLineEndingStyle,
  normalizeToLf,
  applyLineEndingStyle,
} from '../../../src/tool/tools/apply-patch.js';
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

  describe('line ending helpers', () => {
    it('detects predominantly CRLF content as crlf', () => {
      const s = 'a\r\nb\r\nc\r\n';
      expect(detectLineEndingStyle(s)).toBe('crlf');
    });

    it('detects predominantly LF content as lf', () => {
      const s = 'a\nb\nc\n';
      expect(detectLineEndingStyle(s)).toBe('lf');
    });

    it('returns the majority style for mixed content (CRLF wins)', () => {
      const s = 'a\r\nb\r\nc\r\nd\n';
      expect(detectLineEndingStyle(s)).toBe('crlf');
    });

    it('returns the majority style for mixed content (LF wins)', () => {
      const s = 'a\nb\nc\nd\r\n';
      expect(detectLineEndingStyle(s)).toBe('lf');
    });

    it('normalizeToLf converts CRLF to LF and leaves LF alone', () => {
      expect(normalizeToLf('a\r\nb\r\nc')).toBe('a\nb\nc');
      expect(normalizeToLf('a\nb\nc')).toBe('a\nb\nc');
    });

    it('applyLineEndingStyle converts LF-only content to CRLF when requested', () => {
      expect(applyLineEndingStyle('a\nb\nc', 'crlf')).toBe('a\r\nb\r\nc');
      expect(applyLineEndingStyle('a\nb\nc', 'lf')).toBe('a\nb\nc');
    });
  });

  describe('line ending preservation', () => {
    it('preserves CRLF line endings when applying an LF patch to a CRLF file', async () => {
      const filePath = path.join(tempDir, 'crlf.txt');
      const original = ['line one', 'line two', 'line three'].join('\r\n');
      await fs.writeFile(filePath, original, 'utf-8');

      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);
      expect(result.success).toBe(true);

      const updated = await fs.readFile(filePath, 'utf-8');
      expect(updated).toBe(['line one', 'line TWO', 'line three'].join('\r\n'));
      // Sanity: no bare LF anywhere in the output.
      expect(/(?:^|[^\r])\n/.test(updated)).toBe(false);
    });

    it('preserves LF line endings when applying a patch that contains CRLF hunks to an LF file', async () => {
      const filePath = path.join(tempDir, 'lf.txt');
      const original = ['line one', 'line two', 'line three'].join('\n');
      await fs.writeFile(filePath, original, 'utf-8');

      // Patch hunks with CRLF should be normalized during parsing.
      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\r\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);
      expect(result.success).toBe(true);

      const updated = await fs.readFile(filePath, 'utf-8');
      expect(updated).toBe(['line one', 'line TWO', 'line three'].join('\n'));
      // Sanity: no CRLF anywhere in the output.
      expect(updated.includes('\r\n')).toBe(false);
    });

    it('preserves the majority style when the original file has mixed line endings (CRLF wins)', async () => {
      const filePath = path.join(tempDir, 'mixed-crlf.txt');
      // 3 CRLF vs 1 LF -> CRLF wins.
      const original = 'line one\r\nline two\r\nline three\r\ntrailing\n';
      await fs.writeFile(filePath, original, 'utf-8');

      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);
      expect(result.success).toBe(true);

      const updated = await fs.readFile(filePath, 'utf-8');
      // Output should be uniformly CRLF (the majority style).
      expect(updated).toContain('line one\r\nline TWO\r\nline three\r\n');
      expect(/(?:^|[^\r])\n/.test(updated)).toBe(false);
    });

    it('preserves CRLF via the file-path sample detector on a pure CRLF file', async () => {
      // Regression test for the 8 KiB sampled-detection code path in
      // apply-patch: we specifically want a file where the disk sample
      // classifies as CRLF (no bare LF anywhere in the head), so the
      // in-memory majority-count fallback is NOT what preserves the
      // convention.
      const filePath = path.join(tempDir, 'pure-crlf.txt');
      const original = ['line one', 'line two', 'line three'].join('\r\n') + '\r\n';
      await fs.writeFile(filePath, original, 'utf-8');

      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);
      expect(result.success).toBe(true);

      const updated = await fs.readFile(filePath, 'utf-8');
      expect(updated).toBe(['line one', 'line TWO', 'line three'].join('\r\n') + '\r\n');
      expect(/(?:^|[^\r])\n/.test(updated)).toBe(false);
    });

    it('preserves LF via the file-path sample detector on a pure LF file', async () => {
      const filePath = path.join(tempDir, 'pure-lf.txt');
      const original = ['line one', 'line two', 'line three'].join('\n') + '\n';
      await fs.writeFile(filePath, original, 'utf-8');

      const patch = ['@@ -1,3 +1,3 @@', ' line one', '-line two', '+line TWO', ' line three'].join(
        '\n'
      );

      const result = await applyPatchTool.execute({ path: filePath, patch }, context);
      expect(result.success).toBe(true);

      const updated = await fs.readFile(filePath, 'utf-8');
      expect(updated).toBe(['line one', 'line TWO', 'line three'].join('\n') + '\n');
      expect(updated.includes('\r\n')).toBe(false);
    });
  });

  describe('tool metadata', () => {
    it('has the expected name', () => {
      expect(applyPatchTool.name).toBe('apply_patch');
    });
  });
});
