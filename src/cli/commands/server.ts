/**
 * `alexi server` — manage the local UNIX socket server for remote
 * slash commands. See `docs/SERVER.md` for the wire protocol.
 *
 *   alexi server start   Launch the socket server on ~/.alexi/server.sock
 *   alexi server stop    Ask a running server to shut down cleanly
 *   alexi server status  Report whether a server is currently listening
 */

import fs from 'node:fs';
import net from 'node:net';
import type { Command } from 'commander';
import { killAllTracked, listBackgroundProcesses } from '../../tool/tools/background-process.js';
// Server modules (socket, auth, protocol, built-in slash commands) are
// loaded lazily per-subcommand — see #1769 — so callers of unrelated
// commands do not pay for the server module graph.

/**
 * Default deadline (in milliseconds) for the SIGINT / SIGTERM shutdown
 * sequence. Chosen to stay well below the ~10s SIGKILL grace period used
 * by Docker and systemd defaults, while still leaving ample room for a
 * normal `handle.stop()` + `killAllTracked()` cycle which typically
 * completes in under a second.
 */
export const DEFAULT_SHUTDOWN_DEADLINE_MS = 30_000;

/**
 * Minimal shape of the socket-server handle this module needs for
 * shutdown. Defined locally so tests can supply a fake handle without
 * importing the full `SocketServerHandle` interface (and dragging the
 * server module graph into tests that only exercise shutdown timing).
 */
export interface ShutdownTarget {
  stop(): Promise<void>;
}

/**
 * Race `handle.stop()` and {@link killAllTracked} against a hard
 * `timeoutMs` deadline. Resolves `{ timedOut: false }` on a clean
 * shutdown; on timeout, logs the message
 * `"Server shutdown exceeded <ms>ms deadline, forcing exit"` plus the
 * IDs of any still-tracked background processes, and resolves
 * `{ timedOut: true }`.
 *
 * The caller is responsible for calling `process.exit(0)` after this
 * promise settles — this helper never calls `process.exit` itself so
 * tests can exercise the timeout branch without tearing down the
 * vitest worker.
 *
 * Shutdown and `killAllTracked` are run with `Promise.allSettled` so a
 * misbehaving `stop()` cannot prevent background cleanup, and vice
 * versa. Modeled on kilocode PR #14830.
 */
export async function shutdownWithDeadline(
  handle: ShutdownTarget,
  timeoutMs: number = DEFAULT_SHUTDOWN_DEADLINE_MS
): Promise<{ timedOut: boolean }> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<'timeout'>((resolve) => {
    timer = setTimeout(() => resolve('timeout'), timeoutMs);
    // Do not keep the event loop alive solely for the deadline timer —
    // this matters when the caller does not call `process.exit` (tests).
    timer.unref?.();
  });
  const shutdown: Promise<'done'> = Promise.allSettled([handle.stop(), killAllTracked()]).then(
    () => 'done' as const
  );

  const result = await Promise.race([shutdown, timeout]);
  if (timer !== undefined) {
    clearTimeout(timer);
  }

  if (result === 'timeout') {
    const stragglers = listBackgroundProcesses().map((p) => `${p.id}(pid=${p.pid})`);
    const suffix = stragglers.length > 0 ? ` (timed-out processes: ${stragglers.join(', ')})` : '';
    console.error(`Server shutdown exceeded ${timeoutMs}ms deadline, forcing exit${suffix}`);
    return { timedOut: true };
  }
  return { timedOut: false };
}

interface ServerStartOptions {
  socket?: string;
}

interface ServerStopOptions {
  socket?: string;
}

interface ServerStatusOptions {
  socket?: string;
  json?: boolean;
}

/**
 * Ask a running server on `socketPath` to stop. Since a client `exit`
 * only closes its own connection, we implement `stop` by sending a
 * special server-side control command: opening a connection and simply
 * unlinking the socket file is racy, so we send `exit` then destroy the
 * socket. The server on the other end is killed via SIGTERM by the
 * caller (systemd / the shell); this helper is here to check liveness.
 *
 * Returns `true` if the server responded on the socket, `false` if the
 * socket path does not exist or the connection was refused.
 */
/**
 * Lazy loader for the server auth helpers. Isolated in one place so the
 * dynamic imports do not sprinkle through every subcommand action.
 */
async function loadAuth(): Promise<typeof import('../../server/auth.js')> {
  return import('../../server/auth.js');
}

export function pingSocket(socketPath: string, timeoutMs = 500): Promise<boolean> {
  return new Promise((resolve) => {
    if (!fs.existsSync(socketPath)) {
      resolve(false);
      return;
    }
    const socket = net.createConnection(socketPath);
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);
    socket.once('connect', () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });
    socket.once('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

export function registerServerCommand(program: Command): void {
  const server = program.command('server').description('Manage the Alexi UNIX socket server');

  server
    .command('start')
    .description('Start the UNIX socket server for remote slash commands')
    .option('-s, --socket <path>', 'Socket path (default ~/.alexi/server.sock)')
    .action(async (opts: ServerStartOptions) => {
      try {
        // Lazy imports (#1769): only load the socket-server / command
        // registry graph when `alexi server start` actually runs.
        const [
          { defaultSocketPath, defaultTokenPath, loadOrCreateToken },
          { startSocketServer },
          { registerBuiltInCommands },
        ] = await Promise.all([
          loadAuth(),
          import('../../server/socket.js'),
          import('../../command/index.js'),
        ]);
        // Ensure built-in slash commands are loaded so remote clients
        // can dispatch /review, /explain, /help, etc.
        registerBuiltInCommands();

        const socketPath = opts.socket ?? defaultSocketPath();
        const tokenPath = defaultTokenPath();
        const token = loadOrCreateToken(tokenPath);

        const handle = await startSocketServer({ socketPath, token });
        console.log(`Alexi server listening on ${handle.socketPath}`);
        console.log(`Auth token file: ${tokenPath}`);

        // Bounded shutdown (kilocode #14823, kilocode #14830): a stuck
        // `handle.stop()` or `killAllTracked()` could otherwise hang the
        // process indefinitely on SIGINT/SIGTERM. `shutdownWithDeadline`
        // races both against `DEFAULT_SHUTDOWN_DEADLINE_MS` and logs
        // stragglers on timeout; the caller still owns `process.exit`.
        let shuttingDown = false;
        const shutdown = async (sig: NodeJS.Signals): Promise<void> => {
          if (shuttingDown) {
            return;
          }
          shuttingDown = true;
          console.log(`Received ${sig}, shutting down...`);
          try {
            await shutdownWithDeadline(handle, DEFAULT_SHUTDOWN_DEADLINE_MS);
          } finally {
            process.exit(0);
          }
        };
        process.once('SIGINT', () => void shutdown('SIGINT'));
        process.once('SIGTERM', () => void shutdown('SIGTERM'));
      } catch (e) {
        console.error(`Failed to start server: ${e instanceof Error ? e.message : String(e)}`);
        process.exit(1);
      }
    });

  server
    .command('stop')
    .description('Stop a running Alexi socket server (removes the socket file)')
    .option('-s, --socket <path>', 'Socket path (default ~/.alexi/server.sock)')
    .action(async (opts: ServerStopOptions) => {
      const { defaultSocketPath, readTokenIfExists } = await loadAuth();
      const { encodeFrame } = await import('../../server/protocol.js');
      const socketPath = opts.socket ?? defaultSocketPath();
      if (!fs.existsSync(socketPath)) {
        console.log('No running server (socket file not found)');
        return;
      }
      const alive = await pingSocket(socketPath);
      if (!alive) {
        // Stale socket file left behind by a previous crashed process.
        try {
          fs.unlinkSync(socketPath);
          console.log(`Removed stale socket file at ${socketPath}`);
        } catch (e) {
          console.error(
            `Failed to remove stale socket: ${e instanceof Error ? e.message : String(e)}`
          );
          process.exit(1);
        }
        return;
      }
      // Send an `exit` frame with a client id — the server will close
      // only that client connection. To fully stop the daemon the user
      // must signal the server process itself. We emit a hint.
      try {
        const socket = net.createConnection(socketPath);
        socket.once('connect', () => {
          const token = readTokenIfExists() ?? '';
          socket.write(encodeFrame({ type: 'hello', version: '0', protocol: 1 }));
          // Best-effort: auth then exit.
          if (token) {
            socket.write(JSON.stringify({ id: 'stop-1', type: 'auth', token }) + '\n');
          }
          socket.write(JSON.stringify({ id: 'stop-2', type: 'exit' }) + '\n');
          socket.end();
        });
        socket.once('error', () => {
          // Ignore
        });
      } catch {
        // Ignore.
      }
      console.log('Sent exit signal. To fully stop the daemon, send SIGTERM to its PID.');
    });

  server
    .command('status')
    .description('Report whether an Alexi socket server is running')
    .option('-s, --socket <path>', 'Socket path (default ~/.alexi/server.sock)')
    .option('--json', 'Emit machine-readable JSON')
    .action(async (opts: ServerStatusOptions) => {
      const { defaultSocketPath } = await loadAuth();
      const socketPath = opts.socket ?? defaultSocketPath();
      const exists = fs.existsSync(socketPath);
      const alive = exists ? await pingSocket(socketPath) : false;
      if (opts.json) {
        console.log(JSON.stringify({ socketPath, exists, alive }, null, 2));
        return;
      }
      if (!exists) {
        console.log(`No server: ${socketPath} does not exist`);
        return;
      }
      if (alive) {
        console.log(`Server is running on ${socketPath}`);
      } else {
        console.log(`Socket file exists at ${socketPath} but no server responded (stale)`);
      }
    });
}
