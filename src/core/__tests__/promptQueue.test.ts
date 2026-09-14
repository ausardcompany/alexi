/**
 * Tests for PromptQueue — the append-only queue used to hold user
 * prompts that arrive while an agent goal is in flight.
 *
 * Mirrors kilocode upstream fixes:
 *   - 5665631ab fix(cli): keep a session goal running when a message arrives
 *   - 60bb54b0f fix(cli): harden goal preemption handling and test
 */

import { describe, it, expect, vi } from 'vitest';
import { PromptQueue, type ActiveGoalHandle } from '../promptQueue.js';

function makeGoal(id: string): { handle: ActiveGoalHandle; cancel: ReturnType<typeof vi.fn> } {
  const cancel = vi.fn();
  return { handle: { id, cancel }, cancel };
}

describe('PromptQueue', () => {
  it('does NOT cancel an active goal when a new prompt is enqueued', () => {
    const q = new PromptQueue();
    const { handle, cancel } = makeGoal('goal-1');
    q.startGoal(handle);

    q.enqueue({ text: 'follow up 1', enqueuedAt: Date.now() });
    q.enqueue({ text: 'follow up 2', enqueuedAt: Date.now() });

    expect(cancel).not.toHaveBeenCalled();
    expect(q.hasActiveGoal()).toBe(true);
    expect(q.size()).toBe(2);
  });

  it('drains queued prompts in enqueue order after the goal finishes', () => {
    const q = new PromptQueue();
    const { handle } = makeGoal('goal-2');
    q.startGoal(handle);

    q.enqueue({ text: 'first', enqueuedAt: 100 });
    q.enqueue({ text: 'second', enqueuedAt: 200 });

    q.finishGoal();

    const drained = q.drain();
    expect(drained.map((p) => p.text)).toEqual(['first', 'second']);
    expect(q.size()).toBe(0);
    expect(q.hasActiveGoal()).toBe(false);
  });

  it('cancels the active goal only on explicit interrupt()', () => {
    const q = new PromptQueue();
    const { handle, cancel } = makeGoal('goal-3');
    q.startGoal(handle);

    q.enqueue({ text: 'ignored while running', enqueuedAt: Date.now() });
    expect(cancel).not.toHaveBeenCalled();

    q.interrupt('user pressed Ctrl+C');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledWith('user pressed Ctrl+C');
    expect(q.hasActiveGoal()).toBe(false);
  });

  it('is a no-op when interrupt is called with no active goal', () => {
    const q = new PromptQueue();
    expect(() => q.interrupt('nothing to cancel')).not.toThrow();
    expect(q.hasActiveGoal()).toBe(false);
  });

  it('finishGoal is idempotent', () => {
    const q = new PromptQueue();
    const { handle } = makeGoal('goal-4');
    q.startGoal(handle);
    q.finishGoal();
    expect(() => q.finishGoal()).not.toThrow();
    expect(q.hasActiveGoal()).toBe(false);
  });

  it('reports queued-behind-goal via the callback', () => {
    const onQueuedBehindGoal = vi.fn();
    const q = new PromptQueue({ onQueuedBehindGoal });
    const { handle } = makeGoal('goal-5');
    q.startGoal(handle);

    q.enqueue({ text: 'behind', enqueuedAt: 42 });
    expect(onQueuedBehindGoal).toHaveBeenCalledTimes(1);
    expect(onQueuedBehindGoal.mock.calls[0][1]).toBe('goal-5');
  });

  it('does not fire queued-behind-goal when no goal is active', () => {
    const onQueuedBehindGoal = vi.fn();
    const q = new PromptQueue({ onQueuedBehindGoal });
    q.enqueue({ text: 'first', enqueuedAt: 1 });
    expect(onQueuedBehindGoal).not.toHaveBeenCalled();
  });

  it('drain returns [] when queue is empty', () => {
    const q = new PromptQueue();
    expect(q.drain()).toEqual([]);
  });
});
