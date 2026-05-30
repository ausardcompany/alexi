/**
 * Read Tool - Read files or directories
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import * as path from 'path';
import { defineTool, truncateOutput, MAX_LINES, type ToolResult } from '../index.js';
import {
  detectEncoding,
  decodeWithEncoding,
  isBinaryFile,
  type EncodingInfo,
} from '../encoded-io.js';
import { getReferenceService } from '../../reference/reference.js';
import { instructionsForPath } from '../../agent/system.js';

const ReadParamsSchema = z.object({
  filePath: z.string().describe('Absolute path to the file or directory to read'),
  offset: z.number().optional().describe('Line number to start from (1-indexed)'),
  limit: z.number().optional().describe('Maximum number of lines to read (default: 2000)'),
});

interface ReadFileResult {
  type: 'file';
  path: string;
  content: string;
  totalLines: number;
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

/**
 * If `context.agentsMdSeen` is provided, walk parent directories of `absPath`
 * looking for AGENTS.md files and attach any new finds to
 * `result.metadata.systemReminders` as workdir-relative `source` entries.
 *
 * No-op when `context.agentsMdSeen` is absent (e.g. test harnesses, one-shot
 * CLI commands) — the read tool stays a pure read in that case.
 */
function attachAgentsMdReminders(
  result: ToolResult<ReadResult>,
  absPath: string,
  context: { workdir: string; agentsMdSeen?: Set<string> }
): void {
  if (!context.agentsMdSeen) {
    return;
  }

  const reminders = instructionsForPath(absPath, context.workdir, context.agentsMdSeen);
  if (reminders.length === 0) {
    return;
  }

  result.metadata = {
    ...(result.metadata ?? {}),
    systemReminders: reminders.map((r) => ({
      source: path.relative(context.workdir, r.path),
      content: r.content,
    })),
  };
}

export function getFileEncoding(filePath: string): EncodingInfo | undefined {
  return fileEncodings.get(filePath);
}

/**
 * Read file with streaming for better UTF-8 handling and memory efficiency
 */
async function readFileStreaming(
  filePath: string,
  options?: { offset?: number; limit?: number; maxBytes?: number }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    const maxBytes = options?.maxBytes;

    const stream = createReadStream(filePath, {
      encoding: undefined, // Read as Buffer for proper UTF-8 handling
      start: options?.offset ? options.offset - 1 : undefined,
      end: options?.limit && options?.offset ? options.offset + options.limit - 1 : undefined,
    });

    stream.on('data', (chunk: Buffer) => {
      if (maxBytes && totalBytes + chunk.length > maxBytes) {
        // Only take what we need to reach maxBytes
        const remaining = maxBytes - totalBytes;
        if (remaining > 0) {
          chunks.push(chunk.subarray(0, remaining));
        }
        stream.destroy(); // Stop reading
      } else {
        chunks.push(chunk);
        totalBytes += chunk.length;
      }
    });

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on('close', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on('error', reject);
  });
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

      // Read file
      // Use streaming for better UTF-8 handling
      const buffer = await readFileStreaming(filePath);

      // Check for binary first
      if (isBinaryFile(buffer)) {
        return {
          success: false,
          error: `Cannot read binary file: ${filePath}`,
        };
      }

      // Detect and decode with proper encoding
      const encoding = detectEncoding(buffer);
      const content = decodeWithEncoding(buffer, encoding);

      // Cache encoding for write operations
      fileEncodings.set(filePath, encoding);

      const lines = content.split('\n');
      const totalLines = lines.length;

      const offset = Math.max(1, params.offset ?? 1);
      const limit = params.limit ?? MAX_LINES;

      // Extract requested lines
      const startIdx = offset - 1;
      const endIdx = Math.min(startIdx + limit, lines.length);
      const selectedLines = lines.slice(startIdx, endIdx);

      // Add line numbers
      const numberedLines = selectedLines.map((line, i) => `${startIdx + i + 1}: ${line}`);

      const output = numberedLines.join('\n');
      const { content: truncated, truncated: wasTruncated } = truncateOutput(output);

      // Implicit whole-file read: caller did not specify offset or limit.
      const isImplicitWholeFileRead = params.offset === undefined && params.limit === undefined;
      const isPartialView = wasTruncated && isImplicitWholeFileRead;

      // Compute the next offset for resumed reads. When the rendered output is
      // truncated by line budget we may have shown fewer than `selectedLines.length`
      // lines, but for both branches `endIdx + 1` is the next 1-indexed line that
      // was not yet shown (capped by `Math.min` against `lines.length` above).
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
