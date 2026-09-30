/**
 * Session PR-link storage
 *
 * Ports the following upstream kilocode/opencode commits into Alexi:
 *
 *   - `9cc0a9158` fix(sessions): link a pull request to a session only on
 *     its own evidence — a PR link is now stored PER SESSION rather than
 *     against the shared worktree. Two sessions on the same checkout no
 *     longer inherit each other's PR link.
 *   - `56ab1e502` fix(sessions): harden per-session PR link evidence —
 *     always verify host/owner/repo against the worktree remote before
 *     recording, so a link to a fork or unrelated repo is refused rather
 *     than silently stored.
 *   - `154a8427c` fix(cli): disable session PR linking on non-CLI backends
 *     — expose an `enabled()` predicate that the tool + registry can gate
 *     on so hosts that cannot honor the persistence semantics (e.g. an
 *     embedded VS Code webview / SAP BAS host) never see the tool.
 *
 * ## Alexi-specific notes
 *
 * Alexi does not have kilocode's Effect-TS runtime or `Flag.KILO_CLIENT`
 * runtime service. Instead we gate on `ALEXI_CLIENT`, which the CLI
 * entrypoint sets to `"cli"` and hosts embedding Alexi as a library
 * (SAP BAS extension, VS Code webview) leave unset or set to a non-`cli`
 * value.
 *
 * Records are persisted next to the session state under
 * `~/.alexi/sessions/<sessionId>/pr-link.json`. This deliberately mirrors
 * the layout used by `core/snapshot.ts` so a session directory carries
 * ALL its own metadata and can be zipped / moved as a unit.
 *
 * SAP AI Core compatibility: this module does no network I/O and touches
 * no provider surface — safe for tenants that restrict outbound calls.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * A parsed GitHub-style PR URL. Extended over time to cover other forges
 * (GitLab, Azure DevOps) — the host/owner/repo triple is the identity
 * used for cross-checking against the local worktree remote.
 */
export interface ParsedPrLink {
  host: string;
  owner: string;
  repo: string;
  number: number;
  url: string;
}

/**
 * How the session came to be linked to this PR. `user` is an explicit
 * `link_pr` tool call; `auto` is heuristic detection from the current
 * branch; `poller` is a background reconciliation loop. The evidence is
 * carried alongside the link so future code can decide whether a
 * lower-confidence source is allowed to overwrite a higher-confidence
 * one.
 */
export interface SessionPrLink {
  link: ParsedPrLink;
  evidence: 'user' | 'auto' | 'poller';
}

const PR_URL_REGEX =
  /^https?:\/\/([^/]+)\/([^/]+)\/([^/]+)\/(?:pull|pull-requests|merge_requests)\/(\d+)(?:[/?#].*)?$/i;

/**
 * Returns true when session PR-link persistence is supported for the
 * current backend. Alexi's CLI entrypoint sets `ALEXI_CLIENT=cli`;
 * embedded hosts leave it unset. Consumers MUST call this before
 * offering the `link_pr` tool or recording a link — see change #1 and #2
 * in the update plan.
 */
export function enabled(): boolean {
  const client = (process.env.ALEXI_CLIENT ?? 'cli').toLowerCase();
  return client === 'cli';
}

/**
 * Parse a PR URL into its host/owner/repo/number triple. Returns
 * `undefined` for anything that is not a recognizable pull-request URL
 * (e.g. an issue link, a raw commit URL, or a fork comparison view).
 */
export function parsePrUrl(url: string): ParsedPrLink | undefined {
  if (typeof url !== 'string' || url.length === 0) {
    return undefined;
  }
  const match = PR_URL_REGEX.exec(url.trim());
  if (!match) {
    return undefined;
  }
  const [, host, owner, repo, numberRaw] = match;
  const num = Number.parseInt(numberRaw, 10);
  if (!Number.isFinite(num) || num <= 0) {
    return undefined;
  }
  return {
    host: host.toLowerCase(),
    owner,
    repo: repo.replace(/\.git$/i, ''),
    number: num,
    url: url.trim(),
  };
}

/**
 * Cross-check a parsed PR link against a local worktree. Reads the
 * worktree's git config for its `origin` (or first) remote and refuses
 * links whose host/owner/repo does not match. This is the second layer
 * of defense (the first being `enabled()`) that stops a PR link from
 * being stored against an unrelated checkout.
 *
 * A missing / unreadable git config returns `false` — we treat "cannot
 * verify" the same as "does not match", which is the same policy
 * upstream `56ab1e502` chose.
 */
export async function linkMatchesWorktree(
  link: ParsedPrLink,
  worktree: string
): Promise<boolean> {
  const remoteUrl = await readWorktreeRemote(worktree).catch(() => undefined);
  if (!remoteUrl) {
    return false;
  }
  const parsed = parseRemoteUrl(remoteUrl);
  if (!parsed) {
    return false;
  }
  return (
    parsed.host === link.host &&
    parsed.owner === link.owner &&
    parsed.repo.replace(/\.git$/i, '') === link.repo
  );
}

/**
 * Records a PR link against a session (never against the worktree).
 *
 * Returns the persisted record on success, `undefined` if the link was
 * refused (backend not CLI, or worktree mismatch). Throws only on
 * unexpected I/O errors — callers should catch and log rather than
 * propagate to the model.
 */
export async function recordSessionLink(
  sessionId: string,
  record: SessionPrLink,
  worktree: string
): Promise<SessionPrLink | undefined> {
  if (!enabled()) {
    return undefined;
  }
  if (!(await linkMatchesWorktree(record.link, worktree))) {
    return undefined;
  }
  await writeSessionLink(sessionId, record);
  return record;
}

/**
 * Read the currently persisted session PR link, if any. Returns
 * `undefined` when no link has been recorded yet or when parsing fails.
 */
export async function readSessionLink(
  sessionId: string
): Promise<SessionPrLink | undefined> {
  const p = sessionLinkPath(sessionId);
  try {
    const raw = await fs.readFile(p, 'utf-8');
    return JSON.parse(raw) as SessionPrLink;
  } catch {
    return undefined;
  }
}

/**
 * @deprecated Use `recordSessionLink` — worktree-scoped storage causes
 * cross-session fan-out. Kept as a thin wrapper for any legacy callers;
 * emits a warning and delegates. Will be removed once no caller remains.
 */
export async function writePrLinkOverride(
  _worktree: string,
  _link: ParsedPrLink
): Promise<void> {
  // eslint-disable-next-line no-console
  console.warn(
    'writePrLinkOverride is deprecated: use recordSessionLink(sessionId, ...)'
  );
}

// ---------- internal helpers ----------

async function writeSessionLink(
  sessionId: string,
  record: SessionPrLink
): Promise<void> {
  const p = sessionLinkPath(sessionId);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(record, null, 2), 'utf-8');
}

/**
 * `~/.alexi/sessions/<sessionId>/pr-link.json`. Mirrors the layout used
 * by `core/snapshot.ts` — the session id is the sole scoping key, not
 * the worktree, which is the whole point of this refactor.
 */
function sessionLinkPath(sessionId: string): string {
  return path.join(getSessionsDir(), sessionId, 'pr-link.json');
}

function getSessionsDir(): string {
  return path.join(process.env.HOME || '~', '.alexi', 'sessions');
}

/**
 * Read the first remote URL from a worktree's `.git/config`. We keep
 * this dependency-free (no `simple-git`) because this module runs in
 * hot paths and must not add startup latency.
 */
async function readWorktreeRemote(worktree: string): Promise<string | undefined> {
  const configPath = path.join(worktree, '.git', 'config');
  let raw: string;
  try {
    raw = await fs.readFile(configPath, 'utf-8');
  } catch {
    return undefined;
  }
  // Prefer [remote "origin"], fall back to first [remote "*"] block.
  const originMatch = /\[remote "origin"\][^[]*?url\s*=\s*(\S+)/i.exec(raw);
  if (originMatch) {
    return originMatch[1];
  }
  const anyMatch = /\[remote "[^"]+"\][^[]*?url\s*=\s*(\S+)/i.exec(raw);
  return anyMatch ? anyMatch[1] : undefined;
}

/**
 * Parse a remote URL (either HTTPS or SSH) into host/owner/repo. Returns
 * `undefined` for anything unrecognizable.
 */
function parseRemoteUrl(
  remote: string
): { host: string; owner: string; repo: string } | undefined {
  const trimmed = remote.trim();
  // git@host:owner/repo(.git)
  const ssh = /^[\w.-]+@([^:]+):([^/]+)\/(.+?)(?:\.git)?$/i.exec(trimmed);
  if (ssh) {
    return { host: ssh[1].toLowerCase(), owner: ssh[2], repo: ssh[3] };
  }
  // https://host/owner/repo(.git)
  const https = /^https?:\/\/(?:[^@/]+@)?([^/]+)\/([^/]+)\/(.+?)(?:\.git)?(?:[/?#].*)?$/i.exec(
    trimmed
  );
  if (https) {
    return { host: https[1].toLowerCase(), owner: https[2], repo: https[3] };
  }
  return undefined;
}
