import { describe, it, expect } from 'vitest';
import { detectGitProvider, parseRemote } from '../../src/git/provider.js';
import { formatPRLink } from '../../src/git/pr-link.js';

describe('detectGitProvider', () => {
  it('recognizes GitHub SSH remote', () => {
    expect(detectGitProvider('git@github.com:org/repo.git')).toBe('github');
  });

  it('recognizes GitHub HTTPS remote', () => {
    expect(detectGitProvider('https://github.com/org/repo.git')).toBe('github');
  });

  it('recognizes GitLab HTTPS remote', () => {
    expect(detectGitProvider('https://gitlab.com/org/repo.git')).toBe('gitlab');
  });

  it('recognizes GitLab SSH remote', () => {
    expect(detectGitProvider('git@gitlab.com:org/repo.git')).toBe('gitlab');
  });

  it('recognizes Bitbucket SSH remote', () => {
    expect(detectGitProvider('git@bitbucket.org:org/repo.git')).toBe('bitbucket');
  });

  it('recognizes Bitbucket HTTPS remote', () => {
    expect(detectGitProvider('https://bitbucket.org/org/repo.git')).toBe('bitbucket');
  });

  it('recognizes ssh:// URL scheme', () => {
    expect(detectGitProvider('ssh://git@github.com/org/repo.git')).toBe('github');
  });

  it('returns unknown for self-hosted domains', () => {
    // Self-hosted GitLab: caller must pass the provider hint explicitly to
    // formatPRLink; detection alone cannot tell it apart from any other
    // random host.
    expect(detectGitProvider('https://git.company.com/org/repo.git')).toBe('unknown');
  });

  it('returns unknown for empty input', () => {
    expect(detectGitProvider('')).toBe('unknown');
  });

  it('returns unknown for malformed URLs', () => {
    expect(detectGitProvider('not-a-url')).toBe('unknown');
  });
});

describe('parseRemote', () => {
  it('extracts domain/org/repo from HTTPS URL', () => {
    expect(parseRemote('https://github.com/org/repo.git')).toEqual({
      provider: 'github',
      domain: 'github.com',
      org: 'org',
      repo: 'repo',
    });
  });

  it('extracts domain/org/repo from SSH scp-style URL', () => {
    expect(parseRemote('git@bitbucket.org:team/service.git')).toEqual({
      provider: 'bitbucket',
      domain: 'bitbucket.org',
      org: 'team',
      repo: 'service',
    });
  });

  it('preserves self-hosted domain but marks provider unknown', () => {
    expect(parseRemote('https://git.company.com/eng/backend.git')).toEqual({
      provider: 'unknown',
      domain: 'git.company.com',
      org: 'eng',
      repo: 'backend',
    });
  });

  it('strips trailing slash and .git suffix', () => {
    expect(parseRemote('https://github.com/org/repo/')).toEqual({
      provider: 'github',
      domain: 'github.com',
      org: 'org',
      repo: 'repo',
    });
  });

  it('returns null on malformed input', () => {
    expect(parseRemote('')).toBeNull();
    expect(parseRemote('nonsense')).toBeNull();
  });
});

describe('formatPRLink', () => {
  it('generates GitHub pull request URL', () => {
    expect(formatPRLink('github', 'org', 'repo', '1234', 'github.com')).toBe(
      'https://github.com/org/repo/pull/1234'
    );
  });

  it('generates GitLab merge request URL', () => {
    expect(formatPRLink('gitlab', 'org', 'repo', '1234', 'gitlab.com')).toBe(
      'https://gitlab.com/org/repo/-/merge_requests/1234'
    );
  });

  it('generates Bitbucket pull request URL', () => {
    expect(formatPRLink('bitbucket', 'org', 'repo', '1234', 'bitbucket.org')).toBe(
      'https://bitbucket.org/org/repo/pull-requests/1234'
    );
  });

  it('handles self-hosted GitLab domains', () => {
    expect(formatPRLink('gitlab', 'org', 'repo', '1234', 'git.company.com')).toBe(
      'https://git.company.com/org/repo/-/merge_requests/1234'
    );
  });

  it('handles self-hosted Bitbucket domains', () => {
    expect(formatPRLink('bitbucket', 'org', 'repo', '42', 'bitbucket.internal.corp')).toBe(
      'https://bitbucket.internal.corp/org/repo/pull-requests/42'
    );
  });

  it('strips leading # from PR number', () => {
    expect(formatPRLink('github', 'org', 'repo', '#99', 'github.com')).toBe(
      'https://github.com/org/repo/pull/99'
    );
  });

  it('strips leading ! from MR number (GitLab convention)', () => {
    expect(formatPRLink('gitlab', 'org', 'repo', '!17', 'gitlab.com')).toBe(
      'https://gitlab.com/org/repo/-/merge_requests/17'
    );
  });

  it('falls back to plain-text for unknown provider', () => {
    expect(formatPRLink('unknown', 'org', 'repo', '1234', 'somewhere.example')).toBe('(1234)');
  });

  it('falls back to plain-text when domain is empty', () => {
    expect(formatPRLink('github', 'org', 'repo', '1234', '')).toBe('(1234)');
  });

  it('falls back to plain-text when number is non-numeric', () => {
    expect(formatPRLink('github', 'org', 'repo', 'abc', 'github.com')).toBe('(abc)');
  });
});
