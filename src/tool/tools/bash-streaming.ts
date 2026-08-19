/**
 * Bash streaming command-log registry.
 *
 * The bash / shell tool now yields incremental stdout / stderr chunks as
 * they arrive from the underlying process (issue #1442) so the TUI can
 * render progress bars, `npm install` output, and long test runs live
 * instead of the previous head-of-line-blocked spinner-only path.
 *
 * This module owns the process-local log store that backs those live
 * chunks. It complements — and does NOT replace — `bash-detach.ts`:
 *
 * - `bash-detach.ts` deals with the "Proceed While Running" UX and the
 *   session-scoped registry of processes that have been intentionally
 *   backgrounded.
 * - `bash-streaming.ts` deals with the correlation id + append buffer
 *   used by streaming clients and the follow-up cleanup after the
 *   process exits, aborts, or the tool wrapper is torn down.
 *
 * Design invariants:
 *
 * 1. **PID-reuse defense.** Logs are keyed by a synthetic `logId`
 *    (nanoid) rather than the OS PID. `getLogByPid` cross-references
 *    the recorded PID + `startedAt` timestamp so a subsequent process
 *    that happens to reuse the same PID cannot collide with the earlier
 *    log entry. Callers must match on `logId` when they need a stable
 *    identifier; the PID accessor is only for diagnostics.
 *
 * 2. **Probe-outage retention.** The registry retains completed logs
 *    for `COMPLETED_LOG_RETENTION_MS` after `markCommandLogFinished` so
 *    a TUI hub that briefly drops its subscription (probe outage, hot
 *    reload) can still fetch the tail of the log on reconnect. After
 *    the retention window the entry is dropped by
 *    `cleanupCompletedLogs` (auto-triggered on each new registration).
 *
 * 3. **Bounded memory.** Each log has an in-memory append buffer capped
 *    at `MAX_LOG_BYTES`. Once the cap is reached, the oldest bytes are
 *    dropped and a truncation marker is written in their place. The
 *    persisted-to-disk path lives in `bash.ts` (`persistLargeOutput`)
 *    and is unchanged; this cap is a defensive belt so a runaway
 *    process cannot exhaust the tool wrapper's memory before the disk
 *    persistence kicks in.
 *
 * 4. **Abort cleanup.** `cleanupCommandLog(logId)` reaps a log
 *    unconditionally. Bash calls it on `close`, on `error`, and from
 *    the abort-signal handler so a cancelled command does not leak
 *    into the registry.
 */

import { nanoid } from 'nanoid';

/**
 * Maximum number of bytes retained in the in-memory append buffer per
 * command log. When exceeded, the oldest bytes are dropped and a
 * truncation marker line is written in place of the elided range. This
 * is intentionally smaller than the disk persistence budget in
 * `src/tool/index.ts` (50 KB) because the streaming buffer is only used
 * for reconnect / late-subscriber replay; the authoritative full output
 * is either in the process's own stdout accumulator (bash.ts) or on
 * disk (`persistLargeOutput`).
 */
export const MAX_LOG_BYTES = 32 * 1024;

/**
 * How long a finished log stays in the registry after
 * `markCommandLogFinished`. Chosen to be long enough that a TUI hub
 * that briefly loses its subscription can still fetch the tail on
 * reconnect (typical hub restart is well under 30s), short enough that
 * an idle CLI session does not accumulate logs indefinitely.
 */
export const COMPLETED_LOG_RETENTION_MS = 60_000;

/**
 * Metadata + append buffer for a single bash / shell invocation.
 */
export interface CommandLogEntry {
  /** Synthetic id; primary key for lookups (PID-reuse-safe). */
  id: string;
  /** OS PID at spawn time. May be `undefined` if the spawn failed. */
  pid: number | undefined;
  /** Wall-clock time the process was spawned. Used as PID-reuse tie-breaker. */
  startedAt: number;
  /** Wall-clock time the process finished, or `undefined` while running. */
  finishedAt?: number;
  /** Friendly command tag ("npm install"). NOT echoed back in results. */
  command: string;
  /** Optional session identifier so logs can be reaped on session end. */
  sessionId?: string;
  /** Tool id from `ToolExecutionStarted`. Used to correlate bus events. */
  toolId?: string;
  /**
   * Rolling append buffer of interleaved stdout + stderr chunks. Capped
   * at `MAX_LOG_BYTES`; when full, the oldest bytes are dropped and a
   * truncation marker is inserted in their place. Order-preserving.
   */
  buffer: string;
  /** Total bytes ever appended (including bytes that were later evicted). */
  totalBytes: number;
  /** True once the buffer has been truncated at least once. */
  truncated: boolean;
}

/**
 * Snapshot copy of `CommandLogEntry` returned by public accessors so
 * callers cannot mutate the registry state through the returned object.
 */
export type CommandLogSnapshot = Readonly<Omit<CommandLogEntry, 'buffer'>> & {
  buffer: string;
};

const logs = new Map<string, CommandLogEntry>();

const TRUNCATION_MARKER = '\n[... older output evicted from streaming buffer ...]\n';

/**
 * Insert a fresh command log into the registry and return its id.
 *
 * The returned id is stable for the lifetime of the process regardless
 * of PID reuse. Callers should thread it through `BashOutputChunk`
 * events (`logId` field) and pass it to `appendCommandLog` /
 * `markCommandLogFinished` / `cleanupCommandLog`.
 */
export function registerCommandLog(entry: {
  pid: number | undefined;
  command: string;
  sessionId?: string;
  toolId?: string;
  startedAt?: number;
}): string {
  // Opportunistic cleanup of stale finished logs so an idle session
  // does not accumulate registry entries indefinitely.
  cleanupCompletedLogs();

  const id = nanoid();
  logs.set(id, {
    id,
    pid: entry.pid,
    startedAt: entry.startedAt ?? Date.now(),
    command: entry.command,
    sessionId: entry.sessionId,
    toolId: entry.toolId,
    buffer: '',
    totalBytes: 0,
    truncated: false,
  });
  return id;
}

/**
 * Append a stdout or stderr chunk to the in-memory buffer. No-op when
 * `logId` is not registered (defensive: chunk delivery may race the
 * `close` handler in bash.ts).
 */
export function appendCommandLog(logId: string, chunk: string): void {
  const entry = logs.get(logId);
  if (!entry || chunk.length === 0) {
    return;
  }
  entry.totalBytes += Buffer.byteLength(chunk, 'utf-8');
  entry.buffer += chunk;

  if (Buffer.byteLength(entry.buffer, 'utf-8') > MAX_LOG_BYTES) {
    // Evict oldest bytes. Keep the last MAX_LOG_BYTES worth, snapping
    // to a line boundary so partial lines are not shown to the TUI.
    const buf = Buffer.from(entry.buffer, 'utf-8');
    let start = buf.length - MAX_LOG_BYTES;
    // Snap forward to next '\n' if we can find one nearby (within 1KB).
    const searchEnd = Math.min(buf.length, start + 1024);
    for (let i = start; i < searchEnd; i++) {
      if (buf[i] === 0x0a) {
        start = i + 1;
        break;
      }
    }
    entry.buffer = TRUNCATION_MARKER + buf.subarray(start).toString('utf-8');
    entry.truncated = true;
  }
}

/**
 * Mark a log as finished (process exited or aborted). The entry remains
 * in the registry for `COMPLETED_LOG_RETENTION_MS` so late-subscribing
 * TUI clients (e.g. after a hub reconnect) can still fetch the tail.
 */
export function markCommandLogFinished(logId: string): void {
  const entry = logs.get(logId);
  if (entry) {
    entry.finishedAt = Date.now();
  }
}

/**
 * Return a readonly snapshot of a command log by id, or `undefined` if
 * the id is unknown (never registered, already reaped past retention,
 * or explicitly cleaned up).
 */
export function getCommandLog(logId: string): CommandLogSnapshot | undefined {
  const entry = logs.get(logId);
  if (!entry) {
    return undefined;
  }
  return { ...entry };
}

/**
 * Look up a log by OS PID with PID-reuse defense. Returns the entry
 * ONLY when both `pid` and `startedAt` match — a process that later
 * reuses the same PID will have a different `startedAt` timestamp and
 * will not collide with the earlier entry. Callers who don't know the
 * exact start time should compare against the entry's `startedAt` field
 * and reject stale matches.
 *
 * When `pid` is not known (`undefined`), the accessor returns
 * `undefined`. Diagnostic use only — always prefer `getCommandLog(id)`.
 */
export function getCommandLogByPid(
  pid: number | undefined,
  startedAt: number
): CommandLogSnapshot | undefined {
  if (pid === undefined) {
    return undefined;
  }
  for (const entry of logs.values()) {
    if (entry.pid === pid && entry.startedAt === startedAt) {
      return { ...entry };
    }
  }
  return undefined;
}

/**
 * Drop a command log from the registry, regardless of state. Called by
 * the bash tool on `close`, on `error`, and from the abort-signal
 * handler so a cancelled command does not linger past its useful life.
 */
export function cleanupCommandLog(logId: string): void {
  logs.delete(logId);
}

/**
 * Drop every log whose `finishedAt` was more than
 * `COMPLETED_LOG_RETENTION_MS` ago. Called opportunistically at every
 * `registerCommandLog` so retention housekeeping does not need a
 * separate timer. Callers may invoke it directly (e.g. on session end).
 */
export function cleanupCompletedLogs(now: number = Date.now()): number {
  let removed = 0;
  for (const [id, entry] of logs) {
    if (entry.finishedAt !== undefined && now - entry.finishedAt > COMPLETED_LOG_RETENTION_MS) {
      logs.delete(id);
      removed++;
    }
  }
  return removed;
}

/**
 * Return the currently-registered log ids. Ordering is registration
 * order (insertion order of the underlying map). Diagnostic use only.
 */
export function listCommandLogIds(): string[] {
  return Array.from(logs.keys());
}

/**
 * Test-only helper: forget every registered log. MUST NOT be called
 * from production code — the registry survives across bash invocations
 * by design.
 */
export function _resetStreamingStateForTests(): void {
  logs.clear();
}
