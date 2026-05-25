/**
 * Shell Prompt Builder Module
 * Builds shell-specific prompt configurations for better command execution
 */

import { ShellId } from './id.js';

export namespace ShellPrompt {
  export interface PromptOptions {
    workingDirectory?: string;
    timeout?: number;
    env?: Record<string, string>;
  }

  export function build(shell: ShellId.ShellInfo, options: PromptOptions = {}): string {
    const { workingDirectory, timeout = 120000 } = options;

    // Build shell-specific prompt configuration
    switch (shell.type) {
      case 'powershell':
        return buildPowerShellPrompt(workingDirectory, timeout);
      case 'cmd':
        return buildCmdPrompt(workingDirectory, timeout);
      default:
        return buildUnixPrompt(shell.type, workingDirectory, timeout);
    }
  }

  function buildUnixPrompt(type: ShellId.ShellType, cwd?: string, timeout?: number): string {
    const cdCmd = cwd ? `cd ${JSON.stringify(cwd)} && ` : '';
    const timeoutSeconds = Math.floor((timeout || 120000) / 1000);
    return `${cdCmd}timeout ${timeoutSeconds}`;
  }

  function buildPowerShellPrompt(cwd?: string, timeout?: number): string {
    const cdCmd = cwd ? `Set-Location ${JSON.stringify(cwd)}; ` : '';
    return `${cdCmd}$ProgressPreference = 'SilentlyContinue'`;
  }

  function buildCmdPrompt(cwd?: string, _timeout?: number): string {
    return cwd ? `cd /d "${cwd}" &&` : '';
  }

  /**
   * Build a complete command with shell-specific configuration
   */
  export function buildCommand(
    shell: ShellId.ShellInfo,
    command: string,
    options: PromptOptions = {}
  ): string {
    const prompt = build(shell, options);
    
    if (!prompt) {
      return command;
    }

    switch (shell.type) {
      case 'powershell':
        return `${prompt}; ${command}`;
      case 'cmd':
        return `${prompt} ${command}`;
      default:
        return `${prompt} ${command}`;
    }
  }

  /**
   * Get shell-specific environment setup
   */
  export function getEnvSetup(shell: ShellId.ShellInfo): Record<string, string> {
    const baseEnv: Record<string, string> = {
      FORCE_COLOR: '0',
    };

    switch (shell.type) {
      case 'powershell':
        return {
          ...baseEnv,
          PSModulePath: process.env.PSModulePath || '',
        };
      case 'bash':
      case 'zsh':
        return {
          ...baseEnv,
          TERM: 'dumb',
        };
      default:
        return baseEnv;
    }
  }

  /**
   * Get timeout command for the shell
   */
  export function getTimeoutCommand(shell: ShellId.ShellInfo, seconds: number): string {
    switch (shell.type) {
      case 'powershell':
        return `Start-Process -Wait -NoNewWindow -Timeout ${seconds}`;
      case 'cmd':
        return `timeout /t ${seconds}`;
      default:
        return `timeout ${seconds}`;
    }
  }

  /**
   * Get kill command for the shell
   */
  export function getKillCommand(shell: ShellId.ShellInfo, pid: number): string {
    switch (shell.type) {
      case 'powershell':
        return `Stop-Process -Id ${pid} -Force`;
      case 'cmd':
        return `taskkill /F /PID ${pid}`;
      default:
        return `kill -9 ${pid}`;
    }
  }

  /**
   * Check if shell supports a feature
   */
  export function supportsFeature(
    shell: ShellId.ShellInfo,
    feature: 'timeout' | 'job-control' | 'pipes' | 'redirection'
  ): boolean {
    switch (feature) {
      case 'timeout':
        return shell.type !== 'cmd';
      case 'job-control':
        return shell.type === 'bash' || shell.type === 'zsh' || shell.type === 'fish';
      case 'pipes':
        return true;
      case 'redirection':
        return true;
      default:
        return false;
    }
  }

  /**
   * Get shell-specific error handling
   */
  export function getErrorHandling(shell: ShellId.ShellInfo): string {
    switch (shell.type) {
      case 'powershell':
        return '$ErrorActionPreference = "Stop"';
      case 'bash':
      case 'zsh':
        return 'set -e';
      case 'fish':
        return 'set -e';
      default:
        return '';
    }
  }

  /**
   * Get shell-specific script extension
   */
  export function getScriptExtension(shell: ShellId.ShellInfo): string {
    switch (shell.type) {
      case 'powershell':
        return '.ps1';
      case 'cmd':
        return '.bat';
      case 'fish':
        return '.fish';
      default:
        return '.sh';
    }
  }

  /**
   * Get shell-specific comment prefix
   */
  export function getCommentPrefix(shell: ShellId.ShellInfo): string {
    switch (shell.type) {
      case 'cmd':
        return 'REM';
      default:
        return '#';
    }
  }

  /**
   * Escape a string for use in shell commands
   */
  export function escapeString(shell: ShellId.ShellInfo, str: string): string {
    switch (shell.type) {
      case 'powershell':
        return `'${str.replace(/'/g, "''")}'`;
      case 'cmd':
        return `"${str.replace(/"/g, '""')}"`;
      default:
        return `'${str.replace(/'/g, "'\\''")}'`;
    }
  }

  /**
   * Build a complete shell script with proper headers
   */
  export function buildScript(
    shell: ShellId.ShellInfo,
    commands: string[],
    options: PromptOptions = {}
  ): string {
    const lines: string[] = [];

    // Add shebang for Unix shells
    if (shell.type !== 'powershell' && shell.type !== 'cmd') {
      lines.push(`#!/bin/${shell.type === 'unknown' ? 'sh' : shell.type}`);
    }

    // Add error handling
    const errorHandling = getErrorHandling(shell);
    if (errorHandling) {
      lines.push(errorHandling);
    }

    // Add working directory change
    if (options.workingDirectory) {
      const cdCmd =
        shell.type === 'powershell'
          ? `Set-Location ${JSON.stringify(options.workingDirectory)}`
          : shell.type === 'cmd'
            ? `cd /d "${options.workingDirectory}"`
            : `cd ${JSON.stringify(options.workingDirectory)}`;
      lines.push(cdCmd);
    }

    // Add environment variables
    if (options.env) {
      for (const [key, value] of Object.entries(options.env)) {
        const envCmd =
          shell.type === 'powershell'
            ? `$env:${key} = ${JSON.stringify(value)}`
            : shell.type === 'cmd'
              ? `set ${key}=${value}`
              : `export ${key}=${JSON.stringify(value)}`;
        lines.push(envCmd);
      }
    }

    // Add commands
    lines.push(...commands);

    return lines.join('\n');
  }
}
