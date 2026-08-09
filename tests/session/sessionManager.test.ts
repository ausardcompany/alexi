/**
 * Regression tests for issue #1330: flush transcript on abort and persist
 * seeded sessions immediately.
 *
 * Covers the four behaviours listed in the issue:
 *   1. `SessionManager.detectAbort()` classifies all three abort shapes.
 *   2. Aborted streaming turns flush the partial transcript to disk.
 *   3. `createSession({ initialMessages })` persists the seeded history
 *      immediately, so forked/recovered sessions survive a hub restart.
 *   4. Abort-family unhandled rejections do not kill the process (the
 *      shared abort guard swallows them and lets the REPL re-prompt).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Compaction and sessionClose are mocked identically to the existing
// SessionManager suite so we don't accidentally trigger a compaction run
// during a persistence assertion.
vi.mock('../../src/core/compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

vi.mock('../../src/core/sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { SessionManager, type Message, type Session } from '../../src/core/sessionManager.js';
import { installAbortGuard, uninstallAbortGuard } from '../../src/cli/utils/abortGuard.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-abort-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('SessionManager.detectAbort', () => {
  it('recognizes a plain Error with name === "AbortError"', () => {
    const err = Object.assign(new Error('cancelled'), { name: 'AbortError' });
    expect(SessionManager.detectAbort(err)).toBe(true);
  });

  it('recognizes an Error with code === "ABORT_ERR"', () => {
    const err = Object.assign(new Error('aborted'), { code: 'ABORT_ERR' });
    expect(SessionManager.detectAbort(err)).toBe(true);
  });

  it('recognizes a DOMException-shaped AbortError', () => {
    // DOMException is available on modern Node; fall back to a shim for
    // environments where it is not, so this test is portable.
    const err =
      typeof DOMException !== 'undefined'
        ? new DOMException('signal aborted', 'AbortError')
        : Object.assign(new Error('signal aborted'), { name: 'AbortError' });
    expect(SessionManager.detectAbort(err)).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(SessionManager.detectAbort(new Error('boom'))).toBe(false);
    expect(SessionManager.detectAbort('string error')).toBe(false);
    expect(SessionManager.detectAbort(null)).toBe(false);
    expect(SessionManager.detectAbort(undefined)).toBe(false);
    expect(SessionManager.detectAbort(42)).toBe(false);
  });

  it('is available as an instance method (forwarder)', () => {
    const mgr = new SessionManager(tempDir);
    const err = Object.assign(new Error('x'), { code: 'ABORT_ERR' });
    expect(mgr.detectAbort(err)).toBe(true);
    expect(mgr.detectAbort(new Error('regular'))).toBe(false);
  });
});

describe('SessionManager.flush / flushOnAbort', () => {
  it('flush() persists the active session even without addMessage', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    // Mutate the in-memory session as a stand-in for a partial transcript
    // that has not yet gone through addMessage (e.g. a caller mutating
    // getCurrentSession() directly during streaming).
    session.messages.push({
      role: 'assistant',
      content: 'partial response before abort',
      timestamp: Date.now(),
    });
    mgr.flush();

    const filePath = path.join(tempDir, `${session.metadata.id}.json`);
    const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Session;
    expect(saved.messages).toHaveLength(1);
    expect(saved.messages[0].content).toBe('partial response before abort');
  });

  it('flush() is a no-op when no session is active', () => {
    const mgr = new SessionManager(tempDir);
    // Should not throw and should not create any file.
    mgr.flush();
    expect(fs.readdirSync(tempDir)).toEqual([]);
  });

  it('flushOnAbort() flushes for abort-family errors and returns true', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    session.messages.push({
      role: 'assistant',
      content: 'streamed partial',
      timestamp: Date.now(),
    });

    const err = Object.assign(new Error('cancelled'), { name: 'AbortError' });
    expect(mgr.flushOnAbort(err)).toBe(true);

    const filePath = path.join(tempDir, `${session.metadata.id}.json`);
    const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Session;
    expect(saved.messages).toHaveLength(1);
    expect(saved.messages[0].content).toBe('streamed partial');
  });

  it('flushOnAbort() ignores non-abort errors and returns false', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    // Add a message so file has known content.
    mgr.addMessage('user', 'hi');

    // Overwrite the in-memory transcript AFTER the last flush so we can
    // detect whether flushOnAbort persisted or not.
    session.messages.push({
      role: 'assistant',
      content: 'not-yet-persisted',
      timestamp: Date.now(),
    });

    expect(mgr.flushOnAbort(new Error('something else'))).toBe(false);

    const filePath = path.join(tempDir, `${session.metadata.id}.json`);
    const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Session;
    // Only the addMessage('user', 'hi') should be on disk — the mutation
    // above was not flushed because the error is not abort-family.
    expect(saved.messages.map((m) => m.content)).toEqual(['hi']);
  });

  it('flushOnAbort() returns false when there is no active session', () => {
    const mgr = new SessionManager(tempDir);
    const err = Object.assign(new Error('x'), { code: 'ABORT_ERR' });
    expect(mgr.flushOnAbort(err)).toBe(false);
  });
});

describe('SessionManager.createSession with initialMessages', () => {
  const seeded: Message[] = [
    { role: 'user', content: 'first prompt', timestamp: 1_000, tokens: { input: 5 } },
    { role: 'assistant', content: 'first response', timestamp: 2_000, tokens: { output: 7 } },
  ];

  it('seeds the transcript and totals from initialMessages', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession('gpt-4', undefined, { initialMessages: seeded });

    expect(session.messages).toHaveLength(2);
    expect(session.metadata.messageCount).toBe(2);
    expect(session.metadata.totalTokens).toBe(12);
    expect(session.metadata.modelId).toBe('gpt-4');
    // Auto-title from the first seeded user message.
    expect(session.metadata.title).toBe('first prompt');
  });

  it('persists the seeded transcript to disk immediately', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession(undefined, undefined, { initialMessages: seeded });

    // A fresh SessionManager against the same directory must see the
    // seeded messages without any further addMessage/flush call. This is
    // the durability contract that lets forked/recovered sessions
    // survive a hub restart before the first completed turn.
    const mgr2 = new SessionManager(tempDir);
    const loaded = mgr2.loadSession(session.metadata.id);

    expect(loaded).not.toBeNull();
    expect(loaded!.messages).toHaveLength(2);
    expect(loaded!.messages.map((m) => m.content)).toEqual(['first prompt', 'first response']);
    expect(loaded!.metadata.messageCount).toBe(2);
    expect(loaded!.metadata.totalTokens).toBe(12);
  });

  it('does not mutate the caller-owned initialMessages array', () => {
    const mgr = new SessionManager(tempDir);
    const seededCopy: Message[] = [...seeded];
    mgr.createSession(undefined, undefined, { initialMessages: seededCopy });

    // The caller's array must not be aliased by the session — otherwise
    // pushing to it later would silently poison the session transcript.
    seededCopy.push({ role: 'user', content: 'later', timestamp: 3_000 });
    const session = mgr.getCurrentSession();
    expect(session!.messages).toHaveLength(2);
  });

  it('recovery from persisted store surfaces the seeded history', () => {
    // Write session-1 with seeded history.
    const mgr1 = new SessionManager(tempDir);
    const s1 = mgr1.createSession('gpt-4', undefined, { initialMessages: seeded });

    // Simulate a hub restart: throw away mgr1 and instantiate a fresh
    // manager over the same on-disk directory.
    const mgr2 = new SessionManager(tempDir);
    const recovered = mgr2.loadSession(s1.metadata.id);
    expect(recovered).not.toBeNull();
    expect(recovered!.messages).toHaveLength(2);
    expect(recovered!.metadata.title).toBe('first prompt');

    // And it can be continued: appending a new message after recovery
    // does not lose the seeded prefix.
    mgr2.addMessage('user', 'follow-up');
    const finalSession = mgr2.getCurrentSession()!;
    expect(finalSession.messages.map((m) => m.content)).toEqual([
      'first prompt',
      'first response',
      'follow-up',
    ]);
  });

  it('brand-new empty sessions still persist eagerly (backwards compatible)', () => {
    const mgr = new SessionManager(tempDir);
    const session = mgr.createSession();
    const filePath = path.join(tempDir, `${session.metadata.id}.json`);
    // Existing callers (fork, /session new, orchestrator setup) rely on
    // the session file being present right after createSession.
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe('abort-family unhandled rejections do not kill the process', () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>;
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let originalQuietFlag: string | undefined;

  beforeEach(() => {
    stderrSpy = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation((() => true) as typeof process.stderr.write);
    // If the guard mis-classifies and falls through to Node's default
    // behaviour it will call process.exit(1). We spy on it to assert the
    // negative case (no exit for abort-family errors) and to prevent the
    // test process from actually terminating.
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(((_code?: number) => {
      throw new Error(`process.exit(${_code}) called unexpectedly`);
    }) as typeof process.exit);
    originalQuietFlag = process.env.ALEXI_QUIET_ABORT;
    process.env.ALEXI_QUIET_ABORT = '1';
    installAbortGuard();
  });

  afterEach(() => {
    uninstallAbortGuard();
    stderrSpy.mockRestore();
    exitSpy.mockRestore();
    if (originalQuietFlag === undefined) {
      delete process.env.ALEXI_QUIET_ABORT;
    } else {
      process.env.ALEXI_QUIET_ABORT = originalQuietFlag;
    }
  });

  function getGuard(): (reason: unknown, promise: Promise<unknown>) => void {
    const listeners = process.listeners('unhandledRejection');
    expect(listeners.length).toBeGreaterThan(0);
    return listeners[listeners.length - 1] as (reason: unknown, promise: Promise<unknown>) => void;
  }

  it('DOMException AbortError is swallowed without process.exit', () => {
    const err =
      typeof DOMException !== 'undefined'
        ? new DOMException('signal aborted', 'AbortError')
        : Object.assign(new Error('signal aborted'), { name: 'AbortError' });
    const guard = getGuard();
    guard(
      err,
      Promise.reject(err).catch(() => undefined)
    );
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('Error with code === "ABORT_ERR" is swallowed without process.exit', () => {
    const err = Object.assign(new Error('undici abort'), { code: 'ABORT_ERR' });
    const guard = getGuard();
    guard(
      err,
      Promise.reject(err).catch(() => undefined)
    );
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('Error with name === "AbortError" is swallowed without process.exit', () => {
    const err = Object.assign(new Error('cancelled'), { name: 'AbortError' });
    const guard = getGuard();
    guard(
      err,
      Promise.reject(err).catch(() => undefined)
    );
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
