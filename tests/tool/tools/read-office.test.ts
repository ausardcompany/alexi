import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

import {
  extractDocxText,
  extractXlsxText,
  isOfficeDocument,
  MAX_FILE_BYTES,
  MAX_ROWS_PER_SHEET,
} from '../../../src/tool/tools/read-office.js';

/**
 * Build a minimal but valid DOCX file containing the given paragraphs and
 * return the absolute path to it. Mammoth happily extracts text from this
 * shape — we only need the parts of the OOXML schema mammoth actually reads.
 */
async function makeTinyDocx(filePath: string, paragraphs: string[]): Promise<void> {
  const zip = new JSZip();

  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  const body = paragraphs
    .map(
      (p) =>
        `<w:p><w:r><w:t xml:space="preserve">${p.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</w:t></w:r></w:p>`
    )
    .join('');

  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}</w:body>
</w:document>`
  );

  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  await fs.writeFile(filePath, buf);
}

/**
 * Build a workbook with one or more named sheets where each sheet is given as
 * a 2D array of cell values, and write it to disk via the xlsx library.
 */
function makeXlsx(filePath: string, sheets: Record<string, unknown[][]>): void {
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name);
  }
  XLSX.writeFile(wb, filePath);
}

describe('read-office', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'read-office-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('isOfficeDocument', () => {
    it('returns "docx" for .docx', () => {
      expect(isOfficeDocument('/tmp/foo.docx')).toBe('docx');
      expect(isOfficeDocument('/tmp/Foo.DOCX')).toBe('docx');
    });

    it('returns "xlsx" for .xlsx and .xlsm', () => {
      expect(isOfficeDocument('/tmp/foo.xlsx')).toBe('xlsx');
      expect(isOfficeDocument('/tmp/foo.XLSM')).toBe('xlsx');
    });

    it('returns null for unsupported / macro variants', () => {
      expect(isOfficeDocument('/tmp/foo.txt')).toBeNull();
      expect(isOfficeDocument('/tmp/foo.docm')).toBeNull();
      expect(isOfficeDocument('/tmp/foo.pdf')).toBeNull();
      expect(isOfficeDocument('/tmp/no-extension')).toBeNull();
    });
  });

  describe('extractDocxText', () => {
    it('extracts paragraph text as markdown', async () => {
      const file = path.join(tempDir, 'sample.docx');
      await makeTinyDocx(file, ['Hello from a DOCX fixture', 'Second paragraph with more content']);

      const result = await extractDocxText(file);

      expect(result.truncated).toBe(false);
      expect(result.hint).toBeUndefined();
      expect(result.content).toContain('Hello from a DOCX fixture');
      expect(result.content).toContain('Second paragraph with more content');
    });

    it('refuses oversize DOCX with the size-cap hint', async () => {
      const file = path.join(tempDir, 'big.docx');
      // Create a file just over the 25 MB cap. Content does not need to be a
      // real DOCX — we never pass the size guard.
      const oversize = MAX_FILE_BYTES + 1024;
      const buf = Buffer.alloc(oversize, 0);
      await fs.writeFile(file, buf);

      const result = await extractDocxText(file);

      expect(result.truncated).toBe(true);
      expect(result.content).toBe('');
      expect(result.hint).toContain('DOCX file too large');
      expect(result.hint).toContain(`> ${MAX_FILE_BYTES}`);
    });
  });

  describe('extractXlsxText', () => {
    it('returns workbook header, sheet names and CSV preview per sheet', async () => {
      const file = path.join(tempDir, 'sample.xlsx');
      makeXlsx(file, {
        Alpha: [
          ['name', 'value'],
          ['foo', 1],
          ['bar', 2],
        ],
        Beta: [
          ['col1', 'col2'],
          ['x', 'y'],
        ],
      });

      const result = await extractXlsxText(file);

      expect(result.truncated).toBe(false);
      expect(result.hint).toBeUndefined();
      expect(result.content).toContain('Workbook: sample.xlsx');
      expect(result.content).toContain('Sheets: Alpha, Beta');
      expect(result.content).toContain('## Sheet: Alpha');
      expect(result.content).toContain('## Sheet: Beta');
      expect(result.content).toContain('name,value');
      expect(result.content).toContain('foo,1');
      expect(result.content).toContain('col1,col2');
      // Both sheets should report 3 and 2 rows respectively.
      expect(result.content).toMatch(/## Sheet: Alpha \(3 rows\)/);
      expect(result.content).toMatch(/## Sheet: Beta \(2 rows\)/);
    });

    it('truncates sheets that exceed MAX_ROWS_PER_SHEET and sets the hint', async () => {
      const file = path.join(tempDir, 'huge.xlsx');
      // One row over the cap to keep the test fast (~5001 rows).
      const rows: unknown[][] = [['idx']];
      for (let i = 0; i < MAX_ROWS_PER_SHEET + 1; i++) {
        rows.push([i]);
      }
      makeXlsx(file, { Big: rows });

      const result = await extractXlsxText(file);

      expect(result.truncated).toBe(true);
      expect(result.hint).toContain(`Some sheets exceeded ${MAX_ROWS_PER_SHEET} rows`);
      expect(result.content).toContain('truncated');
      // First row inside the preview should be present.
      expect(result.content).toContain('0');
      // The very last row (index MAX_ROWS_PER_SHEET) should be excluded.
      expect(result.content).not.toContain(`\n${MAX_ROWS_PER_SHEET}\n`);
    });

    it('refuses oversize XLSX with the size-cap hint', async () => {
      const file = path.join(tempDir, 'big.xlsx');
      const oversize = MAX_FILE_BYTES + 1024;
      const buf = Buffer.alloc(oversize, 0);
      await fs.writeFile(file, buf);

      const result = await extractXlsxText(file);

      expect(result.truncated).toBe(true);
      expect(result.content).toBe('');
      expect(result.hint).toContain('XLSX file too large');
      expect(result.hint).toContain(`> ${MAX_FILE_BYTES}`);
    });
  });
});
