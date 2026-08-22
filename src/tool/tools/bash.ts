/**
 * Bash Tool - Execute shell commands
 */

import { z } from 'zod';
import { spawn } from 'child_process';
import { nanoid } from 'nanoid';
import { StringDecoder } from 'node:string_decoder';
import * as path from 'path';
import { defineTool, truncateOutput, persistLargeOutput, type ToolResult } from '../index.js';
import { normalizeUrls } from '../../utils/url.js';
import { quoteFilePath } from '../../utils/file-mention.js';
import { auditCommand } from '../../permission/next.js';
import { getPlanModeManager } from '../../plan/index.js';
import { BashOutputChunk } from '../../bus/index.js';
import { detectShell, shellSpawnArgs, type ShellInfo } from './shell/id.js';
import { detectShellEnv, formatShellEnvSummary } from './shell/env.js';
import {
  BashDetachAvailable,
  BashDetachedExited,
  DETACH_OUTPUT_LINE_CAP,
  DETACH_PROMPT_MS,
  awaitDetachDecision,
  cancelDetachDecision,
  capOutputLines,
  getDetachedProcesses,
  isBashInteractive,
  registerDetachedProcess,
  waitForDetachedExit,
} from './bash-detach.js';
import {
  appendCommandLog,
  cleanupCommandLog,
  markCommandLogFinished,
  registerCommandLog,
} from './bash-streaming.js';
import { LONG_RUNNING_THRESHOLD_MS, notifyInBackground } from '../../core/notifications.js';

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
  /**
   * The detected shell type used to execute the command (e.g. `bash`,
   * `zsh`, `fish`, `powershell`, `cmd`). Populated from `process.env.SHELL`
   * on POSIX and `process.env.COMSPEC` on Windows. Useful for debugging
   * shell-specific syntax errors and for multi-platform environments.
   */
  shellType?: string;
  /**
   * True when the command was still running at result time because the
   * user picked "Proceed While Running". `exitCode` is `-1` in that case
   * and the output snapshots are capped at `DETACH_OUTPUT_LINE_CAP` lines.
   */
  detached?: boolean;
  /**
   * Correlation id for a detached invocation. Matches the id used in
   * `BashDetachAvailable` / `BashDetachedExited` events.
   */
  detachId?: string;
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

/**
 * Build the bash tool description, substituting the currently-detected
 * shell into the first line so the model sees the shell the OS will
 * actually dispatch to (Cline PR #12331). This is invoked from
 * `toFunctionSchema()` and via the `description` getter below, so the
 * shell is re-detected per-request rather than frozen once at startup.
 */
export function buildBashDescription(shell: ShellInfo = detectShell()): string {
  // Probe version + PATH + available tools per description build so a
  // fresh install of `gh` or `docker` mid-session shows up on the next
  // tool-schema flush (Cline PR #12331; issue #1123). The probe caches
  // internally for a short TTL, so calling this on every description
  // render is still cheap.
  const envSummary = formatShellEnvSummary(detectShellEnv(shell));
  // The explicit `Shell: <name>` line (issue #1181) lets the LLM pick
  // the right syntax family (bash vs zsh vs fish vs powershell vs cmd)
  // when composing commands. It duplicates the `Execute a <type>...`
  // opener on purpose — models that skim the description still see the
  // shell name in a clearly labelled field.
  return `Execute a ${shell.type} command in a shell.

Shell: ${shell.type}

${envSummary}

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

When independent reads, searches, or edits are also needed, emit those tool calls in the same response instead of splitting across turns. Include multiple commands in the same call when they are independent and safe to run concurrently.`;
}

const bashToolBase = defineTool<typeof BashParamsSchema, BashResult>({
  name: 'bash',
  description: buildBashDescription(),

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

    // Pre-flight plan-mode check: in plan mode, bash is only permitted
    // when the command is a read-only investigation command (ls, cat,
    // grep, git status, ...) and `allowReadOnlyBash` is enabled. See
    // `src/plan/index.ts` and `src/tool/tools/bash-command-parser.ts`.
    const planManager = getPlanModeManager();
    if (!planManager.checkToolExecution('bash', params.command)) {
      return {
        success: false,
        error: `Tool 'bash' is blocked in plan mode. Use /mode build to switch to build mode.`,
        data: { stdout: '', stderr: '', exitCode: -1, timedOut: false },
      };
    }

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

    // Re-attach: if a previous invocation on this session detached, wait
    // for it to exit before spawning a new bash so the model does not
    // observe interleaved output from two shells racing on the same tty
    // / cwd. This is a no-op when nothing is pending.
    if (getDetachedProcesses(context.sessionId).length > 0) {
      const done = await waitForDetachedExit(context.sessionId);
      if (!done) {
        return {
          success: false,
          error: 'Timed out waiting for a previously detached bash command to exit',
          data: { stdout: '', stderr: '', exitCode: -1, timedOut: true },
        };
      }
    }

    const timeout = params.timeout ?? DEFAULT_TIMEOUT;

    // Detect shell PER-REQUEST (not once at startup) so profile changes
    // — user installs pwsh, edits $SHELL, ... — are picked up. The
    // detector itself caches the filesystem probe for a short TTL so
    // this call is cheap. `shellInfo.type` is threaded into every
    // `BashResult` below (`shellType`) so callers can see which shell
    // executed the command (helpful for debugging shell-specific
    // syntax across platforms).
    const shellInfo = detectShell();
    const {
      file: shellFile,
      prefixArgs: shellPrefix,
      suffixArgs: shellSuffix = [],
    } = shellSpawnArgs(shellInfo);

    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let killed = false;
      let detached = false;
      const detachId = nanoid();
      const startedAt = Date.now();

      const stdoutDecoder = new StringDecoder('utf8');
      const stderrDecoder = new StringDecoder('utf8');

      // Invoke the detected shell explicitly rather than deferring to
      // Node's `shell: true` (which delegates to `/bin/sh` on POSIX and
      // `%ComSpec%` — usually `cmd.exe` — on Windows). Passing the
      // command as a single argument after the shell's "-c" flag keeps
      // quoting semantics identical to the previous `shell: true` path.
      const proc = spawn(shellFile, [...shellPrefix, params.command, ...shellSuffix], {
        cwd: workdir,
        env: { ...process.env, FORCE_COLOR: '0' },
        windowsHide: true,
        detached: true,
      });

      // Register the command in the streaming log registry BEFORE any
      // 'data' handler fires. The registry survives the process
      // exiting (`markCommandLogFinished` + `COMPLETED_LOG_RETENTION_MS`
      // grace period) so a briefly-disconnected TUI hub can still fetch
      // the log tail on reconnect. The synthetic `logId` is PID-reuse
      // safe (see `bash-streaming.ts`).
      const logId = registerCommandLog({
        pid: proc.pid,
        command: params.command,
        sessionId: context.sessionId,
        toolId: context.toolId,
        startedAt,
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
        // Mark the streaming log as finished immediately on abort so a
        // consumer that queries the registry sees a terminal state
        // even before the process's `close` event lands. The final
        // registry cleanup happens in the `close` / `error` handlers
        // below (which run for aborted commands too).
        markCommandLogFinished(logId);
      };
      context.signal?.addEventListener('abort', abortHandler);

      // Publish a streaming chunk without letting a downstream event-bus
      // subscriber's exception tear down the tool. The bus itself
      // already catches synchronous handler errors and logs them, but
      // if the payload fails schema validation we would otherwise
      // propagate up and kill the running command.
      const publishChunk = (stream: 'stdout' | 'stderr', chunk: string): void => {
        if (chunk.length === 0 || context.toolId === undefined) {
          return;
        }
        try {
          BashOutputChunk.publish({
            toolId: context.toolId,
            logId,
            stream,
            chunk,
            timestamp: Date.now(),
          });
        } catch {
          // Never let telemetry take down a running command.
        }
      };

      proc.stdout.on('data', (data: Buffer) => {
        const decoded = stdoutDecoder.write(data);
        if (decoded.length === 0) {
          return;
        }
        stdout += decoded;
        appendCommandLog(logId, decoded);
        publishChunk('stdout', decoded);
      });

      proc.stderr.on('data', (data: Buffer) => {
        const decoded = stderrDecoder.write(data);
        if (decoded.length === 0) {
          return;
        }
        stderr += decoded;
        appendCommandLog(logId, decoded);
        publishChunk('stderr', decoded);
      });

      // Resolves when the underlying process's `close` event fires. Used
      // both by the normal wait path and by `registerDetachedProcess` so
      // the next bash invocation can `waitForDetachedExit`.
      let notifyExit: (() => void) | undefined;
      const exitPromise = new Promise<void>((res) => {
        notifyExit = res;
      });

      // "Proceed While Running" support: after DETACH_PROMPT_MS, publish
      // a bus event asking the TUI whether to detach. If the user picks
      // 'proceed' before the command finishes on its own, we resolve the
      // outer promise with a partial result and let the process keep
      // running in the background. Never armed in non-interactive
      // contexts (CI, automated tests, ...).
      let detachTimer: ReturnType<typeof setTimeout> | undefined;
      if (isBashInteractive()) {
        detachTimer = setTimeout(() => {
          if (killed || detached) {
            return;
          }
          BashDetachAvailable.publish({
            id: detachId,
            toolName: 'bash',
            command: params.command,
            pid: proc.pid,
            startedAt: Date.now() - DETACH_PROMPT_MS,
            timestamp: Date.now(),
          });
          void awaitDetachDecision(detachId).then((decision) => {
            if (decision !== 'proceed' || killed || detached) {
              return;
            }
            detached = true;
            clearTimeout(timer);
            clearTimeout(sigkillTimer);

            const stdoutSnap = capOutputLines(processCarriageReturns(stdout));
            const stderrSnap = capOutputLines(processCarriageReturns(stderr));

            registerDetachedProcess({
              id: detachId,
              pid: proc.pid,
              command: params.command,
              sessionId: context.sessionId,
              startedAt: Date.now() - DETACH_PROMPT_MS,
              detachedAt: Date.now(),
              stdoutSnapshot: stdoutSnap,
              stderrSnapshot: stderrSnap,
              pending: exitPromise,
            });

            const partial: BashResult = {
              stdout: stdoutSnap,
              stderr: stderrSnap,
              exitCode: -1,
              timedOut: false,
              shellType: shellInfo.type,
              detached: true,
              detachId,
            };

            assertNoCommandEcho(partial, params.command);

            resolve({
              success: true,
              data: partial,
              hint: `Command detached and continues running in the background (id: ${detachId}). Output frozen at ${DETACH_OUTPUT_LINE_CAP} lines. The next bash call will wait for it to finish.`,
            });
          });
        }, DETACH_PROMPT_MS);
      }

      proc.on('close', async (code) => {
        clearTimeout(timer);
        clearTimeout(sigkillTimer);
        clearTimeout(detachTimer);
        context.signal?.removeEventListener('abort', abortHandler);
        killed = true;

        // Flush any remaining bytes in the decoders. Any trailing bytes
        // that were still buffered mid-codepoint are now emitted as a
        // final chunk to any streaming subscriber.
        const stdoutTail = stdoutDecoder.end();
        const stderrTail = stderrDecoder.end();
        if (stdoutTail.length > 0) {
          stdout += stdoutTail;
          appendCommandLog(logId, stdoutTail);
          publishChunk('stdout', stdoutTail);
        }
        if (stderrTail.length > 0) {
          stderr += stderrTail;
          appendCommandLog(logId, stderrTail);
          publishChunk('stderr', stderrTail);
        }

        // Mark the streaming log as finished so it enters the retention
        // window and is eventually reaped by `cleanupCompletedLogs`.
        // Detached commands intentionally keep their log around too so
        // a "Proceed" user can still observe the eventual exit tail
        // via `getCommandLog` even if the tool call itself returned a
        // partial result several minutes earlier.
        markCommandLogFinished(logId);

        // Process carriage returns for consistent output formatting
        stdout = processCarriageReturns(stdout);
        stderr = processCarriageReturns(stderr);

        const elapsed = Date.now() - startedAt;
        const exitCodeForNotify = code ?? -1;
        const notifyTitle = `Alexi: ${params.description ?? params.command}`;
        const notifyBody = `Command finished in ${Math.round(elapsed / 1000)}s (exit ${exitCodeForNotify})`;

        // Fast-path: the command already detached. The outer promise has
        // been resolved with a partial result; emit the exit event so
        // observers can render "npm run dev finished" and drop the
        // registry entry via `pending.finally`.
        if (detached) {
          notifyExit?.();
          BashDetachedExited.publish({
            id: detachId,
            toolName: 'bash',
            command: params.command,
            pid: proc.pid,
            exitCode: code,
            timestamp: Date.now(),
          });
          // A detached command's final exit is, by definition, long-running
          // (the user picked "Proceed" only after DETACH_PROMPT_MS). Fire a
          // completion notification unconditionally for these — the same
          // opt-in `notifications` config gate applies inside
          // `notifyInBackground` so users who declined never see anything.
          notifyInBackground(notifyTitle, notifyBody);
          return;
        }

        // Long-running foreground command: notify on completion so the
        // user knows their `npm test` / `docker build` finished while
        // they were doing something else. The threshold matches the
        // exported constant so tests can validate the boundary.
        if (elapsed >= LONG_RUNNING_THRESHOLD_MS) {
          notifyInBackground(notifyTitle, notifyBody);
        }

        // Command finished BEFORE the user answered the detach prompt.
        // Cancel the pending decision (falls back to 'wait') so a late
        // "Proceed" click does not try to register an already-dead
        // process.
        cancelDetachDecision(detachId);

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
          shellType: shellInfo.type,
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
            fileParts.push(`stdout: ${quoteFilePath(stdoutFile)}`);
          }
          if (stderrFile) {
            fileParts.push(`stderr: ${quoteFilePath(stderrFile)}`);
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

        notifyExit?.();
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        clearTimeout(sigkillTimer);
        clearTimeout(detachTimer);
        cancelDetachDecision(detachId);
        context.signal?.removeEventListener('abort', abortHandler);
        killed = true;
        // Spawn errors mean no output was captured and the process is
        // definitively gone. Drop the streaming log entry immediately
        // instead of retaining it — nothing useful to replay.
        cleanupCommandLog(logId);
        notifyExit?.();

        if (detached) {
          // Outer promise already resolved with the partial snapshot;
          // just report the exit via the event bus.
          BashDetachedExited.publish({
            id: detachId,
            toolName: 'bash',
            command: params.command,
            pid: proc.pid,
            exitCode: null,
            timestamp: Date.now(),
          });
          return;
        }

        const errorResult: BashResult = {
          stdout,
          stderr,
          exitCode: -1,
          timedOut: false,
          shellType: shellInfo.type,
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

/**
 * Public bash tool. Wraps `bashToolBase` with a getter-backed
 * `description` and a `toFunctionSchema()` override so both the string
 * surfaced to human callers (e.g. the parallel-call-hint regression
 * test) and the schema sent to the LLM are regenerated per-access and
 * reflect the currently-detected shell.
 */
export const bashTool: typeof bashToolBase = Object.defineProperties(
  Object.create(bashToolBase) as typeof bashToolBase,
  {
    description: {
      enumerable: true,
      configurable: true,
      get: () => buildBashDescription(),
    },
    toFunctionSchema: {
      enumerable: true,
      configurable: true,
      value: function toFunctionSchema() {
        const base = bashToolBase.toFunctionSchema();
        return { ...base, description: buildBashDescription() };
      },
    },
  }
);
