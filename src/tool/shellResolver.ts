/**
 * Shell Resolver
 *
 * Thin, tool-facing helper that returns the shell the bash tool will
 * actually dispatch to, in the shape `{ shell, name }`. The heavy
 * filesystem probing lives in `./tools/shell/id.ts` (Cline PR #12331
 * pattern); this module re-exports a stable API that other tool code
 * — and the bash tool's description builder in particular — can rely
 * on without pulling in the deeper `ShellInfo` type.
 *
 * The public surface is intentionally minimal:
 *
 *   resolveShell(): { shell: string; name: string }
 *
 * `shell` is the absolute path of the resolved shell binary (e.g.
 * `/bin/zsh`); `name` is the short shell identifier the LLM cares
 * about when picking syntax (`bash`, `zsh`, `fish`, `sh`, `powershell`,
 * `cmd`, `unknown`).
 *
 * Rationale for a wrapper rather than a direct re-export: callers
 * across `src/tool/` should not have to import from
 * `./tools/shell/id.js` (which is technically an implementation detail
 * of the bash/shell tools). Keeping the resolver at
 * `src/tool/shellResolver.ts` keeps the import graph flat and matches
 * the shape specified in issue #1181.
 */

import { detectShell, _resetDetectShellCacheForTests, type ShellType } from './tools/shell/id.js';

export interface ResolvedShell {
  /** Absolute path of the shell binary (e.g. `/bin/zsh`, `C:\\Windows\\System32\\cmd.exe`). */
  shell: string;
  /** Short shell identifier the LLM uses to pick syntax. */
  name: ShellType;
}

/**
 * Detect the shell the bash tool will spawn.
 *
 * Reads `process.env.SHELL` on POSIX / `%ComSpec%` on Windows, probes
 * a small list of well-known candidates via `fs.existsSync`, and falls
 * back to `/bin/sh` (POSIX) or `cmd.exe` (Windows) when nothing else
 * matches. Result is cached inside `detectShell()` for a short TTL so
 * repeated calls per request are cheap.
 *
 * This function itself does not cache; call it as often as needed.
 */
export function resolveShell(): ResolvedShell {
  const info = detectShell();
  return { shell: info.path, name: info.type };
}

/**
 * Test hook: clear the underlying detection cache so a subsequent
 * `resolveShell()` re-probes the filesystem. Do not call from
 * production code.
 */
export function _resetShellResolverCacheForTests(): void {
  _resetDetectShellCacheForTests();
}
