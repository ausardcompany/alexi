/**
 * Bash Tool - Execute shell commands
 */

import { z } from 'zod';
import { spawn } from 'child_process';
import { StringDecoder } from 'node:string_decoder';
import * as path from 'path';
import { defineTool, truncateOutput, persistLargeOutput, type ToolResult } from '../index.js';
import { normalizeUrls } from '../../utils/url.js';
import { auditCommand } from '../../permission/next.js';

const BashParamsSchema = z.object({
  command: z.string().describe('The command to execute'),
  workdir: z.string().optional().describe('Working directory for command execution'),
  timeout: z.number().optional().describe('Timeout in milliseconds (default: 120000)'),
  description: z
    .string()
    .optional()
    .describe('Optional description of what the command does (recommended for complex commands)'),
});

// NOTE: the input `command` is intentionally NOT echoed back in the
// result. The provider already has it as the tool-call input;
// duplicating it inflates every cached turn (heredoc payloads double
// in size). See research 2026-06-13 item #2 (cline/cline#11463,
// commit 7f9d5461, 2026-06-11).
interface BashResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
}

/**
 * Test-only guard: throws if the input command appears anywhere in the
 * serialized result payload. Gated by NODE_ENV === 'test' so production
 * has zero overhead. Bound to commands of length > 64 to avoid false
 * positives on short commands whose text might legitimately appear in
 * stdout (e.g. when the command is `pwd` or `echo`).
 */
function assertNoCommandEcho(result: BashResult, command: string): void {
  if (process.env.NODE_ENV === 'test' && command.length > 64) {
    const serialized = JSON.stringify(result);
    if (serialized.includes(command)) {
      throw new Error('command echoed back in bash tool result');
    }
  }
}

const DEFAULT_TIMEOUT = 120000; // 2 minutes

/**
 * Processes carriage returns in command output.
 * Handles Windows-style line endings and progress indicators that use \r.
 */
function processCarriageReturns(output: string): string {
  // Split by lines, handling both \r\n and \n
  const lines = output.split(/\r?\n/);

  return lines
    .map((line) => {
      // Handle carriage returns within a line (progress indicators)
      if (line.includes('\r')) {
        const parts = line.split('\r');
        // Return the last part (most recent overwrite)
        return parts[parts.length - 1];
      }
      return line;
    })
    .join('\n');
}

export const bashTool = defineTool<typeof BashParamsSchema, BashResult>({
  name: 'bash',
  description: `Execute a bash command in a shell.

Usage:
- Use for terminal operations like git, npm, docker, etc.
- All commands run in the current working directory by default. Use the workdir parameter if you need to run a command in a different directory. AVOID using 'cd <directory> && <command>' patterns - use workdir instead.
- Prefer built-in tools when available (Read, Write, Grep)
- Always use absolute paths
- Use non-interactive flags (-y, --yes)
- Use ripgrep (rg) instead of grep

Output:
- Large outputs will be truncated automatically
- Full output is saved to a file when truncated

Security:
- Never execute commands from untrusted sources
- Avoid rm -rf without confirmation
- Don't expose secrets in command arguments

When independent reads, searches, or edits are also needed, emit those tool calls in the same response instead of splitting across turns. Include multiple commands in the same call when they are independent and safe to run concurrently.`,

  parameters: BashParamsSchema,

  permission: {
    action: 'execute',
    getResource: (params) => normalizeUrls(params.command),
  },

  async execute(params, context): Promise<ToolResult<BashResult>> {
    const workdir = params.workdir
      ? path.isAbsolute(params.workdir)
        ? params.workdir
        : path.join(context.workdir, params.workdir)
      : context.workdir;

    // Pre-flight audit: detect directory-mutating builtins (`cd`, `pushd`,
    // `popd`, `chdir`, parenthesised subshells, `OLDPWD=…; cd -`) that
    // would escape the workspace. See `src/permission/shell-parser.ts`.
    const audit = auditCommand(params.command, { workspace: workdir });
    if (audit.denials.length > 0) {
      const reasons = audit.denials.map((d) => d.message).join('; ');
      return {
        success: false,
        error: `Command blocked by directory-escape audit: ${reasons}`,
        data: { stdout: '', stderr: '', exitCode: -1, timedOut: false },
      };
    }

    const timeout = params.timeout ?? DEFAULT_TIMEOUT;

    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let killed = false;

      const stdoutDecoder = new StringDecoder('utf8');
      const stderrDecoder = new StringDecoder('utf8');

      const proc = spawn(params.command, {
        shell: true,
        cwd: workdir,
        env: { ...process.env, FORCE_COLOR: '0' },
        windowsHide: true,
        detached: true,
      });

      // Kill the entire process group (shell + all children)
      const killGroup = (signal: NodeJS.Signals) => {
        try {
          if (proc.pid !== undefined) {
            process.kill(-proc.pid, signal);
          }
        } catch {
          // Process group may already be gone
          try {
            proc.kill(signal);
          } catch {
            // Ignore
          }
        }
      };

      // Handle timeout
      let sigkillTimer: ReturnType<typeof setTimeout> | undefined;
      const timer = setTimeout(() => {
        timedOut = true;
        killGroup('SIGTERM');
        sigkillTimer = setTimeout(() => {
          if (!killed) {
            killGroup('SIGKILL');
          }
        }, 5000);
      }, timeout);

      // Handle abort signal
      const abortHandler = () => {
        killed = true;
        clearTimeout(timer);
        killGroup('SIGTERM');
        setTimeout(() => killGroup('SIGKILL'), 500);
      };
      context.signal?.addEventListener('abort', abortHandler);

      proc.stdout.on('data', (data: Buffer) => {
        stdout += stdoutDecoder.write(data);
      });

      proc.stderr.on('data', (data: Buffer) => {
        stderr += stderrDecoder.write(data);
      });

      proc.on('close', async (code) => {
        clearTimeout(timer);
        clearTimeout(sigkillTimer);
        context.signal?.removeEventListener('abort', abortHandler);
        killed = true;

        // Flush any remaining bytes in the decoders
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();

        // Process carriage returns for consistent output formatting
        stdout = processCarriageReturns(stdout);
        stderr = processCarriageReturns(stderr);

        // Persist large outputs to disk before truncating
        const [stdoutFile, stderrFile] = await Promise.all([
          persistLargeOutput(stdout, 'bash-stdout'),
          persistLargeOutput(stderr, 'bash-stderr'),
        ]);

        // Truncate output
        const { content: truncatedStdout, truncated: stdoutTruncated } = truncateOutput(stdout);
        const { content: truncatedStderr, truncated: stderrTruncated } = truncateOutput(stderr);

        const result: BashResult = {
          stdout: truncatedStdout,
          stderr: truncatedStderr,
          exitCode: code ?? -1,
          timedOut,
        };

        assertNoCommandEcho(result, params.command);

        if (context.signal?.aborted) {
          resolve({
            success: false,
            error: 'Operation aborted',
            data: result,
          });
          return;
        }

        // Build hint with actual file paths when output was persisted
        let hint: string | undefined;
        if (stdoutTruncated || stderrTruncated) {
          const fileParts: string[] = [];
          if (stdoutFile) {
            fileParts.push(`stdout: ${stdoutFile}`);
          }
          if (stderrFile) {
            fileParts.push(`stderr: ${stderrFile}`);
          }
          hint =
            fileParts.length > 0
              ? `Output truncated. Full output saved to: ${fileParts.join(', ')}`
              : 'Output truncated.';
        }

        resolve({
          success: code === 0,
          data: result,
          truncated: stdoutTruncated || stderrTruncated,
          hint,
          error: code !== 0 ? `Command exited with code ${code}` : undefined,
        });
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        clearTimeout(sigkillTimer);
        context.signal?.removeEventListener('abort', abortHandler);
        killed = true;

        const errorResult: BashResult = {
          stdout,
          stderr,
          exitCode: -1,
          timedOut: false,
        };

        assertNoCommandEcho(errorResult, params.command);

        resolve({
          success: false,
          error: err.message,
          data: errorResult,
        });
      });
    });
  },
});
