/**
 * Tests for Command Alias System
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { AliasManager, getAliasManager, resetAliasManager, DEFAULT_ALIASES } from '../aliases.js';

describe('AliasManager', () => {
  let testDir: string;
  let aliasManager: AliasManager;

  beforeEach(() => {
    // Create temp directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-alias-test-'));
    resetAliasManager();
    aliasManager = new AliasManager({ dataDir: testDir });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
    resetAliasManager();
  });

  describe('initialization', () => {
    it('should initialize with default aliases', () => {
      const aliases = aliasManager.list();
      
      expect(aliases.length).toBeGreaterThan(0);
      
      // Check some default aliases exist
      const aliasNames = aliases.map(a => a.name);
      expect(aliasNames).toContain('gpt4');
      expect(aliasNames).toContain('claude');
      expect(aliasNames).toContain('new');
    });

    it('should load existing aliases from file', () => {
      // Write custom aliases file
      const customAliases = {
        version: 1,
        aliases: [
          { name: 'custom', command: '/custom cmd', created: Date.now() },
        ],
      };
      fs.writeFileSync(
        path.join(testDir, 'aliases.json'),
        JSON.stringify(customAliases)
      );
      
      // Create new manager to load from file
      const newManager = new AliasManager({ dataDir: testDir });
      const alias = newManager.get('custom');
      
      expect(alias).toBeDefined();
      expect(alias?.command).toBe('/custom cmd');
    });
  });

  describe('set', () => {
    it('should create new alias', () => {
      const alias = aliasManager.set('myalias', '/model gpt-4o', 'My custom alias');
      
      expect(alias.name).toBe('myalias');
      expect(alias.command).toBe('/model gpt-4o');
      expect(alias.description).toBe('My custom alias');
      expect(alias.created).toBeLessThanOrEqual(Date.now());
    });

    it('should normalize alias name to lowercase', () => {
      const alias = aliasManager.set('MyAlias', '/test');
      
      expect(alias.name).toBe('myalias');
    });

    it('should add leading slash to command if missing', () => {
      const alias = aliasManager.set('test', 'model gpt-4o');
      
      expect(alias.command).toBe('/model gpt-4o');
    });

    it('should update existing alias', () => {
      aliasManager.set('test', '/command1');
      const updated = aliasManager.set('test', '/command2');
      
      expect(updated.command).toBe('/command2');
      expect(aliasManager.list().filter(a => a.name === 'test').length).toBe(1);
    });

    it('should throw on invalid alias name', () => {
      expect(() => aliasManager.set('invalid name', '/cmd')).toThrow();
      expect(() => aliasManager.set('', '/cmd')).toThrow();
      expect(() => aliasManager.set('a'.repeat(25), '/cmd')).toThrow();
    });

    it('should accept valid alias names', () => {
      expect(() => aliasManager.set('valid', '/cmd')).not.toThrow();
      expect(() => aliasManager.set('valid123', '/cmd')).not.toThrow();
      expect(() => aliasManager.set('valid_name', '/cmd')).not.toThrow();
      expect(() => aliasManager.set('valid-name', '/cmd')).not.toThrow();
    });
  });

  describe('get', () => {
    it('should get alias by name', () => {
      aliasManager.set('test', '/testcmd');
      
      const alias = aliasManager.get('test');
      
      expect(alias).toBeDefined();
      expect(alias?.command).toBe('/testcmd');
    });

    it('should be case-insensitive', () => {
      aliasManager.set('test', '/cmd');
      
      expect(aliasManager.get('TEST')).toBeDefined();
      expect(aliasManager.get('Test')).toBeDefined();
    });

    it('should return undefined for non-existent alias', () => {
      expect(aliasManager.get('nonexistent')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete existing alias', () => {
      aliasManager.set('todelete', '/cmd');
      
      const deleted = aliasManager.delete('todelete');
      
      expect(deleted).toBe(true);
      expect(aliasManager.get('todelete')).toBeUndefined();
    });

    it('should return false for non-existent alias', () => {
      const deleted = aliasManager.delete('nonexistent');
      
      expect(deleted).toBe(false);
    });
  });

  describe('list', () => {
    it('should return all aliases sorted by name', () => {
      aliasManager.set('zebra', '/z');
      aliasManager.set('apple', '/a');
      aliasManager.set('banana', '/b');
      
      const aliases = aliasManager.list();
      const customAliases = aliases.filter(a => ['zebra', 'apple', 'banana'].includes(a.name));
      
      expect(customAliases[0].name).toBe('apple');
      expect(customAliases[1].name).toBe('banana');
      expect(customAliases[2].name).toBe('zebra');
    });
  });

  describe('resolve', () => {
    it('should resolve alias to command', () => {
      aliasManager.set('g4', '/model gpt-4o');
      
      const resolved = aliasManager.resolve('/g4');
      
      expect(resolved).toBe('/model gpt-4o');
    });

    it('should append additional arguments', () => {
      aliasManager.set('m', '/model');
      
      const resolved = aliasManager.resolve('/m gpt-4o-mini');
      
      expect(resolved).toBe('/model gpt-4o-mini');
    });

    it('should return original input if not an alias', () => {
      const input = '/nonexistent command';
      
      const resolved = aliasManager.resolve(input);
      
      expect(resolved).toBe(input);
    });

    it('should return original input if not a slash command', () => {
      const input = 'regular message';
      
      const resolved = aliasManager.resolve(input);
      
      expect(resolved).toBe(input);
    });
  });

  describe('isValidAliasName', () => {
    it('should accept valid names', () => {
      expect(aliasManager.isValidAliasName('valid')).toBe(true);
      expect(aliasManager.isValidAliasName('valid123')).toBe(true);
      expect(aliasManager.isValidAliasName('valid_name')).toBe(true);
      expect(aliasManager.isValidAliasName('valid-name')).toBe(true);
      expect(aliasManager.isValidAliasName('a')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(aliasManager.isValidAliasName('')).toBe(false);
      expect(aliasManager.isValidAliasName('has space')).toBe(false);
      expect(aliasManager.isValidAliasName('has.dot')).toBe(false);
      expect(aliasManager.isValidAliasName('a'.repeat(25))).toBe(false);
    });
  });

  describe('resetToDefaults', () => {
    it('should reset to default aliases', () => {
      // Add custom aliases
      aliasManager.set('custom1', '/cmd1');
      aliasManager.set('custom2', '/cmd2');
      
      aliasManager.resetToDefaults();
      
      const aliases = aliasManager.list();
      expect(aliases.find(a => a.name === 'custom1')).toBeUndefined();
      expect(aliases.find(a => a.name === 'custom2')).toBeUndefined();
      expect(aliases.find(a => a.name === 'gpt4')).toBeDefined();
    });
  });

  describe('exportToJson / importFromJson', () => {
    it('should export aliases to JSON', () => {
      aliasManager.set('export-test', '/test');
      
      const json = aliasManager.exportToJson();
      const parsed = JSON.parse(json);
      
      expect(parsed.version).toBe(1);
      expect(parsed.aliases.find((a: any) => a.name === 'export-test')).toBeDefined();
    });

    it('should import aliases from JSON', () => {
      const json = JSON.stringify({
        version: 1,
        aliases: [
          { name: 'imported', command: '/imported-cmd' },
        ],
      });
      
      const imported = aliasManager.importFromJson(json);
      
      expect(imported).toBe(1);
      expect(aliasManager.get('imported')?.command).toBe('/imported-cmd');
    });

    it('should handle invalid JSON gracefully', () => {
      const imported = aliasManager.importFromJson('not valid json');
      
      expect(imported).toBe(0);
    });
  });

  describe('persistence', () => {
    it('should persist aliases to file', () => {
      aliasManager.set('persisted', '/persist-cmd');
      
      // Create new manager to load from file
      const newManager = new AliasManager({ dataDir: testDir });
      const alias = newManager.get('persisted');
      
      expect(alias).toBeDefined();
      expect(alias?.command).toBe('/persist-cmd');
    });
  });

  describe('singleton', () => {
    it('should return same instance', () => {
      resetAliasManager();
      const instance1 = getAliasManager();
      const instance2 = getAliasManager();
      
      expect(instance1).toBe(instance2);
    });

    it('should reset instance', () => {
      const instance1 = getAliasManager();
      resetAliasManager();
      const instance2 = getAliasManager();
      
      expect(instance1).not.toBe(instance2);
    });
  });
});
