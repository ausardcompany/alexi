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
 *
 * Alexi_change (upstream 32aaae25d, 2da7e2bb7): hardened against masked
 * mutations — read-only-looking git invocations that carry a mutating
 * flag like `-c core.hooksPath=...`, `--exec-path`, `--upload-pack`,
 * `--receive-pack`, `--work-tree`, or `--git-dir`. Write-flag / masked-
 * mutation detection now runs BEFORE the read-only subcommand check so
 * write intent takes precedence over apparent read-only shape.
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
 * Flags that can mask a mutation inside an otherwise read-only-shaped
 * git invocation. `-c key=value` can override arbitrary git config
 * for the invocation (including `core.hooksPath` — a code-execution
 * vector). `--exec-path`, `--upload-pack`, `--receive-pack` all point
 * git at a caller-controlled binary. `--work-tree` / `--git-dir` re-
 * scope the operation onto a different repo the user did not intend
 * to touch.
 *
 * Any of these turn "read-only" into "not read-only" regardless of
 * the subcommand shape.
 */
const MASKED_MUTATION_FLAGS: ReadonlySet<string> = new Set([
  '-c',
  '--config',
  '--exec-path',
  '--upload-pack',
  '--receive-pack',
  '--work-tree',
  '--git-dir',
]);

/**
 * Expand short-flag clusters into individual flags. `-abc` becomes
 * `-a -b -c`; a numeric-tail short flag like `-n1` is preserved
 * verbatim because git's numeric short-flags (`-n<count>`) do not
 * split. Long flags (`--foo`) and non-flag tokens pass through
 * untouched.
 */
function expandShortFlagClusters(args: readonly string[]): string[] {
  return args.flatMap((arg) => {
    if (!arg.startsWith('-') || arg.startsWith('--')) {
      return [arg];
    }
    const chars = arg.slice(1);
    // Preserve `-n1`, `-C10`, etc. — numeric tail is a value, not a flag cluster.
    if (/\d/.test(chars)) {
      return [arg];
    }
    if (chars.length <= 1) {
      return [arg];
    }
    return chars.split('').map((c) => `-${c}`);
  });
}

/**
 * True when any argument (or its `--flag=value` head) matches a
 * masked-mutation flag.
 */
function hasMaskedMutation(args: readonly string[]): boolean {
  return args.some((a) => {
    const head = a.split('=')[0];
    return head !== undefined && MASKED_MUTATION_FLAGS.has(head);
  });
}

/**
 * Return true if `command` invokes a git subcommand that is known
 * to mutate repository state.
 *
 * Handles global-flag prefixes such as `git -C path subcommand ...`
 * and `git --git-dir=... subcommand ...` by walking past leading
 * options before checking the subcommand token.
 *
 * Also flags read-only-shaped subcommands as writes when they carry
 * a masked-mutation flag (`-c`, `--exec-path`, `--upload-pack`,
 * `--receive-pack`, `--work-tree`, `--git-dir`).
 */
export function isGitWrite(command: string): boolean {
  const tokens = command.trim().split(/\s+/);
  if (tokens[0] !== 'git') {
    return false;
  }

  const rest = tokens.slice(1);
  const expanded = expandShortFlagClusters(rest);

  // 1. Masked mutation: an otherwise read-only-shaped invocation with
  //    a mutating flag is treated as a write. Ordered FIRST so write
  //    intent wins over any read-only subcommand classification.
  if (hasMaskedMutation(expanded)) {
    return true;
  }

  // 2. Walk past leading global flags to find the subcommand token.
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
