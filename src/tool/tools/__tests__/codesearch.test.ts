/**
 * Tests for CodeSearch Tool (DEPRECATED)
 *
 * The codesearch tool has been deprecated. These tests verify that:
 * - The tool stub exists for backward compatibility
 * - It returns the expected deprecation error when called
 * - formatCodeSearchResults returns the deprecation message
 */

import { describe, it, expect } from 'vitest';
import { codesearchTool, formatCodeSearchResults } from '../codesearch.js';

describe('CodeSearch Tool (Deprecated)', () => {
  const mockContext = {
    workdir: '/test/project',
    signal: undefined,
  };

  describe('Tool Definition', () => {
    it('should have correct name', () => {
      expect(codesearchTool.name).toBe('codesearch');
    });

    it('should indicate deprecation in description', () => {
      expect(codesearchTool.description).toContain('DEPRECATED');
    });

    it('should have correct parameters schema', () => {
      const schema = codesearchTool.parameters;
      expect(schema).toBeDefined();

      // Test valid input - only query is required now
      const result = schema.safeParse({ query: 'handleClick' });
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
  });

  describe('Tool Execution', () => {
    it('should return deprecation error', async () => {
      const result = await codesearchTool.execute({ query: 'test' }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error).toContain('deprecated');
    });
  });

  describe('formatCodeSearchResults', () => {
    it('should return deprecation message', () => {
      const output = formatCodeSearchResults();
      expect(output).toContain('deprecated');
    });
  });
});
