/**
 * Unit tests for the MCP git plugin resolver.
 *
 * All heavy git operations go through the injectable {@link setGitRunner}
 * seam so these tests never touch the network or the real `git` binary.
 * Filesystem operations use a tmpdir created with `fs.mkdtemp` and are
 * torn down in `afterEach` to keep runs parallel-safe.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';

import {
  parseGitUrl,
  validateRef,
  normalizeFileUrl,
  cloneGitRepo,
  checkContainment,
  shouldRevalidate,
  revalidateMutableRef,
  getPluginIdentity,
  identityToCacheKey,
  setGitRunner,
  resetGitRunner,
  DEFAULT_MUTABLE_REF_TTL_MS,
  type GitRunner,
} from '../git-resolver.js';

describe('parseGitUrl', () => {
  it('parses a public HTTPS URL with ref and subpath', () => {
    const parsed = parseGitUrl('https://github.com/org/repo#main@subdir');
    expect(parsed).toEqual({
      protocol: 'https',
      host: 'github.com',
      org: 'org',
      repo: 'repo',
      ref: 'main',
      subpath: 'subdir',
    });
  });

  it('parses a public HTTPS URL without fragment', () => {
    const parsed = parseGitUrl('https://github.com/org/repo.git');
    expect(parsed.protocol).toBe('https');
    expect(parsed.org).toBe('org');
    expect(parsed.repo).toBe('repo');
    expect(parsed.ref).toBeUndefined();
    expect(parsed.subpath).toBeUndefined();
  });

  it('parses a private SSH URL with ref and subpath', () => {
    const parsed = parseGitUrl('git@github.com:org/repo.git#main@subdir');
    expect(parsed).toEqual({
      protocol: 'ssh',
      host: 'github.com',
      org: 'org',
      repo: 'repo',
      ref: 'main',
      subpath: 'subdir',
    });
  });

  it('parses a local file:// URL with ref and subpath', () => {
    const parsed = parseGitUrl('file:///path/to/repo#main@subdir');
    expect(parsed.protocol).toBe('file');
    expect(parsed.repo).toBe('/path/to/repo');
    expect(parsed.ref).toBe('main');
    expect(parsed.subpath).toBe('subdir');
  });

  it('rejects an empty URL', () => {
    expect(() => parseGitUrl('')).toThrow(/empty URL/);
  });

  it('rejects an unsupported scheme', () => {
    expect(() => parseGitUrl('ftp://example.com/repo')).toThrow(/unsupported scheme/);
  });

  it('rejects an HTTPS URL missing org/repo', () => {
    expect(() => parseGitUrl('https://github.com')).toThrow(/missing org\/repo/);
    expect(() => parseGitUrl('https://github.com/only')).toThrow(/missing org\/repo/);
  });

  it('rejects a file:// URL with no path', () => {
    expect(() => parseGitUrl('file://')).toThrow(/no path/);
  });

  it('rejects option-injection refs at parse time', () => {
    expect(() => parseGitUrl('https://github.com/org/repo#--upload-pack=x')).toThrow(
      /option-injection/
    );
  });
});

describe('normalizeFileUrl', () => {
  it('leaves POSIX file:// URLs untouched', () => {
    expect(normalizeFileUrl('file:///home/user/repo')).toBe('file:///home/user/repo');
  });

  it('normalizes Windows drive-less file:// URLs', () => {
    expect(normalizeFileUrl('file:///C:/Users/foo/repo')).toBe('file://C:/Users/foo/repo');
  });

  it('leaves non-file URLs untouched', () => {
    expect(normalizeFileUrl('https://github.com/org/repo')).toBe('https://github.com/org/repo');
    expect(normalizeFileUrl('git@github.com:org/repo.git')).toBe('git@github.com:org/repo.git');
  });

  it('normalizes drive-letter path even without trailing content', () => {
    expect(normalizeFileUrl('file:///D:')).toBe('file://D:');
  });
});

describe('validateRef', () => {
  it('accepts a normal branch name', () => {
    expect(() => validateRef('main')).not.toThrow();
    expect(() => validateRef('release/v1.2.3')).not.toThrow();
  });

  it('rejects an empty ref', () => {
    expect(() => validateRef('')).toThrow(/empty/);
  });

  it('rejects a ref starting with a dash (option injection)', () => {
    expect(() => validateRef('--upload-pack')).toThrow(/option-injection/);
    expect(() => validateRef('-x')).toThrow(/option-injection/);
  });

  it('rejects a ref containing ^-- (option injection variant)', () => {
    expect(() => validateRef('main^--foo')).toThrow(/option-injection/);
  });

  it('rejects a ref containing shell metacharacters', () => {
    expect(() => validateRef('main;rm -rf /')).toThrow(/whitespace|shell metacharacter/);
    expect(() => validateRef('main`whoami`')).toThrow(/shell metacharacter/);
    expect(() => validateRef('main|cat')).toThrow(/shell metacharacter/);
  });

  it('rejects malformed refs (git check-ref-format heuristics)', () => {
    expect(() => validateRef('foo..bar')).toThrow(/malformed/);
    expect(() => validateRef('foo//bar')).toThrow(/malformed/);
    expect(() => validateRef('foo/')).toThrow(/malformed/);
    expect(() => validateRef('foo.lock')).toThrow(/malformed/);
  });

  it('rejects refs with whitespace or control characters', () => {
    expect(() => validateRef('main ref')).toThrow(/whitespace/);
    expect(() => validateRef('main\nref')).toThrow(/whitespace/);
  });
});

describe('getPluginIdentity + identityToCacheKey', () => {
  it('produces a stable identity for HTTPS URLs', () => {
    const id = getPluginIdentity('https://github.com/org/repo#main@subdir');
    expect(id).toBe('git:github.com/org/repo#main@subdir');
  });

  it('produces a stable identity for SSH URLs', () => {
    const id = getPluginIdentity('git@github.com:org/repo.git#main');
    expect(id).toBe('git:github.com/org/repo#main');
  });

  it('produces a stable identity for file:// URLs', () => {
    const id = getPluginIdentity('file:///path/to/repo');
    expect(id).toBe('git:file:/path/to/repo');
  });

  it('namespaces git identities apart from npm/local (git: prefix)', () => {
    const id = getPluginIdentity('https://github.com/org/repo');
    expect(id.startsWith('git:')).toBe(true);
  });

  it('lets callers override ref and subpath', () => {
    const id = getPluginIdentity('https://github.com/org/repo', 'develop', 'nested');
    expect(id).toBe('git:github.com/org/repo#develop@nested');
  });

  it('turns an identity into a filesystem-safe cache key', () => {
    const key = identityToCacheKey('git:github.com/org/repo#main@subdir');
    expect(key).toMatch(/^[A-Za-z0-9._-]+$/);
    expect(key).not.toContain('/');
    expect(key).not.toContain('#');
    expect(key).not.toContain('@');
  });
});

describe('cloneGitRepo', () => {
  let cacheDir: string;
  let calls: Array<{ args: string[]; env?: NodeJS.ProcessEnv }>;

  beforeEach(async () => {
    cacheDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-git-cache-'));
    calls = [];
  });

  afterEach(async () => {
    resetGitRunner();
    await fsPromises.rm(cacheDir, { recursive: true, force: true });
  });

  function mockRunner(revParseSha: string, cloneShouldFail = false): GitRunner {
    return async (args, options) => {
      calls.push({ args, env: options.env });
      if (args[0] === 'clone') {
        if (cloneShouldFail) {
          return { stdout: '', stderr: 'clone denied', code: 128 };
        }
        // Create the temp target dir with a .git marker so subsequent
        // rev-parse call has somewhere real to run in.
        const tempTarget = args[args.length - 1];
        await fsPromises.mkdir(path.join(tempTarget, '.git'), { recursive: true });
        await fsPromises.writeFile(path.join(tempTarget, 'README.md'), '# test', 'utf-8');
        return { stdout: '', stderr: '', code: 0 };
      }
      if (args[0] === 'rev-parse') {
        return { stdout: `${revParseSha}\n`, stderr: '', code: 0 };
      }
      return { stdout: '', stderr: 'unexpected', code: 1 };
    };
  }

  it('clones a public HTTPS repo and returns the resolved commit', async () => {
    setGitRunner(mockRunner('abc1234abc1234abc1234abc1234abc1234abcd'));

    const result = await cloneGitRepo('https://github.com/org/repo', 'main', cacheDir);

    expect(result.commit).toBe('abc1234abc1234abc1234abc1234abc1234abcd');
    expect(path.dirname(result.path)).toBe(cacheDir);
    // Final directory must exist after atomic swap.
    const stat = await fsPromises.stat(result.path);
    expect(stat.isDirectory()).toBe(true);
    // Clone call carried --depth 1 and --branch main.
    const cloneCall = calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall).toBeDefined();
    expect(cloneCall?.args).toContain('--depth');
    expect(cloneCall?.args).toContain('1');
    expect(cloneCall?.args).toContain('--branch');
    expect(cloneCall?.args).toContain('main');
    // No GIT_SSH_COMMAND for public URL.
    expect(cloneCall?.env?.GIT_SSH_COMMAND).toBeUndefined();
  });

  it('passes GIT_SSH_COMMAND when cloning a private SSH repo with a key', async () => {
    setGitRunner(mockRunner('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef'));

    const result = await cloneGitRepo('git@github.com:org/repo.git', 'main', cacheDir, {
      sshKey: '/home/user/.ssh/id_ed25519',
    });

    expect(result.commit).toBe('deadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
    const cloneCall = calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall?.env?.GIT_SSH_COMMAND).toContain('ssh -i /home/user/.ssh/id_ed25519');
    expect(cloneCall?.env?.GIT_SSH_COMMAND).toContain('IdentitiesOnly=yes');
  });

  it('clones a local file:// repo', async () => {
    setGitRunner(mockRunner('1111111111111111111111111111111111111111'));

    const result = await cloneGitRepo('file:///tmp/local-repo', undefined, cacheDir);

    expect(result.commit).toBe('1111111111111111111111111111111111111111');
    const cloneCall = calls.find((c) => c.args[0] === 'clone');
    // No --branch when ref is undefined.
    expect(cloneCall?.args).not.toContain('--branch');
    // URL preserved via `--` separator.
    expect(cloneCall?.args).toContain('--');
    expect(cloneCall?.args).toContain('file:///tmp/local-repo');
  });

  it('rejects an option-injection ref before touching argv', async () => {
    setGitRunner(mockRunner('0000000000000000000000000000000000000000'));

    await expect(
      cloneGitRepo('https://github.com/org/repo', '--upload-pack=/tmp/x', cacheDir)
    ).rejects.toThrow(/option-injection/);

    expect(calls.length).toBe(0);
  });

  it('surfaces a git clone failure', async () => {
    setGitRunner(mockRunner('n/a', true));

    await expect(cloneGitRepo('https://github.com/org/repo', 'main', cacheDir)).rejects.toThrow(
      /git clone failed/
    );
  });
});

describe('checkContainment', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-git-cnt-'));
  });

  afterEach(async () => {
    await fsPromises.rm(tmp, { recursive: true, force: true });
  });

  it('returns the resolved repo root when no subpath is given', async () => {
    const resolved = await checkContainment(tmp);
    expect(resolved).toBe(await fsPromises.realpath(tmp));
  });

  it('resolves a subpath that stays inside the repo', async () => {
    await fsPromises.mkdir(path.join(tmp, 'nested'), { recursive: true });
    const resolved = await checkContainment(tmp, 'nested');
    expect(resolved.startsWith(await fsPromises.realpath(tmp))).toBe(true);
  });

  it('resolves a subpath through a symlink that stays inside the repo', async () => {
    await fsPromises.mkdir(path.join(tmp, 'real'), { recursive: true });
    await fsPromises.writeFile(path.join(tmp, 'real', 'file.txt'), 'hello', 'utf-8');
    await fsPromises.symlink(path.join(tmp, 'real'), path.join(tmp, 'link'));
    const resolved = await checkContainment(tmp, 'link');
    expect(resolved).toBe(await fsPromises.realpath(path.join(tmp, 'real')));
  });

  it('rejects a symlink that points outside the repo', async () => {
    const outside = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-git-outside-'));
    try {
      await fsPromises.symlink(outside, path.join(tmp, 'escape'));
      await expect(checkContainment(tmp, 'escape')).rejects.toThrow(/escapes repo root/);
    } finally {
      await fsPromises.rm(outside, { recursive: true, force: true });
    }
  });

  it('rejects an absolute subpath', async () => {
    await expect(checkContainment(tmp, '/etc/passwd')).rejects.toThrow(/absolute subpath/);
  });

  it('rejects a subpath that does not exist', async () => {
    await expect(checkContainment(tmp, 'missing')).rejects.toThrow(/does not exist/);
  });
});

describe('shouldRevalidate', () => {
  it('returns true when no record is present', () => {
    expect(shouldRevalidate(undefined)).toBe(true);
  });

  it('returns false when record is within TTL', () => {
    const now = Date.now();
    const record = { identity: 'git:x', commit: 'abc123', resolvedAt: now - 1000 };
    expect(shouldRevalidate(record, DEFAULT_MUTABLE_REF_TTL_MS, now)).toBe(false);
  });

  it('returns true when record is older than TTL', () => {
    const now = Date.now();
    const record = {
      identity: 'git:x',
      commit: 'abc123',
      resolvedAt: now - (DEFAULT_MUTABLE_REF_TTL_MS + 1000),
    };
    expect(shouldRevalidate(record, DEFAULT_MUTABLE_REF_TTL_MS, now)).toBe(true);
  });

  it('returns true when TTL is 0 or negative (force revalidate)', () => {
    const record = { identity: 'git:x', commit: 'abc123', resolvedAt: Date.now() };
    expect(shouldRevalidate(record, 0)).toBe(true);
    expect(shouldRevalidate(record, -1)).toBe(true);
  });
});

describe('revalidateMutableRef', () => {
  afterEach(() => {
    resetGitRunner();
  });

  it('returns true when the remote commit has changed', async () => {
    setGitRunner(async (args) => {
      expect(args[0]).toBe('ls-remote');
      expect(args).toContain('main');
      return {
        stdout: 'ffffffffffffffffffffffffffffffffffffffff\trefs/heads/main\n',
        stderr: '',
        code: 0,
      };
    });

    const changed = await revalidateMutableRef(
      'https://github.com/org/repo',
      'main',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    );
    expect(changed).toBe(true);
  });

  it('returns false when the remote commit matches the recorded commit', async () => {
    setGitRunner(async () => ({
      stdout: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\trefs/heads/main\n',
      stderr: '',
      code: 0,
    }));

    const changed = await revalidateMutableRef(
      'https://github.com/org/repo',
      'main',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    );
    expect(changed).toBe(false);
  });

  it('is case-insensitive on commit SHA comparison', async () => {
    setGitRunner(async () => ({
      stdout: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\trefs/heads/main\n',
      stderr: '',
      code: 0,
    }));

    const changed = await revalidateMutableRef(
      'https://github.com/org/repo',
      'main',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    );
    expect(changed).toBe(false);
  });

  it('throws when git ls-remote fails', async () => {
    setGitRunner(async () => ({
      stdout: '',
      stderr: 'fatal: repository not found',
      code: 128,
    }));

    await expect(
      revalidateMutableRef('https://github.com/org/repo', 'main', 'abc123')
    ).rejects.toThrow(/git ls-remote failed/);
  });

  it('rejects option-injection refs before touching argv', async () => {
    let called = false;
    setGitRunner(async () => {
      called = true;
      return { stdout: '', stderr: '', code: 0 };
    });

    await expect(
      revalidateMutableRef('https://github.com/org/repo', '--upload-pack=x', 'abc')
    ).rejects.toThrow(/option-injection/);
    expect(called).toBe(false);
  });

  it('forces revalidation when the recorded commit is empty', async () => {
    setGitRunner(async () => ({
      stdout: 'ffffffffffffffffffffffffffffffffffffffff\trefs/heads/main\n',
      stderr: '',
      code: 0,
    }));

    const changed = await revalidateMutableRef('https://github.com/org/repo', 'main', '');
    expect(changed).toBe(true);
  });
});
