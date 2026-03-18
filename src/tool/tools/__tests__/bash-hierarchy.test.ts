/**
 * Tests for Bash Hierarchy utility
 */

import { describe, it, expect } from 'vitest';
import { BashHierarchy } from '../bash-hierarchy.js';

describe('BashHierarchy', () => {
  describe('addAll', () => {
    it('should add hierarchy levels for simple command', () => {
      const rules = new Set<string>();
      BashHierarchy.addAll(rules, ['npm'], 'npm');

      expect(rules.has('npm')).toBe(true);
      expect(rules.size).toBe(1);
    });

    it('should add all prefix levels for multi-part command', () => {
      const rules = new Set<string>();
      BashHierarchy.addAll(rules, ['npm', 'install', 'lodash'], 'npm install lodash');

      expect(rules.has('npm')).toBe(true);
      expect(rules.has('npm install')).toBe(true);
      expect(rules.has('npm install lodash')).toBe(true);
      expect(rules.size).toBe(3);
    });

    it('should handle command with flags', () => {
      const rules = new Set<string>();
      BashHierarchy.addAll(rules, ['git', 'commit', '-m'], "git commit -m 'message'");

      expect(rules.has('git')).toBe(true);
      expect(rules.has('git commit')).toBe(true);
      expect(rules.has('git commit -m')).toBe(true);
      expect(rules.has("git commit -m 'message'")).toBe(true);
    });

    it('should handle empty command array', () => {
      const rules = new Set<string>();
      BashHierarchy.addAll(rules, [], '');

      expect(rules.size).toBe(0);
    });

    it('should not duplicate rules', () => {
      const rules = new Set<string>();
      BashHierarchy.addAll(rules, ['npm', 'install'], 'npm install');
      BashHierarchy.addAll(rules, ['npm', 'install'], 'npm install');

      expect(rules.size).toBe(2); // "npm" and "npm install"
    });
  });

  describe('matches', () => {
    it('should match exact command', () => {
      const rules = new Set(['npm install']);
      expect(BashHierarchy.matches(rules, ['npm', 'install'])).toBe(true);
    });

    it('should match parent prefix', () => {
      const rules = new Set(['npm']);
      expect(BashHierarchy.matches(rules, ['npm', 'install', 'lodash'])).toBe(true);
    });

    it('should not match unrelated command', () => {
      const rules = new Set(['npm']);
      expect(BashHierarchy.matches(rules, ['yarn', 'add'])).toBe(false);
    });

    it('should match any prefix level', () => {
      const rules = new Set(['npm install']);
      expect(BashHierarchy.matches(rules, ['npm', 'install', 'lodash'])).toBe(true);
    });

    it('should return false for empty command', () => {
      const rules = new Set(['npm']);
      expect(BashHierarchy.matches(rules, [])).toBe(false);
    });

    it('should return false for empty rules', () => {
      const rules = new Set<string>();
      expect(BashHierarchy.matches(rules, ['npm', 'install'])).toBe(false);
    });
  });
});
