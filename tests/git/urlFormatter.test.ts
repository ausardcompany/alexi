import { describe, it, expect } from 'vitest';
import { formatMRPRUrl, requestNoun } from '../../src/git/urlFormatter.js';

describe('formatMRPRUrl', () => {
  it('formats GitHub PR URL', () => {
    expect(formatMRPRUrl({ provider: 'github', org: 'foo', repo: 'bar', number: 42 })).toBe(
      'https://github.com/foo/bar/pull/42'
    );
  });

  it('formats GitLab MR URL', () => {
    expect(formatMRPRUrl({ provider: 'gitlab', org: 'acme', repo: 'widgets', number: 7 })).toBe(
      'https://gitlab.com/acme/widgets/-/merge_requests/7'
    );
  });

  it('formats Bitbucket PR URL', () => {
    expect(
      formatMRPRUrl({ provider: 'bitbucket', org: 'team', repo: 'service', number: 123 })
    ).toBe('https://bitbucket.org/team/service/pull-requests/123');
  });

  it('throws on non-integer number', () => {
    expect(() =>
      formatMRPRUrl({ provider: 'github', org: 'foo', repo: 'bar', number: 1.5 })
    ).toThrow(/invalid MR\/PR number/);
  });

  it('throws on non-positive number', () => {
    expect(() => formatMRPRUrl({ provider: 'github', org: 'foo', repo: 'bar', number: 0 })).toThrow(
      /invalid MR\/PR number/
    );
  });

  it('throws when org or repo is missing', () => {
    expect(() => formatMRPRUrl({ provider: 'github', org: '', repo: 'bar', number: 1 })).toThrow(
      /missing org or repo/
    );
    expect(() => formatMRPRUrl({ provider: 'github', org: 'foo', repo: '', number: 1 })).toThrow(
      /missing org or repo/
    );
  });
});

describe('requestNoun', () => {
  it('returns MR for GitLab', () => {
    expect(requestNoun('gitlab')).toBe('MR');
  });

  it('returns PR for GitHub', () => {
    expect(requestNoun('github')).toBe('PR');
  });

  it('returns PR for Bitbucket', () => {
    expect(requestNoun('bitbucket')).toBe('PR');
  });
});
