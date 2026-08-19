/**
 * Verify that the streaming orchestrator fires a completion notification
 * (issue #1449) via `notifyInBackground` only when the stream drains
 * cleanly. Aborts and provider errors must NOT trigger the notification.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

vi.mock('../../src/core/notifications.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/core/notifications.js')>(
    '../../src/core/notifications.js'
  );
  return {
    ...actual,
    notifyInBackground: vi.fn(),
  };
});

import { streamChat } from '../../src/core/streamingOrchestrator.js';
import { getProviderForModelWithFallback } from '../../src/providers/index.js';
import { notifyInBackground } from '../../src/core/notifications.js';
import type { StreamChunk } from '../../src/providers/index.js';

function makeFiniteProvider(chunks: StreamChunk[]) {
  function streamComplete(_m: unknown, _o?: unknown) {
    async function* gen(): AsyncGenerator<StreamChunk> {
      for (const c of chunks) {
        yield c;
      }
    }
    return gen();
  }
  return { streamComplete: vi.fn(streamComplete) };
}

describe('streamChat completion notification (issue #1449)', () => {
  beforeEach(() => {
    vi.mocked(notifyInBackground).mockClear();
  });

  afterEach(() => {
    vi.mocked(notifyInBackground).mockClear();
  });

  it('fires notifyInBackground once when the stream completes cleanly', async () => {
    const provider = makeFiniteProvider([{ text: 'ok' }]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 0,
    });

    // Drain the iterator to a natural end-of-stream.
    let done = false;
    while (!done) {
      const step = await iter.next();
      done = step.done ?? false;
    }
    expect(done).toBe(true);
    expect(notifyInBackground).toHaveBeenCalledTimes(1);
    const [title, message] = vi.mocked(notifyInBackground).mock.calls[0]!;
    expect(title).toBe('Alexi');
    expect(message).toBe('Task completed');
  });

  it('does NOT fire notifyInBackground when the caller aborts via return()', async () => {
    const provider = makeFiniteProvider([{ text: 'first' }, { text: 'second' }]);
    vi.mocked(getProviderForModelWithFallback).mockReturnValue({
      provider: provider as never,
      effectiveModelId: 'gpt-4o',
      usedFallback: false,
    });

    const iter = streamChat('hi', {
      modelOverride: 'gpt-4o',
      streamIdleTimeoutMs: 0,
    });

    const first = await iter.next();
    expect(first.done).toBe(false);
    // Preempt: this must NOT trigger the "task completed" notification —
    // the user cancelled, they know the task is done.
    await iter.return();
    // Because the naturally-completed path is what fires the notification,
    // an aborted stream persists the session but does not call it.
    // (`persistAndRecord` still runs, but only inside `completedCleanly`
    // is `notifyInBackground` invoked.)
    expect(notifyInBackground).not.toHaveBeenCalled();
  });
});
