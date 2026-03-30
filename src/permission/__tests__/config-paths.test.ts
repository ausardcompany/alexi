/**
 * Config Path Protection Tests
 */

import { describe, it, expect } from 'vitest';
import { ConfigProtection } from '../config-paths.js';

describe('ConfigProtection', () => {
  describe('isRelative', () => {
    it('should detect .alexi directory at root', () => {
      expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.alexi/rules.json')).toBe(true);
      expect(ConfigProtection.isRelative('.alexi')).toBe(true);
    });

    it('should detect .alexi directory in subdirectories', () => {
      expect(ConfigProtection.isRelative('packages/sub/.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('src/.alexi/rules.json')).toBe(true);
    });

    it('should detect .kilocode and .opencode directories', () => {
      expect(ConfigProtection.isRelative('.kilocode/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.opencode/settings.json')).toBe(true);
    });

    it('should exclude plans directory', () => {
      expect(ConfigProtection.isRelative('.alexi/plans/feature.md')).toBe(false);
      expect(ConfigProtection.isRelative('.kilocode/plans/task.md')).toBe(false);
    });

    it('should detect root-level config files', () => {
      expect(ConfigProtection.isRelative('alexi.json')).toBe(true);
      expect(ConfigProtection.isRelative('alexi.jsonc')).toBe(true);
      expect(ConfigProtection.isRelative('kilo.json')).toBe(true);
      expect(ConfigProtection.isRelative('kilo.jsonc')).toBe(true);
      expect(ConfigProtection.isRelative('opencode.json')).toBe(true);
      expect(ConfigProtection.isRelative('opencode.jsonc')).toBe(true);
      expect(ConfigProtection.isRelative('AGENTS.md')).toBe(true);
    });

    it('should not detect root-level config files in subdirectories', () => {
      expect(ConfigProtection.isRelative('src/alexi.json')).toBe(false);
      expect(ConfigProtection.isRelative('packages/sub/kilo.json')).toBe(false);
    });

    it('should not detect non-config files', () => {
      expect(ConfigProtection.isRelative('src/index.ts')).toBe(false);
      expect(ConfigProtection.isRelative('README.md')).toBe(false);
      expect(ConfigProtection.isRelative('package.json')).toBe(false);
    });

    it('should handle paths with backslashes', () => {
      expect(ConfigProtection.isRelative('.alexi\\config.json')).toBe(true);
      expect(ConfigProtection.isRelative('src\\.alexi\\rules.json')).toBe(true);
    });
  });

  describe('isGlobalConfigDir', () => {
    it('should detect global config directory', () => {
      const home = require('os').homedir();
      const globalConfig = require('path').join(home, '.alexi');
      expect(ConfigProtection.isGlobalConfigDir(globalConfig)).toBe(true);
      expect(ConfigProtection.isGlobalConfigDir(`${globalConfig}/config.json`)).toBe(true);
    });

    it('should not detect non-global paths', () => {
      expect(ConfigProtection.isGlobalConfigDir('/tmp/alexi')).toBe(false);
      expect(ConfigProtection.isGlobalConfigDir('./alexi')).toBe(false);
    });
  });

  describe('isRequest', () => {
    it('should detect config file requests', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['.alexi/config.json'],
        })
      ).toBe(true);

      expect(
        ConfigProtection.isRequest({
          patterns: ['alexi.json'],
        })
      ).toBe(true);
    });

    it('should detect multiple patterns with config files', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['src/index.ts', '.alexi/config.json'],
        })
      ).toBe(true);
    });

    it('should not detect non-config requests', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['src/index.ts'],
        })
      ).toBe(false);

      expect(
        ConfigProtection.isRequest({
          patterns: [],
        })
      ).toBe(false);
    });

    it('should handle requests without patterns', () => {
      expect(ConfigProtection.isRequest({})).toBe(false);
    });

    it('should detect global config directory requests', () => {
      const home = require('os').homedir();
      const globalConfig = require('path').join(home, '.alexi', 'config.json');
      expect(
        ConfigProtection.isRequest({
          patterns: [globalConfig],
        })
      ).toBe(true);
    });
  });

  describe('DISABLE_ALWAYS_KEY', () => {
    it('should export the metadata key constant', () => {
      expect(ConfigProtection.DISABLE_ALWAYS_KEY).toBe('disableAlways');
    });
  });
});
