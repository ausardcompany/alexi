/**
 * Git hosting provider detection.
 *
 * Extends the SaaS-only detection in `remoteDetection.ts` with a public
 * helper that returns `'unknown'` for unrecognised hosts (rather than
 * `null`) and exposes the domain segment of the remote URL. This is the
 * surface expected by callers that need to render PR/MR links for
 * self-hosted GitLab / Bitbucket instances, where the caller supplies the
 * provider hint out-of-band (env var, config) and passes the domain to
 * `formatPRLink` from `./pr-link.js`.
 *
 * Supported URL shapes:
 *   - HTTPS:   `https://<host>/<org>/<repo>(.git)?(/)?`
 *   - HTTP:    `http://<host>/<org>/<repo>(.git)?(/)?`
 *   - SSH scp: `git@<host>:<org>/<repo>(.git)?(/)?`
 *   - SSH URL: `ssh://git@<host>/<org>/<repo>(.git)?(/)?`
 */

export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'unknown';

export interface ParsedRemote {
  /** Detected provider or `'unknown'` for self-hosted / unrecognised hosts. */
  provider: GitProvider;
  /** Hostname portion of the remote URL (e.g. `github.com`, `git.company.com`). */
  domain: string;
  /** Organization / workspace / group segment. */
  org: string;
  /** Repository name (trailing `.git` stripped). */
  repo: string;
}

/**
 * SaaS host → provider mapping. Matched case-insensitively against the
 * detected hostname. Self-hosted instances are intentionally out of scope
 * for detection: callers pass a provider hint explicitly for those.
 */
const SAAS_HOSTS: ReadonlyArray<{ host: string; provider: Exclude<GitProvider, 'unknown'> }> = [
  { host: 'github.com', provider: 'github' },
  { host: 'gitlab.com', provider: 'gitlab' },
  { host: 'bitbucket.org', provider: 'bitbucket' },
];

/**
 * Extract `{ domain, org, repo }` from a git remote URL, if possible. Returns
 * `null` when the URL does not look like a supported git remote shape.
 *
 * The parser is dependency-free and tolerant of the four common formats
 * (`https://`, `http://`, scp-style `git@host:org/repo`, and `ssh://`).
 */
export function parseRemote(remoteUrl: string): ParsedRemote | null {
  const trimmed = remoteUrl.trim();
  if (!trimmed) {
    return null;
  }

  // scp-style SSH: `git@host:org/repo(.git)?`. This shape has no `//` after
  // the scheme, so we handle it before the URL-based parser.
  const scp = /^[\w.-]+@([\w.-]+):([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i.exec(trimmed);
  if (scp) {
    return normalise({ domain: scp[1], org: scp[2], repo: scp[3] });
  }

  // `ssh://`, `https://`, `http://` all share the URL shape:
  //   <scheme>://[user@]<host>/<org>/<repo>(.git)?
  const urlMatch =
    /^(?:ssh|https?):\/\/(?:[^@/\s]+@)?([^/\s]+)\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i.exec(
      trimmed
    );
  if (urlMatch) {
    return normalise({ domain: urlMatch[1], org: urlMatch[2], repo: urlMatch[3] });
  }

  return null;
}

/**
 * Detect the git hosting provider for a remote URL. Returns `'unknown'` for
 * self-hosted or unrecognised hosts (still valid input for `formatPRLink`
 * when the caller knows the provider out-of-band).
 */
export function detectGitProvider(remoteUrl: string): GitProvider {
  const parsed = parseRemote(remoteUrl);
  if (!parsed) {
    return 'unknown';
  }
  return parsed.provider;
}

function normalise(parts: { domain: string; org: string; repo: string }): ParsedRemote {
  const domain = parts.domain.toLowerCase();
  const provider = matchSaasHost(domain);
  return {
    provider,
    domain,
    org: parts.org,
    repo: parts.repo,
  };
}

function matchSaasHost(domain: string): GitProvider {
  const hit = SAAS_HOSTS.find((h) => domain === h.host);
  return hit ? hit.provider : 'unknown';
}
