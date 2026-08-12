/**
 * Agent Config Permission Expansion
 *
 * Ports the kilocode upstream fix that introduces `expandPermissions` to
 * normalize agent permission entries against `$HOME`, and expands the
 * set of recognized path actions to include `external_directory`,
 * `read`, and `edit`.
 *
 * Why this matters for Alexi: users author agent config files that
 * mention permissions like:
 *   { action: 'read',  path: '~/notes' }
 *   { action: 'edit',  path: './src' }
 *   { action: 'external_directory', path: '~/customer-data' }
 *
 * Without normalization, `~/notes` reaches the permission matcher as a
 * literal `"~/notes"` string and never matches an absolute path. The
 * `read`/`edit`/`external_directory` action names must also be
 * recognized here so the loader doesn't silently drop them. Rules with
 * an unrecognised action pass through unchanged.
 */

import path from 'path';
import os from 'os';

/**
 * The set of path-shaped permission actions whose `path` field must be
 * normalized against `$HOME`. Non-path actions (e.g. `execute`,
 * `network`) pass through untouched — their `path`/`resource` field is
 * a command or host, not a filesystem location.
 */
export const PATH_ACTIONS = ['external_directory', 'read', 'edit'] as const;

export type PathAction = (typeof PATH_ACTIONS)[number];

/**
 * A permission entry as it appears in an agent config file. Kept
 * intentionally loose (structural) so this helper doesn't force a
 * particular schema on callers — the concrete Zod schema lives in
 * `src/permission/index.ts` (`PermissionRuleSchema`).
 */
export interface AgentPermissionEntry {
  action: string;
  path?: string;
  [key: string]: unknown;
}

/**
 * Normalize a single permission path. Rules:
 *  - `~` and `~/...` resolve against `home`.
 *  - Absolute paths pass through untouched.
 *  - Relative paths pass through untouched (they resolve at match time
 *    against the workspace, not the user's home directory).
 */
export function normalizePermissionPath(p: string, home: string): string {
  if (p === '~') {
    return home;
  }
  if (p.startsWith('~/')) {
    return path.join(home, p.slice(2));
  }
  return p;
}

/**
 * Return a new array of permission entries with the `path` field
 * normalized for every entry whose `action` is in {@link PATH_ACTIONS}.
 * Other entries pass through by reference so callers can rely on
 * shallow equality when nothing needs normalizing.
 *
 * Never mutates its input.
 */
export function expandPermissions<T extends AgentPermissionEntry>(
  entries: ReadonlyArray<T>,
  home: string = os.homedir()
): T[] {
  return entries.map((entry) => {
    if (!(PATH_ACTIONS as readonly string[]).includes(entry.action)) {
      return entry;
    }
    if (typeof entry.path !== 'string') {
      return entry;
    }
    return { ...entry, path: normalizePermissionPath(entry.path, home) };
  });
}
