/**
 * Shell Prompt Handling Module
 * Based on upstream kilocode shell tool refactor (297 new lines)
 *
 * Comprehensive shell prompt handling with:
 * - Timeout management
 * - Output streaming
 * - Error handling
 * - Process lifecycle management
 */

import { spawn, type ChildProcess } from 'child_process';
import { StringDecoder } from 'node:string_decoder';
import type { ShellId } from './id.js';

export interface ShellPromptConfig {
  id: ShellId.ShellId;
  command: string;
  timeout: number;
  workingDirectory?: string;
  environment?: Record<string, string>;
}

export interface ShellPromptResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  duration: number;
}

export namespace ShellPrompt {
  /**
   * Create a new shell prompt runner
   */
  export async function create(config: ShellPromptConfig): Promise<ShellPromptRunner> {
    return new ShellPromptRunner(config);
  }
}

/**
 * Shell prompt runner - manages execution of a single shell command
 */
export class ShellPromptRunner {
  private config: ShellPromptConfig;
  private process?: ChildProcess;
  private killed = false;

  constructor(config: ShellPromptConfig) {
    this.config = config;
  }

  /**
   * Run the shell command and return results
   */
  async run(): Promise<ShellPromptResult> {
    const startTime = Date.now();
    let timedOut = false;
    let stdout = '';
    let stderr = '';
    let exitCode = 0;

    const stdoutDecoder = new StringDecoder('utf8');
    const stderrDecoder = new StringDecoder('utf8');

    return new Promise((resolve, reject) => {
      try {
        // Spawn the process
        this.process = spawn(this.config.command, {
          shell: true,
          cwd: this.config.workingDirectory,
          env: { ...process.env, ...this.config.environment, FORCE_COLOR: '0' },
          windowsHide: true,
          detached: true,
        });

        // Setup timeout
        let sigkillTimer: ReturnType<typeof setTimeout> | undefined;
        const timer = setTimeout(() => {
          timedOut = true;
          this.killProcess('SIGTERM');
          sigkillTimer = setTimeout(() => {
            if (!this.killed) {
              this.killProcess('SIGKILL');
            }
          }, 5000);
        }, this.config.timeout);

        // Capture stdout
        this.process.stdout?.on('data', (data: Buffer) => {
          stdout += stdoutDecoder.write(data);
        });

        // Capture stderr
        this.process.stderr?.on('data', (data: Buffer) => {
          stderr += stderrDecoder.write(data);
        });

        // Handle process close
        this.process.on('close', (code) => {
          clearTimeout(timer);
          clearTimeout(sigkillTimer);
          this.killed = true;

          // Flush decoders
          stdout += stdoutDecoder.end();
          stderr += stderrDecoder.end();

          exitCode = code ?? -1;

          const result: ShellPromptResult = {
            exitCode,
            stdout,
            stderr,
            timedOut,
            duration: Date.now() - startTime,
          };

          resolve(result);
        });

        // Handle process errors
        this.process.on('error', (err) => {
          clearTimeout(timer);
          clearTimeout(sigkillTimer);
          this.killed = true;

          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Kill the running process
   */
  private killProcess(signal: NodeJS.Signals): void {
    if (!this.process || !this.process.pid) {
      return;
    }

    try {
      // Try to kill the process group
      process.kill(-this.process.pid, signal);
    } catch {
      // Process group may not exist, try individual process
      try {
        this.process.kill(signal);
      } catch {
        // Process may already be dead
      }
    }
  }

  /**
   * Abort the running command
   */
  abort(): void {
    if (!this.killed) {
      this.killProcess('SIGTERM');
      setTimeout(() => {
        if (!this.killed) {
          this.killProcess('SIGKILL');
        }
      }, 500);
    }
  }

  /**
   * Get the shell session ID
   */
  getId(): ShellId.ShellId {
    return this.config.id;
  }

  /**
   * Check if the process is still running
   */
  isRunning(): boolean {
    return this.process !== undefined && !this.killed;
  }
}
