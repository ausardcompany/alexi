import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock sapOrchestration so validateModelAliases can report conflicts
// against a stable, deterministic set of "real" model ids. The alias
// resolver itself does not depend on this mock.
vi.mock('../../src/providers/sapOrchestration.js', () => ({
  isOrchestrationModel: vi.fn((id: string) => id === 'anthropic--claude-4.7-opus'),
}));

// Capture logger.warn calls so we can assert on the diagnostics without
// polluting test output.
vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    print: vi.fn(),
    setLevel: vi.fn(),
    getLevel: vi.fn(() => 'info'),
  },
}));

import {
  CircularAliasError,
  MAX_ALIAS_DEPTH,
  resolveModelAlias,
  validateModelAliases,
} from '../../src/config/modelAliases.js';
import { logger } from '../../src/utils/logger.js';

describe('resolveModelAlias', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the input unchanged when there are no aliases', () => {
    expect(resolveModelAlias('gpt-4o', undefined)).toBe('gpt-4o');
    expect(resolveModelAlias('gpt-4o', {})).toBe('gpt-4o');
  });

  it('resolves a single-level alias', () => {
    const aliases = { opus: 'sap-ai-core/anthropic--claude-4.7-opus' };
    expect(resolveModelAlias('opus', aliases)).toBe('sap-ai-core/anthropic--claude-4.7-opus');
  });

  it('passes through a name that is not a key in the alias map', () => {
    const aliases = { opus: 'sap-ai-core/anthropic--claude-4.7-opus' };
    expect(resolveModelAlias('gpt-4o', aliases)).toBe('gpt-4o');
  });

  it('resolves chained aliases up to the max depth', () => {
    const aliases = {
      a: 'b',
      b: 'c',
      c: 'sap-ai-core/anthropic--claude-4.7-opus',
    };
    expect(resolveModelAlias('a', aliases)).toBe('sap-ai-core/anthropic--claude-4.7-opus');
  });

  it('throws CircularAliasError for a direct 2-cycle (a -> b -> a)', () => {
    const aliases = { a: 'b', b: 'a' };
    expect(() => resolveModelAlias('a', aliases)).toThrowError(CircularAliasError);
  });

  it('throws CircularAliasError for a 3-cycle (a -> b -> c -> a)', () => {
    const aliases = { a: 'b', b: 'c', c: 'a' };
    let caught: unknown;
    try {
      resolveModelAlias('a', aliases);
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(CircularAliasError);
    expect((caught as CircularAliasError).chain).toEqual(['a', 'b', 'c', 'a']);
  });

  it('throws CircularAliasError for a self-reference (a -> a)', () => {
    const aliases = { a: 'a' };
    expect(() => resolveModelAlias('a', aliases)).toThrowError(CircularAliasError);
  });

  it('throws CircularAliasError when a chain exceeds MAX_ALIAS_DEPTH without terminating', () => {
    // Build a chain of exactly MAX_ALIAS_DEPTH + 2 nodes where every
    // node points at the next (no termination within the limit).
    const aliases: Record<string, string> = {};
    const totalNodes = MAX_ALIAS_DEPTH + 2;
    for (let i = 0; i < totalNodes - 1; i++) {
      aliases[`n${i}`] = `n${i + 1}`;
    }
    // Final node points back to form a cycle so the resolver is forced
    // to use the depth cap.
    aliases[`n${totalNodes - 1}`] = 'n0';
    expect(() => resolveModelAlias('n0', aliases)).toThrowError(CircularAliasError);
  });

  it('ignores empty-string alias values (treats as non-alias)', () => {
    const aliases = { opus: '' };
    expect(resolveModelAlias('opus', aliases)).toBe('opus');
  });

  it('ignores whitespace-only alias values', () => {
    const aliases = { opus: '   ' };
    expect(resolveModelAlias('opus', aliases)).toBe('opus');
  });

  it('trims the input before lookup', () => {
    const aliases = { opus: 'sap-ai-core/anthropic--claude-4.7-opus' };
    expect(resolveModelAlias('  opus  ', aliases)).toBe('sap-ai-core/anthropic--claude-4.7-opus');
  });

  it('returns the empty input verbatim when it is only whitespace', () => {
    expect(resolveModelAlias('   ', { opus: 'x' })).toBe('   ');
  });
});

describe('validateModelAliases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns no invalid entries for a healthy alias map', () => {
    const aliases = {
      opus: 'sap-ai-core/anthropic--claude-4.7-opus',
      sonnet: 'sap-ai-core/anthropic--claude-4.5-sonnet',
    };
    expect(validateModelAliases(aliases)).toEqual([]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('returns [] and does not throw when the map is undefined', () => {
    expect(validateModelAliases(undefined)).toEqual([]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('warns and marks invalid when a value is empty', () => {
    const aliases = { opus: '' };
    const invalid = validateModelAliases(aliases);
    expect(invalid).toEqual(['opus']);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect((logger.warn as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0]).toMatch(
      /opus/
    );
  });

  it('warns when an alias key shadows a real orchestration model id', () => {
    // isOrchestrationModel is mocked to recognise this exact id.
    const aliases = {
      'anthropic--claude-4.7-opus': 'sap-ai-core/anthropic--claude-4.7-opus',
    };
    const invalid = validateModelAliases(aliases);
    expect(invalid).toEqual([]); // non-fatal, alias still works
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect((logger.warn as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][0]).toMatch(
      /shadows/
    );
  });

  it('warns and marks invalid when the chain contains a cycle', () => {
    const aliases = { a: 'b', b: 'a' };
    const invalid = validateModelAliases(aliases);
    // Both keys participate in the cycle; both are reported.
    expect(invalid.sort()).toEqual(['a', 'b']);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('skips empty keys', () => {
    const aliases: Record<string, string> = { '': 'foo' };
    const invalid = validateModelAliases(aliases);
    expect(invalid).toEqual(['']);
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});
