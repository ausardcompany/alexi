/**
 * Background Process Port Detection
 * Detects which ports a process is listening on
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export namespace BackgroundPorts {
  export async function detectForPid(pid: number): Promise<number[]> {
    const platform = process.platform;

    try {
      if (platform === 'darwin' || platform === 'linux') {
        return await detectUnixPorts(pid);
      } else if (platform === 'win32') {
        return await detectWindowsPorts(pid);
      }
    } catch {
      return [];
    }

    return [];
  }

  async function detectUnixPorts(pid: number): Promise<number[]> {
    try {
      const { stdout } = await execAsync(`lsof -Pan -p ${pid} -i`);
      const ports: number[] = [];
      const lines = stdout.split('\n');

      for (const line of lines) {
        const match = line.match(/:(\d+)\s+\(LISTEN\)/);
        if (match) {
          ports.push(parseInt(match[1], 10));
        }
      }

      return [...new Set(ports)];
    } catch {
      return [];
    }
  }

  async function detectWindowsPorts(pid: number): Promise<number[]> {
    try {
      const { stdout } = await execAsync(`netstat -ano | findstr ${pid}`);
      const ports: number[] = [];
      const lines = stdout.split('\n');

      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*LISTENING/);
        if (match) {
          ports.push(parseInt(match[1], 10));
        }
      }

      return [...new Set(ports)];
    } catch {
      return [];
    }
  }
}
