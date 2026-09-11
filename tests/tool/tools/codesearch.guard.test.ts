/**
 * Tests for the home-directory / filesystem-root indexing guard on the
 * codesearch tool.
 *
 * Kilocode #13960: walking $HOME or `/` from a `ax chat` session in the
 * home directory can OOM-kill the process. Codesearch must refuse those
 * roots at the entry point of `execute`, before spawning any recursive
 * walker.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Bypass permission checks in defineTool for these tests. Mirrors the
// shape used by the neighbouring `codesearch.test.ts`.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/tool/index.js')>(
    '../../../src/tool/index.js'
  );
  return {
    ...actual,
    defineTool: (def: unknown) => {
      const d = def as {
        name: string;
        description: string;
        parameters: unknown;
        execute: (...args: unknown[]) => unknown;
      };
      return {
        ...d,
        execute: d.execute,
        executeUnsafe: d.execute,
        toFunctionSchema: () => ({
          name: d.name,
          description: d.description,
          parameters: {},
        }),
      };
    },
  };
});

import { codesearchTool } from '../../../src/tool/tools/codesearch.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('codesearch home / filesystem-root guard', () => {
  let tempDir: string;
  let fakeHome: string;
  const originalTestHome = process.env.ALEXI_TEST_HOME;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codesearch-guard-'));
    fakeHome = await fs.mkdtemp(path.join(os.tmpdir(), 'codesearch-home-'));
    process.env.ALEXI_TEST_HOME = fakeHome;
  });

  afterEach(async () => {
    if (originalTestHome === undefined) {
      delete process.env.ALEXI_TEST_HOME;
    } else {
      process.env.ALEXI_TEST_HOME = originalTestHome;
    }
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.rm(fakeHome, { recursive: true, force: true });
  });

  it('refuses to run when workdir is the user home directory', async () => {
    const ctx: ToolContext = { workdir: fakeHome };
    const result = await codesearchTool.execute(
      {
        query: 'foo',
        searchType: 'content',
        contextLines: 0,
        maxResults: 50,
        caseSensitive: false,
      },
      ctx
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('home directory');
    expect(result.error).toContain('OOM');
  });

  it('refuses to run when workdir is the filesystem root (POSIX)', async () => {
    if (process.platform === 'win32') {
      return;
    }
    const ctx: ToolContext = { workdir: '/' };
    const result = await codesearchTool.execute(
      {
        query: 'foo',
        searchType: 'content',
        contextLines: 0,
        maxResults: 50,
        caseSensitive: false,
      },
      ctx
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('filesystem root');
  });

  it('refuses when explicit `path:` resolves to home even from a safe workdir', async () => {
    const ctx: ToolContext = { workdir: tempDir };
    const result = await codesearchTool.execute(
      {
        query: 'foo',
        path: fakeHome,
        searchType: 'content',
        contextLines: 0,
        maxResults: 50,
        caseSensitive: false,
      },
      ctx
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('home directory');
  });

  it('allows normal project directories', async () => {
    await fs.writeFile(path.join(tempDir, 'a.ts'), 'const marker = 1;\n');
    const ctx: ToolContext = { workdir: tempDir };
    const result = await codesearchTool.execute(
      {
        query: 'marker',
        searchType: 'content',
        contextLines: 0,
        maxResults: 50,
        caseSensitive: false,
      },
      ctx
    );
    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeGreaterThanOrEqual(1);
  });
});
