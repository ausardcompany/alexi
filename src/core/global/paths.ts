/**
 * State Directory Resolution with Writability Probing
 *
 * SAP AI Core deployments (containers, restricted user profiles, VS Code
 * Server on Windows) frequently run in environments where the preferred
 * state directory — usually `$XDG_STATE_HOME/alexi` — is unwritable.
 * Previously the CLI would crash on startup with an opaque EACCES /
 * EROFS. This module probes writability and transparently falls back
 * to a secondary location (typically `<dataDir>/state`) before giving
 * up, mirroring the kilocode upstream fix for issue #13115.
 *
 * The fallback is **sticky**: once selected it is preferred on subsequent
 * runs so the resolved state directory does not flap between locations
 * across restarts.
 */

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Create the given directory (and any parents), then resolve any
 * symlink so callers get the real path back. Mirrors the semantics
 * of the kilocode `ensureRealDir` helper.
 */
async function ensureRealDir(p: string): Promise<string> {
  await fs.mkdir(p, { recursive: true });
  return fs.realpath(p);
}

/**
 * Probe write access by creating an exclusive-mode temp file, then
 * removing it. Throws if the directory is not writable by this
 * process. Uses `wx` so a stale probe file from a crashed run cannot
 * mask a real permission problem.
 */
async function writable(p: string): Promise<void> {
  const probe = path.join(p, `.alexi-write-${process.pid}-${randomUUID()}`);
  await fs.writeFile(probe, '', { flag: 'wx', mode: 0o600 });
  await fs.unlink(probe);
}

/**
 * Ensure the directory exists AND is writable by the current process.
 */
async function ready(p: string): Promise<void> {
  await ensureRealDir(p);
  await writable(p);
}

/**
 * Resolve a state directory, preferring `preferred` but falling back
 * to `fallback` if the preferred location is not usable.
 *
 * Sticky-fallback behaviour: if `fallback` already exists AND is
 * writable, it is returned immediately (even when `preferred` would
 * also work). This avoids flapping between the two locations across
 * restarts once a fallback has been chosen.
 *
 * When `fallback` is undefined, any failure to prepare `preferred`
 * propagates to the caller.
 */
export async function resolveState(preferred: string, fallback?: string): Promise<string> {
  // Sticky: if the fallback already exists and is writable, keep using it
  // to avoid flapping between locations across restarts.
  const sticky =
    fallback === undefined
      ? false
      : await fs.stat(fallback).then(
          async (stat) => {
            if (!stat.isDirectory()) {
              return false;
            }
            return writable(fallback).then(
              () => true,
              () => false
            );
          },
          () => false
        );
  if (sticky && fallback !== undefined) {
    return fallback;
  }

  const err = await ready(preferred).then(
    () => undefined,
    (e: unknown) => e
  );
  if (err === undefined) {
    return preferred;
  }
  if (fallback === undefined) {
    throw err;
  }

  const failed = await ready(fallback).then(
    () => undefined,
    (e: unknown) => e
  );
  if (failed !== undefined) {
    throw failed;
  }
  return fallback;
}

/**
 * Convenience wrapper: given the Alexi data root (typically
 * `<home>/.alexi`) and an optional preferred state dir (typically
 * `$XDG_STATE_HOME/alexi`), return a writable state directory,
 * falling back to `<data>/state`.
 *
 * When `$XDG_STATE_HOME` was explicitly set by the user, no fallback
 * is provided — the user's explicit choice wins and any failure is
 * surfaced rather than silently redirected.
 */
export async function resolveStateDir(dataDir: string, preferred: string): Promise<string> {
  const fallback = process.env.XDG_STATE_HOME ? undefined : path.join(dataDir, 'state');
  return resolveState(preferred, fallback);
}
