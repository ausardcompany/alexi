/**
 * Merge/pull request URL formatting per VCS provider.
 *
 * Kept dependency-free so the helper can be reused by callers other than
 * `code-review` (agent PR flows, hooks, MCP tools) without pulling in
 * additional imports.
 */

import type { VCSProvider } from './remoteDetection.js';

export interface FormatMRPRUrlArgs {
  provider: VCSProvider;
  /** Organization / workspace / group segment. */
  org: string;
  /** Repository name (no `.git` suffix). */
  repo: string;
  /** Merge/pull request number (positive integer). */
  number: number;
}

/**
 * Format a merge/pull request URL for the given provider.
 *
 * - GitHub    → `https://github.com/{org}/{repo}/pull/{number}`
 * - GitLab    → `https://gitlab.com/{org}/{repo}/-/merge_requests/{number}`
 * - Bitbucket → `https://bitbucket.org/{workspace}/{repo}/pull-requests/{number}`
 *
 * Throws for unknown providers or non-positive `number` values so that
 * callers surface configuration mistakes instead of shipping a broken URL.
 */
export function formatMRPRUrl(args: FormatMRPRUrlArgs): string {
  const { provider, org, repo, number } = args;
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`formatMRPRUrl: invalid MR/PR number ${number}`);
  }
  if (!org || !repo) {
    throw new Error(`formatMRPRUrl: missing org or repo (org=${org}, repo=${repo})`);
  }

  switch (provider) {
    case 'github':
      return `https://github.com/${org}/${repo}/pull/${number}`;
    case 'gitlab':
      return `https://gitlab.com/${org}/${repo}/-/merge_requests/${number}`;
    case 'bitbucket':
      return `https://bitbucket.org/${org}/${repo}/pull-requests/${number}`;
    default: {
      // Exhaustiveness guard — surfaces missing provider handling at type
      // check time when a new provider is added to `VCSProvider`.
      const _exhaustive: never = provider;
      throw new Error(`formatMRPRUrl: unsupported provider ${String(_exhaustive)}`);
    }
  }
}

/**
 * Human-readable noun for the request kind on the given provider. GitLab
 * uses "merge request" (`MR`); GitHub and Bitbucket both use "pull
 * request" (`PR`). Useful for user-facing messages so the terminology
 * matches the destination host.
 */
export function requestNoun(provider: VCSProvider): 'MR' | 'PR' {
  return provider === 'gitlab' ? 'MR' : 'PR';
}
