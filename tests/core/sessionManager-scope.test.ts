/**
 * Tests for `SessionManager`'s scope resolution guard (issue #1834).
 *
 * When a historical session references a workdir that is no longer
 * accessible (EACCES / EPERM / ENOENT / ENOTDIR), the workdir filter
 * on `listSessions` must treat that session as out-of-scope instead
 * of crashing the whole listing.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { SessionManager, safeResolveWorkdir } from '../../src/core/sessionManager.js';

describe('safeResolveWorkdir', () => {
  it('returns a resolved absolute path for a normal path', () => {
    const resolved = safeResolveWorkdir('/tmp/some/dir');
    expect(resolved).toBe(
      process.platform === 'win32'
        ? path.resolve('/tmp/some/dir').toLowerCase()
        : path.resolve('/tmp/some/dir')
    );
  });

  it('normalizes `.` and `..` segments', () => {
    const resolved = safeResolveWorkdir('/tmp/a/../b');
    const expected = path.resolve('/tmp/b');
    expect(resolved).toBe(process.platform === 'win32' ? expected.toLowerCase() : expected);
  });

  it('returns null when path.resolve throws (defensive)', () => {
    // path.resolve is remarkably tolerant, but we simulate a broken
    // input by passing an object masquerading as a string. TS strictness
    // means we have to cast, but the goal is to verify that a runtime
    // failure inside normalizeWorkdir converts to `null` instead of
    // bubbling.
    expect(safeResolveWorkdir(undefined as unknown as string)).toBeNull();
  });
});

describe('SessionManager.listSessions — scope guard (issue #1834)', () => {
  let tmpDir: string;
  let mgr: SessionManager;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-scope-'));
    mgr = new SessionManager({ sessionsDir: tmpDir });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function seed(id: string, workdir: string | undefined, updated = Date.now()): void {
    const session = {
      metadata: {
        id,
        created: updated,
        updated,
        totalTokens: 0,
        messageCount: 0,
        title: 'seeded',
        workdir,
      },
      messages: [],
    };
    fs.writeFileSync(path.join(tmpDir, `${id}.json`), JSON.stringify(session, null, 2));
  }

  it('excludes sessions whose recorded workdir does not match the filter', () => {
    seed('a', '/tmp/project-a');
    seed('b', '/tmp/project-b');

    const results = mgr.listSessions({ workdir: '/tmp/project-a' });
    expect(results.map((s) => s.id)).toEqual(['a']);
  });

  it('does NOT include legacy sessions with no recorded workdir in a filtered listing', () => {
    seed('legacy', undefined);
    seed('a', '/tmp/project-a');

    const results = mgr.listSessions({ workdir: '/tmp/project-a' });
    expect(results.map((s) => s.id)).toEqual(['a']);
  });

  it('does not crash when a historical session references a bogus workdir', () => {
    // This is the primary failure mode: a session recorded a workdir
    // that the current user cannot read. The filter must skip that
    // entry instead of throwing.
    seed('bogus', '/nonexistent/path/that/no/one/can/read');
    seed('good', '/tmp/project-good');

    const results = mgr.listSessions({ workdir: '/tmp/project-good' });
    expect(results.map((s) => s.id)).toEqual(['good']);
  });

  it('returns an unfiltered list when opts.workdir is omitted (regression)', () => {
    seed('a', '/tmp/project-a');
    seed('b', '/tmp/project-b');
    seed('legacy', undefined);

    const results = mgr.listSessions();
    expect(results.map((s) => s.id).sort()).toEqual(['a', 'b', 'legacy']);
  });
});
