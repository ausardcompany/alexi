/**
 * Tests for `canonicalizeRepoPath` — the Windows-safe cache-key helper
 * introduced to fix kilocode's repository-cache miss bug on
 * case-insensitive Windows filesystems.
 *
 * We only exercise the path-shaped input branch on POSIX (where the
 * platform gate keeps the Windows normalization off) and the URL
 * passthrough branch, which is platform-independent.
 */

import { describe, it, expect } from 'vitest';
import { canonicalizeRepoPath } from '../../src/reference/repository-cache.js';

describe('canonicalizeRepoPath', () => {
  it('passes https git URLs through untouched', () => {
    expect(canonicalizeRepoPath('https://github.com/USER/Repo.git')).toBe(
      'https://github.com/USER/Repo.git'
    );
  });

  it('passes ssh git URLs through untouched', () => {
    expect(canonicalizeRepoPath('git@github.com:USER/Repo.git')).toBe(
      'git@github.com:USER/Repo.git'
    );
  });

  it('resolves `.` / `..` / trailing separators for filesystem paths (posix)', () => {
    // Skip the case-normalization branch on non-Windows.
    if (process.platform === 'win32') {
      return;
    }
    const canonical = canonicalizeRepoPath('/tmp/foo/../foo/bar/');
    expect(canonical).toBe('/tmp/foo/bar');
  });

  it('is stable across duplicate calls (posix)', () => {
    if (process.platform === 'win32') {
      return;
    }
    const a = canonicalizeRepoPath('/tmp/foo/./bar');
    const b = canonicalizeRepoPath('/tmp/foo/bar');
    expect(a).toBe(b);
  });
});
