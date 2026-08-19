/**
 * Sandbox Git-Write Detection
 *
 * On macOS's sandbox-exec mode (and analogous restricted environments),
 * git subcommands that mutate the working tree, index, refs, or config
 * can silently fail or succeed with unexpected write side-effects.
 * Upstream (kilocode) fixed this by escalating such commands through
 * the interactive permission prompt so the user is aware their sandbox
 * is about to be punched through.
 *
 * This module isolates the classification logic so the shell tool can
 * consult it without pulling in permission plumbing.
 */

/**
 * Git subcommands known to mutate the working tree, index, refs, or
 * configuration. This list is intentionally broad — the intent is
 * "when in doubt, escalate", not "only escalate on destructive
 * commands". Read-only subcommands (`log`, `status`, `diff`, `show`,
 * `ls-files`, `rev-parse`, …) are NOT included.
 */
const GIT_WRITE_SUBCOMMANDS: ReadonlySet<string> = new Set([
  'add',
  'am',
  'apply',
  'branch',
  'checkout',
  'cherry-pick',
  'clean',
  'commit',
  'config',
  'fetch',
  'gc',
  'init',
  'merge',
  'mv',
  'pull',
  'push',
  'rebase',
  'reflog',
  'remote',
  'reset',
  'restore',
  'revert',
  'rm',
  'stash',
  'submodule',
  'switch',
  'tag',
  'worktree',
]);

/**
 * Global-flag options that take a following argument (so we need to
 * skip two tokens, not one, when walking past them to find the
 * subcommand).
 */
const GIT_FLAGS_WITH_ARG = new Set(['-C', '-c', '--git-dir', '--work-tree']);

/**
 * Return true if `command` invokes a git subcommand that is known
 * to mutate repository state.
 *
 * Handles global-flag prefixes such as `git -C path subcommand ...`
 * and `git --git-dir=... subcommand ...` by walking past leading
 * options before checking the subcommand token.
 */
export function isGitWrite(command: string): boolean {
  const tokens = command.trim().split(/\s+/);
  if (tokens[0] !== 'git') {
    return false;
  }
  // Skip global flags like `git -C path subcommand`
  let i = 1;
  while (i < tokens.length && tokens[i]?.startsWith('-')) {
    // skip flag and its argument if it takes one
    if (GIT_FLAGS_WITH_ARG.has(tokens[i] as string)) {
      i += 2;
    } else {
      i += 1;
    }
  }
  const sub = tokens[i];
  return sub !== undefined && GIT_WRITE_SUBCOMMANDS.has(sub);
}

/**
 * Return true when a permission escalation is required for the
 * given command under a sandboxed shell. Only sandboxed git-write
 * commands trigger the prompt; everything else follows the normal
 * shell permission path.
 */
export function requiresSandboxEscalation(command: string, sandbox: boolean): boolean {
  return sandbox && isGitWrite(command);
}
