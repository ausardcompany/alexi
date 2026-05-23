/**
 * Shell Tool
 * Execute shell commands in the user's environment
 * Renamed from bash.ts with enhanced prompt handling
 * Based on kilocode/opencode shell tool patterns
 */

import { z } from 'zod';
import { defineTool } from './index.js';
import type { ToolContext, ToolResult } from './index.js';
import { ShellId } from './shell/id.js';
import { ShellPrompt, ShellError } from './shell/prompt.js';

const ShellParamsSchema = z.object({
  command: z.string().describe('The shell command to execute'),
  workingDir: z.string().optional().describe('Working directory for command execution'),
  timeout: z.number().optional().describe('Timeout in milliseconds (default: 30000)'),
});

type ShellParams = z.infer<typeof ShellParamsSchema>;

export const ShellTool = defineTool<typeof ShellParamsSchema, string>({
  name: 'shell',
  description: `Execute shell commands in the user's environment.

Use this tool to:
- Run system commands
- Execute scripts
- Check file contents with cat, grep, etc.
- Navigate and inspect the filesystem

The command runs in a shell environment with full access to system utilities.`,
  parameters: ShellParamsSchema,
  permission: {
    action: 'execute',
    getResource: (params: ShellParams) => params.command,
  },

  async execute(params: ShellParams, context: ToolContext): Promise<ToolResult<string>> {
    try {
      const id = ShellId.generate();
      const prompt = new ShellPrompt({
        id,
        command: params.command,
        workingDir: params.workingDir || context.workdir,
        timeout: params.timeout,
      });

      const result = await prompt.execute();

      // Combine stdout and stderr for output
      const output = result.stdout + (result.stderr ? `\nSTDERR:\n${result.stderr}` : '');

      if (result.exitCode !== 0) {
        return {
          success: false,
          error: `Command failed with exit code ${result.exitCode}`,
          data: output,
        };
      }

      return {
        success: true,
        data: output,
        metadata: {
          exitCode: result.exitCode,
          duration: result.duration,
        },
      };
    } catch (err) {
      if (err instanceof ShellError) {
        return {
          success: false,
          error: err.message,
        };
      }
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Shell execution failed: ${message}`,
      };
    }
  },
});
