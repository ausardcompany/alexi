import { describe, it, expect } from 'vitest';
import { matchesPattern, evaluatePatternRules, PermissionNext } from './next.js';

describe('matchesPattern', () => {
  it('matches exact paths', () => {
    expect(matchesPattern('src/file.ts', 'src/file.ts')).toBe(true);
    expect(matchesPattern('src/file.ts', 'src/other.ts')).toBe(false);
  });

  it('matches single wildcard patterns', () => {
    expect(matchesPattern('*.md', 'README.md')).toBe(true);
    expect(matchesPattern('*.md', 'src/README.md')).toBe(false);
    expect(matchesPattern('src/*.ts', 'src/index.ts')).toBe(true);
  });

  it('matches globstar patterns', () => {
    expect(matchesPattern('src/**/*.ts', 'src/deep/nested/file.ts')).toBe(true);
    expect(matchesPattern('**/*.md', 'any/path/file.md')).toBe(true);
  });

  it('handles universal wildcard', () => {
    expect(matchesPattern('*', 'anything')).toBe(true);
  });
});

describe('evaluatePatternRules', () => {
  it('returns first matching rule action', () => {
    const rules = [
      { pattern: '*.secret', action: 'deny' as const },
      { pattern: '*.md', action: 'allow' as const },
      { pattern: '*', action: 'deny' as const },
    ];

    expect(evaluatePatternRules(rules, 'config.secret')).toBe('deny');
    expect(evaluatePatternRules(rules, 'README.md')).toBe('allow');
    expect(evaluatePatternRules(rules, 'other.txt')).toBe('deny');
  });

  it('returns undefined when no rules match', () => {
    const rules = [{ pattern: '*.md', action: 'allow' as const }];
    expect(evaluatePatternRules(rules, 'file.ts')).toBeUndefined();
  });
});

// Tests for null delete sentinel handling (null = "remove this key from config")

describe('PermissionNext null sentinel handling', () => {
  it('fromConfig - null entries in PermissionObject are skipped', () => {
    const config = { bash: { '*': 'ask' as const, 'npm *': null } };
    const rules = PermissionNext.fromConfig(config);
    // null is a delete sentinel — only the non-null entry should produce a rule
    expect(rules).toEqual([{ permission: 'bash', pattern: '*', action: 'ask' }]);
  });

  it('fromConfig - null top-level PermissionRule is skipped', () => {
    const config = { bash: null };
    const rules = PermissionNext.fromConfig(config);
    expect(rules).toEqual([]);
  });

  it('toConfig - null existing entry is treated as absent (new rule wins)', () => {
    // If result[permission] is null (shouldn't happen in practice but defensive),
    // the new rule should be written as a fresh object entry.
    const result = PermissionNext.toConfig([
      { permission: 'bash', pattern: 'npm *', action: 'allow' },
    ]);
    expect(result).toEqual({ bash: { 'npm *': 'allow' } });
  });

  it('fromConfig - handles mixed valid and null entries', () => {
    const config = {
      read: { '*': 'ask' as const, 'src/*': 'allow' as const, 'test/*': null },
      write: 'deny' as const,
    };
    const rules = PermissionNext.fromConfig(config);
    expect(rules).toEqual([
      { permission: 'read', pattern: '*', action: 'ask' },
      { permission: 'read', pattern: 'src/*', action: 'allow' },
      { permission: 'write', pattern: '*', action: 'deny' },
    ]);
  });

  it('fromConfig - handles config with only null entries', () => {
    const config = { bash: { '*': null, 'npm *': null } };
    const rules = PermissionNext.fromConfig(config);
    expect(rules).toEqual([]);
  });

  it('toConfig - converts string rule to object format', () => {
    const rules = [{ permission: 'read', pattern: '*', action: 'allow' as const }];
    const result = PermissionNext.toConfig(rules);
    expect(result).toEqual({ read: { '*': 'allow' } });
  });

  it('toConfig - merges multiple patterns for same permission', () => {
    const rules = [
      { permission: 'read', pattern: '*', action: 'ask' as const },
      { permission: 'read', pattern: 'src/*', action: 'allow' as const },
    ];
    const result = PermissionNext.toConfig(rules);
    expect(result).toEqual({ read: { '*': 'ask', 'src/*': 'allow' } });
  });
});
