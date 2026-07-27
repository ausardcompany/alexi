/**
 * docs-sync: verification module.
 *
 * Runs the project's build + test gates against the working tree of the
 * bot-authored docs branch. When they fail, an optional single "fix pass"
 * (typically a bounded `kilo run` invocation) is executed and the gates are
 * rerun once. The result is machine-readable so the upsert step can decide
 * whether to mark the PR as draft.
 *
 * The runner and fix pass are injectable so tests can mock process spawning
 * without touching real child processes.
 */

export interface CommandResult {
  /** Exit code of the child process (0 = success). */
  exitCode: number;
  /** Combined stdout+stderr, best-effort. */
  output: string;
}

/** Runs a shell command and resolves once the child process exits. */
export type CommandRunner = (command: string, args: readonly string[]) => Promise<CommandResult>;

/**
 * Attempts a single autonomous fix pass on the working tree. Should resolve
 * once the fix attempt has been made (regardless of outcome). The subsequent
 * gate run decides whether the fix actually helped.
 */
export type FixPass = (context: { failedCommand: string; output: string }) => Promise<void>;

export interface VerifyBuildOptions {
  /** Command runner used to spawn build + test processes. */
  run: CommandRunner;
  /**
   * Optional fix pass. When omitted, `verifyBuild` returns after the first
   * failure without retrying.
   */
  fix?: FixPass;
  /**
   * Ordered list of gate commands. Defaults to `npm run build` followed by
   * `npm run test`. Each entry is `[command, ...args]`.
   */
  gates?: readonly (readonly [string, ...string[]])[];
}

export interface VerifyBuildResult {
  /** True when every gate passed (possibly after a fix pass). */
  success: boolean;
  /** True when the fix pass was invoked at least once. */
  fixAttempted: boolean;
  /** Which gate command failed, if any (empty when success is true). */
  failedCommand: string;
  /** Tail of the last failed gate's output; empty on success. */
  failedOutput: string;
}

const DEFAULT_GATES: readonly (readonly [string, ...string[]])[] = [
  ['npm', 'run', 'build'],
  ['npm', 'run', 'test'],
] as const;

/** Formats a gate tuple back into a printable command string. */
function formatCommand(gate: readonly [string, ...string[]]): string {
  return gate.join(' ');
}

/**
 * Runs every gate command in order. Returns the first failure encountered, or
 * a success sentinel when all gates pass.
 */
async function runGates(
  gates: readonly (readonly [string, ...string[]])[],
  run: CommandRunner
): Promise<{ success: true } | { success: false; command: string; output: string }> {
  for (const gate of gates) {
    const [cmd, ...args] = gate;
    const result = await run(cmd, args);
    if (result.exitCode !== 0) {
      return { success: false, command: formatCommand(gate), output: result.output };
    }
  }
  return { success: true };
}

/**
 * Verifies the docs branch by running the configured gates. On failure a
 * single fix pass may run, followed by exactly one retry. Callers observe the
 * outcome via {@link VerifyBuildResult}.
 */
export async function verifyBuild(options: VerifyBuildOptions): Promise<VerifyBuildResult> {
  const gates = options.gates ?? DEFAULT_GATES;
  if (gates.length === 0) {
    return { success: true, fixAttempted: false, failedCommand: '', failedOutput: '' };
  }

  const first = await runGates(gates, options.run);
  if (first.success) {
    return { success: true, fixAttempted: false, failedCommand: '', failedOutput: '' };
  }

  if (!options.fix) {
    return {
      success: false,
      fixAttempted: false,
      failedCommand: first.command,
      failedOutput: first.output,
    };
  }

  await options.fix({ failedCommand: first.command, output: first.output });

  const second = await runGates(gates, options.run);
  if (second.success) {
    return { success: true, fixAttempted: true, failedCommand: '', failedOutput: '' };
  }
  return {
    success: false,
    fixAttempted: true,
    failedCommand: second.command,
    failedOutput: second.output,
  };
}
