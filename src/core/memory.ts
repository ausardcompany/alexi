/**
 * Persistent Memory System
 * Stores user-defined memories that persist across sessions
 * Similar to Claude's /memory feature
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { nanoid } from 'nanoid';

// ============ Type Definitions ============

export interface MemoryEntry {
  /** Unique ID for the memory */
  id: string;
  /** The memory content */
  content: string;
  /** When the memory was created */
  created: number;
  /** When the memory was last updated */
  updated: number;
  /** Optional tags for categorization */
  tags?: string[];
  /** Optional source (e.g., session ID, file path) */
  source?: string;
  /** Priority/importance (higher = more important) */
  priority?: number;
}

export interface MemorySearchOptions {
  /** Search query string */
  query?: string;
  /** Filter by tags */
  tags?: string[];
  /** Limit number of results */
  limit?: number;
  /** Sort order */
  sortBy?: 'created' | 'updated' | 'priority';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

export interface MemoryStats {
  /** Total number of memories */
  count: number;
  /** Total size in characters */
  totalSize: number;
  /** All unique tags */
  tags: string[];
  /** Oldest memory date */
  oldest?: number;
  /** Newest memory date */
  newest?: number;
}

export interface MemoryManagerOptions {
  /** Directory to store memory data */
  dataDir?: string;
  /** Maximum number of memories */
  maxMemories?: number;
}

// ============ Memory Manager Class ============

export class MemoryManager {
  private dataDir: string;
  private memoryFilePath: string;
  private memories: Map<string, MemoryEntry> = new Map();
  private maxMemories: number;

  constructor(options: MemoryManagerOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
    this.memoryFilePath = path.join(this.dataDir, 'memories.json');
    this.maxMemories = options.maxMemories || 1000;
    this.loadMemories();
  }

  /**
   * Add a new memory
   */
  add(content: string, options: { tags?: string[]; source?: string; priority?: number } = {}): MemoryEntry {
    const id = nanoid(10);
    const now = Date.now();

    const entry: MemoryEntry = {
      id,
      content: content.trim(),
      created: now,
      updated: now,
      tags: options.tags,
      source: options.source,
      priority: options.priority ?? 0,
    };

    this.memories.set(id, entry);

    // Enforce max memories limit
    if (this.memories.size > this.maxMemories) {
      this.pruneOldest();
    }

    this.saveMemories();
    return entry;
  }

  /**
   * Update an existing memory
   */
  update(id: string, content: string, options: { tags?: string[]; priority?: number } = {}): MemoryEntry | null {
    const existing = this.memories.get(id);
    if (!existing) {
      return null;
    }

    const updated: MemoryEntry = {
      ...existing,
      content: content.trim(),
      updated: Date.now(),
      tags: options.tags ?? existing.tags,
      priority: options.priority ?? existing.priority,
    };

    this.memories.set(id, updated);
    this.saveMemories();
    return updated;
  }

  /**
   * Delete a memory
   */
  delete(id: string): boolean {
    const existed = this.memories.has(id);
    if (existed) {
      this.memories.delete(id);
      this.saveMemories();
    }
    return existed;
  }

  /**
   * Get a memory by ID
   */
  get(id: string): MemoryEntry | undefined {
    return this.memories.get(id);
  }

  /**
   * Get all memories
   */
  getAll(): MemoryEntry[] {
    return Array.from(this.memories.values());
  }

  /**
   * Search memories
   */
  search(options: MemorySearchOptions = {}): MemoryEntry[] {
    let results = Array.from(this.memories.values());

    // Filter by query (simple substring match)
    if (options.query) {
      const queryLower = options.query.toLowerCase();
      results = results.filter(
        (m) =>
          m.content.toLowerCase().includes(queryLower) ||
          m.tags?.some((t) => t.toLowerCase().includes(queryLower))
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((m) => options.tags!.some((tag) => m.tags?.includes(tag)));
    }

    // Sort
    const sortBy = options.sortBy || 'updated';
    const sortOrder = options.sortOrder || 'desc';
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'created':
          comparison = a.created - b.created;
          break;
        case 'updated':
          comparison = a.updated - b.updated;
          break;
        case 'priority':
          comparison = (a.priority || 0) - (b.priority || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Limit
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get memories for context injection
   * Returns formatted string for system prompt
   */
  getContextString(limit: number = 20): string {
    const memories = this.search({
      limit,
      sortBy: 'priority',
      sortOrder: 'desc',
    });

    if (memories.length === 0) {
      return '';
    }

    const lines = memories.map((m) => `- ${m.content}`);
    return `User memories:\n${lines.join('\n')}`;
  }

  /**
   * Get memory statistics
   */
  getStats(): MemoryStats {
    const memories = Array.from(this.memories.values());
    const allTags = new Set<string>();

    let totalSize = 0;
    let oldest: number | undefined;
    let newest: number | undefined;

    for (const m of memories) {
      totalSize += m.content.length;
      m.tags?.forEach((t) => allTags.add(t));

      if (!oldest || m.created < oldest) oldest = m.created;
      if (!newest || m.created > newest) newest = m.created;
    }

    return {
      count: memories.length,
      totalSize,
      tags: Array.from(allTags),
      oldest,
      newest,
    };
  }

  /**
   * Clear all memories
   */
  clearAll(): number {
    const count = this.memories.size;
    this.memories.clear();
    this.saveMemories();
    return count;
  }

  /**
   * Import memories from a file
   */
  importFromFile(filePath: string): number {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);

      let imported = 0;
      const entries = Array.isArray(data) ? data : data.memories || [];

      for (const entry of entries) {
        if (entry.content && typeof entry.content === 'string') {
          this.add(entry.content, {
            tags: entry.tags,
            source: entry.source || filePath,
            priority: entry.priority,
          });
          imported++;
        }
      }

      return imported;
    } catch {
      return 0;
    }
  }

  /**
   * Export memories to JSON
   */
  exportToJson(): string {
    const memories = Array.from(this.memories.values());
    return JSON.stringify({ version: 1, memories }, null, 2);
  }

  /**
   * List all memories (alias for getAll)
   */
  list(): MemoryEntry[] {
    return this.getAll();
  }

  /**
   * Import a single memory with preserved ID (for data restore)
   */
  importMemory(entry: MemoryEntry): void {
    this.memories.set(entry.id, entry);
    this.saveMemories();
  }

  /**
   * Prune oldest low-priority memories
   */
  private pruneOldest(): void {
    const memories = Array.from(this.memories.values()).sort((a, b) => {
      // Sort by priority first (keep high priority), then by created date
      if ((a.priority || 0) !== (b.priority || 0)) {
        return (a.priority || 0) - (b.priority || 0);
      }
      return a.created - b.created;
    });

    // Remove oldest 10%
    const toRemove = Math.ceil(memories.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.memories.delete(memories[i].id);
    }
  }

  /**
   * Load memories from disk
   */
  private loadMemories(): void {
    try {
      if (fs.existsSync(this.memoryFilePath)) {
        const data = fs.readFileSync(this.memoryFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        const entries: MemoryEntry[] = parsed.memories || parsed || [];

        this.memories.clear();
        for (const entry of entries) {
          if (entry.id && entry.content) {
            this.memories.set(entry.id, entry);
          }
        }
      }
    } catch {
      this.memories.clear();
    }
  }

  /**
   * Save memories to disk
   */
  private saveMemories(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const data = {
        version: 1,
        updated: Date.now(),
        memories: Array.from(this.memories.values()),
      };

      fs.writeFileSync(this.memoryFilePath, JSON.stringify(data, null, 2));
    } catch {
      // Silently fail on save errors
    }
  }
}

// ============ Singleton Instance ============

let memoryManagerInstance: MemoryManager | null = null;

export function getMemoryManager(): MemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new MemoryManager();
  }
  return memoryManagerInstance;
}

export function resetMemoryManager(): void {
  memoryManagerInstance = null;
}
