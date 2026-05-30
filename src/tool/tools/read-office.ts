/**
 * Office document extraction helpers for the `read` tool.
 *
 * Provides DOCX (`.docx`) and XLSX (`.xlsx`, `.xlsm`) text extraction so the
 * `read` tool can return readable content instead of "Cannot read binary file"
 * for office artifacts checked into a repo (RFCs, design docs, dependency
 * spreadsheets, change logs, ...).
 *
 * Caps mirror kilocode CLI 7.3.16–7.3.18:
 *   - 25 MB hard cap on the underlying file (prevents response blowup on
 *     unbounded XLSX with hidden styles)
 *   - 5,000 row preview per sheet (also from kilocode `bound XLSX read input
 *     size`)
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB hard cap
export const MAX_ROWS_PER_SHEET = 5000;

export interface OfficeExtractionResult {
  content: string;
  truncated: boolean;
  hint?: string;
}

/**
 * Detect whether the path points at a supported office document and return its
 * extraction kind, or `null` if the extension is not handled here.
 *
 * `.docm` (macro-enabled Word) is intentionally NOT supported — mammoth's
 * extractor does not handle the macro variant and silently degrades, which we
 * prefer to surface as "binary file" rather than a half-extracted preview.
 */
export function isOfficeDocument(filePath: string): 'docx' | 'xlsx' | null {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.docx') {
    return 'docx';
  }
  if (ext === '.xlsx' || ext === '.xlsm') {
    return 'xlsx';
  }
  return null;
}

// Minimal structural typing for the parts of the mammoth API we use. Mammoth
// ships as CommonJS with no .d.ts; declaring the surface inline keeps this
// module independent of @types/mammoth (which does not exist).
interface MammothLike {
  convertToMarkdown: (input: { buffer: Buffer }) => Promise<{ value: string }>;
}

interface XlsxWorkbook {
  SheetNames: string[];
  Sheets: Record<string, unknown>;
}

interface XlsxLike {
  readFile: (filePath: string, options?: { cellDates?: boolean }) => XlsxWorkbook;
  utils: {
    sheet_to_csv: (worksheet: unknown, options?: { blankrows?: boolean }) => string;
  };
}

/**
 * Extract DOCX text content as markdown via mammoth.
 *
 * Files larger than {@link MAX_FILE_BYTES} are refused up front with a hint
 * suggesting the user open them with a real reader.
 */
export async function extractDocxText(filePath: string): Promise<OfficeExtractionResult> {
  const stat = await fs.stat(filePath);
  if (stat.size > MAX_FILE_BYTES) {
    return {
      content: '',
      truncated: true,
      hint:
        `DOCX file too large (${stat.size} bytes > ${MAX_FILE_BYTES}). ` +
        `Refusing to extract; open with a real reader.`,
    };
  }

  const mammothModule = (await import('mammoth')) as unknown as Partial<MammothLike> & {
    default?: MammothLike;
  };
  const mammoth: MammothLike =
    typeof mammothModule.convertToMarkdown === 'function'
      ? (mammothModule as MammothLike)
      : (mammothModule.default as MammothLike);

  const buffer = await fs.readFile(filePath);
  const result = await mammoth.convertToMarkdown({ buffer });
  return { content: result.value, truncated: false };
}

/**
 * Extract XLSX/XLSM text content as a workbook header + per-sheet CSV preview.
 *
 * Sheets longer than {@link MAX_ROWS_PER_SHEET} rows are truncated to that
 * many rows (with the truncated flag set).
 */
export async function extractXlsxText(filePath: string): Promise<OfficeExtractionResult> {
  const stat = await fs.stat(filePath);
  if (stat.size > MAX_FILE_BYTES) {
    return {
      content: '',
      truncated: true,
      hint: `XLSX file too large (${stat.size} bytes > ${MAX_FILE_BYTES}). Refusing to extract.`,
    };
  }

  const xlsxModule = (await import('xlsx')) as unknown as Partial<XlsxLike> & {
    default?: XlsxLike;
  };
  const xlsx: XlsxLike =
    typeof xlsxModule.readFile === 'function'
      ? (xlsxModule as XlsxLike)
      : (xlsxModule.default as XlsxLike);

  const wb = xlsx.readFile(filePath, { cellDates: true });
  const lines: string[] = [];
  let truncated = false;

  lines.push(`Workbook: ${path.basename(filePath)}`);
  lines.push(`Sheets: ${wb.SheetNames.join(', ')}`);
  lines.push('');

  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const csv = xlsx.utils.sheet_to_csv(ws, { blankrows: false });
    // Split on either CRLF or LF; trim a single trailing empty line that
    // sheet_to_csv tends to emit so it does not inflate the row count.
    const rawRows = csv.split(/\r?\n/);
    const allRows =
      rawRows.length > 0 && rawRows[rawRows.length - 1] === '' ? rawRows.slice(0, -1) : rawRows;

    const sheetTruncated = allRows.length > MAX_ROWS_PER_SHEET;
    const showRows = sheetTruncated ? allRows.slice(0, MAX_ROWS_PER_SHEET) : allRows;
    if (sheetTruncated) {
      truncated = true;
    }

    lines.push(`## Sheet: ${name} (${allRows.length} rows${sheetTruncated ? ', truncated' : ''})`);
    lines.push('```csv');
    lines.push(...showRows);
    lines.push('```');
    lines.push('');
  }

  return {
    content: lines.join('\n'),
    truncated,
    hint: truncated ? `Some sheets exceeded ${MAX_ROWS_PER_SHEET} rows; preview only.` : undefined,
  };
}
