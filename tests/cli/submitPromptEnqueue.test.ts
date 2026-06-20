/**
 * Tests for `enqueueSubmitPrompt` — the REPL helper that queues a
 * follow-up prompt as the next user turn after a command renders.
 *
 * Issue #779.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { enqueueSubmitPrompt, type ReplState } from '../../src/cli/interactive.js';

function makeState(): ReplState {
  return {
    sessionManager: {} as ReplState['sessionManager'],
    currentModel: 'sap-ai-core/anthropic--claude-4.7-opus',
    autoRoute: false,
    preferCheap: false,
    isStreaming: false,
  };
}

describe('enqueueSubmitPrompt', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('returns false and does not enqueue for undefined prompt', () => {
    const state = makeState();
    const enqueued = enqueueSubmitPrompt(state, undefined);
    expect(enqueued).toBe(false);
    expect(state.submitPromptQueue).toBeUndefined();
  });

  it('returns false for empty string', () => {
    const state = makeState();
    const enqueued = enqueueSubmitPrompt(state, '');
    expect(enqueued).toBe(false);
    expect(state.submitPromptQueue).toBeUndefined();
  });

  it('returns false for whitespace-only prompt', () => {
    const state = makeState();
    const enqueued = enqueueSubmitPrompt(state, '   \n\t  ');
    expect(enqueued).toBe(false);
    expect(state.submitPromptQueue).toBeUndefined();
  });

  it('enqueues a non-empty prompt onto the FIFO queue', () => {
    const state = makeState();
    const enqueued = enqueueSubmitPrompt(state, 'now apply fixes to main.ts');
    expect(enqueued).toBe(true);
    expect(state.submitPromptQueue).toEqual(['now apply fixes to main.ts']);
  });

  it('preserves FIFO order when multiple prompts are enqueued', () => {
    const state = makeState();
    enqueueSubmitPrompt(state, 'first');
    enqueueSubmitPrompt(state, 'second');
    enqueueSubmitPrompt(state, 'third');
    expect(state.submitPromptQueue).toEqual(['first', 'second', 'third']);
  });

  it('prints a status line with a truncated preview', () => {
    const state = makeState();
    enqueueSubmitPrompt(state, 'short');
    const calls = logSpy.mock.calls.map((args) => args.join(' '));
    expect(calls.some((line) => line.includes('queued follow-up'))).toBe(true);
    expect(calls.some((line) => line.includes('short'))).toBe(true);
  });

  it('truncates the preview to 80 chars', () => {
    const state = makeState();
    const long = 'a'.repeat(200);
    enqueueSubmitPrompt(state, long);
    const calls = logSpy.mock.calls.map((args) => args.join(' '));
    const preview = calls.find((line) => line.includes('queued follow-up'));
    expect(preview).toBeDefined();
    expect(preview!).toContain('...');
    // The 80-char prefix plus '...' should appear; the full 200-char string
    // should not.
    expect(preview!).not.toContain(long);
  });
});
