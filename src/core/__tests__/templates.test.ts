/**
 * Tests for Message Templates System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TemplateManager, getTemplateManager, resetTemplateManager } from '../templates.js';

describe('TemplateManager', () => {
  let testDir: string;
  let templateManager: TemplateManager;

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-template-test-'));
    resetTemplateManager();
    templateManager = new TemplateManager({ dataDir: testDir });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetTemplateManager();
  });

  describe('initialization', () => {
    it('should initialize with default templates', () => {
      const templates = templateManager.list();

      expect(templates.length).toBeGreaterThan(0);

      // Check some default templates exist
      const names = templates.map((t) => t.name);
      expect(names).toContain('explain-code');
      expect(names).toContain('review-code');
      expect(names).toContain('fix-error');
    });

    it('should load existing templates from file', () => {
      // Write custom templates file
      const customTemplates = {
        version: 1,
        templates: [
          {
            id: 'custom-id',
            name: 'custom',
            content: 'Custom template',
            variables: [],
            created: Date.now(),
            usageCount: 0,
          },
        ],
      };
      fs.writeFileSync(path.join(testDir, 'templates.json'), JSON.stringify(customTemplates));

      // Create new manager to load from file
      const newManager = new TemplateManager({ dataDir: testDir });
      const template = newManager.get('custom');

      expect(template).toBeDefined();
      expect(template?.content).toBe('Custom template');
    });
  });

  describe('add', () => {
    it('should add a new template', () => {
      const template = templateManager.add('test-template', 'Hello {{name}}!', {
        description: 'Test template',
        category: 'test',
      });

      expect(template.id).toBeDefined();
      expect(template.name).toBe('test-template');
      expect(template.content).toBe('Hello {{name}}!');
      expect(template.description).toBe('Test template');
      expect(template.category).toBe('test');
      expect(template.variables).toEqual(['name']);
      expect(template.usageCount).toBe(0);
    });

    it('should normalize name to lowercase', () => {
      const template = templateManager.add('TestTemplate', 'content');

      expect(template.name).toBe('testtemplate');
    });

    it('should extract multiple variables', () => {
      const template = templateManager.add('multi', '{{var1}} and {{var2}} and {{var3}}');

      expect(template.variables).toEqual(['var1', 'var2', 'var3']);
    });

    it('should handle templates without variables', () => {
      const template = templateManager.add('simple', 'No variables here');

      expect(template.variables).toEqual([]);
    });

    it('should handle duplicate variable names', () => {
      const template = templateManager.add('dup', '{{name}} says {{name}}');

      expect(template.variables).toEqual(['name']);
    });
  });

  describe('get', () => {
    it('should get template by ID', () => {
      const created = templateManager.add('test', 'content');

      const found = templateManager.get(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should get template by name', () => {
      templateManager.add('mytemplate', 'content');

      const found = templateManager.get('mytemplate');

      expect(found).toBeDefined();
      expect(found?.name).toBe('mytemplate');
    });

    it('should return undefined for non-existent template', () => {
      expect(templateManager.get('nonexistent')).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update template properties', () => {
      const template = templateManager.add('original', 'old content');

      const updated = templateManager.update(template.id, {
        name: 'updated',
        content: 'new content with {{var}}',
        description: 'New description',
        category: 'new-category',
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('updated');
      expect(updated?.content).toBe('new content with {{var}}');
      expect(updated?.variables).toEqual(['var']);
      expect(updated?.description).toBe('New description');
      expect(updated?.category).toBe('new-category');
    });

    it('should preserve unspecified properties', () => {
      const template = templateManager.add('test', 'content', {
        description: 'Original',
        category: 'cat1',
      });

      const updated = templateManager.update(template.id, { name: 'new-name' });

      expect(updated?.content).toBe('content');
      expect(updated?.description).toBe('Original');
      expect(updated?.category).toBe('cat1');
    });

    it('should return null for non-existent template', () => {
      const result = templateManager.update('nonexistent', { name: 'new' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing template', () => {
      const template = templateManager.add('todelete', 'content');

      const deleted = templateManager.delete(template.id);

      expect(deleted).toBe(true);
      expect(templateManager.get(template.id)).toBeUndefined();
    });

    it('should return false for non-existent template', () => {
      const deleted = templateManager.delete('nonexistent');

      expect(deleted).toBe(false);
    });
  });

  describe('apply', () => {
    it('should substitute variables in template', () => {
      templateManager.add('greet', 'Hello {{name}}, welcome to {{place}}!');

      const result = templateManager.apply('greet', { name: 'Alice', place: 'Wonderland' });

      expect(result).toBe('Hello Alice, welcome to Wonderland!');
    });

    it('should increment usage count', () => {
      templateManager.add('test', 'Hello {{name}}');

      templateManager.apply('test', { name: 'World' });
      templateManager.apply('test', { name: 'World' });

      const template = templateManager.get('test');
      expect(template?.usageCount).toBe(2);
    });

    it('should return null for non-existent template', () => {
      const result = templateManager.apply('nonexistent', {});

      expect(result).toBeNull();
    });

    it('should leave unmatched variables as-is', () => {
      templateManager.add('partial', '{{name}} and {{other}}');

      const result = templateManager.apply('partial', { name: 'Alice' });

      expect(result).toBe('Alice and {{other}}');
    });

    it('should handle template without variables', () => {
      templateManager.add('simple', 'No variables');

      const result = templateManager.apply('simple', {});

      expect(result).toBe('No variables');
    });
  });

  describe('list', () => {
    it('should return all templates sorted by name', () => {
      // Clear defaults first
      const templates = templateManager.list();
      for (const t of templates) {
        templateManager.delete(t.id);
      }

      templateManager.add('zebra', 'z');
      templateManager.add('apple', 'a');
      templateManager.add('banana', 'b');

      const sorted = templateManager.list();

      expect(sorted[0].name).toBe('apple');
      expect(sorted[1].name).toBe('banana');
      expect(sorted[2].name).toBe('zebra');
    });
  });

  describe('search', () => {
    beforeEach(() => {
      // Clear defaults and add test templates
      const templates = templateManager.list();
      for (const t of templates) {
        templateManager.delete(t.id);
      }

      templateManager.add('code-review', 'Review code', {
        description: 'Review pull request',
        category: 'code',
      });
      templateManager.add('code-explain', 'Explain code', {
        description: 'Explain how code works',
        category: 'code',
      });
      templateManager.add('debug-error', 'Debug error', {
        description: 'Help debug errors',
        category: 'debug',
      });
    });

    it('should search by name', () => {
      const results = templateManager.search('code');

      expect(results.length).toBe(2);
    });

    it('should search by description', () => {
      const results = templateManager.search('pull request');

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('code-review');
    });

    it('should search by category', () => {
      const results = templateManager.search('debug');

      expect(results.length).toBe(1);
    });
  });

  describe('getByCategory', () => {
    it('should return templates by category', () => {
      // Clear defaults first
      const templates = templateManager.list();
      for (const t of templates) {
        templateManager.delete(t.id);
      }

      templateManager.add('t1', 'content', { category: 'cat1' });
      templateManager.add('t2', 'content', { category: 'cat1' });
      templateManager.add('t3', 'content', { category: 'cat2' });

      const results = templateManager.getByCategory('cat1');

      expect(results.length).toBe(2);
      expect(results.every((t) => t.category === 'cat1')).toBe(true);
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      // Clear defaults and add test templates
      const templates = templateManager.list();
      for (const t of templates) {
        templateManager.delete(t.id);
      }

      templateManager.add('t1', 'content', { category: 'cat1' });
      templateManager.add('t2', 'content', { category: 'cat2' });
      templateManager.add('t3', 'content', { category: 'cat1' });

      const categories = templateManager.getCategories();

      expect(categories).toContain('cat1');
      expect(categories).toContain('cat2');
      expect(categories.length).toBe(2);
    });
  });

  describe('resetToDefaults', () => {
    it('should reset to default templates', () => {
      // Add custom templates
      templateManager.add('custom1', 'content');
      templateManager.add('custom2', 'content');

      templateManager.resetToDefaults();

      const templates = templateManager.list();
      expect(templates.find((t) => t.name === 'custom1')).toBeUndefined();
      expect(templates.find((t) => t.name === 'explain-code')).toBeDefined();
    });
  });

  describe('exportToJson / importFromJson', () => {
    it('should export templates to JSON', () => {
      templateManager.add('export-test', 'content');

      const json = templateManager.exportToJson();
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.templates.find((t: any) => t.name === 'export-test')).toBeDefined();
    });

    it('should import templates from JSON', () => {
      const json = JSON.stringify({
        version: 1,
        templates: [{ name: 'imported', content: 'imported content' }],
      });

      const imported = templateManager.importFromJson(json);

      expect(imported).toBe(1);
      expect(templateManager.get('imported')).toBeDefined();
    });

    it('should handle invalid JSON gracefully', () => {
      const imported = templateManager.importFromJson('not valid json');

      expect(imported).toBe(0);
    });
  });

  describe('persistence', () => {
    it('should persist templates to file', () => {
      templateManager.add('persisted', 'content');

      // Create new manager to load from file
      const newManager = new TemplateManager({ dataDir: testDir });

      expect(newManager.get('persisted')).toBeDefined();
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      resetTemplateManager();
      const instance1 = getTemplateManager();
      const instance2 = getTemplateManager();

      expect(instance1).toBe(instance2);
    });

    it('should reset instance', () => {
      const instance1 = getTemplateManager();
      resetTemplateManager();
      const instance2 = getTemplateManager();

      expect(instance1).not.toBe(instance2);
    });
  });
});
