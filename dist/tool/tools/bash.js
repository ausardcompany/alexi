/**
 * Bash Tool - Execute shell commands
 */
import { z } from "zod";
import { spawn } from "child_process";
import * as path from "path";
import { defineTool, truncateOutput } from "../index.js";
const BashParamsSchema = z.object({
    command: z.string().describe("The command to execute"),
    workdir: z
        .string()
        .optional()
        .describe("Working directory for command execution"),
    timeout: z
        .number()
        .optional()
        .describe("Timeout in milliseconds (default: 120000)"),
    description: z.string().optional().describe("Short description of what command does"),
});
const DEFAULT_TIMEOUT = 120000; // 2 minutes
export const bashTool = defineTool({
    name: "bash",
    description: `Execute a bash command in a shell.

Usage:
- Use for terminal operations like git, npm, docker, etc.
- Use workdir parameter instead of 'cd && command' patterns.
- Output is truncated if it exceeds 2000 lines or 50KB.
- Default timeout is 2 minutes.`,
    parameters: BashParamsSchema,
    permission: {
        action: "execute",
        getResource: (params) => params.command,
    },
    async execute(params, context) {
        const workdir = params.workdir
            ? path.isAbsolute(params.workdir)
                ? params.workdir
                : path.join(context.workdir, params.workdir)
            : context.workdir;
        const timeout = params.timeout ?? DEFAULT_TIMEOUT;
        return new Promise((resolve) => {
            let stdout = "";
            let stderr = "";
            let timedOut = false;
            let killed = false;
            const proc = spawn(params.command, {
                shell: true,
                cwd: workdir,
                env: { ...process.env, FORCE_COLOR: "0" },
            });
            // Handle timeout
            const timer = setTimeout(() => {
                timedOut = true;
                proc.kill("SIGTERM");
                setTimeout(() => {
                    if (!killed) {
                        proc.kill("SIGKILL");
                    }
                }, 5000);
            }, timeout);
            // Handle abort signal
            const abortHandler = () => {
                killed = true;
                proc.kill("SIGTERM");
                clearTimeout(timer);
            };
            context.signal?.addEventListener("abort", abortHandler);
            proc.stdout.on("data", (data) => {
                stdout += data.toString();
            });
            proc.stderr.on("data", (data) => {
                stderr += data.toString();
            });
            proc.on("close", (code) => {
                clearTimeout(timer);
                context.signal?.removeEventListener("abort", abortHandler);
                killed = true;
                // Truncate output
                const { content: truncatedStdout, truncated: stdoutTruncated } = truncateOutput(stdout);
                const { content: truncatedStderr, truncated: stderrTruncated } = truncateOutput(stderr);
                const result = {
                    stdout: truncatedStdout,
                    stderr: truncatedStderr,
                    exitCode: code ?? -1,
                    timedOut,
                };
                if (context.signal?.aborted) {
                    resolve({
                        success: false,
                        error: "Operation aborted",
                        data: result,
                    });
                    return;
                }
                resolve({
                    success: code === 0,
                    data: result,
                    truncated: stdoutTruncated || stderrTruncated,
                    hint: stdoutTruncated || stderrTruncated
                        ? "Output truncated. Full output was saved to a file."
                        : undefined,
                    error: code !== 0 ? `Command exited with code ${code}` : undefined,
                });
            });
            proc.on("error", (err) => {
                clearTimeout(timer);
                context.signal?.removeEventListener("abort", abortHandler);
                killed = true;
                resolve({
                    success: false,
                    error: err.message,
                    data: {
                        stdout,
                        stderr,
                        exitCode: -1,
                        timedOut: false,
                    },
                });
            });
        });
    },
});
