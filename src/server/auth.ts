/**
 * Token-based authentication for the UNIX socket server.
 *
 * A single shared token is generated on first server start and stored at
 * `~/.alexi/server-token` with mode 0600 (owner read/write only). Remote
 * clients read that file and echo the token in an `auth` frame to prove
 * they have local filesystem access to the user's home directory.
 *
 * This is deliberately a low-ceremony scheme:
 *   - The socket itself lives under `~/.alexi/` (mode 0700), so anyone
 *     with connect access already has read access to the token file.
 *   - The token protects against accidental cross-user connects on
 *     shared machines and against non-privileged processes that ran
 *     under a different UID.
 *   - The token is NOT a cryptographic bearer for network use — the
 *     socket never listens on TCP.
 */

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Default location of the server token, resolved from `~/.alexi/`.
 * Exposed as a getter so tests can override `HOME` at runtime.
 */
export function defaultTokenPath(homeDir: string = os.homedir()): string {
  return path.join(homeDir, '.alexi', 'server-token');
}

/**
 * Default location of the UNIX domain socket. Exposed for both the
 * server (bind) and clients (connect).
 */
export function defaultSocketPath(homeDir: string = os.homedir()): string {
  return path.join(homeDir, '.alexi', 'server.sock');
}

/**
 * Generate a fresh 32-byte random token, hex-encoded (64 chars). Uses
 * `crypto.randomBytes` — sufficient for a local file-backed shared
 * secret.
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Ensure a token file exists at `tokenPath`. If missing, generate a new
 * token, write it with mode 0600, and return it. If present, read and
 * return the existing token. The directory is created with mode 0700
 * when it does not exist.
 *
 * On systems where `fs.chmodSync` is a no-op (Windows), the token is
 * still written but the mode is best-effort.
 */
export function loadOrCreateToken(tokenPath: string = defaultTokenPath()): string {
  const dir = path.dirname(tokenPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  if (fs.existsSync(tokenPath)) {
    const existing = fs.readFileSync(tokenPath, 'utf-8').trim();
    if (existing.length > 0) {
      return existing;
    }
  }

  const token = generateToken();
  fs.writeFileSync(tokenPath, token, { mode: 0o600 });
  try {
    // Some filesystems (mostly Windows) will silently ignore this.
    fs.chmodSync(tokenPath, 0o600);
  } catch {
    // Best effort.
  }
  return token;
}

/**
 * Constant-time compare two tokens. Returns `false` if lengths differ,
 * without doing an early-exit character compare.
 */
export function safeCompareToken(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Read an existing token file. Returns `null` if the file does not
 * exist or is empty. Does not create the file.
 */
export function readTokenIfExists(tokenPath: string = defaultTokenPath()): string | null {
  if (!fs.existsSync(tokenPath)) {
    return null;
  }
  const value = fs.readFileSync(tokenPath, 'utf-8').trim();
  return value.length > 0 ? value : null;
}
