/**
 * Background Process Tool - Manage long-running background processes
 * Based on upstream kilocode background process management (175 new lines)
 */

import { z } from 'zod';
import { spawn, type ChildProcess } from 'child_process';
import { nanoid } from 'nanoid';
import { defineTool, type ToolResult } from '../index.js';

export interface BackgroundProcess {
  id: string;
  command: string;
  pid: number;
  status: 'running' | 'stopped' | 'failed';
  startedAt: Date;
  ports: number[];
  logs: string[];
}

const BackgroundProcessParamsSchema = z.object({
  action: z.enum(['start', 'stop', 'list', 'logs']).describe('Action to perform'),
  command: z.string().optional().describe('Command to run (for start action)'),
  id: z.string().optional().describe('Process ID (for stop/logs actions)'),
  ports: z.array(z.number()).optional().describe('Ports to monitor (for start action)'),
  tail: z.number().optional().describe('Number of log lines to return (for logs action)'),
});

// Global process registry
const processRegistry = new Map<string, BackgroundProcess & { proc: ChildProcess }>();

export const backgroundProcessTool = defineTool<typeof BackgroundProcessParamsSchema, any>({
  name: 'background_process',
  description: `Start, stop, and manage long-running background processes.

Use this for:
- Starting development servers (npm run dev, python -m http.server, etc.)
- Running watch processes (tsc --watch, nodemon, etc.)
- Managing database connections
- Any process that should persist across commands

Actions:
- start: Start a new background process
- stop: Stop a running background process
- list: List all background processes
- logs: Get logs from a background process

Examples:
- Start a dev server: { action: "start", command: "npm run dev", ports: [3000] }
- Stop a process: { action: "stop", id: "bg_abc123" }
- List all processes: { action: "list" }
- Get logs: { action: "logs", id: "bg_abc123", tail: 50 }`,

  parameters: BackgroundProcessParamsSchema,

  permission: {
    action: 'execute',
    getResource: (params) => {
      if (params.action === 'start' && params.command) {
        return params.command;
      }
      return `background_process:${params.action}`;
    },
  },

  async execute(params, context): Promise<ToolResult<any>> {
    try {
      switch (params.action) {
        case 'start':
          return await startProcess(params, context);
        case 'stop':
          return await stopProcess(params);
        case 'list':
          return listProcesses();
        case 'logs':
          return getProcessLogs(params);
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
        error: message,
      };
    }
  },
});

async function startProcess(
  params: z.infer<typeof BackgroundProcessParamsSchema>,
  context: any
): Promise<ToolResult<BackgroundProcess>> {
  if (!params.command) {
    return {
      success: false,
      error: 'Command is required for start action',
    };
  }

  const id = `bg_${nanoid(8)}`;
  const logs: string[] = [];

  const proc = spawn(params.command, {
    shell: true,
    cwd: context.workdir,
    env: { ...process.env, FORCE_COLOR: '0' },
    detached: true,
  });

  const process: BackgroundProcess = {
    id,
    command: params.command,
    pid: proc.pid ?? -1,
    status: 'running',
    startedAt: new Date(),
    ports: params.ports ?? [],
    logs,
  };

  // Capture stdout
  proc.stdout?.on('data', (data: Buffer) => {
    const line = data.toString().trim();
    if (line) {
      logs.push(`[stdout] ${line}`);
      if (logs.length > 1000) {
        logs.shift(); // Keep only last 1000 lines
      }
    }
  });

  // Capture stderr
  proc.stderr?.on('data', (data: Buffer) => {
    const line = data.toString().trim();
    if (line) {
      logs.push(`[stderr] ${line}`);
      if (logs.length > 1000) {
        logs.shift();
      }
    }
  });

  // Handle process exit
  proc.on('exit', (code) => {
    process.status = code === 0 ? 'stopped' : 'failed';
    logs.push(`[system] Process exited with code ${code}`);
  });

  proc.on('error', (err) => {
    process.status = 'failed';
    logs.push(`[system] Process error: ${err.message}`);
  });

  // Store in registry
  processRegistry.set(id, { ...process, proc });

  return {
    success: true,
    data: process,
  };
}

async function stopProcess(
  params: z.infer<typeof BackgroundProcessParamsSchema>
): Promise<ToolResult<{ id: string; stopped: boolean }>> {
  if (!params.id) {
    return {
      success: false,
      error: 'Process ID is required for stop action',
    };
  }

  const entry = processRegistry.get(params.id);
  if (!entry) {
    return {
      success: false,
      error: `Process not found: ${params.id}`,
    };
  }

  try {
    // Kill the process group
    if (entry.proc.pid) {
      process.kill(-entry.proc.pid, 'SIGTERM');
      // Give it 5 seconds, then SIGKILL
      setTimeout(() => {
        if (entry.status === 'running') {
          try {
            process.kill(-entry.proc.pid!, 'SIGKILL');
          } catch {
            // Already dead
          }
        }
      }, 5000);
    }

    entry.status = 'stopped';
    processRegistry.delete(params.id);

    return {
      success: true,
      data: { id: params.id, stopped: true },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Failed to stop process: ${message}`,
    };
  }
}

function listProcesses(): ToolResult<BackgroundProcess[]> {
  const processes = Array.from(processRegistry.values()).map(({ proc, ...p }) => p);
  return {
    success: true,
    data: processes,
  };
}

function getProcessLogs(
  params: z.infer<typeof BackgroundProcessParamsSchema>
): ToolResult<{ id: string; logs: string[] }> {
  if (!params.id) {
    return {
      success: false,
      error: 'Process ID is required for logs action',
    };
  }

  const entry = processRegistry.get(params.id);
  if (!entry) {
    return {
      success: false,
      error: `Process not found: ${params.id}`,
    };
  }

  const tail = params.tail ?? 100;
  const logs = entry.logs.slice(-tail);

  return {
    success: true,
    data: { id: params.id, logs },
  };
}
