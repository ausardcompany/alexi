/**
 * Tests for the per-model usage accessor added for the sidebar Usage
 * panel (issue #1043).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

import { CostTracker } from '../../src/core/costTracker.js';

describe('CostTracker.getModelUsage', () => {
  let tracker: CostTracker;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cost-tracker-usage-'));
    tracker = new CostTracker({ dataDir: tempDir });
  });

  it('returns an empty array when there are no records', () => {
    expect(tracker.getModelUsage()).toEqual([]);
  });

  it('combines input + output tokens into a single tokens field per model', () => {
    tracker.recordUsage('gpt-4o', 100, 50, 's1');
    tracker.recordUsage('gpt-4o', 200, 100, 's1');

    const usage = tracker.getModelUsage();
    expect(usage).toHaveLength(1);
    expect(usage[0].model).toBe('gpt-4o');
    expect(usage[0].tokens).toBe(450); // 100 + 50 + 200 + 100
    expect(usage[0].cost).toBeGreaterThan(0);
  });

  it('reports one entry per distinct model id', () => {
    tracker.recordUsage('gpt-4o', 100, 50, 's1');
    tracker.recordUsage('gpt-4o-mini', 300, 150, 's1');
    tracker.recordUsage('anthropic--claude-4.5-sonnet', 500, 250, 's1');

    const usage = tracker.getModelUsage();
    const models = usage.map((u) => u.model).sort();
    expect(models).toEqual(['anthropic--claude-4.5-sonnet', 'gpt-4o', 'gpt-4o-mini']);
  });

  it('filters by sessionId when provided', () => {
    tracker.recordUsage('gpt-4o', 100, 50, 'session-a');
    tracker.recordUsage('gpt-4o', 200, 100, 'session-b');

    const usageA = tracker.getModelUsage({ sessionId: 'session-a' });
    expect(usageA).toHaveLength(1);
    expect(usageA[0].tokens).toBe(150);

    const usageB = tracker.getModelUsage({ sessionId: 'session-b' });
    expect(usageB).toHaveLength(1);
    expect(usageB[0].tokens).toBe(300);
  });
});

describe('CostTracker.getModelDisplayName', () => {
  let tracker: CostTracker;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cost-tracker-display-'));
    tracker = new CostTracker({ dataDir: tempDir });
  });

  it('returns the pricing entry display name for known models', () => {
    expect(tracker.getModelDisplayName('gpt-4o')).toBe('GPT-4o');
    expect(tracker.getModelDisplayName('anthropic--claude-4.5-sonnet')).toBe('Claude 4.5 Sonnet');
  });

  it('falls back to the raw id for unknown models', () => {
    expect(tracker.getModelDisplayName('some-unknown-model-id')).toBe('some-unknown-model-id');
  });
});
