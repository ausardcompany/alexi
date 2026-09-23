/**
 * MCP Git Plugin Resolver
 *
 * Parses, validates, clones, and revalidates MCP plugin git URLs used by
 * the (upcoming) `mcp install` CLI surface. Ported from the security
 * hardening in Kilocode PR #14485 (2026-09-23):
 *
 * - Parse public HTTPS (`https://host/org/repo#ref@subpath`), private SSH
 *   (`git@host:org/repo.git#ref@subpath`), and local file URLs
 *   (`file:///abs/path#ref@subpath`).
 * - Reject option-injection refs (any ref that git could interpret as a
 *   command-line flag) and other malformed values before they ever reach
 *   `git clone` / `git ls-remote`.
 * - Normalize Windows drive-less `file://` URLs.
 * - Clone into a per-identity cache directory with a temp-clone +
 *   atomic-rename swap so a concurrent read never sees a half-written
 *   worktree.
 * - Resolve symlinks in the requested subpath and reject anything that
 *   escapes the cloned repo root.
 * - Namespace git plugin identities (`git:host/org/repo#ref@subpath`)
 *   separately from npm / local ones so cache dirs never collide.
 * - Provide a TTL-driven staleness check plus a `git ls-remote`
 *   revalidator so mutable refs (branches, tags) can be re-resolved
 *   without a full reclone.
 *
 * The heavy `git` invocations are shelled out through an injectable
 * runner ({@link setGitRunner}) so unit tests can mock the transport
 * layer without touching real repositories or the network.
 */

import { execFile } from 'child_process';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Default cache directory for cloned MCP plugin repositories. Each
 * distinct plugin identity gets its own subdirectory beneath this root.
 */
export const DEFAULT_PLUGIN_CACHE_DIR = path.join(os.homedir(), '.alexi', 'plugin-cache');

/** Default TTL for mutable-ref revalidation (24 hours in ms). */
export const DEFAULT_MUTABLE_REF_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Result of {@link parseGitUrl}. `protocol` narrows the shape of `org` /
 * `repo` (both empty strings for `file://` URLs, which use `repo` for
 * the on-disk path instead).
 */
export interface ParsedGitUrl {
  protocol: 'https' | 'ssh' | 'file';
  /** For https/ssh: the host name (e.g. `github.com`). Empty for file. */
  host: string;
  /** For https/ssh: the org/user segment. Empty for file. */
  org: string;
  /** For https/ssh: the repo name (no `.git`). For file: the absolute path. */
  repo: string;
  /** Optional ref (branch / tag / commit) extracted from the `#` fragment. */
  ref?: string;
  /** Optional in-repo subpath extracted after `@` in the fragment. */
  subpath?: string;
}

/** Result of {@link cloneGitRepo}. */
export interface CloneResult {
  /** Absolute path to the cloned repo on disk. */
  path: string;
  /** Resolved commit SHA at the time of clone. */
  commit: string;
}

/**
 * Injectable git command runner. Real callers use the default (shells
 * out to the local `git` binary via `execFile`); tests replace this
 * with a mock via {@link setGitRunner}.
 */
export type GitRunner = (
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv }
) => Promise<{ stdout: string; stderr: string; code: number }>;

let currentRunner: GitRunner = defaultGitRunner;

/**
 * Replace the git runner (test-only seam). Returns the previous runner
 * so callers can restore it in `afterEach`.
 */
export function setGitRunner(runner: GitRunner): GitRunner {
  const previous = currentRunner;
  currentRunner = runner;
  return previous;
}

/** Reset the git runner back to the real `execFile`-backed default. */
export function resetGitRunner(): void {
  currentRunner = defaultGitRunner;
}

function defaultGitRunner(
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv }
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    execFile(
      'git',
      args,
      { cwd: options.cwd, env: options.env, maxBuffer: 8 * 1024 * 1024 },
      (err, stdout: string | Buffer, stderr: string | Buffer) => {
        const out = typeof stdout === 'string' ? stdout : stdout.toString('utf-8');
        const errOut = typeof stderr === 'string' ? stderr : stderr.toString('utf-8');
        if (err) {
          const e = err as NodeJS.ErrnoException & { code?: string | number };
          const exitCode = typeof e.code === 'number' ? e.code : 1;
          resolve({ stdout: out, stderr: errOut, code: exitCode });
          return;
        }
        resolve({ stdout: out, stderr: errOut, code: 0 });
      }
    );
  });
}

/**
 * Reject refs that git would interpret as an option flag (leading `-`
 * or `^--`) and other obviously malformed values. This must run BEFORE
 * the ref is spliced into a `git clone --branch <ref>` / `git ls-remote`
 * argv, or an attacker-controlled ref could inject `--upload-pack=<cmd>`
 * or similar.
 *
 * Rules:
 * - Empty ref rejected.
 * - Ref starting with `-` or containing `^--` rejected (option injection).
 * - Ref containing whitespace, control characters, or shell metacharacters
 *   (`;`, `|`, `&`, `$`, `` ` ``, newline) rejected.
 * - Ref containing `..`, `//`, or ending with `/` / `.lock` rejected
 *   (matches `git check-ref-format` heuristics).
 */
export function validateRef(ref: string): void {
  if (typeof ref !== 'string' || ref.length === 0) {
    throw new Error('git ref: empty ref is not allowed');
  }
  if (ref.startsWith('-') || ref.includes('^--')) {
    throw new Error(`git ref: option-injection ref rejected: ${ref}`);
  }
  // Whitespace.
  if (/\s/.test(ref)) {
    throw new Error(`git ref: whitespace or control character in ref: ${JSON.stringify(ref)}`);
  }
  // Control chars (0x00-0x1F, 0x7F). Scanned by codepoint to avoid an
  // ESLint `no-control-regex` finding — semantics are identical.
  for (let i = 0; i < ref.length; i++) {
    const code = ref.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) {
      throw new Error(`git ref: whitespace or control character in ref: ${JSON.stringify(ref)}`);
    }
  }
  if (/[;|&$`\\]/.test(ref)) {
    throw new Error(`git ref: shell metacharacter in ref: ${ref}`);
  }
  if (ref.includes('..') || ref.includes('//')) {
    throw new Error(`git ref: malformed ref (double dot / slash): ${ref}`);
  }
  if (ref.endsWith('/') || ref.endsWith('.lock')) {
    throw new Error(`git ref: malformed ref (trailing / or .lock): ${ref}`);
  }
}

/**
 * Normalize a `file://` URL. Handles the Windows drive-letter shape
 * `file:///C:/Users/...` by stripping the extra leading slash so the
 * remainder is a valid Windows path (`file://C:/Users/...`). Non-file
 * URLs and POSIX file URLs are returned unchanged.
 */
export function normalizeFileUrl(url: string): string {
  if (typeof url !== 'string' || !url.startsWith('file://')) {
    return url;
  }
  // Match `file:///<drive-letter>:/...` (Windows drive-less shape).
  const winDriveMatch = /^file:\/\/\/([A-Za-z]):(\/.*)?$/.exec(url);
  if (winDriveMatch) {
    const drive = winDriveMatch[1];
    const rest = winDriveMatch[2] ?? '';
    return `file://${drive}:${rest}`;
  }
  return url;
}

/**
 * Split a URL into its base and optional `#fragment`, then split the
 * fragment into `ref` and `subpath` (separated by the first `@`).
 * Returns undefineds when the components are absent.
 */
function splitFragment(url: string): { base: string; ref?: string; subpath?: string } {
  const hashIndex = url.indexOf('#');
  if (hashIndex < 0) {
    return { base: url };
  }
  const base = url.slice(0, hashIndex);
  const fragment = url.slice(hashIndex + 1);
  if (fragment.length === 0) {
    return { base };
  }
  const atIndex = fragment.indexOf('@');
  if (atIndex < 0) {
    return { base, ref: fragment };
  }
  const ref = fragment.slice(0, atIndex);
  const subpath = fragment.slice(atIndex + 1);
  return {
    base,
    ref: ref.length > 0 ? ref : undefined,
    subpath: subpath.length > 0 ? subpath : undefined,
  };
}

/**
 * Parse a git URL supported by the MCP plugin resolver. Recognises the
 * three shapes described in the module doc-comment; throws with a
 * specific message on anything else so operator-facing errors are
 * actionable rather than "malformed URL".
 */
export function parseGitUrl(url: string): ParsedGitUrl {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error('git url: empty URL is not allowed');
  }

  const normalized = normalizeFileUrl(url);
  const { base, ref, subpath } = splitFragment(normalized);

  // file:// URLs — path only.
  if (base.startsWith('file://')) {
    // Strip `file://` prefix; keep any drive letter or leading `/`.
    const filePath = base.slice('file://'.length);
    if (filePath.length === 0) {
      throw new Error(`git url: file:// URL has no path: ${url}`);
    }
    const parsed: ParsedGitUrl = {
      protocol: 'file',
      host: '',
      org: '',
      repo: filePath,
    };
    if (ref !== undefined) {
      validateRef(ref);
      parsed.ref = ref;
    }
    if (subpath !== undefined) {
      parsed.subpath = subpath;
    }
    return parsed;
  }

  // SSH shape: `git@host:org/repo(.git)`
  //   The `:` (NOT `://`) separates host from path.
  const sshMatch = /^([A-Za-z0-9_.-]+)@([A-Za-z0-9_.-]+):([^/].*)$/.exec(base);
  if (sshMatch) {
    const host = sshMatch[2];
    const pathPart = sshMatch[3];
    const { org, repo } = splitOrgRepo(pathPart, url);
    const parsed: ParsedGitUrl = {
      protocol: 'ssh',
      host,
      org,
      repo,
    };
    if (ref !== undefined) {
      validateRef(ref);
      parsed.ref = ref;
    }
    if (subpath !== undefined) {
      parsed.subpath = subpath;
    }
    return parsed;
  }

  // HTTPS shape: `https://host/org/repo(.git)`
  if (base.startsWith('https://') || base.startsWith('http://')) {
    const rest = base.slice(base.indexOf('://') + 3);
    const slashIndex = rest.indexOf('/');
    if (slashIndex < 0) {
      throw new Error(`git url: https URL is missing org/repo: ${url}`);
    }
    const host = rest.slice(0, slashIndex);
    const pathPart = rest.slice(slashIndex + 1);
    const { org, repo } = splitOrgRepo(pathPart, url);
    const parsed: ParsedGitUrl = {
      protocol: 'https',
      host,
      org,
      repo,
    };
    if (ref !== undefined) {
      validateRef(ref);
      parsed.ref = ref;
    }
    if (subpath !== undefined) {
      parsed.subpath = subpath;
    }
    return parsed;
  }

  throw new Error(`git url: unsupported scheme (expected https://, git@host:, or file://): ${url}`);
}

function splitOrgRepo(pathPart: string, originalUrl: string): { org: string; repo: string } {
  // Drop trailing slash & optional `.git` suffix.
  const trimmed = pathPart.replace(/\/+$/, '').replace(/\.git$/, '');
  const parts = trimmed.split('/');
  if (parts.length < 2 || parts[0].length === 0 || parts[1].length === 0) {
    throw new Error(`git url: missing org/repo segment: ${originalUrl}`);
  }
  return { org: parts[0], repo: parts[1] };
}

/**
 * Stable, filesystem-safe plugin identity string. Namespaced with a
 * `git:` prefix so it can never collide with npm / local plugin ids.
 * Downstream code turns this into a cache directory name via
 * {@link identityToCacheKey}.
 */
export function getPluginIdentity(url: string, ref?: string, subpath?: string): string {
  const parsed = parseGitUrl(url);
  // Prefer explicit arguments so callers can override without reparsing.
  const effectiveRef = ref ?? parsed.ref;
  const effectiveSubpath = subpath ?? parsed.subpath;

  let base: string;
  if (parsed.protocol === 'file') {
    base = `git:file:${parsed.repo}`;
  } else {
    base = `git:${parsed.host}/${parsed.org}/${parsed.repo}`;
  }
  const refPart = effectiveRef ? `#${effectiveRef}` : '';
  const subPart = effectiveSubpath ? `@${effectiveSubpath}` : '';
  return `${base}${refPart}${subPart}`;
}

/**
 * Turn a plugin identity into a filesystem-safe cache-directory name.
 * Non-alphanumerics are replaced with `_` so the identity can be used
 * as a bare directory name without escaping.
 */
export function identityToCacheKey(identity: string): string {
  return identity.replace(/[^A-Za-z0-9._-]+/g, '_');
}

/**
 * Ensure a subpath resolves inside the cloned repo. Follows symlinks
 * before the containment check so a symlink escape (`ln -s /etc target`)
 * is rejected. Returns the resolved absolute subpath on success.
 *
 * When no subpath is provided the repo root itself is returned (still
 * symlink-resolved so the same containment invariant applies to it).
 */
export async function checkContainment(repoPath: string, subpath?: string): Promise<string> {
  const resolvedRepo = await fsPromises.realpath(repoPath);
  if (!subpath || subpath.length === 0) {
    return resolvedRepo;
  }
  // Reject absolute / parent-escaping subpaths BEFORE hitting the
  // filesystem — cheaper and gives a clearer error.
  if (path.isAbsolute(subpath)) {
    throw new Error(`git subpath: absolute subpath rejected: ${subpath}`);
  }
  const joined = path.resolve(resolvedRepo, subpath);
  let resolvedSubpath: string;
  try {
    resolvedSubpath = await fsPromises.realpath(joined);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`git subpath: does not exist: ${subpath}`, { cause: err });
    }
    throw err;
  }
  const relative = path.relative(resolvedRepo, resolvedSubpath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(
      `git subpath: escapes repo root (${resolvedSubpath} not inside ${resolvedRepo})`
    );
  }
  return resolvedSubpath;
}

/**
 * Options accepted by {@link cloneGitRepo}.
 */
export interface CloneOptions {
  /** Optional path to an SSH private key for private-repo cloning. */
  sshKey?: string;
}

/**
 * Clone a git repository into `<cacheDir>/<identity>` using a temporary
 * sibling directory + `rename` for atomic swap. If the destination
 * already exists it is replaced. Returns the final path and the
 * resolved commit SHA reported by `git rev-parse HEAD`.
 *
 * The clone uses `--depth 1` (shallow), and passes `--branch <ref>`
 * when a ref is supplied. Refs are validated with {@link validateRef}
 * before they touch argv.
 */
export async function cloneGitRepo(
  url: string,
  ref: string | undefined,
  cacheDir: string,
  optionsOrSshKey?: CloneOptions | string
): Promise<CloneResult> {
  if (ref !== undefined) {
    validateRef(ref);
  }

  const normalizedUrl = normalizeFileUrl(url);
  const identity = getPluginIdentity(normalizedUrl, ref);
  const key = identityToCacheKey(identity);
  const finalPath = path.join(cacheDir, key);
  const tempPath = path.join(cacheDir, `${key}.tmp-${process.pid}-${Date.now()}`);

  await fsPromises.mkdir(cacheDir, { recursive: true });

  const args = ['clone', '--depth', '1'];
  if (ref !== undefined) {
    args.push('--branch', ref);
  }
  args.push('--', normalizedUrl, tempPath);

  const options: CloneOptions =
    typeof optionsOrSshKey === 'string' ? { sshKey: optionsOrSshKey } : (optionsOrSshKey ?? {});

  const env: NodeJS.ProcessEnv = { ...process.env };
  if (options.sshKey) {
    // Force strict host-key checking off ONLY when the caller supplies
    // a key (matches Kilocode's ssh command). This keeps public-URL
    // clones on the standard git config.
    env.GIT_SSH_COMMAND = `ssh -i ${shellQuote(options.sshKey)} -o IdentitiesOnly=yes`;
  }

  const clone = await currentRunner(args, { env });
  if (clone.code !== 0) {
    await safeRemove(tempPath);
    throw new Error(
      `git clone failed (exit ${clone.code}): ${clone.stderr.trim() || clone.stdout.trim()}`
    );
  }

  const rev = await currentRunner(['rev-parse', 'HEAD'], { cwd: tempPath });
  if (rev.code !== 0) {
    await safeRemove(tempPath);
    throw new Error(
      `git rev-parse HEAD failed (exit ${rev.code}): ${rev.stderr.trim() || rev.stdout.trim()}`
    );
  }
  const commit = rev.stdout.trim();
  if (!/^[0-9a-f]{7,64}$/i.test(commit)) {
    await safeRemove(tempPath);
    throw new Error(`git rev-parse HEAD returned unexpected value: ${commit}`);
  }

  // Atomic swap: remove any prior clone, then rename temp -> final.
  await safeRemove(finalPath);
  await fsPromises.rename(tempPath, finalPath);

  return { path: finalPath, commit };
}

function shellQuote(value: string): string {
  // Minimal, POSIX-only quoting for the `-i <path>` argument. The
  // resulting string is passed to `ssh` via GIT_SSH_COMMAND, which is
  // parsed by a shell.
  if (/^[A-Za-z0-9_./-]+$/.test(value)) {
    return value;
  }
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

async function safeRemove(target: string): Promise<void> {
  try {
    await fsPromises.rm(target, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup — failure here is not fatal.
  }
}

/**
 * Persistent record of a resolved plugin identity, used to drive the
 * TTL-based staleness check for mutable refs.
 */
export interface ResolutionRecord {
  /** Identity string returned by {@link getPluginIdentity}. */
  identity: string;
  /** Resolved commit SHA at the time of the last successful clone. */
  commit: string;
  /** Epoch millis when the identity was resolved. */
  resolvedAt: number;
}

/**
 * Return `true` when the recorded resolution is older than `ttl` ms and
 * therefore should be revalidated. A missing / malformed record also
 * returns `true` so callers refuse to silently trust stale state.
 *
 * `now` defaults to `Date.now()` but is injectable so tests can control
 * time without touching `vi.useFakeTimers()`.
 */
export function shouldRevalidate(
  record: ResolutionRecord | undefined,
  ttl: number = DEFAULT_MUTABLE_REF_TTL_MS,
  now: number = Date.now()
): boolean {
  if (!record || typeof record.resolvedAt !== 'number') {
    return true;
  }
  if (ttl <= 0) {
    return true;
  }
  const age = now - record.resolvedAt;
  return age >= ttl;
}

/**
 * Revalidate a mutable ref by running `git ls-remote <url> <ref>` and
 * comparing the reported SHA with `recordedCommit`. Returns `true` when
 * the ref has moved (caller must reclone), `false` when it is still
 * pointing at the same commit.
 *
 * Refs are validated before hitting argv. The URL is normalized so
 * Windows drive-less file URLs do not need special handling by callers.
 */
export async function revalidateMutableRef(
  url: string,
  ref: string,
  recordedCommit: string
): Promise<boolean> {
  validateRef(ref);
  if (typeof recordedCommit !== 'string' || recordedCommit.length === 0) {
    // Nothing to compare against — force a reclone.
    return true;
  }
  const normalizedUrl = normalizeFileUrl(url);
  const result = await currentRunner(['ls-remote', '--', normalizedUrl, ref], {});
  if (result.code !== 0) {
    throw new Error(
      `git ls-remote failed (exit ${result.code}): ${result.stderr.trim() || result.stdout.trim()}`
    );
  }
  const firstLine = result.stdout.split(/\r?\n/).find((line) => line.trim().length > 0);
  if (!firstLine) {
    throw new Error(`git ls-remote: no output for ${ref}`);
  }
  const remoteCommit = firstLine.split(/\s+/)[0].trim().toLowerCase();
  const recorded = recordedCommit.trim().toLowerCase();
  if (!/^[0-9a-f]{7,64}$/i.test(remoteCommit)) {
    throw new Error(`git ls-remote: unexpected output: ${firstLine}`);
  }
  return remoteCommit !== recorded;
}

/**
 * Convenience alias that materialises the default plugin cache directory
 * on disk. Used by callers that just want "the standard cache dir"
 * without threading paths through their own config.
 */
export async function ensureDefaultPluginCacheDir(): Promise<string> {
  await fsPromises.mkdir(DEFAULT_PLUGIN_CACHE_DIR, { recursive: true });
  return DEFAULT_PLUGIN_CACHE_DIR;
}

/** Re-export for consumers that want to short-circuit on the sync API. */
export function existsSyncSafe(target: string): boolean {
  try {
    return fs.existsSync(target);
  } catch {
    return false;
  }
}
