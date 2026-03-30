/**
 * Built-in Skills Tests
 */

import { describe, it, expect } from 'vitest';
import { BuiltinSkills } from '../builtin.js';

describe('BuiltinSkills', () => {
  describe('ALEXI_CONFIG', () => {
    it('should have correct metadata', () => {
      expect(BuiltinSkills.ALEXI_CONFIG.id).toBe('alexi-config');
      expect(BuiltinSkills.ALEXI_CONFIG.name).toBe('alexi-config');
      expect(BuiltinSkills.ALEXI_CONFIG.source).toBe('builtin');
      expect(BuiltinSkills.ALEXI_CONFIG.sourcePath).toBe('__builtin__');
    });

    it('should have description', () => {
      expect(BuiltinSkills.ALEXI_CONFIG.description).toBeTruthy();
      expect(BuiltinSkills.ALEXI_CONFIG.description).toContain('configuration');
    });

    it('should have prompt content', () => {
      expect(BuiltinSkills.ALEXI_CONFIG.prompt).toBeTruthy();
      expect(BuiltinSkills.ALEXI_CONFIG.prompt.length).toBeGreaterThan(0);
    });
  });

  describe('get', () => {
    it('should return skill by name', () => {
      const skill = BuiltinSkills.get('alexi-config');
      expect(skill).toBeDefined();
      expect(skill?.name).toBe('alexi-config');
    });

    it('should return undefined for unknown skill', () => {
      const skill = BuiltinSkills.get('nonexistent');
      expect(skill).toBeUndefined();
    });
  });

  describe('isBuiltin', () => {
    it('should return true for builtin location', () => {
      expect(BuiltinSkills.isBuiltin('__builtin__')).toBe(true);
    });

    it('should return false for file paths', () => {
      expect(BuiltinSkills.isBuiltin('/path/to/skill.md')).toBe(false);
      expect(BuiltinSkills.isBuiltin('./skills/custom.md')).toBe(false);
    });
  });

  describe('list', () => {
    it('should return all builtin skills', () => {
      const skills = BuiltinSkills.list();
      expect(skills.length).toBeGreaterThan(0);
      expect(skills).toContainEqual(BuiltinSkills.ALEXI_CONFIG);
    });

    it('should return a new array each time', () => {
      const list1 = BuiltinSkills.list();
      const list2 = BuiltinSkills.list();
      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });
  });

  describe('BUILTIN_LOCATION', () => {
    it('should export the location constant', () => {
      expect(BuiltinSkills.BUILTIN_LOCATION).toBe('__builtin__');
    });
  });
});
