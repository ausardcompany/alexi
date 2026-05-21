/**
 * Shell Prompt Construction Module
 * Provides sophisticated shell command prompting with safety checks
 */

export interface ShellPromptOptions {
  command: string;
  workingDirectory?: string;
  environment?: Record<string, string>;
  timeout?: number;
  captureStderr?: boolean;
}

export interface ShellPromptResult {
  formattedCommand: string;
  safetyWarnings: string[];
  environmentOverrides: Record<string, string>;
}

/**
 * Analyzes and formats shell commands with safety checks
 */
export function shellPrompt(options: ShellPromptOptions | string): ShellPromptResult {
  const opts = typeof options === 'string' ? { command: options } : options;

  const safetyWarnings: string[] = [];

  // Check for potentially dangerous commands
  const dangerousPatterns = [
    { pattern: /rm\s+-rf\s+[\/~]/, message: 'Recursive deletion of root or home directory' },
    { pattern: />\s*\/dev\/sd[a-z]/, message: 'Writing directly to disk device' },
    { pattern: /mkfs\./, message: 'Filesystem creation command' },
    { pattern: /dd\s+if=/, message: 'Low-level disk operation' },
    { pattern: /chmod\s+777/, message: 'Overly permissive file permissions' },
    { pattern: /curl.*\|\s*bash/, message: 'Piping remote content to shell' },
    { pattern: /wget.*\|\s*sh/, message: 'Piping remote content to shell' },
  ];

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(opts.command)) {
      safetyWarnings.push(`Potentially dangerous: ${message}`);
    }
  }

  // Build environment overrides
  const environmentOverrides: Record<string, string> = {
    ...opts.environment,
    SHELL_PROMPT_ID: `alexi-${Date.now()}`,
  };

  // Format command with proper escaping for logging/display
  const formattedCommand = opts.command.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  return {
    formattedCommand,
    safetyWarnings,
    environmentOverrides,
  };
}

/**
 * Validates a shell command and returns warnings
 */
export function validateShellCommand(command: string): string[] {
  const result = shellPrompt(command);
  return result.safetyWarnings;
}
