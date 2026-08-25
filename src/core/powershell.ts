/**
 * PowerShell resolver for Windows hosts.
 *
 * Ports kilocode `98ea338c8` — prefer PowerShell 7 (`pwsh.exe`) over
 * the legacy Windows PowerShell 5.1 (`powershell.exe`). PS 5.1 has
 * known UTF-8 / encoding bugs that garble tool output (redirected pipes
 * lose non-ASCII characters, `Out-File` defaults to UTF-16 with BOM,
 * etc.), which surfaces in Alexi as broken diff and grep output on
 * Windows hosts.
 *
 * Detection strategy (first hit wins):
 *   1. `pwsh` on PATH via `which`.
 *   2. Known install roots: `%ProgramFiles%\PowerShell\7\pwsh.exe`,
 *      `%ProgramFiles(x86)%\PowerShell\7\pwsh.exe`,
 *      `%LOCALAPPDATA%\Microsoft\WindowsApps\pwsh.exe` (the Store alias).
 *
 * The probe is filesystem-only (no process spawn), so it is safe to
 * call from cold paths.
 */

import { statSync } from 'node:fs';
import path from 'node:path';

function which(command: string, env: NodeJS.ProcessEnv = process.env): string | undefined {
  const pathVar = env.PATH || env.Path || env.path;
  if (!pathVar) {
    return undefined;
  }
  const pathExts =
    process.platform === 'win32'
      ? (env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
      : [''];
  const separator = process.platform === 'win32' ? ';' : ':';
  for (const dir of pathVar.split(separator)) {
    if (!dir) {
      continue;
    }
    for (const ext of pathExts) {
      const candidate = path.join(dir, command + ext);
      const stat = statSync(candidate, { throwIfNoEntry: false });
      if (stat?.isFile()) {
        return candidate;
      }
    }
  }
  return undefined;
}

/**
 * Wrap a shell command in `pwsh` invocation flags. Callers get back an
 * argv array ready to feed into `spawn`.
 */
export function args(command: string): string[] {
  return ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', command];
}

/**
 * Candidate absolute paths where PowerShell 7 (`pwsh.exe`) is commonly
 * installed by the MSI, MSIX and Store installers respectively. All
 * env lookups are performed against the provided `env` map so tests can
 * inject a synthetic environment without mutating `process.env`.
 */
export const locations = (env: NodeJS.ProcessEnv = process.env): string[] =>
  [
    env['ProgramFiles'] && path.join(env['ProgramFiles'], 'PowerShell', '7'),
    env['ProgramFiles(x86)'] && path.join(env['ProgramFiles(x86)'], 'PowerShell', '7'),
    env['LOCALAPPDATA'] && path.join(env['LOCALAPPDATA'], 'Microsoft', 'WindowsApps'),
  ]
    .filter((item): item is string => Boolean(item))
    .map((root) => path.join(root, 'pwsh.exe'));

/**
 * Filesystem-probe the known install locations and return the ones
 * that actually exist as files. Missing entries are silently dropped.
 */
export const probe = (env: NodeJS.ProcessEnv = process.env): string[] =>
  locations(env).filter((file) => statSync(file, { throwIfNoEntry: false })?.isFile());

/**
 * Return the best `pwsh.exe` we can find, or `undefined` when PS 7 is
 * not installed anywhere we know to look. Callers use this as the
 * first candidate before falling back to legacy `powershell.exe`.
 */
export const pwsh = (env: NodeJS.ProcessEnv = process.env): string | undefined =>
  which('pwsh', env) ?? probe(env)[0];

export const PowerShell = { args, locations, probe, pwsh };
