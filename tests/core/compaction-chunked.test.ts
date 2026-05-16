import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { Message } from '../../src/core/sessionManager.js';
import {
  chunkMessages,
  summarizeChunks,
  compactConversation,
  setLLMSummarizeFn,
  type LLMSummarizeFn,
} from '../../src/core/compaction.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

// Helper to create a message with approximately N tokens of content
function createMessageWithTokens(role: Message['role'], tokens: number): Message {
  // estimateTokens uses ~4 chars per token, minus 4 for overhead per message
  const contentTokens = Math.max(0, tokens - 4);
  const content = 'x'.repeat(contentTokens * 4);
  return createMessage(role, content);
}

describe('Chunked Compaction', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  afterEach(() => {
    // Reset global LLM function
    setLLMSummarizeFn((() => Promise.resolve('')) as LLMSummarizeFn);
  });

  describe('chunkMessages', () => {
    it('should return empty array for empty input', () => {
      const result = chunkMessages([], 1000);
      expect(result).toEqual([]);
    });

    it('should return single chunk when messages fit within limit', () => {
      const messages = [createMessage('user', 'Hello'), createMessage('assistant', 'Hi there')];

      const result = chunkMessages(messages, 1000);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(messages);
    });

    it('should split messages into multiple chunks when exceeding limit', () => {
      // Each message: ~100 tokens content + 4 overhead = 104 tokens
      const messages = [
        createMessageWithTokens('user', 104),
        createMessageWithTokens('assistant', 104),
        createMessageWithTokens('user', 104),
        createMessageWithTokens('assistant', 104),
      ];

      // Set limit to ~200 tokens so each chunk fits ~2 messages
      const result = chunkMessages(messages, 200);
      expect(result.length).toBeGreaterThan(1);

      // All messages should be accounted for
      const totalMessages = result.reduce((sum, chunk) => sum + chunk.length, 0);
      expect(totalMessages).toBe(4);
    });

    it('should never split a single message across chunks', () => {
      // One large message that exceeds maxTokens by itself
      const largeMessage = createMessageWithTokens('user', 500);
      const smallMessage = createMessage('assistant', 'ok');

      const result = chunkMessages([largeMessage, smallMessage], 100);

      // Large message should be in its own chunk
      expect(result.length).toBeGreaterThanOrEqual(1);
      // Verify each chunk contains complete messages
      for (const chunk of result) {
        for (const msg of chunk) {
          expect(msg.content).toBeDefined();
        }
      }
    });

    it('should handle boundary case - exactly at limit', () => {
      // Create messages that together are exactly at the limit
      const msg1 = createMessage('user', 'a'.repeat(96 * 4)); // 96 + 4 overhead = 100 tokens
      const msg2 = createMessage('assistant', 'b'.repeat(96 * 4)); // 100 tokens

      // Limit of 200 should fit both
      const result = chunkMessages([msg1, msg2], 200);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(2);
    });

    it('should start a new chunk when adding message would exceed limit', () => {
      const msg1 = createMessage('user', 'a'.repeat(96 * 4)); // 100 tokens
      const msg2 = createMessage('assistant', 'b'.repeat(96 * 4)); // 100 tokens
      const msg3 = createMessage('user', 'c'.repeat(96 * 4)); // 100 tokens

      // Limit of 199 means msg1+msg2 exceeds, so msg2 starts new chunk
      const result = chunkMessages([msg1, msg2, msg3], 199);
      expect(result.length).toBeGreaterThan(1);
    });
  });

  describe('summarizeChunks', () => {
    it('should return empty string for empty chunks', async () => {
      const mockFn = vi.fn();
      const result = await summarizeChunks([], mockFn);
      expect(result).toBe('');
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should return single chunk summary directly without combining', async () => {
      const mockFn = vi.fn().mockResolvedValue('Summary of chunk 1');
      const chunks = [[createMessage('user', 'Hello'), createMessage('assistant', 'Hi')]];

      const result = await summarizeChunks(chunks, mockFn);
      expect(result).toBe('Summary of chunk 1');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should summarize each chunk and combine multiple summaries', async () => {
      const mockFn = vi.fn();
      mockFn.mockResolvedValueOnce('Summary A');
      mockFn.mockResolvedValueOnce('Summary B');
      mockFn.mockResolvedValueOnce('Combined summary');

      const chunks = [
        [createMessage('user', 'Chunk 1 content')],
        [createMessage('user', 'Chunk 2 content')],
      ];

      const result = await summarizeChunks(chunks, mockFn);

      // Should call summarize for each chunk + 1 combine call
      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(result).toBe('Combined summary');

      // Verify the combine prompt mentions both summaries
      const combineCall = mockFn.mock.calls[2][0];
      expect(combineCall).toContain('Summary A');
      expect(combineCall).toContain('Summary B');
      expect(combineCall).toContain('Combine these conversation summaries');
    });

    it('should pass formatted messages to summarize function', async () => {
      const mockFn = vi.fn().mockResolvedValue('Test summary');
      const chunks = [[createMessage('user', 'Test message content')]];

      await summarizeChunks(chunks, mockFn);

      const prompt = mockFn.mock.calls[0][0];
      expect(prompt).toContain('Test message content');
      expect(prompt).toContain('[USER]');
    });
  });

  describe('compactConversation with chunking', () => {
    it('should use single call path when messages are within limit', async () => {
      const mockFn = vi.fn().mockResolvedValue('Short summary');
      setLLMSummarizeFn(mockFn);

      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Message 3'),
        createMessage('assistant', 'Response 3'),
      ];

      const result = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 80000,
      });

      // Should only be called once (single-call path, no chunking)
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result.result.summary).toBe('Short summary');
    });

    it('should use chunked path when messages exceed maxChunkTokens', async () => {
      const mockFn = vi.fn().mockImplementation((prompt: string) => {
        if (prompt.includes('Combine these conversation summaries')) {
          return Promise.resolve('Final combined summary');
        }
        return Promise.resolve('Chunk summary');
      });
      setLLMSummarizeFn(mockFn);

      // Create messages that exceed a low maxChunkTokens
      const messages: Message[] = [
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessage('user', 'Recent 1'),
        createMessage('assistant', 'Recent 2'),
      ];

      const result = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 100, // Very low to force chunking
      });

      // Should call summarize multiple times (chunk summaries + combine)
      expect(mockFn.mock.calls.length).toBeGreaterThan(1);
      expect(result.result.summary).toBe('Final combined summary');
    });

    it('should respect maxChunkTokens override in options', async () => {
      const mockFn = vi.fn().mockResolvedValue('Summary');
      setLLMSummarizeFn(mockFn);

      const messages: Message[] = [
        createMessageWithTokens('user', 50),
        createMessageWithTokens('assistant', 50),
        createMessageWithTokens('user', 50),
        createMessageWithTokens('assistant', 50),
        createMessage('user', 'keep 1'),
        createMessage('assistant', 'keep 2'),
      ];

      // With high maxChunkTokens, should use single call
      await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 100000,
      });
      expect(mockFn).toHaveBeenCalledTimes(1);

      mockFn.mockClear();
      mockFn.mockResolvedValueOnce('Chunk summary 1');
      mockFn.mockResolvedValueOnce('Chunk summary 2');
      mockFn.mockResolvedValueOnce('Combined');

      // With low maxChunkTokens, should use chunked path
      await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 50, // Very low to force chunking
      });
      expect(mockFn.mock.calls.length).toBeGreaterThan(1);
    });

    it('should preserve existing behavior when no LLM function is set', async () => {
      // Reset to no LLM function
      setLLMSummarizeFn(null as unknown as LLMSummarizeFn);

      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Message 3'),
        createMessage('assistant', 'Response 3'),
      ];

      // This should use fallback summary, not throw
      const result = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 10, // Low value should not matter without LLM fn
      });

      expect(result.result.summary).toBeDefined();
      expect(result.result.summary.length).toBeGreaterThan(0);
    });

    it('should keep last N messages intact with chunked compaction', async () => {
      const mockFn = vi.fn().mockResolvedValue('Summary');
      setLLMSummarizeFn(mockFn);

      const messages: Message[] = [
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessage('user', 'Keep this message'),
        createMessage('assistant', 'Keep this response'),
      ];

      const result = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 100,
      });

      // Last 2 messages should be preserved
      const compactedMessages = result.messages;
      const lastTwo = compactedMessages.slice(-2);
      expect(lastTwo[0].content).toBe('Keep this message');
      expect(lastTwo[1].content).toBe('Keep this response');
    });

    it('should include summary message in compacted output', async () => {
      const mockFn = vi.fn().mockResolvedValue('Chunked summary content');
      setLLMSummarizeFn(mockFn);

      const messages: Message[] = [
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessageWithTokens('user', 60),
        createMessageWithTokens('assistant', 60),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Recent reply'),
      ];

      const result = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 100,
      });

      // Should contain a system message with the summary
      const summaryMsg = result.messages.find(
        (m) => m.role === 'system' && m.content.includes('[CONVERSATION SUMMARY]')
      );
      expect(summaryMsg).toBeDefined();
    });
  });
});
