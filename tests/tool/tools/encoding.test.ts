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

import { readTool, getFileEncoding } from '../../../src/tool/tools/read.js';
import { writeTool } from '../../../src/tool/tools/write.js';
import {
  detectEncoding,
  decodeWithEncoding,
  encodeWithEncoding,
  isBinaryFile,
  type EncodingInfo,
} from '../../../src/tool/encoded-io.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Encoding Detection and Handling', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'encoding-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('detectEncoding', () => {
    describe('BOM detection', () => {
      it('should detect UTF-8 BOM', () => {
        const buffer = Buffer.from([0xef, 0xbb, 0xbf, 0x48, 0x65, 0x6c, 0x6c, 0x6f]);
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-8');
        expect(result.confidence).toBe(1);
        expect(result.hasBOM).toBe(true);
        expect(result.bomBytes).toEqual(Buffer.from([0xef, 0xbb, 0xbf]));
      });

      it('should detect UTF-16 LE BOM', () => {
        const buffer = Buffer.from([0xff, 0xfe, 0x48, 0x00, 0x69, 0x00]);
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-16le');
        expect(result.confidence).toBe(1);
        expect(result.hasBOM).toBe(true);
        expect(result.bomBytes).toEqual(Buffer.from([0xff, 0xfe]));
      });

      it('should detect UTF-16 BE BOM', () => {
        const buffer = Buffer.from([0xfe, 0xff, 0x00, 0x48, 0x00, 0x69]);
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-16be');
        expect(result.confidence).toBe(1);
        expect(result.hasBOM).toBe(true);
        expect(result.bomBytes).toEqual(Buffer.from([0xfe, 0xff]));
      });
    });

    describe('heuristic detection', () => {
      it('should detect plain ASCII as UTF-8', () => {
        const buffer = Buffer.from('Hello, World!', 'utf-8');
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-8');
        expect(result.confidence).toBe(1);
        expect(result.hasBOM).toBe(false);
      });

      it('should detect UTF-8 with multi-byte characters', () => {
        const buffer = Buffer.from('日本語テスト', 'utf-8');
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-8');
        expect(result.confidence).toBe(0.9);
        expect(result.hasBOM).toBe(false);
      });

      it('should detect Latin-1 with invalid UTF-8 sequences', () => {
        // Latin-1 bytes that are NOT valid UTF-8 multibyte sequences
        // 0xE9 (é) followed by a space - invalid as UTF-8 (expects continuation byte)
        const buffer = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0xe9, 0x20]);
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('latin1');
        expect(result.confidence).toBe(0.7);
        expect(result.hasBOM).toBe(false);
      });

      it('should detect UTF-16LE without BOM via null byte heuristic', () => {
        // "Hello" in UTF-16LE without BOM
        const buffer = Buffer.from('Hello', 'utf16le');
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-16le');
        expect(result.confidence).toBe(0.8);
        expect(result.hasBOM).toBe(false);
      });

      it('should detect UTF-16BE without BOM via null byte heuristic', () => {
        // "Hello" in UTF-16BE without BOM (manually byte-swap from LE)
        const leBuffer = Buffer.from('Hello', 'utf16le');
        const beBuffer = Buffer.alloc(leBuffer.length);
        for (let i = 0; i < leBuffer.length - 1; i += 2) {
          beBuffer[i] = leBuffer[i + 1];
          beBuffer[i + 1] = leBuffer[i];
        }
        const result = detectEncoding(beBuffer);

        expect(result.encoding).toBe('utf-16be');
        expect(result.confidence).toBe(0.8);
        expect(result.hasBOM).toBe(false);
      });

      it('should handle empty buffer as UTF-8', () => {
        const buffer = Buffer.alloc(0);
        const result = detectEncoding(buffer);

        expect(result.encoding).toBe('utf-8');
        expect(result.confidence).toBe(1);
        expect(result.hasBOM).toBe(false);
      });
    });
  });

  describe('decodeWithEncoding', () => {
    it('should decode UTF-8 content', () => {
      const content = 'Hello, 世界!';
      const buffer = Buffer.from(content, 'utf-8');
      const encoding: EncodingInfo = { encoding: 'utf-8', confidence: 1, hasBOM: false };

      const result = decodeWithEncoding(buffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode UTF-8 with BOM (stripping BOM bytes)', () => {
      const content = 'Hello';
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const buffer = Buffer.concat([bom, Buffer.from(content, 'utf-8')]);
      const encoding: EncodingInfo = {
        encoding: 'utf-8',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = decodeWithEncoding(buffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode UTF-16LE content', () => {
      const content = 'Hello';
      const buffer = Buffer.from(content, 'utf16le');
      const encoding: EncodingInfo = { encoding: 'utf-16le', confidence: 1, hasBOM: false };

      const result = decodeWithEncoding(buffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode UTF-16LE with BOM', () => {
      const content = 'Hello';
      const bom = Buffer.from([0xff, 0xfe]);
      const buffer = Buffer.concat([bom, Buffer.from(content, 'utf16le')]);
      const encoding: EncodingInfo = {
        encoding: 'utf-16le',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = decodeWithEncoding(buffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode UTF-16BE content', () => {
      const content = 'Hello';
      // Create UTF-16BE by swapping bytes of UTF-16LE
      const leBuffer = Buffer.from(content, 'utf16le');
      const beBuffer = Buffer.alloc(leBuffer.length);
      for (let i = 0; i < leBuffer.length - 1; i += 2) {
        beBuffer[i] = leBuffer[i + 1];
        beBuffer[i + 1] = leBuffer[i];
      }
      const encoding: EncodingInfo = { encoding: 'utf-16be', confidence: 1, hasBOM: false };

      const result = decodeWithEncoding(beBuffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode UTF-16BE with BOM', () => {
      const content = 'Hi';
      const bom = Buffer.from([0xfe, 0xff]);
      const leBuffer = Buffer.from(content, 'utf16le');
      const beBuffer = Buffer.alloc(leBuffer.length);
      for (let i = 0; i < leBuffer.length - 1; i += 2) {
        beBuffer[i] = leBuffer[i + 1];
        beBuffer[i + 1] = leBuffer[i];
      }
      const fullBuffer = Buffer.concat([bom, beBuffer]);
      const encoding: EncodingInfo = {
        encoding: 'utf-16be',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = decodeWithEncoding(fullBuffer, encoding);
      expect(result).toBe(content);
    });

    it('should decode Latin-1 content', () => {
      // Latin-1 string with accented chars: "café"
      const buffer = Buffer.from([0x63, 0x61, 0x66, 0xe9]);
      const encoding: EncodingInfo = { encoding: 'latin1', confidence: 0.7, hasBOM: false };

      const result = decodeWithEncoding(buffer, encoding);
      expect(result).toBe('caf\u00e9');
    });
  });

  describe('encodeWithEncoding', () => {
    it('should encode UTF-8 content', () => {
      const content = 'Hello, 世界!';
      const encoding: EncodingInfo = { encoding: 'utf-8', confidence: 1, hasBOM: false };

      const result = encodeWithEncoding(content, encoding);
      expect(result.toString('utf-8')).toBe(content);
    });

    it('should encode UTF-8 with BOM', () => {
      const content = 'Hello';
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const encoding: EncodingInfo = {
        encoding: 'utf-8',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = encodeWithEncoding(content, encoding);
      // First 3 bytes should be BOM
      expect(result[0]).toBe(0xef);
      expect(result[1]).toBe(0xbb);
      expect(result[2]).toBe(0xbf);
      // Rest should be content
      expect(result.slice(3).toString('utf-8')).toBe(content);
    });

    it('should encode UTF-16LE content', () => {
      const content = 'Hello';
      const encoding: EncodingInfo = { encoding: 'utf-16le', confidence: 1, hasBOM: false };

      const result = encodeWithEncoding(content, encoding);
      expect(result.toString('utf16le')).toBe(content);
    });

    it('should encode UTF-16LE with BOM', () => {
      const content = 'Hi';
      const bom = Buffer.from([0xff, 0xfe]);
      const encoding: EncodingInfo = {
        encoding: 'utf-16le',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = encodeWithEncoding(content, encoding);
      expect(result[0]).toBe(0xff);
      expect(result[1]).toBe(0xfe);
      expect(result.slice(2).toString('utf16le')).toBe(content);
    });

    it('should encode UTF-16BE content', () => {
      const content = 'Hi';
      const encoding: EncodingInfo = { encoding: 'utf-16be', confidence: 1, hasBOM: false };

      const result = encodeWithEncoding(content, encoding);
      // Decode: swap bytes back to LE, then decode
      const swapped = Buffer.alloc(result.length);
      for (let i = 0; i < result.length - 1; i += 2) {
        swapped[i] = result[i + 1];
        swapped[i + 1] = result[i];
      }
      expect(swapped.toString('utf16le')).toBe(content);
    });

    it('should encode UTF-16BE with BOM', () => {
      const content = 'AB';
      const bom = Buffer.from([0xfe, 0xff]);
      const encoding: EncodingInfo = {
        encoding: 'utf-16be',
        confidence: 1,
        hasBOM: true,
        bomBytes: bom,
      };

      const result = encodeWithEncoding(content, encoding);
      expect(result[0]).toBe(0xfe);
      expect(result[1]).toBe(0xff);
      // Rest is BE encoded content
      const contentBuf = result.slice(2);
      const swapped = Buffer.alloc(contentBuf.length);
      for (let i = 0; i < contentBuf.length - 1; i += 2) {
        swapped[i] = contentBuf[i + 1];
        swapped[i + 1] = contentBuf[i];
      }
      expect(swapped.toString('utf16le')).toBe(content);
    });

    it('should encode Latin-1 content', () => {
      const content = 'caf\u00e9';
      const encoding: EncodingInfo = { encoding: 'latin1', confidence: 0.7, hasBOM: false };

      const result = encodeWithEncoding(content, encoding);
      expect(result).toEqual(Buffer.from([0x63, 0x61, 0x66, 0xe9]));
    });
  });

  describe('isBinaryFile', () => {
    it('should not treat empty files as binary', () => {
      expect(isBinaryFile(Buffer.alloc(0))).toBe(false);
    });

    it('should not treat UTF-16 LE BOM files as binary', () => {
      const buffer = Buffer.from([0xff, 0xfe, 0x48, 0x00, 0x69, 0x00]);
      expect(isBinaryFile(buffer)).toBe(false);
    });

    it('should not treat UTF-16 BE BOM files as binary', () => {
      const buffer = Buffer.from([0xfe, 0xff, 0x00, 0x48, 0x00, 0x69]);
      expect(isBinaryFile(buffer)).toBe(false);
    });

    it('should not treat UTF-8 BOM files as binary', () => {
      const buffer = Buffer.from([0xef, 0xbb, 0xbf, 0x48, 0x65, 0x6c, 0x6c, 0x6f]);
      expect(isBinaryFile(buffer)).toBe(false);
    });

    it('should not treat plain ASCII text as binary', () => {
      const buffer = Buffer.from('Hello, World!\nThis is a text file.\n', 'utf-8');
      expect(isBinaryFile(buffer)).toBe(false);
    });

    it('should not treat UTF-8 with multi-byte chars as binary', () => {
      const buffer = Buffer.from('日本語テスト', 'utf-8');
      expect(isBinaryFile(buffer)).toBe(false);
    });

    it('should detect files with many null bytes as binary', () => {
      // Simulate a binary file (e.g., compiled code)
      const buffer = Buffer.alloc(100, 0);
      expect(isBinaryFile(buffer)).toBe(true);
    });

    it('should detect files with many control characters as binary', () => {
      // Fill with control chars
      const buffer = Buffer.alloc(100);
      for (let i = 0; i < 100; i++) {
        buffer[i] = i % 7; // Chars 0-6 are control chars (excluding common ones)
      }
      expect(isBinaryFile(buffer)).toBe(true);
    });

    it('should not treat files with tabs and newlines as binary', () => {
      const content = 'line1\tvalue1\nline2\tvalue2\r\nline3\tvalue3';
      const buffer = Buffer.from(content, 'utf-8');
      expect(isBinaryFile(buffer)).toBe(false);
    });
  });

  describe('Read tool with encoding', () => {
    it('should read UTF-8 files correctly', async () => {
      const testFile = path.join(tempDir, 'utf8.txt');
      const content = 'Hello, 世界!\nLine 2 with émojis';
      await fs.writeFile(testFile, content, 'utf-8');

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('Hello, 世界!');
        expect(result.data.content).toContain('émojis');
      }
    });

    it('should read UTF-8 BOM files correctly', async () => {
      const testFile = path.join(tempDir, 'utf8-bom.txt');
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const content = Buffer.from('Hello BOM\nLine 2', 'utf-8');
      await fs.writeFile(testFile, Buffer.concat([bom, content]));

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('Hello BOM');
        expect(result.data.content).toContain('Line 2');
        // BOM should be stripped from content
        expect(result.data.content).not.toContain('\ufeff');
      }

      // Verify encoding was cached
      const cachedEncoding = getFileEncoding(testFile);
      expect(cachedEncoding?.encoding).toBe('utf-8');
      expect(cachedEncoding?.hasBOM).toBe(true);
    });

    it('should read UTF-16LE BOM files correctly', async () => {
      const testFile = path.join(tempDir, 'utf16le.txt');
      const bom = Buffer.from([0xff, 0xfe]);
      const content = Buffer.from('Hello UTF-16\nLine 2', 'utf16le');
      await fs.writeFile(testFile, Buffer.concat([bom, content]));

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('Hello UTF-16');
        expect(result.data.content).toContain('Line 2');
      }

      // Verify encoding was cached
      const cachedEncoding = getFileEncoding(testFile);
      expect(cachedEncoding?.encoding).toBe('utf-16le');
      expect(cachedEncoding?.hasBOM).toBe(true);
    });

    it('should read UTF-16BE BOM files correctly', async () => {
      const testFile = path.join(tempDir, 'utf16be.txt');
      const bom = Buffer.from([0xfe, 0xff]);
      // Create UTF-16BE content by encoding to LE then swapping
      const leContent = Buffer.from('Hello BE', 'utf16le');
      const beContent = Buffer.alloc(leContent.length);
      for (let i = 0; i < leContent.length - 1; i += 2) {
        beContent[i] = leContent[i + 1];
        beContent[i + 1] = leContent[i];
      }
      await fs.writeFile(testFile, Buffer.concat([bom, beContent]));

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('Hello BE');
      }

      const cachedEncoding = getFileEncoding(testFile);
      expect(cachedEncoding?.encoding).toBe('utf-16be');
      expect(cachedEncoding?.hasBOM).toBe(true);
    });

    it('should reject binary files', async () => {
      const testFile = path.join(tempDir, 'binary.bin');
      // Write null-heavy binary content
      const buffer = Buffer.alloc(200, 0);
      buffer[0] = 0x7f; // Not a BOM
      buffer[1] = 0x45;
      await fs.writeFile(testFile, buffer);

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot read binary file');
    });

    it('should handle offset/limit with UTF-8 files', async () => {
      const testFile = path.join(tempDir, 'multiline.txt');
      const lines = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}: 日本語`);
      await fs.writeFile(testFile, lines.join('\n'), 'utf-8');

      const result = await readTool.execute({ filePath: testFile, offset: 3, limit: 2 }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('3: Line 3');
        expect(result.data.content).toContain('4: Line 4');
        expect(result.data.content).not.toContain('2: Line 2');
        expect(result.data.content).not.toContain('5: Line 5');
        expect(result.data.shownLines).toBe(2);
        expect(result.data.offset).toBe(3);
      }
    });
  });

  describe('Write tool with encoding preservation', () => {
    it('should write new files as UTF-8 by default', async () => {
      const testFile = path.join(tempDir, 'new-file.txt');
      const content = 'Hello, 世界!';

      const result = await writeTool.execute({ filePath: testFile, content }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(true);

      // Verify file is UTF-8
      const buffer = await fs.readFile(testFile);
      expect(buffer.toString('utf-8')).toBe(content);
      // No BOM
      expect(buffer[0]).not.toBe(0xef);
    });

    it('should preserve UTF-8 BOM when writing back', async () => {
      const testFile = path.join(tempDir, 'bom-preserve.txt');
      // Create file with UTF-8 BOM
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      const original = Buffer.from('Original content', 'utf-8');
      await fs.writeFile(testFile, Buffer.concat([bom, original]));

      // Read to cache encoding
      await readTool.execute({ filePath: testFile }, context);

      // Write new content
      const newContent = 'Updated content';
      const result = await writeTool.execute({ filePath: testFile, content: newContent }, context);

      expect(result.success).toBe(true);
      expect(result.data?.created).toBe(false);

      // Verify BOM is preserved
      const buffer = await fs.readFile(testFile);
      expect(buffer[0]).toBe(0xef);
      expect(buffer[1]).toBe(0xbb);
      expect(buffer[2]).toBe(0xbf);
      expect(buffer.slice(3).toString('utf-8')).toBe(newContent);
    });

    it('should preserve UTF-16LE encoding when writing back', async () => {
      const testFile = path.join(tempDir, 'utf16le-preserve.txt');
      // Create UTF-16LE file with BOM
      const bom = Buffer.from([0xff, 0xfe]);
      const original = Buffer.from('Original', 'utf16le');
      await fs.writeFile(testFile, Buffer.concat([bom, original]));

      // Read to cache encoding
      await readTool.execute({ filePath: testFile }, context);

      // Write new content
      const newContent = 'Updated UTF-16';
      const result = await writeTool.execute({ filePath: testFile, content: newContent }, context);

      expect(result.success).toBe(true);

      // Verify encoding is preserved
      const buffer = await fs.readFile(testFile);
      expect(buffer[0]).toBe(0xff);
      expect(buffer[1]).toBe(0xfe);
      expect(buffer.slice(2).toString('utf16le')).toBe(newContent);
    });

    it('should preserve UTF-16BE encoding when writing back', async () => {
      const testFile = path.join(tempDir, 'utf16be-preserve.txt');
      // Create UTF-16BE file with BOM
      const bom = Buffer.from([0xfe, 0xff]);
      const leContent = Buffer.from('Original', 'utf16le');
      const beContent = Buffer.alloc(leContent.length);
      for (let i = 0; i < leContent.length - 1; i += 2) {
        beContent[i] = leContent[i + 1];
        beContent[i + 1] = leContent[i];
      }
      await fs.writeFile(testFile, Buffer.concat([bom, beContent]));

      // Read to cache encoding
      await readTool.execute({ filePath: testFile }, context);

      // Write new content
      const newContent = 'New BE';
      const result = await writeTool.execute({ filePath: testFile, content: newContent }, context);

      expect(result.success).toBe(true);

      // Verify BOM is preserved
      const buffer = await fs.readFile(testFile);
      expect(buffer[0]).toBe(0xfe);
      expect(buffer[1]).toBe(0xff);

      // Verify content can be decoded back to UTF-16BE
      const contentBuf = buffer.slice(2);
      const swapped = Buffer.alloc(contentBuf.length);
      for (let i = 0; i < contentBuf.length - 1; i += 2) {
        swapped[i] = contentBuf[i + 1];
        swapped[i + 1] = contentBuf[i];
      }
      expect(swapped.toString('utf16le')).toBe(newContent);
    });

    it('should not double BOM when content already has BOM character', async () => {
      const testFile = path.join(tempDir, 'double-bom.txt');
      // Create UTF-8 BOM file
      const bom = Buffer.from([0xef, 0xbb, 0xbf]);
      await fs.writeFile(testFile, Buffer.concat([bom, Buffer.from('test', 'utf-8')]));

      // Read to cache encoding
      await readTool.execute({ filePath: testFile }, context);

      // Write content that starts with BOM character (U+FEFF)
      const contentWithBom = '\ufeffUpdated';
      const result = await writeTool.execute(
        { filePath: testFile, content: contentWithBom },
        context
      );

      expect(result.success).toBe(true);

      // Should have exactly one BOM, not two
      const buffer = await fs.readFile(testFile);
      expect(buffer[0]).toBe(0xef);
      expect(buffer[1]).toBe(0xbb);
      expect(buffer[2]).toBe(0xbf);
      // After BOM, content should start with "Updated" (BOM char stripped)
      expect(buffer.slice(3).toString('utf-8')).toBe('Updated');
    });
  });

  describe('Round-trip encoding preservation', () => {
    it('should round-trip UTF-8 content without loss', async () => {
      const testFile = path.join(tempDir, 'roundtrip-utf8.txt');
      const content = 'Héllo Wörld! 🌍\nLine 2: 日本語';
      await fs.writeFile(testFile, content, 'utf-8');

      // Read
      const readResult = await readTool.execute({ filePath: testFile }, context);
      expect(readResult.success).toBe(true);

      // Write back
      await writeTool.execute({ filePath: testFile, content }, context);

      // Verify unchanged
      const finalContent = await fs.readFile(testFile, 'utf-8');
      expect(finalContent).toBe(content);
    });

    it('should round-trip UTF-16LE BOM content without loss', async () => {
      const testFile = path.join(tempDir, 'roundtrip-utf16le.txt');
      const bom = Buffer.from([0xff, 0xfe]);
      const text = 'Héllo Wörld!';
      const contentBuf = Buffer.from(text, 'utf16le');
      await fs.writeFile(testFile, Buffer.concat([bom, contentBuf]));

      // Read
      const readResult = await readTool.execute({ filePath: testFile }, context);
      expect(readResult.success).toBe(true);
      if (readResult.data?.type === 'file') {
        expect(readResult.data.content).toContain(text);
      }

      // Write back the same text
      await writeTool.execute({ filePath: testFile, content: text }, context);

      // Verify encoding preserved
      const buffer = await fs.readFile(testFile);
      expect(buffer[0]).toBe(0xff);
      expect(buffer[1]).toBe(0xfe);
      expect(buffer.slice(2).toString('utf16le')).toBe(text);
    });
  });

  describe('Large file streaming', () => {
    it('should handle files larger than stream threshold with offset/limit', async () => {
      const testFile = path.join(tempDir, 'large.txt');
      // Create a file with many lines
      const lines = Array.from({ length: 5000 }, (_, i) => `Line ${i + 1}: some content here`);
      await fs.writeFile(testFile, lines.join('\n'), 'utf-8');

      const result = await readTool.execute(
        { filePath: testFile, offset: 100, limit: 10 },
        context
      );

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.content).toContain('100: Line 100');
        expect(result.data.content).toContain('109: Line 109');
        expect(result.data.shownLines).toBe(10);
        expect(result.data.offset).toBe(100);
        expect(result.data.totalLines).toBe(5000);
      }
    });

    it('should read large files without offset/limit', async () => {
      const testFile = path.join(tempDir, 'large-no-offset.txt');
      const lines = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`);
      await fs.writeFile(testFile, lines.join('\n'), 'utf-8');

      const result = await readTool.execute({ filePath: testFile }, context);

      expect(result.success).toBe(true);
      if (result.data?.type === 'file') {
        expect(result.data.totalLines).toBe(100);
        expect(result.data.content).toContain('1: Line 1');
        expect(result.data.content).toContain('100: Line 100');
      }
    });
  });
});
