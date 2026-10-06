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

interface XlsxCell {
  /** Cell type: 'd' = date, 'e' = error, 'n' = number, 's' = string, 'b' = bool. */
  t?: string;
  /** Raw value — Date for `t === 'd'` when `cellDates: true`. */
  v?: unknown;
  /** Formatted text (`w`) matching the cell's number format `z`. */
  w?: string;
  /** Number format code (e.g. `h:mm:ss`, `yyyy-mm-dd`). Populated when `cellNF: true`. */
  z?: string;
  /** Hyperlink info. */
  l?: { Target?: string };
}

interface XlsxWorksheet {
  '!ref'?: string;
  [cellRef: string]: XlsxCell | unknown;
}

interface XlsxWorkbook {
  SheetNames: string[];
  Sheets: Record<string, XlsxWorksheet>;
}

interface XlsxLike {
  readFile: (
    filePath: string,
    options?: { cellDates?: boolean; cellNF?: boolean }
  ) => XlsxWorkbook;
  utils: {
    sheet_to_csv: (worksheet: unknown, options?: { blankrows?: boolean }) => string;
    decode_range: (ref: string) => { s: { c: number; r: number }; e: { c: number; r: number } };
    encode_cell: (addr: { c: number; r: number }) => string;
  };
}

/**
 * Format a single XLSX cell to a text representation suitable for CSV output.
 *
 * Ports the upstream kilocode xlsx-cell fix (opencode 2026-10):
 *   - Spreadsheet times (e.g. `14:05`) parse as `14:04:59.999` due to
 *     SheetJS float error — round the Date to whole seconds.
 *   - Month-only / time-only / datetime cells were incorrectly flattened
 *     to date-only ISO strings. We now use the number-format code (`z`)
 *     to decide whether the cell represents a time, a datetime, or a
 *     plain date, and format it accordingly.
 */
export function formatXlsxCell(value: XlsxCell | undefined): string {
  if (!value) {
    return '';
  }
  if (value.v === undefined || value.v === null) {
    return '';
  }
  if (value.t === 'e') {
    return `[Error: ${value.w ?? String(value.v)}]`;
  }
  if (value.t === 'd') {
    if (!(value.v instanceof Date)) {
      return String(value.v);
    }
    // Round away SheetJS's floating-point error: 14:05 parses as 14:04:59.999.
    const iso = new Date(Math.round(value.v.getTime() / 1000) * 1000).toISOString();
    // A time of day or a duration is stored as a day in 1899 or 1900. Its format is an elapsed [h], [m]
    // or [s] one, or shows an hour or a second and no day or year outside quoted text, escaped
    // characters and [...] sections, so read it as the cell shows it. An m alone is a month (mmm).
    const code = String(value.z ?? '');
    const format = code.replace(/"[^"]*"|\\.|\[[^\]]*\]/g, '');
    const timeOnly = /\[(h+|m+|s+)\]/i.test(code) || (!/[dy]/i.test(format) && /[hs]/i.test(format));
    if (value.z != null && timeOnly) {
      return value.w ?? iso.slice(11, 19);
    }
    if (iso.endsWith('T00:00:00.000Z')) {
      return iso.slice(0, 10);
    }
    return iso.slice(0, 19).replace('T', ' ');
  }
  if (value.l?.Target) {
    return `${value.w ?? String(value.v)} (${value.l.Target})`;
  }
  return value.w ?? String(value.v);
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

  const wb = xlsx.readFile(filePath, { cellDates: true, cellNF: true });
  const lines: string[] = [];
  let truncated = false;

  lines.push(`Workbook: ${path.basename(filePath)}`);
  lines.push(`Sheets: ${wb.SheetNames.join(', ')}`);
  lines.push('');

  for (const name of wb.SheetNames) {
    const ws = wb.Sheets[name];
    const allRows = worksheetToCsvRows(ws, xlsx);

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

/**
 * Build CSV rows for a worksheet while routing every cell through
 * {@link formatXlsxCell}. Falls back to `sheet_to_csv` when the worksheet
 * carries no `!ref` range (empty / malformed sheet) so behaviour matches
 * the legacy path for the no-data case.
 *
 * Blank rows are suppressed to mirror the previous `blankrows: false`
 * behaviour and avoid inflating the per-sheet row count against the
 * 5,000-row cap.
 */
function worksheetToCsvRows(ws: XlsxWorksheet, xlsx: XlsxLike): string[] {
  const ref = typeof ws['!ref'] === 'string' ? (ws['!ref'] as string) : undefined;
  if (!ref) {
    const csv = xlsx.utils.sheet_to_csv(ws, { blankrows: false });
    const rawRows = csv.split(/\r?\n/);
    return rawRows.length > 0 && rawRows[rawRows.length - 1] === ''
      ? rawRows.slice(0, -1)
      : rawRows;
  }
  const range = xlsx.utils.decode_range(ref);
  const rows: string[] = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const cells: string[] = [];
    let hasContent = false;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = xlsx.utils.encode_cell({ c, r });
      const cell = ws[addr] as XlsxCell | undefined;
      const text = formatXlsxCell(cell);
      if (text.length > 0) {
        hasContent = true;
      }
      cells.push(csvEscape(text));
    }
    if (hasContent) {
      rows.push(cells.join(','));
    }
  }
  return rows;
}

/**
 * Minimal CSV field escaper: quote fields that contain a comma, quote,
 * CR, or LF; double any embedded quotes. Matches the subset of RFC 4180
 * that SheetJS's `sheet_to_csv` emits for the same inputs.
 */
function csvEscape(value: string): string {
  if (value.length === 0) {
    return '';
  }
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
