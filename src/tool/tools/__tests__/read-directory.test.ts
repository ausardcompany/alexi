/**
 * Tests for Read Directory Tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readDirectoryTool } from '../read-directory.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('readDirectoryTool', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-read-dir-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should read text files from directory', async () => {
    // Create test files
    await fs.writeFile(path.join(tempDir, 'test1.ts'), 'const x = 1;');
    await fs.writeFile(path.join(tempDir, 'test2.ts'), 'const y = 2;');

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['test1.ts', 'test2.ts'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(2);
    expect(result.data?.files[0].content).toContain('const x = 1;');
    expect(result.data?.files[1].content).toContain('const y = 2;');
  });

  it('should skip binary files', async () => {
    // Create a text file and a binary file
    await fs.writeFile(path.join(tempDir, 'text.txt'), 'Hello World');
    await fs.writeFile(path.join(tempDir, 'binary.bin'), Buffer.from([0x00, 0x01, 0x02, 0xff]));

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['text.txt', 'binary.bin'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(1);
    expect(result.data?.files[0].content).toContain('Hello World');
    expect(result.data?.skippedBinary).toBe(1);
  });

  it('should skip directories', async () => {
    await fs.writeFile(path.join(tempDir, 'file.txt'), 'content');
    await fs.mkdir(path.join(tempDir, 'subdir'));

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['file.txt', 'subdir/'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(1);
    expect(result.data?.files[0].content).toContain('content');
  });

  it('should handle non-existent files gracefully', async () => {
    await fs.writeFile(path.join(tempDir, 'exists.txt'), 'content');

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['exists.txt', 'missing.txt'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(1);
    expect(result.data?.errors).toBeGreaterThan(0);
  });

  it('should fail if path is not a directory', async () => {
    const filePath = path.join(tempDir, 'file.txt');
    await fs.writeFile(filePath, 'content');

    const result = await readDirectoryTool.execute(
      {
        directoryPath: filePath,
        items: [],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('Not a directory');
  });

  it('should format file content with XML tags', async () => {
    await fs.writeFile(path.join(tempDir, 'test.ts'), 'const x = 1;');

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['test.ts'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files[0].content).toMatch(/<file_content path=".*">/);
    expect(result.data?.files[0].content).toContain('</file_content>');
  });

  it('should handle large files with truncation', async () => {
    // Create a file with many lines
    const largeContent = Array.from({ length: 3000 }, (_, i) => `Line ${i + 1}`).join('\n');
    await fs.writeFile(path.join(tempDir, 'large.txt'), largeContent);

    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items: ['large.txt'],
      },
      { workdir: tempDir }
    );

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(1);
    expect(result.data?.files[0].content).toContain('(File truncated)');
  });

  it('should process files concurrently', async () => {
    // Create multiple files
    const fileCount = 20;
    for (let i = 0; i < fileCount; i++) {
      await fs.writeFile(path.join(tempDir, `file${i}.txt`), `Content ${i}`);
    }

    const items = Array.from({ length: fileCount }, (_, i) => `file${i}.txt`);

    const startTime = Date.now();
    const result = await readDirectoryTool.execute(
      {
        directoryPath: tempDir,
        items,
      },
      { workdir: tempDir }
    );
    const duration = Date.now() - startTime;

    expect(result.success).toBe(true);
    expect(result.data?.files).toHaveLength(fileCount);
    // Concurrent execution should be reasonably fast
    expect(duration).toBeLessThan(5000);
  });
});
