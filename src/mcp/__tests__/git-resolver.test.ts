/**
 * Tests for the MCP git plugin resolver.
 *
 * `git` invocations are stubbed via `vi.mock('child_process')` so the
 * suite runs without touching the network or requiring a real `git`
 * binary. Each test that exercises the clone path programs the mock
 * to return either a canned rev-parse output or a synthetic failure.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { execFile } from 'child_process';
import {
  parseGitUrl,
  validateRef,
  normalizeFileUrl,
  cloneGitRepo,
  checkContainment,
  shouldRevalidate,
  revalidateMutableRef,
  getPluginIdentity,
  DEFAULT_REVALIDATE_TTL_MS,
} from '../git-resolver.js';

type ExecFileCallback = (
  err: (Error & { code?: string | number }) | null,
  stdout: string | Buffer,
  stderr: string | Buffer
) => void;

interface Call {
  file: string;
  args: string[];
  env?: NodeJS.ProcessEnv;
  cwd?: string;
}

interface Fixture {
  handler: (call: Call) => { err?: Error; stdout?: string; stderr?: string };
  calls: Call[];
}

function programExecFile(fixture: Fixture): void {
  vi.mocked(execFile).mockImplementation(((
    file: string,
    args: string[],
    optionsOrCb: unknown,
    maybeCb?: ExecFileCallback
  ) => {
    const options =
      typeof optionsOrCb === 'function'
        ? {}
        : (optionsOrCb as { env?: NodeJS.ProcessEnv; cwd?: string });
    const callback = (
      typeof optionsOrCb === 'function' ? optionsOrCb : maybeCb
    ) as ExecFileCallback;
    const call: Call = { file, args, env: options?.env, cwd: options?.cwd };
    fixture.calls.push(call);
    const { err, stdout, stderr } = fixture.handler(call);
    callback(err ?? null, stdout ?? '', stderr ?? '');
    return undefined as unknown;
  }) as unknown as typeof execFile);
}

let tmpRoot: string;

beforeEach(() => {
  vi.clearAllMocks();
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-git-resolver-'));
});

afterEach(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  vi.resetAllMocks();
});

describe('parseGitUrl', () => {
  it('parses a public HTTPS URL with ref and subpath', () => {
    const parsed = parseGitUrl('https://github.com/org/repo#main@subdir');
    expect(parsed).toMatchObject({
      protocol: 'https',
      host: 'github.com',
      org: 'org',
      repo: 'repo',
      ref: 'main',
      subpath: 'subdir',
      normalizedUrl: 'https://github.com/org/repo',
    });
  });

  it('strips a trailing .git from HTTPS URLs', () => {
    const parsed = parseGitUrl('https://github.com/org/repo.git#v1.0.0');
    expect(parsed.repo).toBe('repo');
    expect(parsed.ref).toBe('v1.0.0');
  });

  it('parses a private SSH URL with ref and subpath', () => {
    const parsed = parseGitUrl('git@github.com:org/repo.git#main@subdir');
    expect(parsed).toMatchObject({
      protocol: 'ssh',
      host: 'github.com',
      org: 'org',
      repo: 'repo',
      ref: 'main',
      subpath: 'subdir',
    });
  });

  it('parses a POSIX file:// URL with ref and subpath', () => {
    const parsed = parseGitUrl('file:///path/to/repo#main@subdir');
    expect(parsed).toMatchObject({
      protocol: 'file',
      org: '/path/to',
      repo: 'repo',
      ref: 'main',
      subpath: 'subdir',
    });
  });

  it('accepts a URL without a fragment', () => {
    const parsed = parseGitUrl('https://github.com/org/repo');
    expect(parsed.ref).toBeUndefined();
    expect(parsed.subpath).toBeUndefined();
  });

  it('rejects an unrecognized URL scheme', () => {
    expect(() => parseGitUrl('ftp://example.com/x')).toThrow(/unrecognized git URL/);
  });

  it('rejects an HTTPS URL missing the repo segment', () => {
    expect(() => parseGitUrl('https://github.com/org')).toThrow(/<org>\/<repo>/);
  });

  it('rejects a subpath that traverses parents', () => {
    expect(() => parseGitUrl('https://github.com/org/repo#main@../etc')).toThrow(
      /traverse parents/
    );
    expect(() => parseGitUrl('https://github.com/org/repo#main@/absolute')).toThrow(
      /must be relative/
    );
  });
});

describe('normalizeFileUrl', () => {
  it('collapses Windows drive-less file:// URLs', () => {
    expect(normalizeFileUrl('file:///C:/Users/alice/repo')).toBe('file://C:/Users/alice/repo');
  });

  it('leaves POSIX file:// URLs untouched', () => {
    expect(normalizeFileUrl('file:///home/alice/repo')).toBe('file:///home/alice/repo');
  });

  it('passes non-file URLs through unchanged', () => {
    expect(normalizeFileUrl('https://github.com/org/repo')).toBe('https://github.com/org/repo');
  });
});

describe('validateRef', () => {
  it('accepts a normal ref', () => {
    expect(() => validateRef('main')).not.toThrow();
    expect(() => validateRef('v1.2.3')).not.toThrow();
    expect(() => validateRef('feature/foo')).not.toThrow();
  });

  it('rejects an option-injection ref', () => {
    expect(() => validateRef('--upload-pack=/bin/sh')).toThrow(/parsed as an option/);
    expect(() => validateRef('-o')).toThrow(/parsed as an option/);
  });

  it('rejects an empty ref', () => {
    expect(() => validateRef('')).toThrow(/non-empty string/);
  });

  it('rejects a ref with whitespace', () => {
    expect(() => validateRef('bad ref')).toThrow(/whitespace/);
  });

  it('rejects malformed refs per git rules', () => {
    expect(() => validateRef('foo..bar')).toThrow(/disallowed by git/);
    expect(() => validateRef('foo^bar')).toThrow(/disallowed by git/);
    expect(() => validateRef('.hidden')).toThrow(/ref-format rules/);
    expect(() => validateRef('branch.lock')).toThrow(/ref-format rules/);
  });
});

describe('getPluginIdentity', () => {
  it('produces stable, filesystem-safe identities', () => {
    const a = getPluginIdentity('https://github.com/org/repo', 'main', 'sub');
    const b = getPluginIdentity('https://github.com/org/repo', 'main', 'sub');
    expect(a).toBe(b);
    expect(a).toMatch(/^git-https-[a-f0-9]{16}$/);
  });

  it('differs across protocols even for the same host/org/repo', () => {
    const https = getPluginIdentity('https://github.com/org/repo');
    const ssh = getPluginIdentity('git@github.com:org/repo.git');
    expect(https).not.toBe(ssh);
  });

  it('differs across refs', () => {
    const main = getPluginIdentity('https://github.com/org/repo', 'main');
    const dev = getPluginIdentity('https://github.com/org/repo', 'dev');
    expect(main).not.toBe(dev);
  });
});

describe('cloneGitRepo', () => {
  it('clones a public HTTPS repo and records the resolved commit', async () => {
    const fixture: Fixture = {
      calls: [],
      handler: (call) => {
        if (call.args[0] === 'clone') {
          // Simulate a successful clone by creating the tmp dir.
          const tmp = call.args[call.args.length - 1];
          fs.mkdirSync(tmp, { recursive: true });
          return { stdout: '' };
        }
        if (call.args[0] === 'rev-parse') {
          return { stdout: 'deadbeef1234567890\n' };
        }
        return { err: new Error(`unexpected call ${call.args.join(' ')}`) };
      },
    };
    programExecFile(fixture);

    const result = await cloneGitRepo('https://github.com/org/repo#main', undefined, tmpRoot);
    expect(result.commit).toBe('deadbeef1234567890');
    expect(result.path).toBe(path.join(tmpRoot, result.identity));
    expect(fs.existsSync(result.path)).toBe(true);
    expect(fs.existsSync(path.join(result.path, '.metadata.json'))).toBe(true);

    const cloneCall = fixture.calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall).toBeDefined();
    expect(cloneCall!.args).toContain('--branch');
    expect(cloneCall!.args).toContain('main');
    expect(cloneCall!.args).toContain('--depth');
    expect(cloneCall!.args).toContain('1');
    // The `--` separator ensures the URL cannot be misinterpreted as a flag.
    expect(cloneCall!.args).toContain('--');
  });

  it('sets GIT_SSH_COMMAND when an SSH key is supplied', async () => {
    const fixture: Fixture = {
      calls: [],
      handler: (call) => {
        if (call.args[0] === 'clone') {
          fs.mkdirSync(call.args[call.args.length - 1], { recursive: true });
          return { stdout: '' };
        }
        if (call.args[0] === 'rev-parse') {
          return { stdout: 'abc123\n' };
        }
        return { err: new Error('unexpected') };
      },
    };
    programExecFile(fixture);

    await cloneGitRepo('git@github.com:org/repo.git#main', undefined, tmpRoot, '/tmp/key.pem');
    const cloneCall = fixture.calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall!.env?.GIT_SSH_COMMAND).toContain('/tmp/key.pem');
    expect(cloneCall!.env?.GIT_SSH_COMMAND).toContain('accept-new');
  });

  it('clones a local file:// repo', async () => {
    const fixture: Fixture = {
      calls: [],
      handler: (call) => {
        if (call.args[0] === 'clone') {
          fs.mkdirSync(call.args[call.args.length - 1], { recursive: true });
          return { stdout: '' };
        }
        if (call.args[0] === 'rev-parse') {
          return { stdout: 'localcommit\n' };
        }
        return { err: new Error('unexpected') };
      },
    };
    programExecFile(fixture);

    const result = await cloneGitRepo('file:///tmp/some-repo#main', undefined, tmpRoot);
    expect(result.commit).toBe('localcommit');
    const cloneCall = fixture.calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall!.args).toContain('file:///tmp/some-repo');
  });

  it('cleans up the temp directory when clone fails', async () => {
    const fixture: Fixture = {
      calls: [],
      handler: (call) => {
        if (call.args[0] === 'clone') {
          // Simulate failure but still create the tmp so we can verify cleanup.
          fs.mkdirSync(call.args[call.args.length - 1], { recursive: true });
          return { err: new Error('boom'), stderr: 'boom' };
        }
        return { err: new Error('unexpected') };
      },
    };
    programExecFile(fixture);

    await expect(
      cloneGitRepo('https://github.com/org/repo#main', undefined, tmpRoot)
    ).rejects.toThrow(/boom/);

    // Any `.tmp-` sibling directories must be gone.
    const remainders = fs.readdirSync(tmpRoot).filter((n) => n.includes('.tmp-'));
    expect(remainders).toEqual([]);
  });

  it('rejects a ref that looks like a git option (option injection)', async () => {
    programExecFile({ calls: [], handler: () => ({ stdout: '' }) });
    await expect(
      cloneGitRepo('https://github.com/org/repo', '--upload-pack=/bin/sh', tmpRoot)
    ).rejects.toThrow(/parsed as an option/);
  });
});

describe('checkContainment', () => {
  it('accepts a subpath that resolves inside the repo', () => {
    const repo = fs.mkdtempSync(path.join(tmpRoot, 'repo-'));
    fs.mkdirSync(path.join(repo, 'sub'));
    const resolved = checkContainment(repo, 'sub');
    expect(resolved.startsWith(fs.realpathSync(repo))).toBe(true);
  });

  it('accepts a symlink that resolves back inside the repo', () => {
    const repo = fs.mkdtempSync(path.join(tmpRoot, 'repo-'));
    fs.mkdirSync(path.join(repo, 'inner'));
    fs.symlinkSync(path.join(repo, 'inner'), path.join(repo, 'link'));
    const resolved = checkContainment(repo, 'link');
    expect(resolved).toContain('inner');
  });

  it('rejects a symlink that points outside the repo', () => {
    const repo = fs.mkdtempSync(path.join(tmpRoot, 'repo-'));
    const outside = fs.mkdtempSync(path.join(tmpRoot, 'outside-'));
    fs.symlinkSync(outside, path.join(repo, 'escape'));
    expect(() => checkContainment(repo, 'escape')).toThrow(/escapes repository root/);
  });

  it('rejects a non-existent traversal path lexically', () => {
    const repo = fs.mkdtempSync(path.join(tmpRoot, 'repo-'));
    expect(() => checkContainment(repo, '../etc')).toThrow(/escapes repository root/);
  });
});

describe('shouldRevalidate', () => {
  it('returns true when no metadata exists', () => {
    expect(shouldRevalidate('missing-identity', DEFAULT_REVALIDATE_TTL_MS, tmpRoot)).toBe(true);
  });

  it('returns false within the TTL', () => {
    const id = 'git-https-abcdef1234567890';
    const dir = path.join(tmpRoot, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.metadata.json'),
      JSON.stringify({
        identity: id,
        url: 'https://github.com/org/repo',
        ref: 'main',
        commit: 'abc',
        lastCheckedAt: Date.now(),
      })
    );
    expect(shouldRevalidate(id, DEFAULT_REVALIDATE_TTL_MS, tmpRoot)).toBe(false);
  });

  it('returns true past the TTL', () => {
    const id = 'git-https-fedcba0987654321';
    const dir = path.join(tmpRoot, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, '.metadata.json'),
      JSON.stringify({
        identity: id,
        url: 'https://github.com/org/repo',
        ref: 'main',
        commit: 'abc',
        lastCheckedAt: Date.now() - 2 * DEFAULT_REVALIDATE_TTL_MS,
      })
    );
    expect(shouldRevalidate(id, DEFAULT_REVALIDATE_TTL_MS, tmpRoot)).toBe(true);
  });

  it('returns true when metadata is malformed', () => {
    const id = 'git-https-badbadbadbadbadb';
    const dir = path.join(tmpRoot, id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, '.metadata.json'), 'not-json');
    expect(shouldRevalidate(id, DEFAULT_REVALIDATE_TTL_MS, tmpRoot)).toBe(true);
  });
});

describe('revalidateMutableRef', () => {
  it('reports true when the remote commit differs', async () => {
    programExecFile({
      calls: [],
      handler: () => ({ stdout: 'newcommit\trefs/heads/main\n' }),
    });
    const changed = await revalidateMutableRef('https://github.com/org/repo', 'main', 'oldcommit');
    expect(changed).toBe(true);
  });

  it('reports false when the remote commit matches', async () => {
    programExecFile({
      calls: [],
      handler: () => ({ stdout: 'samecommit\trefs/heads/main\n' }),
    });
    const changed = await revalidateMutableRef('https://github.com/org/repo', 'main', 'samecommit');
    expect(changed).toBe(false);
  });

  it('treats an empty ls-remote result as changed', async () => {
    programExecFile({ calls: [], handler: () => ({ stdout: '' }) });
    const changed = await revalidateMutableRef('https://github.com/org/repo', 'main', 'anycommit');
    expect(changed).toBe(true);
  });

  it('rejects an option-injection ref before shelling out', async () => {
    programExecFile({ calls: [], handler: () => ({ stdout: '' }) });
    await expect(
      revalidateMutableRef('https://github.com/org/repo', '--upload-pack', 'x')
    ).rejects.toThrow(/parsed as an option/);
  });
});
