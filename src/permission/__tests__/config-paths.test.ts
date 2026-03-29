/**
 * Config Path Protection Tests
 * Verify that config files are properly detected and protected
 */

import { describe, it, expect } from 'vitest';
import { ConfigProtection } from '../config-paths.js';

describe('ConfigProtection', () => {
  describe('isRelative', () => {
    it('should detect config directories', () => {
      expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.kilo/settings.json')).toBe(true);
      expect(ConfigProtection.isRelative('.kilocode/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('.opencode/settings.json')).toBe(true);
    });

    it('should detect nested config directories', () => {
      expect(ConfigProtection.isRelative('packages/sub/.alexi/config.json')).toBe(true);
      expect(ConfigProtection.isRelative('apps/frontend/.kilo/settings.json')).toBe(true);
    });

    it('should detect root-level config files', () => {
      expect(ConfigProtection.isRelative('alexi.json')).toBe(true);
      expect(ConfigProtection.isRelative('alexi.jsonc')).toBe(true);
      expect(ConfigProtection.isRelative('AGENTS.md')).toBe(true);
      expect(ConfigProtection.isRelative('kilo.json')).toBe(true);
    });

    it('should exclude plans directories', () => {
      expect(ConfigProtection.isRelative('.alexi/plans/feature-plan.md')).toBe(false);
      expect(ConfigProtection.isRelative('.kilo/plans/task.md')).toBe(false);
    });

    it('should not detect regular files', () => {
      expect(ConfigProtection.isRelative('src/index.ts')).toBe(false);
      expect(ConfigProtection.isRelative('README.md')).toBe(false);
      expect(ConfigProtection.isRelative('package.json')).toBe(false);
    });

    it('should handle bare directory names', () => {
      expect(ConfigProtection.isRelative('.alexi')).toBe(true);
      expect(ConfigProtection.isRelative('.kilo')).toBe(true);
    });
  });

  describe('isRequest', () => {
    it('should detect write operations on config files', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['alexi.json'],
          permission: 'write',
        })
      ).toBe(true);

      expect(
        ConfigProtection.isRequest({
          patterns: ['.alexi/config.json'],
          permission: 'edit',
        })
      ).toBe(true);
    });

    it('should not protect read operations', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['alexi.json'],
          permission: 'read',
        })
      ).toBe(false);
    });

    it('should protect multiple patterns if any is config', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['src/index.ts', 'alexi.json'],
          permission: 'write',
        })
      ).toBe(true);
    });

    it('should not protect non-config files', () => {
      expect(
        ConfigProtection.isRequest({
          patterns: ['src/index.ts'],
          permission: 'write',
        })
      ).toBe(false);
    });
  });
});
