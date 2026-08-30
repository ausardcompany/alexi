import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

import {
  detectLineEnding,
  detectLineEndingFromString,
  LINE_ENDING_SAMPLE_BYTES,
} from '../../src/utils/line-ending.js';

describe('detectLineEndingFromString', () => {
  it('classifies pure CRLF content as CRLF', () => {
    expect(detectLineEndingFromString('a\r\nb\r\nc\r\n')).toBe('CRLF');
  });

  it('classifies pure LF content as LF', () => {
    expect(detectLineEndingFromString('a\nb\nc\n')).toBe('LF');
  });

  it('classifies mixed CRLF + LF content as mixed', () => {
    expect(detectLineEndingFromString('a\r\nb\nc\r\n')).toBe('mixed');
    // Reverse ordering (LF first, CRLF trailing) also mixed.
    expect(detectLineEndingFromString('a\nb\r\n')).toBe('mixed');
  });

  it('returns LF for content without any line endings', () => {
    expect(detectLineEndingFromString('single line no ending')).toBe('LF');
  });

  it('returns LF for the empty string', () => {
    expect(detectLineEndingFromString('')).toBe('LF');
  });

  it('does not confuse a lone \\r with a line ending', () => {
    // Bare CR (old Mac style) is treated as no line ending — the helper
    // only reports LF/CRLF, and a bare `\r` is neither.
    expect(detectLineEndingFromString('a\rb\rc')).toBe('LF');
  });

  it('classifies a single \\r\\n at the end as CRLF', () => {
    expect(detectLineEndingFromString('one\r\n')).toBe('CRLF');
  });

  it('classifies a single \\n at the end as LF', () => {
    expect(detectLineEndingFromString('one\n')).toBe('LF');
  });
});

describe('detectLineEnding (file path)', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'line-ending-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('detects CRLF from a CRLF-only file', async () => {
    const filePath = path.join(tempDir, 'crlf.txt');
    await fs.writeFile(filePath, 'a\r\nb\r\nc\r\n', 'utf-8');
    await expect(detectLineEnding(filePath)).resolves.toBe('CRLF');
  });

  it('detects LF from an LF-only file', async () => {
    const filePath = path.join(tempDir, 'lf.txt');
    await fs.writeFile(filePath, 'a\nb\nc\n', 'utf-8');
    await expect(detectLineEnding(filePath)).resolves.toBe('LF');
  });

  it('detects mixed from a file containing both CRLF and LF', async () => {
    const filePath = path.join(tempDir, 'mixed.txt');
    await fs.writeFile(filePath, 'a\r\nb\nc\r\n', 'utf-8');
    await expect(detectLineEnding(filePath)).resolves.toBe('mixed');
  });

  it('returns LF for an empty file', async () => {
    const filePath = path.join(tempDir, 'empty.txt');
    await fs.writeFile(filePath, '', 'utf-8');
    await expect(detectLineEnding(filePath)).resolves.toBe('LF');
  });

  it('only inspects the first 8 KiB of the file', async () => {
    // Fill the first 8 KiB with pure LF content and then place a CRLF
    // block AFTER the sample window. The sample-based detector must
    // report LF (it never reads that trailing region), which is exactly
    // the property the helper's docstring claims — a cheap sample is
    // enough because line-ending conventions are consistent within a
    // real file.
    const filePath = path.join(tempDir, 'huge.txt');
    const head = 'a\n'.repeat(Math.ceil(LINE_ENDING_SAMPLE_BYTES / 2) + 1);
    const tail = '\r\n\r\n\r\n';
    await fs.writeFile(filePath, head + tail, 'utf-8');
    await expect(detectLineEnding(filePath)).resolves.toBe('LF');
  });

  it('rejects when the file does not exist', async () => {
    const filePath = path.join(tempDir, 'missing.txt');
    await expect(detectLineEnding(filePath)).rejects.toThrow(/ENOENT/);
  });
});
