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
import * as XLSX from 'xlsx';

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

  describe('office documents', () => {
    it('extracts XLSX content via the office branch instead of treating it as binary', async () => {
      const file = path.join(tempDir, 'data.xlsx');
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.aoa_to_sheet([
          ['name', 'value'],
          ['foo', 1],
          ['bar', 2],
        ]),
        'Alpha'
      );
      XLSX.writeFile(wb, file);

      const result = await readTool.execute({ filePath: file }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('Workbook: data.xlsx');
        expect(result.data.content).toContain('## Sheet: Alpha');
        expect(result.data.content).toContain('foo,1');
        expect(result.data.offset).toBe(1);
      }
    });
  });

  describe('streaming for ranged reads', () => {
    it(
      'returns the requested tail of a 200000-line file without buffering it all',
      { timeout: 60_000 },
      async () => {
        const testFile = path.join(tempDir, 'huge-streamed.txt');
        // Build content in batches of 1000 lines to avoid 200k separate write
        // syscalls (which dominates the test runtime) while still avoiding a
        // single 200k-element JS array allocation.
        const totalLines = 200_000;
        const batchSize = 1000;
        const handle = await fs.open(testFile, 'w');
        try {
          for (let start = 1; start <= totalLines; start += batchSize) {
            const end = Math.min(start + batchSize - 1, totalLines);
            const parts: string[] = [];
            for (let i = start; i <= end; i++) {
              parts.push(`line ${i}`);
            }
            let chunk = parts.join('\n');
            if (end < totalLines) {
              chunk += '\n';
            }
            await handle.write(chunk);
          }
        } finally {
          await handle.close();
        }

        // Force a GC-ish baseline by allocating then releasing — best-effort
        // smoke test, the assertion budget below is generous.
        const before = process.memoryUsage().rss;

        const result = await readTool.execute(
          { filePath: testFile, offset: 199_950, limit: 50 },
          context
        );

        const after = process.memoryUsage().rss;

        expect(result.success).toBe(true);
        if (result.data?.type === 'file') {
          // First and last requested lines should be present, a line just
          // outside the window should not.
          expect(result.data.content).toContain('199950: line 199950');
          expect(result.data.content).toContain('199999: line 199999');
          expect(result.data.content).not.toContain('199949: line 199949');
          expect(result.data.content).not.toContain(`${totalLines}: line ${totalLines}`);
          expect(result.data.shownLines).toBe(50);
          expect(result.data.offset).toBe(199_950);
          // Streamed reads do not know the total — null sentinel.
          expect(result.data.totalLines).toBeNull();
        }

        // RSS should not have grown by more than ~50 MB. The file on disk is
        // ~2-3 MB so a non-streaming implementation would still be small here,
        // but the budget protects against an obvious 10x regression.
        const grownMB = (after - before) / (1024 * 1024);
        expect(grownMB).toBeLessThan(50);
      }
    );

    it('returns whatever was captured if EOF is reached before limit', async () => {
      const testFile = path.join(tempDir, 'short-window.txt');
      await fs.writeFile(testFile, 'a\nb\nc\nd\ne');

      const result = await readTool.execute({ filePath: testFile, offset: 4, limit: 100 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.shownLines).toBe(2);
        expect(result.data.content).toContain('4: d');
        expect(result.data.content).toContain('5: e');
      }
    });

    it('preserves UTF-8 content (including multi-byte chars) on the streaming path', async () => {
      const testFile = path.join(tempDir, 'utf8-streamed.txt');
      const lines = ['ascii first', 'unicode: 日本語', 'emoji: 🚀✨', 'last'];
      await fs.writeFile(testFile, lines.join('\n'), 'utf-8');

      const result = await readTool.execute({ filePath: testFile, offset: 1, limit: 10 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('1: ascii first');
        expect(result.data.content).toContain('2: unicode: 日本語');
        expect(result.data.content).toContain('3: emoji: 🚀✨');
        expect(result.data.content).toContain('4: last');
      }
    });

    it('strips a UTF-8 BOM from the first line on the streaming path', async () => {
      const testFile = path.join(tempDir, 'utf8-bom-streamed.txt');
      // UTF-8 BOM (EF BB BF) followed by content.
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const body = Buffer.from('first\nsecond\nthird', 'utf-8');
      await fs.writeFile(testFile, Buffer.concat([bom, body]));

      const result = await readTool.execute({ filePath: testFile, offset: 1, limit: 10 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        // Numbered output must NOT include a U+FEFF before "first".
        expect(result.data.content).toContain('1: first');
        expect(result.data.content).not.toMatch(/1: \ufefffirst/);
      }
    });
  });

  describe('whole-file size guard', () => {
    it(
      'rejects implicit whole-file reads above MAX_FILE_SIZE_BYTES with a hint',
      { timeout: 30_000 },
      async () => {
        const testFile = path.join(tempDir, 'too-big.txt');
        // ~12 MB > 10 MB threshold, but built without holding 12 MB in JS at once.
        const chunk = 'x'.repeat(1024 * 1024); // 1 MB
        const handle = await fs.open(testFile, 'w');
        try {
          for (let i = 0; i < 12; i++) {
            await handle.write(chunk + '\n');
          }
        } finally {
          await handle.close();
        }

        const result = await readTool.execute({ filePath: testFile }, context);

        expect(result.success).toBe(false);
        expect(result.error).toContain('File too large');
        expect(result.hint).toContain('offset');
      }
    );

    it(
      'still allows ranged reads on files above the whole-file threshold',
      { timeout: 30_000 },
      async () => {
        const testFile = path.join(tempDir, 'big-but-windowed.txt');
        const handle = await fs.open(testFile, 'w');
        try {
          // Many short lines surrounded by a few large lines so the file goes
          // over the whole-file threshold but a small window does not.
          const big = 'y'.repeat(1024 * 1024); // 1 MB
          // 12 padding lines = 12 MB pushes the file past 10 MB.
          for (let i = 0; i < 12; i++) {
            await handle.write(big + '\n');
          }
          // Append an unmistakable marker at the tail.
          await handle.write('TAIL_LINE_A\nTAIL_LINE_B');
        } finally {
          await handle.close();
        }

        const result = await readTool.execute(
          { filePath: testFile, offset: 13, limit: 2 },
          context
        );

        expect(result.success).toBe(true);
        if (result.data?.type === 'file') {
          expect(result.data.shownLines).toBe(2);
          expect(result.data.content).toContain('13: TAIL_LINE_A');
          expect(result.data.content).toContain('14: TAIL_LINE_B');
        }
      }
    );
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
