# Alexi UNIX Socket Server

The Alexi UNIX socket server is a long-running local daemon that exposes
Alexi's slash-command surface over a UNIX domain socket. Remote clients
(VS Code extension, JetBrains plugin, desktop app, test harnesses) can
connect, authenticate, and dispatch slash commands without spawning a
new `alexi` process per turn.

The server is deliberately local-only: it never listens on TCP. Its
sole transport is a UNIX domain socket bound under the user's home
directory.

## Quick start

```bash
# In terminal 1 - start the server
alexi server start
# -> Alexi server listening on /home/you/.alexi/server.sock
# -> Auth token file: /home/you/.alexi/server-token

# In terminal 2 - check status
alexi server status
# -> Server is running on /home/you/.alexi/server.sock

# In terminal 3 - talk to it with plain netcat
TOKEN=$(cat ~/.alexi/server-token)
{
  printf '{"id":"1","type":"auth","token":"%s"}\n' "$TOKEN"
  printf '{"id":"2","type":"command","command":"/help"}\n'
  printf '{"id":"3","type":"exit"}\n'
} | nc -U ~/.alexi/server.sock

# Later, shut the server down (SIGTERM the process from terminal 1)
alexi server stop
```

## CLI subcommands

| Command                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `alexi server start`   | Bind the socket, generate a token if needed, block until exit |
| `alexi server stop`    | Send an exit frame; user must SIGTERM the daemon to fully stop|
| `alexi server status`  | Report whether a running server is reachable on the socket    |

All three accept `--socket <path>` for tests or non-default deployments.
`alexi server status --json` emits machine-readable status for scripts.

## Files

| Path                          | Mode | Purpose                                       |
| ----------------------------- | ---- | --------------------------------------------- |
| `~/.alexi/server.sock`        | 0600 | UNIX domain socket the server binds to        |
| `~/.alexi/server-token`       | 0600 | Shared token clients present in `auth` frames |

The socket and token file are placed under `~/.alexi/` (mode 0700).
Anyone with read access to the token file already has connect access to
the socket, so the token is not a cryptographic bearer — it exists to
prevent accidental cross-user connects on shared machines and to force
clients to explicitly prove local filesystem access.

## Wire protocol

The wire format is **line-delimited JSON** (LDJSON): each frame is
exactly one JSON object followed by a `\n` byte. The current protocol
version reported in the `hello` banner is `1`.

### Server -> client frames

`hello` is sent unprompted immediately after a client connects:

```json
{"type":"hello","version":"1.18.9","protocol":1}
```

All request replies use one of two shapes:

```json
{"id":"<req-id>","type":"response","ok":true,"result":<any>}
{"id":"<req-id>","type":"error","ok":false,"error":{"code":"<CODE>","message":"..."}}
```

The `id` in the reply matches the `id` in the request. The parser
returns an error with `id: ""` for frames that cannot be parsed at all
(invalid JSON, missing `id`).

### Client -> server frames

Every request carries an `id` (any non-empty string; clients typically
use a UUID) and a `type` discriminator.

| type              | Payload fields         | Auth required | Description                                          |
| ----------------- | ---------------------- | ------------- | ---------------------------------------------------- |
| `auth`            | `token`                | no            | Present the shared token                             |
| `ping`            | -                      | no            | Health check; returns `{ pong: true, timestamp }`    |
| `session.create`  | -                      | yes           | Allocate a new isolated session, returns `sessionId` |
| `session.list`    | -                      | yes           | List all sessions this server has                    |
| `command`         | `command`, `sessionId?`| yes           | Dispatch a slash command                             |
| `exit`            | -                      | yes           | Close this client's connection (server keeps running)|

### Authentication flow

1. Client connects to the socket.
2. Server sends the `hello` banner.
3. Client sends `{ id, type: "auth", token }`.
4. Server replies with `response` (`authenticated: true`) or `error`
   (`INVALID_TOKEN`).
5. Only after a successful `auth` may the client send `session.*` or
   `command` frames. `ping` and `auth` are the only frames allowed
   pre-authentication; other frames get `AUTH_REQUIRED`.

### Dispatching a command

Slash commands are dispatched through Alexi's shared command registry
(the same one that powers the interactive REPL). A `command` frame
carries the full slash line including the leading `/`:

```json
{"id":"c-1","type":"command","command":"/review src/foo.ts","sessionId":"abc"}
```

The server tokenises the line by whitespace and calls
`getCommandRegistry().execute(name, args)`. Two built-ins are handled
inline before hitting the registry:

- `/help` returns `{ commands: [{ name, description }, ...] }` for
  client-side rendering. No template is rendered.
- `/exit` returns `{ closed: true }` and then closes only this client's
  socket. It never terminates the daemon.

### Session isolation

Each remote client can create one or more sessions with
`session.create`. Every session gets its own in-memory `SessionManager`
instance, keyed by a nanoid. Sessions are visible to any authenticated
client on the same server (there is no per-client scoping).

If a `command` frame omits `sessionId`, the server creates a fresh
session on the fly and returns its id in the response `sessionId`
field. Passing a `sessionId` that does not exist returns an
`SESSION_NOT_FOUND` error.

Remote sessions are **separate** from the host CLI's own session store
in `~/.alexi/sessions/` — remote sessions do not currently persist
across server restarts. That is intentional for the initial cut and
matches the "isolated" requirement in the design.

### Error codes

| Code                       | Meaning                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `AUTH_REQUIRED`            | Request sent before authentication                             |
| `INVALID_TOKEN`            | Token in `auth` frame did not match                            |
| `INVALID_JSON`             | Frame body could not be JSON.parse'd                           |
| `INVALID_REQUEST`          | JSON parsed but did not match the request schema               |
| `INVALID_COMMAND`          | Command frame value did not start with `/`                     |
| `EMPTY_FRAME`              | Empty line sent as a frame                                     |
| `COMMAND_NOT_FOUND`        | Slash command name not registered                              |
| `INVALID_ARGUMENTS`        | Command was found but arguments failed validation              |
| `COMMAND_EXECUTION_FAILED` | Command template rendering threw an unexpected error           |
| `SESSION_NOT_FOUND`        | `sessionId` in request does not match any live remote session  |
| `INTERNAL_ERROR`           | Uncaught error inside the dispatcher; safe to retry            |

## Reference client (Node.js)

```ts
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const socketPath = path.join(os.homedir(), '.alexi', 'server.sock');
const token = fs.readFileSync(path.join(os.homedir(), '.alexi', 'server-token'), 'utf-8').trim();

const socket = net.createConnection(socketPath);
socket.setEncoding('utf-8');

let buffer = '';
socket.on('data', (chunk: string) => {
  buffer += chunk;
  let idx = buffer.indexOf('\n');
  while (idx !== -1) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 1);
    console.log('recv:', JSON.parse(line));
    idx = buffer.indexOf('\n');
  }
});

socket.on('connect', () => {
  const send = (obj: unknown) => socket.write(JSON.stringify(obj) + '\n');
  send({ id: '1', type: 'auth', token });
  send({ id: '2', type: 'command', command: '/help' });
  send({ id: '3', type: 'exit' });
});
```

## Testing

The server is exercised by three test files:

- `tests/server/protocol.test.ts` — frame encoding, request parsing, slash-command tokenisation, and buffered LDJSON extraction.
- `tests/server/auth.test.ts` — token generation, file mode, safe compare, and default path resolution.
- `tests/server/socket.test.ts` — end-to-end lifecycle: connect, auth, dispatch, session isolation, and the `/exit` semantics.

All three run under vitest (`node` environment, no real SAP credentials
required — the server does not touch providers).
