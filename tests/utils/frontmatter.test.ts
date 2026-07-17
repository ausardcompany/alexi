import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import os from 'os';
import {
  stripUtf8Bom,
  readUtf8FileStripBom,
  readUtf8FileSyncStripBom,
} from '../../src/utils/frontmatter.js';

const BOM = '\uFEFF';

describe('stripUtf8Bom', () => {
  it('removes a leading UTF-8 BOM', () => {
    const input = `${BOM}hello`;
    expect(stripUtf8Bom(input)).toBe('hello');
  });

  it('is a no-op when no BOM is present', () => {
    expect(stripUtf8Bom('hello')).toBe('hello');
  });

  it('is a no-op on empty strings', () => {
    expect(stripUtf8Bom('')).toBe('');
  });

  it('leaves BOM characters that appear mid-string alone', () => {
    // A BOM in the middle of a file is genuine data, not an encoding marker.
    const input = `hello${BOM}world`;
    expect(stripUtf8Bom(input)).toBe(`hello${BOM}world`);
  });

  it('only strips a single leading BOM (not repeated BOMs)', () => {
    const input = `${BOM}${BOM}hello`;
    expect(stripUtf8Bom(input)).toBe(`${BOM}hello`);
  });

  it('preserves the content that follows the BOM verbatim', () => {
    const body = '---\nname: test\n---\nBody line 1\nBody line 2\n';
    expect(stripUtf8Bom(`${BOM}${body}`)).toBe(body);
  });
});

describe('readUtf8FileStripBom / readUtf8FileSyncStripBom', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-bom-'));
  });

  afterEach(async () => {
    await fsPromises.rm(tempDir, { recursive: true, force: true });
  });

  it('async: reads a BOM-prefixed file and strips the BOM', async () => {
    const filePath = path.join(tempDir, 'bom.md');
    const body = '---\nname: test\n---\nbody\n';
    // Write with the BOM as bytes (UTF-8: EF BB BF).
    await fsPromises.writeFile(
      filePath,
      Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(body, 'utf-8')])
    );

    const content = await readUtf8FileStripBom(filePath);
    expect(content).toBe(body);
    expect(content.charCodeAt(0)).not.toBe(0xfeff);
    expect(content.startsWith('---')).toBe(true);
  });

  it('async: reads a non-BOM file unchanged', async () => {
    const filePath = path.join(tempDir, 'plain.md');
    const body = '---\nname: test\n---\nbody\n';
    await fsPromises.writeFile(filePath, body, 'utf-8');

    const content = await readUtf8FileStripBom(filePath);
    expect(content).toBe(body);
  });

  it('sync: reads a BOM-prefixed file and strips the BOM', () => {
    const filePath = path.join(tempDir, 'bom-sync.md');
    const body = '---\nname: test\n---\nbody\n';
    fs.writeFileSync(
      filePath,
      Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(body, 'utf-8')])
    );

    const content = readUtf8FileSyncStripBom(filePath);
    expect(content).toBe(body);
    expect(content.charCodeAt(0)).not.toBe(0xfeff);
  });

  it('sync: reads a non-BOM file unchanged', () => {
    const filePath = path.join(tempDir, 'plain-sync.md');
    const body = 'hello world';
    fs.writeFileSync(filePath, body, 'utf-8');

    expect(readUtf8FileSyncStripBom(filePath)).toBe(body);
  });
});
