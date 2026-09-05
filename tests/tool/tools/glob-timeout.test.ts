/**
 * Regression tests for the bounded glob search deadline
 * (kilocode PR #13805, adapted for Alexi's JS glob walker).
 *
 * These tests guard against a class of stalled-search bugs where a hung
 * filesystem call would block an agent turn indefinitely. On timeout the
 * tool must surface a partial, non-fatal result rather than throwing.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index module so we can invoke `.execute` without booting
// the permission stack. Matches the pattern used in `glob.test.ts`.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: any) => ({
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

import { globTool } from '../../../src/tool/tools/glob.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('Glob Tool timeout', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'glob-timeout-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('returns truncated+timedOut when the deadline elapses before results', async () => {
    // Simulate a hung filesystem by making `fs.readdir` never resolve. The
    // glob walker calls `readdir` on every directory it visits, so a
    // never-resolving readdir models a stalled/network-mounted repo scan.
    const readdirSpy = vi
      .spyOn(fs, 'readdir')
      .mockImplementation(() => new Promise(() => {}) as unknown as ReturnType<typeof fs.readdir>);

    // Enable fake timers BEFORE calling execute so the deadline setTimeout
    // is captured by the fake clock. `fs.stat` is invoked synchronously
    // in the tool before setTimeout, so we let it complete with the real
    // temp dir (the mocked call is only readdir).
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    try {
      const promise = globTool.execute({ pattern: '**/*.ts' }, context);

      // Yield the microtask queue so the tool's initial `fs.stat` await
      // resolves and it reaches the `setTimeout(...)` line.
      await Promise.resolve();
      await Promise.resolve();

      // Advance past the 30_000ms default deadline.
      await vi.advanceTimersByTimeAsync(30_500);

      const result = await promise;

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timedOut).toBe(true);
        expect(result.data.truncated).toBe(true);
        expect(result.data.matches).toEqual([]);
        expect(result.data.count).toBe(0);
      }

      // Sanity check: the walker did attempt to read at least the root dir.
      expect(readdirSpy).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not set timedOut on a successful fast search', async () => {
    // A trivially small tree should complete well within the deadline.
    await fs.writeFile(path.join(tempDir, 'a.ts'), 'x');
    await fs.writeFile(path.join(tempDir, 'b.ts'), 'x');

    const result = await globTool.execute({ pattern: '*.ts' }, context);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timedOut).toBeUndefined();
      expect(result.data.truncated).toBeUndefined();
      expect(result.data.count).toBe(2);
    }
  });
});
