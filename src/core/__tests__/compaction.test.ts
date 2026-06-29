import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  estimateTokens,
  estimateMessagesTokens,
  shouldCompact,
  compactConversation,
  setLLMSummarizeFn,
  getLLMSummarizeFn,
  type LLMSummarizeFn,
} from '../compaction.js';
import type { Message } from '../sessionManager.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string, timestamp?: number): Message {
  return {
    role,
    content,
    timestamp: timestamp ?? Date.now(),
  };
}

// Helper for messages that carry recorded token usage.
function createMessageWithTokens(
  role: Message['role'],
  content: string,
  tokens: { input?: number; output?: number }
): Message {
  return {
    role,
    content,
    timestamp: Date.now(),
    tokens,
  };
}

describe('Context Compaction System', () => {
  beforeEach(() => {
    // Reset global LLM function before each test
    setLLMSummarizeFn(null as unknown as LLMSummarizeFn);
  });

  describe('estimateTokens', () => {
    it('should return 0 for empty string', () => {
      expect(estimateTokens('')).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(estimateTokens(null as unknown as string)).toBe(0);
      expect(estimateTokens(undefined as unknown as string)).toBe(0);
    });

    it('should estimate ~4 chars per token', () => {
      // 4 chars = 1 token
      expect(estimateTokens('1234')).toBe(1);

      // 8 chars = 2 tokens
      expect(estimateTokens('12345678')).toBe(2);

      // 10 chars = 3 tokens (ceil)
      expect(estimateTokens('1234567890')).toBe(3);
    });

    it('should handle longer text', () => {
      const longText = 'a'.repeat(1000);
      expect(estimateTokens(longText)).toBe(250);
    });
  });

  describe('estimateMessagesTokens', () => {
    it('should return 0 for empty array', () => {
      expect(estimateMessagesTokens([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(estimateMessagesTokens(null as unknown as Message[])).toBe(0);
      expect(estimateMessagesTokens(undefined as unknown as Message[])).toBe(0);
    });

    it('should add overhead for each message', () => {
      const messages: Message[] = [
        createMessage('user', ''), // Empty content, just overhead
      ];

      // 4 tokens overhead per message + 0 for empty content
      expect(estimateMessagesTokens(messages)).toBe(4);
    });

    it('should sum tokens across messages', () => {
      const messages: Message[] = [
        createMessage('user', '1234'), // 1 token + 4 overhead = 5
        createMessage('assistant', '12345678'), // 2 tokens + 4 overhead = 6
      ];

      expect(estimateMessagesTokens(messages)).toBe(11);
    });

    it('should prefer recorded tokens over chars/4 when present', () => {
      // Recorded tokens differ wildly from content length so we can prove the
      // estimator is using the recorded values, not the chars/4 heuristic.
      const messages: Message[] = [
        createMessageWithTokens('user', 'short', { input: 1000 }), // 5 chars but 1000 recorded
        createMessageWithTokens('assistant', 'also short', { output: 500 }), // 10 chars but 500 recorded
      ];

      // 4 (overhead) + 1000 + 4 (overhead) + 500 = 1508
      expect(estimateMessagesTokens(messages)).toBe(1508);
    });

    it('should fall back to chars/4 when recorded tokens are missing or zero', () => {
      const messages: Message[] = [
        createMessage('user', '1234'), // no recorded tokens => 1 + 4 = 5
        createMessageWithTokens('assistant', '12345678', { input: 0, output: 0 }), // zero => 2 + 4 = 6
      ];

      expect(estimateMessagesTokens(messages)).toBe(11);
    });

    it('should sum input + output when both recorded', () => {
      const messages: Message[] = [
        createMessageWithTokens('assistant', 'irrelevant', { input: 100, output: 200 }),
      ];

      // 4 overhead + (100 + 200) = 304
      expect(estimateMessagesTokens(messages)).toBe(304);
    });
  });

  describe('shouldCompact', () => {
    it('should return false for empty messages', () => {
      expect(shouldCompact([], 1000)).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(shouldCompact(null as unknown as Message[], 1000)).toBe(false);
      expect(shouldCompact(undefined as unknown as Message[], 1000)).toBe(false);
    });

    it('should return false when below threshold (default 90%)', () => {
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(100)), // ~25 tokens + 4 overhead = 29
      ];

      // 29 tokens < 90% of 100 (90 tokens)
      expect(shouldCompact(messages, 100)).toBe(false);
    });

    it('should return true when at or above threshold (default 90%)', () => {
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)), // ~100 tokens + 4 overhead = 104
      ];

      // 104 tokens >= 90% of 100 (90 tokens)
      expect(shouldCompact(messages, 100)).toBe(true);
    });

    it('should use custom threshold', () => {
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(200)), // ~50 tokens + 4 overhead = 54
      ];

      // With 50% threshold: 54 tokens >= 50% of 100 (50 tokens) = true
      expect(shouldCompact(messages, 100, 50)).toBe(true);

      // With 60% threshold: 54 tokens < 60% of 100 (60 tokens) = false
      expect(shouldCompact(messages, 100, 60)).toBe(false);
    });

    it('should accept an options bag with threshold and reserveOutputTokens', () => {
      // 1500 chars = ~375 tokens + 4 overhead = 379.
      const messages: Message[] = [createMessage('user', 'a'.repeat(1500))];

      // Without reserve: 379 >= 80% of 1000 (800) => false.
      expect(shouldCompact(messages, 1000, { threshold: 80 })).toBe(false);

      // With a huge reserve, trigger budget = 100; 80% = 80; 379 >= 80 => true.
      expect(shouldCompact(messages, 1000, { threshold: 80, reserveOutputTokens: 900 })).toBe(true);
    });

    it('should exclude reserved output budget from the trigger', () => {
      // Conversation: 700 tokens recorded.
      const messages: Message[] = [createMessageWithTokens('user', 'irrelevant', { input: 700 })];

      // maxContextTokens=1000, threshold=80%.
      // Without reserve: trigger budget = 1000; 80% = 800; 704 < 800 => false.
      expect(shouldCompact(messages, 1000, { threshold: 80 })).toBe(false);

      // With reserveOutputTokens=200: trigger budget = 800; 80% = 640;
      //   704 >= 640 => true. The reserved output budget pulls the trigger
      //   forward so we compact BEFORE the conversation collides with the
      //   space the provider needs for its next response.
      expect(shouldCompact(messages, 1000, { threshold: 80, reserveOutputTokens: 200 })).toBe(true);
    });
  });

  describe('compactConversation', () => {
    describe('message preservation (last N kept)', () => {
      it('should keep all messages when count <= preserveLastN', async () => {
        const messages: Message[] = [
          createMessage('user', 'Hello'),
          createMessage('assistant', 'Hi there'),
        ];

        const { messages: compacted, result } = await compactConversation(messages, {
          preserveLastN: 4, // Default
        });

        expect(compacted).toHaveLength(2);
        expect(result.originalMessages).toBe(2);
        expect(result.compactedMessages).toBe(2);
        expect(result.estimatedTokensSaved).toBe(0);
        expect(result.summary).toBe('');
      });

      it('should preserve last N non-system messages', async () => {
        const messages: Message[] = [
          createMessage('user', 'Message 1'),
          createMessage('assistant', 'Response 1'),
          createMessage('user', 'Message 2'),
          createMessage('assistant', 'Response 2'),
          createMessage('user', 'Message 3'),
          createMessage('assistant', 'Response 3'),
        ];

        const { messages: compacted, result } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        // Should have: 1 summary + 2 preserved = 3 messages
        expect(compacted).toHaveLength(3);
        expect(result.compactedMessages).toBe(3);

        // Last 2 messages should be preserved
        const lastTwo = compacted.slice(-2);
        expect(lastTwo[0].content).toBe('Message 3');
        expect(lastTwo[1].content).toBe('Response 3');
      });

      it('should preserve system messages separately', async () => {
        const messages: Message[] = [
          createMessage('system', 'You are a helpful assistant'),
          createMessage('user', 'Message 1'),
          createMessage('assistant', 'Response 1'),
          createMessage('user', 'Message 2'),
          createMessage('assistant', 'Response 2'),
          createMessage('user', 'Message 3'),
          createMessage('assistant', 'Response 3'),
        ];

        const { messages: compacted } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        // Should have: 1 system + 1 summary + 2 preserved = 4 messages
        expect(compacted).toHaveLength(4);

        // First should be original system message
        expect(compacted[0].role).toBe('system');
        expect(compacted[0].content).toBe('You are a helpful assistant');

        // Second should be summary (also system role)
        expect(compacted[1].role).toBe('system');
        expect(compacted[1].content).toContain('[CONVERSATION SUMMARY]');
      });
    });

    describe('with mocked LLM call', () => {
      it('should use LLM function when provided', async () => {
        const mockSummary = 'KEY DECISIONS: Use TypeScript\nFILES CHANGED: index.ts';
        const mockLLM = vi.fn().mockResolvedValue(mockSummary);

        setLLMSummarizeFn(mockLLM);

        const messages: Message[] = [
          createMessage('user', 'Let us use TypeScript'),
          createMessage('assistant', 'Good choice'),
          createMessage('user', 'Create index.ts'),
          createMessage('assistant', 'Done'),
          createMessage('user', 'Recent message 1'),
          createMessage('assistant', 'Recent response 1'),
        ];

        const { messages: compacted, result } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        expect(mockLLM).toHaveBeenCalledTimes(1);
        expect(mockLLM).toHaveBeenCalledWith(expect.stringContaining('KEY DECISIONS'));
        expect(mockLLM).toHaveBeenCalledWith(expect.stringContaining('Let us use TypeScript'));

        expect(result.summary).toBe(mockSummary);
        expect(compacted[0].content).toContain(mockSummary);
      });

      it('should truncate summary if exceeds max tokens', async () => {
        const longSummary = 'a'.repeat(20000); // Very long summary
        const mockLLM = vi.fn().mockResolvedValue(longSummary);

        setLLMSummarizeFn(mockLLM);

        const messages: Message[] = [
          createMessage('user', 'Message 1'),
          createMessage('assistant', 'Response 1'),
          createMessage('user', 'Message 2'),
          createMessage('assistant', 'Response 2'),
          createMessage('user', 'Message 3'),
          createMessage('assistant', 'Response 3'),
        ];

        const { result } = await compactConversation(messages, {
          preserveLastN: 2,
          summaryMaxTokens: 100, // 100 tokens = ~400 chars
        });

        // Summary should be truncated to ~400 chars + '...'
        expect(result.summary.length).toBeLessThanOrEqual(403);
        expect(result.summary.endsWith('...')).toBe(true);
      });
    });

    describe('fallback summary (no LLM)', () => {
      it('should create fallback summary without LLM', async () => {
        const messages: Message[] = [
          createMessage('user', 'Create file src/index.ts'),
          createMessage('assistant', 'I decided to use async/await'),
          createMessage('user', 'Fix the bug in utils.js'),
          createMessage('assistant', 'Done'),
          createMessage('user', 'Recent message'),
          createMessage('assistant', 'Recent response'),
        ];

        const { result } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        // Fallback summary should contain file mentions
        expect(result.summary).toContain('FILES MENTIONED');
        expect(result.summary).toMatch(/index\.ts|utils\.js/);

        // Should contain context about message count
        expect(result.summary).toContain('messages summarized');
      });

      it('should extract decisions from messages', async () => {
        const messages: Message[] = [
          createMessage('user', 'What should we do?'),
          createMessage('assistant', 'We decided to use React for the frontend'),
          createMessage('user', 'Confirmed, will proceed with that approach'),
          createMessage('assistant', 'Great'),
          createMessage('user', 'Recent'),
          createMessage('assistant', 'Response'),
        ];

        const { result } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        expect(result.summary).toContain('KEY POINTS');
      });
    });

    describe('edge cases', () => {
      it('should handle empty messages array', async () => {
        const { messages, result } = await compactConversation([]);

        expect(messages).toHaveLength(0);
        expect(result.originalMessages).toBe(0);
        expect(result.compactedMessages).toBe(0);
        expect(result.estimatedTokensSaved).toBe(0);
      });

      it('should handle null/undefined messages', async () => {
        const result1 = await compactConversation(null as unknown as Message[]);
        expect(result1.messages).toHaveLength(0);

        const result2 = await compactConversation(undefined as unknown as Message[]);
        expect(result2.messages).toHaveLength(0);
      });

      it('should handle only system messages', async () => {
        const messages: Message[] = [
          createMessage('system', 'System prompt 1'),
          createMessage('system', 'System prompt 2'),
        ];

        const { messages: compacted, result } = await compactConversation(messages, {
          preserveLastN: 4,
        });

        // System messages don't count towards preserveLastN, so no compaction
        expect(compacted).toHaveLength(2);
        expect(result.estimatedTokensSaved).toBe(0);
      });

      it('should report estimated tokens saved', async () => {
        const messages: Message[] = [
          createMessage('user', 'a'.repeat(1000)), // ~250 tokens
          createMessage('assistant', 'b'.repeat(1000)), // ~250 tokens
          createMessage('user', 'c'.repeat(100)), // ~25 tokens
          createMessage('assistant', 'd'.repeat(100)), // ~25 tokens
          createMessage('user', 'Recent 1'),
          createMessage('assistant', 'Recent 2'),
        ];

        const { result } = await compactConversation(messages, {
          preserveLastN: 2,
        });

        // Should save significant tokens
        expect(result.estimatedTokensSaved).toBeGreaterThan(0);
        expect(result.originalMessages).toBe(6);
        expect(result.compactedMessages).toBe(3); // summary + 2 preserved
      });
    });
  });

  describe('post-compaction headroom (80% target)', () => {
    it('should buy headroom so the very next turn does NOT re-trigger', async () => {
      // Mock summarizer returns a tiny summary so we can isolate the
      // "compact targets 80% of trigger budget" behaviour.
      const mockLLM = vi.fn().mockResolvedValue('S'); // 1 char -> ~1 token
      setLLMSummarizeFn(mockLLM);

      const maxContextTokens = 10_000;
      const reserveOutputTokens = 1_000;
      const threshold = 80;

      // Build a conversation that JUST crosses the trigger:
      //   triggerTokens = 10_000 - 1_000 = 9_000
      //   threshold     = 80% of 9_000   = 7_200
      // Each 4-char chunk = 1 content token + 4 overhead = 5 per message.
      // Use larger chunks so we can fit < 30 messages and compact something
      // meaningful.
      const head: Message[] = [];
      for (let i = 0; i < 30; i++) {
        // 1200 chars => 300 tokens + 4 overhead = 304 per message.
        // 30 * 304 = 9_120 tokens > 7_200 trigger.
        head.push(createMessage('user', 'a'.repeat(1200)));
      }

      // Sanity: pre-compaction, shouldCompact fires.
      expect(shouldCompact(head, maxContextTokens, { threshold, reserveOutputTokens })).toBe(true);

      // Compact.
      const { messages: compacted } = await compactConversation(head, {
        preserveLastN: 4,
        summaryMaxTokens: 200,
        maxContextTokens,
        reserveOutputTokens,
      });

      expect(mockLLM).toHaveBeenCalled();

      // Simulate the next turn: add one short user message after compaction.
      const nextTurn: Message[] = [...compacted, createMessage('user', 'one short follow-up')];

      // The whole point of the 80% target: shouldCompact must return false
      // immediately after compaction. Otherwise compaction runs every turn.
      expect(shouldCompact(nextTurn, maxContextTokens, { threshold, reserveOutputTokens })).toBe(
        false
      );
    });
  });

  describe('setLLMSummarizeFn / getLLMSummarizeFn', () => {
    it('should store and retrieve LLM function', () => {
      const mockFn = vi.fn();

      expect(getLLMSummarizeFn()).toBeNull();

      setLLMSummarizeFn(mockFn);
      expect(getLLMSummarizeFn()).toBe(mockFn);
    });
  });
});
