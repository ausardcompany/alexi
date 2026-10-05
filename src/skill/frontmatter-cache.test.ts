/**
 * Tests for the skill frontmatter cache (upstream kilocode `b0aeda50b`).
 *
 * Verifies:
 *   - A second load of an unchanged file reuses the cached Skill
 *     instance (no re-parse).
 *   - Changing the file (mtime bump) invalidates the cache entry.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { loadSkillFromFile, _resetSkillFrontmatterCacheForTests } from './index.js';

describe('skill frontmatter cache', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-skill-cache-'));
    _resetSkillFrontmatterCacheForTests();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns the same Skill instance when the file is unchanged', () => {
    const file = path.join(tmpDir, 'demo.md');
    fs.writeFileSync(
      file,
      [
        '---',
        'id: demo',
        'name: Demo',
        'description: cache test',
        '---',
        'hello world',
      ].join('\n')
    );
    const first = loadSkillFromFile(file);
    const second = loadSkillFromFile(file);
    expect(first).not.toBeNull();
    // Reference equality — the second call MUST have been served from
    // the cache. If the parser ran again we would get a new object.
    expect(second).toBe(first);
  });

  it('re-parses when the file mtime changes', () => {
    const file = path.join(tmpDir, 'demo.md');
    fs.writeFileSync(
      file,
      ['---', 'id: demo', 'description: v1', '---', 'first version'].join('\n')
    );
    const first = loadSkillFromFile(file);
    expect(first?.description).toBe('v1');

    // Rewrite with new content AND bump the mtime explicitly so the
    // test is robust against filesystems that collapse rapid writes.
    fs.writeFileSync(
      file,
      ['---', 'id: demo', 'description: v2', '---', 'second version'].join('\n')
    );
    const future = new Date(Date.now() + 2_000);
    fs.utimesSync(file, future, future);

    const second = loadSkillFromFile(file);
    expect(second?.description).toBe('v2');
    expect(second).not.toBe(first);
  });
});
