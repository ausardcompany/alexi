import { describe, it, expect } from 'vitest';
import { parseRemoteUrl, parseRemoteVOutput } from '../../src/git/remoteDetection.js';

describe('parseRemoteUrl', () => {
  it('detects GitHub HTTPS remote', () => {
    expect(parseRemoteUrl('https://github.com/foo/bar.git')).toEqual({
      provider: 'github',
      org: 'foo',
      repo: 'bar',
    });
  });

  it('detects GitHub SSH (scp-style) remote', () => {
    expect(parseRemoteUrl('git@github.com:foo/bar.git')).toEqual({
      provider: 'github',
      org: 'foo',
      repo: 'bar',
    });
  });

  it('detects GitHub ssh:// remote', () => {
    expect(parseRemoteUrl('ssh://git@github.com/foo/bar.git')).toEqual({
      provider: 'github',
      org: 'foo',
      repo: 'bar',
    });
  });

  it('detects GitLab HTTPS remote', () => {
    expect(parseRemoteUrl('https://gitlab.com/acme/widgets')).toEqual({
      provider: 'gitlab',
      org: 'acme',
      repo: 'widgets',
    });
  });

  it('detects GitLab SSH remote', () => {
    expect(parseRemoteUrl('git@gitlab.com:acme/widgets.git')).toEqual({
      provider: 'gitlab',
      org: 'acme',
      repo: 'widgets',
    });
  });

  it('detects Bitbucket HTTPS remote', () => {
    expect(parseRemoteUrl('https://bitbucket.org/team/service.git')).toEqual({
      provider: 'bitbucket',
      org: 'team',
      repo: 'service',
    });
  });

  it('detects Bitbucket SSH remote', () => {
    expect(parseRemoteUrl('git@bitbucket.org:team/service.git')).toEqual({
      provider: 'bitbucket',
      org: 'team',
      repo: 'service',
    });
  });

  it('strips trailing slash from URL path', () => {
    expect(parseRemoteUrl('https://github.com/foo/bar/')).toEqual({
      provider: 'github',
      org: 'foo',
      repo: 'bar',
    });
  });

  it('returns null for unsupported host', () => {
    expect(parseRemoteUrl('https://example.com/foo/bar.git')).toBeNull();
  });

  it('returns null for empty input', () => {
    expect(parseRemoteUrl('')).toBeNull();
  });

  it('returns null for malformed remote missing repo segment', () => {
    expect(parseRemoteUrl('https://github.com/foo')).toBeNull();
  });
});

describe('parseRemoteVOutput', () => {
  it('prefers the origin remote', () => {
    const stdout = [
      'upstream\thttps://github.com/upstream-org/repo.git (fetch)',
      'upstream\thttps://github.com/upstream-org/repo.git (push)',
      'origin\tgit@gitlab.com:my-org/my-repo.git (fetch)',
      'origin\tgit@gitlab.com:my-org/my-repo.git (push)',
    ].join('\n');
    expect(parseRemoteVOutput(stdout)).toEqual({
      provider: 'gitlab',
      org: 'my-org',
      repo: 'my-repo',
    });
  });

  it('falls back to the first supported remote when origin is unsupported', () => {
    const stdout = [
      'origin\thttps://example.com/foo/bar.git (fetch)',
      'gh\thttps://github.com/foo/bar.git (fetch)',
    ].join('\n');
    expect(parseRemoteVOutput(stdout)).toEqual({
      provider: 'github',
      org: 'foo',
      repo: 'bar',
    });
  });

  it('returns null when no remotes are supported', () => {
    const stdout = 'origin\thttps://example.com/foo/bar.git (fetch)\n';
    expect(parseRemoteVOutput(stdout)).toBeNull();
  });

  it('returns null for empty output', () => {
    expect(parseRemoteVOutput('')).toBeNull();
  });
});
