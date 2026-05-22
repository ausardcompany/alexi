/**
 * Shell Prompt Management
 * Cross-platform shell detection and prompt customization
 */

import * as os from 'os';
import * as path from 'path';

export type ShellType = 'bash' | 'zsh' | 'fish' | 'powershell' | 'cmd' | 'unknown';

export interface ShellPromptConfig {
  readonly shell: ShellType;
  readonly cwd: string;
  readonly user: string;
  readonly hostname: string;
}

/**
 * Detect the current shell type
 */
export function detectShell(): ShellType {
  const shell = process.env.SHELL || process.env.ComSpec || '';
  const shellName = path.basename(shell).toLowerCase();

  if (shellName.includes('bash')) return 'bash';
  if (shellName.includes('zsh')) return 'zsh';
  if (shellName.includes('fish')) return 'fish';
  if (shellName.includes('powershell') || shellName.includes('pwsh')) return 'powershell';
  if (shellName.includes('cmd')) return 'cmd';
  return 'unknown';
}

/**
 * Get the shell prompt configuration
 */
export function getShellPromptConfig(): ShellPromptConfig {
  const shell = detectShell();
  return {
    shell,
    cwd: process.cwd(),
    user: os.userInfo().username,
    hostname: os.hostname(),
  };
}

/**
 * Format a shell prompt string
 */
export function formatPrompt(config: ShellPromptConfig): string {
  const { shell, cwd, user, hostname } = config;
  switch (shell) {
    case 'powershell':
      return `PS ${cwd}> `;
    case 'cmd':
      return `${cwd}>`;
    default:
      return `${user}@${hostname}:${cwd}$ `;
  }
}

/**
 * Get the shell executable path
 */
export function getShellExecutable(shell: ShellType): string {
  switch (shell) {
    case 'bash':
      return 'bash';
    case 'zsh':
      return 'zsh';
    case 'fish':
      return 'fish';
    case 'powershell':
      return process.platform === 'win32' ? 'powershell.exe' : 'pwsh';
    case 'cmd':
      return 'cmd.exe';
    default:
      return process.platform === 'win32' ? 'cmd.exe' : 'sh';
  }
}

/**
 * Get shell-specific command arguments
 */
export function getShellArgs(shell: ShellType, command: string): string[] {
  switch (shell) {
    case 'powershell':
      return ['-NoProfile', '-Command', command];
    case 'cmd':
      return ['/c', command];
    default:
      return ['-c', command];
  }
}

/**
 * Get shell-specific environment variables
 */
export function getShellEnv(shell: ShellType): Record<string, string> {
  const baseEnv = { ...process.env };

  // Disable color codes for consistent output
  baseEnv.FORCE_COLOR = '0';
  baseEnv.NO_COLOR = '1';

  switch (shell) {
    case 'powershell':
      // Disable PowerShell progress bars
      baseEnv.PSStyle = 'Off';
      break;
    case 'bash':
    case 'zsh':
      // Disable bash/zsh color prompts
      baseEnv.TERM = 'dumb';
      break;
  }

  return baseEnv;
}

/**
 * Check if a shell is available on the system
 */
export function isShellAvailable(shell: ShellType): boolean {
  const executable = getShellExecutable(shell);
  try {
    // Try to execute the shell with a simple command
    const { execSync } = require('child_process');
    execSync(`${executable} --version`, {
      stdio: 'ignore',
      timeout: 1000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the default shell for the current platform
 */
export function getDefaultShell(): ShellType {
  if (process.platform === 'win32') {
    return isShellAvailable('powershell') ? 'powershell' : 'cmd';
  }
  return detectShell();
}
