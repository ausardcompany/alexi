/**
 * Provider-aware PR / MR link formatting.
 *
 * Unlike `urlFormatter.formatMRPRUrl`, this helper takes the domain as an
 * explicit parameter so it also handles self-hosted GitLab / Bitbucket
 * instances (e.g. `git.company.com`). Pass the SaaS domain
 * (`github.com`, `gitlab.com`, `bitbucket.org`) for the default case.
 */

import type { GitProvider } from './provider.js';

/**
 * Build a PR / MR URL for the given provider and domain. Falls back to a
 * plain `(<prNumber>)` string when the provider is `'unknown'` — matching
 * the pre-existing GitHub-only rendering behaviour.
 *
 * @param provider  Detected provider (or `'unknown'` for self-hosted fallback).
 * @param org       Organization / workspace / group segment.
 * @param repo      Repository name (no `.git` suffix).
 * @param prNumber  PR / MR number as a string (may include a `#` or `!`
 *                  prefix, which is stripped).
 * @param domain    Hostname of the git server (e.g. `github.com`,
 *                  `git.company.com`). Required — no hard-coded default so
 *                  callers cannot silently drop the self-hosted case.
 */
export function formatPRLink(
  provider: GitProvider,
  org: string,
  repo: string,
  prNumber: string,
  domain: string
): string {
  const cleanNumber = prNumber.replace(/^[#!]/, '').trim();

  // Fall back to plain-text rendering when we do not know how to build the
  // path segment. `formatPRLink` should never throw — callers use it inside
  // commit-message rendering where a graceful degradation is preferable to
  // dropping the whole message.
  if (
    provider === 'unknown' ||
    !cleanNumber ||
    !org ||
    !repo ||
    !domain ||
    !/^\d+$/.test(cleanNumber)
  ) {
    return `(${cleanNumber || prNumber})`;
  }

  switch (provider) {
    case 'github':
      return `https://${domain}/${org}/${repo}/pull/${cleanNumber}`;
    case 'gitlab':
      return `https://${domain}/${org}/${repo}/-/merge_requests/${cleanNumber}`;
    case 'bitbucket':
      return `https://${domain}/${org}/${repo}/pull-requests/${cleanNumber}`;
    default: {
      // Exhaustiveness guard — surfaces missing provider handling at
      // typecheck time when a new provider is added to `GitProvider`.
      const _exhaustive: never = provider;
      return `(${_exhaustive as unknown as string})`;
    }
  }
}
