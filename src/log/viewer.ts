/**
 * Log Viewer Utilities
 * Read, filter, tail, and manage log files for Alexi
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

import type { LogEntry, LogLevel, LogCategory } from './index.js';

// ============ Type Definitions ============

export interface LogFilter {
  level?: LogLevel | LogLevel[];
  category?: LogCategory | LogCategory[];
  sessionId?: string;
  since?: Date;
  until?: Date;
  grep?: string; // regex pattern
  limit?: number;
}

export interface LogFileInfo {
  path: string;
  size: number;
  date: string;
}

export interface CleanupResult {
  deleted: number;
  freed: number;
}

// ============ Constants ============

const DEFAULT_LOG_DIR = path.join(os.homedir(), '.alexi', 'logs');
const LOG_FILE_PATTERN = /^alexi-(\d{4}-\d{2}-\d{2})\.log(\.(\\d+))?$/;

// ============ Log Viewer Class ============

export class LogViewer {
  private static instance: LogViewer | null = null;
  private logDir: string;

  private constructor(logDir?: string) {
    this.logDir = logDir || DEFAULT_LOG_DIR;
  }

  /**
   * Get singleton instance
   */
  static getInstance(logDir?: string): LogViewer {
    if (!LogViewer.instance) {
      LogViewer.instance = new LogViewer(logDir);
    }
    return LogViewer.instance;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  static resetInstance(): void {
    LogViewer.instance = null;
  }

  /**
   * Set the log directory
   */
  setLogDir(logDir: string): void {
    this.logDir = logDir;
  }

  /**
   * Get list of log files with metadata
   */
  getLogFiles(): LogFileInfo[] {
    const files: LogFileInfo[] = [];

    if (!fs.existsSync(this.logDir)) {
      return files;
    }

    try {
      const entries = fs.readdirSync(this.logDir);

      for (const entry of entries) {
        const match = entry.match(LOG_FILE_PATTERN);
        if (match) {
          const filePath = path.join(this.logDir, entry);
          try {
            const stats = fs.statSync(filePath);
            files.push({
              path: filePath,
              size: stats.size,
              date: match[1], // YYYY-MM-DD
            });
          } catch {
            // Skip files that can't be accessed
          }
        }
      }

      // Sort by date descending (newest first)
      files.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
      console.error('Failed to list log files:', error);
    }

    return files;
  }

  /**
   * Read and filter logs from files
   */
  readLogs(filter?: LogFilter): LogEntry[] {
    const entries: LogEntry[] = [];
    const logFiles = this.getLogFiles();

    // Get files that could match the date range
    const filesToRead = this.filterFilesByDateRange(logFiles, filter?.since, filter?.until);

    for (const fileInfo of filesToRead) {
      const fileEntries = this.readLogFile(fileInfo.path, filter);
      entries.push(...fileEntries);

      // Check limit
      if (filter?.limit && entries.length >= filter.limit) {
        return entries.slice(0, filter.limit);
      }
    }

    // Apply limit if specified
    if (filter?.limit && entries.length > filter.limit) {
      return entries.slice(0, filter.limit);
    }

    return entries;
  }

  /**
   * Read a single log file and apply filters
   */
  private readLogFile(filePath: string, filter?: LogFilter): LogEntry[] {
    const entries: LogEntry[] = [];

    if (!fs.existsSync(filePath)) {
      return entries;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        try {
          const entry = JSON.parse(trimmedLine) as LogEntry;

          if (this.matchesFilter(entry, filter)) {
            entries.push(entry);
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    } catch (error) {
      console.error(`Failed to read log file ${filePath}:`, error);
    }

    return entries;
  }

  /**
   * Filter files by date range
   */
  private filterFilesByDateRange(files: LogFileInfo[], since?: Date, until?: Date): LogFileInfo[] {
    if (!since && !until) {
      return files;
    }

    return files.filter((file) => {
      const fileDate = new Date(file.date);

      if (since && fileDate < new Date(since.toISOString().split('T')[0])) {
        return false;
      }

      if (until && fileDate > new Date(until.toISOString().split('T')[0])) {
        return false;
      }

      return true;
    });
  }

  /**
   * Check if a log entry matches the filter
   */
  private matchesFilter(entry: LogEntry, filter?: LogFilter): boolean {
    if (!filter) {
      return true;
    }

    // Level filter
    if (filter.level) {
      const levels = Array.isArray(filter.level) ? filter.level : [filter.level];
      if (!levels.includes(entry.level)) {
        return false;
      }
    }

    // Category filter
    if (filter.category) {
      const categories = Array.isArray(filter.category) ? filter.category : [filter.category];
      if (!categories.includes(entry.category)) {
        return false;
      }
    }

    // Session ID filter
    if (filter.sessionId && entry.sessionId !== filter.sessionId) {
      return false;
    }

    // Date range filters
    if (filter.since || filter.until) {
      const entryDate = new Date(entry.timestamp);

      if (filter.since && entryDate < filter.since) {
        return false;
      }

      if (filter.until && entryDate > filter.until) {
        return false;
      }
    }

    // Grep pattern filter
    if (filter.grep) {
      try {
        const regex = new RegExp(filter.grep, 'i');
        const entryString = JSON.stringify(entry);
        if (!regex.test(entryString)) {
          return false;
        }
      } catch {
        // Invalid regex, treat as literal string search
        const entryString = JSON.stringify(entry).toLowerCase();
        if (!entryString.includes(filter.grep.toLowerCase())) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Tail logs - follow new log entries in real time
   * Returns a stop function to cancel the tail
   */
  tailLogs(callback: (entry: LogEntry) => void, filter?: LogFilter): () => void {
    let running = true;
    let currentFile: string | null = null;
    let fileSize: number = 0;
    let watcher: fs.FSWatcher | null = null;

    const checkForNewEntries = (): void => {
      if (!running) return;

      const logFile = this.getCurrentLogFile();

      // Check if the current log file changed (new day)
      if (currentFile !== logFile) {
        // Close existing watcher
        if (watcher) {
          watcher.close();
          watcher = null;
        }

        currentFile = logFile;

        if (fs.existsSync(logFile)) {
          fileSize = fs.statSync(logFile).size;

          // Start watching the new file
          try {
            watcher = fs.watch(logFile, (eventType) => {
              if (eventType === 'change' && running) {
                readNewEntries();
              }
            });
          } catch {
            // Fallback to polling if watch fails
            setTimeout(checkForNewEntries, 1000);
          }
        } else {
          fileSize = 0;
          // Poll until the file exists
          setTimeout(checkForNewEntries, 1000);
        }
      }
    };

    const readNewEntries = (): void => {
      if (!running || !currentFile) return;

      try {
        const stats = fs.statSync(currentFile);
        const newSize = stats.size;

        if (newSize > fileSize) {
          // Read only the new content
          const fd = fs.openSync(currentFile, 'r');
          const buffer = Buffer.alloc(newSize - fileSize);
          fs.readSync(fd, buffer, 0, buffer.length, fileSize);
          fs.closeSync(fd);

          const newContent = buffer.toString('utf8');
          const lines = newContent.split('\n');

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            try {
              const entry = JSON.parse(trimmedLine) as LogEntry;

              if (this.matchesFilter(entry, filter)) {
                callback(entry);
              }
            } catch {
              // Skip invalid JSON lines
            }
          }

          fileSize = newSize;
        }
      } catch {
        // File may have been rotated or deleted
        currentFile = null;
        checkForNewEntries();
      }
    };

    // Start watching
    checkForNewEntries();

    // Also check periodically for file rotation (new day, etc.)
    const rotationInterval = setInterval(() => {
      if (running) {
        const logFile = this.getCurrentLogFile();
        if (logFile !== currentFile) {
          currentFile = null;
          checkForNewEntries();
        }
      }
    }, 60000); // Check every minute

    // Return stop function
    return (): void => {
      running = false;

      if (watcher) {
        watcher.close();
        watcher = null;
      }

      clearInterval(rotationInterval);
    };
  }

  /**
   * Get the current log file path based on today's date
   */
  private getCurrentLogFile(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `alexi-${date}.log`);
  }

  /**
   * Clean up old log files
   */
  cleanLogs(olderThan: Date): CleanupResult {
    const result: CleanupResult = {
      deleted: 0,
      freed: 0,
    };

    if (!fs.existsSync(this.logDir)) {
      return result;
    }

    const cutoffDate = olderThan.toISOString().split('T')[0];

    try {
      const entries = fs.readdirSync(this.logDir);

      for (const entry of entries) {
        const match = entry.match(LOG_FILE_PATTERN);
        if (match) {
          const fileDate = match[1];

          // Delete files older than the cutoff
          if (fileDate < cutoffDate) {
            const filePath = path.join(this.logDir, entry);

            try {
              const stats = fs.statSync(filePath);
              const fileSize = stats.size;

              fs.unlinkSync(filePath);

              result.deleted++;
              result.freed += fileSize;
            } catch {
              // Skip files that can't be deleted
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean logs:', error);
    }

    return result;
  }

  /**
   * Get total size of all log files
   */
  getTotalLogSize(): number {
    const files = this.getLogFiles();
    return files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Get log statistics
   */
  getLogStats(): {
    totalFiles: number;
    totalSize: number;
    oldestDate: string | null;
    newestDate: string | null;
  } {
    const files = this.getLogFiles();

    return {
      totalFiles: files.length,
      totalSize: files.reduce((total, file) => total + file.size, 0),
      oldestDate: files.length > 0 ? files[files.length - 1].date : null,
      newestDate: files.length > 0 ? files[0].date : null,
    };
  }
}

// ============ Singleton Export ============

let viewerInstance: LogViewer | null = null;

/**
 * Get the global log viewer instance
 */
export function getLogViewer(): LogViewer {
  if (!viewerInstance) {
    viewerInstance = LogViewer.getInstance();
  }
  return viewerInstance;
}

/**
 * Reset the log viewer instance (useful for testing)
 */
export function resetLogViewer(): void {
  LogViewer.resetInstance();
  viewerInstance = null;
}
