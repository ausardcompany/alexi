/**
 * Regression test for issue #1330: aborted streaming turns must flush the
 * partial transcript to the SessionManager so context is not silently
 * lost when the user cancels a long-running request.
 *
 * The orchestrator's happy path calls `persistAndRecord()` on natural
 * stream completion. On abort it never reaches that path — the iterator's
 * `next()` throws before finishing. Without an explicit flush, both the
 * outbound user prompt AND any partial assistant text would live only in
 * memory. This test drives the abort branch and asserts that:
 *
 *   1. The user's outbound prompt is appended to the session.
 *   2. Any partial assistant text streamed before the abort is appended
 *      to the session (empty partial texts are skipped so the transcript
 *      stays clean).
 *   3. `SessionManager.flush()` (or the addMessage side-effect) persists
 *      the session file to disk.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

import { streamChat } from '../../src/core/streamingOrchestrator.js';
import { SessionManager } from '../../src/core/sessionManager.js';
import { getProviderForModelWithFallback, getDefaultModel } from '../../src/providers/index.js';
import type { StreamChunk } from '../../src/providers/index.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orch-abort-'));
});

afterEach(() => {
  vi.resetAllMocks();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

/**
 * Provider that yields one chunk, then rejects with an abort-family error
 * on the next pull — mirroring a user-cancelled SAP AI Core SSE stream.
 */
function makeAbortingProvider(): { provider: { streamComplete: ReturnType<typeof vi.fn> } } {
  function streamComplete(_messages: unknown, _opts?: unknown) {
    async function* gen(): AsyncGenerator<StreamChunk> {
      yield { text: 'partial ' };
      // Simulate the fetch layer rejecting after cancellation.
      const err = Object.assign(new Error('The operation was aborted'), {
        code: 'ABORT_ERR',
      });
      throw err;
    }
    return gen();
  }
  return { provider: { streamComplete: vi.fn(streamComplete) } };
}

describe('streamChat flushes partial transcript on abort (issue #1330)', () => {
  it('persists the outbound prompt and partial assistant text when the stream aborts', async () => {
    const { provider } = makeAbortingProvider();
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const sessionManager = new SessionManager(tempDir);
    const session = sessionManager.createSession('gpt-4o');

    const iter = streamChat('user prompt about weather', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    // First chunk arrives normally.
    const first = await iter.next();
    expect(first.done).toBe(false);
    expect((first.value as StreamChunk).text).toBe('partial ');

    // Second pull rejects with ABORT_ERR — orchestrator must flush.
    await expect(iter.next()).rejects.toMatchObject({ code: 'ABORT_ERR' });

    // On-disk state: session file contains both messages.
    const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
    expect(fs.existsSync(sessionPath)).toBe(true);
    const saved = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as {
      messages: Array<{ role: string; content: string }>;
    };
    expect(saved.messages.map((m) => `${m.role}:${m.content}`)).toEqual([
      'user:user prompt about weather',
      'assistant:partial ',
    ]);
  });

  it('does not append an empty assistant turn when no text streamed before abort', async () => {
    // Provider aborts on the very first pull — no partial text yet.
    function streamComplete(_messages: unknown, _opts?: unknown) {
      async function* gen(): AsyncGenerator<StreamChunk> {
        // Suppress the empty-generator lint without emitting a yieldable
        // value the test would then have to filter out.
        if (false as boolean) {
          yield { text: 'unreachable' };
        }
        const err = Object.assign(new Error('cancelled'), { name: 'AbortError' });
        throw err;
      }
      return gen();
    }
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { streamComplete: vi.fn(streamComplete) } as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const sessionManager = new SessionManager(tempDir);
    const session = sessionManager.createSession('gpt-4o');

    const iter = streamChat('another prompt', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    await expect(iter.next()).rejects.toMatchObject({ name: 'AbortError' });

    const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
    const saved = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as {
      messages: Array<{ role: string; content: string }>;
    };
    // Only the user prompt is persisted — no empty assistant turn.
    expect(saved.messages.map((m) => `${m.role}:${m.content}`)).toEqual(['user:another prompt']);
  });

  it('does not flush when the error is not abort-family', async () => {
    function streamComplete(_messages: unknown, _opts?: unknown) {
      async function* gen(): AsyncGenerator<StreamChunk> {
        yield { text: 'some text ' };
        throw new Error('generic provider failure');
      }
      return gen();
    }
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: { streamComplete: vi.fn(streamComplete) } as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const sessionManager = new SessionManager(tempDir);
    const session = sessionManager.createSession('gpt-4o');
    // Snapshot the file mtime after createSession so we can detect any
    // subsequent write. createSession persists an empty transcript.
    const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
    const initialSize = fs.statSync(sessionPath).size;

    const iter = streamChat('prompt', {
      modelOverride: 'gpt-4o',
      sessionManager,
      streamIdleTimeoutMs: 0,
    });

    await iter.next();
    await expect(iter.next()).rejects.toThrow('generic provider failure');

    // The saved session must NOT include the aborted partial turn —
    // non-abort errors are intentionally not flushed by this path (they
    // may indicate a corrupted stream we do not want to persist).
    const finalSize = fs.statSync(sessionPath).size;
    expect(finalSize).toBe(initialSize);
  });
});
