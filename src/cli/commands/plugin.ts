/**
 * Plugin command — scaffold and manage Alexi plugins.
 *
 * `alexi plugin init <name>` creates `.alexi/skills/<name>/` with a minimal
 * `plugin.json`, a sample command markdown file, and a README. Use `--global`
 * to scaffold under `~/.alexi/skills/<name>/` instead.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Command } from 'commander';

export interface PluginInitOptions {
  global?: boolean;
  description?: string;
}

export interface PluginInitResult {
  /** Absolute path to the created plugin root. */
  root: string;
  /** Sanitised plugin slug used as the directory name. */
  slug: string;
}

/**
 * Sanitise a plugin name into a directory-safe slug. Sequences of disallowed
 * characters collapse to a single dash.
 *
 * @example
 *   sanitizePluginName('foo bar/baz') // => 'foo-bar-baz'
 */
export function sanitizePluginName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * Scaffold a new plugin directory. Refuses to overwrite an existing target.
 */
export function scaffoldPlugin(
  name: string,
  opts: PluginInitOptions = {},
  cwd: string = process.cwd(),
  homeDir: string = os.homedir()
): PluginInitResult {
  const slug = sanitizePluginName(name);
  if (!slug) {
    throw new Error('Plugin name must contain at least one alphanumeric character');
  }

  const root = opts.global
    ? path.join(homeDir, '.alexi', 'skills', slug)
    : path.join(cwd, '.alexi', 'skills', slug);

  if (existsSync(root)) {
    throw new Error(`Plugin directory already exists: ${root}`);
  }

  mkdirSync(path.join(root, 'commands'), { recursive: true });

  const description = opts.description ?? `Custom plugin: ${slug}`;

  const manifest = {
    name: slug,
    version: '0.1.0',
    description,
    commands: [`commands/${slug}.md`],
  };
  writeFileSync(path.join(root, 'plugin.json'), JSON.stringify(manifest, null, 2) + '\n');

  const sampleCommand = `---
name: ${slug}
description: ${opts.description ?? 'Sample command'}
---

Hello from ${slug}!
`;
  writeFileSync(path.join(root, 'commands', `${slug}.md`), sampleCommand);

  const readme = `# ${slug}

${description}

This plugin was scaffolded by \`alexi plugin init\`.

## Reload

Reload via \`/reload-skills\` or restart Alexi.
`;
  writeFileSync(path.join(root, 'README.md'), readme);

  return { root, slug };
}

/**
 * Register the `plugin` command (and its sub-commands) on the CLI program.
 */
export function registerPluginCommand(program: Command): void {
  const cmd = program.command('plugin').description('Manage Alexi plugins');

  cmd
    .command('init <name>')
    .description('Scaffold a new plugin under .alexi/skills/<name>/')
    .option('--global', 'Scaffold under ~/.alexi/skills/<name>/ instead of project')
    .option('--description <text>', 'Plugin description')
    .action((name: string, opts: PluginInitOptions) => {
      try {
        const result = scaffoldPlugin(name, opts);
        console.log(`Created plugin scaffold at ${result.root}`);
      } catch (e) {
        console.error(e instanceof Error ? e.message : String(e));
        process.exit(1);
      }
    });
}
