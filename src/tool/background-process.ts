/**
 * Background Process Tool
 * Manage long-running processes like dev servers
 * Based on kilocode/opencode background process management
 */

import { z } from 'zod';
import { defineTool } from './index.js';
import type { ToolContext, ToolResult } from './index.js';
import { spawn, type ChildProcess } from 'child_process';
import { nanoid } from 'nanoid';

export interface BackgroundProcess {
  id: string;
  command: string;
  pid: number;
  startedAt: Date;
  status: 'running' | 'stopped' | 'failed';
  port?: number;
  process?: ChildProcess;
  output: string[];
}

class BackgroundProcessRegistry {
  private processes: Map<string, BackgroundProcess> = new Map();
  private maxOutputLines = 1000;

  start(
    command: string,
    options: { workingDir?: string; env?: Record<string, string>; port?: number }
  ): BackgroundProcess {
    const id = `bg_${nanoid(8)}`;
    const [cmd, ...args] = command.split(' ');

    const proc = spawn(cmd, args, {
      cwd: options.workingDir || process.cwd(),
      env: { ...process.env, ...options.env },
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const bgProcess: BackgroundProcess = {
      id,
      command,
      pid: proc.pid!,
      startedAt: new Date(),
      status: 'running',
      port: options.port,
      process: proc,
      output: [],
    };

    // Capture output
    proc.stdout?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n');
      bgProcess.output.push(...lines);
      // Keep only last N lines
      if (bgProcess.output.length > this.maxOutputLines) {
        bgProcess.output = bgProcess.output.slice(-this.maxOutputLines);
      }
    });

    proc.stderr?.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n');
      bgProcess.output.push(...lines);
      if (bgProcess.output.length > this.maxOutputLines) {
        bgProcess.output = bgProcess.output.slice(-this.maxOutputLines);
      }
    });

    proc.on('exit', (code) => {
      bgProcess.status = code === 0 ? 'stopped' : 'failed';
    });

    proc.on('error', () => {
      bgProcess.status = 'failed';
    });

    this.processes.set(id, bgProcess);
    return bgProcess;
  }

  stop(id: string): boolean {
    const proc = this.processes.get(id);
    if (!proc || !proc.process) {
      return false;
    }

    try {
      // Kill the process group to ensure child processes are also killed
      if (proc.process.pid) {
        process.kill(-proc.process.pid, 'SIGTERM');
      }
      proc.status = 'stopped';
      return true;
    } catch {
      return false;
    }
  }

  list(): BackgroundProcess[] {
    return Array.from(this.processes.values()).map((p) => ({
      ...p,
      process: undefined, // Don't expose ChildProcess in the list
    }));
  }

  getOutput(id: string, lines?: number): string {
    const proc = this.processes.get(id);
    if (!proc) {
      return '';
    }

    const outputLines = proc.output;
    const requestedLines = lines ?? outputLines.length;
    return outputLines.slice(-requestedLines).join('\n');
  }

  cleanup(): void {
    for (const [_id, proc] of this.processes) {
      if (proc.status === 'running' && proc.process) {
        try {
          if (proc.process.pid) {
            process.kill(-proc.process.pid, 'SIGTERM');
          }
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
    this.processes.clear();
  }
}

// Global registry
const registry = new BackgroundProcessRegistry();

// Cleanup on process exit
process.on('exit', () => {
  registry.cleanup();
});

const BackgroundProcessParamsSchema = z.object({
  action: z
    .enum(['start', 'stop', 'list', 'output'])
    .describe('The action to perform on background processes'),
  command: z.string().optional().describe('Command to run (for start action)'),
  processId: z.string().optional().describe('Process ID (for stop/output actions)'),
  workingDir: z.string().optional().describe('Working directory for the process'),
  port: z.number().optional().describe('Expected port the process will listen on'),
  lines: z.number().optional().describe('Number of output lines to retrieve (for output action)'),
});

type BackgroundProcessParams = z.infer<typeof BackgroundProcessParamsSchema>;

export const BackgroundProcessTool = defineTool<
  typeof BackgroundProcessParamsSchema,
  BackgroundProcess | BackgroundProcess[] | string | { stopped: string }
>({
  name: 'background_process',
  description: `Start, stop, and manage background processes like dev servers.

Use this tool when:
- Starting development servers (npm run dev, etc.)
- Running long-lived processes that shouldn't block the conversation
- Managing multiple concurrent processes

The tool returns process IDs that can be used to check status or stop processes.`,
  parameters: BackgroundProcessParamsSchema,

  async execute(
    params: BackgroundProcessParams,
    _context: ToolContext
  ): Promise<ToolResult<BackgroundProcess | BackgroundProcess[] | string | { stopped: string }>> {
    try {
      switch (params.action) {
        case 'list': {
          const processes = registry.list();
          return {
            success: true,
            data: processes,
          };
        }

        case 'start': {
          if (!params.command) {
            return {
              success: false,
              error: 'Command required for start action',
            };
          }

          const process = registry.start(params.command, {
            workingDir: params.workingDir,
            port: params.port,
          });

          return {
            success: true,
            data: process,
          };
        }

        case 'stop': {
          if (!params.processId) {
            return {
              success: false,
              error: 'Process ID required for stop action',
            };
          }

          const stopped = registry.stop(params.processId);
          if (!stopped) {
            return {
              success: false,
              error: `Process ${params.processId} not found or already stopped`,
            };
          }

          return {
            success: true,
            data: { stopped: params.processId },
          };
        }

        case 'output': {
          if (!params.processId) {
            return {
              success: false,
              error: 'Process ID required for output action',
            };
          }

          const output = registry.getOutput(params.processId, params.lines);
          return {
            success: true,
            data: output,
          };
        }

        default:
          return {
            success: false,
            error: `Unknown action: ${params.action}`,
          };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: `Background process operation failed: ${message}`,
      };
    }
  },
});
