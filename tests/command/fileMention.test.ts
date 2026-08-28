/**
 * Tests for `@`-file reference expansion in command templates,
 * covering issue #1547: paths with spaces or shell-special characters
 * must be recognised (via the `@"..."` quoted form) and injected safely
 * so downstream tools receive a single, quoted token.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { CommandRegistry, defineCommand } from '../../src/command/index.js';

describe('CommandRegistry.execute - @file mentions with spaces', () => {
  let tempDir: string;
  let registry: CommandRegistry;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cmd-atfile-'));
    registry = new CommandRegistry(tempDir);
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('expands a bareword @<path> mention (backward compatible)', async () => {
    const target = path.join(tempDir, 'notes.md');
    fs.writeFileSync(target, 'hello world', 'utf-8');

    registry.register(
      defineCommand({
        name: 'plain',
        template: 'Read @notes.md end',
      })
    );

    const rendered = await registry.execute('plain', []);
    expect(rendered).toContain('```md');
    expect(rendered).toContain('hello world');
    // The trailing token in the template must survive expansion.
    expect(rendered).toMatch(/end\s*$/);
  });

  it('expands a double-quoted @"<path with spaces>" mention', async () => {
    const dir = path.join(tempDir, 'My Documents');
    fs.mkdirSync(dir);
    const target = path.join(dir, 'report.txt');
    fs.writeFileSync(target, 'quarterly numbers', 'utf-8');

    registry.register(
      defineCommand({
        name: 'quoted',
        template: 'See @"My Documents/report.txt" for the data.',
      })
    );

    const rendered = await registry.execute('quoted', []);
    expect(rendered).toContain('quarterly numbers');
    // The injected header keeps the resolved basename. `report.txt` is
    // itself space-free so it is not further quoted, but the mention
    // was still matched despite its containing directory having a space.
    expect(rendered).toContain('// File: report.txt');
    expect(rendered).not.toContain('[File not found');
  });

  it('quotes the header filename when the basename itself has spaces', async () => {
    const target = path.join(tempDir, 'weird name.txt');
    fs.writeFileSync(target, 'x', 'utf-8');

    registry.register(
      defineCommand({
        name: 'basename-space',
        template: 'See @"weird name.txt" end',
      })
    );

    const rendered = await registry.execute('basename-space', []);
    // The header uses `quoteFilePath` so a filename with a space is
    // wrapped in double quotes for downstream tool safety.
    expect(rendered).toContain('// File: "weird name.txt"');
  });

  it("expands a single-quoted @'<path with parens>' mention", async () => {
    const dir = path.join(tempDir, 'archive (2)');
    fs.mkdirSync(dir);
    const target = path.join(dir, 'notes.md');
    fs.writeFileSync(target, 'archived notes', 'utf-8');

    registry.register(
      defineCommand({
        name: 'parens',
        template: "Look at @'archive (2)/notes.md' now.",
      })
    );

    const rendered = await registry.execute('parens', []);
    expect(rendered).toContain('archived notes');
    expect(rendered).not.toContain('[File not found');
  });

  it('does not truncate a quoted path at the first space', async () => {
    // Regression: the previous `/@([^\s]+)/g` regex would have captured
    // only `@"My` here and left the rest as literal text.
    const dir = path.join(tempDir, 'My Docs');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'a.txt'), 'A', 'utf-8');

    registry.register(
      defineCommand({
        name: 'trunc',
        template: 'x @"My Docs/a.txt" y',
      })
    );

    const rendered = await registry.execute('trunc', []);
    expect(rendered).toContain('A');
    expect(rendered).toMatch(/^x /);
    expect(rendered).toMatch(/ y$/);
  });

  it('expands @$1 with an unquoted argument (no special chars)', async () => {
    fs.writeFileSync(path.join(tempDir, 'plain.md'), 'plain content', 'utf-8');

    registry.register(
      defineCommand({
        name: 'expand-plain',
        arguments: [{ name: 'file', required: true }],
        template: 'Read @$1 done',
      })
    );

    const rendered = await registry.execute('expand-plain', ['plain.md']);
    expect(rendered).toContain('plain content');
  });

  it('auto-quotes @$1 when the argument contains spaces', async () => {
    // The user passed a raw path with spaces as an argument. The parser
    // must inject it as a quoted mention so it survives the mention
    // scanner as a single token instead of being split at the space.
    const dir = path.join(tempDir, 'weird dir');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'file.txt'), 'spaced content', 'utf-8');

    registry.register(
      defineCommand({
        name: 'expand-spaced',
        arguments: [{ name: 'file', required: true }],
        template: 'Read @$1 done',
      })
    );

    const rendered = await registry.execute('expand-spaced', ['weird dir/file.txt']);
    expect(rendered).toContain('spaced content');
    // Basename `file.txt` has no spaces so it renders unquoted, but the
    // full path (with `weird dir`) was resolved as a single mention
    // rather than being split at the space.
    expect(rendered).toContain('// File: file.txt');
    expect(rendered).not.toContain('[File not found');
  });

  it('reports [File not found] for a quoted path that does not exist', async () => {
    registry.register(
      defineCommand({
        name: 'missing',
        template: 'Read @"nonexistent path/file.txt" done',
      })
    );

    const rendered = await registry.execute('missing', []);
    expect(rendered).toContain('[File not found: nonexistent path/file.txt]');
  });

  it('handles multiple mentions in the same template', async () => {
    fs.writeFileSync(path.join(tempDir, 'a.txt'), 'AAA', 'utf-8');
    const dir = path.join(tempDir, 'b dir');
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'b.txt'), 'BBB', 'utf-8');

    registry.register(
      defineCommand({
        name: 'multi',
        template: 'first @a.txt second @"b dir/b.txt" end',
      })
    );

    const rendered = await registry.execute('multi', []);
    expect(rendered).toContain('AAA');
    expect(rendered).toContain('BBB');
    // Both bodies present + literal tail intact.
    expect(rendered).toMatch(/end\s*$/);
  });

  it('leaves email-like addresses untouched', async () => {
    registry.register(
      defineCommand({
        name: 'email',
        template: 'ping user@example.com about it',
      })
    );

    const rendered = await registry.execute('email', []);
    expect(rendered).toBe('ping user@example.com about it');
  });
});
