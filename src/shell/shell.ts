/**
 * Shell Utilities
 * Provides utilities for detecting and working with different shells
 */

import { existsSync } from 'fs';
import path from 'path';

export namespace Shell {
  /**
   * Find PowerShell executable on Windows.
   * Prefers pwsh (PowerShell Core) over powershell.exe (Windows PowerShell).
   */
  export function findPowerShell(): string | undefined {
    if (process.platform !== 'win32') {
      return undefined;
    }

    // Check for PowerShell Core (pwsh) first
    const pwshPaths = [
      'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
      'C:\\Program Files\\PowerShell\\pwsh.exe',
      path.join(process.env.ProgramFiles || 'C:\\Program Files', 'PowerShell', '7', 'pwsh.exe'),
      path.join(
        process.env.ProgramFiles || 'C:\\Program Files',
        'PowerShell',
        'pwsh.exe'
      ),
    ];

    for (const p of pwshPaths) {
      if (existsSync(p)) {
        return p;
      }
    }

    // Check for Windows PowerShell
    const windowsPowerShell = path.join(
      process.env.SystemRoot || 'C:\\Windows',
      'System32',
      'WindowsPowerShell',
      'v1.0',
      'powershell.exe'
    );

    if (existsSync(windowsPowerShell)) {
      return windowsPowerShell;
    }

    return undefined;
  }

  /**
   * Get shell arguments for executing commands
   */
  export function getShellArgs(shell: string): string[] {
    const basename = path.basename(shell).toLowerCase();

    if (basename === 'pwsh.exe' || basename === 'powershell.exe' || basename === 'pwsh') {
      return ['-NoProfile', '-NonInteractive', '-Command'];
    }

    if (basename === 'cmd.exe') {
      return ['/c'];
    }

    // Default for bash/sh/zsh
    return ['-c'];
  }

  /**
   * Detect the default shell for the current platform
   */
  export function getDefaultShell(): string {
    if (process.platform === 'win32') {
      // Prefer PowerShell on Windows for better scripting support
      const pwsh = findPowerShell();
      if (pwsh) {
        return pwsh;
      }
      return 'cmd.exe';
    }

    // Unix-like systems
    return process.env.SHELL || '/bin/bash';
  }
}
