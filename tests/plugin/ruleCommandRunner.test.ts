/**
 * Tests for the strict, spec-conformant `runRuleCommand` API
 * (issue #648 / parent tracker #633).
 *
 * The strict API is argv-based, rejects with typed errors on TIMEOUT / EXIT,
 * resolves with `{ stdout, truncated }` on success, and applies the secret
 * env denylist via {@link scrubEnvDeny}.
 *
 * The legacy lenient API and its helpers (`tokenizeCommand`, `scrubEnv`)
 * are exercised separately in `tests/plugin/ruleCommand.test.ts`.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  runRuleCommand,
  scrubEnvDeny,
  type RunRuleCommandError,
} from '../../src/plugin/ruleCommandRunner.js';

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

  it('resolves with stdout and truncated:false on success', async () => {
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("hello world")'],
      cwd: tmpdir,
    });
    expect(result.stdout).toBe('hello world');
    expect(result.truncated).toBe(false);
  });

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

  it('caps stdout at maxBytes and resolves with truncated:true', async () => {
    const result = await runRuleCommand({
      argv: [NODE, '-e', 'process.stdout.write("x".repeat(64*1024))'],
      cwd: tmpdir,
      maxBytes: 4096,
    });
    expect(result.truncated).toBe(true);
    expect(result.stdout.length).toBe(4096);
    expect(result.stdout).toMatch(/^x+$/);
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

  it('passes only the scrubbed env to the child', async () => {
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
