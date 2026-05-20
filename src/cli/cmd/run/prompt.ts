/**
 * CLI Run Command Prompt
 * Enhanced prompt system with support for different input modes
 */

export type PromptMode = 'default' | 'shell' | 'multiline';

export interface PromptOptions {
  message: string;
  defaultValue?: string;
  mode?: PromptMode;
}

export interface PromptState {
  mode: PromptMode;
  input: string;
}

/**
 * Create a new prompt state
 */
export function createPromptState(initialMode: PromptMode = 'default'): PromptState {
  return {
    mode: initialMode,
    input: '',
  };
}

/**
 * Toggle between shell mode and default mode
 */
export function toggleShellMode(state: PromptState): PromptState {
  return {
    ...state,
    mode: state.mode === 'shell' ? 'default' : 'shell',
  };
}

/**
 * Show a prompt to the user
 */
export async function showPrompt(options: PromptOptions): Promise<string> {
  const mode = options.mode ?? 'default';

  if (mode === 'shell') {
    return showShellPrompt(options);
  }

  // Default prompt implementation
  return showDefaultPrompt(options);
}

/**
 * Show shell-style prompt with $ prefix
 */
async function showShellPrompt(options: PromptOptions): Promise<string> {
  // Shell mode shows a $ prefix and enables shell-specific completions
  const shellOptions = {
    ...options,
    message: `$ ${options.message}`,
    // Enable shell completion hints
  };

  return showDefaultPrompt(shellOptions);
}

/**
 * Show default prompt
 */
async function showDefaultPrompt(options: PromptOptions): Promise<string> {
  // This is a placeholder implementation
  // In a real implementation, this would use readline or a similar library
  // to show an interactive prompt

  return new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(options.message + ' ', (answer: string) => {
      rl.close();
      resolve(answer || options.defaultValue || '');
    });
  });
}

/**
 * Parse mode from input string
 * Supports switching modes with special prefixes
 */
export function parseModeFromInput(input: string): {
  mode: PromptMode;
  cleanInput: string;
} {
  if (input.startsWith('$ ')) {
    return { mode: 'shell', cleanInput: input.slice(2) };
  }

  if (input.startsWith('```')) {
    return { mode: 'multiline', cleanInput: input };
  }

  return { mode: 'default', cleanInput: input };
}
