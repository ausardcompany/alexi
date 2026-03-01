/**
 * Code Snippets System
 * Store and manage reusable code snippets
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { nanoid } from 'nanoid';

// ============ Type Definitions ============

export interface CodeSnippet {
  /** Unique ID */
  id: string;
  /** Short name/identifier */
  name: string;
  /** Programming language */
  language: string;
  /** The code content */
  code: string;
  /** Description of what the snippet does */
  description?: string;
  /** Tags for categorization */
  tags?: string[];
  /** When created */
  created: number;
  /** When last used */
  lastUsed?: number;
  /** Usage count */
  usageCount: number;
}

export interface SnippetSearchOptions {
  /** Search in name and description */
  query?: string;
  /** Filter by language */
  language?: string;
  /** Filter by tags */
  tags?: string[];
  /** Limit results */
  limit?: number;
  /** Sort by */
  sortBy?: 'name' | 'created' | 'lastUsed' | 'usageCount';
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

export interface SnippetManagerOptions {
  /** Data directory */
  dataDir?: string;
  /** Maximum snippets */
  maxSnippets?: number;
}

// ============ Snippet Manager Class ============

export class SnippetManager {
  private dataDir: string;
  private snippetFilePath: string;
  private snippets: Map<string, CodeSnippet> = new Map();
  private maxSnippets: number;

  constructor(options: SnippetManagerOptions = {}) {
    this.dataDir = options.dataDir || path.join(os.homedir(), '.alexi');
    this.snippetFilePath = path.join(this.dataDir, 'snippets.json');
    this.maxSnippets = options.maxSnippets || 500;
    this.loadSnippets();
  }

  /**
   * Add a new snippet
   */
  add(
    name: string,
    code: string,
    options: { language?: string; description?: string; tags?: string[] } = {}
  ): CodeSnippet {
    const id = nanoid(10);
    const language = options.language || this.detectLanguage(code, name);

    const snippet: CodeSnippet = {
      id,
      name: name.trim(),
      language,
      code: code.trim(),
      description: options.description,
      tags: options.tags,
      created: Date.now(),
      usageCount: 0,
    };

    this.snippets.set(id, snippet);

    // Enforce max limit
    if (this.snippets.size > this.maxSnippets) {
      this.pruneLeastUsed();
    }

    this.saveSnippets();
    return snippet;
  }

  /**
   * Get snippet by ID or name
   */
  get(idOrName: string): CodeSnippet | undefined {
    // Try by ID first
    if (this.snippets.has(idOrName)) {
      return this.snippets.get(idOrName);
    }

    // Try by name (case-insensitive)
    const nameLower = idOrName.toLowerCase();
    for (const snippet of this.snippets.values()) {
      if (snippet.name.toLowerCase() === nameLower) {
        return snippet;
      }
    }

    return undefined;
  }

  /**
   * Update a snippet
   */
  update(
    id: string,
    updates: { name?: string; code?: string; language?: string; description?: string; tags?: string[] }
  ): CodeSnippet | null {
    const existing = this.snippets.get(id);
    if (!existing) {
      return null;
    }

    const updated: CodeSnippet = {
      ...existing,
      name: updates.name ?? existing.name,
      code: updates.code ?? existing.code,
      language: updates.language ?? existing.language,
      description: updates.description ?? existing.description,
      tags: updates.tags ?? existing.tags,
    };

    this.snippets.set(id, updated);
    this.saveSnippets();
    return updated;
  }

  /**
   * Delete a snippet
   */
  delete(id: string): boolean {
    const existed = this.snippets.has(id);
    if (existed) {
      this.snippets.delete(id);
      this.saveSnippets();
    }
    return existed;
  }

  /**
   * Use a snippet (copies and tracks usage)
   */
  use(idOrName: string): CodeSnippet | undefined {
    const snippet = this.get(idOrName);
    if (snippet) {
      snippet.lastUsed = Date.now();
      snippet.usageCount++;
      this.saveSnippets();
    }
    return snippet;
  }

  /**
   * List all snippets
   */
  list(): CodeSnippet[] {
    return Array.from(this.snippets.values()).sort((a, b) => b.created - a.created);
  }

  /**
   * Search snippets
   */
  search(options: SnippetSearchOptions = {}): CodeSnippet[] {
    let results = Array.from(this.snippets.values());

    // Filter by query
    if (options.query) {
      const queryLower = options.query.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(queryLower) ||
          s.description?.toLowerCase().includes(queryLower) ||
          s.code.toLowerCase().includes(queryLower)
      );
    }

    // Filter by language
    if (options.language) {
      const langLower = options.language.toLowerCase();
      results = results.filter((s) => s.language.toLowerCase() === langLower);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((s) => options.tags!.some((tag) => s.tags?.includes(tag)));
    }

    // Sort
    const sortBy = options.sortBy || 'created';
    const sortOrder = options.sortOrder || 'desc';
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = a.created - b.created;
          break;
        case 'lastUsed':
          comparison = (a.lastUsed || 0) - (b.lastUsed || 0);
          break;
        case 'usageCount':
          comparison = a.usageCount - b.usageCount;
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
   * Get all unique languages
   */
  getLanguages(): string[] {
    const languages = new Set<string>();
    for (const snippet of this.snippets.values()) {
      languages.add(snippet.language);
    }
    return Array.from(languages).sort();
  }

  /**
   * Get all unique tags
   */
  getTags(): string[] {
    const tags = new Set<string>();
    for (const snippet of this.snippets.values()) {
      snippet.tags?.forEach((t) => tags.add(t));
    }
    return Array.from(tags).sort();
  }

  /**
   * Detect language from code or filename
   */
  private detectLanguage(code: string, name: string): string {
    // Check file extension in name
    const ext = path.extname(name).toLowerCase();
    const extMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.h': 'c',
      '.hpp': 'cpp',
      '.cs': 'csharp',
      '.php': 'php',
      '.sh': 'bash',
      '.bash': 'bash',
      '.zsh': 'bash',
      '.sql': 'sql',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.xml': 'xml',
    };

    if (ext && extMap[ext]) {
      return extMap[ext];
    }

    // Try to detect from code patterns
    if (code.includes('function') || code.includes('const ') || code.includes('let ')) {
      if (code.includes(': string') || code.includes(': number') || code.includes('interface ')) {
        return 'typescript';
      }
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('class ')) {
      if (code.includes('self.') || code.includes('__init__')) {
        return 'python';
      }
    }
    if (code.includes('func ') || code.includes('package ')) {
      return 'go';
    }
    if (code.includes('fn ') || code.includes('let mut')) {
      return 'rust';
    }

    return 'text';
  }

  /**
   * Prune least used snippets
   */
  private pruneLeastUsed(): void {
    const snippets = Array.from(this.snippets.values()).sort((a, b) => {
      // Sort by usage count, then by last used
      if (a.usageCount !== b.usageCount) {
        return a.usageCount - b.usageCount;
      }
      return (a.lastUsed || 0) - (b.lastUsed || 0);
    });

    // Remove 10% least used
    const toRemove = Math.ceil(snippets.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.snippets.delete(snippets[i].id);
    }
  }

  /**
   * Export snippets to JSON
   */
  exportToJson(): string {
    return JSON.stringify(
      {
        version: 1,
        snippets: Array.from(this.snippets.values()),
      },
      null,
      2
    );
  }

  /**
   * Import snippets from JSON
   */
  importFromJson(json: string): number {
    try {
      const data = JSON.parse(json);
      const snippets = Array.isArray(data) ? data : data.snippets || [];

      let imported = 0;
      for (const snippet of snippets) {
        if (snippet.name && snippet.code) {
          this.add(snippet.name, snippet.code, {
            language: snippet.language,
            description: snippet.description,
            tags: snippet.tags,
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
   * Clear all snippets
   */
  clearAll(): number {
    const count = this.snippets.size;
    this.snippets.clear();
    this.saveSnippets();
    return count;
  }

  /**
   * Load snippets from disk
   */
  private loadSnippets(): void {
    try {
      if (fs.existsSync(this.snippetFilePath)) {
        const data = fs.readFileSync(this.snippetFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        const entries: CodeSnippet[] = parsed.snippets || parsed || [];

        this.snippets.clear();
        for (const entry of entries) {
          if (entry.id && entry.name && entry.code) {
            this.snippets.set(entry.id, entry);
          }
        }
      }
    } catch {
      this.snippets.clear();
    }
  }

  /**
   * Save snippets to disk
   */
  private saveSnippets(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      const data = {
        version: 1,
        updated: Date.now(),
        snippets: Array.from(this.snippets.values()),
      };

      fs.writeFileSync(this.snippetFilePath, JSON.stringify(data, null, 2));
    } catch {
      // Silently fail on save errors
    }
  }
}

// ============ Singleton Instance ============

let snippetManagerInstance: SnippetManager | null = null;

export function getSnippetManager(dataDir?: string): SnippetManager {
  if (!snippetManagerInstance) {
    snippetManagerInstance = new SnippetManager({ dataDir });
  }
  return snippetManagerInstance;
}

export function resetSnippetManager(): void {
  snippetManagerInstance = null;
}
