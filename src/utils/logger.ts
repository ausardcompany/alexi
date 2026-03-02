/**
 * Centralized logging utility to replace direct console.* calls
 * This allows for consistent logging and easier ESLint compliance
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface _LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = 'info';

export const logger = {
  setLevel(level: LogLevel): void {
    currentLevel = level;
  },

  debug(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.info) {
      console.log(message, ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (LOG_LEVELS[currentLevel] <= LOG_LEVELS.warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error(message: string, ...args: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...args);
  },

  // For direct output without formatting (like CLI output)
  print(message: string): void {
    console.log(message);
  },
};

export default logger;
