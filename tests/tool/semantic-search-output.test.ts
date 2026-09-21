/**
 * Tests for the semantic-search output helper.
 *
 * The exact phrasing is the behavioural contract with the model — empty
 * results MUST explain WHY they are empty (index disabled, still
 * building, broken) so the model does not conclude "no such code exists"
 * when the truth is "the index was unavailable".
 *
 * Ported from upstream `packages/opencode/test/kilocode/tool/semantic-search-output.test.ts`
 * with `bun:test` swapped for vitest — Alexi runs its full test suite
 * under vitest and does not depend on bun.
 */

import { describe, expect, it } from 'vitest';
import {
  empty,
  normalizePath,
  reason,
  scope,
  type IndexingStatus,
} from '../../src/tool/semantic-search-output.js';

describe('semantic-search-output', () => {
  it('normalizePath converts backslashes', () => {
    expect(normalizePath('a\\b\\c')).toBe('a/b/c');
  });

  it('scope joins root and prefix', () => {
    expect(scope('/repo')).toBe('/repo');
    expect(scope('/repo', 'src\\a')).toBe('/repo/src/a');
  });

  it('reason handles missing status', () => {
    expect(reason(undefined)).toContain('could not be queried');
  });

  it('reason for Disabled includes the trailing detail message', () => {
    const status: IndexingStatus = {
      state: 'Disabled',
      message: 'toggle in settings',
      percent: 0,
      processedFiles: 0,
      totalFiles: 0,
    };
    const text = reason(status);
    expect(text).toContain('disabled');
    expect(text).toContain('toggle in settings');
  });

  it('reason for Error names the failure', () => {
    const status: IndexingStatus = {
      state: 'Error',
      message: 'embedding backend unreachable',
      percent: 0,
      processedFiles: 0,
      totalFiles: 0,
    };
    expect(reason(status)).toContain('failed');
    expect(reason(status)).toContain('embedding backend unreachable');
  });

  it('reason for In Progress reports percent and file counts', () => {
    const status: IndexingStatus = {
      state: 'In Progress',
      message: '',
      percent: 42,
      processedFiles: 21,
      totalFiles: 50,
    };
    expect(reason(status)).toContain('(42%, 21/50 files)');
  });

  it('reason for Standby marks the results as incomplete', () => {
    const status: IndexingStatus = {
      state: 'Standby',
      message: '',
      percent: 0,
      processedFiles: 0,
      totalFiles: 0,
    };
    expect(reason(status)).toContain('not active');
  });

  it('reason for Ready is treated as authoritative negative evidence', () => {
    const status: IndexingStatus = {
      state: 'Ready',
      message: '',
      percent: 100,
      processedFiles: 10,
      totalFiles: 10,
    };
    expect(reason(status)).toContain('up to date');
  });

  it('empty output includes scope and reason', () => {
    const out = empty('/repo', 'src', undefined);
    expect(out).toContain('Scope: /repo/src');
    expect(out).toContain('Reason:');
  });

  it('empty output without prefix uses the root as scope', () => {
    const out = empty('/repo', undefined, undefined);
    expect(out).toContain('Scope: /repo');
    // No trailing slash / prefix appended when prefix is omitted.
    expect(out).not.toContain('Scope: /repo/');
  });
});
