/**
 * Session-scoped temp directory helper for cloud / sandboxed sessions.
 *
 * Cloud sessions enforce an `external_directory` allowlist that permits
 * only `/tmp/<SESSION_ID>/**` (plus a handful of session-scoped roots)
 * and denies everything else. Without this helper the shell tool prompt
 * would advertise `os.tmpdir()` (which follows `TMPDIR` and typically
 * points at the shared `/tmp` root), and the model would attempt writes
 * to denied paths — producing confusing permission errors on every
 * tool call.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/tool/shell-tmp.ts`.
 * The gate is `KILO_CLOUD_AGENT` + a validated `SESSION_ID`; when either
 * is absent (the default for every local SAP AI Core run) the helper
 * returns the OS temp dir unchanged so there is zero behavioural change
 * for the normal CLI path.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The allowlist root is the literal `/tmp`, NOT `os.tmpdir()`:
// `os.tmpdir()` follows `TMPDIR`, so deriving from it could point the
// model back at a denied path if that override ever reaches the server
// process.
const ALLOWLIST_ROOT = '/tmp';

/**
 * Fallback temp directory used when the cloud-session gate is off or
 * the session id is missing / invalid. Mirrors `Global.Path.tmp` from
 * the upstream opencode implementation.
 */
function defaultTmp(): string {
  return os.tmpdir();
}

/**
 * Return the temp directory the shell tool prompt should advertise.
 *
 * - Returns the per-session dir `/tmp/<SESSION_ID>/` when running under
 *   `KILO_CLOUD_AGENT=1` / `KILO_CLOUD_AGENT=true` AND `SESSION_ID` is
 *   a safe shell-free identifier (matches `/^[A-Za-z0-9_-]+$/`).
 * - Returns the OS temp dir otherwise.
 *
 * The directory is created with mode `0o700` and verified via `lstat`
 * (not `stat`) so a pre-existing symlink cannot redirect the advertised
 * dir outside the allowlist.
 */
export function sessionTmp(): string {
  const cloud = process.env['KILO_CLOUD_AGENT']?.toLowerCase();
  if (cloud !== 'true' && cloud !== '1') {
    return defaultTmp();
  }
  const session = process.env.SESSION_ID;
  if (!session || !/^[A-Za-z0-9_-]+$/.test(session)) {
    return defaultTmp();
  }
  const dir = path.join(ALLOWLIST_ROOT, session);
  try {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    // lstat, not stat: a pre-existing symlink must not redirect the
    // advertised dir outside the allowlist root.
    if (!fs.lstatSync(dir).isDirectory()) {
      return defaultTmp();
    }
    return dir;
  } catch {
    return defaultTmp();
  }
}
