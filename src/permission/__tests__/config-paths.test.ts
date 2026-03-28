/**
 * Config Path Protection Tests
 * Verifies that configuration file paths are correctly identified and protected
 */

import { describe, it, expect } from 'vitest';
import { ConfigProtection } from '../config-paths.js';

describe('ConfigProtection', () => {
  describe('isRelative', () => {
    it('should detect .alexi config directory', () => {
      expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.alexi/')).toBe(true);
      expect(ConfigProtection.isRelative('.alexi')).toBe(true);
    });

    it('should detect nested config directories', () => {
      expect(ConfigProtection.isRelative('packages/sub/.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('src/.kilocode/settings.json')).toBe(true);
    });

    it('should detect root-level config files', () => {
      expect(ConfigProtection.isRelative('alexi.json')).toBe(true);
      expect(ConfigProtection.isRelative('alexi.jsonc')).toBe(true);
      expect(ConfigProtection.isRelative('AGENTS.md')).toBe(true);
      expect(ConfigProtection.isRelative('kilo.json')).toBe(true);
    });

    it('should exclude plan directories', () => {
      expect(ConfigProtection.isRelative('.alexi/plans/feature.md')).toBe(false);
      expect(ConfigProtection.isRelative('.kilocode/plans/task.md')).toBe(false);
    });

    it('should not detect regular files', () => {
      expect(ConfigProtection.isRelative('src/index.ts')).toBe(false);
      expect(ConfigProtection.isRelative('README.md')).toBe(false);
      expect(ConfigProtection.isRelative('package.json')).toBe(false);
    });

    it('should handle various path formats', () => {
      expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.alexi\\config.json')).toBe(true); // Windows-style
      expect(ConfigProtection.isRelative('./alexi.json')).toBe(true);
    });
  });

  describe('isAbsolute', () => {
    const cwd = process.cwd();

    it('should detect absolute paths to config files within project', () => {
      const configPath = `${cwd}/.alexi/config.json`;
      expect(ConfigProtection.isAbsolute(configPath, cwd)).toBe(true);
    });

    it('should detect absolute paths to root config files', () => {
      const configPath = `${cwd}/alexi.json`;
      expect(ConfigProtection.isAbsolute(configPath, cwd)).toBe(true);
    });

    it('should not detect regular files', () => {
      const regularPath = `${cwd}/src/index.ts`;
      expect(ConfigProtection.isAbsolute(regularPath, cwd)).toBe(false);
    });

    it('should detect global config directory', () => {
      const homeDir = require('os').homedir();
      const globalConfigPath = `${homeDir}/.alexi/config.json`;
      expect(ConfigProtection.isAbsolute(globalConfigPath, cwd)).toBe(true);
    });
  });

  describe('isRequest', () => {
    it('should detect write permission requests for config files', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'write',
          patterns: ['.alexi/config.json'],
        })
      ).toBe(true);
    });

    it('should detect edit permission requests for config files', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'edit',
          patterns: ['alexi.json'],
        })
      ).toBe(true);
    });

    it('should detect delete permission requests for config files', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'delete',
          patterns: ['AGENTS.md'],
        })
      ).toBe(true);
    });

    it('should not detect read permission requests', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'read',
          patterns: ['.alexi/config.json'],
        })
      ).toBe(false);
    });

    it('should not detect write requests for non-config files', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'write',
          patterns: ['src/index.ts'],
        })
      ).toBe(false);
    });

    it('should handle multiple patterns', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'write',
          patterns: ['src/index.ts', '.alexi/config.json', 'README.md'],
        })
      ).toBe(true);
    });

    it('should return false when no patterns provided', () => {
      expect(
        ConfigProtection.isRequest({
          permission: 'write',
        })
      ).toBe(false);
    });
  });

  describe('DISABLE_ALWAYS_KEY', () => {
    it('should export the metadata key constant', () => {
      expect(ConfigProtection.DISABLE_ALWAYS_KEY).toBe('disableAlways');
    });
  });
});
