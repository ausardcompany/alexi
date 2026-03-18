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
});
