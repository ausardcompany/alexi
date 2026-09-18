/**
 * VCS remote detection.
 *
 * Parses `git remote -v` output (or a provided string) and extracts the
 * hosting provider along with the org/workspace and repository names. Used
 * by the code-review command to format merge/pull request URLs correctly
 * for GitHub, GitLab, and Bitbucket remotes.
 *
 * Supported URL formats (per provider):
 *   - HTTPS: `https://github.com/{org}/{repo}(.git)?`
 *   - SSH:   `git@github.com:{org}/{repo}(.git)?`
 *   - SSH:   `ssh://git@github.com/{org}/{repo}(.git)?`
 *
 * Returns `null` when no supported remote is present or when parsing fails.
 */

import { execFile } from 'child_process';

export type VCSProvider = 'github' | 'gitlab' | 'bitbucket';

export interface VCSRemote {
  provider: VCSProvider;
  /** Organization / workspace / group segment of the remote URL. */
  org: string;
  /** Repository name (with a trailing `.git` stripped). */
  repo: string;
}

/**
 * Host substring → provider mapping. Matched case-insensitively against
 * the URL. Custom self-hosted GitLab/Bitbucket instances are intentionally
 * out of scope; only the well-known SaaS hosts are recognised.
 */
const HOST_MAP: ReadonlyArray<{ host: string; provider: VCSProvider }> = [
  { host: 'github.com', provider: 'github' },
  { host: 'gitlab.com', provider: 'gitlab' },
  { host: 'bitbucket.org', provider: 'bitbucket' },
];

/**
 * Extract `{ provider, org, repo }` from a single remote URL. Returns
 * `null` when the URL does not point at a supported host or cannot be
 * parsed. Exported for unit tests.
 */
export function parseRemoteUrl(url: string): VCSRemote | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const match = HOST_MAP.find((h) => trimmed.toLowerCase().includes(h.host));
  if (!match) {
    return null;
  }

  // Extract the `org/repo` path segment. We try each shape in order.
  //   1. scp-like ssh:  git@host:org/repo(.git)?
  //   2. ssh://:         ssh://git@host/org/repo(.git)?
  //   3. https(s)://:    https://host/org/repo(.git)?
  const hostEscaped = match.host.replace(/\./g, '\\.');
  const patterns: RegExp[] = [
    new RegExp(`${hostEscaped}[:/]([^/\\s]+)/([^/\\s]+?)(?:\\.git)?/?$`, 'i'),
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m && m[1] && m[2]) {
      return { provider: match.provider, org: m[1], repo: m[2] };
    }
  }
  return null;
}

/**
 * Parse the raw stdout of `git remote -v`. Prefers the `origin` remote
 * when present; otherwise returns the first supported remote found.
 * Exported for unit tests so callers can exercise the parser without a
 * real git invocation.
 */
export function parseRemoteVOutput(stdout: string): VCSRemote | null {
  const lines = stdout.split('\n');
  const supported: Array<{ name: string; remote: VCSRemote }> = [];

  for (const line of lines) {
    // Line shape: `<name>\t<url> (fetch|push)`
    const tabIdx = line.indexOf('\t');
    if (tabIdx < 0) {
      continue;
    }
    const name = line.slice(0, tabIdx).trim();
    const rest = line.slice(tabIdx + 1).trim();
    const spaceIdx = rest.indexOf(' ');
    const url = spaceIdx < 0 ? rest : rest.slice(0, spaceIdx);
    const parsed = parseRemoteUrl(url);
    if (parsed) {
      supported.push({ name, remote: parsed });
    }
  }

  if (supported.length === 0) {
    return null;
  }
  const origin = supported.find((r) => r.name === 'origin');
  return (origin ?? supported[0]).remote;
}

/** Promise wrapper around `execFile` — never rejects on non-zero exit. */
function execFileAsync(
  file: string,
  args: string[],
  options: { cwd?: string; maxBuffer?: number }
): Promise<{ stdout: string; code: number }> {
  return new Promise((resolve) => {
    execFile(file, args, options, (err, stdout: string | Buffer) => {
      const out = typeof stdout === 'string' ? stdout : stdout.toString('utf-8');
      if (err) {
        const e = err as NodeJS.ErrnoException & { code?: string | number };
        const exitCode = typeof e.code === 'number' ? e.code : 1;
        resolve({ stdout: out, code: exitCode });
        return;
      }
      resolve({ stdout: out, code: 0 });
    });
  });
}

/**
 * Detect the VCS provider for the repository rooted at `workdir` by
 * shelling out to `git remote -v`. Returns `null` when no supported
 * remote is configured, when `git` is unavailable, or when the command
 * fails for any reason. Never throws — code-review falls back to its
 * existing GitHub-only path in that case.
 */
export async function detectVCSProvider(workdir: string): Promise<VCSRemote | null> {
  try {
    const { stdout, code } = await execFileAsync('git', ['remote', '-v'], {
      cwd: workdir,
      maxBuffer: 1024 * 1024,
    });
    if (code !== 0) {
      return null;
    }
    return parseRemoteVOutput(stdout);
  } catch {
    return null;
  }
}
