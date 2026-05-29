/**
 * Shell ID Detection Module
 * Detects the shell type and provides shell information
 */

export type ShellType = 'bash' | 'zsh' | 'fish' | 'powershell' | 'cmd' | 'unknown';

export interface ShellInfo {
  type: ShellType;
  path: string;
  version?: string;
}

function inferType(shellPath: string): ShellType {
  const name = shellPath.toLowerCase();
  if (name.includes('bash')) {
    return 'bash';
  }
  if (name.includes('zsh')) {
    return 'zsh';
  }
  if (name.includes('fish')) {
    return 'fish';
  }
  if (name.includes('powershell') || name.includes('pwsh')) {
    return 'powershell';
  }
  if (name.includes('cmd')) {
    return 'cmd';
  }
  return 'unknown';
}

export async function detect(): Promise<ShellInfo> {
  const shell = process.env.SHELL || process.env.COMSPEC || '/bin/sh';
  const type = inferType(shell);
  return { type, path: shell };
}

export const ShellId = {
  detect,
};
