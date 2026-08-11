/**
 * Token Storage
 *
 * Persist OAuth-style access tokens keyed by provider id to a JSON file
 * at `~/.alexi/tokens.json`. This is the persistence layer used by the
 * SAP AI Core connector caching described in issue #1357: fetching a
 * fresh bearer per invocation adds ~500ms-2s of latency, and the token
 * is stable for hours, so caching it across CLI sessions is a large
 * responsiveness win.
 *
 * Design notes:
 *
 *  1. All writes go through a temp-file + rename sequence so concurrent
 *     Alexi processes never observe a partially-written file. The temp
 *     file lives in the same directory as the target so the rename is
 *     atomic on POSIX (same filesystem).
 *  2. The file is written with mode `0o600` (owner-only read/write).
 *     Callers already run as the current user, so this is enough to
 *     keep the token off of `world-readable` inspection.
 *  3. Missing file / malformed JSON / unreadable file all resolve to
 *     `null` rather than throwing. The consumer treats a cache miss
 *     identically to a corrupted cache -- fall back to fresh auth.
 *  4. `expiresAt` is a Unix epoch millisecond timestamp. Callers are
 *     responsible for deciding whether a token is close enough to
 *     expiry that it should be refreshed proactively; this module
 *     stores whatever value it is given and returns it verbatim.
 *  5. The storage path is overridable via `setTokenStoragePath()` so
 *     tests can point at a `mkdtemp` directory. Production callers
 *     leave it at the default `~/.alexi/tokens.json`.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

// ============ Types ============

/**
 * A single cached token entry.
 */
export interface StoredToken {
  /** The access token (bearer) value. */
  token: string;
  /** Unix epoch milliseconds at which `token` expires. */
  expiresAt: number;
}

/**
 * On-disk shape: a JSON map keyed by provider id. Provider ids are
 * free-form strings decided by the caller (e.g. `sap-ai-core`).
 */
type TokenFile = Record<string, StoredToken>;

// ============ Storage path resolution ============

const DEFAULT_TOKEN_FILE = path.join(os.homedir(), '.alexi', 'tokens.json');

let currentTokenFile: string = DEFAULT_TOKEN_FILE;

/**
 * Return the absolute path of the file used for token storage.
 * Tests may relocate this via `setTokenStoragePath`.
 */
export function getTokenStoragePath(): string {
  return currentTokenFile;
}

/**
 * Override the token storage path. Intended for tests that want to
 * point at a `fs.mkdtempSync(...)` directory. Callers must restore
 * the previous value in their `afterEach` hook.
 */
export function setTokenStoragePath(newPath: string): void {
  currentTokenFile = newPath;
}

/**
 * Restore the token storage path to the default `~/.alexi/tokens.json`.
 */
export function resetTokenStoragePath(): void {
  currentTokenFile = DEFAULT_TOKEN_FILE;
}

// ============ Internal helpers ============

/**
 * Return `true` when the value looks like a `StoredToken`. Any
 * deviation (missing fields, wrong types) is rejected so a malformed
 * entry cannot poison the cache.
 */
function isStoredToken(value: unknown): value is StoredToken {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const rec = value as Record<string, unknown>;
  return (
    typeof rec.token === 'string' &&
    rec.token.length > 0 &&
    typeof rec.expiresAt === 'number' &&
    Number.isFinite(rec.expiresAt)
  );
}

/**
 * Read the token file. Missing file or malformed contents both return
 * an empty map, so callers never have to unwrap an error path.
 */
async function readTokenFile(): Promise<TokenFile> {
  let raw: string;
  try {
    raw = await fs.promises.readFile(currentTokenFile, 'utf-8');
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return {};
    }
    // Unreadable file (permissions, IO error). Treat as empty so the
    // caller falls back to fresh auth instead of failing hard.
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON: treat as an empty cache.
    return {};
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }

  const out: TokenFile = {};
  for (const [providerId, entry] of Object.entries(parsed as Record<string, unknown>)) {
    if (isStoredToken(entry)) {
      out[providerId] = { token: entry.token, expiresAt: entry.expiresAt };
    }
  }
  return out;
}

/**
 * Atomically write the token file. Uses a temp file + rename so
 * concurrent readers never observe a half-written file. The temp
 * file is created with `0o600` so the token contents never touch
 * the disk with looser permissions, even briefly.
 */
async function writeTokenFile(data: TokenFile): Promise<void> {
  const dir = path.dirname(currentTokenFile);
  await fs.promises.mkdir(dir, { recursive: true });

  // Suffix with pid + random so parallel writers do not collide on
  // the temp filename. Rename is atomic within the same filesystem.
  const tmpPath = `${currentTokenFile}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  const contents = JSON.stringify(data, null, 2);
  await fs.promises.writeFile(tmpPath, contents, { encoding: 'utf-8', mode: 0o600 });
  try {
    await fs.promises.rename(tmpPath, currentTokenFile);
  } catch (err) {
    // Best-effort cleanup of the temp file before re-throwing.
    await fs.promises.unlink(tmpPath).catch(() => undefined);
    throw err;
  }
  // Rename preserves the mode on POSIX; on some filesystems the
  // target file may have pre-existed with a laxer mode, so tighten
  // it explicitly. `chmod` is a no-op on Windows for permission
  // bits but does not throw.
  try {
    await fs.promises.chmod(currentTokenFile, 0o600);
  } catch {
    // Non-fatal: some filesystems (e.g. tmpfs mounts, Windows FAT)
    // do not implement chmod. The token is still stored.
  }
}

// ============ Public API ============

/**
 * Persist a token for `providerId`. Overwrites any existing entry.
 *
 * This performs a read-modify-write cycle so other providers'
 * entries are preserved. On any I/O failure the promise rejects so
 * the caller can decide whether to degrade gracefully (the SAP
 * Orchestration integration wraps this in try/catch to fall back to
 * fresh auth on write errors).
 */
export async function saveToken(
  providerId: string,
  token: string,
  expiresAt: number
): Promise<void> {
  if (typeof providerId !== 'string' || providerId.length === 0) {
    throw new Error('saveToken: providerId must be a non-empty string');
  }
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('saveToken: token must be a non-empty string');
  }
  if (typeof expiresAt !== 'number' || !Number.isFinite(expiresAt)) {
    throw new Error('saveToken: expiresAt must be a finite number');
  }
  const data = await readTokenFile();
  data[providerId] = { token, expiresAt };
  await writeTokenFile(data);
}

/**
 * Load a token for `providerId`. Returns `null` when no entry exists,
 * the file is missing, or the entry is malformed. Callers are
 * responsible for checking `expiresAt` against the current wall clock
 * before using the returned token.
 */
export async function loadToken(providerId: string): Promise<StoredToken | null> {
  if (typeof providerId !== 'string' || providerId.length === 0) {
    return null;
  }
  const data = await readTokenFile();
  const entry = data[providerId];
  return entry ? { token: entry.token, expiresAt: entry.expiresAt } : null;
}

/**
 * Delete the cached token for `providerId`. If no entry exists this
 * is a no-op (does not throw). Other providers' entries are
 * preserved.
 */
export async function clearToken(providerId: string): Promise<void> {
  if (typeof providerId !== 'string' || providerId.length === 0) {
    return;
  }
  const data = await readTokenFile();
  if (!(providerId in data)) {
    return;
  }
  delete data[providerId];
  await writeTokenFile(data);
}

/**
 * Delete every cached token. Primarily useful for tests and for a
 * hypothetical `alexi auth clear` CLI command.
 */
export async function clearAllTokens(): Promise<void> {
  try {
    await fs.promises.unlink(currentTokenFile);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return;
    }
    throw err;
  }
}
