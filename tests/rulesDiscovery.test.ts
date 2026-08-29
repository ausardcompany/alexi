/**
 * Tests for `src/config/rulesDiscovery.ts`.
 *
 * Exercises:
 *   1. Discovery across all default project paths (`.alexi/`, `.kilo/`,
 *      `.kilocode/`, `.opencode/`, `.cline/`, root `rules/`).
 *   2. Discovery of user-level `~/.alexi/rules/`.
 *   3. Custom `rulesPath` in `.alexi/config.json` (project + global), string
 *      and array forms.
 *   4. Precedence: custom > default project dirs > user dir; first-in-order
 *      wins on conflict.
 *   5. Conflict reporting: shadowed files land in `conflicts` and generate
 *      warning logs.
 *   6. Startup logging: every discovered file logged at INFO with size; total
 *      count logged; warnings for conflicts.
 *   7. Malformed config values (non-string, non-array) fall back gracefully.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  DEFAULT_PROJECT_RULE_DIRS,
  DEFAULT_USER_RULE_DIR,
  discoverRules,
  logRulesDiscovery,
  normalizeRulesPathValue,
  resolveCustomRulesPaths,
} from '../src/config/rulesDiscovery.js';
import { logger } from '../src/utils/logger.js';

function writeFile(p: string, content: string): void {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf-8');
}

describe('normalizeRulesPathValue', () => {
  it('accepts a single string', () => {
    expect(normalizeRulesPathValue('custom/rules')).toEqual(['custom/rules']);
  });

  it('accepts an array of strings', () => {
    expect(normalizeRulesPathValue(['a', 'b'])).toEqual(['a', 'b']);
  });

  it('trims whitespace and drops empty entries', () => {
    expect(normalizeRulesPathValue(['  a  ', '', '   ', 'b'])).toEqual(['a', 'b']);
  });

  it('drops non-string entries silently', () => {
    expect(normalizeRulesPathValue(['a', 42, null, 'b'])).toEqual(['a', 'b']);
  });

  it('returns [] for unsupported shapes', () => {
    expect(normalizeRulesPathValue(undefined)).toEqual([]);
    expect(normalizeRulesPathValue(null)).toEqual([]);
    expect(normalizeRulesPathValue(42)).toEqual([]);
    expect(normalizeRulesPathValue({ a: 1 })).toEqual([]);
    expect(normalizeRulesPathValue('')).toEqual([]);
    expect(normalizeRulesPathValue('   ')).toEqual([]);
  });
});

describe('resolveCustomRulesPaths', () => {
  let root: string;
  let workdir: string;
  let home: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rules-custom-'));
    workdir = path.join(root, 'project');
    home = path.join(root, 'home');
    fs.mkdirSync(workdir, { recursive: true });
    fs.mkdirSync(home, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('returns [] when no config files exist', () => {
    expect(resolveCustomRulesPaths(workdir, home)).toEqual([]);
  });

  it('reads project rulesPath as a string', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: 'custom/rules' })
    );
    expect(resolveCustomRulesPaths(workdir, home)).toEqual(['custom/rules']);
  });

  it('reads project rulesPath as an array', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: ['custom/rules', '.company/standards'] })
    );
    expect(resolveCustomRulesPaths(workdir, home)).toEqual(['custom/rules', '.company/standards']);
  });

  it('merges project (first) and global (second) entries, deduped', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: ['proj-a', 'shared'] })
    );
    writeFile(
      path.join(home, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: ['shared', 'global-a'] })
    );
    expect(resolveCustomRulesPaths(workdir, home)).toEqual(['proj-a', 'shared', 'global-a']);
  });

  it('silently ignores malformed JSON', () => {
    writeFile(path.join(workdir, '.alexi', 'config.json'), '{ not json');
    expect(resolveCustomRulesPaths(workdir, home)).toEqual([]);
  });

  it('silently ignores malformed rulesPath shapes', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: { foo: 'bar' } })
    );
    expect(resolveCustomRulesPaths(workdir, home)).toEqual([]);
  });
});

describe('discoverRules — default project paths', () => {
  let root: string;
  let workdir: string;
  let home: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rules-default-'));
    workdir = path.join(root, 'project');
    home = path.join(root, 'home');
    fs.mkdirSync(workdir, { recursive: true });
    fs.mkdirSync(home, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('returns no rules when no directories exist', () => {
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toEqual([]);
    expect(result.conflicts).toEqual([]);
    expect(result.scannedDirs).toEqual([]);
  });

  it('discovers rules from every default project directory', () => {
    // One unique file per default dir so we can assert all 6 are found.
    for (let i = 0; i < DEFAULT_PROJECT_RULE_DIRS.length; i++) {
      const rel = DEFAULT_PROJECT_RULE_DIRS[i];
      writeFile(path.join(workdir, rel, `rule-${i}.md`), `# Rule ${i}\ncontent`);
    }
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(DEFAULT_PROJECT_RULE_DIRS.length);
    const fileNames = result.rules.map((r) => r.fileName).sort();
    expect(fileNames).toEqual(DEFAULT_PROJECT_RULE_DIRS.map((_, i) => `rule-${i}.md`).sort());
  });

  it('discovers rules from ~/.alexi/rules/', () => {
    writeFile(path.join(home, DEFAULT_USER_RULE_DIR, 'global.md'), '# global');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].source).toBe('user');
    expect(result.rules[0].fileName).toBe('global.md');
  });

  it('walks default dirs in the declared precedence order', () => {
    // Same file name in `.alexi/rules/` and `.kilo/rules/`. `.alexi` wins.
    writeFile(path.join(workdir, '.alexi', 'rules', 'style.md'), '# alexi style');
    writeFile(path.join(workdir, '.kilo', 'rules', 'style.md'), '# kilo style');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].content).toContain('alexi style');
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].ruleKey).toBe('style');
    expect(result.conflicts[0].winner).toBe(path.join(workdir, '.alexi', 'rules', 'style.md'));
    expect(result.conflicts[0].shadowed).toEqual([
      path.join(workdir, '.kilo', 'rules', 'style.md'),
    ]);
  });

  it('sorts files alphabetically within a single directory', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'b.md'), '# b');
    writeFile(path.join(workdir, '.alexi', 'rules', 'a.md'), '# a');
    writeFile(path.join(workdir, '.alexi', 'rules', 'c.md'), '# c');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules.map((r) => r.fileName)).toEqual(['a.md', 'b.md', 'c.md']);
  });

  it('skips empty rule files', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'ok.md'), '# real');
    writeFile(path.join(workdir, '.alexi', 'rules', 'empty.md'), '   \n');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules.map((r) => r.fileName)).toEqual(['ok.md']);
  });

  it('ignores non-.md files', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'note.md'), '# md');
    writeFile(path.join(workdir, '.alexi', 'rules', 'ignore.txt'), 'text');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules.map((r) => r.fileName)).toEqual(['note.md']);
  });
});

describe('discoverRules — custom rulesPath precedence', () => {
  let root: string;
  let workdir: string;
  let home: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rules-custom-'));
    workdir = path.join(root, 'project');
    home = path.join(root, 'home');
    fs.mkdirSync(workdir, { recursive: true });
    fs.mkdirSync(home, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('reads custom paths from project .alexi/config.json', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: ['custom/team'] })
    );
    writeFile(path.join(workdir, 'custom', 'team', 'r.md'), '# team rule');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].source).toBe('custom');
    expect(result.rules[0].fileName).toBe('r.md');
  });

  it('custom paths win over default project paths on conflict', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: 'custom/rules' })
    );
    writeFile(path.join(workdir, 'custom', 'rules', 'style.md'), '# custom style');
    writeFile(path.join(workdir, '.alexi', 'rules', 'style.md'), '# default style');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].source).toBe('custom');
    expect(result.rules[0].content).toContain('custom style');
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].winner).toBe(path.join(workdir, 'custom', 'rules', 'style.md'));
  });

  it('supports absolute custom paths', () => {
    const absDir = path.join(root, 'abs-rules');
    writeFile(path.join(absDir, 'a.md'), '# absolute');
    writeFile(path.join(workdir, '.alexi', 'config.json'), JSON.stringify({ rulesPath: [absDir] }));
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].filePath).toBe(path.join(absDir, 'a.md'));
    expect(result.rules[0].source).toBe('custom');
  });

  it('expands ~ in custom paths', () => {
    writeFile(path.join(home, 'team-rules', 'a.md'), '# home team');
    const result = discoverRules({
      workdir,
      homedir: home,
      customPaths: ['~/team-rules'],
      silent: true,
    });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].filePath).toBe(path.join(home, 'team-rules', 'a.md'));
    expect(result.rules[0].source).toBe('custom');
  });

  it('customPaths option overrides config file lookup', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: 'from-config' })
    );
    writeFile(path.join(workdir, 'from-config', 'a.md'), '# should be ignored');
    writeFile(path.join(workdir, 'override', 'b.md'), '# override wins');
    const result = discoverRules({
      workdir,
      homedir: home,
      customPaths: ['override'],
      silent: true,
    });
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].fileName).toBe('b.md');
  });

  it('does not double-count when a custom path duplicates a default path', () => {
    writeFile(
      path.join(workdir, '.alexi', 'config.json'),
      JSON.stringify({ rulesPath: '.alexi/rules' })
    );
    writeFile(path.join(workdir, '.alexi', 'rules', 'x.md'), '# x');
    const result = discoverRules({ workdir, homedir: home, silent: true });
    expect(result.rules).toHaveLength(1);
    expect(result.conflicts).toEqual([]);
  });
});

describe('discoverRules — logging', () => {
  let root: string;
  let workdir: string;
  let home: string;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rules-log-'));
    workdir = path.join(root, 'project');
    home = path.join(root, 'home');
    fs.mkdirSync(workdir, { recursive: true });
    fs.mkdirSync(home, { recursive: true });
    infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => {});
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('logs an INFO line for each discovered file with size', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'a.md'), '# a rule\nbody');
    discoverRules({ workdir, homedir: home });
    const messages = infoSpy.mock.calls.map((c) => String(c[0]));
    expect(messages.some((m) => m.startsWith('Loaded rules from '))).toBe(true);
    expect(messages.some((m) => m.includes('a.md') && m.includes('bytes'))).toBe(true);
  });

  it('logs the total count of discovered files', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'a.md'), '# a');
    writeFile(path.join(workdir, '.kilo', 'rules', 'b.md'), '# b');
    discoverRules({ workdir, homedir: home });
    const messages = infoSpy.mock.calls.map((c) => String(c[0]));
    expect(messages).toContain('Discovered 2 rules files');
  });

  it('logs a warn for each conflict', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'style.md'), '# a');
    writeFile(path.join(workdir, '.kilo', 'rules', 'style.md'), '# b');
    discoverRules({ workdir, homedir: home });
    expect(warnSpy).toHaveBeenCalled();
    const warnMsg = String(warnSpy.mock.calls[0][0]);
    expect(warnMsg).toContain("Rule 'style' redefined");
  });

  it('logs 0 rules count when nothing is discovered', () => {
    discoverRules({ workdir, homedir: home });
    const messages = infoSpy.mock.calls.map((c) => String(c[0]));
    expect(messages).toContain('Discovered 0 rules files');
  });

  it('silent: true suppresses all discovery logging', () => {
    writeFile(path.join(workdir, '.alexi', 'rules', 'a.md'), '# a');
    discoverRules({ workdir, homedir: home, silent: true });
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('logRulesDiscovery can be called explicitly with a prebuilt result', () => {
    logRulesDiscovery({
      rules: [
        {
          filePath: '/tmp/x.md',
          fileName: 'x.md',
          ruleKey: 'x',
          source: 'project',
          originDir: '/tmp',
          sizeBytes: 42,
          content: '# x',
        },
      ],
      allFiles: [],
      conflicts: [
        {
          ruleKey: 'x',
          winner: '/tmp/x.md',
          shadowed: ['/other/x.md'],
        },
      ],
      scannedDirs: ['/tmp'],
    });
    expect(infoSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });
});
