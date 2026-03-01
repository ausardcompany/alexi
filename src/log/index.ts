/**
 * Log Management System
 * Core logger for Alexi with file logging and rotation
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// ============ Type Definitions ============

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'session' | 'mcp' | 'tool' | 'api' | 'system' | 'plugin';

export interface LogEntry {
  timestamp: string; // ISO format
  level: LogLevel;
  category: LogCategory;
  sessionId?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface LoggerConfig {
  level: LogLevel;
  maxFileSize: number; // bytes, default 10MB
  maxFiles: number; // rotation, default 5
  logDir: string; // ~/.alexi/logs/
}

// ============ Constants ============

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  logDir: path.join(os.homedir(), '.alexi', 'logs'),
};

// ============ Logger Class ============

export class Logger {
  private static instance: Logger | null = null;
  private config: LoggerConfig;
  private sessionId: string | undefined;
  private currentLogFile: string | null = null;
  private currentFileSize: number = 0;

  private constructor(config?: Partial<LoggerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ensureLogDirectory();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  static resetInstance(): void {
    Logger.instance = null;
  }

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Re-ensure log directory if changed
    if (config.logDir) {
      this.ensureLogDirectory();
    }
    
    // Reset current file tracking to force re-evaluation
    this.currentLogFile = null;
    this.currentFileSize = 0;
  }

  /**
   * Set the current session ID for log entries
   */
  setSessionId(id: string): void {
    this.sessionId = id;
  }

  /**
   * Clear the session ID
   */
  clearSessionId(): void {
    this.sessionId = undefined;
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Log a debug message
   */
  debug(category: LogCategory, message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', category, message, metadata);
  }

  /**
   * Log an info message
   */
  info(category: LogCategory, message: string, metadata?: Record<string, unknown>): void {
    this.log('info', category, message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(category: LogCategory, message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', category, message, metadata);
  }

  /**
   * Log an error message
   */
  error(category: LogCategory, message: string, metadata?: Record<string, unknown>): void {
    this.log('error', category, message, metadata);
  }

  /**
   * Generic log method
   */
  log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    // Check if this level should be logged
    if (LOG_LEVELS[level] < LOG_LEVELS[this.config.level]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
    };

    if (this.sessionId) {
      entry.sessionId = this.sessionId;
    }

    if (metadata && Object.keys(metadata).length > 0) {
      entry.metadata = metadata;
    }

    this.writeToFile(entry);
  }

  /**
   * Ensure the log directory exists
   */
  private ensureLogDirectory(): void {
    try {
      if (!fs.existsSync(this.config.logDir)) {
        fs.mkdirSync(this.config.logDir, { recursive: true });
      }
    } catch (error) {
      console.error(`Failed to create log directory: ${this.config.logDir}`, error);
    }
  }

  /**
   * Get the current log file path based on date
   */
  private getLogFilePath(): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.config.logDir, `alexi-${date}.log`);
  }

  /**
   * Write a log entry to file
   */
  private writeToFile(entry: LogEntry): void {
    try {
      const logFile = this.getLogFilePath();
      const line = JSON.stringify(entry) + '\n';
      const lineBytes = Buffer.byteLength(line, 'utf8');

      // Check if we need to update file tracking
      if (this.currentLogFile !== logFile) {
        this.currentLogFile = logFile;
        this.currentFileSize = this.getFileSize(logFile);
      }

      // Check if rotation is needed
      if (this.currentFileSize + lineBytes > this.config.maxFileSize) {
        this.rotateLogFile(logFile);
        this.currentFileSize = 0;
      }

      // Append to file
      fs.appendFileSync(logFile, line, 'utf8');
      this.currentFileSize += lineBytes;
    } catch (error) {
      console.error('Failed to write log entry:', error);
    }
  }

  /**
   * Get the size of a file
   */
  private getFileSize(filePath: string): number {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return stats.size;
      }
    } catch {
      // File doesn't exist or can't be accessed
    }
    return 0;
  }

  /**
   * Rotate log files
   * When file exceeds maxFileSize, rename to .1, .2, etc.
   */
  private rotateLogFile(logFile: string): void {
    try {
      if (!fs.existsSync(logFile)) {
        return;
      }

      // Delete oldest rotation if at max
      const oldestRotation = `${logFile}.${this.config.maxFiles}`;
      if (fs.existsSync(oldestRotation)) {
        fs.unlinkSync(oldestRotation);
      }

      // Shift existing rotations
      for (let i = this.config.maxFiles - 1; i >= 1; i--) {
        const currentRotation = `${logFile}.${i}`;
        const nextRotation = `${logFile}.${i + 1}`;
        
        if (fs.existsSync(currentRotation)) {
          fs.renameSync(currentRotation, nextRotation);
        }
      }

      // Rename current file to .1
      fs.renameSync(logFile, `${logFile}.1`);
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }
}

// ============ Singleton Export ============

let loggerInstance: Logger | null = null;

/**
 * Get the global logger instance
 */
export function getLogger(): Logger {
  if (!loggerInstance) {
    loggerInstance = Logger.getInstance();
  }
  return loggerInstance;
}

/**
 * Reset the logger instance (useful for testing)
 */
export function resetLogger(): void {
  Logger.resetInstance();
  loggerInstance = null;
}
