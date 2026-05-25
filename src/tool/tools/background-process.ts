/**
 * Background Process Tool - Manage long-running background processes
 */

import { z } from 'zod';
import { spawn, type ChildProcess } from 'child_process';
import { defineTool, type ToolResult } from '../index.js';
import { BackgroundPorts } from './background-process/ports.js';

const BackgroundProcessParamsSchema = z.object({
  command: z.string().describe('The command to run as a background process'),
  name: z.string().optional().describe('Optional name for the process'),
  workingDirectory: z.string().optional().describe('Working directory for the process'),
  env: z.record(z.string(), z.string()).optional().describe('Environment variables'),
});

export interface BackgroundProcess {
  id: string;
  name: string;
  command: string;
  pid: number;
  startedAt: Date;
  status: 'running' | 'stopped' | 'failed';
  ports: number[];
}

interface BackgroundProcessResult {
  success: boolean;
  processId?: string;
  pid?: number;
  message: string;
  ports?: number[];
}

const runningProcesses = new Map<string, BackgroundProcess>();

function generateId(): string {
  return `bg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function detectPorts(child: ChildProcess): Promise<number[]> {
  if (!child.pid) {
    return [];
  }

  // Wait a bit for the process to start and bind to ports
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return BackgroundPorts.detectForPid(child.pid);
}

export const backgroundProcessTool = defineTool<
  typeof BackgroundProcessParamsSchema,
  BackgroundProcessResult
>({
  name: 'background_process',
  description: `Start and manage long-running background processes like dev servers.

Use this for commands that need to run continuously (e.g., npm run dev, docker-compose up).
The process will continue running after the tool returns.

Examples:
- Start a dev server: npm run dev
- Run docker compose: docker-compose up
- Start a database: mongod --dbpath ./data

The tool will automatically detect ports the process is listening on.`,

  parameters: BackgroundProcessParamsSchema,

  permission: {
    action: 'execute',
    getResource: (params) => params.command,
  },

  async execute(params, context): Promise<ToolResult<BackgroundProcessResult>> {
    const { command, name, workingDirectory, env } = params;
    const processId = generateId();
    const processName = name || command.split(' ')[0];

    const workdir = workingDirectory || context.workdir;

    try {
      // Start process in background
      const child = spawn(command, {
        shell: true,
        cwd: workdir,
        env: { ...process.env, ...env },
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      if (!child.pid) {
        return {
          success: false,
          error: 'Failed to start process - no PID assigned',
          data: {
            success: false,
            message: 'Failed to start process',
          },
        };
      }

      const bgProcess: BackgroundProcess = {
        id: processId,
        name: processName,
        command,
        pid: child.pid,
        startedAt: new Date(),
        status: 'running',
        ports: [],
      };

      runningProcesses.set(processId, bgProcess);

      // Unref the child process so it doesn't keep the parent alive
      child.unref();

      // Detect ports asynchronously
      detectPorts(child)
        .then((ports) => {
          bgProcess.ports = ports;
        })
        .catch(() => {
          // Ignore port detection errors
        });

      // Handle process exit
      child.on('exit', (code) => {
        bgProcess.status = code === 0 ? 'stopped' : 'failed';
      });

      const result: BackgroundProcessResult = {
        success: true,
        processId,
        pid: child.pid,
        message: `Started background process: ${processName}`,
      };

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: message,
        data: {
          success: false,
          message: `Failed to start background process: ${message}`,
        },
      };
    }
  },
});

export function listBackgroundProcesses(): BackgroundProcess[] {
  return Array.from(runningProcesses.values());
}

export function stopBackgroundProcess(id: string): boolean {
  const proc = runningProcesses.get(id);
  if (!proc) {
    return false;
  }

  try {
    process.kill(proc.pid, 'SIGTERM');
    proc.status = 'stopped';
    runningProcesses.delete(id);
    return true;
  } catch {
    return false;
  }
}
