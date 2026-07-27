/**
 * Integration tests for project-local `.alexi/config.json` and
 * `.alexi/extensions` support in the glob and grep tools.
 *
 * These tests write real files under an isolated temp `workdir` so the
 * end-to-end pipeline (tool -> `getIndexingExtensions` -> file readers)
 * is exercised without mocking. They do NOT touch the real global
 * `~/.alexi/config.json`; instead, they assert only that
 * project-configured extensions ARE matched, without asserting that
 * unrelated extensions are not matched (which would depend on the
 * runner's global config being empty).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Force the JS fallback path in grep so behavior is deterministic across
// environments (ripgrep may or may not be installed on the runner).
process.env.ALEXI_DISABLE_RG = '1';

import { grepTool } from '../../../src/tool/tools/grep.js';
import { globTool } from '../../../src/tool/tools/glob.js';
import type { ToolContext } from '../../../src/tool/index.js';

describe('project indexing extensions integration', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-project-idx-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('glob', () => {
    it('matches .mdx files when project .alexi/config.json declares mdx', async () => {
      await fs.writeFile(path.join(tempDir, 'note.mdx'), 'content');
      await fs.writeFile(path.join(tempDir, 'readme.md'), 'content');
      await fs.mkdir(path.join(tempDir, '.alexi'));
      await fs.writeFile(
        path.join(tempDir, '.alexi', 'config.json'),
        JSON.stringify({ indexing: { extensions: ['mdx'] } }),
        'utf-8'
      );

      const result = await globTool.execute({ pattern: '**/*.md' }, context);
      expect(result.success).toBe(true);
      const matches = result.data?.matches ?? [];
      expect(matches).toContain('note.mdx');
      expect(matches).toContain('readme.md');
    });

    it('matches .astro / .svelte files declared in .alexi/extensions', async () => {
      await fs.writeFile(path.join(tempDir, 'page.astro'), 'x');
      await fs.writeFile(path.join(tempDir, 'widget.svelte'), 'x');
      await fs.writeFile(path.join(tempDir, 'a.ts'), 'x');
      await fs.mkdir(path.join(tempDir, '.alexi'));
      await fs.writeFile(
        path.join(tempDir, '.alexi', 'extensions'),
        '# custom stacks\nastro\nsvelte\n',
        'utf-8'
      );

      const result = await globTool.execute({ pattern: '**/*.ts' }, context);
      expect(result.success).toBe(true);
      const matches = result.data?.matches ?? [];
      expect(matches).toContain('page.astro');
      expect(matches).toContain('widget.svelte');
      expect(matches).toContain('a.ts');
    });

    it('matches .vue via indexing.extensions in project config', async () => {
      await fs.writeFile(path.join(tempDir, 'App.vue'), 'x');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'x');
      await fs.mkdir(path.join(tempDir, '.alexi'));
      await fs.writeFile(
        path.join(tempDir, '.alexi', 'config.json'),
        JSON.stringify({ indexing: { extensions: ['vue'] } }),
        'utf-8'
      );

      const result = await globTool.execute({ pattern: '**/*.ts' }, context);
      expect(result.success).toBe(true);
      const matches = result.data?.matches ?? [];
      expect(matches).toContain('App.vue');
      expect(matches).toContain('main.ts');
    });
  });

  describe('grep', () => {
    it('searches .mdx files when project config declares mdx', async () => {
      await fs.writeFile(path.join(tempDir, 'note.mdx'), 'needle in mdx');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'needle in ts');
      await fs.mkdir(path.join(tempDir, '.alexi'));
      await fs.writeFile(
        path.join(tempDir, '.alexi', 'config.json'),
        JSON.stringify({ indexing: { extensions: ['mdx'] } }),
        'utf-8'
      );

      const result = await grepTool.execute({ pattern: 'needle', include: '*.ts' }, context);
      expect(result.success).toBe(true);
      const files = (result.data?.matches ?? []).map((m) => m.file);
      expect(files).toContain('main.ts');
      expect(files).toContain('note.mdx');
    });

    it('searches .astro / .svelte files from .alexi/extensions', async () => {
      await fs.writeFile(path.join(tempDir, 'page.astro'), 'const needle = 1;');
      await fs.writeFile(path.join(tempDir, 'widget.svelte'), 'let needle;');
      await fs.writeFile(path.join(tempDir, 'main.ts'), 'const needle = 1;');
      await fs.mkdir(path.join(tempDir, '.alexi'));
      await fs.writeFile(path.join(tempDir, '.alexi', 'extensions'), 'astro\nsvelte\n', 'utf-8');

      const result = await grepTool.execute({ pattern: 'needle', include: '*.ts' }, context);
      expect(result.success).toBe(true);
      const files = (result.data?.matches ?? []).map((m) => m.file);
      expect(files).toContain('main.ts');
      expect(files).toContain('page.astro');
      expect(files).toContain('widget.svelte');
    });
  });
});
