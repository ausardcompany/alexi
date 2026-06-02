import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  PluginManager,
  PluginManifestSchema,
  PluginRuleSchema,
  PLUGIN_RULE_MAX_BYTES,
  PLUGIN_RULE_TRUNCATION_MARKER,
  resolvePluginRule,
} from '../../src/plugin/index.js';

/**
 * Tests for the plugin rule contributions surface (#595).
 *
 * Covers:
 *   - Manifest schema accepts and validates `rules`.
 *   - `inline` and `file` source types resolve correctly.
 *   - File-source path-escape guard rejects `../...` paths.
 *   - 32 KB per-rule cap is enforced with a clear truncation marker.
 *   - Disabled plugins do NOT contribute rules.
 *   - Invalid rule manifests produce a useful Zod error.
 */

function writeManifest(pluginRoot: string, manifest: Record<string, unknown> | string): void {
  fs.mkdirSync(pluginRoot, { recursive: true });
  const body = typeof manifest === 'string' ? manifest : JSON.stringify(manifest, null, 2);
  fs.writeFileSync(path.join(pluginRoot, 'plugin.json'), body);
}

describe('Plugin rule contributions', () => {
  let tmpdir: string;
  let projectRoot: string;
  let homeRoot: string;
  let originalHome: string | undefined;
  let originalUserprofile: string | undefined;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-plugin-rules-'));
    projectRoot = path.join(tmpdir, 'project');
    homeRoot = path.join(tmpdir, 'home');
    fs.mkdirSync(projectRoot, { recursive: true });
    fs.mkdirSync(homeRoot, { recursive: true });

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

  describe('PluginRuleSchema', () => {
    it('accepts a valid inline rule and defaults scope to "always"', () => {
      const parsed = PluginRuleSchema.parse({
        name: 'r1',
        source: 'inline',
        content: 'Always favour zod schemas.',
      });
      expect(parsed.scope).toBe('always');
      expect(parsed.source).toBe('inline');
      expect(parsed.content).toBe('Always favour zod schemas.');
    });

    it('accepts a valid file rule with explicit scope', () => {
      const parsed = PluginRuleSchema.parse({
        name: 'r2',
        scope: 'session',
        source: 'file',
        path: 'rules/x.md',
      });
      expect(parsed.scope).toBe('session');
      expect(parsed.path).toBe('rules/x.md');
    });

    it('rejects inline source without content', () => {
      const result = PluginRuleSchema.safeParse({
        name: 'r3',
        source: 'inline',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // The discriminated-union branch for `source: 'inline'` requires
        // `content: z.string()` — the resulting issue should reference the
        // `content` path (not the legacy refine message text).
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths.some((p) => p.includes('content'))).toBe(true);
      }
    });

    it('rejects file source without path', () => {
      const result = PluginRuleSchema.safeParse({
        name: 'r4',
        source: 'file',
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown source values', () => {
      const result = PluginRuleSchema.safeParse({
        name: 'r5',
        source: 'shell',
        content: 'echo hi',
      });
      expect(result.success).toBe(false);
    });

    it('rejects mixing command source `argv` with inline `content`', () => {
      // Strict-mode discriminated union: foreign fields fail at parse time.
      const result = PluginRuleSchema.safeParse({
        name: 'mix',
        source: 'command',
        argv: ['echo', 'hi'],
        content: 'inline body',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty rule names', () => {
      const result = PluginRuleSchema.safeParse({
        name: '',
        source: 'inline',
        content: 'x',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PluginManifestSchema with rules', () => {
    it('parses a manifest with a rules array', () => {
      const parsed = PluginManifestSchema.parse({
        name: 'foo',
        version: '0.1.0',
        rules: [
          { name: 'r1', source: 'inline', content: 'rule body' },
          { name: 'r2', source: 'file', path: 'rules/extra.md' },
        ],
      });
      expect(parsed.rules).toHaveLength(2);
      expect(parsed.rules?.[0].name).toBe('r1');
    });

    it('parses a manifest without rules (rules is optional)', () => {
      const parsed = PluginManifestSchema.parse({ name: 'foo', version: '0.1.0' });
      expect(parsed.rules).toBeUndefined();
    });
  });

  describe('resolvePluginRule', () => {
    it('returns inline content directly', () => {
      const result = resolvePluginRule('/tmp/anywhere', 'p1', {
        name: 'r1',
        scope: 'always',
        source: 'inline',
        content: 'be excellent',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.rule.content).toBe('be excellent');
        expect(result.rule.pluginName).toBe('p1');
        expect(result.rule.source).toBe('inline');
      }
    });

    it('reads file content relative to plugin root', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(path.join(pluginRoot, 'rules'), { recursive: true });
      fs.writeFileSync(path.join(pluginRoot, 'rules', 'x.md'), 'FILE_RULE_BODY');

      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'r1',
        scope: 'always',
        source: 'file',
        path: 'rules/x.md',
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.rule.content).toBe('FILE_RULE_BODY');
      }
    });

    it('rejects file paths that escape the plugin root with ../', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(pluginRoot, { recursive: true });

      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'r1',
        scope: 'always',
        source: 'file',
        path: '../../etc/passwd',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/escapes plugin root/);
      }
    });

    it('rejects absolute paths that escape via path.resolve', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(pluginRoot, { recursive: true });

      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'r1',
        scope: 'always',
        source: 'file',
        path: '/etc/passwd',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/escapes plugin root/);
      }
    });

    it('returns an error when the file does not exist', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(pluginRoot, { recursive: true });

      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'r1',
        scope: 'always',
        source: 'file',
        path: 'rules/missing.md',
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/failed to read/);
      }
    });

    it('truncates content over 32 KB with a clear marker', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(pluginRoot, { recursive: true });

      // 40 KB of ASCII content, well above the 32 KB cap.
      const big = 'x'.repeat(PLUGIN_RULE_MAX_BYTES + 8 * 1024);
      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'big',
        scope: 'always',
        source: 'inline',
        content: big,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.rule.content.length).toBeLessThan(big.length);
        expect(result.rule.content.endsWith(PLUGIN_RULE_TRUNCATION_MARKER)).toBe(true);
        // The truncated body (minus marker) must fit in the cap.
        const body = result.rule.content.slice(
          0,
          result.rule.content.length - PLUGIN_RULE_TRUNCATION_MARKER.length
        );
        expect(Buffer.byteLength(body, 'utf-8')).toBeLessThanOrEqual(PLUGIN_RULE_MAX_BYTES);
      }
    });

    it('does not truncate content at or below the cap', () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'p1');
      fs.mkdirSync(pluginRoot, { recursive: true });

      const fitsExactly = 'a'.repeat(PLUGIN_RULE_MAX_BYTES);
      const result = resolvePluginRule(pluginRoot, 'p1', {
        name: 'edge',
        scope: 'always',
        source: 'inline',
        content: fitsExactly,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.rule.content).toBe(fitsExactly);
        expect(result.rule.content.endsWith(PLUGIN_RULE_TRUNCATION_MARKER)).toBe(false);
      }
    });
  });

  describe('PluginManager.loadFromManifest with rules', () => {
    it('loads a manifest with an inline rule and exposes it via getEnabledRules', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'team-rules');
      writeManifest(pluginRoot, {
        name: 'team-rules',
        version: '0.1.0',
        rules: [
          {
            name: 'no-stdout-in-workers',
            source: 'inline',
            content: 'Never log to stdout in workers.',
          },
        ],
      });

      const manager = new PluginManager(projectRoot);
      const result = await manager.loadFromManifest(pluginRoot);
      expect(result.success).toBe(true);

      const rules = manager.getEnabledRules();
      expect(rules).toHaveLength(1);
      expect(rules[0].pluginName).toBe('team-rules');
      expect(rules[0].name).toBe('no-stdout-in-workers');
      expect(rules[0].content).toBe('Never log to stdout in workers.');
    });

    it('loads a manifest with a file-source rule and resolves content from disk', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'with-file-rule');
      fs.mkdirSync(path.join(pluginRoot, 'rules'), { recursive: true });
      fs.writeFileSync(path.join(pluginRoot, 'rules', 'x.md'), 'FILE_BODY_TOKEN');
      writeManifest(pluginRoot, {
        name: 'with-file-rule',
        version: '0.1.0',
        rules: [
          {
            name: 'file-rule',
            source: 'file',
            path: 'rules/x.md',
          },
        ],
      });

      const manager = new PluginManager(projectRoot);
      const result = await manager.loadFromManifest(pluginRoot);
      expect(result.success).toBe(true);

      const rules = manager.getEnabledRules();
      expect(rules).toHaveLength(1);
      expect(rules[0].content).toBe('FILE_BODY_TOKEN');
      expect(rules[0].source).toBe('file');
    });

    it('rejects a path-escape file-source rule and surfaces a warning', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'evil');
      writeManifest(pluginRoot, {
        name: 'evil',
        version: '0.1.0',
        rules: [
          {
            name: 'escape',
            source: 'file',
            path: '../../etc/passwd',
          },
        ],
      });

      const manager = new PluginManager(projectRoot);
      const result = await manager.loadFromManifest(pluginRoot);

      // The plugin itself still loads (rules failures are non-fatal); the rule
      // is just not contributed and a warning is recorded.
      expect(result.success).toBe(true);
      expect(result.warnings ?? []).toEqual(
        expect.arrayContaining([expect.stringMatching(/escapes plugin root/)])
      );
      expect(manager.getEnabledRules()).toEqual([]);
    });

    it('truncates an over-32 KB inline rule with a marker', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'big-rule');
      const big = 'y'.repeat(PLUGIN_RULE_MAX_BYTES + 4096);
      writeManifest(pluginRoot, {
        name: 'big-rule',
        version: '0.1.0',
        rules: [{ name: 'big', source: 'inline', content: big }],
      });

      const manager = new PluginManager(projectRoot);
      const result = await manager.loadFromManifest(pluginRoot);
      expect(result.success).toBe(true);

      const rules = manager.getEnabledRules();
      expect(rules).toHaveLength(1);
      expect(rules[0].content.endsWith(PLUGIN_RULE_TRUNCATION_MARKER)).toBe(true);
      expect(rules[0].content.length).toBeLessThan(big.length);
    });

    it('disabled plugins do NOT contribute rules', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'mute-me');
      writeManifest(pluginRoot, {
        name: 'mute-me',
        version: '0.1.0',
        rules: [{ name: 'r1', source: 'inline', content: 'should not appear' }],
      });

      const manager = new PluginManager(projectRoot);
      await manager.loadFromManifest(pluginRoot);
      expect(manager.getEnabledRules()).toHaveLength(1);

      const disabled = manager.disable('mute-me');
      expect(disabled.success).toBe(true);
      expect(manager.getEnabledRules()).toEqual([]);

      // Re-enable should bring the rule back.
      const enabled = manager.enable('mute-me');
      expect(enabled.success).toBe(true);
      expect(manager.getEnabledRules()).toHaveLength(1);
    });

    it('rejects a manifest with an invalid rule (inline + no content) at validation time', async () => {
      const pluginRoot = path.join(projectRoot, '.alexi', 'skills', 'bad-rule');
      writeManifest(pluginRoot, {
        name: 'bad-rule',
        version: '0.1.0',
        rules: [{ name: 'r1', source: 'inline' }],
      });

      const manager = new PluginManager(projectRoot);
      const result = await manager.loadFromManifest(pluginRoot);

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Invalid plugin\.json/);
      // The discriminated-union branch surfaces a Zod issue on the
      // `rules.0.content` path — we just need a message that mentions
      // the missing required field, not a hand-rolled refine string.
      expect(result.error?.toLowerCase()).toMatch(/required|invalid|content/);
      expect(manager.get('bad-rule')).toBeUndefined();
    });
  });
});
