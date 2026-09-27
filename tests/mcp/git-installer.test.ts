/**
 * Unit tests for the git-based MCP plugin installer.
 *
 * The `git` subprocess is stubbed out via the installer's
 * {@link setGitSpawner} seam so tests never touch the network or the
 * real `git` binary. All filesystem operations use a tmpdir created
 * with `fs.mkdtemp` and are torn down in `afterEach` to keep runs
 * parallel-safe.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fsPromises } from 'fs';
import os from 'os';
import path from 'path';

// Mock the config module before importing the installer so
// `addMcpServer` is a spy and does not touch `~/.alexi/mcp-servers.json`.
const addMcpServerMock = vi.fn();
vi.mock('../../src/mcp/config.js', () => ({
  addMcpServer: (server: unknown) => addMcpServerMock(server),
}));

import {
  parseGitUrl,
  validateBranch,
  sanitizePluginName,
  cloneMCPPlugin,
  detectMCPEntry,
  installGitMCPPlugin,
  setGitSpawner,
  resetGitSpawner,
  type GitSpawner,
} from '../../src/mcp/git-installer.js';

describe('parseGitUrl', () => {
  it('parses `owner/repo` shorthand as GitHub HTTPS', () => {
    const parsed = parseGitUrl('anthropics/mcp-example');
    expect(parsed).toEqual({
      provider: 'github',
      host: 'github.com',
      owner: 'anthropics',
      repo: 'mcp-example',
      url: 'https://github.com/anthropics/mcp-example.git',
      isSsh: false,
      name: 'mcp-example',
    });
  });

  it('parses `github:owner/repo` shorthand', () => {
    const parsed = parseGitUrl('github:foo/bar');
    expect(parsed.provider).toBe('github');
    expect(parsed.url).toBe('https://github.com/foo/bar.git');
  });

  it('parses `gitlab:owner/repo` shorthand', () => {
    const parsed = parseGitUrl('gitlab:group/project');
    expect(parsed.provider).toBe('gitlab');
    expect(parsed.host).toBe('gitlab.com');
    expect(parsed.url).toBe('https://gitlab.com/group/project.git');
  });

  it('parses `bitbucket:owner/repo` shorthand', () => {
    const parsed = parseGitUrl('bitbucket:team/repo');
    expect(parsed.provider).toBe('bitbucket');
    expect(parsed.host).toBe('bitbucket.org');
  });

  it('parses a full HTTPS URL and strips .git suffix', () => {
    const parsed = parseGitUrl('https://github.com/foo/bar.git');
    expect(parsed.provider).toBe('github');
    expect(parsed.repo).toBe('bar');
    expect(parsed.url).toBe('https://github.com/foo/bar.git');
  });

  it('parses a HTTPS URL without .git suffix', () => {
    const parsed = parseGitUrl('https://gitlab.com/group/project');
    expect(parsed.provider).toBe('gitlab');
    expect(parsed.url).toBe('https://gitlab.com/group/project.git');
  });

  it('tags self-hosted HTTPS hosts as custom', () => {
    const parsed = parseGitUrl('https://git.example.com/foo/bar');
    expect(parsed.provider).toBe('custom');
    expect(parsed.host).toBe('git.example.com');
  });

  it('parses an SSH URL and preserves the original clone form', () => {
    const parsed = parseGitUrl('git@github.com:owner/repo.git');
    expect(parsed.isSsh).toBe(true);
    expect(parsed.provider).toBe('github');
    expect(parsed.owner).toBe('owner');
    expect(parsed.repo).toBe('repo');
    expect(parsed.url).toBe('git@github.com:owner/repo.git');
  });

  it('tags self-hosted SSH hosts as custom', () => {
    const parsed = parseGitUrl('git@git.example.com:team/repo');
    expect(parsed.provider).toBe('custom');
    expect(parsed.isSsh).toBe(true);
  });

  it('rejects an empty URL', () => {
    expect(() => parseGitUrl('')).toThrow(/empty URL/);
    expect(() => parseGitUrl('   ')).toThrow(/empty URL/);
  });

  it('rejects an unsupported scheme', () => {
    expect(() => parseGitUrl('ftp://example.com/repo')).toThrow(/unsupported format/);
  });

  it('rejects an HTTPS URL missing owner/repo', () => {
    expect(() => parseGitUrl('https://github.com/only')).toThrow(/missing owner\/repo/);
  });

  it('rejects segments starting with a dash (avoids `--upload-pack` injection)', () => {
    expect(() => parseGitUrl('-flag/repo')).toThrow(/unsupported format|invalid/);
    expect(() => parseGitUrl('owner/-flag')).toThrow(/unsupported format|invalid/);
  });
});

describe('sanitizePluginName', () => {
  it('collapses non-alphanumerics to a single dash', () => {
    expect(sanitizePluginName('foo bar/baz')).toBe('foo-bar-baz');
  });

  it('strips leading and trailing dashes', () => {
    expect(sanitizePluginName('-foo-')).toBe('foo');
  });

  it('strips a trailing .git', () => {
    expect(sanitizePluginName('my-repo.git')).toBe('my-repo');
  });
});

describe('validateBranch', () => {
  it('accepts normal branch names', () => {
    expect(() => validateBranch('main')).not.toThrow();
    expect(() => validateBranch('release/v1.2.3')).not.toThrow();
  });

  it('rejects empty branches', () => {
    expect(() => validateBranch('')).toThrow(/empty/);
  });

  it('rejects option-injection branches', () => {
    expect(() => validateBranch('--upload-pack')).toThrow(/option-injection/);
  });

  it('rejects branches with whitespace or shell metacharacters', () => {
    expect(() => validateBranch('main branch')).toThrow(/whitespace/);
    expect(() => validateBranch('main;rm')).toThrow(/shell metacharacter/);
  });

  it('rejects malformed refs', () => {
    expect(() => validateBranch('foo..bar')).toThrow(/malformed/);
    expect(() => validateBranch('foo/')).toThrow(/malformed/);
    expect(() => validateBranch('foo.lock')).toThrow(/malformed/);
  });
});

describe('cloneMCPPlugin', () => {
  let cacheDir: string;
  let calls: Array<{ args: string[]; env?: NodeJS.ProcessEnv }>;

  beforeEach(async () => {
    cacheDir = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-mcp-clone-'));
    calls = [];
  });

  afterEach(async () => {
    resetGitSpawner();
    await fsPromises.rm(cacheDir, { recursive: true, force: true });
  });

  function mockSpawner(shouldFail = false): GitSpawner {
    return async (args, options) => {
      calls.push({ args, env: options.env });
      if (args[0] === 'clone') {
        if (shouldFail) {
          return { stdout: '', stderr: 'clone denied', code: 128 };
        }
        const target = args[args.length - 1];
        await fsPromises.mkdir(path.join(target, '.git'), { recursive: true });
        await fsPromises.writeFile(path.join(target, 'README.md'), '# ok', 'utf-8');
        return { stdout: '', stderr: '', code: 0 };
      }
      return { stdout: '', stderr: 'unexpected', code: 1 };
    };
  }

  it('clones a repo with --depth 1 and --quiet by default', async () => {
    setGitSpawner(mockSpawner(false));

    const dest = path.join(cacheDir, 'plugin');
    const result = await cloneMCPPlugin('https://github.com/foo/bar.git', dest);

    expect(result.path).toBe(dest);
    expect(result.url).toBe('https://github.com/foo/bar.git');

    const cloneCall = calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall?.args).toContain('--depth');
    expect(cloneCall?.args).toContain('1');
    expect(cloneCall?.args).toContain('--quiet');
    expect(cloneCall?.args).toContain('--');
    // No --branch when not requested.
    expect(cloneCall?.args).not.toContain('--branch');
  });

  it('passes --branch when supplied', async () => {
    setGitSpawner(mockSpawner(false));
    const dest = path.join(cacheDir, 'plugin-branch');
    await cloneMCPPlugin('https://github.com/foo/bar.git', dest, { branch: 'develop' });

    const cloneCall = calls.find((c) => c.args[0] === 'clone');
    expect(cloneCall?.args).toContain('--branch');
    expect(cloneCall?.args).toContain('develop');
  });

  it('refuses to clone over an existing directory unless force is set', async () => {
    setGitSpawner(mockSpawner(false));
    const dest = path.join(cacheDir, 'existing');
    await fsPromises.mkdir(dest, { recursive: true });

    await expect(cloneMCPPlugin('https://github.com/foo/bar.git', dest)).rejects.toThrow(
      /already exists/
    );

    // With force it succeeds.
    await cloneMCPPlugin('https://github.com/foo/bar.git', dest, { force: true });
    const stat = await fsPromises.stat(dest);
    expect(stat.isDirectory()).toBe(true);
  });

  it('rejects option-injection branches before touching argv', async () => {
    let called = false;
    setGitSpawner(async () => {
      called = true;
      return { stdout: '', stderr: '', code: 0 };
    });
    await expect(
      cloneMCPPlugin('https://github.com/foo/bar.git', path.join(cacheDir, 'p'), {
        branch: '--upload-pack=x',
      })
    ).rejects.toThrow(/option-injection/);
    expect(called).toBe(false);
  });

  it('surfaces a git clone failure and cleans up the half-written dir', async () => {
    setGitSpawner(mockSpawner(true));
    const dest = path.join(cacheDir, 'fail');
    await expect(cloneMCPPlugin('https://github.com/foo/bar.git', dest)).rejects.toThrow(
      /git clone failed/
    );
    // Cleanup: the target should not exist after the failure.
    await expect(fsPromises.stat(dest)).rejects.toThrow();
  });

  it('invokes onProgress before and after cloning', async () => {
    setGitSpawner(mockSpawner(false));
    const messages: string[] = [];
    await cloneMCPPlugin('https://github.com/foo/bar.git', path.join(cacheDir, 'prog'), {
      onProgress: (m) => messages.push(m),
    });
    expect(messages.length).toBe(2);
    expect(messages[0]).toMatch(/Cloning/);
    expect(messages[1]).toMatch(/Cloned into/);
  });
});

describe('detectMCPEntry', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-mcp-detect-'));
  });

  afterEach(async () => {
    await fsPromises.rm(tmp, { recursive: true, force: true });
  });

  it('detects an entry from .alexi/mcp.json (command form)', async () => {
    await fsPromises.mkdir(path.join(tmp, '.alexi'), { recursive: true });
    await fsPromises.writeFile(
      path.join(tmp, '.alexi', 'mcp.json'),
      JSON.stringify({
        name: 'demo',
        description: 'Demo plugin',
        command: 'node',
        args: ['dist/server.js'],
        env: { FOO: 'bar' },
      }),
      'utf-8'
    );

    const entry = await detectMCPEntry(tmp);
    expect(entry.source).toBe('alexi-mcp');
    expect(entry.command).toBe('node');
    expect(entry.args).toEqual(['dist/server.js']);
    expect(entry.env).toEqual({ FOO: 'bar' });
    expect(entry.description).toBe('Demo plugin');
  });

  it('detects an entry from .alexi/mcp.json (entrypoint form)', async () => {
    await fsPromises.mkdir(path.join(tmp, '.alexi'), { recursive: true });
    await fsPromises.writeFile(
      path.join(tmp, '.alexi', 'mcp.json'),
      JSON.stringify({ entrypoint: 'index.js' }),
      'utf-8'
    );

    const entry = await detectMCPEntry(tmp);
    expect(entry.source).toBe('alexi-mcp');
    expect(entry.command).toBe(process.execPath);
    expect(entry.args[0]).toBe(path.join(tmp, 'index.js'));
  });

  it('detects an entry from package.json mcp field', async () => {
    await fsPromises.writeFile(
      path.join(tmp, 'package.json'),
      JSON.stringify({
        name: 'demo',
        description: 'Package plugin',
        mcp: { command: 'npx', args: ['-y', 'demo-server'] },
      }),
      'utf-8'
    );

    const entry = await detectMCPEntry(tmp);
    expect(entry.source).toBe('package-mcp');
    expect(entry.command).toBe('npx');
    expect(entry.args).toEqual(['-y', 'demo-server']);
    expect(entry.description).toBe('Package plugin');
  });

  it('detects an entry from package.json bin (string form)', async () => {
    await fsPromises.writeFile(
      path.join(tmp, 'package.json'),
      JSON.stringify({ name: 'demo', bin: './bin/serve.js' }),
      'utf-8'
    );

    const entry = await detectMCPEntry(tmp);
    expect(entry.source).toBe('package-bin');
    expect(entry.command).toBe(process.execPath);
    expect(entry.args[0]).toBe(path.join(tmp, './bin/serve.js'));
  });

  it('detects an entry from package.json bin (object form, matching name)', async () => {
    await fsPromises.writeFile(
      path.join(tmp, 'package.json'),
      JSON.stringify({
        name: 'demo',
        bin: { demo: './bin/demo.js', other: './bin/other.js' },
      }),
      'utf-8'
    );

    const entry = await detectMCPEntry(tmp);
    expect(entry.args[0]).toBe(path.join(tmp, './bin/demo.js'));
  });

  it('throws when no entry point can be detected', async () => {
    await expect(detectMCPEntry(tmp)).rejects.toThrow(/no .alexi\/mcp\.json or package\.json/);
  });

  it('throws when package.json exists but has no usable entry', async () => {
    await fsPromises.writeFile(
      path.join(tmp, 'package.json'),
      JSON.stringify({ name: 'demo' }),
      'utf-8'
    );
    await expect(detectMCPEntry(tmp)).rejects.toThrow(/could not find an MCP entry point/);
  });
});

describe('installGitMCPPlugin', () => {
  let installRoot: string;

  beforeEach(async () => {
    installRoot = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'alexi-mcp-install-'));
    addMcpServerMock.mockReset();
  });

  afterEach(async () => {
    resetGitSpawner();
    await fsPromises.rm(installRoot, { recursive: true, force: true });
  });

  function mockSpawnerWithManifest(manifest: unknown, targetSubpath = '.alexi/mcp.json'): void {
    setGitSpawner(async (args) => {
      if (args[0] === 'clone') {
        const target = args[args.length - 1];
        await fsPromises.mkdir(path.join(target, '.git'), { recursive: true });
        const manifestPath = path.join(target, targetSubpath);
        await fsPromises.mkdir(path.dirname(manifestPath), { recursive: true });
        await fsPromises.writeFile(manifestPath, JSON.stringify(manifest), 'utf-8');
        return { stdout: '', stderr: '', code: 0 };
      }
      return { stdout: '', stderr: 'unexpected', code: 1 };
    });
  }

  it('clones, detects entry, and registers the server (happy path)', async () => {
    mockSpawnerWithManifest({
      command: 'node',
      args: ['dist/server.js'],
      env: { FOO: 'bar' },
      description: 'Demo plugin',
    });

    const result = await installGitMCPPlugin('anthropics/demo-mcp', { installRoot });

    // Directory materialised inside installRoot.
    expect(path.dirname(result.pluginPath)).toBe(installRoot);
    const stat = await fsPromises.stat(result.pluginPath);
    expect(stat.isDirectory()).toBe(true);

    // Server config was persisted.
    expect(addMcpServerMock).toHaveBeenCalledTimes(1);
    const server = addMcpServerMock.mock.calls[0][0] as {
      name: string;
      transport: string;
      command: string;
      args: string[];
      env?: Record<string, string>;
      git?: { type: string; url: string };
      enabled: boolean;
      autoConnect?: boolean;
    };
    expect(server.name).toBe('demo-mcp');
    expect(server.transport).toBe('stdio');
    expect(server.command).toBe('node');
    expect(server.args).toEqual(['dist/server.js']);
    expect(server.env).toEqual({ FOO: 'bar' });
    expect(server.enabled).toBe(true);
    expect(server.autoConnect).toBe(true);
    expect(server.git?.type).toBe('git');
    expect(server.git?.url).toBe('https://github.com/anthropics/demo-mcp.git');
  });

  it('respects --name to override the derived slug', async () => {
    mockSpawnerWithManifest({ command: 'node', args: [] });

    const result = await installGitMCPPlugin('anthropics/demo-mcp', {
      installRoot,
      name: 'custom name!',
    });

    expect(result.server.name).toBe('custom-name');
    expect(path.basename(result.pluginPath)).toBe('custom-name');
  });

  it('rolls back the clone when entry detection fails', async () => {
    setGitSpawner(async (args) => {
      if (args[0] === 'clone') {
        const target = args[args.length - 1];
        await fsPromises.mkdir(path.join(target, '.git'), { recursive: true });
        // No manifest, no package.json — detectMCPEntry will throw.
        return { stdout: '', stderr: '', code: 0 };
      }
      return { stdout: '', stderr: '', code: 1 };
    });

    await expect(installGitMCPPlugin('foo/bar', { installRoot })).rejects.toThrow(
      /could not find an MCP entry point|no .alexi\/mcp\.json/
    );
    // The plugin directory must be cleaned up.
    await expect(fsPromises.stat(path.join(installRoot, 'bar'))).rejects.toThrow();
    expect(addMcpServerMock).not.toHaveBeenCalled();
  });

  it('rolls back the clone when addMcpServer refuses the new entry', async () => {
    mockSpawnerWithManifest({ command: 'node', args: [] });
    addMcpServerMock.mockImplementationOnce(() => {
      throw new Error('duplicate name');
    });

    await expect(installGitMCPPlugin('foo/bar', { installRoot })).rejects.toThrow(/duplicate name/);
    await expect(fsPromises.stat(path.join(installRoot, 'bar'))).rejects.toThrow();
  });

  it('surfaces a clone failure with a friendly error', async () => {
    setGitSpawner(async () => ({ stdout: '', stderr: 'auth denied', code: 128 }));
    await expect(installGitMCPPlugin('foo/bar', { installRoot })).rejects.toThrow(
      /git clone failed/
    );
    expect(addMcpServerMock).not.toHaveBeenCalled();
  });

  it('propagates --branch and --auto-update into the persisted git metadata', async () => {
    mockSpawnerWithManifest({ command: 'node', args: ['server.js'] });

    await installGitMCPPlugin('foo/bar', {
      installRoot,
      branch: 'develop',
      autoUpdate: true,
    });

    const server = addMcpServerMock.mock.calls[0][0] as {
      git?: { branch?: string; autoUpdate?: boolean };
    };
    expect(server.git?.branch).toBe('develop');
    expect(server.git?.autoUpdate).toBe(true);
  });
});
