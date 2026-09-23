/**
 * MCP Git Plugin Resolver
 *
 * Resolves MCP server plugins hosted in git repositories with security
 * hardening. Supports three URL shapes:
 *
 * - Public HTTPS: `https://github.com/<org>/<repo>[.git][#<ref>[@<subpath>]]`
 * - Private SSH:  `git@<host>:<org>/<repo>[.git][#<ref>[@<subpath>]]`
 * - Local file:   `file://[/]<path>[#<ref>[@<subpath>]]`
 *
 * The resolver:
 *
 * - parses and validates URLs, rejecting option-injection refs
 *   (`--upload-pack`, values starting with `-`) that would let a caller
 *   smuggle flags into the underlying `git` invocation;
 * - clones repositories into a per-identity cache directory under
 *   `~/.alexi/plugin-cache/<identity>/` with atomic swap semantics
 *   (clone to a sibling temp dir, `rename()` into place) so a partial
 *   clone can never be observed as complete;
 * - resolves symlinks under the requested subpath and refuses paths
 *   that escape the cloned repo root, preventing a malicious repo from
 *   directing plugin resolution at `/etc/passwd`;
 * - records the resolved commit SHA in a per-identity metadata file
 *   and revalidates mutable refs (branches / tags) after a caller-
 *   supplied TTL by running `git ls-remote` against the recorded
 *   commit;
 * - normalizes `file://` URLs so a drive-less Windows path
 *   (`file:///C:/Users/x`) collapses to `file://C:/Users/x` before
 *   filesystem operations.
 *
 * This module is intentionally standalone — it only depends on Node
 * core APIs and `child_process` — so it can be unit-tested without a
 * live git binary or network access.
 */

import { execFile } from 'child_process';
import { createHash } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * URL protocol reported by {@link parseGitUrl}. Kept as a string union
 * (not a plain string) so callers can `switch` exhaustively.
 */
export type GitUrlProtocol = 'https' | 'ssh' | 'file';

/** Structured view of a git plugin URL. */
export interface ParsedGitUrl {
  protocol: GitUrlProtocol;
  /** Host portion — `github.com` for HTTPS/SSH, empty for `file://`. */
  host: string;
  /**
   * Organization / owner. For `file://` URLs this holds the parent
   * directory of the repo path.
   */
  org: string;
  /**
   * Repository name (without a trailing `.git`). For `file://` URLs
   * this is the basename of the repo path.
   */
  repo: string;
  /** Optional ref (branch, tag, or commit-ish). */
  ref?: string;
  /** Optional subpath inside the repo, without a leading slash. */
  subpath?: string;
  /**
   * Fully qualified, normalized URL used for cloning. Callers should
   * pass this — not the caller-supplied raw string — to any external
   * git process so option-injection surface stays minimal.
   */
  normalizedUrl: string;
}

/**
 * Root of the plugin cache directory. Exported so callers (CLI, mcp
 * install command) can share a single directory without duplicating
 * the path literal.
 */
export const PLUGIN_CACHE_ROOT = path.join(os.homedir(), '.alexi', 'plugin-cache');

/** Default revalidation TTL for mutable refs (24 hours, in ms). */
export const DEFAULT_REVALIDATE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Metadata written to `<PLUGIN_CACHE_ROOT>/<identity>/.metadata.json`
 * after a successful clone. Callers use this to decide whether a
 * mutable ref (branch / tag) needs to be revalidated.
 */
export interface PluginCacheMetadata {
  identity: string;
  url: string;
  ref?: string;
  commit: string;
  lastCheckedAt: number;
}

/**
 * Normalize a `file://` URL so callers can pass a Windows drive-less
 * path (`file:///C:/Users/...`) without ending up with an extra `/`
 * in front of the drive letter. Non-`file://` URLs are returned
 * unchanged.
 */
export function normalizeFileUrl(url: string): string {
  if (!url.startsWith('file://')) {
    return url;
  }
  // Collapse `file:///C:/...` (three slashes + drive letter) into
  // `file://C:/...`. This matches Kilocode's normalization contract
  // and preserves POSIX `file:///abs/path` untouched (the character
  // after `///` is not `<letter>:`).
  const driveLessMatch = url.match(/^file:\/\/\/([A-Za-z]:\/.*)$/);
  if (driveLessMatch) {
    return `file://${driveLessMatch[1]}`;
  }
  return url;
}

/**
 * Reject refs that could be interpreted as command-line flags by the
 * underlying `git` binary (`--upload-pack=...`, `-o`, `--exec`) and a
 * few other classes of malformed input that git itself would refuse:
 *
 * - empty / whitespace-only
 * - leading `-` (option injection)
 * - leading `.` or trailing `.lock` (git's own ref rules)
 * - contains `..`, `@{`, control chars, whitespace, or `~`, `^`, `:`,
 *   `?`, `*`, `[`, `\` (subset of git's `check_ref_format` rules that
 *   matter for the surface we care about)
 *
 * Throws a plain `Error` — callers wrap it with URL context if
 * needed. Returning `void` mirrors Kilocode's `validateRef`.
 */
export function validateRef(ref: string): void {
  if (typeof ref !== 'string' || ref.length === 0) {
    throw new Error('git ref must be a non-empty string');
  }
  if (ref.startsWith('-')) {
    throw new Error(`git ref "${ref}" starts with "-" and would be parsed as an option`);
  }
  if (ref.startsWith('.') || ref.endsWith('.lock')) {
    throw new Error(`git ref "${ref}" violates git ref-format rules`);
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f\s]/.test(ref)) {
    throw new Error(`git ref "${ref}" contains whitespace or control characters`);
  }
  if (ref.includes('..') || ref.includes('@{') || /[~^:?*[\\]/.test(ref)) {
    throw new Error(`git ref "${ref}" contains characters disallowed by git`);
  }
}

/**
 * Split the `#ref@subpath` suffix off a URL. Returns the URL prefix
 * (without the `#...` fragment) plus optional ref and subpath.
 */
function extractFragment(url: string): { base: string; ref?: string; subpath?: string } {
  const hashIdx = url.indexOf('#');
  if (hashIdx < 0) {
    return { base: url };
  }
  const base = url.slice(0, hashIdx);
  const rest = url.slice(hashIdx + 1);
  const atIdx = rest.indexOf('@');
  if (atIdx < 0) {
    return { base, ref: rest.length > 0 ? rest : undefined };
  }
  const ref = rest.slice(0, atIdx);
  const subpath = rest.slice(atIdx + 1);
  return {
    base,
    ref: ref.length > 0 ? ref : undefined,
    subpath: subpath.length > 0 ? subpath : undefined,
  };
}

/** Strip a trailing `.git` suffix (case-insensitive) if present. */
function stripDotGit(repo: string): string {
  return repo.endsWith('.git') ? repo.slice(0, -'.git'.length) : repo;
}

/**
 * Parse a git plugin URL into structured components.
 *
 * Throws when the URL cannot be recognized as one of the three
 * supported shapes. The optional ref (if present) is validated via
 * {@link validateRef}, so callers can rely on `parseGitUrl` for both
 * shape and safety checks. Subpaths, however, are only sanity-checked
 * (no `..` traversal) here — real containment enforcement happens
 * post-clone in {@link checkContainment}.
 */
export function parseGitUrl(url: string): ParsedGitUrl {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('git URL must be a non-empty string');
  }

  const normalized = normalizeFileUrl(url);
  const { base, ref, subpath } = extractFragment(normalized);

  if (ref !== undefined) {
    validateRef(ref);
  }
  if (subpath !== undefined) {
    if (subpath.startsWith('/') || subpath.includes('..') || subpath.startsWith('~')) {
      throw new Error(`subpath "${subpath}" must be relative and must not traverse parents`);
    }
  }

  // file:// — POSIX or normalized Windows drive path
  if (base.startsWith('file://')) {
    const fsPath = base.slice('file://'.length);
    if (fsPath.length === 0) {
      throw new Error(`file:// URL "${url}" is missing a path`);
    }
    // `file://C:/x/y` (Windows, normalized) OR `file:///abs/path` (POSIX)
    const parent = path.posix.dirname(fsPath.replace(/\\/g, '/'));
    const repo = stripDotGit(path.posix.basename(fsPath.replace(/\\/g, '/')));
    return {
      protocol: 'file',
      host: '',
      org: parent,
      repo,
      ref,
      subpath,
      normalizedUrl: base,
    };
  }

  // Public HTTPS — `https://<host>/<org>/<repo>[.git]`
  if (base.startsWith('https://') || base.startsWith('http://')) {
    const rest = base.replace(/^https?:\/\//, '');
    const slashIdx = rest.indexOf('/');
    if (slashIdx < 0) {
      throw new Error(`https URL "${url}" missing repository path`);
    }
    const host = rest.slice(0, slashIdx);
    const pathPart = rest.slice(slashIdx + 1);
    const segments = pathPart.split('/').filter((s) => s.length > 0);
    if (segments.length < 2) {
      throw new Error(`https URL "${url}" must include <org>/<repo>`);
    }
    const org = segments[0];
    const repo = stripDotGit(segments[1]);
    return {
      protocol: 'https',
      host,
      org,
      repo,
      ref,
      subpath,
      normalizedUrl: base,
    };
  }

  // Private SSH — `git@<host>:<org>/<repo>[.git]`
  const sshMatch = base.match(/^([A-Za-z0-9_.-]+)@([A-Za-z0-9.-]+):([^\s]+)$/);
  if (sshMatch) {
    const host = sshMatch[2];
    const pathPart = sshMatch[3];
    const segments = pathPart.split('/').filter((s) => s.length > 0);
    if (segments.length < 2) {
      throw new Error(`ssh URL "${url}" must include <org>/<repo>`);
    }
    const org = segments[0];
    const repo = stripDotGit(segments[1]);
    return {
      protocol: 'ssh',
      host,
      org,
      repo,
      ref,
      subpath,
      normalizedUrl: base,
    };
  }

  throw new Error(`unrecognized git URL "${url}"`);
}

/**
 * Compute a stable, filesystem-safe plugin identity for a given
 * (url, ref, subpath) triple. The identity is used both as the cache
 * directory name under {@link PLUGIN_CACHE_ROOT} and as the key in
 * `mcp-servers.json` so npm and file identities cannot collide with
 * git ones.
 *
 * The format is `git-<protocol>-<sha256[..16]>` where the hash covers
 * the normalized URL, ref, and subpath. A short SHA prefix keeps the
 * directory name readable on disk while making the odds of collision
 * across identity sources vanishingly small.
 */
export function getPluginIdentity(url: string, ref?: string, subpath?: string): string {
  const parsed = parseGitUrl(url);
  const parts = [parsed.normalizedUrl, ref ?? parsed.ref ?? '', subpath ?? parsed.subpath ?? ''];
  const hash = createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 16);
  return `git-${parsed.protocol}-${hash}`;
}

/**
 * Promise wrapper around `child_process.execFile` used by all git
 * invocations in this module. Kept private so tests can mock
 * `child_process.execFile` once and cover every code path.
 */
function execFileAsync(
  file: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; maxBuffer?: number } = {}
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (err, stdout: string | Buffer, stderr: string | Buffer) => {
      const out = typeof stdout === 'string' ? stdout : stdout.toString('utf-8');
      const errOut = typeof stderr === 'string' ? stderr : stderr.toString('utf-8');
      if (err) {
        const message = errOut.length > 0 ? errOut.trim() : err.message;
        reject(new Error(`git ${args.join(' ')} failed: ${message}`));
        return;
      }
      resolve({ stdout: out, stderr: errOut });
    });
  });
}

/**
 * Build the environment for a `git clone` call. When an SSH key path
 * is supplied, we set `GIT_SSH_COMMAND` so git uses that key without
 * touching the user's global ssh config. `accept-new` mirrors the
 * behaviour used by Kilocode (avoid prompting on first contact while
 * still refusing changed host keys).
 */
function buildGitEnv(sshKey?: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  if (sshKey) {
    env.GIT_SSH_COMMAND = `ssh -i ${sshKey} -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes`;
  }
  return env;
}

/**
 * Clone a git repository into the plugin cache with atomic-swap
 * semantics.
 *
 * The clone happens into a sibling temp directory
 * (`<cacheDir>/<identity>.tmp-<pid>-<random>`); on success the target
 * directory is removed (if it exists) and the temp directory is
 * renamed into place. A failure part-way through never leaves the
 * caller observing a half-populated repo.
 *
 * @param url        Raw URL as supplied by the caller. It is parsed
 *                   via {@link parseGitUrl}, so the same option-
 *                   injection protections apply here.
 * @param ref        Optional ref (branch, tag, commit-ish). Validated.
 * @param cacheDir   Root of the plugin cache. Usually
 *                   {@link PLUGIN_CACHE_ROOT}, but tests inject a temp
 *                   directory to keep them parallel-safe.
 * @param sshKey     Path to an SSH private key. When supplied,
 *                   `GIT_SSH_COMMAND` is set for the child process.
 */
export async function cloneGitRepo(
  url: string,
  ref: string | undefined,
  cacheDir: string,
  sshKey?: string
): Promise<{ path: string; commit: string; identity: string }> {
  const parsed = parseGitUrl(url);
  const effectiveRef = ref ?? parsed.ref;
  if (effectiveRef !== undefined) {
    validateRef(effectiveRef);
  }

  const identity = getPluginIdentity(url, effectiveRef, parsed.subpath);
  fs.mkdirSync(cacheDir, { recursive: true });

  const finalPath = path.join(cacheDir, identity);
  const tmpPath = path.join(
    cacheDir,
    `${identity}.tmp-${process.pid}-${Math.random().toString(36).slice(2, 10)}`
  );

  const args = ['clone', '--depth', '1'];
  if (effectiveRef) {
    args.push('--branch', effectiveRef);
  }
  args.push('--', parsed.normalizedUrl, tmpPath);

  const env = buildGitEnv(sshKey);

  try {
    await execFileAsync('git', args, { env });
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
      cwd: tmpPath,
      env,
    });
    const commit = stdout.trim();
    if (commit.length === 0) {
      throw new Error(`git rev-parse HEAD returned an empty commit for ${url}`);
    }

    // Atomic swap: remove any pre-existing final dir, then rename the
    // freshly cloned temp dir into place.
    if (fs.existsSync(finalPath)) {
      fs.rmSync(finalPath, { recursive: true, force: true });
    }
    fs.renameSync(tmpPath, finalPath);

    const metadata: PluginCacheMetadata = {
      identity,
      url: parsed.normalizedUrl,
      ref: effectiveRef,
      commit,
      lastCheckedAt: Date.now(),
    };
    fs.writeFileSync(
      path.join(finalPath, '.metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );

    return { path: finalPath, commit, identity };
  } catch (err) {
    // Clean up the temp dir so a failed clone does not accumulate.
    if (fs.existsSync(tmpPath)) {
      try {
        fs.rmSync(tmpPath, { recursive: true, force: true });
      } catch {
        // best-effort — if cleanup itself fails we still want to
        // surface the original clone error, not the rm error.
      }
    }
    throw err;
  }
}

/**
 * Resolve any symlinks under `subpath` and verify the result is still
 * contained within `repoPath`. Returns the absolute, symlink-resolved
 * path.
 *
 * When `subpath` is not supplied, the repo root itself is checked.
 * Callers should always pass this through before reading files from a
 * cloned plugin — a malicious repo can otherwise ship
 * `subpath/link -> /etc/passwd` and read from anywhere the process
 * has permission to open.
 */
export function checkContainment(repoPath: string, subpath?: string): string {
  const realRepoPath = fs.realpathSync(repoPath);
  const joined = subpath ? path.join(realRepoPath, subpath) : realRepoPath;

  let resolved: string;
  try {
    resolved = fs.realpathSync(joined);
  } catch {
    // Path does not exist yet; still enforce containment on the
    // lexical join so callers cannot request `subpath: ../../etc`.
    resolved = path.resolve(joined);
  }

  const repoWithSep = realRepoPath.endsWith(path.sep) ? realRepoPath : realRepoPath + path.sep;
  if (resolved !== realRepoPath && !resolved.startsWith(repoWithSep)) {
    throw new Error(`resolved subpath "${resolved}" escapes repository root "${realRepoPath}"`);
  }
  return resolved;
}

/**
 * Read the plugin cache metadata for `identity` and return `true`
 * when the recorded `lastCheckedAt` is older than `ttl` milliseconds
 * (or when no metadata exists at all — a fresh identity always
 * revalidates).
 *
 * `cacheDir` defaults to {@link PLUGIN_CACHE_ROOT}; tests pass a temp
 * directory. TTL defaults to {@link DEFAULT_REVALIDATE_TTL_MS}.
 */
export function shouldRevalidate(
  identity: string,
  ttl: number = DEFAULT_REVALIDATE_TTL_MS,
  cacheDir: string = PLUGIN_CACHE_ROOT
): boolean {
  const metadataPath = path.join(cacheDir, identity, '.metadata.json');
  if (!fs.existsSync(metadataPath)) {
    return true;
  }
  try {
    const raw = fs.readFileSync(metadataPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<PluginCacheMetadata>;
    if (typeof parsed.lastCheckedAt !== 'number') {
      return true;
    }
    return Date.now() - parsed.lastCheckedAt > ttl;
  } catch {
    return true;
  }
}

/**
 * Run `git ls-remote <url> <ref>` and return `true` when the remote
 * commit differs from `recordedCommit`. Used to decide whether a
 * mutable ref (branch, tag) needs a fresh clone.
 *
 * Immutable refs (a full commit SHA) never need revalidation — the
 * caller is expected to short-circuit on `parseGitUrl` output
 * separately. This function does not itself assume mutability; it
 * simply reports whether the remote has moved.
 */
export async function revalidateMutableRef(
  url: string,
  ref: string,
  recordedCommit: string,
  sshKey?: string
): Promise<boolean> {
  validateRef(ref);
  const parsed = parseGitUrl(url);
  const env = buildGitEnv(sshKey);
  const { stdout } = await execFileAsync('git', ['ls-remote', parsed.normalizedUrl, ref], {
    env,
  });
  const firstLine = stdout.split(/\r?\n/).find((line) => line.trim().length > 0);
  if (!firstLine) {
    // No matching ref on the remote — treat as changed so the caller
    // triggers a fresh clone (and gets the actual failure).
    return true;
  }
  const remoteCommit = firstLine.split(/\s+/)[0].trim();
  return remoteCommit !== recordedCommit;
}
