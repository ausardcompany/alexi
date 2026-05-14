import { describe, it, expect } from 'vitest';
import { SearchDiagnostics } from '../../../src/tool/tools/search-errors.js';

describe('SearchDiagnostics', () => {
  it('should start with no errors', () => {
    const diagnostics = new SearchDiagnostics();

    expect(diagnostics.hasErrors()).toBe(false);
    expect(diagnostics.errors).toEqual([]);
    expect(diagnostics.getSummary()).toBe('');
  });

  it('should collect errors', () => {
    const diagnostics = new SearchDiagnostics();

    diagnostics.addError({
      type: 'walk_error',
      message: 'EACCES: permission denied',
      path: '/tmp/test',
    });

    expect(diagnostics.hasErrors()).toBe(true);
    expect(diagnostics.errors.length).toBe(1);
    expect(diagnostics.errors[0].type).toBe('walk_error');
  });

  it('should produce a formatted summary', () => {
    const diagnostics = new SearchDiagnostics();

    diagnostics.addError({
      type: 'walk_error',
      message: 'EACCES: permission denied',
      path: '/tmp/dir1',
    });
    diagnostics.addError({
      type: 'permission_denied',
      message: 'Cannot read file',
      path: '/tmp/file.txt',
    });

    const summary = diagnostics.getSummary();
    expect(summary).toContain('[walk_error] EACCES: permission denied (/tmp/dir1)');
    expect(summary).toContain('[permission_denied] Cannot read file (/tmp/file.txt)');
  });

  it('should omit path from summary when not provided', () => {
    const diagnostics = new SearchDiagnostics();

    diagnostics.addError({
      type: 'regex_invalid',
      message: 'Invalid regular expression',
    });

    const summary = diagnostics.getSummary();
    expect(summary).toBe('[regex_invalid] Invalid regular expression');
    expect(summary).not.toContain('(');
  });

  it('should cap errors at 5', () => {
    const diagnostics = new SearchDiagnostics();

    for (let i = 0; i < 10; i++) {
      diagnostics.addError({
        type: 'walk_error',
        message: `Error ${i}`,
        path: `/tmp/dir${i}`,
      });
    }

    expect(diagnostics.errors.length).toBe(5);
    expect(diagnostics.errors[4].message).toBe('Error 4');
  });

  it('should support all error types', () => {
    const diagnostics = new SearchDiagnostics();
    const types = [
      'regex_invalid',
      'path_not_found',
      'permission_denied',
      'walk_error',
      'aborted',
    ] as const;

    for (const type of types) {
      diagnostics.addError({ type, message: `${type} error` });
    }

    expect(diagnostics.errors.length).toBe(5);
    expect(diagnostics.errors.map((e) => e.type)).toEqual(types);
  });
});
