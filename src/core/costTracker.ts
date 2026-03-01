/**
 * Cost Tracking System
 * Tracks API usage costs based on token consumption and model pricing
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// ============ Type Definitions ============

export interface ModelPricing {
  /** Model ID (e.g., 'gpt-4o', 'anthropic--claude-4.5-sonnet') */
  modelId: string;
  /** Cost per 1000 input tokens in USD */
  inputCostPer1k: number;
  /** Cost per 1000 output tokens in USD */
  outputCostPer1k: number;
  /** Display name for the model */
  displayName: string;
}

export interface UsageRecord {
  /** Timestamp of the usage */
  timestamp: number;
  /** Session ID */
  sessionId?: string;
  /** Model used */
  modelId: string;
  /** Input tokens consumed */
  inputTokens: number;
  /** Output tokens consumed */
  outputTokens: number;
  /** Calculated cost in USD */
  cost: number;
}

export interface CostSummary {
  /** Total cost in USD */
  totalCost: number;
  /** Total input tokens */
  totalInputTokens: number;
  /** Total output tokens */
  totalOutputTokens: number;
  /** Number of API calls */
  callCount: number;
  /** Cost breakdown by model */
  byModel: Record<
    string,
    { cost: number; calls: number; inputTokens: number; outputTokens: number }
  >;
  /** Cost breakdown by date (YYYY-MM-DD) */
  byDate: Record<string, number>;
}

export interface CostTrackerOptions {
  /** Directory to store cost data */
  dataDir?: string;
  /** Maximum records to keep in memory */
  maxRecords?: number;
}

// ============ Model Pricing Data ============

/**
 * Pricing data for supported models (USD per 1000 tokens)
 * Based on public pricing as of 2024 - adjust as needed
 * SAP AI Core may have different pricing via their service
 */
export const MODEL_PRICING: ModelPricing[] = [
  // OpenAI Models
  {
    modelId: 'gpt-4o',
    displayName: 'GPT-4o',
    inputCostPer1k: 0.0025,
    outputCostPer1k: 0.01,
  },
  {
    modelId: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    inputCostPer1k: 0.00015,
    outputCostPer1k: 0.0006,
  },
  {
    modelId: 'gpt-4.1',
    displayName: 'GPT-4.1',
    inputCostPer1k: 0.002,
    outputCostPer1k: 0.008,
  },
  {
    modelId: 'gpt-4.1-mini',
    displayName: 'GPT-4.1 Mini',
    inputCostPer1k: 0.0004,
    outputCostPer1k: 0.0016,
  },
  {
    modelId: 'gpt-4.1-nano',
    displayName: 'GPT-4.1 Nano',
    inputCostPer1k: 0.0001,
    outputCostPer1k: 0.0004,
  },
  // Anthropic Models (via SAP AI Core)
  {
    modelId: 'anthropic--claude-4.5-opus',
    displayName: 'Claude 4.5 Opus',
    inputCostPer1k: 0.015,
    outputCostPer1k: 0.075,
  },
  {
    modelId: 'anthropic--claude-4.5-sonnet',
    displayName: 'Claude 4.5 Sonnet',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
  },
  {
    modelId: 'anthropic--claude-4.5-haiku',
    displayName: 'Claude 4.5 Haiku',
    inputCostPer1k: 0.0008,
    outputCostPer1k: 0.004,
  },
  {
    modelId: 'anthropic--claude-3.5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    inputCostPer1k: 0.003,
    outputCostPer1k: 0.015,
  },
  {
    modelId: 'anthropic--claude-3-haiku',
    displayName: 'Claude 3 Haiku',
    inputCostPer1k: 0.00025,
    outputCostPer1k: 0.00125,
  },
  // Google Models
  {
    modelId: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.005,
  },
  {
    modelId: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    inputCostPer1k: 0.000075,
    outputCostPer1k: 0.0003,
  },
];

// ============ Cost Tracker Class ============

export class CostTracker {
  private dataDir: string;
  private costFilePath: string;
  private records: UsageRecord[] = [];
  private maxRecords: number;
  private customPricing: Map<string, ModelPricing> = new Map();

  constructor(options: CostTrackerOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
    this.costFilePath = path.join(this.dataDir, 'cost-history.json');
    this.maxRecords = options.maxRecords || 10000;
    this.loadRecords();
  }

  /**
   * Get pricing for a model
   */
  getPricing(modelId: string): ModelPricing | undefined {
    // Check custom pricing first
    if (this.customPricing.has(modelId)) {
      return this.customPricing.get(modelId);
    }

    // Normalize model ID for matching
    const normalized = modelId.toLowerCase();

    // Try exact match first
    let pricing = MODEL_PRICING.find((p) => p.modelId.toLowerCase() === normalized);

    // Try partial match (e.g., 'claude-4.5-sonnet' matches 'anthropic--claude-4.5-sonnet')
    if (!pricing) {
      pricing = MODEL_PRICING.find(
        (p) =>
          normalized.includes(p.modelId.toLowerCase()) ||
          p.modelId.toLowerCase().includes(normalized)
      );
    }

    return pricing;
  }

  /**
   * Set custom pricing for a model
   */
  setCustomPricing(pricing: ModelPricing): void {
    this.customPricing.set(pricing.modelId, pricing);
  }

  /**
   * Calculate cost for a given usage
   */
  calculateCost(modelId: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.getPricing(modelId);

    if (!pricing) {
      // Default fallback pricing (medium tier estimate)
      return (inputTokens * 0.003 + outputTokens * 0.015) / 1000;
    }

    const inputCost = (inputTokens * pricing.inputCostPer1k) / 1000;
    const outputCost = (outputTokens * pricing.outputCostPer1k) / 1000;

    return inputCost + outputCost;
  }

  /**
   * Record API usage
   */
  recordUsage(
    modelId: string,
    inputTokens: number,
    outputTokens: number,
    sessionId?: string
  ): UsageRecord {
    const cost = this.calculateCost(modelId, inputTokens, outputTokens);

    const record: UsageRecord = {
      timestamp: Date.now(),
      sessionId,
      modelId,
      inputTokens,
      outputTokens,
      cost,
    };

    this.records.push(record);

    // Trim if too many records
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }

    // Save asynchronously to not block
    this.saveRecords().catch(() => {
      // Ignore save errors silently
    });

    return record;
  }

  /**
   * Get cost summary for a time period
   */
  getSummary(options: { since?: number; sessionId?: string } = {}): CostSummary {
    let filtered = this.records;

    if (options.since) {
      filtered = filtered.filter((r) => r.timestamp >= options.since!);
    }

    if (options.sessionId) {
      filtered = filtered.filter((r) => r.sessionId === options.sessionId);
    }

    const summary: CostSummary = {
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      callCount: filtered.length,
      byModel: {},
      byDate: {},
    };

    for (const record of filtered) {
      summary.totalCost += record.cost;
      summary.totalInputTokens += record.inputTokens;
      summary.totalOutputTokens += record.outputTokens;

      // By model
      if (!summary.byModel[record.modelId]) {
        summary.byModel[record.modelId] = {
          cost: 0,
          calls: 0,
          inputTokens: 0,
          outputTokens: 0,
        };
      }
      summary.byModel[record.modelId].cost += record.cost;
      summary.byModel[record.modelId].calls += 1;
      summary.byModel[record.modelId].inputTokens += record.inputTokens;
      summary.byModel[record.modelId].outputTokens += record.outputTokens;

      // By date
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      summary.byDate[date] = (summary.byDate[date] || 0) + record.cost;
    }

    return summary;
  }

  /**
   * Get summary for today
   */
  getTodaySummary(): CostSummary {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getSummary({ since: today.getTime() });
  }

  /**
   * Get summary for current session
   */
  getSessionSummary(sessionId: string): CostSummary {
    return this.getSummary({ sessionId });
  }

  /**
   * Get summary for this month
   */
  getMonthSummary(): CostSummary {
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);
    return this.getSummary({ since: firstOfMonth.getTime() });
  }

  /**
   * Get all-time summary
   */
  getAllTimeSummary(): CostSummary {
    return this.getSummary();
  }

  /**
   * Get recent usage records
   */
  getRecentRecords(limit: number = 10): UsageRecord[] {
    return this.records.slice(-limit);
  }

  /**
   * Format cost as currency string
   */
  formatCost(cost: number): string {
    if (cost < 0.01) {
      return `$${cost.toFixed(4)}`;
    }
    return `$${cost.toFixed(2)}`;
  }

  /**
   * Clear all cost history
   */
  clearHistory(): void {
    this.records = [];
    this.saveRecords().catch(() => {});
  }

  /**
   * Load records from disk
   */
  private loadRecords(): void {
    try {
      if (fs.existsSync(this.costFilePath)) {
        const data = fs.readFileSync(this.costFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        this.records = Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      this.records = [];
    }
  }

  /**
   * Save records to disk
   */
  private async saveRecords(): Promise<void> {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.costFilePath, JSON.stringify(this.records, null, 2));
    } catch {
      // Silently fail on save errors
    }
  }

  /**
   * Export cost data as CSV
   */
  exportToCsv(): string {
    const headers = [
      'timestamp',
      'date',
      'sessionId',
      'modelId',
      'inputTokens',
      'outputTokens',
      'cost',
    ];
    const rows = this.records.map((r) => [
      r.timestamp,
      new Date(r.timestamp).toISOString(),
      r.sessionId || '',
      r.modelId,
      r.inputTokens,
      r.outputTokens,
      r.cost.toFixed(6),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Get all usage records
   */
  getRecords(): UsageRecord[] {
    return [...this.records];
  }

  /**
   * Import a usage record (for data restore)
   */
  importRecord(record: UsageRecord): void {
    this.records.push(record);
    // Don't auto-save on each import - caller should handle batch saves
  }

  /**
   * Save records (for use after batch imports)
   */
  async save(): Promise<void> {
    await this.saveRecords();
  }
}

// ============ Singleton Instance ============

let costTrackerInstance: CostTracker | null = null;

export function getCostTracker(): CostTracker {
  if (!costTrackerInstance) {
    costTrackerInstance = new CostTracker();
  }
  return costTrackerInstance;
}

export function resetCostTracker(): void {
  costTrackerInstance = null;
}
