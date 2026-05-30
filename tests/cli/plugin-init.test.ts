import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sanitizePluginName, scaffoldPlugin } from '../../src/cli/commands/plugin.js';

describe('alexi plugin init scaffolder', () => {
  let tmpdir: string;
  let project: string;
  let home: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-plugin-init-'));
    project = path.join(tmpdir, 'project');
    home = path.join(tmpdir, 'home');
    fs.mkdirSync(project, { recursive: true });
    fs.mkdirSync(home, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  describe('sanitizePluginName', () => {
    it('passes through alphanumeric, dash, underscore', () => {
      expect(sanitizePluginName('foo-bar_baz1')).toBe('foo-bar_baz1');
    });

    it('replaces forbidden characters with dashes and collapses runs', () => {
      expect(sanitizePluginName('foo bar/baz')).toBe('foo-bar-baz');
    });

    it('strips leading/trailing dashes', () => {
      expect(sanitizePluginName('--foo--')).toBe('foo');
    });

    it('returns empty string when nothing valid remains', () => {
      expect(sanitizePluginName('***')).toBe('');
    });
  });

  describe('scaffoldPlugin', () => {
    it('creates plugin.json, sample command, and README under project skills dir', () => {
      const result = scaffoldPlugin('demo', {}, project, home);

      expect(result.slug).toBe('demo');
      expect(result.root).toBe(path.join(project, '.alexi', 'skills', 'demo'));

      const manifestPath = path.join(result.root, 'plugin.json');
      expect(fs.existsSync(manifestPath)).toBe(true);
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      expect(manifest.name).toBe('demo');
      expect(manifest.version).toBe('0.1.0');
      expect(manifest.commands).toEqual(['commands/demo.md']);

      const cmdPath = path.join(result.root, 'commands', 'demo.md');
      expect(fs.existsSync(cmdPath)).toBe(true);
      const cmd = fs.readFileSync(cmdPath, 'utf-8');
      expect(cmd).toContain('name: demo');

      const readmePath = path.join(result.root, 'README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
      expect(fs.readFileSync(readmePath, 'utf-8')).toContain('# demo');
    });

    it('honours --description', () => {
      const result = scaffoldPlugin('demo', { description: 'A demo plugin' }, project, home);
      const manifest = JSON.parse(fs.readFileSync(path.join(result.root, 'plugin.json'), 'utf-8'));
      expect(manifest.description).toBe('A demo plugin');
      const cmd = fs.readFileSync(path.join(result.root, 'commands', 'demo.md'), 'utf-8');
      expect(cmd).toContain('description: A demo plugin');
    });

    it('refuses to overwrite an existing directory', () => {
      scaffoldPlugin('demo', {}, project, home);
      expect(() => scaffoldPlugin('demo', {}, project, home)).toThrow(/already exists/i);
    });

    it('sanitises names with disallowed characters', () => {
      const result = scaffoldPlugin('foo bar/baz', {}, project, home);
      expect(result.slug).toBe('foo-bar-baz');
      expect(result.root).toBe(path.join(project, '.alexi', 'skills', 'foo-bar-baz'));
      expect(fs.existsSync(path.join(result.root, 'plugin.json'))).toBe(true);
    });

    it('rejects names with no alphanumeric content', () => {
      expect(() => scaffoldPlugin('***', {}, project, home)).toThrow(/alphanumeric/i);
    });

    it('--global writes under the supplied home directory', () => {
      const result = scaffoldPlugin('gdemo', { global: true }, project, home);
      expect(result.root).toBe(path.join(home, '.alexi', 'skills', 'gdemo'));
      expect(fs.existsSync(path.join(result.root, 'plugin.json'))).toBe(true);
      // Project skills dir should not have been touched.
      expect(fs.existsSync(path.join(project, '.alexi', 'skills', 'gdemo'))).toBe(false);
    });
  });
});
