/**
 * Tests for Code Snippets System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { SnippetManager, getSnippetManager, resetSnippetManager } from '../snippets.js';

describe('SnippetManager', () => {
  let testDir: string;
  let snippetManager: SnippetManager;

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-snippet-test-'));
    resetSnippetManager();
    snippetManager = new SnippetManager({ dataDir: testDir });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetSnippetManager();
  });

  describe('add', () => {
    it('should add a new snippet', () => {
      const snippet = snippetManager.add('hello', 'console.log("Hello")', {
        language: 'javascript',
        description: 'Hello world snippet',
        tags: ['example'],
      });
      
      expect(snippet.id).toBeDefined();
      expect(snippet.name).toBe('hello');
      expect(snippet.code).toBe('console.log("Hello")');
      expect(snippet.language).toBe('javascript');
      expect(snippet.description).toBe('Hello world snippet');
      expect(snippet.tags).toEqual(['example']);
      expect(snippet.usageCount).toBe(0);
    });

    it('should auto-detect language from file extension in name', () => {
      const tsSnippet = snippetManager.add('example.ts', 'const x: number = 1');
      const pySnippet = snippetManager.add('example.py', 'def hello(): pass');
      
      expect(tsSnippet.language).toBe('typescript');
      expect(pySnippet.language).toBe('python');
    });

    it('should auto-detect language from code patterns', () => {
      const tsCode = 'function greet(name: string): void {}';
      const goCode = 'func main() { fmt.Println("hello") }';
      
      const tsSnippet = snippetManager.add('ts-snippet', tsCode);
      const goSnippet = snippetManager.add('go-snippet', goCode);
      
      expect(tsSnippet.language).toBe('typescript');
      expect(goSnippet.language).toBe('go');
    });

    it('should trim code content', () => {
      const snippet = snippetManager.add('trimmed', '  code  ');
      
      expect(snippet.code).toBe('code');
    });
  });

  describe('get', () => {
    it('should get snippet by ID', () => {
      const created = snippetManager.add('test', 'code');
      
      const found = snippetManager.get(created.id);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should get snippet by name (case-insensitive)', () => {
      snippetManager.add('TestSnippet', 'code');
      
      expect(snippetManager.get('testsnippet')).toBeDefined();
      expect(snippetManager.get('TESTSNIPPET')).toBeDefined();
    });

    it('should return undefined for non-existent snippet', () => {
      expect(snippetManager.get('nonexistent')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update snippet properties', () => {
      const snippet = snippetManager.add('original', 'old code', { language: 'text' });
      
      const updated = snippetManager.update(snippet.id, {
        name: 'updated',
        code: 'new code',
        language: 'javascript',
        description: 'Updated description',
      });
      
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('updated');
      expect(updated?.code).toBe('new code');
      expect(updated?.language).toBe('javascript');
      expect(updated?.description).toBe('Updated description');
    });

    it('should preserve unspecified properties', () => {
      const snippet = snippetManager.add('test', 'code', {
        language: 'javascript',
        description: 'Original',
        tags: ['tag1'],
      });
      
      const updated = snippetManager.update(snippet.id, { name: 'new-name' });
      
      expect(updated?.code).toBe('code');
      expect(updated?.language).toBe('javascript');
      expect(updated?.description).toBe('Original');
      expect(updated?.tags).toEqual(['tag1']);
    });

    it('should return null for non-existent snippet', () => {
      const result = snippetManager.update('nonexistent', { name: 'new' });
      
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing snippet', () => {
      const snippet = snippetManager.add('todelete', 'code');
      
      const deleted = snippetManager.delete(snippet.id);
      
      expect(deleted).toBe(true);
      expect(snippetManager.get(snippet.id)).toBeUndefined();
    });

    it('should return false for non-existent snippet', () => {
      const deleted = snippetManager.delete('nonexistent');
      
      expect(deleted).toBe(false);
    });
  });

  describe('use', () => {
    it('should increment usage count and update lastUsed', () => {
      const snippet = snippetManager.add('test', 'code');
      const beforeUse = Date.now();
      
      const used = snippetManager.use(snippet.id);
      
      expect(used?.usageCount).toBe(1);
      expect(used?.lastUsed).toBeGreaterThanOrEqual(beforeUse);
    });

    it('should return snippet content', () => {
      snippetManager.add('test', 'const x = 1');
      
      const used = snippetManager.use('test');
      
      expect(used?.code).toBe('const x = 1');
    });

    it('should return undefined for non-existent snippet', () => {
      const result = snippetManager.use('nonexistent');
      
      expect(result).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return all snippets sorted by creation date (newest first)', async () => {
      snippetManager.add('first', 'code1');
      await new Promise(resolve => setTimeout(resolve, 10)); // Ensure different timestamps
      snippetManager.add('second', 'code2');
      await new Promise(resolve => setTimeout(resolve, 10));
      snippetManager.add('third', 'code3');
      
      const snippets = snippetManager.list();
      
      expect(snippets.length).toBe(3);
      expect(snippets[0].name).toBe('third');
      expect(snippets[2].name).toBe('first');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      snippetManager.add('hello-js', 'console.log("hello")', { language: 'javascript', tags: ['logging'] });
      snippetManager.add('hello-py', 'print("hello")', { language: 'python', tags: ['logging'] });
      snippetManager.add('fetch-api', 'fetch(url)', { language: 'javascript', description: 'HTTP fetch', tags: ['http'] });
    });

    it('should search by query in name, description, and code', () => {
      const results = snippetManager.search({ query: 'hello' });
      
      expect(results.length).toBe(2);
    });

    it('should filter by language', () => {
      const results = snippetManager.search({ language: 'javascript' });
      
      expect(results.length).toBe(2);
      expect(results.every(s => s.language === 'javascript')).toBe(true);
    });

    it('should filter by tags', () => {
      const results = snippetManager.search({ tags: ['http'] });
      
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('fetch-api');
    });

    it('should sort results', () => {
      snippetManager.use('hello-js');
      snippetManager.use('hello-js');
      snippetManager.use('hello-py');
      
      const byUsage = snippetManager.search({ sortBy: 'usageCount', sortOrder: 'desc' });
      
      expect(byUsage[0].name).toBe('hello-js');
    });

    it('should limit results', () => {
      const results = snippetManager.search({ limit: 1 });
      
      expect(results.length).toBe(1);
    });
  });

  describe('getLanguages', () => {
    it('should return all unique languages', () => {
      snippetManager.add('js', 'code', { language: 'javascript' });
      snippetManager.add('py', 'code', { language: 'python' });
      snippetManager.add('ts', 'code', { language: 'typescript' });
      snippetManager.add('js2', 'code', { language: 'javascript' });
      
      const languages = snippetManager.getLanguages();
      
      expect(languages).toContain('javascript');
      expect(languages).toContain('python');
      expect(languages).toContain('typescript');
      expect(languages.length).toBe(3);
    });
  });

  describe('getTags', () => {
    it('should return all unique tags', () => {
      snippetManager.add('s1', 'code', { tags: ['tag1', 'tag2'] });
      snippetManager.add('s2', 'code', { tags: ['tag2', 'tag3'] });
      
      const tags = snippetManager.getTags();
      
      expect(tags).toContain('tag1');
      expect(tags).toContain('tag2');
      expect(tags).toContain('tag3');
      expect(tags.length).toBe(3);
    });
  });

  describe('exportToJson / importFromJson', () => {
    it('should export snippets to JSON', () => {
      snippetManager.add('export-test', 'code', { language: 'javascript' });
      
      const json = snippetManager.exportToJson();
      const parsed = JSON.parse(json);
      
      expect(parsed.version).toBe(1);
      expect(parsed.snippets.find((s: any) => s.name === 'export-test')).toBeDefined();
    });

    it('should import snippets from JSON', () => {
      const json = JSON.stringify({
        version: 1,
        snippets: [
          { name: 'imported', code: 'imported code', language: 'text' },
        ],
      });
      
      const imported = snippetManager.importFromJson(json);
      
      expect(imported).toBe(1);
      expect(snippetManager.get('imported')).toBeDefined();
    });

    it('should handle invalid JSON gracefully', () => {
      const imported = snippetManager.importFromJson('not valid json');
      
      expect(imported).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should remove all snippets', () => {
      snippetManager.add('s1', 'code');
      snippetManager.add('s2', 'code');
      
      const count = snippetManager.clearAll();
      
      expect(count).toBe(2);
      expect(snippetManager.list().length).toBe(0);
    });
  });

  describe('persistence', () => {
    it('should persist snippets to file', () => {
      snippetManager.add('persisted', 'code');
      
      // Create new manager to load from file
      const newManager = new SnippetManager({ dataDir: testDir });
      
      expect(newManager.get('persisted')).toBeDefined();
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      resetSnippetManager();
      const instance1 = getSnippetManager();
      const instance2 = getSnippetManager();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset instance', () => {
      const instance1 = getSnippetManager();
      resetSnippetManager();
      const instance2 = getSnippetManager();
      
      expect(instance1).not.toBe(instance2);
    });
  });
});
