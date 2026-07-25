/**
 * UNIX socket server protocol
 *
 * Line-delimited JSON (LDJSON): each frame is exactly one JSON object
 * terminated by a `\n` byte. This keeps the wire format trivial for
 * remote clients (`nc -U`, IDE plugins, test harnesses) while still
 * being strongly typed on both ends.
 *
 * Message shapes:
 *
 *   Client -> Server (request):
 *     { id, type: 'auth',           token }
 *     { id, type: 'ping' }
 *     { id, type: 'command',        command, sessionId? }   // "/help", "/foo a b"
 *     { id, type: 'session.create' }
 *     { id, type: 'session.list' }
 *     { id, type: 'exit' }                                   // close this client
 *
 *   Server -> Client:
 *     { type: 'hello',   version, protocol }                 // sent on connect
 *     { id, type: 'response', ok: true,  result }
 *     { id, type: 'error',    ok: false, error: { code, message } }
 *
 * Auth: the server sends `hello`, then rejects every non-`auth`/`ping`
 * request with `AUTH_REQUIRED` until the client sends a valid `auth`
 * frame. See {@link src/server/auth.ts} for token generation/storage.
 */

import { z } from 'zod';

/** Wire-format protocol version. Bump when adding breaking changes. */
export const PROTOCOL_VERSION = 1;

// ============ Request Schemas ============

const RequestBaseSchema = z.object({
  id: z.string().min(1),
});

export const AuthRequestSchema = RequestBaseSchema.extend({
  type: z.literal('auth'),
  token: z.string().min(1),
});

export const PingRequestSchema = RequestBaseSchema.extend({
  type: z.literal('ping'),
});

export const CommandRequestSchema = RequestBaseSchema.extend({
  type: z.literal('command'),
  /**
   * Full slash-command line including the leading `/`. E.g. `/help` or
   * `/review src/foo.ts`. Whitespace-separated tokens after the command
   * name are passed to the command's positional arguments.
   */
  command: z.string().min(1),
  sessionId: z.string().optional(),
});

export const SessionCreateRequestSchema = RequestBaseSchema.extend({
  type: z.literal('session.create'),
});

export const SessionListRequestSchema = RequestBaseSchema.extend({
  type: z.literal('session.list'),
});

export const ExitRequestSchema = RequestBaseSchema.extend({
  type: z.literal('exit'),
});

export const RequestSchema = z.discriminatedUnion('type', [
  AuthRequestSchema,
  PingRequestSchema,
  CommandRequestSchema,
  SessionCreateRequestSchema,
  SessionListRequestSchema,
  ExitRequestSchema,
]);

export type Request = z.infer<typeof RequestSchema>;
export type AuthRequest = z.infer<typeof AuthRequestSchema>;
export type CommandRequest = z.infer<typeof CommandRequestSchema>;

// ============ Response Types ============

export interface HelloMessage {
  type: 'hello';
  version: string;
  protocol: number;
}

export interface SuccessResponse<T = unknown> {
  id: string;
  type: 'response';
  ok: true;
  result: T;
}

export interface ErrorResponse {
  id: string;
  type: 'error';
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export type Response = SuccessResponse | ErrorResponse;
export type ServerMessage = HelloMessage | Response;

// ============ Parsing / Encoding ============

/**
 * Encode a server-to-client message as a single LDJSON frame terminated
 * by `\n`. Never returns undefined; if `JSON.stringify` throws (e.g. a
 * circular reference in `result`), it will propagate to the caller so
 * the connection handler can convert it into an error frame.
 */
export function encodeFrame(message: ServerMessage): string {
  return JSON.stringify(message) + '\n';
}

/**
 * Parse and validate a single client request frame.
 *
 * Returns a typed {@link Request} on success, or a discriminated failure
 * describing the problem. Callers should treat parse failures as
 * protocol violations and reply with an `ErrorResponse`.
 *
 * Note: the incoming line must NOT include the trailing `\n` — the
 * framing layer strips it before calling this function.
 */
export function parseRequest(
  line: string
): { ok: true; request: Request } | { ok: false; code: string; message: string } {
  const trimmed = line.trim();
  if (!trimmed) {
    return { ok: false, code: 'EMPTY_FRAME', message: 'Empty frame' };
  }

  let json: unknown;
  try {
    json = JSON.parse(trimmed);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, code: 'INVALID_JSON', message: `Invalid JSON: ${detail}` };
  }

  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const at = first?.path.length ? ` at ${first.path.join('.')}` : '';
    const msg = first ? `${first.message}${at}` : 'Invalid request shape';
    return { ok: false, code: 'INVALID_REQUEST', message: msg };
  }
  return { ok: true, request: parsed.data };
}

/**
 * Build a success response frame for a given request id.
 */
export function success<T>(id: string, result: T): SuccessResponse<T> {
  return { id, type: 'response', ok: true, result };
}

/**
 * Build an error response frame for a given request id.
 */
export function failure(id: string, code: string, message: string): ErrorResponse {
  return { id, type: 'error', ok: false, error: { code, message } };
}

/**
 * Split a slash-command line like `/foo bar baz` into `{name, args}`.
 * Returns `null` when the input does not start with `/` or contains no
 * command name after the slash. Whitespace splitting is deliberately
 * simple (no shell quoting) — this matches the interactive REPL and
 * keeps the wire protocol trivial for IDE clients.
 */
export function parseSlashCommand(line: string): { name: string; args: string[] } | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('/')) {
    return null;
  }
  const parts = trimmed.slice(1).split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return null;
  }
  const [name, ...args] = parts;
  return { name, args };
}

/**
 * Feed raw bytes from a socket and yield complete LDJSON lines (without
 * the trailing `\n`). Callers hand back the returned `buffer` on the
 * next call to preserve partial frames.
 *
 * This helper is intentionally pure so it is easy to unit-test without
 * spinning up a real socket.
 */
export function extractLines(buffer: string, chunk: string): { lines: string[]; buffer: string } {
  const combined = buffer + chunk;
  const parts = combined.split('\n');
  // Last element is the (possibly empty) partial line still being received.
  const remaining = parts.pop() ?? '';
  return { lines: parts, buffer: remaining };
}
