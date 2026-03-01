/**
 * Data Export/Import System
 * Handles export and import of sessions, configs, memories, and cost data
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { type Session } from './sessionManager.js';
import { getCostTracker, type UsageRecord } from './costTracker.js';
import { getMemoryManager, type MemoryEntry } from './memory.js';

// ============ Type Definitions ============

export interface ExportOptions {
  /** Include sessions */
  includeSessions?: boolean;
  /** Include memories */
  includeMemories?: boolean;
  /** Include cost history */
  includeCosts?: boolean;
  /** Include configuration */
  includeConfig?: boolean;
  /** Session IDs to export (if not specified, exports all) */
  sessionIds?: string[];
  /** Export format */
  format?: 'json' | 'markdown' | 'csv';
}

export interface ImportOptions {
  /** Merge with existing data or replace */
  mode?: 'merge' | 'replace';
  /** Skip existing items when merging */
  skipExisting?: boolean;
}

export interface ExportedData {
  /** Export metadata */
  metadata: {
    version: string;
    exportedAt: number;
    source: string;
  };
  /** Exported sessions */
  sessions?: Session[];
  /** Exported memories */
  memories?: MemoryEntry[];
  /** Exported cost records */
  costs?: UsageRecord[];
  /** Exported configuration */
  config?: Record<string, unknown>;
}

export interface ImportResult {
  /** Whether import was successful */
  success: boolean;
  /** Number of items imported */
  imported: {
    sessions: number;
    memories: number;
    costs: number;
    config: boolean;
  };
  /** Errors encountered */
  errors: string[];
  /** Warnings */
  warnings: string[];
}

// ============ Data Exporter Class ============

export class DataExporter {
  private dataDir: string;
  private version = '1.0.0';

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.join(os.homedir(), '.alexi');
  }

  /**
   * Export data to JSON format
   */
  async exportToJson(options: ExportOptions = {}): Promise<ExportedData> {
    const {
      includeSessions = true,
      includeMemories = true,
      includeCosts = true,
      includeConfig = true,
      sessionIds,
    } = options;

    const exportData: ExportedData = {
      metadata: {
        version: this.version,
        exportedAt: Date.now(),
        source: 'alexi-cli',
      },
    };

    // Export sessions
    if (includeSessions) {
      exportData.sessions = this.exportSessions(sessionIds);
    }

    // Export memories
    if (includeMemories) {
      exportData.memories = this.exportMemories();
    }

    // Export costs
    if (includeCosts) {
      exportData.costs = this.exportCosts();
    }

    // Export config
    if (includeConfig) {
      exportData.config = this.exportConfig();
    }

    return exportData;
  }

  /**
   * Export sessions
   */
  private exportSessions(sessionIds?: string[]): Session[] {
    const sessionsDir = path.join(this.dataDir, 'sessions');
    const sessions: Session[] = [];

    if (!fs.existsSync(sessionsDir)) {
      return sessions;
    }

    const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      try {
        const filePath = path.join(sessionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const session = JSON.parse(content) as Session;

        // Filter by session IDs if specified
        if (sessionIds && sessionIds.length > 0) {
          if (!sessionIds.includes(session.metadata.id)) {
            continue;
          }
        }

        sessions.push(session);
      } catch {
        // Skip invalid session files
      }
    }

    // Sort by creation date, newest first
    return sessions.sort((a, b) => b.metadata.created - a.metadata.created);
  }

  /**
   * Export memories
   */
  private exportMemories(): MemoryEntry[] {
    const memoryManager = getMemoryManager();
    return memoryManager.list();
  }

  /**
   * Export cost records
   */
  private exportCosts(): UsageRecord[] {
    const costTracker = getCostTracker();
    return costTracker.getRecords();
  }

  /**
   * Export configuration
   */
  private exportConfig(): Record<string, unknown> {
    const configPath = path.join(this.dataDir, 'config.json');

    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(content);
      } catch {
        return {};
      }
    }

    return {};
  }

  /**
   * Export data to a file
   */
  async exportToFile(filePath: string, options: ExportOptions = {}): Promise<void> {
    const format = options.format || this.detectFormat(filePath);

    switch (format) {
      case 'json':
        await this.exportJsonFile(filePath, options);
        break;
      case 'markdown':
        await this.exportMarkdownFile(filePath, options);
        break;
      case 'csv':
        await this.exportCsvFile(filePath, options);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export to JSON file
   */
  private async exportJsonFile(filePath: string, options: ExportOptions): Promise<void> {
    const data = await this.exportToJson(options);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Export to Markdown file
   */
  private async exportMarkdownFile(filePath: string, options: ExportOptions): Promise<void> {
    const data = await this.exportToJson(options);
    const markdown = this.dataToMarkdown(data);
    fs.writeFileSync(filePath, markdown, 'utf-8');
  }

  /**
   * Export to CSV file
   */
  private async exportCsvFile(filePath: string, options: ExportOptions): Promise<void> {
    const data = await this.exportToJson(options);
    const csv = this.dataToCsv(data);
    fs.writeFileSync(filePath, csv, 'utf-8');
  }

  /**
   * Convert export data to Markdown format
   */
  private dataToMarkdown(data: ExportedData): string {
    const lines: string[] = [];

    lines.push('# Alexi Export');
    lines.push('');
    lines.push(`Exported: ${new Date(data.metadata.exportedAt).toISOString()}`);
    lines.push(`Version: ${data.metadata.version}`);
    lines.push('');

    // Sessions
    if (data.sessions && data.sessions.length > 0) {
      lines.push('## Sessions');
      lines.push('');

      for (const session of data.sessions) {
        lines.push(`### Session: ${session.metadata.title || session.metadata.id.slice(0, 8)}`);
        lines.push('');
        lines.push(`- **ID:** ${session.metadata.id}`);
        lines.push(`- **Created:** ${new Date(session.metadata.created).toISOString()}`);
        lines.push(`- **Messages:** ${session.metadata.messageCount}`);
        lines.push(`- **Tokens:** ${session.metadata.totalTokens}`);
        lines.push('');

        for (const msg of session.messages) {
          lines.push(`**${msg.role.toUpperCase()}:**`);
          lines.push('');
          lines.push(msg.content);
          lines.push('');
        }
        lines.push('---');
        lines.push('');
      }
    }

    // Memories
    if (data.memories && data.memories.length > 0) {
      lines.push('## Memories');
      lines.push('');

      for (const memory of data.memories) {
        lines.push(`### ${memory.id}`);
        lines.push('');
        lines.push(memory.content);
        if (memory.tags && memory.tags.length > 0) {
          lines.push('');
          lines.push(`Tags: ${memory.tags.join(', ')}`);
        }
        lines.push('');
      }
    }

    // Cost Summary
    if (data.costs && data.costs.length > 0) {
      lines.push('## Cost Summary');
      lines.push('');

      const totalCost = data.costs.reduce((sum, r) => sum + r.cost, 0);
      const totalInput = data.costs.reduce((sum, r) => sum + r.inputTokens, 0);
      const totalOutput = data.costs.reduce((sum, r) => sum + r.outputTokens, 0);

      lines.push(`- **Total Cost:** $${totalCost.toFixed(4)}`);
      lines.push(`- **Total Input Tokens:** ${totalInput.toLocaleString()}`);
      lines.push(`- **Total Output Tokens:** ${totalOutput.toLocaleString()}`);
      lines.push(`- **API Calls:** ${data.costs.length}`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Convert export data to CSV format (cost records only)
   */
  private dataToCsv(data: ExportedData): string {
    const lines: string[] = [];

    // Cost records CSV
    if (data.costs && data.costs.length > 0) {
      lines.push('timestamp,date,sessionId,modelId,inputTokens,outputTokens,cost');

      for (const record of data.costs) {
        const date = new Date(record.timestamp).toISOString();
        const row = [
          record.timestamp,
          date,
          record.sessionId || '',
          record.modelId,
          record.inputTokens,
          record.outputTokens,
          record.cost.toFixed(6),
        ];
        lines.push(row.join(','));
      }
    }

    return lines.join('\n');
  }

  /**
   * Detect format from file extension
   */
  private detectFormat(filePath: string): 'json' | 'markdown' | 'csv' {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.json':
        return 'json';
      case '.md':
      case '.markdown':
        return 'markdown';
      case '.csv':
        return 'csv';
      default:
        return 'json';
    }
  }

  /**
   * Import data from JSON
   */
  async importFromJson(data: ExportedData, options: ImportOptions = {}): Promise<ImportResult> {
    const { mode = 'merge', skipExisting = true } = options;

    const result: ImportResult = {
      success: true,
      imported: {
        sessions: 0,
        memories: 0,
        costs: 0,
        config: false,
      },
      errors: [],
      warnings: [],
    };

    // Validate version
    if (!data.metadata?.version) {
      result.errors.push('Invalid export file: missing version');
      result.success = false;
      return result;
    }

    // Import sessions
    if (data.sessions) {
      try {
        result.imported.sessions = await this.importSessions(data.sessions, mode, skipExisting);
      } catch (err) {
        result.errors.push(`Failed to import sessions: ${err}`);
      }
    }

    // Import memories
    if (data.memories) {
      try {
        result.imported.memories = await this.importMemories(data.memories, mode, skipExisting);
      } catch (err) {
        result.errors.push(`Failed to import memories: ${err}`);
      }
    }

    // Import costs
    if (data.costs) {
      try {
        result.imported.costs = await this.importCosts(data.costs, mode);
      } catch (err) {
        result.errors.push(`Failed to import costs: ${err}`);
      }
    }

    // Import config
    if (data.config) {
      try {
        await this.importConfig(data.config, mode);
        result.imported.config = true;
      } catch (err) {
        result.errors.push(`Failed to import config: ${err}`);
      }
    }

    result.success = result.errors.length === 0;
    return result;
  }

  /**
   * Import sessions
   */
  private async importSessions(
    sessions: Session[],
    mode: 'merge' | 'replace',
    skipExisting: boolean
  ): Promise<number> {
    const sessionsDir = path.join(this.dataDir, 'sessions');

    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }

    // If replace mode, clear existing sessions
    if (mode === 'replace') {
      const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        fs.unlinkSync(path.join(sessionsDir, file));
      }
    }

    let imported = 0;
    for (const session of sessions) {
      const sessionPath = path.join(sessionsDir, `${session.metadata.id}.json`);

      if (skipExisting && fs.existsSync(sessionPath)) {
        continue;
      }

      fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
      imported++;
    }

    return imported;
  }

  /**
   * Import memories
   */
  private async importMemories(
    memories: MemoryEntry[],
    mode: 'merge' | 'replace',
    skipExisting: boolean
  ): Promise<number> {
    const memoryManager = getMemoryManager();

    // If replace mode, clear existing memories
    if (mode === 'replace') {
      const existing = memoryManager.list();
      for (const memory of existing) {
        memoryManager.delete(memory.id);
      }
    }

    let imported = 0;
    for (const memory of memories) {
      // Check if memory already exists
      const existing = memoryManager.get(memory.id);
      if (skipExisting && existing) {
        continue;
      }

      // Add or update memory
      if (existing) {
        memoryManager.update(memory.id, memory.content);
      } else {
        // Use the import method that preserves ID
        memoryManager.importMemory(memory);
      }
      imported++;
    }

    return imported;
  }

  /**
   * Import cost records
   */
  private async importCosts(records: UsageRecord[], mode: 'merge' | 'replace'): Promise<number> {
    const costTracker = getCostTracker();

    if (mode === 'replace') {
      costTracker.clearHistory();
    }

    // Import records
    for (const record of records) {
      costTracker.importRecord(record);
    }

    // Save after all imports
    await costTracker.save();

    return records.length;
  }

  /**
   * Import configuration
   */
  private async importConfig(
    config: Record<string, unknown>,
    mode: 'merge' | 'replace'
  ): Promise<void> {
    const configPath = path.join(this.dataDir, 'config.json');

    let finalConfig: Record<string, unknown> = {};

    if (mode === 'merge' && fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        finalConfig = JSON.parse(content);
      } catch {
        // Start fresh if existing config is invalid
      }
    }

    // Merge or replace
    finalConfig = mode === 'merge' ? { ...finalConfig, ...config } : config;

    // Ensure directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2), 'utf-8');
  }

  /**
   * Import from file
   */
  async importFromFile(filePath: string, options: ImportOptions = {}): Promise<ImportResult> {
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        imported: { sessions: 0, memories: 0, costs: 0, config: false },
        errors: [`File not found: ${filePath}`],
        warnings: [],
      };
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content) as ExportedData;
      return this.importFromJson(data, options);
    } catch (err) {
      return {
        success: false,
        imported: { sessions: 0, memories: 0, costs: 0, config: false },
        errors: [`Failed to parse import file: ${err}`],
        warnings: [],
      };
    }
  }
}

// ============ Singleton Instance ============

let dataExporterInstance: DataExporter | null = null;

export function getDataExporter(dataDir?: string): DataExporter {
  if (!dataExporterInstance) {
    dataExporterInstance = new DataExporter(dataDir);
  }
  return dataExporterInstance;
}

export function resetDataExporter(): void {
  dataExporterInstance = null;
}
