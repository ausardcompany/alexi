import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import { CostTracker, getCostTracker, resetCostTracker, MODEL_PRICING } from '../costTracker.js';

// Mock fs module for testing
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(false),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn().mockReturnValue('[]'),
    writeFileSync: vi.fn(),
    promises: {
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe('CostTracker', () => {
  let testDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    resetCostTracker();
    testDir = path.join(os.tmpdir(), 'alexi-test-' + Date.now());
  });

  afterEach(() => {
    resetCostTracker();
  });

  describe('getPricing', () => {
    it('should return pricing for known models', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const gpt4oPricing = tracker.getPricing('gpt-4o');
      expect(gpt4oPricing).toBeDefined();
      expect(gpt4oPricing?.displayName).toBe('GPT-4o');
      expect(gpt4oPricing?.inputCostPer1k).toBeGreaterThan(0);
      expect(gpt4oPricing?.outputCostPer1k).toBeGreaterThan(0);
    });

    it('should find pricing by partial match', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      // Full model ID includes 'anthropic--' prefix
      const pricing = tracker.getPricing('anthropic--claude-4.5-sonnet');
      expect(pricing).toBeDefined();
      expect(pricing?.displayName).toContain('Claude');
    });

    it('should return undefined for unknown models', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const pricing = tracker.getPricing('unknown-model-xyz');
      expect(pricing).toBeUndefined();
    });

    it('should support custom pricing', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.setCustomPricing({
        modelId: 'custom-model',
        displayName: 'Custom Model',
        inputCostPer1k: 0.01,
        outputCostPer1k: 0.02,
      });

      const pricing = tracker.getPricing('custom-model');
      expect(pricing).toBeDefined();
      expect(pricing?.inputCostPer1k).toBe(0.01);
      expect(pricing?.outputCostPer1k).toBe(0.02);
    });
  });

  describe('calculateCost', () => {
    it('should calculate cost correctly for known models', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      // GPT-4o pricing: $0.0025 per 1k input, $0.01 per 1k output
      const cost = tracker.calculateCost('gpt-4o', 1000, 1000);

      // Expected: (1000 * 0.0025 / 1000) + (1000 * 0.01 / 1000) = 0.0025 + 0.01 = 0.0125
      expect(cost).toBeCloseTo(0.0125, 4);
    });

    it('should use fallback pricing for unknown models', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      // Fallback: (input * 0.003 + output * 0.015) / 1000
      const cost = tracker.calculateCost('unknown-model', 1000, 1000);

      // Expected: (1000 * 0.003 + 1000 * 0.015) / 1000 = 0.018
      expect(cost).toBeCloseTo(0.018, 4);
    });

    it('should handle zero tokens', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const cost = tracker.calculateCost('gpt-4o', 0, 0);
      expect(cost).toBe(0);
    });
  });

  describe('recordUsage', () => {
    it('should record usage and return a record', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const record = tracker.recordUsage('gpt-4o', 500, 200, 'session-123');

      expect(record).toBeDefined();
      expect(record.modelId).toBe('gpt-4o');
      expect(record.inputTokens).toBe(500);
      expect(record.outputTokens).toBe(200);
      expect(record.sessionId).toBe('session-123');
      expect(record.timestamp).toBeLessThanOrEqual(Date.now());
      expect(record.cost).toBeGreaterThan(0);
    });

    it('should accumulate multiple records', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 100, 50);
      tracker.recordUsage('gpt-4o', 200, 100);
      tracker.recordUsage('gpt-4o-mini', 300, 150);

      const summary = tracker.getSummary();
      expect(summary.callCount).toBe(3);
      expect(summary.totalInputTokens).toBe(600);
      expect(summary.totalOutputTokens).toBe(300);
    });
  });

  describe('getSummary', () => {
    it('should return empty summary when no records', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const summary = tracker.getSummary();

      expect(summary.totalCost).toBe(0);
      expect(summary.totalInputTokens).toBe(0);
      expect(summary.totalOutputTokens).toBe(0);
      expect(summary.callCount).toBe(0);
    });

    it('should summarize by model', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500);
      tracker.recordUsage('gpt-4o', 1000, 500);
      tracker.recordUsage('gpt-4o-mini', 2000, 1000);

      const summary = tracker.getSummary();

      expect(summary.byModel['gpt-4o'].calls).toBe(2);
      expect(summary.byModel['gpt-4o-mini'].calls).toBe(1);
      expect(summary.byModel['gpt-4o'].inputTokens).toBe(2000);
    });

    it('should filter by time period', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      // Record some usage
      tracker.recordUsage('gpt-4o', 1000, 500);

      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      // Get summary since one day ago (should include our record)
      const recentSummary = tracker.getSummary({ since: oneDayAgo });
      expect(recentSummary.callCount).toBe(1);

      // Get summary since two days in the future (should exclude everything)
      const futureSummary = tracker.getSummary({ since: now + 1000 });
      expect(futureSummary.callCount).toBe(0);
    });

    it('should filter by session', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500, 'session-a');
      tracker.recordUsage('gpt-4o', 2000, 1000, 'session-b');
      tracker.recordUsage('gpt-4o', 500, 250, 'session-a');

      const sessionASummary = tracker.getSummary({ sessionId: 'session-a' });
      expect(sessionASummary.callCount).toBe(2);
      expect(sessionASummary.totalInputTokens).toBe(1500);

      const sessionBSummary = tracker.getSummary({ sessionId: 'session-b' });
      expect(sessionBSummary.callCount).toBe(1);
      expect(sessionBSummary.totalInputTokens).toBe(2000);
    });
  });

  describe('getTodaySummary', () => {
    it('should return summary for today only', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500);

      const today = tracker.getTodaySummary();
      expect(today.callCount).toBe(1);
    });
  });

  describe('getMonthSummary', () => {
    it('should return summary for current month', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500);

      const month = tracker.getMonthSummary();
      expect(month.callCount).toBe(1);
    });
  });

  describe('exportToCsv', () => {
    it('should export records as CSV', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500, 'session-123');

      const csv = tracker.exportToCsv();

      expect(csv).toContain('timestamp,date,sessionId,modelId,inputTokens,outputTokens,cost');
      expect(csv).toContain('gpt-4o');
      expect(csv).toContain('session-123');
      expect(csv).toContain('1000');
      expect(csv).toContain('500');
    });

    it('should handle empty records', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      const csv = tracker.exportToCsv();

      // Should only have headers
      expect(csv).toBe('timestamp,date,sessionId,modelId,inputTokens,outputTokens,cost');
    });
  });

  describe('clearHistory', () => {
    it('should clear all records', () => {
      const tracker = new CostTracker({ dataDir: testDir });

      tracker.recordUsage('gpt-4o', 1000, 500);
      tracker.recordUsage('gpt-4o', 2000, 1000);

      expect(tracker.getSummary().callCount).toBe(2);

      tracker.clearHistory();

      expect(tracker.getSummary().callCount).toBe(0);
    });
  });

  describe('getCostTracker singleton', () => {
    it('should return the same instance', () => {
      const instance1 = getCostTracker();
      const instance2 = getCostTracker();

      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = getCostTracker();
      resetCostTracker();
      const instance2 = getCostTracker();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('MODEL_PRICING', () => {
    it('should have pricing for common models', () => {
      const modelIds = MODEL_PRICING.map((p) => p.modelId);

      expect(modelIds).toContain('gpt-4o');
      expect(modelIds).toContain('gpt-4o-mini');
      expect(modelIds).toContain('anthropic--claude-4.5-sonnet');
      expect(modelIds).toContain('gemini-1.5-flash');
    });

    it('should have valid pricing values', () => {
      for (const pricing of MODEL_PRICING) {
        expect(pricing.inputCostPer1k).toBeGreaterThan(0);
        expect(pricing.outputCostPer1k).toBeGreaterThan(0);
        expect(pricing.displayName).toBeTruthy();
        expect(pricing.modelId).toBeTruthy();
      }
    });
  });

  describe('per-task usage tracking', () => {
    describe('startTask', () => {
      it('should create a boundary at the current record position', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        // Record some usage before starting the task
        tracker.recordUsage('gpt-4o', 1000, 500);
        tracker.recordUsage('gpt-4o', 2000, 800);

        // Start a task - boundary should be at index 2
        tracker.startTask('task-1');

        // Record usage after the task boundary
        tracker.recordUsage('gpt-4o', 500, 200);

        const taskRecords = tracker.getTaskUsage('task-1');
        expect(taskRecords).toHaveLength(1);
        expect(taskRecords[0].inputTokens).toBe(500);
        expect(taskRecords[0].outputTokens).toBe(200);
      });

      it('should reset boundary when same taskId is reused', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        tracker.startTask('task-1');
        tracker.recordUsage('gpt-4o', 1000, 500);

        // Restart the same task - boundary moves forward
        tracker.startTask('task-1');
        tracker.recordUsage('gpt-4o', 200, 100);

        const taskRecords = tracker.getTaskUsage('task-1');
        expect(taskRecords).toHaveLength(1);
        expect(taskRecords[0].inputTokens).toBe(200);
      });
    });

    describe('getTaskUsage', () => {
      it('should return only records after the task boundary', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        // Pre-task usage
        tracker.recordUsage('gpt-4o', 1000, 500, 'session-1');

        tracker.startTask('task-a');

        // Task-a usage
        tracker.recordUsage('gpt-4o', 300, 100, 'session-1');
        tracker.recordUsage('gpt-4o-mini', 500, 200, 'session-1');

        const taskRecords = tracker.getTaskUsage('task-a');
        expect(taskRecords).toHaveLength(2);
        expect(taskRecords[0].inputTokens).toBe(300);
        expect(taskRecords[1].modelId).toBe('gpt-4o-mini');
      });

      it('should return empty array for unknown task', () => {
        const tracker = new CostTracker({ dataDir: testDir });
        tracker.recordUsage('gpt-4o', 1000, 500);

        const taskRecords = tracker.getTaskUsage('nonexistent-task');
        expect(taskRecords).toEqual([]);
      });
    });

    describe('resetTaskCounters', () => {
      it('should reset accumulators and move boundary to current position', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        tracker.startTask('task-1');
        tracker.recordUsage('gpt-4o', 1000, 500);
        tracker.recordUsage('gpt-4o', 2000, 800);

        // Verify we have 2 records in the task
        expect(tracker.getTaskUsage('task-1')).toHaveLength(2);

        // Reset counters
        tracker.resetTaskCounters();

        // Now the boundary has moved - no records after the new boundary
        expect(tracker.getTaskUsage('task-1')).toHaveLength(0);

        // New records should appear
        tracker.recordUsage('gpt-4o', 100, 50);
        expect(tracker.getTaskUsage('task-1')).toHaveLength(1);
      });
    });

    describe('getTaskSummary', () => {
      it('should compute summary from task records only', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        // Pre-task usage (should not be counted)
        tracker.recordUsage('gpt-4o', 5000, 3000);

        tracker.startTask('my-task');

        // Task usage
        tracker.recordUsage('gpt-4o', 1000, 500);
        tracker.recordUsage('gpt-4o', 2000, 800);

        const summary = tracker.getTaskSummary('my-task');
        expect(summary).toBeDefined();
        expect(summary!.inputTokens).toBe(3000);
        expect(summary!.outputTokens).toBe(1300);
        expect(summary!.callCount).toBe(2);
        expect(summary!.cost).toBeGreaterThan(0);
      });

      it('should return undefined for unknown task', () => {
        const tracker = new CostTracker({ dataDir: testDir });
        expect(tracker.getTaskSummary('unknown')).toBeUndefined();
      });
    });

    describe('task isolation across sequential tasks', () => {
      it('should isolate usage between two sequential tasks', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        // First task
        tracker.startTask('task-1');
        tracker.recordUsage('gpt-4o', 1000, 500);
        tracker.recordUsage('gpt-4o', 2000, 800);

        // Second task
        tracker.startTask('task-2');
        tracker.recordUsage('gpt-4o', 300, 100);

        // Task-1 should have its records plus task-2's (since startIndex is fixed)
        const task1Records = tracker.getTaskUsage('task-1');
        expect(task1Records).toHaveLength(3); // All records after task-1 boundary

        // Task-2 should only have its own record
        const task2Records = tracker.getTaskUsage('task-2');
        expect(task2Records).toHaveLength(1);
        expect(task2Records[0].inputTokens).toBe(300);

        // Summaries should be accurate
        const task2Summary = tracker.getTaskSummary('task-2');
        expect(task2Summary!.inputTokens).toBe(300);
        expect(task2Summary!.outputTokens).toBe(100);
        expect(task2Summary!.callCount).toBe(1);
      });

      it('should maintain separate boundaries for concurrent tasks', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        tracker.startTask('task-a');
        tracker.recordUsage('gpt-4o', 1000, 500);

        tracker.startTask('task-b');
        tracker.recordUsage('gpt-4o', 2000, 800);
        tracker.recordUsage('gpt-4o-mini', 500, 200);

        // Task-a boundary was set before task-b, so it includes all records after its boundary
        const taskARecords = tracker.getTaskUsage('task-a');
        expect(taskARecords).toHaveLength(3);

        // Task-b boundary was set after the first record, so it only has 2 records
        const taskBRecords = tracker.getTaskUsage('task-b');
        expect(taskBRecords).toHaveLength(2);
        expect(taskBRecords[0].inputTokens).toBe(2000);
        expect(taskBRecords[1].inputTokens).toBe(500);
      });
    });

    describe('clearHistory clears task state', () => {
      it('should clear all task boundaries and accumulators', () => {
        const tracker = new CostTracker({ dataDir: testDir });

        tracker.startTask('task-1');
        tracker.recordUsage('gpt-4o', 1000, 500);

        tracker.clearHistory();

        expect(tracker.getTaskUsage('task-1')).toEqual([]);
        expect(tracker.getTaskSummary('task-1')).toBeUndefined();
      });
    });
  });
});
