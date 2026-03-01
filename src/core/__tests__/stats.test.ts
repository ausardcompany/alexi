/**
 * Tests for Statistics System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { StatsManager, getStatsManager, resetStatsManager } from '../stats.js';
import { resetCostTracker, getCostTracker } from '../costTracker.js';
import { resetMemoryManager, getMemoryManager } from '../memory.js';

describe('StatsManager', () => {
  let testDir: string;
  let statsManager: StatsManager;

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-stats-test-'));
    
    // Create sessions directory
    fs.mkdirSync(path.join(testDir, 'sessions'), { recursive: true });
    
    // Reset singletons
    resetStatsManager();
    resetCostTracker();
    resetMemoryManager();
    
    statsManager = new StatsManager({ dataDir: testDir });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetStatsManager();
    resetCostTracker();
    resetMemoryManager();
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
        { metadata: { id: 's1', created: oldTime, updated: oldTime, totalTokens: 0, messageCount: 0 }, messages: [] },
        { metadata: { id: 's2', created: newTime, updated: newTime, totalTokens: 0, messageCount: 0 }, messages: [] },
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
        { metadata: { id: 's1', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
        { metadata: { id: 's2', created: Date.now(), updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
        { metadata: { id: 's3', created: Date.now() - 86400000, updated: Date.now(), totalTokens: 0, messageCount: 0 }, messages: [] },
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
        metadata: { id: 's1', created: Date.now(), updated: Date.now(), totalTokens: 50, messageCount: 2 },
        messages: [],
      };
      fs.writeFileSync(
        path.join(testDir, 'sessions', 's1.json'),
        JSON.stringify(session)
      );
      
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
