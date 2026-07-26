/**
 * Shell Environment Probe
 *
 * Complements `./id.ts` (which resolves *which* shell will be used) by
 * capturing runtime environment information about that shell that is
 * useful for the LLM when generating commands: the shell version, a
 * short summary of `$PATH`, and which of a small set of common tools
 * (`git`, `gh`, `npm`, `node`, `docker`, `kubectl`) are actually
 * installed on the runner.
 *
 * Motivated by issue #1123 / Cline PR #12331: when a shell command
 * fails because a tool is missing or a shell built-in doesn't behave
 * the way the model expected, giving the model an accurate snapshot of
 * the environment lets it fix the command in the next turn instead of
 * repeatedly failing.
 *
 * Design notes:
 * - Version detection uses `spawnSync` with a short timeout so a broken
 *   shell binary cannot hang description-building indefinitely. The
 *   first line of stdout is captured verbatim (bash prints
 *   `GNU bash, version 5.1.16(1)-release ...`, zsh prints `zsh 5.9 ...`,
 *   pwsh prints `PowerShell 7.4.0`). If the probe fails we return
 *   `undefined` rather than throwing — description-building must never
 *   crash because a probe returned a non-zero exit code.
 * - Tool detection walks `process.env.PATH` entries and checks each
 *   candidate name against `fs.existsSync(join(dir, name[+ext]))`. No
 *   subprocess is spawned per tool; this keeps the probe cheap enough
 *   to run per-tool-description without blocking the event loop.
 * - Results are cached for `PROBE_TTL_MS` so a busy session doesn't
 *   re-shell-out repeatedly. The cache is keyed by the shell path and
 *   the current `PATH` so profile changes are picked up. Test hooks
 *   allow the cache and both probes to be overridden.
 */

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { detectShell, type ShellInfo, type ShellType } from './id.js';

/**
 * Runtime snapshot of the shell environment. All fields are optional
 * except `shell` and `availableTools` (which may be empty). Callers
 * that render descriptions should tolerate missing fields gracefully.
 */
export interface ShellEnv {
  /** The detected shell (identity + path). */
  shell: ShellInfo;
  /**
   * First line of the shell's `--version` (or equivalent) output, if
   * the probe succeeded. Trimmed and never contains newlines.
   */
  version?: string;
  /**
   * The first `PATH_SUMMARY_ENTRIES` entries of `process.env.PATH`,
   * split on the platform separator. Rendered into the description so
   * the model can reason about where commands will resolve from
   * (e.g. `/opt/homebrew/bin` present -> Homebrew tools available).
   */
  pathSummary: string[];
  /**
   * Which of `COMMON_TOOLS` are present on `PATH`. Order matches
   * `COMMON_TOOLS` for stable output. May be empty on minimal images.
   */
  availableTools: string[];
}

/**
 * The set of common developer tools we probe for. Chosen to match the
 * issue #1123 acceptance criteria and to cover the majority of shell
 * commands agents actually generate. Kept short deliberately — every
 * additional name costs a filesystem existence check per PATH entry.
 */
export const COMMON_TOOLS: readonly string[] = ['git', 'gh', 'npm', 'node', 'docker', 'kubectl'];

/**
 * Number of `PATH` entries surfaced in the description. Anything beyond
 * this is elided with a `(+N more)` suffix so the description stays
 * readable and cache-friendly.
 */
export const PATH_SUMMARY_ENTRIES = 5;

/** Cache TTL. Matches the shell-id detector so both caches age in step. */
const PROBE_TTL_MS = 30_000;

/**
 * Version probe timeout. Deliberately short: a healthy shell responds
 * to `--version` in <100ms; anything slower is almost certainly a
 * broken PATH entry or a hung binary we should not wait for.
 */
const VERSION_PROBE_TIMEOUT_MS = 500;

interface CachedEnv {
  key: string;
  env: ShellEnv;
  expiresAt: number;
}

let cache: CachedEnv | undefined;

/** Default version probe: shells out to `<shell> --version`. */
type VersionProbe = (shell: ShellInfo) => string | undefined;
let versionProbe: VersionProbe = defaultVersionProbe;

/** Default tool probe: `fs.existsSync` walk over `PATH`. */
type ToolProbe = (name: string, pathEntries: readonly string[]) => boolean;
let toolProbe: ToolProbe = defaultToolProbe;

/**
 * Shells that speak POSIX `--version`. PowerShell also accepts
 * `-Version` but the flag capitalisation varies across releases; we
 * use `$PSVersionTable.PSVersion.ToString()` via `-NoProfile -Command`
 * for reliability.
 */
function versionArgs(type: ShellType): string[] {
  switch (type) {
    case 'powershell':
      return ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'];
    case 'cmd':
      // cmd.exe has no version subcommand; `ver` prints the OS version.
      return ['/d', '/s', '/c', 'ver'];
    default:
      return ['--version'];
  }
}

function defaultVersionProbe(shell: ShellInfo): string | undefined {
  try {
    const result = spawnSync(shell.path, versionArgs(shell.type), {
      timeout: VERSION_PROBE_TIMEOUT_MS,
      encoding: 'utf-8',
      windowsHide: true,
      // Isolate the probe from parent stdio; we only need stdout.
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (result.error || typeof result.stdout !== 'string') {
      return undefined;
    }
    const firstLine = result.stdout.split(/\r?\n/).find((l) => l.trim().length > 0);
    return firstLine?.trim();
  } catch {
    return undefined;
  }
}

/**
 * Split `process.env.PATH` (or `Path` on Windows) into a clean array
 * of directory entries. Falls back to the empty list if PATH is
 * missing entirely (unusual — most runners always set it).
 */
export function splitPath(rawPath: string | undefined = process.env.PATH): string[] {
  if (!rawPath) {
    return [];
  }
  const sep = process.platform === 'win32' ? ';' : ':';
  return rawPath
    .split(sep)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/**
 * Executable extensions probed on Windows. On POSIX we check the bare
 * name (no extension), matching how the shell would resolve it.
 */
function executableCandidates(name: string): string[] {
  if (process.platform !== 'win32') {
    return [name];
  }
  const rawExts = process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD';
  const exts = rawExts
    .split(';')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
  return [name, ...exts.map((ext) => `${name}${ext}`)];
}

function defaultToolProbe(name: string, pathEntries: readonly string[]): boolean {
  const candidates = executableCandidates(name);
  for (const dir of pathEntries) {
    for (const candidate of candidates) {
      const full = path.join(dir, candidate);
      try {
        if (fs.existsSync(full)) {
          return true;
        }
      } catch {
        // Continue — an unreadable PATH entry (permissions, dead
        // symlink) must not abort the probe.
      }
    }
  }
  return false;
}

/**
 * Test hook: drop the cached probe result. Do not call from production
 * code paths.
 */
export function _resetShellEnvCacheForTests(): void {
  cache = undefined;
}

/**
 * Test hook: replace the version probe. Pass `undefined` to restore
 * the default `spawnSync`-based probe.
 */
export function _setVersionProbeForTests(probe?: VersionProbe): void {
  versionProbe = probe ?? defaultVersionProbe;
}

/**
 * Test hook: replace the tool-existence probe. Pass `undefined` to
 * restore the default `fs.existsSync`-based probe.
 */
export function _setToolProbeForTests(probe?: ToolProbe): void {
  toolProbe = probe ?? defaultToolProbe;
}

/**
 * Detect the shell environment. Cheap on cache hit; on a cache miss
 * performs one version probe (bounded by `VERSION_PROBE_TIMEOUT_MS`)
 * and up to `COMMON_TOOLS.length * pathEntries.length` filesystem
 * existence checks. Both are cached for `PROBE_TTL_MS`.
 *
 * Callers usually don't need to pass `shell` — `detectShell()` is
 * called for them. The parameter exists for tests and for callers
 * that want to describe a specific shell without re-probing.
 */
export function detectShellEnv(shell: ShellInfo = detectShell()): ShellEnv {
  const pathEntries = splitPath();
  const key = `${shell.type}|${shell.path}|${pathEntries.join(':')}`;

  const now = Date.now();
  if (cache && cache.key === key && cache.expiresAt > now) {
    return cache.env;
  }

  const version = versionProbe(shell);
  const availableTools = COMMON_TOOLS.filter((tool) => toolProbe(tool, pathEntries));
  const pathSummary = pathEntries.slice(0, PATH_SUMMARY_ENTRIES);

  const env: ShellEnv = {
    shell: version ? { ...shell, version } : shell,
    version,
    pathSummary,
    availableTools,
  };

  cache = { key, env, expiresAt: now + PROBE_TTL_MS };
  return env;
}

/**
 * Render the environment summary that gets prepended to the bash /
 * shell tool description. Kept as a separate function so the bash and
 * shell tools can share exactly the same wording.
 *
 * The returned string is either a single line ("Environment: ...") or
 * empty when we know nothing beyond the shell type (in which case the
 * caller falls back to its existing static preamble). Newlines inside
 * the summary are avoided so the resulting description is
 * cache-friendly.
 */
export function formatShellEnvSummary(env: ShellEnv): string {
  const parts: string[] = [];

  if (env.version) {
    parts.push(`shell: ${env.version}`);
  } else {
    parts.push(`shell: ${env.shell.type}`);
  }

  if (env.pathSummary.length > 0) {
    const shown = env.pathSummary.join(process.platform === 'win32' ? ';' : ':');
    const total = splitPath().length;
    const suffix =
      total > env.pathSummary.length ? ` (+${total - env.pathSummary.length} more)` : '';
    parts.push(`PATH: ${shown}${suffix}`);
  }

  if (env.availableTools.length > 0) {
    parts.push(`Available tools: ${env.availableTools.join(', ')}`);
  }

  return `Environment: ${parts.join('. ')}.`;
}
