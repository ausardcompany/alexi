/**
 * Tests for Statistics System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { StatsManager, getStatsManager, resetStatsManager, computeCacheHitRate } from '../stats.js';
import { getCostTracker, resetCostTracker } from '../costTracker.js';
import { resetMemoryManager } from '../memory.js';

describe('StatsManager', () => {
  let testDir: string;
  let statsManager: StatsManager;

  // The cost-tracker singleton always reads/writes the user's home
  // `~/.alexi/cost-history.json`. To keep these tests isolated from any
  // pre-existing local cost history (and from each other), we delete
  // that file in `beforeEach` and `afterEach`.
  const costHistoryPath = path.join(os.homedir(), '.alexi', 'cost-history.json');
  const wipeCostHistory = () => {
    try {
      fs.unlinkSync(costHistoryPath);
    } catch {
      // file may not exist
    }
  };

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-stats-test-'));

    // Create sessions directory
    fs.mkdirSync(path.join(testDir, 'sessions'), { recursive: true });

    // Reset singletons
    resetStatsManager();
    resetCostTracker();
    resetMemoryManager();
    wipeCostHistory();

    statsManager = new StatsManager({ dataDir: testDir });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetStatsManager();
    resetCostTracker();
    resetMemoryManager();
    wipeCostHistory();
  });

  describe('getSessionStats', () => {
    it('should return empty stats when no sessions exist', () => {
      const stats = statsManager.getSessionStats();

      expect(stats.totalSessions).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.totalTokens).toBe(0);
      expect(stats.avgMessagesPerSession).toBe(0);
    });

    it('should calculate correct stats from sessions', () => {
      // Create test sessions
      const sessions = [
        {
          metadata: {
            id: 'session-1',
            created: Date.now() - 86400000, // Yesterday
            updated: Date.now(),
            modelId: 'gpt-4o',
            totalTokens: 100,
            messageCount: 4,
          },
          messages: [],
        },
        {
          metadata: {
            id: 'session-2',
            created: Date.now(),
            updated: Date.now(),
            modelId: 'gpt-4o',
            totalTokens: 200,
            messageCount: 6,
          },
          messages: [],
        },
        {
          metadata: {
            id: 'session-3',
            created: Date.now(),
            updated: Date.now(),
            modelId: 'claude-4.5-sonnet',
            totalTokens: 150,
            messageCount: 5,
          },
          messages: [],
        },
      ];

      for (const s of sessions) {
        fs.writeFileSync(
          path.join(testDir, 'sessions', `${s.metadata.id}.json`),
          JSON.stringify(s, null, 2)
        );
      }

      const stats = statsManager.getSessionStats();

      expect(stats.totalSessions).toBe(3);
      expect(stats.totalMessages).toBe(15);
      expect(stats.totalTokens).toBe(450);
      expect(stats.avgMessagesPerSession).toBe(5);
      expect(stats.mostUsedModel).toBe('gpt-4o');
      expect(stats.sessionsByModel['gpt-4o']).toBe(2);
      expect(stats.sessionsByModel['claude-4.5-sonnet']).toBe(1);
    });

    it('should track oldest and newest sessions', () => {
      const oldTime = Date.now() - 86400000 * 30; // 30 days ago
      const newTime = Date.now();

      const sessions = [
        {
          metadata: {
            id: 's1',
            created: oldTime,
            updated: oldTime,
            totalTokens: 0,
            messageCount: 0,
          },
          messages: [],
        },
        {
          metadata: {
            id: 's2',
            created: newTime,
            updated: newTime,
            totalTokens: 0,
            messageCount: 0,
          },
          messages: [],
        },
      ];

      for (const s of sessions) {
        fs.writeFileSync(
          path.join(testDir, 'sessions', `${s.metadata.id}.json`),
          JSON.stringify(s)
        );
      }

      const stats = statsManager.getSessionStats();

      expect(stats.oldestSession).toBe(oldTime);
      expect(stats.newestSession).toBe(newTime);
    });

    it('should track sessions by date', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const sessions = [
        {
          metadata: {
            id: 's1',
            created: Date.now(),
            updated: Date.now(),
            totalTokens: 0,
            messageCount: 0,
          },
          messages: [],
        },
        {
          metadata: {
            id: 's2',
            created: Date.now(),
            updated: Date.now(),
            totalTokens: 0,
            messageCount: 0,
          },
          messages: [],
        },
        {
          metadata: {
            id: 's3',
            created: Date.now() - 86400000,
            updated: Date.now(),
            totalTokens: 0,
            messageCount: 0,
          },
          messages: [],
        },
      ];

      for (const s of sessions) {
        fs.writeFileSync(
          path.join(testDir, 'sessions', `${s.metadata.id}.json`),
          JSON.stringify(s)
        );
      }

      const stats = statsManager.getSessionStats();

      expect(stats.sessionsByDate[today]).toBe(2);
      expect(stats.sessionsByDate[yesterday]).toBe(1);
    });
  });

  describe('getOverallStats', () => {
    it('should return combined stats', () => {
      // Create a session
      const session = {
        metadata: {
          id: 's1',
          created: Date.now(),
          updated: Date.now(),
          totalTokens: 50,
          messageCount: 2,
        },
        messages: [],
      };
      fs.writeFileSync(path.join(testDir, 'sessions', 's1.json'), JSON.stringify(session));

      const stats = statsManager.getOverallStats();

      expect(stats.sessions.totalSessions).toBe(1);
      expect(stats.costs).toBeDefined();
      expect(stats.memories).toBeDefined();
      expect(stats.system.dataDir).toBe(testDir);
      expect(stats.system.platform).toBe(os.platform());
      expect(stats.generatedAt).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(statsManager.formatBytes(0)).toBe('0 B');
      expect(statsManager.formatBytes(100)).toBe('100.0 B');
      expect(statsManager.formatBytes(1024)).toBe('1.0 KB');
      expect(statsManager.formatBytes(1536)).toBe('1.5 KB');
      expect(statsManager.formatBytes(1048576)).toBe('1.0 MB');
      expect(statsManager.formatBytes(1073741824)).toBe('1.0 GB');
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      const now = Date.now();

      expect(statsManager.formatDuration(now)).toBe('Today');
      expect(statsManager.formatDuration(now - 86400000)).toBe('1 day');
      expect(statsManager.formatDuration(now - 86400000 * 5)).toBe('5 days');
      expect(statsManager.formatDuration(now - 86400000 * 30)).toBe('30 days');
    });
  });

  describe('getUsageTrends', () => {
    it('should return trends for last 7 and 30 days', () => {
      const trends = statsManager.getUsageTrends();

      expect(trends.last7Days).toHaveLength(7);
      expect(trends.last30Days).toHaveLength(30);

      // Each entry should have required fields
      for (const entry of trends.last7Days) {
        expect(entry).toHaveProperty('date');
        expect(entry).toHaveProperty('sessions');
        expect(entry).toHaveProperty('cost');
      }
    });

    it('should have correct date format', () => {
      const trends = statsManager.getUsageTrends();

      // Date format should be YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      for (const entry of trends.last30Days) {
        expect(entry.date).toMatch(dateRegex);
      }
    });
  });

  describe('cacheHitRate', () => {
    it('computeCacheHitRate returns undefined when no records reported cache', () => {
      const rate = computeCacheHitRate({
        totalCost: 0,
        totalInputTokens: 1000,
        totalOutputTokens: 500,
        callCount: 1,
        byModel: {},
        byDate: {},
        totalCacheReadTokens: 0,
        totalCacheWriteTokens: 0,
        cacheReportingCallCount: 0,
        cacheReportingInputTokens: 0,
      });
      expect(rate).toBeUndefined();
    });

    it('computeCacheHitRate returns undefined when denominator is 0', () => {
      // Edge case: cache-reporting call had 0 input tokens and 0 cache reads.
      const rate = computeCacheHitRate({
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        callCount: 1,
        byModel: {},
        byDate: {},
        totalCacheReadTokens: 0,
        totalCacheWriteTokens: 0,
        cacheReportingCallCount: 1,
        cacheReportingInputTokens: 0,
      });
      expect(rate).toBeUndefined();
    });

    it('computeCacheHitRate divides cache reads by reads + reporting input tokens', () => {
      const rate = computeCacheHitRate({
        totalCost: 0,
        totalInputTokens: 1100,
        totalOutputTokens: 500,
        callCount: 1,
        byModel: {},
        byDate: {},
        totalCacheReadTokens: 700,
        totalCacheWriteTokens: 60,
        cacheReportingCallCount: 2,
        cacheReportingInputTokens: 300,
      });
      // 700 / (700 + 300) = 0.7
      expect(rate).toBeCloseTo(0.7, 5);
    });

    it('OverallStats.cacheHitRate is set when records carry cache fields', () => {
      const tracker = getCostTracker();
      tracker.recordUsage('gpt-4o', 1000, 500); // no cache fields
      tracker.recordUsage('anthropic--claude-4.7-opus', 500, 200, undefined, {
        read: 400,
        write: 50,
      });
      tracker.recordUsage('anthropic--claude-4.7-opus', 600, 250, undefined, {
        read: 300,
        write: 10,
      });

      const stats = statsManager.getOverallStats();
      expect(stats.cacheHitRate).toBeDefined();
      // 700 / (700 + 1100) = 0.3888...
      expect(stats.cacheHitRate).toBeCloseTo(700 / (700 + 1100), 5);
      expect(stats.sessions.cacheHitRate).toBeCloseTo(700 / (700 + 1100), 5);
    });

    it('OverallStats.cacheHitRate is undefined when no records carry cache fields', () => {
      const tracker = getCostTracker();
      tracker.recordUsage('gpt-4o', 1000, 500);
      tracker.recordUsage('gpt-4o', 2000, 1000);

      const stats = statsManager.getOverallStats();
      expect(stats.cacheHitRate).toBeUndefined();
      expect(stats.sessions.cacheHitRate).toBeUndefined();
    });
  });

  describe('formatTokenCount', () => {
    it('returns plain number for counts below 1000', () => {
      expect(statsManager.formatTokenCount(0)).toBe('0');
      expect(statsManager.formatTokenCount(999)).toBe('999');
    });

    it('uses K suffix for thousands', () => {
      expect(statsManager.formatTokenCount(1500)).toBe('1.5K');
      expect(statsManager.formatTokenCount(12_300)).toBe('12.3K');
    });

    it('uses M suffix for millions', () => {
      expect(statsManager.formatTokenCount(1_500_000)).toBe('1.5M');
      expect(statsManager.formatTokenCount(12_300_000)).toBe('12.3M');
    });

    it('uses B suffix for billions', () => {
      expect(statsManager.formatTokenCount(1_500_000_000)).toBe('1.5B');
    });

    it('handles non-finite / negative gracefully', () => {
      expect(statsManager.formatTokenCount(NaN)).toBe('0');
      expect(statsManager.formatTokenCount(-1)).toBe('0');
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      resetStatsManager();
      const instance1 = getStatsManager();
      const instance2 = getStatsManager();

      expect(instance1).toBe(instance2);
    });

    it('should reset instance', () => {
      const instance1 = getStatsManager();
      resetStatsManager();
      const instance2 = getStatsManager();

      expect(instance1).not.toBe(instance2);
    });
  });
});
