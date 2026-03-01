/**
 * Tests for Diagnostics Tool
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import {
  diagnosticsTool,
  formatDiagnostics,
  formatSummary,
  type Diagnostic,
  type DiagnosticsResult,
} from '../diagnostics.js';

// Mock child_process
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

// Mock fs
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
  };
});

describe('Diagnostics Tool', () => {
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
      expect(diagnosticsTool.name).toBe('diagnostics');
      expect(diagnosticsTool.description).toContain('diagnostics');
      expect(diagnosticsTool.description).toContain('errors');
      expect(diagnosticsTool.description).toContain('warnings');
    });

    it('should have correct parameters schema', () => {
      const schema = diagnosticsTool.parameters;
      expect(schema).toBeDefined();

      // Test schema shape by parsing valid input
      const result = schema.safeParse({
        filePath: 'src/test.ts',
        sources: ['tsc', 'eslint'],
        maxDiagnostics: 10,
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty parameters', () => {
      const schema = diagnosticsTool.parameters;
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate maxDiagnostics range', () => {
      const schema = diagnosticsTool.parameters;

      // Too low
      expect(schema.safeParse({ maxDiagnostics: 0 }).success).toBe(false);

      // Too high
      expect(schema.safeParse({ maxDiagnostics: 101 }).success).toBe(false);

      // Valid
      expect(schema.safeParse({ maxDiagnostics: 50 }).success).toBe(true);
    });

    it('should validate sources enum', () => {
      const schema = diagnosticsTool.parameters;

      // Valid sources
      expect(schema.safeParse({ sources: ['tsc'] }).success).toBe(true);
      expect(schema.safeParse({ sources: ['eslint'] }).success).toBe(true);
      expect(schema.safeParse({ sources: ['typescript'] }).success).toBe(true);

      // Invalid source
      expect(schema.safeParse({ sources: ['invalid'] }).success).toBe(false);
    });
  });

  describe('formatDiagnostics', () => {
    it('should return message for empty diagnostics', () => {
      const result = formatDiagnostics([]);
      expect(result).toBe('No diagnostics found.');
    });

    it('should format single diagnostic', () => {
      const diagnostics: Diagnostic[] = [
        {
          file: '/test/project/src/file.ts',
          line: 10,
          column: 5,
          severity: 'error',
          message: 'Type error',
          source: 'tsc',
          code: 'TS2322',
        },
      ];

      const result = formatDiagnostics(diagnostics, '/test/project');

      expect(result).toContain('ERROR');
      expect(result).toContain('src/file.ts:10:5');
      expect(result).toContain('[TS2322]');
      expect(result).toContain('(tsc)');
      expect(result).toContain('Type error');
    });

    it('should format multiple diagnostics', () => {
      const diagnostics: Diagnostic[] = [
        {
          file: '/test/file1.ts',
          line: 1,
          column: 1,
          severity: 'error',
          message: 'Error 1',
          source: 'tsc',
        },
        {
          file: '/test/file2.ts',
          line: 2,
          column: 2,
          severity: 'warning',
          message: 'Warning 1',
          source: 'eslint',
          code: 'no-unused-vars',
        },
      ];

      const result = formatDiagnostics(diagnostics);

      expect(result).toContain('ERROR');
      expect(result).toContain('WARNING');
      expect(result).toContain('Error 1');
      expect(result).toContain('Warning 1');
    });

    it('should handle diagnostics without code', () => {
      const diagnostics: Diagnostic[] = [
        {
          file: '/test/file.ts',
          line: 1,
          column: 1,
          severity: 'info',
          message: 'Info message',
          source: 'tsc',
        },
      ];

      const result = formatDiagnostics(diagnostics);

      expect(result).not.toContain('[]');
      expect(result).toContain('INFO');
    });
  });

  describe('formatSummary', () => {
    it('should return message for no issues', () => {
      const summary: DiagnosticsResult['summary'] = {
        errors: 0,
        warnings: 0,
        info: 0,
        hints: 0,
        total: 0,
      };

      expect(formatSummary(summary)).toBe('No issues found.');
    });

    it('should format single error', () => {
      const summary: DiagnosticsResult['summary'] = {
        errors: 1,
        warnings: 0,
        info: 0,
        hints: 0,
        total: 1,
      };

      expect(formatSummary(summary)).toBe('1 error');
    });

    it('should format multiple errors', () => {
      const summary: DiagnosticsResult['summary'] = {
        errors: 5,
        warnings: 0,
        info: 0,
        hints: 0,
        total: 5,
      };

      expect(formatSummary(summary)).toBe('5 errors');
    });

    it('should format mixed diagnostics', () => {
      const summary: DiagnosticsResult['summary'] = {
        errors: 2,
        warnings: 3,
        info: 1,
        hints: 0,
        total: 6,
      };

      const result = formatSummary(summary);
      expect(result).toContain('2 errors');
      expect(result).toContain('3 warnings');
      expect(result).toContain('1 info');
    });
  });

  describe('Tool Execution', () => {
    it('should return error for non-existent file', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = await diagnosticsTool.execute({ filePath: 'nonexistent.ts' }, mockContext);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should handle no diagnostic sources', async () => {
      // No tsconfig.json or eslint config
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const result = await diagnosticsTool.execute({}, mockContext);

      expect(result.success).toBe(true);
      expect(result.data?.diagnostics).toEqual([]);
      expect(result.hint).toContain('No diagnostic sources found');
    });
  });
});

describe('Diagnostic Severity Sorting', () => {
  it('should sort errors before warnings', () => {
    const diagnostics: Diagnostic[] = [
      {
        file: 'a.ts',
        line: 1,
        column: 1,
        severity: 'warning',
        message: 'Warning',
        source: 'tsc',
      },
      {
        file: 'a.ts',
        line: 1,
        column: 1,
        severity: 'error',
        message: 'Error',
        source: 'tsc',
      },
    ];

    // Sort using same logic as the tool
    const severityOrder = { error: 0, warning: 1, info: 2, hint: 3 };
    diagnostics.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    expect(diagnostics[0].severity).toBe('error');
    expect(diagnostics[1].severity).toBe('warning');
  });
});
