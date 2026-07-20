/**
 * Tests for repo map generation and RepoMapManager caching behaviour
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { buildRepoMap, generateRepoMap, RepoMapManager } from '../repoMap.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mkTmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'repomap-test-'));
}

function writeFile(dir: string, relPath: string, content: string): void {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
}

// ─── buildRepoMap ─────────────────────────────────────────────────────────────

describe('buildRepoMap', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns a RepoMap with files, totalTokens, and lastUpdated', async () => {
    writeFile(tmpDir, 'hello.ts', 'export function hello() {}');
    const map = await buildRepoMap(tmpDir);
    expect(map.files).toBeInstanceOf(Map);
    expect(typeof map.totalTokens).toBe('number');
    expect(typeof map.lastUpdated).toBe('number');
    expect(map.lastUpdated).toBeLessThanOrEqual(Date.now());
  });

  it('discovers TypeScript source files', async () => {
    writeFile(tmpDir, 'foo.ts', 'export const foo = 1;');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.some((k) => k.endsWith('foo.ts'))).toBe(true);
  });

  it('discovers JavaScript source files', async () => {
    writeFile(tmpDir, 'bar.js', 'module.exports = {};');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.some((k) => k.endsWith('bar.js'))).toBe(true);
  });

  it('ignores node_modules by default', async () => {
    writeFile(tmpDir, 'node_modules/pkg/index.ts', 'export const x = 1;');
    writeFile(tmpDir, 'src/app.ts', 'export const app = 1;');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.every((k) => !k.includes('node_modules'))).toBe(true);
  });

  it('ignores dist by default', async () => {
    writeFile(tmpDir, 'dist/index.js', 'module.exports = {};');
    writeFile(tmpDir, 'src/app.ts', 'export const app = 1;');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.every((k) => !k.includes('dist'))).toBe(true);
  });

  it('respects extraIgnore option', async () => {
    writeFile(tmpDir, 'secret/vault.ts', 'export const secret = "hidden";');
    writeFile(tmpDir, 'src/app.ts', 'export const app = 1;');
    const map = await buildRepoMap(tmpDir, { extraIgnore: ['secret'] });
    const keys = [...map.files.keys()];
    expect(keys.every((k) => !k.includes('secret'))).toBe(true);
  });

  it('returns empty files map for a directory with no supported files', async () => {
    writeFile(tmpDir, 'README.md', '# Hello');
    const map = await buildRepoMap(tmpDir);
    expect(map.files.size).toBe(0);
    expect(map.totalTokens).toBe(0);
  });

  it('respects .alexiignore file', async () => {
    writeFile(tmpDir, '.alexiignore', 'ignored_dir\n# this is a comment\n');
    writeFile(tmpDir, 'ignored_dir/secret.ts', 'export const s = 1;');
    writeFile(tmpDir, 'src/visible.ts', 'export const v = 1;');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.every((k) => !k.includes('ignored_dir'))).toBe(true);
    expect(keys.some((k) => k.endsWith('visible.ts'))).toBe(true);
  });

  it('extracts symbols into the files map', async () => {
    writeFile(tmpDir, 'lib.ts', 'export function compute(x: number): number { return x * 2; }');
    const map = await buildRepoMap(tmpDir);
    const allSymbols = [...map.files.values()].flat();
    const names = allSymbols.map((s) => s.name);
    expect(names).toContain('compute');
  });

  it('discovers bash source files (.sh)', async () => {
    writeFile(tmpDir, 'deploy.sh', 'deploy() { echo deploying; }\n');
    const map = await buildRepoMap(tmpDir);
    const keys = [...map.files.keys()];
    expect(keys.some((k) => k.endsWith('deploy.sh'))).toBe(true);
  });

  it('extracts bash function symbols into the files map', async () => {
    writeFile(
      tmpDir,
      'utils.sh',
      [
        'compile() { echo compile; }',
        'function bundle { echo bundle; }',
        'function ship() { echo ship; }',
      ].join('\n')
    );
    const map = await buildRepoMap(tmpDir);
    const allSymbols = [...map.files.values()].flat();
    const names = allSymbols.map((s) => s.name);
    expect(names).toContain('compile');
    expect(names).toContain('bundle');
    expect(names).toContain('ship');
  });
});

// ─── generateRepoMap ──────────────────────────────────────────────────────────

describe('generateRepoMap', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns empty string for a directory with no supported files', async () => {
    const result = await generateRepoMap(tmpDir);
    expect(result).toBe('');
  });

  it('returns a non-empty string when supported files exist', async () => {
    writeFile(tmpDir, 'index.ts', 'export const x = 1;');
    const result = await generateRepoMap(tmpDir);
    expect(result.length).toBeGreaterThan(0);
  });

  it('output starts with the repo map header', async () => {
    writeFile(tmpDir, 'index.ts', 'export const x = 1;');
    const result = await generateRepoMap(tmpDir);
    expect(result).toMatch(/^# Repository Map \(~\d+ tokens\)/);
  });

  it('output contains the ordering comment', async () => {
    writeFile(tmpDir, 'index.ts', 'export const x = 1;');
    const result = await generateRepoMap(tmpDir);
    expect(result).toContain('# Files are ordered by import importance');
  });

  it('output includes relative file paths (not absolute)', async () => {
    writeFile(tmpDir, 'src/helper.ts', 'export function help() {}');
    const result = await generateRepoMap(tmpDir);
    // Should contain the relative path
    expect(result).toContain('src/helper.ts');
    // Should NOT contain the tmp dir absolute prefix in the file listings
    expect(result).not.toContain(tmpDir);
  });

  it('respects the maxTokens budget', async () => {
    // Write many files to potentially exceed a tiny budget
    for (let i = 0; i < 10; i++) {
      writeFile(tmpDir, `file${i}.ts`, `export function fn${i}() { return ${i}; }`);
    }
    const smallBudget = 50; // very small
    const result = await generateRepoMap(tmpDir, { maxTokens: smallBudget });
    if (result) {
      // Extract the reported token count from the header
      const match = result.match(/~(\d+) tokens/);
      if (match) {
        const reported = parseInt(match[1], 10);
        // Allow some slack — the header itself adds tokens on top of the budget
        expect(reported).toBeLessThanOrEqual(smallBudget * 3);
      }
    }
  });

  it('includes symbol signatures in the output', async () => {
    writeFile(tmpDir, 'api.ts', 'export function doWork(input: string): boolean { return true; }');
    const result = await generateRepoMap(tmpDir);
    expect(result).toContain('doWork');
  });

  it('includes bash scripts with function signatures in the output', async () => {
    writeFile(
      tmpDir,
      'scripts/release.sh',
      [
        '#!/usr/bin/env bash',
        'tag_release() { git tag "v$1"; }',
        'function push_tags { git push --tags; }',
      ].join('\n')
    );
    const result = await generateRepoMap(tmpDir);
    expect(result).toContain('scripts/release.sh');
    expect(result).toContain('tag_release');
    expect(result).toContain('push_tags');
  });
});

// ─── RepoMapManager ───────────────────────────────────────────────────────────

describe('RepoMapManager', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkTmpDir();
    writeFile(tmpDir, 'index.ts', 'export const x = 1;');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('constructor defaults', () => {
    it('uses DEFAULT_MAX_TOKENS (1000) when no maxTokens provided', () => {
      const mgr = new RepoMapManager(tmpDir);
      expect(mgr.maxTokens).toBe(1000);
    });

    it('uses provided maxTokens', () => {
      const mgr = new RepoMapManager(tmpDir, { maxTokens: 2500 });
      expect(mgr.maxTokens).toBe(2500);
    });
  });

  describe('cached getter', () => {
    it('returns null before any map has been built', () => {
      const mgr = new RepoMapManager(tmpDir);
      expect(mgr.cached).toBeNull();
    });

    it('returns the cached string after getMap()', async () => {
      const mgr = new RepoMapManager(tmpDir);
      await mgr.getMap();
      expect(typeof mgr.cached).toBe('string');
    });
  });

  describe('getMap', () => {
    it('returns a non-empty string for a directory with source files', async () => {
      const mgr = new RepoMapManager(tmpDir);
      const result = await mgr.getMap();
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns the cached value on subsequent calls within refresh interval', async () => {
      const mgr = new RepoMapManager(tmpDir, { refreshIntervalMs: 60_000 });
      const first = await mgr.getMap();
      // Spy on refresh to ensure it is NOT called the second time
      const refreshSpy = vi.spyOn(mgr, 'refresh');
      const second = await mgr.getMap();
      expect(second).toBe(first);
      expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('rebuilds when the cache is stale (refreshIntervalMs = 0)', async () => {
      const mgr = new RepoMapManager(tmpDir, { refreshIntervalMs: 0 });
      const refreshSpy = vi.spyOn(mgr, 'refresh');
      await mgr.getMap(); // first call — always refreshes
      await mgr.getMap(); // second call — interval=0, so stale immediately
      expect(refreshSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('rebuilds and updates the cached value', async () => {
      const mgr = new RepoMapManager(tmpDir, { refreshIntervalMs: 60_000 });
      const first = await mgr.getMap();
      // Add a new file to change the map
      writeFile(tmpDir, 'new_file.ts', 'export function brand() {}');
      const second = await mgr.refresh();
      // The new map should include the new file
      expect(second).toContain('new_file.ts');
      expect(second).not.toBe(first); // map changed
    });

    it('deduplicates concurrent refresh calls', async () => {
      const mgr = new RepoMapManager(tmpDir);
      // Trigger two concurrent refreshes
      const [r1, r2] = await Promise.all([mgr.refresh(), mgr.refresh()]);
      expect(r1).toBe(r2); // same promise resolved to the same value
    });
  });

  describe('setMaxTokens', () => {
    it('updates the maxTokens value', () => {
      const mgr = new RepoMapManager(tmpDir, { maxTokens: 500 });
      mgr.setMaxTokens(2000);
      expect(mgr.maxTokens).toBe(2000);
    });

    it('invalidates the cache', async () => {
      const mgr = new RepoMapManager(tmpDir, { refreshIntervalMs: 60_000 });
      await mgr.getMap(); // populate cache
      expect(mgr.cached).not.toBeNull();
      mgr.setMaxTokens(200);
      expect(mgr.cached).toBeNull();
    });

    it('uses the new budget on the next getMap call', async () => {
      const mgr = new RepoMapManager(tmpDir, { maxTokens: 10000 });
      await mgr.getMap();
      mgr.setMaxTokens(50);
      const newMap = await mgr.getMap();
      // With a tiny budget fewer tokens should be reported
      if (newMap) {
        const match = newMap.match(/~(\d+) tokens/);
        if (match) {
          expect(parseInt(match[1], 10)).toBeLessThan(200);
        }
      }
    });
  });
});
