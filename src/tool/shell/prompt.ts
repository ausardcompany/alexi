/**
 * Shell Prompt Handling
 * Execute shell commands with output capture and error handling
 * Based on kilocode/opencode shell prompt patterns
 */

import { spawn } from 'child_process';
import type { ShellId } from './id.js';

export interface ShellPromptConfig {
  id: ShellId.ShellId;
  command: string;
  workingDir?: string;
  timeout?: number;
  env?: Record<string, string>;
}

export interface ShellResult {
  id: ShellId.ShellId;
  exitCode: number;
  stdout: string;
  stderr: string;
  duration: number;
}

export class ShellError extends Error {
  readonly _tag = 'ShellError';
}

export class ShellSpawnError extends ShellError {
  readonly _tag = 'ShellSpawnError';
}

export class ShellTimeoutError extends ShellError {
  readonly _tag = 'ShellTimeoutError';
}

export class ShellPrompt {
  private readonly config: ShellPromptConfig;

  constructor(config: ShellPromptConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  async execute(): Promise<ShellResult> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const proc = spawn('sh', ['-c', this.config.command], {
        cwd: this.config.workingDir || process.cwd(),
        env: { ...process.env, ...this.config.env },
        timeout: this.config.timeout,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on('error', (error: Error) => {
        reject(new ShellSpawnError(error.message));
      });

      proc.on('close', (code: number | null) => {
        const duration = Date.now() - startTime;
        resolve({
          id: this.config.id,
          exitCode: code ?? -1,
          stdout,
          stderr,
          duration,
        });
      });

      // Handle timeout
      if (this.config.timeout) {
        setTimeout(() => {
          proc.kill('SIGTERM');
          reject(new ShellTimeoutError(`Command timed out after ${this.config.timeout}ms`));
        }, this.config.timeout);
      }
    });
  }
}
