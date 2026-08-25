/**
 * Shell ID Detection Module
 *
 * Detects the shell that will be used to execute commands from the bash /
 * shell tools. Historically this only read the `$SHELL` env var, which
 * hides the real behaviour on Windows (where `spawn(..., { shell: true })`
 * delegates to `%ComSpec%`, usually `cmd.exe`) and on macOS/Linux systems
 * where `$SHELL` is set to the login shell rather than the shell that
 * would be invoked by a child_process spawn.
 *
 * The `detectShell()` function below probes platform-specific candidate
 * paths (Cline PR #12331 pattern) and returns the first that actually
 * exists on disk. The result is cached for a short TTL so profile changes
 * (installing pwsh, switching login shell, ...) are picked up without
 * requiring a full restart.
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { PowerShell } from '../../../core/powershell.js';

export type ShellType = 'bash' | 'zsh' | 'fish' | 'powershell' | 'cmd' | 'sh' | 'unknown';

export interface ShellInfo {
  type: ShellType;
  path: string;
  version?: string;
}

// --- Legacy env-var-only detector (kept for backwards compatibility) ---

export async function detect(): Promise<ShellInfo> {
  const shell = process.env.SHELL || process.env.COMSPEC || '/bin/sh';
  const type = inferType(shell);
  return { type, path: shell };
}

function inferType(shellPath: string): ShellType {
  const name = shellPath.toLowerCase();
  if (name.includes('pwsh') || name.includes('powershell')) {
    return 'powershell';
  }
  if (name.includes('bash')) {
    return 'bash';
  }
  if (name.includes('zsh')) {
    return 'zsh';
  }
  if (name.includes('fish')) {
    return 'fish';
  }
  if (name.includes('cmd')) {
    return 'cmd';
  }
  if (name.endsWith('/sh') || name === 'sh') {
    return 'sh';
  }
  return 'unknown';
}

// --- Filesystem-probing detector (Cline PR #12331 pattern) ---

/**
 * Candidate shells probed on Windows, in priority order.
 * pwsh (PowerShell 7+) is preferred over the built-in Windows PowerShell
 * because it is the cross-platform successor and ships with saner UTF-8
 * defaults; both are preferred over `cmd.exe`.
 *
 * Paths are built with `path.win32.join` so they use backslashes
 * regardless of the host platform — this matters when a POSIX CI
 * runner spoofs `process.platform === 'win32'` for testing, and the
 * probe still needs to compare against real Windows paths.
 */
function windowsCandidates(): string[] {
  const winJoin = path.win32.join;
  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const localAppData = process.env['LOCALAPPDATA'] || winJoin(os.homedir(), 'AppData', 'Local');
  const systemRoot = process.env['SystemRoot'] || 'C:\\Windows';

  // Prefer PowerShell 7 (`pwsh.exe`) over legacy 5.1 (`powershell.exe`)
  // per kilocode `98ea338c8`. `PowerShell.pwsh()` first checks PATH and
  // then probes the known install roots, so pwsh installed off PATH
  // still wins over the always-present legacy shell. Any hits are
  // prepended to the hard-coded win32 candidate list below so behaviour
  // matches the previous version when pwsh is not installed.
  const pwshHits = [PowerShell.pwsh(), ...PowerShell.probe()].filter((item): item is string =>
    Boolean(item)
  );

  return [
    ...pwshHits,
    winJoin(programFiles, 'PowerShell', '7', 'pwsh.exe'),
    winJoin(programFilesX86, 'PowerShell', '7', 'pwsh.exe'),
    winJoin(localAppData, 'Microsoft', 'WindowsApps', 'pwsh.exe'),
    winJoin(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
    winJoin(systemRoot, 'System32', 'cmd.exe'),
  ];
}

/**
 * Candidate shells probed on macOS/Linux, in priority order.
 * zsh is the default on modern macOS and increasingly common on Linux;
 * bash is the traditional fallback; sh is the last-resort POSIX shell.
 * The user's login shell (from `$SHELL`) is tried before hard-coded
 * paths so container/toolbox setups that install shells to non-standard
 * prefixes are respected.
 */
function posixCandidates(): string[] {
  const envShell = process.env.SHELL;
  const candidates = [
    envShell,
    '/bin/zsh',
    '/usr/bin/zsh',
    '/usr/local/bin/zsh',
    '/opt/homebrew/bin/zsh',
    '/bin/bash',
    '/usr/bin/bash',
    '/usr/local/bin/bash',
    '/opt/homebrew/bin/bash',
    '/bin/sh',
    '/usr/bin/sh',
  ];
  return candidates.filter((c): c is string => typeof c === 'string' && c.length > 0);
}

/**
 * Cached detection result. Keyed by platform + candidate list to keep the
 * key stable across an individual process while still invalidating if the
 * environment changes (e.g. a test suite mutates `process.platform`).
 */
interface CachedShell {
  key: string;
  info: ShellInfo;
  expiresAt: number;
}

const DETECT_TTL_MS = 30_000;
let cache: CachedShell | undefined;

/**
 * Default filesystem existence probe. Isolated behind an indirection so
 * tests (which cannot easily spy on ESM `node:fs` exports) can override
 * it via `_setFsProbeForTests`.
 */
type FsProbe = (p: string) => boolean;
let fsProbe: FsProbe = (p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};

/**
 * Test hook: drop the cached detection result. Do not call from
 * production code paths.
 */
export function _resetDetectShellCacheForTests(): void {
  cache = undefined;
}

/**
 * Test hook: replace the filesystem probe used by `detectShell`. Passing
 * `undefined` restores the default `fs.existsSync`-backed probe. Do not
 * call from production code paths.
 */
export function _setFsProbeForTests(probe?: FsProbe): void {
  fsProbe = probe
    ? probe
    : (p) => {
        try {
          return fs.existsSync(p);
        } catch {
          return false;
        }
      };
}

/**
 * Probe the filesystem for a real shell binary and return it. Result is
 * cached for `DETECT_TTL_MS` so callers can invoke it per-request without
 * paying the `existsSync` cost every time, while still noticing when the
 * user installs pwsh or edits `$SHELL` mid-session.
 *
 * The Cline PR #12331 pattern deliberately favours `pwsh.exe` over the
 * classic `powershell.exe`, and `zsh` over `bash` on macOS, so the tool
 * description shown to the LLM matches the shell the OS will actually
 * dispatch to.
 */
export function detectShell(): ShellInfo {
  const platform = process.platform;
  const candidates = platform === 'win32' ? windowsCandidates() : posixCandidates();
  const key = `${platform}|${candidates.join(':')}`;

  const now = Date.now();
  if (cache && cache.key === key && cache.expiresAt > now) {
    return cache.info;
  }

  let picked: string | undefined;
  for (const candidate of candidates) {
    if (fsProbe(candidate)) {
      picked = candidate;
      break;
    }
  }

  // Final fallback: whatever the OS thinks the default is. This still
  // gives us a sensible `type` even when none of the probed paths exist
  // (for example in a hyper-minimal container that only has BusyBox).
  if (!picked) {
    picked =
      platform === 'win32' ? process.env.COMSPEC || 'cmd.exe' : process.env.SHELL || '/bin/sh';
  }

  const info: ShellInfo = { type: inferType(picked), path: picked };
  cache = { key, info, expiresAt: now + DETECT_TTL_MS };
  return info;
}

/**
 * Return `{ file, prefixArgs, suffixArgs? }` suitable for
 * `spawn(file, [...prefixArgs, userCommand, ...suffixArgs], { shell: false })`
 * to invoke a single command string in the detected shell. Callers pass
 * the user command AFTER the `prefixArgs` and BEFORE the `suffixArgs`,
 * so the user's script text remains byte-identical (no in-place mutation
 * of the command string).
 *
 * PowerShell requires `-Command` (or `-c` shorthand) rather than the
 * POSIX `-c`, and expects the command as a single argument.
 * cmd.exe uses `/d /s /c "<cmd>"`. Everything else uses `-c`.
 *
 * PowerShell fail-fast semantics (Cline PR #13358 pattern for
 * https://github.com/cline/cline/issues/13285): the `-Command` bootstrap
 * sets `$ErrorActionPreference='Stop'` BEFORE invoking the user script
 * as a scriptblock via `& { <user command> }`. This gives the invoked
 * scriptblock fail-fast semantics (first non-terminating error
 * terminates with a non-zero exit and a single error record) while
 * keeping the user command:
 *   - byte-identical (not string-mutated by us; passed as its own arg
 *     that PowerShell joins between the opening `& {` and closing `}`),
 *   - `param(...)`-compatible (param stays first-statement inside the
 *     scriptblock braces, so scripts starting with `param($x = 5)` still
 *     work — a plain top-level prepend would displace `param` and fail
 *     with CommandNotFoundException),
 *   - opt-out-able per-cmdlet with `-ErrorAction Continue` /
 *     `-ErrorAction SilentlyContinue`, or globally by reassigning
 *     `$ErrorActionPreference` inside the user script.
 *
 * Precedent: GitHub Actions prepends `$ErrorActionPreference = 'stop'`
 * to every `powershell` / `pwsh` step
 * (https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsshell),
 * so model-authored PowerShell commands already run under these
 * semantics in CI. Aligning the bash tool matches that contract.
 *
 * Deliberate tradeoffs (documented so the tradeoff is chosen, not
 * accidental):
 *   - `Stop` promotes every non-terminating error, not just per-item
 *     pipeline floods. `Get-ChildItem -Recurse` crossing an
 *     access-denied junction ("Application Data", "System Volume
 *     Information") now aborts at the first denial with truncated
 *     output and exit 1, where it previously completed with warnings.
 *     Users who need partial results should add `-ErrorAction Continue`
 *     to the specific cmdlet.
 *   - On Windows PowerShell 5.1, in-script stderr redirection (`2>&1`,
 *     `2>file`) of a succeeding native command wraps each stderr line
 *     in a `NativeCommandError`; under `Stop` the first one terminates
 *     the script. PowerShell 7.2+ exempts native stderr from the
 *     preference (PowerShell/PowerShell#3996, #14273). This matches
 *     GitHub Actions behaviour on 5.1 today.
 */
export function shellSpawnArgs(info: ShellInfo): {
  file: string;
  prefixArgs: string[];
  suffixArgs?: string[];
} {
  switch (info.type) {
    case 'powershell':
      // Bootstrap prelude: set fail-fast preference at the -Command
      // scope, then open a scriptblock `& { ` that PowerShell will
      // close with the trailing `}` suffix arg once it joins all
      // -Command arguments. The user command sits verbatim between
      // the opening brace and the closing brace, so `param(...)` still
      // occupies first-statement position inside the scriptblock.
      return {
        file: info.path,
        prefixArgs: ['-NoProfile', '-Command', "$ErrorActionPreference='Stop'; & {"],
        suffixArgs: ['}'],
      };
    case 'cmd':
      return { file: info.path, prefixArgs: ['/d', '/s', '/c'] };
    default:
      return { file: info.path, prefixArgs: ['-c'] };
  }
}
