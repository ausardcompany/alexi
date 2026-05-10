/**
 * Tests for Path Formatting Utilities
 */

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import {
  formatPathRelativeToSession,
  formatPathForDisplay,
  abbreviateHomePath,
} from './pathFormat.js';

describe('formatPathRelativeToSession', () => {
  it('formats paths within session directory as relative', () => {
    const sessionDir = '/home/user/project';
    const filePath = '/home/user/project/src/index.ts';

    const result = formatPathRelativeToSession(filePath, sessionDir);
    expect(result).toBe('./src/index.ts');
  });

  it('returns absolute path for files outside session directory', () => {
    const sessionDir = '/home/user/project';
    const filePath = '/home/user/other/file.ts';

    const result = formatPathRelativeToSession(filePath, sessionDir);
    expect(result).toBe(filePath);
  });

  it('handles same directory', () => {
    const sessionDir = '/home/user/project';
    const filePath = '/home/user/project/file.ts';

    const result = formatPathRelativeToSession(filePath, sessionDir);
    expect(result).toBe('./file.ts');
  });

  it('handles empty inputs', () => {
    expect(formatPathRelativeToSession('', '/home/user')).toBe('');
    expect(formatPathRelativeToSession('/home/user/file.ts', '')).toBe('/home/user/file.ts');
  });
});

describe('abbreviateHomePath', () => {
  it('abbreviates home directory', () => {
    const home = process.env.HOME || process.env.USERPROFILE;
    if (!home) {
      // Skip test if no home directory
      return;
    }

    const filePath = path.join(home, 'projects', 'test.ts');
    const result = abbreviateHomePath(filePath);
    expect(result).toBe('~/projects/test.ts');
  });

  it('does not abbreviate non-home paths', () => {
    const filePath = '/usr/local/bin/test';
    const result = abbreviateHomePath(filePath);
    expect(result).toBe(filePath);
  });
});

describe('formatPathForDisplay', () => {
  it('uses relative path for files in session directory', () => {
    const sessionDir = '/home/user/project';
    const filePath = '/home/user/project/src/index.ts';

    const result = formatPathForDisplay(filePath, sessionDir);
    expect(result).toBe('./src/index.ts');
  });

  it('abbreviates home for files outside session directory', () => {
    const home = process.env.HOME || process.env.USERPROFILE;
    if (!home) {
      // Skip test if no home directory
      return;
    }

    const sessionDir = '/tmp/project';
    const filePath = path.join(home, 'other', 'file.ts');

    const result = formatPathForDisplay(filePath, sessionDir);
    expect(result).toBe('~/other/file.ts');
  });
});
