import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import net from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startSocketServer, type SocketServerHandle } from '../../src/server/socket.js';
import { registerBuiltInCommands } from '../../src/command/index.js';

/**
 * Minimal LDJSON client for driving the server in tests. Buffers
 * incoming data and yields decoded JSON frames via {@link readFrame}.
 */
class TestClient {
  private socket: net.Socket;
  private buffer = '';
  private pending: string[] = [];
  private waiters: Array<(line: string) => void> = [];

  constructor(socketPath: string) {
    this.socket = net.createConnection(socketPath);
    this.socket.setEncoding('utf-8');
    this.socket.on('data', (chunk: string) => {
      this.buffer += chunk;
      let idx = this.buffer.indexOf('\n');
      while (idx !== -1) {
        const line = this.buffer.slice(0, idx);
        this.buffer = this.buffer.slice(idx + 1);
        const waiter = this.waiters.shift();
        if (waiter) {
          waiter(line);
        } else {
          this.pending.push(line);
        }
        idx = this.buffer.indexOf('\n');
      }
    });
  }

  send(obj: unknown): void {
    this.socket.write(JSON.stringify(obj) + '\n');
  }

  async ready(): Promise<void> {
    if (this.socket.connecting) {
      await new Promise<void>((resolve, reject) => {
        this.socket.once('connect', resolve);
        this.socket.once('error', reject);
      });
    }
  }

  async readFrame(): Promise<Record<string, unknown>> {
    let line: string;
    if (this.pending.length > 0) {
      line = this.pending.shift()!;
    } else {
      line = await new Promise<string>((resolve) => this.waiters.push(resolve));
    }
    return JSON.parse(line) as Record<string, unknown>;
  }

  end(): void {
    this.socket.end();
  }

  destroy(): void {
    this.socket.destroy();
  }

  get isClosed(): boolean {
    return this.socket.destroyed || this.socket.readyState === 'closed';
  }
}

describe('UNIX socket server lifecycle', () => {
  let tmpdir: string;
  let socketPath: string;
  let handle: SocketServerHandle;
  const token = 'test-token-abc123';

  beforeEach(async () => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-socket-'));
    socketPath = path.join(tmpdir, 'server.sock');
    // Ensure at least one command is registered so /help lists something.
    registerBuiltInCommands();
    handle = await startSocketServer({ socketPath, token });
  });

  afterEach(async () => {
    await handle.stop();
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  it('binds to the requested socket path and cleans up on stop', async () => {
    expect(fs.existsSync(socketPath)).toBe(true);
    await handle.stop();
    expect(fs.existsSync(socketPath)).toBe(false);
    // Restart for afterEach.
    handle = await startSocketServer({ socketPath, token });
  });

  it('sends a hello banner on connect', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    const hello = await client.readFrame();
    expect(hello.type).toBe('hello');
    expect(hello.protocol).toBe(1);
    client.end();
  });

  it('rejects unauthenticated non-auth requests with AUTH_REQUIRED', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'session.create' });
    const resp = await client.readFrame();
    expect(resp.type).toBe('error');
    expect(resp.ok).toBe(false);
    const err = resp.error as { code: string };
    expect(err.code).toBe('AUTH_REQUIRED');
    client.end();
  });

  it('accepts a valid auth token', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'auth', token });
    const resp = await client.readFrame();
    expect(resp.type).toBe('response');
    expect(resp.ok).toBe(true);
    const result = resp.result as { authenticated: boolean };
    expect(result.authenticated).toBe(true);
    client.end();
  });

  it('rejects a bad auth token', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'auth', token: 'wrong-token' });
    const resp = await client.readFrame();
    expect(resp.type).toBe('error');
    const err = resp.error as { code: string };
    expect(err.code).toBe('INVALID_TOKEN');
    client.end();
  });

  it('permits ping without authentication', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'ping' });
    const resp = await client.readFrame();
    expect(resp.type).toBe('response');
    const result = resp.result as { pong: boolean };
    expect(result.pong).toBe(true);
    client.end();
  });

  it('creates isolated sessions per session.create request', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'auth', token });
    await client.readFrame(); // auth ok

    client.send({ id: '2', type: 'session.create' });
    const s1 = (await client.readFrame()).result as { sessionId: string };
    client.send({ id: '3', type: 'session.create' });
    const s2 = (await client.readFrame()).result as { sessionId: string };

    expect(s1.sessionId).toBeTruthy();
    expect(s2.sessionId).toBeTruthy();
    expect(s1.sessionId).not.toBe(s2.sessionId);
    expect(handle.sessionCount()).toBe(2);
    client.end();
  });

  it('dispatches /help through the command registry', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    client.send({ id: '1', type: 'auth', token });
    await client.readFrame();

    client.send({ id: '2', type: 'command', command: '/help' });
    const resp = await client.readFrame();
    expect(resp.type).toBe('response');
    const result = resp.result as {
      sessionId: string;
      help: { commands: Array<{ name: string }> };
    };
    expect(result.sessionId).toBeTruthy();
    expect(Array.isArray(result.help.commands)).toBe(true);
    expect(result.help.commands.length).toBeGreaterThan(0);
    client.end();
  });

  it('reports COMMAND_NOT_FOUND for unknown slash commands', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame();
    client.send({ id: '1', type: 'auth', token });
    await client.readFrame();

    client.send({ id: '2', type: 'command', command: '/does-not-exist' });
    const resp = await client.readFrame();
    expect(resp.type).toBe('error');
    const err = resp.error as { code: string };
    expect(err.code).toBe('COMMAND_NOT_FOUND');
    client.end();
  });

  it('remote /exit closes only that client, not the server', async () => {
    const c1 = new TestClient(socketPath);
    const c2 = new TestClient(socketPath);
    await c1.ready();
    await c2.ready();
    await c1.readFrame();
    await c2.readFrame();

    c1.send({ id: '1', type: 'auth', token });
    c2.send({ id: '1', type: 'auth', token });
    await c1.readFrame();
    await c2.readFrame();

    c1.send({ id: '2', type: 'command', command: '/exit' });
    const closed = await c1.readFrame();
    expect(closed.type).toBe('response');
    const result = closed.result as { closed: boolean };
    expect(result.closed).toBe(true);

    // Give c1 a moment to close, then confirm c2 still works.
    await new Promise((r) => setTimeout(r, 30));

    c2.send({ id: '2', type: 'ping' });
    const pong = await c2.readFrame();
    expect(pong.type).toBe('response');
    c2.end();
  });

  it('an explicit exit frame closes only the sending client', async () => {
    const c1 = new TestClient(socketPath);
    const c2 = new TestClient(socketPath);
    await c1.ready();
    await c2.ready();
    await c1.readFrame();
    await c2.readFrame();
    c1.send({ id: '1', type: 'auth', token });
    c2.send({ id: '1', type: 'auth', token });
    await c1.readFrame();
    await c2.readFrame();

    c1.send({ id: '2', type: 'exit' });
    const bye = await c1.readFrame();
    expect(bye.type).toBe('response');

    await new Promise((r) => setTimeout(r, 30));

    c2.send({ id: '2', type: 'ping' });
    const pong = await c2.readFrame();
    expect(pong.type).toBe('response');
    c2.end();
  });

  it('rejects a command referencing an unknown sessionId', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame();
    client.send({ id: '1', type: 'auth', token });
    await client.readFrame();

    client.send({
      id: '2',
      type: 'command',
      command: '/help',
      sessionId: 'nonexistent-session',
    });
    const resp = await client.readFrame();
    expect(resp.type).toBe('error');
    const err = resp.error as { code: string };
    expect(err.code).toBe('SESSION_NOT_FOUND');
    client.end();
  });

  it('returns an error for invalid JSON frames', async () => {
    const client = new TestClient(socketPath);
    await client.ready();
    await client.readFrame(); // hello
    // Bypass send() to write malformed input directly. The test client
    // exposes its underlying socket via a typed cast; using unknown as
    // an intermediate keeps the cast eslint-clean.
    const rawSocket = (client as unknown as { socket: net.Socket }).socket;
    rawSocket.write('{not json}\n');
    const resp = await client.readFrame();
    expect(resp.type).toBe('error');
    const err = resp.error as { code: string };
    expect(err.code).toBe('INVALID_JSON');
    client.end();
  });
});
