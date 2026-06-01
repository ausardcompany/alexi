/**
 * Tests for the ripgrep (`rg`) fast-path in the grep tool.
 *
 * - Verifies the JS fallback is used when `rg` is not available
 *   (forced via `ALEXI_DISABLE_RG=1`) and produces unchanged results.
 * - Verifies the `rg --version` detection result is cached so we don't
 *   spawn a process on every grep call.
 * - Verifies an end-to-end run through the rg path against a tmp dir,
 *   skipping when `rg` is not on PATH on the CI runner.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';
import { execSync } from 'child_process';

// Track all spawn calls in a place tests can inspect / replace.
const spawnCalls: Array<{ cmd: string; args: ReadonlyArray<string> }> = [];
let spawnImpl: ((cmd: string, args: ReadonlyArray<string>) => unknown) | null = null;

vi.mock('child_process', async () => {
  const actual = await vi.importActual<typeof import('child_process')>('child_process');
  return {
    ...actual,
    spawn: (cmd: string, args: ReadonlyArray<string>, opts?: unknown): unknown => {
      spawnCalls.push({ cmd, args });
      if (spawnImpl) {
        return spawnImpl(cmd, args);
      }
      return (actual.spawn as unknown as (...a: unknown[]) => unknown)(cmd, args, opts);
    },
  };
});

// Mock the tool index module to bypass permission checks.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: {
      name: string;
      description: string;
      execute: unknown;
      [k: string]: unknown;
    }) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import {
  grepTool,
  _resetRgDetectionForTests,
  _internalsForTests,
} from '../../../src/tool/tools/grep.js';
import type { ToolContext } from '../../../src/tool/index.js';

function rgOnPath(): boolean {
  try {
    execSync('rg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const HAS_RG = rgOnPath();

describe('Grep Tool - rg fast path', () => {
  let tempDir: string;
  let context: ToolContext;
  let originalDisable: string | undefined;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'grep-rg-test-'));
    context = { workdir: tempDir };
    originalDisable = process.env.ALEXI_DISABLE_RG;
    _resetRgDetectionForTests();
    spawnCalls.length = 0;
    spawnImpl = null;
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
    if (originalDisable === undefined) {
      delete process.env.ALEXI_DISABLE_RG;
    } else {
      process.env.ALEXI_DISABLE_RG = originalDisable;
    }
    _resetRgDetectionForTests();
    spawnCalls.length = 0;
    spawnImpl = null;
  });

  describe('JS fallback', () => {
    it('uses the JS path when ALEXI_DISABLE_RG=1 and produces standard results', async () => {
      process.env.ALEXI_DISABLE_RG = '1';
      _resetRgDetectionForTests();

      await fs.writeFile(path.join(tempDir, 'a.txt'), 'hello world\nno match');
      await fs.writeFile(path.join(tempDir, 'b.txt'), 'goodbye world');

      const result = await grepTool.execute({ pattern: 'hello' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(1);
      expect(result.data?.matches[0].file).toBe('a.txt');
      expect(result.data?.matches[0].line).toBe(1);
      expect(result.data?.matches[0].content).toContain('hello');

      // detectRg() must not have spawned anything.
      const rgSpawns = spawnCalls.filter((c) => c.cmd === 'rg');
      expect(rgSpawns.length).toBe(0);
    });

    it('returns ok:false on invalid regex regardless of backend', async () => {
      process.env.ALEXI_DISABLE_RG = '1';
      _resetRgDetectionForTests();

      await fs.writeFile(path.join(tempDir, 'f.txt'), 'content');
      const result = await grepTool.execute({ pattern: '[invalid' }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid regex pattern');
    });
  });

  describe('detection cache', () => {
    it('only spawns `rg --version` once per process', async () => {
      // Force a fresh detection with rg disabled by env. We'll *temporarily*
      // unset it, but also stub spawn so we don't actually hit rg even if
      // it happens to be installed.
      delete process.env.ALEXI_DISABLE_RG;
      _resetRgDetectionForTests();

      let versionSpawnCount = 0;
      spawnImpl = (cmd: string, args: ReadonlyArray<string>): unknown => {
        if (cmd === 'rg' && args[0] === '--version') {
          versionSpawnCount += 1;
          // Synthesize a child process that "fails" so we deterministically
          // fall back to the JS path. This is enough to verify caching.
          const handlers: Record<string, ((arg?: unknown) => void)[]> = {};
          const proc = {
            on(event: string, handler: (arg?: unknown) => void) {
              handlers[event] = handlers[event] ?? [];
              handlers[event].push(handler);
              return proc;
            },
            kill(): void {
              /* noop */
            },
            stdout: null,
            stderr: null,
          };
          // Fire 'exit' with non-zero code on next tick.
          setImmediate(() => {
            (handlers.exit ?? []).forEach((h) => h(1));
          });
          return proc;
        }
        // Any other spawn call should not happen in this test (the JS path
        // doesn't spawn). Throw to make accidental usage obvious.
        throw new Error(`Unexpected spawn: ${cmd}`);
      };

      await fs.writeFile(path.join(tempDir, 'a.txt'), 'one');

      // Three back-to-back calls — only the first should spawn `rg --version`.
      await grepTool.execute({ pattern: 'one' }, context);
      await grepTool.execute({ pattern: 'one' }, context);
      await grepTool.execute({ pattern: 'one' }, context);

      expect(versionSpawnCount).toBe(1);
    });

    it('exposes _resetRgDetectionForTests to clear the cache', async () => {
      process.env.ALEXI_DISABLE_RG = '1';
      // First detection: false (env-disabled).
      expect(await _internalsForTests.detectRg()).toBe(false);
      _resetRgDetectionForTests();
      // After reset, with env still set, should still be false.
      expect(await _internalsForTests.detectRg()).toBe(false);
    });
  });

  describe('end-to-end via rg', () => {
    it.skipIf(!HAS_RG)('produces the same result shape as the JS path', async () => {
      // Build a tiny tree.
      await fs.mkdir(path.join(tempDir, 'sub'));
      await fs.writeFile(path.join(tempDir, 'a.ts'), 'const foo = 1;\nconst bar = 2;');
      await fs.writeFile(path.join(tempDir, 'sub', 'b.ts'), 'const foo = 3;');
      await fs.writeFile(path.join(tempDir, 'c.txt'), 'foo here too');

      // First, run via the JS path.
      process.env.ALEXI_DISABLE_RG = '1';
      _resetRgDetectionForTests();
      const jsResult = await grepTool.execute({ pattern: 'foo', include: '*.ts' }, context);

      // Then via rg.
      delete process.env.ALEXI_DISABLE_RG;
      _resetRgDetectionForTests();
      const rgResult = await grepTool.execute({ pattern: 'foo', include: '*.ts' }, context);

      expect(jsResult.success).toBe(true);
      expect(rgResult.success).toBe(true);

      // Same totals.
      expect(rgResult.data?.totalMatches).toBe(jsResult.data?.totalMatches);

      // Same set of (file, line) matches.
      const norm = (
        m: ReadonlyArray<{ file: string; line: number; content: string }> | undefined
      ): string[] => (m ?? []).map((x) => `${x.file}:${x.line}`).sort();
      expect(norm(rgResult.data?.matches)).toEqual(norm(jsResult.data?.matches));

      // Shape check on individual records.
      for (const m of rgResult.data?.matches ?? []) {
        expect(typeof m.file).toBe('string');
        expect(typeof m.line).toBe('number');
        expect(typeof m.content).toBe('string');
        // Line content cap is 200 chars, same as JS path.
        expect(m.content.length).toBeLessThanOrEqual(200);
      }
    });

    it.skipIf(!HAS_RG)('returns empty results when no match', async () => {
      await fs.writeFile(path.join(tempDir, 'a.txt'), 'nothing here');
      delete process.env.ALEXI_DISABLE_RG;
      _resetRgDetectionForTests();

      const result = await grepTool.execute({ pattern: 'absolutelynotpresent' }, context);
      expect(result.success).toBe(true);
      expect(result.data?.totalMatches).toBe(0);
      expect(result.data?.matches).toEqual([]);
    });
  });
});
