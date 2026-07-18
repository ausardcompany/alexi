/**
 * Integration tests for `indexing.additionalExtensions`.
 *
 * Verifies that grep, glob, and codesearch honor the config-driven list
 * of extra file extensions when locating files. We mock
 * `getConfigAdditionalExtensions` rather than writing to the real
 * ~/.alexi/config.json so the tests are hermetic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Mock the tool index to bypass permission checks (same pattern as
// existing grep/glob/codesearch tests).
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual('../../../src/tool/index.js');
  return {
    ...actual,
    defineTool: (def: {
      name: string;
      description: string;
      execute: (...args: unknown[]) => unknown;
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

// Mock the user config module so we can control the additional
// extensions without touching the real filesystem config.
const additionalExtensions: string[] = [];
vi.mock('../../../src/config/userConfig.js', async () => {
  const actual = await vi.importActual('../../../src/config/userConfig.js');
  return {
    ...actual,
    getConfigAdditionalExtensions: (): string[] => [...additionalExtensions],
  };
});

// Force the JS fallback path in grep so behavior is deterministic across
// environments (ripgrep may or may not be installed on the runner). The
// merge logic is the same on both paths.
process.env.ALEXI_DISABLE_RG = '1';

import { grepTool } from '../../../src/tool/tools/grep.js';
import { globTool } from '../../../src/tool/tools/glob.js';
import { codesearchTool } from '../../../src/tool/tools/codesearch.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('indexing.additionalExtensions integration', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-add-ext-test-'));
    context = { workdir: tempDir };
    additionalExtensions.length = 0;
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
    additionalExtensions.length = 0;
  });

  describe('grep', () => {
    it('finds .proto files when include is *.ts + config has .proto', async () => {
      await fs.writeFile(path.join(tempDir, 'schema.proto'), 'message Foo { needle = 1; }');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'const needle = true;');
      await fs.writeFile(path.join(tempDir, 'other.txt'), 'needle here');

      additionalExtensions.push('.proto');

      const result = await grepTool.execute({ pattern: 'needle', include: '*.ts' }, context);
      expect(result.success).toBe(true);
      const files = (result.data?.matches ?? []).map((m) => m.file).sort();
      expect(files).toEqual(['main.ts', 'schema.proto']);
      // The .txt file should NOT be included — additionalExtensions only
      // extends the caller's filter.
      expect(files).not.toContain('other.txt');
    });

    it('does not narrow an unset include when config has extensions', async () => {
      await fs.writeFile(path.join(tempDir, 'schema.proto'), 'needle');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'needle');
      await fs.writeFile(path.join(tempDir, 'other.txt'), 'needle');

      additionalExtensions.push('.proto');

      // No include -> historical behavior of "search everything" is
      // preserved. Extensions are additive; they must not restrict.
      const result = await grepTool.execute({ pattern: 'needle' }, context);
      expect(result.success).toBe(true);
      const files = (result.data?.matches ?? []).map((m) => m.file).sort();
      expect(files).toContain('schema.proto');
      expect(files).toContain('main.ts');
      expect(files).toContain('other.txt');
    });

    it('is a no-op when additionalExtensions is empty', async () => {
      await fs.writeFile(path.join(tempDir, 'schema.proto'), 'needle');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'needle');

      const result = await grepTool.execute({ pattern: 'needle', include: '*.ts' }, context);
      expect(result.success).toBe(true);
      const files = (result.data?.matches ?? []).map((m) => m.file);
      expect(files).toEqual(['main.ts']);
    });
  });

  describe('glob', () => {
    it('finds .proto files when pattern is **/*.ts + config has .proto', async () => {
      await fs.writeFile(path.join(tempDir, 'schema.proto'), 'x');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'x');
      await fs.writeFile(path.join(tempDir, 'other.txt'), 'x');

      additionalExtensions.push('.proto');

      const result = await globTool.execute({ pattern: '**/*.ts' }, context);
      expect(result.success).toBe(true);
      const matches = (result.data?.matches ?? []).sort();
      expect(matches).toContain('schema.proto');
      expect(matches).toContain('main.ts');
      expect(matches).not.toContain('other.txt');
    });

    it('is a no-op when additionalExtensions is empty', async () => {
      await fs.writeFile(path.join(tempDir, 'schema.proto'), 'x');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'x');

      const result = await globTool.execute({ pattern: '**/*.ts' }, context);
      expect(result.success).toBe(true);
      const matches = result.data?.matches ?? [];
      expect(matches).toEqual(['main.ts']);
    });
  });

  describe('codesearch', () => {
    it('extends the code-file whitelist with additional extensions', async () => {
      // Without config, codesearch skips .proto (not in CODE_EXTENSIONS).
      await fs.writeFile(
        path.join(tempDir, 'schema.proto'),
        'message HandleRequest { string name = 1; }'
      );
      await fs.writeFile(
        path.join(tempDir, 'main.ts'),
        'function handleRequest() { return true; }'
      );

      // Baseline: without config, only main.ts is searched.
      let result = await codesearchTool.execute(
        { query: 'HandleRequest', searchType: 'content' },
        context
      );
      expect(result.success).toBe(true);
      let matchFiles = (result.data?.matches ?? []).map((m) => m.file).sort();
      expect(matchFiles).toContain('main.ts');
      expect(matchFiles).not.toContain('schema.proto');

      // With config, .proto is now considered a code file.
      additionalExtensions.push('.proto');
      result = await codesearchTool.execute(
        { query: 'HandleRequest', searchType: 'content' },
        context
      );
      expect(result.success).toBe(true);
      matchFiles = (result.data?.matches ?? []).map((m) => m.file).sort();
      expect(matchFiles).toContain('schema.proto');
    });
  });
});
