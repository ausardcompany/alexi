/**
 * Sandbox `gh` (GitHub CLI) classification
 *
 * Ports upstream kilocode commits 13e05d066, ecedeea49, 700345267,
 * 15b6b3287. Prior to these fixes, every `gh` invocation triggered
 * an escalation prompt because the sandbox layer treated the entire
 * GitHub CLI as untrusted. Read-only `gh` subcommands (`pr list`,
 * `issue view`, ...) are safe and should pass through without a
 * prompt; only writes and the auth-sensitive `gh auth *` subgroup
 * still gate on the permission system.
 *
 * The classifier operates on the already-tokenised argv (i.e. the
 * caller has split `command` into shell tokens starting with `gh`).
 * A shell tool that receives a raw command string should tokenise
 * before delegating here so the caller retains control over quoting
 * rules.
 */

/**
 * `gh` subcommands (single- and two-word forms) that ONLY read data
 * — no write side-effects on the local repo, no writes to GitHub.
 * Intentionally excludes anything that creates, updates, or deletes
 * remote state, and anything that spawns an editor / opens a browser
 * (those are `gh browse`, `gh pr create --web`, etc. — `browse` is
 * still safe because it only opens a URL, but `gh pr create` is not
 * in this set).
 */
const GH_READONLY_SUBCOMMANDS: ReadonlySet<string> = new Set([
  'browse',
  'config get',
  'gist list',
  'gist view',
  'issue list',
  'issue view',
  'issue status',
  'label list',
  'pr list',
  'pr view',
  'pr status',
  'pr checks',
  'pr diff',
  'release list',
  'release view',
  'repo list',
  'repo view',
  'run list',
  'run view',
  'run watch',
  'search',
  'workflow list',
  'workflow view',
  // Single-token read-only subcommands
  'help',
  'version',
  '--help',
  '--version',
]);

/**
 * `gh auth *` subgroup — read-only in shape (`auth status`,
 * `auth token`) but auth material is sensitive and stays behind the
 * permission gate per upstream ecedeea49. Callers must still surface
 * an escalation prompt for these; they are NOT treated as writes.
 */
const GH_AUTH_SUBCOMMANDS: ReadonlySet<string> = new Set([
  'auth status',
  'auth token',
  'auth setup-git',
]);

export type GhClassification = 'readonly' | 'auth-gated' | 'write';

/**
 * Classify a tokenised `gh` argv. Returns:
 *   - `readonly`: safe to run without escalation
 *   - `auth-gated`: read-only-shaped but touches auth material, still
 *      needs the permission gate
 *   - `write`: mutating or unknown, escalate
 *
 * The `args` parameter is the argv AFTER `gh` itself (i.e. `gh pr list`
 * arrives here as `['pr', 'list']`). This keeps the classifier easy to
 * unit-test.
 */
export function classifyGh(args: readonly string[]): GhClassification {
  if (args.length === 0) {
    // Bare `gh` prints help; treat as readonly.
    return 'readonly';
  }

  // Filter out flags for the initial subcommand-shape check — flags can
  // never turn a read-only subcommand into a write, but they can trail
  // it (`gh pr list --state closed --limit 20`).
  const nonFlag: string[] = [];
  for (const token of args) {
    if (!token.startsWith('-')) {
      nonFlag.push(token);
    }
    if (nonFlag.length >= 2) {
      break;
    }
  }

  if (nonFlag.length === 0) {
    // Only flags — e.g. `gh --version`. Check against single-token map.
    const first = args[0]?.toLowerCase();
    if (first && GH_READONLY_SUBCOMMANDS.has(first)) {
      return 'readonly';
    }
    return 'write';
  }

  const twoWord = nonFlag.slice(0, 2).join(' ').toLowerCase();
  const oneWord = nonFlag[0]?.toLowerCase() ?? '';

  if (GH_AUTH_SUBCOMMANDS.has(twoWord)) {
    return 'auth-gated';
  }
  // Bare `gh auth` is auth-adjacent, keep it gated.
  if (oneWord === 'auth') {
    return 'auth-gated';
  }

  if (GH_READONLY_SUBCOMMANDS.has(twoWord)) {
    return 'readonly';
  }
  if (GH_READONLY_SUBCOMMANDS.has(oneWord)) {
    return 'readonly';
  }
  return 'write';
}

/**
 * Convenience for the shell tool: given the command tokens (starting
 * with `gh`), return true when the invocation is safe to run without
 * a permission prompt.
 */
export function isGhReadOnly(tokens: readonly string[]): boolean {
  if (tokens[0] !== 'gh') {
    return false;
  }
  return classifyGh(tokens.slice(1)) === 'readonly';
}
