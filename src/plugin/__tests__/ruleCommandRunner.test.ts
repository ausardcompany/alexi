/**
 * Unit tests for the strict, spec-conformant `runRuleCommand` API
 * (issue #649 / B002 — parent tracker #633).
 *
 * Covers (verbatim from tasks.md):
 *   1. Successful command (`echo hello`-equivalent via a tiny inline node
 *      script) → stdout returned untruncated, `truncated: false`.
 *   2. Timeout: command sleeps past `timeoutMs` → rejects with `code: 'TIMEOUT'`.
 *   3. Oversized stdout: command emits > 32 KB → returns first 32 KB with
 *      `truncated: true` and the child is killed (no zombie).
 *   4. Non-zero exit → rejects with `code: 'EXIT'` and captured stderr.
 *   5. Empty `argv` → synchronous reject with a clear error.
 *   6. Secret denylist: env entries matching the denylist regex are dropped;
 *      `PATH` and `HOME` survive.
 *
 * Plus a few supporting cases for the env scrubber and the no-shell guarantee.
 *
 * The legacy lenient API and its helpers (`tokenizeCommand`, `scrubEnv`)
 * are exercised separately in `tests/plugin/ruleCommand.test.ts`.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runRuleCommand, scrubEnvDeny, type RunRuleCommandError } from '../ruleCommandRunner.js';

const NODE = process.execPath;

describe('scrubEnvDeny', () => {
  it('drops AICORE_* and SAP_PROXY_* vars', () => {
    const out = scrubEnvDeny({
      PATH: '/usr/bin',
      AICORE_SERVICE_KEY: 'shh',
      AICORE_RESOURCE_GROUP: 'rg',
      SAP_PROXY_URL: 'http://proxy',
      SAP_PROXY_AUTH: 'creds',
    });
    expect(out.PATH).toBe('/usr/bin');
    expect(out.AICORE_SERVICE_KEY).toBeUndefined();
    expect(out.AICORE_RESOURCE_GROUP).toBeUndefined();
    expect(out.SAP_PROXY_URL).toBeUndefined();
    expect(out.SAP_PROXY_AUTH).toBeUndefined();
  });

  it('drops vars whose name matches /SECRET|TOKEN|PASSWORD|KEY/i', () => {
    const out = scrubEnvDeny({
      MY_SECRET: 's',
      GH_TOKEN: 't',
      DB_PASSWORD: 'p',
      API_KEY: 'k',
      somesecret_lower: 'l',
      NORMAL: 'ok',
    });
    expect(out.MY_SECRET).toBeUndefined();
    expect(out.GH_TOKEN).toBeUndefined();
    expect(out.DB_PASSWORD).toBeUndefined();
    expect(out.API_KEY).toBeUndefined();
    expect(out.somesecret_lower).toBeUndefined();
    expect(out.NORMAL).toBe('ok');
  });

  it('always retains PATH and HOME even if name pattern would match', () => {
    // Edge case: callers may have HOME / PATH; keep them so the child can
    // resolve binaries / its own home dir.
    const out = scrubEnvDeny({ PATH: '/p', HOME: '/h', OTHER_KEY: 'x' });
    expect(out.PATH).toBe('/p');
    expect(out.HOME).toBe('/h');
    expect(out.OTHER_KEY).toBeUndefined();
  });

  it('skips entries whose value is undefined', () => {
    const out = scrubEnvDeny({ PATH: '/p', NOTHING: undefined });
    expect(out.PATH).toBe('/p');
    expect('NOTHING' in out).toBe(false);
  });
});

describe('runRuleCommand (strict)', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-cmd-strict-'));
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  // Case 1
  it('resolves with stdout and truncated:false on success', async () => {
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("hello world")'],
      cwd: tmpdir,
    });
    expect(result.stdout).toBe('hello world');
    expect(result.truncated).toBe(false);
  });

  // Case 5
  it('rejects with EMPTY_ARGV when argv is empty', async () => {
    await expect(
      runRuleCommand({
        argv: [],
        cwd: tmpdir,
      })
    ).rejects.toMatchObject({ code: 'EMPTY_ARGV' });
  });

  it('rejects with EMPTY_ARGV when argv is not an array', async () => {
    await expect(
      runRuleCommand({
        // Force a misuse from JS callers (TS would catch it).
        argv: undefined as unknown as string[],
        cwd: tmpdir,
      })
    ).rejects.toMatchObject({ code: 'EMPTY_ARGV' });
  });

  // Case 2
  it('rejects with TIMEOUT when the command exceeds timeoutMs', async () => {
    const start = Date.now();
    await expect(
      runRuleCommand({
        argv: [NODE, '-e', 'setTimeout(() => {}, 5000)'],
        cwd: tmpdir,
        timeoutMs: 150,
      })
    ).rejects.toMatchObject({ code: 'TIMEOUT' });
    // Sanity: must have rejected well before the 5s child timer.
    expect(Date.now() - start).toBeLessThan(2000);
  });

  // Case 4
  it('rejects with EXIT (carrying exitCode + stderr) on non-zero exit', async () => {
    let caught: RunRuleCommandError | undefined;
    try {
      await runRuleCommand({
        argv: [NODE, '-e', 'process.stderr.write("boom");process.exit(7)'],
        cwd: tmpdir,
      });
    } catch (err) {
      caught = err as RunRuleCommandError;
    }
    expect(caught).toBeDefined();
    expect(caught?.code).toBe('EXIT');
    if (caught && caught.code === 'EXIT') {
      expect(caught.exitCode).toBe(7);
      expect(caught.stderr).toContain('boom');
    }
  });

  // Case 3 — explicit 32 KB default
  it('caps stdout at the default 32 KB and resolves with truncated:true', async () => {
    // Emit 64 KB; the runner should kill the child and return the first
    // 32 768 bytes with truncated:true.
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
      cwd: tmpdir,
      // No maxBytes override — exercise the documented 32 KB default.
    });
    expect(result.truncated).toBe(true);
    expect(result.stdout.length).toBe(32 * 1024);
    expect(result.stdout).toMatch(/^x+$/);
  });

  it('caps stdout at a custom maxBytes and resolves with truncated:true', async () => {
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
      cwd: tmpdir,
      maxBytes: 4096,
    });
    expect(result.truncated).toBe(true);
    expect(result.stdout.length).toBe(4096);
    expect(result.stdout).toMatch(/^x+$/);
  });

  // No-zombie sanity check tied to case 3: the runner must settle the
  // promise itself, so awaiting it must not hang.
  it('does not leave a zombie child after truncation (settles within a bounded time)', async () => {
    const start = Date.now();
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
      cwd: tmpdir,
      maxBytes: 1024,
      timeoutMs: 5000,
    });
    expect(result.truncated).toBe(true);
    // Should settle on the kill, well before the 5s timeout fallback.
    expect(Date.now() - start).toBeLessThan(2000);
  });

  it('does not invoke a shell — argv values are literal', async () => {
    // Pass `;rm -rf /` as a literal argument; the child should see it
    // verbatim. With shell expansion, `;` would split the command line.
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write(process.argv[1] || "")', ';rm -rf /'],
      cwd: tmpdir,
    });
    expect(result.stdout).toBe(';rm -rf /');
  });

  // Case 6
  it('passes only the scrubbed env to the child (PATH and HOME survive)', async () => {
    const result = await runRuleCommand({
      argv: [
        NODE,
        '-e',
        // Print the keys the child can see, sorted, comma-separated.
        'process.stdout.write(Object.keys(process.env).sort().join(","))',
      ],
      cwd: tmpdir,
      env: {
        PATH: process.env.PATH ?? '/usr/bin',
        HOME: process.env.HOME ?? '/tmp',
        AICORE_SERVICE_KEY: 'should-not-leak',
        SAP_PROXY_AUTH: 'should-not-leak',
        MY_TOKEN: 'should-not-leak',
        BUSINESS_VAR: 'visible',
      },
    });
    const seen = result.stdout.split(',').filter(Boolean);
    expect(seen).toContain('PATH');
    expect(seen).toContain('HOME');
    expect(seen).toContain('BUSINESS_VAR');
    expect(seen).not.toContain('AICORE_SERVICE_KEY');
    expect(seen).not.toContain('SAP_PROXY_AUTH');
    expect(seen).not.toContain('MY_TOKEN');
  });

  it('uses the supplied cwd for the child process', async () => {
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write(process.cwd())'],
      cwd: tmpdir,
    });
    // On macOS /tmp is a symlink to /private/tmp; allow the realpath-resolved form.
    const expected = fs.realpathSync(tmpdir);
    expect(fs.realpathSync(result.stdout)).toBe(expected);
  });

  it('rejects with SPAWN_ERROR when the binary does not exist', async () => {
    let caught: RunRuleCommandError | undefined;
    try {
      await runRuleCommand({
        argv: [path.join(tmpdir, 'definitely-not-here-xyz')],
        cwd: tmpdir,
      });
    } catch (err) {
      caught = err as RunRuleCommandError;
    }
    expect(caught).toBeDefined();
    // Either SPAWN_ERROR (ENOENT path) or EXIT (some platforms surface it as
    // exit-with-code on the child). Both are acceptable failure modes here.
    expect(['SPAWN_ERROR', 'EXIT']).toContain(caught?.code);
  });
});

/**
 * Tests for the `ALEXI_PLUGIN_RULE_TIMEOUT_MS` env override (issue #711).
 *
 * The override is resolved exactly once at module load, so each test must
 * call `vi.resetModules()` after stubbing the env var and then dynamically
 * import the runner so the `ENV_TIMEOUT_MS` constant picks up the test value.
 *
 * Precedence asserted here (highest to lowest):
 *   1. `opts.timeoutMs` (per-rule / per-call override)
 *   2. `ALEXI_PLUGIN_RULE_TIMEOUT_MS`
 *   3. 5000 ms hardcoded default
 */
describe('runRuleCommand — ALEXI_PLUGIN_RULE_TIMEOUT_MS env override', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rule-cmd-env-'));
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses ALEXI_PLUGIN_RULE_TIMEOUT_MS as the timeout when no per-call override is given', async () => {
    vi.stubEnv('ALEXI_PLUGIN_RULE_TIMEOUT_MS', '150');
    vi.resetModules();
    const { runRuleCommand: runFresh } = await import('../ruleCommandRunner.js');

    const start = Date.now();
    let caught: RunRuleCommandError | undefined;
    try {
      await runFresh({
        // ~1000ms sleep — well past the 150ms env-derived budget but well
        // under the 5000ms hardcoded default.
        argv: [NODE, '-e', 'setTimeout(() => {}, 1000)'],
        cwd: tmpdir,
      });
    } catch (err) {
      caught = err as RunRuleCommandError;
    }
    expect(caught).toBeDefined();
    expect(caught?.code).toBe('TIMEOUT');
    // Should reject in roughly the env-derived budget, definitely well under
    // the 5000ms default.
    expect(Date.now() - start).toBeLessThan(2000);
  });

  it('per-call timeoutMs wins over ALEXI_PLUGIN_RULE_TIMEOUT_MS', async () => {
    // Env says 150ms; per-call says 2000ms; child sleeps 400ms then exits 0.
    // If per-call did NOT win, this would reject with TIMEOUT at ~150ms.
    vi.stubEnv('ALEXI_PLUGIN_RULE_TIMEOUT_MS', '150');
    vi.resetModules();
    const { runRuleCommand: runFresh } = await import('../ruleCommandRunner.js');

    const result = await runFresh({
      argv: [NODE, '-e', 'setTimeout(() => process.stdout.write("ok"), 400)'],
      cwd: tmpdir,
      timeoutMs: 2000,
    });
    expect(result.stdout).toBe('ok');
    expect(result.truncated).toBe(false);
  });

  it('falls back to the 5000 ms default when ALEXI_PLUGIN_RULE_TIMEOUT_MS is invalid', async () => {
    // 'abc' is not a positive integer — the override must be ignored and the
    // 5000 ms default re-applied. A short sleep finishes well under that.
    vi.stubEnv('ALEXI_PLUGIN_RULE_TIMEOUT_MS', 'abc');
    vi.resetModules();
    const { runRuleCommand: runFresh } = await import('../ruleCommandRunner.js');

    const start = Date.now();
    const result = await runFresh({
      argv: [NODE, '-e', 'setTimeout(() => process.stdout.write("ok"), 200)'],
      cwd: tmpdir,
    });
    expect(result.stdout).toBe('ok');
    expect(result.truncated).toBe(false);
    // No early timeout — 200ms sleep should not be cut short by a misread
    // env value, and we should be nowhere near the 5000ms default ceiling.
    expect(Date.now() - start).toBeGreaterThanOrEqual(150);
    expect(Date.now() - start).toBeLessThan(5000);
  });

  it('also ignores zero and negative values (keeps 5000 ms default)', async () => {
    // Zero / negative values would degenerate to instant timeouts if applied
    // verbatim, so the runner must reject them at parse time and keep the
    // 5000 ms default.
    for (const bogus of ['0', '-1']) {
      vi.stubEnv('ALEXI_PLUGIN_RULE_TIMEOUT_MS', bogus);
      vi.resetModules();
      const { runRuleCommand: runFresh } = await import('../ruleCommandRunner.js');
      const result = await runFresh({
        argv: [NODE, '-e', 'process.stdout.write("ok")'],
        cwd: tmpdir,
      });
      expect(result.stdout).toBe('ok');
      expect(result.truncated).toBe(false);
    }
  });
});
