/**
 * Bash detach ("Proceed While Running") support.
 *
 * Enables the bash/shell tool to detach from a long-running foreground
 * command (dev server, watch build, ...) after `DETACH_PROMPT_MS`, freeze
 * the output snapshot at `DETACH_OUTPUT_LINE_CAP` lines, and let the user
 * continue the conversation while the command keeps running in the
 * background.
 *
 * On the next bash/shell invocation the tool consults `getDetachedProcesses`
 * and calls `waitForDetachedExit` so the new command does not race the
 * still-running detached one. When the detached process finally exits its
 * metadata is dropped from the registry.
 *
 * The TUI (or any consumer) subscribes to `BashDetachAvailable` and, if the
 * user picks "Proceed While Running", publishes a matching decision through
 * `resolveDetachDecision(id, 'proceed')`. Any other choice (or no reply
 * before the command finishes on its own) falls back to the normal
 * synchronous wait.
 *
 * Ported from cline/cline#12320.
 */

import { z } from 'zod';
import { defineEvent } from '../../bus/index.js';

/**
 * Time after command start before the TUI is asked whether to detach.
 * 5s matches cline's default; short enough that a hung `npm install` is
 * detachable, long enough that fast commands like `git status` never
 * trigger the prompt.
 */
export const DETACH_PROMPT_MS = 5000;

/**
 * When the user chooses to proceed, freeze the captured output at this
 * many lines. The full live buffer keeps growing in the background but is
 * NOT re-injected into the model context (would break turn caching).
 */
export const DETACH_OUTPUT_LINE_CAP = 200;

/**
 * How long `waitForDetachedExit` waits for the detached process before
 * giving up and returning `false`. Only used as a safety bound — normal
 * dev-server workflows kill the process externally or via Ctrl+C in the
 * TUI, both of which resolve the wait immediately via the exit handler.
 */
export const DETACH_WAIT_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Metadata a bash invocation stores when it detaches. `output` is the
 * frozen snapshot at detach time. `pending` resolves when the underlying
 * process exits (successfully or via signal).
 */
export interface DetachedProcess {
  /** Correlation id used both as the map key and in bus events. */
  id: string;
  /** PID of the shell process. Used by callers to check liveness. */
  pid: number | undefined;
  /** Optional friendly command tag ("npm run dev"). */
  command: string;
  /** Session that owns this detached process, if known. */
  sessionId?: string;
  /** Wall-clock time when the process was spawned. */
  startedAt: number;
  /** Wall-clock time when the user picked "Proceed". */
  detachedAt: number;
  /** Frozen stdout snapshot (capped to `DETACH_OUTPUT_LINE_CAP` lines). */
  stdoutSnapshot: string;
  /** Frozen stderr snapshot (capped to `DETACH_OUTPUT_LINE_CAP` lines). */
  stderrSnapshot: string;
  /** Promise that resolves when the underlying process exits. */
  pending: Promise<void>;
}

/**
 * User decision on a detach prompt.
 * - `proceed`: freeze output and return partial result, keep process running.
 * - `wait`: continue blocking on the command until it exits normally.
 */
export type DetachDecision = 'proceed' | 'wait';

/**
 * Published when a bash command has been running for `DETACH_PROMPT_MS` and
 * the tool wants a TUI prompt. Consumers reply by calling
 * `resolveDetachDecision(id, decision)`.
 */
export const BashDetachAvailable = defineEvent(
  'bash.detach.available',
  z.object({
    id: z.string(),
    toolName: z.string(),
    command: z.string(),
    pid: z.number().optional(),
    startedAt: z.number(),
    timestamp: z.number(),
  })
);

/**
 * Published when a detached command finally exits in the background. The
 * TUI can use this to render "npm run dev finished (exit 0)" in the log,
 * separate from the frozen partial-result block.
 */
export const BashDetachedExited = defineEvent(
  'bash.detached.exited',
  z.object({
    id: z.string(),
    toolName: z.string(),
    command: z.string(),
    pid: z.number().optional(),
    exitCode: z.number().nullable(),
    timestamp: z.number(),
  })
);

/**
 * Per-session registry of detached processes. Keyed by sessionId (or the
 * sentinel `__default__` when the tool ran without a session). Each entry
 * is keyed by detach id — a single session may legitimately have multiple
 * detached commands (`npm run dev` + `docker-compose up`).
 */
const detachedBySession = new Map<string, Map<string, DetachedProcess>>();

/** Pending decision resolvers, keyed by detach id. */
const decisionResolvers = new Map<string, (d: DetachDecision) => void>();

const DEFAULT_SESSION = '__default__';

function bucket(sessionId: string | undefined): string {
  return sessionId ?? DEFAULT_SESSION;
}

/**
 * Cap `output` at `maxLines` lines by keeping the first `maxLines-1` lines
 * and appending a truncation notice. Preserves order so failure signals at
 * the tail of a boot log are lost — that is intentional: on detach we
 * expect the command to KEEP running, so the head is the informative
 * portion (build progress, "server listening on ...").
 */
export function capOutputLines(output: string, maxLines = DETACH_OUTPUT_LINE_CAP): string {
  const lines = output.split('\n');
  if (lines.length <= maxLines) {
    return output;
  }
  const kept = lines.slice(0, maxLines - 1);
  const omitted = lines.length - kept.length;
  kept.push(`[... ${omitted} lines omitted after detach ...]`);
  return kept.join('\n');
}

/**
 * True when the environment marks the bash tool as running inside an
 * interactive TUI session (so a detach prompt can actually be shown).
 * `BASH_INTERACTIVE=1` is set by `src/cli/interactive.ts`; automated /
 * CI runs never set it and always fall through to the normal blocking
 * behaviour.
 */
export function isBashInteractive(): boolean {
  const v = process.env.BASH_INTERACTIVE;
  return v === '1' || v === 'true';
}

/**
 * Register a detached process. Called by the bash/shell tool exactly once
 * per detach event, from inside the tool's `execute` promise, after the
 * user has picked "Proceed".
 */
export function registerDetachedProcess(entry: DetachedProcess): void {
  const key = bucket(entry.sessionId);
  let map = detachedBySession.get(key);
  if (!map) {
    map = new Map();
    detachedBySession.set(key, map);
  }
  map.set(entry.id, entry);

  // Auto-cleanup on exit. Capture the map reference locally so we don't
  // have to re-lookup (and don't need a non-null assertion).
  const owner = map;
  entry.pending.finally(() => {
    owner.delete(entry.id);
    if (owner.size === 0) {
      detachedBySession.delete(key);
    }
  });
}

/**
 * Return every detached process for a session (or the default bucket).
 * Used by the bash tool at the top of `execute` to know it must wait for
 * the previous invocation to exit before spawning a new one.
 */
export function getDetachedProcesses(sessionId?: string): DetachedProcess[] {
  const map = detachedBySession.get(bucket(sessionId));
  return map ? Array.from(map.values()) : [];
}

/**
 * Wait for every currently-detached process in `sessionId` to exit.
 * Resolves immediately when the bucket is empty.
 *
 * The timeout is a safety net so a bugged / wedged detached process
 * cannot block the next bash invocation forever. Callers that hit the
 * timeout should surface a clear error and let the user cancel.
 */
export async function waitForDetachedExit(
  sessionId?: string,
  timeoutMs = DETACH_WAIT_TIMEOUT_MS
): Promise<boolean> {
  const pending = getDetachedProcesses(sessionId).map((p) => p.pending);
  if (pending.length === 0) {
    return true;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), timeoutMs);
  });

  const outcome = await Promise.race([
    Promise.all(pending).then(() => 'ok' as const),
    timeoutPromise,
  ]);
  if (timer) {
    clearTimeout(timer);
  }
  return outcome === 'ok';
}

/**
 * Request a decision from the TUI. Returns a promise that resolves when a
 * consumer calls `resolveDetachDecision(id, ...)`. Callers combine this
 * with `Promise.race` against the process's `close` event so a fast-
 * finishing command does not hang waiting for a reply.
 */
export function awaitDetachDecision(id: string): Promise<DetachDecision> {
  return new Promise((resolve) => {
    decisionResolvers.set(id, resolve);
  });
}

/**
 * Called by the TUI when the user picks a decision. No-op if the
 * corresponding awaiter is already gone (command finished on its own,
 * signal cancelled, ...).
 */
export function resolveDetachDecision(id: string, decision: DetachDecision): void {
  const resolver = decisionResolvers.get(id);
  if (resolver) {
    decisionResolvers.delete(id);
    resolver(decision);
  }
}

/**
 * Cancel a pending decision by resolving it as 'wait'. Called from the
 * bash tool when the underlying process finishes before the user replied.
 */
export function cancelDetachDecision(id: string): void {
  resolveDetachDecision(id, 'wait');
}

/**
 * Test helper: forget every detached process AND every pending resolver.
 * MUST NOT be called from production code — the registry survives across
 * bash invocations by design.
 */
export function _resetDetachStateForTests(): void {
  detachedBySession.clear();
  decisionResolvers.clear();
}
