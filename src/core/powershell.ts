/**
 * PowerShell shell wrapper for Windows hosts.
 *
 * kilocode_change - rollback of PR #13365 (support-configurable-powershell-shell):
 * upstream reverted the `pwsh` probe (commit `a15d25359`) because active
 * probing of PowerShell 7 install roots caused Windows startup issues.
 * The previous rich version of this module (filesystem probes into
 * `%ProgramFiles%\PowerShell\7\pwsh.exe`, etc.) has been simplified back
 * to a single `args` helper. Callers wanting `pwsh` should now go through
 * `which("pwsh")` on the shared resolver path instead of relying on
 * this module to probe install roots.
 *
 * The kept surface (`args`) is intentionally minimal: it wraps a shell
 * command in the invocation flags required for a non-interactive pwsh
 * child process. Everything else is the caller's responsibility.
 */

/**
 * Wrap a shell command in `pwsh` invocation flags. Callers get back an
 * argv array ready to feed into `spawn`.
 */
export function args(command: string): string[] {
  return ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', command];
}

export const PowerShell = { args };
