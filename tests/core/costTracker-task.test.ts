import { describe, it, expect, beforeEach } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

import { CostTracker, type TaskUsageSummary } from '../../src/core/costTracker.js';

describe('CostTracker Task Usage', () => {
  let tracker: CostTracker;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cost-tracker-task-'));
    tracker = new CostTracker({ dataDir: tempDir });
  });

  describe('startTask', () => {
    it('should set the active task ID', () => {
      tracker.startTask('task-1');
      expect(tracker.getActiveTaskId()).toBe('task-1');
    });

    it('should initialize a fresh counter for the task', () => {
      tracker.startTask('task-1');
      const summary = tracker.endTask('task-1');
      expect(summary.inputTokens).toBe(0);
      expect(summary.outputTokens).toBe(0);
      expect(summary.cost).toBe(0);
    });

    it('should replace the active task when called again', () => {
      tracker.startTask('task-1');
      tracker.startTask('task-2');
      expect(tracker.getActiveTaskId()).toBe('task-2');
    });
  });

  describe('endTask', () => {
    it('should return the task usage summary', () => {
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 100, 50);
      const summary = tracker.endTask('task-1');

      expect(summary.taskId).toBe('task-1');
      expect(summary.inputTokens).toBe(100);
      expect(summary.outputTokens).toBe(50);
      expect(summary.cost).toBeGreaterThan(0);
    });

    it('should clear the active task ID if it matches', () => {
      tracker.startTask('task-1');
      tracker.endTask('task-1');
      expect(tracker.getActiveTaskId()).toBeUndefined();
    });

    it('should not clear the active task ID if it does not match', () => {
      tracker.startTask('task-1');
      tracker.startTask('task-2');
      tracker.endTask('task-1');
      expect(tracker.getActiveTaskId()).toBe('task-2');
    });

    it('should return zero usage for unknown task ID', () => {
      const summary = tracker.endTask('nonexistent');
      expect(summary.inputTokens).toBe(0);
      expect(summary.outputTokens).toBe(0);
      expect(summary.cost).toBe(0);
    });
  });

  describe('recordUsage with active task', () => {
    it('should attribute tokens to the active task', () => {
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 200, 100);
      tracker.recordUsage('gpt-4o', 300, 150);

      const summary = tracker.endTask('task-1');
      expect(summary.inputTokens).toBe(500);
      expect(summary.outputTokens).toBe(250);
    });

    it('should not attribute tokens when no task is active', () => {
      tracker.recordUsage('gpt-4o', 200, 100);
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 300, 150);

      const summary = tracker.endTask('task-1');
      // Only the second call should be attributed
      expect(summary.inputTokens).toBe(300);
      expect(summary.outputTokens).toBe(150);
    });

    it('should still accumulate session-level totals correctly', () => {
      // Record some usage outside of task
      tracker.recordUsage('gpt-4o', 100, 50);

      // Record some usage inside task
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 200, 100);
      tracker.endTask('task-1');

      // Record more usage outside of task
      tracker.recordUsage('gpt-4o', 150, 75);

      // Session totals should include all usage
      const allRecords = tracker.getRecords();
      const totalInput = allRecords.reduce((sum, r) => sum + r.inputTokens, 0);
      const totalOutput = allRecords.reduce((sum, r) => sum + r.outputTokens, 0);

      expect(totalInput).toBe(450); // 100 + 200 + 150
      expect(totalOutput).toBe(225); // 50 + 100 + 75
    });
  });

  describe('isolation between sequential tasks', () => {
    it('should report only each tasks own usage for sequential tasks', () => {
      // Task 1
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 100, 50);
      tracker.recordUsage('gpt-4o', 200, 100);
      const summary1 = tracker.endTask('task-1');

      // Task 2
      tracker.startTask('task-2');
      tracker.recordUsage('gpt-4o', 500, 250);
      const summary2 = tracker.endTask('task-2');

      // Task 1 should only have its own usage
      expect(summary1.inputTokens).toBe(300);
      expect(summary1.outputTokens).toBe(150);

      // Task 2 should only have its own usage
      expect(summary2.inputTokens).toBe(500);
      expect(summary2.outputTokens).toBe(250);

      // No bleeding between tasks
      expect(summary2.inputTokens).not.toBe(800);
    });

    it('should isolate cost calculations between tasks', () => {
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 1000, 500);
      const summary1 = tracker.endTask('task-1');

      tracker.startTask('task-2');
      tracker.recordUsage('gpt-4o', 2000, 1000);
      const summary2 = tracker.endTask('task-2');

      // Cost should be proportional to usage, not accumulated
      expect(summary2.cost).toBeGreaterThan(summary1.cost);
      // Task 2 has double the tokens, should have roughly double the cost
      expect(summary2.cost).toBeCloseTo(summary1.cost * 2, 6);
    });

    it('should handle multiple sequential tasks without accumulation', () => {
      const summaries: TaskUsageSummary[] = [];

      for (let i = 0; i < 5; i++) {
        tracker.startTask(`task-${i}`);
        tracker.recordUsage('gpt-4o', 100, 50);
        summaries.push(tracker.endTask(`task-${i}`));
      }

      // Each task should report exactly 100 input, 50 output
      for (const summary of summaries) {
        expect(summary.inputTokens).toBe(100);
        expect(summary.outputTokens).toBe(50);
      }
    });
  });

  describe('cost tracking accuracy', () => {
    it('should accumulate cost from multiple recordUsage calls within a task', () => {
      tracker.startTask('task-1');
      tracker.recordUsage('gpt-4o', 100, 50);
      tracker.recordUsage('gpt-4o-mini', 200, 100);
      const summary = tracker.endTask('task-1');

      // Calculate expected cost
      const expectedCost1 = (100 * 0.0025 + 50 * 0.01) / 1000;
      const expectedCost2 = (200 * 0.00015 + 100 * 0.0006) / 1000;
      expect(summary.cost).toBeCloseTo(expectedCost1 + expectedCost2, 8);
    });

    it('should use fallback pricing for unknown models', () => {
      tracker.startTask('task-1');
      tracker.recordUsage('unknown-model', 1000, 500);
      const summary = tracker.endTask('task-1');

      // Fallback pricing: input=0.003/1k, output=0.015/1k
      const expectedCost = (1000 * 0.003 + 500 * 0.015) / 1000;
      expect(summary.cost).toBeCloseTo(expectedCost, 8);
    });
  });
});
