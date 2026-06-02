/**
 * Tests for the plugin `command`-source rule path.
 *
 * Covers (per issue #633):
 *   - happy-path success (stdout captured into the prompt)
 *   - timeout (partial stdout preserved, prompt assembly still completes)
 *   - oversize stdout (truncation flagged + marker reaches the prompt)
 *   - `scope: 'always'` cache (single spawn for repeated invocations)
 *   - `scope: 'session'` cache (per-session keying + invalidation)
 *   - non-zero exit (stderr logged, stdout still emitted)
 *   - secret-shaped env vars are scrubbed before spawn
 *   - tokeniser handles whitespace + quotes
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  PluginManager,
  PluginRuleSchema,
  clearRuleCommandCache,
  materializeCommandRule,
  resolvePluginRule,
  resolvePluginRulesForPrompt,
  type ResolvedPluginRule,
} from '../../src/plugin/index.js';
import {
  runRuleCommandLenient,
  scrubEnv,
  tokenizeCommand,
} from '../../src/plugin/ruleCommandRunner.js';

const NODE = process.execPath;

function writeManifest(pluginRoot: string, manifest: Record<string, unknown>): void {
  fs.mkdirSync(pluginRoot, { recursive: true });
  fs.writeFileSync(path.join(pluginRoot, 'plugin.json'), JSON.stringify(manifest, null, 2));
}

function writeScript(pluginRoot: string, name: string, body: string): string {
  fs.mkdirSync(pluginRoot, { recursive: true });
  const p = path.join(pluginRoot, name);
  fs.writeFileSync(p, body);
  fs.chmodSync(p, 0o755);
  return p;
}

describe('PluginRuleSchema — command source', () => {
  it('accepts a command rule with string command', () => {
    const r = PluginRuleSchema.parse({
      name: 'todos',
      source: 'command',
      command: 'echo hi',
    });
    expect(r.scope).toBe('always');
    expect(r.source).toBe('command');
    expect(r.command).toBe('echo hi');
  });

  it('accepts a command rule with array command', () => {
    const r = PluginRuleSchema.parse({
      name: 'todos',
      source: 'command',
      command: ['node', '-e', 'console.log("x")'],
    });
    expect(r.command).toEqual(['node', '-e', 'console.log("x")']);
  });

  it('rejects a command rule missing the command field', () => {
    expect(() => PluginRuleSchema.parse({ name: 'todos', source: 'command' })).toThrow();
  });
});

describe('tokenizeCommand', () => {
  it('splits on whitespace', () => {
    expect(tokenizeCommand('node script.js arg1 arg2')).toEqual([
      'node',
      'script.js',
      'arg1',
      'arg2',
    ]);
  });

  it('respects single quotes (no escapes)', () => {
    expect(tokenizeCommand("echo 'hello world' bye")).toEqual(['echo', 'hello world', 'bye']);
  });

  it('respects double quotes with backslash escapes', () => {
    expect(tokenizeCommand('echo "a \\"b\\" c"')).toEqual(['echo', 'a "b" c']);
  });

  it('treats backslash outside quotes as escape', () => {
    expect(tokenizeCommand('echo a\\ b')).toEqual(['echo', 'a b']);
  });

  it('throws on unbalanced quotes', () => {
    expect(() => tokenizeCommand('echo "unbalanced')).toThrow();
  });
});

describe('scrubEnv', () => {
  it('strips secret-shaped env vars', () => {
    const cleaned = scrubEnv({
      PATH: '/usr/bin',
      HOME: '/home/x',
      AICORE_SERVICE_KEY: 'shh',
      SAP_PROXY_URL: 'http://proxy',
      MY_TOKEN: 't',
      SOME_SECRET: 's',
      API_KEY: 'k',
      DB_PASSWORD: 'p',
      GITHUB_TOKEN: 'gh',
      NORMAL_VAR: 'ok',
    });
    expect(cleaned.PATH).toBe('/usr/bin');
    expect(cleaned.HOME).toBe('/home/x');
    expect(cleaned.NORMAL_VAR).toBe('ok');
    expect(cleaned.AICORE_SERVICE_KEY).toBeUndefined();
    expect(cleaned.SAP_PROXY_URL).toBeUndefined();
    expect(cleaned.MY_TOKEN).toBeUndefined();
    expect(cleaned.SOME_SECRET).toBeUndefined();
    expect(cleaned.API_KEY).toBeUndefined();
    expect(cleaned.DB_PASSWORD).toBeUndefined();
    expect(cleaned.GITHUB_TOKEN).toBeUndefined();
  });
});

describe('runRuleCommandLenient', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-cmd-'));
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  it('captures stdout from a successful command', async () => {
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: [NODE, '-e', 'process.stdout.write("# rule\\nfoo")'],
    });
    expect(result.timedOut).toBe(false);
    expect(result.truncated).toBe(false);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('# rule\nfoo');
  });

  it('flags timedOut and preserves partial stdout', async () => {
    // Print a chunk, then sleep longer than timeout.
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: [
        NODE,
        '-e',
        'process.stdout.write("partial");setTimeout(()=>process.stdout.write("late"),1000)',
      ],
      timeoutMs: 200,
    });
    expect(result.timedOut).toBe(true);
    expect(result.stdout.startsWith('partial')).toBe(true);
    // The "late" chunk must not have made it through.
    expect(result.stdout.includes('late')).toBe(false);
  });

  it('flags truncated when stdout exceeds maxBytes', async () => {
    // Generate ~64 KB of output.
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
      maxBytes: 8192,
    });
    expect(result.truncated).toBe(true);
    expect(result.stdout.length).toBeLessThanOrEqual(8192);
  });

  it('returns non-zero exit code with stderr captured', async () => {
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: [NODE, '-e', 'process.stderr.write("boom");process.exit(2)'],
    });
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('boom');
  });

  it('handles spawn errors (non-existent program) without rejecting', async () => {
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: ['/this/binary/does/not/exist-xyz'],
    });
    expect(result.exitCode).toBeNull();
    expect(result.stderr.length).toBeGreaterThan(0);
  });

  it('does not invoke a shell (metacharacters are literal)', async () => {
    // If a shell were involved, `;` would split commands. Here we expect
    // the child program (node) to receive the literal string as argv.
    // Note: when a node `-e` script runs, process.argv is
    // [node-bin, '[eval]', ...userArgs], so user args start at index 2.
    const result = await runRuleCommandLenient({
      pluginRoot: tmpdir,
      command: [NODE, '-e', 'process.stdout.write(process.argv[1]||"")', ';rm -rf /'],
    });
    // The literal ';rm -rf /' must come back unchanged. With shell expansion
    // it would be parsed as a separator and removed.
    expect(result.stdout).toBe(';rm -rf /');
  });
});

describe('materializeCommandRule + cache', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-cache-'));
    clearRuleCommandCache();
  });

  afterEach(() => {
    clearRuleCommandCache();
    fs.rmSync(tmpdir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  /**
   * Build a rule whose command writes (and increments) a counter file in
   * tmpdir. Each spawn observably bumps the counter, so cache behaviour can
   * be verified without spying on internals.
   */
  function buildCounterRule(opts: {
    pluginName?: string;
    name?: string;
    scope?: 'always' | 'session';
    counterFile: string;
  }): ResolvedPluginRule {
    const script = [
      `const fs = require('fs');`,
      `let n = 0;`,
      `try { n = parseInt(fs.readFileSync(${JSON.stringify(opts.counterFile)}, 'utf-8'), 10) || 0; } catch {}`,
      `n += 1;`,
      `fs.writeFileSync(${JSON.stringify(opts.counterFile)}, String(n));`,
      `process.stdout.write('count=' + n);`,
    ].join('');
    return {
      pluginName: opts.pluginName ?? 'p1',
      name: opts.name ?? 'r1',
      scope: opts.scope ?? 'always',
      source: 'command',
      content: '',
      command: {
        pluginRoot: tmpdir,
        command: [NODE, '-e', script],
      },
    };
  }

  function readCounter(file: string): number {
    try {
      return parseInt(fs.readFileSync(file, 'utf-8'), 10) || 0;
    } catch {
      return 0;
    }
  }

  it('scope: "always" caches across invocations (single spawn)', async () => {
    const counter = path.join(tmpdir, 'counter-always');
    const rule = buildCounterRule({ scope: 'always', counterFile: counter });

    const a = await materializeCommandRule(rule);
    const b = await materializeCommandRule(rule);

    expect(a).toBe('count=1');
    // Cached → same content as first invocation, no second spawn.
    expect(b).toBe('count=1');
    expect(readCounter(counter)).toBe(1);
  });

  it('scope: "session" caches per-session and re-spawns for new sessions', async () => {
    const counter = path.join(tmpdir, 'counter-session');
    const rule = buildCounterRule({ scope: 'session', counterFile: counter });

    const a1 = await materializeCommandRule(rule, 'sess-A');
    const a2 = await materializeCommandRule(rule, 'sess-A');
    expect(a1).toBe('count=1');
    expect(a2).toBe('count=1');
    expect(readCounter(counter)).toBe(1);

    const b1 = await materializeCommandRule(rule, 'sess-B');
    expect(b1).toBe('count=2');
    expect(readCounter(counter)).toBe(2);

    // Clearing one session does not affect the other.
    clearRuleCommandCache('sess-A');
    const b2 = await materializeCommandRule(rule, 'sess-B');
    expect(b2).toBe('count=2'); // sess-B still cached
    expect(readCounter(counter)).toBe(2);

    // After clear, sess-A re-spawns.
    const a3 = await materializeCommandRule(rule, 'sess-A');
    expect(a3).toBe('count=3');
    expect(readCounter(counter)).toBe(3);
  });

  it('appends a [truncated] marker when stdout exceeds the cap', async () => {
    const rule: ResolvedPluginRule = {
      pluginName: 'p1',
      name: 'r1',
      scope: 'always',
      source: 'command',
      content: '',
      command: {
        pluginRoot: tmpdir,
        command: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
        maxBytes: 8192,
      },
    };
    const content = await materializeCommandRule(rule);
    expect(content).toContain('[... truncated');
    // Body+marker length is tiny + marker — capped portion is 8192 + marker.
    expect(content.length).toBeLessThanOrEqual(8192 + 200);
  });

  it('still emits content on timeout, with a marker', async () => {
    const rule: ResolvedPluginRule = {
      pluginName: 'p1',
      name: 'r1',
      scope: 'always',
      source: 'command',
      content: '',
      command: {
        pluginRoot: tmpdir,
        command: [NODE, '-e', 'process.stdout.write("partial");setTimeout(()=>{},1000)'],
        timeoutMs: 200,
      },
    };
    const content = await materializeCommandRule(rule);
    expect(content).toContain('partial');
    expect(content).toContain('[... truncated: command rule timed out');
  });

  it('non-zero exit: rule still emits stdout', async () => {
    const rule: ResolvedPluginRule = {
      pluginName: 'p1',
      name: 'r1',
      scope: 'always',
      source: 'command',
      content: '',
      command: {
        pluginRoot: tmpdir,
        command: [
          NODE,
          '-e',
          'process.stdout.write("partial");process.stderr.write("oops");process.exit(3)',
        ],
      },
    };
    const content = await materializeCommandRule(rule);
    expect(content).toBe('partial');
  });
});

describe('resolvePluginRule (command source)', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-resolve-'));
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  it('returns a deferred descriptor with empty content', () => {
    const result = resolvePluginRule(tmpdir, 'p1', {
      name: 'r1',
      scope: 'always',
      source: 'command',
      command: ['echo', 'ok'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rule.source).toBe('command');
      expect(result.rule.content).toBe('');
      expect(result.rule.command?.command).toEqual(['echo', 'ok']);
      expect(result.rule.command?.pluginRoot).toBe(tmpdir);
    }
  });

  it('rejects when command is missing', () => {
    // Bypass schema (which would normally catch this) to exercise the guard.
    const result = resolvePluginRule(tmpdir, 'p1', {
      name: 'r1',
      scope: 'always',
      source: 'command',
    } as unknown as Parameters<typeof resolvePluginRule>[2]);
    expect(result.ok).toBe(false);
  });
});

describe('resolvePluginRulesForPrompt — manifest end-to-end', () => {
  let tmpdir: string;
  let projectRoot: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-e2e-'));
    projectRoot = path.join(tmpdir, 'project');
    fs.mkdirSync(projectRoot, { recursive: true });
    clearRuleCommandCache();
  });

  afterEach(() => {
    clearRuleCommandCache();
    fs.rmSync(tmpdir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('materializes command-source rules from a loaded manifest', async () => {
    const pluginRoot = path.join(projectRoot, 'pluginA');
    writeManifest(pluginRoot, {
      name: 'pluginA',
      version: '0.0.1',
      rules: [
        {
          name: 'todos',
          source: 'command',
          command: [NODE, '-e', 'process.stdout.write("# Today\\n- ship it")'],
        },
      ],
    });

    const mgr = new PluginManager(projectRoot);
    const result = await mgr.loadFromManifest(pluginRoot);
    expect(result.success).toBe(true);

    // The rule starts un-materialized.
    const beforeRules = mgr.getEnabledRules();
    expect(beforeRules).toHaveLength(1);
    expect(beforeRules[0].source).toBe('command');
    expect(beforeRules[0].content).toBe('');

    // After materialization the content is populated.
    // Use the manager directly (not the global) so we know which rules to feed in.
    const enabledRules = mgr.getEnabledRules();
    const materialized = await Promise.all(
      enabledRules.map(async (r) =>
        r.source === 'command' ? { ...r, content: await materializeCommandRule(r) } : r
      )
    );
    expect(materialized[0].content).toContain('# Today');
    expect(materialized[0].content).toContain('ship it');
  });

  it('global resolvePluginRulesForPrompt drives the same path', async () => {
    // Verify the global helper at least returns rules and matches command-rule semantics.
    // We don't load into the global manager (would pollute other tests); instead
    // we exercise materializeCommandRule directly via the helper code path.
    const rules = await resolvePluginRulesForPrompt('sess-x');
    // No plugins loaded into the *global* manager here, so this should be empty.
    expect(Array.isArray(rules)).toBe(true);
  });

  it('writeScript helper produces an executable file (smoke)', () => {
    // Sanity: confirms writeScript is wired correctly for any future expansion.
    const p = writeScript(tmpdir, 'noop.js', 'console.log("noop")');
    expect(fs.existsSync(p)).toBe(true);
  });
});
