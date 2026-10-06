/**
 * Tests for the reasoning-finalization + retry integration.
 *
 * Ports kilocode `54eacd5ff` ("finalize reasoning before stream
 * retries") and the opencode fixture
 * `packages/opencode/test/kilocode/session-processor-incomplete-response-retry.test.ts`.
 * The contract under test:
 *   1. When a stream fails mid-reasoning, the in-flight reasoning
 *      block is finalized (terminal part emitted, buffer cleared)
 *      BEFORE the next retry opens a fresh stream.
 *   2. Finalization is a no-op when no reasoning tokens were seen.
 *   3. A finalize that itself throws does NOT prevent the retry.
 */

import { describe, expect, it, vi } from 'vitest';
import {
  appendReasoningToken,
  createReasoningStreamState,
  finalizeReasoningBeforeRetry,
} from '../reasoning-finalize.js';
import { withRetry, isNetworkRetryable } from '../retry.js';

describe('finalizeReasoningBeforeRetry', () => {
  it('emits terminal part and clears buffer when a block is open', async () => {
    const finalize = vi.fn();
    const state = createReasoningStreamState(finalize);
    appendReasoningToken(state, 'Thinking about ');
    appendReasoningToken(state, 'SAP AI Core.');

    await finalizeReasoningBeforeRetry(state);

    expect(finalize).toHaveBeenCalledTimes(1);
    expect(state.finalized).toBe(true);
    expect(state.buffer).toBe('');
  });

  it('is a no-op when the buffer is empty', async () => {
    const finalize = vi.fn();
    const state = createReasoningStreamState(finalize);

    await finalizeReasoningBeforeRetry(state);

    expect(finalize).not.toHaveBeenCalled();
    expect(state.finalized).toBe(true);
  });

  it('does not finalize twice', async () => {
    const finalize = vi.fn();
    const state = createReasoningStreamState(finalize);
    appendReasoningToken(state, 'partial');

    await finalizeReasoningBeforeRetry(state);
    await finalizeReasoningBeforeRetry(state);

    expect(finalize).toHaveBeenCalledTimes(1);
  });

  it('swallows errors from finalize so the retry proceeds', async () => {
    const finalize = vi.fn().mockRejectedValue(new Error('bus closed'));
    const state = createReasoningStreamState(finalize);
    appendReasoningToken(state, 'partial');

    await expect(finalizeReasoningBeforeRetry(state)).resolves.toBeUndefined();
    expect(state.finalized).toBe(true);
    expect(state.buffer).toBe('');
  });

  it('tolerates an undefined state (no reasoning channel)', async () => {
    await expect(finalizeReasoningBeforeRetry(undefined)).resolves.toBeUndefined();
  });

  it('is called via withRetry onRetry hook on a transient failure', async () => {
    const finalize = vi.fn();
    const state = createReasoningStreamState(finalize);
    appendReasoningToken(state, 'thinking…');
    let attempts = 0;

    const result = await withRetry(
      async () => {
        attempts++;
        if (attempts === 1) {
          // Simulate a transient stream drop mid-reasoning.
          throw new Error('socket hang up');
        }
        return 'ok';
      },
      isNetworkRetryable,
      {
        baseMs: 1,
        jitter: false,
        onRetry: async () => {
          await finalizeReasoningBeforeRetry(state);
        },
      }
    );

    expect(result).toBe('ok');
    expect(attempts).toBe(2);
    expect(finalize).toHaveBeenCalledTimes(1);
    expect(state.buffer).toBe('');
    expect(state.finalized).toBe(true);
  });

  it('does not call onRetry for permanent failures', async () => {
    const onRetry = vi.fn();
    await expect(
      withRetry(
        async () => {
          throw new Error('401 unauthorized');
        },
        isNetworkRetryable,
        {
          maxAttempts: 3,
          baseMs: 1,
          jitter: false,
          onRetry,
        }
      )
    ).rejects.toThrow('401 unauthorized');
    expect(onRetry).not.toHaveBeenCalled();
  });
});
