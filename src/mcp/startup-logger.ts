/**
 * Structured startup logging for MCP server connect flows.
 *
 * MCP connect failures are a common support surface and the previous
 * `connecting / connected / failed` logs did not expose enough context
 * to diagnose them: operators could not tell how long each phase took,
 * which phase actually failed, what the server printed to stderr before
 * dying, or which retry attempt the current log line belonged to.
 *
 * This module exposes a tiny structured-logging facade that the
 * `McpClientManager` uses to emit:
 *
 *   - `logPhaseStart` — a phase of the connect flow has begun. Rendered
 *     at `info` for the first attempt, `debug` for retry attempts so a
 *     successful retry doesn't flood operator logs.
 *   - `logPhaseEnd`   — the phase completed; the duration (ms) is
 *     included so slow spawns, slow handshakes, or slow capability
 *     fetches are visible in the log stream directly.
 *   - `logStartupError` — the phase failed. The server's stderr buffer
 *     (when available) is appended so the operator can see what the
 *     server printed before dying without re-running the connect.
 *
 * Phase names are a small fixed enum so log consumers (grep, log
 * dashboards, future `alexi logs mcp` subcommand) can rely on a stable
 * vocabulary. All messages share the `MCP startup [<server>] phase=...
 * attempt=... ...` shape so the output is parseable with a single regex.
 *
 * The surface area is intentionally narrow — no state is kept here,
 * every call stands alone. The manager owns timing (via `Date.now()` at
 * phase boundaries) and attempt counting (via its existing retry loop).
 */

import { formatError, logger } from '../utils/logger.js';

/**
 * Named phases of the MCP connect flow.
 *
 * - `spawn` — process spawn (stdio) OR URL reachability probe (remote).
 *   The server has not yet responded to any MCP protocol message.
 * - `initialize` — the MCP `initialize` handshake over the transport.
 *   This is where slow npm installs, missing env vars discovered at
 *   runtime, and startup-timeout failures surface.
 * - `capabilities` — initial metadata fetch (`tools/list`, and the
 *   optional `resources/list` / `prompts/list` probes). A server that
 *   initialized cleanly but ships a broken tool list fails here.
 * - `ready` — all phases above completed, the connection is wired into
 *   the manager and visible via `getConnection()`. Emitted as a single
 *   phase-end log so operators see a clear "connect fully done" signal.
 */
export type McpStartupPhaseName = 'spawn' | 'initialize' | 'capabilities' | 'ready';

/**
 * Per-phase context used by `logPhaseStart` / `logPhaseEnd`. `startedAt`
 * is captured in ms-since-epoch so the manager can compute `durationMs`
 * at the end of the phase without re-reading the clock from inside the
 * logger (and without the logger needing its own state).
 */
export interface StartupPhase {
  server: string;
  phase: McpStartupPhaseName;
  attempt: number;
  startedAt: number;
}

/**
 * Format the shared `[server] phase=... attempt=...` prefix. Kept small
 * so every log line looks identical and consumers can grep on a single
 * stable shape.
 */
function formatPrefix(server: string, phase: string, attempt: number): string {
  return `MCP startup [${server}] phase=${phase} attempt=${attempt}`;
}

/**
 * Log the start of a connect phase.
 *
 * First-attempt starts land at `info` so the normal connect flow is
 * visible without turning on debug logging. Retry attempts (`attempt > 1`)
 * downgrade to `debug` so a server that eventually succeeds after a
 * blip doesn't flood operator logs with duplicate phase lines.
 */
export function logPhaseStart(phase: StartupPhase): void {
  const line = `${formatPrefix(phase.server, phase.phase, phase.attempt)} started`;
  if (phase.attempt > 1) {
    logger.debug(line);
  } else {
    logger.info(line);
  }
}

/**
 * Log the successful end of a connect phase, including the measured
 * duration in milliseconds. See {@link logPhaseStart} for the level
 * selection rationale.
 */
export function logPhaseEnd(phase: StartupPhase, durationMs: number): void {
  const line =
    `${formatPrefix(phase.server, phase.phase, phase.attempt)} ` + `completed in ${durationMs}ms`;
  if (phase.attempt > 1) {
    logger.debug(line);
  } else {
    logger.info(line);
  }
}

/**
 * Trim a stderr buffer to the last `maxBytes` characters. MCP servers
 * can be noisy at startup (install logs from `npx -y`, verbose
 * `--verbose` traces); capping the appended tail keeps log lines
 * bounded while preserving the final diagnostic output which is almost
 * always the useful part.
 */
function tailStderr(stderr: string, maxBytes = 2000): string {
  if (stderr.length <= maxBytes) {
    return stderr;
  }
  return `... (truncated ${stderr.length - maxBytes} bytes) ...\n${stderr.slice(-maxBytes)}`;
}

/**
 * Log a failure during an MCP connect phase.
 *
 * Always rendered at `error`. When the caller captured the server's
 * stderr during the spawn phase it is appended on a new line so the
 * operator sees the server's actual output (install errors, missing
 * dependencies, missing env vars printed by the server itself) without
 * having to re-run the connect under a tracing harness.
 */
export function logStartupError(
  server: string,
  phase: McpStartupPhaseName | string,
  error: unknown,
  stderr?: string
): void {
  const base = `MCP startup [${server}] phase=${phase} failed: ${formatError(error)}`;
  if (stderr && stderr.trim().length > 0) {
    logger.error(`${base}\nstderr: ${tailStderr(stderr)}`);
  } else {
    logger.error(base);
  }
}

/**
 * Log a scheduled retry between phase attempts. Emitted at `warn` to
 * mirror the existing retry log and to make retrying visible in the
 * normal log stream.
 */
export function logRetryScheduled(server: string, nextAttempt: number, delayMs: number): void {
  logger.warn(`MCP startup [${server}] retrying in ${delayMs}ms (attempt ${nextAttempt})`);
}
