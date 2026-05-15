import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  estimateMessagesTokens,
  compactConversation,
  setLLMSummarizeFn,
  splitIntoChunks,
  summarizeChunked,
  type LLMSummarizeFn,
} from '../../src/core/compaction.js';
import type { Message } from '../../src/core/sessionManager.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string, timestamp?: number): Message {
  return {
    role,
    content,
    timestamp: timestamp ?? Date.now(),
  };
}

// Helper to create messages that total a specific approximate token count
function createLargeMessages(count: number, tokensPerMessage: number): Message[] {
  const charsPerMessage = tokensPerMessage * 4; // ~4 chars per token
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    messages.push(createMessage(i % 2 === 0 ? 'user' : 'assistant', 'x'.repeat(charsPerMessage)));
  }
  return messages;
}

describe('Chunked Compaction - src/core/compaction.ts', () => {
  beforeEach(() => {
    setLLMSummarizeFn(null as unknown as LLMSummarizeFn);
  });

  describe('splitIntoChunks', () => {
    it('should return empty array for empty messages', () => {
      expect(splitIntoChunks([], 1000)).toEqual([]);
    });

    it('should return single chunk when messages fit within limit', () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi there'),
      ];

      const chunks = splitIntoChunks(messages, 1000);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(2);
    });

    it('should split messages into multiple chunks when exceeding limit', () => {
      // Each message ~254 tokens (1000 chars / 4 + 4 overhead)
      const messages = createLargeMessages(4, 250);

      // With a limit of 300 tokens, each message (254 tokens) should be in its own chunk
      const chunks = splitIntoChunks(messages, 300);
      expect(chunks.length).toBeGreaterThan(1);
    });

    it('should never split mid-message', () => {
      // One very large message that exceeds the chunk limit by itself
      const messages: Message[] = [
        createMessage('user', 'x'.repeat(4000)), // ~1000 tokens
        createMessage('assistant', 'y'.repeat(4000)), // ~1000 tokens
      ];

      // Limit is 500, but each message is 1000 tokens - still no mid-message split
      const chunks = splitIntoChunks(messages, 500);
      // Each message should be its own chunk since it exceeds the limit
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(1);
      expect(chunks[1]).toHaveLength(1);
    });

    it('should group small messages together within chunk limit', () => {
      const messages: Message[] = [
        createMessage('user', 'Hi'), // ~5 tokens
        createMessage('assistant', 'Hello'), // ~6 tokens
        createMessage('user', 'How are you?'), // ~7 tokens
        createMessage('assistant', 'Good thanks'), // ~7 tokens
      ];

      // All fit within 100 tokens
      const chunks = splitIntoChunks(messages, 100);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(4);
    });

    it('should respect message boundaries exactly', () => {
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(100)), // 25 + 4 = 29 tokens
        createMessage('assistant', 'b'.repeat(100)), // 25 + 4 = 29 tokens
        createMessage('user', 'c'.repeat(100)), // 25 + 4 = 29 tokens
        createMessage('assistant', 'd'.repeat(100)), // 25 + 4 = 29 tokens
      ];

      // With 60 token limit, each pair fits (~58 tokens) but 3 don't (87 tokens)
      const chunks = splitIntoChunks(messages, 60);
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(2);
      expect(chunks[1]).toHaveLength(2);
    });
  });

  describe('summarizeChunked', () => {
    it('should call summarize once for single chunk', async () => {
      const mockLLM = vi.fn().mockResolvedValue('Summary of chunk');
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi there'),
      ];

      const result = await summarizeChunked(messages, 10000, mockLLM);
      expect(mockLLM).toHaveBeenCalledTimes(1);
      expect(result).toBe('Summary of chunk');
    });

    it('should call summarize for each chunk and merge', async () => {
      const mockLLM = vi.fn().mockResolvedValueOnce('Summary 1').mockResolvedValueOnce('Summary 2');

      // Create messages that will require 2 chunks with a low limit
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)), // ~100 tokens + 4 = 104
        createMessage('assistant', 'b'.repeat(400)), // ~100 tokens + 4 = 104
      ];

      // With 110 token limit, each message goes in its own chunk
      const result = await summarizeChunked(messages, 110, mockLLM);
      expect(mockLLM).toHaveBeenCalledTimes(2);
      expect(result).toContain('Summary 1');
      expect(result).toContain('---');
      expect(result).toContain('Summary 2');
    });

    it('should recursively summarize when merged summaries exceed limit', async () => {
      // Each chunk produces a large summary that exceeds the chunk limit
      const largeSummary = 'x'.repeat(2000); // ~500 tokens
      const mockLLM = vi
        .fn()
        .mockResolvedValueOnce(largeSummary)
        .mockResolvedValueOnce(largeSummary)
        .mockResolvedValueOnce('Final merged summary');

      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)), // ~104 tokens
        createMessage('assistant', 'b'.repeat(400)), // ~104 tokens
      ];

      // limit of 110 triggers 2 chunks, merged summaries are ~1000+ tokens > 110
      const result = await summarizeChunked(messages, 110, mockLLM);
      // 3rd call is for the recursive summarization
      expect(mockLLM).toHaveBeenCalledTimes(3);
      expect(result).toBe('Final merged summary');
    });

    it('should return empty string for empty messages', async () => {
      const mockLLM = vi.fn();
      const result = await summarizeChunked([], 1000, mockLLM);
      expect(result).toBe('');
      expect(mockLLM).not.toHaveBeenCalled();
    });
  });

  describe('compactConversation with chunking', () => {
    it('should use chunking when messages exceed maxChunkTokens', async () => {
      const mockLLM = vi
        .fn()
        .mockResolvedValueOnce('Chunk 1 summary')
        .mockResolvedValueOnce('Chunk 2 summary');

      setLLMSummarizeFn(mockLLM);

      // Create messages that total well over maxChunkTokens
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)), // ~104 tokens
        createMessage('assistant', 'b'.repeat(400)), // ~104 tokens
        createMessage('user', 'c'.repeat(400)), // ~104 tokens
        createMessage('assistant', 'd'.repeat(400)), // ~104 tokens
        createMessage('user', 'Recent 1'), // preserved
        createMessage('assistant', 'Recent 2'), // preserved
      ];

      const { messages: compacted, result } = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 120, // Low limit to trigger chunking
      });

      // Should have called LLM multiple times (chunked)
      expect(mockLLM.mock.calls.length).toBeGreaterThanOrEqual(2);
      expect(result.originalMessages).toBe(6);
      expect(result.compactedMessages).toBe(3); // summary + 2 preserved
      expect(compacted[compacted.length - 2].content).toBe('Recent 1');
      expect(compacted[compacted.length - 1].content).toBe('Recent 2');
    });

    it('should NOT use chunking when messages are below maxChunkTokens', async () => {
      const mockLLM = vi.fn().mockResolvedValue('Simple summary');
      setLLMSummarizeFn(mockLLM);

      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
        createMessage('user', 'How are you?'),
        createMessage('assistant', 'Good'),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      const { result } = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 80000, // High limit - no chunking needed
      });

      // Should have called LLM exactly once (no chunking)
      expect(mockLLM).toHaveBeenCalledTimes(1);
      expect(result.summary).toBe('Simple summary');
    });

    it('should use default maxChunkTokens of 80000 when not specified', async () => {
      const mockLLM = vi.fn().mockResolvedValue('Summary');
      setLLMSummarizeFn(mockLLM);

      // Small messages - won't exceed 80000 default
      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      await compactConversation(messages, { preserveLastN: 2 });

      // Should call LLM once since messages are small (no chunking)
      expect(mockLLM).toHaveBeenCalledTimes(1);
    });

    it('should not affect fallback summary (no LLM) behavior', async () => {
      // No LLM set - should use fallback summary regardless of maxChunkTokens
      const messages: Message[] = [
        createMessage('user', 'Create file src/index.ts'),
        createMessage('assistant', 'Done'),
        createMessage('user', 'Fix utils.js'),
        createMessage('assistant', 'Fixed'),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      const { result } = await compactConversation(messages, {
        preserveLastN: 2,
        maxChunkTokens: 10, // Very low - but no LLM so chunking not used
      });

      // Fallback summary should still work
      expect(result.summary).toContain('FILES MENTIONED');
    });
  });

  describe('estimateMessagesTokens integration', () => {
    it('should correctly estimate tokens for chunking decisions', () => {
      const messages = createLargeMessages(10, 10000); // 10 messages, ~10000 tokens each
      const totalTokens = estimateMessagesTokens(messages);

      // Should be approximately 10 * (10000 + 4) = 100040
      expect(totalTokens).toBeGreaterThan(90000);
      expect(totalTokens).toBeLessThan(110000);
    });

    it('should correctly estimate small payloads as below threshold', () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
      ];
      const totalTokens = estimateMessagesTokens(messages);
      expect(totalTokens).toBeLessThan(80000);
    });
  });
});
