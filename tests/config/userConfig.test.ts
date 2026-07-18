import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  CONFIG_DIR,
  CONFIG_FILE,
  ensureConfigDir,
  loadFullConfig,
  saveFullConfig,
  getConfigValue,
  setConfigValue,
  deleteConfigValue,
  getConfigDefaultModel,
  setConfigDefaultModel,
  getConfigDefaultAgent,
  setConfigDefaultAgent,
  clearConfigDefaultAgent,
  getConfigAdditionalExtensions,
  setConfigAdditionalExtensions,
  validateAdditionalExtension,
} from '../../src/config/userConfig.js';

describe('userConfig', () => {
  describe('constants', () => {
    it('CONFIG_DIR should point to ~/.alexi', () => {
      expect(CONFIG_DIR).toBe(path.join(os.homedir(), '.alexi'));
    });

    it('CONFIG_FILE should point to ~/.alexi/config.json', () => {
      expect(CONFIG_FILE).toBe(path.join(os.homedir(), '.alexi', 'config.json'));
    });
  });

  // NOTE: The following tests operate on the REAL ~/.alexi/config.json file.
  // They use a save/restore pattern to avoid destroying user data.
  // In CI this directory is typically empty, so it is safe.

  let originalContent: string | null = null;

  beforeEach(() => {
    // Snapshot the existing config (if any) so we can restore it
    try {
      originalContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
    } catch {
      originalContent = null;
    }
  });

  afterEach(() => {
    // Restore original config
    try {
      if (originalContent !== null) {
        fs.writeFileSync(CONFIG_FILE, originalContent, 'utf-8');
      } else if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Best-effort restore
    }
  });

  describe('ensureConfigDir', () => {
    it('should create the config directory if it does not exist', () => {
      ensureConfigDir();
      expect(fs.existsSync(CONFIG_DIR)).toBe(true);
    });
  });

  describe('loadFullConfig / saveFullConfig', () => {
    it('should return empty object when config file does not exist', () => {
      // Remove the file if it exists
      if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
      }
      const config = loadFullConfig();
      expect(config).toEqual({});
    });

    it('should round-trip a config object', () => {
      const data: Record<string, unknown> = {
        foo: 'bar',
        num: 42,
        nested: { a: 1 },
      };
      saveFullConfig(data);

      const loaded = loadFullConfig();
      expect(loaded).toEqual(data);
    });

    it('should return empty object for corrupted JSON', () => {
      ensureConfigDir();
      fs.writeFileSync(CONFIG_FILE, '{{not valid json', 'utf-8');
      const config = loadFullConfig();
      expect(config).toEqual({});
    });
  });

  describe('getConfigValue / setConfigValue / deleteConfigValue', () => {
    it('should get undefined for missing key', () => {
      saveFullConfig({});
      expect(getConfigValue('nonexistent')).toBeUndefined();
    });

    it('should set and get a string value', () => {
      saveFullConfig({});
      setConfigValue('myKey', 'myValue');
      expect(getConfigValue('myKey')).toBe('myValue');
    });

    it('should set and get a boolean value', () => {
      saveFullConfig({});
      setConfigValue('flag', true);
      expect(getConfigValue('flag')).toBe(true);
    });

    it('should preserve existing keys when setting a new key', () => {
      saveFullConfig({ existing: 'keep' });
      setConfigValue('added', 123);

      const config = loadFullConfig();
      expect(config.existing).toBe('keep');
      expect(config.added).toBe(123);
    });

    it('should delete a key', () => {
      saveFullConfig({ a: 1, b: 2 });
      deleteConfigValue('a');

      const config = loadFullConfig();
      expect(config.a).toBeUndefined();
      expect(config.b).toBe(2);
    });
  });

  describe('getConfigDefaultModel / setConfigDefaultModel', () => {
    it('should return undefined when no defaultModel is set', () => {
      saveFullConfig({});
      expect(getConfigDefaultModel()).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      saveFullConfig({ defaultModel: '' });
      expect(getConfigDefaultModel()).toBeUndefined();
    });

    it('should return undefined for whitespace-only string', () => {
      saveFullConfig({ defaultModel: '   ' });
      expect(getConfigDefaultModel()).toBeUndefined();
    });

    it('should return undefined for non-string values', () => {
      saveFullConfig({ defaultModel: 42 });
      expect(getConfigDefaultModel()).toBeUndefined();
    });

    it('should return trimmed model string', () => {
      saveFullConfig({ defaultModel: '  gpt-4o-mini  ' });
      expect(getConfigDefaultModel()).toBe('gpt-4o-mini');
    });

    it('should persist model via setConfigDefaultModel', () => {
      saveFullConfig({});
      setConfigDefaultModel('anthropic--claude-4.5-sonnet');
      expect(getConfigDefaultModel()).toBe('anthropic--claude-4.5-sonnet');
    });

    it('should preserve other config keys when setting default model', () => {
      saveFullConfig({ sounds: { enabled: true }, theme: 'dark' });
      setConfigDefaultModel('gpt-4.1');

      const config = loadFullConfig();
      expect(config.defaultModel).toBe('gpt-4.1');
      expect(config.theme).toBe('dark');
      expect(config.sounds).toEqual({ enabled: true });
    });
  });

  describe('getConfigDefaultAgent / setConfigDefaultAgent / clearConfigDefaultAgent', () => {
    it('should return undefined when no agent is set', () => {
      saveFullConfig({});
      expect(getConfigDefaultAgent()).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      saveFullConfig({ agent: '' });
      expect(getConfigDefaultAgent()).toBeUndefined();
    });

    it('should return undefined for whitespace-only string', () => {
      saveFullConfig({ agent: '   ' });
      expect(getConfigDefaultAgent()).toBeUndefined();
    });

    it('should return undefined for non-string values', () => {
      saveFullConfig({ agent: 42 });
      expect(getConfigDefaultAgent()).toBeUndefined();
    });

    it('should return trimmed agent slug', () => {
      saveFullConfig({ agent: '  debug  ' });
      expect(getConfigDefaultAgent()).toBe('debug');
    });

    it('should persist agent via setConfigDefaultAgent', () => {
      saveFullConfig({});
      setConfigDefaultAgent('debug');
      expect(getConfigDefaultAgent()).toBe('debug');
    });

    it('should preserve other config keys when setting default agent', () => {
      saveFullConfig({ defaultModel: 'gpt-4.1', theme: 'dark' });
      setConfigDefaultAgent('plan');

      const config = loadFullConfig();
      expect(config.agent).toBe('plan');
      expect(config.defaultModel).toBe('gpt-4.1');
      expect(config.theme).toBe('dark');
    });

    it('should clear the agent key via clearConfigDefaultAgent', () => {
      saveFullConfig({ agent: 'debug', defaultModel: 'gpt-4.1' });
      clearConfigDefaultAgent();

      const config = loadFullConfig();
      expect(config.agent).toBeUndefined();
      expect(config.defaultModel).toBe('gpt-4.1');
      expect(getConfigDefaultAgent()).toBeUndefined();
    });

    it('should be a no-op when clearing an unset agent', () => {
      saveFullConfig({ defaultModel: 'gpt-4.1' });
      expect(() => clearConfigDefaultAgent()).not.toThrow();
      expect(getConfigDefaultAgent()).toBeUndefined();
      expect(loadFullConfig().defaultModel).toBe('gpt-4.1');
    });
  });

  describe('validateAdditionalExtension', () => {
    it('should accept a well-formed extension with leading dot', () => {
      expect(validateAdditionalExtension('.proto')).toBe('.proto');
      expect(validateAdditionalExtension('.graphql')).toBe('.graphql');
      expect(validateAdditionalExtension('.tf')).toBe('.tf');
      expect(validateAdditionalExtension('.mdx')).toBe('.mdx');
    });

    it('should trim whitespace and lower-case the extension', () => {
      expect(validateAdditionalExtension('  .PROTO  ')).toBe('.proto');
    });

    it('should reject extensions without a leading dot', () => {
      expect(() => validateAdditionalExtension('proto')).toThrow(/must start with/);
      expect(() => validateAdditionalExtension('graphql')).toThrow(/must start with/);
    });

    it('should reject empty and dot-only values', () => {
      expect(() => validateAdditionalExtension('')).toThrow(/must start with/);
      expect(() => validateAdditionalExtension('.')).toThrow(/must start with/);
      expect(() => validateAdditionalExtension('..')).toThrow(/must start with/);
    });

    it('should reject extensions containing path separators or special chars', () => {
      expect(() => validateAdditionalExtension('.foo/bar')).toThrow(/must start with/);
      expect(() => validateAdditionalExtension('.foo bar')).toThrow(/must start with/);
      expect(() => validateAdditionalExtension('.foo.bar')).toThrow(/must start with/);
    });

    it('should reject non-string entries', () => {
      expect(() => validateAdditionalExtension(42 as unknown)).toThrow(/must be strings/);
      expect(() => validateAdditionalExtension(null as unknown)).toThrow(/must be strings/);
      expect(() => validateAdditionalExtension(undefined as unknown)).toThrow(/must be strings/);
    });
  });

  describe('getConfigAdditionalExtensions / setConfigAdditionalExtensions', () => {
    it('should return an empty array when unset', () => {
      saveFullConfig({});
      expect(getConfigAdditionalExtensions()).toEqual([]);
    });

    it('should return an empty array when indexing is not an object', () => {
      saveFullConfig({ indexing: 'nope' });
      expect(getConfigAdditionalExtensions()).toEqual([]);
    });

    it('should return an empty array when additionalExtensions is not an array', () => {
      saveFullConfig({ indexing: { additionalExtensions: 'proto' } });
      expect(getConfigAdditionalExtensions()).toEqual([]);
    });

    it('should silently drop invalid entries on read', () => {
      saveFullConfig({
        indexing: { additionalExtensions: ['.proto', 'graphql', 42, null, '.tf'] },
      });
      expect(getConfigAdditionalExtensions()).toEqual(['.proto', '.tf']);
    });

    it('should dedupe entries case-insensitively on read', () => {
      saveFullConfig({
        indexing: { additionalExtensions: ['.proto', '.PROTO', '.Proto', '.graphql'] },
      });
      expect(getConfigAdditionalExtensions()).toEqual(['.proto', '.graphql']);
    });

    it('should persist a list of valid extensions', () => {
      saveFullConfig({});
      setConfigAdditionalExtensions(['.proto', '.graphql', '.tf']);
      expect(getConfigAdditionalExtensions()).toEqual(['.proto', '.graphql', '.tf']);
    });

    it('should normalize extensions to lower-case on write', () => {
      saveFullConfig({});
      setConfigAdditionalExtensions(['.PROTO', '.GraphQL']);
      expect(getConfigAdditionalExtensions()).toEqual(['.proto', '.graphql']);
    });

    it('should throw when writing an invalid extension', () => {
      saveFullConfig({});
      expect(() => setConfigAdditionalExtensions(['proto'])).toThrow(/must start with/);
      // Config should not have been mutated
      const cfg = loadFullConfig();
      expect(cfg.indexing).toBeUndefined();
    });

    it('should preserve unrelated top-level keys when writing extensions', () => {
      saveFullConfig({ defaultModel: 'gpt-4.1', theme: 'dark' });
      setConfigAdditionalExtensions(['.proto']);
      const cfg = loadFullConfig();
      expect(cfg.defaultModel).toBe('gpt-4.1');
      expect(cfg.theme).toBe('dark');
      expect(cfg.indexing).toEqual({ additionalExtensions: ['.proto'] });
    });

    it('should preserve unrelated indexing.* keys when writing extensions', () => {
      saveFullConfig({ indexing: { somethingElse: true } });
      setConfigAdditionalExtensions(['.proto']);
      const cfg = loadFullConfig();
      expect(cfg.indexing).toEqual({
        somethingElse: true,
        additionalExtensions: ['.proto'],
      });
    });

    it('should throw on non-array input', () => {
      expect(() => setConfigAdditionalExtensions('proto' as unknown as string[])).toThrow(
        /must be an array/
      );
    });
  });
});
