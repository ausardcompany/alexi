/**
 * Session scanner tests.
 *
 * Verifies:
 *   - Valid session files are parsed into ScannedSession records with
 *     project bucket derived from `metadata.workdir` (basename).
 *   - Malformed JSON is skipped with a warning rather than crashing.
 *   - Missing `createdAt` / `updatedAt` fall back to file `mtime`.
 *   - Sessions without a recorded workdir land in UNKNOWN_PROJECT.
 *   - `groupSessionsByProject` returns per-project buckets.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  groupSessionsByProject,
  scanSessions,
  UNKNOWN_PROJECT,
} from '../../src/core/sessionScanner.js';
import type { Session } from '../../src/core/sessionManager.js';

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-scanner-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

function writeSession(
  id: string,
  overrides: Partial<Session['metadata']> = {},
  mtimeMs?: number
): string {
  const now = Date.now();
  const session: Session = {
    metadata: {
      id,
      created: overrides.created ?? now,
      updated: overrides.updated ?? now,
      totalTokens: 0,
      messageCount: 0,
      ...overrides,
    },
    messages: [],
  };
  const filePath = path.join(tempDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
  if (mtimeMs !== undefined) {
    fs.utimesSync(filePath, mtimeMs / 1000, mtimeMs / 1000);
  }
  return filePath;
}

describe('scanSessions', () => {
  it('returns an empty array when the directory does not exist', async () => {
    const missing = path.join(tempDir, 'nope');
    const result = await scanSessions(missing);
    expect(result).toEqual([]);
  });

  it('parses valid session files with project derived from workdir basename', async () => {
    writeSession('sess-1', { workdir: '/tmp/projects/alpha' });
    writeSession('sess-2', { workdir: '/tmp/projects/beta' });

    const sessions = await scanSessions(tempDir);
    expect(sessions).toHaveLength(2);

    const byId = new Map(sessions.map((s) => [s.id, s]));
    expect(byId.get('sess-1')?.project).toBe('alpha');
    expect(byId.get('sess-2')?.project).toBe('beta');
    expect(byId.get('sess-1')?.filePath.endsWith('sess-1.json')).toBe(true);
    expect(byId.get('sess-1')?.size).toBeGreaterThan(0);
  });

  it('falls back to UNKNOWN_PROJECT when workdir is missing', async () => {
    writeSession('sess-legacy');

    const sessions = await scanSessions(tempDir);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].project).toBe(UNKNOWN_PROJECT);
  });

  it('skips malformed JSON files without throwing', async () => {
    writeSession('good', { workdir: '/tmp/alpha' });
    fs.writeFileSync(path.join(tempDir, 'broken.json'), 'not-valid-json', 'utf-8');

    const sessions = await scanSessions(tempDir);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe('good');
  });

  it('skips files whose metadata block is missing an id', async () => {
    writeSession('good');
    fs.writeFileSync(
      path.join(tempDir, 'no-id.json'),
      JSON.stringify({ metadata: {}, messages: [] }),
      'utf-8'
    );

    const sessions = await scanSessions(tempDir);
    expect(sessions.map((s) => s.id)).toEqual(['good']);
  });

  it('ignores non-JSON files in the sessions directory', async () => {
    writeSession('kept');
    fs.writeFileSync(path.join(tempDir, 'notes.txt'), 'ignore me', 'utf-8');
    fs.writeFileSync(path.join(tempDir, 'sidecar.lock'), '', 'utf-8');

    const sessions = await scanSessions(tempDir);
    expect(sessions.map((s) => s.id)).toEqual(['kept']);
  });

  it('falls back to file mtime when metadata timestamps are missing', async () => {
    const mtime = 1_700_000_000_000;
    const filePath = path.join(tempDir, 'nots.json');
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        metadata: { id: 'nots', totalTokens: 0, messageCount: 0 },
        messages: [],
      }),
      'utf-8'
    );
    fs.utimesSync(filePath, mtime / 1000, mtime / 1000);

    const sessions = await scanSessions(tempDir);
    expect(sessions).toHaveLength(1);
    // mtime resolution on some filesystems can strip millis; assert
    // proximity rather than equality.
    expect(Math.abs(sessions[0].updatedAt - mtime)).toBeLessThan(2000);
    expect(Math.abs(sessions[0].createdAt - mtime)).toBeLessThan(2000);
  });
});

describe('groupSessionsByProject', () => {
  it('buckets sessions by their project field', async () => {
    writeSession('a1', { workdir: '/tmp/projects/alpha' });
    writeSession('a2', { workdir: '/tmp/projects/alpha' });
    writeSession('b1', { workdir: '/tmp/projects/beta' });
    writeSession('legacy');

    const sessions = await scanSessions(tempDir);
    const groups = groupSessionsByProject(sessions);

    expect(
      groups
        .get('alpha')
        ?.map((s) => s.id)
        .sort()
    ).toEqual(['a1', 'a2']);
    expect(groups.get('beta')?.map((s) => s.id)).toEqual(['b1']);
    expect(groups.get(UNKNOWN_PROJECT)?.map((s) => s.id)).toEqual(['legacy']);
  });
});
