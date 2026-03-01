import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  MemoryManager,
  getMemoryManager,
  resetMemoryManager,
  type MemoryEntry,
} from '../memory.js';

// Mock fs module for testing
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(false),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn().mockReturnValue('{"memories": []}'),
    writeFileSync: vi.fn(),
  };
});

// Mock nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'test-id-' + Math.random().toString(36).substr(2, 9)),
}));

describe('MemoryManager', () => {
  let testDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    resetMemoryManager();
    testDir = path.join(os.tmpdir(), 'alexi-test-' + Date.now());
  });

  afterEach(() => {
    resetMemoryManager();
  });

  describe('add', () => {
    it('should add a new memory', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('Remember to use TypeScript strict mode');

      expect(entry).toBeDefined();
      expect(entry.id).toBeTruthy();
      expect(entry.content).toBe('Remember to use TypeScript strict mode');
      expect(entry.created).toBeLessThanOrEqual(Date.now());
      expect(entry.updated).toBeLessThanOrEqual(Date.now());
    });

    it('should add memory with tags', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('Always run tests before committing', {
        tags: ['workflow', 'testing'],
      });

      expect(entry.tags).toEqual(['workflow', 'testing']);
    });

    it('should add memory with source and priority', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('User prefers dark mode', {
        source: 'session-123',
        priority: 5,
      });

      expect(entry.source).toBe('session-123');
      expect(entry.priority).toBe(5);
    });

    it('should trim content', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('  content with spaces  ');

      expect(entry.content).toBe('content with spaces');
    });
  });

  describe('update', () => {
    it('should update existing memory', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const original = manager.add('Original content');
      const updated = manager.update(original.id, 'Updated content');

      expect(updated).toBeDefined();
      expect(updated!.content).toBe('Updated content');
      expect(updated!.updated).toBeGreaterThanOrEqual(original.updated);
    });

    it('should return null for non-existent memory', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const result = manager.update('non-existent-id', 'New content');

      expect(result).toBeNull();
    });

    it('should preserve tags if not provided', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const original = manager.add('Content', { tags: ['tag1', 'tag2'] });
      const updated = manager.update(original.id, 'New content');

      expect(updated!.tags).toEqual(['tag1', 'tag2']);
    });

    it('should update tags if provided', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const original = manager.add('Content', { tags: ['tag1'] });
      const updated = manager.update(original.id, 'New content', { tags: ['tag2', 'tag3'] });

      expect(updated!.tags).toEqual(['tag2', 'tag3']);
    });
  });

  describe('delete', () => {
    it('should delete existing memory', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('To be deleted');
      const result = manager.delete(entry.id);

      expect(result).toBe(true);
      expect(manager.get(entry.id)).toBeUndefined();
    });

    it('should return false for non-existent memory', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const result = manager.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('get', () => {
    it('should get memory by ID', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const entry = manager.add('Test content');
      const retrieved = manager.get(entry.id);

      expect(retrieved).toEqual(entry);
    });

    it('should return undefined for non-existent ID', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const retrieved = manager.get('non-existent-id');

      expect(retrieved).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return empty array when no memories', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const all = manager.getAll();

      expect(all).toEqual([]);
    });

    it('should return all memories', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Memory 1');
      manager.add('Memory 2');
      manager.add('Memory 3');

      const all = manager.getAll();

      expect(all).toHaveLength(3);
    });
  });

  describe('search', () => {
    it('should search by query string', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('I love TypeScript');
      manager.add('Python is great too');
      manager.add('TypeScript is my favorite');

      const results = manager.search({ query: 'TypeScript' });

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.content.includes('TypeScript'))).toBe(true);
    });

    it('should search case-insensitively', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('UPPERCASE content');
      manager.add('lowercase content');

      const results = manager.search({ query: 'CONTENT' });

      expect(results).toHaveLength(2);
    });

    it('should filter by tags', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Memory 1', { tags: ['work'] });
      manager.add('Memory 2', { tags: ['personal'] });
      manager.add('Memory 3', { tags: ['work', 'urgent'] });

      const results = manager.search({ tags: ['work'] });

      expect(results).toHaveLength(2);
    });

    it('should limit results', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      for (let i = 0; i < 10; i++) {
        manager.add(`Memory ${i}`);
      }

      const results = manager.search({ limit: 5 });

      expect(results).toHaveLength(5);
    });

    it('should sort by created date', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      // Add memories with explicit priorities to differentiate them
      // since they might be created in the same millisecond
      const first = manager.add('First', { priority: 1 });
      const second = manager.add('Second', { priority: 2 });
      const third = manager.add('Third', { priority: 3 });

      // Manually set different created timestamps for testing
      (first as any).created = 1000;
      (second as any).created = 2000;
      (third as any).created = 3000;

      const resultsDesc = manager.search({ sortBy: 'created', sortOrder: 'desc' });
      expect(resultsDesc[0].content).toBe('Third');

      const resultsAsc = manager.search({ sortBy: 'created', sortOrder: 'asc' });
      expect(resultsAsc[0].content).toBe('First');
    });

    it('should sort by priority', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Low priority', { priority: 1 });
      manager.add('High priority', { priority: 10 });
      manager.add('Medium priority', { priority: 5 });

      const results = manager.search({ sortBy: 'priority', sortOrder: 'desc' });

      expect(results[0].content).toBe('High priority');
      expect(results[2].content).toBe('Low priority');
    });

    it('should search in tags', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Memory with tag', { tags: ['important'] });
      manager.add('Memory without relevant tag', { tags: ['other'] });

      const results = manager.search({ query: 'important' });

      expect(results).toHaveLength(1);
    });
  });

  describe('getContextString', () => {
    it('should return empty string when no memories', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const context = manager.getContextString();

      expect(context).toBe('');
    });

    it('should format memories for context injection', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('User prefers TypeScript');
      manager.add('Project uses 2-space indentation');

      const context = manager.getContextString();

      expect(context).toContain('User memories:');
      expect(context).toContain('- User prefers TypeScript');
      expect(context).toContain('- Project uses 2-space indentation');
    });

    it('should respect limit parameter', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      for (let i = 0; i < 10; i++) {
        manager.add(`Memory ${i}`);
      }

      const context = manager.getContextString(3);

      // Count the number of memory lines
      const memoryLines = context.split('\n').filter((line) => line.startsWith('- '));
      expect(memoryLines).toHaveLength(3);
    });
  });

  describe('getStats', () => {
    it('should return empty stats when no memories', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const stats = manager.getStats();

      expect(stats.count).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.tags).toEqual([]);
      expect(stats.oldest).toBeUndefined();
      expect(stats.newest).toBeUndefined();
    });

    it('should return correct statistics', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Short', { tags: ['tag1'] });
      manager.add('Longer content', { tags: ['tag2'] });
      manager.add('Medium', { tags: ['tag1', 'tag3'] });

      const stats = manager.getStats();

      expect(stats.count).toBe(3);
      expect(stats.totalSize).toBe('Short'.length + 'Longer content'.length + 'Medium'.length);
      expect(stats.tags).toContain('tag1');
      expect(stats.tags).toContain('tag2');
      expect(stats.tags).toContain('tag3');
      expect(stats.tags).toHaveLength(3);
      expect(stats.oldest).toBeDefined();
      expect(stats.newest).toBeDefined();
    });
  });

  describe('clearAll', () => {
    it('should clear all memories and return count', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Memory 1');
      manager.add('Memory 2');
      manager.add('Memory 3');

      const count = manager.clearAll();

      expect(count).toBe(3);
      expect(manager.getAll()).toHaveLength(0);
    });

    it('should return 0 when already empty', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const count = manager.clearAll();

      expect(count).toBe(0);
    });
  });

  describe('exportToJson', () => {
    it('should export memories as JSON', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      manager.add('Memory 1', { tags: ['tag1'] });
      manager.add('Memory 2');

      const json = manager.exportToJson();
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.memories).toHaveLength(2);
      expect(parsed.memories[0].content).toBeDefined();
    });

    it('should export empty array when no memories', () => {
      const manager = new MemoryManager({ dataDir: testDir });

      const json = manager.exportToJson();
      const parsed = JSON.parse(json);

      expect(parsed.memories).toEqual([]);
    });
  });

  describe('getMemoryManager singleton', () => {
    it('should return the same instance', () => {
      const instance1 = getMemoryManager();
      const instance2 = getMemoryManager();

      expect(instance1).toBe(instance2);
    });

    it('should create new instance after reset', () => {
      const instance1 = getMemoryManager();
      resetMemoryManager();
      const instance2 = getMemoryManager();

      expect(instance1).not.toBe(instance2);
    });
  });

  describe('maxMemories limit', () => {
    it('should enforce max memories limit', () => {
      const manager = new MemoryManager({ dataDir: testDir, maxMemories: 5 });

      // Add more than the limit
      for (let i = 0; i < 10; i++) {
        manager.add(`Memory ${i}`);
      }

      // Should have pruned some memories
      expect(manager.getAll().length).toBeLessThanOrEqual(5);
    });
  });
});
