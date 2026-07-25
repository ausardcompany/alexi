/**
 * UNIX socket server for remote slash commands.
 *
 * Listens on `~/.alexi/server.sock` by default. Each connected client
 * exchanges LDJSON frames (see {@link ./protocol.ts}) and, after a
 * successful `auth`, can dispatch slash commands, create isolated
 * sessions, and gracefully disconnect with `exit`.
 *
 * The server itself only terminates on {@link stopSocketServer}. A
 * client's `exit` frame closes only that client's socket — it does
 * NOT kill the daemon (per issue #1100 "remote exit bridge").
 *
 * Session isolation: every remote client gets its own {@link SessionManager}
 * instance keyed by a nanoid returned from `session.create`. Sessions
 * are stored in memory for the server's lifetime and are separate from
 * the host CLI's own session state.
 */

import { createServer, type Server, type Socket } from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { SessionManager } from '../core/sessionManager.js';
import { getCommandRegistry, CommandError } from '../command/index.js';
import {
  PROTOCOL_VERSION,
  encodeFrame,
  extractLines,
  failure,
  parseRequest,
  parseSlashCommand,
  success,
  type Request,
  type ServerMessage,
} from './protocol.js';
import { defaultSocketPath, safeCompareToken } from './auth.js';

/**
 * Version string reported in the `hello` banner. Kept in sync with the
 * package.json version at runtime via a lazy `require`. Falls back to
 * `0.0.0` when the package.json cannot be read (during tests, for
 * example).
 */
function readServerVersion(): string {
  try {
    // Read the top-level package.json relative to the built module.
    // In `dist/server/socket.js` the file is two levels up; in
    // `src/server/socket.ts` it's the same. `process.cwd()` is not
    // reliable, so we walk from `import.meta.url`.
    const here = new URL(import.meta.url);
    let dir = path.dirname(here.pathname);
    for (let i = 0; i < 6; i++) {
      const candidate = path.join(dir, 'package.json');
      if (fs.existsSync(candidate)) {
        const raw = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as { version?: string };
        return raw.version ?? '0.0.0';
      }
      const parent = path.dirname(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
  } catch {
    // Fall through.
  }
  return '0.0.0';
}

interface RemoteSession {
  id: string;
  manager: SessionManager;
  createdAt: number;
}

interface ClientState {
  socket: Socket;
  authenticated: boolean;
  buffer: string;
  /** Sessions this specific client has created via `session.create`. */
  ownedSessionIds: Set<string>;
}

export interface SocketServerOptions {
  /** Absolute path to the socket file. Defaults to `~/.alexi/server.sock`. */
  socketPath?: string;
  /** Shared auth token. Any client presenting a mismatching token is rejected. */
  token: string;
  /**
   * Optional injection point for tests: return a session manager instead
   * of constructing one. Production callers should leave this undefined.
   */
  createSessionManager?: () => SessionManager;
}

export interface SocketServerHandle {
  /** The underlying `net.Server`. Useful for tests. */
  server: Server;
  /** Resolved socket path (absolute). */
  socketPath: string;
  /** Number of live remote sessions. */
  sessionCount(): number;
  /** Number of currently connected clients. */
  clientCount(): number;
  /** Gracefully shut down the server and disconnect all clients. */
  stop(): Promise<void>;
}

/**
 * Start the UNIX socket server. Resolves once the listener is bound.
 *
 * A stale socket file left behind by a crashed previous instance is
 * removed before binding (`fs.unlinkSync` on `EADDRINUSE`).
 */
export function startSocketServer(options: SocketServerOptions): Promise<SocketServerHandle> {
  const socketPath = options.socketPath ?? defaultSocketPath();
  const sessions = new Map<string, RemoteSession>();
  const clients = new Set<ClientState>();
  const serverVersion = readServerVersion();
  const createManager =
    options.createSessionManager ?? ((): SessionManager => new SessionManager());

  const server = createServer((socket) => {
    const state: ClientState = {
      socket,
      authenticated: false,
      buffer: '',
      ownedSessionIds: new Set(),
    };
    clients.add(state);

    const send = (msg: ServerMessage): void => {
      if (socket.destroyed) {
        return;
      }
      try {
        socket.write(encodeFrame(msg));
      } catch {
        // Client went away mid-write; the 'close' handler will clean up.
      }
    };

    // Send hello banner immediately.
    send({ type: 'hello', version: serverVersion, protocol: PROTOCOL_VERSION });

    socket.setEncoding('utf-8');

    socket.on('data', (chunk: string) => {
      const { lines, buffer } = extractLines(state.buffer, chunk);
      state.buffer = buffer;
      for (const line of lines) {
        handleLine(state, line, send, sessions, options.token, createManager);
      }
    });

    socket.on('close', () => {
      clients.delete(state);
    });

    socket.on('error', () => {
      // Silently drop — the 'close' handler will remove the client.
    });
  });

  return new Promise((resolve, reject) => {
    const onError = (err: NodeJS.ErrnoException): void => {
      if (err.code === 'EADDRINUSE') {
        // Stale socket from a previous crash: try to remove and rebind.
        try {
          fs.unlinkSync(socketPath);
          server.listen(socketPath);
          return;
        } catch (unlinkErr) {
          reject(unlinkErr);
          return;
        }
      }
      reject(err);
    };

    server.once('error', onError);
    server.once('listening', () => {
      server.removeListener('error', onError);
      // Restrict socket to owner. Best-effort — some filesystems ignore.
      try {
        fs.chmodSync(socketPath, 0o600);
      } catch {
        // Ignore.
      }

      const handle: SocketServerHandle = {
        server,
        socketPath,
        sessionCount: () => sessions.size,
        clientCount: () => clients.size,
        stop: () =>
          new Promise<void>((res) => {
            for (const client of clients) {
              try {
                client.socket.destroy();
              } catch {
                // Ignore.
              }
            }
            clients.clear();
            sessions.clear();
            server.close(() => {
              // Best-effort cleanup of the socket file.
              try {
                if (fs.existsSync(socketPath)) {
                  fs.unlinkSync(socketPath);
                }
              } catch {
                // Ignore.
              }
              res();
            });
          }),
      };
      resolve(handle);
    });

    // Ensure parent directory exists before binding.
    try {
      const dir = path.dirname(socketPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      }
    } catch (err) {
      reject(err);
      return;
    }

    server.listen(socketPath);
  });
}

/**
 * Handle a single decoded line from a client. Extracted so it can be
 * unit-tested by driving requests through {@link parseRequest} without
 * a real socket.
 *
 * @internal
 */
function handleLine(
  state: ClientState,
  line: string,
  send: (msg: ServerMessage) => void,
  sessions: Map<string, RemoteSession>,
  token: string,
  createManager: () => SessionManager
): void {
  const parsed = parseRequest(line);
  if (!parsed.ok) {
    send(failure('', parsed.code, parsed.message));
    return;
  }
  const req = parsed.request;

  // `auth` and `ping` are the only frames allowed pre-authentication.
  if (!state.authenticated && req.type !== 'auth' && req.type !== 'ping') {
    send(failure(req.id, 'AUTH_REQUIRED', 'Client must authenticate before issuing commands'));
    return;
  }

  handleRequest(state, req, send, sessions, token, createManager).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    send(failure(req.id, 'INTERNAL_ERROR', msg));
  });
}

/**
 * Dispatch a parsed request against the shared registry / session map.
 *
 * @internal
 */
async function handleRequest(
  state: ClientState,
  req: Request,
  send: (msg: ServerMessage) => void,
  sessions: Map<string, RemoteSession>,
  token: string,
  createManager: () => SessionManager
): Promise<void> {
  switch (req.type) {
    case 'ping': {
      send(success(req.id, { pong: true, timestamp: Date.now() }));
      return;
    }

    case 'auth': {
      if (safeCompareToken(req.token, token)) {
        state.authenticated = true;
        send(success(req.id, { authenticated: true }));
      } else {
        send(failure(req.id, 'INVALID_TOKEN', 'Authentication failed'));
      }
      return;
    }

    case 'session.create': {
      const id = nanoid();
      const manager = createManager();
      manager.createSession('default');
      sessions.set(id, { id, manager, createdAt: Date.now() });
      state.ownedSessionIds.add(id);
      send(success(req.id, { sessionId: id, createdAt: Date.now() }));
      return;
    }

    case 'session.list': {
      const list = Array.from(sessions.values()).map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        messageCount: s.manager.getHistory().length,
      }));
      send(success(req.id, { sessions: list }));
      return;
    }

    case 'command': {
      // Resolve or fall back to a fresh session so `/help`-style read-only
      // commands work without an explicit session.create round-trip.
      let sessionId = req.sessionId;
      if (sessionId && !sessions.has(sessionId)) {
        send(failure(req.id, 'SESSION_NOT_FOUND', `Unknown sessionId: ${sessionId}`));
        return;
      }
      if (!sessionId) {
        sessionId = nanoid();
        const manager = createManager();
        manager.createSession('default');
        sessions.set(sessionId, { id: sessionId, manager, createdAt: Date.now() });
        state.ownedSessionIds.add(sessionId);
      }

      const parsed = parseSlashCommand(req.command);
      if (!parsed) {
        send(
          failure(
            req.id,
            'INVALID_COMMAND',
            'Command must be a slash-command line starting with "/"'
          )
        );
        return;
      }

      // Built-in commands not registered in the CommandRegistry.
      if (parsed.name === 'help') {
        const registry = getCommandRegistry();
        const commands = registry.list().map((c) => ({
          name: c.name,
          description: c.description,
        }));
        send(success(req.id, { sessionId, help: { commands } }));
        return;
      }
      if (parsed.name === 'exit') {
        // Remote /exit is a client-side disconnect signal, delivered as
        // a normal response BEFORE the socket is closed so the client
        // can observe it. It never terminates the daemon.
        send(success(req.id, { sessionId, closed: true }));
        try {
          state.socket.end();
        } catch {
          // Ignore.
        }
        return;
      }

      try {
        const registry = getCommandRegistry();
        const rendered = await registry.execute(parsed.name, parsed.args);
        send(success(req.id, { sessionId, rendered }));
      } catch (err) {
        if (err instanceof CommandError) {
          send(failure(req.id, err.code, err.message));
        } else {
          const msg = err instanceof Error ? err.message : String(err);
          send(failure(req.id, 'COMMAND_EXECUTION_FAILED', msg));
        }
      }
      return;
    }

    case 'exit': {
      // Explicit disconnect frame — respond, then close only this client.
      send(success(req.id, { closed: true }));
      try {
        state.socket.end();
      } catch {
        // Ignore.
      }
      return;
    }
  }
}

// Re-export internal handler for testing without a real socket.
export const _test = { handleLine, handleRequest };
