/**
 * Read Tool - Read files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { defineTool, truncateOutput, MAX_LINES, type ToolResult } from '../index.js';
import {
  detectEncoding,
  decodeWithEncoding,
  isBinaryFile,
  type EncodingInfo,
} from '../encoded-io.js';
import { getReferenceService } from '../../reference/reference.js';
import { extractDocxText, extractXlsxText, isOfficeDocument } from './read-office.js';
import { attachAgentsMdReminders } from '../../agent/agentsMdReminders.js';

const ReadParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file or directory to read'),
  offset: z.number().optional().describe('Line number to start from (1-indexed)'),
  limit: z.number().optional().describe('Maximum number of lines to read (default: 2000)'),
});

interface ReadFileResult {
  type: 'file';
  path: string;
  content: string;
  /**
   * Total number of lines in the file. For ranged reads (caller supplied an
   * `offset` and/or `limit`) this is `null` because we stream the file rather
   * than loading it into memory, so an exact count would require a second
   * pass. Callers can rely on `eof` / `nextOffset` (in the hint) instead.
   */
  totalLines: number | null;
  shownLines: number;
  offset: number;
  partial?: boolean;
}

interface ReadDirResult {
  type: 'directory';
  path: string;
  entries: string;
}

type ReadResult = ReadFileResult | ReadDirResult;

// Store encoding info for later write operations
const fileEncodings = new Map<string, EncodingInfo>();

export function getFileEncoding(filePath: string): EncodingInfo | undefined {
  return fileEncodings.get(filePath);
}

/**
 * Maximum file size for implicit whole-file reads (no offset/limit). Files
 * above this threshold must be read with an explicit offset/limit so the
 * streaming path is used and the whole file is never buffered into memory.
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Number of bytes read from the head of the file purely to detect encoding
 * (BOM markers, UTF-8 fallback) before streaming the rest of the file.
 */
const ENCODING_PROBE_BYTES = 64 * 1024; // 64 KB

/**
 * Read up to `ENCODING_PROBE_BYTES` from the head of the file so we can
 * detect the encoding (and binary-ness) without buffering the whole file.
 */
async function readEncodingProbe(filePath: string): Promise<Buffer> {
  const handle = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.alloc(ENCODING_PROBE_BYTES);
    const { bytesRead } = await handle.read(buf, 0, ENCODING_PROBE_BYTES, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

interface StreamedLines {
  /** Captured 1-based slice [offset, offset+limit-1]. */
  lines: string[];
  /** Last 1-based line number scanned (== total lines if eof). */
  totalLinesScanned: number;
  /** True if the stream reached end-of-file before `limit` lines were captured. */
  eof: boolean;
}

/**
 * Stream a file line-by-line and return the requested 1-based [offset,
 * offset+limit-1] window without buffering the whole file. Lines are decoded
 * from the supplied encoding when Node accepts it directly; otherwise raw
 * UTF-8 is assumed (matches `decodeWithEncoding`'s fallback).
 *
 * NOTE: `totalLinesScanned` only equals the file's true total line count
 * when `eof === true`. For ranged reads we never re-scan the tail of the
 * file just to compute a total; callers should use `eof` instead.
 */
async function readLinesStreaming(
  filePath: string,
  opts: { offset: number; limit: number; encoding: EncodingInfo }
): Promise<StreamedLines> {
  const { offset, limit, encoding } = opts;
  const startIdx = Math.max(1, offset);
  const endIdx = startIdx + limit - 1;

  // readline accepts a small set of named encodings via stream.setEncoding.
  // For everything else we let readline operate on Buffer chunks (default)
  // and rely on the UTF-8 fallback path used elsewhere in this module.
  const stream = createReadStream(filePath);
  const nodeEncoding: 'utf-8' | 'utf16le' =
    encoding.encoding === 'utf-16le' || encoding.encoding === 'utf16le' ? 'utf16le' : 'utf-8';
  stream.setEncoding(nodeEncoding);

  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const captured: string[] = [];
  let lineNo = 0;
  let eof = true;

  try {
    for await (const line of rl) {
      lineNo++;
      if (lineNo < startIdx) {
        continue;
      }
      if (lineNo > endIdx) {
        // We have all requested lines; close the stream early so we don't
        // continue reading the rest of the file.
        eof = false;
        break;
      }
      captured.push(line);
    }
  } finally {
    rl.close();
    stream.destroy();
  }

  // Strip a leading BOM character that readline may have surfaced as part of
  // the very first line when the file started with a UTF-8 BOM.
  if (
    captured.length > 0 &&
    encoding.hasBOM &&
    encoding.encoding === 'utf-8' &&
    startIdx === 1 &&
    captured[0].charCodeAt(0) === 0xfeff
  ) {
    captured[0] = captured[0].slice(1);
  }

  return { lines: captured, totalLinesScanned: lineNo, eof };
}

export const readTool = defineTool<typeof ReadParamsSchema, ReadResult>({
  name: 'read',
  description: `Read a file or directory from the local filesystem. Returns contents with line numbers.
  
Usage:
- The filePath parameter should be an absolute path.
- By default, returns up to 2000 lines from the start of the file.
- Use offset to read from a specific line.
- For directories, returns a list of entries.
- Lines are prefixed with line numbers like "1: content".`,

  parameters: ReadParamsSchema,

  permission: {
    action: 'read',
    getResource: (params, context) => {
      // Return worktree-relative path for permission pattern matching
      // This prevents permission bypass with absolute paths
      const absolutePath = path.isAbsolute(params.filePath)
        ? params.filePath
        : path.join(context?.workdir || process.cwd(), params.filePath);
      const workdir = context?.workdir || process.cwd();
      return path.relative(workdir, absolutePath);
    },
  },

  async execute(params, context): Promise<ToolResult<ReadResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Ensure reference is materialized for reference paths
      const referenceService = getReferenceService();
      if (referenceService) {
        await referenceService.ensure(path.dirname(filePath));
      }

      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        // Read directory
        const entries = await fs.readdir(filePath, { withFileTypes: true });
        const formatted = entries
          .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
          .sort()
          .join('\n');

        const dirResult: ToolResult<ReadResult> = {
          success: true,
          data: {
            type: 'directory',
            path: filePath,
            entries: formatted,
          },
        };
        attachAgentsMdReminders(dirResult, filePath, context);
        return dirResult;
      }

      // Office document branch — DOCX/XLSX/XLSM are zip files that would
      // otherwise either fail the binary check or stream as garbage. Detect by
      // extension and dispatch to mammoth/xlsx for a readable text preview.
      const officeKind = isOfficeDocument(filePath);
      if (officeKind) {
        const {
          content: officeContent,
          truncated: officeTruncated,
          hint: officeHint,
        } = officeKind === 'docx'
          ? await extractDocxText(filePath)
          : await extractXlsxText(filePath);

        const officeLines = officeContent.split('\n');
        const officeResult: ToolResult<ReadResult> = {
          success: true,
          data: {
            type: 'file',
            path: filePath,
            content: officeContent,
            totalLines: officeLines.length,
            shownLines: officeLines.length,
            offset: 1,
          },
          truncated: officeTruncated,
          hint: officeHint,
        };
        attachAgentsMdReminders(officeResult, filePath, context);
        return officeResult;
      }

      // Probe the head of the file once so we can both classify it as binary
      // and detect the encoding without loading the whole file into memory.
      const probe = await readEncodingProbe(filePath);

      if (isBinaryFile(probe)) {
        return {
          success: false,
          error: `Cannot read binary file: ${filePath}`,
        };
      }

      const encoding = detectEncoding(probe);
      // Cache encoding for write operations
      fileEncodings.set(filePath, encoding);

      const isImplicitWholeFileRead = params.offset === undefined && params.limit === undefined;

      if (isImplicitWholeFileRead) {
        // Whole-file path keeps the existing semantics (exact totalLines,
        // PARTIAL view hint when truncated) but is gated on file size to
        // protect heap usage. Ranged reads bypass this limit because they
        // are bounded by `limit`.
        if (stat.size > MAX_FILE_SIZE_BYTES) {
          return {
            success: false,
            error: 'File too large for whole-file read; pass an explicit offset/limit',
            hint: 'Use the ranged form: read(path, offset, limit)',
          };
        }

        const buffer = await fs.readFile(filePath);
        const content = decodeWithEncoding(buffer, encoding);

        const lines = content.split('\n');
        const totalLines = lines.length;

        const offset = 1;
        const limit = MAX_LINES;
        const startIdx = 0;
        const endIdx = Math.min(startIdx + limit, lines.length);
        const selectedLines = lines.slice(startIdx, endIdx);

        const numberedLines = selectedLines.map((line, i) => `${startIdx + i + 1}: ${line}`);
        const output = numberedLines.join('\n');
        const { content: truncated, truncated: wasTruncated } = truncateOutput(output);

        const isPartialView = wasTruncated;
        const nextOffset = endIdx + 1;

        let hint: string | undefined;
        if (isPartialView) {
          hint = `PARTIAL view — file has ${totalLines} lines, showing 1..${endIdx}. Call read again with offset=${nextOffset} to continue.`;
        } else if (wasTruncated) {
          hint = `Output truncated. Use offset=${nextOffset} to continue reading.`;
        }

        const fileResult: ToolResult<ReadResult> = {
          success: true,
          data: {
            type: 'file',
            path: filePath,
            content: truncated,
            totalLines,
            shownLines: selectedLines.length,
            offset,
            ...(isPartialView ? { partial: true } : {}),
          },
          truncated: wasTruncated,
          hint,
        };
        attachAgentsMdReminders(fileResult, filePath, context);
        return fileResult;
      }

      // Ranged read: stream the file line-by-line so memory stays bounded by
      // `limit` rather than the file size.
      const offset = Math.max(1, params.offset ?? 1);
      const limit = params.limit ?? MAX_LINES;

      const { lines: selectedLines, eof } = await readLinesStreaming(filePath, {
        offset,
        limit,
        encoding,
      });

      const startIdx = offset - 1;
      const numberedLines = selectedLines.map((line, i) => `${startIdx + i + 1}: ${line}`);

      const output = numberedLines.join('\n');
      const { content: truncated, truncated: wasTruncated } = truncateOutput(output);

      // Compute the next 1-indexed line that was not yet shown. If the stream
      // reached EOF and we already got all the lines, there is no next page.
      const nextOffset = startIdx + selectedLines.length + 1;

      let hint: string | undefined;
      if (wasTruncated) {
        hint = `Output truncated. Use offset=${nextOffset} to continue reading.`;
      } else if (!eof) {
        hint = `Continue reading with offset=${nextOffset}.`;
      }

      const fileResult: ToolResult<ReadResult> = {
        success: true,
        data: {
          type: 'file',
          path: filePath,
          content: truncated,
          // Streamed reads do not know the file's total line count without a
          // second pass; expose null and let callers rely on the hint.
          totalLines: null,
          shownLines: selectedLines.length,
          offset,
        },
        truncated: wasTruncated,
        hint,
      };
      attachAgentsMdReminders(fileResult, filePath, context);
      return fileResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      if (message.includes('EACCES')) {
        return {
          success: false,
          error: `Permission denied: ${filePath}`,
        };
      }

      return {
        success: false,
        error: message,
      };
    }
  },
});
