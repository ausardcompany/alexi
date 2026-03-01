/**
 * Tests for CodeSearch Tool
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import {
  codesearchTool,
  formatCodeSearchResults,
  type CodeSearchResult,
  type CodeSymbol,
  type CodeMatch,
} from '../codesearch.js';

// Mock fs/promises
vi.mock('fs/promises', async () => {
  const actual = await vi.importActual('fs/promises');
  return {
    ...actual,
    readdir: vi.fn(),
    readFile: vi.fn(),
    stat: vi.fn(),
  };
});

describe('CodeSearch Tool', () => {
  const mockContext = {
    workdir: '/test/project',
    signal: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Tool Definition', () => {
    it('should have correct name and description', () => {
      expect(codesearchTool.name).toBe('codesearch');
      expect(codesearchTool.description).toContain('code search');
      expect(codesearchTool.description).toContain('symbol');
      expect(codesearchTool.description).toContain('content');
    });

    it('should have correct parameters schema', () => {
      const schema = codesearchTool.parameters;
      expect(schema).toBeDefined();

      // Test valid input
      const result = schema.safeParse({
        query: 'handleClick',
        searchType: 'symbol',
        symbolTypes: ['function', 'method'],
        maxResults: 50,
      });
      expect(result.success).toBe(true);
    });

    it('should require query parameter', () => {
      const schema = codesearchTool.parameters;
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should validate searchType enum', () => {
      const schema = codesearchTool.parameters;

      expect(schema.safeParse({ query: 'test', searchType: 'symbol' }).success).toBe(true);
      expect(schema.safeParse({ query: 'test', searchType: 'content' }).success).toBe(true);
      expect(schema.safeParse({ query: 'test', searchType: 'both' }).success).toBe(true);
      expect(schema.safeParse({ query: 'test', searchType: 'invalid' }).success).toBe(false);
    });

    it('should validate symbolTypes array', () => {
      const schema = codesearchTool.parameters;

      expect(schema.safeParse({ query: 'test', symbolTypes: ['function'] }).success).toBe(true);
      expect(schema.safeParse({ query: 'test', symbolTypes: ['class', 'interface'] }).success).toBe(
        true
      );
      expect(schema.safeParse({ query: 'test', symbolTypes: ['invalid'] }).success).toBe(false);
    });

    it('should validate maxResults range', () => {
      const schema = codesearchTool.parameters;

      expect(schema.safeParse({ query: 'test', maxResults: 0 }).success).toBe(false);
      expect(schema.safeParse({ query: 'test', maxResults: 501 }).success).toBe(false);
      expect(schema.safeParse({ query: 'test', maxResults: 100 }).success).toBe(true);
    });

    it('should validate contextLines range', () => {
      const schema = codesearchTool.parameters;

      expect(schema.safeParse({ query: 'test', contextLines: -1 }).success).toBe(false);
      expect(schema.safeParse({ query: 'test', contextLines: 11 }).success).toBe(false);
      expect(schema.safeParse({ query: 'test', contextLines: 5 }).success).toBe(true);
    });
  });

  describe('formatCodeSearchResults', () => {
    it('should format empty results', () => {
      const result: CodeSearchResult = {
        query: 'test',
        searchType: 'both',
        matches: [],
        symbols: [],
        filesSearched: 10,
        totalMatches: 0,
      };

      const output = formatCodeSearchResults(result);
      expect(output).toContain('No matches found');
      expect(output).toContain('Files searched: 10');
    });

    it('should format symbol results', () => {
      const symbols: CodeSymbol[] = [
        {
          name: 'handleClick',
          type: 'function',
          file: 'src/components/Button.tsx',
          line: 15,
          column: 1,
          signature: 'export function handleClick(event: MouseEvent)',
          exported: true,
        },
      ];

      const result: CodeSearchResult = {
        query: 'handleClick',
        searchType: 'symbol',
        matches: [],
        symbols,
        filesSearched: 50,
        totalMatches: 1,
      };

      const output = formatCodeSearchResults(result);
      expect(output).toContain('## Symbols');
      expect(output).toContain('FUNCTION handleClick');
      expect(output).toContain('src/components/Button.tsx:15');
      expect(output).toContain('export function handleClick');
    });

    it('should format content matches', () => {
      const matches: CodeMatch[] = [
        {
          file: 'src/utils.ts',
          line: 42,
          column: 10,
          content: '  const result = processData(input);',
          context: {
            before: ['function process() {', '  const input = getData();'],
            after: ['  return result;', '}'],
          },
        },
      ];

      const result: CodeSearchResult = {
        query: 'processData',
        searchType: 'content',
        matches,
        symbols: [],
        filesSearched: 100,
        totalMatches: 1,
      };

      const output = formatCodeSearchResults(result);
      expect(output).toContain('## Content Matches');
      expect(output).toContain('src/utils.ts:42:10');
      expect(output).toContain('processData');
    });

    it('should format results without context when showContext is false', () => {
      const matches: CodeMatch[] = [
        {
          file: 'test.ts',
          line: 1,
          column: 1,
          content: 'const x = 1;',
          context: { before: ['// comment'], after: ['// next'] },
        },
      ];

      const result: CodeSearchResult = {
        query: 'x',
        searchType: 'content',
        matches,
        symbols: [],
        filesSearched: 1,
        totalMatches: 1,
      };

      const output = formatCodeSearchResults(result, false);
      expect(output).not.toContain('// comment');
      expect(output).not.toContain('// next');
    });
  });

  describe('Tool Execution', () => {
    it('should handle empty directory', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await codesearchTool.execute(
        {
          query: 'test',
          searchType: 'both',
          contextLines: 2,
          maxResults: 100,
          caseSensitive: false,
        },
        mockContext
      );

      expect(result.success).toBe(true);
      expect(result.data?.matches).toEqual([]);
      expect(result.data?.symbols).toEqual([]);
      expect(result.data?.filesSearched).toBe(0);
    });
  });
});

describe('Symbol Pattern Matching', () => {
  it('should match function declarations', () => {
    const pattern = /(?:export\s+)?(?:async\s+)?function\s+(\w+)/g;

    expect('function foo()'.match(pattern)).toBeTruthy();
    expect('export function bar()'.match(pattern)).toBeTruthy();
    expect('async function baz()'.match(pattern)).toBeTruthy();
    expect('export async function qux()'.match(pattern)).toBeTruthy();
  });

  it('should match class declarations', () => {
    const pattern = /(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/g;

    expect('class Foo'.match(pattern)).toBeTruthy();
    expect('export class Bar'.match(pattern)).toBeTruthy();
    expect('abstract class Baz'.match(pattern)).toBeTruthy();
    expect('export abstract class Qux'.match(pattern)).toBeTruthy();
  });

  it('should match interface declarations', () => {
    const pattern = /(?:export\s+)?interface\s+(\w+)/g;

    expect('interface IFoo'.match(pattern)).toBeTruthy();
    expect('export interface IBar'.match(pattern)).toBeTruthy();
  });

  it('should match type declarations', () => {
    const pattern = /(?:export\s+)?type\s+(\w+)\s*(?:<[^=]*>)?\s*=/g;

    expect('type Foo ='.match(pattern)).toBeTruthy();
    expect('export type Bar ='.match(pattern)).toBeTruthy();
    expect('type Generic<T> ='.match(pattern)).toBeTruthy();
  });

  it('should match const declarations', () => {
    const pattern = /(?:export\s+)?const\s+(\w+)\s*[=:]/g;

    expect('const foo ='.match(pattern)).toBeTruthy();
    expect('export const bar ='.match(pattern)).toBeTruthy();
    expect('const baz:'.match(pattern)).toBeTruthy();
  });
});
