/**
 * Mistake-limit user steering prompt (issue #1692).
 *
 * When the agentic loop's LoopDetector observes N identical tool calls in
 * a row, or the MistakeTracker observes N consecutive tool failures, the
 * `agenticChat` tool loop invokes an optional
 * `onConsecutiveMistakeLimitReached(reason)` callback and lets the caller
 * decide whether to `'stop'` the run or `'continue'` with an injected
 * steering message.
 *
 * This module builds the CLI-side implementation of that callback so the
 * non-interactive `alexi agent` command can:
 *
 *   1. Explain WHY the run is about to stop (previously silent — issue
 *      #1692's core complaint).
 *   2. Give an interactive user on a real TTY a "y/n" choice.
 *   3. In non-TTY / headless / CI mode, print an explanatory line to
 *      stderr and default to `'stop'` so scripts fail loudly instead of
 *      hanging on stdin.
 *   4. In `--yolo` / `--dangerously-skip-permissions` mode, auto-answer
 *      `'continue'` so unattended agent runs try to self-recover.
 *
 * The callback is passed verbatim to `agenticChat(...)` as
 * `onConsecutiveMistakeLimitReached`. `agenticChat` handles the actual
 * steering-message injection when the callback returns `'continue'`; this
 * module only owns the "ask the user" surface.
 */

import * as readline from 'readline';
import type { ConsecutiveMistakeReason } from '../../core/agenticChat.js';

/**
 * Callback signature — mirrors
 * `AgenticChatOptions.onConsecutiveMistakeLimitReached` so this module's
 * export is directly assignable at the call site.
 */
export type MistakeLimitCallback = (
  reason: ConsecutiveMistakeReason
) => Promise<'continue' | 'stop'>;

export interface MistakeLimitPromptOptions {
  /**
   * Auto-continue without prompting. Wired to `--yolo` /
   * `--dangerously-skip-permissions` on the `alexi agent` command so
   * unattended runs try to self-recover instead of stopping silently.
   */
  yolo?: boolean;
  /**
   * When true, do not print anything to stdout/stderr. `--quiet` on the
   * agent command sets this. A quiet run still returns `'stop'` (default)
   * so the caller gets a deterministic exit — silent-and-continue would
   * defeat the whole point of the mistake limit.
   */
  quiet?: boolean;
  /**
   * Signal that fires when the surrounding command is being aborted (Ctrl+C).
   * When aborted mid-prompt, the callback resolves to `'stop'` immediately
   * so the readline handle can be released and the run torn down.
   */
  signal?: AbortSignal;
  /**
   * Injectable I/O for tests. When absent, defaults to `process.stdin` /
   * `process.stdout` / `process.stderr` and the real `process.stdout.isTTY`
   * check.
   */
  stdin?: NodeJS.ReadableStream & { isTTY?: boolean };
  stdout?: NodeJS.WritableStream & { isTTY?: boolean };
  stderr?: NodeJS.WritableStream;
  /**
   * Override the TTY detection for tests. When set, this value is used
   * instead of `stdin.isTTY && stdout.isTTY`.
   */
  isTTY?: boolean;
}

/**
 * Build a human-readable one-line explanation of what tripped. Used both
 * in the interactive prompt and in the headless stderr line.
 */
export function describeReason(reason: ConsecutiveMistakeReason): string {
  if (reason.kind === 'loop') {
    return (
      `The model has called the same tool ('${reason.toolName}') ` +
      `${reason.consecutiveCount} times in a row with identical arguments — likely stuck in a loop.`
    );
  }
  return (
    `${reason.consecutiveCount} consecutive tool failures detected ` +
    `(last: '${reason.toolName}') — the model may be flailing.`
  );
}

/**
 * Build a callback suitable for passing to
 * `AgenticChatOptions.onConsecutiveMistakeLimitReached`.
 *
 * Decision matrix:
 *
 *   yolo=true             -> 'continue' (auto-recover, print notice)
 *   non-TTY / no stdin    -> 'stop'     (print explanation to stderr)
 *   quiet + TTY           -> 'stop'     (no prompt, one-line stderr)
 *   TTY (default)         -> prompt "Try a different approach? (y/n)"
 *   abort signal fires    -> 'stop'     (release readline, tear down)
 *
 * Any answer whose lowercased first character is `y` counts as continue;
 * everything else (including empty input and EOF) counts as stop, so a
 * user who just presses Enter defaults to the safer option.
 */
export function createMistakeLimitPrompt(
  options: MistakeLimitPromptOptions = {}
): MistakeLimitCallback {
  const stdin = options.stdin ?? process.stdin;
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const isTTY = options.isTTY ?? Boolean((stdin as { isTTY?: boolean }).isTTY && stdout.isTTY);

  return async function onMistakeLimit(
    reason: ConsecutiveMistakeReason
  ): Promise<'continue' | 'stop'> {
    const explanation = describeReason(reason);

    if (options.yolo) {
      if (!options.quiet) {
        stderr.write(`[mistake-limit] ${explanation} Auto-continuing (--yolo).\n`);
      }
      return 'continue';
    }

    if (!isTTY) {
      // Non-interactive: cannot prompt. Explain, then stop so the run
      // exits with a real signal instead of hanging on stdin.
      stderr.write(
        `[mistake-limit] ${explanation} Stopping (non-interactive; ` +
          `re-run with --yolo to auto-continue).\n`
      );
      return 'stop';
    }

    if (options.quiet) {
      // TTY but quiet: still print a single explanatory line to stderr
      // so the user knows why the run stopped, without prompting.
      stderr.write(`[mistake-limit] ${explanation} Stopping (quiet mode).\n`);
      return 'stop';
    }

    // Interactive path: ask the user.
    const signal = options.signal;
    if (signal?.aborted) {
      return 'stop';
    }

    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });

    // If the caller aborts (Ctrl+C) while we are waiting for input,
    // close the readline handle so its promise settles and the run can
    // tear down cleanly.
    const onAbort = (): void => {
      rl.close();
    };
    if (signal) {
      signal.addEventListener('abort', onAbort);
    }

    try {
      stderr.write(`\n[mistake-limit] ${explanation}\n`);
      const answer = await new Promise<string>((resolve) => {
        let settled = false;
        const settle = (value: string): void => {
          if (settled) {
            return;
          }
          settled = true;
          resolve(value);
        };
        rl.on('close', () => settle(''));
        rl.question('Try a different approach? (y/n) ', (input) => settle(input));
      });

      const normalized = answer.trim().toLowerCase();
      if (normalized.startsWith('y')) {
        stderr.write('[mistake-limit] Continuing with steering guidance.\n');
        return 'continue';
      }
      stderr.write('[mistake-limit] Stopping run.\n');
      return 'stop';
    } finally {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      rl.close();
    }
  };
}
