import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { CompactionStarted, CompactionComplete, clearAllHandlers } from '../../src/bus/index.js';
import {
  compactConversation,
  partialCompact,
  setLLMSummarizeFn,
  type LLMSummarizeFn,
} from '../../src/core/compaction.js';
import type { Message } from '../../src/core/sessionManager.js';

function msg(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

function longMsgs(n: number): Message[] {
  const out: Message[] = [];
  for (let i = 0; i < n; i++) {
    out.push(msg(i % 2 === 0 ? 'user' : 'assistant', `Message ${i} `.repeat(20)));
  }
  return out;
}

describe('Compaction lifecycle events', () => {
  beforeEach(() => {
    // Ensure a clean bus so we do not leak subscribers between tests
    // (defineEvent-registered subscribers persist across imports).
    clearAllHandlers();
    setLLMSummarizeFn(null as unknown as LLMSummarizeFn);
  });

  afterEach(() => {
    clearAllHandlers();
  });

  describe('compactConversation', () => {
    it('emits CompactionStarted and CompactionComplete when real work happens', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      const messages = longMsgs(8);
      const { result } = await compactConversation(messages, { preserveLastN: 2 });

      expect(started).toHaveBeenCalledTimes(1);
      expect(complete).toHaveBeenCalledTimes(1);

      const startPayload = started.mock.calls[0][0];
      expect(startPayload.messageCount).toBe(8);
      expect(typeof startPayload.estimatedTokens).toBe('number');
      expect(startPayload.trigger).toBe('auto');
      expect(typeof startPayload.timestamp).toBe('number');

      const completePayload = complete.mock.calls[0][0];
      expect(completePayload.originalMessages).toBe(8);
      expect(completePayload.compactedMessages).toBe(result.compactedMessages);
      expect(completePayload.trigger).toBe('auto');
      expect(typeof completePayload.durationMs).toBe('number');
      expect(completePayload.durationMs).toBeGreaterThanOrEqual(0);
      expect(completePayload.error).toBeUndefined();
    });

    it('emits complete after started (ordering)', async () => {
      const events: string[] = [];
      CompactionStarted.subscribe(() => events.push('start'));
      CompactionComplete.subscribe(() => events.push('complete'));

      await compactConversation(longMsgs(8), { preserveLastN: 2 });

      expect(events).toEqual(['start', 'complete']);
    });

    it('does NOT emit events when compaction returns early with no work', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      // Fewer messages than preserveLastN => early return, no work
      await compactConversation([msg('user', 'Hi'), msg('assistant', 'Hello')], {
        preserveLastN: 4,
      });

      expect(started).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('does NOT emit events for empty message array', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      await compactConversation([]);

      expect(started).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });

    it('emits CompactionComplete with error when summarize fn throws', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      const failingLLM = vi.fn().mockRejectedValue(new Error('boom'));
      setLLMSummarizeFn(failingLLM as unknown as LLMSummarizeFn);

      await expect(compactConversation(longMsgs(8), { preserveLastN: 2 })).rejects.toThrow('boom');

      expect(started).toHaveBeenCalledTimes(1);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(complete.mock.calls[0][0].error).toBe('boom');
    });
  });

  describe('partialCompact', () => {
    it('emits CompactionStarted and CompactionComplete with trigger=partial', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      const messages = longMsgs(6);
      await partialCompact(messages, 3);

      expect(started).toHaveBeenCalledTimes(1);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(started.mock.calls[0][0].trigger).toBe('partial');
      expect(complete.mock.calls[0][0].trigger).toBe('partial');
    });

    it('does NOT emit events when boundary is out of range', async () => {
      const started = vi.fn();
      const complete = vi.fn();
      CompactionStarted.subscribe(started);
      CompactionComplete.subscribe(complete);

      await partialCompact(longMsgs(4), 0);
      await partialCompact(longMsgs(4), 999);

      expect(started).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();
    });
  });
});
