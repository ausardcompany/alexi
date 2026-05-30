import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PluginManager, PluginError, autoDiscoverPluginRoots } from '../../src/plugin/index.js';

/**
 * Build a project skeleton at `tmpdir/.alexi/skills/<name>/` containing
 * a `plugin.json` (and optional command files) for auto-load tests.
 */
function writePluginManifest(pluginRoot: string, manifest: Record<string, unknown> | string): void {
  fs.mkdirSync(pluginRoot, { recursive: true });
  const body = typeof manifest === 'string' ? manifest : JSON.stringify(manifest, null, 2);
  fs.writeFileSync(path.join(pluginRoot, 'plugin.json'), body);
}

describe('Plugin auto-load (.alexi/skills/<name>/plugin.json)', () => {
  let tmpdir: string;
  let projectRoot: string;
  let homeRoot: string;
  let originalHome: string | undefined;
  let originalUserprofile: string | undefined;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-plugin-autoload-'));
    projectRoot = path.join(tmpdir, 'project');
    homeRoot = path.join(tmpdir, 'home');
    fs.mkdirSync(projectRoot, { recursive: true });
    fs.mkdirSync(homeRoot, { recursive: true });

    // Redirect homedir() to a sandboxed location so the global lookup never
    // touches the developer's real ~/.alexi/skills.
    originalHome = process.env.HOME;
    originalUserprofile = process.env.USERPROFILE;
    process.env.HOME = homeRoot;
    process.env.USERPROFILE = homeRoot;
    vi.spyOn(os, 'homedir').mockReturnValue(homeRoot);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
    if (originalUserprofile === undefined) {
      delete process.env.USERPROFILE;
    } else {
      process.env.USERPROFILE = originalUserprofile;
    }
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  describe('autoDiscoverPluginRoots', () => {
    it('discovers project plugins with a plugin.json', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'foo');
      writePluginManifest(pluginRoot, { name: 'foo', version: '0.1.0' });

      const roots = autoDiscoverPluginRoots(projectRoot);
      expect(roots).toContain(pluginRoot);
    });

    it('discovers global plugins under ~/.alexi/skills/', () => {
      const pluginRoot = path.join(homeRoot, '.alexi', 'skills', 'gfoo');
      writePluginManifest(pluginRoot, { name: 'gfoo', version: '0.2.0' });

      const roots = autoDiscoverPluginRoots(projectRoot);
      expect(roots).toContain(pluginRoot);
    });

    it('skips directories without a plugin.json', () => {
      const noManifest = path.join(projectRoot, '.alexi', 'skills', 'bar');
      fs.mkdirSync(noManifest, { recursive: true });

      const roots = autoDiscoverPluginRoots(projectRoot);
      expect(roots).not.toContain(noManifest);
    });

    it('dedupes by realpath when a symlink targets another plugin dir', () => {
      const fooRoot = path.join(projectRoot, '.alexi', 'skills', 'foo');
      writePluginManifest(fooRoot, { name: 'foo', version: '0.1.0' });

      const dupLink = path.join(projectRoot, '.alexi', 'skills', 'dup');
      try {
        fs.symlinkSync(fooRoot, dupLink, 'dir');
      } catch {
        // Symlink creation can fail on restricted filesystems (e.g. some CI
        // sandboxes on Windows). Skip the assertion in that case.
        return;
      }

      const roots = autoDiscoverPluginRoots(projectRoot);
      const occurrences = roots.filter((r) => fs.realpathSync(r) === fs.realpathSync(fooRoot));
      expect(occurrences.length).toBe(1);
    });

    it('returns empty list when no skills dir exists', () => {
      const roots = autoDiscoverPluginRoots(projectRoot);
      expect(roots).toEqual([]);
    });
  });

  describe('PluginManager.loadAutoDiscovered', () => {
    it('loads valid manifests', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'foo');
      writePluginManifest(pluginRoot, {
        name: 'foo',
        version: '0.1.0',
        description: 'Foo plugin',
      });

      const manager = new PluginManager(projectRoot);
      const results = await manager.loadAutoDiscovered(projectRoot);
      const loaded = results.filter((r) => r.success).map((r) => r.pluginName);
      expect(loaded).toContain('foo');
      expect(manager.get('foo')).toBeDefined();
      expect(manager.get('foo')?.version).toBe('0.1.0');
    });

    it('does not load directories without plugin.json', async () => {
      const noManifest = path.join(projectRoot, '.alexi', 'skills', 'bar');
      fs.mkdirSync(noManifest, { recursive: true });

      const manager = new PluginManager(projectRoot);
      const results = await manager.loadAutoDiscovered(projectRoot);
      expect(results).toEqual([]);
      expect(manager.get('bar')).toBeUndefined();
    });

    it('emits PluginError for invalid manifests and continues with valid ones', async () => {
      // Valid sibling
      const fooRoot = path.join(projectRoot, '.alexi', 'skills', 'foo');
      writePluginManifest(fooRoot, { name: 'foo', version: '0.1.0' });

      // Invalid manifest: missing required `version` field
      const bazRoot = path.join(projectRoot, '.alexi', 'skills', 'baz');
      writePluginManifest(bazRoot, { name: 'baz' });

      const errors: Array<{ pluginName: string; context?: string }> = [];
      const unsubscribe = PluginError.subscribe((p) =>
        errors.push({ pluginName: p.pluginName, context: p.context })
      );

      try {
        const manager = new PluginManager(projectRoot);
        const results = await manager.loadAutoDiscovered(projectRoot);

        expect(manager.get('foo')).toBeDefined();
        expect(manager.get('baz')).toBeUndefined();

        const bazResult = results.find((r) => !r.success);
        expect(bazResult).toBeDefined();

        const validateError = errors.find((e) => e.context === 'manifest:validate');
        expect(validateError).toBeDefined();
      } finally {
        unsubscribe();
      }
    });

    it('loads commands referenced by the manifest', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'withcmd');
      fs.mkdirSync(path.join(pluginRoot, 'commands'), { recursive: true });
      writePluginManifest(pluginRoot, {
        name: 'withcmd',
        version: '0.1.0',
        commands: ['commands/hello.md'],
      });
      fs.writeFileSync(
        path.join(pluginRoot, 'commands', 'hello.md'),
        '---\nname: hello\ndescription: greet\n---\n\nHi from hello!\n'
      );

      const manager = new PluginManager(projectRoot);
      await manager.loadAutoDiscovered(projectRoot);

      const list = manager.list();
      const info = list.find((p) => p.name === 'withcmd');
      expect(info).toBeDefined();
      expect(info?.commandCount).toBe(1);
    });

    it('refuses command paths that escape the plugin root', async () => {
      // Place a target markdown file outside the plugin's own directory.
      const outsideDir = path.join(projectRoot, 'outside');
      fs.mkdirSync(outsideDir, { recursive: true });
      fs.writeFileSync(
        path.join(outsideDir, 'evil.md'),
        '---\nname: evil\ndescription: nope\n---\n\nNope.\n'
      );

      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'escape');
      writePluginManifest(pluginRoot, {
        name: 'escape',
        version: '0.1.0',
        commands: ['../../../outside/evil.md'],
      });

      const manager = new PluginManager(projectRoot);
      const results = await manager.loadAutoDiscovered(projectRoot);
      const escape = results.find((r) => r.pluginName === 'escape');
      expect(escape?.success).toBe(true);
      expect(escape?.warnings?.some((w) => /outside plugin root/i.test(w))).toBe(true);
      const info = manager.list().find((p) => p.name === 'escape');
      expect(info?.commandCount).toBe(0);
    });

    it('refuses absolute command paths', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'absolute');
      writePluginManifest(pluginRoot, {
        name: 'absolute',
        version: '0.1.0',
        commands: ['/etc/passwd.md'],
      });

      const manager = new PluginManager(projectRoot);
      const results = await manager.loadAutoDiscovered(projectRoot);
      const absolute = results.find((r) => r.pluginName === 'absolute');
      expect(absolute?.success).toBe(true);
      expect(absolute?.warnings?.some((w) => /absolute command path/i.test(w))).toBe(true);
    });

    it('handles invalid JSON gracefully', async () => {
      const badRoot = path.join(projectRoot, '.alexi', 'skills', 'bad');
      writePluginManifest(badRoot, '{not valid json');

      const errors: string[] = [];
      const unsubscribe = PluginError.subscribe((p) => {
        if (p.context) {
          errors.push(p.context);
        }
      });

      try {
        const manager = new PluginManager(projectRoot);
        const results = await manager.loadAutoDiscovered(projectRoot);
        expect(results.every((r) => !r.success)).toBe(true);
        expect(errors).toContain('manifest:parse');
      } finally {
        unsubscribe();
      }
    });
  });
});
