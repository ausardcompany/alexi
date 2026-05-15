import { describe, it, expect, vi } from 'vitest';
import {
  CompactionManager,
  splitIntoChunks,
  estimateTokens,
  estimateConversationTokens,
  type Message,
  type SummarizeFn,
} from '../../src/compaction/index.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string, timestamp?: number): Message {
  return {
    role,
    content,
    timestamp: timestamp ?? Date.now(),
  };
}

// Helper to create messages that total a specific approximate token count
function createLargeMessages(count: number, charsPerMessage: number): Message[] {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    messages.push(createMessage(i % 2 === 0 ? 'user' : 'assistant', 'x'.repeat(charsPerMessage)));
  }
  return messages;
}

describe('Chunked Compaction - src/compaction/index.ts', () => {
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

    it('should split into multiple chunks when exceeding limit', () => {
      // Each message is ~100 tokens from content + 4 overhead
      const messages = createLargeMessages(4, 400);

      // With a limit that fits ~1 message, we should get 4 chunks
      const tokensPerMessage = estimateTokens('x'.repeat(400)) + 4;
      const chunks = splitIntoChunks(messages, tokensPerMessage + 1);
      // Each chunk should contain exactly 1 message
      expect(chunks).toHaveLength(4);
      for (const chunk of chunks) {
        expect(chunk).toHaveLength(1);
      }
    });

    it('should never split mid-message', () => {
      // Create a single message that exceeds the chunk limit
      const messages: Message[] = [
        createMessage('user', 'x'.repeat(10000)), // very large single message
      ];

      // Even with a tiny limit, the message stays in one chunk
      const chunks = splitIntoChunks(messages, 10);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(1);
      expect(chunks[0][0].content).toBe('x'.repeat(10000));
    });

    it('should group small messages together within limit', () => {
      const messages: Message[] = [
        createMessage('user', 'Hi'), // ~5 tokens
        createMessage('assistant', 'Hello'), // ~6 tokens
        createMessage('user', 'How are you?'), // ~7 tokens
      ];

      const chunks = splitIntoChunks(messages, 100);
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toHaveLength(3);
    });

    it('should respect message boundaries', () => {
      // estimateTokens for 'a'.repeat(100): Math.ceil((1*1.3 + 100/4)/2) = 14 tokens + 4 overhead = 18
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(100)), // 18 tokens
        createMessage('assistant', 'b'.repeat(100)), // 18 tokens
        createMessage('user', 'c'.repeat(100)), // 18 tokens
        createMessage('assistant', 'd'.repeat(100)), // 18 tokens
      ];

      // With 37 token limit, pairs fit (36) but triples don't (54)
      const chunks = splitIntoChunks(messages, 37);
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(2);
      expect(chunks[1]).toHaveLength(2);
    });
  });

  describe('CompactionManager with oversized payload', () => {
    it('should trigger chunking for oversized payloads in summarize strategy', async () => {
      const mockSummarizeFn: SummarizeFn = vi
        .fn()
        .mockResolvedValueOnce('Chunk 1 summary')
        .mockResolvedValueOnce('Chunk 2 summary');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      // Create messages that exceed maxChunkTokens
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)), // ~104 tokens
        createMessage('assistant', 'b'.repeat(400)), // ~104 tokens
        createMessage('user', 'c'.repeat(400)), // ~104 tokens
        createMessage('assistant', 'd'.repeat(400)), // ~104 tokens
        createMessage('user', 'Recent 1'),
        createMessage('assistant', 'Recent 2'),
      ];

      const result = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        maxChunkTokens: 120, // Low limit triggers chunking
      });

      expect(result.success).toBe(true);
      // Should have called summarize multiple times (chunked)
      expect(
        (mockSummarizeFn as ReturnType<typeof vi.fn>).mock.calls.length
      ).toBeGreaterThanOrEqual(2);
      expect(result.summary).toContain('Chunk 1 summary');
      expect(result.summary).toContain('Chunk 2 summary');
      expect(result.removedMessages).toBe(4);
    });

    it('should trigger chunking for oversized payloads in smart strategy', async () => {
      const mockSummarizeFn: SummarizeFn = vi
        .fn()
        .mockResolvedValueOnce('Smart chunk 1')
        .mockResolvedValueOnce('Smart chunk 2');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      // Create messages that exceed maxChunkTokens - use generic content
      // so they don't match IMPORTANCE_PATTERNS and get classified as unimportant
      const messages: Message[] = [
        createMessage('user', 'a'.repeat(400)),
        createMessage('assistant', 'b'.repeat(400)),
        createMessage('user', 'c'.repeat(400)),
        createMessage('assistant', 'd'.repeat(400)),
        createMessage('user', 'Recent 1'),
        createMessage('assistant', 'Recent 2'),
      ];

      const result = await manager.compact(messages, {
        strategy: 'smart',
        preserveRecent: 2,
        maxChunkTokens: 120, // Low limit triggers chunking
      });

      expect(result.success).toBe(true);
      // Should have called summarize with chunking
      expect(
        (mockSummarizeFn as ReturnType<typeof vi.fn>).mock.calls.length
      ).toBeGreaterThanOrEqual(2);
    });

    it('should NOT trigger chunking when payload is below maxChunkTokens', async () => {
      const mockSummarizeFn: SummarizeFn = vi.fn().mockResolvedValue('Simple summary');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
        createMessage('user', 'How are you?'),
        createMessage('assistant', 'Good'),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      const result = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        maxChunkTokens: 80000, // High limit - no chunking
      });

      expect(result.success).toBe(true);
      // Should call summarize exactly once (no chunking)
      expect(mockSummarizeFn).toHaveBeenCalledTimes(1);
      expect(result.summary).toBe('Simple summary');
    });

    it('should use default maxChunkTokens of 80000', async () => {
      const mockSummarizeFn: SummarizeFn = vi.fn().mockResolvedValue('Summary');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      // Small messages won't exceed 80000 default
      const messages: Message[] = [
        createMessage('user', 'Message 1'),
        createMessage('assistant', 'Response 1'),
        createMessage('user', 'Message 2'),
        createMessage('assistant', 'Response 2'),
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      const result = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
      });

      expect(result.success).toBe(true);
      // Should call once (no chunking since messages are small)
      expect(mockSummarizeFn).toHaveBeenCalledTimes(1);
    });

    it('should handle recursive summarization when merged summaries exceed limit', async () => {
      // Each chunk produces a large summary, forcing recursive summarization
      const largeSummary = 'x'.repeat(2000); // large enough to exceed chunk limit
      const mockSummarizeFn: SummarizeFn = vi
        .fn()
        .mockResolvedValueOnce(largeSummary)
        .mockResolvedValueOnce(largeSummary)
        .mockResolvedValueOnce('Final merged summary');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      // Use larger messages that clearly exceed limit per message
      const messages: Message[] = [
        createMessage('user', 'a '.repeat(200)), // word-heavy for higher token estimate
        createMessage('assistant', 'b '.repeat(200)), // word-heavy
        createMessage('user', 'Recent'),
        createMessage('assistant', 'Response'),
      ];

      // Calculate the actual token count per message to choose correct limit
      const perMsgTokens = estimateTokens('a '.repeat(200)) + 4;

      const result = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        maxChunkTokens: perMsgTokens + 1, // Forces each message into its own chunk
      });

      expect(result.success).toBe(true);
      // Should have been called 3 times: 2 chunks + 1 recursive merge
      expect(mockSummarizeFn).toHaveBeenCalledTimes(3);
      expect(result.summary).toBe('Final merged summary');
    });

    it('should chunk boundaries respect message boundaries', () => {
      // Verify that no chunk starts or ends in the middle of a message
      const messages: Message[] = [
        createMessage('user', 'First message content'),
        createMessage('assistant', 'Second message content'),
        createMessage('user', 'Third message content'),
        createMessage('assistant', 'Fourth message content'),
      ];

      const chunks = splitIntoChunks(messages, 30); // Very small limit

      for (const chunk of chunks) {
        for (const msg of chunk) {
          // Each message should be a complete Message object
          expect(msg).toHaveProperty('role');
          expect(msg).toHaveProperty('content');
          expect(msg).toHaveProperty('timestamp');
          // Content should be the complete original content
          expect([
            'First message content',
            'Second message content',
            'Third message content',
            'Fourth message content',
          ]).toContain(msg.content);
        }
      }
    });
  });

  describe('CompactionManager.summarize with chunking', () => {
    it('should use chunked summarization for large message sets', async () => {
      const mockSummarizeFn: SummarizeFn = vi
        .fn()
        .mockResolvedValueOnce('Part 1')
        .mockResolvedValueOnce('Part 2');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      // Create messages with word-separated content for higher token estimates
      const messages: Message[] = [
        createMessage('user', 'a '.repeat(200)), // word-heavy for higher token count
        createMessage('assistant', 'b '.repeat(200)), // word-heavy
      ];

      // Use a limit that is less than the total tokens of both messages
      const perMsgTokens = estimateTokens('a '.repeat(200)) + 4;
      const totalTokens = estimateConversationTokens(messages);

      // maxChunkTokens just above a single message but below total
      const result = await manager.summarize(messages, perMsgTokens + 1);

      // Should use chunked path since total tokens > perMsgTokens + 1
      expect(totalTokens).toBeGreaterThan(perMsgTokens + 1);
      expect(
        (mockSummarizeFn as ReturnType<typeof vi.fn>).mock.calls.length
      ).toBeGreaterThanOrEqual(2);
      expect(result).toContain('Part 1');
      expect(result).toContain('Part 2');
    });

    it('should use single-pass summarization for small message sets', async () => {
      const mockSummarizeFn: SummarizeFn = vi.fn().mockResolvedValue('Simple summary');

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
      ];

      const result = await manager.summarize(messages, 80000);

      expect(mockSummarizeFn).toHaveBeenCalledTimes(1);
      expect(result).toBe('Simple summary');
    });

    it('should throw when summarizeFn not configured', async () => {
      const manager = new CompactionManager();

      await expect(manager.summarize([createMessage('user', 'Hello')])).rejects.toThrow(
        'Summarization function not configured'
      );
    });
  });

  describe('estimateTokens and estimateConversationTokens', () => {
    it('should estimate tokens for content', () => {
      const tokens = estimateTokens('Hello world');
      expect(tokens).toBeGreaterThan(0);
    });

    it('should return 0 for empty content', () => {
      expect(estimateTokens('')).toBe(0);
    });

    it('should estimate conversation tokens', () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
      ];

      const tokens = estimateConversationTokens(messages);
      expect(tokens).toBeGreaterThan(0);
    });

    it('should return 0 for empty conversation', () => {
      expect(estimateConversationTokens([])).toBe(0);
    });
  });
});
