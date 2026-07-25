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
import {
  defaultSocketPath,
  defaultTokenPath,
  loadOrCreateToken,
  readTokenIfExists,
} from '../../server/auth.js';
import { startSocketServer } from '../../server/socket.js';
import { encodeFrame } from '../../server/protocol.js';
import { registerBuiltInCommands } from '../../command/index.js';

interface ServerStartOptions {
  socket?: string;
  detach?: boolean;
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
    .option(
      '-d, --detach',
      'Run the server in the current process and block until SIGINT/SIGTERM (default)'
    )
    .action(async (opts: ServerStartOptions) => {
      try {
        // Ensure built-in slash commands are loaded so remote clients
        // can dispatch /review, /explain, /help, etc.
        registerBuiltInCommands();

        const socketPath = opts.socket ?? defaultSocketPath();
        const tokenPath = defaultTokenPath();
        const token = loadOrCreateToken(tokenPath);

        const handle = await startSocketServer({ socketPath, token });
        console.log(`Alexi server listening on ${handle.socketPath}`);
        console.log(`Auth token file: ${tokenPath}`);

        const shutdown = async (): Promise<void> => {
          try {
            await handle.stop();
          } finally {
            process.exit(0);
          }
        };
        process.once('SIGINT', shutdown);
        process.once('SIGTERM', shutdown);
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
