/**
 * MCP connection cleanup helpers.
 *
 * When an MCP client startup is cancelled (e.g. user Ctrl-C during
 * `initialize`, abort signal, or a mid-handshake throw) the SDK does
 * NOT automatically tear down the transport or the spawned child
 * process. Repeated interruptions over the course of a long-running
 * `alexi server` session leak file descriptors and zombie child
 * processes.
 *
 * Ports upstream kilocode's MCP cleanup-on-interrupt behaviour. The
 * helpers here are best-effort — every call is wrapped in try/catch
 * so a cleanup failure cannot shadow the original cancellation error
 * on the way back to the retry loop.
 */

import { logger } from '../utils/logger.js';

/**
 * Minimal shape of an MCP client we need to clean up. Kept structural
 * (rather than typed against the full `@modelcontextprotocol/client`
 * surface) so the helper is callable from tests with plain stubs and
 * from different SDK revisions without a hard version dependency.
 */
export interface CleanableClient {
  close?: () => Promise<void> | void;
  transport?: {
    close?: () => Promise<void> | void;
  };
}

/**
 * Minimal shape of a spawned child process we need to kill. Matches
 * the subset of `ChildProcess` the MCP manager carries on the
 * `McpConnection.process` field.
 */
export interface CleanableProcess {
  kill?: (signal?: NodeJS.Signals | number) => boolean;
  killed?: boolean;
}

/**
 * Tear down an MCP client whose startup was interrupted. Attempts, in
 * order:
 *   1. `client.close()` — graceful shutdown via the SDK.
 *   2. `client.transport?.close()` — explicit transport close as a
 *      belt-and-braces step; some SDK builds leave the transport open
 *      when `close()` fails mid-handshake.
 *   3. `process.kill()` — hard kill the spawned child when a stdio
 *      transport left one running.
 *
 * All failures are logged at debug level and swallowed. The caller is
 * expected to be inside an error path already and should surface the
 * ORIGINAL error, not a cleanup failure.
 */
export async function cleanupInterrupted(
  serverName: string,
  client?: CleanableClient,
  childProcess?: CleanableProcess
): Promise<void> {
  if (client) {
    try {
      await client.close?.();
    } catch (err) {
      logger.debug(
        `MCP cleanup: client.close() failed for ${serverName}:`,
        err instanceof Error ? err.message : String(err)
      );
    }
    try {
      await client.transport?.close?.();
    } catch (err) {
      logger.debug(
        `MCP cleanup: transport.close() failed for ${serverName}:`,
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  if (childProcess && !childProcess.killed) {
    try {
      childProcess.kill?.();
    } catch (err) {
      logger.debug(
        `MCP cleanup: process.kill() failed for ${serverName}:`,
        err instanceof Error ? err.message : String(err)
      );
    }
  }
}
