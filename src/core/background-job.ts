/**
 * Background job output preservation.
 *
 * Ports upstream kilocode fix #13469 (opencode `packages/core/src/background-job.ts`):
 * when an extended background run returns an empty string, that empty result
 * must NOT clobber the earlier non-empty output. Only the latest non-empty
 * successful result with a higher sequence wins.
 *
 * Alexi does not yet have a full Effect-based BackgroundJob service like
 * upstream opencode; this module ships the pure decision primitive
 * (`selectJobOutput`) that the eventual runner (or the current
 * `src/tool/tools/task.ts` fallback path) can call. Keeping the logic
 * isolated + unit-tested here means the fix is auditable independent
 * of the wider job-scheduler refactor.
 */
export interface JobOutput {
  /** Monotonic sequence number of the run that produced this output. */
  sequence: number;
  /** Textual result surfaced to the parent agent. */
  text: string;
}

export interface JobExit {
  /** `true` when the underlying run completed without throwing. */
  success: boolean;
  /** The text the run produced. May be empty on a no-op / extended run. */
  value: string;
}

/**
 * Decide which output a background job should surface after a completed
 * (or extended) run.
 *
 * Rules (mirrors upstream #13469):
 *   1. Only successful exits can update the output.
 *   2. Empty (`""`) values NEVER clobber a prior non-empty output.
 *   3. Among successful, non-empty candidates, the higher `sequence` wins.
 *
 * @param previous - the output currently stored on the job (or `undefined`
 *   if the job has never produced output).
 * @param exit - the exit record of the most recent run.
 * @param sequence - the monotonic sequence number of that run.
 * @returns the output that should be stored on the job going forward.
 */
export function selectJobOutput(
  previous: JobOutput | undefined,
  exit: JobExit,
  sequence: number
): JobOutput | undefined {
  // kilocode_change - empty outputs never clobber; only the latest non-empty result wins (#13469)
  if (exit.success && exit.value && sequence > (previous?.sequence ?? -1)) {
    return { sequence, text: exit.value };
  }
  return previous;
}
