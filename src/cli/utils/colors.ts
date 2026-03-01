/**
 * ANSI color codes and color utility functions for CLI output
 */

// ANSI color codes
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  
  // Foreground
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Background
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

export type ColorName = keyof typeof colors;

/**
 * Wrap text with ANSI color codes
 * @param color - Color name from the colors object
 * @param text - Text to colorize
 * @returns Text wrapped with ANSI color codes
 */
export function c(color: ColorName, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}
