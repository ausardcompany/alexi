/**
 * Statistics System
 * Provides comprehensive usage statistics across sessions, costs, and memories
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getCostTracker, type CostSummary } from './costTracker.js';
import { getMemoryManager, type MemoryStats } from './memory.js';
import { type Session } from './sessionManager.js';

// ============ Type Definitions ============

export interface SessionStats {
  /** Total number of sessions */
  totalSessions: number;
  /** Total messages across all sessions */
  totalMessages: number;
  /** Total tokens across all sessions */
  totalTokens: number;
  /** Average messages per session */
  avgMessagesPerSession: number;
  /** Sessions by date (YYYY-MM-DD) */
  sessionsByDate: Record<string, number>;
  /** Most active model */
  mostUsedModel?: string;
  /** Sessions by model */
  sessionsByModel: Record<string, number>;
  /** Oldest session date */
  oldestSession?: number;
  /** Newest session date */
  newestSession?: number;
}

export interface OverallStats {
  /** Session statistics */
  sessions: SessionStats;
  /** Cost statistics */
  costs: CostSummary;
  /** Memory statistics */
  memories: MemoryStats;
  /** System info */
  system: {
    dataDir: string;
    dataDirSize: number;
    platform: string;
    nodeVersion: string;
  };
  /** Generated timestamp */
  generatedAt: number;
}

export interface StatsOptions {
  /** Data directory */
  dataDir?: string;
}

// ============ Stats Manager Class ============

export class StatsManager {
  private dataDir: string;

  constructor(options: StatsOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
  }

  /**
   * Get session statistics
   */
  getSessionStats(): SessionStats {
    const sessionsDir = path.join(this.dataDir, 'sessions');
    const stats: SessionStats = {
      totalSessions: 0,
      totalMessages: 0,
      totalTokens: 0,
      avgMessagesPerSession: 0,
      sessionsByDate: {},
      sessionsByModel: {},
    };

    if (!fs.existsSync(sessionsDir)) {
      return stats;
    }

    const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));
    const modelCounts: Record<string, number> = {};

    for (const file of files) {
      try {
        const filePath = path.join(sessionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const session = JSON.parse(content) as Session;

        stats.totalSessions++;
        stats.totalMessages += session.metadata.messageCount;
        stats.totalTokens += session.metadata.totalTokens;

        // Track by date
        const date = new Date(session.metadata.created).toISOString().split('T')[0];
        stats.sessionsByDate[date] = (stats.sessionsByDate[date] || 0) + 1;

        // Track by model
        const model = session.metadata.modelId || 'unknown';
        modelCounts[model] = (modelCounts[model] || 0) + 1;
        stats.sessionsByModel[model] = (stats.sessionsByModel[model] || 0) + 1;

        // Track oldest/newest
        if (!stats.oldestSession || session.metadata.created < stats.oldestSession) {
          stats.oldestSession = session.metadata.created;
        }
        if (!stats.newestSession || session.metadata.created > stats.newestSession) {
          stats.newestSession = session.metadata.created;
        }
      } catch {
        // Skip invalid session files
      }
    }

    // Calculate averages
    if (stats.totalSessions > 0) {
      stats.avgMessagesPerSession = Math.round(stats.totalMessages / stats.totalSessions);
    }

    // Find most used model
    let maxCount = 0;
    for (const [model, count] of Object.entries(modelCounts)) {
      if (count > maxCount) {
        maxCount = count;
        stats.mostUsedModel = model;
      }
    }

    return stats;
  }

  /**
   * Get overall statistics
   */
  getOverallStats(): OverallStats {
    const costTracker = getCostTracker();
    const memoryManager = getMemoryManager();

    return {
      sessions: this.getSessionStats(),
      costs: costTracker.getAllTimeSummary(),
      memories: memoryManager.getStats(),
      system: {
        dataDir: this.dataDir,
        dataDirSize: this.getDirectorySize(this.dataDir),
        platform: os.platform(),
        nodeVersion: process.version,
      },
      generatedAt: Date.now(),
    };
  }

  /**
   * Get directory size in bytes
   */
  private getDirectorySize(dirPath: string): number {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }

    let totalSize = 0;
    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          totalSize += this.getDirectorySize(filePath);
        } else {
          try {
            const stat = fs.statSync(filePath);
            totalSize += stat.size;
          } catch {
            // Skip inaccessible files
          }
        }
      }
    } catch {
      // Return current total on error
    }
    return totalSize;
  }

  /**
   * Format bytes to human-readable string
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
  }

  /**
   * Format duration in days
   */
  formatDuration(startMs: number, endMs: number = Date.now()): string {
    const days = Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  }

  /**
   * Get usage trends (last 7 days, 30 days)
   */
  getUsageTrends(): {
    last7Days: { date: string; sessions: number; cost: number }[];
    last30Days: { date: string; sessions: number; cost: number }[];
  } {
    const sessionStats = this.getSessionStats();
    const costTracker = getCostTracker();
    const costSummary = costTracker.getAllTimeSummary();

    const now = new Date();
    const results = {
      last7Days: [] as { date: string; sessions: number; cost: number }[],
      last30Days: [] as { date: string; sessions: number; cost: number }[],
    };

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayData = {
        date: dateStr,
        sessions: sessionStats.sessionsByDate[dateStr] || 0,
        cost: costSummary.byDate[dateStr] || 0,
      };

      results.last30Days.push(dayData);
      if (i < 7) {
        results.last7Days.push(dayData);
      }
    }

    return results;
  }
}

// ============ Singleton Instance ============

let statsManagerInstance: StatsManager | null = null;

export function getStatsManager(dataDir?: string): StatsManager {
  if (!statsManagerInstance) {
    statsManagerInstance = new StatsManager({ dataDir });
  }
  return statsManagerInstance;
}

export function resetStatsManager(): void {
  statsManagerInstance = null;
}
